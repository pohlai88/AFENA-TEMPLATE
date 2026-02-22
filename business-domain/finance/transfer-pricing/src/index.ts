// ── Calculators ─────────────────────────────────────────
export { computeTransferPrice, validateTpResult } from './calculators/tp-engine';

export { generateCbcrReport } from './calculators/cbcr-report';
export type { CbcrEntity, CbcrJurisdictionSummary, CbcrResult } from './calculators/cbcr-report';

export { evaluateThinCapitalization } from './calculators/thin-capitalization';
export type { ThinCapInput, ThinCapResult } from './calculators/thin-capitalization';
export type {
  TpCalculationInput,
  TpCalculationResult,
  TpMethod,
  TpPliConfig
} from './calculators/tp-engine';

// ── Queries ─────────────────────────────────────────────
export {
  getActivePolicies,
  getCalculationsByPolicy,
  getTpCalculation,
  getTpPolicy
} from './queries/tp-query';
export type { TpCalculationReadModel, TpPolicyReadModel } from './queries/tp-query';

// ── Commands ────────────────────────────────────────────
export { buildComputePriceIntent, buildPublishPolicyIntent } from './commands/tp-intent';

// ── Service ─────────────────────────────────────────────
export {
  computePrice,
  fetchCalculation,
  fetchCalculationHistory,
  fetchPolicies,
  fetchPolicy,
  publishPolicy
} from './services/tp-service';

export { generateTpDocumentation } from './calculators/tp-documentation';
export type { DocumentSection, TpDocInput, TpDocResult } from './calculators/tp-documentation';

export { evaluateApaCompliance } from './calculators/apa-tracker';
export type { ApaInput, ApaResult, ApaStatus, CoveredTransaction } from './calculators/apa-tracker';

