import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see CA-08 — WIP valuation and transfer to finished goods
 * @see PA-05 — WIP-to-revenue transfer journal
 */
export type ProjectCost = {
  type: 'labor' | 'material' | 'overhead' | 'subcontractor';
  amountMinor: number;
};

export type WipResult = {
  totalCostMinor: number;
  wipBalanceMinor: number;
  costToCompleteMinor: number;
  percentComplete: number;
};

export function computeWipValuation(
  costs: ProjectCost[],
  revenueRecognizedMinor: number,
  budgetCostMinor: number,
): CalculatorResult<WipResult> {
  if (!Number.isInteger(revenueRecognizedMinor) || revenueRecognizedMinor < 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `revenueRecognizedMinor must be a non-negative integer, got ${revenueRecognizedMinor}`,
    );
  }
  if (!Number.isInteger(budgetCostMinor) || budgetCostMinor <= 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `budgetCostMinor must be a positive integer, got ${budgetCostMinor}`,
    );
  }

  let totalCostMinor = 0;
  for (const c of costs) {
    if (!Number.isInteger(c.amountMinor) || c.amountMinor < 0) {
      throw new DomainError(
        'VALIDATION_FAILED',
        `amountMinor must be a non-negative integer, got ${c.amountMinor}`,
      );
    }
    totalCostMinor += c.amountMinor;
  }

  const percentComplete = Math.round((totalCostMinor / budgetCostMinor) * 10000) / 10000;
  const wipBalanceMinor = totalCostMinor - revenueRecognizedMinor;
  const costToCompleteMinor = Math.max(budgetCostMinor - totalCostMinor, 0);

  return {
    result: {
      totalCostMinor,
      wipBalanceMinor,
      costToCompleteMinor,
      percentComplete: Math.min(percentComplete, 1),
    },
    inputs: { costs, revenueRecognizedMinor, budgetCostMinor },
    explanation: `WIP: total cost=${totalCostMinor}, balance=${wipBalanceMinor}, ${(Math.min(percentComplete, 1) * 100).toFixed(1)}% complete`,
  };
}
