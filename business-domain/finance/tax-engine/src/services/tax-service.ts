import type { DomainContext, DomainResult } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import Decimal from 'decimal.js';
import { calculateLineTax } from '../calculators/tax-calc';
import type { TaxRateReadModel } from '../queries/tax-rate-query';
import { resolveTaxRate } from '../queries/tax-rate-query';

export type TaxResult = {
  taxMinor: number;
  taxCode: string;
  rate: string;
};

export async function getTaxRate(
  db: DbSession,
  ctx: DomainContext,
  input: { taxCode: string; effectiveDate: string },
): Promise<DomainResult<TaxRateReadModel>> {
  const model = await resolveTaxRate(db, ctx, input);
  return { kind: 'read', data: model };
}

export async function calculateLineTaxForDocument(
  db: DbSession,
  ctx: DomainContext,
  input: { baseMinor: number; taxCode: string; effectiveDate: string },
): Promise<DomainResult<TaxResult>> {
  const model = await resolveTaxRate(db, ctx, {
    taxCode: input.taxCode,
    effectiveDate: input.effectiveDate,
  });

  const taxCalc = calculateLineTax(input.baseMinor, new Decimal(model.rate), model.roundingMethod);

  return {
    kind: 'read',
    data: { taxMinor: taxCalc.result, taxCode: model.taxCode, rate: model.rate },
  };
}
