import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * SB-09 — Tax Calculation on Recurring Invoices
 *
 * Applies tax rates by jurisdiction to recurring invoice lines.
 * Handles tax-inclusive vs tax-exclusive pricing and computes
 * line-level + invoice-level tax totals.
 * Pure function — no I/O.
 */

export type InvoiceLine = {
  lineId: string;
  description: string;
  amountMinor: number;
  taxRatePct: number;
  taxInclusive: boolean;
};

export type TaxedLine = {
  lineId: string;
  netAmountMinor: number;
  taxAmountMinor: number;
  grossAmountMinor: number;
  effectiveTaxRatePct: number;
};

export type RecurringInvoiceTaxResult = {
  invoiceId: string;
  jurisdiction: string;
  lines: TaxedLine[];
  totalNetMinor: number;
  totalTaxMinor: number;
  totalGrossMinor: number;
};

export function computeRecurringInvoiceTax(
  invoiceId: string,
  jurisdiction: string,
  lines: InvoiceLine[],
): CalculatorResult<RecurringInvoiceTaxResult> {
  if (!invoiceId) throw new DomainError('VALIDATION_FAILED', 'invoiceId is required');
  if (!jurisdiction) throw new DomainError('VALIDATION_FAILED', 'jurisdiction is required');
  if (lines.length === 0) throw new DomainError('VALIDATION_FAILED', 'At least one invoice line required');

  const taxedLines: TaxedLine[] = lines.map((l) => {
    if (l.amountMinor < 0) throw new DomainError('VALIDATION_FAILED', `Negative amount on line ${l.lineId}`);
    if (l.taxRatePct < 0) throw new DomainError('VALIDATION_FAILED', `Negative tax rate on line ${l.lineId}`);

    let netAmount: number;
    let taxAmount: number;
    let grossAmount: number;

    if (l.taxInclusive) {
      // Amount includes tax: extract tax from gross
      grossAmount = l.amountMinor;
      netAmount = Math.round(l.amountMinor / (1 + l.taxRatePct / 100));
      taxAmount = grossAmount - netAmount;
    } else {
      // Amount excludes tax: add tax on top
      netAmount = l.amountMinor;
      taxAmount = Math.round(l.amountMinor * (l.taxRatePct / 100));
      grossAmount = netAmount + taxAmount;
    }

    return {
      lineId: l.lineId,
      netAmountMinor: netAmount,
      taxAmountMinor: taxAmount,
      grossAmountMinor: grossAmount,
      effectiveTaxRatePct: netAmount > 0 ? Math.round((taxAmount / netAmount) * 10000) / 100 : 0,
    };
  });

  const totalNet = taxedLines.reduce((s, l) => s + l.netAmountMinor, 0);
  const totalTax = taxedLines.reduce((s, l) => s + l.taxAmountMinor, 0);
  const totalGross = taxedLines.reduce((s, l) => s + l.grossAmountMinor, 0);

  return {
    result: { invoiceId, jurisdiction, lines: taxedLines, totalNetMinor: totalNet, totalTaxMinor: totalTax, totalGrossMinor: totalGross },
    inputs: { invoiceId, jurisdiction, lineCount: lines.length },
    explanation: `Recurring invoice ${invoiceId} (${jurisdiction}): ${lines.length} lines, net=${totalNet}, tax=${totalTax}, gross=${totalGross}`,
  };
}
