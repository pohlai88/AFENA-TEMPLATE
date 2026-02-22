import { describe, expect, it } from 'vitest';
import { generateScenarios } from '../calculators/scenario-planning';
import type { BudgetLineItem, ScenarioAdjustment } from '../calculators/scenario-planning';

const baseLines: BudgetLineItem[] = [
  { accountId: 'rev-sales', description: 'Sales Revenue', baseAmountMinor: 10000000 },
  { accountId: 'cost-cogs', description: 'COGS', baseAmountMinor: 6000000 },
  { accountId: 'cost-opex', description: 'Operating Expenses', baseAmountMinor: 2000000 },
];

const adjustments: ScenarioAdjustment[] = [
  { scenarioName: 'Upside', globalFactor: 1.15, adjustmentFactors: {} },
  { scenarioName: 'Base', globalFactor: 1.0, adjustmentFactors: {} },
  { scenarioName: 'Downside', globalFactor: 0.85, adjustmentFactors: {} },
];

describe('generateScenarios', () => {
  it('generates scenarios with adjusted amounts', () => {
    const { result } = generateScenarios(baseLines, adjustments);
    expect(result.scenarios).toHaveLength(3);
    const upside = result.scenarios.find((s) => s.scenarioName === 'Upside')!;
    expect(upside.totalMinor).toBe(20700000);
  });

  it('computes variance from base', () => {
    const { result } = generateScenarios(baseLines, adjustments);
    const upside = result.scenarios.find((s) => s.scenarioName === 'Upside')!;
    expect(upside.varianceFromBaseMinor).toBe(2700000);
    expect(upside.varianceFromBasePct).toBe(15);
  });

  it('identifies best and worst case', () => {
    const { result } = generateScenarios(baseLines, adjustments);
    expect(result.bestCase).toBe('Upside');
    expect(result.worstCase).toBe('Downside');
  });

  it('computes range between best and worst', () => {
    const { result } = generateScenarios(baseLines, adjustments);
    expect(result.range).toBe(20700000 - 15300000);
  });

  it('supports per-account adjustment factors', () => {
    const custom: ScenarioAdjustment[] = [
      { scenarioName: 'Custom', adjustmentFactors: { 'rev-sales': 1.2, 'cost-cogs': 0.9 }, globalFactor: 1.0 },
    ];
    const { result } = generateScenarios(baseLines, custom);
    const lines = result.scenarios[0]!.lines;
    expect(lines.find((l) => l.accountId === 'rev-sales')!.adjustedAmountMinor).toBe(12000000);
    expect(lines.find((l) => l.accountId === 'cost-cogs')!.adjustedAmountMinor).toBe(5400000);
  });

  it('throws for empty lines', () => {
    expect(() => generateScenarios([], adjustments)).toThrow('At least one budget line');
  });

  it('throws for empty adjustments', () => {
    expect(() => generateScenarios(baseLines, [])).toThrow('At least one scenario');
  });
});
