/**
 * Impairment of Assets — IAS 36
 *
 * Calculators: testImpairment, computeRecoverableAmount
 * Commands:    buildImpairmentTestIntent, buildImpairmentRecogniseIntent, buildImpairmentReverseIntent
 * Service:     performImpairmentTest, recogniseImpairment, reverseImpairment
 */

/** @see FIN-IA-TEST-01 — Impairment test queries (IAS 36) */
export { getImpairmentTest, listByAsset } from './queries/impairment-query';
export type { ImpairmentTestReadModel } from './queries/impairment-query';

export { computeRecoverableAmount, testImpairment } from './calculators/impairment-calc';
export type { ImpairmentCalcResult } from './calculators/impairment-calc';

export { allocateGoodwillToCgus } from './calculators/cgu-allocation';
export type { CguAllocationInput, CguAllocationResult, CguData } from './calculators/cgu-allocation';

export { computeGoodwillImpairment } from './calculators/goodwill-impairment';
export type { GoodwillImpairmentInput, GoodwillImpairmentResult } from './calculators/goodwill-impairment';

export { computeImpairmentReversal } from './calculators/impairment-reversal';
export type { ImpairmentReversalInput, ImpairmentReversalResult } from './calculators/impairment-reversal';

export { computeImpairmentDisclosure } from './calculators/impairment-disclosure';
export type { ImpairmentDisclosureInput, ImpairmentDisclosureResult, ImpairmentEvent } from './calculators/impairment-disclosure';

export {
  buildImpairmentRecogniseIntent,
  buildImpairmentReverseIntent,
  buildImpairmentTestIntent
} from './commands/impairment-intent';

/** @see FIN-IA-TEST-01 — Impairment service: test + recognise + reverse (IAS 36) */
export {
  performImpairmentTest,
  recogniseImpairment,
  reverseImpairment
} from './services/impairment-service';

