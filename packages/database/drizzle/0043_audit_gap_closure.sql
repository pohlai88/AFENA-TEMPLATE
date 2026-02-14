-- Migration 0043: Audit Gap Closure
-- Addresses P0 and P1 omissions identified in database architecture audit.
--
-- P0-1: Rebuild r2_files (org_id, tenantPolicy, soft-delete, scan_status, folder_path)
-- P0-2: Enhance entity_attachments (denormalized metadata, category, sort_order)
-- P0-3: Create bank_accounts
-- P0-4: Create debit_notes
-- P1-5: Create customer_profiles + supplier_profiles
-- P1-6: Create payment_terms
-- P1-7: Create bank_reconciliation_sessions
-- P1-8: Fix matched_at text → timestamptz in bank_statement_lines
-- P1-9: Fix failure_count/attempt_number text → integer in webhook tables
-- P1-10: Create contracts
-- P1-11: Create purchase_requests
-- P1-12: Create stock_balances
-- P1-13: Rename product_id → item_id in stock_movements + lot_tracking

-- ════════════════════════════════════════════════════════════
-- P0-1: Rebuild r2_files
-- ════════════════════════════════════════════════════════════

-- Drop old RLS policies (user-scoped crudPolicy)
DROP POLICY IF EXISTS "crud_r2_files_policy_select" ON "r2_files";
DROP POLICY IF EXISTS "crud_r2_files_policy_insert" ON "r2_files";
DROP POLICY IF EXISTS "crud_r2_files_policy_update" ON "r2_files";
DROP POLICY IF EXISTS "crud_r2_files_policy_delete" ON "r2_files";

-- Add new columns
ALTER TABLE "r2_files" ADD COLUMN IF NOT EXISTS "org_id" text NOT NULL DEFAULT (auth.require_org_id());
ALTER TABLE "r2_files" ADD COLUMN IF NOT EXISTS "company_id" uuid;
ALTER TABLE "r2_files" ADD COLUMN IF NOT EXISTS "uploaded_by" text NOT NULL DEFAULT (auth.user_id());
ALTER TABLE "r2_files" ADD COLUMN IF NOT EXISTS "folder_path" text NOT NULL DEFAULT '/';
ALTER TABLE "r2_files" ADD COLUMN IF NOT EXISTS "scan_status" text NOT NULL DEFAULT 'pending';
ALTER TABLE "r2_files" ADD COLUMN IF NOT EXISTS "scan_message" text;
ALTER TABLE "r2_files" ADD COLUMN IF NOT EXISTS "scanned_at" timestamptz;
ALTER TABLE "r2_files" ADD COLUMN IF NOT EXISTS "replaced_by_id" uuid;
ALTER TABLE "r2_files" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "r2_files" ADD COLUMN IF NOT EXISTS "updated_at" timestamptz NOT NULL DEFAULT now();
ALTER TABLE "r2_files" ADD COLUMN IF NOT EXISTS "created_by" text NOT NULL DEFAULT (auth.user_id());
ALTER TABLE "r2_files" ADD COLUMN IF NOT EXISTS "updated_by" text NOT NULL DEFAULT (auth.user_id());
ALTER TABLE "r2_files" ADD COLUMN IF NOT EXISTS "version" integer NOT NULL DEFAULT 1;
ALTER TABLE "r2_files" ADD COLUMN IF NOT EXISTS "is_deleted" boolean NOT NULL DEFAULT false;
ALTER TABLE "r2_files" ADD COLUMN IF NOT EXISTS "deleted_at" timestamptz;
ALTER TABLE "r2_files" ADD COLUMN IF NOT EXISTS "deleted_by" text;

-- Backfill uploaded_by from user_id for existing rows
UPDATE "r2_files" SET "uploaded_by" = "user_id" WHERE "uploaded_by" = (auth.user_id()) AND "user_id" IS NOT NULL;

