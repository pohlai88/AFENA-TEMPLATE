import { describe, expect, it, vi } from 'vitest';

import { computeOciMovement, testEffectiveness } from '../calculators/hedge-calc';
import {
  buildHedgeDesignateIntent,
  buildHedgeEffectivenessIntent,
  buildOciReclassIntent,
} from '../commands/hedge-intent';

vi.mock('afenda-database', () => ({
  db: {},
  dbSession: vi.fn(),
  hedgeDesignations: { orgId: 'orgId', id: 'id' },
  hedgeEffectivenessTests: { orgId: 'orgId', id: 'id' },
}));

/* ────────── testEffectiveness ────────── */

describe('testEffectiveness', () => {
  it('returns effective for ratio within 80-125%', () => {
    const { result } = testEffectiveness({
      hedgingInstrumentChangeMinor: -95_000,
      hedgedItemChangeMinor: 100_000,
    });
    expect(result.isEffective).toBe(true);
    expect(result.ratio).toBeGreaterThanOrEqual(0.8);
    expect(result.ratio).toBeLessThanOrEqual(1.25);
  });

  it('returns ineffective for ratio outside corridor', () => {
    const { result } = testEffectiveness({
      hedgingInstrumentChangeMinor: -50_000,
      hedgedItemChangeMinor: 100_000,
    });
    expect(result.isEffective).toBe(false);
    expect(result.ratio).toBeLessThan(0.8);
  });

  it('handles 100% perfect hedge', () => {
    const { result } = testEffectiveness({
      hedgingInstrumentChangeMinor: -100_000,
      hedgedItemChangeMinor: 100_000,
    });
    expect(result.ratio).toBe(1);
    expect(result.isEffective).toBe(true);
  });

  it('handles both-zero as trivially effective', () => {
    const { result } = testEffectiveness({
      hedgingInstrumentChangeMinor: 0,
      hedgedItemChangeMinor: 0,
    });
    expect(result.isEffective).toBe(true);
  });

  it('handles hedged item zero with non-zero instrument as ineffective', () => {
    const { result } = testEffectiveness({
      hedgingInstrumentChangeMinor: 10_000,
      hedgedItemChangeMinor: 0,
    });
    expect(result.isEffective).toBe(false);
  });
});

/* ────────── computeOciMovement ────────── */

describe('computeOciMovement', () => {
  it('applies lower-of test for OCI recognition', () => {
    const { result } = computeOciMovement({
      cumulativeInstrumentMinor: 80_000,
      cumulativeHedgedItemMinor: -100_000,
    });
    // lower of abs(80k) and abs(-100k) = 80k, sign = positive
    expect(result.ociAmountMinor).toBe(80_000);
    expect(result.reclassToPlMinor).toBe(0);
  });

  it('routes excess to P&L as ineffective portion', () => {
    const { result } = computeOciMovement({
      cumulativeInstrumentMinor: 120_000,
      cumulativeHedgedItemMinor: -100_000,
    });
    // lower of 120k, 100k = 100k oci; excess 20k → P&L
    expect(result.ociAmountMinor).toBe(100_000);
    expect(result.reclassToPlMinor).toBe(20_000);
  });

  it('handles negative instrument gain', () => {
    const { result } = computeOciMovement({
      cumulativeInstrumentMinor: -60_000,
      cumulativeHedgedItemMinor: 80_000,
    });
    // lower of 60k, 80k = 60k, sign = negative
    expect(result.ociAmountMinor).toBe(-60_000);
    expect(result.reclassToPlMinor).toBe(0);
  });
});

/* ────────── Intent Builders ────────── */

describe('buildHedgeDesignateIntent', () => {
  it('builds hedge.designate intent', () => {
    const intent = buildHedgeDesignateIntent({
      hedgeType: 'cash-flow',
      hedgingInstrumentId: 'fi-1',
      hedgedItemId: 'item-1',
      designationDate: '2025-01-15',
      riskNature: 'interest-rate',
    });
    expect(intent.type).toBe('hedge.designate');
    expect(intent.payload.hedgeType).toBe('cash-flow');
    expect(intent.idempotencyKey).toBeTruthy();
  });
});

describe('buildHedgeEffectivenessIntent', () => {
  it('builds hedge.effectiveness intent', () => {
    const intent = buildHedgeEffectivenessIntent({
      designationId: 'hd-1',
      testDate: '2025-06-30',
      ratio: 0.95,
      isEffective: true,
      method: 'dollar-offset',
    });
    expect(intent.type).toBe('hedge.effectiveness');
    expect(intent.payload.ratio).toBe(0.95);
  });
});

describe('buildOciReclassIntent', () => {
  it('builds hedge.oci.reclass intent', () => {
    const intent = buildOciReclassIntent({
      designationId: 'hd-1',
      reclassAmountMinor: 80_000,
      fromReserve: 'oci',
      periodKey: '2025-P06',
      effectiveAt: '2025-06-30T23:59:59Z',
      reason: 'Hedged item sold',
    });
    expect(intent.type).toBe('hedge.oci.reclass');
    expect(intent.payload.reclassAmountMinor).toBe(80_000);
    expect(intent.payload.fromReserve).toBe('oci');
  });
});
