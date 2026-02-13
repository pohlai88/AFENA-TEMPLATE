-- 0034_payments.sql
-- Transactional Spine Migration 0034: Payments
--
-- Contents:
-- 1. payments (receive/pay/internal — proves allocation + aging)
--
-- Key v6.3 invariants enforced:
-- - posting_status 6-state CHECK (P-08)
-- - company_id IS NOT NULL (§3.12)
-- - amount_minor > 0
-- - Allocation lock strategy (§3.13) enforced in allocatePayment() service

-- ============================================================
-- 1. payments
-- ============================================================
CREATE TABLE payments (
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
  -- payment-specific
  doc_no            TEXT,
  payment_type      TEXT NOT NULL,
  party_type        TEXT NOT NULL,
  party_id          UUID NOT NULL,
  currency_code     TEXT NOT NULL DEFAULT 'MYR',
  amount_minor      BIGINT NOT NULL,
  bank_account_id   UUID,
  reference_no      TEXT,
  reference_date    DATE,
  memo              TEXT,

  -- Constraints
  CONSTRAINT pay_org_not_empty          CHECK (org_id <> ''),
  CONSTRAINT pay_company_required       CHECK (company_id IS NOT NULL),
  CONSTRAINT pay_amount_positive        CHECK (amount_minor > 0),
  CONSTRAINT pay_payment_type_valid     CHECK (payment_type IN ('receive', 'pay', 'internal')),
  CONSTRAINT pay_party_type_valid       CHECK (party_type IN ('customer', 'supplier')),
  CONSTRAINT pay_posting_status_valid   CHECK (posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed'))
);
--> statement-breakpoint
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE UNIQUE INDEX pay_org_doc_no_uniq ON payments (org_id, doc_no);
--> statement-breakpoint
CREATE INDEX pay_org_party_posting_idx ON payments (org_id, party_type, party_id, posting_date DESC);
--> statement-breakpoint
CREATE INDEX pay_org_posting_date_idx ON payments (org_id, posting_date DESC);
--> statement-breakpoint
CREATE INDEX pay_org_posting_status_idx ON payments (org_id, posting_status, posting_date DESC);
--> statement-breakpoint

CREATE POLICY "payments_crud_policy" ON payments
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint

CREATE TRIGGER set_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint

CREATE TRIGGER reject_posted_mutation BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION reject_posted_mutation();