-- Drop old user_id column (no longer needed — uploaded_by replaces it)
-- NOTE: Keep user_id for now if rollback is needed. Drop in a future migration.
-- ALTER TABLE "r2_files" DROP COLUMN IF EXISTS "user_id";

-- Drop old index
DROP INDEX IF EXISTS "r2_files_user_id_idx";

-- New indexes
CREATE INDEX IF NOT EXISTS "r2_files_org_id_idx" ON "r2_files" ("org_id", "id");
CREATE INDEX IF NOT EXISTS "r2_files_org_company_idx" ON "r2_files" ("org_id", "company_id");
CREATE INDEX IF NOT EXISTS "r2_files_org_folder_idx" ON "r2_files" ("org_id", "folder_path");
CREATE INDEX IF NOT EXISTS "r2_files_uploaded_by_idx" ON "r2_files" ("org_id", "uploaded_by");

-- CHECK constraints
ALTER TABLE "r2_files" ADD CONSTRAINT "r2_files_org_not_empty" CHECK (org_id <> '');
ALTER TABLE "r2_files" ADD CONSTRAINT "r2_files_scan_status_valid" CHECK (scan_status IN ('pending', 'clean', 'infected', 'error', 'skipped'));

-- New tenant RLS policy
CREATE POLICY "crud_r2_files_policy_select" ON "r2_files" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_r2_files_policy_insert" ON "r2_files" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_r2_files_policy_update" ON "r2_files" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "org_id")) WITH CHECK ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_r2_files_policy_delete" ON "r2_files" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "org_id"));

-- set_updated_at trigger
CREATE TRIGGER "trg_r2_files_set_updated_at" BEFORE UPDATE ON "r2_files"
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ════════════════════════════════════════════════════════════
-- P0-2: Enhance entity_attachments
-- ════════════════════════════════════════════════════════════

ALTER TABLE "entity_attachments" ADD COLUMN IF NOT EXISTS "category" text NOT NULL DEFAULT 'general';
ALTER TABLE "entity_attachments" ADD COLUMN IF NOT EXISTS "file_name" text;
ALTER TABLE "entity_attachments" ADD COLUMN IF NOT EXISTS "content_type" text;
ALTER TABLE "entity_attachments" ADD COLUMN IF NOT EXISTS "size_bytes" bigint;
ALTER TABLE "entity_attachments" ADD COLUMN IF NOT EXISTS "is_primary" boolean NOT NULL DEFAULT false;
ALTER TABLE "entity_attachments" ADD COLUMN IF NOT EXISTS "sort_order" integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS "entity_attach_org_category_idx" ON "entity_attachments" ("org_id", "entity_type", "category");

ALTER TABLE "entity_attachments" ADD CONSTRAINT "entity_attach_category_valid"
  CHECK (category IN ('general', 'receipt', 'contract', 'photo', 'signature', 'report', 'correspondence', 'legal', 'other'));

-- ════════════════════════════════════════════════════════════
-- P0-3: Create bank_accounts
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "bank_accounts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id" text NOT NULL DEFAULT (auth.require_org_id()),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "created_by" text NOT NULL DEFAULT (auth.user_id()),
  "updated_by" text NOT NULL DEFAULT (auth.user_id()),
  "version" integer NOT NULL DEFAULT 1,
  "is_deleted" boolean NOT NULL DEFAULT false,
  "deleted_at" timestamptz,
  "deleted_by" text,
  "company_id" uuid NOT NULL,
  "bank_name" text NOT NULL,
  "account_name" text NOT NULL,
  "account_number" text NOT NULL,
  "account_type" text NOT NULL DEFAULT 'current',
  "currency_code" text NOT NULL DEFAULT 'MYR',
  "swift_code" text,
  "iban" text,
  "branch_code" text,
  "branch_name" text,
  "gl_account_id" uuid,
  "opening_balance_minor" bigint NOT NULL DEFAULT 0,
  "current_balance_minor" bigint NOT NULL DEFAULT 0,
  "is_default" boolean NOT NULL DEFAULT false,
  "is_active" boolean NOT NULL DEFAULT true,
  "description" text,
  CONSTRAINT "bank_acct_org_not_empty" CHECK (org_id <> ''),
  CONSTRAINT "bank_acct_type_valid" CHECK (account_type IN ('current', 'savings', 'fixed_deposit', 'overdraft', 'credit_line', 'petty_cash'))
);

