-- 0035_selling_cycle.sql
-- Transactional Spine Migration 0035: Remaining Selling Cycle
--
-- Contents:
-- 1. sales_orders + sales_order_lines
-- 2. delivery_notes + delivery_note_lines
--
-- Key v6.3 invariants enforced:
-- - posting_status 6-state CHECK (P-08)
-- - company_id IS NOT NULL on headers (§3.12)
-- - net_minor = amount_minor - discount_minor + tax_minor (line CHECK)
-- - reject_posted_mutation trigger on postable headers

-- ============================================================
-- 1. sales_orders
-- ============================================================
CREATE TABLE sales_orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            TEXT NOT NULL DEFAULT (auth.require_org_id()),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by        TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by        TEXT NOT NULL DEFAULT (auth.user_id()),
  version           INTEGER NOT NULL DEFAULT 1,
  is_deleted        BOOLEAN NOT NULL DEFAULT false,
  deleted_at        TIMESTAMPTZ,
  deleted_by        TEXT,
  company_id        UUID NOT NULL,
  site_id           UUID,
  custom_data       JSONB NOT NULL DEFAULT '{}'::jsonb,
  doc_status        TEXT NOT NULL DEFAULT 'draft',
  submitted_at      TIMESTAMPTZ,
  submitted_by      TEXT,
  cancelled_at      TIMESTAMPTZ,
  cancelled_by      TEXT,
  amended_from_id   UUID,
  external_source   TEXT,
  external_id       TEXT,
  posting_status    TEXT NOT NULL DEFAULT 'unposted',
  posting_date      TIMESTAMPTZ,
  posted_at         TIMESTAMPTZ,
  posted_by         TEXT,
  posting_batch_id  UUID,
  doc_no            TEXT,
  customer_id       UUID NOT NULL,
  currency_code     TEXT NOT NULL DEFAULT 'MYR',
  exchange_rate     NUMERIC(12,6) DEFAULT 1,
  delivery_date     DATE,
  payment_terms     TEXT,
  total_minor       BIGINT NOT NULL DEFAULT 0,
  discount_minor    BIGINT NOT NULL DEFAULT 0,
  tax_minor         BIGINT NOT NULL DEFAULT 0,
  grand_total_minor BIGINT NOT NULL DEFAULT 0,
  billing_address_id  UUID,
  shipping_address_id UUID,
  memo              TEXT,

  CONSTRAINT so_org_not_empty            CHECK (org_id <> ''),
  CONSTRAINT so_company_required         CHECK (company_id IS NOT NULL),
  CONSTRAINT so_total_non_negative       CHECK (total_minor >= 0),
  CONSTRAINT so_tax_non_negative         CHECK (tax_minor >= 0),
  CONSTRAINT so_grand_total_non_negative CHECK (grand_total_minor >= 0),
  CONSTRAINT so_posting_status_valid     CHECK (posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed'))
);
--> statement-breakpoint
ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE UNIQUE INDEX so_org_doc_no_uniq ON sales_orders (org_id, doc_no);
--> statement-breakpoint
CREATE INDEX so_org_customer_created_idx ON sales_orders (org_id, customer_id, created_at DESC);
--> statement-breakpoint
CREATE INDEX so_org_doc_status_idx ON sales_orders (org_id, doc_status, updated_at DESC);
--> statement-breakpoint
CREATE INDEX so_org_posting_status_idx ON sales_orders (org_id, posting_status, posting_date DESC);
--> statement-breakpoint
CREATE POLICY "sales_orders_crud_policy" ON sales_orders
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint
CREATE TRIGGER set_updated_at BEFORE UPDATE ON sales_orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint
CREATE TRIGGER reject_posted_mutation BEFORE UPDATE ON sales_orders
  FOR EACH ROW EXECUTE FUNCTION reject_posted_mutation();
--> statement-breakpoint

