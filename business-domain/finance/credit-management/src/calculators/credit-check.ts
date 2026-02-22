import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type CreditCheckResult = {
  approved: boolean;
  availableMinor: number;
  utilizationPercent: number;
  overLimitMinor: number;
};

export function checkCreditLimit(
  creditLimitMinor: number,
  currentExposureMinor: number,
  orderAmountMinor: number,
): CalculatorResult<CreditCheckResult> {
  if (!Number.isInteger(creditLimitMinor) || creditLimitMinor < 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `creditLimitMinor must be a non-negative integer, got ${creditLimitMinor}`,
    );
  }
  if (!Number.isInteger(currentExposureMinor) || currentExposureMinor < 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `currentExposureMinor must be a non-negative integer, got ${currentExposureMinor}`,
    );
  }
  if (!Number.isInteger(orderAmountMinor) || orderAmountMinor < 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `orderAmountMinor must be a non-negative integer, got ${orderAmountMinor}`,
    );
  }

  const totalExposure = currentExposureMinor + orderAmountMinor;
  const availableMinor = Math.max(creditLimitMinor - currentExposureMinor, 0);
  const utilizationPercent =
    creditLimitMinor === 0 ? 1 : Math.round((totalExposure / creditLimitMinor) * 10000) / 10000;
  const overLimitMinor = Math.max(totalExposure - creditLimitMinor, 0);
  const approved = totalExposure <= creditLimitMinor;

  return {
    result: { approved, availableMinor, utilizationPercent, overLimitMinor },
    inputs: { creditLimitMinor, currentExposureMinor, orderAmountMinor },
    explanation: `Credit check: ${approved ? 'approved' : 'declined'}, utilization ${(utilizationPercent * 100).toFixed(1)}%`,
  };
}
