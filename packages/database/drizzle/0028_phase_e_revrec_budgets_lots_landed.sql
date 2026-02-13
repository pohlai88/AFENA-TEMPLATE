-- 0028_phase_e_revrec_budgets_lots_landed.sql
-- PRD: ERP Database Architecture Audit — Phase E (Industry Modules, Part 2)
--
-- Contents:
-- 1. revenue_schedules + revenue_schedule_lines (rev rec / deferred revenue)
-- 2. budgets + budget_commitments (encumbrance accounting)
-- 3. lot_tracking (lot/batch/serial traceability)
-- 4. landed_cost_docs + landed_cost_allocations (landed cost + cost layering)
-- 5. Trigram indexes on new tables

-- ============================================================
-- 1. revenue_schedules + revenue_schedule_lines
-- ============================================================
CREATE TABLE IF NOT EXISTS revenue_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id UUID NOT NULL,
  source_type TEXT NOT NULL,
  source_id UUID NOT NULL,
  total_amount_minor BIGINT NOT NULL,
  recognized_amount_minor BIGINT NOT NULL DEFAULT 0,
  deferred_amount_minor BIGINT NOT NULL,
  currency_code TEXT NOT NULL DEFAULT 'MYR',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  method TEXT NOT NULL DEFAULT 'straight_line',
  status TEXT NOT NULL DEFAULT 'active',
  revenue_account_id UUID,
  deferred_account_id UUID,
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT rev_sched_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT rev_sched_method_valid CHECK (method IN ('straight_line', 'usage_based', 'milestone', 'manual')),
  CONSTRAINT rev_sched_status_valid CHECK (status IN ('active', 'completed', 'cancelled')),
  CONSTRAINT rev_sched_date_order CHECK (start_date <= end_date)
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS rev_sched_org_id_idx ON revenue_schedules (org_id, id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS rev_sched_company_idx ON revenue_schedules (org_id, company_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS rev_sched_source_idx ON revenue_schedules (org_id, source_type, source_id);
--> statement-breakpoint

ALTER TABLE revenue_schedules ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE revenue_schedules FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY rev_sched_tenant_read ON revenue_schedules FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY rev_sched_tenant_write ON revenue_schedules FOR ALL TO authenticated USING ((select auth.org_id()) = org_id) WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE TRIGGER set_updated_at_rev_sched BEFORE UPDATE ON revenue_schedules FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ── revenue_schedule_lines ──────────────────────────────
CREATE TABLE IF NOT EXISTS revenue_schedule_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  schedule_id UUID NOT NULL,
  fiscal_period_id UUID,
  period_date DATE NOT NULL,
  amount_minor BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  journal_entry_id UUID,
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT rev_sched_lines_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT rev_sched_lines_status_valid CHECK (status IN ('pending', 'recognized', 'cancelled'))
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS rev_sched_lines_org_id_idx ON revenue_schedule_lines (org_id, id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS rev_sched_lines_sched_idx ON revenue_schedule_lines (org_id, schedule_id);
--> statement-breakpoint

ALTER TABLE revenue_schedule_lines ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE revenue_schedule_lines FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY rev_sched_lines_tenant_read ON revenue_schedule_lines FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY rev_sched_lines_tenant_write ON revenue_schedule_lines FOR ALL TO authenticated USING ((select auth.org_id()) = org_id) WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

-- ============================================================
-- 2. budgets + budget_commitments
-- ============================================================
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id UUID NOT NULL,
  fiscal_period_id UUID NOT NULL,
  account_id UUID NOT NULL,
  cost_center_id UUID,
  project_id UUID,
  budget_amount_minor BIGINT NOT NULL,
  committed_amount_minor BIGINT NOT NULL DEFAULT 0,
  actual_amount_minor BIGINT NOT NULL DEFAULT 0,
  currency_code TEXT NOT NULL DEFAULT 'MYR',
  enforcement_mode TEXT NOT NULL DEFAULT 'advisory',
  is_active BOOLEAN NOT NULL DEFAULT true,
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT budgets_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT budgets_enforcement_valid CHECK (enforcement_mode IN ('advisory', 'hard_stop')),
  CONSTRAINT budgets_amount_non_negative CHECK (budget_amount_minor >= 0)
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS budgets_org_id_idx ON budgets (org_id, id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS budgets_company_idx ON budgets (org_id, company_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS budgets_period_idx ON budgets (org_id, fiscal_period_id);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS budgets_org_period_account_cc_proj_uniq ON budgets (org_id, company_id, fiscal_period_id, account_id, cost_center_id, project_id);
--> statement-breakpoint

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE budgets FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY budgets_tenant_read ON budgets FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY budgets_tenant_write ON budgets FOR ALL TO authenticated USING ((select auth.org_id()) = org_id) WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE TRIGGER set_updated_at_budgets BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ── budget_commitments ──────────────────────────────────
CREATE TABLE IF NOT EXISTS budget_commitments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  budget_id UUID NOT NULL,
  source_type TEXT NOT NULL,
  source_id UUID NOT NULL,
  amount_minor BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'committed',
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT budget_commit_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT budget_commit_source_valid CHECK (source_type IN ('purchase_order', 'purchase_request', 'contract')),
  CONSTRAINT budget_commit_status_valid CHECK (status IN ('committed', 'released', 'cancelled'))
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS budget_commit_org_id_idx ON budget_commitments (org_id, id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS budget_commit_budget_idx ON budget_commitments (org_id, budget_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS budget_commit_source_idx ON budget_commitments (org_id, source_type, source_id);
--> statement-breakpoint

ALTER TABLE budget_commitments ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE budget_commitments FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY budget_commit_tenant_read ON budget_commitments FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY budget_commit_tenant_write ON budget_commitments FOR ALL TO authenticated USING ((select auth.org_id()) = org_id) WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

-- ============================================================
-- 3. lot_tracking — lot/batch/serial traceability
-- ============================================================
CREATE TABLE IF NOT EXISTS lot_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id UUID NOT NULL,
  product_id UUID NOT NULL,
  tracking_type TEXT NOT NULL,
  tracking_no TEXT NOT NULL,
  production_date DATE,
  expiry_date DATE,
  qty NUMERIC(20, 6),
  uom_id UUID,
  site_id UUID,
  warehouse_zone TEXT,
  supplier_id UUID,
  supplier_batch_no TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT lot_track_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT lot_track_type_valid CHECK (tracking_type IN ('lot', 'batch', 'serial')),
  CONSTRAINT lot_track_status_valid CHECK (status IN ('active', 'consumed', 'expired', 'recalled', 'quarantined'))
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS lot_track_org_id_idx ON lot_tracking (org_id, id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS lot_track_product_idx ON lot_tracking (org_id, product_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS lot_track_company_idx ON lot_tracking (org_id, company_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS lot_track_expiry_idx ON lot_tracking (org_id, product_id, expiry_date);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS lot_track_org_product_no_uniq ON lot_tracking (org_id, company_id, product_id, tracking_no);
--> statement-breakpoint

ALTER TABLE lot_tracking ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE lot_tracking FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY lot_track_tenant_read ON lot_tracking FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY lot_track_tenant_write ON lot_tracking FOR ALL TO authenticated USING ((select auth.org_id()) = org_id) WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE TRIGGER set_updated_at_lot_tracking BEFORE UPDATE ON lot_tracking FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 4. landed_cost_docs + landed_cost_allocations
-- ============================================================
CREATE TABLE IF NOT EXISTS landed_cost_docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id UUID,
  site_id UUID,
  custom_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  doc_status TEXT NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,
  submitted_by TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_by TEXT,
  amended_from_id UUID,
  doc_no TEXT,
  receipt_id UUID,
  vendor_id UUID,
  total_cost_minor BIGINT NOT NULL DEFAULT 0,
  currency_code TEXT NOT NULL DEFAULT 'MYR',
  fx_rate TEXT,
  base_total_cost_minor BIGINT NOT NULL DEFAULT 0,
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT lc_docs_org_not_empty CHECK (org_id <> '')
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS lc_docs_org_id_idx ON landed_cost_docs (org_id, id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS lc_docs_company_idx ON landed_cost_docs (org_id, company_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS lc_docs_receipt_idx ON landed_cost_docs (org_id, receipt_id);
--> statement-breakpoint

ALTER TABLE landed_cost_docs ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE landed_cost_docs FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY lc_docs_tenant_read ON landed_cost_docs FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY lc_docs_tenant_write ON landed_cost_docs FOR ALL TO authenticated USING ((select auth.org_id()) = org_id) WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE TRIGGER set_updated_at_lc_docs BEFORE UPDATE ON landed_cost_docs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ── landed_cost_allocations ─────────────────────────────
CREATE TABLE IF NOT EXISTS landed_cost_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  landed_cost_doc_id UUID NOT NULL,
  receipt_line_id UUID NOT NULL,
  allocation_method TEXT NOT NULL DEFAULT 'qty',
  allocated_cost_minor BIGINT NOT NULL,
  currency_code TEXT NOT NULL DEFAULT 'MYR',
  base_allocated_cost_minor BIGINT NOT NULL,
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT lc_alloc_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT lc_alloc_method_valid CHECK (allocation_method IN ('qty', 'value', 'weight', 'custom')),
  CONSTRAINT lc_alloc_cost_positive CHECK (allocated_cost_minor > 0)
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS lc_alloc_org_id_idx ON landed_cost_allocations (org_id, id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS lc_alloc_doc_idx ON landed_cost_allocations (org_id, landed_cost_doc_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS lc_alloc_receipt_line_idx ON landed_cost_allocations (org_id, receipt_line_id);
--> statement-breakpoint

ALTER TABLE landed_cost_allocations ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE landed_cost_allocations FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY lc_alloc_tenant_read ON landed_cost_allocations FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY lc_alloc_tenant_write ON landed_cost_allocations FOR ALL TO authenticated USING ((select auth.org_id()) = org_id) WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

-- ============================================================
-- 5. Trigram indexes on new searchable columns
-- ============================================================
CREATE INDEX IF NOT EXISTS assets_name_trgm_idx ON assets USING gin (name gin_trgm_ops);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS lot_tracking_no_trgm_idx ON lot_tracking USING gin (tracking_no gin_trgm_ops);
