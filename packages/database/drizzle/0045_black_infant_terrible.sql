CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"address_type" text DEFAULT 'billing' NOT NULL,
	"line1" text,
	"line2" text,
	"city" text,
	"state" text,
	"postal_code" text,
	"country" text,
	"phone" text,
	"email" text,
	CONSTRAINT "addresses_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "addresses_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "addresses_type_valid" CHECK (address_type IN ('billing', 'shipping', 'registered', 'warehouse'))
);
--> statement-breakpoint
ALTER TABLE "addresses" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "approval_chains" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid,
	"entity_type" text NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	CONSTRAINT "approval_chains_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "approval_chains" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "approval_decisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"request_id" uuid NOT NULL,
	"step_id" uuid NOT NULL,
	"decision" text NOT NULL,
	"decided_by" text NOT NULL,
	"decided_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reason" text,
	"delegated_from" text,
	CONSTRAINT "approval_dec_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "approval_dec_decision_valid" CHECK (decision IN ('approved', 'rejected', 'abstained'))
);
--> statement-breakpoint
ALTER TABLE "approval_decisions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "approval_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"chain_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"current_step_order" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"requested_by" text NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"memo" text,
	CONSTRAINT "approval_req_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "approval_req_status_valid" CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'timed_out'))
);
--> statement-breakpoint
ALTER TABLE "approval_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "approval_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"chain_id" uuid NOT NULL,
	"step_order" integer NOT NULL,
	"name" text NOT NULL,
	"approval_mode" text DEFAULT 'any' NOT NULL,
	"required_count" integer DEFAULT 1 NOT NULL,
	"approver_role_id" uuid,
	"approver_user_id" text,
	"timeout_hours" integer,
	"description" text,
	CONSTRAINT "approval_steps_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "approval_steps_mode_valid" CHECK (approval_mode IN ('any', 'all', 'threshold')),
	CONSTRAINT "approval_steps_count_positive" CHECK (required_count > 0)
);
--> statement-breakpoint
ALTER TABLE "approval_steps" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "bank_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid NOT NULL,
	"bank_name" text NOT NULL,
	"account_name" text NOT NULL,
	"account_number" text NOT NULL,
	"account_type" text DEFAULT 'current' NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"swift_code" text,
	"iban" text,
	"branch_code" text,
	"branch_name" text,
	"gl_account_id" uuid,
	"opening_balance_minor" bigint DEFAULT 0 NOT NULL,
	"current_balance_minor" bigint DEFAULT 0 NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	CONSTRAINT "bank_accounts_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "bank_acct_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "bank_acct_type_valid" CHECK (account_type IN ('current', 'savings', 'fixed_deposit', 'overdraft', 'credit_line', 'petty_cash'))
);
--> statement-breakpoint
ALTER TABLE "bank_accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "bank_reconciliation_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid NOT NULL,
	"bank_account_id" uuid NOT NULL,
	"statement_date_from" date NOT NULL,
	"statement_date_to" date NOT NULL,
	"closing_balance_minor" bigint,
	"reconciled_balance_minor" bigint,
	"difference_minor" bigint,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"prepared_by" text DEFAULT (auth.user_id()) NOT NULL,
	"approved_by" text,
	"approved_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"memo" text,
	CONSTRAINT "bank_recon_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "bank_recon_status_valid" CHECK (status IN ('in_progress', 'completed', 'approved', 'cancelled')),
	CONSTRAINT "bank_recon_date_order" CHECK (statement_date_from <= statement_date_to)
);
--> statement-breakpoint
ALTER TABLE "bank_reconciliation_sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "bank_statement_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid NOT NULL,
	"bank_account_id" uuid NOT NULL,
	"statement_date" date NOT NULL,
	"value_date" date,
	"description" text NOT NULL,
	"reference" text,
	"amount_minor" bigint NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"balance_minor" bigint,
	"transaction_type" text,
	"import_batch_id" uuid,
	"is_reconciled" boolean DEFAULT false NOT NULL,
	"matched_payment_id" uuid,
	"matched_journal_entry_id" uuid,
	"match_confidence" text,
	"matched_by" text,
	"matched_at" timestamp with time zone,
	"reconciliation_session_id" uuid,
	"memo" text,
	CONSTRAINT "bsl_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "bsl_match_confidence_valid" CHECK (match_confidence IS NULL OR match_confidence IN ('exact', 'high', 'medium', 'low', 'manual'))
);
--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "bom_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"bom_id" uuid NOT NULL,
	"component_product_id" uuid NOT NULL,
	"qty" numeric(20, 6) NOT NULL,
	"uom_id" uuid,
	"waste_percent" numeric(5, 2) DEFAULT '0' NOT NULL,
	"is_optional" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"memo" text,
	CONSTRAINT "bom_lines_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "bom_lines_qty_positive" CHECK (qty > 0)
);
--> statement-breakpoint
ALTER TABLE "bom_lines" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "boms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"bom_version" integer DEFAULT 1 NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"yield_qty" numeric(20, 6) DEFAULT '1' NOT NULL,
	"yield_uom_id" uuid,
	"description" text,
	CONSTRAINT "boms_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "boms" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "budget_commitments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"budget_id" uuid NOT NULL,
	"source_type" text NOT NULL,
	"source_id" uuid NOT NULL,
	"amount_minor" bigint NOT NULL,
	"status" text DEFAULT 'committed' NOT NULL,
	"memo" text,
	CONSTRAINT "budget_commit_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "budget_commit_source_valid" CHECK (source_type IN ('purchase_order', 'purchase_request', 'contract')),
	CONSTRAINT "budget_commit_status_valid" CHECK (status IN ('committed', 'released', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "budget_commitments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "budgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid NOT NULL,
	"fiscal_period_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"cost_center_id" uuid,
	"project_id" uuid,
	"budget_amount_minor" bigint NOT NULL,
	"committed_amount_minor" bigint DEFAULT 0 NOT NULL,
	"actual_amount_minor" bigint DEFAULT 0 NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"enforcement_mode" text DEFAULT 'advisory' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"memo" text,
	CONSTRAINT "budgets_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "budgets_enforcement_valid" CHECK (enforcement_mode IN ('advisory', 'hard_stop')),
	CONSTRAINT "budgets_amount_non_negative" CHECK (budget_amount_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE "budgets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "chart_of_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid NOT NULL,
	"account_code" text NOT NULL,
	"account_name" text NOT NULL,
	"account_type" text NOT NULL,
	"parent_id" uuid,
	"is_group" boolean DEFAULT false NOT NULL,
	"level" integer DEFAULT 0 NOT NULL,
	"currency_code" text,
	"description" text,
	CONSTRAINT "coa_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "coa_account_type_valid" CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense'))
);
--> statement-breakpoint
ALTER TABLE "chart_of_accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "company_addresses" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"company_id" uuid NOT NULL,
	"address_id" uuid NOT NULL,
	"address_type" text DEFAULT 'billing' NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	CONSTRAINT "company_addresses_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "company_addr_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "company_addr_type_valid" CHECK (address_type IN ('billing', 'shipping', 'registered', 'warehouse'))
);
--> statement-breakpoint
ALTER TABLE "company_addresses" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "contact_addresses" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"contact_id" uuid NOT NULL,
	"address_id" uuid NOT NULL,
	"address_type" text DEFAULT 'billing' NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	CONSTRAINT "contact_addresses_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "contact_addr_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "contact_addr_type_valid" CHECK (address_type IN ('billing', 'shipping', 'registered', 'warehouse'))
);
--> statement-breakpoint
ALTER TABLE "contact_addresses" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "contracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"company_id" uuid NOT NULL,
	"doc_status" text DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp with time zone,
	"submitted_by" text,
	"cancelled_at" timestamp with time zone,
	"cancelled_by" text,
	"amended_from_id" uuid,
	"external_source" text,
	"external_id" text,
	"contract_no" text,
	"contact_id" uuid NOT NULL,
	"contract_type" text DEFAULT 'service' NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"renewal_date" date,
	"billing_frequency" text DEFAULT 'monthly' NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"total_value_minor" bigint,
	"billed_to_date_minor" bigint DEFAULT 0 NOT NULL,
	"price_list_id" uuid,
	"payment_terms_id" uuid,
	"auto_renew" boolean DEFAULT false NOT NULL,
	"renewal_term_months" text,
	"termination_notice_days" text,
	"memo" text,
	CONSTRAINT "contracts_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "contracts_type_valid" CHECK (contract_type IN ('service', 'subscription', 'maintenance', 'lease', 'consulting', 'other')),
	CONSTRAINT "contracts_frequency_valid" CHECK (billing_frequency IN ('one_time', 'weekly', 'monthly', 'quarterly', 'semi_annual', 'annual')),
	CONSTRAINT "contracts_date_order" CHECK (end_date IS NULL OR start_date <= end_date)
);
--> statement-breakpoint
ALTER TABLE "contracts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "cost_centers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"parent_id" uuid,
	"level" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	CONSTRAINT "cost_centers_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "cost_centers_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "cost_centers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "credit_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"company_id" uuid NOT NULL,
	"doc_status" text DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp with time zone,
	"submitted_by" text,
	"cancelled_at" timestamp with time zone,
	"cancelled_by" text,
	"amended_from_id" uuid,
	"external_source" text,
	"external_id" text,
	"credit_note_no" text,
	"reverses_type" text NOT NULL,
	"reverses_id" uuid NOT NULL,
	"reason_code" text NOT NULL,
	"reason_description" text,
	"contact_id" uuid,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"fx_rate" text,
	"subtotal_minor" bigint DEFAULT 0 NOT NULL,
	"tax_minor" bigint DEFAULT 0 NOT NULL,
	"total_minor" bigint DEFAULT 0 NOT NULL,
	"base_subtotal_minor" bigint DEFAULT 0 NOT NULL,
	"base_tax_minor" bigint DEFAULT 0 NOT NULL,
	"base_total_minor" bigint DEFAULT 0 NOT NULL,
	"posted_at" timestamp with time zone,
	"journal_entry_id" uuid,
	"memo" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	CONSTRAINT "credit_notes_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "credit_notes_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "credit_notes_reverses_type_valid" CHECK (reverses_type IN ('invoice', 'debit_note')),
	CONSTRAINT "credit_notes_amounts_non_negative" CHECK (subtotal_minor >= 0 AND tax_minor >= 0 AND total_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE "credit_notes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "customer_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"contact_id" uuid NOT NULL,
	"company_id" uuid,
	"customer_code" text,
	"credit_limit_minor" bigint,
	"payment_terms_id" uuid,
	"default_price_list_id" uuid,
	"default_currency_code" text DEFAULT 'MYR' NOT NULL,
	"default_tax_code" text,
	"receivable_account_id" uuid,
	"sales_person_id" uuid,
	"customer_group" text,
	"territory" text,
	"memo" text,
	CONSTRAINT "customer_profiles_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "cust_prof_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "cust_prof_credit_limit_non_negative" CHECK (credit_limit_minor IS NULL OR credit_limit_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE "customer_profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "debit_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"company_id" uuid NOT NULL,
	"doc_status" text DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp with time zone,
	"submitted_by" text,
	"cancelled_at" timestamp with time zone,
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
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"fx_rate" text,
	"subtotal_minor" bigint DEFAULT 0 NOT NULL,
	"tax_minor" bigint DEFAULT 0 NOT NULL,
	"total_minor" bigint DEFAULT 0 NOT NULL,
	"base_subtotal_minor" bigint DEFAULT 0 NOT NULL,
	"base_tax_minor" bigint DEFAULT 0 NOT NULL,
	"base_total_minor" bigint DEFAULT 0 NOT NULL,
	"posted_at" timestamp with time zone,
	"journal_entry_id" uuid,
	"memo" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	CONSTRAINT "debit_notes_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "debit_notes_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "debit_notes_reverses_type_valid" CHECK (reverses_type IN ('purchase_invoice', 'credit_note')),
	CONSTRAINT "debit_notes_amounts_non_negative" CHECK (subtotal_minor >= 0 AND tax_minor >= 0 AND total_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE "debit_notes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "delivery_note_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"delivery_note_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid,
	"item_code" text,
	"item_name" text,
	"description" text,
	"qty" numeric(20, 6) DEFAULT '1' NOT NULL,
	"uom_id" uuid,
	"rate_minor" bigint DEFAULT 0 NOT NULL,
	"amount_minor" bigint DEFAULT 0 NOT NULL,
	"discount_minor" bigint DEFAULT 0 NOT NULL,
	"tax_minor" bigint DEFAULT 0 NOT NULL,
	"net_minor" bigint DEFAULT 0 NOT NULL,
	"tax_rate_id" uuid,
	"warehouse_id" uuid,
	"lot_tracking_id" uuid,
	"serial_no" text,
	"posting_date" timestamp with time zone,
	"source_doc_type" text,
	"source_line_id" uuid,
	"memo" text,
	CONSTRAINT "delivery_note_lines_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "dnl_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "dnl_net_check" CHECK (net_minor = amount_minor - discount_minor + tax_minor),
	CONSTRAINT "dnl_amount_non_negative" CHECK (amount_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE "delivery_note_lines" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "delivery_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"company_id" uuid NOT NULL,
	"doc_status" text DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp with time zone,
	"submitted_by" text,
	"cancelled_at" timestamp with time zone,
	"cancelled_by" text,
	"amended_from_id" uuid,
	"external_source" text,
	"external_id" text,
	"posting_status" text DEFAULT 'unposted' NOT NULL,
	"posting_date" timestamp with time zone,
	"posted_at" timestamp with time zone,
	"posted_by" text,
	"posting_batch_id" uuid,
	"doc_no" text,
	"customer_id" uuid NOT NULL,
	"warehouse_id" uuid,
	"memo" text,
	CONSTRAINT "delivery_notes_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "dn_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "dn_company_required" CHECK (company_id IS NOT NULL),
	CONSTRAINT "dn_posting_status_valid" CHECK (posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed'))
);
--> statement-breakpoint
ALTER TABLE "delivery_notes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "discount_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"discount_type" text DEFAULT 'percentage' NOT NULL,
	"discount_value" numeric(20, 6) NOT NULL,
	"scope" text DEFAULT 'global' NOT NULL,
	"customer_id" uuid,
	"product_id" uuid,
	"product_group_code" text,
	"price_list_id" uuid,
	"precedence" integer DEFAULT 100 NOT NULL,
	"stackable" boolean DEFAULT false NOT NULL,
	"effective_from" date,
	"effective_to" date,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	CONSTRAINT "disc_rules_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "disc_rules_type_valid" CHECK (discount_type IN ('percentage', 'fixed_amount', 'buy_x_get_y')),
	CONSTRAINT "disc_rules_scope_valid" CHECK (scope IN ('global', 'customer', 'product', 'product_group', 'price_list')),
	CONSTRAINT "disc_rules_value_non_negative" CHECK (discount_value >= 0),
	CONSTRAINT "disc_rules_date_order" CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_from <= effective_to)
);
--> statement-breakpoint
ALTER TABLE "discount_rules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "doc_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"source_type" text NOT NULL,
	"source_id" uuid NOT NULL,
	"target_type" text NOT NULL,
	"target_id" uuid NOT NULL,
	"link_type" text NOT NULL,
	"source_line_id" uuid,
	"target_line_id" uuid,
	CONSTRAINT "doc_links_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "doc_links_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "doc_links_type_valid" CHECK (link_type IN ('fulfillment', 'billing', 'return', 'amendment'))
);
--> statement-breakpoint
ALTER TABLE "doc_links" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "doc_postings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"doc_type" text NOT NULL,
	"doc_id" uuid NOT NULL,
	"status" text DEFAULT 'posting' NOT NULL,
	"idempotency_key" text NOT NULL,
	"posting_batch_id" uuid,
	"posting_run_id" uuid,
	"journal_entry_id" uuid,
	"stock_batch_id" uuid,
	"posted_at" timestamp with time zone,
	"posted_by" text,
	"reversed_at" timestamp with time zone,
	"reversed_by" text,
	"reversal_posting_id" uuid,
	"error_message" text,
	CONSTRAINT "doc_postings_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "doc_postings_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "doc_postings_status_valid" CHECK (status IN ('posting', 'posted', 'failed', 'reversing', 'reversed'))
);
--> statement-breakpoint
ALTER TABLE "doc_postings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "fiscal_periods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid NOT NULL,
	"period_name" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	CONSTRAINT "fiscal_periods_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "fiscal_periods_status_valid" CHECK (status IN ('open', 'closing', 'closed')),
	CONSTRAINT "fiscal_periods_date_order" CHECK (start_date <= end_date)
);
--> statement-breakpoint
ALTER TABLE "fiscal_periods" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "asset_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"asset_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"event_date" date NOT NULL,
	"amount_minor" bigint,
	"journal_entry_id" uuid,
	"performed_by" text NOT NULL,
	"reason" text,
	"memo" text,
	CONSTRAINT "asset_events_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "asset_events_type_valid" CHECK (event_type IN ('acquire', 'adjust', 'revalue', 'transfer', 'dispose', 'write_off', 'impair'))
);
--> statement-breakpoint
ALTER TABLE "asset_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid NOT NULL,
	"asset_code" text NOT NULL,
	"name" text NOT NULL,
	"category" text,
	"status" text DEFAULT 'acquired' NOT NULL,
	"acquisition_date" date NOT NULL,
	"acquisition_cost_minor" bigint NOT NULL,
	"residual_value_minor" bigint DEFAULT 0 NOT NULL,
	"useful_life_months" integer NOT NULL,
	"depreciation_method" text DEFAULT 'straight_line' NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"cost_account_id" uuid,
	"depreciation_account_id" uuid,
	"accum_depreciation_account_id" uuid,
	"disposal_date" date,
	"disposal_amount_minor" bigint,
	"site_id" uuid,
	"source_invoice_id" uuid,
	"description" text,
	CONSTRAINT "assets_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "assets_status_valid" CHECK (status IN ('acquired', 'in_service', 'disposed', 'written_off')),
	CONSTRAINT "assets_depreciation_valid" CHECK (depreciation_method IN ('straight_line', 'declining_balance', 'units_of_production', 'none')),
	CONSTRAINT "assets_cost_positive" CHECK (acquisition_cost_minor > 0),
	CONSTRAINT "assets_life_positive" CHECK (useful_life_months > 0)
);
--> statement-breakpoint
ALTER TABLE "assets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "depreciation_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"asset_id" uuid NOT NULL,
	"fiscal_period_id" uuid NOT NULL,
	"depreciation_minor" bigint NOT NULL,
	"accum_depreciation_minor" bigint NOT NULL,
	"book_value_minor" bigint NOT NULL,
	"journal_entry_id" uuid,
	"memo" text,
	CONSTRAINT "dep_sched_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "depreciation_schedules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "fx_rates" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"from_code" text NOT NULL,
	"to_code" text NOT NULL,
	"effective_date" date NOT NULL,
	"rate" numeric(20, 10) NOT NULL,
	"source" text DEFAULT 'manual' NOT NULL,
	"captured_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	CONSTRAINT "fx_rates_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "fx_rates_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "fx_rates_source_valid" CHECK (source IN ('manual', 'api', 'import')),
	CONSTRAINT "fx_rates_rate_positive" CHECK (rate > 0)
);
--> statement-breakpoint
ALTER TABLE "fx_rates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "goods_receipt_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"goods_receipt_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid,
	"item_code" text,
	"item_name" text,
	"description" text,
	"qty" numeric(20, 6) DEFAULT '1' NOT NULL,
	"uom_id" uuid,
	"rate_minor" bigint DEFAULT 0 NOT NULL,
	"amount_minor" bigint DEFAULT 0 NOT NULL,
	"discount_minor" bigint DEFAULT 0 NOT NULL,
	"tax_minor" bigint DEFAULT 0 NOT NULL,
	"net_minor" bigint DEFAULT 0 NOT NULL,
	"tax_rate_id" uuid,
	"warehouse_id" uuid,
	"lot_tracking_id" uuid,
	"serial_no" text,
	"posting_date" timestamp with time zone,
	"source_doc_type" text,
	"source_line_id" uuid,
	"memo" text,
	CONSTRAINT "goods_receipt_lines_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "grl_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "grl_net_check" CHECK (net_minor = amount_minor - discount_minor + tax_minor),
	CONSTRAINT "grl_amount_non_negative" CHECK (amount_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE "goods_receipt_lines" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "goods_receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"company_id" uuid NOT NULL,
	"doc_status" text DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp with time zone,
	"submitted_by" text,
	"cancelled_at" timestamp with time zone,
	"cancelled_by" text,
	"amended_from_id" uuid,
	"external_source" text,
	"external_id" text,
	"posting_status" text DEFAULT 'unposted' NOT NULL,
	"posting_date" timestamp with time zone,
	"posted_at" timestamp with time zone,
	"posted_by" text,
	"posting_batch_id" uuid,
	"doc_no" text,
	"supplier_id" uuid NOT NULL,
	"warehouse_id" uuid,
	"memo" text,
	CONSTRAINT "goods_receipts_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "gr_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "gr_company_required" CHECK (company_id IS NOT NULL),
	CONSTRAINT "gr_posting_status_valid" CHECK (posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed'))
);
--> statement-breakpoint
ALTER TABLE "goods_receipts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "intercompany_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"source_company_id" uuid NOT NULL,
	"target_company_id" uuid NOT NULL,
	"source_journal_entry_id" uuid,
	"target_journal_entry_id" uuid,
	"transaction_type" text NOT NULL,
	"description" text,
	"amount_minor" bigint NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"fx_rate" text,
	"base_amount_minor" bigint NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"memo" text,
	CONSTRAINT "ic_txn_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "ic_txn_different_companies" CHECK (source_company_id <> target_company_id),
	CONSTRAINT "ic_txn_amount_positive" CHECK (amount_minor > 0),
	CONSTRAINT "ic_txn_type_valid" CHECK (transaction_type IN ('invoice', 'payment', 'transfer', 'allocation', 'elimination')),
	CONSTRAINT "ic_txn_status_valid" CHECK (status IN ('pending', 'matched', 'eliminated', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "intercompany_transactions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "inventory_trace_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"from_movement_id" uuid NOT NULL,
	"to_movement_id" uuid NOT NULL,
	"qty" numeric(20, 6) NOT NULL,
	"uom_id" uuid,
	"lot_tracking_id" uuid,
	"trace_type" text DEFAULT 'transfer' NOT NULL,
	"memo" text,
	CONSTRAINT "inv_trace_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "inv_trace_qty_positive" CHECK (qty > 0),
	CONSTRAINT "inv_trace_type_valid" CHECK (trace_type IN ('transfer', 'consumption', 'production', 'split', 'merge'))
);
--> statement-breakpoint
ALTER TABLE "inventory_trace_links" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "item_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"name" text NOT NULL,
	"parent_group_id" uuid,
	"description" text,
	"sort_order" integer DEFAULT 0,
	CONSTRAINT "item_groups_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "item_groups_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "item_groups_name_not_empty" CHECK (name <> '')
);
--> statement-breakpoint
ALTER TABLE "item_groups" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"item_group_id" uuid,
	"item_type" text DEFAULT 'product' NOT NULL,
	"default_uom_id" uuid,
	"inventory_uom_id" uuid,
	"purchase_uom_id" uuid,
	"sales_uom_id" uuid,
	"is_stock_item" boolean DEFAULT true NOT NULL,
	"is_purchase_item" boolean DEFAULT true NOT NULL,
	"is_sales_item" boolean DEFAULT true NOT NULL,
	"is_fixed_asset" boolean DEFAULT false NOT NULL,
	"valuation_method" text DEFAULT 'weighted_average' NOT NULL,
	"default_warehouse_id" uuid,
	"has_batch_no" boolean DEFAULT false NOT NULL,
	"has_serial_no" boolean DEFAULT false NOT NULL,
	"shelf_life_days" integer,
	"weight_per_unit" numeric(10, 4),
	"weight_uom_id" uuid,
	"hsn_code" text,
	"barcode" text,
	"description" text,
	"min_order_qty" numeric(20, 6),
	"reorder_level" numeric(20, 6),
	"reorder_qty" numeric(20, 6),
	"lead_time_days" integer,
	"safety_stock" numeric(20, 6),
	"default_expense_account_id" uuid,
	"default_income_account_id" uuid,
	"default_cost_center_id" uuid,
	CONSTRAINT "items_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "items_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "items_code_not_empty" CHECK (code <> ''),
	CONSTRAINT "items_type_valid" CHECK (item_type IN ('product', 'service', 'consumable', 'raw_material')),
	CONSTRAINT "items_valuation_valid" CHECK (valuation_method IN ('fifo', 'weighted_average'))
);
--> statement-breakpoint
ALTER TABLE "items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "journal_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"company_id" uuid NOT NULL,
	"doc_status" text DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp with time zone,
	"submitted_by" text,
	"cancelled_at" timestamp with time zone,
	"cancelled_by" text,
	"amended_from_id" uuid,
	"external_source" text,
	"external_id" text,
	"entry_no" text,
	"entry_type" text DEFAULT 'manual' NOT NULL,
	"description" text,
	"posted_at" timestamp with time zone,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"fx_rate" text,
	"source_type" text,
	"source_id" uuid,
	"reversal_of_id" uuid,
	"memo" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	CONSTRAINT "journal_entries_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "journal_entries_entry_type_valid" CHECK (entry_type IN ('manual', 'auto'))
);
--> statement-breakpoint
ALTER TABLE "journal_entries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "journal_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"journal_entry_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"description" text,
	"debit_amount" bigint DEFAULT 0 NOT NULL,
	"credit_amount" bigint DEFAULT 0 NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"fx_rate" text,
	"base_debit_amount" bigint DEFAULT 0 NOT NULL,
	"base_credit_amount" bigint DEFAULT 0 NOT NULL,
	"cost_center_id" uuid,
	"project_id" uuid,
	"contact_id" uuid,
	"memo" text,
	CONSTRAINT "journal_lines_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "journal_lines_amount_valid" CHECK (debit_amount >= 0 AND credit_amount >= 0),
	CONSTRAINT "journal_lines_one_side" CHECK ((debit_amount > 0 AND credit_amount = 0) OR (credit_amount > 0 AND debit_amount = 0) OR (debit_amount = 0 AND credit_amount = 0))
);
--> statement-breakpoint
ALTER TABLE "journal_lines" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "landed_cost_allocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"landed_cost_doc_id" uuid NOT NULL,
	"receipt_line_id" uuid NOT NULL,
	"allocation_method" text DEFAULT 'qty' NOT NULL,
	"allocated_cost_minor" bigint NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"base_allocated_cost_minor" bigint NOT NULL,
	"memo" text,
	CONSTRAINT "lc_alloc_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "lc_alloc_method_valid" CHECK (allocation_method IN ('qty', 'value', 'weight', 'custom')),
	CONSTRAINT "lc_alloc_cost_positive" CHECK (allocated_cost_minor > 0)
);
--> statement-breakpoint
ALTER TABLE "landed_cost_allocations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "landed_cost_docs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"company_id" uuid NOT NULL,
	"doc_status" text DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp with time zone,
	"submitted_by" text,
	"cancelled_at" timestamp with time zone,
	"cancelled_by" text,
	"amended_from_id" uuid,
	"external_source" text,
	"external_id" text,
	"doc_no" text,
	"receipt_id" uuid,
	"vendor_id" uuid,
	"total_cost_minor" bigint DEFAULT 0 NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"fx_rate" text,
	"base_total_cost_minor" bigint DEFAULT 0 NOT NULL,
	"memo" text,
	CONSTRAINT "lc_docs_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "landed_cost_docs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "lot_tracking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"tracking_type" text NOT NULL,
	"tracking_no" text NOT NULL,
	"production_date" date,
	"expiry_date" date,
	"qty" numeric(20, 6),
	"uom_id" uuid,
	"site_id" uuid,
	"warehouse_zone" text,
	"supplier_id" uuid,
	"supplier_batch_no" text,
	"status" text DEFAULT 'active' NOT NULL,
	"memo" text,
	CONSTRAINT "lot_track_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "lot_track_type_valid" CHECK (tracking_type IN ('lot', 'batch', 'serial')),
	CONSTRAINT "lot_track_status_valid" CHECK (status IN ('active', 'consumed', 'expired', 'recalled', 'quarantined'))
);
--> statement-breakpoint
ALTER TABLE "lot_tracking" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "match_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid NOT NULL,
	"po_line_id" uuid,
	"grn_line_id" uuid,
	"invoice_line_id" uuid,
	"match_type" text DEFAULT 'three_way' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"qty_variance" numeric(20, 6),
	"price_variance_minor" bigint,
	"total_variance_minor" bigint,
	"tolerance_rule_id" uuid,
	"resolved_by" text,
	"resolution_note" text,
	"memo" text,
	CONSTRAINT "match_results_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "match_results_type_valid" CHECK (match_type IN ('two_way', 'three_way')),
	CONSTRAINT "match_results_status_valid" CHECK (status IN ('pending', 'matched', 'exception', 'disputed', 'approved_override', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "match_results" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "migration_checkpoints" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text NOT NULL,
	"migration_job_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"cursor_json" jsonb NOT NULL,
	"batch_index" integer NOT NULL,
	"loaded_up_to" integer NOT NULL,
	"transform_version" text NOT NULL,
	"plan_fingerprint" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "migration_checkpoints_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "migration_checkpoints_job_entity_uniq" UNIQUE("migration_job_id","entity_type")
);
--> statement-breakpoint
ALTER TABLE "migration_checkpoints" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "migration_conflict_resolutions" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text NOT NULL,
	"conflict_id" uuid NOT NULL,
	"migration_job_id" uuid,
	"decision" text NOT NULL,
	"chosen_candidate_id" uuid,
	"field_decisions" jsonb,
	"resolver" text NOT NULL,
	"resolved_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_by" text DEFAULT auth.user_id() NOT NULL,
	CONSTRAINT "migration_conflict_resolutions_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "migration_conflict_resolutions_decision_chk" CHECK (decision IN ('merged', 'created_new', 'skipped')),
	CONSTRAINT "migration_conflict_resolutions_resolver_chk" CHECK (resolver IN ('auto', 'manual')),
	CONSTRAINT "migration_conflict_resolutions_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "migration_conflict_resolutions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "migration_conflicts" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text NOT NULL,
	"migration_job_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"legacy_record" jsonb NOT NULL,
	"candidate_matches" jsonb NOT NULL,
	"confidence" text NOT NULL,
	"resolution" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "migration_conflicts_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "migration_conflicts_confidence_chk" CHECK (confidence IN ('high', 'medium', 'low')),
	CONSTRAINT "migration_conflicts_resolution_chk" CHECK (resolution IN ('pending', 'merged', 'created_new', 'skipped', 'manual_review')),
	CONSTRAINT "migration_conflicts_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "migration_conflicts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "migration_jobs" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"source_config" jsonb NOT NULL,
	"field_mappings" jsonb NOT NULL,
	"merge_policies" jsonb NOT NULL,
	"conflict_strategy" text NOT NULL,
	"status" text NOT NULL,
	"checkpoint_cursor" jsonb,
	"records_success" integer DEFAULT 0 NOT NULL,
	"records_failed" integer DEFAULT 0 NOT NULL,
	"max_runtime_ms" integer,
	"rate_limit" integer,
	"preflight_checks" jsonb,
	"postflight_checks" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_by" text DEFAULT auth.user_id() NOT NULL,
	CONSTRAINT "migration_jobs_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "migration_jobs_status_chk" CHECK (status IN ('pending', 'preflight', 'ready', 'blocked', 'running', 'paused', 'cancelling', 'cancelled', 'completed', 'failed', 'rolled_back')),
	CONSTRAINT "migration_jobs_conflict_strategy_chk" CHECK (conflict_strategy IN ('skip', 'overwrite', 'merge', 'manual')),
	CONSTRAINT "migration_jobs_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "migration_jobs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "migration_lineage" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text NOT NULL,
	"migration_job_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"legacy_id" text NOT NULL,
	"legacy_system" text NOT NULL,
	"afena_id" uuid,
	"state" text DEFAULT 'committed' NOT NULL,
	"reserved_at" timestamp with time zone,
	"reserved_by" text,
	"committed_at" timestamp with time zone,
	"migrated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"dedupe_key" text,
	CONSTRAINT "migration_lineage_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "migration_lineage_org_entity_legacy_uniq" UNIQUE("org_id","entity_type","legacy_system","legacy_id"),
	CONSTRAINT "migration_lineage_org_entity_afena_uniq" UNIQUE("org_id","entity_type","afena_id"),
	CONSTRAINT "migration_lineage_state_chk" CHECK (state IN ('reserved', 'committed')),
	CONSTRAINT "migration_lineage_reserved_requires_reserved_at" CHECK (state <> 'reserved' OR reserved_at IS NOT NULL),
	CONSTRAINT "migration_lineage_committed_requires_afena_id" CHECK (state <> 'committed' OR afena_id IS NOT NULL),
	CONSTRAINT "migration_lineage_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "migration_lineage" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "migration_merge_explanations" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text NOT NULL,
	"migration_job_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"legacy_id" text NOT NULL,
	"target_id" text NOT NULL,
	"decision" text NOT NULL,
	"score_total" integer NOT NULL,
	"reasons" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "migration_merge_explanations_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "migration_merge_explanations_decision_chk" CHECK (decision IN ('merged', 'manual_review', 'created_new'))
);
--> statement-breakpoint
ALTER TABLE "migration_merge_explanations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "migration_quarantine" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"attempt_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text NOT NULL,
	"migration_job_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"legacy_id" text NOT NULL,
	"legacy_system" text NOT NULL,
	"record_data" jsonb NOT NULL,
	"transform_version" text NOT NULL,
	"failure_stage" text NOT NULL,
	"error_class" text NOT NULL,
	"error_code" text NOT NULL,
	"error_message" text,
	"last_error_hash" text,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"replay_after" timestamp with time zone,
	"status" text DEFAULT 'quarantined' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone,
	CONSTRAINT "migration_quarantine_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "migration_quarantine_status_chk" CHECK (status IN ('quarantined', 'retrying', 'resolved', 'abandoned')),
	CONSTRAINT "migration_quarantine_stage_chk" CHECK (failure_stage IN ('extract', 'transform', 'detect', 'reserve', 'load', 'snapshot')),
	CONSTRAINT "migration_quarantine_class_chk" CHECK (error_class IN ('transient', 'permanent'))
);
--> statement-breakpoint
ALTER TABLE "migration_quarantine" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "migration_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"report_data" jsonb NOT NULL,
	"report_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "migration_reports" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "migration_row_snapshots" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text NOT NULL,
	"migration_job_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"before_write_core" jsonb NOT NULL,
	"before_write_custom" jsonb NOT NULL,
	"before_version" integer,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "migration_row_snapshots_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "migration_row_snapshots_job_entity_uniq" UNIQUE("migration_job_id","entity_type","entity_id"),
	CONSTRAINT "migration_row_snapshots_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "migration_row_snapshots" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "payment_allocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid NOT NULL,
	"payment_id" uuid NOT NULL,
	"target_type" text NOT NULL,
	"target_id" uuid NOT NULL,
	"allocation_type" text DEFAULT 'payment' NOT NULL,
	"allocated_amount" bigint NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"fx_rate" text,
	"base_allocated_amount" bigint NOT NULL,
	"allocation_date" date NOT NULL,
	"journal_entry_id" uuid,
	"memo" text,
	CONSTRAINT "payment_allocations_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "payment_alloc_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "payment_alloc_amount_positive" CHECK (allocated_amount > 0),
	CONSTRAINT "payment_alloc_type_valid" CHECK (allocation_type IN ('payment', 'credit_note', 'write_off', 'refund')),
	CONSTRAINT "payment_alloc_target_type_valid" CHECK (target_type IN ('invoice', 'credit_note', 'debit_note'))
);
--> statement-breakpoint
ALTER TABLE "payment_allocations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "payment_terms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"net_days" integer DEFAULT 30 NOT NULL,
	"discount_percent" numeric(5, 2),
	"discount_days" integer,
	"is_default" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	CONSTRAINT "payment_terms_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "payment_terms_net_days_non_negative" CHECK (net_days >= 0),
	CONSTRAINT "payment_terms_discount_days_valid" CHECK (discount_days IS NULL OR (discount_days >= 0 AND discount_days <= net_days)),
	CONSTRAINT "payment_terms_discount_percent_valid" CHECK (discount_percent IS NULL OR (discount_percent >= 0 AND discount_percent <= 100))
);
--> statement-breakpoint
ALTER TABLE "payment_terms" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"company_id" uuid NOT NULL,
	"doc_status" text DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp with time zone,
	"submitted_by" text,
	"cancelled_at" timestamp with time zone,
	"cancelled_by" text,
	"amended_from_id" uuid,
	"external_source" text,
	"external_id" text,
	"posting_status" text DEFAULT 'unposted' NOT NULL,
	"posting_date" timestamp with time zone,
	"posted_at" timestamp with time zone,
	"posted_by" text,
	"posting_batch_id" uuid,
	"doc_no" text,
	"payment_type" text NOT NULL,
	"party_type" text NOT NULL,
	"party_id" uuid NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"amount_minor" bigint NOT NULL,
	"bank_account_id" uuid,
	"reference_no" text,
	"reference_date" date,
	"memo" text,
	CONSTRAINT "payments_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "pay_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "pay_company_required" CHECK (company_id IS NOT NULL),
	CONSTRAINT "pay_amount_positive" CHECK (amount_minor > 0),
	CONSTRAINT "pay_payment_type_valid" CHECK (payment_type IN ('receive', 'pay', 'internal')),
	CONSTRAINT "pay_party_type_valid" CHECK (party_type IN ('customer', 'supplier')),
	CONSTRAINT "pay_posting_status_valid" CHECK (posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed'))
);
--> statement-breakpoint
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "price_list_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"price_list_id" uuid NOT NULL,
	"product_id" uuid,
	"product_group_code" text,
	"price_minor" bigint NOT NULL,
	"min_qty" bigint DEFAULT 1 NOT NULL,
	"discount_percent" text,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"memo" text,
	CONSTRAINT "price_list_items_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "pli_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "pli_price_non_negative" CHECK (price_minor >= 0),
	CONSTRAINT "pli_min_qty_positive" CHECK (min_qty > 0)
);
--> statement-breakpoint
ALTER TABLE "price_list_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "price_lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"effective_from" date,
	"effective_to" date,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	CONSTRAINT "price_lists_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "price_lists_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "price_lists_date_order" CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_from <= effective_to)
);
--> statement-breakpoint
ALTER TABLE "price_lists" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"start_date" date,
	"end_date" date,
	"manager_id" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	CONSTRAINT "projects_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "projects_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "projects_status_valid" CHECK (status IN ('active', 'completed', 'archived')),
	CONSTRAINT "projects_date_order" CHECK (end_date IS NULL OR start_date IS NULL OR start_date <= end_date)
);
--> statement-breakpoint
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "purchase_invoice_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"purchase_invoice_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid,
	"item_code" text,
	"item_name" text,
	"description" text,
	"qty" numeric(20, 6) DEFAULT '1' NOT NULL,
	"uom_id" uuid,
	"rate_minor" bigint DEFAULT 0 NOT NULL,
	"amount_minor" bigint DEFAULT 0 NOT NULL,
	"discount_minor" bigint DEFAULT 0 NOT NULL,
	"tax_minor" bigint DEFAULT 0 NOT NULL,
	"net_minor" bigint DEFAULT 0 NOT NULL,
	"tax_rate_id" uuid,
	"coa_expense_id" uuid,
	"cost_center_id" uuid,
	"project_id" uuid,
	"warehouse_id" uuid,
	"posting_date" timestamp with time zone,
	"source_doc_type" text,
	"source_line_id" uuid,
	"memo" text,
	CONSTRAINT "purchase_invoice_lines_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "pil_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "pil_net_check" CHECK (net_minor = amount_minor - discount_minor + tax_minor),
	CONSTRAINT "pil_amount_non_negative" CHECK (amount_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE "purchase_invoice_lines" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "purchase_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"company_id" uuid NOT NULL,
	"doc_status" text DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp with time zone,
	"submitted_by" text,
	"cancelled_at" timestamp with time zone,
	"cancelled_by" text,
	"amended_from_id" uuid,
	"external_source" text,
	"external_id" text,
	"posting_status" text DEFAULT 'unposted' NOT NULL,
	"posting_date" timestamp with time zone,
	"posted_at" timestamp with time zone,
	"posted_by" text,
	"posting_batch_id" uuid,
	"doc_no" text,
	"supplier_id" uuid NOT NULL,
	"due_date" date,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"exchange_rate" numeric(12, 6) DEFAULT '1',
	"total_minor" bigint DEFAULT 0 NOT NULL,
	"discount_minor" bigint DEFAULT 0 NOT NULL,
	"tax_minor" bigint DEFAULT 0 NOT NULL,
	"grand_total_minor" bigint DEFAULT 0 NOT NULL,
	"paid_minor" bigint DEFAULT 0 NOT NULL,
	"outstanding_minor" bigint DEFAULT 0 NOT NULL,
	"coa_payable_id" uuid,
	"is_tax_included" boolean DEFAULT false NOT NULL,
	"billing_address_id" uuid,
	"payment_terms" text,
	"memo" text,
	CONSTRAINT "purchase_invoices_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "pi_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "pi_company_required" CHECK (company_id IS NOT NULL),
	CONSTRAINT "pi_total_non_negative" CHECK (total_minor >= 0),
	CONSTRAINT "pi_tax_non_negative" CHECK (tax_minor >= 0),
	CONSTRAINT "pi_grand_total_non_negative" CHECK (grand_total_minor >= 0),
	CONSTRAINT "pi_paid_non_negative" CHECK (paid_minor >= 0),
	CONSTRAINT "pi_outstanding_non_negative" CHECK (outstanding_minor >= 0),
	CONSTRAINT "pi_posting_status_valid" CHECK (posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed'))
);
--> statement-breakpoint
ALTER TABLE "purchase_invoices" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "purchase_order_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"purchase_order_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid,
	"item_code" text,
	"item_name" text,
	"description" text,
	"qty" numeric(20, 6) DEFAULT '1' NOT NULL,
	"uom_id" uuid,
	"rate_minor" bigint DEFAULT 0 NOT NULL,
	"amount_minor" bigint DEFAULT 0 NOT NULL,
	"discount_minor" bigint DEFAULT 0 NOT NULL,
	"tax_minor" bigint DEFAULT 0 NOT NULL,
	"net_minor" bigint DEFAULT 0 NOT NULL,
	"tax_rate_id" uuid,
	"cost_center_id" uuid,
	"project_id" uuid,
	"warehouse_id" uuid,
	"received_qty" numeric(20, 6) DEFAULT '0' NOT NULL,
	"billed_qty" numeric(20, 6) DEFAULT '0' NOT NULL,
	"posting_date" timestamp with time zone,
	"source_doc_type" text,
	"source_line_id" uuid,
	"memo" text,
	CONSTRAINT "purchase_order_lines_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "pol_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "pol_net_check" CHECK (net_minor = amount_minor - discount_minor + tax_minor),
	CONSTRAINT "pol_amount_non_negative" CHECK (amount_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE "purchase_order_lines" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "purchase_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"company_id" uuid NOT NULL,
	"doc_status" text DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp with time zone,
	"submitted_by" text,
	"cancelled_at" timestamp with time zone,
	"cancelled_by" text,
	"amended_from_id" uuid,
	"external_source" text,
	"external_id" text,
	"posting_status" text DEFAULT 'unposted' NOT NULL,
	"posting_date" timestamp with time zone,
	"posted_at" timestamp with time zone,
	"posted_by" text,
	"posting_batch_id" uuid,
	"doc_no" text,
	"supplier_id" uuid NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"exchange_rate" numeric(12, 6) DEFAULT '1',
	"expected_date" date,
	"payment_terms" text,
	"total_minor" bigint DEFAULT 0 NOT NULL,
	"discount_minor" bigint DEFAULT 0 NOT NULL,
	"tax_minor" bigint DEFAULT 0 NOT NULL,
	"grand_total_minor" bigint DEFAULT 0 NOT NULL,
	"billing_address_id" uuid,
	"shipping_address_id" uuid,
	"memo" text,
	CONSTRAINT "purchase_orders_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "po_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "po_company_required" CHECK (company_id IS NOT NULL),
	CONSTRAINT "po_total_non_negative" CHECK (total_minor >= 0),
	CONSTRAINT "po_tax_non_negative" CHECK (tax_minor >= 0),
	CONSTRAINT "po_grand_total_non_negative" CHECK (grand_total_minor >= 0),
	CONSTRAINT "po_posting_status_valid" CHECK (posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed'))
);
--> statement-breakpoint
ALTER TABLE "purchase_orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "purchase_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"company_id" uuid NOT NULL,
	"doc_status" text DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp with time zone,
	"submitted_by" text,
	"cancelled_at" timestamp with time zone,
	"cancelled_by" text,
	"amended_from_id" uuid,
	"external_source" text,
	"external_id" text,
	"request_no" text,
	"requested_by" text DEFAULT (auth.user_id()) NOT NULL,
	"department_id" uuid,
	"priority" text DEFAULT 'normal' NOT NULL,
	"required_by_date" text,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"total_minor" bigint DEFAULT 0 NOT NULL,
	"approved_by" text,
	"approved_at" text,
	"converted_to_purchase_order_id" uuid,
	"reason" text,
	"memo" text,
	CONSTRAINT "pr_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "pr_priority_valid" CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
	CONSTRAINT "pr_total_non_negative" CHECK (total_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE "purchase_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "quotation_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"quotation_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid,
	"item_code" text,
	"item_name" text,
	"description" text,
	"qty" numeric(20, 6) DEFAULT '1' NOT NULL,
	"uom_id" uuid,
	"rate_minor" bigint DEFAULT 0 NOT NULL,
	"amount_minor" bigint DEFAULT 0 NOT NULL,
	"discount_minor" bigint DEFAULT 0 NOT NULL,
	"tax_minor" bigint DEFAULT 0 NOT NULL,
	"net_minor" bigint DEFAULT 0 NOT NULL,
	"tax_rate_id" uuid,
	"memo" text,
	CONSTRAINT "quotation_lines_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "qtnl_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "qtnl_net_check" CHECK (net_minor = amount_minor - discount_minor + tax_minor),
	CONSTRAINT "qtnl_amount_non_negative" CHECK (amount_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE "quotation_lines" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "quotations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"company_id" uuid NOT NULL,
	"doc_status" text DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp with time zone,
	"submitted_by" text,
	"cancelled_at" timestamp with time zone,
	"cancelled_by" text,
	"amended_from_id" uuid,
	"external_source" text,
	"external_id" text,
	"doc_no" text,
	"party_type" text DEFAULT 'customer' NOT NULL,
	"party_id" uuid NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"exchange_rate" numeric(12, 6) DEFAULT '1',
	"valid_until" date,
	"total_minor" bigint DEFAULT 0 NOT NULL,
	"discount_minor" bigint DEFAULT 0 NOT NULL,
	"tax_minor" bigint DEFAULT 0 NOT NULL,
	"grand_total_minor" bigint DEFAULT 0 NOT NULL,
	"billing_address_id" uuid,
	"shipping_address_id" uuid,
	"payment_terms" text,
	"memo" text,
	CONSTRAINT "quotations_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "qtn_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "qtn_total_non_negative" CHECK (total_minor >= 0),
	CONSTRAINT "qtn_tax_non_negative" CHECK (tax_minor >= 0),
	CONSTRAINT "qtn_grand_total_non_negative" CHECK (grand_total_minor >= 0),
	CONSTRAINT "qtn_party_type_valid" CHECK (party_type IN ('customer', 'supplier'))
);
--> statement-breakpoint
ALTER TABLE "quotations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "reporting_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid NOT NULL,
	"fiscal_period_id" uuid NOT NULL,
	"snapshot_type" text NOT NULL,
	"snapshot_date" date NOT NULL,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL,
	"captured_by" text NOT NULL,
	"data" jsonb NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"total_debit_minor" bigint,
	"total_credit_minor" bigint,
	"memo" text,
	CONSTRAINT "rpt_snap_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "rpt_snap_type_valid" CHECK (snapshot_type IN ('trial_balance', 'balance_sheet', 'income_statement', 'aging_ar', 'aging_ap', 'inventory_valuation'))
);
--> statement-breakpoint
ALTER TABLE "reporting_snapshots" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "revenue_schedule_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"schedule_id" uuid NOT NULL,
	"fiscal_period_id" uuid,
	"period_date" date NOT NULL,
	"amount_minor" bigint NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"journal_entry_id" uuid,
	"memo" text,
	CONSTRAINT "rev_sched_lines_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "rev_sched_lines_status_valid" CHECK (status IN ('pending', 'recognized', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "revenue_schedule_lines" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "revenue_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid NOT NULL,
	"source_type" text NOT NULL,
	"source_id" uuid NOT NULL,
	"total_amount_minor" bigint NOT NULL,
	"recognized_amount_minor" bigint DEFAULT 0 NOT NULL,
	"deferred_amount_minor" bigint NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"method" text DEFAULT 'straight_line' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"revenue_account_id" uuid,
	"deferred_account_id" uuid,
	"memo" text,
	CONSTRAINT "rev_sched_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "rev_sched_method_valid" CHECK (method IN ('straight_line', 'usage_based', 'milestone', 'manual')),
	CONSTRAINT "rev_sched_status_valid" CHECK (status IN ('active', 'completed', 'cancelled')),
	CONSTRAINT "rev_sched_date_order" CHECK (start_date <= end_date)
);
--> statement-breakpoint
ALTER TABLE "revenue_schedules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sales_invoice_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"sales_invoice_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid,
	"item_code" text,
	"item_name" text,
	"description" text,
	"qty" numeric(20, 6) DEFAULT '1' NOT NULL,
	"uom_id" uuid,
	"rate_minor" bigint DEFAULT 0 NOT NULL,
	"amount_minor" bigint DEFAULT 0 NOT NULL,
	"discount_minor" bigint DEFAULT 0 NOT NULL,
	"tax_minor" bigint DEFAULT 0 NOT NULL,
	"net_minor" bigint DEFAULT 0 NOT NULL,
	"tax_rate_id" uuid,
	"coa_income_id" uuid,
	"cost_center_id" uuid,
	"project_id" uuid,
	"warehouse_id" uuid,
	"posting_date" timestamp with time zone,
	"source_doc_type" text,
	"source_line_id" uuid,
	"memo" text,
	CONSTRAINT "sales_invoice_lines_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "sil_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "sil_net_check" CHECK (net_minor = amount_minor - discount_minor + tax_minor),
	CONSTRAINT "sil_amount_non_negative" CHECK (amount_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE "sales_invoice_lines" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sales_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"company_id" uuid NOT NULL,
	"doc_status" text DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp with time zone,
	"submitted_by" text,
	"cancelled_at" timestamp with time zone,
	"cancelled_by" text,
	"amended_from_id" uuid,
	"external_source" text,
	"external_id" text,
	"posting_status" text DEFAULT 'unposted' NOT NULL,
	"posting_date" timestamp with time zone,
	"posted_at" timestamp with time zone,
	"posted_by" text,
	"posting_batch_id" uuid,
	"doc_no" text,
	"customer_id" uuid NOT NULL,
	"due_date" date,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"exchange_rate" numeric(12, 6) DEFAULT '1',
	"total_minor" bigint DEFAULT 0 NOT NULL,
	"discount_minor" bigint DEFAULT 0 NOT NULL,
	"tax_minor" bigint DEFAULT 0 NOT NULL,
	"grand_total_minor" bigint DEFAULT 0 NOT NULL,
	"paid_minor" bigint DEFAULT 0 NOT NULL,
	"outstanding_minor" bigint DEFAULT 0 NOT NULL,
	"coa_receivable_id" uuid,
	"is_tax_included" boolean DEFAULT false NOT NULL,
	"billing_address_id" uuid,
	"shipping_address_id" uuid,
	"payment_terms" text,
	"memo" text,
	CONSTRAINT "sales_invoices_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "si_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "si_company_required" CHECK (company_id IS NOT NULL),
	CONSTRAINT "si_total_non_negative" CHECK (total_minor >= 0),
	CONSTRAINT "si_tax_non_negative" CHECK (tax_minor >= 0),
	CONSTRAINT "si_grand_total_non_negative" CHECK (grand_total_minor >= 0),
	CONSTRAINT "si_paid_non_negative" CHECK (paid_minor >= 0),
	CONSTRAINT "si_outstanding_non_negative" CHECK (outstanding_minor >= 0),
	CONSTRAINT "si_posting_status_valid" CHECK (posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed'))
);
--> statement-breakpoint
ALTER TABLE "sales_invoices" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sales_order_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"sales_order_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"item_id" uuid,
	"item_code" text,
	"item_name" text,
	"description" text,
	"qty" numeric(20, 6) DEFAULT '1' NOT NULL,
	"uom_id" uuid,
	"rate_minor" bigint DEFAULT 0 NOT NULL,
	"amount_minor" bigint DEFAULT 0 NOT NULL,
	"discount_minor" bigint DEFAULT 0 NOT NULL,
	"tax_minor" bigint DEFAULT 0 NOT NULL,
	"net_minor" bigint DEFAULT 0 NOT NULL,
	"tax_rate_id" uuid,
	"cost_center_id" uuid,
	"project_id" uuid,
	"warehouse_id" uuid,
	"delivered_qty" numeric(20, 6) DEFAULT '0' NOT NULL,
	"billed_qty" numeric(20, 6) DEFAULT '0' NOT NULL,
	"posting_date" timestamp with time zone,
	"source_doc_type" text,
	"source_line_id" uuid,
	"memo" text,
	CONSTRAINT "sales_order_lines_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "sol_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "sol_net_check" CHECK (net_minor = amount_minor - discount_minor + tax_minor),
	CONSTRAINT "sol_amount_non_negative" CHECK (amount_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE "sales_order_lines" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sales_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"company_id" uuid NOT NULL,
	"doc_status" text DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp with time zone,
	"submitted_by" text,
	"cancelled_at" timestamp with time zone,
	"cancelled_by" text,
	"amended_from_id" uuid,
	"external_source" text,
	"external_id" text,
	"posting_status" text DEFAULT 'unposted' NOT NULL,
	"posting_date" timestamp with time zone,
	"posted_at" timestamp with time zone,
	"posted_by" text,
	"posting_batch_id" uuid,
	"doc_no" text,
	"customer_id" uuid NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"exchange_rate" numeric(12, 6) DEFAULT '1',
	"delivery_date" date,
	"payment_terms" text,
	"total_minor" bigint DEFAULT 0 NOT NULL,
	"discount_minor" bigint DEFAULT 0 NOT NULL,
	"tax_minor" bigint DEFAULT 0 NOT NULL,
	"grand_total_minor" bigint DEFAULT 0 NOT NULL,
	"billing_address_id" uuid,
	"shipping_address_id" uuid,
	"memo" text,
	CONSTRAINT "sales_orders_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "so_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "so_company_required" CHECK (company_id IS NOT NULL),
	CONSTRAINT "so_total_non_negative" CHECK (total_minor >= 0),
	CONSTRAINT "so_tax_non_negative" CHECK (tax_minor >= 0),
	CONSTRAINT "so_grand_total_non_negative" CHECK (grand_total_minor >= 0),
	CONSTRAINT "so_posting_status_valid" CHECK (posting_status IN ('unposted', 'posting', 'posted', 'failed', 'reversing', 'reversed'))
);
--> statement-breakpoint
ALTER TABLE "sales_orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "stock_balances" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"company_id" uuid NOT NULL,
	"site_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"qty_on_hand" numeric(20, 6) DEFAULT '0' NOT NULL,
	"qty_reserved" numeric(20, 6) DEFAULT '0' NOT NULL,
	"qty_ordered" numeric(20, 6) DEFAULT '0' NOT NULL,
	"valuation_minor" bigint DEFAULT 0 NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"last_movement_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stock_balances_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "stock_bal_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "stock_balances" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "stock_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid NOT NULL,
	"site_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"movement_type" text NOT NULL,
	"qty" numeric(20, 6) NOT NULL,
	"uom_id" uuid,
	"unit_cost_minor" bigint DEFAULT 0 NOT NULL,
	"total_cost_minor" bigint DEFAULT 0 NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"posted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"source_type" text,
	"source_id" uuid,
	"batch_no" text,
	"serial_no" text,
	"lot_no" text,
	"costing_method" text DEFAULT 'weighted_average' NOT NULL,
	"running_qty" numeric(20, 6),
	"running_cost_minor" bigint,
	"warehouse_zone" text,
	"memo" text,
	CONSTRAINT "stock_mv_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "stock_mv_type_valid" CHECK (movement_type IN ('receipt', 'issue', 'transfer_in', 'transfer_out', 'adjustment', 'return', 'scrap')),
	CONSTRAINT "stock_mv_costing_valid" CHECK (costing_method IN ('fifo', 'lifo', 'weighted_average', 'specific'))
);
--> statement-breakpoint
ALTER TABLE "stock_movements" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "supplier_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"contact_id" uuid NOT NULL,
	"company_id" uuid,
	"supplier_code" text,
	"default_currency_code" text DEFAULT 'MYR' NOT NULL,
	"default_tax_code" text,
	"payment_terms_id" uuid,
	"default_warehouse_id" uuid,
	"payable_account_id" uuid,
	"lead_time_days" integer,
	"supplier_group" text,
	"supplier_rating" text,
	"memo" text,
	CONSTRAINT "supplier_profiles_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "supp_prof_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "supp_prof_lead_time_non_negative" CHECK (lead_time_days IS NULL OR lead_time_days >= 0)
);
--> statement-breakpoint
ALTER TABLE "supplier_profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tax_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"tax_code" text NOT NULL,
	"name" text NOT NULL,
	"rate" numeric(10, 6) NOT NULL,
	"jurisdiction" text,
	"tax_type" text DEFAULT 'gst' NOT NULL,
	"rounding_method" text DEFAULT 'half_up' NOT NULL,
	"rounding_precision" integer DEFAULT 2 NOT NULL,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"is_compound" boolean DEFAULT false NOT NULL,
	"description" text,
	CONSTRAINT "tax_rates_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "tax_rates_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "tax_rates_rate_non_negative" CHECK (rate >= 0),
	CONSTRAINT "tax_rates_tax_type_valid" CHECK (tax_type IN ('gst', 'vat', 'sales_tax', 'service_tax', 'withholding', 'exempt', 'zero_rated')),
	CONSTRAINT "tax_rates_rounding_valid" CHECK (rounding_method IN ('half_up', 'half_down', 'ceil', 'floor', 'banker')),
	CONSTRAINT "tax_rates_date_order" CHECK (effective_to IS NULL OR effective_from <= effective_to)
);
--> statement-breakpoint
ALTER TABLE "tax_rates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "warehouses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid NOT NULL,
	"site_id" uuid,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"warehouse_type" text DEFAULT 'store' NOT NULL,
	"parent_warehouse_id" uuid,
	"is_group" boolean DEFAULT false NOT NULL,
	CONSTRAINT "warehouses_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "warehouses_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "warehouses_code_not_empty" CHECK (code <> ''),
	CONSTRAINT "warehouses_type_valid" CHECK (warehouse_type IN ('store', 'transit', 'scrap', 'wip', 'finished', 'returns'))
);
--> statement-breakpoint
ALTER TABLE "warehouses" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "webhook_deliveries" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"endpoint_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"status_code" text,
	"response_body" text,
	"attempt_number" integer DEFAULT 1 NOT NULL,
	"delivered_at" timestamp with time zone DEFAULT now() NOT NULL,
	"duration_ms" integer,
	"error" text,
	CONSTRAINT "webhook_deliveries_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "webhook_del_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "webhook_deliveries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "webhook_endpoints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"url" text NOT NULL,
	"secret" text NOT NULL,
	"description" text,
	"subscribed_events" jsonb DEFAULT '[]' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_delivered_at" timestamp with time zone,
	"last_status_code" text,
	"failure_count" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb,
	CONSTRAINT "webhook_ep_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "webhook_ep_url_not_empty" CHECK (url <> '')
);
--> statement-breakpoint
ALTER TABLE "webhook_endpoints" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "wip_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid NOT NULL,
	"work_order_id" uuid NOT NULL,
	"movement_type" text NOT NULL,
	"product_id" uuid,
	"qty" numeric(20, 6),
	"uom_id" uuid,
	"cost_minor" bigint DEFAULT 0 NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"posted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"stock_movement_id" uuid,
	"journal_entry_id" uuid,
	"memo" text,
	CONSTRAINT "wip_mv_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "wip_mv_type_valid" CHECK (movement_type IN ('material_issue', 'material_return', 'labor', 'overhead', 'completion', 'scrap'))
);
--> statement-breakpoint
ALTER TABLE "wip_movements" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "work_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"company_id" uuid NOT NULL,
	"doc_status" text DEFAULT 'draft' NOT NULL,
	"submitted_at" timestamp with time zone,
	"submitted_by" text,
	"cancelled_at" timestamp with time zone,
	"cancelled_by" text,
	"amended_from_id" uuid,
	"external_source" text,
	"external_id" text,
	"work_order_no" text,
	"bom_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"planned_qty" numeric(20, 6) NOT NULL,
	"completed_qty" numeric(20, 6) DEFAULT '0' NOT NULL,
	"scrap_qty" numeric(20, 6) DEFAULT '0' NOT NULL,
	"uom_id" uuid,
	"planned_start" timestamp with time zone,
	"planned_end" timestamp with time zone,
	"actual_start" timestamp with time zone,
	"actual_end" timestamp with time zone,
	"wip_account_id" uuid,
	"total_cost_minor" bigint DEFAULT 0 NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"memo" text,
	CONSTRAINT "work_orders_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "work_orders_qty_positive" CHECK (planned_qty > 0)
);
--> statement-breakpoint
ALTER TABLE "work_orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workflow_definitions" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"entity_type" text NOT NULL,
	"name" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"definition_kind" text NOT NULL,
	"nodes_json" jsonb,
	"edges_json" jsonb,
	"slots_json" jsonb,
	"base_ref" jsonb,
	"body_patches_json" jsonb,
	"compiled_json" jsonb,
	"compiled_hash" text,
	"compiler_version" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workflow_definitions_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "wf_def_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "wf_def_status_valid" CHECK (status IN ('draft', 'published', 'archived')),
	CONSTRAINT "wf_def_kind_valid" CHECK (definition_kind IN ('envelope', 'org_patch', 'effective')),
	CONSTRAINT "wf_def_envelope_check" CHECK (
      definition_kind <> 'envelope' OR (
        nodes_json IS NOT NULL AND edges_json IS NOT NULL AND slots_json IS NOT NULL
        AND body_patches_json IS NULL
      )
    ),
	CONSTRAINT "wf_def_org_patch_check" CHECK (
      definition_kind <> 'org_patch' OR (
        body_patches_json IS NOT NULL AND base_ref IS NOT NULL
        AND nodes_json IS NULL AND edges_json IS NULL
      )
    ),
	CONSTRAINT "wf_def_effective_check" CHECK (
      definition_kind <> 'effective' OR (
        compiled_json IS NOT NULL AND compiled_hash IS NOT NULL
        AND nodes_json IS NOT NULL AND edges_json IS NOT NULL
      )
    )
);
--> statement-breakpoint
ALTER TABLE "workflow_definitions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workflow_events_outbox" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"instance_id" uuid NOT NULL,
	"entity_version" integer NOT NULL,
	"definition_version" integer,
	"event_type" text NOT NULL,
	"payload_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"event_idempotency_key" text NOT NULL,
	"trace_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 5 NOT NULL,
	"next_retry_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"error" text,
	CONSTRAINT "wf_evt_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "wf_evt_status_valid" CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'dead_letter'))
);
--> statement-breakpoint
ALTER TABLE "workflow_events_outbox" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workflow_instances" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"definition_id" uuid NOT NULL,
	"definition_version" integer NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"entity_version" integer NOT NULL,
	"active_tokens" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"current_nodes" text[] DEFAULT '{}' NOT NULL,
	"status" text DEFAULT 'running' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_step_execution_id" uuid,
	"context_json" jsonb DEFAULT '{}'::jsonb,
	CONSTRAINT "workflow_instances_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "wf_inst_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "wf_inst_status_valid" CHECK (status IN ('running', 'paused', 'completed', 'failed', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "workflow_instances" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workflow_outbox_receipts" (
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"instance_id" uuid NOT NULL,
	"source_table" text NOT NULL,
	"event_idempotency_key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "wf_or_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "wf_or_source_valid" CHECK (source_table IN ('events', 'side_effects'))
);
--> statement-breakpoint
ALTER TABLE "workflow_outbox_receipts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workflow_side_effects_outbox" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"instance_id" uuid NOT NULL,
	"step_execution_id" uuid NOT NULL,
	"effect_type" text NOT NULL,
	"payload_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"event_idempotency_key" text NOT NULL,
	"trace_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 5 NOT NULL,
	"next_retry_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"error" text,
	"response_json" jsonb,
	CONSTRAINT "wf_se_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "wf_se_status_valid" CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'dead_letter')),
	CONSTRAINT "wf_se_effect_type_valid" CHECK (effect_type IN ('webhook', 'email', 'sms', 'integration'))
);
--> statement-breakpoint
ALTER TABLE "workflow_side_effects_outbox" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workflow_step_executions" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"instance_id" uuid NOT NULL,
	"node_id" text NOT NULL,
	"node_type" text NOT NULL,
	"token_id" text NOT NULL,
	"entity_version" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"run_as" text DEFAULT 'actor' NOT NULL,
	"idempotency_key" text NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"duration_ms" integer,
	"input_json" jsonb,
	"output_json" jsonb,
	"error" text,
	"actor_user_id" text,
	"approval_request_id" uuid,
	"applied" boolean,
	"snapshot_version_id" uuid,
	"resume_at" timestamp with time zone,
	"waiting_for_event_key" text,
	CONSTRAINT "wf_step_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "wf_step_status_valid" CHECK (status IN ('pending', 'running', 'completed', 'failed', 'skipped', 'cancelled')),
	CONSTRAINT "wf_step_run_as_valid" CHECK (run_as IN ('actor', 'system', 'service_account'))
);
--> statement-breakpoint
ALTER TABLE "workflow_step_executions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workflow_step_receipts" (
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"instance_id" uuid NOT NULL,
	"idempotency_key" text NOT NULL,
	"step_execution_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "wf_sr_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "workflow_step_receipts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "r2_files" DROP CONSTRAINT "r2_files_object_key_unique";--> statement-breakpoint
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_perms_verb_valid";--> statement-breakpoint
ALTER TABLE "r2_files" DROP CONSTRAINT "r2_files_user_id_users_user_id_fk";
--> statement-breakpoint
DROP INDEX "companies_org_id_idx";--> statement-breakpoint
DROP INDEX "contacts_org_id_idx";--> statement-breakpoint
DROP INDEX "r2_files_user_id_idx";--> statement-breakpoint
DROP INDEX "uom_conversions_org_from_to_uniq";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'advisories'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "advisories" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'advisory_evidence'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "advisory_evidence" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'api_keys'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "api_keys" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'audit_logs'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "audit_logs" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'communications'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "communications" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "company_id" SET NOT NULL;--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'currencies'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "currencies" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'custom_field_sync_queue'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "custom_field_sync_queue" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'custom_field_values'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "custom_field_values" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'custom_fields'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "custom_fields" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'entity_attachments'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "entity_attachments" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'entity_versions'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "entity_versions" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'entity_view_fields'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "entity_view_fields" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'entity_views'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "entity_views" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'meta_alias_resolution_rules'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "meta_alias_resolution_rules" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'meta_alias_sets'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "meta_alias_sets" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'meta_aliases'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "meta_aliases" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'meta_assets'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "meta_assets" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'meta_lineage_edges'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "meta_lineage_edges" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'meta_quality_checks'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "meta_quality_checks" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'meta_semantic_terms'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "meta_semantic_terms" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'meta_term_links'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "meta_term_links" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'meta_value_aliases'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "meta_value_aliases" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'mutation_batches'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "mutation_batches" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'number_sequences'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "number_sequences" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "number_sequences" ALTER COLUMN "company_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "r2_files" ALTER COLUMN "file_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "r2_files" ALTER COLUMN "content_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "r2_files" ALTER COLUMN "size_bytes" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "r2_files" ALTER COLUMN "size_bytes" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "r2_files" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "r2_files" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'role_permissions'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "role_permissions" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'roles'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "roles" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "sites" ALTER COLUMN "company_id" SET NOT NULL;--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'uom'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "uom" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'uom_conversions'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "uom_conversions" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'user_roles'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "user_roles" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'user_scopes'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "user_scopes" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'workflow_executions'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "workflow_executions" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "advisories" ADD CONSTRAINT "advisories_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "advisory_evidence" ADD CONSTRAINT "advisory_evidence_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "communications" ADD CONSTRAINT "communications_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "currencies" ADD CONSTRAINT "currencies_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "custom_field_sync_queue" ADD CONSTRAINT "custom_field_sync_queue_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "custom_field_values" ADD CONSTRAINT "custom_field_values_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "custom_fields" ADD CONSTRAINT "custom_fields_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "entity_attachments" ADD CONSTRAINT "entity_attachments_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "entity_versions" ADD CONSTRAINT "entity_versions_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "entity_view_fields" ADD CONSTRAINT "entity_view_fields_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "entity_views" ADD CONSTRAINT "entity_views_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "meta_alias_resolution_rules" ADD CONSTRAINT "meta_alias_resolution_rules_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "meta_alias_sets" ADD CONSTRAINT "meta_alias_sets_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "meta_aliases" ADD CONSTRAINT "meta_aliases_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "meta_assets" ADD CONSTRAINT "meta_assets_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "meta_lineage_edges" ADD CONSTRAINT "meta_lineage_edges_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "meta_quality_checks" ADD CONSTRAINT "meta_quality_checks_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "meta_semantic_terms" ADD CONSTRAINT "meta_semantic_terms_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "meta_term_links" ADD CONSTRAINT "meta_term_links_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "meta_value_aliases" ADD CONSTRAINT "meta_value_aliases_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "mutation_batches" ADD CONSTRAINT "mutation_batches_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "number_sequences" ADD CONSTRAINT "number_sequences_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "uom" ADD CONSTRAINT "uom_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "uom_conversions" ADD CONSTRAINT "uom_conversions_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "user_scopes" ADD CONSTRAINT "user_scopes_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "workflow_executions" ADD CONSTRAINT "workflow_executions_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "workflow_rules" ADD CONSTRAINT "workflow_rules_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "org_timezone" text DEFAULT 'Asia/Kuala_Lumpur' NOT NULL;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "external_source" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "external_id" text;--> statement-breakpoint
ALTER TABLE "entity_attachments" ADD COLUMN "category" text DEFAULT 'general' NOT NULL;--> statement-breakpoint
ALTER TABLE "entity_attachments" ADD COLUMN "file_name" text;--> statement-breakpoint
ALTER TABLE "entity_attachments" ADD COLUMN "content_type" text;--> statement-breakpoint
ALTER TABLE "entity_attachments" ADD COLUMN "size_bytes" bigint;--> statement-breakpoint
ALTER TABLE "entity_attachments" ADD COLUMN "is_primary" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "entity_attachments" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "r2_files" ADD COLUMN "org_id" text DEFAULT (auth.require_org_id()) NOT NULL;--> statement-breakpoint
ALTER TABLE "r2_files" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "r2_files" ADD COLUMN "created_by" text DEFAULT (auth.user_id()) NOT NULL;--> statement-breakpoint
ALTER TABLE "r2_files" ADD COLUMN "updated_by" text DEFAULT (auth.user_id()) NOT NULL;--> statement-breakpoint
ALTER TABLE "r2_files" ADD COLUMN "version" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "r2_files" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "r2_files" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "r2_files" ADD COLUMN "deleted_by" text;--> statement-breakpoint
ALTER TABLE "r2_files" ADD COLUMN "company_id" uuid;--> statement-breakpoint
ALTER TABLE "r2_files" ADD COLUMN "uploaded_by" text DEFAULT (auth.user_id()) NOT NULL;--> statement-breakpoint
ALTER TABLE "r2_files" ADD COLUMN "folder_path" text DEFAULT '/' NOT NULL;--> statement-breakpoint
ALTER TABLE "r2_files" ADD COLUMN "scan_status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "r2_files" ADD COLUMN "scan_message" text;--> statement-breakpoint
ALTER TABLE "r2_files" ADD COLUMN "scanned_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "r2_files" ADD COLUMN "replaced_by_id" uuid;--> statement-breakpoint
ALTER TABLE "r2_files" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "uom_conversions" ADD COLUMN "rounding_method" text DEFAULT 'half_up' NOT NULL;--> statement-breakpoint
ALTER TABLE "uom_conversions" ADD COLUMN "rounding_precision" integer DEFAULT 6 NOT NULL;--> statement-breakpoint
ALTER TABLE "uom_conversions" ADD COLUMN "scope" text DEFAULT 'global' NOT NULL;--> statement-breakpoint
ALTER TABLE "uom_conversions" ADD COLUMN "product_id" uuid;--> statement-breakpoint
ALTER TABLE "migration_checkpoints" ADD CONSTRAINT "migration_checkpoints_migration_job_id_migration_jobs_id_fk" FOREIGN KEY ("migration_job_id") REFERENCES "public"."migration_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "migration_conflict_resolutions" ADD CONSTRAINT "migration_conflict_resolutions_conflict_id_migration_conflicts_id_fk" FOREIGN KEY ("conflict_id") REFERENCES "public"."migration_conflicts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "migration_conflict_resolutions" ADD CONSTRAINT "migration_conflict_resolutions_migration_job_id_migration_jobs_id_fk" FOREIGN KEY ("migration_job_id") REFERENCES "public"."migration_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "migration_conflicts" ADD CONSTRAINT "migration_conflicts_migration_job_id_migration_jobs_id_fk" FOREIGN KEY ("migration_job_id") REFERENCES "public"."migration_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "migration_lineage" ADD CONSTRAINT "migration_lineage_migration_job_id_migration_jobs_id_fk" FOREIGN KEY ("migration_job_id") REFERENCES "public"."migration_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "migration_merge_explanations" ADD CONSTRAINT "migration_merge_explanations_migration_job_id_migration_jobs_id_fk" FOREIGN KEY ("migration_job_id") REFERENCES "public"."migration_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "migration_quarantine" ADD CONSTRAINT "migration_quarantine_migration_job_id_migration_jobs_id_fk" FOREIGN KEY ("migration_job_id") REFERENCES "public"."migration_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "migration_reports" ADD CONSTRAINT "migration_reports_job_id_migration_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."migration_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "migration_row_snapshots" ADD CONSTRAINT "migration_row_snapshots_migration_job_id_migration_jobs_id_fk" FOREIGN KEY ("migration_job_id") REFERENCES "public"."migration_jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "addresses_org_id_idx" ON "addresses" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "approval_chains_org_id_idx" ON "approval_chains" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "approval_chains_org_entity_idx" ON "approval_chains" USING btree ("org_id","entity_type");--> statement-breakpoint
CREATE UNIQUE INDEX "approval_chains_org_company_entity_uniq" ON "approval_chains" USING btree ("org_id","company_id","entity_type");--> statement-breakpoint
CREATE INDEX "approval_dec_org_id_idx" ON "approval_decisions" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "approval_dec_request_idx" ON "approval_decisions" USING btree ("org_id","request_id");--> statement-breakpoint
CREATE INDEX "approval_dec_step_idx" ON "approval_decisions" USING btree ("org_id","step_id");--> statement-breakpoint
CREATE INDEX "approval_req_org_id_idx" ON "approval_requests" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "approval_req_entity_idx" ON "approval_requests" USING btree ("org_id","entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "approval_req_chain_idx" ON "approval_requests" USING btree ("org_id","chain_id");--> statement-breakpoint
CREATE INDEX "approval_req_status_idx" ON "approval_requests" USING btree ("org_id","status");--> statement-breakpoint
CREATE INDEX "approval_steps_org_id_idx" ON "approval_steps" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "approval_steps_chain_idx" ON "approval_steps" USING btree ("org_id","chain_id");--> statement-breakpoint
CREATE UNIQUE INDEX "approval_steps_chain_order_uniq" ON "approval_steps" USING btree ("org_id","chain_id","step_order");--> statement-breakpoint
CREATE INDEX "bank_acct_org_id_idx" ON "bank_accounts" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "bank_acct_org_company_idx" ON "bank_accounts" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "bank_acct_org_company_number_uniq" ON "bank_accounts" USING btree ("org_id","company_id","account_number");--> statement-breakpoint
CREATE INDEX "bank_recon_org_id_idx" ON "bank_reconciliation_sessions" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "bank_recon_org_company_idx" ON "bank_reconciliation_sessions" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "bank_recon_org_bank_acct_idx" ON "bank_reconciliation_sessions" USING btree ("org_id","bank_account_id");--> statement-breakpoint
CREATE INDEX "bank_recon_status_idx" ON "bank_reconciliation_sessions" USING btree ("org_id","status");--> statement-breakpoint
CREATE INDEX "bsl_org_id_idx" ON "bank_statement_lines" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "bsl_company_idx" ON "bank_statement_lines" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "bsl_bank_account_idx" ON "bank_statement_lines" USING btree ("org_id","bank_account_id");--> statement-breakpoint
CREATE INDEX "bsl_statement_date_idx" ON "bank_statement_lines" USING btree ("org_id","bank_account_id","statement_date");--> statement-breakpoint
CREATE INDEX "bsl_import_batch_idx" ON "bank_statement_lines" USING btree ("org_id","import_batch_id");--> statement-breakpoint
CREATE INDEX "bsl_unreconciled_idx" ON "bank_statement_lines" USING btree ("org_id","company_id","is_reconciled");--> statement-breakpoint
CREATE INDEX "bom_lines_org_id_idx" ON "bom_lines" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "bom_lines_bom_idx" ON "bom_lines" USING btree ("org_id","bom_id");--> statement-breakpoint
CREATE INDEX "bom_lines_component_idx" ON "bom_lines" USING btree ("org_id","component_product_id");--> statement-breakpoint
CREATE INDEX "boms_org_id_idx" ON "boms" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "boms_product_idx" ON "boms" USING btree ("org_id","company_id","product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "boms_org_company_product_ver_uniq" ON "boms" USING btree ("org_id","company_id","product_id","bom_version");--> statement-breakpoint
CREATE INDEX "budget_commit_org_id_idx" ON "budget_commitments" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "budget_commit_budget_idx" ON "budget_commitments" USING btree ("org_id","budget_id");--> statement-breakpoint
CREATE INDEX "budget_commit_source_idx" ON "budget_commitments" USING btree ("org_id","source_type","source_id");--> statement-breakpoint
CREATE INDEX "budgets_org_id_idx" ON "budgets" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "budgets_company_idx" ON "budgets" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "budgets_period_idx" ON "budgets" USING btree ("org_id","fiscal_period_id");--> statement-breakpoint
CREATE UNIQUE INDEX "budgets_org_period_account_cc_proj_uniq" ON "budgets" USING btree ("org_id","company_id","fiscal_period_id","account_id","cost_center_id","project_id");--> statement-breakpoint
CREATE INDEX "coa_org_id_idx" ON "chart_of_accounts" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "coa_org_company_idx" ON "chart_of_accounts" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "coa_org_company_type_idx" ON "chart_of_accounts" USING btree ("org_id","company_id","account_type");--> statement-breakpoint
CREATE UNIQUE INDEX "coa_org_company_code_uniq" ON "chart_of_accounts" USING btree ("org_id","company_id","account_code");--> statement-breakpoint
CREATE UNIQUE INDEX "company_addr_org_company_addr_uniq" ON "company_addresses" USING btree ("org_id","company_id","address_id");--> statement-breakpoint
CREATE UNIQUE INDEX "company_addr_org_company_type_primary_uniq" ON "company_addresses" USING btree ("org_id","company_id","address_type") WHERE is_primary = true;--> statement-breakpoint
CREATE UNIQUE INDEX "contact_addr_org_contact_addr_uniq" ON "contact_addresses" USING btree ("org_id","contact_id","address_id");--> statement-breakpoint
CREATE UNIQUE INDEX "contact_addr_org_contact_type_primary_uniq" ON "contact_addresses" USING btree ("org_id","contact_id","address_type") WHERE is_primary = true;--> statement-breakpoint
CREATE INDEX "contracts_org_id_idx" ON "contracts" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "contracts_org_company_idx" ON "contracts" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "contracts_contact_idx" ON "contracts" USING btree ("org_id","contact_id");--> statement-breakpoint
CREATE INDEX "contracts_status_idx" ON "contracts" USING btree ("org_id","doc_status");--> statement-breakpoint
CREATE UNIQUE INDEX "contracts_org_contract_no_uniq" ON "contracts" USING btree ("org_id","contract_no") WHERE contract_no IS NOT NULL;--> statement-breakpoint
CREATE INDEX "cost_centers_org_id_idx" ON "cost_centers" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "cost_centers_org_company_idx" ON "cost_centers" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "cost_centers_org_company_code_uniq" ON "cost_centers" USING btree ("org_id","company_id","code");--> statement-breakpoint
CREATE INDEX "credit_notes_org_id_idx" ON "credit_notes" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "credit_notes_org_company_idx" ON "credit_notes" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "credit_notes_reverses_idx" ON "credit_notes" USING btree ("org_id","reverses_type","reverses_id");--> statement-breakpoint
CREATE INDEX "credit_notes_contact_idx" ON "credit_notes" USING btree ("org_id","contact_id");--> statement-breakpoint
CREATE INDEX "cust_prof_org_id_idx" ON "customer_profiles" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "cust_prof_org_company_idx" ON "customer_profiles" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "cust_prof_org_contact_uniq" ON "customer_profiles" USING btree ("org_id","contact_id");--> statement-breakpoint
CREATE INDEX "debit_notes_org_id_idx" ON "debit_notes" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "debit_notes_org_company_idx" ON "debit_notes" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "debit_notes_reverses_idx" ON "debit_notes" USING btree ("org_id","reverses_type","reverses_id");--> statement-breakpoint
CREATE INDEX "debit_notes_contact_idx" ON "debit_notes" USING btree ("org_id","contact_id");--> statement-breakpoint
CREATE UNIQUE INDEX "dnl_org_note_line_uniq" ON "delivery_note_lines" USING btree ("org_id","delivery_note_id","line_no");--> statement-breakpoint
CREATE INDEX "dnl_org_note_idx" ON "delivery_note_lines" USING btree ("org_id","delivery_note_id");--> statement-breakpoint
CREATE INDEX "dnl_org_item_idx" ON "delivery_note_lines" USING btree ("org_id","item_id");--> statement-breakpoint
CREATE INDEX "dnl_org_item_posting_idx" ON "delivery_note_lines" USING btree ("org_id","item_id","posting_date");--> statement-breakpoint
CREATE UNIQUE INDEX "dn_org_doc_no_uniq" ON "delivery_notes" USING btree ("org_id","doc_no");--> statement-breakpoint
CREATE INDEX "dn_org_customer_posting_idx" ON "delivery_notes" USING btree ("org_id","customer_id","posting_date");--> statement-breakpoint
CREATE INDEX "dn_org_posting_date_idx" ON "delivery_notes" USING btree ("org_id","posting_date");--> statement-breakpoint
CREATE INDEX "dn_org_posting_status_idx" ON "delivery_notes" USING btree ("org_id","posting_status","posting_date");--> statement-breakpoint
CREATE INDEX "disc_rules_org_id_idx" ON "discount_rules" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "disc_rules_scope_idx" ON "discount_rules" USING btree ("org_id","scope");--> statement-breakpoint
CREATE INDEX "disc_rules_customer_idx" ON "discount_rules" USING btree ("org_id","customer_id");--> statement-breakpoint
CREATE INDEX "disc_rules_product_idx" ON "discount_rules" USING btree ("org_id","product_id");--> statement-breakpoint
CREATE INDEX "disc_rules_precedence_idx" ON "discount_rules" USING btree ("org_id","precedence");--> statement-breakpoint
CREATE UNIQUE INDEX "doc_links_org_src_tgt_type_uniq" ON "doc_links" USING btree ("org_id","source_type","source_id","target_type","target_id","link_type");--> statement-breakpoint
CREATE INDEX "doc_links_org_target_idx" ON "doc_links" USING btree ("org_id","target_type","target_id");--> statement-breakpoint
CREATE INDEX "doc_links_org_source_idx" ON "doc_links" USING btree ("org_id","source_type","source_id");--> statement-breakpoint
CREATE UNIQUE INDEX "doc_postings_org_idemp_uniq" ON "doc_postings" USING btree ("org_id","idempotency_key");--> statement-breakpoint
CREATE UNIQUE INDEX "doc_postings_org_doc_active_uniq" ON "doc_postings" USING btree ("org_id","doc_type","doc_id") WHERE status IN ('posting', 'posted', 'reversing');--> statement-breakpoint
CREATE INDEX "doc_postings_org_batch_idx" ON "doc_postings" USING btree ("org_id","posting_batch_id");--> statement-breakpoint
CREATE INDEX "doc_postings_org_run_idx" ON "doc_postings" USING btree ("org_id","posting_run_id");--> statement-breakpoint
CREATE INDEX "doc_postings_org_type_posted_idx" ON "doc_postings" USING btree ("org_id","doc_type","posted_at");--> statement-breakpoint
CREATE INDEX "doc_postings_org_status_idx" ON "doc_postings" USING btree ("org_id","status");--> statement-breakpoint
CREATE INDEX "fiscal_periods_org_id_idx" ON "fiscal_periods" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "fiscal_periods_org_company_idx" ON "fiscal_periods" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "fiscal_periods_lookup_idx" ON "fiscal_periods" USING btree ("org_id","company_id","start_date","end_date");--> statement-breakpoint
CREATE UNIQUE INDEX "fiscal_periods_org_company_start_uniq" ON "fiscal_periods" USING btree ("org_id","company_id","start_date");--> statement-breakpoint
CREATE INDEX "asset_events_org_id_idx" ON "asset_events" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "asset_events_asset_idx" ON "asset_events" USING btree ("org_id","asset_id");--> statement-breakpoint
CREATE INDEX "assets_org_id_idx" ON "assets" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "assets_org_company_idx" ON "assets" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "assets_status_idx" ON "assets" USING btree ("org_id","status");--> statement-breakpoint
CREATE INDEX "dep_sched_org_id_idx" ON "depreciation_schedules" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "dep_sched_asset_idx" ON "depreciation_schedules" USING btree ("org_id","asset_id");--> statement-breakpoint
CREATE INDEX "dep_sched_period_idx" ON "depreciation_schedules" USING btree ("org_id","fiscal_period_id");--> statement-breakpoint
CREATE INDEX "fx_rates_org_id_idx" ON "fx_rates" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "fx_rates_lookup_idx" ON "fx_rates" USING btree ("org_id","from_code","to_code","effective_date");--> statement-breakpoint
CREATE UNIQUE INDEX "fx_rates_org_pair_date_source_uniq" ON "fx_rates" USING btree ("org_id","from_code","to_code","effective_date","source");--> statement-breakpoint
CREATE UNIQUE INDEX "grl_org_receipt_line_uniq" ON "goods_receipt_lines" USING btree ("org_id","goods_receipt_id","line_no");--> statement-breakpoint
CREATE INDEX "grl_org_receipt_idx" ON "goods_receipt_lines" USING btree ("org_id","goods_receipt_id");--> statement-breakpoint
CREATE INDEX "grl_org_item_idx" ON "goods_receipt_lines" USING btree ("org_id","item_id");--> statement-breakpoint
CREATE INDEX "grl_org_item_posting_idx" ON "goods_receipt_lines" USING btree ("org_id","item_id","posting_date");--> statement-breakpoint
CREATE UNIQUE INDEX "gr_org_doc_no_uniq" ON "goods_receipts" USING btree ("org_id","doc_no");--> statement-breakpoint
CREATE INDEX "gr_org_supplier_posting_idx" ON "goods_receipts" USING btree ("org_id","supplier_id","posting_date");--> statement-breakpoint
CREATE INDEX "gr_org_posting_date_idx" ON "goods_receipts" USING btree ("org_id","posting_date");--> statement-breakpoint
CREATE INDEX "gr_org_posting_status_idx" ON "goods_receipts" USING btree ("org_id","posting_status","posting_date");--> statement-breakpoint
CREATE INDEX "ic_txn_org_id_idx" ON "intercompany_transactions" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "ic_txn_source_company_idx" ON "intercompany_transactions" USING btree ("org_id","source_company_id");--> statement-breakpoint
CREATE INDEX "ic_txn_target_company_idx" ON "intercompany_transactions" USING btree ("org_id","target_company_id");--> statement-breakpoint
CREATE INDEX "ic_txn_source_je_idx" ON "intercompany_transactions" USING btree ("org_id","source_journal_entry_id");--> statement-breakpoint
CREATE INDEX "ic_txn_target_je_idx" ON "intercompany_transactions" USING btree ("org_id","target_journal_entry_id");--> statement-breakpoint
CREATE INDEX "inv_trace_org_id_idx" ON "inventory_trace_links" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "inv_trace_from_idx" ON "inventory_trace_links" USING btree ("org_id","from_movement_id");--> statement-breakpoint
CREATE INDEX "inv_trace_to_idx" ON "inventory_trace_links" USING btree ("org_id","to_movement_id");--> statement-breakpoint
CREATE INDEX "inv_trace_lot_idx" ON "inventory_trace_links" USING btree ("org_id","lot_tracking_id");--> statement-breakpoint
CREATE UNIQUE INDEX "item_groups_org_name_uniq" ON "item_groups" USING btree ("org_id","name");--> statement-breakpoint
CREATE INDEX "item_groups_org_parent_idx" ON "item_groups" USING btree ("org_id","parent_group_id");--> statement-breakpoint
CREATE UNIQUE INDEX "items_org_code_uniq" ON "items" USING btree ("org_id","code");--> statement-breakpoint
CREATE INDEX "items_org_group_idx" ON "items" USING btree ("org_id","item_group_id");--> statement-breakpoint
CREATE INDEX "items_org_type_idx" ON "items" USING btree ("org_id","item_type");--> statement-breakpoint
CREATE INDEX "items_org_stock_idx" ON "items" USING btree ("org_id","is_stock_item") WHERE is_stock_item = true;--> statement-breakpoint
CREATE INDEX "journal_entries_org_id_idx" ON "journal_entries" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "journal_entries_org_company_idx" ON "journal_entries" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "journal_entries_org_posted_idx" ON "journal_entries" USING btree ("org_id","posted_at");--> statement-breakpoint
CREATE INDEX "journal_entries_source_idx" ON "journal_entries" USING btree ("org_id","source_type","source_id");--> statement-breakpoint
CREATE INDEX "journal_lines_org_id_idx" ON "journal_lines" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "journal_lines_entry_idx" ON "journal_lines" USING btree ("org_id","journal_entry_id");--> statement-breakpoint
CREATE INDEX "journal_lines_account_idx" ON "journal_lines" USING btree ("org_id","account_id");--> statement-breakpoint
CREATE INDEX "journal_lines_company_idx" ON "journal_lines" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "lc_alloc_org_id_idx" ON "landed_cost_allocations" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "lc_alloc_doc_idx" ON "landed_cost_allocations" USING btree ("org_id","landed_cost_doc_id");--> statement-breakpoint
CREATE INDEX "lc_alloc_receipt_line_idx" ON "landed_cost_allocations" USING btree ("org_id","receipt_line_id");--> statement-breakpoint
CREATE INDEX "lc_docs_org_id_idx" ON "landed_cost_docs" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "lc_docs_company_idx" ON "landed_cost_docs" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "lc_docs_receipt_idx" ON "landed_cost_docs" USING btree ("org_id","receipt_id");--> statement-breakpoint
CREATE INDEX "lot_track_org_id_idx" ON "lot_tracking" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "lot_track_item_idx" ON "lot_tracking" USING btree ("org_id","item_id");--> statement-breakpoint
CREATE INDEX "lot_track_company_idx" ON "lot_tracking" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "lot_track_expiry_idx" ON "lot_tracking" USING btree ("org_id","item_id","expiry_date");--> statement-breakpoint
CREATE UNIQUE INDEX "lot_track_org_product_no_uniq" ON "lot_tracking" USING btree ("org_id","company_id","item_id","tracking_no");--> statement-breakpoint
CREATE INDEX "match_results_org_id_idx" ON "match_results" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "match_results_company_idx" ON "match_results" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "match_results_po_idx" ON "match_results" USING btree ("org_id","po_line_id");--> statement-breakpoint
CREATE INDEX "match_results_grn_idx" ON "match_results" USING btree ("org_id","grn_line_id");--> statement-breakpoint
CREATE INDEX "match_results_invoice_idx" ON "match_results" USING btree ("org_id","invoice_line_id");--> statement-breakpoint
CREATE INDEX "match_results_status_idx" ON "match_results" USING btree ("org_id","status");--> statement-breakpoint
CREATE INDEX "migration_checkpoints_job_idx" ON "migration_checkpoints" USING btree ("migration_job_id");--> statement-breakpoint
CREATE INDEX "migration_conflict_resolutions_conflict_idx" ON "migration_conflict_resolutions" USING btree ("conflict_id");--> statement-breakpoint
CREATE INDEX "migration_conflict_resolutions_job_idx" ON "migration_conflict_resolutions" USING btree ("migration_job_id","decision");--> statement-breakpoint
CREATE INDEX "migration_conflicts_job_idx" ON "migration_conflicts" USING btree ("migration_job_id");--> statement-breakpoint
CREATE INDEX "migration_conflicts_resolution_idx" ON "migration_conflicts" USING btree ("org_id","resolution");--> statement-breakpoint
CREATE INDEX "migration_jobs_org_status_idx" ON "migration_jobs" USING btree ("org_id","status");--> statement-breakpoint
CREATE INDEX "migration_jobs_entity_type_idx" ON "migration_jobs" USING btree ("entity_type");--> statement-breakpoint
CREATE INDEX "migration_lineage_job_idx" ON "migration_lineage" USING btree ("migration_job_id");--> statement-breakpoint
CREATE INDEX "migration_lineage_reservations_idx" ON "migration_lineage" USING btree ("org_id","entity_type","legacy_system","reserved_at") WHERE state = 'reserved';--> statement-breakpoint
CREATE UNIQUE INDEX "migration_lineage_dedupe_key_idx" ON "migration_lineage" USING btree ("dedupe_key") WHERE state = 'committed' AND dedupe_key IS NOT NULL;--> statement-breakpoint
CREATE INDEX "migration_merge_explanations_job_idx" ON "migration_merge_explanations" USING btree ("migration_job_id");--> statement-breakpoint
CREATE INDEX "migration_merge_explanations_decision_idx" ON "migration_merge_explanations" USING btree ("migration_job_id","decision");--> statement-breakpoint
CREATE INDEX "migration_quarantine_job_idx" ON "migration_quarantine" USING btree ("migration_job_id");--> statement-breakpoint
CREATE INDEX "migration_quarantine_status_idx" ON "migration_quarantine" USING btree ("migration_job_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "migration_quarantine_dedupe" ON "migration_quarantine" USING btree ("migration_job_id","entity_type","legacy_id","last_error_hash") WHERE status IN ('quarantined', 'retrying');--> statement-breakpoint
CREATE INDEX "migration_reports_job_idx" ON "migration_reports" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "migration_reports_hash_idx" ON "migration_reports" USING btree ("report_hash");--> statement-breakpoint
CREATE INDEX "migration_row_snapshots_job_idx" ON "migration_row_snapshots" USING btree ("migration_job_id","entity_type");--> statement-breakpoint
CREATE INDEX "payment_alloc_org_id_idx" ON "payment_allocations" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "payment_alloc_payment_idx" ON "payment_allocations" USING btree ("org_id","payment_id");--> statement-breakpoint
CREATE INDEX "payment_alloc_target_idx" ON "payment_allocations" USING btree ("org_id","target_type","target_id");--> statement-breakpoint
CREATE INDEX "payment_alloc_company_idx" ON "payment_allocations" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "payment_alloc_payment_target_uniq" ON "payment_allocations" USING btree ("org_id","payment_id","target_id");--> statement-breakpoint
CREATE INDEX "payment_terms_org_id_idx" ON "payment_terms" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "payment_terms_org_code_uniq" ON "payment_terms" USING btree ("org_id","code");--> statement-breakpoint
CREATE UNIQUE INDEX "pay_org_doc_no_uniq" ON "payments" USING btree ("org_id","doc_no");--> statement-breakpoint
CREATE INDEX "pay_org_party_posting_idx" ON "payments" USING btree ("org_id","party_type","party_id","posting_date");--> statement-breakpoint
CREATE INDEX "pay_org_posting_date_idx" ON "payments" USING btree ("org_id","posting_date");--> statement-breakpoint
CREATE INDEX "pay_org_posting_status_idx" ON "payments" USING btree ("org_id","posting_status","posting_date");--> statement-breakpoint
CREATE INDEX "pli_org_id_idx" ON "price_list_items" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "pli_price_list_idx" ON "price_list_items" USING btree ("org_id","price_list_id");--> statement-breakpoint
CREATE INDEX "pli_product_idx" ON "price_list_items" USING btree ("org_id","product_id");--> statement-breakpoint
CREATE INDEX "price_lists_org_id_idx" ON "price_lists" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "price_lists_org_code_uniq" ON "price_lists" USING btree ("org_id","code");--> statement-breakpoint
CREATE INDEX "projects_org_id_idx" ON "projects" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "projects_org_company_idx" ON "projects" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_org_company_code_uniq" ON "projects" USING btree ("org_id","company_id","code");--> statement-breakpoint
CREATE UNIQUE INDEX "pil_org_invoice_line_uniq" ON "purchase_invoice_lines" USING btree ("org_id","purchase_invoice_id","line_no");--> statement-breakpoint
CREATE INDEX "pil_org_invoice_idx" ON "purchase_invoice_lines" USING btree ("org_id","purchase_invoice_id");--> statement-breakpoint
CREATE INDEX "pil_org_item_idx" ON "purchase_invoice_lines" USING btree ("org_id","item_id");--> statement-breakpoint
CREATE INDEX "pil_org_item_posting_idx" ON "purchase_invoice_lines" USING btree ("org_id","item_id","posting_date");--> statement-breakpoint
CREATE UNIQUE INDEX "pi_org_doc_no_uniq" ON "purchase_invoices" USING btree ("org_id","doc_no");--> statement-breakpoint
CREATE INDEX "pi_org_supplier_posting_idx" ON "purchase_invoices" USING btree ("org_id","supplier_id","posting_date");--> statement-breakpoint
CREATE INDEX "pi_org_posting_date_idx" ON "purchase_invoices" USING btree ("org_id","posting_date");--> statement-breakpoint
CREATE INDEX "pi_org_due_date_idx" ON "purchase_invoices" USING btree ("org_id","due_date");--> statement-breakpoint
CREATE INDEX "pi_org_doc_status_idx" ON "purchase_invoices" USING btree ("org_id","doc_status","updated_at");--> statement-breakpoint
CREATE INDEX "pi_org_posting_status_idx" ON "purchase_invoices" USING btree ("org_id","posting_status","posting_date");--> statement-breakpoint
CREATE INDEX "pi_org_outstanding_idx" ON "purchase_invoices" USING btree ("org_id","outstanding_minor") WHERE outstanding_minor > 0;--> statement-breakpoint
CREATE INDEX "pi_org_due_outstanding_idx" ON "purchase_invoices" USING btree ("org_id","due_date","outstanding_minor") WHERE outstanding_minor > 0;--> statement-breakpoint
CREATE INDEX "pi_org_supplier_due_stmt_idx" ON "purchase_invoices" USING btree ("org_id","supplier_id","due_date") WHERE outstanding_minor > 0;--> statement-breakpoint
CREATE UNIQUE INDEX "pol_org_order_line_uniq" ON "purchase_order_lines" USING btree ("org_id","purchase_order_id","line_no");--> statement-breakpoint
CREATE INDEX "pol_org_order_idx" ON "purchase_order_lines" USING btree ("org_id","purchase_order_id");--> statement-breakpoint
CREATE INDEX "pol_org_item_idx" ON "purchase_order_lines" USING btree ("org_id","item_id");--> statement-breakpoint
CREATE INDEX "pol_org_item_posting_idx" ON "purchase_order_lines" USING btree ("org_id","item_id","posting_date");--> statement-breakpoint
CREATE UNIQUE INDEX "po_org_doc_no_uniq" ON "purchase_orders" USING btree ("org_id","doc_no");--> statement-breakpoint
CREATE INDEX "po_org_supplier_created_idx" ON "purchase_orders" USING btree ("org_id","supplier_id","created_at");--> statement-breakpoint
CREATE INDEX "po_org_doc_status_idx" ON "purchase_orders" USING btree ("org_id","doc_status","updated_at");--> statement-breakpoint
CREATE INDEX "po_org_posting_status_idx" ON "purchase_orders" USING btree ("org_id","posting_status","posting_date");--> statement-breakpoint
CREATE INDEX "pr_org_id_idx" ON "purchase_requests" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "pr_org_company_idx" ON "purchase_requests" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "pr_requested_by_idx" ON "purchase_requests" USING btree ("org_id","requested_by");--> statement-breakpoint
CREATE INDEX "pr_status_idx" ON "purchase_requests" USING btree ("org_id","doc_status");--> statement-breakpoint
CREATE UNIQUE INDEX "pr_org_request_no_uniq" ON "purchase_requests" USING btree ("org_id","request_no") WHERE request_no IS NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "qtnl_org_quotation_line_uniq" ON "quotation_lines" USING btree ("org_id","quotation_id","line_no");--> statement-breakpoint
CREATE INDEX "qtnl_org_quotation_idx" ON "quotation_lines" USING btree ("org_id","quotation_id");--> statement-breakpoint
CREATE INDEX "qtnl_org_item_idx" ON "quotation_lines" USING btree ("org_id","item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "qtn_org_doc_no_uniq" ON "quotations" USING btree ("org_id","doc_no");--> statement-breakpoint
CREATE INDEX "qtn_org_party_created_idx" ON "quotations" USING btree ("org_id","party_id","created_at");--> statement-breakpoint
CREATE INDEX "qtn_org_doc_status_idx" ON "quotations" USING btree ("org_id","doc_status","updated_at");--> statement-breakpoint
CREATE INDEX "rpt_snap_org_id_idx" ON "reporting_snapshots" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "rpt_snap_company_idx" ON "reporting_snapshots" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "rpt_snap_period_idx" ON "reporting_snapshots" USING btree ("org_id","fiscal_period_id");--> statement-breakpoint
CREATE UNIQUE INDEX "rpt_snap_company_period_type_uniq" ON "reporting_snapshots" USING btree ("org_id","company_id","fiscal_period_id","snapshot_type");--> statement-breakpoint
CREATE INDEX "rev_sched_lines_org_id_idx" ON "revenue_schedule_lines" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "rev_sched_lines_sched_idx" ON "revenue_schedule_lines" USING btree ("org_id","schedule_id");--> statement-breakpoint
CREATE INDEX "rev_sched_org_id_idx" ON "revenue_schedules" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "rev_sched_company_idx" ON "revenue_schedules" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "rev_sched_source_idx" ON "revenue_schedules" USING btree ("org_id","source_type","source_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sil_org_invoice_line_uniq" ON "sales_invoice_lines" USING btree ("org_id","sales_invoice_id","line_no");--> statement-breakpoint
CREATE INDEX "sil_org_invoice_idx" ON "sales_invoice_lines" USING btree ("org_id","sales_invoice_id");--> statement-breakpoint
CREATE INDEX "sil_org_item_idx" ON "sales_invoice_lines" USING btree ("org_id","item_id");--> statement-breakpoint
CREATE INDEX "sil_org_item_posting_idx" ON "sales_invoice_lines" USING btree ("org_id","item_id","posting_date");--> statement-breakpoint
CREATE INDEX "sil_org_company_analytics_idx" ON "sales_invoice_lines" USING btree ("org_id","company_id","posting_date","item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "si_org_doc_no_uniq" ON "sales_invoices" USING btree ("org_id","doc_no");--> statement-breakpoint
CREATE INDEX "si_org_customer_posting_idx" ON "sales_invoices" USING btree ("org_id","customer_id","posting_date");--> statement-breakpoint
CREATE INDEX "si_org_posting_date_idx" ON "sales_invoices" USING btree ("org_id","posting_date");--> statement-breakpoint
CREATE INDEX "si_org_due_date_idx" ON "sales_invoices" USING btree ("org_id","due_date");--> statement-breakpoint
CREATE INDEX "si_org_doc_status_idx" ON "sales_invoices" USING btree ("org_id","doc_status","updated_at");--> statement-breakpoint
CREATE INDEX "si_org_posting_status_idx" ON "sales_invoices" USING btree ("org_id","posting_status","posting_date");--> statement-breakpoint
CREATE INDEX "si_org_outstanding_idx" ON "sales_invoices" USING btree ("org_id","outstanding_minor") WHERE outstanding_minor > 0;--> statement-breakpoint
CREATE INDEX "si_org_due_outstanding_idx" ON "sales_invoices" USING btree ("org_id","due_date","outstanding_minor") WHERE outstanding_minor > 0;--> statement-breakpoint
CREATE INDEX "si_org_customer_due_stmt_idx" ON "sales_invoices" USING btree ("org_id","customer_id","due_date") WHERE outstanding_minor > 0;--> statement-breakpoint
CREATE INDEX "si_org_customer_analytics_idx" ON "sales_invoices" USING btree ("org_id","customer_id","posting_date","id");--> statement-breakpoint
CREATE UNIQUE INDEX "sol_org_order_line_uniq" ON "sales_order_lines" USING btree ("org_id","sales_order_id","line_no");--> statement-breakpoint
CREATE INDEX "sol_org_order_idx" ON "sales_order_lines" USING btree ("org_id","sales_order_id");--> statement-breakpoint
CREATE INDEX "sol_org_item_idx" ON "sales_order_lines" USING btree ("org_id","item_id");--> statement-breakpoint
CREATE INDEX "sol_org_item_posting_idx" ON "sales_order_lines" USING btree ("org_id","item_id","posting_date");--> statement-breakpoint
CREATE UNIQUE INDEX "so_org_doc_no_uniq" ON "sales_orders" USING btree ("org_id","doc_no");--> statement-breakpoint
CREATE INDEX "so_org_customer_created_idx" ON "sales_orders" USING btree ("org_id","customer_id","created_at");--> statement-breakpoint
CREATE INDEX "so_org_doc_status_idx" ON "sales_orders" USING btree ("org_id","doc_status","updated_at");--> statement-breakpoint
CREATE INDEX "so_org_posting_status_idx" ON "sales_orders" USING btree ("org_id","posting_status","posting_date");--> statement-breakpoint
CREATE INDEX "stock_bal_org_id_idx" ON "stock_balances" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "stock_bal_org_company_idx" ON "stock_balances" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "stock_bal_org_item_idx" ON "stock_balances" USING btree ("org_id","item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "stock_bal_org_company_site_item_uniq" ON "stock_balances" USING btree ("org_id","company_id","site_id","item_id");--> statement-breakpoint
CREATE INDEX "stock_mv_org_id_idx" ON "stock_movements" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "stock_mv_org_company_idx" ON "stock_movements" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "stock_mv_item_idx" ON "stock_movements" USING btree ("org_id","site_id","item_id");--> statement-breakpoint
CREATE INDEX "stock_mv_posted_idx" ON "stock_movements" USING btree ("org_id","company_id","posted_at");--> statement-breakpoint
CREATE INDEX "stock_mv_source_idx" ON "stock_movements" USING btree ("org_id","source_type","source_id");--> statement-breakpoint
CREATE INDEX "stock_mv_batch_idx" ON "stock_movements" USING btree ("org_id","item_id","batch_no");--> statement-breakpoint
CREATE INDEX "supp_prof_org_id_idx" ON "supplier_profiles" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "supp_prof_org_company_idx" ON "supplier_profiles" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "supp_prof_org_contact_uniq" ON "supplier_profiles" USING btree ("org_id","contact_id");--> statement-breakpoint
CREATE INDEX "tax_rates_org_id_idx" ON "tax_rates" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "tax_rates_org_code_idx" ON "tax_rates" USING btree ("org_id","tax_code");--> statement-breakpoint
CREATE INDEX "tax_rates_effective_idx" ON "tax_rates" USING btree ("org_id","tax_code","effective_from");--> statement-breakpoint
CREATE UNIQUE INDEX "tax_rates_org_code_effective_uniq" ON "tax_rates" USING btree ("org_id","tax_code","effective_from");--> statement-breakpoint
CREATE UNIQUE INDEX "warehouses_org_code_uniq" ON "warehouses" USING btree ("org_id","code");--> statement-breakpoint
CREATE INDEX "warehouses_org_company_idx" ON "warehouses" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "warehouses_org_parent_idx" ON "warehouses" USING btree ("org_id","parent_warehouse_id");--> statement-breakpoint
CREATE INDEX "webhook_del_org_id_idx" ON "webhook_deliveries" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "webhook_del_endpoint_idx" ON "webhook_deliveries" USING btree ("org_id","endpoint_id");--> statement-breakpoint
CREATE INDEX "webhook_del_event_idx" ON "webhook_deliveries" USING btree ("org_id","event_type");--> statement-breakpoint
CREATE INDEX "webhook_ep_org_id_idx" ON "webhook_endpoints" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "webhook_ep_active_idx" ON "webhook_endpoints" USING btree ("org_id","is_active");--> statement-breakpoint
CREATE INDEX "wip_mv_org_id_idx" ON "wip_movements" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "wip_mv_work_order_idx" ON "wip_movements" USING btree ("org_id","work_order_id");--> statement-breakpoint
CREATE INDEX "wip_mv_posted_idx" ON "wip_movements" USING btree ("org_id","company_id","posted_at");--> statement-breakpoint
CREATE INDEX "work_orders_org_id_idx" ON "work_orders" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "work_orders_org_company_idx" ON "work_orders" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "work_orders_product_idx" ON "work_orders" USING btree ("org_id","product_id");--> statement-breakpoint
CREATE INDEX "work_orders_bom_idx" ON "work_orders" USING btree ("org_id","bom_id");--> statement-breakpoint
CREATE UNIQUE INDEX "wf_def_org_entity_version_uniq" ON "workflow_definitions" USING btree ("org_id","entity_type","version");--> statement-breakpoint
CREATE INDEX "wf_def_org_entity_status_idx" ON "workflow_definitions" USING btree ("org_id","entity_type","status");--> statement-breakpoint
CREATE INDEX "wf_evt_org_instance_idx" ON "workflow_events_outbox" USING btree ("org_id","instance_id");--> statement-breakpoint
CREATE INDEX "wf_inst_org_entity_idx" ON "workflow_instances" USING btree ("org_id","entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "wf_inst_org_status_idx" ON "workflow_instances" USING btree ("org_id","status","updated_at");--> statement-breakpoint
CREATE INDEX "wf_inst_org_definition_idx" ON "workflow_instances" USING btree ("org_id","definition_id");--> statement-breakpoint
CREATE INDEX "wf_se_org_instance_idx" ON "workflow_side_effects_outbox" USING btree ("org_id","instance_id");--> statement-breakpoint
CREATE INDEX "wf_se_org_step_idx" ON "workflow_side_effects_outbox" USING btree ("org_id","step_execution_id");--> statement-breakpoint
CREATE INDEX "wf_step_org_instance_idx" ON "workflow_step_executions" USING btree ("org_id","instance_id","created_at");--> statement-breakpoint
CREATE INDEX "wf_step_org_actor_status_idx" ON "workflow_step_executions" USING btree ("org_id","actor_user_id","status");--> statement-breakpoint
CREATE INDEX "wf_step_org_instance_node_status_idx" ON "workflow_step_executions" USING btree ("org_id","instance_id","node_id","status");--> statement-breakpoint
ALTER TABLE "number_sequences" ADD CONSTRAINT "number_sequences_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "entity_attach_org_category_idx" ON "entity_attachments" USING btree ("org_id","entity_type","category");--> statement-breakpoint
CREATE INDEX "number_sequences_org_company_idx" ON "number_sequences" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "r2_files_org_id_idx" ON "r2_files" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "r2_files_org_company_idx" ON "r2_files" USING btree ("org_id","company_id");--> statement-breakpoint
CREATE INDEX "r2_files_org_folder_idx" ON "r2_files" USING btree ("org_id","folder_path");--> statement-breakpoint
CREATE INDEX "r2_files_uploaded_by_idx" ON "r2_files" USING btree ("org_id","uploaded_by");--> statement-breakpoint
CREATE UNIQUE INDEX "uom_conversions_org_from_to_product_uniq" ON "uom_conversions" USING btree ("org_id","from_uom_id","to_uom_id","product_id");--> statement-breakpoint
ALTER TABLE "companies" DROP COLUMN "company_id";--> statement-breakpoint
ALTER TABLE "companies" DROP COLUMN "site_id";--> statement-breakpoint
ALTER TABLE "contacts" DROP COLUMN "site_id";--> statement-breakpoint
ALTER TABLE "r2_files" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "sites" DROP COLUMN "site_id";--> statement-breakpoint
ALTER TABLE "entity_attachments" ADD CONSTRAINT "entity_attach_category_valid" CHECK (category IN ('general', 'receipt', 'contract', 'photo', 'signature', 'report', 'correspondence', 'legal', 'other'));--> statement-breakpoint
ALTER TABLE "r2_files" ADD CONSTRAINT "r2_files_org_not_empty" CHECK (org_id <> '');--> statement-breakpoint
ALTER TABLE "r2_files" ADD CONSTRAINT "r2_files_scan_status_valid" CHECK (scan_status IN ('pending', 'clean', 'infected', 'error', 'skipped'));--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_perms_verb_valid" CHECK (verb IN ('create', 'update', 'delete', 'submit', 'cancel', 'amend', 'approve', 'reject', 'restore', '*'));--> statement-breakpoint
ALTER TABLE "uom_conversions" ADD CONSTRAINT "uom_conversions_rounding_valid" CHECK (rounding_method IN ('half_up', 'half_down', 'ceil', 'floor', 'banker'));--> statement-breakpoint
ALTER TABLE "uom_conversions" ADD CONSTRAINT "uom_conversions_scope_valid" CHECK (scope IN ('global', 'product'));--> statement-breakpoint
ALTER TABLE "uom_conversions" ADD CONSTRAINT "uom_conversions_factor_positive" CHECK (factor > 0);--> statement-breakpoint
ALTER TABLE "uom_conversions" ADD CONSTRAINT "uom_conversions_product_scope" CHECK ((scope = 'global' AND product_id IS NULL) OR (scope = 'product' AND product_id IS NOT NULL));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "addresses" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "addresses"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "addresses" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "addresses"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "addresses" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "addresses"."org_id")) WITH CHECK ((select auth.org_id() = "addresses"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "addresses" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "addresses"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "approval_chains" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "approval_chains"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "approval_chains" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "approval_chains"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "approval_chains" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "approval_chains"."org_id")) WITH CHECK ((select auth.org_id() = "approval_chains"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "approval_chains" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "approval_chains"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "approval_decisions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "approval_decisions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "approval_decisions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "approval_decisions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "approval_decisions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "approval_decisions"."org_id")) WITH CHECK ((select auth.org_id() = "approval_decisions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "approval_decisions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "approval_decisions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "approval_requests" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "approval_requests"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "approval_requests" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "approval_requests"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "approval_requests" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "approval_requests"."org_id")) WITH CHECK ((select auth.org_id() = "approval_requests"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "approval_requests" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "approval_requests"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "approval_steps" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "approval_steps"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "approval_steps" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "approval_steps"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "approval_steps" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "approval_steps"."org_id")) WITH CHECK ((select auth.org_id() = "approval_steps"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "approval_steps" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "approval_steps"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "bank_accounts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "bank_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "bank_accounts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "bank_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "bank_accounts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "bank_accounts"."org_id")) WITH CHECK ((select auth.org_id() = "bank_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "bank_accounts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "bank_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "bank_reconciliation_sessions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "bank_reconciliation_sessions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "bank_reconciliation_sessions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "bank_reconciliation_sessions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "bank_reconciliation_sessions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "bank_reconciliation_sessions"."org_id")) WITH CHECK ((select auth.org_id() = "bank_reconciliation_sessions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "bank_reconciliation_sessions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "bank_reconciliation_sessions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "bank_statement_lines" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "bank_statement_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "bank_statement_lines" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "bank_statement_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "bank_statement_lines" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "bank_statement_lines"."org_id")) WITH CHECK ((select auth.org_id() = "bank_statement_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "bank_statement_lines" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "bank_statement_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "bom_lines" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "bom_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "bom_lines" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "bom_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "bom_lines" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "bom_lines"."org_id")) WITH CHECK ((select auth.org_id() = "bom_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "bom_lines" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "bom_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "boms" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "boms"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "boms" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "boms"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "boms" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "boms"."org_id")) WITH CHECK ((select auth.org_id() = "boms"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "boms" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "boms"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "budget_commitments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "budget_commitments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "budget_commitments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "budget_commitments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "budget_commitments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "budget_commitments"."org_id")) WITH CHECK ((select auth.org_id() = "budget_commitments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "budget_commitments" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "budget_commitments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "budgets" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "budgets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "budgets" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "budgets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "budgets" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "budgets"."org_id")) WITH CHECK ((select auth.org_id() = "budgets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "budgets" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "budgets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "chart_of_accounts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "chart_of_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "chart_of_accounts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "chart_of_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "chart_of_accounts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "chart_of_accounts"."org_id")) WITH CHECK ((select auth.org_id() = "chart_of_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "chart_of_accounts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "chart_of_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "company_addresses" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "company_addresses"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "company_addresses" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "company_addresses"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "company_addresses" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "company_addresses"."org_id")) WITH CHECK ((select auth.org_id() = "company_addresses"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "company_addresses" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "company_addresses"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "contact_addresses" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "contact_addresses"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "contact_addresses" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "contact_addresses"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "contact_addresses" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "contact_addresses"."org_id")) WITH CHECK ((select auth.org_id() = "contact_addresses"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "contact_addresses" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "contact_addresses"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "contracts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "contracts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "contracts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "contracts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "contracts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "contracts"."org_id")) WITH CHECK ((select auth.org_id() = "contracts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "contracts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "contracts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "cost_centers" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "cost_centers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "cost_centers" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "cost_centers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "cost_centers" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "cost_centers"."org_id")) WITH CHECK ((select auth.org_id() = "cost_centers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "cost_centers" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "cost_centers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "credit_notes" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "credit_notes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "credit_notes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "credit_notes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "credit_notes" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "credit_notes"."org_id")) WITH CHECK ((select auth.org_id() = "credit_notes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "credit_notes" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "credit_notes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "customer_profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "customer_profiles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "customer_profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "customer_profiles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "customer_profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "customer_profiles"."org_id")) WITH CHECK ((select auth.org_id() = "customer_profiles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "customer_profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "customer_profiles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "debit_notes" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "debit_notes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "debit_notes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "debit_notes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "debit_notes" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "debit_notes"."org_id")) WITH CHECK ((select auth.org_id() = "debit_notes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "debit_notes" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "debit_notes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "delivery_note_lines" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "delivery_note_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "delivery_note_lines" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "delivery_note_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "delivery_note_lines" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "delivery_note_lines"."org_id")) WITH CHECK ((select auth.org_id() = "delivery_note_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "delivery_note_lines" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "delivery_note_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "delivery_notes" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "delivery_notes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "delivery_notes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "delivery_notes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "delivery_notes" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "delivery_notes"."org_id")) WITH CHECK ((select auth.org_id() = "delivery_notes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "delivery_notes" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "delivery_notes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "discount_rules" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "discount_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "discount_rules" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "discount_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "discount_rules" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "discount_rules"."org_id")) WITH CHECK ((select auth.org_id() = "discount_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "discount_rules" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "discount_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "doc_links" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "doc_links"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "doc_links" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "doc_links"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "doc_links" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "doc_links"."org_id")) WITH CHECK ((select auth.org_id() = "doc_links"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "doc_links" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "doc_links"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "doc_postings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "doc_postings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "doc_postings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "doc_postings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "doc_postings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "doc_postings"."org_id")) WITH CHECK ((select auth.org_id() = "doc_postings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "doc_postings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "doc_postings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "fiscal_periods" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "fiscal_periods"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "fiscal_periods" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "fiscal_periods"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "fiscal_periods" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "fiscal_periods"."org_id")) WITH CHECK ((select auth.org_id() = "fiscal_periods"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "fiscal_periods" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "fiscal_periods"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "asset_events" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "asset_events"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "asset_events" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "asset_events"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "asset_events" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "asset_events"."org_id")) WITH CHECK ((select auth.org_id() = "asset_events"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "asset_events" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "asset_events"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "assets" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "assets" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "assets" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "assets"."org_id")) WITH CHECK ((select auth.org_id() = "assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "assets" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "depreciation_schedules" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "depreciation_schedules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "depreciation_schedules" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "depreciation_schedules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "depreciation_schedules" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "depreciation_schedules"."org_id")) WITH CHECK ((select auth.org_id() = "depreciation_schedules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "depreciation_schedules" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "depreciation_schedules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "fx_rates" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "fx_rates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "fx_rates" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "fx_rates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "fx_rates" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "fx_rates"."org_id")) WITH CHECK ((select auth.org_id() = "fx_rates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "fx_rates" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "fx_rates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "goods_receipt_lines" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "goods_receipt_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "goods_receipt_lines" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "goods_receipt_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "goods_receipt_lines" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "goods_receipt_lines"."org_id")) WITH CHECK ((select auth.org_id() = "goods_receipt_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "goods_receipt_lines" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "goods_receipt_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "goods_receipts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "goods_receipts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "goods_receipts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "goods_receipts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "goods_receipts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "goods_receipts"."org_id")) WITH CHECK ((select auth.org_id() = "goods_receipts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "goods_receipts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "goods_receipts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "intercompany_transactions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "intercompany_transactions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "intercompany_transactions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "intercompany_transactions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "intercompany_transactions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "intercompany_transactions"."org_id")) WITH CHECK ((select auth.org_id() = "intercompany_transactions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "intercompany_transactions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "intercompany_transactions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "inventory_trace_links" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "inventory_trace_links"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "inventory_trace_links" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "inventory_trace_links"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "inventory_trace_links" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "inventory_trace_links"."org_id")) WITH CHECK ((select auth.org_id() = "inventory_trace_links"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "inventory_trace_links" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "inventory_trace_links"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "item_groups" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "item_groups"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "item_groups" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "item_groups"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "item_groups" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "item_groups"."org_id")) WITH CHECK ((select auth.org_id() = "item_groups"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "item_groups" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "item_groups"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "items" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "items" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "items" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "items"."org_id")) WITH CHECK ((select auth.org_id() = "items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "items" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "journal_entries" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "journal_entries"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "journal_entries" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "journal_entries"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "journal_entries" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "journal_entries"."org_id")) WITH CHECK ((select auth.org_id() = "journal_entries"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "journal_entries" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "journal_entries"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "journal_lines" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "journal_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "journal_lines" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "journal_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "journal_lines" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "journal_lines"."org_id")) WITH CHECK ((select auth.org_id() = "journal_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "journal_lines" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "journal_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "landed_cost_allocations" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "landed_cost_allocations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "landed_cost_allocations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "landed_cost_allocations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "landed_cost_allocations" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "landed_cost_allocations"."org_id")) WITH CHECK ((select auth.org_id() = "landed_cost_allocations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "landed_cost_allocations" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "landed_cost_allocations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "landed_cost_docs" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "landed_cost_docs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "landed_cost_docs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "landed_cost_docs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "landed_cost_docs" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "landed_cost_docs"."org_id")) WITH CHECK ((select auth.org_id() = "landed_cost_docs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "landed_cost_docs" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "landed_cost_docs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "lot_tracking" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "lot_tracking"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "lot_tracking" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "lot_tracking"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "lot_tracking" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "lot_tracking"."org_id")) WITH CHECK ((select auth.org_id() = "lot_tracking"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "lot_tracking" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "lot_tracking"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "match_results" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "match_results"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "match_results" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "match_results"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "match_results" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "match_results"."org_id")) WITH CHECK ((select auth.org_id() = "match_results"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "match_results" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "match_results"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "migration_checkpoints" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "migration_checkpoints"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "migration_checkpoints" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "migration_checkpoints"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "migration_checkpoints" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "migration_checkpoints"."org_id")) WITH CHECK ((select auth.org_id() = "migration_checkpoints"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "migration_checkpoints" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "migration_checkpoints"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "migration_conflict_resolutions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "migration_conflict_resolutions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "migration_conflict_resolutions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "migration_conflict_resolutions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "migration_conflict_resolutions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "migration_conflict_resolutions"."org_id")) WITH CHECK ((select auth.org_id() = "migration_conflict_resolutions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "migration_conflict_resolutions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "migration_conflict_resolutions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "migration_conflicts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "migration_conflicts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "migration_conflicts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "migration_conflicts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "migration_conflicts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "migration_conflicts"."org_id")) WITH CHECK ((select auth.org_id() = "migration_conflicts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "migration_conflicts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "migration_conflicts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "migration_jobs" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "migration_jobs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "migration_jobs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "migration_jobs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "migration_jobs" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "migration_jobs"."org_id")) WITH CHECK ((select auth.org_id() = "migration_jobs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "migration_jobs" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "migration_jobs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "migration_lineage" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "migration_lineage"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "migration_lineage" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "migration_lineage"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "migration_lineage" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "migration_lineage"."org_id")) WITH CHECK ((select auth.org_id() = "migration_lineage"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "migration_lineage" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "migration_lineage"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "migration_merge_explanations" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "migration_merge_explanations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "migration_merge_explanations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "migration_merge_explanations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "migration_merge_explanations" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "migration_merge_explanations"."org_id")) WITH CHECK ((select auth.org_id() = "migration_merge_explanations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "migration_merge_explanations" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "migration_merge_explanations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "migration_quarantine" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "migration_quarantine"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "migration_quarantine" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "migration_quarantine"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "migration_quarantine" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "migration_quarantine"."org_id")) WITH CHECK ((select auth.org_id() = "migration_quarantine"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "migration_quarantine" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "migration_quarantine"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "migration_reports" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select EXISTS (SELECT 1 FROM migration_jobs WHERE migration_jobs.id = "migration_reports"."job_id" AND migration_jobs.org_id = auth.org_id())));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "migration_reports" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select EXISTS (SELECT 1 FROM migration_jobs WHERE migration_jobs.id = "migration_reports"."job_id" AND migration_jobs.org_id = auth.org_id())));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "migration_reports" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select EXISTS (SELECT 1 FROM migration_jobs WHERE migration_jobs.id = "migration_reports"."job_id" AND migration_jobs.org_id = auth.org_id()))) WITH CHECK ((select EXISTS (SELECT 1 FROM migration_jobs WHERE migration_jobs.id = "migration_reports"."job_id" AND migration_jobs.org_id = auth.org_id())));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "migration_reports" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select EXISTS (SELECT 1 FROM migration_jobs WHERE migration_jobs.id = "migration_reports"."job_id" AND migration_jobs.org_id = auth.org_id())));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "migration_row_snapshots" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "migration_row_snapshots"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "migration_row_snapshots" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "migration_row_snapshots"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "migration_row_snapshots" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "migration_row_snapshots"."org_id")) WITH CHECK ((select auth.org_id() = "migration_row_snapshots"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "migration_row_snapshots" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "migration_row_snapshots"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "payment_allocations" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "payment_allocations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "payment_allocations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "payment_allocations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "payment_allocations" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "payment_allocations"."org_id")) WITH CHECK ((select auth.org_id() = "payment_allocations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "payment_allocations" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "payment_allocations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "payment_terms" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "payment_terms"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "payment_terms" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "payment_terms"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "payment_terms" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "payment_terms"."org_id")) WITH CHECK ((select auth.org_id() = "payment_terms"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "payment_terms" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "payment_terms"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "payments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "payments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "payments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "payments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "payments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "payments"."org_id")) WITH CHECK ((select auth.org_id() = "payments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "payments" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "payments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "price_list_items" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "price_list_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "price_list_items" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "price_list_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "price_list_items" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "price_list_items"."org_id")) WITH CHECK ((select auth.org_id() = "price_list_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "price_list_items" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "price_list_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "price_lists" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "price_lists"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "price_lists" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "price_lists"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "price_lists" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "price_lists"."org_id")) WITH CHECK ((select auth.org_id() = "price_lists"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "price_lists" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "price_lists"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "projects" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "projects"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "projects" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "projects"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "projects" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "projects"."org_id")) WITH CHECK ((select auth.org_id() = "projects"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "projects" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "projects"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "purchase_invoice_lines" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "purchase_invoice_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "purchase_invoice_lines" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "purchase_invoice_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "purchase_invoice_lines" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "purchase_invoice_lines"."org_id")) WITH CHECK ((select auth.org_id() = "purchase_invoice_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "purchase_invoice_lines" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "purchase_invoice_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "purchase_invoices" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "purchase_invoices"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "purchase_invoices" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "purchase_invoices"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "purchase_invoices" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "purchase_invoices"."org_id")) WITH CHECK ((select auth.org_id() = "purchase_invoices"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "purchase_invoices" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "purchase_invoices"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "purchase_order_lines" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "purchase_order_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "purchase_order_lines" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "purchase_order_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "purchase_order_lines" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "purchase_order_lines"."org_id")) WITH CHECK ((select auth.org_id() = "purchase_order_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "purchase_order_lines" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "purchase_order_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "purchase_orders" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "purchase_orders"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "purchase_orders" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "purchase_orders"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "purchase_orders" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "purchase_orders"."org_id")) WITH CHECK ((select auth.org_id() = "purchase_orders"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "purchase_orders" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "purchase_orders"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "purchase_requests" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "purchase_requests"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "purchase_requests" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "purchase_requests"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "purchase_requests" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "purchase_requests"."org_id")) WITH CHECK ((select auth.org_id() = "purchase_requests"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "purchase_requests" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "purchase_requests"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "quotation_lines" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "quotation_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "quotation_lines" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "quotation_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "quotation_lines" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "quotation_lines"."org_id")) WITH CHECK ((select auth.org_id() = "quotation_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "quotation_lines" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "quotation_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "quotations" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "quotations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "quotations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "quotations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "quotations" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "quotations"."org_id")) WITH CHECK ((select auth.org_id() = "quotations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "quotations" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "quotations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "reporting_snapshots" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "reporting_snapshots"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "reporting_snapshots" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "reporting_snapshots"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "reporting_snapshots" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "reporting_snapshots"."org_id")) WITH CHECK ((select auth.org_id() = "reporting_snapshots"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "reporting_snapshots" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "reporting_snapshots"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "revenue_schedule_lines" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "revenue_schedule_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "revenue_schedule_lines" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "revenue_schedule_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "revenue_schedule_lines" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "revenue_schedule_lines"."org_id")) WITH CHECK ((select auth.org_id() = "revenue_schedule_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "revenue_schedule_lines" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "revenue_schedule_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "revenue_schedules" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "revenue_schedules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "revenue_schedules" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "revenue_schedules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "revenue_schedules" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "revenue_schedules"."org_id")) WITH CHECK ((select auth.org_id() = "revenue_schedules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "revenue_schedules" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "revenue_schedules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "sales_invoice_lines" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "sales_invoice_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "sales_invoice_lines" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "sales_invoice_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "sales_invoice_lines" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "sales_invoice_lines"."org_id")) WITH CHECK ((select auth.org_id() = "sales_invoice_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "sales_invoice_lines" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "sales_invoice_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "sales_invoices" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "sales_invoices"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "sales_invoices" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "sales_invoices"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "sales_invoices" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "sales_invoices"."org_id")) WITH CHECK ((select auth.org_id() = "sales_invoices"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "sales_invoices" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "sales_invoices"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "sales_order_lines" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "sales_order_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "sales_order_lines" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "sales_order_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "sales_order_lines" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "sales_order_lines"."org_id")) WITH CHECK ((select auth.org_id() = "sales_order_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "sales_order_lines" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "sales_order_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "sales_orders" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "sales_orders"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "sales_orders" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "sales_orders"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "sales_orders" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "sales_orders"."org_id")) WITH CHECK ((select auth.org_id() = "sales_orders"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "sales_orders" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "sales_orders"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "stock_balances" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "stock_balances"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "stock_balances" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "stock_balances"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "stock_balances" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "stock_balances"."org_id")) WITH CHECK ((select auth.org_id() = "stock_balances"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "stock_balances" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "stock_balances"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "stock_movements" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "stock_movements"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "stock_movements" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "stock_movements"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "stock_movements" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "stock_movements"."org_id")) WITH CHECK ((select auth.org_id() = "stock_movements"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "stock_movements" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "stock_movements"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "supplier_profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "supplier_profiles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "supplier_profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "supplier_profiles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "supplier_profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "supplier_profiles"."org_id")) WITH CHECK ((select auth.org_id() = "supplier_profiles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "supplier_profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "supplier_profiles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "tax_rates" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "tax_rates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "tax_rates" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "tax_rates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "tax_rates" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "tax_rates"."org_id")) WITH CHECK ((select auth.org_id() = "tax_rates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "tax_rates" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "tax_rates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "warehouses" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "warehouses"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "warehouses" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "warehouses"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "warehouses" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "warehouses"."org_id")) WITH CHECK ((select auth.org_id() = "warehouses"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "warehouses" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "warehouses"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "webhook_deliveries" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "webhook_deliveries"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "webhook_deliveries" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "webhook_deliveries"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "webhook_deliveries" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "webhook_deliveries"."org_id")) WITH CHECK ((select auth.org_id() = "webhook_deliveries"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "webhook_deliveries" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "webhook_deliveries"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "webhook_endpoints" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "webhook_endpoints"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "webhook_endpoints" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "webhook_endpoints"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "webhook_endpoints" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "webhook_endpoints"."org_id")) WITH CHECK ((select auth.org_id() = "webhook_endpoints"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "webhook_endpoints" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "webhook_endpoints"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "wip_movements" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "wip_movements"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "wip_movements" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "wip_movements"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "wip_movements" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "wip_movements"."org_id")) WITH CHECK ((select auth.org_id() = "wip_movements"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "wip_movements" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "wip_movements"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "work_orders" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "work_orders"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "work_orders" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "work_orders"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "work_orders" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "work_orders"."org_id")) WITH CHECK ((select auth.org_id() = "work_orders"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "work_orders" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "work_orders"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "workflow_definitions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "workflow_definitions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "workflow_definitions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "workflow_definitions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "workflow_definitions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "workflow_definitions"."org_id")) WITH CHECK ((select auth.org_id() = "workflow_definitions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "workflow_definitions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "workflow_definitions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "workflow_events_outbox" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "workflow_events_outbox"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "workflow_events_outbox" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "workflow_events_outbox"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "workflow_events_outbox" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "workflow_events_outbox"."org_id")) WITH CHECK ((select auth.org_id() = "workflow_events_outbox"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "workflow_events_outbox" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "workflow_events_outbox"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "workflow_instances" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "workflow_instances"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "workflow_instances" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "workflow_instances"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "workflow_instances" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "workflow_instances"."org_id")) WITH CHECK ((select auth.org_id() = "workflow_instances"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "workflow_instances" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "workflow_instances"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "workflow_outbox_receipts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "workflow_outbox_receipts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "workflow_outbox_receipts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "workflow_outbox_receipts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "workflow_outbox_receipts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "workflow_outbox_receipts"."org_id")) WITH CHECK ((select auth.org_id() = "workflow_outbox_receipts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "workflow_outbox_receipts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "workflow_outbox_receipts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "workflow_side_effects_outbox" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "workflow_side_effects_outbox"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "workflow_side_effects_outbox" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "workflow_side_effects_outbox"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "workflow_side_effects_outbox" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "workflow_side_effects_outbox"."org_id")) WITH CHECK ((select auth.org_id() = "workflow_side_effects_outbox"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "workflow_side_effects_outbox" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "workflow_side_effects_outbox"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "workflow_step_executions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "workflow_step_executions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "workflow_step_executions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "workflow_step_executions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "workflow_step_executions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "workflow_step_executions"."org_id")) WITH CHECK ((select auth.org_id() = "workflow_step_executions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "workflow_step_executions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "workflow_step_executions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "workflow_step_receipts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "workflow_step_receipts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "workflow_step_receipts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "workflow_step_receipts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "workflow_step_receipts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "workflow_step_receipts"."org_id")) WITH CHECK ((select auth.org_id() = "workflow_step_receipts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "workflow_step_receipts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "workflow_step_receipts"."org_id"));--> statement-breakpoint
ALTER POLICY "crud-authenticated-policy-select" ON "r2_files" TO authenticated USING ((select auth.org_id() = "r2_files"."org_id"));--> statement-breakpoint
ALTER POLICY "crud-authenticated-policy-insert" ON "r2_files" TO authenticated WITH CHECK ((select auth.org_id() = "r2_files"."org_id"));--> statement-breakpoint
ALTER POLICY "crud-authenticated-policy-update" ON "r2_files" TO authenticated USING ((select auth.org_id() = "r2_files"."org_id")) WITH CHECK ((select auth.org_id() = "r2_files"."org_id"));--> statement-breakpoint
ALTER POLICY "crud-authenticated-policy-delete" ON "r2_files" TO authenticated USING ((select auth.org_id() = "r2_files"."org_id"));