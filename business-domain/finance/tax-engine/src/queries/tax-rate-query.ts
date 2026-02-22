import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { taxRates } from 'afenda-database';
import { and, eq, isNull, lte, or } from 'drizzle-orm';
import type { RoundingMethod } from '../calculators/tax-calc';

/**
 * @see TX-01 — Multi-jurisdiction tax rate tables (time-bounded, effective_
 */
export type TaxRateReadModel = {
  taxCode: string;
  rate: string;
  roundingMethod: RoundingMethod;
};

export async function resolveTaxRate(
  db: DbSession,
  ctx: DomainContext,
  input: { taxCode: string; effectiveDate: string },
): Promise<TaxRateReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        taxCode: taxRates.taxCode,
        rate: taxRates.rate,
      })
      .from(taxRates)
      .where(
        and(
          eq(taxRates.orgId, ctx.orgId),
          eq(taxRates.taxCode, input.taxCode),
          eq(taxRates.status, 'active'),
          eq(taxRates.isDeleted, false),
          lte(taxRates.effectiveFrom, input.effectiveDate),
          or(isNull(taxRates.effectiveTo), lte(taxRates.effectiveTo, input.effectiveDate)),
        ),
      )
      .orderBy(taxRates.effectiveFrom)
      .limit(1),
  );

  const row = rows[0];
  if (!row) {
    throw new DomainError('NOT_FOUND', `Tax rate not found for code: ${input.taxCode}`, {
      taxCode: input.taxCode,
      effectiveDate: input.effectiveDate,
    });
  }

  return {
    taxCode: row.taxCode,
    rate: row.rate,
    roundingMethod: 'half_up',
  };
}