ALTER TABLE "bank_accounts" ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS "bank_acct_org_id_idx" ON "bank_accounts" ("org_id", "id");
CREATE INDEX IF NOT EXISTS "bank_acct_org_company_idx" ON "bank_accounts" ("org_id", "company_id");
CREATE UNIQUE INDEX IF NOT EXISTS "bank_acct_org_company_number_uniq" ON "bank_accounts" ("org_id", "company_id", "account_number");

CREATE POLICY "crud_bank_accounts_policy_select" ON "bank_accounts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_bank_accounts_policy_insert" ON "bank_accounts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_bank_accounts_policy_update" ON "bank_accounts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "org_id")) WITH CHECK ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_bank_accounts_policy_delete" ON "bank_accounts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "org_id"));

CREATE TRIGGER "trg_bank_accounts_set_updated_at" BEFORE UPDATE ON "bank_accounts"
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ════════════════════════════════════════════════════════════
-- P0-4: Create debit_notes
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "debit_notes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id" text NOT NULL DEFAULT (auth.require_org_id()),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "created_by" text NOT NULL DEFAULT (auth.user_id()),
  "updated_by" text NOT NULL DEFAULT (auth.user_id()),
  "version" integer NOT NULL DEFAULT 1,
  "is_deleted" boolean NOT NULL DEFAULT false,
  "deleted_at" timestamptz,
  "deleted_by" text,
  "company_id" uuid,
  "site_id" uuid,
  "custom_data" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "doc_status" text NOT NULL DEFAULT 'draft',
  "submitted_at" timestamptz,
  "submitted_by" text,
  "cancelled_at" timestamptz,
  "cancelled_by" text,
  "amended_from_id" uuid,
  "external_source" text,
  "external_id" text,
  "debit_note_no" text,
  "reverses_type" text NOT NULL,
  "reverses_id" uuid NOT NULL,
  "reason_code" text NOT NULL,
  "reason_description" text,
  "contact_id" uuid,
  "currency_code" text NOT NULL DEFAULT 'MYR',
  "fx_rate" text,
  "subtotal_minor" bigint NOT NULL DEFAULT 0,
  "tax_minor" bigint NOT NULL DEFAULT 0,
  "total_minor" bigint NOT NULL DEFAULT 0,
  "base_subtotal_minor" bigint NOT NULL DEFAULT 0,
  "base_tax_minor" bigint NOT NULL DEFAULT 0,
  "base_total_minor" bigint NOT NULL DEFAULT 0,
  "posted_at" timestamptz,
  "journal_entry_id" uuid,
  "memo" text,
  "tags" jsonb DEFAULT '[]'::jsonb,
  CONSTRAINT "debit_notes_org_not_empty" CHECK (org_id <> ''),
  CONSTRAINT "debit_notes_reverses_type_valid" CHECK (reverses_type IN ('purchase_invoice', 'credit_note')),
  CONSTRAINT "debit_notes_amounts_non_negative" CHECK (subtotal_minor >= 0 AND tax_minor >= 0 AND total_minor >= 0)
);

ALTER TABLE "debit_notes" ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS "debit_notes_org_id_idx" ON "debit_notes" ("org_id", "id");
CREATE INDEX IF NOT EXISTS "debit_notes_org_company_idx" ON "debit_notes" ("org_id", "company_id");
CREATE INDEX IF NOT EXISTS "debit_notes_reverses_idx" ON "debit_notes" ("org_id", "reverses_type", "reverses_id");
CREATE INDEX IF NOT EXISTS "debit_notes_contact_idx" ON "debit_notes" ("org_id", "contact_id");

