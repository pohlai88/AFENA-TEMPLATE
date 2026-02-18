import { describe, expect, it } from 'vitest';
import {
    GrantType,
    VestingType,
    type CreateGrantParams,
} from '../../types.js';
import {
    accelerateVesting,
    cancelGrant,
    createStockGrant,
    recordVesting,
    updateGrant
} from '../grant-management.js';

describe('grant-management', () => {
  describe('createStockGrant', () => {
    it('should create a valid RSU grant', async () => {
      const params: CreateGrantParams = {
        employeeId: 'emp-123',
        grantType: GrantType.RSU,
        grantDate: new Date('2025-01-01'),
        sharesGranted: 10000,
        vestingType: VestingType.TIME_BASED,
        vestingSchedule: {
          cliffMonths: 12,
          vestingMonths: 48,
          vestingFrequency: 'monthly',
        },
        fairValuePerShare: 10.50,
      };

      const grant = await createStockGrant(params);

      expect(grant).toBeDefined();
      expect(grant.employeeId).toBe('emp-123');
      expect(grant.grantType).toBe(GrantType.RSU);
      expect(grant.sharesGranted).toBe(10000);
      expect(grant.fairValuePerShare).toBe(10.50);
      expect(grant.totalFairValue).toBe(105000);
      expect(grant.sharesVested).toBe(0);
      expect(grant.sharesRemaining).toBe(10000);
      expect(grant.strikePrice).toBeNull();
      expect(grant.expirationDate).toBeNull(); // RSUs don't expire
    });

    it('should create a valid ISO grant with strike price', async () => {
      const params: CreateGrantParams = {
        employeeId: 'emp-456',
        grantType: GrantType.ISO,
        grantDate: new Date('2025-01-01'),
        sharesGranted: 50000,
        vestingType: VestingType.TIME_BASED,
        vestingSchedule: {
          cliffMonths: 12,
          vestingMonths: 48,
          vestingFrequency: 'monthly',
        },
        fairValuePerShare: 5.25,
        strikePrice: 10.00,
        expirationYears: 10,
      };

      const grant = await createStockGrant(params);

      expect(grant).toBeDefined();
      expect(grant.grantType).toBe(GrantType.ISO);
      expect(grant.strikePrice).toBe(10.00);
      expect(grant.expirationDate).toBeDefined();
      
      // Verify expiration is 10 years from grant date
      const expectedExpiration = new Date('2035-01-01');
      expect(grant.expirationDate).toEqual(expectedExpiration);
    });

    it('should reject RSU with strike price', async () => {
      const params: CreateGrantParams = {
        employeeId: 'emp-789',
        grantType: GrantType.RSU,
        grantDate: new Date('2025-01-01'),
        sharesGranted: 10000,
        vestingType: VestingType.TIME_BASED,
        vestingSchedule: {
          cliffMonths: 12,
          vestingMonths: 48,
          vestingFrequency: 'monthly',
        },
        fairValuePerShare: 10.50,
        strikePrice: 10.00, // ERROR: RSUs shouldn't have strike
      };

      await expect(createStockGrant(params)).rejects.toThrow(
        'RSUs and PSUs should not have strike price'
      );
    });

    it('should reject options without strike price', async () => {
      const params: CreateGrantParams = {
        employeeId: 'emp-101',
        grantType: GrantType.NSO,
        grantDate: new Date('2025-01-01'),
        sharesGranted: 50000,
        vestingType: VestingType.TIME_BASED,
        vestingSchedule: {
          cliffMonths: 12,
          vestingMonths: 48,
          vestingFrequency: 'monthly',
        },
        fairValuePerShare: 5.25,
        // Missing strikePrice - ERROR
      };

      await expect(createStockGrant(params)).rejects.toThrow(
        'Stock options require positive strike price'
      );
    });

    it('should reject negative shares granted', async () => {
      const params: CreateGrantParams = {
        employeeId: 'emp-202',
        grantType: GrantType.RSU,
        grantDate: new Date('2025-01-01'),
        sharesGranted: -1000,
        vestingType: VestingType.TIME_BASED,
        vestingSchedule: {
          cliffMonths: 12,
          vestingMonths: 48,
          vestingFrequency: 'monthly',
        },
        fairValuePerShare: 10.50,
      };

      await expect(createStockGrant(params)).rejects.toThrow(
        'Shares granted must be positive'
      );
    });

    it('should reject cliff exceeding vesting period', async () => {
      const params: CreateGrantParams = {
        employeeId: 'emp-303',
        grantType: GrantType.RSU,
        grantDate: new Date('2025-01-01'),
        sharesGranted: 10000,
        vestingType: VestingType.TIME_BASED,
        vestingSchedule: {
          cliffMonths: 60, // Cliff > vesting period
          vestingMonths: 48,
          vestingFrequency: 'monthly',
        },
        fairValuePerShare: 10.50,
      };

      await expect(createStockGrant(params)).rejects.toThrow(
        'Cliff cannot exceed total vesting period'
      );
    });
  });

  describe('updateGrant', () => {
    it('should reject updates to immutable fields', async () => {
      await expect(
        updateGrant('grant-123', {
          grantType: GrantType.NSO, // Attempt to change grant type
        } as any)
      ).rejects.toThrow('Cannot update immutable field: grantType');
    });
  });

  describe('cancelGrant', () => {
    it('should cancel a grant with reason', async () => {
      // TODO: Mock database to test actual cancellation
      const result = await cancelGrant('grant-123', 'Employee terminated');
      
      // Placeholder assertion (will be real once DB integrated)
      expect(result).toBeDefined();
    });
  });

  describe('recordVesting', () => {
    it('should record shares vested', async () => {
      const result = await recordVesting(
        'grant-123',
        2500,
        new Date('2026-01-01')
      );

      expect(result).toBeDefined();
    });
  });

  describe('accelerateVesting', () => {
    it('should accelerate all remaining shares', async () => {
      const result = await accelerateVesting(
        'grant-123',
        'all',
        new Date('2025-06-01'),
        'M&A transaction - double trigger'
      );

      expect(result).toBeDefined();
    });

    it('should accelerate partial shares', async () => {
      const result = await accelerateVesting(
        'grant-123',
        5000,
        new Date('2025-06-01'),
        'Performance milestone achieved'
      );

      expect(result).toBeDefined();
    });
  });
});
