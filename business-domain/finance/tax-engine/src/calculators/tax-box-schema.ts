import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

import type { CountryFormat, TaxLineItem, TaxReturnBox } from './country-tax-format';

/**
 * G-01 — Country-Specific Tax Box Structures
 *
 * Configurable box schema per country format:
 * - MY SST-02: 6 boxes
 * - SG GST F5: 8 boxes
 * - UK VAT: 9 boxes (HMRC MTD)
 * - EU SAF-T: 25 fields (simplified to 12 key boxes)
 * - US Sales Tax: 6 boxes
 *
 * Each country defines a box schema with a computation function that
 * derives the box value from the tax line items.
 */

export interface TaxBoxDefinition {
  boxNumber: string;
  label: string;
  compute: (lines: TaxLineItem[]) => number;
}

export type TaxBoxSchema = {
  format: CountryFormat;
  boxes: TaxBoxDefinition[];
};

// ── Shared computation helpers ──────────────────────────────

const outputLines = (lines: TaxLineItem[]) => lines.filter((l) => l.taxAmountMinor > 0 && !l.isExempt);
const inputLines = (lines: TaxLineItem[]) => lines.filter((l) => l.taxAmountMinor < 0);
const exemptLines = (lines: TaxLineItem[]) => lines.filter((l) => l.isExempt);
const sumTax = (ls: TaxLineItem[]) => ls.reduce((s, l) => s + l.taxAmountMinor, 0);
const sumNet = (ls: TaxLineItem[]) => ls.reduce((s, l) => s + l.netAmountMinor, 0);
const absSumTax = (ls: TaxLineItem[]) => Math.abs(ls.reduce((s, l) => s + l.taxAmountMinor, 0));
const absSumNet = (ls: TaxLineItem[]) => Math.abs(ls.reduce((s, l) => s + l.netAmountMinor, 0));
const zeroRatedLines = (lines: TaxLineItem[]) => lines.filter((l) => l.taxRatePct === 0 && !l.isExempt);

// ── MY SST-02 (6 boxes) ────────────────────────────────────

const MY_SST: TaxBoxSchema = {
  format: 'MY_SST',
  boxes: [
    { boxNumber: '1', label: 'Total value of taxable supplies', compute: (ls) => sumNet(outputLines(ls)) },
    { boxNumber: '2', label: 'Total sales tax payable', compute: (ls) => sumTax(outputLines(ls)) },
    { boxNumber: '3', label: 'Total value of exempt supplies', compute: (ls) => absSumNet(exemptLines(ls)) },
    { boxNumber: '4', label: 'Total value of taxable acquisitions', compute: (ls) => absSumNet(inputLines(ls)) },
    { boxNumber: '5', label: 'Total input tax claimable', compute: (ls) => absSumTax(inputLines(ls)) },
    { boxNumber: '6', label: 'Net tax payable/(refundable)', compute: (ls) => sumTax(outputLines(ls)) - absSumTax(inputLines(ls)) },
  ],
};

// ── SG GST F5 (8 boxes) ────────────────────────────────────

const SG_GST: TaxBoxSchema = {
  format: 'SG_GST',
  boxes: [
    { boxNumber: '1', label: 'Total value of standard-rated supplies', compute: (ls) => sumNet(outputLines(ls)) },
    { boxNumber: '2', label: 'Total value of zero-rated supplies', compute: (ls) => sumNet(zeroRatedLines(ls)) },
    { boxNumber: '3', label: 'Total value of exempt supplies', compute: (ls) => absSumNet(exemptLines(ls)) },
    { boxNumber: '4', label: 'Total value of supplies (1+2+3)', compute: (ls) => sumNet(outputLines(ls)) + sumNet(zeroRatedLines(ls)) + absSumNet(exemptLines(ls)) },
    { boxNumber: '5', label: 'Total taxable purchases', compute: (ls) => absSumNet(inputLines(ls)) },
    { boxNumber: '6', label: 'Output tax due', compute: (ls) => sumTax(outputLines(ls)) },
    { boxNumber: '7', label: 'Input tax claimable', compute: (ls) => absSumTax(inputLines(ls)) },
    { boxNumber: '8', label: 'Net GST payable/(refundable)', compute: (ls) => sumTax(outputLines(ls)) - absSumTax(inputLines(ls)) },
  ],
};

// ── UK VAT (9 boxes — HMRC MTD) ────────────────────────────

