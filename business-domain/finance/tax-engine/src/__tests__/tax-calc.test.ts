import { DomainError } from 'afenda-canon';
import Decimal from 'decimal.js';
import { describe, expect, it } from 'vitest';
import { calculateLineTax } from '../calculators/tax-calc';

describe('calculateLineTax', () => {
  describe('half_up rounding', () => {
    it('rounds 0.5 up', () => {
      // 1000 * 0.065 = 65.0 → 65
      expect(calculateLineTax(1000, new Decimal('0.065'), 'half_up').result).toBe(65);
    });

    it('rounds 0.5 up at boundary', () => {
      // 100 * 0.065 = 6.5 → 7
      expect(calculateLineTax(100, new Decimal('0.065'), 'half_up').result).toBe(7);
    });

    it('6% GST on MYR 10000 minor units (MYR 100.00)', () => {
      expect(calculateLineTax(10000, new Decimal('0.06'), 'half_up').result).toBe(600);
    });
  });

  describe('half_down rounding', () => {
    it('rounds 0.5 down', () => {
      // 100 * 0.065 = 6.5 → 6
      expect(calculateLineTax(100, new Decimal('0.065'), 'half_down').result).toBe(6);
    });
  });

  describe('ceil rounding', () => {
    it('always rounds up', () => {
      // 100 * 0.061 = 6.1 → 7
      expect(calculateLineTax(100, new Decimal('0.061'), 'ceil').result).toBe(7);
    });

    it('exact value stays exact', () => {
      expect(calculateLineTax(10000, new Decimal('0.06'), 'ceil').result).toBe(600);
    });
  });

  describe('floor rounding', () => {
    it('always rounds down', () => {
      // 100 * 0.069 = 6.9 → 6
      expect(calculateLineTax(100, new Decimal('0.069'), 'floor').result).toBe(6);
    });
  });

  describe('banker rounding (half_even)', () => {
    it('rounds 0.5 to nearest even — 6.5 → 6', () => {
      // 100 * 0.065 = 6.5 → 6 (even)
      expect(calculateLineTax(100, new Decimal('0.065'), 'banker').result).toBe(6);
    });

    it('rounds 0.5 to nearest even — 7.5 → 8', () => {
      // 1000 * 0.0075 = 7.5 → 8 (even)
      expect(calculateLineTax(1000, new Decimal('0.0075'), 'banker').result).toBe(8);
    });
  });

  describe('zero and boundary values', () => {
    it('zero base returns zero tax', () => {
      expect(calculateLineTax(0, new Decimal('0.06'), 'half_up').result).toBe(0);
    });

    it('zero rate returns zero tax', () => {
      expect(calculateLineTax(10000, new Decimal('0'), 'half_up').result).toBe(0);
    });

    it('throws VALIDATION_FAILED for non-integer baseMinor', () => {
      try {
        calculateLineTax(100.5, new Decimal('0.06'), 'half_up');
        expect.fail('should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(DomainError);
        expect((e as DomainError).code).toBe('VALIDATION_FAILED');
      }
    });

    it('throws VALIDATION_FAILED for negative baseMinor', () => {
      try {
        calculateLineTax(-100, new Decimal('0.06'), 'half_up');
        expect.fail('should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(DomainError);
        expect((e as DomainError).code).toBe('VALIDATION_FAILED');
      }
    });

    it('throws VALIDATION_FAILED for negative rate', () => {
      try {
        calculateLineTax(1000, new Decimal('-0.06'), 'half_up');
        expect.fail('should have thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(DomainError);
        expect((e as DomainError).code).toBe('VALIDATION_FAILED');
      }
    });
  });

  describe('multi-currency spot checks', () => {
    it('USD 9% sales tax on $50.00 (5000 minor)', () => {
      expect(calculateLineTax(5000, new Decimal('0.09'), 'half_up').result).toBe(450);
    });

    it('SGD 9% GST on SGD 1.00 (100 minor)', () => {
      expect(calculateLineTax(100, new Decimal('0.09'), 'half_up').result).toBe(9);
    });
  });
});
