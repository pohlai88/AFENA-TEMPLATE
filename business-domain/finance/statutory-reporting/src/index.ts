/**
 * @see FIN-REP-SNAP-01 — Statement snapshots are reproducible and drill-down complete
 */

// ── Calculators ─────────────────────────────────────────
export { evaluateFormula, renderStatement } from './calculators/statement-engine';

export { generateSegmentReport } from './calculators/segment-reporting';
export type { SegmentData, SegmentReportResult } from './calculators/segment-reporting';

export { computeEarningsPerShare } from './calculators/earnings-per-share';
export type { EpsInput, EpsResult } from './calculators/earnings-per-share';

export { renderCashFlowStatement } from './calculators/cash-flow-report';
export type { CashFlowLineItem, CashFlowReportResult as SrCashFlowReportResult } from './calculators/cash-flow-report';
export type {
  AccountBalance,
  RenderedLine,
  StatementLineSpec
} from './calculators/statement-engine';

// ── Queries ─────────────────────────────────────────────
export { getActiveLayouts, getStatementLayout, getStatementLines } from './queries/reporting-query';
export type { StatementLayoutReadModel, StatementLineReadModel } from './queries/reporting-query';

// ── Commands ────────────────────────────────────────────
export { buildStatementArtifact } from './commands/reporting-command';
export type { StatementArtifact } from './commands/reporting-command';

// ── Service ─────────────────────────────────────────────
export {
  fetchStatementLayout,
  fetchStatementLayouts,
  generateStatement,
  runReportSnapshot
} from './services/reporting-service';
export type { ReportSnapshot } from './services/reporting-service';

export { generateAccountingPoliciesNote } from './calculators/accounting-policies-note';
export type { AccountingPoliciesNoteInput, AccountingPoliciesNoteResult, NoteSection } from './calculators/accounting-policies-note';

export { generateRelatedPartyDisclosure } from './calculators/related-party-disclosure';
export type { RelatedPartyInput, RelatedPartyResult, RelatedPartyTransaction } from './calculators/related-party-disclosure';

export { tagWithXbrl } from './calculators/xbrl-tagger';
export type {
  StatementLineItem,
  XbrlMapping,
  XbrlTaggingResult,
  XbrlTaxonomyElement
} from './calculators/xbrl-tagger';