-- ============================================================
-- 2. sales_order_lines
-- ============================================================
CREATE TABLE sales_order_lines (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            TEXT NOT NULL DEFAULT (auth.require_org_id()),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by        TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by        TEXT NOT NULL DEFAULT (auth.user_id()),
  version           INTEGER NOT NULL DEFAULT 1,
  is_deleted        BOOLEAN NOT NULL DEFAULT false,
  deleted_at        TIMESTAMPTZ,
  deleted_by        TEXT,
  sales_order_id    UUID NOT NULL,
  company_id        UUID NOT NULL,
  line_no           INTEGER NOT NULL,
  item_id           UUID,
  item_code         TEXT,
  item_name         TEXT,
  description       TEXT,
  qty               NUMERIC(20,6) NOT NULL DEFAULT 1,
  uom_id            UUID,
  rate_minor        BIGINT NOT NULL DEFAULT 0,
  amount_minor      BIGINT NOT NULL DEFAULT 0,
  discount_minor    BIGINT NOT NULL DEFAULT 0,
  tax_minor         BIGINT NOT NULL DEFAULT 0,
  net_minor         BIGINT NOT NULL DEFAULT 0,
  tax_rate_id       UUID,
  cost_center_id    UUID,
  project_id        UUID,
  warehouse_id      UUID,
  delivered_qty     NUMERIC(20,6) NOT NULL DEFAULT 0,
  billed_qty        NUMERIC(20,6) NOT NULL DEFAULT 0,
  posting_date      TIMESTAMPTZ,
  source_doc_type   TEXT,
  source_line_id    UUID,
  memo              TEXT,

  CONSTRAINT sol_org_not_empty        CHECK (org_id <> ''),
  CONSTRAINT sol_net_check            CHECK (net_minor = amount_minor - discount_minor + tax_minor),
  CONSTRAINT sol_amount_non_negative  CHECK (amount_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE sales_order_lines ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE UNIQUE INDEX sol_org_order_line_uniq ON sales_order_lines (org_id, sales_order_id, line_no);
--> statement-breakpoint
CREATE INDEX sol_org_order_idx ON sales_order_lines (org_id, sales_order_id);
--> statement-breakpoint
CREATE INDEX sol_org_item_idx ON sales_order_lines (org_id, item_id);
--> statement-breakpoint
CREATE INDEX sol_org_item_posting_idx ON sales_order_lines (org_id, item_id, posting_date DESC);
--> statement-breakpoint
CREATE POLICY "sales_order_lines_crud_policy" ON sales_order_lines
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint
CREATE TRIGGER set_updated_at BEFORE UPDATE ON sales_order_lines
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 3. delivery_notes
-- ============================================================
CREATE TABLE delivery_notes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            TEXT NOT NULL DEFAULT (auth.require_org_id()),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by        TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by        TEXT NOT NULL DEFAULT (auth.user_id()),
  version           INTEGER NOT NULL DEFAULT 1,
  is_deleted        BOOLEAN NOT NULL DEFAULT false,
  deleted_at        TIMESTAMPTZ,
  deleted_by        TEXT,
  company_id        UUID NOT NULL,
  site_id           UUID,
  custom_data       JSONB NOT NULL DEFAULT '{}'::jsonb,
  doc_status        TEXT NOT NULL DEFAULT 'draft',
  submitted_at      TIMESTAMPTZ,
  submitted_by      TEXT,
  cancelled_at      TIMESTAMPTZ,
  cancelled_by      TEXT,
  amended_from_id   UUID,
  external_source   TEXT,
  external_id       TEXT,
  posting_status    TEXT NOT NULL DEFAULT 'unposted',
  posting_date      TIMESTAMPTZ,
  posted_at         TIMESTAMPTZ,
  posted_by         TEXT,
  posting_batch_id  UUID,
  doc_no            TEXT,
  customer_id       UUID NOT NULL,
  warehouse_id      UUID,
  memo              TEXT,

  CONSTRAINT dn_org_not_empty          CHECK (org_id <> ''),
  CONSTRAINT dn_company_required       CHECK (company_id IS NOT NULL),
  CONSTRAINT dn_posting_status_valid   CHECK (posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed'))
);
--> statement-breakpoint
ALTER TABLE delivery_notes ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE UNIQUE INDEX dn_org_doc_no_uniq ON delivery_notes (org_id, doc_no);
--> statement-breakpoint
CREATE INDEX dn_org_customer_posting_idx ON delivery_notes (org_id, customer_id, posting_date DESC);
--> statement-breakpoint
CREATE INDEX dn_org_posting_date_idx ON delivery_notes (org_id, posting_date DESC);
--> statement-breakpoint
CREATE INDEX dn_org_posting_status_idx ON delivery_notes (org_id, posting_status, posting_date DESC);
--> statement-breakpoint
CREATE POLICY "delivery_notes_crud_policy" ON delivery_notes
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint
CREATE TRIGGER set_updated_at BEFORE UPDATE ON delivery_notes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint
CREATE TRIGGER reject_posted_mutation BEFORE UPDATE ON delivery_notes
  FOR EACH ROW EXECUTE FUNCTION reject_posted_mutation();
--> statement-breakpoint

-- ============================================================
-- 4. delivery_note_lines
-- ============================================================
CREATE TABLE delivery_note_lines (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id            TEXT NOT NULL DEFAULT (auth.require_org_id()),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by        TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by        TEXT NOT NULL DEFAULT (auth.user_id()),
  version           INTEGER NOT NULL DEFAULT 1,
  is_deleted        BOOLEAN NOT NULL DEFAULT false,
  deleted_at        TIMESTAMPTZ,
  deleted_by        TEXT,
  delivery_note_id  UUID NOT NULL,
  company_id        UUID NOT NULL,
  line_no           INTEGER NOT NULL,
  item_id           UUID,
  item_code         TEXT,
  item_name         TEXT,
  description       TEXT,
  qty               NUMERIC(20,6) NOT NULL DEFAULT 1,
  uom_id            UUID,
  rate_minor        BIGINT NOT NULL DEFAULT 0,
  amount_minor      BIGINT NOT NULL DEFAULT 0,
  discount_minor    BIGINT NOT NULL DEFAULT 0,
  tax_minor         BIGINT NOT NULL DEFAULT 0,
  net_minor         BIGINT NOT NULL DEFAULT 0,
  tax_rate_id       UUID,
  warehouse_id      UUID,
  lot_tracking_id   UUID,
  serial_no         TEXT,
  posting_date      TIMESTAMPTZ,
  source_doc_type   TEXT,
  source_line_id    UUID,
  memo              TEXT,

  CONSTRAINT dnl_org_not_empty        CHECK (org_id <> ''),
  CONSTRAINT dnl_net_check            CHECK (net_minor = amount_minor - discount_minor + tax_minor),
  CONSTRAINT dnl_amount_non_negative  CHECK (amount_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE delivery_note_lines ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE UNIQUE INDEX dnl_org_note_line_uniq ON delivery_note_lines (org_id, delivery_note_id, line_no);
--> statement-breakpoint
CREATE INDEX dnl_org_note_idx ON delivery_note_lines (org_id, delivery_note_id);
--> statement-breakpoint
CREATE INDEX dnl_org_item_idx ON delivery_note_lines (org_id, item_id);
--> statement-breakpoint
CREATE INDEX dnl_org_item_posting_idx ON delivery_note_lines (org_id, item_id, posting_date DESC);
--> statement-breakpoint
CREATE POLICY "delivery_note_lines_crud_policy" ON delivery_note_lines
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint
CREATE TRIGGER set_updated_at BEFORE UPDATE ON delivery_note_lines
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
