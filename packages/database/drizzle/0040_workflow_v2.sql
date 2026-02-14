-- 0040_workflow_v2.sql
-- Workflow V2: Contracted Workflow Envelope
-- PRD: .PRD/workflow.md — 7 tables, 3 partitioned, 4 triggers
--
-- Contents:
-- 1. workflow_definitions (non-partitioned, definition_kind discriminator)
-- 2. workflow_instances (non-partitioned, partial UNIQUE for active)
-- 3. workflow_step_executions (PARTITIONED by created_at monthly)
-- 4. workflow_events_outbox (PARTITIONED by created_at monthly)
-- 5. workflow_side_effects_outbox (PARTITIONED by created_at monthly)
-- 6. workflow_step_receipts (non-partitioned, global dedup WF-02)
-- 7. workflow_outbox_receipts (non-partitioned, global dedup WF-11)
-- 8. Triggers: immutability, status guards, restrict updates
-- 9. RLS + REVOKE on receipts tables

-- ============================================================
-- 1. workflow_definitions
-- ============================================================
CREATE TABLE IF NOT EXISTS workflow_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  entity_type TEXT NOT NULL,
  name TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft',
  is_default BOOLEAN NOT NULL DEFAULT false,
  definition_kind TEXT NOT NULL,

  -- Envelope fields (definition_kind='envelope')
  nodes_json JSONB,
  edges_json JSONB,
  slots_json JSONB,

  -- Org patch fields (definition_kind='org_patch')
  base_ref JSONB,
  body_patches_json JSONB,

  -- Compiled effective fields (definition_kind='effective')
  compiled_json JSONB,
  compiled_hash TEXT,
  compiler_version TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT wf_def_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT wf_def_status_valid CHECK (status IN ('draft', 'published', 'archived')),
  CONSTRAINT wf_def_kind_valid CHECK (definition_kind IN ('envelope', 'org_patch', 'effective')),
  CONSTRAINT wf_def_envelope_check CHECK (
    definition_kind <> 'envelope' OR (
      nodes_json IS NOT NULL AND edges_json IS NOT NULL AND slots_json IS NOT NULL
      AND body_patches_json IS NULL
    )
  ),
  CONSTRAINT wf_def_org_patch_check CHECK (
    definition_kind <> 'org_patch' OR (
      body_patches_json IS NOT NULL AND base_ref IS NOT NULL
      AND nodes_json IS NULL AND edges_json IS NULL
    )
  ),
  CONSTRAINT wf_def_effective_check CHECK (
    definition_kind <> 'effective' OR (
      compiled_json IS NOT NULL AND compiled_hash IS NOT NULL
      AND nodes_json IS NOT NULL AND edges_json IS NOT NULL
    )
  )
);
--> statement-breakpoint

CREATE UNIQUE INDEX wf_def_org_entity_version_uniq
  ON workflow_definitions (org_id, entity_type, version);
--> statement-breakpoint
CREATE INDEX wf_def_org_entity_status_idx
  ON workflow_definitions (org_id, entity_type, status);
--> statement-breakpoint

ALTER TABLE workflow_definitions ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE workflow_definitions FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY wf_def_tenant_read ON workflow_definitions
  FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY wf_def_tenant_write ON workflow_definitions
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE TRIGGER set_updated_at_wf_definitions
  BEFORE UPDATE ON workflow_definitions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 2. workflow_instances
-- ============================================================
CREATE TABLE IF NOT EXISTS workflow_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  definition_id UUID NOT NULL,
  definition_version INTEGER NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  entity_version INTEGER NOT NULL,
  active_tokens JSONB NOT NULL DEFAULT '[]'::jsonb,
  current_nodes TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'running',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_step_execution_id UUID,
  context_json JSONB DEFAULT '{}'::jsonb,

  CONSTRAINT wf_inst_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT wf_inst_status_valid CHECK (status IN ('running', 'paused', 'completed', 'failed', 'cancelled'))
);
--> statement-breakpoint

-- One active workflow per document (completed/cancelled preserved for history)
CREATE UNIQUE INDEX wf_inst_active_uniq
  ON workflow_instances (org_id, entity_type, entity_id)
  WHERE status IN ('running', 'paused');
