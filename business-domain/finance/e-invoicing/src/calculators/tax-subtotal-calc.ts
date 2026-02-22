/**
 * E-Invoice Tax Subtotal Calculator
 *
 * Groups invoice lines by tax category and computes per-category
 * subtotals as required by EN 16931 BT-110..BT-119.
 * Each tax subtotal contains taxable amount, tax amount, and category info.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type TaxSubtotalLine = {
  taxCategoryId: string;
  taxRate: number;
  lineExtensionMinor: number;
};

export type TaxSubtotalInput = {
  lines: TaxSubtotalLine[];
  currency: string;
};

export type TaxSubtotalEntry = {
  taxCategoryId: string;
  taxRate: number;
  taxableAmountMinor: number;
  taxAmountMinor: number;
};

export type TaxSubtotalResult = {
  subtotals: TaxSubtotalEntry[];
  totalTaxAmountMinor: number;
  categoryCount: number;
  explanation: string;
};

export function computeTaxSubtotals(
  inputs: TaxSubtotalInput,
): CalculatorResult<TaxSubtotalResult> {
  const { lines, currency } = inputs;

  if (lines.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'At least one line required for tax subtotals');
  }

  const grouped = new Map<string, { taxRate: number; taxableMinor: number }>();

  for (const line of lines) {
    const key = `${line.taxCategoryId}|${line.taxRate}`;
    const existing = grouped.get(key);
    if (existing) {
      existing.taxableMinor += line.lineExtensionMinor;
    } else {
      grouped.set(key, { taxRate: line.taxRate, taxableMinor: line.lineExtensionMinor });
    }
  }

  const subtotals: TaxSubtotalEntry[] = [];
  let totalTaxAmountMinor = 0;

  for (const [key, val] of grouped) {
    const taxCategoryId = key.split('|')[0]!;
    const taxAmountMinor = Math.round(val.taxableMinor * val.taxRate);
    totalTaxAmountMinor += taxAmountMinor;
    subtotals.push({
      taxCategoryId,
      taxRate: val.taxRate,
      taxableAmountMinor: val.taxableMinor,
      taxAmountMinor,
    });
  }

  const explanation =
    `Tax subtotals (${currency}): ${subtotals.length} categories, ` +
    `total tax ${totalTaxAmountMinor}`;

  return {
    result: {
      subtotals,
      totalTaxAmountMinor,
      categoryCount: subtotals.length,
      explanation,
    },
    inputs: { ...inputs },
    explanation,
  };
}
