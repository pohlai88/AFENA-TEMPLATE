/**
 * Employee Benefits — IAS 19
 */

/** @see FIN-EB-PLAN-01 — Employee benefit plan queries (IAS 19) */
export { getBenefitPlan, listActivePlans } from './queries/emp-benefit-query';
export type { BenefitPlanReadModel } from './queries/emp-benefit-query';

export { computeDefinedBenefitCost, remeasureObligation } from './calculators/emp-benefit-calc';
export type { DefinedBenefitCostResult, RemeasurementResult } from './calculators/emp-benefit-calc';

export { computePlanAssetReturn } from './calculators/plan-asset-return';
export type { PlanAssetReturnInput, PlanAssetReturnResult } from './calculators/plan-asset-return';

export { computeCurtailmentGain } from './calculators/curtailment-gain';
export type { CurtailmentGainInput, CurtailmentGainResult } from './calculators/curtailment-gain';

export { computePastServiceCost } from './calculators/past-service-cost';
export type { PastServiceCostInput, PastServiceCostResult } from './calculators/past-service-cost';

export { computeEmpBenefitDisclosure } from './calculators/emp-benefit-disclosure';
export type { EmpBenefitDisclosureInput, EmpBenefitDisclosureResult } from './calculators/emp-benefit-disclosure';

export {
  buildEmpBenefitAccrueIntent,
  buildEmpBenefitRemeasureIntent
} from './commands/emp-benefit-intent';

/** @see FIN-EB-PLAN-01 — Employee benefit service: accrue + remeasure (IAS 19) */
export { accrueBenefitCost, remeasurePlan } from './services/emp-benefit-service';
