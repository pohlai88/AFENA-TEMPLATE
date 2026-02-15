/**
 * Table registry config — policy for schema-driven registry generation.
 * Generator imports this; do not import from _registry.ts here.
 *
 * TABLE_KIND_OVERRIDES: non-truth tables. Tables not listed default to 'truth'.
 * REGISTRY_EXEMPT: tables with no Drizzle schema (e.g. worker-only). Must NOT appear in __TABLE_NAMES__.
 */

export type TableKind = 'truth' | 'control' | 'projection' | 'evidence' | 'link' | 'system';

export const TABLE_KIND_OVERRIDES = {
  users: 'system',
  r2_files: 'system',
  api_keys: 'system',
  roles: 'system',
  user_roles: 'system',
  user_scopes: 'system',
  advisories: 'system',
  advisory_evidence: 'system',
  audit_logs: 'evidence',
  entity_versions: 'evidence',
  workflow_rules: 'control',
  workflow_executions: 'control',
  workflow_definitions: 'control',
  workflow_instances: 'control',
  workflow_step_executions: 'control',
  workflow_events_outbox: 'control',
  workflow_side_effects_outbox: 'control',
  workflow_step_receipts: 'control',
  workflow_outbox_receipts: 'control',
  search_outbox: 'control',
  doc_postings: 'control',
  mutation_batches: 'control',
  stock_balances: 'projection',
  search_documents: 'projection',
  reporting_snapshots: 'projection',
  doc_links: 'link',
  company_addresses: 'link',
  contact_addresses: 'link',
  inventory_trace_links: 'link',
  meta_term_links: 'link',
  role_permissions: 'link',
} as const satisfies Record<string, TableKind>;

/** EX-SCH-002: worker-only, no Drizzle schema. Must NOT be in __TABLE_NAMES__. */
export const REGISTRY_EXEMPT = ['search_backfill_state'] as const;
