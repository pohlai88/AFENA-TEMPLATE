/**
 * Borrowing Costs — IAS 23
 */

/** @see FIN-BC-CAP-01 — Borrowing cost queries (IAS 23) */
export { getBorrowingCost, listByAssetAndPeriod } from './queries/borrow-cost-query';
export type { BorrowingCostReadModel } from './queries/borrow-cost-query';

export { computeCapitalisableAmount, testCessation } from './calculators/borrow-cost-calc';
export type { CapitalisationResult, CessationTestResult } from './calculators/borrow-cost-calc';

export {
  buildBorrowCostCapitaliseIntent,
  buildBorrowCostCeaseIntent
} from './commands/borrow-cost-intent';

/** @see FIN-BC-CAP-01 — Borrowing cost service: capitalise + cease (IAS 23) */
export { capitaliseBorrowingCost, ceaseBorrowingCost } from './services/borrow-cost-service';
