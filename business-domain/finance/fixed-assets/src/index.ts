/**
 * @see FIN-FA-DEPR-01 — Depreciation runs are deterministic and post correctly to GL
 */

export { calculateDepreciation } from './calculators/depreciation';
export { computeDisposalGainLoss } from './calculators/disposal';
export { computeRevaluation } from './calculators/revaluation';
export { getDepreciation, getDisposalGainLoss, getRevaluation, runDepreciationBatchAndPost } from './services/fixed-assets-service';

export type { DepreciationMethod, DepreciationResult } from './calculators/depreciation';
export type { DisposalResult } from './calculators/disposal';
export type { RevaluationResult } from './calculators/revaluation';

export { evaluateCwipCapitalization } from './calculators/cwip-capitalization';
export type { CapitalizationInput, CapitalizationResult, CwipCostLine } from './calculators/cwip-capitalization';

export { computeAssetTransfer } from './calculators/ic-asset-transfer';
export type { AssetTransferInput, AssetTransferResult } from './calculators/ic-asset-transfer';

export { computeComponentDepreciation } from './calculators/component-depreciation';
export type { AssetComponent, ComponentDepreciationResult, ComponentScheduleLine } from './calculators/component-depreciation';

export { computeImpairment } from './calculators/impairment';
export type { ImpairmentResult } from './calculators/impairment';

