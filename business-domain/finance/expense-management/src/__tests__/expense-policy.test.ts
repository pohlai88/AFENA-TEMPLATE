import { describe, expect, it } from 'vitest';
import { validateExpense } from '../calculators/expense-policy';

describe('validateExpense', () => {
  const policy = { maxAmountMinor: 50_000, requiresReceipt: true, allowedCategories: ['travel', 'meals'] };

  it('compliant expense', () => {
    const r = validateExpense(
      { categoryCode: 'travel', amountMinor: 30_000, currency: 'USD', dateIso: '2024-01-15', receiptAttached: true },
      policy,
    ).result;
    expect(r.compliant).toBe(true);
    expect(r.violations).toEqual([]);
  });

  it('over limit', () => {
    const r = validateExpense(
      { categoryCode: 'travel', amountMinor: 60_000, currency: 'USD', dateIso: '2024-01-15', receiptAttached: true },
      policy,
    ).result;
    expect(r.compliant).toBe(false);
    expect(r.violations).toHaveLength(1);
  });

  it('missing receipt', () => {
    const r = validateExpense(
      { categoryCode: 'travel', amountMinor: 10_000, currency: 'USD', dateIso: '2024-01-15', receiptAttached: false },
      policy,
    ).result;
    expect(r.compliant).toBe(false);
    expect(r.violations[0]).toContain('Receipt');
  });

  it('disallowed category', () => {
    const r = validateExpense(
      { categoryCode: 'entertainment', amountMinor: 10_000, currency: 'USD', dateIso: '2024-01-15', receiptAttached: true },
      policy,
    ).result;
    expect(r.compliant).toBe(false);
    expect(r.violations[0]).toContain('entertainment');
  });

  it('multiple violations', () => {
    const r = validateExpense(
      { categoryCode: 'entertainment', amountMinor: 60_000, currency: 'USD', dateIso: '2024-01-15', receiptAttached: false },
      policy,
    ).result;
    expect(r.violations).toHaveLength(3);
  });
});
