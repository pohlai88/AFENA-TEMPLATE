import { describe, expect, it, vi } from 'vitest';

import {
  calculateTemporaryDifferences,
  computeDeferredTax,
} from '../calculators/deferred-tax-calc';
import {
  buildDeferredTaxCalculateIntent,
  buildDeferredTaxRecogniseIntent,
} from '../commands/deferred-tax-intent';
import { calculateAndRecognise } from '../services/deferred-tax-service';

vi.mock('afenda-database', () => ({
  db: {},
  dbSession: vi.fn(),
}));

describe('calculateTemporaryDifferences', () => {
  it('identifies taxable difference when carrying > tax base', () => {
    const { result } = calculateTemporaryDifferences([
      { accountId: 'acc-1', carryingMinor: 100_000, taxBaseMinor: 80_000 },
    ]);
    expect(result[0]!.differenceType).toBe('taxable');
    expect(result[0]!.differenceMinor).toBe(20_000);
  });

  it('identifies deductible difference when carrying < tax base', () => {
    const { result } = calculateTemporaryDifferences([
      { accountId: 'acc-2', carryingMinor: 60_000, taxBaseMinor: 80_000 },
    ]);
    expect(result[0]!.differenceType).toBe('deductible');
    expect(result[0]!.differenceMinor).toBe(-20_000);
  });

  it('handles zero difference', () => {
    const { result } = calculateTemporaryDifferences([
      { accountId: 'acc-3', carryingMinor: 50_000, taxBaseMinor: 50_000 },
    ]);
    expect(result[0]!.differenceMinor).toBe(0);
    expect(result[0]!.differenceType).toBe('deductible');
  });
});

describe('computeDeferredTax', () => {
  it('computes DTL for taxable differences at 25%', () => {
    const { result: diffs } = calculateTemporaryDifferences([
      { accountId: 'acc-1', carryingMinor: 200_000, taxBaseMinor: 150_000 },
    ]);
    const { result } = computeDeferredTax({ differences: diffs, taxRate: 0.25 });
    expect(result.dtlMinor).toBe(12_500);
    expect(result.dtaMinor).toBe(0);
  });

  it('computes DTA for deductible differences', () => {
    const { result: diffs } = calculateTemporaryDifferences([
      { accountId: 'acc-2', carryingMinor: 100_000, taxBaseMinor: 140_000 },
    ]);
    const { result } = computeDeferredTax({ differences: diffs, taxRate: 0.25 });
    expect(result.dtaMinor).toBe(10_000);
    expect(result.dtlMinor).toBe(0);
  });

  it('computes net position and movement from prior', () => {
    const { result: diffs } = calculateTemporaryDifferences([
      { accountId: 'a1', carryingMinor: 200_000, taxBaseMinor: 150_000 },
      { accountId: 'a2', carryingMinor: 100_000, taxBaseMinor: 130_000 },
    ]);
    const { result } = computeDeferredTax({
      differences: diffs,
      taxRate: 0.2,
      priorDtaMinor: 5_000,
      priorDtlMinor: 8_000,
    });
    expect(result.dtlMinor).toBe(10_000);
    expect(result.dtaMinor).toBe(6_000);
    expect(result.netPositionMinor).toBe(-4_000);
    const priorNet = 5_000 - 8_000;
    expect(result.movementMinor).toBe(-4_000 - priorNet);
  });
});

describe('buildDeferredTaxCalculateIntent', () => {
  it('builds deferred-tax.calculate intent', () => {
    const intent = buildDeferredTaxCalculateIntent({
      entityId: 'ent-1',
      periodKey: '2025-P12',
      taxRate: 0.25,
      temporaryDifferences: [
        { accountId: 'a1', carryingMinor: 100, taxBaseMinor: 80, differenceType: 'taxable' },
      ],
    });
    expect(intent.type).toBe('deferred-tax.calculate');
    expect(intent.idempotencyKey).toBeTruthy();
  });
});

describe('buildDeferredTaxRecogniseIntent', () => {
  it('builds deferred-tax.recognise intent', () => {
    const intent = buildDeferredTaxRecogniseIntent({
      entityId: 'ent-1',
      periodKey: '2025-P12',
      dtaMinor: 10_000,
      dtlMinor: 5_000,
      movementMinor: 3_000,
      recogniseTo: 'pnl',
    });
    expect(intent.type).toBe('deferred-tax.recognise');
  });
});

describe('calculateAndRecognise (service)', () => {
  it('returns two intents: calculate + recognise', async () => {
    const result = await calculateAndRecognise(
      {} as any,
      { orgId: 'org-1', userId: 'u-1' } as any,
      {
        entityId: 'ent-1',
        periodKey: '2025-P12',
        taxRate: 0.25,
        items: [{ accountId: 'a1', carryingMinor: 200_000, taxBaseMinor: 150_000 }],
      },
    );
    expect(result.kind).toBe('intent');
    if (result.kind === 'intent') {
      expect(result.intents).toHaveLength(2);
      expect(result.intents[0]!.type).toBe('deferred-tax.calculate');
      expect(result.intents[1]!.type).toBe('deferred-tax.recognise');
    }
  });
});
