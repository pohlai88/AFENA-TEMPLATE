import { and, eq, priceLists, priceListItems, discountRules, sql } from 'afena-database';
import { desc, asc } from 'drizzle-orm';

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

/**
 * Resolved price for a product.
 */
export interface ResolvedPrice {
  priceMinor: number;
  priceListId: string;
  priceListCode: string;
  currencyCode: string;
  source: 'customer' | 'price_list' | 'default';
}

/**
 * Applied discount on a line.
 */
export interface AppliedDiscount {
  ruleId: string;
  code: string;
  discountType: 'percentage' | 'fixed_amount' | 'buy_x_get_y';
  discountValue: number;
  discountMinor: number;
  stackable: boolean;
}

/**
 * Full pricing result for a line item.
 */
export interface LinePricingResult {
  unitPriceMinor: number;
  qty: number;
  subtotalMinor: number;
  discounts: AppliedDiscount[];
  totalDiscountMinor: number;
  netMinor: number;
  priceSource: ResolvedPrice;
}

/**
 * Resolve the unit price for a product.
 *
 * PRD G0.16 — Resolution order:
 * 1. Customer-specific price list item (if customerId provided)
 * 2. Active price list item matching product (by effective date, qty tier)
 * 3. Default price list item
 *
 * @param db - Database handle
 * @param orgId - Tenant org ID
 * @param productId - Product UUID
 * @param qty - Quantity (for tier-based pricing)
 * @param asOfDate - Document date for effective date filtering
 * @param customerId - Optional customer for customer-specific pricing
 */
export async function resolvePrice(
  db: NeonHttpDatabase,
  orgId: string,
  productId: string,
  qty: number,
  asOfDate: string | Date,
  _customerId?: string,
): Promise<ResolvedPrice | null> {
  const dateStr = typeof asOfDate === 'string'
    ? asOfDate
    : asOfDate.toISOString().slice(0, 10);

  // Build base query: active price lists with effective date range
  const basePriceListFilter = and(
    eq(priceLists.orgId, orgId),
    eq(priceLists.isActive, true),
    sql`(${priceLists.effectiveFrom} IS NULL OR ${priceLists.effectiveFrom} <= ${dateStr}::date)`,
    sql`(${priceLists.effectiveTo} IS NULL OR ${priceLists.effectiveTo} >= ${dateStr}::date)`,
  );

  // Strategy 1: Customer-specific price list (if customerId provided)
  // Customer price lists would be linked via a customer_id on price_list or via metadata
  // For now, we fall through to general price lists

  // Strategy 2: Find best matching price list item
  const rows = await (db as any)
    .select({
      priceMinor: priceListItems.priceMinor,
      priceListId: priceLists.id,
      priceListCode: priceLists.code,
      currencyCode: priceLists.currencyCode,
      isDefault: priceLists.isDefault,
      minQty: priceListItems.minQty,
    })
    .from(priceListItems)
    .innerJoin(priceLists, eq(priceListItems.priceListId, priceLists.id))
    .where(
      and(
        basePriceListFilter,
        eq(priceListItems.orgId, orgId),
        eq(priceListItems.productId, productId),
        sql`${priceListItems.minQty} <= ${qty}`,
      ),
    )
    .orderBy(
      // Prefer non-default (specific) over default, then highest qty tier
      asc(priceLists.isDefault),
      desc(priceListItems.minQty),
    )
    .limit(1);

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    priceMinor: Number(row.priceMinor),
    priceListId: row.priceListId,
    priceListCode: row.priceListCode,
    currencyCode: row.currencyCode,
    source: row.isDefault ? 'default' : 'price_list',
  };
}

/**
 * Evaluate applicable discount rules for a line.
 *
 * PRD G0.16 — Discount stacking:
 * - Rules ordered by precedence (lower = higher priority)
 * - Non-stackable rules: only the highest-priority rule applies
 * - Stackable rules: compound on top of each other
 * - Time-bounded by effective_from/effective_to
 *
 * @param db - Database handle
 * @param orgId - Tenant org ID
 * @param amountMinor - Line subtotal in minor units
 * @param asOfDate - Document date
 * @param productId - Optional product filter
 * @param customerId - Optional customer filter
 */
