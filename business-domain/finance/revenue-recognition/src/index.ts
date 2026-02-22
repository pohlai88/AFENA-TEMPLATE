export { allocateTransactionPrice } from './calculators/performance-obligation';
export { buildRevenueSchedule } from './calculators/revenue-schedule';
export { deferRevenue, getAllocatedObligations, getRevenueSchedule } from './services/revenue-service';
export type { DeferralResult } from './services/revenue-service';

export type { AllocatedObligation, PerformanceObligation } from './calculators/performance-obligation';
export type { RevenueMethod, RevenueScheduleEntry } from './calculators/revenue-schedule';

export { estimateVariableConsideration } from './calculators/variable-consideration';
export type { ConstrainedEstimate, VariableComponent, VariableConsiderationResult } from './calculators/variable-consideration';

export { classifyContractModification } from './calculators/contract-modification';
export type { ContractModification, ModificationTreatment } from './calculators/contract-modification';

export { evaluateRecognitionCriteria } from './calculators/recognition-criteria';
export type { RecognitionInput, RecognitionResult } from './calculators/recognition-criteria';