CREATE POLICY "crud_debit_notes_policy_select" ON "debit_notes" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_debit_notes_policy_insert" ON "debit_notes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_debit_notes_policy_update" ON "debit_notes" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "org_id")) WITH CHECK ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_debit_notes_policy_delete" ON "debit_notes" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "org_id"));

CREATE TRIGGER "trg_debit_notes_set_updated_at" BEFORE UPDATE ON "debit_notes"
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ════════════════════════════════════════════════════════════
-- P1-5: Create customer_profiles + supplier_profiles
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "customer_profiles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id" text NOT NULL DEFAULT (auth.require_org_id()),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "created_by" text NOT NULL DEFAULT (auth.user_id()),
  "updated_by" text NOT NULL DEFAULT (auth.user_id()),
  "version" integer NOT NULL DEFAULT 1,
  "is_deleted" boolean NOT NULL DEFAULT false,
  "deleted_at" timestamptz,
  "deleted_by" text,
  "contact_id" uuid NOT NULL,
  "company_id" uuid,
  "customer_code" text,
  "credit_limit_minor" bigint,
  "payment_terms_id" uuid,
  "default_price_list_id" uuid,
  "default_currency_code" text NOT NULL DEFAULT 'MYR',
  "default_tax_code" text,
  "receivable_account_id" uuid,
  "sales_person_id" uuid,
  "customer_group" text,
  "territory" text,
  "memo" text,
  CONSTRAINT "cust_prof_org_not_empty" CHECK (org_id <> ''),
  CONSTRAINT "cust_prof_credit_limit_non_negative" CHECK (credit_limit_minor IS NULL OR credit_limit_minor >= 0)
);

ALTER TABLE "customer_profiles" ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS "cust_prof_org_id_idx" ON "customer_profiles" ("org_id", "id");
CREATE INDEX IF NOT EXISTS "cust_prof_org_company_idx" ON "customer_profiles" ("org_id", "company_id");
CREATE UNIQUE INDEX IF NOT EXISTS "cust_prof_org_contact_uniq" ON "customer_profiles" ("org_id", "contact_id");

CREATE POLICY "crud_customer_profiles_policy_select" ON "customer_profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_customer_profiles_policy_insert" ON "customer_profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_customer_profiles_policy_update" ON "customer_profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "org_id")) WITH CHECK ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_customer_profiles_policy_delete" ON "customer_profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "org_id"));

CREATE TRIGGER "trg_customer_profiles_set_updated_at" BEFORE UPDATE ON "customer_profiles"
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS "supplier_profiles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id" text NOT NULL DEFAULT (auth.require_org_id()),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "created_by" text NOT NULL DEFAULT (auth.user_id()),
  "updated_by" text NOT NULL DEFAULT (auth.user_id()),
  "version" integer NOT NULL DEFAULT 1,
  "is_deleted" boolean NOT NULL DEFAULT false,
  "deleted_at" timestamptz,
  "deleted_by" text,
  "contact_id" uuid NOT NULL,
  "company_id" uuid,
  "supplier_code" text,
  "default_currency_code" text NOT NULL DEFAULT 'MYR',
  "default_tax_code" text,
  "payment_terms_id" uuid,
  "default_warehouse_id" uuid,
  "payable_account_id" uuid,
  "lead_time_days" integer,
  "supplier_group" text,
  "supplier_rating" text,
  "memo" text,
  CONSTRAINT "supp_prof_org_not_empty" CHECK (org_id <> ''),
  CONSTRAINT "supp_prof_lead_time_non_negative" CHECK (lead_time_days IS NULL OR lead_time_days >= 0)
);

ALTER TABLE "supplier_profiles" ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS "supp_prof_org_id_idx" ON "supplier_profiles" ("org_id", "id");
CREATE INDEX IF NOT EXISTS "supp_prof_org_company_idx" ON "supplier_profiles" ("org_id", "company_id");
CREATE UNIQUE INDEX IF NOT EXISTS "supp_prof_org_contact_uniq" ON "supplier_profiles" ("org_id", "contact_id");

