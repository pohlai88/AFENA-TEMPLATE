import { describe, expect, it } from 'vitest';

import { computeProvisionUtilisation } from '../calculators/provision-utilisation';
import { computeProvisionReversal } from '../calculators/provision-reversal';
import { assessContingentLiability } from '../calculators/contingent-liability-assessment';

describe('computeProvisionUtilisation', () => {
  it('utilises within balance', () => {
    const { result } = computeProvisionUtilisation({
      provisionBalanceMinor: 100_000, expenditureMinor: 60_000,
      utilisationDate: '2025-06-15',
    });
    expect(result.utilisedMinor).toBe(60_000);
    expect(result.excessMinor).toBe(0);
    expect(result.remainingBalanceMinor).toBe(40_000);
  });

  it('identifies excess expenditure', () => {
    const { result } = computeProvisionUtilisation({
      provisionBalanceMinor: 50_000, expenditureMinor: 80_000,
      utilisationDate: '2025-06-15',
    });
    expect(result.utilisedMinor).toBe(50_000);
    expect(result.excessMinor).toBe(30_000);
    expect(result.remainingBalanceMinor).toBe(0);
  });

  it('throws on negative balance', () => {
    expect(() => computeProvisionUtilisation({
      provisionBalanceMinor: -1, expenditureMinor: 0, utilisationDate: '2025-01-01',
    })).toThrow('cannot be negative');
  });
});

describe('computeProvisionReversal', () => {
  it('reverses partially', () => {
    const { result } = computeProvisionReversal({
      provisionBalanceMinor: 100_000, reversalAmountMinor: 40_000,
      reason: 'probability_reduced',
    });
    expect(result.reversedMinor).toBe(40_000);
    expect(result.remainingBalanceMinor).toBe(60_000);
    expect(result.isFullReversal).toBe(false);
  });

  it('reverses fully', () => {
    const { result } = computeProvisionReversal({
      provisionBalanceMinor: 50_000, reversalAmountMinor: 50_000,
      reason: 'obligation_settled',
    });
    expect(result.isFullReversal).toBe(true);
    expect(result.remainingBalanceMinor).toBe(0);
  });

  it('throws when reversal exceeds balance', () => {
    expect(() => computeProvisionReversal({
      provisionBalanceMinor: 50_000, reversalAmountMinor: 60_000,
      reason: 'estimate_revised',
    })).toThrow('cannot exceed');
  });
});

describe('assessContingentLiability', () => {
  it('recognises as provision when probable and estimable', () => {
    const { result } = assessContingentLiability({
      description: 'Lawsuit', isProbable: true, isPossible: true,
      isRemote: false, canEstimate: true, bestEstimateMinor: 200_000,
    });
    expect(result.classification).toBe('provision');
    expect(result.recogniseMinor).toBe(200_000);
  });

  it('discloses when probable but not estimable', () => {
    const { result } = assessContingentLiability({
      description: 'Lawsuit', isProbable: true, isPossible: true,
      isRemote: false, canEstimate: false,
    });
    expect(result.classification).toBe('contingent-liability-disclose');
  });

  it('discloses when possible', () => {
    const { result } = assessContingentLiability({
      description: 'Warranty', isProbable: false, isPossible: true,
      isRemote: false, canEstimate: true, bestEstimateMinor: 50_000,
    });
    expect(result.classification).toBe('contingent-liability-disclose');
  });

  it('no disclosure when remote', () => {
    const { result } = assessContingentLiability({
      description: 'Frivolous claim', isProbable: false, isPossible: false,
      isRemote: true, canEstimate: false,
    });
    expect(result.classification).toBe('no-disclosure');
  });
});
