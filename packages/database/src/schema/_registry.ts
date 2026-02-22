/**
 * Table Registry - Schema Taxonomy and Metadata
 *
 * Central registry of all database tables with their taxonomy classification
 * and architectural attributes. Used for mechanical validation of schema
 * compliance with v2.6 architecture principles.
 *
 * Enforces:
 * - Gate SCH-TAX-01: Registry completeness (all tables registered)
 * - Gate SCH-TAX-02: Taxonomy rule compliance (attributes match kind)
 */

/**
 * Table taxonomy kinds (4-layer data model)
 */
export type TableKind = 'truth' | 'control' | 'projection' | 'evidence' | 'link' | 'system';

/**
 * Table metadata for registry
 */
export interface TableMetadata {
  /** Table taxonomy classification */
  kind: TableKind;
  /** Has Row-Level Security enabled */
  hasRls: boolean;
  /** Has org_id column for tenant isolation */
  hasTenant: boolean;
  /** Has composite primary key (org_id, id) */
  hasCompositePk?: boolean;
  /** Has updated_at trigger */
  hasUpdatedAtTrigger?: boolean;
  /** Updated_at managed in application code (mutually exclusive with trigger) */
  updatedAtManagedInApp?: boolean;
  /** Has natural key (doc_no, sku, code, etc.) */
  hasNaturalKey?: boolean;
  /** Natural key is immutable after creation */
  naturalKeyImmutable?: boolean;
  /** Has block_update_delete trigger (evidence tables) */
  hasBlockUpdateDeleteTrigger?: boolean;
  /** Worker-only writes (projection tables) */
  workerOnlyWrites?: boolean;
  /** Description of table purpose */
  description?: string;
  /** Business domain (e.g. 'finance') */
  domain?: string;
  /** Subdomain within domain (e.g. 'treasury', 'ias12', 'ias19') */
  subdomain?: string;
  /** Data sensitivity classification */
  dataSensitivity?: 'financial' | 'pii' | 'operational' | 'public';
  /** Data retention classification */
  retentionClass?: 'statutory' | 'operational' | 'transient';
  /** Supports inter-company transactions */
  supportsIntercompany?: boolean;
  /** Time axis column type for temporal queries */
  timeAxis?: 'periodKey' | 'measurementDate' | 'testDate' | 'asOfDate' | 'grantDate' | 'none';
}

/**
 * Complete table registry
 *
 * Every table in the database MUST be registered here.
 * CI validates this registry matches actual schema.
 */
