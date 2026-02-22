import { describe, expect, it } from 'vitest';
import { matchIcReceivables } from '../calculators/ic-receivable-match';

describe('matchIcReceivables', () => {
  it('matches mirror IC entries', () => {
    const rec = [{ companyId: 'A', counterpartyId: 'B', amountMinor: 1000, currency: 'USD', referenceId: 'R1' }];
    const pay = [{ companyId: 'B', counterpartyId: 'A', amountMinor: 1000, currency: 'USD', referenceId: 'P1' }];
    const r = matchIcReceivables(rec, pay);
    expect(r.result.matchedPairs).toHaveLength(1);
    expect(r.result.matchRate).toBe(100);
  });

  it('reports unmatched when no mirror', () => {
    const rec = [{ companyId: 'A', counterpartyId: 'B', amountMinor: 1000, currency: 'USD', referenceId: 'R1' }];
    const r = matchIcReceivables(rec, []);
    expect(r.result.unmatchedReceivables).toHaveLength(1);
    expect(r.result.matchRate).toBe(0);
  });

  it('uses tolerance for near-matches', () => {
    const rec = [{ companyId: 'A', counterpartyId: 'B', amountMinor: 1000, currency: 'USD', referenceId: 'R1' }];
    const pay = [{ companyId: 'B', counterpartyId: 'A', amountMinor: 1005, currency: 'USD', referenceId: 'P1' }];
    const r = matchIcReceivables(rec, pay, 10);
    expect(r.result.matchedPairs).toHaveLength(1);
  });

  it('throws on empty inputs', () => {
    expect(() => matchIcReceivables([], [])).toThrow('at least one');
  });
});
