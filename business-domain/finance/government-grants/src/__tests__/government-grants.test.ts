import { describe, expect, it, vi } from 'vitest';

import { mockDbSession, testCtx } from '../../../test-utils/integration-helper';
import { computeGrantAmortisation } from '../calculators/grant-calc';
import { buildGrantAmortiseIntent, buildGrantRecogniseIntent } from '../commands/grant-intent';
import type { GrantReadModel } from '../queries/grant-query';
import { amortiseGrant, recogniseGrant } from '../services/grant-service';

// vi.hoisted ensures the variable is available when the hoisted vi.mock factory runs
const { mockGrantRow } = vi.hoisted(() => {
  const row: GrantReadModel = {
    id: 'g-1',
    grantNo: 'GR-001',
    grantType: 'capital',
    periodKey: '2025-P01',
    currencyCode: 'USD',
    grantAmountMinor: 120_000,
    amortisedMinor: 60_000,
    deferredMinor: 60_000,
    relatedAssetId: null,
    conditions: 'Build factory',
    isActive: true,
  };
  return { mockGrantRow: row };
});

vi.mock('../queries/grant-query', () => ({
  getGrant: vi.fn().mockResolvedValue(mockGrantRow),
}));

describe('computeGrantAmortisation', () => {
  it('computes monthly amortisation over useful life', () => {
    const { result: r } = computeGrantAmortisation({
      totalGrantMinor: 120_000,
      cumulativeAmortisedMinor: 0,
      usefulLifeMonths: 12,
    });
    expect(r.periodAmortisationMinor).toBe(10_000);
    expect(r.remainingDeferredMinor).toBe(110_000);
  });

  it('caps at remaining deferred amount', () => {
    const { result: r } = computeGrantAmortisation({
      totalGrantMinor: 120_000,
      cumulativeAmortisedMinor: 115_000,
      usefulLifeMonths: 12,
    });
    expect(r.periodAmortisationMinor).toBe(5_000);
    expect(r.remainingDeferredMinor).toBe(0);
  });

  it('returns zero for zero useful life', () => {
    const { result: r } = computeGrantAmortisation({
      totalGrantMinor: 100_000,
      cumulativeAmortisedMinor: 0,
      usefulLifeMonths: 0,
    });
    expect(r.periodAmortisationMinor).toBe(0);
  });
});

describe('buildGrantRecogniseIntent', () => {
  it('builds grant.recognise intent', () => {
    const intent = buildGrantRecogniseIntent({
      grantId: 'g-1',
      approach: 'capital',
      amountMinor: 100_000,
      grantDate: '2025-01-01',
      conditions: 'Build factory',
    });
    expect(intent.type).toBe('grant.recognise');
    expect(intent.idempotencyKey).toBeTruthy();
  });
});

describe('buildGrantAmortiseIntent', () => {
  it('builds grant.amortise intent', () => {
    const intent = buildGrantAmortiseIntent({
      grantId: 'g-1',
      periodKey: '2025-P06',
      amortisationMinor: 10_000,
      remainingMinor: 50_000,
    });
    expect(intent.type).toBe('grant.amortise');
  });
});

describe('recogniseGrant (service)', () => {
  it('returns grant.recognise intent', async () => {
    const r = await recogniseGrant({} as any, { orgId: 'o1', userId: 'u1' } as any, {
      grantId: 'g-1',
      approach: 'income',
      amountMinor: 200_000,
      grantDate: '2025-03-01',
      conditions: 'R&D spending',
    });
    expect(r.kind).toBe('intent');
  });
});

describe('amortiseGrant (service)', () => {
  const db = mockDbSession();
  const ctx = testCtx();

  it('returns grant.amortise intent', async () => {
    // mockGrantRow has amortisedMinor: 60_000 out of 120_000 → still has remaining
    const r = await amortiseGrant(db, ctx, {
      grantId: 'g-1',
      periodKey: '2025-P06',
      usefulLifeMonths: 12,
    });
    expect(r.kind).toBe('intent');
  });

  it('returns read when fully amortised', async () => {
    // Override the mock to return a fully-amortised grant
    const { getGrant } = await import('../queries/grant-query');
    vi.mocked(getGrant).mockResolvedValueOnce({
      ...mockGrantRow,
      grantAmountMinor: 120_000,
      amortisedMinor: 120_000,
      deferredMinor: 0,
    });

    const r = await amortiseGrant(db, ctx, {
      grantId: 'g-1',
      periodKey: '2025-P12',
      usefulLifeMonths: 12,
    });
    expect(r.kind).toBe('read');
  });
});
