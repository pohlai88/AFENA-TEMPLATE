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
};

/**
 * Taxonomy validation rules
 * 
 * Defines required attributes for each table kind.
 * Used by CI to validate registry compliance.
 */
export const TAXONOMY_RULES: Record<TableKind, {
  mustHave: string[];
  mustNotHave?: string[];
  description: string;
}> = {
  truth: {
    mustHave: ['hasRls', 'hasTenant', 'hasCompositePk'],
    description: 'Domain entities - composite PK (org_id, id), versioned, RLS enforced',
  },
  control: {
    mustHave: ['hasRls', 'hasTenant', 'hasCompositePk'],
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
      errors.push(`Table "${tableName}" (kind: ${metadata.kind}) missing required attribute: ${attr}`);
    }
  }

  // Check forbidden attributes
  if (rules.mustNotHave) {
    for (const attr of rules.mustNotHave) {
      if ((metadata as any)[attr]) {
        errors.push(`Table "${tableName}" (kind: ${metadata.kind}) has forbidden attribute: ${attr}`);
      }
    }
  }

  // Check mutually exclusive attributes
  if (metadata.hasUpdatedAtTrigger && metadata.updatedAtManagedInApp) {
    errors.push(`Table "${tableName}" cannot have both hasUpdatedAtTrigger and updatedAtManagedInApp`);
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
