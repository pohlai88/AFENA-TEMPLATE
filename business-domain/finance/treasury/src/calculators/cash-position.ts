import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type CashAccount = {
  accountId: string;
  currency: string;
  balanceMinor: number;
  bankName: string;
};

export type CashPositionSummary = {
  byCurrency: Record<string, number>;
  totalMinor: number;
  negativeAccounts: string[];
};

export function computeCashPosition(
  accounts: CashAccount[],
): CalculatorResult<CashPositionSummary> {
  const byCurrency: Record<string, number> = {};
  const negativeAccounts: string[] = [];
  let totalMinor = 0;

  for (const acct of accounts) {
    if (!Number.isInteger(acct.balanceMinor)) {
      throw new DomainError(
        'VALIDATION_FAILED',
        `balanceMinor must be an integer, got ${acct.balanceMinor}`,
      );
    }
    byCurrency[acct.currency] = (byCurrency[acct.currency] ?? 0) + acct.balanceMinor;
    totalMinor += acct.balanceMinor;
    if (acct.balanceMinor < 0) {
      negativeAccounts.push(acct.accountId);
    }
  }

  return {
    result: { byCurrency, totalMinor, negativeAccounts },
    inputs: { accounts },
    explanation: `Cash position: total=${totalMinor}, ${Object.keys(byCurrency).length} currencies, ${negativeAccounts.length} negative accounts`,
  };
}
