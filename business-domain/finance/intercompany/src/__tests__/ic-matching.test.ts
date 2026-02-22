import { describe, expect, it } from 'vitest';

import { matchIcTransactions } from '../calculators/ic-matching';

import type { IcTransaction } from '../calculators/ic-matching';

describe('matchIcTransactions', () => {
  const outgoing: IcTransaction[] = [
    { transactionId: 'o1', fromCompanyId: 'c1', toCompanyId: 'c2', amountMinor: 10000, currency: 'MYR', reference: 'IC-001' },
    { transactionId: 'o2', fromCompanyId: 'c1', toCompanyId: 'c3', amountMinor: 5000, currency: 'USD', reference: 'IC-002' },
  ];

  const incoming: IcTransaction[] = [
    { transactionId: 'i1', fromCompanyId: 'c2', toCompanyId: 'c1', amountMinor: 10000, currency: 'MYR', reference: 'IC-001' },
    { transactionId: 'i2', fromCompanyId: 'c3', toCompanyId: 'c1', amountMinor: 4500, currency: 'USD', reference: 'IC-002' },
  ];

  it('matches transactions with same amount, currency, and reference', () => {
    const result = matchIcTransactions(outgoing, incoming).result;
    expect(result.matched).toHaveLength(2);
    const perfect = result.matched.find((m) => m.outgoing.transactionId === 'o1');
    expect(perfect?.isBalanced).toBe(true);
    expect(perfect?.differenceMinor).toBe(0);
  });

  it('detects unbalanced matches (amount mismatch)', () => {
    const result = matchIcTransactions(outgoing, incoming).result;
    const unbalanced = result.matched.find((m) => m.outgoing.transactionId === 'o2');
    expect(unbalanced?.isBalanced).toBe(false);
    expect(unbalanced?.differenceMinor).toBe(500);
  });

  it('reports unmatched outgoing when no counterpart exists', () => {
    const extraOutgoing: IcTransaction[] = [
      ...outgoing,
      { transactionId: 'o3', fromCompanyId: 'c1', toCompanyId: 'c4', amountMinor: 2000, currency: 'MYR', reference: 'IC-003' },
    ];
    const result = matchIcTransactions(extraOutgoing, incoming).result;
    expect(result.unmatchedOutgoing).toHaveLength(1);
    expect(result.unmatchedOutgoing[0]?.transactionId).toBe('o3');
  });

  it('reports unmatched incoming when no counterpart exists', () => {
    const extraIncoming: IcTransaction[] = [
      ...incoming,
      { transactionId: 'i3', fromCompanyId: 'c4', toCompanyId: 'c1', amountMinor: 3000, currency: 'MYR', reference: 'IC-004' },
    ];
    const result = matchIcTransactions(outgoing, extraIncoming).result;
    expect(result.unmatchedIncoming).toHaveLength(1);
    expect(result.unmatchedIncoming[0]?.transactionId).toBe('i3');
  });

  it('returns all unmatched for empty incoming', () => {
    const result = matchIcTransactions(outgoing, []).result;
    expect(result.matched).toHaveLength(0);
    expect(result.unmatchedOutgoing).toHaveLength(2);
  });

  it('returns all unmatched for empty outgoing', () => {
    const result = matchIcTransactions([], incoming).result;
    expect(result.matched).toHaveLength(0);
    expect(result.unmatchedIncoming).toHaveLength(2);
  });

  it('throws when fromCompanyId equals toCompanyId', () => {
    const bad: IcTransaction[] = [
      { transactionId: 'bad', fromCompanyId: 'c1', toCompanyId: 'c1', amountMinor: 1000, currency: 'MYR', reference: 'X' },
    ];
    expect(() => matchIcTransactions(bad, [])).toThrow('same company');
  });

  it('does not double-match incoming transactions', () => {
    const dupeOutgoing: IcTransaction[] = [
      { transactionId: 'o1', fromCompanyId: 'c1', toCompanyId: 'c2', amountMinor: 10000, currency: 'MYR', reference: 'IC-001' },
      { transactionId: 'o1b', fromCompanyId: 'c1', toCompanyId: 'c2', amountMinor: 10000, currency: 'MYR', reference: 'IC-001' },
    ];
    const singleIncoming: IcTransaction[] = [
      { transactionId: 'i1', fromCompanyId: 'c2', toCompanyId: 'c1', amountMinor: 10000, currency: 'MYR', reference: 'IC-001' },
    ];
    const result = matchIcTransactions(dupeOutgoing, singleIncoming).result;
    expect(result.matched).toHaveLength(1);
    expect(result.unmatchedOutgoing).toHaveLength(1);
  });
});
