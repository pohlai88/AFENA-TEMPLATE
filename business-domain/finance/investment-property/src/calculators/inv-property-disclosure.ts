/**
 * IAS 40.79 — Investment Property Disclosure Computation
 *
 * Computes the reconciliation of carrying amounts and other
 * disclosure requirements for investment property.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type InvPropertyDisclosureInput = {
  openingCarryingMinor: number;
  additionsMinor: number;
  disposalsMinor: number;
  fvGainLossMinor: number;
  depreciationMinor: number;
  transfersInMinor: number;
  transfersOutMinor: number;
  fxTranslationMinor: number;
};

export type InvPropertyDisclosureResult = {
  closingCarryingMinor: number;
  rentalIncomeMinor: number;
  reconciliation: Record<string, number>;
  explanation: string;
};

export function computeInvPropertyDisclosure(
  inputs: InvPropertyDisclosureInput,
): CalculatorResult<InvPropertyDisclosureResult> {
  const {
    openingCarryingMinor, additionsMinor, disposalsMinor, fvGainLossMinor,
    depreciationMinor, transfersInMinor, transfersOutMinor, fxTranslationMinor,
  } = inputs;

  if (openingCarryingMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Opening carrying cannot be negative');

  const closingCarryingMinor =
    openingCarryingMinor + additionsMinor - disposalsMinor + fvGainLossMinor -
    depreciationMinor + transfersInMinor - transfersOutMinor + fxTranslationMinor;

  const reconciliation = {
    opening: openingCarryingMinor,
    additions: additionsMinor,
    disposals: disposalsMinor,
    fvGainLoss: fvGainLossMinor,
    depreciation: depreciationMinor,
    transfersIn: transfersInMinor,
    transfersOut: transfersOutMinor,
    fxTranslation: fxTranslationMinor,
    closing: closingCarryingMinor,
  };

  const explanation =
    `Investment property disclosure (IAS 40.79): opening ${openingCarryingMinor} → closing ${closingCarryingMinor}`;

  return {
    result: { closingCarryingMinor, rentalIncomeMinor: 0, reconciliation, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
