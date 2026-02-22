import { DomainError } from 'afenda-canon';
import Decimal from 'decimal.js';
import { describe, expect, it } from 'vitest';
import type { TaxRow } from '../calculators/tax-calc';
import { calculateDocumentTaxes } from '../calculators/tax-calc';

describe('calculateDocumentTaxes', () => {
  describe('single-row (flat tax)', () => {
    it('calculates a simple 10% tax on net total', () => {
      const rows: TaxRow[] = [
        { chargeType: 'on_net_total', rate: new Decimal('0.1'), roundingMethod: 'half_up' },
      ];
      const { result } = calculateDocumentTaxes(100000, rows);
      expect(result.rowTaxes).toEqual([10000]);
      expect(result.totalTaxMinor).toBe(10000);
    });

    it('handles an actual (fixed) tax amount', () => {
      const rows: TaxRow[] = [
        {
          chargeType: 'actual',
          rate: new Decimal('0'),
          roundingMethod: 'half_up',
          actualAmountMinor: 5000,
        },
      ];
      const { result } = calculateDocumentTaxes(100000, rows);
      expect(result.rowTaxes).toEqual([5000]);
      expect(result.totalTaxMinor).toBe(5000);
    });
  });

  describe('cascade: on_previous_row_amount', () => {
    it('India GST + CESS — CESS is 1 % of GST amount', () => {
      // Net: ₹10,000.00 = 1_000_000 paise
      // GST: 18 % on net = 180_000 paise
      // CESS: 1 % on GST amount = 1_800 paise
      const rows: TaxRow[] = [
        { chargeType: 'on_net_total', rate: new Decimal('0.18'), roundingMethod: 'half_up' },
        {
          chargeType: 'on_previous_row_amount',
          rate: new Decimal('0.01'),
          roundingMethod: 'half_up',
        },
      ];
      const { result } = calculateDocumentTaxes(1000000, rows);
      expect(result.rowTaxes).toEqual([180000, 1800]);
      expect(result.totalTaxMinor).toBe(181800);
    });
  });

  describe('cascade: on_previous_row_total', () => {
    it('stacked excise + VAT — VAT base includes excise', () => {
      // Net: $100.00 = 10_000 cents
      // Excise: 10 % on net = 1_000 cents
      // VAT: 15 % on (net + excise) = 15 % of 11_000 = 1_650 cents
      const rows: TaxRow[] = [
        { chargeType: 'on_net_total', rate: new Decimal('0.10'), roundingMethod: 'half_up' },
        {
          chargeType: 'on_previous_row_total',
          rate: new Decimal('0.15'),
          roundingMethod: 'half_up',
        },
      ];
      const { result } = calculateDocumentTaxes(10000, rows);
      expect(result.rowTaxes).toEqual([1000, 1650]);
      expect(result.totalTaxMinor).toBe(2650);
    });
  });

  describe('parallel taxes (both on_net_total)', () => {
    it('Canada GST + PST — both on net, not cascaded', () => {
      // Net: CAD 100.00 = 10_000 cents
      // GST: 5 % on net = 500
      // PST: 7 % on net = 700
      const rows: TaxRow[] = [
        { chargeType: 'on_net_total', rate: new Decimal('0.05'), roundingMethod: 'half_up' },
        { chargeType: 'on_net_total', rate: new Decimal('0.07'), roundingMethod: 'half_up' },
      ];
      const { result } = calculateDocumentTaxes(10000, rows);
      expect(result.rowTaxes).toEqual([500, 700]);
      expect(result.totalTaxMinor).toBe(1200);
    });
  });

  describe('mixed: actual + percentage', () => {
    it('fixed eco-levy + VAT on_previous_row_total', () => {
      // Net: 50_000 minor
      // Eco-levy: 200 minor (fixed)
      // VAT: 20 % on (net + eco-levy) = 20 % of 50_200 = 10_040
      const rows: TaxRow[] = [
        {
          chargeType: 'actual',
          rate: new Decimal('0'),
          roundingMethod: 'half_up',
          actualAmountMinor: 200,
        },
        {
          chargeType: 'on_previous_row_total',
          rate: new Decimal('0.20'),
          roundingMethod: 'half_up',
        },
      ];
      const { result } = calculateDocumentTaxes(50000, rows);
      expect(result.rowTaxes).toEqual([200, 10040]);
      expect(result.totalTaxMinor).toBe(10240);
    });
  });

  describe('empty rows', () => {
    it('returns zero tax for an empty tax table', () => {
      const { result } = calculateDocumentTaxes(100000, []);
      expect(result.rowTaxes).toEqual([]);
      expect(result.totalTaxMinor).toBe(0);
    });
  });

  describe('rounding edge cases', () => {
    it('cascaded rounding: fractional amounts round independently per row', () => {
      // Net: 999 minor
      // Row 1: 7.5 % on net = 74.925 → ceil → 75
      // Row 2: 2.5 % on previous row amount = 2.5 % of 75 = 1.875 → ceil → 2
      const rows: TaxRow[] = [
        { chargeType: 'on_net_total', rate: new Decimal('0.075'), roundingMethod: 'ceil' },
        {
          chargeType: 'on_previous_row_amount',
          rate: new Decimal('0.025'),
          roundingMethod: 'ceil',
        },
      ];
      const { result } = calculateDocumentTaxes(999, rows);
      expect(result.rowTaxes).toEqual([75, 2]);
      expect(result.totalTaxMinor).toBe(77);
    });
  });

  describe('validation errors', () => {
    it('throws if netTotalMinor is not an integer', () => {
      expect(() => calculateDocumentTaxes(100.5, [])).toThrow(DomainError);
    });

    it('throws if netTotalMinor is negative', () => {
      expect(() => calculateDocumentTaxes(-1, [])).toThrow(DomainError);
    });

    it('throws if row 0 uses on_previous_row_amount', () => {
      const rows: TaxRow[] = [
        {
          chargeType: 'on_previous_row_amount',
          rate: new Decimal('0.1'),
          roundingMethod: 'half_up',
        },
      ];
      expect(() => calculateDocumentTaxes(10000, rows)).toThrow(DomainError);
    });

    it('throws if row 0 uses on_previous_row_total', () => {
      const rows: TaxRow[] = [
        {
          chargeType: 'on_previous_row_total',
          rate: new Decimal('0.1'),
          roundingMethod: 'half_up',
        },
      ];
      expect(() => calculateDocumentTaxes(10000, rows)).toThrow(DomainError);
    });

    it('throws if actual amount is negative', () => {
      const rows: TaxRow[] = [
        {
          chargeType: 'actual',
          rate: new Decimal('0'),
          roundingMethod: 'half_up',
          actualAmountMinor: -100,
        },
      ];
      expect(() => calculateDocumentTaxes(10000, rows)).toThrow(DomainError);
    });
  });
});
