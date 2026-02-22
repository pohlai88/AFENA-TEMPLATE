/**
 * UBL Invoice Line Calculator
 *
 * Computes line-level totals for a UBL/Peppol e-invoice line,
 * including tax-exclusive amount, tax amount, and tax-inclusive amount.
 * Validates quantity, unit price, and tax rate constraints.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type UblLineCalcInput = {
  lineNo: number;
  description: string;
  quantity: number;
  unitPriceMinor: number;
  taxRate: number;
  allowanceMinor?: number;
  chargeMinor?: number;
};

export type UblLineCalcResult = {
  lineNo: number;
  lineExtensionMinor: number;
  taxAmountMinor: number;
  lineInclusiveMinor: number;
  allowanceMinor: number;
  chargeMinor: number;
  explanation: string;
};

export function computeUblLine(
  inputs: UblLineCalcInput,
): CalculatorResult<UblLineCalcResult> {
  const { lineNo, quantity, unitPriceMinor, taxRate, allowanceMinor = 0, chargeMinor = 0 } = inputs;

  if (quantity <= 0) {
    throw new DomainError('VALIDATION_FAILED', 'Quantity must be positive');
  }
  if (unitPriceMinor < 0) {
    throw new DomainError('VALIDATION_FAILED', 'Unit price cannot be negative');
  }
  if (taxRate < 0 || taxRate > 1) {
    throw new DomainError('VALIDATION_FAILED', 'Tax rate must be between 0 and 1');
  }

  const grossMinor = Math.round(quantity * unitPriceMinor);
  const lineExtensionMinor = grossMinor - allowanceMinor + chargeMinor;
  const taxAmountMinor = Math.round(lineExtensionMinor * taxRate);
  const lineInclusiveMinor = lineExtensionMinor + taxAmountMinor;

  const explanation =
    `UBL line ${lineNo}: qty ${quantity} × ${unitPriceMinor} = ${grossMinor}, ` +
    `allowance ${allowanceMinor}, charge ${chargeMinor}, ` +
    `tax ${taxAmountMinor} (${(taxRate * 100).toFixed(1)}%), total ${lineInclusiveMinor}`;

  return {
    result: {
      lineNo,
      lineExtensionMinor,
      taxAmountMinor,
      lineInclusiveMinor,
      allowanceMinor,
      chargeMinor,
      explanation,
    },
    inputs: { ...inputs },
    explanation,
  };
}
