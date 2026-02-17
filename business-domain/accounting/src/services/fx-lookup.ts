import { and, eq, fxRates, sql } from 'afenda-database';
import { desc } from 'drizzle-orm';

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

/**
 * Result of an FX rate lookup.
 */
export interface FxRateResult {
  rate: string;
  effectiveDate: string;
  source: string;
}

/**
 * Look up the most recent FX rate for a currency pair on or before a given date.
 *
 * PRD Phase A #5 — FX Rates:
 * - Rate lookup: latest rate ≤ document date for the currency pair
 * - effective_date is DATE (not timestamptz)
 * - Returns null if no rate found (caller must handle)
 *
 * @param db - Database handle (can be tx or top-level db/dbRo)
 * @param orgId - Tenant org ID
 * @param fromCode - Source currency code (e.g. 'USD')
 * @param toCode - Target currency code (e.g. 'MYR')
 * @param asOfDate - Document date (YYYY-MM-DD string or Date)
 */
export async function lookupFxRate(
  db: NeonHttpDatabase,
  orgId: string,
  fromCode: string,
  toCode: string,
  asOfDate: string | Date,
): Promise<FxRateResult | null> {
  const dateStr = typeof asOfDate === 'string'
    ? asOfDate
    : asOfDate.toISOString().slice(0, 10);

  const [row] = await (db as any)
    .select({
      rate: fxRates.rate,
      effectiveDate: fxRates.effectiveDate,
      source: fxRates.source,
    })
    .from(fxRates)
    .where(
      and(
        eq(fxRates.orgId, orgId),
        eq(fxRates.fromCode, fromCode),
        eq(fxRates.toCode, toCode),
        sql`${fxRates.effectiveDate} <= ${dateStr}::date`,
      ),
    )
    .orderBy(desc(fxRates.effectiveDate))
    .limit(1);

  if (!row) return null;

  return {
    rate: row.rate,
    effectiveDate: row.effectiveDate,
    source: row.source,
  };
}
