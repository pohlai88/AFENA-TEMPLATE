-- 0027_phase_e_manufacturing_assets.sql
-- PRD: ERP Database Architecture Audit — Phase E (Industry Modules, Part 1)
--
-- Contents:
-- 1. boms + bom_lines (BOM definitions)
-- 2. work_orders (manufacturing execution)
-- 3. wip_movements (append-only WIP ledger)
-- 4. assets + depreciation_schedules + asset_events (fixed assets)

-- ============================================================
-- 1. boms — bill of materials definitions
-- ============================================================
CREATE TABLE IF NOT EXISTS boms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id UUID NOT NULL,
  product_id UUID NOT NULL,
  bom_version INTEGER NOT NULL DEFAULT 1,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  yield_qty NUMERIC(20, 6) NOT NULL DEFAULT 1,
  yield_uom_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT boms_org_not_empty CHECK (org_id <> '')
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS boms_org_id_idx ON boms (org_id, id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS boms_product_idx ON boms (org_id, company_id, product_id);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS boms_org_company_product_ver_uniq ON boms (org_id, company_id, product_id, bom_version);
--> statement-breakpoint

ALTER TABLE boms ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE boms FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY boms_tenant_read ON boms FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY boms_tenant_write ON boms FOR ALL TO authenticated USING ((select auth.org_id()) = org_id) WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE TRIGGER set_updated_at_boms BEFORE UPDATE ON boms FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ── bom_lines ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bom_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  bom_id UUID NOT NULL,
  component_product_id UUID NOT NULL,
  qty NUMERIC(20, 6) NOT NULL,
  uom_id UUID,
  waste_percent NUMERIC(5, 2) NOT NULL DEFAULT 0,
  is_optional BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT bom_lines_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT bom_lines_qty_positive CHECK (qty > 0)
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS bom_lines_org_id_idx ON bom_lines (org_id, id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS bom_lines_bom_idx ON bom_lines (org_id, bom_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS bom_lines_component_idx ON bom_lines (org_id, component_product_id);
--> statement-breakpoint

ALTER TABLE bom_lines ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE bom_lines FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY bom_lines_tenant_read ON bom_lines FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY bom_lines_tenant_write ON bom_lines FOR ALL TO authenticated USING ((select auth.org_id()) = org_id) WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE TRIGGER set_updated_at_bom_lines BEFORE UPDATE ON bom_lines FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 2. work_orders — manufacturing execution
-- ============================================================
CREATE TABLE IF NOT EXISTS work_orders (
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
  work_order_no TEXT,
  bom_id UUID NOT NULL,
  product_id UUID NOT NULL,
  planned_qty NUMERIC(20, 6) NOT NULL,
  completed_qty NUMERIC(20, 6) NOT NULL DEFAULT 0,
  scrap_qty NUMERIC(20, 6) NOT NULL DEFAULT 0,
  uom_id UUID,
  planned_start TIMESTAMPTZ,
  planned_end TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  wip_account_id UUID,
  total_cost_minor BIGINT NOT NULL DEFAULT 0,
  currency_code TEXT NOT NULL DEFAULT 'MYR',
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT work_orders_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT work_orders_qty_positive CHECK (planned_qty > 0)
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS work_orders_org_id_idx ON work_orders (org_id, id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS work_orders_org_company_idx ON work_orders (org_id, company_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS work_orders_product_idx ON work_orders (org_id, product_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS work_orders_bom_idx ON work_orders (org_id, bom_id);
--> statement-breakpoint

ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE work_orders FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY work_orders_tenant_read ON work_orders FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY work_orders_tenant_write ON work_orders FOR ALL TO authenticated USING ((select auth.org_id()) = org_id) WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE TRIGGER set_updated_at_work_orders BEFORE UPDATE ON work_orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 3. wip_movements — append-only WIP ledger
-- ============================================================
CREATE TABLE IF NOT EXISTS wip_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id UUID NOT NULL,
  work_order_id UUID NOT NULL,
  movement_type TEXT NOT NULL,
  product_id UUID,
  qty NUMERIC(20, 6),
  uom_id UUID,
  cost_minor BIGINT NOT NULL DEFAULT 0,
  currency_code TEXT NOT NULL DEFAULT 'MYR',
  posted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  stock_movement_id UUID,
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

  CONSTRAINT wip_mv_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT wip_mv_type_valid CHECK (movement_type IN ('material_issue', 'material_return', 'labor', 'overhead', 'completion', 'scrap'))
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS wip_mv_org_id_idx ON wip_movements (org_id, id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS wip_mv_work_order_idx ON wip_movements (org_id, work_order_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS wip_mv_posted_idx ON wip_movements (org_id, company_id, posted_at);
--> statement-breakpoint

ALTER TABLE wip_movements ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE wip_movements FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY wip_mv_tenant_read ON wip_movements FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY wip_mv_tenant_write ON wip_movements FOR ALL TO authenticated USING ((select auth.org_id()) = org_id) WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

-- WIP movements are append-only evidence
REVOKE UPDATE, DELETE ON wip_movements FROM authenticated;
--> statement-breakpoint

-- ============================================================
-- 4. assets — fixed asset register
-- ============================================================
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id UUID NOT NULL,
  asset_code TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'acquired',
  acquisition_date DATE NOT NULL,
  acquisition_cost_minor BIGINT NOT NULL,
  residual_value_minor BIGINT NOT NULL DEFAULT 0,
  useful_life_months INTEGER NOT NULL,
  depreciation_method TEXT NOT NULL DEFAULT 'straight_line',
  currency_code TEXT NOT NULL DEFAULT 'MYR',
  cost_account_id UUID,
  depreciation_account_id UUID,
  accum_depreciation_account_id UUID,
  disposal_date DATE,
  disposal_amount_minor BIGINT,
  site_id UUID,
  source_invoice_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT assets_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT assets_status_valid CHECK (status IN ('acquired', 'in_service', 'disposed', 'written_off')),
  CONSTRAINT assets_depreciation_valid CHECK (depreciation_method IN ('straight_line', 'declining_balance', 'units_of_production', 'none')),
  CONSTRAINT assets_cost_positive CHECK (acquisition_cost_minor > 0),
  CONSTRAINT assets_life_positive CHECK (useful_life_months > 0)
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS assets_org_id_idx ON assets (org_id, id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS assets_org_company_idx ON assets (org_id, company_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS assets_status_idx ON assets (org_id, status);
--> statement-breakpoint

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE assets FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY assets_tenant_read ON assets FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY assets_tenant_write ON assets FOR ALL TO authenticated USING ((select auth.org_id()) = org_id) WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE TRIGGER set_updated_at_assets BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ── depreciation_schedules ──────────────────────────────
CREATE TABLE IF NOT EXISTS depreciation_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  asset_id UUID NOT NULL,
  fiscal_period_id UUID NOT NULL,
  depreciation_minor BIGINT NOT NULL,
  accum_depreciation_minor BIGINT NOT NULL,
  book_value_minor BIGINT NOT NULL,
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

  CONSTRAINT dep_sched_org_not_empty CHECK (org_id <> '')
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS dep_sched_org_id_idx ON depreciation_schedules (org_id, id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS dep_sched_asset_idx ON depreciation_schedules (org_id, asset_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS dep_sched_period_idx ON depreciation_schedules (org_id, fiscal_period_id);
--> statement-breakpoint

ALTER TABLE depreciation_schedules ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE depreciation_schedules FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY dep_sched_tenant_read ON depreciation_schedules FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY dep_sched_tenant_write ON depreciation_schedules FOR ALL TO authenticated USING ((select auth.org_id()) = org_id) WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

-- Depreciation schedules are append-only evidence
REVOKE UPDATE, DELETE ON depreciation_schedules FROM authenticated;
--> statement-breakpoint

-- ── asset_events ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS asset_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  asset_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  amount_minor BIGINT,
  journal_entry_id UUID,
  performed_by TEXT NOT NULL,
  reason TEXT,
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT asset_events_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT asset_events_type_valid CHECK (event_type IN ('acquire', 'adjust', 'revalue', 'transfer', 'dispose', 'write_off', 'impair'))
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS asset_events_org_id_idx ON asset_events (org_id, id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS asset_events_asset_idx ON asset_events (org_id, asset_id);
--> statement-breakpoint

ALTER TABLE asset_events ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE asset_events FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY asset_events_tenant_read ON asset_events FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY asset_events_tenant_write ON asset_events FOR ALL TO authenticated USING ((select auth.org_id()) = org_id) WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

-- Asset events are append-only evidence
REVOKE UPDATE, DELETE ON asset_events FROM authenticated;
