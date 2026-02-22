import { describe, expect, it, vi } from 'vitest';

import { mockDbSession, testCtx } from '../../../test-utils/integration-helper';
import { computePeriodExpense, computeVestingExpense } from '../calculators/sbp-calc';
import {
  buildSbpExpenseIntent,
  buildSbpGrantIntent,
  buildSbpVestIntent,
} from '../commands/sbp-intent';
import type { SbpGrantReadModel } from '../queries/sbp-query';
import { grantSbp, recogniseSbpExpense, vestSbp } from '../services/sbp-service';

const { mockSbpGrant } = vi.hoisted(() => {
  const mockSbpGrant: SbpGrantReadModel = {
    id: 'sbp-1',
    grantDate: '2025-01-01',
    vestingPeriodMonths: 36,
    currencyCode: 'USD',
    exercisePriceMinor: 5000,
    fairValuePerUnitMinor: 100,
    unitsGranted: 1000,
    unitsVested: 0,
    unitsCancelled: 0,
    settlementType: 'equity',
    status: 'active',
  };
  return { mockSbpGrant };
});

vi.mock('../queries/sbp-query', () => ({
  getSbpGrant: vi.fn().mockResolvedValue(mockSbpGrant),
}));

describe('computeVestingExpense', () => {
  it('computes cumulative and period expense at midpoint', () => {
    const { result: r } = computeVestingExpense({
      instrumentsGranted: 1000,
      fairValuePerUnitMinor: 100,
      vestingPeriodMonths: 36,
      elapsedMonths: 18,
      forfeitureRate: 0.1,
      prevCumulativeMinor: 0,
    });
    // adjusted = 900, total FV = 90_000, fraction = 0.5, cumulative = 45_000
    expect(r.adjustedInstruments).toBe(900);
    expect(r.cumulativeExpenseMinor).toBe(45_000);
    expect(r.periodExpenseMinor).toBe(45_000);
  });

  it('computes incremental expense in subsequent period', () => {
    const { result: r } = computeVestingExpense({
      instrumentsGranted: 1000,
      fairValuePerUnitMinor: 100,
      vestingPeriodMonths: 36,
      elapsedMonths: 24,
      forfeitureRate: 0.1,
      prevCumulativeMinor: 45_000,
    });
    // fraction = 24/36 = 0.667, cumulative = 60_000
    expect(r.cumulativeExpenseMinor).toBe(60_000);
    expect(r.periodExpenseMinor).toBe(15_000);
  });

  it('caps at full vesting', () => {
    const { result: r } = computeVestingExpense({
      instrumentsGranted: 1000,
      fairValuePerUnitMinor: 100,
      vestingPeriodMonths: 36,
      elapsedMonths: 40,
      forfeitureRate: 0.1,
      prevCumulativeMinor: 80_000,
    });
    expect(r.cumulativeExpenseMinor).toBe(90_000);
    expect(r.periodExpenseMinor).toBe(10_000);
  });
});

describe('computePeriodExpense', () => {
  it('wraps expense amount', () => {
    const { result: r } = computePeriodExpense({ expenseMinor: 15_000 });
    expect(r.expenseMinor).toBe(15_000);
    expect(r.recogniseTo).toBe('pnl');
  });
});

describe('buildSbpGrantIntent', () => {
  it('builds sbp.grant intent', () => {
    const intent = buildSbpGrantIntent({
      grantId: 'sbp-1',
      settlementType: 'equity',
      grantDate: '2025-01-01',
      vestingPeriodMonths: 36,
      instrumentsGranted: 1000,
      fairValuePerUnitMinor: 100,
    });
    expect(intent.type).toBe('sbp.grant');
    expect(intent.idempotencyKey).toBeTruthy();
  });
});

describe('buildSbpVestIntent', () => {
  it('builds sbp.vest intent', () => {
    const intent = buildSbpVestIntent({
      grantId: 'sbp-1',
      periodKey: '2025-P06',
      expenseMinor: 15_000,
      cumulativeExpenseMinor: 45_000,
      forfeitureRate: 0.1,
    });
    expect(intent.type).toBe('sbp.vest');
  });
});

describe('buildSbpExpenseIntent', () => {
  it('builds sbp.expense intent', () => {
    const intent = buildSbpExpenseIntent({
      grantId: 'sbp-1',
      periodKey: '2025-P06',
      expenseMinor: 15_000,
      recogniseTo: 'pnl',
    });
    expect(intent.type).toBe('sbp.expense');
  });
});

describe('grantSbp (service)', () => {
  it('returns sbp.grant intent', async () => {
    const r = await grantSbp({} as any, { orgId: 'o1', userId: 'u1' } as any, {
      grantId: 'sbp-1',
      settlementType: 'equity',
      grantDate: '2025-01-01',
      vestingPeriodMonths: 36,
      instrumentsGranted: 1000,
      fairValuePerUnitMinor: 100,
    });
    expect(r.kind).toBe('intent');
  });
});

describe('vestSbp (service)', () => {
  const db = mockDbSession();
  const ctx = testCtx();

  it('returns sbp.vest intent with computed expense', async () => {
    const r = await vestSbp(db, ctx, {
      grantId: 'sbp-1',
      periodKey: '2025-P06',
      elapsedMonths: 18,
      forfeitureRate: 0.1,
      prevCumulativeMinor: 0,
    });
    expect(r.kind).toBe('intent');
  });
});

describe('recogniseSbpExpense (service)', () => {
  it('returns sbp.expense intent', async () => {
    const r = await recogniseSbpExpense({} as any, { orgId: 'o1', userId: 'u1' } as any, {
      grantId: 'sbp-1',
      periodKey: '2025-P06',
      expenseMinor: 15_000,
      recogniseTo: 'pnl',
    });
    expect(r.kind).toBe('intent');
  });
});
