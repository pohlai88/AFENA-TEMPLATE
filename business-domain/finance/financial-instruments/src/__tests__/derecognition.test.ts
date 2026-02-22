import { describe, expect, it } from 'vitest';

import { evaluateDerecognition } from '../calculators/derecognition';

describe('FI-06 — Derecognition: transfer of risks and rewards test', () => {
  const base = {
    assetId: 'ASSET-001',
    carryingAmountMinor: 100_000,
    considerationReceivedMinor: 105_000,
    risksTransferredPercent: 95,
    rewardsTransferredPercent: 95,
    controlRetained: false,
  };

  it('derecognises when risks and rewards substantially transferred (≥90%)', () => {
    const r = evaluateDerecognition(base);
    expect(r.result.derecognize).toBe(true);
    expect(r.result.reason).toBe('risks_rewards_transferred');
    expect(r.result.retainedInterestMinor).toBe(0);
    expect(r.result.gainOrLossMinor).toBe(5_000);
  });

  it('does not derecognise when risks and rewards retained (≤10%)', () => {
    const r = evaluateDerecognition({ ...base, risksTransferredPercent: 5, rewardsTransferredPercent: 5 });
    expect(r.result.derecognize).toBe(false);
    expect(r.result.reason).toBe('risks_rewards_retained');
    expect(r.result.gainOrLossMinor).toBe(0);
  });

  it('uses continuing involvement when transfer is partial and control retained', () => {
    const r = evaluateDerecognition({
      ...base,
      risksTransferredPercent: 50,
      rewardsTransferredPercent: 50,
      controlRetained: true,
    });
    expect(r.result.derecognize).toBe(false);
    expect(r.result.reason).toBe('continuing_involvement');
    expect(r.result.retainedInterestMinor).toBe(50_000);
  });

  it('derecognises partial transfer when control not retained', () => {
    const r = evaluateDerecognition({
      ...base,
      risksTransferredPercent: 60,
      rewardsTransferredPercent: 60,
      controlRetained: false,
    });
    expect(r.result.derecognize).toBe(true);
    expect(r.result.reason).toBe('continuing_involvement');
  });

  it('throws on missing assetId', () => {
    expect(() => evaluateDerecognition({ ...base, assetId: '' })).toThrow('assetId');
  });

  it('throws on invalid risksTransferredPercent', () => {
    expect(() => evaluateDerecognition({ ...base, risksTransferredPercent: 110 })).toThrow('risksTransferredPercent');
  });

  it('includes explanation', () => {
    const r = evaluateDerecognition(base);
    expect(r.explanation).toContain('Derecognise');
  });
});
