/**
 * @see FIN-AR-INV-01 — Credit policy enforcement for AR invoicing
 * @see FIN-CTRL-SOD-01 — Credit limit overrides require approval
 */

export { computeCollateralCoverage } from './calculators/collateral-tracking';
export { checkCreditLimit } from './calculators/credit-check';
export { computeCreditExposure } from './calculators/credit-exposure';
export { computeEclStaging } from './calculators/ecl-staging';
export { evaluateSoD, getCreditCheck, getCreditExposure } from './services/credit-service';
export type { SoDConflict, SoDEvaluationResult } from './services/credit-service';

export type { CollateralCoverageResult } from './calculators/collateral-tracking';
export type { CreditCheckResult } from './calculators/credit-check';
export type { ExposureResult, InvoiceBalance, OrderAmount } from './calculators/credit-exposure';
export type {
  CreditExposure as EclCreditExposure,
  EclPortfolioResult
} from './calculators/ecl-staging';

export { DEFAULT_DUNNING_POLICY, generateDunningActions } from './calculators/dunning-letters';
export type { DunningAction, DunningCustomer, DunningPolicy, DunningResult } from './calculators/dunning-letters';

export { buildDunningRunCreateIntent } from './commands/dunning-intent';
export {
  createDunningRun,
  getDunningRunNotices,
  listDunningRuns
} from './services/dunning-service';

export type { DunningNoticeReadModel, DunningRunReadModel } from './queries/dunning-query';

export { analyzePaymentHistory } from './calculators/payment-history';
export type { PaymentHistoryResult, PaymentRecord } from './calculators/payment-history';

export { evaluateBadDebtWriteOffs } from './calculators/bad-debt-writeoff';
export type { BadDebtCandidate, BadDebtWriteOffResult } from './calculators/bad-debt-writeoff';

