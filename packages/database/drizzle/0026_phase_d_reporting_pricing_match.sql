-- 0026_phase_d_reporting_pricing_match.sql
-- PRD: ERP Database Architecture Audit — Phase D (Reporting, Pricing, 3-Way Match)
--
-- Contents:
-- 1. reporting_snapshots table + indexes + RLS + REVOKE UPDATE/DELETE
-- 2. price_lists + price_list_items tables + indexes + RLS
-- 3. match_results table + indexes + RLS

-- ============================================================
-- 1. reporting_snapshots — period close evidence
-- ============================================================
CREATE TABLE IF NOT EXISTS reporting_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id UUID NOT NULL,
  fiscal_period_id UUID NOT NULL,
  snapshot_type TEXT NOT NULL,
  snapshot_date DATE NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  captured_by TEXT NOT NULL,
  data JSONB NOT NULL,
  currency_code TEXT NOT NULL DEFAULT 'MYR',
  total_debit_minor BIGINT,
  total_credit_minor BIGINT,
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT rpt_snap_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT rpt_snap_type_valid CHECK (snapshot_type IN ('trial_balance', 'balance_sheet', 'income_statement', 'aging_ar', 'aging_ap', 'inventory_valuation'))
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS rpt_snap_org_id_idx
  ON reporting_snapshots (org_id, id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS rpt_snap_company_idx
  ON reporting_snapshots (org_id, company_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS rpt_snap_period_idx
  ON reporting_snapshots (org_id, fiscal_period_id);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS rpt_snap_company_period_type_uniq
  ON reporting_snapshots (org_id, company_id, fiscal_period_id, snapshot_type);
--> statement-breakpoint

ALTER TABLE reporting_snapshots ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE reporting_snapshots FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY rpt_snap_tenant_read ON reporting_snapshots
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY rpt_snap_tenant_write ON reporting_snapshots
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

-- Snapshots are evidence — append-only
REVOKE UPDATE, DELETE ON reporting_snapshots FROM authenticated;
--> statement-breakpoint

-- ============================================================
-- 2. price_lists + price_list_items
-- ============================================================
CREATE TABLE IF NOT EXISTS price_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id UUID,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  currency_code TEXT NOT NULL DEFAULT 'MYR',
  is_default BOOLEAN NOT NULL DEFAULT false,
  effective_from DATE,
  effective_to DATE,
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

  CONSTRAINT price_lists_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT price_lists_date_order CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_from <= effective_to)
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS price_lists_org_id_idx
  ON price_lists (org_id, id);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS price_lists_org_code_uniq
  ON price_lists (org_id, code);
--> statement-breakpoint

ALTER TABLE price_lists ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE price_lists FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY price_lists_tenant_read ON price_lists
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY price_lists_tenant_write ON price_lists
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE TRIGGER set_updated_at_price_lists
  BEFORE UPDATE ON price_lists
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ── price_list_items ────────────────────────────────────
CREATE TABLE IF NOT EXISTS price_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  price_list_id UUID NOT NULL,
  product_id UUID,
  product_group_code TEXT,
  price_minor BIGINT NOT NULL,
  min_qty BIGINT NOT NULL DEFAULT 1,
  discount_percent TEXT,
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

  CONSTRAINT pli_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT pli_price_non_negative CHECK (price_minor >= 0),
  CONSTRAINT pli_min_qty_positive CHECK (min_qty > 0)
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS pli_org_id_idx
  ON price_list_items (org_id, id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS pli_price_list_idx
  ON price_list_items (org_id, price_list_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS pli_product_idx
  ON price_list_items (org_id, product_id);
--> statement-breakpoint

ALTER TABLE price_list_items ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE price_list_items FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY pli_tenant_read ON price_list_items
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY pli_tenant_write ON price_list_items
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE TRIGGER set_updated_at_pli
  BEFORE UPDATE ON price_list_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 3. match_results — 3-way match (PO–GRN–Invoice)
-- ============================================================
CREATE TABLE IF NOT EXISTS match_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id UUID NOT NULL,
  po_line_id UUID,
  grn_line_id UUID,
  invoice_line_id UUID,
  match_type TEXT NOT NULL DEFAULT 'three_way',
  status TEXT NOT NULL DEFAULT 'pending',
  qty_variance NUMERIC(20, 6),
  price_variance_minor BIGINT,
  total_variance_minor BIGINT,
  tolerance_rule_id UUID,
  resolved_by TEXT,
  resolution_note TEXT,
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT match_results_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT match_results_type_valid CHECK (match_type IN ('two_way', 'three_way')),
  CONSTRAINT match_results_status_valid CHECK (status IN ('pending', 'matched', 'exception', 'disputed', 'approved_override', 'cancelled'))
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS match_results_org_id_idx
  ON match_results (org_id, id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS match_results_company_idx
  ON match_results (org_id, company_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS match_results_po_idx
  ON match_results (org_id, po_line_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS match_results_grn_idx
  ON match_results (org_id, grn_line_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS match_results_invoice_idx
  ON match_results (org_id, invoice_line_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS match_results_status_idx
  ON match_results (org_id, status);
--> statement-breakpoint

ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE match_results FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY match_results_tenant_read ON match_results
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY match_results_tenant_write ON match_results
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE TRIGGER set_updated_at_match_results
  BEFORE UPDATE ON match_results
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
