import { describe, expect, it } from 'vitest';
import {
    GrantStatus,
    GrantType,
    ValuationMethod,
    VestingType,
    type FairValueInputs,
    type StockGrant,
} from '../../types.js';
import {
    calculateBlackScholes,
    calculateFairValue,
    calculateLattice,
    calculateMonteCarlo,
    get409AValuation,
    record409AValuation,
} from '../fair-value-calculation.js';

describe('fair-value-calculation', () => {
  describe('calculateBlackScholes', () => {
    it('should calculate fair value for at-the-money option', () => {
      const inputs: FairValueInputs = {
        stockPrice: 10.0,
        strikePrice: 10.0,
        volatility: 0.4, // 40%
        riskFreeRate: 0.05, // 5%
        dividendYield: 0.0,
        timeToExpiration: 5, // 5 years
      };

      const fairValue = calculateBlackScholes(inputs);

      expect(fairValue).toBeGreaterThan(0);
      expect(fairValue).toBeLessThan(inputs.stockPrice);
      // At-the-money option with 40% vol, 5yr expiry should be ~$4-5
      expect(fairValue).toBeGreaterThan(4);
      expect(fairValue).toBeLessThan(6);
    });

    it('should calculate fair value for in-the-money option', () => {
      const inputs: FairValueInputs = {
        stockPrice: 15.0,
        strikePrice: 10.0, // ITM by $5
        volatility: 0.4,
        riskFreeRate: 0.05,
        dividendYield: 0.0,
        timeToExpiration: 5,
      };

      const fairValue = calculateBlackScholes(inputs);

      expect(fairValue).toBeGreaterThan(5); // At least intrinsic value
      expect(fairValue).toBeLessThan(15); // Less than stock price
    });

    it('should calculate fair value for out-of-the-money option', () => {
      const inputs: FairValueInputs = {
        stockPrice: 8.0,
        strikePrice: 10.0, // OTM by $2
        volatility: 0.4,
        riskFreeRate: 0.05,
        dividendYield: 0.0,
        timeToExpiration: 5,
      };

      const fairValue = calculateBlackScholes(inputs);

      expect(fairValue).toBeGreaterThan(0); // Has time value
      expect(fairValue).toBeLessThan(8); // Less than stock price
    });

    it('should approach intrinsic value as expiration approaches', () => {
      const inputs: FairValueInputs = {
        stockPrice: 12.0,
        strikePrice: 10.0,
        volatility: 0.4,
        riskFreeRate: 0.05,
        dividendYield: 0.0,
        timeToExpiration: 0.01, // ~4 days
      };

      const fairValue = calculateBlackScholes(inputs);

      // Should be close to intrinsic value $2
      expect(fairValue).toBeGreaterThan(1.9);
      expect(fairValue).toBeLessThan(2.2);
    });

    it('should increase with volatility', () => {
      const baseInputs: FairValueInputs = {
        stockPrice: 10.0,
        strikePrice: 10.0,
        volatility: 0.3,
        riskFreeRate: 0.05,
        dividendYield: 0.0,
        timeToExpiration: 5,
      };

      const lowVolFV = calculateBlackScholes(baseInputs);

      const highVolInputs = { ...baseInputs, volatility: 0.6 };
      const highVolFV = calculateBlackScholes(highVolInputs);

      expect(highVolFV).toBeGreaterThan(lowVolFV);
    });

    it('should decrease with dividend yield', () => {
      const baseInputs: FairValueInputs = {
        stockPrice: 10.0,
        strikePrice: 10.0,
        volatility: 0.4,
        riskFreeRate: 0.05,
        dividendYield: 0.0,
        timeToExpiration: 5,
      };

      const noDivFV = calculateBlackScholes(baseInputs);

      const divInputs = { ...baseInputs, dividendYield: 0.03 }; // 3% dividend
      const divFV = calculateBlackScholes(divInputs);

      expect(divFV).toBeLessThan(noDivFV);
    });
  });

  describe('calculateMonteCarlo', () => {
    it('should calculate fair value close to Black-Scholes', () => {
      const inputs: FairValueInputs = {
        stockPrice: 10.0,
        strikePrice: 10.0,
        volatility: 0.4,
        riskFreeRate: 0.05,
        dividendYield: 0.0,
        timeToExpiration: 5,
      };

      const bsFairValue = calculateBlackScholes(inputs);
      const mcFairValue = calculateMonteCarlo(inputs, 50000);

      // Monte Carlo should be within 10% of Black-Scholes for vanilla options
      const tolerance = bsFairValue * 0.1;
      expect(Math.abs(mcFairValue - bsFairValue)).toBeLessThan(tolerance);
    });

    it('should produce consistent results with many simulations', () => {
      const inputs: FairValueInputs = {
        stockPrice: 12.0,
        strikePrice: 10.0,
        volatility: 0.35,
        riskFreeRate: 0.04,
        dividendYield: 0.0,
        timeToExpiration: 3,
      };

      const mc1 = calculateMonteCarlo(inputs, 100000);
      const mc2 = calculateMonteCarlo(inputs, 100000);

      // Should be similar (within 5%)
      const avgFV = (mc1 + mc2) / 2;
      expect(Math.abs(mc1 - avgFV) / avgFV).toBeLessThan(0.05);
      expect(Math.abs(mc2 - avgFV) / avgFV).toBeLessThan(0.05);
    });
  });

  describe('calculateLattice', () => {
    it('should calculate fair value with early exercise', () => {
      const inputs: FairValueInputs = {
        stockPrice: 10.0,
        strikePrice: 10.0,
        volatility: 0.4,
        riskFreeRate: 0.05,
        dividendYield: 0.0,
        timeToExpiration: 5,
        earlyExerciseMultiple: 2.2,
      };

      const latticeFV = calculateLattice(inputs, 100);

      expect(latticeFV).toBeGreaterThan(0);
      expect(latticeFV).toBeLessThan(inputs.stockPrice);

      // Lattice should be close to Black-Scholes for European-style
      const bsFV = calculateBlackScholes(inputs);
      expect(Math.abs(latticeFV - bsFV) / bsFV).toBeLessThan(0.15); // Within 15%
    });

    it('should account for early exercise in deep ITM options', () => {
      const inputs: FairValueInputs = {
        stockPrice: 25.0,
        strikePrice: 10.0, // Deep ITM
        volatility: 0.3,
        riskFreeRate: 0.05,
        dividendYield: 0.03,
        timeToExpiration: 5,
        earlyExerciseMultiple: 2.0,
      };

      const latticeFV = calculateLattice(inputs, 100);

      // Should be close to intrinsic value due to early exercise
      const intrinsicValue = inputs.stockPrice - inputs.strikePrice;
      expect(latticeFV).toBeGreaterThan(intrinsicValue * 0.95);
    });
  });

  describe('calculateFairValue', () => {
    const grant: StockGrant = {
      id: 'grant-001',
      employeeId: 'emp-123',
      grantType: GrantType.NSO,
      grantDate: new Date('2025-01-01'),
      sharesGranted: 10000,
      strikePrice: 10.0,
      fairValuePerShare: 0, // To be calculated
      totalFairValue: 0,
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
      sharesRemaining: 10000,
      expirationDate: new Date('2035-01-01'),
      postTermExerciseDays: 90,
      agreementId: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      companyId: 'comp-001',
      erpId: null,
    };

    it('should calculate fair value using Black-Scholes by default', async () => {
      const inputs: FairValueInputs = {
        stockPrice: 12.0,
        strikePrice: 10.0,
        volatility: 0.35,
        riskFreeRate: 0.045,
        dividendYield: 0.0,
        timeToExpiration: 6,
      };

      const fairValue = await calculateFairValue(grant, inputs);

      expect(fairValue).toBeGreaterThan(0);

      // Should match Black-Scholes
      const bsFV = calculateBlackScholes(inputs);
      expect(fairValue).toBe(bsFV);
    });

    it('should calculate fair value using Monte Carlo', async () => {
      const inputs: FairValueInputs = {
        stockPrice: 12.0,
        strikePrice: 10.0,
        volatility: 0.35,
        riskFreeRate: 0.045,
        dividendYield: 0.0,
        timeToExpiration: 6,
      };

      const fairValue = await calculateFairValue(
        grant,
        inputs,
        ValuationMethod.MONTE_CARLO
      );

      expect(fairValue).toBeGreaterThan(0);
    });

    it('should calculate fair value using Lattice', async () => {
      const inputs: FairValueInputs = {
        stockPrice: 12.0,
        strikePrice: 10.0,
        volatility: 0.35,
        riskFreeRate: 0.045,
        dividendYield: 0.0,
        timeToExpiration: 6,
        earlyExerciseMultiple: 2.2,
      };

      const fairValue = await calculateFairValue(
        grant,
        inputs,
        ValuationMethod.LATTICE
      );

      expect(fairValue).toBeGreaterThan(0);
    });

    it('should reject invalid volatility', async () => {
      const inputs: FairValueInputs = {
        stockPrice: 12.0,
        strikePrice: 10.0,
        volatility: 2.5, // > 200%
        riskFreeRate: 0.045,
        dividendYield: 0.0,
        timeToExpiration: 6,
      };

      await expect(calculateFairValue(grant, inputs)).rejects.toThrow(
        'Volatility must be between 0 and 2'
      );
    });

    it('should reject negative stock price', async () => {
      const inputs: FairValueInputs = {
        stockPrice: -10.0,
        strikePrice: 10.0,
        volatility: 0.4,
        riskFreeRate: 0.045,
        dividendYield: 0.0,
        timeToExpiration: 6,
      };

      await expect(calculateFairValue(grant, inputs)).rejects.toThrow(
        'Stock price must be positive'
      );
    });

    it('should reject negative time to expiration', async () => {
      const inputs: FairValueInputs = {
        stockPrice: 12.0,
        strikePrice: 10.0,
        volatility: 0.4,
        riskFreeRate: 0.045,
        dividendYield: 0.0,
        timeToExpiration: -1,
      };

      await expect(calculateFairValue(grant, inputs)).rejects.toThrow(
        'Time to expiration must be positive'
      );
    });
  });

  describe('get409AValuation', () => {
    it('should return 409A valuation structure', async () => {
      const valuation = await get409AValuation('comp-001', new Date());

      expect(valuation).toBeDefined();
      expect(valuation).toHaveProperty('id');
      expect(valuation).toHaveProperty('companyId', 'comp-001');
      expect(valuation).toHaveProperty('valuationDate');
      expect(valuation).toHaveProperty('fairMarketValue');
      expect(valuation.fairMarketValue).toBeGreaterThan(0);
    });
  });

  describe('record409AValuation', () => {
    it('should record 409A valuation', async () => {
      const valuation = await record409AValuation(
        'comp-001',
        10.5,
        new Date('2025-01-15'),
        'ABC Valuation Partners'
      );

      expect(valuation).toBeDefined();
      expect(valuation.companyId).toBe('comp-001');
      expect(valuation.fairMarketValue).toBe(10.5);
      expect(valuation.valuationFirm).toBe('ABC Valuation Partners');
      expect(valuation.expirationDate).toBeDefined();

      // Expiration should be ~12 months after valuation date
      const monthsDiff =
        (valuation.expirationDate.getTime() -
          valuation.valuationDate.getTime()) /
        (1000 * 60 * 60 * 24 * 30);
      expect(monthsDiff).toBeGreaterThan(11);
      expect(monthsDiff).toBeLessThan(13);
    });

    it('should reject negative fair market value', async () => {
      await expect(
        record409AValuation(
          'comp-001',
          -5.0,
          new Date(),
          'ABC Valuation Partners'
        )
      ).rejects.toThrow('Fair market value must be positive');
    });

    it('should reject zero fair market value', async () => {
      await expect(
        record409AValuation(
          'comp-001',
          0,
          new Date(),
          'ABC Valuation Partners'
        )
      ).rejects.toThrow('Fair market value must be positive');
    });
  });
});