export async function evaluateDiscounts(
  db: NeonHttpDatabase,
  orgId: string,
  amountMinor: number,
  asOfDate: string | Date,
  productId?: string,
  customerId?: string,
): Promise<AppliedDiscount[]> {
  const dateStr = typeof asOfDate === 'string'
    ? asOfDate
    : asOfDate.toISOString().slice(0, 10);

  // Find all active, effective discount rules matching scope
  const scopeConditions = [
    eq(discountRules.orgId, orgId),
    eq(discountRules.isActive, true),
    sql`(${discountRules.effectiveFrom} IS NULL OR ${discountRules.effectiveFrom} <= ${dateStr}::date)`,
    sql`(${discountRules.effectiveTo} IS NULL OR ${discountRules.effectiveTo} >= ${dateStr}::date)`,
  ];

  // Scope matching: global always applies, customer/product if matched
  const rows = await (db as any)
    .select({
      id: discountRules.id,
      code: discountRules.code,
      discountType: discountRules.discountType,
      discountValue: discountRules.discountValue,
      scope: discountRules.scope,
      customerId: discountRules.customerId,
      productId: discountRules.productId,
      precedence: discountRules.precedence,
      stackable: discountRules.stackable,
    })
    .from(discountRules)
    .where(and(...scopeConditions))
    .orderBy(asc(discountRules.precedence));

  type DiscountRuleRow = {
    id: string;
    code: string;
    discountType: string;
    discountValue: string;
    stackable: boolean;
    scope?: string;
    customerId?: string;
    productId?: string;
  };
  const applicable = rows.filter((r: DiscountRuleRow) => {
    if (r.scope === 'global') return true;
    if (r.scope === 'customer' && r.customerId === customerId) return true;
    if (r.scope === 'product' && r.productId === productId) return true;
    return false;
  });

  if (applicable.length === 0) return [];

  type DiscountType = AppliedDiscount['discountType'];
  // Apply discount stacking logic
  const result: AppliedDiscount[] = [];
  let runningAmount = amountMinor;
  let foundNonStackable = false;

  for (const rule of applicable) {
    if (foundNonStackable && !rule.stackable) continue;

    const discountType = rule.discountType as DiscountType;
    const discountValueNum = parseFloat(String(rule.discountValue));
    const discountMinor = calculateDiscountAmount(
      runningAmount,
      discountType,
      discountValueNum,
    );

    result.push({
      ruleId: String(rule.id),
      code: String(rule.code),
      discountType,
      discountValue: discountValueNum,
      discountMinor,
      stackable: Boolean(rule.stackable),
    });

    if (rule.stackable) {
      // Stackable: compound — reduce running amount for next rule
      runningAmount -= discountMinor;
    } else {
      foundNonStackable = true;
    }
  }

  return result;
}

/**
 * Calculate discount amount in minor units.
 */
function calculateDiscountAmount(
  amountMinor: number,
  discountType: string,
  discountValue: number,
): number {
  switch (discountType) {
    case 'percentage':
      return Math.round(amountMinor * (discountValue / 100));
    case 'fixed_amount':
      return Math.min(Math.round(discountValue), amountMinor);
    default:
      return 0;
  }
}

/**
 * Full line pricing: resolve price + apply discounts.
 *
 * Convenience function that combines resolvePrice + evaluateDiscounts.
 */
export async function priceLineItem(
  db: NeonHttpDatabase,
  orgId: string,
  productId: string,
  qty: number,
  asOfDate: string | Date,
  customerId?: string,
): Promise<LinePricingResult | null> {
  const price = await resolvePrice(db, orgId, productId, qty, asOfDate, customerId);
  if (!price) return null;

  const subtotalMinor = price.priceMinor * qty;
  const discounts = await evaluateDiscounts(
    db,
    orgId,
    subtotalMinor,
    asOfDate,
    productId,
    customerId,
  );

  const totalDiscountMinor = discounts.reduce((sum, d) => sum + d.discountMinor, 0);
  const netMinor = subtotalMinor - totalDiscountMinor;

  return {
    unitPriceMinor: price.priceMinor,
    qty,
    subtotalMinor,
    discounts,
    totalDiscountMinor,
    netMinor: Math.max(0, netMinor),
    priceSource: price,
  };
}
