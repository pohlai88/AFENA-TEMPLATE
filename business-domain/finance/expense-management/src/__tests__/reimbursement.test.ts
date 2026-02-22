import { describe, expect, it } from 'vitest';
import { computeReimbursement } from '../calculators/reimbursement';

describe('computeReimbursement', () => {
  it('single currency — no conversion', () => {
    const r = computeReimbursement(
      [{ claimId: 'c1', amountMinor: 10_000, currency: 'USD' }],
      'USD',
      [],
    ).result;
    expect(r.totalMinor).toBe(10_000);
    expect(r.currency).toBe('USD');
    expect(r.lineItems).toHaveLength(1);
  });

  it('multi-currency conversion', () => {
    const r = computeReimbursement(
      [
        { claimId: 'c1', amountMinor: 10_000, currency: 'EUR' },
        { claimId: 'c2', amountMinor: 5_000, currency: 'USD' },
      ],
      'USD',
      [{ from: 'EUR', to: 'USD', rate: 1.1 }],
    ).result;
    expect(r.totalMinor).toBe(11_000 + 5_000);
    expect(r.lineItems[0].convertedMinor).toBe(11_000);
  });

  it('empty claims', () => {
    const r = computeReimbursement([], 'USD', []).result;
    expect(r.totalMinor).toBe(0);
    expect(r.lineItems).toEqual([]);
  });

  it('throws on missing FX rate', () => {
    expect(() =>
      computeReimbursement(
        [{ claimId: 'c1', amountMinor: 10_000, currency: 'GBP' }],
        'USD',
        [],
      ),
    ).toThrow('No FX rate for GBP -> USD');
  });
});
