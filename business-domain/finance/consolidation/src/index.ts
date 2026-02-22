/**
 * @see FIN-GRP-STRUCT-01 — Group structure versioned by effective date
 * @see FIN-IC-MIRROR-01 — IC transactions mirrored with shared references
 */

export { computeEliminations } from './calculators/elimination';
export { translateTrialBalance } from './calculators/fx-translation';
export {
  buildConsolidationEliminateIntent,
  buildConsolidationTranslateIntent
} from './commands/consol-intent';
export { getUnmatchedIcBalances } from './queries/consol-query';
export {
  eliminateFromDb,
  getEliminations,
  getTranslatedTrialBalance,
  translateAndEmit,
  updateGroupOwnership
} from './services/consolidation-service';
export type { GroupOwnershipResult, OwnershipChange } from './services/consolidation-service';

export type { EliminationEntry, IntercompanyBalance } from './calculators/elimination';
export type {
  TranslatedEntry,
  TranslationRates,
  TrialBalanceEntry
} from './calculators/fx-translation';
export type { IcBalanceReadModel } from './queries/consol-query';

export { generateConsolJournal } from './calculators/auto-consol-journal';
export type { ConsolJournalLine, ConsolJournalResult, IcMatchedPair } from './calculators/auto-consol-journal';

export { computeNci } from './calculators/nci-calculation';
export type { NciPortfolioResult, NciResult, SubsidiaryData } from './calculators/nci-calculation';

export { eliminateIcDividends } from './calculators/ic-dividend-elimination';
export type { DividendEliminationResult, IcDividend } from './calculators/ic-dividend-elimination';

export { computeIcNetting } from './calculators/ic-netting';
export type { IcBalance, IcNettingResult, NettedPair } from './calculators/ic-netting';

export { computePurchasePriceAllocation } from './calculators/goodwill-ppa';
export type { PpaInput, PpaResult } from './calculators/goodwill-ppa';

export { computeStepAcquisition } from './calculators/step-acquisition';
export type { StepAcquisitionInput, StepAcquisitionResult } from './calculators/step-acquisition';

export { classifyConsolidationMethod, computeEquityMethodConsolidation } from './calculators/equity-method';
export type { ConsolidationMethod, EquityMethodPortfolioResult, EquityMethodResult, InvesteeData } from './calculators/equity-method';

