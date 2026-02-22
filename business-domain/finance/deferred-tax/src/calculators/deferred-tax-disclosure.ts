/**
 * IAS 12.81 — Deferred Tax Disclosure Computation
 *
 * Computes the disclosure amounts required by IAS 12.81:
 * components of tax expense, unrecognised DTA, and expiry analysis.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type DeferredTaxDisclosureInput = {
  currentTaxExpenseMinor: number;
  deferredTaxMovementMinor: number;
  unrecognisedDtaMinor: number;
  taxLossCarryforwards: Array<{ expiryYear: number; amountMinor: number }>;
};

export type DeferredTaxDisclosureResult = {
  totalTaxExpenseMinor: number;
  currentComponent: number;
  deferredComponent: number;
  unrecognisedDtaMinor: number;
  lossCarryforwardTotal: number;
  expiryAnalysis: Array<{ expiryYear: number; amountMinor: number }>;
  explanation: string;
};

export function computeDeferredTaxDisclosure(
  inputs: DeferredTaxDisclosureInput,
): CalculatorResult<DeferredTaxDisclosureResult> {
  const { currentTaxExpenseMinor, deferredTaxMovementMinor, unrecognisedDtaMinor, taxLossCarryforwards } = inputs;

  if (unrecognisedDtaMinor < 0) {
    throw new DomainError('VALIDATION_FAILED', 'Unrecognised DTA cannot be negative');
  }

  const totalTaxExpenseMinor = currentTaxExpenseMinor + deferredTaxMovementMinor;
  const lossCarryforwardTotal = taxLossCarryforwards.reduce((s, l) => s + l.amountMinor, 0);
  const expiryAnalysis = [...taxLossCarryforwards].sort((a, b) => a.expiryYear - b.expiryYear);

  const explanation =
    `Deferred tax disclosure (IAS 12.81): total tax ${totalTaxExpenseMinor} ` +
    `(current ${currentTaxExpenseMinor} + deferred ${deferredTaxMovementMinor}), ` +
    `unrecognised DTA ${unrecognisedDtaMinor}, loss c/f ${lossCarryforwardTotal}`;

  return {
    result: {
      totalTaxExpenseMinor,
      currentComponent: currentTaxExpenseMinor,
      deferredComponent: deferredTaxMovementMinor,
      unrecognisedDtaMinor,
      lossCarryforwardTotal,
      expiryAnalysis,
      explanation,
    },
    inputs: { ...inputs },
    explanation,
  };
}
