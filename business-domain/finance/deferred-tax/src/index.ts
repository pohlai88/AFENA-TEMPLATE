/**
 * Deferred Tax — IAS 12
 *
 * Calculators: calculateTemporaryDifferences, computeDeferredTax
 * Commands:    buildDeferredTaxCalculateIntent, buildDeferredTaxRecogniseIntent
 * Service:     calculateAndRecognise
 */

/** @see FIN-TAX-DT-01 — Deferred tax queries (IAS 12) */
export { getDeferredTaxItem, listByPeriod } from './queries/deferred-tax-query';
export type { DeferredTaxReadModel } from './queries/deferred-tax-query';

export { calculateTemporaryDifferences, computeDeferredTax } from './calculators/deferred-tax-calc';
export type { DeferredTaxResult, TemporaryDifference } from './calculators/deferred-tax-calc';

export {
  buildDeferredTaxCalculateIntent,
  buildDeferredTaxRecogniseIntent
} from './commands/deferred-tax-intent';

/** @see FIN-TAX-DT-01 — Deferred tax service: calculate + recognise (IAS 12) */
export { calculateAndRecognise } from './services/deferred-tax-service';