--> statement-breakpoint
CREATE INDEX wf_inst_org_entity_idx
  ON workflow_instances (org_id, entity_type, entity_id);
--> statement-breakpoint
CREATE INDEX wf_inst_org_status_idx
  ON workflow_instances (org_id, status, updated_at);
--> statement-breakpoint
CREATE INDEX wf_inst_org_definition_idx
  ON workflow_instances (org_id, definition_id);
--> statement-breakpoint

ALTER TABLE workflow_instances ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE workflow_instances FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY wf_inst_tenant_read ON workflow_instances
  FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY wf_inst_tenant_write ON workflow_instances
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE TRIGGER set_updated_at_wf_instances
  BEFORE UPDATE ON workflow_instances
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 3. workflow_step_executions (PARTITIONED)
-- ============================================================
CREATE TABLE IF NOT EXISTS workflow_step_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  instance_id UUID NOT NULL,
  node_id TEXT NOT NULL,
  node_type TEXT NOT NULL,
  token_id TEXT NOT NULL,
  entity_version INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  run_as TEXT NOT NULL DEFAULT 'actor',
  idempotency_key TEXT NOT NULL,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER,
  input_json JSONB,
  output_json JSONB,
  error TEXT,
  actor_user_id TEXT,
  approval_request_id UUID,
  applied BOOLEAN,
  snapshot_version_id UUID,
  resume_at TIMESTAMPTZ,
  waiting_for_event_key TEXT,

  PRIMARY KEY (created_at, id),

  CONSTRAINT wf_step_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT wf_step_status_valid CHECK (status IN ('pending', 'running', 'completed', 'failed', 'skipped', 'cancelled')),
  CONSTRAINT wf_step_run_as_valid CHECK (run_as IN ('actor', 'system', 'service_account'))
) PARTITION BY RANGE (created_at);
--> statement-breakpoint

-- Create partitions for 2026
CREATE TABLE wf_step_exec_2026_01 PARTITION OF workflow_step_executions
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
--> statement-breakpoint
CREATE TABLE wf_step_exec_2026_02 PARTITION OF workflow_step_executions
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
--> statement-breakpoint
CREATE TABLE wf_step_exec_2026_03 PARTITION OF workflow_step_executions
  FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
--> statement-breakpoint
CREATE TABLE wf_step_exec_2026_04 PARTITION OF workflow_step_executions
  FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
--> statement-breakpoint
CREATE TABLE wf_step_exec_2026_05 PARTITION OF workflow_step_executions
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
--> statement-breakpoint
CREATE TABLE wf_step_exec_2026_06 PARTITION OF workflow_step_executions
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
--> statement-breakpoint
CREATE TABLE wf_step_exec_2026_07 PARTITION OF workflow_step_executions
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
--> statement-breakpoint
CREATE TABLE wf_step_exec_2026_08 PARTITION OF workflow_step_executions
  FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
--> statement-breakpoint
CREATE TABLE wf_step_exec_2026_09 PARTITION OF workflow_step_executions
  FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
--> statement-breakpoint
CREATE TABLE wf_step_exec_2026_10 PARTITION OF workflow_step_executions
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
--> statement-breakpoint
CREATE TABLE wf_step_exec_2026_11 PARTITION OF workflow_step_executions
  FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
--> statement-breakpoint
CREATE TABLE wf_step_exec_2026_12 PARTITION OF workflow_step_executions
  FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');
--> statement-breakpoint
CREATE TABLE wf_step_exec_default PARTITION OF workflow_step_executions DEFAULT;
--> statement-breakpoint

CREATE INDEX wf_step_org_instance_idx
  ON workflow_step_executions (org_id, instance_id, created_at);
--> statement-breakpoint
CREATE INDEX wf_step_org_actor_status_idx
  ON workflow_step_executions (org_id, actor_user_id, status);
--> statement-breakpoint
CREATE INDEX wf_step_org_instance_node_status_idx
  ON workflow_step_executions (org_id, instance_id, node_id, status);
