/**
 * Share-Based Payment — IFRS 2
 */

/** @see FIN-SBP-VEST-01 — Share-based payment grant queries (IFRS 2) */
export { getSbpGrant, listActiveGrants } from './queries/sbp-query';
export type { SbpGrantReadModel } from './queries/sbp-query';

export { computePeriodExpense, computeVestingExpense } from './calculators/sbp-calc';
export type { PeriodExpenseResult, VestingExpenseResult } from './calculators/sbp-calc';

export {
  buildSbpExpenseIntent,
  buildSbpGrantIntent,
  buildSbpVestIntent
} from './commands/sbp-intent';

/** @see FIN-SBP-VEST-01 — SBP service: grant + vest + expense (IFRS 2) */
export { grantSbp, recogniseSbpExpense, vestSbp } from './services/sbp-service';