CREATE POLICY "crud_supplier_profiles_policy_select" ON "supplier_profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_supplier_profiles_policy_insert" ON "supplier_profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_supplier_profiles_policy_update" ON "supplier_profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "org_id")) WITH CHECK ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_supplier_profiles_policy_delete" ON "supplier_profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "org_id"));

CREATE TRIGGER "trg_supplier_profiles_set_updated_at" BEFORE UPDATE ON "supplier_profiles"
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ════════════════════════════════════════════════════════════
-- P1-6: Create payment_terms
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "payment_terms" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id" text NOT NULL DEFAULT (auth.require_org_id()),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "created_by" text NOT NULL DEFAULT (auth.user_id()),
  "updated_by" text NOT NULL DEFAULT (auth.user_id()),
  "version" integer NOT NULL DEFAULT 1,
  "is_deleted" boolean NOT NULL DEFAULT false,
  "deleted_at" timestamptz,
  "deleted_by" text,
  "code" text NOT NULL,
  "name" text NOT NULL,
  "net_days" integer NOT NULL DEFAULT 30,
  "discount_percent" numeric(5,2),
  "discount_days" integer,
  "is_default" boolean NOT NULL DEFAULT false,
  "is_active" boolean NOT NULL DEFAULT true,
  "description" text,
  CONSTRAINT "payment_terms_org_not_empty" CHECK (org_id <> ''),
  CONSTRAINT "payment_terms_net_days_non_negative" CHECK (net_days >= 0),
  CONSTRAINT "payment_terms_discount_days_valid" CHECK (discount_days IS NULL OR (discount_days >= 0 AND discount_days <= net_days)),
  CONSTRAINT "payment_terms_discount_percent_valid" CHECK (discount_percent IS NULL OR (discount_percent >= 0 AND discount_percent <= 100))
);

ALTER TABLE "payment_terms" ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS "payment_terms_org_id_idx" ON "payment_terms" ("org_id", "id");
CREATE UNIQUE INDEX IF NOT EXISTS "payment_terms_org_code_uniq" ON "payment_terms" ("org_id", "code");

CREATE POLICY "crud_payment_terms_policy_select" ON "payment_terms" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_payment_terms_policy_insert" ON "payment_terms" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_payment_terms_policy_update" ON "payment_terms" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "org_id")) WITH CHECK ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_payment_terms_policy_delete" ON "payment_terms" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "org_id"));

CREATE TRIGGER "trg_payment_terms_set_updated_at" BEFORE UPDATE ON "payment_terms"
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ════════════════════════════════════════════════════════════
-- P1-7: Create bank_reconciliation_sessions
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "bank_reconciliation_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id" text NOT NULL DEFAULT (auth.require_org_id()),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "created_by" text NOT NULL DEFAULT (auth.user_id()),
  "updated_by" text NOT NULL DEFAULT (auth.user_id()),
  "version" integer NOT NULL DEFAULT 1,
  "is_deleted" boolean NOT NULL DEFAULT false,
  "deleted_at" timestamptz,
  "deleted_by" text,
  "company_id" uuid NOT NULL,
  "bank_account_id" uuid NOT NULL,
  "statement_date_from" date NOT NULL,
  "statement_date_to" date NOT NULL,
  "closing_balance_minor" bigint,
  "reconciled_balance_minor" bigint,
  "difference_minor" bigint,
  "currency_code" text NOT NULL DEFAULT 'MYR',
  "status" text NOT NULL DEFAULT 'in_progress',
  "prepared_by" text NOT NULL DEFAULT (auth.user_id()),
  "approved_by" text,
  "approved_at" timestamptz,
  "completed_at" timestamptz,
  "memo" text,
  CONSTRAINT "bank_recon_org_not_empty" CHECK (org_id <> ''),
  CONSTRAINT "bank_recon_status_valid" CHECK (status IN ('in_progress', 'completed', 'approved', 'cancelled')),
  CONSTRAINT "bank_recon_date_order" CHECK (statement_date_from <= statement_date_to)
);

