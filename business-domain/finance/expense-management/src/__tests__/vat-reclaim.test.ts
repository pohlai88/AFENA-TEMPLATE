import { describe, expect, it } from 'vitest';
import { computeVatReclaim } from '../calculators/vat-reclaim';
import type { ExpenseForReclaim, ReclaimRule } from '../calculators/vat-reclaim';

const rules: ReclaimRule[] = [
  { category: 'travel', reclaimablePct: 100, requiresReceipt: true },
  { category: 'meals', reclaimablePct: 50, requiresReceipt: true },
  { category: 'entertainment', reclaimablePct: 0, requiresReceipt: false },
];

const expenses: ExpenseForReclaim[] = [
  { expenseId: 'e1', category: 'travel', grossAmountMinor: 50000, vatAmountMinor: 5000, vatRatePct: 10, hasValidReceipt: true, jurisdiction: 'MY' },
  { expenseId: 'e2', category: 'meals', grossAmountMinor: 20000, vatAmountMinor: 2000, vatRatePct: 10, hasValidReceipt: true, jurisdiction: 'MY' },
  { expenseId: 'e3', category: 'travel', grossAmountMinor: 30000, vatAmountMinor: 3000, vatRatePct: 10, hasValidReceipt: false, jurisdiction: 'MY' },
  { expenseId: 'e4', category: 'entertainment', grossAmountMinor: 10000, vatAmountMinor: 1000, vatRatePct: 10, hasValidReceipt: true, jurisdiction: 'MY' },
];

describe('computeVatReclaim', () => {
  it('reclaims 100% for travel with receipt', () => {
    const { result } = computeVatReclaim(expenses, rules);
    const e1 = result.reclaimableItems.find((r) => r.expenseId === 'e1')!;
    expect(e1.reclaimMinor).toBe(5000);
  });

  it('reclaims 50% for meals', () => {
    const { result } = computeVatReclaim(expenses, rules);
    const e2 = result.reclaimableItems.find((r) => r.expenseId === 'e2')!;
    expect(e2.reclaimMinor).toBe(1000);
  });

  it('rejects travel without receipt', () => {
    const { result } = computeVatReclaim(expenses, rules);
    const e3 = result.nonReclaimableItems.find((r) => r.expenseId === 'e3')!;
    expect(e3.reason).toContain('receipt');
  });

  it('rejects non-reclaimable category', () => {
    const { result } = computeVatReclaim(expenses, rules);
    const e4 = result.nonReclaimableItems.find((r) => r.expenseId === 'e4')!;
    expect(e4.reason).toContain('not reclaimable');
  });

  it('computes totals and reclaim rate', () => {
    const { result } = computeVatReclaim(expenses, rules);
    expect(result.totalVatMinor).toBe(11000);
    expect(result.totalReclaimableMinor).toBe(6000);
    expect(result.reclaimRatePct).toBeCloseTo(54.55, 0);
  });

  it('throws for empty expenses', () => {
    expect(() => computeVatReclaim([], rules)).toThrow('At least one');
  });
});
