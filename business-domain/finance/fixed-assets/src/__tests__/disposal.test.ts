import { describe, expect, it } from 'vitest';
import { computeDisposalGainLoss } from '../calculators/disposal';

describe('computeDisposalGainLoss', () => {
  it('computes gain when proceeds > NBV', () => {
    const r = computeDisposalGainLoss(30_000, 50_000).result;
    expect(r.gainLossMinor).toBe(20_000);
    expect(r.isGain).toBe(true);
  });

  it('computes loss when proceeds < NBV', () => {
    const r = computeDisposalGainLoss(50_000, 30_000).result;
    expect(r.gainLossMinor).toBe(-20_000);
    expect(r.isGain).toBe(false);
  });

  it('break-even', () => {
    const r = computeDisposalGainLoss(40_000, 40_000).result;
    expect(r.gainLossMinor).toBe(0);
    expect(r.isGain).toBe(true);
  });

  it('throws on negative proceeds', () => {
    expect(() => computeDisposalGainLoss(10_000, -1)).toThrow('proceedsMinor');
  });
});
