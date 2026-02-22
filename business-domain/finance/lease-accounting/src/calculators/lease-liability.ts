import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import Decimal from 'decimal.js';

/**
 * @see LA-01 — Lease classification: finance vs operating (IFRS 16)
 * @see LA-02 — Right-of-use asset initial measurement
 * @see LA-03 — Lease liability: present value of future payments
 * @see LA-04 — Lease amortisation schedule (interest + principal split)
 * @see LA-05 — Lease modification: remeasurement of liability
 * @see LA-06 — Short-term / low-value exemption (IFRS 16 §5–8)
 */

export type LeasePayment = { periodNumber: number; amountMinor: number };

export type AmortizationEntry = {
  period: number;
  openingMinor: number;
  paymentMinor: number;
  interestMinor: number;
  principalMinor: number;
  closingMinor: number;
};

export type LeaseLiabilityResult = {
  presentValueMinor: number;
  totalPaymentsMinor: number;
  interestMinor: number;
  schedule: AmortizationEntry[];
};

export function computeLeaseLiability(
  payments: LeasePayment[],
  annualDiscountRate: number,
): CalculatorResult<LeaseLiabilityResult> {
  if (payments.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'payments must not be empty');
  }
  if (annualDiscountRate < 0) {
    throw new DomainError(
      'VALIDATION_FAILED',
      `annualDiscountRate must be non-negative, got ${annualDiscountRate}`,
    );
  }

  const periodicRate = new Decimal(annualDiscountRate).div(12);
  let pvAccum = new Decimal(0);
  let totalPaymentsMinor = 0;

  for (const p of payments) {
    if (!Number.isInteger(p.amountMinor) || p.amountMinor <= 0) {
      throw new DomainError(
        'VALIDATION_FAILED',
        `amountMinor must be a positive integer, got ${p.amountMinor}`,
      );
    }
    totalPaymentsMinor += p.amountMinor;
    const discountFactor = periodicRate.isZero()
      ? new Decimal(1)
      : new Decimal(1).div(periodicRate.plus(1).pow(p.periodNumber));
    pvAccum = pvAccum.plus(new Decimal(p.amountMinor).mul(discountFactor));
  }

  const presentValueMinor = pvAccum.toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();

  const schedule: AmortizationEntry[] = [];
  let balance = new Decimal(presentValueMinor);

  for (const p of payments) {
    const interestDec = balance.mul(periodicRate).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);
    const principalDec = new Decimal(p.amountMinor).minus(interestDec);
    const closingDec = Decimal.max(balance.minus(principalDec), 0);

    schedule.push({
      period: p.periodNumber,
      openingMinor: balance.toNumber(),
      paymentMinor: p.amountMinor,
      interestMinor: interestDec.toNumber(),
      principalMinor: principalDec.toNumber(),
      closingMinor: closingDec.toNumber(),
    });

    balance = closingDec;
  }

  const interestMinor = totalPaymentsMinor - presentValueMinor;

  return {
    result: { presentValueMinor, totalPaymentsMinor, interestMinor, schedule },
    inputs: { payments, annualDiscountRate },
    explanation: `Lease liability PV=${presentValueMinor} over ${payments.length} periods at ${annualDiscountRate} annual rate`,
  };
}
