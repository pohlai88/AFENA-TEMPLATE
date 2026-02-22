import { describe, expect, it } from 'vitest';

import type { TaxLineItem } from '../calculators/country-tax-format';
import { computeTaxBoxes, TAX_BOX_SCHEMAS } from '../calculators/tax-box-schema';

const sampleLines: TaxLineItem[] = [
  { lineId: 'L1', taxCode: 'SR', netAmountMinor: 100_000, taxAmountMinor: 6_000, taxRatePct: 6, isExempt: false },
  { lineId: 'L2', taxCode: 'SR', netAmountMinor: 50_000, taxAmountMinor: 3_000, taxRatePct: 6, isExempt: false },
  { lineId: 'L3', taxCode: 'TX', netAmountMinor: -30_000, taxAmountMinor: -1_800, taxRatePct: 6, isExempt: false },
  { lineId: 'L4', taxCode: 'EX', netAmountMinor: 20_000, taxAmountMinor: 0, taxRatePct: 0, isExempt: true },
  { lineId: 'L5', taxCode: 'ZR', netAmountMinor: 10_000, taxAmountMinor: 0, taxRatePct: 0, isExempt: false },
];

describe('G-01 — Country-specific tax box schemas', () => {
  it('MY_SST produces 6 boxes', () => {
    const { result } = computeTaxBoxes(sampleLines, 'MY_SST', '2025-Q1');
    expect(result.boxCount).toBe(6);
    expect(result.boxes[0]!.label).toContain('taxable supplies');
  });

  it('SG_GST produces 8 boxes', () => {
    const { result } = computeTaxBoxes(sampleLines, 'SG_GST', '2025-Q1');
    expect(result.boxCount).toBe(8);
    expect(result.boxes[7]!.label).toContain('Net GST');
  });

  it('UK_VAT produces 9 boxes (HMRC MTD)', () => {
    const { result } = computeTaxBoxes(sampleLines, 'UK_VAT', '2025-Q1');
    expect(result.boxCount).toBe(9);
    expect(result.boxes[4]!.label).toContain('Net VAT');
  });

  it('EU_VAT produces 12 boxes', () => {
    const { result } = computeTaxBoxes(sampleLines, 'EU_VAT', '2025-Q1');
    expect(result.boxCount).toBe(12);
    expect(result.boxes[11]!.label).toContain('Net VAT');
  });

  it('US_SALES_TAX produces 6 boxes', () => {
    const { result } = computeTaxBoxes(sampleLines, 'US_SALES_TAX', '2025-Q1');
    expect(result.boxCount).toBe(6);
    expect(result.boxes[0]!.label).toContain('Gross sales');
  });

  it('MY_SST net payable = output - input', () => {
    const { result } = computeTaxBoxes(sampleLines, 'MY_SST', '2025-Q1');
    const netBox = result.boxes.find((b) => b.boxNumber === '6')!;
    expect(netBox.amountMinor).toBe(9_000 - 1_800);
  });

  it('UK_VAT box 5 = box 3 - box 4', () => {
    const { result } = computeTaxBoxes(sampleLines, 'UK_VAT', '2025-Q1');
    const box3 = result.boxes.find((b) => b.boxNumber === '3')!;
    const box4 = result.boxes.find((b) => b.boxNumber === '4')!;
    const box5 = result.boxes.find((b) => b.boxNumber === '5')!;
    expect(box5.amountMinor).toBe(box3.amountMinor - box4.amountMinor);
  });

  it('throws on empty lines', () => {
    expect(() => computeTaxBoxes([], 'MY_SST', '2025-Q1')).toThrow('No tax line items');
  });

  it('all 5 country schemas are registered', () => {
    expect(Object.keys(TAX_BOX_SCHEMAS)).toHaveLength(5);
    expect(TAX_BOX_SCHEMAS).toHaveProperty('MY_SST');
    expect(TAX_BOX_SCHEMAS).toHaveProperty('SG_GST');
    expect(TAX_BOX_SCHEMAS).toHaveProperty('UK_VAT');
    expect(TAX_BOX_SCHEMAS).toHaveProperty('EU_VAT');
    expect(TAX_BOX_SCHEMAS).toHaveProperty('US_SALES_TAX');
  });

  it('SG_GST box 4 = box 1 + box 2 + box 3', () => {
    const { result } = computeTaxBoxes(sampleLines, 'SG_GST', '2025-Q1');
    const box1 = result.boxes.find((b) => b.boxNumber === '1')!;
    const box2 = result.boxes.find((b) => b.boxNumber === '2')!;
    const box3 = result.boxes.find((b) => b.boxNumber === '3')!;
    const box4 = result.boxes.find((b) => b.boxNumber === '4')!;
    expect(box4.amountMinor).toBe(box1.amountMinor + box2.amountMinor + box3.amountMinor);
  });
});
