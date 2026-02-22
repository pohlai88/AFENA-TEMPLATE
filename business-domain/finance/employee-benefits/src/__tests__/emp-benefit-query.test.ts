import { describe, expect, it, vi } from 'vitest';

import { getBenefitPlan, listActivePlans } from '../queries/emp-benefit-query';

const mockCtx = { orgId: 'org-1', companyId: 'co-1', userId: 'u-1', asOf: '2025-12-31' } as any;

describe('getBenefitPlan', () => {
  it('returns plan when found', async () => {
    const row = {
      id: 'bp-1', planName: 'Pension', planType: 'defined-benefit',
      benefitType: 'pension', measurementDate: '2025-12-31', currencyCode: 'MYR',
      obligationMinor: 500_000, planAssetMinor: 400_000, netLiabilityMinor: 100_000,
      discountRateBps: 500, isActive: true,
    };
    const db = { read: vi.fn().mockResolvedValue([row]) } as any;
    const result = await getBenefitPlan(db, mockCtx, 'bp-1');
    expect(result.planName).toBe('Pension');
    expect(result.netLiabilityMinor).toBe(100_000);
  });

  it('throws DomainError when not found', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    await expect(getBenefitPlan(db, mockCtx, 'missing')).rejects.toThrow('Benefit plan not found');
  });
});

describe('listActivePlans', () => {
  it('returns empty array when no plans', async () => {
    const db = { read: vi.fn().mockResolvedValue([]) } as any;
    const result = await listActivePlans(db, mockCtx);
    expect(result).toEqual([]);
  });
});
