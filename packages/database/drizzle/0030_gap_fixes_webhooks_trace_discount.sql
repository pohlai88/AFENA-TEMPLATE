-- 0030_gap_fixes_webhooks_trace_discount.sql
-- PRD Gap Fixes: Missing items identified during validation
--
-- Contents:
-- 1. ALTER companies: add org_timezone (G0.5)
-- 2. ALTER doc entity tables: add external_source + external_id (G0.4)
-- 3. webhook_endpoints + webhook_deliveries (Phase C #11)
-- 4. inventory_trace_links (G0.14 trace DAG)
-- 5. discount_rules (G0.16 stacking/precedence)

-- ============================================================
-- 1. companies.org_timezone (G0.5)
-- ============================================================
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS org_timezone TEXT NOT NULL DEFAULT 'Asia/Kuala_Lumpur';
--> statement-breakpoint

-- ============================================================
-- 2. external_source + external_id on doc entity tables (G0.4)
-- ============================================================
-- Add to all existing docEntity tables for external write idempotency.
-- New tables using docEntityColumns will get these automatically.

ALTER TABLE credit_notes
  ADD COLUMN IF NOT EXISTS external_source TEXT,
  ADD COLUMN IF NOT EXISTS external_id TEXT;
--> statement-breakpoint

ALTER TABLE work_orders
  ADD COLUMN IF NOT EXISTS external_source TEXT,
  ADD COLUMN IF NOT EXISTS external_id TEXT;
--> statement-breakpoint

ALTER TABLE landed_cost_docs
  ADD COLUMN IF NOT EXISTS external_source TEXT,
  ADD COLUMN IF NOT EXISTS external_id TEXT;
--> statement-breakpoint

-- ============================================================
-- 3. webhook_endpoints + webhook_deliveries (Phase C #11)
-- ============================================================
CREATE TABLE IF NOT EXISTS webhook_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  description TEXT,
  subscribed_events JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_delivered_at TIMESTAMPTZ,
  last_status_code TEXT,
  failure_count TEXT NOT NULL DEFAULT '0',
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT webhook_ep_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT webhook_ep_url_not_empty CHECK (url <> '')
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS webhook_ep_org_id_idx ON webhook_endpoints (org_id, id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS webhook_ep_active_idx ON webhook_endpoints (org_id, is_active);
--> statement-breakpoint

ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE webhook_endpoints FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY webhook_ep_tenant_read ON webhook_endpoints FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY webhook_ep_tenant_write ON webhook_endpoints FOR ALL TO authenticated USING ((select auth.org_id()) = org_id) WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE TRIGGER set_updated_at_webhook_endpoints BEFORE UPDATE ON webhook_endpoints FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ── webhook_deliveries (append-only) ────────────────────
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  endpoint_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status_code TEXT,
  response_body TEXT,
  attempt_number TEXT NOT NULL DEFAULT '1',
  delivered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_ms TEXT,
  error TEXT,

  CONSTRAINT webhook_del_org_not_empty CHECK (org_id <> '')
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS webhook_del_org_id_idx ON webhook_deliveries (org_id, id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS webhook_del_endpoint_idx ON webhook_deliveries (org_id, endpoint_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS webhook_del_event_idx ON webhook_deliveries (org_id, event_type);
--> statement-breakpoint

ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE webhook_deliveries FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY webhook_del_tenant_read ON webhook_deliveries FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY webhook_del_tenant_write ON webhook_deliveries FOR ALL TO authenticated USING ((select auth.org_id()) = org_id) WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

-- Deliveries are append-only evidence
REVOKE UPDATE, DELETE ON webhook_deliveries FROM authenticated;
--> statement-breakpoint

-- ============================================================
-- 4. inventory_trace_links (G0.14 trace DAG)
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory_trace_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  from_movement_id UUID NOT NULL,
  to_movement_id UUID NOT NULL,
  qty NUMERIC(20, 6) NOT NULL,
  uom_id UUID,
  lot_tracking_id UUID,
  trace_type TEXT NOT NULL DEFAULT 'transfer',
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT inv_trace_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT inv_trace_qty_positive CHECK (qty > 0),
  CONSTRAINT inv_trace_type_valid CHECK (trace_type IN ('transfer', 'consumption', 'production', 'split', 'merge'))
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS inv_trace_org_id_idx ON inventory_trace_links (org_id, id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS inv_trace_from_idx ON inventory_trace_links (org_id, from_movement_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS inv_trace_to_idx ON inventory_trace_links (org_id, to_movement_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS inv_trace_lot_idx ON inventory_trace_links (org_id, lot_tracking_id);
--> statement-breakpoint

ALTER TABLE inventory_trace_links ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE inventory_trace_links FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY inv_trace_tenant_read ON inventory_trace_links FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY inv_trace_tenant_write ON inventory_trace_links FOR ALL TO authenticated USING ((select auth.org_id()) = org_id) WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

-- ============================================================
-- 5. discount_rules (G0.16 stacking/precedence)
-- ============================================================
CREATE TABLE IF NOT EXISTS discount_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id UUID,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC(20, 6) NOT NULL,
  scope TEXT NOT NULL DEFAULT 'global',
  customer_id UUID,
  product_id UUID,
  product_group_code TEXT,
  price_list_id UUID,
  precedence INTEGER NOT NULL DEFAULT 100,
  stackable BOOLEAN NOT NULL DEFAULT false,
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

  CONSTRAINT disc_rules_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT disc_rules_type_valid CHECK (discount_type IN ('percentage', 'fixed_amount', 'buy_x_get_y')),
  CONSTRAINT disc_rules_scope_valid CHECK (scope IN ('global', 'customer', 'product', 'product_group', 'price_list')),
  CONSTRAINT disc_rules_value_non_negative CHECK (discount_value >= 0),
  CONSTRAINT disc_rules_date_order CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_from <= effective_to)
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS disc_rules_org_id_idx ON discount_rules (org_id, id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS disc_rules_scope_idx ON discount_rules (org_id, scope);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS disc_rules_customer_idx ON discount_rules (org_id, customer_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS disc_rules_product_idx ON discount_rules (org_id, product_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS disc_rules_precedence_idx ON discount_rules (org_id, precedence);
--> statement-breakpoint

ALTER TABLE discount_rules ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE discount_rules FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY disc_rules_tenant_read ON discount_rules FOR SELECT TO authenticated USING ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE POLICY disc_rules_tenant_write ON discount_rules FOR ALL TO authenticated USING ((select auth.org_id()) = org_id) WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint
CREATE TRIGGER set_updated_at_discount_rules BEFORE UPDATE ON discount_rules FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