ALTER TABLE "bank_reconciliation_sessions" ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS "bank_recon_org_id_idx" ON "bank_reconciliation_sessions" ("org_id", "id");
CREATE INDEX IF NOT EXISTS "bank_recon_org_company_idx" ON "bank_reconciliation_sessions" ("org_id", "company_id");
CREATE INDEX IF NOT EXISTS "bank_recon_org_bank_acct_idx" ON "bank_reconciliation_sessions" ("org_id", "bank_account_id");
CREATE INDEX IF NOT EXISTS "bank_recon_status_idx" ON "bank_reconciliation_sessions" ("org_id", "status");

CREATE POLICY "crud_bank_recon_sessions_policy_select" ON "bank_reconciliation_sessions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_bank_recon_sessions_policy_insert" ON "bank_reconciliation_sessions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_bank_recon_sessions_policy_update" ON "bank_reconciliation_sessions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "org_id")) WITH CHECK ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_bank_recon_sessions_policy_delete" ON "bank_reconciliation_sessions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "org_id"));

CREATE TRIGGER "trg_bank_recon_sessions_set_updated_at" BEFORE UPDATE ON "bank_reconciliation_sessions"
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ════════════════════════════════════════════════════════════
-- P1-8: Fix matched_at text → timestamptz + add reconciliation_session_id
-- ════════════════════════════════════════════════════════════

-- matched_at: text → timestamptz (safe — column is nullable, no data loss)
ALTER TABLE "bank_statement_lines" ALTER COLUMN "matched_at" TYPE timestamptz USING "matched_at"::timestamptz;
ALTER TABLE "bank_statement_lines" ADD COLUMN IF NOT EXISTS "reconciliation_session_id" uuid;

-- ════════════════════════════════════════════════════════════
-- P1-9: Fix webhook text → integer columns
-- ════════════════════════════════════════════════════════════

ALTER TABLE "webhook_endpoints" ALTER COLUMN "failure_count" TYPE integer USING "failure_count"::integer;
ALTER TABLE "webhook_endpoints" ALTER COLUMN "failure_count" SET DEFAULT 0;

ALTER TABLE "webhook_deliveries" ALTER COLUMN "attempt_number" TYPE integer USING "attempt_number"::integer;
ALTER TABLE "webhook_deliveries" ALTER COLUMN "attempt_number" SET DEFAULT 1;

ALTER TABLE "webhook_deliveries" ALTER COLUMN "duration_ms" TYPE integer USING "duration_ms"::integer;

-- ════════════════════════════════════════════════════════════
-- P1-10: Create contracts
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "contracts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id" text NOT NULL DEFAULT (auth.require_org_id()),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "created_by" text NOT NULL DEFAULT (auth.user_id()),
  "updated_by" text NOT NULL DEFAULT (auth.user_id()),
  "version" integer NOT NULL DEFAULT 1,
  "is_deleted" boolean NOT NULL DEFAULT false,
  "deleted_at" timestamptz,
  "deleted_by" text,
  "company_id" uuid,
  "site_id" uuid,
  "custom_data" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "doc_status" text NOT NULL DEFAULT 'draft',
  "submitted_at" timestamptz,
  "submitted_by" text,
  "cancelled_at" timestamptz,
  "cancelled_by" text,
  "amended_from_id" uuid,
  "external_source" text,
  "external_id" text,
  "contract_no" text,
  "contact_id" uuid NOT NULL,
  "contract_type" text NOT NULL DEFAULT 'service',
  "start_date" date NOT NULL,
  "end_date" date,
  "renewal_date" date,
  "billing_frequency" text NOT NULL DEFAULT 'monthly',
  "currency_code" text NOT NULL DEFAULT 'MYR',
  "total_value_minor" bigint,
  "billed_to_date_minor" bigint NOT NULL DEFAULT 0,
  "price_list_id" uuid,
  "payment_terms_id" uuid,
  "auto_renew" boolean NOT NULL DEFAULT false,
  "renewal_term_months" text,
  "termination_notice_days" text,
  "memo" text,
  CONSTRAINT "contracts_org_not_empty" CHECK (org_id <> ''),
  CONSTRAINT "contracts_type_valid" CHECK (contract_type IN ('service', 'subscription', 'maintenance', 'lease', 'consulting', 'other')),
  CONSTRAINT "contracts_frequency_valid" CHECK (billing_frequency IN ('one_time', 'weekly', 'monthly', 'quarterly', 'semi_annual', 'annual')),
  CONSTRAINT "contracts_date_order" CHECK (end_date IS NULL OR start_date <= end_date)
);

