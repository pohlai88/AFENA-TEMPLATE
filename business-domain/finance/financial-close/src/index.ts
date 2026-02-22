/**
 * @see FIN-CLOSE-PACK-01 — Close generates evidence pack and locks period
 */

// ── Calculators ─────────────────────────────────────────
export {
  computeCloseProgress,
  isCloseComplete,
  resolveCloseDependencies
} from './calculators/dependency-resolver';
export type { CloseTaskNode, DependencyResult } from './calculators/dependency-resolver';

export { summarizeValidation, validateCloseEvidence } from './calculators/close-validation';
export type { EvidenceRequirement, ValidationCheck } from './calculators/close-validation';

export { assembleDisclosurePack } from './calculators/disclosure-pack';
export type { DisclosureCategory, DisclosureGap, DisclosureItem, DisclosurePackResult, DisclosureRequirement } from './calculators/disclosure-pack';

export { sequenceMultiCompanyClose } from './calculators/multi-company-close';
export type { CloseSequenceResult, CompanyCloseStatus } from './calculators/multi-company-close';

export { deriveCashFlowFromTb } from './calculators/cash-flow-indirect';
export type { CashFlowReportResult, TrialBalanceMovement } from './calculators/cash-flow-indirect';

// ── Queries ─────────────────────────────────────────────
export { getCloseEvidence, getCloseTask, getCloseTasksByPeriod } from './queries/close-query';
export type { CloseEvidenceReadModel, CloseTaskReadModel } from './queries/close-query';

// ── Commands ────────────────────────────────────────────
export {
  buildAdjustmentPostIntent,
  buildCompleteTaskIntent,
  buildFinalizeRunIntent,
  buildHardLockIntent
} from './commands/close-intent';

// ── Service ─────────────────────────────────────────────
export {
  completeTask,
  fetchCloseChecklist,
  fetchCloseStatus,
  fetchTaskEvidence,
  finalizeCloseRun,
  generateClosePack,
  hardLockPeriod,
  postAdjustment,
  validateCloseReadiness
} from './services/close-service';
export type { CloseEvidencePack } from './services/close-service';