export const TABLE_REGISTRY: Record<string, TableMetadata> = {
  // ============================================================================
  // TRUTH TABLES (Layer 1: Kernel Truth - Domain Entities)
  // ============================================================================

  // Core entities
  contacts: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: false,
    description: 'Contact master data',
  },

  companies: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Company master data',
  },

  customers: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Customer master data',
  },

  suppliers: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Supplier master data',
  },

  products: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Product master data',
  },

  employees: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Employee master data',
  },

  warehouses: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Warehouse master data',
  },

  sites: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Site/location master data',
  },

  // Financial
  currencies: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Currency master data',
  },

  // HR
  timesheets: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Employee timesheets',
  },

  // CRM
  leads: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Sales leads',
  },

  opportunities: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Sales opportunities',
  },

  campaigns: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Marketing campaigns',
  },

  // Documents
  documents: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Document metadata',
  },

  contracts: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Contract master data',
  },

  // Projects
  projects: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Project master data',
  },

  // Assets
  assets: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Asset register',
  },

  fixed_assets: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Fixed assets',
  },

  // ── Finance Domain: Canon DB Integration (v3.1) ────────

  treasury_accounts: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Treasury cash/bank accounts',
    domain: 'finance',
    subdomain: 'treasury',
    timeAxis: 'asOfDate',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
    supportsIntercompany: true,
  },

  deferred_tax_items: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Deferred tax assets/liabilities (IAS 12)',
    domain: 'finance',
    subdomain: 'ias12',
    timeAxis: 'periodKey',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
    supportsIntercompany: true,
  },

  employee_benefit_plans: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Employee benefit plans (IAS 19)',
    domain: 'finance',
    subdomain: 'ias19',
    timeAxis: 'measurementDate',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
    supportsIntercompany: true,
  },

  borrowing_cost_items: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Borrowing cost capitalisation (IAS 23)',
    domain: 'finance',
    subdomain: 'ias23',
    timeAxis: 'periodKey',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
    supportsIntercompany: true,
  },

  biological_asset_items: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Biological assets (IAS 41)',
    domain: 'finance',
    subdomain: 'ias41',
    timeAxis: 'measurementDate',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
    supportsIntercompany: true,
  },

  government_grant_items: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Government grants (IAS 20)',
    domain: 'finance',
    subdomain: 'ias20',
    timeAxis: 'periodKey',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
    supportsIntercompany: true,
  },

  impairment_tests: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Impairment tests (IAS 36)',
    domain: 'finance',
    subdomain: 'ias36',
    timeAxis: 'testDate',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
    supportsIntercompany: true,
  },

  investment_properties: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Investment properties (IAS 40)',
    domain: 'finance',
    subdomain: 'ias40',
    timeAxis: 'measurementDate',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
    supportsIntercompany: true,
  },

  inventory_valuation_items: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Inventory valuation snapshots (IAS 2)',
    domain: 'finance',
    subdomain: 'ias2',
    timeAxis: 'periodKey',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
    supportsIntercompany: true,
  },

  sbp_grants: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Share-based payment grants (IFRS 2)',
    domain: 'finance',
    subdomain: 'ifrs2',
    timeAxis: 'grantDate',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
    supportsIntercompany: true,
  },

  // ── Finance Domain: ERPNext Gap Closure (v3.2) ────────

  bank_accounts: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Company bank/cash accounts (master data)',
    domain: 'finance',
    subdomain: 'banking',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
    supportsIntercompany: true,
  },

  payments: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'First-class payment aggregate (receive/pay/transfer, docEntity)',
    domain: 'finance',
    subdomain: 'payments',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  dunning_runs: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Dunning batch run header (docEntity)',
    domain: 'finance',
    subdomain: 'credit',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  dunning_notices: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Individual dunning notices per customer/invoice',
    domain: 'finance',
    subdomain: 'credit',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  opening_balance_batches: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Opening balance import batches (docEntity)',
    domain: 'finance',
    subdomain: 'migration',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  opening_balance_lines: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Debit/credit lines within an opening balance batch',
    domain: 'finance',
    subdomain: 'migration',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  payment_methods: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Mode of payment reference master (cash, bank, etc.)',
    domain: 'finance',
    subdomain: 'payments',
    dataSensitivity: 'financial',
    retentionClass: 'operational',
  },

  payment_method_accounts: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'GL account mapping per payment method per company',
    domain: 'finance',
    subdomain: 'payments',
    dataSensitivity: 'financial',
    retentionClass: 'operational',
  },

  payment_terms_templates: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Reusable payment terms (e.g. Net 30, 2/10 Net 30)',
    domain: 'finance',
    subdomain: 'payments',
    dataSensitivity: 'financial',
    retentionClass: 'operational',
  },

  payment_terms_template_details: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Detail rows: due-date basis, discount, portion splits',
    domain: 'finance',
    subdomain: 'payments',
    dataSensitivity: 'financial',
    retentionClass: 'operational',
  },

  bank_matching_rules: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Configurable rules for auto-matching bank statement lines',
    domain: 'finance',
    subdomain: 'banking',
    dataSensitivity: 'financial',
    retentionClass: 'operational',
  },

  // ============================================================================
  // CONTROL TABLES (Layer 2: Control Plane - Orchestration)
  // ============================================================================

  workflow_rules: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Workflow rule definitions',
  },

  workflow_executions: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Workflow execution history',
  },

  number_sequences: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Number sequence generators',
  },

  custom_fields: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Custom field definitions',
  },

  custom_field_values: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Custom field values',
  },

  custom_field_sync_queue: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Custom field sync queue',
  },

  entity_views: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Entity view configurations',
  },

  entity_view_fields: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Entity view field configurations',
  },

  // ============================================================================
  // PROJECTION TABLES (Layer 3: Projection - Rebuildable)
  // ============================================================================

  // Note: Projection tables will be added when they are created
  // These are rebuildable from truth tables

  // ============================================================================
  // EVIDENCE TABLES (Layer 4: Evidence - Immutable)
  // ============================================================================

  audit_logs: {
    kind: 'evidence',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: false,
    hasBlockUpdateDeleteTrigger: true,
    description: 'Audit trail (append-only)',
  },

  entity_versions: {
    kind: 'evidence',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: false,
    hasBlockUpdateDeleteTrigger: true,
    description: 'Entity version history (append-only)',
  },

  mutation_batches: {
    kind: 'evidence',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: false,
    hasBlockUpdateDeleteTrigger: true,
    description: 'Mutation batch tracking (append-only)',
  },

  // ============================================================================
  // LINK TABLES (Junction Tables)
  // ============================================================================

  user_roles: {
    kind: 'link',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: false,
    description: 'User to role assignments',
  },

  role_permissions: {
    kind: 'link',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: false,
    description: 'Role to permission assignments',
  },

  user_scopes: {
    kind: 'link',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: false,
    description: 'User scope assignments',
  },

  entity_attachments: {
    kind: 'link',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: false, // Link tables don't have triggers
    description: 'Entity to attachment links',
  },

  // ============================================================================
  // SYSTEM TABLES (Auth, Users, Configuration)
  // ============================================================================

  users: {
    kind: 'system',
    hasRls: true,
    hasTenant: false, // Users are global
    hasCompositePk: false,
    hasUpdatedAtTrigger: true,
    description: 'System users',
  },

  roles: {
    kind: 'system',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'System roles',
  },

  api_keys: {
    kind: 'system',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'API key management',
  },

  legal_entities: {
    kind: 'system',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Legal entity master data',
  },

  org_usage_daily: {
    kind: 'system',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: false,
    description: 'Daily usage metrics per organization',
  },

  r2_files: {
    kind: 'system',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'R2 file metadata',
  },

  // ============================================================================
  // ADDITIONAL TRUTH TABLES
  // ============================================================================

  advisories: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Advisory records',
  },

  advisory_evidence: {
    kind: 'evidence',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: false,
    hasBlockUpdateDeleteTrigger: true,
    description: 'Advisory evidence (append-only)',
  },

  audit_programs: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Audit program definitions',
  },

  boms: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Bill of materials',
  },

  budgets: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Budget master data',
  },

  communications: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Communication records',
  },

  cost_centers: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Cost center master data',
  },

  crop_plans: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Agricultural crop planning',
  },

  expense_reports: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Employee expense reports',
  },

  forecasts: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Financial forecasts',
  },

  franchise_applications: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Franchise applications',
  },

  inventory_transfers: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Inventory transfer documents',
  },

  job_applications: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Job applications',
  },

  leases: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Lease agreements',
  },

  leave_requests: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Employee leave requests',
  },

  livestock_records: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Livestock tracking records',
  },

  outlet_audits: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Retail outlet audit records',
  },

  performance_reviews: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Employee performance reviews',
  },

  purchase_requisitions: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Purchase requisition documents',
  },

  quality_inspections: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Quality inspection records',
  },

  recipes: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Production recipes/formulas',
  },

  returns: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Return documents',
  },

  risk_assessments: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Risk assessment records',
  },

  service_tickets: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Service ticket tracking',
  },

  shipments: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Shipment documents',
  },

  uom: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Unit of measure master data',
  },

  uom_conversions: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Unit of measure conversion rules',
  },

  work_orders: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Manufacturing work orders',
  },

  // ============================================================================
  // METADATA TABLES (Canon Integration)
  // ============================================================================

  meta_aliases: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Metadata alias definitions',
  },

  meta_alias_sets: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Metadata alias set groupings',
  },

  meta_alias_resolution_rules: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Alias resolution rule engine',
  },

  meta_assets: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Metadata asset catalog',
  },

  meta_lineage_edges: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Data lineage graph edges',
  },

  meta_quality_checks: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Data quality check definitions',
  },

  meta_semantic_terms: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Semantic term glossary',
  },

  meta_term_links: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Term to entity linkages',
  },

  meta_value_aliases: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Value-level alias mappings',
  },

  // ============================================================================
  // MIGRATION TABLES (Data Migration Control)
  // ============================================================================

  migration_jobs: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Data migration job tracking',
  },

  migration_checkpoints: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Migration checkpoint state',
  },

  migration_conflicts: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Migration conflict detection',
  },

  migration_conflict_resolutions: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Conflict resolution decisions',
  },

  migration_lineage: {
    kind: 'evidence',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: false,
    hasBlockUpdateDeleteTrigger: true,
    description: 'Migration lineage audit trail (append-only)',
  },

  migration_merge_explanations: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Merge decision explanations',
  },

  migration_quarantine: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Quarantined migration records',
  },

  migration_reports: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Migration execution reports',
  },

  migration_row_snapshots: {
    kind: 'evidence',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: false,
    hasBlockUpdateDeleteTrigger: true,
    description: 'Row-level migration snapshots (append-only)',
  },

  // ============================================================================
  // FINANCE CORE TABLES (Phase B+C migrations)
  // ============================================================================

  chart_of_accounts: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Chart of accounts (GL accounts)',
    domain: 'finance',
    subdomain: 'gl',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  fiscal_periods: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Fiscal period definitions and close locks',
    domain: 'finance',
    subdomain: 'gl',
    timeAxis: 'periodKey',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  journal_entries: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Journal entry headers (docEntity lifecycle)',
    domain: 'finance',
    subdomain: 'gl',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  journal_lines: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Journal entry line items (debit/credit)',
    domain: 'finance',
    subdomain: 'gl',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  ledgers: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Ledger definitions (multi-ledger support)',
    domain: 'finance',
    subdomain: 'gl',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  posting_periods: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Posting period control',
    domain: 'finance',
    subdomain: 'gl',
    timeAxis: 'periodKey',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  tax_rates: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    hasNaturalKey: true,
    naturalKeyImmutable: true,
    description: 'Tax rate definitions (versioned, time-bounded)',
    domain: 'finance',
    subdomain: 'tax',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  payment_allocations: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Payment to invoice/credit note allocations',
    domain: 'finance',
    subdomain: 'payments',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  payment_runs: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Payment run batch processing (docEntity)',
    domain: 'finance',
    subdomain: 'payments',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  fx_rates: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Foreign exchange rates',
    domain: 'finance',
    subdomain: 'fx',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  currency_exchanges: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Currency exchange rate history',
    domain: 'finance',
    subdomain: 'fx',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  bank_statements: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Bank statement imports (docEntity)',
    domain: 'finance',
    subdomain: 'banking',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  reconciliation_items: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Bank reconciliation line items',
    domain: 'finance',
    subdomain: 'banking',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  match_results: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Three-way match results',
    domain: 'finance',
    subdomain: 'procurement',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  supplier_invoices: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Supplier/purchase invoices (docEntity)',
    domain: 'finance',
    subdomain: 'payables',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  credit_limits: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Customer credit limit definitions',
    domain: 'finance',
    subdomain: 'credit',
    dataSensitivity: 'financial',
    retentionClass: 'operational',
  },

  credit_exposures: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Customer credit exposure tracking',
    domain: 'finance',
    subdomain: 'credit',
    dataSensitivity: 'financial',
    retentionClass: 'operational',
  },

  depreciation_schedules: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Asset depreciation schedules',
    domain: 'finance',
    subdomain: 'fixed-assets',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  revenue_schedules: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Revenue recognition schedules (IFRS 15)',
    domain: 'finance',
    subdomain: 'revenue',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  revenue_schedule_lines: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Revenue schedule line items',
    domain: 'finance',
    subdomain: 'revenue',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  provisions: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Provision master data (IAS 37)',
    domain: 'finance',
    subdomain: 'provisions',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  provision_movements: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Provision movement history',
    domain: 'finance',
    subdomain: 'provisions',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  financial_instruments: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Financial instrument master data (IFRS 9)',
    domain: 'finance',
    subdomain: 'instruments',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  hedge_designations: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Hedge designation documents (docEntity)',
    domain: 'finance',
    subdomain: 'hedge',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  hedge_effectiveness_tests: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Hedge effectiveness test results',
    domain: 'finance',
    subdomain: 'hedge',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  intangible_assets: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Intangible asset register (IAS 38)',
    domain: 'finance',
    subdomain: 'intangibles',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  subscriptions: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Subscription billing master data',
    domain: 'finance',
    subdomain: 'billing',
    dataSensitivity: 'financial',
    retentionClass: 'operational',
  },

  billing_cycles: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Billing cycle definitions',
    domain: 'finance',
    subdomain: 'billing',
    dataSensitivity: 'financial',
    retentionClass: 'operational',
  },

  ic_agreements: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Intercompany agreement definitions',
    domain: 'finance',
    subdomain: 'intercompany',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
    supportsIntercompany: true,
  },

  ic_transactions: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Intercompany transactions (docEntity)',
    domain: 'finance',
    subdomain: 'intercompany',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
    supportsIntercompany: true,
  },

  elimination_journals: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Unified elimination journal entries (M-09, AD-03)',
    domain: 'finance',
    subdomain: 'consolidation',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  tp_policies: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Transfer pricing policy definitions',
    domain: 'finance',
    subdomain: 'transfer-pricing',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  tp_calculations: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Transfer pricing calculation results',
    domain: 'finance',
    subdomain: 'transfer-pricing',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  wht_codes: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Withholding tax code definitions',
    domain: 'finance',
    subdomain: 'withholding-tax',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  wht_rates: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Withholding tax rate schedules',
    domain: 'finance',
    subdomain: 'withholding-tax',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  wht_certificates: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Withholding tax certificates (docEntity)',
    domain: 'finance',
    subdomain: 'withholding-tax',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  statement_layouts: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Financial statement layout definitions',
    domain: 'finance',
    subdomain: 'reporting',
    dataSensitivity: 'financial',
    retentionClass: 'operational',
  },

  statement_lines: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Financial statement line items',
    domain: 'finance',
    subdomain: 'reporting',
    dataSensitivity: 'financial',
    retentionClass: 'operational',
  },

  close_tasks: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Financial close task tracking (docEntity)',
    domain: 'finance',
    subdomain: 'close',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  // ── Accounting Hub Tables ────────

  acct_mappings: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Account mapping rules',
    domain: 'finance',
    subdomain: 'accounting-hub',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  acct_mapping_versions: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Account mapping version history',
    domain: 'finance',
    subdomain: 'accounting-hub',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  acct_events: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Accounting events for hub processing',
    domain: 'finance',
    subdomain: 'accounting-hub',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  acct_derived_entries: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Derived journal entries from accounting hub',
    domain: 'finance',
    subdomain: 'accounting-hub',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  // ── ERP Selling/Buying Cycle Tables ────────

  delivery_notes: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Delivery/goods receipt notes (docEntity)',
    domain: 'finance',
    subdomain: 'procurement',
    dataSensitivity: 'operational',
    retentionClass: 'statutory',
  },

  delivery_note_lines: {
    kind: 'truth',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Delivery note line items',
    domain: 'finance',
    subdomain: 'procurement',
    dataSensitivity: 'operational',
    retentionClass: 'statutory',
  },

  // ── Evidence Tables (append-only) ────────

  close_evidence: {
    kind: 'evidence',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: false,
    hasBlockUpdateDeleteTrigger: true,
    description: 'Financial close evidence (append-only)',
    domain: 'finance',
    subdomain: 'close',
    dataSensitivity: 'financial',
    retentionClass: 'statutory',
  },

  webhook_deliveries: {
    kind: 'evidence',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: false,
    hasUpdatedAtTrigger: false,
    hasBlockUpdateDeleteTrigger: true,
    description: 'Webhook delivery log (append-only)',
  },

  // ── Control Tables ────────

  document_types: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Document type configuration',
  },

  // ── Outbox Tables (control) ────────
  // outbox.ts exports 4 tables: workflow_outbox, search_outbox, webhook_outbox, integration_outbox

  outbox: {
    kind: 'control',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: false,
    hasUpdatedAtTrigger: false,
    description: 'Transactional outbox tables (workflow, search, webhook, integration)',
  },

  // ── System Tables ────────

  idempotency_keys: {
    kind: 'system',
    hasRls: true,
    hasTenant: false,
    hasCompositePk: false,
    hasUpdatedAtTrigger: false,
    description: 'Request idempotency key store (TTL-based)',
  },

  webhook_endpoints: {
    kind: 'system',
    hasRls: true,
    hasTenant: true,
    hasCompositePk: true,
    hasUpdatedAtTrigger: true,
    description: 'Webhook endpoint configuration',
  },

  video_settings: {
    kind: 'system',
    hasRls: true,
    hasTenant: false,
    hasCompositePk: false,
    hasUpdatedAtTrigger: false,
    description: 'Per-org video/media configuration',
  },
};

