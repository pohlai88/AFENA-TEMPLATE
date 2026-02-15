-- Migration 0048: Drift Repair
-- Repairs DB–Drizzle schema drift identified in db-drizzle-drift-analysis.md
--
-- Creates missing tables and fixes column renames that were recorded as applied
-- but never actually executed (migration history anomaly).
--
-- Idempotent: uses IF NOT EXISTS / IF EXISTS throughout.

-- ════════════════════════════════════════════════════════════
-- 1. Create audit_logs (missing; required by CRUD/mutate)
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS "audit_logs" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "org_id" text NOT NULL,
  "actor_user_id" text NOT NULL,
  "actor_name" text,
  "owner_id" text,
  "geo_country" text,
  "action_type" text NOT NULL,
  "action_family" text NOT NULL,
  "entity_type" text NOT NULL,
  "entity_id" text NOT NULL,
  "request_id" text,
  "mutation_id" uuid NOT NULL,
  "batch_id" uuid,
  "version_before" integer,
  "version_after" integer NOT NULL,
  "channel" text NOT NULL DEFAULT 'web_ui',
  "ip" text,
  "user_agent" text,
  "reason" text,
  "authority_snapshot" jsonb,
  "idempotency_key" text,
  "affected_count" integer DEFAULT 1,
  "value_delta" jsonb,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "before" jsonb,
  "after" jsonb,
  "diff" jsonb,
  CONSTRAINT "audit_logs_org_not_empty" CHECK (org_id <> ''),
  CONSTRAINT "audit_logs_mutation_id_unique" UNIQUE ("mutation_id"),
  PRIMARY KEY ("org_id", "id")
);

ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS "audit_logs_org_created_idx" ON "audit_logs" ("org_id", "created_at");
CREATE INDEX IF NOT EXISTS "audit_logs_entity_timeline_idx" ON "audit_logs" ("entity_type", "entity_id", "created_at");
CREATE INDEX IF NOT EXISTS "audit_logs_batch_idx" ON "audit_logs" ("batch_id", "created_at");
CREATE INDEX IF NOT EXISTS "audit_logs_request_idx" ON "audit_logs" ("request_id");
CREATE UNIQUE INDEX IF NOT EXISTS "audit_logs_idempotency_idx" ON "audit_logs" ("org_id", "action_type", "idempotency_key") WHERE idempotency_key IS NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'audit_logs' AND policyname = 'audit_logs_crud_policy') THEN
    CREATE POLICY audit_logs_crud_policy ON "audit_logs"
      FOR ALL TO authenticated
      USING (org_id = (SELECT auth.org_id()))
      WITH CHECK (org_id = (SELECT auth.org_id()) AND (channel = 'system' OR (SELECT auth.user_id()) = actor_user_id));
  END IF;
END $$;

--> statement-breakpoint

-- ════════════════════════════════════════════════════════════
-- 2. Create missing tables from 0043_audit_gap_closure
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

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bank_accounts' AND policyname = 'crud_bank_accounts_policy_select') THEN
    CREATE POLICY "crud_bank_accounts_policy_select" ON "bank_accounts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_bank_accounts_policy_insert" ON "bank_accounts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_bank_accounts_policy_update" ON "bank_accounts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "org_id")) WITH CHECK ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_bank_accounts_policy_delete" ON "bank_accounts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "org_id"));
  END IF;
END $$;

CREATE TRIGGER "trg_bank_accounts_set_updated_at" BEFORE UPDATE ON "bank_accounts"
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

--> statement-breakpoint

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

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'debit_notes' AND policyname = 'crud_debit_notes_policy_select') THEN
    CREATE POLICY "crud_debit_notes_policy_select" ON "debit_notes" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_debit_notes_policy_insert" ON "debit_notes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_debit_notes_policy_update" ON "debit_notes" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "org_id")) WITH CHECK ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_debit_notes_policy_delete" ON "debit_notes" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "org_id"));
  END IF;
END $$;

CREATE TRIGGER "trg_debit_notes_set_updated_at" BEFORE UPDATE ON "debit_notes"
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

--> statement-breakpoint

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

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'customer_profiles' AND policyname = 'crud_customer_profiles_policy_select') THEN
    CREATE POLICY "crud_customer_profiles_policy_select" ON "customer_profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_customer_profiles_policy_insert" ON "customer_profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_customer_profiles_policy_update" ON "customer_profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "org_id")) WITH CHECK ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_customer_profiles_policy_delete" ON "customer_profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "org_id"));
  END IF;
END $$;

CREATE TRIGGER "trg_customer_profiles_set_updated_at" BEFORE UPDATE ON "customer_profiles"
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

--> statement-breakpoint

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

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'supplier_profiles' AND policyname = 'crud_supplier_profiles_policy_select') THEN
    CREATE POLICY "crud_supplier_profiles_policy_select" ON "supplier_profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_supplier_profiles_policy_insert" ON "supplier_profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_supplier_profiles_policy_update" ON "supplier_profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "org_id")) WITH CHECK ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_supplier_profiles_policy_delete" ON "supplier_profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "org_id"));
  END IF;
