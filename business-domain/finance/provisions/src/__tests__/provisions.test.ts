import { describe, expect, it, vi } from 'vitest';

import { recogniseProvision, unwindDiscount } from '../calculators/provision-calc';
import {
  buildProvisionIntent,
  buildProvisionReverseIntent,
  buildProvisionUtiliseIntent,
} from '../commands/provision-intent';
import { recognise, reverse, utilise } from '../services/provision-service';

vi.mock('afenda-database', () => ({
  db: {},
  dbSession: vi.fn(),
  provisions: { orgId: 'orgId', id: 'id' },
  provisionMovements: { orgId: 'orgId', provisionId: 'provisionId' },
}));

/* ────────── recogniseProvision ────────── */

describe('recogniseProvision', () => {
  it('recognises when probable and estimable', () => {
    const { result } = recogniseProvision({
      isProbable: true,
      canEstimate: true,
      bestEstimateMinor: 500_000,
    });
    expect(result.shouldRecognise).toBe(true);
    expect(result.bestEstimateMinor).toBe(500_000);
  });

  it('rejects when not probable', () => {
    const { result } = recogniseProvision({
      isProbable: false,
      canEstimate: true,
      bestEstimateMinor: 500_000,
    });
    expect(result.shouldRecognise).toBe(false);
    expect(result.explanation).toContain('not probable');
  });

  it('rejects when cannot estimate', () => {
    const { result } = recogniseProvision({
      isProbable: true,
      canEstimate: false,
      bestEstimateMinor: 500_000,
    });
    expect(result.shouldRecognise).toBe(false);
    expect(result.explanation).toContain('reliable estimate');
  });

  it('computes present value when discount rate provided', () => {
    const { result } = recogniseProvision({
      isProbable: true,
      canEstimate: true,
      bestEstimateMinor: 1_000_000,
      discountRate: 0.05,
      periodsToSettlement: 3,
    });
    expect(result.shouldRecognise).toBe(true);
    expect(result.presentValueMinor).toBeDefined();
    expect(result.presentValueMinor!).toBeLessThan(1_000_000);
    // PV = 1000000 / (1.05)^3 ≈ 863838
    expect(result.presentValueMinor!).toBeCloseTo(863_838, -1);
  });

  it('returns null PV when no discount rate', () => {
    const { result } = recogniseProvision({
      isProbable: true,
      canEstimate: true,
      bestEstimateMinor: 500_000,
    });
    expect(result.presentValueMinor).toBeNull();
  });
});

/* ────────── unwindDiscount ────────── */

describe('unwindDiscount', () => {
  it('computes unwinding charge', () => {
    const { result } = unwindDiscount({
      currentCarryingMinor: 863_838,
      discountRate: 0.05,
    });
    expect(result.unwindChargeMinor).toBe(Math.round(863_838 * 0.05));
    expect(result.newCarryingMinor).toBe(863_838 + result.unwindChargeMinor);
  });

  it('returns zero when rate is zero', () => {
    const { result } = unwindDiscount({
      currentCarryingMinor: 500_000,
      discountRate: 0,
    });
    expect(result.unwindChargeMinor).toBe(0);
    expect(result.newCarryingMinor).toBe(500_000);
  });
});

/* ────────── Intent Builders ────────── */

describe('buildProvisionIntent', () => {
  it('builds provision.recognise intent', () => {
    const intent = buildProvisionIntent({
      provisionId: 'prov-1',
      obligationType: 'warranty',
      bestEstimateMinor: 100_000,
      recognitionDate: '2025-01-01',
    });
    expect(intent.type).toBe('provision.recognise');
    expect(intent.payload).toEqual({
      provisionId: 'prov-1',
      obligationType: 'warranty',
      bestEstimateMinor: 100_000,
      recognitionDate: '2025-01-01',
    });
    expect(intent.idempotencyKey).toBeTruthy();
  });
});

describe('buildProvisionUtiliseIntent', () => {
  it('builds provision.utilise intent', () => {
    const intent = buildProvisionUtiliseIntent({
      provisionId: 'prov-1',
      amountMinor: 30_000,
      utilisationDate: '2025-06-15',
      reason: 'Warranty claim settled',
    });
    expect(intent.type).toBe('provision.utilise');
    expect(intent.payload.amountMinor).toBe(30_000);
  });
});

describe('buildProvisionReverseIntent', () => {
  it('builds provision.reverse intent', () => {
    const intent = buildProvisionReverseIntent({
      provisionId: 'prov-1',
      amountMinor: 70_000,
      reversalDate: '2025-12-31',
      reason: 'Obligation no longer probable',
    });
    expect(intent.type).toBe('provision.reverse');
    expect(intent.payload.reason).toBe('Obligation no longer probable');
  });
});

/* ────────── Service (write ops) ────────── */

describe('recognise (service)', () => {
  it('returns intent when probable and estimable', async () => {
    const result = await recognise(null as never, { orgId: 'org-1' } as never, {
      provisionId: 'prov-1',
      obligationType: 'legal',
      bestEstimateMinor: 200_000,
      recognitionDate: '2025-03-01',
      isProbable: true,
      canEstimate: true,
    });
    expect(result.kind).toBe('intent');
    if (result.kind === 'intent') {
      expect(result.intents).toHaveLength(1);
      expect(result.intents[0]!.type).toBe('provision.recognise');
    }
  });

  it('returns read (no-op) when not probable', async () => {
    const result = await recognise(null as never, { orgId: 'org-1' } as never, {
      provisionId: 'prov-2',
      obligationType: 'warranty',
      bestEstimateMinor: 100_000,
      recognitionDate: '2025-03-01',
      isProbable: false,
      canEstimate: true,
    });
    expect(result.kind).toBe('read');
  });
});

describe('utilise (service)', () => {
  it('returns utilise intent', async () => {
    const result = await utilise(null as never, null as never, {
      provisionId: 'prov-1',
      amountMinor: 50_000,
      utilisationDate: '2025-07-01',
      reason: 'Claim paid',
    });
    expect(result.kind).toBe('intent');
    if (result.kind === 'intent') {
      expect(result.intents[0]!.type).toBe('provision.utilise');
    }
  });
});

describe('reverse (service)', () => {
  it('returns reverse intent', async () => {
    const result = await reverse(null as never, null as never, {
      provisionId: 'prov-1',
      amountMinor: 50_000,
      reversalDate: '2025-12-31',
      reason: 'Risk no longer exists',
    });
    expect(result.kind).toBe('intent');
    if (result.kind === 'intent') {
      expect(result.intents[0]!.type).toBe('provision.reverse');
    }
  });
});