/**
 * Taxonomy validation rules
 *
 * Defines required attributes for each table kind.
 * Used by CI to validate registry compliance.
 */
export const TAXONOMY_RULES: Record<
  TableKind,
  {
    mustHave: string[];
    mustNotHave?: string[];
    description: string;
  }
> = {
  truth: {
    mustHave: ['hasRls', 'hasTenant', 'hasCompositePk'],
    description: 'Domain entities - composite PK (org_id, id), versioned, RLS enforced',
  },
  control: {
    mustHave: ['hasRls', 'hasTenant'],
    description: 'Orchestration tables - state machines, outbox, workflow rules',
  },
  projection: {
    mustHave: ['workerOnlyWrites'],
    mustNotHave: ['hasUpdatedAtTrigger'],
    description: 'Rebuildable tables - worker-only writes, no triggers',
  },
  evidence: {
    mustHave: ['hasRls', 'hasTenant', 'hasBlockUpdateDeleteTrigger'],
    mustNotHave: ['hasUpdatedAtTrigger'],
    description: 'Immutable tables - append-only, REVOKE UPDATE/DELETE',
  },
  link: {
    mustHave: ['hasRls', 'hasTenant'],
    mustNotHave: ['hasUpdatedAtTrigger'],
    description: 'Junction tables - many-to-many relationships',
  },
  system: {
    mustHave: ['hasRls'],
    description: 'System tables - auth, users, configuration',
  },
};

