import { describe, expect, it, vi } from 'vitest';

import { calculateAmortisation, capitaliseRnD } from '../calculators/intangible-calc';
import {
  buildAmortiseIntent,
  buildCapitaliseIntent,
  buildImpairIntent,
} from '../commands/intangible-intent';
import { capitalise, impair } from '../services/intangible-service';

vi.mock('afenda-database', () => ({
  db: {},
  dbSession: vi.fn(),
  intangibleAssets: { orgId: 'orgId', id: 'id' },
}));

/* ────────── capitaliseRnD ────────── */

describe('capitaliseRnD', () => {
  it('always expenses research phase', () => {
    const { result } = capitaliseRnD({
      phase: 'research',
      costsMinor: 500_000,
      criteriaMet: true,
    });
    expect(result.shouldCapitalise).toBe(false);
    expect(result.expenseAmountMinor).toBe(500_000);
    expect(result.explanation).toContain('Research phase');
  });

  it('capitalises development when criteria met', () => {
    const { result } = capitaliseRnD({
      phase: 'development',
      costsMinor: 300_000,
      criteriaMet: true,
    });
    expect(result.shouldCapitalise).toBe(true);
    expect(result.capitaliseAmountMinor).toBe(300_000);
    expect(result.expenseAmountMinor).toBe(0);
  });

  it('expenses development when criteria not met', () => {
    const { result } = capitaliseRnD({
      phase: 'development',
      costsMinor: 300_000,
      criteriaMet: false,
    });
    expect(result.shouldCapitalise).toBe(false);
    expect(result.expenseAmountMinor).toBe(300_000);
    expect(result.explanation).toContain('criteria not met');
  });
});

/* ────────── calculateAmortisation ────────── */

describe('calculateAmortisation', () => {
  it('computes straight-line amortisation', () => {
    const { result } = calculateAmortisation({
      acquisitionCostMinor: 1_200_000,
      residualValueMinor: 0,
      accumulatedAmortisationMinor: 0,
      accumulatedImpairmentMinor: 0,
      usefulLifeMonths: 120,
      method: 'straight-line',
    });
    expect(result.periodAmortisationMinor).toBe(10_000); // 1.2M / 120 months
    expect(result.newCarryingMinor).toBe(1_190_000);
  });

  it('computes reducing-balance amortisation', () => {
    const { result } = calculateAmortisation({
      acquisitionCostMinor: 1_200_000,
      residualValueMinor: 0,
      accumulatedAmortisationMinor: 0,
      accumulatedImpairmentMinor: 0,
      usefulLifeMonths: 120,
      method: 'reducing-balance',
    });
    // DDB: annualRate = 2/(120/12) = 0.2, monthly = 0.2/12
    expect(result.periodAmortisationMinor).toBe(Math.round(1_200_000 * (0.2 / 12)));
    expect(result.newCarryingMinor).toBeLessThan(1_200_000);
  });

  it('handles units-of-production', () => {
    const { result } = calculateAmortisation({
      acquisitionCostMinor: 1_000_000,
      residualValueMinor: 100_000,
      accumulatedAmortisationMinor: 0,
      accumulatedImpairmentMinor: 0,
      usefulLifeMonths: 60,
      method: 'units-of-production',
      unitsThisPeriod: 100,
      totalUnits: 1000,
    });
    // (1M - 100K) * 100/1000 = 90,000
    expect(result.periodAmortisationMinor).toBe(90_000);
  });

  it('returns zero when no units provided for UoP', () => {
    const { result } = calculateAmortisation({
      acquisitionCostMinor: 1_000_000,
      residualValueMinor: 0,
      accumulatedAmortisationMinor: 0,
      accumulatedImpairmentMinor: 0,
      usefulLifeMonths: 60,
      method: 'units-of-production',
    });
    expect(result.periodAmortisationMinor).toBe(0);
  });

  it('caps amortisation at carrying - residual', () => {
    const { result } = calculateAmortisation({
      acquisitionCostMinor: 100_000,
      residualValueMinor: 10_000,
      accumulatedAmortisationMinor: 89_000,
      accumulatedImpairmentMinor: 0,
      usefulLifeMonths: 10,
      method: 'straight-line',
    });
    // Only 1,000 left before residual
    expect(result.periodAmortisationMinor).toBe(1_000);
  });
});

/* ────────── Intent Builders ────────── */

describe('buildCapitaliseIntent', () => {
  it('builds intangible.capitalise intent', () => {
    const intent = buildCapitaliseIntent({
      assetId: 'ia-1',
      phase: 'development',
      costsMinor: 300_000,
      periodKey: '2025-P06',
      criteriaMet: true,
    });
    expect(intent.type).toBe('intangible.capitalise');
    expect(intent.payload).toEqual({
      assetId: 'ia-1',
      phase: 'development',
      costsMinor: 300_000,
      periodKey: '2025-P06',
      criteriaMet: true,
    });
    expect(intent.idempotencyKey).toBeTruthy();
  });
});

describe('buildAmortiseIntent', () => {
  it('builds intangible.amortise intent', () => {
    const intent = buildAmortiseIntent({
      assetId: 'ia-1',
      periodKey: '2025-P06',
      amortisationMinor: 10_000,
      method: 'straight-line',
    });
    expect(intent.type).toBe('intangible.amortise');
    expect(intent.payload.amortisationMinor).toBe(10_000);
  });
});

describe('buildImpairIntent', () => {
  it('builds intangible.impair intent', () => {
    const intent = buildImpairIntent({
      assetId: 'ia-1',
      impairmentMinor: 50_000,
      recoverableAmountMinor: 200_000,
      impairmentDate: '2025-12-31',
    });
    expect(intent.type).toBe('intangible.impair');
    expect(intent.payload.impairmentMinor).toBe(50_000);
  });
});

/* ────────── Service ────────── */

describe('capitalise (service)', () => {
  it('returns intent for development with criteria met', async () => {
    const result = await capitalise(null as never, null as never, {
      assetId: 'ia-1',
      phase: 'development',
      costsMinor: 300_000,
      periodKey: '2025-P06',
      criteriaMet: true,
    });
    expect(result.kind).toBe('intent');
    if (result.kind === 'intent') {
      expect(result.intents[0]!.type).toBe('intangible.capitalise');
    }
  });

  it('returns read (no-op) for research phase', async () => {
    const result = await capitalise(null as never, null as never, {
      assetId: 'ia-1',
      phase: 'research',
      costsMinor: 100_000,
      periodKey: '2025-P06',
      criteriaMet: true,
    });
    expect(result.kind).toBe('read');
  });
});

describe('impair (service)', () => {
  it('returns impairment intent', async () => {
    const result = await impair(null as never, null as never, {
      assetId: 'ia-1',
      impairmentMinor: 50_000,
      recoverableAmountMinor: 200_000,
      impairmentDate: '2025-12-31',
    });
    expect(result.kind).toBe('intent');
    if (result.kind === 'intent') {
      expect(result.intents[0]!.type).toBe('intangible.impair');
    }
  });
});
