-- 0022_phase_b_finance_core.sql
-- PRD: ERP Database Architecture Audit — Phase B (Make Finance "Truth-Safe")
--
-- Contents:
-- 1. fiscal_periods table + indexes + CHECK constraints + RLS
-- 2. chart_of_accounts table + indexes + CHECK constraints + RLS
-- 3. journal_entries table (docEntity) + indexes + CHECK constraints + RLS
-- 4. journal_lines table + indexes + CHECK constraints + RLS
-- 5. DB trigger: enforce_journal_balance — SUM(debit) = SUM(credit) on post
-- 6. DB trigger: reject_closed_period_posting — block journal lines into closed periods
-- 7. DB trigger: reject_posted_mutation on journal_entries
-- 8. REVOKE UPDATE/DELETE on journal_lines (append-only)
-- 9. Update seed_org_defaults() with default COA + fiscal periods

-- ============================================================
-- 1. fiscal_periods
-- ============================================================
CREATE TABLE IF NOT EXISTS fiscal_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id UUID NOT NULL,
  period_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT fiscal_periods_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT fiscal_periods_status_valid CHECK (status IN ('open', 'closing', 'closed')),
  CONSTRAINT fiscal_periods_date_order CHECK (start_date <= end_date)
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS fiscal_periods_org_id_idx
  ON fiscal_periods (org_id, id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS fiscal_periods_org_company_idx
  ON fiscal_periods (org_id, company_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS fiscal_periods_lookup_idx
  ON fiscal_periods (org_id, company_id, start_date, end_date);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS fiscal_periods_org_company_start_uniq
  ON fiscal_periods (org_id, company_id, start_date);
--> statement-breakpoint

ALTER TABLE fiscal_periods ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE fiscal_periods FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY fiscal_periods_tenant_read ON fiscal_periods
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY fiscal_periods_tenant_write ON fiscal_periods
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

-- set_updated_at trigger (reuses existing function)
CREATE TRIGGER set_updated_at_fiscal_periods
  BEFORE UPDATE ON fiscal_periods
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 2. chart_of_accounts
-- ============================================================
CREATE TABLE IF NOT EXISTS chart_of_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id UUID NOT NULL,
  account_code TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  parent_id UUID,
  is_group BOOLEAN NOT NULL DEFAULT false,
  level INTEGER NOT NULL DEFAULT 0,
  currency_code TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT coa_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT coa_account_type_valid CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense'))
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS coa_org_id_idx
  ON chart_of_accounts (org_id, id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS coa_org_company_idx
  ON chart_of_accounts (org_id, company_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS coa_org_company_type_idx
  ON chart_of_accounts (org_id, company_id, account_type);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS coa_org_company_code_uniq
  ON chart_of_accounts (org_id, company_id, account_code);
--> statement-breakpoint

ALTER TABLE chart_of_accounts ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE chart_of_accounts FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY coa_tenant_read ON chart_of_accounts
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY coa_tenant_write ON chart_of_accounts
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE TRIGGER set_updated_at_coa
  BEFORE UPDATE ON chart_of_accounts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 3. journal_entries (docEntity lifecycle)
-- ============================================================
CREATE TABLE IF NOT EXISTS journal_entries (
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
  entry_no TEXT,
  entry_type TEXT NOT NULL DEFAULT 'manual',
  description TEXT,
  posted_at TIMESTAMPTZ,
  currency_code TEXT NOT NULL DEFAULT 'MYR',
  fx_rate TEXT,
  source_type TEXT,
  source_id UUID,
  reversal_of_id UUID,
  memo TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT journal_entries_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT journal_entries_entry_type_valid CHECK (entry_type IN ('manual', 'auto'))
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS journal_entries_org_id_idx
  ON journal_entries (org_id, id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS journal_entries_org_company_idx
  ON journal_entries (org_id, company_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS journal_entries_org_posted_idx
  ON journal_entries (org_id, posted_at);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS journal_entries_source_idx
  ON journal_entries (org_id, source_type, source_id);
--> statement-breakpoint

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE journal_entries FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY journal_entries_tenant_read ON journal_entries
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY journal_entries_tenant_write ON journal_entries
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE TRIGGER set_updated_at_journal_entries
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 4. journal_lines
-- ============================================================
CREATE TABLE IF NOT EXISTS journal_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  journal_entry_id UUID NOT NULL,
  company_id UUID NOT NULL,
  account_id UUID NOT NULL,
  description TEXT,
  debit_amount BIGINT NOT NULL DEFAULT 0,
  credit_amount BIGINT NOT NULL DEFAULT 0,
  currency_code TEXT NOT NULL DEFAULT 'MYR',
  fx_rate TEXT,
  base_debit_amount BIGINT NOT NULL DEFAULT 0,
  base_credit_amount BIGINT NOT NULL DEFAULT 0,
  cost_center_id UUID,
  project_id UUID,
  contact_id UUID,
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT journal_lines_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT journal_lines_amount_valid CHECK (debit_amount >= 0 AND credit_amount >= 0),
  CONSTRAINT journal_lines_one_side CHECK (
    (debit_amount > 0 AND credit_amount = 0) OR
    (credit_amount > 0 AND debit_amount = 0) OR
    (debit_amount = 0 AND credit_amount = 0)
  )
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS journal_lines_org_id_idx
  ON journal_lines (org_id, id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS journal_lines_entry_idx
  ON journal_lines (org_id, journal_entry_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS journal_lines_account_idx
  ON journal_lines (org_id, account_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS journal_lines_company_idx
  ON journal_lines (org_id, company_id);
--> statement-breakpoint

ALTER TABLE journal_lines ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE journal_lines FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY journal_lines_tenant_read ON journal_lines
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY journal_lines_tenant_write ON journal_lines
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

-- ============================================================
-- 5. DB trigger: enforce_journal_balance
-- ============================================================
-- Fires when journal_entries.doc_status transitions to 'submitted' or 'active'.
-- Ensures SUM(debit_amount) = SUM(credit_amount) across all lines.
-- PRD: "double-entry balance needs DB-level enforcement"
CREATE OR REPLACE FUNCTION public.enforce_journal_balance()
RETURNS trigger AS $$
DECLARE
  total_debit BIGINT;
  total_credit BIGINT;
BEGIN
  -- Only enforce on posting transitions
  IF NEW.doc_status NOT IN ('submitted', 'active') THEN
    RETURN NEW;
  END IF;
  IF OLD.doc_status = NEW.doc_status THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(SUM(debit_amount), 0), COALESCE(SUM(credit_amount), 0)
  INTO total_debit, total_credit
  FROM journal_lines
  WHERE journal_entry_id = NEW.id
    AND org_id = NEW.org_id
    AND is_deleted = false;

  IF total_debit <> total_credit THEN
    RAISE EXCEPTION 'Journal entry % is unbalanced: debits=% credits=%',
      NEW.id, total_debit, total_credit;
  END IF;

  IF total_debit = 0 THEN
    RAISE EXCEPTION 'Journal entry % has no lines (total = 0)', NEW.id;
  END IF;

  -- Set posted_at on posting
  NEW.posted_at := COALESCE(NEW.posted_at, now());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

CREATE TRIGGER trg_enforce_journal_balance
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW
  WHEN (NEW.doc_status IN ('submitted', 'active') AND OLD.doc_status IS DISTINCT FROM NEW.doc_status)
  EXECUTE FUNCTION public.enforce_journal_balance();
--> statement-breakpoint

COMMENT ON FUNCTION public.enforce_journal_balance() IS
  'DB-level double-entry invariant: SUM(debit) must equal SUM(credit) before a journal entry can be posted.';
--> statement-breakpoint

-- ============================================================
-- 6. DB trigger: reject_closed_period_posting
-- ============================================================
-- Fires on journal_entries when doc_status transitions to submitted/active.
-- Checks that posted_at falls within an open fiscal period.
CREATE OR REPLACE FUNCTION public.reject_closed_period_posting()
RETURNS trigger AS $$
DECLARE
  period_status TEXT;
  period_name TEXT;
  posting_date DATE;
BEGIN
  -- Only enforce on posting transitions
  IF NEW.doc_status NOT IN ('submitted', 'active') THEN
    RETURN NEW;
  END IF;
  IF OLD.doc_status = NEW.doc_status THEN
    RETURN NEW;
  END IF;

  -- Require company_id for period checking
  IF NEW.company_id IS NULL THEN
    RETURN NEW; -- No company = no period enforcement (e.g., org-level entries)
  END IF;

  posting_date := COALESCE(NEW.posted_at, now())::date;

  SELECT fp.status, fp.period_name
  INTO period_status, period_name
  FROM fiscal_periods fp
  WHERE fp.org_id = NEW.org_id
    AND fp.company_id = NEW.company_id
    AND fp.start_date <= posting_date
    AND fp.end_date >= posting_date
    AND fp.is_deleted = false
  LIMIT 1;

  IF period_status IS NULL THEN
    RAISE EXCEPTION 'No fiscal period found for posting date % in company %',
      posting_date, NEW.company_id;
  END IF;

  IF period_status = 'closed' THEN
    RAISE EXCEPTION 'Cannot post to closed fiscal period "%" (date: %)',
      period_name, posting_date;
  END IF;

  IF period_status = 'closing' THEN
    RAISE EXCEPTION 'Fiscal period "%" is in closing state — only authorized adjustments allowed (date: %)',
      period_name, posting_date;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

CREATE TRIGGER trg_reject_closed_period_posting
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW
  WHEN (NEW.doc_status IN ('submitted', 'active') AND OLD.doc_status IS DISTINCT FROM NEW.doc_status)
  EXECUTE FUNCTION public.reject_closed_period_posting();
--> statement-breakpoint

COMMENT ON FUNCTION public.reject_closed_period_posting() IS
  'DB-level period close guard: prevents posting journal entries into closed or closing fiscal periods.';
--> statement-breakpoint

-- ============================================================
-- 7. Posted-record immutability trigger on journal_entries
-- ============================================================
-- Uses reject_posted_mutation() from migration 0021.
-- Prevents UPDATE on journal_entries once doc_status is submitted/active.
CREATE TRIGGER trg_reject_posted_journal_entry
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW
  WHEN (OLD.doc_status IN ('submitted', 'active') AND NEW.doc_status = OLD.doc_status)
  EXECUTE FUNCTION public.reject_posted_mutation();
--> statement-breakpoint

-- ============================================================
-- 8. journal_lines: append-only once parent is posted
-- ============================================================
-- Prevent UPDATE/DELETE on journal_lines from authenticated role.
-- Lines are immutable once written; corrections go through journal reversal.
REVOKE UPDATE, DELETE ON journal_lines FROM authenticated;
--> statement-breakpoint

-- ============================================================
-- 9. Update seed_org_defaults() — add default COA + fiscal periods
-- ============================================================
-- We add a helper to seed a standard chart of accounts for new companies.
-- This is called separately per company, not per org.
CREATE OR REPLACE FUNCTION public.seed_company_finance_defaults(
  p_org_id text,
  p_company_id uuid
)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  -- ── Fiscal Periods (current year, 12 months) ──────────
  INSERT INTO fiscal_periods (org_id, company_id, period_name, start_date, end_date, status)
  SELECT
    p_org_id,
    p_company_id,
    'FY' || EXTRACT(YEAR FROM CURRENT_DATE)::text || '-' || LPAD(m::text, 2, '0'),
    make_date(EXTRACT(YEAR FROM CURRENT_DATE)::int, m, 1),
    (make_date(EXTRACT(YEAR FROM CURRENT_DATE)::int, m, 1) + interval '1 month' - interval '1 day')::date,
    'open'
  FROM generate_series(1, 12) AS m
  ON CONFLICT DO NOTHING;

  -- ── Default Chart of Accounts ─────────────────────────
  INSERT INTO chart_of_accounts (org_id, company_id, account_code, account_name, account_type, is_group, level)
  VALUES
    -- Assets
    (p_org_id, p_company_id, '1000', 'Assets', 'asset', true, 0),
    (p_org_id, p_company_id, '1100', 'Cash and Bank', 'asset', true, 1),
    (p_org_id, p_company_id, '1110', 'Cash on Hand', 'asset', false, 2),
    (p_org_id, p_company_id, '1120', 'Bank Account', 'asset', false, 2),
    (p_org_id, p_company_id, '1200', 'Accounts Receivable', 'asset', false, 1),
    (p_org_id, p_company_id, '1300', 'Inventory', 'asset', false, 1),
    (p_org_id, p_company_id, '1400', 'Prepaid Expenses', 'asset', false, 1),
    (p_org_id, p_company_id, '1500', 'Fixed Assets', 'asset', true, 1),
    (p_org_id, p_company_id, '1510', 'Equipment', 'asset', false, 2),
    (p_org_id, p_company_id, '1520', 'Accumulated Depreciation', 'asset', false, 2),
    -- Liabilities
    (p_org_id, p_company_id, '2000', 'Liabilities', 'liability', true, 0),
    (p_org_id, p_company_id, '2100', 'Accounts Payable', 'liability', false, 1),
    (p_org_id, p_company_id, '2200', 'Accrued Expenses', 'liability', false, 1),
    (p_org_id, p_company_id, '2300', 'Tax Payable', 'liability', false, 1),
    (p_org_id, p_company_id, '2400', 'Short-term Loans', 'liability', false, 1),
    -- Equity
    (p_org_id, p_company_id, '3000', 'Equity', 'equity', true, 0),
    (p_org_id, p_company_id, '3100', 'Share Capital', 'equity', false, 1),
    (p_org_id, p_company_id, '3200', 'Retained Earnings', 'equity', false, 1),
    -- Revenue
    (p_org_id, p_company_id, '4000', 'Revenue', 'revenue', true, 0),
    (p_org_id, p_company_id, '4100', 'Sales Revenue', 'revenue', false, 1),
    (p_org_id, p_company_id, '4200', 'Service Revenue', 'revenue', false, 1),
    (p_org_id, p_company_id, '4300', 'Other Income', 'revenue', false, 1),
    -- Expenses
    (p_org_id, p_company_id, '5000', 'Expenses', 'expense', true, 0),
    (p_org_id, p_company_id, '5100', 'Cost of Goods Sold', 'expense', false, 1),
    (p_org_id, p_company_id, '5200', 'Salaries & Wages', 'expense', false, 1),
    (p_org_id, p_company_id, '5300', 'Rent Expense', 'expense', false, 1),
    (p_org_id, p_company_id, '5400', 'Utilities', 'expense', false, 1),
    (p_org_id, p_company_id, '5500', 'Depreciation Expense', 'expense', false, 1),
    (p_org_id, p_company_id, '5600', 'Office Supplies', 'expense', false, 1),
    (p_org_id, p_company_id, '5700', 'Professional Fees', 'expense', false, 1),
    (p_org_id, p_company_id, '5800', 'Insurance', 'expense', false, 1),
    (p_org_id, p_company_id, '5900', 'Other Expenses', 'expense', false, 1),
    (p_org_id, p_company_id, '5950', 'FX Gain/Loss', 'expense', false, 1),
    (p_org_id, p_company_id, '5990', 'Bank Charges', 'expense', false, 1)
  ON CONFLICT DO NOTHING;

  -- ── Number sequences for journal entries ──────────────
  INSERT INTO number_sequences (org_id, company_id, entity_type, prefix, suffix, next_value, pad_length)
  VALUES
    (p_org_id, p_company_id, 'journal_entries', 'JE-', '', 1, 5)
  ON CONFLICT DO NOTHING;

END;
$$;
--> statement-breakpoint

COMMENT ON FUNCTION public.seed_company_finance_defaults(text, uuid) IS
  'Seeds default fiscal periods (12 months for current year) and chart of accounts for a new company. Call after company creation.';
