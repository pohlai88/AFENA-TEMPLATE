import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * G-07 / BU-09 — Scenario Planning (Base / Upside / Downside)
 *
 * Generates multiple budget scenarios by applying adjustment factors
 * to a base budget. Computes variance between scenarios.
 *
 * Pure function — no I/O.
 */

export type BudgetLineItem = {
  accountId: string;
  description: string;
  baseAmountMinor: number;
};

export type ScenarioAdjustment = {
  scenarioName: string;
  adjustmentFactors: Record<string, number>;
  globalFactor?: number;
};

export type ScenarioOutput = {
  scenarioName: string;
  lines: { accountId: string; description: string; adjustedAmountMinor: number }[];
  totalMinor: number;
  varianceFromBaseMinor: number;
  varianceFromBasePct: number;
};

export type ScenarioPlanResult = {
  baseTotal: number;
  scenarios: ScenarioOutput[];
  bestCase: string;
  worstCase: string;
  range: number;
};

export function generateScenarios(
  baseLines: BudgetLineItem[],
  adjustments: ScenarioAdjustment[],
): CalculatorResult<ScenarioPlanResult> {
  if (baseLines.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'At least one budget line required');
  }
  if (adjustments.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'At least one scenario adjustment required');
  }

  const baseTotal = baseLines.reduce((s, l) => s + l.baseAmountMinor, 0);

  const scenarios: ScenarioOutput[] = adjustments.map((adj) => {
    const lines = baseLines.map((line) => {
      const factor = adj.adjustmentFactors[line.accountId] ?? adj.globalFactor ?? 1;
      return {
        accountId: line.accountId,
        description: line.description,
        adjustedAmountMinor: Math.round(line.baseAmountMinor * factor),
      };
    });
    const totalMinor = lines.reduce((s, l) => s + l.adjustedAmountMinor, 0);
    return {
      scenarioName: adj.scenarioName,
      lines,
      totalMinor,
      varianceFromBaseMinor: totalMinor - baseTotal,
      varianceFromBasePct: baseTotal === 0 ? 0 : Math.round(((totalMinor - baseTotal) / baseTotal) * 10000) / 100,
    };
  });

  const sorted = [...scenarios].sort((a, b) => b.totalMinor - a.totalMinor);

  return {
    result: {
      baseTotal,
      scenarios,
      bestCase: sorted[0]!.scenarioName,
      worstCase: sorted[sorted.length - 1]!.scenarioName,
      range: sorted[0]!.totalMinor - sorted[sorted.length - 1]!.totalMinor,
    },
    inputs: { lineCount: baseLines.length, scenarioCount: adjustments.length },
    explanation: `Scenarios: ${adjustments.length} generated from ${baseLines.length} lines, range ${sorted[0]!.totalMinor - sorted[sorted.length - 1]!.totalMinor}`,
  };
}