END $$;

CREATE TRIGGER "trg_supplier_profiles_set_updated_at" BEFORE UPDATE ON "supplier_profiles"
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

--> statement-breakpoint

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

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'payment_terms' AND policyname = 'crud_payment_terms_policy_select') THEN
    CREATE POLICY "crud_payment_terms_policy_select" ON "payment_terms" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_payment_terms_policy_insert" ON "payment_terms" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_payment_terms_policy_update" ON "payment_terms" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "org_id")) WITH CHECK ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_payment_terms_policy_delete" ON "payment_terms" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "org_id"));
  END IF;
END $$;

CREATE TRIGGER "trg_payment_terms_set_updated_at" BEFORE UPDATE ON "payment_terms"
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

--> statement-breakpoint

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

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bank_reconciliation_sessions' AND policyname = 'crud_bank_recon_sessions_policy_select') THEN
    CREATE POLICY "crud_bank_recon_sessions_policy_select" ON "bank_reconciliation_sessions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_bank_recon_sessions_policy_insert" ON "bank_reconciliation_sessions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_bank_recon_sessions_policy_update" ON "bank_reconciliation_sessions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "org_id")) WITH CHECK ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_bank_recon_sessions_policy_delete" ON "bank_reconciliation_sessions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "org_id"));
  END IF;
END $$;

CREATE TRIGGER "trg_bank_recon_sessions_set_updated_at" BEFORE UPDATE ON "bank_reconciliation_sessions"
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

--> statement-breakpoint

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

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contracts' AND policyname = 'crud_contracts_policy_select') THEN
    CREATE POLICY "crud_contracts_policy_select" ON "contracts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_contracts_policy_insert" ON "contracts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_contracts_policy_update" ON "contracts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "org_id")) WITH CHECK ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_contracts_policy_delete" ON "contracts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "org_id"));
  END IF;
END $$;

CREATE TRIGGER "trg_contracts_set_updated_at" BEFORE UPDATE ON "contracts"
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

--> statement-breakpoint

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

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'purchase_requests' AND policyname = 'crud_purchase_requests_policy_select') THEN
    CREATE POLICY "crud_purchase_requests_policy_select" ON "purchase_requests" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_purchase_requests_policy_insert" ON "purchase_requests" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_purchase_requests_policy_update" ON "purchase_requests" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "org_id")) WITH CHECK ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_purchase_requests_policy_delete" ON "purchase_requests" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "org_id"));
  END IF;
END $$;

CREATE TRIGGER "trg_purchase_requests_set_updated_at" BEFORE UPDATE ON "purchase_requests"
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

--> statement-breakpoint

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

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'stock_balances' AND policyname = 'crud_stock_balances_policy_select') THEN
    CREATE POLICY "crud_stock_balances_policy_select" ON "stock_balances" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_stock_balances_policy_insert" ON "stock_balances" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_stock_balances_policy_update" ON "stock_balances" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "org_id")) WITH CHECK ((select auth.org_id() = "org_id"));
    CREATE POLICY "crud_stock_balances_policy_delete" ON "stock_balances" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "org_id"));
  END IF;
END $$;

--> statement-breakpoint

-- ════════════════════════════════════════════════════════════
-- 3. Column renames: product_id → item_id (0043 P1-13)
-- ════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='stock_movements' AND column_name='product_id') THEN
    ALTER TABLE "stock_movements" RENAME COLUMN "product_id" TO "item_id";
    DROP INDEX IF EXISTS "stock_mv_product_idx";
    CREATE INDEX IF NOT EXISTS "stock_mv_item_idx" ON "stock_movements" ("org_id", "site_id", "item_id");
    DROP INDEX IF EXISTS "stock_mv_batch_idx";
    CREATE INDEX IF NOT EXISTS "stock_mv_batch_idx" ON "stock_movements" ("org_id", "item_id", "batch_no");
  END IF;
END $$;

--> statement-breakpoint

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='lot_tracking' AND column_name='product_id') THEN
    ALTER TABLE "lot_tracking" RENAME COLUMN "product_id" TO "item_id";
    DROP INDEX IF EXISTS "lot_track_product_idx";
    CREATE INDEX IF NOT EXISTS "lot_track_item_idx" ON "lot_tracking" ("org_id", "item_id");
    DROP INDEX IF EXISTS "lot_track_expiry_idx";
    CREATE INDEX IF NOT EXISTS "lot_track_expiry_idx" ON "lot_tracking" ("org_id", "item_id", "expiry_date");
  END IF;
END $$;

--> statement-breakpoint

-- ════════════════════════════════════════════════════════════
-- 4. bank_statement_lines: add reconciliation_session_id, fix matched_at
-- ════════════════════════════════════════════════════════════

ALTER TABLE "bank_statement_lines" ADD COLUMN IF NOT EXISTS "reconciliation_session_id" uuid;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='bank_statement_lines' AND column_name='matched_at' AND data_type='text') THEN
    ALTER TABLE "bank_statement_lines" ALTER COLUMN "matched_at" TYPE timestamptz USING "matched_at"::timestamptz;
  END IF;
END $$;
