CREATE TABLE "bank_accounts" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid,
	"site_id" uuid,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"account_no" text NOT NULL,
	"bank_name" text NOT NULL,
	"bank_code" text,
	"iban" text,
	"currency_code" text NOT NULL,
	"gl_account_id" uuid,
	"account_type" text NOT NULL,
	"is_company_account" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"notes" text,
	CONSTRAINT "bank_accounts_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "bank_accounts_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "bank_accounts_valid_account_type" CHECK (account_type IN ('current', 'savings', 'fixed-deposit', 'money-market', 'escrow'))
);
--> statement-breakpoint
ALTER TABLE "bank_accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "bank_matching_rules" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid,
	"site_id" uuid,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"bank_account_id" uuid,
	"rule_name" text NOT NULL,
	"priority" integer DEFAULT 100 NOT NULL,
	"match_field" text NOT NULL,
	"match_operator" text NOT NULL,
	"match_pattern" text NOT NULL,
	"tolerance_minor" bigint DEFAULT 0 NOT NULL,
	"tolerance_days" integer DEFAULT 0 NOT NULL,
	"auto_match" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "bank_matching_rules_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "bank_matching_rules_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "bank_matching_rules_valid_field" CHECK (match_field IN ('amount', 'description', 'reference', 'counterparty')),
	CONSTRAINT "bank_matching_rules_valid_operator" CHECK (match_operator IN ('equals', 'contains', 'regex', 'range')),
	CONSTRAINT "bank_matching_rules_nonneg_tolerance" CHECK (tolerance_minor >= 0),
	CONSTRAINT "bank_matching_rules_nonneg_days" CHECK (tolerance_days >= 0)
);
--> statement-breakpoint
ALTER TABLE "bank_matching_rules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "dunning_notices" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid,
	"site_id" uuid,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"dunning_run_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"invoice_id" uuid,
	"notice_level" integer NOT NULL,
	"action_type" text NOT NULL,
	"amount_outstanding_minor" bigint DEFAULT 0 NOT NULL,
	"currency_code" text NOT NULL,
	"due_date" date,
	"sent_at" timestamp with time zone,
	"status" text DEFAULT 'draft' NOT NULL,
	"notes" text,
	CONSTRAINT "dunning_notices_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "dunning_notices_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "dunning_notices_valid_level" CHECK (notice_level BETWEEN 1 AND 3),
	CONSTRAINT "dunning_notices_valid_action_type" CHECK (action_type IN ('friendly_reminder', 'formal_demand', 'final_notice', 'legal_notice')),
	CONSTRAINT "dunning_notices_valid_status" CHECK (status IN ('draft', 'sent', 'acknowledged', 'resolved', 'escalated'))
);
--> statement-breakpoint
ALTER TABLE "dunning_notices" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "dunning_runs" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid,
	"site_id" uuid,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"doc_status" text DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp with time zone,
	"submitted_by" text,
	"cancelled_at" timestamp with time zone,
	"cancelled_by" text,
	"amended_from_id" uuid,
	"run_no" text,
	"run_date" date NOT NULL,
	"cutoff_date" date NOT NULL,
	"notice_count" integer DEFAULT 0 NOT NULL,
	"total_outstanding_minor" bigint DEFAULT 0 NOT NULL,
	"currency_code" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	CONSTRAINT "dunning_runs_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "dunning_runs_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "dunning_runs_valid_status" CHECK (status IN ('draft', 'processing', 'completed', 'cancelled')),
	CONSTRAINT "dunning_runs_nonneg_count" CHECK (notice_count >= 0)
);
--> statement-breakpoint
ALTER TABLE "dunning_runs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "opening_balance_batches" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid,
	"site_id" uuid,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"doc_status" text DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp with time zone,
	"submitted_by" text,
	"cancelled_at" timestamp with time zone,
	"cancelled_by" text,
	"amended_from_id" uuid,
	"batch_no" text,
	"batch_type" text NOT NULL,
	"effective_date" date NOT NULL,
	"line_count" integer DEFAULT 0 NOT NULL,
	"validation_status" text DEFAULT 'pending' NOT NULL,
	"validation_errors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"journal_entry_id" uuid,
	CONSTRAINT "opening_balance_batches_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "opening_balance_batches_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "opening_balance_batches_valid_type" CHECK (batch_type IN ('gl', 'ar', 'ap', 'bank')),
	CONSTRAINT "opening_balance_batches_valid_validation" CHECK (validation_status IN ('pending', 'validated', 'errors', 'posted')),
	CONSTRAINT "opening_balance_batches_nonneg_count" CHECK (line_count >= 0)
);
--> statement-breakpoint
ALTER TABLE "opening_balance_batches" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "opening_balance_lines" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid,
	"site_id" uuid,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"batch_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"account_id" uuid,
	"party_type" text,
	"party_id" uuid,
	"debit_minor" bigint DEFAULT 0 NOT NULL,
	"credit_minor" bigint DEFAULT 0 NOT NULL,
	"currency_code" text NOT NULL,
	"exchange_rate" numeric(20, 10) DEFAULT '1',
	"base_debit_minor" bigint DEFAULT 0 NOT NULL,
	"base_credit_minor" bigint DEFAULT 0 NOT NULL,
	"reference" text,
	"validation_status" text DEFAULT 'pending' NOT NULL,
	CONSTRAINT "opening_balance_lines_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "opening_balance_lines_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "opening_balance_lines_no_dual_posting" CHECK (NOT (debit_minor > 0 AND credit_minor > 0))
);
--> statement-breakpoint
ALTER TABLE "opening_balance_lines" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "payment_method_accounts" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid,
	"site_id" uuid,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"payment_method_id" uuid NOT NULL,
	"gl_account_id" uuid NOT NULL,
	CONSTRAINT "payment_method_accounts_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "payment_method_accounts_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "payment_method_accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "payment_methods" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid,
	"site_id" uuid,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"method_type" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "payment_methods_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "payment_methods_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "payment_methods_valid_method_type" CHECK (method_type IN ('cash', 'bank', 'general', 'phone'))
);
--> statement-breakpoint
ALTER TABLE "payment_methods" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "payment_terms_template_details" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid,
	"site_id" uuid,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"template_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"due_date_basis" text NOT NULL,
	"credit_days" integer DEFAULT 0 NOT NULL,
	"discount_percent" numeric(5, 2) DEFAULT '0' NOT NULL,
	"discount_days" integer,
	"portion_percent" numeric(5, 2) DEFAULT '100' NOT NULL,
	CONSTRAINT "payment_terms_template_details_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "payment_terms_template_details_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "payment_terms_details_valid_basis" CHECK (due_date_basis IN ('invoice_date', 'end_of_month', 'end_of_next_month', 'custom')),
	CONSTRAINT "payment_terms_details_positive_days" CHECK (credit_days >= 0),
	CONSTRAINT "payment_terms_details_valid_portion" CHECK (portion_percent > 0 AND portion_percent <= 100),
	CONSTRAINT "payment_terms_details_valid_discount" CHECK (discount_percent >= 0)
);
--> statement-breakpoint
ALTER TABLE "payment_terms_template_details" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "payment_terms_templates" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid,
	"site_id" uuid,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "payment_terms_templates_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "payment_terms_templates_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "payment_terms_templates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid,
	"site_id" uuid,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"doc_status" text DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp with time zone,
	"submitted_by" text,
	"cancelled_at" timestamp with time zone,
	"cancelled_by" text,
	"amended_from_id" uuid,
	"payment_no" text,
	"payment_type" text NOT NULL,
	"party_type" text,
	"party_id" uuid,
	"paid_from_account_id" uuid NOT NULL,
	"paid_to_account_id" uuid NOT NULL,
	"paid_amount_minor" bigint DEFAULT 0 NOT NULL,
	"paid_currency_code" text NOT NULL,
	"received_amount_minor" bigint DEFAULT 0 NOT NULL,
	"received_currency_code" text NOT NULL,
	"fx_rate" numeric(20, 10) DEFAULT '1',
	"payment_date" date NOT NULL,
	"payment_method_id" uuid,
	"bank_account_id" uuid,
	"reference_no" text,
	"memo" text,
	CONSTRAINT "payments_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "payments_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "payments_positive_paid" CHECK (paid_amount_minor > 0),
	CONSTRAINT "payments_positive_received" CHECK (received_amount_minor > 0),
	CONSTRAINT "payments_valid_payment_type" CHECK (payment_type IN ('receive', 'pay', 'internal_transfer')),
	CONSTRAINT "payments_valid_party_type" CHECK (party_type IS NULL OR party_type IN ('customer', 'supplier', 'employee', 'other'))
);
--> statement-breakpoint
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "bank_accounts_org_created_idx" ON "bank_accounts" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq__bank_accounts__org_company_account_no" ON "bank_accounts" USING btree ("org_id","company_id","account_no");--> statement-breakpoint
CREATE INDEX "bank_accounts_org_company_type_idx" ON "bank_accounts" USING btree ("org_id","company_id","account_type");--> statement-breakpoint
CREATE INDEX "bank_matching_rules_org_created_idx" ON "bank_matching_rules" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq__bank_matching_rules__org_name" ON "bank_matching_rules" USING btree ("org_id","rule_name");--> statement-breakpoint
CREATE INDEX "idx__bank_matching_rules__bank_account" ON "bank_matching_rules" USING btree ("org_id","bank_account_id");--> statement-breakpoint
CREATE INDEX "idx__bank_matching_rules__priority" ON "bank_matching_rules" USING btree ("org_id","priority");--> statement-breakpoint
CREATE INDEX "dunning_notices_org_created_idx" ON "dunning_notices" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq__dunning_notices__org_run_customer_invoice" ON "dunning_notices" USING btree ("org_id","dunning_run_id","customer_id","invoice_id");--> statement-breakpoint
CREATE INDEX "idx__dunning_notices__customer" ON "dunning_notices" USING btree ("org_id","customer_id");--> statement-breakpoint
CREATE INDEX "idx__dunning_notices__run" ON "dunning_notices" USING btree ("org_id","dunning_run_id");--> statement-breakpoint
CREATE INDEX "dunning_runs_org_created_idx" ON "dunning_runs" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "idx__dunning_runs__run_date" ON "dunning_runs" USING btree ("org_id","run_date");--> statement-breakpoint
CREATE INDEX "opening_balance_batches_org_created_idx" ON "opening_balance_batches" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "idx__opening_balance_batches__type" ON "opening_balance_batches" USING btree ("org_id","batch_type");--> statement-breakpoint
CREATE INDEX "idx__opening_balance_batches__effective_date" ON "opening_balance_batches" USING btree ("org_id","effective_date");--> statement-breakpoint
CREATE INDEX "opening_balance_lines_org_created_idx" ON "opening_balance_lines" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq__opening_balance_lines__org_batch_line" ON "opening_balance_lines" USING btree ("org_id","batch_id","line_no");--> statement-breakpoint
CREATE INDEX "idx__opening_balance_lines__batch" ON "opening_balance_lines" USING btree ("org_id","batch_id");--> statement-breakpoint
CREATE INDEX "idx__opening_balance_lines__account" ON "opening_balance_lines" USING btree ("org_id","account_id");--> statement-breakpoint
CREATE INDEX "payment_method_accounts_org_created_idx" ON "payment_method_accounts" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq__payment_method_accounts__org_company_method" ON "payment_method_accounts" USING btree ("org_id","company_id","payment_method_id");--> statement-breakpoint
CREATE INDEX "payment_methods_org_created_idx" ON "payment_methods" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq__payment_methods__org_code" ON "payment_methods" USING btree ("org_id","code");--> statement-breakpoint
CREATE INDEX "payment_terms_template_details_org_created_idx" ON "payment_terms_template_details" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq__payment_terms_details__org_template_line" ON "payment_terms_template_details" USING btree ("org_id","template_id","line_no");--> statement-breakpoint
CREATE INDEX "payment_terms_templates_org_created_idx" ON "payment_terms_templates" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq__payment_terms_templates__org_code" ON "payment_terms_templates" USING btree ("org_id","code");--> statement-breakpoint
CREATE INDEX "payments_org_created_idx" ON "payments" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "payments_org_payment_no_idx" ON "payments" USING btree ("org_id","payment_no") WHERE payment_no IS NOT NULL;--> statement-breakpoint
CREATE INDEX "payments_org_party_idx" ON "payments" USING btree ("org_id","party_type","party_id");--> statement-breakpoint
CREATE INDEX "payments_org_bank_idx" ON "payments" USING btree ("org_id","bank_account_id");--> statement-breakpoint
CREATE INDEX "payments_org_date_idx" ON "payments" USING btree ("org_id","payment_date");--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "bank_accounts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "bank_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "bank_accounts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "bank_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "bank_accounts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "bank_accounts"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "bank_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "bank_accounts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "bank_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "bank_matching_rules" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "bank_matching_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "bank_matching_rules" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "bank_matching_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "bank_matching_rules" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "bank_matching_rules"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "bank_matching_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "bank_matching_rules" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "bank_matching_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "dunning_notices" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "dunning_notices"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "dunning_notices" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "dunning_notices"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "dunning_notices" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "dunning_notices"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "dunning_notices"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "dunning_notices" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "dunning_notices"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "dunning_runs" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "dunning_runs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "dunning_runs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "dunning_runs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "dunning_runs" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "dunning_runs"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "dunning_runs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "dunning_runs" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "dunning_runs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "opening_balance_batches" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "opening_balance_batches"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "opening_balance_batches" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "opening_balance_batches"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "opening_balance_batches" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "opening_balance_batches"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "opening_balance_batches"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "opening_balance_batches" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "opening_balance_batches"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "opening_balance_lines" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "opening_balance_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "opening_balance_lines" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "opening_balance_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "opening_balance_lines" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "opening_balance_lines"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "opening_balance_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "opening_balance_lines" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "opening_balance_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "payment_method_accounts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "payment_method_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "payment_method_accounts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "payment_method_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "payment_method_accounts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "payment_method_accounts"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "payment_method_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "payment_method_accounts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "payment_method_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "payment_methods" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "payment_methods"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "payment_methods" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "payment_methods"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "payment_methods" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "payment_methods"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "payment_methods"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "payment_methods" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "payment_methods"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "payment_terms_template_details" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "payment_terms_template_details"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "payment_terms_template_details" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "payment_terms_template_details"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "payment_terms_template_details" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "payment_terms_template_details"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "payment_terms_template_details"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "payment_terms_template_details" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "payment_terms_template_details"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "payment_terms_templates" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "payment_terms_templates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "payment_terms_templates" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "payment_terms_templates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "payment_terms_templates" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "payment_terms_templates"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "payment_terms_templates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "payment_terms_templates" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "payment_terms_templates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "payments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "payments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "payments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "payments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "payments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "payments"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "payments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "payments" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "payments"."org_id"));

