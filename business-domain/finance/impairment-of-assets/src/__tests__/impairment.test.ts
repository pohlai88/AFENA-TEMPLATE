import { describe, expect, it, vi } from 'vitest';

import { computeRecoverableAmount, testImpairment } from '../calculators/impairment-calc';
import {
  buildImpairmentRecogniseIntent,
  buildImpairmentReverseIntent,
  buildImpairmentTestIntent,
} from '../commands/impairment-intent';
import {
  performImpairmentTest,
  recogniseImpairment,
  reverseImpairment,
} from '../services/impairment-service';

vi.mock('afenda-database', () => ({ db: {}, dbSession: vi.fn() }));

describe('computeRecoverableAmount', () => {
  it('returns higher of VIU and FVLCD', () => {
    expect(computeRecoverableAmount({ viuMinor: 80_000, fvlcdMinor: 90_000 }).result).toBe(90_000);
    expect(computeRecoverableAmount({ viuMinor: 95_000, fvlcdMinor: 85_000 }).result).toBe(95_000);
  });
});

describe('testImpairment', () => {
  it('detects impairment when carrying exceeds recoverable', () => {
    const { result } = testImpairment({
      carryingAmountMinor: 100_000,
      viuMinor: 70_000,
      fvlcdMinor: 80_000,
    });
    expect(result.isImpaired).toBe(true);
    expect(result.lossMinor).toBe(20_000);
    expect(result.recoverableAmountMinor).toBe(80_000);
  });

  it('returns no impairment when carrying ≤ recoverable', () => {
    const { result } = testImpairment({
      carryingAmountMinor: 75_000,
      viuMinor: 80_000,
      fvlcdMinor: 70_000,
    });
    expect(result.isImpaired).toBe(false);
    expect(result.lossMinor).toBe(0);
  });

  it('returns no impairment when exactly equal', () => {
    const { result } = testImpairment({
      carryingAmountMinor: 80_000,
      viuMinor: 80_000,
      fvlcdMinor: 60_000,
    });
    expect(result.isImpaired).toBe(false);
    expect(result.lossMinor).toBe(0);
  });
});

describe('buildImpairmentTestIntent', () => {
  it('builds impairment.test intent', () => {
    const intent = buildImpairmentTestIntent({
      assetId: 'a-1',
      carryingAmountMinor: 100_000,
      recoverableAmountMinor: 80_000,
      viuMinor: 70_000,
      fvlcdMinor: 80_000,
      periodKey: '2025-P12',
    });
    expect(intent.type).toBe('impairment.test');
    expect(intent.idempotencyKey).toBeTruthy();
  });
});

describe('buildImpairmentRecogniseIntent', () => {
  it('builds impairment.recognise intent', () => {
    const intent = buildImpairmentRecogniseIntent({
      assetId: 'a-1',
      lossMinor: 20_000,
      assetType: 'ppe',
      impairmentDate: '2025-12-31',
    });
    expect(intent.type).toBe('impairment.recognise');
  });
});

describe('buildImpairmentReverseIntent', () => {
  it('builds impairment.reverse intent', () => {
    const intent = buildImpairmentReverseIntent({
      assetId: 'a-1',
      reversalMinor: 10_000,
      newCarryingMinor: 90_000,
      reversalDate: '2026-06-30',
      reason: 'Indicator resolved',
    });
    expect(intent.type).toBe('impairment.reverse');
  });
});

describe('performImpairmentTest (service)', () => {
  it('returns impairment.test intent', async () => {
    const result = await performImpairmentTest({} as any, { orgId: 'o1', userId: 'u1' } as any, {
      assetId: 'a-1',
      carryingAmountMinor: 100_000,
      viuMinor: 70_000,
      fvlcdMinor: 80_000,
      periodKey: '2025-P12',
    });
    expect(result.kind).toBe('intent');
    if (result.kind === 'intent') {
      expect(result.intents[0]!.type).toBe('impairment.test');
    }
  });
});

describe('recogniseImpairment (service)', () => {
  it('returns impairment.recognise intent', async () => {
    const result = await recogniseImpairment({} as any, { orgId: 'o1', userId: 'u1' } as any, {
      assetId: 'a-1',
      lossMinor: 20_000,
      assetType: 'ppe',
      impairmentDate: '2025-12-31',
    });
    expect(result.kind).toBe('intent');
  });
});

describe('reverseImpairment (service)', () => {
  it('returns impairment.reverse intent', async () => {
    const result = await reverseImpairment({} as any, { orgId: 'o1', userId: 'u1' } as any, {
      assetId: 'a-1',
      reversalMinor: 10_000,
      newCarryingMinor: 90_000,
      reversalDate: '2026-06-30',
      reason: 'Resolved',
    });
    expect(result.kind).toBe('intent');
  });
});
