import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see AR-04 — ECL provisioning: IFRS 9 Stage 1/2/3 (PD × LGD × EAD)
 * G-02 / AR-09 — Factoring & Receivables Derecognition (IFRS 9 §3.2)
 *
 * Evaluates whether a transfer of receivables qualifies for derecognition
 * under IFRS 9 §3.2.6 (substantially all risks and rewards transferred).
 *
 * Pure function — no I/O.
 */

export type FactoringInput = {
  receivableId: string;
  grossAmountMinor: number;
  factoringAdvanceRate: number;
  factoringFeeRate: number;
  recoursePercentage: number;
  latePaymentRiskPct: number;
  creditRiskRetainedPct: number;
};

export type FactoringResult = {
  receivableId: string;
  grossAmountMinor: number;
  advanceMinor: number;
  feeMinor: number;
  netProceedsMinor: number;
  retainedRiskPct: number;
  transferredRiskPct: number;
  qualifiesForDerecognition: boolean;
  derecognitionBasis: 'full' | 'continuing-involvement' | 'none';
  continuingInvolvementMinor: number;
  gainLossMinor: number;
};

/**
 * Evaluate factoring arrangement for IFRS 9 §3.2 derecognition.
 *
 * §3.2.6(a): Derecognise if substantially all risks and rewards transferred (retained < 10%)
 * §3.2.6(b): Continue to recognise if substantially all retained (retained > 90%)
 * §3.2.6(c): Continuing involvement approach if neither (10-90%)
 */
export function evaluateFactoring(
  input: FactoringInput,
): CalculatorResult<FactoringResult> {
  if (input.grossAmountMinor <= 0) {
    throw new DomainError('VALIDATION_FAILED', 'Gross receivable amount must be positive');
  }
  if (input.factoringAdvanceRate < 0 || input.factoringAdvanceRate > 1) {
    throw new DomainError('VALIDATION_FAILED', 'Advance rate must be between 0 and 1');
  }
  if (input.recoursePercentage < 0 || input.recoursePercentage > 100) {
    throw new DomainError('VALIDATION_FAILED', 'Recourse percentage must be 0-100');
  }

  const advanceMinor = Math.round(input.grossAmountMinor * input.factoringAdvanceRate);
  const feeMinor = Math.round(input.grossAmountMinor * input.factoringFeeRate);
  const netProceedsMinor = advanceMinor - feeMinor;

  const retainedRiskPct = Math.min(
    input.recoursePercentage * 0.5 + input.latePaymentRiskPct * 0.3 + input.creditRiskRetainedPct * 0.2,
    100,
  );
  const transferredRiskPct = 100 - retainedRiskPct;

  let derecognitionBasis: 'full' | 'continuing-involvement' | 'none';
  let qualifiesForDerecognition: boolean;
  let continuingInvolvementMinor: number;

  if (retainedRiskPct < 10) {
    derecognitionBasis = 'full';
    qualifiesForDerecognition = true;
    continuingInvolvementMinor = 0;
  } else if (retainedRiskPct > 90) {
    derecognitionBasis = 'none';
    qualifiesForDerecognition = false;
    continuingInvolvementMinor = input.grossAmountMinor;
  } else {
    derecognitionBasis = 'continuing-involvement';
    qualifiesForDerecognition = true;
    continuingInvolvementMinor = Math.round(input.grossAmountMinor * (retainedRiskPct / 100));
  }

  const derecognisedMinor = input.grossAmountMinor - continuingInvolvementMinor;
  const gainLossMinor = qualifiesForDerecognition ? netProceedsMinor - derecognisedMinor : 0;

  return {
    result: {
      receivableId: input.receivableId,
      grossAmountMinor: input.grossAmountMinor,
      advanceMinor,
      feeMinor,
      netProceedsMinor,
      retainedRiskPct: Math.round(retainedRiskPct * 100) / 100,
      transferredRiskPct: Math.round(transferredRiskPct * 100) / 100,
      qualifiesForDerecognition,
      derecognitionBasis,
      continuingInvolvementMinor,
      gainLossMinor,
    },
    inputs: input,
    explanation: `Factoring: ${derecognitionBasis} derecognition, retained risk ${Math.round(retainedRiskPct)}%, proceeds ${netProceedsMinor}`,
  };
}
