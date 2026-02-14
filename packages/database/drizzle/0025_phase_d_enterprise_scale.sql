-- 0025_phase_d_enterprise_scale.sql
-- PRD: ERP Database Architecture Audit — Phase D (Enterprise Scale)
--
-- Contents:
-- 1. cost_centers table + indexes + RLS
-- 2. projects table + indexes + RLS
-- 3. stock_movements table + indexes + RLS + REVOKE UPDATE/DELETE
-- 4. approval_chains + approval_steps + approval_requests + approval_decisions
-- 5. Partition key documentation (pre-designed, implement at volume thresholds)
-- 6. Trigram indexes on new tables

-- ============================================================
-- 1. cost_centers — ledger dimension
-- ============================================================
CREATE TABLE IF NOT EXISTS cost_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id UUID NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  parent_id UUID,
  level INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT cost_centers_org_not_empty CHECK (org_id <> '')
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS cost_centers_org_id_idx
  ON cost_centers (org_id, id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS cost_centers_org_company_idx
  ON cost_centers (org_id, company_id);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS cost_centers_org_company_code_uniq
  ON cost_centers (org_id, company_id, code);
--> statement-breakpoint

ALTER TABLE cost_centers ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE cost_centers FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY cost_centers_tenant_read ON cost_centers
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY cost_centers_tenant_write ON cost_centers
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE TRIGGER set_updated_at_cost_centers
  BEFORE UPDATE ON cost_centers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS cost_centers_name_trgm_idx
  ON cost_centers USING gin (name gin_trgm_ops);
--> statement-breakpoint

-- ============================================================
-- 2. projects — ledger dimension
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id UUID NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  manager_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT projects_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT projects_status_valid CHECK (status IN ('active', 'completed', 'archived')),
  CONSTRAINT projects_date_order CHECK (end_date IS NULL OR start_date IS NULL OR start_date <= end_date)
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS projects_org_id_idx
  ON projects (org_id, id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS projects_org_company_idx
  ON projects (org_id, company_id);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS projects_org_company_code_uniq
  ON projects (org_id, company_id, code);
--> statement-breakpoint

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE projects FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY projects_tenant_read ON projects
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY projects_tenant_write ON projects
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE TRIGGER set_updated_at_projects
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS projects_name_trgm_idx
  ON projects USING gin (name gin_trgm_ops);
--> statement-breakpoint

-- ============================================================
-- 3. stock_movements — perpetual inventory ledger (append-only)
-- ============================================================
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id UUID NOT NULL,
  site_id UUID NOT NULL,
  product_id UUID NOT NULL,
  movement_type TEXT NOT NULL,
  qty NUMERIC(20, 6) NOT NULL,
  uom_id UUID,
  unit_cost_minor BIGINT NOT NULL DEFAULT 0,
  total_cost_minor BIGINT NOT NULL DEFAULT 0,
  currency_code TEXT NOT NULL DEFAULT 'MYR',
  posted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_type TEXT,
  source_id UUID,
  batch_no TEXT,
  serial_no TEXT,
  lot_no TEXT,
  costing_method TEXT NOT NULL DEFAULT 'weighted_average',
  running_qty NUMERIC(20, 6),
  running_cost_minor BIGINT,
  warehouse_zone TEXT,
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT stock_mv_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT stock_mv_type_valid CHECK (movement_type IN ('receipt', 'issue', 'transfer_in', 'transfer_out', 'adjustment', 'return', 'scrap')),
  CONSTRAINT stock_mv_costing_valid CHECK (costing_method IN ('fifo', 'lifo', 'weighted_average', 'specific'))
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS stock_mv_org_id_idx
  ON stock_movements (org_id, id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS stock_mv_org_company_idx
  ON stock_movements (org_id, company_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS stock_mv_product_idx
  ON stock_movements (org_id, site_id, product_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS stock_mv_posted_idx
  ON stock_movements (org_id, company_id, posted_at);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS stock_mv_source_idx
  ON stock_movements (org_id, source_type, source_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS stock_mv_batch_idx
  ON stock_movements (org_id, product_id, batch_no);
--> statement-breakpoint

ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE stock_movements FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY stock_mv_tenant_read ON stock_movements
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY stock_mv_tenant_write ON stock_movements
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

-- Append-only: stock movements are evidence, never modified after posting
REVOKE UPDATE, DELETE ON stock_movements FROM authenticated;
--> statement-breakpoint

-- ============================================================
-- 4. approval_chains — multi-step approval definitions
-- ============================================================
CREATE TABLE IF NOT EXISTS approval_chains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id UUID,
  entity_type TEXT NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT approval_chains_org_not_empty CHECK (org_id <> '')
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS approval_chains_org_id_idx
  ON approval_chains (org_id, id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS approval_chains_org_entity_idx
  ON approval_chains (org_id, entity_type);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS approval_chains_org_company_entity_uniq
  ON approval_chains (org_id, company_id, entity_type);
--> statement-breakpoint

ALTER TABLE approval_chains ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE approval_chains FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY approval_chains_tenant_read ON approval_chains
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY approval_chains_tenant_write ON approval_chains
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE TRIGGER set_updated_at_approval_chains
  BEFORE UPDATE ON approval_chains
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ── approval_steps ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS approval_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  chain_id UUID NOT NULL,
  step_order INTEGER NOT NULL,
  name TEXT NOT NULL,
  approval_mode TEXT NOT NULL DEFAULT 'any',
  required_count INTEGER NOT NULL DEFAULT 1,
  approver_role_id UUID,
  approver_user_id TEXT,
  timeout_hours INTEGER,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT approval_steps_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT approval_steps_mode_valid CHECK (approval_mode IN ('any', 'all', 'threshold')),
  CONSTRAINT approval_steps_count_positive CHECK (required_count > 0)
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS approval_steps_org_id_idx
  ON approval_steps (org_id, id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS approval_steps_chain_idx
  ON approval_steps (org_id, chain_id);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS approval_steps_chain_order_uniq
  ON approval_steps (org_id, chain_id, step_order);
--> statement-breakpoint

ALTER TABLE approval_steps ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE approval_steps FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY approval_steps_tenant_read ON approval_steps
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY approval_steps_tenant_write ON approval_steps
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE TRIGGER set_updated_at_approval_steps
  BEFORE UPDATE ON approval_steps
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ── approval_requests ───────────────────────────────────
CREATE TABLE IF NOT EXISTS approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  chain_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  current_step_order INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending',
  requested_by TEXT NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT approval_req_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT approval_req_status_valid CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'timed_out'))
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS approval_req_org_id_idx
  ON approval_requests (org_id, id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS approval_req_entity_idx
  ON approval_requests (org_id, entity_type, entity_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS approval_req_chain_idx
  ON approval_requests (org_id, chain_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS approval_req_status_idx
  ON approval_requests (org_id, status);
--> statement-breakpoint

ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE approval_requests FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY approval_req_tenant_read ON approval_requests
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY approval_req_tenant_write ON approval_requests
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE TRIGGER set_updated_at_approval_requests
  BEFORE UPDATE ON approval_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ── approval_decisions (append-only evidence) ───────────
CREATE TABLE IF NOT EXISTS approval_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  request_id UUID NOT NULL,
  step_id UUID NOT NULL,
  decision TEXT NOT NULL,
  decided_by TEXT NOT NULL,
  decided_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reason TEXT,
  delegated_from TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT approval_dec_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT approval_dec_decision_valid CHECK (decision IN ('approved', 'rejected', 'abstained'))
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS approval_dec_org_id_idx
  ON approval_decisions (org_id, id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS approval_dec_request_idx
  ON approval_decisions (org_id, request_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS approval_dec_step_idx
  ON approval_decisions (org_id, step_id);
--> statement-breakpoint

ALTER TABLE approval_decisions ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE approval_decisions FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY approval_dec_tenant_read ON approval_decisions
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY approval_dec_tenant_write ON approval_decisions
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

-- Approval decisions are append-only evidence
REVOKE UPDATE, DELETE ON approval_decisions FROM authenticated;
--> statement-breakpoint

-- ============================================================
-- 5. Partition key documentation
-- ============================================================
-- Pre-designed partition keys (implement when volume thresholds are hit):
--   audit_logs:          created_at (monthly range) — threshold: >10M rows
--   journal_lines:       posted_at  (monthly range) — threshold: >10M rows
--   stock_movements:     posted_at  (monthly range) — threshold: >10M rows
--   workflow_executions: created_at (monthly range) — threshold: >5M rows
--   custom_field_values: entity_type (list)         — threshold: >20M rows
-- All partition keys are insert-time-only columns (never updated).
-- Decision: document now, implement when volume thresholds are hit.

COMMENT ON TABLE stock_movements IS
  'Perpetual inventory ledger. Append-only. Future partition key: posted_at (monthly range).';
--> statement-breakpoint

COMMENT ON TABLE approval_decisions IS
  'Approval decision evidence. Append-only (REVOKE UPDATE/DELETE).';