--> statement-breakpoint
CREATE INDEX wf_step_snapshot_idx
  ON workflow_step_executions (org_id, snapshot_version_id)
  WHERE snapshot_version_id IS NOT NULL;
--> statement-breakpoint
CREATE INDEX wf_step_resume_idx
  ON workflow_step_executions (org_id, resume_at)
  WHERE resume_at IS NOT NULL AND status = 'pending';
--> statement-breakpoint
CREATE INDEX wf_step_wait_event_idx
  ON workflow_step_executions (org_id, waiting_for_event_key)
  WHERE status = 'pending' AND waiting_for_event_key IS NOT NULL;
--> statement-breakpoint

ALTER TABLE workflow_step_executions ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE workflow_step_executions FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY wf_step_tenant_read ON workflow_step_executions
  FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY wf_step_tenant_insert ON workflow_step_executions
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

-- Append-only: block UPDATE/DELETE from authenticated role
REVOKE UPDATE, DELETE ON workflow_step_executions FROM authenticated;
--> statement-breakpoint

-- ============================================================
-- 4. workflow_events_outbox (PARTITIONED)
-- ============================================================
CREATE TABLE IF NOT EXISTS workflow_events_outbox (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  instance_id UUID NOT NULL,
  entity_version INTEGER NOT NULL,
  definition_version INTEGER,
  event_type TEXT NOT NULL,
  payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  event_idempotency_key TEXT NOT NULL,
  trace_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  next_retry_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error TEXT,

  PRIMARY KEY (created_at, id),

  CONSTRAINT wf_evt_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT wf_evt_status_valid CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'dead_letter'))
) PARTITION BY RANGE (created_at);
--> statement-breakpoint

-- Create partitions for 2026
CREATE TABLE wf_evt_outbox_2026_01 PARTITION OF workflow_events_outbox
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
--> statement-breakpoint
CREATE TABLE wf_evt_outbox_2026_02 PARTITION OF workflow_events_outbox
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
--> statement-breakpoint
CREATE TABLE wf_evt_outbox_2026_03 PARTITION OF workflow_events_outbox
  FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
--> statement-breakpoint
CREATE TABLE wf_evt_outbox_2026_04 PARTITION OF workflow_events_outbox
  FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
--> statement-breakpoint
CREATE TABLE wf_evt_outbox_2026_05 PARTITION OF workflow_events_outbox
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
--> statement-breakpoint
CREATE TABLE wf_evt_outbox_2026_06 PARTITION OF workflow_events_outbox
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
--> statement-breakpoint
CREATE TABLE wf_evt_outbox_2026_07 PARTITION OF workflow_events_outbox
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
--> statement-breakpoint
CREATE TABLE wf_evt_outbox_2026_08 PARTITION OF workflow_events_outbox
  FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
--> statement-breakpoint
CREATE TABLE wf_evt_outbox_2026_09 PARTITION OF workflow_events_outbox
  FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
--> statement-breakpoint
CREATE TABLE wf_evt_outbox_2026_10 PARTITION OF workflow_events_outbox
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
--> statement-breakpoint
CREATE TABLE wf_evt_outbox_2026_11 PARTITION OF workflow_events_outbox
  FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
--> statement-breakpoint
CREATE TABLE wf_evt_outbox_2026_12 PARTITION OF workflow_events_outbox
  FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');
--> statement-breakpoint
CREATE TABLE wf_evt_outbox_default PARTITION OF workflow_events_outbox DEFAULT;
--> statement-breakpoint

CREATE INDEX wf_evt_worker_poll_idx
  ON workflow_events_outbox (status, next_retry_at, created_at)
  WHERE status IN ('pending', 'failed');
--> statement-breakpoint
CREATE INDEX wf_evt_org_instance_idx
  ON workflow_events_outbox (org_id, instance_id);
--> statement-breakpoint

ALTER TABLE workflow_events_outbox ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE workflow_events_outbox FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY wf_evt_tenant_read ON workflow_events_outbox
  FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY wf_evt_tenant_insert ON workflow_events_outbox
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

