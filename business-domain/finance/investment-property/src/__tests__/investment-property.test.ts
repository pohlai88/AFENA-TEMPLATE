import { describe, expect, it, vi } from 'vitest';

import {
  calculateTransferAdjustment,
  measureInvestmentProperty,
} from '../calculators/inv-property-calc';
import {
  buildInvPropertyMeasureIntent,
  buildInvPropertyTransferIntent,
} from '../commands/inv-property-intent';
import { measureProperty, transferProperty } from '../services/inv-property-service';

vi.mock('afenda-database', () => ({ db: {}, dbSession: vi.fn() }));

describe('measureInvestmentProperty', () => {
  it('fair-value model: recognises gain in P&L', () => {
    const { result: r } = measureInvestmentProperty({
      model: 'fair-value',
      prevValueMinor: 500_000,
      currValueMinor: 550_000,
    });
    expect(r.carryingMinor).toBe(550_000);
    expect(r.gainLossMinor).toBe(50_000);
    expect(r.recogniseTo).toBe('pnl');
    expect(r.model).toBe('fair-value');
  });

  it('fair-value model: recognises loss in P&L', () => {
    const { result: r } = measureInvestmentProperty({
      model: 'fair-value',
      prevValueMinor: 500_000,
      currValueMinor: 450_000,
    });
    expect(r.gainLossMinor).toBe(-50_000);
  });

  it('cost model: no gain/loss recognised', () => {
    const { result: r } = measureInvestmentProperty({
      model: 'cost',
      prevValueMinor: 500_000,
      currValueMinor: 480_000,
    });
    expect(r.gainLossMinor).toBe(0);
    expect(r.recogniseTo).toBe('none');
  });
});

describe('calculateTransferAdjustment', () => {
  it('to-investment: surplus when FV > carrying', () => {
    const { result: r } = calculateTransferAdjustment({
      direction: 'to-investment',
      carryingMinor: 400_000,
      fairValueMinor: 500_000,
    });
    expect(r.transferValueMinor).toBe(500_000);
    expect(r.revaluationSurplusMinor).toBe(100_000);
  });

  it('to-investment: no surplus when FV <= carrying', () => {
    const { result: r } = calculateTransferAdjustment({
      direction: 'to-investment',
      carryingMinor: 500_000,
      fairValueMinor: 480_000,
    });
    expect(r.revaluationSurplusMinor).toBe(0);
  });

  it('from-investment: transfer at fair value', () => {
    const { result: r } = calculateTransferAdjustment({
      direction: 'from-investment',
      carryingMinor: 400_000,
      fairValueMinor: 500_000,
    });
    expect(r.transferValueMinor).toBe(500_000);
    expect(r.revaluationSurplusMinor).toBe(0);
  });
});

describe('buildInvPropertyMeasureIntent', () => {
  it('builds inv-property.measure intent', () => {
    const intent = buildInvPropertyMeasureIntent({
      propertyId: 'ip-1',
      model: 'fair-value',
      prevValueMinor: 500_000,
      currValueMinor: 550_000,
      periodKey: '2025-P06',
    });
    expect(intent.type).toBe('inv-property.measure');
    expect(intent.idempotencyKey).toBeTruthy();
  });
});

describe('buildInvPropertyTransferIntent', () => {
  it('builds inv-property.transfer intent', () => {
    const intent = buildInvPropertyTransferIntent({
      propertyId: 'ip-1',
      direction: 'to-investment',
      fromCategory: 'ppe',
      toCategory: 'investment-property',
      transferDate: '2025-06-15',
      carryingMinor: 400_000,
    });
    expect(intent.type).toBe('inv-property.transfer');
  });
});

describe('measureProperty (service)', () => {
  it('returns inv-property.measure intent', async () => {
    const r = await measureProperty({} as any, { orgId: 'o1', userId: 'u1' } as any, {
      propertyId: 'ip-1',
      model: 'fair-value',
      prevValueMinor: 500_000,
      currValueMinor: 550_000,
      periodKey: '2025-P06',
    });
    expect(r.kind).toBe('intent');
  });
});

describe('transferProperty (service)', () => {
  it('returns inv-property.transfer intent', async () => {
    const r = await transferProperty({} as any, { orgId: 'o1', userId: 'u1' } as any, {
      propertyId: 'ip-1',
      direction: 'to-investment',
      fromCategory: 'ppe',
      toCategory: 'investment-property',
      transferDate: '2025-06-15',
      carryingMinor: 400_000,
    });
    expect(r.kind).toBe('intent');
  });
});