/**
 * Get table metadata by name
 */
export function getTableMetadata(tableName: string): TableMetadata | undefined {
  return TABLE_REGISTRY[tableName];
}

/**
 * Get all tables of a specific kind
 */
export function getTablesByKind(kind: TableKind): Array<[string, TableMetadata]> {
  return Object.entries(TABLE_REGISTRY).filter(([_, meta]) => meta.kind === kind);
}

/**
 * Validate table metadata against taxonomy rules
 */
export function validateTableMetadata(tableName: string, metadata: TableMetadata): string[] {
  const errors: string[] = [];
  const rules = TAXONOMY_RULES[metadata.kind];

  // Check required attributes
  for (const attr of rules.mustHave) {
    if (!(metadata as any)[attr]) {
      errors.push(
        `Table "${tableName}" (kind: ${metadata.kind}) missing required attribute: ${attr}`,
      );
    }
  }

  // Check forbidden attributes
  if (rules.mustNotHave) {
    for (const attr of rules.mustNotHave) {
      if ((metadata as any)[attr]) {
        errors.push(
          `Table "${tableName}" (kind: ${metadata.kind}) has forbidden attribute: ${attr}`,
        );
      }
    }
  }

  // Check mutually exclusive attributes
  if (metadata.hasUpdatedAtTrigger && metadata.updatedAtManagedInApp) {
    errors.push(
      `Table "${tableName}" cannot have both hasUpdatedAtTrigger and updatedAtManagedInApp`,
    );
  }

  return errors;
}

/**
 * Validate entire registry
 */
export function validateRegistry(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const [tableName, metadata] of Object.entries(TABLE_REGISTRY)) {
    const tableErrors = validateTableMetadata(tableName, metadata);
    errors.push(...tableErrors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
