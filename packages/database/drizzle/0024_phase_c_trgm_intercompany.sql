-- 0024_phase_c_trgm_intercompany.sql
-- PRD: ERP Database Architecture Audit — Phase C (Production Completeness)
--
-- Contents:
-- 1. pg_trgm extension + trigram GIN indexes on key search columns
-- 2. intercompany_transactions table + indexes + CHECK constraints + RLS
-- 3. bank_statement_lines table + indexes + CHECK constraints + RLS
-- 4. REVOKE UPDATE/DELETE on bank_statement_lines (append-only evidence)

-- ============================================================
-- 1. pg_trgm extension + trigram indexes
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pg_trgm;
--> statement-breakpoint

-- Contacts: name search (most frequent user search)
CREATE INDEX IF NOT EXISTS contacts_name_trgm_idx
  ON contacts USING gin (name gin_trgm_ops);
--> statement-breakpoint

-- Companies: name search
CREATE INDEX IF NOT EXISTS companies_name_trgm_idx
  ON companies USING gin (name gin_trgm_ops);
--> statement-breakpoint

-- Chart of accounts: account name + code search
CREATE INDEX IF NOT EXISTS coa_account_name_trgm_idx
  ON chart_of_accounts USING gin (account_name gin_trgm_ops);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS coa_account_code_trgm_idx
  ON chart_of_accounts USING gin (account_code gin_trgm_ops);
--> statement-breakpoint

-- Currencies: code + name search
CREATE INDEX IF NOT EXISTS currencies_name_trgm_idx
  ON currencies USING gin (name gin_trgm_ops);
--> statement-breakpoint

-- Sites: name search
CREATE INDEX IF NOT EXISTS sites_name_trgm_idx
  ON sites USING gin (name gin_trgm_ops);
--> statement-breakpoint

-- Tax rates: tax code search
CREATE INDEX IF NOT EXISTS tax_rates_code_trgm_idx
  ON tax_rates USING gin (tax_code gin_trgm_ops);
--> statement-breakpoint

-- Journal entries: entry_no search
CREATE INDEX IF NOT EXISTS journal_entries_entry_no_trgm_idx
  ON journal_entries USING gin (entry_no gin_trgm_ops);
--> statement-breakpoint

-- Credit notes: credit_note_no search
CREATE INDEX IF NOT EXISTS credit_notes_no_trgm_idx
  ON credit_notes USING gin (credit_note_no gin_trgm_ops);
--> statement-breakpoint

-- NOTE: bank_statement_lines trigram index is created after the table (section 3)

-- ============================================================
-- 2. intercompany_transactions
-- ============================================================
CREATE TABLE IF NOT EXISTS intercompany_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  source_company_id UUID NOT NULL,
  target_company_id UUID NOT NULL,
  source_journal_entry_id UUID,
  target_journal_entry_id UUID,
  transaction_type TEXT NOT NULL,
  description TEXT,
  amount_minor BIGINT NOT NULL,
  currency_code TEXT NOT NULL DEFAULT 'MYR',
  fx_rate TEXT,
  base_amount_minor BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT ic_txn_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT ic_txn_different_companies CHECK (source_company_id <> target_company_id),
  CONSTRAINT ic_txn_amount_positive CHECK (amount_minor > 0),
  CONSTRAINT ic_txn_type_valid CHECK (transaction_type IN ('invoice', 'payment', 'transfer', 'allocation', 'elimination')),
  CONSTRAINT ic_txn_status_valid CHECK (status IN ('pending', 'matched', 'eliminated', 'cancelled'))
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS ic_txn_org_id_idx
  ON intercompany_transactions (org_id, id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS ic_txn_source_company_idx
  ON intercompany_transactions (org_id, source_company_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS ic_txn_target_company_idx
  ON intercompany_transactions (org_id, target_company_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS ic_txn_source_je_idx
  ON intercompany_transactions (org_id, source_journal_entry_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS ic_txn_target_je_idx
  ON intercompany_transactions (org_id, target_journal_entry_id);
--> statement-breakpoint

ALTER TABLE intercompany_transactions ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE intercompany_transactions FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY ic_txn_tenant_read ON intercompany_transactions
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY ic_txn_tenant_write ON intercompany_transactions
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE TRIGGER set_updated_at_ic_txn
  BEFORE UPDATE ON intercompany_transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 3. bank_statement_lines (append-only evidence)
-- ============================================================
CREATE TABLE IF NOT EXISTS bank_statement_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id UUID NOT NULL,
  bank_account_id UUID NOT NULL,
  statement_date DATE NOT NULL,
  value_date DATE,
  description TEXT NOT NULL,
  reference TEXT,
  amount_minor BIGINT NOT NULL,
  currency_code TEXT NOT NULL DEFAULT 'MYR',
  balance_minor BIGINT,
  transaction_type TEXT,
  import_batch_id UUID,
  is_reconciled BOOLEAN NOT NULL DEFAULT false,
  matched_payment_id UUID,
  matched_journal_entry_id UUID,
  match_confidence TEXT,
  matched_by TEXT,
  matched_at TEXT,
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT bsl_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT bsl_match_confidence_valid CHECK (match_confidence IS NULL OR match_confidence IN ('exact', 'high', 'medium', 'low', 'manual'))
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS bsl_org_id_idx
  ON bank_statement_lines (org_id, id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS bsl_company_idx
  ON bank_statement_lines (org_id, company_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS bsl_bank_account_idx
  ON bank_statement_lines (org_id, bank_account_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS bsl_statement_date_idx
  ON bank_statement_lines (org_id, bank_account_id, statement_date);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS bsl_import_batch_idx
  ON bank_statement_lines (org_id, import_batch_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS bsl_unreconciled_idx
  ON bank_statement_lines (org_id, company_id, is_reconciled);
--> statement-breakpoint

ALTER TABLE bank_statement_lines ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE bank_statement_lines FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY bsl_tenant_read ON bank_statement_lines
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY bsl_tenant_write ON bank_statement_lines
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

-- ============================================================
-- 4. bank_statement_lines: append-only (evidence integrity)
-- ============================================================
-- Statement lines are imported evidence — never modified after import.
-- Reconciliation status is tracked via matching fields, not line edits.
-- Note: We allow UPDATE for reconciliation matching (is_reconciled, matched_*)
-- but REVOKE DELETE to prevent evidence destruction.
REVOKE DELETE ON bank_statement_lines FROM authenticated;
--> statement-breakpoint

-- Trigram index on bank_statement_lines (deferred from section 1 — table must exist first)
CREATE INDEX IF NOT EXISTS bsl_description_trgm_idx
  ON bank_statement_lines USING gin (description gin_trgm_ops);
