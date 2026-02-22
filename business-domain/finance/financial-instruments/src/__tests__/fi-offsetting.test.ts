import { describe, expect, it } from 'vitest';
import { evaluateOffsetting } from '../calculators/fi-offsetting';
import type { OffsettingCandidate } from '../calculators/fi-offsetting';

describe('evaluateOffsetting', () => {
  it('qualifies pair with legal right and net settlement intent', () => {
    const candidates: OffsettingCandidate[] = [{
      assetId: 'a1', liabilityId: 'l1', counterpartyId: 'cp-1',
      assetAmountMinor: 500000, liabilityAmountMinor: 300000,
      hasLegalRight: true, intendNetSettlement: true, masterNettingAgreement: true,
    }];
    const { result } = evaluateOffsetting(candidates);
    expect(result.qualifyingPairs).toHaveLength(1);
    expect(result.qualifyingPairs[0]!.netAmountMinor).toBe(200000);
    expect(result.qualifyingPairs[0]!.side).toBe('asset');
    expect(result.qualifyingPairs[0]!.offsetAmountMinor).toBe(300000);
  });

  it('rejects pair without legal right (IAS 32 §42a)', () => {
    const candidates: OffsettingCandidate[] = [{
      assetId: 'a2', liabilityId: 'l2', counterpartyId: 'cp-2',
      assetAmountMinor: 500000, liabilityAmountMinor: 300000,
      hasLegalRight: false, intendNetSettlement: true, masterNettingAgreement: true,
    }];
    const { result } = evaluateOffsetting(candidates);
    expect(result.nonQualifyingPairs).toHaveLength(1);
    expect(result.nonQualifyingPairs[0]!.reason).toContain('§42a');
  });

  it('rejects pair without net settlement intent (IAS 32 §42b)', () => {
    const candidates: OffsettingCandidate[] = [{
      assetId: 'a3', liabilityId: 'l3', counterpartyId: 'cp-3',
      assetAmountMinor: 500000, liabilityAmountMinor: 300000,
      hasLegalRight: true, intendNetSettlement: false, masterNettingAgreement: false,
    }];
    const { result } = evaluateOffsetting(candidates);
    expect(result.nonQualifyingPairs).toHaveLength(1);
    expect(result.nonQualifyingPairs[0]!.reason).toContain('§42b');
  });

  it('computes total offset amount', () => {
    const candidates: OffsettingCandidate[] = [
      { assetId: 'a4', liabilityId: 'l4', counterpartyId: 'cp-4', assetAmountMinor: 500000, liabilityAmountMinor: 300000, hasLegalRight: true, intendNetSettlement: true, masterNettingAgreement: true },
      { assetId: 'a5', liabilityId: 'l5', counterpartyId: 'cp-5', assetAmountMinor: 200000, liabilityAmountMinor: 200000, hasLegalRight: true, intendNetSettlement: true, masterNettingAgreement: true },
    ];
    const { result } = evaluateOffsetting(candidates);
    expect(result.totalOffsetMinor).toBe(500000);
  });

  it('throws for empty candidates', () => {
    expect(() => evaluateOffsetting([])).toThrow('At least one');
  });
});
