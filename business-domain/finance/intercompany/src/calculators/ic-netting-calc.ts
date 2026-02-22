/**
 * IFRS 10.B86 / IAS 24 — IC Netting Calculation
 *
 * Computes net settlement amounts between company pairs by offsetting
 * receivables against payables to minimise cash transfers.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type IcBalance = {
  fromCompanyId: string;
  toCompanyId: string;
  receivableMinor: number;
  payableMinor: number;
  currency: string;
};

export type IcNettingResult = {
  netSettlements: Array<{
    fromCompanyId: string;
    toCompanyId: string;
    netAmountMinor: number;
    direction: 'pay' | 'receive' | 'nil';
    currency: string;
  }>;
  totalGrossMinor: number;
  totalNetMinor: number;
  reductionPct: string;
  explanation: string;
};

export function computeIcNetting(
  inputs: { balances: IcBalance[] },
): CalculatorResult<IcNettingResult> {
  const { balances } = inputs;

  if (balances.length === 0) throw new DomainError('VALIDATION_FAILED', 'At least one IC balance required');

  let totalGrossMinor = 0;
  let totalNetMinor = 0;

  const netSettlements = balances.map((b) => {
    const gross = b.receivableMinor + b.payableMinor;
    const netAmountMinor = b.receivableMinor - b.payableMinor;
    totalGrossMinor += gross;
    totalNetMinor += Math.abs(netAmountMinor);

    return {
      fromCompanyId: b.fromCompanyId,
      toCompanyId: b.toCompanyId,
      netAmountMinor: Math.abs(netAmountMinor),
      direction: (netAmountMinor > 0 ? 'receive' : netAmountMinor < 0 ? 'pay' : 'nil') as 'pay' | 'receive' | 'nil',
      currency: b.currency,
    };
  });

  const reductionPct = totalGrossMinor > 0
    ? `${(((totalGrossMinor - totalNetMinor) / totalGrossMinor) * 100).toFixed(1)}%`
    : '0.0%';

  const explanation =
    `IC netting: gross ${totalGrossMinor} → net ${totalNetMinor}, ` +
    `reduction ${reductionPct} across ${balances.length} pairs`;

  return {
    result: { netSettlements, totalGrossMinor, totalNetMinor, reductionPct, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
