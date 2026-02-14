-- 0033_sales_invoices.sql
-- Transactional Spine Migration 0033: Sales Invoice + Lines
--
-- Contents:
-- 1. sales_invoices (AR document — proves posting engine + GL + outstanding)
-- 2. sales_invoice_lines (line items with net CHECK + analytics indexes)
--
-- Key v6.3 invariants enforced:
-- - posting_status 6-state CHECK (P-08)
-- - company_id IS NOT NULL (§3.12)
-- - is_tax_included flag (§3.11)
-- - Partial aging indexes for AR (R2.6)
-- - Statement index (customer + due_date WHERE outstanding > 0)
-- - Header-side customer analytics index (v6.2 nit)
-- - Line analytics index (v6.2)
-- - net_minor = amount_minor - discount_minor + tax_minor (line CHECK)

-- ============================================================
-- 1. sales_invoices
-- ============================================================
CREATE TABLE sales_invoices (
  -- base entity
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
  -- erp entity
  company_id        UUID NOT NULL,
  site_id           UUID,
  custom_data       JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- doc entity (lifecycle)
  doc_status        TEXT NOT NULL DEFAULT 'draft',
  submitted_at      TIMESTAMPTZ,
  submitted_by      TEXT,
  cancelled_at      TIMESTAMPTZ,
  cancelled_by      TEXT,
  amended_from_id   UUID,
  external_source   TEXT,
  external_id       TEXT,
  -- posting columns (P-08: 6-state)
  posting_status    TEXT NOT NULL DEFAULT 'unposted',
  posting_date      TIMESTAMPTZ,
  posted_at         TIMESTAMPTZ,
  posted_by         TEXT,
  posting_batch_id  UUID,
  -- invoice-specific
  doc_no            TEXT,
  customer_id       UUID NOT NULL,
  due_date          DATE,
  currency_code     TEXT NOT NULL DEFAULT 'MYR',
  exchange_rate     NUMERIC(12,6) DEFAULT 1,
  total_minor       BIGINT NOT NULL DEFAULT 0,
  discount_minor    BIGINT NOT NULL DEFAULT 0,
  tax_minor         BIGINT NOT NULL DEFAULT 0,
  grand_total_minor BIGINT NOT NULL DEFAULT 0,
  paid_minor        BIGINT NOT NULL DEFAULT 0,
  outstanding_minor BIGINT NOT NULL DEFAULT 0,
  coa_receivable_id UUID,
  is_tax_included   BOOLEAN NOT NULL DEFAULT false,
  billing_address_id  UUID,
  shipping_address_id UUID,
  payment_terms     TEXT,
  memo              TEXT,

  -- Constraints
  CONSTRAINT si_org_not_empty             CHECK (org_id <> ''),
  CONSTRAINT si_company_required          CHECK (company_id IS NOT NULL),
  CONSTRAINT si_total_non_negative        CHECK (total_minor >= 0),
  CONSTRAINT si_tax_non_negative          CHECK (tax_minor >= 0),
  CONSTRAINT si_grand_total_non_negative  CHECK (grand_total_minor >= 0),
  CONSTRAINT si_paid_non_negative         CHECK (paid_minor >= 0),
  CONSTRAINT si_outstanding_non_negative  CHECK (outstanding_minor >= 0),
  CONSTRAINT si_posting_status_valid      CHECK (posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed'))
);
--> statement-breakpoint
ALTER TABLE sales_invoices ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

-- Unique doc_no per org
CREATE UNIQUE INDEX si_org_doc_no_uniq ON sales_invoices (org_id, doc_no);
--> statement-breakpoint
-- Customer + posting date for customer ledger
CREATE INDEX si_org_customer_posting_idx ON sales_invoices (org_id, customer_id, posting_date DESC);
--> statement-breakpoint
CREATE INDEX si_org_posting_date_idx ON sales_invoices (org_id, posting_date DESC);
--> statement-breakpoint
CREATE INDEX si_org_due_date_idx ON sales_invoices (org_id, due_date);
--> statement-breakpoint
CREATE INDEX si_org_doc_status_idx ON sales_invoices (org_id, doc_status, updated_at DESC);
--> statement-breakpoint
CREATE INDEX si_org_posting_status_idx ON sales_invoices (org_id, posting_status, posting_date DESC);
--> statement-breakpoint

-- Partial aging indexes (R2.6)
CREATE INDEX si_org_outstanding_idx ON sales_invoices (org_id, outstanding_minor)
  WHERE outstanding_minor > 0;
--> statement-breakpoint
CREATE INDEX si_org_due_outstanding_idx ON sales_invoices (org_id, due_date, outstanding_minor)
  WHERE outstanding_minor > 0;
--> statement-breakpoint
-- Statement index: AR aging + customer statement query
CREATE INDEX si_org_customer_due_stmt_idx ON sales_invoices (org_id, customer_id, due_date)
  WHERE outstanding_minor > 0;
--> statement-breakpoint
-- Header-side customer analytics (v6.2 nit)
CREATE INDEX si_org_customer_analytics_idx ON sales_invoices (org_id, customer_id, posting_date DESC, id);
--> statement-breakpoint

CREATE POLICY "sales_invoices_crud_policy" ON sales_invoices
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint

CREATE TRIGGER set_updated_at BEFORE UPDATE ON sales_invoices
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint

-- Attach reject_posted_mutation trigger (blocks UPDATE when posted/reversing/reversed)
CREATE TRIGGER reject_posted_mutation BEFORE UPDATE ON sales_invoices
  FOR EACH ROW EXECUTE FUNCTION reject_posted_mutation();
--> statement-breakpoint

-- ============================================================
-- 2. sales_invoice_lines
-- ============================================================
CREATE TABLE sales_invoice_lines (
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
  sales_invoice_id  UUID NOT NULL,
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
  coa_income_id     UUID,
  cost_center_id    UUID,
  project_id        UUID,
  warehouse_id      UUID,
  posting_date      TIMESTAMPTZ,
  source_doc_type   TEXT,
  source_line_id    UUID,
  memo              TEXT,

  CONSTRAINT sil_org_not_empty        CHECK (org_id <> ''),
  CONSTRAINT sil_net_check            CHECK (net_minor = amount_minor - discount_minor + tax_minor),
  CONSTRAINT sil_amount_non_negative  CHECK (amount_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE sales_invoice_lines ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

-- Unique line_no per invoice
CREATE UNIQUE INDEX sil_org_invoice_line_uniq ON sales_invoice_lines (org_id, sales_invoice_id, line_no);
--> statement-breakpoint
CREATE INDEX sil_org_invoice_idx ON sales_invoice_lines (org_id, sales_invoice_id);
--> statement-breakpoint
CREATE INDEX sil_org_item_idx ON sales_invoice_lines (org_id, item_id);
--> statement-breakpoint
CREATE INDEX sil_org_item_posting_idx ON sales_invoice_lines (org_id, item_id, posting_date DESC);
--> statement-breakpoint
-- Line analytics index (v6.2): top items per company reports
CREATE INDEX sil_org_company_analytics_idx ON sales_invoice_lines (org_id, company_id, posting_date DESC, item_id);
--> statement-breakpoint

CREATE POLICY "sales_invoice_lines_crud_policy" ON sales_invoice_lines
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint

CREATE TRIGGER set_updated_at BEFORE UPDATE ON sales_invoice_lines
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
