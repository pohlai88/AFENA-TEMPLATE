/**
 * E-Invoice Document Totals Calculator
 *
 * Aggregates line-level amounts into document-level totals per
 * EN 16931 / Peppol BIS 3.0 monetary totals structure:
 *   - LineExtensionAmount (sum of line extensions)
 *   - TaxExclusiveAmount (after document-level allowances/charges)
 *   - TaxInclusiveAmount
 *   - PayableAmount (after prepaid / rounding)
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type InvoiceTotalsInput = {
  lineExtensionTotalMinor: number;
  taxTotalMinor: number;
  documentAllowanceMinor?: number;
  documentChargeMinor?: number;
  prepaidAmountMinor?: number;
  roundingMinor?: number;
};

export type InvoiceTotalsResult = {
  lineExtensionAmountMinor: number;
  taxExclusiveAmountMinor: number;
  taxInclusiveAmountMinor: number;
  payableAmountMinor: number;
  explanation: string;
};

export function computeInvoiceTotals(
  inputs: InvoiceTotalsInput,
): CalculatorResult<InvoiceTotalsResult> {
  const {
    lineExtensionTotalMinor,
    taxTotalMinor,
    documentAllowanceMinor = 0,
    documentChargeMinor = 0,
    prepaidAmountMinor = 0,
    roundingMinor = 0,
  } = inputs;

  if (lineExtensionTotalMinor < 0) {
    throw new DomainError('VALIDATION_FAILED', 'Line extension total cannot be negative');
  }
  if (taxTotalMinor < 0) {
    throw new DomainError('VALIDATION_FAILED', 'Tax total cannot be negative');
  }

  const taxExclusiveAmountMinor =
    lineExtensionTotalMinor - documentAllowanceMinor + documentChargeMinor;
  const taxInclusiveAmountMinor = taxExclusiveAmountMinor + taxTotalMinor;
  const payableAmountMinor =
    taxInclusiveAmountMinor - prepaidAmountMinor + roundingMinor;

  const explanation =
    `Invoice totals: lines ${lineExtensionTotalMinor}, ` +
    `allowance -${documentAllowanceMinor}, charge +${documentChargeMinor}, ` +
    `tax-excl ${taxExclusiveAmountMinor}, tax ${taxTotalMinor}, ` +
    `tax-incl ${taxInclusiveAmountMinor}, prepaid -${prepaidAmountMinor}, ` +
    `rounding ${roundingMinor}, payable ${payableAmountMinor}`;

  return {
    result: {
      lineExtensionAmountMinor: lineExtensionTotalMinor,
      taxExclusiveAmountMinor,
      taxInclusiveAmountMinor,
      payableAmountMinor,
      explanation,
    },
    inputs: { ...inputs },
    explanation,
  };
}
