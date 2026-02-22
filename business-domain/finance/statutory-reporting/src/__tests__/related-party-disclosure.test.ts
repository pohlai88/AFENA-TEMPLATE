import { describe, expect, it } from 'vitest';
import { generateRelatedPartyDisclosure } from '../calculators/related-party-disclosure';

describe('SR-07 — Related Party Disclosure', () => {
  const baseInput = {
    reportingEntityName: 'Acme US',
    fiscalYear: '2025',
    parentEntityName: 'Acme Group NV',
    ultimateParentName: 'Acme Holdings',
    transactions: [
      { transactionId: 'T1', relatedPartyName: 'Acme Group NV', relationship: 'parent' as const, transactionType: 'Management fees', amountMinor: 200_000, outstandingBalanceMinor: 50_000 },
      { transactionId: 'T2', relatedPartyName: 'Acme UK', relationship: 'subsidiary' as const, transactionType: 'IC sales', amountMinor: 300_000, outstandingBalanceMinor: 80_000 },
    ],
    keyManagementCompensation: [
      { category: 'short-term-benefits' as const, amountMinor: 500_000 },
      { category: 'share-based' as const, amountMinor: 150_000 },
    ],
  };

  it('groups transactions by relationship', () => {
    const { result } = generateRelatedPartyDisclosure(baseInput);
    expect(result.categories).toHaveLength(2);
    expect(result.totalTransactionCount).toBe(2);
    expect(result.totalTransactionValueMinor).toBe(500_000);
  });

  it('computes key management compensation total', () => {
    const { result } = generateRelatedPartyDisclosure(baseInput);
    expect(result.totalKeyManagementCompMinor).toBe(650_000);
    expect(result.keyManagementBreakdown).toHaveLength(2);
  });

  it('includes parent and ultimate parent', () => {
    const { result } = generateRelatedPartyDisclosure(baseInput);
    expect(result.parentEntity).toBe('Acme Group NV');
    expect(result.ultimateParent).toBe('Acme Holdings');
  });

  it('handles empty transactions', () => {
    const { result } = generateRelatedPartyDisclosure({
      ...baseInput, transactions: [], keyManagementCompensation: [],
    });
    expect(result.categories).toHaveLength(0);
    expect(result.totalKeyManagementCompMinor).toBe(0);
  });

  it('returns CalculatorResult shape', () => {
    const res = generateRelatedPartyDisclosure(baseInput);
    expect(res).toHaveProperty('result');
    expect(res).toHaveProperty('inputs');
    expect(res).toHaveProperty('explanation');
  });

  it('throws on missing entity name', () => {
    expect(() => generateRelatedPartyDisclosure({ ...baseInput, reportingEntityName: '' })).toThrow('reportingEntityName is required');
  });
});
