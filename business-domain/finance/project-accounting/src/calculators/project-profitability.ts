import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type ProfitabilityResult = {
  marginMinor: number;
  marginPercent: number;
  budgetVarianceMinor: number;
  isFavorable: boolean;
};

export function computeProjectProfitability(
  revenueMinor: number,
  costMinor: number,
  budgetRevenueMinor: number,
  budgetCostMinor: number,
): CalculatorResult<ProfitabilityResult> {
  if (!Number.isInteger(revenueMinor))
    throw new DomainError('VALIDATION_FAILED', 'revenueMinor must be integer');
  if (!Number.isInteger(costMinor))
    throw new DomainError('VALIDATION_FAILED', 'costMinor must be integer');
  if (!Number.isInteger(budgetRevenueMinor))
    throw new DomainError('VALIDATION_FAILED', 'budgetRevenueMinor must be integer');
  if (!Number.isInteger(budgetCostMinor))
    throw new DomainError('VALIDATION_FAILED', 'budgetCostMinor must be integer');

  const marginMinor = revenueMinor - costMinor;
  const marginPercent =
    revenueMinor === 0 ? 0 : Math.round((marginMinor / revenueMinor) * 10000) / 10000;
  const budgetMargin = budgetRevenueMinor - budgetCostMinor;
  const budgetVarianceMinor = marginMinor - budgetMargin;

  return {
    result: {
      marginMinor,
      marginPercent,
      budgetVarianceMinor,
      isFavorable: budgetVarianceMinor >= 0,
    },
    inputs: { revenueMinor, costMinor, budgetRevenueMinor, budgetCostMinor },
    explanation: `Project margin=${marginMinor} (${(marginPercent * 100).toFixed(1)}%), variance=${budgetVarianceMinor} (${budgetVarianceMinor >= 0 ? 'favorable' : 'unfavorable'})`,
  };
}