const UK_VAT: TaxBoxSchema = {
  format: 'UK_VAT',
  boxes: [
    { boxNumber: '1', label: 'VAT due on sales', compute: (ls) => sumTax(outputLines(ls)) },
    { boxNumber: '2', label: 'VAT due on acquisitions (EC)', compute: () => 0 },
    { boxNumber: '3', label: 'Total VAT due (1+2)', compute: (ls) => sumTax(outputLines(ls)) },
    { boxNumber: '4', label: 'VAT reclaimed on purchases', compute: (ls) => absSumTax(inputLines(ls)) },
    { boxNumber: '5', label: 'Net VAT payable/(refundable) (3-4)', compute: (ls) => sumTax(outputLines(ls)) - absSumTax(inputLines(ls)) },
    { boxNumber: '6', label: 'Total value of sales (excl VAT)', compute: (ls) => sumNet(outputLines(ls)) + sumNet(zeroRatedLines(ls)) + absSumNet(exemptLines(ls)) },
    { boxNumber: '7', label: 'Total value of purchases (excl VAT)', compute: (ls) => absSumNet(inputLines(ls)) },
    { boxNumber: '8', label: 'Total value of EC supplies', compute: () => 0 },
    { boxNumber: '9', label: 'Total value of EC acquisitions', compute: () => 0 },
  ],
};

// ── EU SAF-T (12 key boxes, simplified from 25-field) ──────

const EU_VAT: TaxBoxSchema = {
  format: 'EU_VAT',
  boxes: [
    { boxNumber: '01', label: 'Taxable supplies at standard rate', compute: (ls) => sumNet(outputLines(ls).filter((l) => l.taxRatePct > 10)) },
    { boxNumber: '02', label: 'VAT on standard-rate supplies', compute: (ls) => sumTax(outputLines(ls).filter((l) => l.taxRatePct > 10)) },
    { boxNumber: '03', label: 'Taxable supplies at reduced rate', compute: (ls) => sumNet(outputLines(ls).filter((l) => l.taxRatePct > 0 && l.taxRatePct <= 10)) },
    { boxNumber: '04', label: 'VAT on reduced-rate supplies', compute: (ls) => sumTax(outputLines(ls).filter((l) => l.taxRatePct > 0 && l.taxRatePct <= 10)) },
    { boxNumber: '05', label: 'Zero-rated supplies', compute: (ls) => sumNet(zeroRatedLines(ls)) },
    { boxNumber: '06', label: 'Exempt supplies', compute: (ls) => absSumNet(exemptLines(ls)) },
    { boxNumber: '07', label: 'Total output VAT', compute: (ls) => sumTax(outputLines(ls)) },
    { boxNumber: '08', label: 'Deductible input VAT', compute: (ls) => absSumTax(inputLines(ls)) },
    { boxNumber: '09', label: 'Intra-community acquisitions', compute: () => 0 },
    { boxNumber: '10', label: 'VAT on intra-community acquisitions', compute: () => 0 },
    { boxNumber: '11', label: 'Intra-community supplies', compute: () => 0 },
    { boxNumber: '12', label: 'Net VAT payable/(refundable)', compute: (ls) => sumTax(outputLines(ls)) - absSumTax(inputLines(ls)) },
  ],
};

// ── US Sales Tax (6 boxes) ─────────────────────────────────

const US_SALES_TAX: TaxBoxSchema = {
  format: 'US_SALES_TAX',
  boxes: [
    { boxNumber: '1', label: 'Gross sales', compute: (ls) => sumNet(outputLines(ls)) + sumNet(zeroRatedLines(ls)) + absSumNet(exemptLines(ls)) },
    { boxNumber: '2', label: 'Exempt sales', compute: (ls) => absSumNet(exemptLines(ls)) },
    { boxNumber: '3', label: 'Taxable sales', compute: (ls) => sumNet(outputLines(ls)) },
    { boxNumber: '4', label: 'Tax collected', compute: (ls) => sumTax(outputLines(ls)) },
    { boxNumber: '5', label: 'Use tax due', compute: (ls) => absSumTax(inputLines(ls)) },
    { boxNumber: '6', label: 'Total tax due', compute: (ls) => sumTax(outputLines(ls)) + absSumTax(inputLines(ls)) },
  ],
};

// ── Registry ────────────────────────────────────────────────

export const TAX_BOX_SCHEMAS: Record<CountryFormat, TaxBoxSchema> = {
  MY_SST,
  SG_GST,
  UK_VAT,
  EU_VAT,
  US_SALES_TAX,
};

/**
 * Compute tax return boxes using the country-specific schema.
 */
export function computeTaxBoxes(
  lines: TaxLineItem[],
  format: CountryFormat,
  periodKey: string,
): CalculatorResult<{ format: CountryFormat; periodKey: string; boxes: TaxReturnBox[]; boxCount: number }> {
  if (lines.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'No tax line items provided');
  }

  const schema = TAX_BOX_SCHEMAS[format];
  if (!schema) {
    throw new DomainError('VALIDATION_FAILED', `Unknown tax format: ${format}`);
  }

  const boxes: TaxReturnBox[] = schema.boxes.map((def) => ({
    boxNumber: def.boxNumber,
    label: def.label,
    amountMinor: def.compute(lines),
  }));

  return {
    result: { format, periodKey, boxes, boxCount: boxes.length },
    inputs: { lineCount: lines.length, format, periodKey },
    explanation: `${format} return for ${periodKey}: ${boxes.length} boxes computed`,
  };
}
