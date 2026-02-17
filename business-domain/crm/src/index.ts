/**
 * afenda-crm
 *
 * Customer relationship management and pricing domain services
 * for the AFENDA-NEXUS ERP system.
 */

export type {
  AppliedDiscount,
  LinePricingResult,
  ResolvedPrice,
} from './services/pricing-engine.js';

export {
  evaluateDiscounts,
  priceLineItem,
  resolvePrice,
} from './services/pricing-engine.js';

// Budget enforcement
export type {
  BudgetCheckResult,
} from './services/budget-enforcement.js';

export {
  checkBudget,
  commitBudget,
  releaseBudgetCommitment,
} from './services/budget-enforcement.js';
