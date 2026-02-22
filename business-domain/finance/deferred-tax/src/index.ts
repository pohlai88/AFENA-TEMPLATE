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

export { evaluateDtaRecognition } from './calculators/dta-recognition-evaluation';
export type { DtaRecognitionTestInput, DtaRecognitionTestResult } from './calculators/dta-recognition-evaluation';

export { computeTaxRateReconciliation } from './calculators/tax-rate-reconciliation';
export type { TaxRateReconciliationInput, TaxRateReconciliationResult } from './calculators/tax-rate-reconciliation';

export { computeOffsetDtaDtl } from './calculators/offset-dta-dtl';
export type { OffsetDtaDtlResult, TaxJurisdictionBalance } from './calculators/offset-dta-dtl';

export { computeDeferredTaxDisclosure } from './calculators/deferred-tax-disclosure';
export type { DeferredTaxDisclosureInput, DeferredTaxDisclosureResult } from './calculators/deferred-tax-disclosure';

export {
  buildDeferredTaxCalculateIntent,
  buildDeferredTaxRecogniseIntent
} from './commands/deferred-tax-intent';

/** @see FIN-TAX-DT-01 — Deferred tax service: calculate + recognise (IAS 12) */
export { calculateAndRecognise } from './services/deferred-tax-service';