-- [NK-IMMUTABILITY-TRIGGERS]

-- Natural key immutability trigger function (shared)
CREATE OR REPLACE FUNCTION public.block_natural_key_update()
RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'Natural key column(s) are immutable after creation';
END;
$$ LANGUAGE plpgsql;

-- NK immutability: bank_accounts (account_no)
DROP TRIGGER IF EXISTS trg_nk_immutable_bank_accounts ON bank_accounts;
CREATE TRIGGER trg_nk_immutable_bank_accounts
  BEFORE UPDATE OF account_no ON bank_accounts
  FOR EACH ROW WHEN (OLD.account_no IS DISTINCT FROM NEW.account_no)
  EXECUTE FUNCTION public.block_natural_key_update();

-- NK immutability: government_grant_items (grant_no)
DROP TRIGGER IF EXISTS trg_nk_immutable_government_grant_items ON government_grant_items;
CREATE TRIGGER trg_nk_immutable_government_grant_items
  BEFORE UPDATE OF grant_no ON government_grant_items
  FOR EACH ROW WHEN (OLD.grant_no IS DISTINCT FROM NEW.grant_no)
  EXECUTE FUNCTION public.block_natural_key_update();

-- NK immutability: payment_methods (code)
DROP TRIGGER IF EXISTS trg_nk_immutable_payment_methods ON payment_methods;
CREATE TRIGGER trg_nk_immutable_payment_methods
  BEFORE UPDATE OF code ON payment_methods
  FOR EACH ROW WHEN (OLD.code IS DISTINCT FROM NEW.code)
  EXECUTE FUNCTION public.block_natural_key_update();

-- NK immutability: payment_terms_templates (code)
DROP TRIGGER IF EXISTS trg_nk_immutable_payment_terms_templates ON payment_terms_templates;
CREATE TRIGGER trg_nk_immutable_payment_terms_templates
  BEFORE UPDATE OF code ON payment_terms_templates
  FOR EACH ROW WHEN (OLD.code IS DISTINCT FROM NEW.code)
  EXECUTE FUNCTION public.block_natural_key_update();

-- NK immutability: treasury_accounts (account_no)
DROP TRIGGER IF EXISTS trg_nk_immutable_treasury_accounts ON treasury_accounts;
CREATE TRIGGER trg_nk_immutable_treasury_accounts
  BEFORE UPDATE OF account_no ON treasury_accounts
  FOR EACH ROW WHEN (OLD.account_no IS DISTINCT FROM NEW.account_no)
  EXECUTE FUNCTION public.block_natural_key_update();
