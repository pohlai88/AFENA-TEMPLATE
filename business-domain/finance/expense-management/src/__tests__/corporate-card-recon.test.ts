import { describe, expect, it } from 'vitest';

import { reconcileCorporateCard } from '../calculators/corporate-card-recon';

describe('EM-06 — Corporate card reconciliation hook', () => {
  const txns = [
    { txnId: 'TXN-1', cardLast4: '1234', amountMinor: 5_000, dateIso: '2025-12-01', merchantName: 'Office Depot' },
    { txnId: 'TXN-2', cardLast4: '1234', amountMinor: 12_000, dateIso: '2025-12-05', merchantName: 'Amazon' },
  ];
  const claims = [
    { claimId: 'CLM-1', amountMinor: 5_000, dateIso: '2025-12-01', merchantName: 'Office Depot' },
    { claimId: 'CLM-3', amountMinor: 3_000, dateIso: '2025-12-10', merchantName: 'Staples' },
  ];

  it('matches transactions to claims by amount+date', () => {
    const r = reconcileCorporateCard(txns, claims);
    expect(r.result.matchedCount).toBe(1);
  });

  it('reports unmatched transactions', () => {
    const r = reconcileCorporateCard(txns, claims);
    expect(r.result.unmatchedTxnCount).toBe(1);
  });

  it('reports unmatched claims', () => {
    const r = reconcileCorporateCard(txns, claims);
    expect(r.result.unmatchedClaimCount).toBe(1);
  });

  it('handles all matched scenario', () => {
    const r = reconcileCorporateCard(
      [{ txnId: 'TXN-1', cardLast4: '1234', amountMinor: 5_000, dateIso: '2025-12-01', merchantName: 'X' }],
      [{ claimId: 'CLM-1', amountMinor: 5_000, dateIso: '2025-12-01', merchantName: 'X' }],
    );
    expect(r.result.matchedCount).toBe(1);
    expect(r.result.unmatchedTxnCount).toBe(0);
    expect(r.result.unmatchedClaimCount).toBe(0);
  });

  it('throws on empty data', () => {
    expect(() => reconcileCorporateCard([], [])).toThrow('No data');
  });
});
