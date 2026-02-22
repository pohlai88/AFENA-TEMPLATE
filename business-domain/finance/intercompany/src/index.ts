/**
 * @see FIN-IC-MIRROR-01 — IC transactions mirrored with shared references and auto-balancing
 */

export { matchIcTransactions } from './calculators/ic-matching';
export type { IcMatchPair, IcTransaction } from './calculators/ic-matching';

export { computeIcNetting } from './calculators/ic-netting-calc';
export type { IcBalance, IcNettingResult } from './calculators/ic-netting-calc';

export { validateIcPricing } from './calculators/ic-pricing-validation';
export type { IcPricingValidationInput, IcPricingValidationResult } from './calculators/ic-pricing-validation';

export { classifyIcDispute } from './calculators/ic-dispute-classification';
export type { IcDisputeClassificationResult, IcDisputeInput } from './calculators/ic-dispute-classification';

export { computeIcSettlement } from './calculators/ic-settlement-calc';
export type { IcSettlementInput, IcSettlementResult } from './calculators/ic-settlement-calc';

export { createAndMirrorIc, reconcileFromDb, reconcileIntercompany } from './services/ic-service';
export type { IcReconciliationResult } from './services/ic-service';