ALTER TABLE "contracts" ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS "contracts_org_id_idx" ON "contracts" ("org_id", "id");
CREATE INDEX IF NOT EXISTS "contracts_org_company_idx" ON "contracts" ("org_id", "company_id");
CREATE INDEX IF NOT EXISTS "contracts_contact_idx" ON "contracts" ("org_id", "contact_id");
CREATE INDEX IF NOT EXISTS "contracts_status_idx" ON "contracts" ("org_id", "doc_status");
CREATE UNIQUE INDEX IF NOT EXISTS "contracts_org_contract_no_uniq" ON "contracts" ("org_id", "contract_no") WHERE contract_no IS NOT NULL;

CREATE POLICY "crud_contracts_policy_select" ON "contracts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_contracts_policy_insert" ON "contracts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_contracts_policy_update" ON "contracts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "org_id")) WITH CHECK ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_contracts_policy_delete" ON "contracts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "org_id"));

CREATE TRIGGER "trg_contracts_set_updated_at" BEFORE UPDATE ON "contracts"
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ════════════════════════════════════════════════════════════
-- P1-11: Create purchase_requests
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "purchase_requests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id" text NOT NULL DEFAULT (auth.require_org_id()),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "created_by" text NOT NULL DEFAULT (auth.user_id()),
  "updated_by" text NOT NULL DEFAULT (auth.user_id()),
  "version" integer NOT NULL DEFAULT 1,
  "is_deleted" boolean NOT NULL DEFAULT false,
  "deleted_at" timestamptz,
  "deleted_by" text,
  "company_id" uuid,
  "site_id" uuid,
  "custom_data" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "doc_status" text NOT NULL DEFAULT 'draft',
  "submitted_at" timestamptz,
  "submitted_by" text,
  "cancelled_at" timestamptz,
  "cancelled_by" text,
  "amended_from_id" uuid,
  "external_source" text,
  "external_id" text,
  "request_no" text,
  "requested_by" text NOT NULL DEFAULT (auth.user_id()),
  "department_id" uuid,
  "priority" text NOT NULL DEFAULT 'normal',
  "required_by_date" text,
  "currency_code" text NOT NULL DEFAULT 'MYR',
  "total_minor" bigint NOT NULL DEFAULT 0,
  "approved_by" text,
  "approved_at" text,
  "converted_to_purchase_order_id" uuid,
  "reason" text,
  "memo" text,
  CONSTRAINT "pr_org_not_empty" CHECK (org_id <> ''),
  CONSTRAINT "pr_priority_valid" CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  CONSTRAINT "pr_total_non_negative" CHECK (total_minor >= 0)
);

ALTER TABLE "purchase_requests" ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS "pr_org_id_idx" ON "purchase_requests" ("org_id", "id");
CREATE INDEX IF NOT EXISTS "pr_org_company_idx" ON "purchase_requests" ("org_id", "company_id");
CREATE INDEX IF NOT EXISTS "pr_requested_by_idx" ON "purchase_requests" ("org_id", "requested_by");
CREATE INDEX IF NOT EXISTS "pr_status_idx" ON "purchase_requests" ("org_id", "doc_status");
CREATE UNIQUE INDEX IF NOT EXISTS "pr_org_request_no_uniq" ON "purchase_requests" ("org_id", "request_no") WHERE request_no IS NOT NULL;

