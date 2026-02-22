/**
 * Intangible Assets — IAS 38 Intangible Assets
 *
 * Calculators: capitaliseRnD, calculateAmortisation
 * Queries:     getIntangibleAsset
 * Commands:    buildCapitaliseIntent, buildAmortiseIntent, buildImpairIntent
 * Service:     fetchAsset, capitalise, amortise, impair
 */

// ── Calculators ─────────────────────────────────────────
export { calculateAmortisation, capitaliseRnD } from './calculators/intangible-calc';
export type { AmortisationResult, CapitaliseResult } from './calculators/intangible-calc';

export { evaluateDevCapitalization } from './calculators/dev-capitalization';
export type { DevCapitalizationInput, DevCapitalizationResult } from './calculators/dev-capitalization';

// ── Queries ─────────────────────────────────────────────
export { getIntangibleAsset } from './queries/intangible-query';
export type { IntangibleAssetReadModel } from './queries/intangible-query';

// ── Commands ────────────────────────────────────────────
export {
  buildAmortiseIntent,
  buildCapitaliseIntent,
  buildImpairIntent
} from './commands/intangible-intent';

// ── Service ─────────────────────────────────────────────
export { amortise, capitalise, fetchAsset, impair } from './services/intangible-service';

export { validateGoodwillProhibition } from './calculators/goodwill-prohibition';
export type { GoodwillProhibitionResult, IntangibleProposal } from './calculators/goodwill-prohibition';

