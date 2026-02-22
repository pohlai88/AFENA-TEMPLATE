import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see RR-01 — Five-step revenue model (IFRS 15)
 * @see RR-03 — Transaction price allocation to performance obligations
 * @see RR-08 — Contract costs: incremental costs of obtaining + fulfilment costs
 * @see SB-07 — Usage-based billing metering
 * RR-07 — Contract Modification Accounting (IFRS 15 §20)
 *
 * Determines whether a contract modification is treated as:
 * - Separate contract (distinct goods + standalone price)
 * - Prospective (terminate old + create new)
 * - Cumulative catch-up (single POB modification)
 *
 * Pure function — no I/O.
 */

export type ContractModification = {
  contractId: string;
  modificationId: string;
  originalTransactionPriceMinor: number;
  modificationPriceMinor: number;
  additionalGoodsDistinct: boolean;
  priceReflectsStandalone: boolean;
  remainingPobCount: number;
  revenueRecognizedToDateMinor: number;
  percentCompleteAtMod: number;
  /** IFRS 15.21: Does the modification create new performance obligations? */
  createsNewPobs?: boolean;
};

export type ModificationTreatment = {
  contractId: string;
  modificationId: string;
  treatment: 'separate_contract' | 'prospective' | 'cumulative_catchup';
  revisedTransactionPriceMinor: number;
  catchUpAdjustmentMinor: number;
  prospectiveRevenueMinor: number;
};

export function classifyContractModification(
  mod: ContractModification,
): CalculatorResult<ModificationTreatment> {
  if (mod.percentCompleteAtMod < 0 || mod.percentCompleteAtMod > 100) {
    throw new DomainError('VALIDATION_FAILED', 'percentCompleteAtMod must be 0-100');
  }

  let treatment: ModificationTreatment['treatment'];
  let catchUpAdjustmentMinor = 0;
  let prospectiveRevenueMinor = 0;
  const revisedTransactionPriceMinor = mod.originalTransactionPriceMinor + mod.modificationPriceMinor;

  // IFRS 15.20: Separate contract if additional goods are distinct AND at standalone price
  if (mod.additionalGoodsDistinct && mod.priceReflectsStandalone) {
    treatment = 'separate_contract';
    prospectiveRevenueMinor = mod.modificationPriceMinor;
    // IFRS 15.21(a): Modification creates new POBs → prospective (terminate old + new contract)
  } else if (mod.createsNewPobs || mod.remainingPobCount > 1) {
    treatment = 'prospective';
    prospectiveRevenueMinor = revisedTransactionPriceMinor - mod.revenueRecognizedToDateMinor;
    // IFRS 15.21(b): Modification changes existing POBs → cumulative catch-up with reallocation
  } else {
    treatment = 'cumulative_catchup';
    const shouldHaveRecognized = Math.round(revisedTransactionPriceMinor * (mod.percentCompleteAtMod / 100));
    catchUpAdjustmentMinor = shouldHaveRecognized - mod.revenueRecognizedToDateMinor;
    prospectiveRevenueMinor = revisedTransactionPriceMinor - shouldHaveRecognized;
  }

  return {
    result: { contractId: mod.contractId, modificationId: mod.modificationId, treatment, revisedTransactionPriceMinor, catchUpAdjustmentMinor, prospectiveRevenueMinor },
    inputs: mod,
    explanation: `Modification ${mod.modificationId}: ${treatment}, revised price=${revisedTransactionPriceMinor}, catch-up=${catchUpAdjustmentMinor}`,
  };
}
