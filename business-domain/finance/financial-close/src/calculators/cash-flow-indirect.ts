import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type TrialBalanceMovement = {
  accountCode: string;
  accountName: string;
  classification: 'operating' | 'investing' | 'financing' | 'non_cash';
  openingMinor: number;
  closingMinor: number;
};

export type CashFlowReportResult = {
  operatingMinor: number;
  investingMinor: number;
  financingMinor: number;
  netCashChangeMinor: number;
  nonCashItems: Array<{ accountName: string; amountMinor: number }>;
};

export function deriveCashFlowFromTb(
  movements: TrialBalanceMovement[],
  netIncomeMinor: number,
): CalculatorResult<CashFlowReportResult> {
  if (movements.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'Must provide at least one TB movement');
  }

  let operating = netIncomeMinor;
  let investing = 0;
  let financing = 0;
  const nonCashItems: CashFlowReportResult['nonCashItems'] = [];

  for (const m of movements) {
    const movement = m.closingMinor - m.openingMinor;
    switch (m.classification) {
      case 'operating':
        operating += movement;
        break;
      case 'investing':
        investing += movement;
        break;
      case 'financing':
        financing += movement;
        break;
      case 'non_cash':
        operating += movement;
        nonCashItems.push({ accountName: m.accountName, amountMinor: movement });
        break;
    }
  }

  return {
    result: { operatingMinor: operating, investingMinor: investing, financingMinor: financing, netCashChangeMinor: operating + investing + financing, nonCashItems },
    inputs: { movementCount: movements.length, netIncomeMinor },
    explanation: `Cash flow from TB: Operating ${operating}, Investing ${investing}, Financing ${financing}. Net change: ${operating + investing + financing}. ${nonCashItems.length} non-cash adjustments.`,
  };
}
