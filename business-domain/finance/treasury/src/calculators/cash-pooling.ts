import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * TR-04 — Cash Pooling / Notional Pooling Positions
 *
 * Computes net pool position across multiple bank accounts for group cash optimization.
 * Pure function — no I/O.
 */

export type PoolAccount = { accountId: string; companyId: string; currency: string; balanceMinor: number };

export type CashPoolResult = {
  poolId: string;
  accounts: PoolAccount[];
  netPositionMinor: number;
  positiveBalanceMinor: number;
  negativeBalanceMinor: number;
  participantCount: number;
  interestSavingEstimateMinor: number;
};

export function computeCashPool(poolId: string, accounts: PoolAccount[], interestSpreadBps: number): CalculatorResult<CashPoolResult> {
  if (accounts.length === 0) throw new DomainError('VALIDATION_FAILED', 'No pool accounts provided');

  const positiveBalanceMinor = accounts.filter((a) => a.balanceMinor > 0).reduce((s, a) => s + a.balanceMinor, 0);
  const negativeBalanceMinor = Math.abs(accounts.filter((a) => a.balanceMinor < 0).reduce((s, a) => s + a.balanceMinor, 0));
  const netPositionMinor = positiveBalanceMinor - negativeBalanceMinor;
  const offsetAmount = Math.min(positiveBalanceMinor, negativeBalanceMinor);
  const interestSavingEstimateMinor = Math.round(offsetAmount * interestSpreadBps / 10000 / 12);

  return {
    result: { poolId, accounts, netPositionMinor, positiveBalanceMinor, negativeBalanceMinor, participantCount: accounts.length, interestSavingEstimateMinor },
    inputs: { poolId, accountCount: accounts.length, interestSpreadBps },
    explanation: `Cash pool ${poolId}: net=${netPositionMinor}, ${accounts.length} accounts, est. monthly saving=${interestSavingEstimateMinor}`,
  };
}
