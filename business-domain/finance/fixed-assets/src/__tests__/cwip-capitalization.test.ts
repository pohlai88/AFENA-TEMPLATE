import { describe, expect, it } from 'vitest';
import { evaluateCwipCapitalization } from '../calculators/cwip-capitalization';
import type { CwipCostLine } from '../calculators/cwip-capitalization';

const costLines: CwipCostLine[] = [
  { costLineId: 'cl-1', description: 'Steel beams', amountMinor: 500000, costDate: '2026-01-10', costCategory: 'material' },
  { costLineId: 'cl-2', description: 'Installation labour', amountMinor: 200000, costDate: '2026-01-15', costCategory: 'labour' },
  { costLineId: 'cl-3', description: 'Site overhead', amountMinor: 50000, costDate: '2026-01-20', costCategory: 'overhead' },
  { costLineId: 'cl-4', description: 'Capitalized interest', amountMinor: 30000, costDate: '2026-02-01', costCategory: 'borrowing' },
];

describe('evaluateCwipCapitalization', () => {
  it('accumulates costs by category', () => {
    const { result } = evaluateCwipCapitalization({ cwipProjectId: 'cwip-1', costLines, isReadyForUse: false });

    expect(result.totalAccumulatedMinor).toBe(780000);
    expect(result.costBreakdown.material).toBe(500000);
    expect(result.costBreakdown.labour).toBe(200000);
    expect(result.costBreakdown.overhead).toBe(50000);
    expect(result.costBreakdown.borrowing).toBe(30000);
  });

  it('marks as ready to capitalize when isReadyForUse is true', () => {
    const { result } = evaluateCwipCapitalization({
      cwipProjectId: 'cwip-1',
      costLines,
      isReadyForUse: true,
      targetCapitalizationDate: '2026-03-01',
    });

    expect(result.readyToCapitalize).toBe(true);
    expect(result.assetCostMinor).toBe(780000);
    expect(result.capitalizationDate).toBe('2026-03-01');
  });

  it('does not capitalize when not ready for use', () => {
    const { result } = evaluateCwipCapitalization({ cwipProjectId: 'cwip-1', costLines, isReadyForUse: false });

    expect(result.readyToCapitalize).toBe(false);
    expect(result.assetCostMinor).toBe(0);
    expect(result.capitalizationDate).toBeNull();
  });

  it('throws for empty cost lines', () => {
    expect(() => evaluateCwipCapitalization({ cwipProjectId: 'cwip-1', costLines: [], isReadyForUse: true }))
      .toThrow('at least one cost line');
  });

  it('throws for negative cost', () => {
    const bad: CwipCostLine[] = [
      { costLineId: 'cl-bad', description: 'Bad', amountMinor: -100, costDate: '2026-01-01', costCategory: 'other' },
    ];
    expect(() => evaluateCwipCapitalization({ cwipProjectId: 'cwip-1', costLines: bad, isReadyForUse: false }))
      .toThrow('Negative cost');
  });

  it('returns explanation', () => {
    const calc = evaluateCwipCapitalization({ cwipProjectId: 'cwip-1', costLines, isReadyForUse: true });
    expect(calc.explanation).toContain('ready to capitalize');
    expect(calc.explanation).toContain('780000');
  });
});
