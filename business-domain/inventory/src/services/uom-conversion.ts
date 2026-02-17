import { and, eq, uomConversions, sql } from 'afenda-database';

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

/**
 * Resolved UOM conversion factor.
 */
export interface ResolvedConversion {
  fromUomId: string;
  toUomId: string;
  factor: number;
  roundingMethod: string;
  roundingPrecision: number;
  scope: 'global' | 'product';
}

/**
 * UOM conversion result.
 */
export interface ConversionResult {
  fromQty: number;
  toQty: number;
  factor: number;
  roundingMethod: string;
}

/**
 * Resolve the conversion factor between two UOMs.
 *
 * PRD G0.15 + Phase E #25:
 * - Product-specific overrides take precedence over global conversions
 * - Returns null if no conversion path exists
 *
 * @param db - Database handle
 * @param orgId - Tenant org ID
 * @param fromUomId - Source UOM UUID
 * @param toUomId - Target UOM UUID
 * @param productId - Optional product for product-specific overrides
 */
export async function resolveConversion(
  db: NeonHttpDatabase,
  orgId: string,
  fromUomId: string,
  toUomId: string,
  productId?: string,
): Promise<ResolvedConversion | null> {
  // Same UOM — identity conversion
  if (fromUomId === toUomId) {
    return {
      fromUomId,
      toUomId,
      factor: 1,
      roundingMethod: 'half_up',
      roundingPrecision: 6,
      scope: 'global',
    };
  }

  // Try product-specific first, then global
  const rows = await (db as any)
    .select({
      fromUomId: uomConversions.fromUomId,
      toUomId: uomConversions.toUomId,
      factor: uomConversions.factor,
      roundingMethod: uomConversions.roundingMethod,
      roundingPrecision: uomConversions.roundingPrecision,
      scope: uomConversions.scope,
    })
    .from(uomConversions)
    .where(
      and(
        eq(uomConversions.orgId, orgId),
        eq(uomConversions.fromUomId, fromUomId),
        eq(uomConversions.toUomId, toUomId),
        productId
          ? sql`(${uomConversions.productId} = ${productId} OR ${uomConversions.productId} IS NULL)`
          : sql`${uomConversions.productId} IS NULL`,
      ),
    )
    .orderBy(
      // Product-specific first (scope='product'), then global
      sql`CASE WHEN ${uomConversions.scope} = 'product' THEN 0 ELSE 1 END`,
    )
    .limit(1);

  if (rows.length === 0) {
    // Try reverse direction: to→from with inverted factor
    const reverseRows = await (db as any)
      .select({
        fromUomId: uomConversions.fromUomId,
        toUomId: uomConversions.toUomId,
        factor: uomConversions.factor,
        roundingMethod: uomConversions.roundingMethod,
        roundingPrecision: uomConversions.roundingPrecision,
        scope: uomConversions.scope,
      })
      .from(uomConversions)
      .where(
        and(
          eq(uomConversions.orgId, orgId),
          eq(uomConversions.fromUomId, toUomId),
          eq(uomConversions.toUomId, fromUomId),
          productId
            ? sql`(${uomConversions.productId} = ${productId} OR ${uomConversions.productId} IS NULL)`
            : sql`${uomConversions.productId} IS NULL`,
        ),
      )
      .orderBy(
        sql`CASE WHEN ${uomConversions.scope} = 'product' THEN 0 ELSE 1 END`,
      )
      .limit(1);

    if (reverseRows.length === 0) return null;

    const rev = reverseRows[0];
    return {
      fromUomId,
      toUomId,
      factor: 1 / parseFloat(String(rev.factor)),
      roundingMethod: String(rev.roundingMethod),
      roundingPrecision: Number(rev.roundingPrecision),
      scope: rev.scope === 'product' ? 'product' : 'global',
    };
  }

  const row = rows[0];
  return {
    fromUomId: String(row.fromUomId),
    toUomId: String(row.toUomId),
    factor: parseFloat(String(row.factor)),
    roundingMethod: String(row.roundingMethod),
    roundingPrecision: Number(row.roundingPrecision),
    scope: row.scope === 'product' ? 'product' : 'global',
  };
}

/**
 * Convert a quantity from one UOM to another with deterministic rounding.
 *
 * PRD G0.15: Deterministic rounding — same input always produces same output.
 *
 * @param qty - Source quantity
 * @param factor - Conversion factor (multiply source by factor)
 * @param roundingMethod - Rounding method
 * @param precision - Decimal places to round to
 */
export function convertQuantity(
  qty: number,
  factor: number,
  roundingMethod: string = 'half_up',
  precision: number = 6,
): number {
  const raw = qty * factor;
  const multiplier = Math.pow(10, precision);
  const shifted = raw * multiplier;

  let rounded: number;
  switch (roundingMethod) {
    case 'ceil':
      rounded = Math.ceil(shifted);
      break;
    case 'floor':
      rounded = Math.floor(shifted);
      break;
    case 'half_down':
      rounded = Math.sign(shifted) * Math.floor(Math.abs(shifted) + 0.5 - Number.EPSILON);
      break;
    case 'banker': {
      const r = Math.round(shifted);
      if (Math.abs(shifted - Math.floor(shifted) - 0.5) < Number.EPSILON) {
        rounded = Math.floor(shifted) % 2 === 0 ? Math.floor(shifted) : Math.ceil(shifted);
      } else {
        rounded = r;
      }
      break;
    }
    case 'half_up':
    default:
      rounded = Math.round(shifted);
      break;
  }

  return rounded / multiplier;
}

/**
 * Resolve conversion and convert quantity in one call.
 *
 * @param db - Database handle
 * @param orgId - Tenant org ID
 * @param fromUomId - Source UOM
 * @param toUomId - Target UOM
 * @param qty - Source quantity
 * @param productId - Optional product for product-specific overrides
 */
export async function convertUom(
  db: NeonHttpDatabase,
  orgId: string,
  fromUomId: string,
  toUomId: string,
  qty: number,
  productId?: string,
): Promise<ConversionResult | null> {
  const conversion = await resolveConversion(db, orgId, fromUomId, toUomId, productId);
  if (!conversion) return null;

  const toQty = convertQuantity(
    qty,
    conversion.factor,
    conversion.roundingMethod,
    conversion.roundingPrecision,
  );

  return {
    fromQty: qty,
    toQty,
    factor: conversion.factor,
    roundingMethod: conversion.roundingMethod,
  };
}
