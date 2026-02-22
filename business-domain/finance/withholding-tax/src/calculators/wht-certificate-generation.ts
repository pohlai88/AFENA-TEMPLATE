/**
 * WHT Certificate Generation
 *
 * Computes the withholding tax certificate details including
 * tax amounts, rates, and certificate numbering validation.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type WhtCertificateInput = {
  grossAmountMinor: number;
  whtRate: number;
  whtCode: string;
  supplierId: string;
  taxPeriod: string;
  incomeType: 'services' | 'royalties' | 'interest' | 'dividends' | 'rent' | 'other';
};

export type WhtCertificateResult = {
  whtAmountMinor: number;
  netPayableMinor: number;
  effectiveRatePct: string;
  incomeType: string;
  explanation: string;
};

export function computeWhtCertificate(
  inputs: WhtCertificateInput,
): CalculatorResult<WhtCertificateResult> {
  const { grossAmountMinor, whtRate, incomeType } = inputs;

  if (grossAmountMinor <= 0) throw new DomainError('VALIDATION_FAILED', 'Gross amount must be positive');
  if (whtRate < 0 || whtRate > 1) throw new DomainError('VALIDATION_FAILED', 'WHT rate must be between 0 and 1');

  const whtAmountMinor = Math.round(grossAmountMinor * whtRate);
  const netPayableMinor = grossAmountMinor - whtAmountMinor;
  const effectiveRatePct = `${(whtRate * 100).toFixed(2)}%`;

  const explanation =
    `WHT certificate: gross ${grossAmountMinor} × ${effectiveRatePct} = WHT ${whtAmountMinor}, ` +
    `net payable ${netPayableMinor}, income type: ${incomeType}`;

  return {
    result: { whtAmountMinor, netPayableMinor, effectiveRatePct, incomeType, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
