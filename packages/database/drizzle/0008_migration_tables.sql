-- Migration Engine Tables (Ratification-Grade)
-- Fix 1: Lineage State Machine with atomic reservations

-- Migration jobs
CREATE TABLE migration_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id text NOT NULL,
  entity_type text NOT NULL,
  source_config jsonb NOT NULL,
  field_mappings jsonb NOT NULL,
  merge_policies jsonb NOT NULL,
  conflict_strategy text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed', 'rolled_back')),
  checkpoint_cursor jsonb,
  records_success integer NOT NULL DEFAULT 0,
  records_failed integer NOT NULL DEFAULT 0,
  max_runtime_ms integer,
  rate_limit integer,
  preflight_checks jsonb,
  postflight_checks jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz,
  created_by text NOT NULL DEFAULT auth.user_id()
);

CREATE INDEX migration_jobs_org_status_idx ON migration_jobs (org_id, status);
CREATE INDEX migration_jobs_entity_type_idx ON migration_jobs (entity_type);

-- Migration lineage with state machine (Fix 1)
CREATE TABLE migration_lineage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id text NOT NULL,
  migration_job_id uuid NOT NULL REFERENCES migration_jobs(id),
  entity_type text NOT NULL,
  legacy_id text NOT NULL,
  legacy_system text NOT NULL,
  afenda_id uuid,
  state text NOT NULL DEFAULT 'committed' CHECK (state IN ('reserved', 'committed')),
  reserved_at timestamptz,
  reserved_by text,
  committed_at timestamptz,
  migrated_at timestamptz NOT NULL DEFAULT now(),
  
  -- State-dependent nullability constraints (ratification-grade)
  CONSTRAINT migration_lineage_reserved_requires_reserved_at
    CHECK (state <> 'reserved' OR reserved_at IS NOT NULL),
  CONSTRAINT migration_lineage_committed_requires_afenda_id
    CHECK (state <> 'committed' OR afenda_id IS NOT NULL),
  
  -- Unique constraints for idempotency
  UNIQUE (org_id, entity_type, legacy_system, legacy_id),
  UNIQUE (org_id, entity_type, afenda_id)
);

CREATE INDEX migration_lineage_job_idx ON migration_lineage (migration_job_id);
CREATE INDEX migration_lineage_reservations_idx 
  ON migration_lineage (org_id, entity_type, legacy_system, reserved_at)
  WHERE state = 'reserved';

-- Migration row snapshots (Fix 4: O(changed rows) rollback)
CREATE TABLE migration_row_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id text NOT NULL,
  migration_job_id uuid NOT NULL REFERENCES migration_jobs(id),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  before_write_core jsonb NOT NULL,
  before_write_custom jsonb NOT NULL,
  before_version integer,
  captured_at timestamptz NOT NULL DEFAULT now(),
  
  UNIQUE (migration_job_id, entity_type, entity_id)
);

CREATE INDEX migration_row_snapshots_job_idx 
  ON migration_row_snapshots (migration_job_id, entity_type);

-- Migration conflicts
CREATE TABLE migration_conflicts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id text NOT NULL,
  migration_job_id uuid NOT NULL REFERENCES migration_jobs(id),
  entity_type text NOT NULL,
  legacy_record jsonb NOT NULL,
  candidate_matches jsonb NOT NULL,
  confidence text NOT NULL CHECK (confidence IN ('high', 'medium', 'low')),
  resolution text NOT NULL DEFAULT 'pending' CHECK (resolution IN ('pending', 'merged', 'created_new', 'skipped', 'manual_review')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX migration_conflicts_job_idx ON migration_conflicts (migration_job_id);
CREATE INDEX migration_conflicts_resolution_idx ON migration_conflicts (org_id, resolution);

-- Migration conflict resolutions
CREATE TABLE migration_conflict_resolutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id text NOT NULL,
  conflict_id uuid NOT NULL REFERENCES migration_conflicts(id),
  migration_job_id uuid REFERENCES migration_jobs(id),
  decision text NOT NULL CHECK (decision IN ('merged', 'created_new', 'skipped')),
  chosen_candidate_id uuid,
  field_decisions jsonb,
  resolver text NOT NULL CHECK (resolver IN ('auto', 'manual')),
  resolved_at timestamptz NOT NULL DEFAULT now(),
  resolved_by text NOT NULL DEFAULT auth.user_id()
);

CREATE INDEX migration_conflict_resolutions_conflict_idx ON migration_conflict_resolutions (conflict_id);
CREATE INDEX migration_conflict_resolutions_job_idx 
  ON migration_conflict_resolutions (migration_job_id, decision);

-- Migration reports (signed, canonical)
CREATE TABLE migration_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES migration_jobs(id),
  report_data jsonb NOT NULL,
  report_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX migration_reports_job_idx ON migration_reports (job_id);
CREATE INDEX migration_reports_hash_idx ON migration_reports (report_hash);

-- RLS policies
ALTER TABLE migration_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_lineage ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_row_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_conflict_resolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY migration_jobs_tenant_isolation ON migration_jobs
  USING (org_id = auth.org_id());

CREATE POLICY migration_lineage_tenant_isolation ON migration_lineage
  USING (org_id = auth.org_id());

CREATE POLICY migration_row_snapshots_tenant_isolation ON migration_row_snapshots
  USING (org_id = auth.org_id());

CREATE POLICY migration_conflicts_tenant_isolation ON migration_conflicts
  USING (org_id = auth.org_id());

CREATE POLICY migration_conflict_resolutions_tenant_isolation ON migration_conflict_resolutions
  USING (org_id = auth.org_id());

CREATE POLICY migration_reports_tenant_isolation ON migration_reports
  USING (EXISTS (
    SELECT 1 FROM migration_jobs
    WHERE migration_jobs.id = migration_reports.job_id
    AND migration_jobs.org_id = auth.org_id()
  ));