-- ============================================================
-- 5. workflow_side_effects_outbox (PARTITIONED)
-- ============================================================
CREATE TABLE IF NOT EXISTS workflow_side_effects_outbox (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  instance_id UUID NOT NULL,
  step_execution_id UUID NOT NULL,
  effect_type TEXT NOT NULL,
  payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  event_idempotency_key TEXT NOT NULL,
  trace_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  next_retry_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error TEXT,
  response_json JSONB,

  PRIMARY KEY (created_at, id),

  CONSTRAINT wf_se_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT wf_se_status_valid CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'dead_letter')),
  CONSTRAINT wf_se_effect_type_valid CHECK (effect_type IN ('webhook', 'email', 'sms', 'integration'))
) PARTITION BY RANGE (created_at);
--> statement-breakpoint

-- Create partitions for 2026
CREATE TABLE wf_se_outbox_2026_01 PARTITION OF workflow_side_effects_outbox
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
--> statement-breakpoint
CREATE TABLE wf_se_outbox_2026_02 PARTITION OF workflow_side_effects_outbox
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
--> statement-breakpoint
CREATE TABLE wf_se_outbox_2026_03 PARTITION OF workflow_side_effects_outbox
  FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
--> statement-breakpoint
CREATE TABLE wf_se_outbox_2026_04 PARTITION OF workflow_side_effects_outbox
  FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
--> statement-breakpoint
CREATE TABLE wf_se_outbox_2026_05 PARTITION OF workflow_side_effects_outbox
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
--> statement-breakpoint
CREATE TABLE wf_se_outbox_2026_06 PARTITION OF workflow_side_effects_outbox
  FOR VALUES FROM ('2026-06-01') TO ('2026-07-01');
--> statement-breakpoint
CREATE TABLE wf_se_outbox_2026_07 PARTITION OF workflow_side_effects_outbox
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
--> statement-breakpoint
CREATE TABLE wf_se_outbox_2026_08 PARTITION OF workflow_side_effects_outbox
  FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');
--> statement-breakpoint
CREATE TABLE wf_se_outbox_2026_09 PARTITION OF workflow_side_effects_outbox
  FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');
--> statement-breakpoint
CREATE TABLE wf_se_outbox_2026_10 PARTITION OF workflow_side_effects_outbox
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');
--> statement-breakpoint
CREATE TABLE wf_se_outbox_2026_11 PARTITION OF workflow_side_effects_outbox
  FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
--> statement-breakpoint
CREATE TABLE wf_se_outbox_2026_12 PARTITION OF workflow_side_effects_outbox
  FOR VALUES FROM ('2026-12-01') TO ('2027-01-01');
--> statement-breakpoint
CREATE TABLE wf_se_outbox_default PARTITION OF workflow_side_effects_outbox DEFAULT;
--> statement-breakpoint

CREATE INDEX wf_se_worker_poll_idx
  ON workflow_side_effects_outbox (status, next_retry_at, created_at)
  WHERE status IN ('pending', 'failed');
--> statement-breakpoint
CREATE INDEX wf_se_org_instance_idx
  ON workflow_side_effects_outbox (org_id, instance_id);
--> statement-breakpoint
CREATE INDEX wf_se_org_step_idx
  ON workflow_side_effects_outbox (org_id, step_execution_id);
--> statement-breakpoint

ALTER TABLE workflow_side_effects_outbox ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE workflow_side_effects_outbox FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY wf_se_tenant_read ON workflow_side_effects_outbox
  FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY wf_se_tenant_insert ON workflow_side_effects_outbox
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

-- ============================================================
-- 6. workflow_step_receipts (NON-PARTITIONED — WF-02 global dedup)
-- ============================================================
CREATE TABLE IF NOT EXISTS workflow_step_receipts (
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  instance_id UUID NOT NULL,
  idempotency_key TEXT NOT NULL,
  step_execution_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  PRIMARY KEY (org_id, instance_id, idempotency_key),

  CONSTRAINT wf_sr_org_not_empty CHECK (org_id <> '')
);
--> statement-breakpoint

