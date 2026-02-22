/**
 * WHT Exemption Check
 *
 * Evaluates whether a payment qualifies for WHT exemption based on
 * treaty provisions, exemption certificates, or threshold rules.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type WhtExemptionCheckInput = {
  grossAmountMinor: number;
  standardWhtRate: number;
  supplierCountry: string;
  hasTreatyRelief: boolean;
  treatyRate?: number;
  hasExemptionCertificate: boolean;
  exemptionExpiryDate?: string;
  thresholdMinor: number;
};

export type WhtExemptionCheckResult = {
  isExempt: boolean;
  applicableRate: number;
  exemptionReason: string | null;
  whtAmountMinor: number;
  explanation: string;
};

export function evaluateWhtExemption(
  inputs: WhtExemptionCheckInput,
): CalculatorResult<WhtExemptionCheckResult> {
  const {
    grossAmountMinor, standardWhtRate, hasTreatyRelief,
    treatyRate, hasExemptionCertificate, thresholdMinor,
  } = inputs;

  if (grossAmountMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Gross amount cannot be negative');
  if (standardWhtRate < 0 || standardWhtRate > 1) throw new DomainError('VALIDATION_FAILED', 'WHT rate must be between 0 and 1');

  if (grossAmountMinor < thresholdMinor) {
    return {
      result: {
        isExempt: true,
        applicableRate: 0,
        exemptionReason: 'below_threshold',
        whtAmountMinor: 0,
        explanation: `Exempt: amount ${grossAmountMinor} below threshold ${thresholdMinor}`,
      },
      inputs: { ...inputs },
      explanation: `Exempt: amount ${grossAmountMinor} below threshold ${thresholdMinor}`,
    };
  }

  if (hasExemptionCertificate) {
    return {
      result: {
        isExempt: true,
        applicableRate: 0,
        exemptionReason: 'exemption_certificate',
        whtAmountMinor: 0,
        explanation: 'Exempt: valid exemption certificate on file',
      },
      inputs: { ...inputs },
      explanation: 'Exempt: valid exemption certificate on file',
    };
  }

  if (hasTreatyRelief && treatyRate != null) {
    const applicableRate = Math.min(treatyRate, standardWhtRate);
    const whtAmountMinor = Math.round(grossAmountMinor * applicableRate);
    const explanation = `Treaty relief: rate reduced from ${(standardWhtRate * 100).toFixed(2)}% to ${(applicableRate * 100).toFixed(2)}%, WHT ${whtAmountMinor}`;
    return {
      result: { isExempt: false, applicableRate, exemptionReason: null, whtAmountMinor, explanation },
      inputs: { ...inputs },
      explanation,
    };
  }

  const whtAmountMinor = Math.round(grossAmountMinor * standardWhtRate);
  const explanation = `Standard WHT: ${(standardWhtRate * 100).toFixed(2)}% on ${grossAmountMinor} = ${whtAmountMinor}`;
  return {
    result: { isExempt: false, applicableRate: standardWhtRate, exemptionReason: null, whtAmountMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
