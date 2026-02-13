import { and, desc, eq, taxRates, sql } from 'afena-database';

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

/**
 * Resolved tax rate for a given code and date.
 */
export interface ResolvedTaxRate {
  taxRateId: string;
  taxCode: string;
  rate: string;
  roundingMethod: string;
  roundingPrecision: number;
}

/**
 * Result of a tax calculation on a line amount.
 */
export interface TaxLineResult {
  taxCode: string;
  rate: string;
  taxAmount: number;
  roundingMethod: string;
}

/**
 * Look up the effective tax rate for a given code on a given date.
 *
 * PRD G0.7 + Phase B #9:
 * - Returns the most recent rate where effective_from <= asOfDate
 *   and (effective_to IS NULL OR effective_to >= asOfDate)
 * - Deterministic: same input → same tax forever
 */
export async function resolveTaxRate(
  db: NeonHttpDatabase,
  orgId: string,
  taxCode: string,
  asOfDate: string | Date,
): Promise<ResolvedTaxRate | null> {
  const dateStr = typeof asOfDate === 'string'
    ? asOfDate
    : asOfDate.toISOString().slice(0, 10);

  const [row] = await (db as any)
    .select({
      taxRateId: taxRates.id,
      taxCode: taxRates.taxCode,
      rate: taxRates.rate,
      roundingMethod: taxRates.roundingMethod,
      roundingPrecision: taxRates.roundingPrecision,
    })
    .from(taxRates)
    .where(
      and(
        eq(taxRates.orgId, orgId),
        eq(taxRates.taxCode, taxCode),
        sql`${taxRates.effectiveFrom} <= ${dateStr}::date`,
        sql`(${taxRates.effectiveTo} IS NULL OR ${taxRates.effectiveTo} >= ${dateStr}::date)`,
      ),
    )
    .orderBy(desc(taxRates.effectiveFrom))
    .limit(1);

  if (!row) return null;

  return {
    taxRateId: row.taxRateId,
    taxCode: row.taxCode,
    rate: row.rate,
    roundingMethod: row.roundingMethod,
    roundingPrecision: row.roundingPrecision,
  };
}

/**
 * Calculate tax on a line amount (in minor units) using a resolved rate.
 *
 * PRD G0.7: Deterministic rounding — same input always produces same output.
 * All amounts are integer minor units (e.g., cents).
 *
 * @param amountMinor - Line amount in minor units (e.g., 10000 = $100.00)
 * @param rate - Tax rate as string (e.g., '6.000000' for 6%)
 * @param roundingMethod - 'half_up' | 'half_down' | 'ceil' | 'floor' | 'banker'
 * @param roundingPrecision - Decimal places (typically 0 for minor units)
 */
export function calculateLineTax(
  amountMinor: number,
  rate: string,
  roundingMethod: string = 'half_up',
  _roundingPrecision: number = 0,
): number {
  const rateNum = parseFloat(rate);
  const rawTax = amountMinor * (rateNum / 100);

  switch (roundingMethod) {
    case 'ceil':
      return Math.ceil(rawTax);
    case 'floor':
      return Math.floor(rawTax);
    case 'half_down':
      return Math.sign(rawTax) * Math.floor(Math.abs(rawTax) + 0.5 - Number.EPSILON);
    case 'banker': {
      const rounded = Math.round(rawTax);
      // Banker's rounding: if exactly 0.5, round to even
      if (Math.abs(rawTax - Math.floor(rawTax) - 0.5) < Number.EPSILON) {
        return Math.floor(rawTax) % 2 === 0 ? Math.floor(rawTax) : Math.ceil(rawTax);
      }
      return rounded;
    }
    case 'half_up':
    default:
      return Math.round(rawTax);
  }
}

/**
 * Resolve tax rate and calculate tax for a line in one call.
 */
export async function calculateTaxForLine(
  db: NeonHttpDatabase,
  orgId: string,
  taxCode: string,
  amountMinor: number,
  asOfDate: string | Date,
): Promise<TaxLineResult | null> {
  const resolved = await resolveTaxRate(db, orgId, taxCode, asOfDate);
  if (!resolved) return null;

  const taxAmount = calculateLineTax(
    amountMinor,
    resolved.rate,
    resolved.roundingMethod,
    resolved.roundingPrecision,
  );

  return {
    taxCode: resolved.taxCode,
    rate: resolved.rate,
    taxAmount,
    roundingMethod: resolved.roundingMethod,
  };
}
