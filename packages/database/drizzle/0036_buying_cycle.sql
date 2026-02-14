-- 0036_buying_cycle.sql
-- Transactional Spine Migration 0036: Buying Cycle
--
-- Contents:
-- 1. purchase_orders + purchase_order_lines
-- 2. goods_receipts + goods_receipt_lines
-- 3. purchase_invoices + purchase_invoice_lines
--
-- Mirror of selling cycle with supplier_id, AP aging indexes, warehouse trigger

-- ============================================================
-- 1. purchase_orders
-- ============================================================
CREATE TABLE purchase_orders (
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
  supplier_id       UUID NOT NULL,
  currency_code     TEXT NOT NULL DEFAULT 'MYR',
  exchange_rate     NUMERIC(12,6) DEFAULT 1,
  expected_date     DATE,
  payment_terms     TEXT,
  total_minor       BIGINT NOT NULL DEFAULT 0,
  discount_minor    BIGINT NOT NULL DEFAULT 0,
  tax_minor         BIGINT NOT NULL DEFAULT 0,
  grand_total_minor BIGINT NOT NULL DEFAULT 0,
  billing_address_id  UUID,
  shipping_address_id UUID,
  memo              TEXT,

  CONSTRAINT po_org_not_empty            CHECK (org_id <> ''),
  CONSTRAINT po_company_required         CHECK (company_id IS NOT NULL),
  CONSTRAINT po_total_non_negative       CHECK (total_minor >= 0),
  CONSTRAINT po_tax_non_negative         CHECK (tax_minor >= 0),
  CONSTRAINT po_grand_total_non_negative CHECK (grand_total_minor >= 0),
  CONSTRAINT po_posting_status_valid     CHECK (posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed'))
);
--> statement-breakpoint
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE UNIQUE INDEX po_org_doc_no_uniq ON purchase_orders (org_id, doc_no);
--> statement-breakpoint
CREATE INDEX po_org_supplier_created_idx ON purchase_orders (org_id, supplier_id, created_at DESC);
--> statement-breakpoint
CREATE INDEX po_org_doc_status_idx ON purchase_orders (org_id, doc_status, updated_at DESC);
--> statement-breakpoint
CREATE INDEX po_org_posting_status_idx ON purchase_orders (org_id, posting_status, posting_date DESC);
--> statement-breakpoint
CREATE POLICY "purchase_orders_crud_policy" ON purchase_orders
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint
CREATE TRIGGER set_updated_at BEFORE UPDATE ON purchase_orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint
CREATE TRIGGER reject_posted_mutation BEFORE UPDATE ON purchase_orders
  FOR EACH ROW EXECUTE FUNCTION reject_posted_mutation();
--> statement-breakpoint

-- ============================================================
-- 2. purchase_order_lines
-- ============================================================
CREATE TABLE purchase_order_lines (
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
  purchase_order_id UUID NOT NULL,
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
  received_qty      NUMERIC(20,6) NOT NULL DEFAULT 0,
  billed_qty        NUMERIC(20,6) NOT NULL DEFAULT 0,
  posting_date      TIMESTAMPTZ,
  source_doc_type   TEXT,
  source_line_id    UUID,
  memo              TEXT,

  CONSTRAINT pol_org_not_empty        CHECK (org_id <> ''),
  CONSTRAINT pol_net_check            CHECK (net_minor = amount_minor - discount_minor + tax_minor),
  CONSTRAINT pol_amount_non_negative  CHECK (amount_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE purchase_order_lines ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE UNIQUE INDEX pol_org_order_line_uniq ON purchase_order_lines (org_id, purchase_order_id, line_no);
--> statement-breakpoint
CREATE INDEX pol_org_order_idx ON purchase_order_lines (org_id, purchase_order_id);
--> statement-breakpoint
CREATE INDEX pol_org_item_idx ON purchase_order_lines (org_id, item_id);
--> statement-breakpoint
CREATE INDEX pol_org_item_posting_idx ON purchase_order_lines (org_id, item_id, posting_date DESC);
--> statement-breakpoint
CREATE POLICY "purchase_order_lines_crud_policy" ON purchase_order_lines
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint
CREATE TRIGGER set_updated_at BEFORE UPDATE ON purchase_order_lines
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 3. goods_receipts
-- ============================================================
CREATE TABLE goods_receipts (
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
  supplier_id       UUID NOT NULL,
  warehouse_id      UUID,
  memo              TEXT,

  CONSTRAINT gr_org_not_empty          CHECK (org_id <> ''),
  CONSTRAINT gr_company_required       CHECK (company_id IS NOT NULL),
  CONSTRAINT gr_posting_status_valid   CHECK (posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed'))
);
--> statement-breakpoint
ALTER TABLE goods_receipts ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE UNIQUE INDEX gr_org_doc_no_uniq ON goods_receipts (org_id, doc_no);
--> statement-breakpoint
CREATE INDEX gr_org_supplier_posting_idx ON goods_receipts (org_id, supplier_id, posting_date DESC);
--> statement-breakpoint
CREATE INDEX gr_org_posting_date_idx ON goods_receipts (org_id, posting_date DESC);
--> statement-breakpoint
CREATE INDEX gr_org_posting_status_idx ON goods_receipts (org_id, posting_status, posting_date DESC);
--> statement-breakpoint
CREATE POLICY "goods_receipts_crud_policy" ON goods_receipts
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint
CREATE TRIGGER set_updated_at BEFORE UPDATE ON goods_receipts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint
CREATE TRIGGER reject_posted_mutation BEFORE UPDATE ON goods_receipts
  FOR EACH ROW EXECUTE FUNCTION reject_posted_mutation();
--> statement-breakpoint

-- ============================================================
-- 4. goods_receipt_lines
-- ============================================================
CREATE TABLE goods_receipt_lines (
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
  goods_receipt_id  UUID NOT NULL,
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

  CONSTRAINT grl_org_not_empty        CHECK (org_id <> ''),
  CONSTRAINT grl_net_check            CHECK (net_minor = amount_minor - discount_minor + tax_minor),
  CONSTRAINT grl_amount_non_negative  CHECK (amount_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE goods_receipt_lines ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE UNIQUE INDEX grl_org_receipt_line_uniq ON goods_receipt_lines (org_id, goods_receipt_id, line_no);
--> statement-breakpoint
CREATE INDEX grl_org_receipt_idx ON goods_receipt_lines (org_id, goods_receipt_id);
--> statement-breakpoint
CREATE INDEX grl_org_item_idx ON goods_receipt_lines (org_id, item_id);
--> statement-breakpoint
CREATE INDEX grl_org_item_posting_idx ON goods_receipt_lines (org_id, item_id, posting_date DESC);
--> statement-breakpoint
CREATE POLICY "goods_receipt_lines_crud_policy" ON goods_receipt_lines
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint
CREATE TRIGGER set_updated_at BEFORE UPDATE ON goods_receipt_lines
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint

-- Attach warehouse-company match trigger to goods_receipt_lines
CREATE TRIGGER check_wh_company_match BEFORE INSERT OR UPDATE ON goods_receipt_lines
  FOR EACH ROW EXECUTE FUNCTION check_warehouse_company_match('direct');
--> statement-breakpoint

-- ============================================================
-- 5. purchase_invoices
-- ============================================================
CREATE TABLE purchase_invoices (
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
  supplier_id       UUID NOT NULL,
  due_date          DATE,
  currency_code     TEXT NOT NULL DEFAULT 'MYR',
  exchange_rate     NUMERIC(12,6) DEFAULT 1,
  total_minor       BIGINT NOT NULL DEFAULT 0,
  discount_minor    BIGINT NOT NULL DEFAULT 0,
  tax_minor         BIGINT NOT NULL DEFAULT 0,
  grand_total_minor BIGINT NOT NULL DEFAULT 0,
  paid_minor        BIGINT NOT NULL DEFAULT 0,
  outstanding_minor BIGINT NOT NULL DEFAULT 0,
  coa_payable_id    UUID,
  is_tax_included   BOOLEAN NOT NULL DEFAULT false,
  billing_address_id UUID,
  payment_terms     TEXT,
  memo              TEXT,

  CONSTRAINT pi_org_not_empty             CHECK (org_id <> ''),
  CONSTRAINT pi_company_required          CHECK (company_id IS NOT NULL),
  CONSTRAINT pi_total_non_negative        CHECK (total_minor >= 0),
  CONSTRAINT pi_tax_non_negative          CHECK (tax_minor >= 0),
  CONSTRAINT pi_grand_total_non_negative  CHECK (grand_total_minor >= 0),
  CONSTRAINT pi_paid_non_negative         CHECK (paid_minor >= 0),
  CONSTRAINT pi_outstanding_non_negative  CHECK (outstanding_minor >= 0),
  CONSTRAINT pi_posting_status_valid      CHECK (posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed'))
);
--> statement-breakpoint
ALTER TABLE purchase_invoices ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE UNIQUE INDEX pi_org_doc_no_uniq ON purchase_invoices (org_id, doc_no);
--> statement-breakpoint
CREATE INDEX pi_org_supplier_posting_idx ON purchase_invoices (org_id, supplier_id, posting_date DESC);
--> statement-breakpoint
CREATE INDEX pi_org_posting_date_idx ON purchase_invoices (org_id, posting_date DESC);
--> statement-breakpoint
CREATE INDEX pi_org_due_date_idx ON purchase_invoices (org_id, due_date);
--> statement-breakpoint
CREATE INDEX pi_org_doc_status_idx ON purchase_invoices (org_id, doc_status, updated_at DESC);
--> statement-breakpoint
CREATE INDEX pi_org_posting_status_idx ON purchase_invoices (org_id, posting_status, posting_date DESC);
--> statement-breakpoint
-- AP partial aging indexes
CREATE INDEX pi_org_outstanding_idx ON purchase_invoices (org_id, outstanding_minor)
  WHERE outstanding_minor > 0;
--> statement-breakpoint
CREATE INDEX pi_org_due_outstanding_idx ON purchase_invoices (org_id, due_date, outstanding_minor)
  WHERE outstanding_minor > 0;
--> statement-breakpoint
-- Statement index: AP aging + supplier statement
CREATE INDEX pi_org_supplier_due_stmt_idx ON purchase_invoices (org_id, supplier_id, due_date)
  WHERE outstanding_minor > 0;
--> statement-breakpoint
CREATE POLICY "purchase_invoices_crud_policy" ON purchase_invoices
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint
CREATE TRIGGER set_updated_at BEFORE UPDATE ON purchase_invoices
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint
CREATE TRIGGER reject_posted_mutation BEFORE UPDATE ON purchase_invoices
  FOR EACH ROW EXECUTE FUNCTION reject_posted_mutation();
--> statement-breakpoint

-- ============================================================
-- 6. purchase_invoice_lines
-- ============================================================
CREATE TABLE purchase_invoice_lines (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id              TEXT NOT NULL DEFAULT (auth.require_org_id()),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by          TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by          TEXT NOT NULL DEFAULT (auth.user_id()),
  version             INTEGER NOT NULL DEFAULT 1,
  is_deleted          BOOLEAN NOT NULL DEFAULT false,
  deleted_at          TIMESTAMPTZ,
  deleted_by          TEXT,
  purchase_invoice_id UUID NOT NULL,
  company_id          UUID NOT NULL,
  line_no             INTEGER NOT NULL,
  item_id             UUID,
  item_code           TEXT,
  item_name           TEXT,
  description         TEXT,
  qty                 NUMERIC(20,6) NOT NULL DEFAULT 1,
  uom_id              UUID,
  rate_minor          BIGINT NOT NULL DEFAULT 0,
  amount_minor        BIGINT NOT NULL DEFAULT 0,
  discount_minor      BIGINT NOT NULL DEFAULT 0,
  tax_minor           BIGINT NOT NULL DEFAULT 0,
  net_minor           BIGINT NOT NULL DEFAULT 0,
  tax_rate_id         UUID,
  coa_expense_id      UUID,
  cost_center_id      UUID,
  project_id          UUID,
  warehouse_id        UUID,
  posting_date        TIMESTAMPTZ,
  source_doc_type     TEXT,
  source_line_id      UUID,
  memo                TEXT,

  CONSTRAINT pil_org_not_empty        CHECK (org_id <> ''),
  CONSTRAINT pil_net_check            CHECK (net_minor = amount_minor - discount_minor + tax_minor),
  CONSTRAINT pil_amount_non_negative  CHECK (amount_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE purchase_invoice_lines ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE UNIQUE INDEX pil_org_invoice_line_uniq ON purchase_invoice_lines (org_id, purchase_invoice_id, line_no);
--> statement-breakpoint
CREATE INDEX pil_org_invoice_idx ON purchase_invoice_lines (org_id, purchase_invoice_id);
--> statement-breakpoint
CREATE INDEX pil_org_item_idx ON purchase_invoice_lines (org_id, item_id);
--> statement-breakpoint
CREATE INDEX pil_org_item_posting_idx ON purchase_invoice_lines (org_id, item_id, posting_date DESC);
--> statement-breakpoint
CREATE POLICY "purchase_invoice_lines_crud_policy" ON purchase_invoice_lines
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint
CREATE TRIGGER set_updated_at BEFORE UPDATE ON purchase_invoice_lines
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
