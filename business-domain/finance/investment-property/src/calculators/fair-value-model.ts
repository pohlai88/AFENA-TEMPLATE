/**
 * IAS 40.33-55 — Fair Value Model
 *
 * Investment property measured at fair value with changes
 * recognised in profit or loss.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type FairValueModelInput = {
  propertyId: string;
  prevFairValueMinor: number;
  currFairValueMinor: number;
  rentalIncomeMinor: number;
  directOperatingExpensesMinor: number;
};

export type FairValueModelResult = {
  fvChangeMinor: number;
  netRentalIncomeMinor: number;
  totalReturnMinor: number;
  yieldPct: string;
  explanation: string;
};

export function computeFairValueModel(
  inputs: FairValueModelInput,
): CalculatorResult<FairValueModelResult> {
  const { prevFairValueMinor, currFairValueMinor, rentalIncomeMinor, directOperatingExpensesMinor } = inputs;

  if (prevFairValueMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Previous fair value cannot be negative');
  if (currFairValueMinor < 0) throw new DomainError('VALIDATION_FAILED', 'Current fair value cannot be negative');

  const fvChangeMinor = currFairValueMinor - prevFairValueMinor;
  const netRentalIncomeMinor = rentalIncomeMinor - directOperatingExpensesMinor;
  const totalReturnMinor = fvChangeMinor + netRentalIncomeMinor;
  const yieldPct = prevFairValueMinor > 0
    ? `${((netRentalIncomeMinor / prevFairValueMinor) * 100).toFixed(2)}%`
    : '0.00%';

  const explanation =
    `Fair value model (IAS 40.33): FV change ${fvChangeMinor} → P&L, ` +
    `net rental ${netRentalIncomeMinor}, yield ${yieldPct}, total return ${totalReturnMinor}`;

  return {
    result: { fvChangeMinor, netRentalIncomeMinor, totalReturnMinor, yieldPct, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
