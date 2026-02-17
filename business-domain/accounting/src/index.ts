// Tax services
export {
  resolveTaxRate,
  calculateLineTax,
  calculateTaxForLine,
  type ResolvedTaxRate,
  type TaxLineResult,
} from './services/tax-calc';

// FX services
export {
  lookupFxRate,
  type FxRateResult,
} from './services/fx-lookup';

// Depreciation services
export {
  generateDepreciationSchedule,
  calculateDepreciation,
  type DepreciationPeriodResult,
  type DepreciationScheduleResult,
} from './services/depreciation-engine';

// Revenue recognition services
export {
  generateStraightLineSchedule,
  createRevenueSchedule,
  recognizeRevenue,
  type RecognitionLineResult,
  type RecognitionScheduleResult,
} from './services/revenue-recognition';

// Payment allocation services
export {
  allocatePayment,
  getPaymentAllocationSummary,
  getAllocationsForTarget,
  type AllocationResult,
  type PaymentAllocationSummary,
} from './services/payment-allocation';

// Fiscal period services
export {
  checkPeriodOpen,
  assertPeriodOpen,
  type FiscalPeriodStatus,
} from './services/fiscal-period';

// Fiscal year utilities
export {
  resolveFiscalYear,
} from './services/fiscal-year';

// Bank reconciliation
export type {
  StatementLineForMatch,
  MatchCandidate,
  AutoMatchResult,
} from './services/bank-reconciliation';

export {
  scoreMatch,
  autoMatchStatementLines,
  recordReconciliationMatch,
} from './services/bank-reconciliation';
