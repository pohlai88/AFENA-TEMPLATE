/**
 * IAS 37.59 — Provision Utilisation
 *
 * Computes the utilisation of a provision against the expenditure
 * for which it was originally recognised.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type ProvisionUtilisationInput = {
  provisionBalanceMinor: number;
  expenditureMinor: number;
  utilisationDate: string;
};

export type ProvisionUtilisationResult = {
  utilisedMinor: number;
  excessMinor: number;
  remainingBalanceMinor: number;
  explanation: string;
};

export function computeProvisionUtilisation(
  inputs: ProvisionUtilisationInput,
): CalculatorResult<ProvisionUtilisationResult> {
  const { provisionBalanceMinor, expenditureMinor } = inputs;

  if (provisionBalanceMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Provision balance cannot be negative');
  if (expenditureMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Expenditure cannot be negative');

  const utilisedMinor = Math.min(provisionBalanceMinor, expenditureMinor);
  const excessMinor = Math.max(0, expenditureMinor - provisionBalanceMinor);
  const remainingBalanceMinor = provisionBalanceMinor - utilisedMinor;

  const explanation = excessMinor > 0
    ? `Provision utilisation (IAS 37.59): utilised ${utilisedMinor}, excess expenditure ${excessMinor} to P&L, remaining ${remainingBalanceMinor}`
    : `Provision utilisation (IAS 37.59): utilised ${utilisedMinor}, remaining ${remainingBalanceMinor}`;

  return {
    result: { utilisedMinor, excessMinor, remainingBalanceMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
