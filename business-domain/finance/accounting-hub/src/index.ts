/**
 * @see FIN-GL-POST-01 — Posting balanced-by-construction via derivation engine
 * @see FIN-BL-AUD-01 — Audit trail via derivation audit
 * @see FIN-INT-OUTBOX-01 — Outbox-driven integration replay-safe
 * @see FIN-BL-ISO-01 — Tenant isolation enforced on all finance tables via RLS
 * @see FIN-OPS-SLA-01 — Posting and close meet performance baselines with observability
 */

/* --- Calculators --- */
export { computeDerivationId, deriveJournalLines } from './calculators/derivation-engine';
export type {
  DerivationInput,
  DerivationResult,
  DerivedJournalLine,
  MappingRule
} from './calculators/derivation-engine';

export { allocateProportional } from './calculators/allocation-engine';
export type {
  AllocationLine,
  AllocationResult,
  AllocationTarget
} from './calculators/allocation-engine';

export { computeReclassLines } from './calculators/reclass-calculator';
export type { ReclassEntry, ReclassLine, ReclassResult } from './calculators/reclass-calculator';

export { computeAccrualLines } from './calculators/accrual-calculator';
export type { AccrualInput, AccrualLine, AccrualResult } from './calculators/accrual-calculator';

export { generateFromTemplate } from './calculators/recurring-template';
export type { GeneratedJournal, RecurringTemplate, RecurringTemplateLine } from './calculators/recurring-template';

export { previewDerivation } from './calculators/preview-mode';
export type { PreviewEntry, PreviewEvent, PreviewResult } from './calculators/preview-mode';

/* --- Commands --- */
export {
  buildAccrualRunIntent,
  buildAllocationRunIntent,
  buildDeriveCommitIntent,
  buildPublishMappingIntent,
  buildReclassRunIntent
} from './commands/hub-intent';

/* --- Queries (read models) --- */
export type {
  AcctEventReadModel,
  DerivedEntryReadModel,
  MappingRuleSetReadModel
} from './queries/hub-query';

/* --- Service --- */
export {
  deriveFromEvent,
  getDerivationAudit,
  publishMapping,
  runAccrual,
  runAllocation,
  runReclassification
} from './services/accounting-hub-service';

