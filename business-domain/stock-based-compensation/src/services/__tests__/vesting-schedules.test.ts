import { describe, expect, it } from 'vitest';
import {
    GrantStatus,
    GrantType,
    VestingType,
    type MarketCondition,
    type PerformanceCondition,
    type StockGrant,
} from '../../types.js';
import {
    calculateVestingSchedule,
    evaluateMarketConditions,
    evaluatePerformanceConditions,
    forecastVesting,
    getVestingStatus,
} from '../vesting-schedules.js';

describe('vesting-schedules', () => {
  describe('calculateVestingSchedule', () => {
    it('should calculate schedule with 12-month cliff and monthly vesting', async () => {
      const grant: StockGrant = {
        id: 'grant-001',
        employeeId: 'emp-123',
        grantType: GrantType.RSU,
        grantDate: new Date('2025-01-01'),
        sharesGranted: 48000,
        strikePrice: null,
        fairValuePerShare: 10.0,
        totalFairValue: 480000,
        vestingType: VestingType.TIME_BASED,
        vestingSchedule: {
          cliffMonths: 12,
          vestingMonths: 48,
          vestingFrequency: 'monthly',
        },
        status: GrantStatus.ACTIVE,
        sharesVested: 0,
        sharesExercised: 0,
        sharesForfeited: 0,
        sharesRemaining: 48000,
        expirationDate: null,
        postTermExerciseDays: null,
        agreementId: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        companyId: 'comp-001',
        erpId: null,
      };

      const tranches = await calculateVestingSchedule(grant);

      expect(tranches).toBeDefined();
      expect(tranches.length).toBe(37); // 1 cliff + 36 monthly periods

      // Verify cliff tranche (25% at 12 months)
      const cliffTranche = tranches[0];
      expect(cliffTranche.sharesVesting).toBe(12000); // 25% of 48000
      expect(cliffTranche.cumulativeShares).toBe(12000);
      expect(cliffTranche.vestDate).toEqual(new Date('2026-01-01'));
      expect(cliffTranche.status).toBe('scheduled');

      // Verify monthly tranches
      const monthlyTranche = tranches[1];
      expect(monthlyTranche.sharesVesting).toBe(1000); // (48000 - 12000) / 36
      expect(monthlyTranche.cumulativeShares).toBe(13000);

      // Verify last tranche completes vesting
      const lastTranche = tranches[tranches.length - 1];
      expect(lastTranche.cumulativeShares).toBe(48000);
      expect(lastTranche.vestDate).toEqual(new Date('2029-01-01'));

      // Verify total shares
      const totalShares = tranches.reduce(
        (sum, t) => sum + t.sharesVesting,
        0
      );
      expect(totalShares).toBe(48000);
    });

    it('should calculate schedule with quarterly vesting', async () => {
      const grant: StockGrant = {
        id: 'grant-002',
        employeeId: 'emp-456',
        grantType: GrantType.ISO,
        grantDate: new Date('2025-01-01'),
        sharesGranted: 40000,
        strikePrice: 10.0,
        fairValuePerShare: 5.0,
        totalFairValue: 200000,
        vestingType: VestingType.TIME_BASED,
        vestingSchedule: {
          cliffMonths: 12,
          vestingMonths: 48,
          vestingFrequency: 'quarterly',
        },
        status: GrantStatus.ACTIVE,
        sharesVested: 0,
        sharesExercised: 0,
        sharesForfeited: 0,
        sharesRemaining: 40000,
        expirationDate: new Date('2035-01-01'),
        postTermExerciseDays: 90,
        agreementId: 'agr-123',
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        companyId: 'comp-001',
        erpId: null,
      };

      const tranches = await calculateVestingSchedule(grant);

      expect(tranches).toBeDefined();
      expect(tranches.length).toBe(13); // 1 cliff + 12 quarterly periods

      // Verify cliff
      expect(tranches[0].sharesVesting).toBe(10000); // 25% at cliff

      // Verify quarterly tranches
      const quarterlyTranche = tranches[1];
      expect(quarterlyTranche.sharesVesting).toBe(2500); // (40000 - 10000) / 12
      expect(quarterlyTranche.vestDate.getMonth()).toBe(3); // April (3 months after cliff)
    });

    it('should calculate schedule with no cliff', async () => {
      const grant: StockGrant = {
        id: 'grant-003',
        employeeId: 'emp-789',
        grantType: GrantType.RSU,
        grantDate: new Date('2025-01-01'),
        sharesGranted: 12000,
        strikePrice: null,
        fairValuePerShare: 15.0,
        totalFairValue: 180000,
        vestingType: VestingType.TIME_BASED,
        vestingSchedule: {
          cliffMonths: 0, // No cliff
          vestingMonths: 12,
          vestingFrequency: 'monthly',
        },
        status: GrantStatus.ACTIVE,
        sharesVested: 0,
        sharesExercised: 0,
        sharesForfeited: 0,
        sharesRemaining: 12000,
        expirationDate: null,
        postTermExerciseDays: null,
        agreementId: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        companyId: 'comp-001',
        erpId: null,
      };

      const tranches = await calculateVestingSchedule(grant);

      expect(tranches).toBeDefined();
      expect(tranches.length).toBe(12); // 12 monthly periods, no cliff

      // Should start vesting immediately
      expect(tranches[0].vestDate).toEqual(new Date('2025-02-01')); // 1 month after grant
      expect(tranches[0].sharesVesting).toBe(1000); // 12000 / 12
    });

    it('should calculate schedule with annual vesting', async () => {
      const grant: StockGrant = {
        id: 'grant-004',
        employeeId: 'emp-101',
        grantType: GrantType.NSO,
        grantDate: new Date('2025-01-01'),
        sharesGranted: 4000,
        strikePrice: 8.0,
        fairValuePerShare: 4.0,
        totalFairValue: 16000,
        vestingType: VestingType.TIME_BASED,
        vestingSchedule: {
          cliffMonths: 0,
          vestingMonths: 48,
          vestingFrequency: 'annually',
        },
        status: GrantStatus.ACTIVE,
        sharesVested: 0,
        sharesExercised: 0,
        sharesForfeited: 0,
        sharesRemaining: 4000,
        expirationDate: new Date('2035-01-01'),
        postTermExerciseDays: null,
        agreementId: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        companyId: 'comp-001',
        erpId: null,
      };

      const tranches = await calculateVestingSchedule(grant);

      expect(tranches).toBeDefined();
      expect(tranches.length).toBe(4); // 4 annual periods

      // Verify annual vesting
      expect(tranches[0].vestDate).toEqual(new Date('2026-01-01'));
      expect(tranches[0].sharesVesting).toBe(1000); // 25% per year
      expect(tranches[3].vestDate).toEqual(new Date('2029-01-01'));
    });
  });

  describe('evaluatePerformanceConditions', () => {
    it('should return 100% when no conditions', async () => {
      const pct = await evaluatePerformanceConditions([], {});
      expect(pct).toBe(100);
    });

    it('should return 0% when below threshold', async () => {
      const conditions: PerformanceCondition[] = [
        {
          metric: 'revenue',
          target: 10000000,
          threshold: 8000000,
          maximum: 12000000,
          thresholdPct: 50,
          targetPct: 100,
          maximumPct: 150,
          measurementPeriod: '2025',
        },
      ];

      const pct = await evaluatePerformanceConditions(conditions, {
        revenue: 7000000, // Below threshold
      });

      expect(pct).toBe(0);
    });

    it('should return threshold percentage when at threshold', async () => {
      const conditions: PerformanceCondition[] = [
        {
          metric: 'revenue',
          target: 10000000,
          threshold: 8000000,
          maximum: 12000000,
          thresholdPct: 50,
          targetPct: 100,
          maximumPct: 150,
          measurementPeriod: '2025',
        },
      ];

      const pct = await evaluatePerformanceConditions(conditions, {
        revenue: 8000000,
      });

      expect(pct).toBe(50);
    });

    it('should interpolate between threshold and target', async () => {
      const conditions: PerformanceCondition[] = [
        {
          metric: 'revenue',
          target: 10000000,
          threshold: 8000000,
          maximum: 12000000,
          thresholdPct: 50,
          targetPct: 100,
          maximumPct: 150,
          measurementPeriod: '2025',
        },
      ];

      const pct = await evaluatePerformanceConditions(conditions, {
        revenue: 9000000, // Halfway between threshold and target
      });

      expect(pct).toBe(75); // Halfway between 50% and 100%
    });

    it('should return target percentage when at target', async () => {
      const conditions: PerformanceCondition[] = [
        {
          metric: 'ebitda',
          target: 2000000,
          threshold: 1500000,
          maximum: 2500000,
          thresholdPct: 50,
          targetPct: 100,
          maximumPct: 125,
          measurementPeriod: '2025',
        },
      ];

      const pct = await evaluatePerformanceConditions(conditions, {
        ebitda: 2000000,
      });

      expect(pct).toBe(100);
    });

    it('should interpolate between target and maximum', async () => {
      const conditions: PerformanceCondition[] = [
        {
          metric: 'ebitda',
          target: 2000000,
          threshold: 1500000,
          maximum: 2500000,
          thresholdPct: 50,
          targetPct: 100,
          maximumPct: 125,
          measurementPeriod: '2025',
        },
      ];

      const pct = await evaluatePerformanceConditions(conditions, {
        ebitda: 2250000, // Halfway between target and maximum
      });

      expect(pct).toBe(112.5); // Halfway between 100% and 125%
    });

    it('should return maximum percentage when above maximum', async () => {
      const conditions: PerformanceCondition[] = [
        {
          metric: 'ebitda',
          target: 2000000,
          threshold: 1500000,
          maximum: 2500000,
          thresholdPct: 50,
          targetPct: 100,
          maximumPct: 125,
          measurementPeriod: '2025',
        },
      ];

      const pct = await evaluatePerformanceConditions(conditions, {
        ebitda: 3000000, // Above maximum
      });

      expect(pct).toBe(125);
    });

    it('should handle multiple conditions with equal weighting', async () => {
      const conditions: PerformanceCondition[] = [
        {
          metric: 'revenue',
          target: 10000000,
          threshold: 8000000,
          maximum: 12000000,
          thresholdPct: 50,
          targetPct: 100,
          maximumPct: 150,
          measurementPeriod: '2025',
        },
        {
          metric: 'ebitda',
          target: 2000000,
          threshold: 1500000,
          maximum: 2500000,
          thresholdPct: 50,
          targetPct: 100,
          maximumPct: 125,
          measurementPeriod: '2025',
        },
      ];

      const pct = await evaluatePerformanceConditions(conditions, {
        revenue: 10000000, // 100%
        ebitda: 2000000, // 100%
      });

      expect(pct).toBe(100); // Average of 100% and 100%
    });
  });

  describe('evaluateMarketConditions', () => {
    it('should return true when no conditions', async () => {
      const result = await evaluateMarketConditions([], {});
      expect(result).toBe(true);
    });

    it('should return true when all conditions met', async () => {
      const conditions: MarketCondition[] = [
        {
          metric: 'stockPrice',
          target: 20.0,
          measurementDate: new Date('2026-01-01'),
          relative: false,
        },
      ];

      const result = await evaluateMarketConditions(conditions, {
        stockPrice: 25.0, // Above target
      });

      expect(result).toBe(true);
    });

    it('should return false when any condition not met', async () => {
      const conditions: MarketCondition[] = [
        {
          metric: 'stockPrice',
          target: 20.0,
          measurementDate: new Date('2026-01-01'),
          relative: false,
        },
        {
          metric: 'tsr',
          target: 0.15, // 15% TSR
          measurementDate: new Date('2026-01-01'),
          relative: false,
        },
      ];

      const result = await evaluateMarketConditions(conditions, {
        stockPrice: 25.0, // Met
        tsr: 0.10, // Not met (below 15%)
      });

      expect(result).toBe(false);
    });

    it('should return false when metric is missing', async () => {
      const conditions: MarketCondition[] = [
        {
          metric: 'stockPrice',
          target: 20.0,
          measurementDate: new Date('2026-01-01'),
          relative: false,
        },
      ];

      const result = await evaluateMarketConditions(conditions, {
        // Missing stockPrice
      });

      expect(result).toBe(false);
    });
  });

  describe('forecastVesting', () => {
    it('should forecast monthly vesting for 12 months', async () => {
      const grant: StockGrant = {
        id: 'grant-005',
        employeeId: 'emp-202',
        grantType: GrantType.RSU,
        grantDate: new Date('2025-01-01'),
        sharesGranted: 12000,
        strikePrice: null,
        fairValuePerShare: 10.0,
        totalFairValue: 120000,
        vestingType: VestingType.TIME_BASED,
        vestingSchedule: {
          cliffMonths: 0,
          vestingMonths: 12,
          vestingFrequency: 'monthly',
        },
        status: GrantStatus.ACTIVE,
        sharesVested: 0,
        sharesExercised: 0,
        sharesForfeited: 0,
        sharesRemaining: 12000,
        expirationDate: null,
        postTermExerciseDays: null,
        agreementId: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        companyId: 'comp-001',
        erpId: null,
      };

      const forecast = await forecastVesting(grant, 12);

      expect(forecast).toBeDefined();
      expect(forecast.length).toBe(12);

      // Verify first month
      expect(forecast[0].month).toBe('2025-02');
      expect(forecast[0].sharesVesting).toBe(1000);
      expect(forecast[0].cumulativeVested).toBe(1000);

      // Verify last month
      expect(forecast[11].month).toBe('2026-01');
      expect(forecast[11].cumulativeVested).toBe(12000);
    });

    it('should forecast with cliff period', async () => {
      const grant: StockGrant = {
        id: 'grant-006',
        employeeId: 'emp-303',
        grantType: GrantType.RSU,
        grantDate: new Date('2025-01-01'),
        sharesGranted: 48000,
        strikePrice: null,
        fairValuePerShare: 10.0,
        totalFairValue: 480000,
        vestingType: VestingType.TIME_BASED,
        vestingSchedule: {
          cliffMonths: 12,
          vestingMonths: 48,
          vestingFrequency: 'monthly',
        },
        status: GrantStatus.ACTIVE,
        sharesVested: 0,
        sharesExercised: 0,
        sharesForfeited: 0,
        sharesRemaining: 48000,
        expirationDate: null,
        postTermExerciseDays: null,
        agreementId: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        companyId: 'comp-001',
        erpId: null,
      };

      const forecast = await forecastVesting(grant, 24);

      expect(forecast).toBeDefined();

      // Find cliff month
      const cliffMonth = forecast.find((f) => f.month === '2026-01');
      expect(cliffMonth).toBeDefined();
      expect(cliffMonth!.sharesVesting).toBe(12000); // 25% at cliff

      // Verify cumulative increases
      const lastForecast = forecast[forecast.length - 1];
      expect(lastForecast.cumulativeVested).toBeGreaterThan(12000);
    });
  });

  describe('getVestingStatus', () => {
    it('should return vesting status structure', async () => {
      const status = await getVestingStatus('grant-007');

      expect(status).toBeDefined();
      expect(status).toHaveProperty('totalGranted');
      expect(status).toHaveProperty('vested');
      expect(status).toHaveProperty('unvested');
      expect(status).toHaveProperty('forfeited');
      expect(status).toHaveProperty('nextVestDate');
      expect(status).toHaveProperty('nextVestShares');
    });
  });
});
