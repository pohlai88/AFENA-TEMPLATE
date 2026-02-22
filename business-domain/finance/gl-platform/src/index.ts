/**
 * @see FIN-MD-COA-01 — CoA versioning and immutability
 * @see FIN-MD-PERIOD-01 — Period controls (open/soft-close/hard-close)
 * @see FIN-MD-DIM-01 — Required dimensions enforced by rule
 * @see FIN-GL-POST-01 — Posting is idempotent, atomic, balanced
 * @see FIN-GL-IMMUT-01 — Posted entries are immutable
 * @see FIN-MG-ADJ-01 — Multi-ledger adjustments isolated by book
 */

/* --- Calculators --- */
export { validatePeriodOverlap } from './calculators/period-overlap';
export type { PeriodOverlapResult, PeriodRange } from './calculators/period-overlap';

export { getAncestors, getSubtree, validateCoaIntegrity } from './calculators/coa-hierarchy';
export type { AccountNode, CoaTreeResult } from './calculators/coa-hierarchy';

export { computeTrialBalance } from './calculators/trial-balance';
export type {
  TrialBalanceInput,
  TrialBalanceResult,
  TrialBalanceRow
} from './calculators/trial-balance';

export { allocateDocumentNumber } from './calculators/number-range';
export type { NumberRangeConfig, NumberRangeResult } from './calculators/number-range';

export { validateDimensions } from './calculators/segment-dimension';
export type { DimensionValidationResult, DimensionValue, JournalLineDimensions } from './calculators/segment-dimension';

/* --- Commands --- */
export {
  buildClosePeriodIntent,
  buildOpenPeriodIntent,
  buildPublishCoaIntent
} from './commands/gl-intent';

/* --- Queries (read models) --- */
export type {
  CoaAccountReadModel,
  DocumentTypeReadModel,
  LedgerReadModel,
  PostingPeriodReadModel
} from './queries/gl-query';

/* --- Service --- */
export {
  closePeriod,
  computeBookVariance,
  fetchChartOfAccounts,
  fetchDocumentType,
  fetchLedger,
  fetchPostingPeriod,
  fetchTrialBalance,
  listCompanyLedgers,
  listPeriods,
  openPeriod,
  postBookAdjustment,
  publishChartOfAccounts
} from './services/gl-platform-service';
export type { BookAdjustmentInput, BookVarianceResult } from './services/gl-platform-service';

/* --- Adapters --- */
export { createDocumentNumberAdapter } from './adapters/document-number-adapter';
export { createLedgerControlAdapter } from './adapters/ledger-control-adapter';

