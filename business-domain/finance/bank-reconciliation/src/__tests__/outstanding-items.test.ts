import { describe, expect, it } from 'vitest';

import { analyzeOutstandingItems } from '../calculators/outstanding-items';

describe('BR-06 — Outstanding checks / deposits-in-transit tracking', () => {
  it('separates checks and deposits', () => {
    const r = analyzeOutstandingItems([
      { itemId: 'CHK-1', type: 'check', amountMinor: 5_000, dateIso: '2025-12-01', daysOutstanding: 10 },
      { itemId: 'DEP-1', type: 'deposit', amountMinor: 8_000, dateIso: '2025-12-02', daysOutstanding: 5 },
    ]);
    expect(r.result.checks).toHaveLength(1);
    expect(r.result.deposits).toHaveLength(1);
  });

  it('computes totals and net adjustment', () => {
    const r = analyzeOutstandingItems([
      { itemId: 'CHK-1', type: 'check', amountMinor: 5_000, dateIso: '2025-12-01', daysOutstanding: 10 },
      { itemId: 'DEP-1', type: 'deposit', amountMinor: 8_000, dateIso: '2025-12-02', daysOutstanding: 5 },
    ]);
    expect(r.result.totalChecksMinor).toBe(5_000);
    expect(r.result.totalDepositsMinor).toBe(8_000);
    expect(r.result.netAdjustmentMinor).toBe(3_000);
  });

  it('identifies stale items (>180 days)', () => {
    const r = analyzeOutstandingItems([
      { itemId: 'CHK-1', type: 'check', amountMinor: 1_000, dateIso: '2025-06-01', daysOutstanding: 200 },
      { itemId: 'CHK-2', type: 'check', amountMinor: 2_000, dateIso: '2025-11-01', daysOutstanding: 30 },
    ]);
    expect(r.result.staleItems).toHaveLength(1);
    expect(r.result.staleItems[0]!.itemId).toBe('CHK-1');
  });

  it('returns empty stale list when all items are fresh', () => {
    const r = analyzeOutstandingItems([
      { itemId: 'DEP-1', type: 'deposit', amountMinor: 3_000, dateIso: '2025-12-15', daysOutstanding: 5 },
    ]);
    expect(r.result.staleItems).toHaveLength(0);
  });

  it('throws on empty items', () => {
    expect(() => analyzeOutstandingItems([])).toThrow('No items');
  });
});
