/**
 * Biological Assets — IAS 41
 */

/** @see FIN-BA-FV-01 — Biological asset queries (IAS 41) */
export { getBioAsset, listByClass } from './queries/bio-query';
export type { BioAssetReadModel } from './queries/bio-query';

export { computeHarvestValue, measureBioAsset } from './calculators/bio-calc';
export type { BioMeasurementResult, HarvestValueResult } from './calculators/bio-calc';

export { computeBearerPlantDepreciation } from './calculators/bearer-plant-depreciation';
export type { BearerPlantDepreciationInput, BearerPlantDepreciationResult } from './calculators/bearer-plant-depreciation';

export { analyseBioAssetGainLoss } from './calculators/bio-asset-gain-loss';
export type { BioAssetGainLossInput, BioAssetGainLossResult } from './calculators/bio-asset-gain-loss';

export { computeHarvestAtFairValue } from './calculators/harvest-at-fair-value';
export type { HarvestAtFairValueInput, HarvestAtFairValueResult } from './calculators/harvest-at-fair-value';

export { computeBioAssetDisclosure } from './calculators/bio-asset-disclosure';
export type { BioAssetDisclosureInput, BioAssetDisclosureResult } from './calculators/bio-asset-disclosure';

export { buildBioAssetHarvestIntent, buildBioAssetMeasureIntent } from './commands/bio-intent';

/** @see FIN-BA-FV-01 — Biological asset service: measure + harvest (IAS 41) */
export { harvestProduce, measureAsset } from './services/bio-service';
