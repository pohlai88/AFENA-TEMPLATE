/**
 * Hedge Accounting — IFRS 9 §6
 *
 * Calculators: testEffectiveness, computeOciMovement
 * Queries:     getHedgeDesignation, getEffectivenessTest
 * Commands:    buildHedgeDesignateIntent, buildHedgeEffectivenessIntent, buildOciReclassIntent
 * Service:     fetchDesignation, designate, recordEffectiveness, reclassOci
 */

// ── Calculators ─────────────────────────────────────────
export { computeOciMovement, testEffectiveness } from './calculators/hedge-calc';
export type { EffectivenessResult, OciMovementResult } from './calculators/hedge-calc';

export { evaluateHedgeRebalancing } from './calculators/hedge-rebalancing';
export type { HedgeRebalanceInput, HedgeRebalanceResult } from './calculators/hedge-rebalancing';

// ── Queries ─────────────────────────────────────────────
export { getEffectivenessTest, getHedgeDesignation } from './queries/hedge-query';
export type { EffectivenessTestReadModel, HedgeDesignationReadModel } from './queries/hedge-query';

// ── Commands ────────────────────────────────────────────
export {
  buildHedgeDesignateIntent,
  buildHedgeEffectivenessIntent,
  buildOciReclassIntent
} from './commands/hedge-intent';

// ── Service ─────────────────────────────────────────────
export {
  designate,
  fetchDesignation,
  reclassOci,
  recordEffectiveness
} from './services/hedge-service';

export { computeHedgeDiscontinuation } from './calculators/hedge-discontinuation';
export type { DiscontinuationResult, HedgeDiscontinuationInput } from './calculators/hedge-discontinuation';

export { computeHedgeCostOfHedging } from './calculators/hedge-cost-of-hedging';
export type { HedgeCostOfHedgingInput, HedgeCostOfHedgingResult } from './calculators/hedge-cost-of-hedging';

export { computeNetInvestmentHedge } from './calculators/net-investment-hedge';
export type { NetInvestmentHedgeInput, NetInvestmentHedgeResult } from './calculators/net-investment-hedge';