ALTER TABLE workflow_step_receipts ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE workflow_step_receipts FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY wf_sr_tenant_read ON workflow_step_receipts
  FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY wf_sr_tenant_insert ON workflow_step_receipts
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

-- Append-only
REVOKE UPDATE, DELETE ON workflow_step_receipts FROM authenticated;
--> statement-breakpoint

-- ============================================================
-- 7. workflow_outbox_receipts (NON-PARTITIONED — WF-11 global dedup)
-- ============================================================
CREATE TABLE IF NOT EXISTS workflow_outbox_receipts (
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  instance_id UUID NOT NULL,
  source_table TEXT NOT NULL,
  event_idempotency_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  PRIMARY KEY (org_id, instance_id, source_table, event_idempotency_key),

  CONSTRAINT wf_or_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT wf_or_source_valid CHECK (source_table IN ('events', 'side_effects'))
);
--> statement-breakpoint

ALTER TABLE workflow_outbox_receipts ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE workflow_outbox_receipts FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY wf_or_tenant_read ON workflow_outbox_receipts
  FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY wf_or_tenant_insert ON workflow_outbox_receipts
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

-- Append-only
REVOKE UPDATE, DELETE ON workflow_outbox_receipts FROM authenticated;
--> statement-breakpoint

-- ============================================================
-- 8. Triggers
-- ============================================================

-- WF-04: Reject content mutations on published definitions
CREATE OR REPLACE FUNCTION public.reject_published_definition_mutation()
RETURNS trigger AS $$
BEGIN
  IF OLD.status = 'published' AND (
    NEW.nodes_json IS DISTINCT FROM OLD.nodes_json OR
    NEW.edges_json IS DISTINCT FROM OLD.edges_json OR
    NEW.slots_json IS DISTINCT FROM OLD.slots_json OR
    NEW.body_patches_json IS DISTINCT FROM OLD.body_patches_json OR
    NEW.compiled_json IS DISTINCT FROM OLD.compiled_json OR
    NEW.entity_type IS DISTINCT FROM OLD.entity_type OR
    NEW.name IS DISTINCT FROM OLD.name OR
    NEW.version IS DISTINCT FROM OLD.version OR
    NEW.definition_kind IS DISTINCT FROM OLD.definition_kind
  ) THEN
    RAISE EXCEPTION 'Cannot mutate content of published workflow definition: id=%', OLD.id
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

CREATE TRIGGER trg_reject_published_def_mutation
  BEFORE UPDATE ON workflow_definitions
  FOR EACH ROW
  EXECUTE FUNCTION public.reject_published_definition_mutation();
--> statement-breakpoint

-- Reject ANY edits to is_default=true rows (system envelopes are immutable)
CREATE OR REPLACE FUNCTION public.reject_default_definition_mutation()
RETURNS trigger AS $$
BEGIN
  IF OLD.is_default = true THEN
    RAISE EXCEPTION 'Cannot modify system default workflow definition: id=%', OLD.id
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

CREATE TRIGGER trg_reject_default_def_mutation
  BEFORE UPDATE ON workflow_definitions
  FOR EACH ROW
  EXECUTE FUNCTION public.reject_default_definition_mutation();
--> statement-breakpoint

-- Status regression guard: terminal states are final
CREATE OR REPLACE FUNCTION public.restrict_status_regression()
RETURNS trigger AS $$
DECLARE
  terminal_states TEXT[] := ARRAY['completed', 'failed', 'cancelled', 'dead_letter'];
BEGIN
  IF OLD.status = ANY(terminal_states) AND NEW.status IS DISTINCT FROM OLD.status THEN
    RAISE EXCEPTION 'Cannot regress from terminal status % on table=%, id=%',
      OLD.status, TG_TABLE_NAME,
      CASE WHEN TG_TABLE_NAME = 'workflow_instances' THEN OLD.id::text
           ELSE 'composite-pk' END
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

CREATE TRIGGER trg_restrict_status_wf_instances
  BEFORE UPDATE OF status ON workflow_instances
  FOR EACH ROW
  EXECUTE FUNCTION public.restrict_status_regression();
--> statement-breakpoint
