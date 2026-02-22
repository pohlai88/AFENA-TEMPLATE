import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { fxRates } from 'afenda-database';
import { and, desc, eq, lte } from 'drizzle-orm';

/**
 * @see FX-01 — FX rate types: spot, average, closing, budget, hedge
 */
export type FxRateReadModel = {
  fromCurrency: string;
  toCurrency: string;
  rate: string;
  effectiveDate: string;
  source: string;
};

export async function lookupFxRate(
  db: DbSession,
  ctx: DomainContext,
  input: { fromCurrency: string; toCurrency: string; date: string },
): Promise<FxRateReadModel> {
  if (input.fromCurrency === input.toCurrency) {
    return {
      fromCurrency: input.fromCurrency,
      toCurrency: input.toCurrency,
      rate: '1',
      effectiveDate: input.date,
      source: 'identity',
    };
  }

  const rows = await db.read((tx) =>
    tx
      .select({
        fromCurrency: fxRates.fromCurrency,
        toCurrency: fxRates.toCurrency,
        rate: fxRates.rate,
        effectiveDate: fxRates.effectiveDate,
        source: fxRates.source,
      })
      .from(fxRates)
      .where(
        and(
          eq(fxRates.orgId, ctx.orgId),
          eq(fxRates.fromCurrency, input.fromCurrency),
          eq(fxRates.toCurrency, input.toCurrency),
          lte(fxRates.effectiveDate, input.date),
          eq(fxRates.isDeleted, false),
        ),
      )
      .orderBy(desc(fxRates.effectiveDate))
      .limit(1),
  );

  const row = rows[0];
  if (!row) {
    throw new DomainError('FX_RATE_NOT_FOUND', `No FX rate found for ${input.fromCurrency}→${input.toCurrency} on/before ${input.date}`, {
      fromCurrency: input.fromCurrency,
      toCurrency: input.toCurrency,
      date: input.date,
    });
  }

  return {
    fromCurrency: row.fromCurrency,
    toCurrency: row.toCurrency,
    rate: row.rate,
    effectiveDate: row.effectiveDate,
    source: row.source,
  };
}
