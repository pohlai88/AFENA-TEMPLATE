import { describe, expect, it, vi } from 'vitest';

import {
  classifyInstrument,
  computeEffectiveInterest,
  computeFairValueChange,
} from '../calculators/fi-calc';
import { buildEirAccrualIntent, buildFvChangeIntent } from '../commands/fi-intent';

vi.mock('afenda-database', () => ({
  db: {},
  dbSession: vi.fn(),
  financialInstruments: { orgId: 'orgId', id: 'id' },
}));

/* ────────── classifyInstrument ────────── */

describe('classifyInstrument', () => {
  it('classifies hold-to-collect + SPPI as amortised cost', () => {
    const { result } = classifyInstrument({
      businessModel: 'hold-to-collect',
      sppiPassed: true,
    });
    expect(result.classification).toBe('amortised-cost');
  });

  it('classifies hold-to-collect-and-sell + SPPI as FVOCI', () => {
    const { result } = classifyInstrument({
      businessModel: 'hold-to-collect-and-sell',
      sppiPassed: true,
    });
    expect(result.classification).toBe('fvoci');
  });

  it('classifies other business model as FVTPL', () => {
    const { result } = classifyInstrument({
      businessModel: 'other',
      sppiPassed: true,
    });
    expect(result.classification).toBe('fvtpl');
  });

  it('classifies SPPI failure as FVTPL regardless of model', () => {
    const { result } = classifyInstrument({
      businessModel: 'hold-to-collect',
      sppiPassed: false,
    });
    expect(result.classification).toBe('fvtpl');
    expect(result.explanation).toContain('SPPI test failed');
  });
});

/* ────────── computeEffectiveInterest ────────── */

describe('computeEffectiveInterest', () => {
  it('computes monthly EIR accrual', () => {
    const { result } = computeEffectiveInterest({
      carryingMinor: 1_000_000,
      effectiveRate: 0.06, // 6% annual
    });
    // 1M * 0.06/12 = 5000
    expect(result.interestMinor).toBe(5_000);
    expect(result.newCarryingMinor).toBe(1_005_000);
  });

  it('handles zero rate', () => {
    const { result } = computeEffectiveInterest({
      carryingMinor: 1_000_000,
      effectiveRate: 0,
    });
    expect(result.interestMinor).toBe(0);
    expect(result.newCarryingMinor).toBe(1_000_000);
  });
});

/* ────────── computeFairValueChange ────────── */

describe('computeFairValueChange', () => {
  it('routes FVTPL changes to P&L', () => {
    const { result } = computeFairValueChange({
      prevFvMinor: 1_000_000,
      currFvMinor: 1_050_000,
      classification: 'fvtpl',
    });
    expect(result.changeMinor).toBe(50_000);
    expect(result.recogniseTo).toBe('pnl');
  });

  it('routes FVOCI changes to OCI', () => {
    const { result } = computeFairValueChange({
      prevFvMinor: 1_000_000,
      currFvMinor: 980_000,
      classification: 'fvoci',
    });
    expect(result.changeMinor).toBe(-20_000);
    expect(result.recogniseTo).toBe('oci');
  });

  it('returns zero change for amortised cost', () => {
    const { result } = computeFairValueChange({
      prevFvMinor: 1_000_000,
      currFvMinor: 1_050_000,
      classification: 'amortised-cost',
    });
    expect(result.changeMinor).toBe(0);
  });
});

/* ────────── Intent Builders ────────── */

describe('buildFvChangeIntent', () => {
  it('builds fi.fv.change intent', () => {
    const intent = buildFvChangeIntent({
      instrumentId: 'fi-1',
      prevFvMinor: 1_000_000,
      currFvMinor: 1_050_000,
      classification: 'fvtpl',
      periodKey: '2025-P06',
    });
    expect(intent.type).toBe('fi.fv.change');
    expect(intent.payload).toEqual({
      instrumentId: 'fi-1',
      prevFvMinor: 1_000_000,
      currFvMinor: 1_050_000,
      classification: 'fvtpl',
      periodKey: '2025-P06',
    });
    expect(intent.idempotencyKey).toBeTruthy();
  });
});

describe('buildEirAccrualIntent', () => {
  it('builds fi.eir.accrue intent', () => {
    const intent = buildEirAccrualIntent({
      instrumentId: 'fi-1',
      periodKey: '2025-P06',
      effectiveAt: '2025-06-30T23:59:59Z',
      interestMinor: 5_000,
      effectiveRate: 0.06,
    });
    expect(intent.type).toBe('fi.eir.accrue');
    expect(intent.payload.interestMinor).toBe(5_000);
  });
});
