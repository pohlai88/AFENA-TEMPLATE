/**
 * Finance Audit Registry — SSOT Data Model
 *
 * Defines the type system for the Finance & Accounting Availability Registry.
 * Used by the CI gate (ci-finance-audit-gate.mjs) to verify that every
 * requirement has matching entities, APIs, reports, tests, and evidence
 * in the codebase.
 */

export type Severity = 'S0' | 'S1' | 'S2' | 'S3';
export type Weight = 1 | 2 | 3 | 4 | 5;

export type EvidenceKind =
  | 'test_run'
  | 'migration_hash'
  | 'audit_log_export'
  | 'report_snapshot'
  | 'reconciliation_pack'
  | 'close_pack'
  | 'policy_decision_log'
  | 'bank_file_hash'
  | 'fx_rate_snapshot'
  | 'performance_baseline';

export type TestKind =
  | 'unit'
  | 'integration'
  | 'property'
  | 'rls'
  | 'migration'
  | 'performance'
  | 'e2e';

export type ReportKind =
  | 'operational'
  | 'reconciliation'
  | 'statutory'
  | 'management'
  | 'audit';

export type ApiKind = 'command' | 'query' | 'job';

export type Scope = {
  multiTenancy: true;
  multiCompany: true;
  interCompany: boolean;
  multiCurrency: boolean;
  multiLedger: boolean;
  multiNational: boolean;
  multiIndustry: boolean;
};

export type Requirement = {
  id: string;
  title: string;
  severity: Severity;
  weight: Weight;
  rationale: string;
  mustHaveEntities: string[];
  mustHaveApis: Array<{ name: string; kind: ApiKind }>;
  mustHaveReports: Array<{ name: string; kind: ReportKind }>;
  mustHaveTests: Array<{ name: string; kind: TestKind }>;
  mustHaveEvidence: Array<{ name: string; kind: EvidenceKind }>;
  gates: string[];
};

export type CapabilitySection = {
  key: string;
  title: string;
  scope: Scope;
  requirements: Requirement[];
};

export type FinanceAuditRegistry = {
  version: string;
  lastRatifiedAt: string;
  ratifiedBy: string;
  benchmarkNotes: string[];
  globalGates: string[];
  sections: CapabilitySection[];
};