CREATE POLICY "crud_purchase_requests_policy_select" ON "purchase_requests" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_purchase_requests_policy_insert" ON "purchase_requests" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_purchase_requests_policy_update" ON "purchase_requests" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "org_id")) WITH CHECK ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_purchase_requests_policy_delete" ON "purchase_requests" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "org_id"));

CREATE TRIGGER "trg_purchase_requests_set_updated_at" BEFORE UPDATE ON "purchase_requests"
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ════════════════════════════════════════════════════════════
-- P1-12: Create stock_balances
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "stock_balances" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "org_id" text NOT NULL DEFAULT (auth.require_org_id()),
  "company_id" uuid NOT NULL,
  "site_id" uuid NOT NULL,
  "item_id" uuid NOT NULL,
  "qty_on_hand" numeric(20,6) NOT NULL DEFAULT 0,
  "qty_reserved" numeric(20,6) NOT NULL DEFAULT 0,
  "qty_ordered" numeric(20,6) NOT NULL DEFAULT 0,
  "valuation_minor" bigint NOT NULL DEFAULT 0,
  "currency_code" text NOT NULL DEFAULT 'MYR',
  "last_movement_at" timestamptz,
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "stock_bal_org_not_empty" CHECK (org_id <> '')
);

ALTER TABLE "stock_balances" ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS "stock_bal_org_id_idx" ON "stock_balances" ("org_id", "id");
CREATE INDEX IF NOT EXISTS "stock_bal_org_company_idx" ON "stock_balances" ("org_id", "company_id");
CREATE INDEX IF NOT EXISTS "stock_bal_org_item_idx" ON "stock_balances" ("org_id", "item_id");
CREATE UNIQUE INDEX IF NOT EXISTS "stock_bal_org_company_site_item_uniq" ON "stock_balances" ("org_id", "company_id", "site_id", "item_id");

CREATE POLICY "crud_stock_balances_policy_select" ON "stock_balances" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_stock_balances_policy_insert" ON "stock_balances" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_stock_balances_policy_update" ON "stock_balances" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "org_id")) WITH CHECK ((select auth.org_id() = "org_id"));
CREATE POLICY "crud_stock_balances_policy_delete" ON "stock_balances" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "org_id"));

-- ════════════════════════════════════════════════════════════
-- P1-13: Rename product_id → item_id in stock_movements + lot_tracking
-- ════════════════════════════════════════════════════════════

-- stock_movements: rename column + rebuild indexes
ALTER TABLE "stock_movements" RENAME COLUMN "product_id" TO "item_id";

DROP INDEX IF EXISTS "stock_mv_product_idx";
CREATE INDEX IF NOT EXISTS "stock_mv_item_idx" ON "stock_movements" ("org_id", "site_id", "item_id");

-- lot_tracking: rename column + rebuild indexes
ALTER TABLE "lot_tracking" RENAME COLUMN "product_id" TO "item_id";

DROP INDEX IF EXISTS "lot_track_product_idx";
CREATE INDEX IF NOT EXISTS "lot_track_item_idx" ON "lot_tracking" ("org_id", "item_id");

-- Rebuild expiry index with new column name
DROP INDEX IF EXISTS "lot_track_expiry_idx";
CREATE INDEX IF NOT EXISTS "lot_track_expiry_idx" ON "lot_tracking" ("org_id", "item_id", "expiry_date");

-- Rebuild batch index with new column name
DROP INDEX IF EXISTS "stock_mv_batch_idx";
CREATE INDEX IF NOT EXISTS "stock_mv_batch_idx" ON "stock_movements" ("org_id", "item_id", "batch_no");
