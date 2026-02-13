-- 0037_quotations.sql
-- Transactional Spine Migration 0037: Quotations
--
-- Contents:
-- 1. quotations (pre-sales document — NO posting columns)
-- 2. quotation_lines (line items with net CHECK, no posting_date)

-- ============================================================
-- 1. quotations
-- ============================================================
CREATE TABLE quotations (
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
  company_id        UUID,
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
  -- NO posting_status, NO posting_date (quotations are never posted)
  doc_no            TEXT,
  party_type        TEXT NOT NULL DEFAULT 'customer',
  party_id          UUID NOT NULL,
  currency_code     TEXT NOT NULL DEFAULT 'MYR',
  exchange_rate     NUMERIC(12,6) DEFAULT 1,
  valid_until       DATE,
  total_minor       BIGINT NOT NULL DEFAULT 0,
  discount_minor    BIGINT NOT NULL DEFAULT 0,
  tax_minor         BIGINT NOT NULL DEFAULT 0,
  grand_total_minor BIGINT NOT NULL DEFAULT 0,
  billing_address_id  UUID,
  shipping_address_id UUID,
  payment_terms     TEXT,
  memo              TEXT,

  CONSTRAINT qtn_org_not_empty            CHECK (org_id <> ''),
  CONSTRAINT qtn_total_non_negative       CHECK (total_minor >= 0),
  CONSTRAINT qtn_tax_non_negative         CHECK (tax_minor >= 0),
  CONSTRAINT qtn_grand_total_non_negative CHECK (grand_total_minor >= 0),
  CONSTRAINT qtn_party_type_valid         CHECK (party_type IN ('customer', 'supplier'))
);
--> statement-breakpoint
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE UNIQUE INDEX qtn_org_doc_no_uniq ON quotations (org_id, doc_no);
--> statement-breakpoint
CREATE INDEX qtn_org_party_created_idx ON quotations (org_id, party_id, created_at DESC);
--> statement-breakpoint
CREATE INDEX qtn_org_doc_status_idx ON quotations (org_id, doc_status, updated_at DESC);
--> statement-breakpoint
CREATE POLICY "quotations_crud_policy" ON quotations
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint
CREATE TRIGGER set_updated_at BEFORE UPDATE ON quotations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 2. quotation_lines
-- ============================================================
CREATE TABLE quotation_lines (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          TEXT NOT NULL DEFAULT (auth.require_org_id()),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by      TEXT NOT NULL DEFAULT (auth.user_id()),
  version         INTEGER NOT NULL DEFAULT 1,
  is_deleted      BOOLEAN NOT NULL DEFAULT false,
  deleted_at      TIMESTAMPTZ,
  deleted_by      TEXT,
  quotation_id    UUID NOT NULL,
  line_no         INTEGER NOT NULL,
  item_id         UUID,
  item_code       TEXT,
  item_name       TEXT,
  description     TEXT,
  qty             NUMERIC(20,6) NOT NULL DEFAULT 1,
  uom_id          UUID,
  rate_minor      BIGINT NOT NULL DEFAULT 0,
  amount_minor    BIGINT NOT NULL DEFAULT 0,
  discount_minor  BIGINT NOT NULL DEFAULT 0,
  tax_minor       BIGINT NOT NULL DEFAULT 0,
  net_minor       BIGINT NOT NULL DEFAULT 0,
  tax_rate_id     UUID,
  memo            TEXT,

  CONSTRAINT qtnl_org_not_empty        CHECK (org_id <> ''),
  CONSTRAINT qtnl_net_check            CHECK (net_minor = amount_minor - discount_minor + tax_minor),
  CONSTRAINT qtnl_amount_non_negative  CHECK (amount_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE quotation_lines ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE UNIQUE INDEX qtnl_org_quotation_line_uniq ON quotation_lines (org_id, quotation_id, line_no);
--> statement-breakpoint
CREATE INDEX qtnl_org_quotation_idx ON quotation_lines (org_id, quotation_id);
--> statement-breakpoint
CREATE INDEX qtnl_org_item_idx ON quotation_lines (org_id, item_id);
--> statement-breakpoint
CREATE POLICY "quotation_lines_crud_policy" ON quotation_lines
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint
CREATE TRIGGER set_updated_at BEFORE UPDATE ON quotation_lines
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
