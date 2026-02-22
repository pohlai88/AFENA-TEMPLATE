import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see FI-02 — Effective interest rate (EIR) method for amortised cost
 * @see FI-09 — IFRS 7 disclosures: credit risk, liquidity risk, market risk
 * FI-08 — Compound Instruments: Split Liability + Equity (IAS 32 §28)
 *
 * Splits convertible bonds into liability (PV of cash flows) and equity (residual).
 * Pure function — no I/O.
 */

export type CompoundInstrumentInput = { instrumentId: string; faceValueMinor: number; couponRateBps: number; termYears: number; marketRateBps: number; paymentFrequency: 1 | 2 | 4 };

export type CompoundInstrumentResult = { instrumentId: string; liabilityMinor: number; equityMinor: number; totalMinor: number; effectiveRateBps: number };

export function splitCompoundInstrument(input: CompoundInstrumentInput): CalculatorResult<CompoundInstrumentResult> {
  if (input.faceValueMinor <= 0) throw new DomainError('VALIDATION_FAILED', 'Face value must be positive');
  if (input.termYears <= 0) throw new DomainError('VALIDATION_FAILED', 'Term must be positive');

  const periodsPerYear = input.paymentFrequency;
  const totalPeriods = input.termYears * periodsPerYear;
  const couponPerPeriod = Math.round(input.faceValueMinor * (input.couponRateBps / 10000) / periodsPerYear);
  const marketRatePerPeriod = input.marketRateBps / 10000 / periodsPerYear;

  let pvCoupons = 0;
  for (let i = 1; i <= totalPeriods; i++) pvCoupons += couponPerPeriod / Math.pow(1 + marketRatePerPeriod, i);
  const pvPrincipal = input.faceValueMinor / Math.pow(1 + marketRatePerPeriod, totalPeriods);
  const liabilityMinor = Math.round(pvCoupons + pvPrincipal);
  const equityMinor = input.faceValueMinor - liabilityMinor;

  return { result: { instrumentId: input.instrumentId, liabilityMinor, equityMinor, totalMinor: input.faceValueMinor, effectiveRateBps: input.marketRateBps }, inputs: input, explanation: `Compound instrument: liability=${liabilityMinor}, equity=${equityMinor}` };
}
