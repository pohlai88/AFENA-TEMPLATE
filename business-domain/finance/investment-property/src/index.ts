/**
 * Investment Property — IAS 40
 */

/** @see FIN-IP-MEAS-01 — Investment property queries (IAS 40) */
export { getProperty, listActiveProperties } from './queries/inv-property-query';
export type { InvestmentPropertyReadModel } from './queries/inv-property-query';

export {
  calculateTransferAdjustment,
  measureInvestmentProperty
} from './calculators/inv-property-calc';
export type {
  InvPropertyMeasurementResult,
  TransferAdjustmentResult
} from './calculators/inv-property-calc';

export { computeFairValueModel } from './calculators/fair-value-model';
export type { FairValueModelInput, FairValueModelResult } from './calculators/fair-value-model';

export { computeCostModelDepreciation } from './calculators/cost-model-depreciation';
export type { CostModelDepreciationInput, CostModelDepreciationResult } from './calculators/cost-model-depreciation';

export { classifyTransfer } from './calculators/transfer-classification';
export type { TransferClassificationInput, TransferClassificationResult } from './calculators/transfer-classification';

export { computeInvPropertyDisclosure } from './calculators/inv-property-disclosure';
export type { InvPropertyDisclosureInput, InvPropertyDisclosureResult } from './calculators/inv-property-disclosure';

export {
  buildInvPropertyMeasureIntent,
  buildInvPropertyTransferIntent
} from './commands/inv-property-intent';

/** @see FIN-IP-MEAS-01 — Investment property service: measure + transfer (IAS 40) */
export { measureProperty, transferProperty } from './services/inv-property-service';
