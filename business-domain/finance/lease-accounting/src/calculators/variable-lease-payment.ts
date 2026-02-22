import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * LA-08 — Variable Lease Payments (Index-Linked) (IFRS 16 §28)
 *
 * Remeasures lease liability when CPI/index-linked payments change.
 * Computes adjusted payment schedule and liability remeasurement amount.
 *
 * Pure function — no I/O.
 */

export type IndexLinkedLease = {
  leaseId: string;
  basePaymentMinor: number;
  baseIndexValue: number;
  currentIndexValue: number;
  remainingPayments: number;
  discountRateBps: number;
};

export type VariableLeaseResult = {
  leaseId: string;
  adjustedPaymentMinor: number;
  indexAdjustmentFactor: number;
  paymentIncreaseMinor: number;
  revisedLiabilityMinor: number;
  remeasurementAdjustmentMinor: number;
  originalLiabilityMinor: number;
};

export function remeasureIndexLinkedLease(
  lease: IndexLinkedLease,
  currentLiabilityMinor: number,
): CalculatorResult<VariableLeaseResult> {
  if (lease.baseIndexValue <= 0) {
    throw new DomainError('VALIDATION_FAILED', 'Base index value must be positive');
  }
  if (lease.remainingPayments <= 0) {
    throw new DomainError('VALIDATION_FAILED', 'Remaining payments must be positive');
  }

  const indexAdjustmentFactor = lease.currentIndexValue / lease.baseIndexValue;
  const adjustedPaymentMinor = Math.round(lease.basePaymentMinor * indexAdjustmentFactor);
  const paymentIncreaseMinor = adjustedPaymentMinor - lease.basePaymentMinor;

  const monthlyRate = lease.discountRateBps / 10000 / 12;
  let revisedLiabilityMinor = 0;
  for (let i = 1; i <= lease.remainingPayments; i++) {
    revisedLiabilityMinor += adjustedPaymentMinor / Math.pow(1 + monthlyRate, i);
  }
  revisedLiabilityMinor = Math.round(revisedLiabilityMinor);

  const remeasurementAdjustmentMinor = revisedLiabilityMinor - currentLiabilityMinor;

  return {
    result: {
      leaseId: lease.leaseId,
      adjustedPaymentMinor,
      indexAdjustmentFactor: Math.round(indexAdjustmentFactor * 10000) / 10000,
      paymentIncreaseMinor,
      revisedLiabilityMinor,
      remeasurementAdjustmentMinor,
      originalLiabilityMinor: currentLiabilityMinor,
    },
    inputs: { lease, currentLiabilityMinor },
    explanation: `Index-linked remeasurement: factor=${(indexAdjustmentFactor * 100).toFixed(1)}%, adjustment=${remeasurementAdjustmentMinor}`,
  };
}
