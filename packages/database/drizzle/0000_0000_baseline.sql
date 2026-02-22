CREATE TYPE "public"."doc_status" AS ENUM('draft', 'submitted', 'active', 'cancelled');--> statement-breakpoint
CREATE TABLE "acct_derived_entries" (
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
	"derivation_id" text NOT NULL,
	"event_id" text NOT NULL,
	"mapping_version_id" uuid NOT NULL,
	"mapping_version_number" integer NOT NULL,
	"journal_entry_id" uuid,
	"status" text DEFAULT 'pending' NOT NULL,
	"committed_at" timestamp with time zone,
	"total_debit_minor" bigint DEFAULT 0 NOT NULL,
	"total_credit_minor" bigint DEFAULT 0 NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"derived_lines" jsonb NOT NULL,
	"error_details" text,
	CONSTRAINT "acct_derived_entries_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "ade_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "ade_derivation_id_not_empty" CHECK (derivation_id <> ''),
	CONSTRAINT "ade_valid_status" CHECK (status IN ('pending', 'committed', 'failed', 'superseded')),
	CONSTRAINT "ade_balance" CHECK (total_debit_minor = total_credit_minor)
);
--> statement-breakpoint
ALTER TABLE "acct_derived_entries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "acct_events" (
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
	"event_id" text NOT NULL,
	"event_type" text NOT NULL,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"source_package" text NOT NULL,
	"source_document_id" uuid,
	"source_document_type" text,
	"effective_at" timestamp with time zone NOT NULL,
	"payload" jsonb NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"corrects_event_id" text,
	CONSTRAINT "acct_events_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "ae_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "ae_event_id_not_empty" CHECK (event_id <> '')
);
--> statement-breakpoint
ALTER TABLE "acct_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "acct_mapping_versions" (
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
	"mapping_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"effective_from" timestamp with time zone NOT NULL,
	"effective_to" timestamp with time zone,
	"rules" jsonb NOT NULL,
	"rules_hash" text NOT NULL,
	"is_current" boolean DEFAULT true NOT NULL,
	"published_by" text,
	"published_at" timestamp with time zone,
	"change_notes" text,
	CONSTRAINT "acct_mapping_versions_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "amv_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "amv_positive_version" CHECK (version_number > 0)
);
--> statement-breakpoint
ALTER TABLE "acct_mapping_versions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "acct_mappings" (
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
	"mapping_code" text NOT NULL,
	"name" text NOT NULL,
	"event_type" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	CONSTRAINT "acct_mappings_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "am_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "acct_mappings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "advisories" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"type" text NOT NULL,
	"severity" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"entity_type" text,
	"entity_id" uuid,
	"summary" text NOT NULL,
	"explanation" text NOT NULL,
	"explain_version" text DEFAULT 'v1' NOT NULL,
	"method" text NOT NULL,
	"params" jsonb NOT NULL,
	"score" double precision,
	"recommended_actions" jsonb,
	"fingerprint" text NOT NULL,
	"run_id" uuid,
	"window_start" timestamp with time zone,
	"window_end" timestamp with time zone,
	"channel" text DEFAULT 'system' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT COALESCE(auth.user_id(), 'system') NOT NULL,
	CONSTRAINT "advisories_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "advisories_type_taxonomy" CHECK (type ~ '^(anomaly|forecast|rule).[a-z0-9_]+.[a-z0-9_]+$'),
	CONSTRAINT "advisories_severity_enum" CHECK (severity IN ('info','warn','critical')),
	CONSTRAINT "advisories_status_enum" CHECK (status IN ('open','ack','dismissed')),
	CONSTRAINT "advisories_method_enum" CHECK (method IN ('EWMA','CUSUM','MAD','SES','HOLT','HOLT_WINTERS','RULE')),
	CONSTRAINT "advisories_fingerprint_len" CHECK (length(fingerprint) = 64),
	CONSTRAINT "advisories_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "advisories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "advisory_evidence" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"advisory_id" uuid NOT NULL,
	"evidence_type" text NOT NULL,
	"source" text NOT NULL,
	"payload" jsonb NOT NULL,
	"hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "advisory_evidence_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "advisory_evidence_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "advisory_evidence_type_enum" CHECK (evidence_type IN ('query','snapshot','metric_series','calculation'))
);
--> statement-breakpoint
ALTER TABLE "advisory_evidence" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"label" text NOT NULL,
	"key_hash" text NOT NULL,
	"key_prefix" text NOT NULL,
	"scopes" text[] DEFAULT '{}'::text[] NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"last_used_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	CONSTRAINT "api_keys_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "api_keys_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "api_keys_label_not_empty" CHECK (label <> '')
);
--> statement-breakpoint
ALTER TABLE "api_keys" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "assets" (
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
	"asset_number" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"serial_number" text,
	"purchase_date" date,
	"purchase_price" numeric(18, 2),
	"location" text,
	"status" text DEFAULT 'active' NOT NULL,
	"asset_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"acquisition_cost_minor" bigint,
	"residual_value_minor" bigint,
	"useful_life_months" integer,
	"depreciation_method" text DEFAULT 'none',
	CONSTRAINT "assets_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "assets_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "assets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
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
	"channel" text DEFAULT 'web_ui' NOT NULL,
	"ip" text,
	"user_agent" text,
	"reason" text,
	"authority_snapshot" jsonb,
	"idempotency_key" text,
	"affected_count" integer DEFAULT 1,
	"value_delta" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"before" jsonb,
	"after" jsonb,
	"diff" jsonb,
	CONSTRAINT "audit_logs_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "audit_logs_mutation_id_unique" UNIQUE("mutation_id"),
	CONSTRAINT "audit_logs_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "audit_programs" (
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
	"program_code" text NOT NULL,
	"name" text NOT NULL,
	"audit_type" text NOT NULL,
	"frequency" text,
	"scope" text,
	"lead_auditor" text,
	"status" text DEFAULT 'planned' NOT NULL,
	"program_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "audit_programs_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "audit_programs_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "audit_programs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "bank_statements" (
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
	"statement_no" text,
	"bank_account_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"opening_balance_minor" bigint NOT NULL,
	"closing_balance_minor" bigint NOT NULL,
	"total_debits_minor" bigint DEFAULT 0 NOT NULL,
	"total_credits_minor" bigint DEFAULT 0 NOT NULL,
	"transaction_count" integer DEFAULT 0 NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"import_source" text DEFAULT 'manual' NOT NULL,
	"reconciliation_status" text DEFAULT 'unreconciled' NOT NULL,
	CONSTRAINT "bank_statements_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "bs_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "bs_valid_source" CHECK (import_source IN ('manual', 'mt940', 'camt053', 'csv', 'ofx')),
	CONSTRAINT "bs_valid_recon_status" CHECK (reconciliation_status IN ('unreconciled', 'partial', 'reconciled')),
	CONSTRAINT "bs_valid_dates" CHECK (end_date >= start_date)
);
--> statement-breakpoint
ALTER TABLE "bank_statements" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "billing_cycles" (
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
	"subscription_id" uuid NOT NULL,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"amount_minor" bigint NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"invoice_id" uuid,
	"payment_ref" text,
	"failure_reason" text,
	CONSTRAINT "billing_cycles_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "bc_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "bc_valid_status" CHECK (status IN ('pending', 'invoiced', 'paid', 'failed', 'void')),
	CONSTRAINT "bc_valid_period" CHECK (period_end >= period_start)
);
--> statement-breakpoint
ALTER TABLE "billing_cycles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "biological_asset_items" (
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
	"asset_name" text NOT NULL,
	"asset_class" text NOT NULL,
	"measurement_date" date NOT NULL,
	"currency_code" text NOT NULL,
	"fair_value_minor" bigint DEFAULT 0 NOT NULL,
	"cost_minor" bigint DEFAULT 0 NOT NULL,
	"harvest_yield" numeric(18, 6),
	"harvest_uom" text,
	CONSTRAINT "biological_asset_items_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "biological_asset_items_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "biological_asset_items_valid_asset_class" CHECK (asset_class IN ('bearer-plant', 'consumable', 'livestock', 'aquaculture', 'timber'))
);
--> statement-breakpoint
ALTER TABLE "biological_asset_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "boms" (
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
	"product_id" uuid NOT NULL,
	"is_active" text DEFAULT 'true' NOT NULL,
	"bom_lines" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "boms_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "boms_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "boms" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "borrowing_cost_items" (
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
	"period_key" text NOT NULL,
	"qualifying_asset_id" uuid NOT NULL,
	"currency_code" text NOT NULL,
	"borrowing_minor" bigint DEFAULT 0 NOT NULL,
	"capitalised_minor" bigint DEFAULT 0 NOT NULL,
	"expensed_minor" bigint DEFAULT 0 NOT NULL,
	"capitalisation_rate_bps" integer,
	"status" text DEFAULT 'active' NOT NULL,
	CONSTRAINT "borrowing_cost_items_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "borrowing_cost_items_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "borrowing_cost_items_valid_status" CHECK (status IN ('active', 'suspended', 'ceased')),
	CONSTRAINT "borrowing_cost_items_period_format" CHECK (period_key ~ '^[0-9]{4}-[0-9]{2}$')
);
--> statement-breakpoint
ALTER TABLE "borrowing_cost_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "budgets" (
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
	"doc_status" "doc_status" DEFAULT 'draft' NOT NULL,
	"doc_no" text,
	"budget_number" text,
	"fiscal_year" integer NOT NULL,
	"department" text,
	"total_amount_minor" bigint DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'MYR' NOT NULL,
	"budget_lines" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "budgets_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "budgets_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "budgets_doc_status_valid" CHECK (doc_status IN ('draft', 'submitted', 'active', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "budgets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "campaigns" (
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
	"doc_status" "doc_status" DEFAULT 'draft' NOT NULL,
	"doc_no" text,
	"campaign_code" text,
	"name" text NOT NULL,
	"campaign_type" text NOT NULL,
	"start_date" date,
	"end_date" date,
	"budget" numeric(18, 2),
	"target_audience" text,
	"campaign_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "campaigns_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "campaigns_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "campaigns_doc_status_valid" CHECK (doc_status IN ('draft', 'submitted', 'active', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "campaigns" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "chart_of_accounts" (
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
	"account_code" text NOT NULL,
	"account_name" text NOT NULL,
	"account_type" text NOT NULL,
	"parent_account_id" uuid,
	"is_postable" boolean DEFAULT true NOT NULL,
	"normal_balance" text DEFAULT 'debit' NOT NULL,
	"currency" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	CONSTRAINT "chart_of_accounts_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "coa_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "coa_valid_account_type" CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
	CONSTRAINT "coa_valid_normal_balance" CHECK (normal_balance IN ('debit', 'credit'))
);
--> statement-breakpoint
ALTER TABLE "chart_of_accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "close_evidence" (
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
	"close_task_id" uuid NOT NULL,
	"evidence_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"file_url" text,
	"mime_type" text,
	"file_size_bytes" integer,
	"provided_by" text NOT NULL,
	"provided_at" timestamp with time zone NOT NULL,
	CONSTRAINT "close_evidence_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "cev_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "cev_valid_type" CHECK (evidence_type IN ('attachment', 'sign-off', 'report', 'screenshot', 'note'))
);
--> statement-breakpoint
ALTER TABLE "close_evidence" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "close_tasks" (
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
	"ledger_id" uuid NOT NULL,
	"fiscal_year" text NOT NULL,
	"period_number" text NOT NULL,
	"task_code" text NOT NULL,
	"name" text NOT NULL,
	"category" text DEFAULT 'close' NOT NULL,
	"sequence_order" integer DEFAULT 0 NOT NULL,
	"task_status" text DEFAULT 'pending' NOT NULL,
	"completed_by" text,
	"completed_at" timestamp with time zone,
	"depends_on" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"notes" text,
	CONSTRAINT "close_tasks_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "ct_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "ct_valid_category" CHECK (category IN ('pre-close', 'close', 'post-close', 'review')),
	CONSTRAINT "ct_valid_status" CHECK (task_status IN ('pending', 'in-progress', 'completed', 'skipped', 'blocked'))
);
--> statement-breakpoint
ALTER TABLE "close_tasks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "communications" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"type" text NOT NULL,
	"subject" text,
	"body" text,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "communications_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "comms_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "comms_entity_type_not_empty" CHECK (entity_type <> ''),
	CONSTRAINT "comms_type_valid" CHECK (type IN ('email', 'comment', 'note', 'call'))
);
--> statement-breakpoint
ALTER TABLE "communications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "companies" (
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
	"name" text NOT NULL,
	"legal_name" text,
	"registration_no" text,
	"tax_id" text,
	"base_currency" text DEFAULT 'MYR' NOT NULL,
	"fiscal_year_start" integer DEFAULT 1,
	"address" jsonb,
	CONSTRAINT "companies_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "companies_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "companies" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "contacts" (
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
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"company" text,
	"notes" text,
	CONSTRAINT "contacts_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "contacts_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "contacts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "contracts" (
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
	"contract_number" text NOT NULL,
	"title" text NOT NULL,
	"party_a" text NOT NULL,
	"party_b" text NOT NULL,
	"start_date" date,
	"end_date" date,
	"value" numeric(18, 2),
	"status" text DEFAULT 'draft' NOT NULL,
	"terms" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "contracts_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "contracts_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "contracts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "cost_centers" (
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
	"description" text,
	"parent_id" text,
	"is_active" text DEFAULT 'true' NOT NULL,
	CONSTRAINT "cost_centers_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "cost_centers_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "cost_centers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "credit_exposures" (
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
	"customer_id" uuid NOT NULL,
	"snapshot_date" date NOT NULL,
	"total_outstanding_minor" bigint NOT NULL,
	"overdue_amount_minor" bigint DEFAULT 0 NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"aging_buckets" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"ecl_stage" text DEFAULT 'stage-1' NOT NULL,
	"ecl_amount_minor" bigint DEFAULT 0 NOT NULL,
	"probability_of_default" text,
	"loss_given_default" text,
	CONSTRAINT "credit_exposures_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "ce_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "ce_valid_ecl_stage" CHECK (ecl_stage IN ('stage-1', 'stage-2', 'stage-3'))
);
--> statement-breakpoint
ALTER TABLE "credit_exposures" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "credit_limits" (
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
	"customer_id" uuid NOT NULL,
	"limit_amount_minor" bigint NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"current_exposure_minor" bigint DEFAULT 0 NOT NULL,
	"available_credit_minor" bigint NOT NULL,
	"risk_rating" text DEFAULT 'medium' NOT NULL,
	"credit_score" text,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"last_review_date" date,
	"approved_by" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"notes" text,
	CONSTRAINT "credit_limits_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "cl_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "cl_valid_risk" CHECK (risk_rating IN ('low', 'medium', 'high', 'critical')),
	CONSTRAINT "cl_positive_limit" CHECK (limit_amount_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE "credit_limits" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "crop_plans" (
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
	"season" text NOT NULL,
	"crop_type" text NOT NULL,
	"planting_date" date,
	"harvest_date" date,
	"area" numeric(18, 2),
	"plan_details" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "crop_plans_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "crop_plans_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "crop_plans" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "currencies" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"symbol" text,
	"minor_units" integer DEFAULT 2 NOT NULL,
	"is_base" boolean DEFAULT false NOT NULL,
	"fx_rate_to_base" numeric(20, 10) DEFAULT '1',
	"enabled" boolean DEFAULT true NOT NULL,
	CONSTRAINT "currencies_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "currencies_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "currencies" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "currency_exchanges" (
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
	"from_currency" text NOT NULL,
	"to_currency" text NOT NULL,
	"rate" text NOT NULL,
	"rate_date" timestamp with time zone NOT NULL,
	"source" text DEFAULT 'manual' NOT NULL,
	"is_latest" boolean DEFAULT false NOT NULL,
	CONSTRAINT "currency_exchanges_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "currency_exchanges_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "currency_exchanges_rate_positive" CHECK (rate::numeric > 0)
);
--> statement-breakpoint
ALTER TABLE "currency_exchanges" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "custom_field_sync_queue" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"queued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_error" text,
	"next_retry_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	CONSTRAINT "custom_field_sync_queue_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "custom_field_sync_queue_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "custom_field_sync_queue" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "custom_field_values" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"field_id" uuid NOT NULL,
	"value_text" text,
	"value_int" integer,
	"value_numeric" numeric(20, 10),
	"value_bool" boolean,
	"value_date" date,
	"value_ts" timestamp with time zone,
	"value_json" jsonb,
	"value_uuid" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"source" text DEFAULT 'user' NOT NULL,
	CONSTRAINT "custom_field_values_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "custom_field_values_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "custom_field_values_source_chk" CHECK (source IN ('user','rule','import','system')),
	CONSTRAINT "custom_field_values_exactly_one_typed_col" CHECK ((
        (value_text    IS NOT NULL)::int +
        (value_int     IS NOT NULL)::int +
        (value_numeric IS NOT NULL)::int +
        (value_bool    IS NOT NULL)::int +
        (value_date    IS NOT NULL)::int +
        (value_ts      IS NOT NULL)::int +
        (value_json    IS NOT NULL)::int +
        (value_uuid    IS NOT NULL)::int
        = 1
      ))
);
--> statement-breakpoint
ALTER TABLE "custom_field_values" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "custom_fields" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"entity_type" text NOT NULL,
	"field_name" text NOT NULL,
	"field_label" text NOT NULL,
	"field_type" text NOT NULL,
	"type_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"storage_mode" text DEFAULT 'jsonb_only' NOT NULL,
	"default_value" jsonb,
	"is_required" boolean DEFAULT false NOT NULL,
	"is_searchable" boolean DEFAULT false NOT NULL,
	"is_filterable" boolean DEFAULT false NOT NULL,
	"is_sortable" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"section" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL,
	"is_deprecated" boolean DEFAULT false NOT NULL,
	"is_unique" boolean DEFAULT false NOT NULL,
	"schema_hash" text NOT NULL,
	CONSTRAINT "custom_fields_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "custom_fields_org_entity_id_uniq" UNIQUE("org_id","entity_type","id"),
	CONSTRAINT "custom_fields_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "custom_fields_field_name_snake" CHECK (field_name ~ '^[a-z][a-z0-9_]*$'),
	CONSTRAINT "custom_fields_storage_mode_chk" CHECK (storage_mode IN ('jsonb_only','indexed')),
	CONSTRAINT "custom_fields_required_needs_default" CHECK (is_required = false OR default_value IS NOT NULL),
	CONSTRAINT "custom_fields_type_config_is_object" CHECK (jsonb_typeof(type_config) = 'object'),
	CONSTRAINT "custom_fields_type_config_enum_choices" CHECK (field_type NOT IN ('enum','multi_enum') OR (type_config ? 'choices')),
	CONSTRAINT "custom_fields_type_config_short_text_maxlen" CHECK (field_type <> 'short_text' OR (type_config ? 'maxLength')),
	CONSTRAINT "custom_fields_type_config_entity_ref_target" CHECK (field_type <> 'entity_ref' OR (type_config ? 'targetEntity'))
);
--> statement-breakpoint
ALTER TABLE "custom_fields" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "customers" (
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
	"legal_name" text,
	"tax_id" text,
	"email" text,
	"phone" text,
	"currency" text DEFAULT 'MYR' NOT NULL,
	"payment_terms" text,
	"credit_limit" text,
	"billing_address" jsonb,
	"shipping_address" jsonb,
	CONSTRAINT "customers_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "customers_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "deferred_tax_items" (
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
	"period_key" text NOT NULL,
	"account_id" uuid,
	"asset_or_liability" text NOT NULL,
	"carrying_minor" bigint DEFAULT 0 NOT NULL,
	"tax_base_minor" bigint DEFAULT 0 NOT NULL,
	"temporary_diff_minor" bigint DEFAULT 0 NOT NULL,
	"tax_rate_bps" integer NOT NULL,
	"dta_minor" bigint DEFAULT 0 NOT NULL,
	"dtl_minor" bigint DEFAULT 0 NOT NULL,
	"currency_code" text NOT NULL,
	CONSTRAINT "deferred_tax_items_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "deferred_tax_items_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "deferred_tax_items_valid_type" CHECK (asset_or_liability IN ('dta', 'dtl')),
	CONSTRAINT "deferred_tax_items_tax_rate_positive" CHECK (tax_rate_bps > 0),
	CONSTRAINT "deferred_tax_items_period_format" CHECK (period_key ~ '^[0-9]{4}-[0-9]{2}$')
);
--> statement-breakpoint
ALTER TABLE "deferred_tax_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "delivery_note_lines" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"delivery_note_id" uuid NOT NULL,
	"line_number" integer DEFAULT 1 NOT NULL,
	"product_id" uuid,
	"description" text,
	"qty" text DEFAULT '0' NOT NULL,
	"uom" text,
	"unit_cost" text DEFAULT '0' NOT NULL,
	"total_cost" text DEFAULT '0' NOT NULL,
	"purchase_order_line_id" uuid,
	"notes" text,
	CONSTRAINT "delivery_note_lines_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "delivery_note_lines_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "delivery_note_lines" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "delivery_notes" (
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
	"doc_number" text NOT NULL,
	"supplier_id" uuid,
	"purchase_order_id" uuid,
	"warehouse_id" uuid,
	"site_id" uuid,
	"received_at" timestamp with time zone,
	"notes" text,
	"doc_status" text DEFAULT 'draft' NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"exchange_rate" text DEFAULT '1' NOT NULL,
	"metadata" jsonb,
	CONSTRAINT "delivery_notes_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "delivery_notes_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "delivery_notes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "depreciation_schedules" (
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
	"asset_id" uuid NOT NULL,
	"fiscal_period_id" uuid NOT NULL,
	"depreciation_minor" bigint NOT NULL,
	"accum_depreciation_minor" bigint NOT NULL,
	"net_book_value_minor" bigint NOT NULL,
	"method" text NOT NULL,
	"status" text DEFAULT 'calculated' NOT NULL,
	CONSTRAINT "depreciation_schedules_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "depreciation_schedules_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "depreciation_schedules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "document_types" (
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
	"doc_type_code" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"number_prefix" text,
	"number_allocation" text DEFAULT 'auto' NOT NULL,
	"posting_keys" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"allow_reversal" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	CONSTRAINT "document_types_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "dt_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "dt_valid_category" CHECK (category IN ('journal', 'invoice', 'payment', 'receipt', 'memo', 'adjustment')),
	CONSTRAINT "dt_valid_allocation" CHECK (number_allocation IN ('auto', 'manual', 'external'))
);
--> statement-breakpoint
ALTER TABLE "document_types" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "documents" (
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
	"document_number" text NOT NULL,
	"title" text NOT NULL,
	"category" text,
	"file_url" text,
	"file_size" integer,
	"mime_type" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "documents_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "documents_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "documents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "employee_benefit_plans" (
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
	"plan_name" text NOT NULL,
	"plan_type" text NOT NULL,
	"benefit_type" text NOT NULL,
	"measurement_date" date NOT NULL,
	"currency_code" text NOT NULL,
	"obligation_minor" bigint DEFAULT 0 NOT NULL,
	"plan_asset_minor" bigint DEFAULT 0 NOT NULL,
	"net_liability_minor" bigint DEFAULT 0 NOT NULL,
	"discount_rate_bps" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "employee_benefit_plans_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "employee_benefit_plans_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "employee_benefit_plans_valid_plan_type" CHECK (plan_type IN ('defined-benefit', 'defined-contribution', 'other-long-term', 'termination')),
	CONSTRAINT "employee_benefit_plans_valid_benefit_type" CHECK (benefit_type IN ('pension', 'medical', 'life-insurance', 'gratuity', 'other'))
);
--> statement-breakpoint
ALTER TABLE "employee_benefit_plans" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "employees" (
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
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text,
	"phone" text,
	"department" text,
	"position" text,
	"hire_date" date,
	"termination_date" date,
	"employment_status" text DEFAULT 'active' NOT NULL,
	"personal_info" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "employees_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "employees_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "employees" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "entity_attachments" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"file_id" uuid NOT NULL,
	"label" text,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "entity_attachments_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "entity_attach_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "entity_attach_entity_type_not_empty" CHECK (entity_type <> '')
);
--> statement-breakpoint
ALTER TABLE "entity_attachments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "entity_versions" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"version" integer NOT NULL,
	"parent_version" integer,
	"is_fork" boolean DEFAULT false NOT NULL,
	"fork_reason" text,
	"snapshot" jsonb NOT NULL,
	"diff" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text NOT NULL,
	CONSTRAINT "entity_versions_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "entity_versions_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "entity_versions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "entity_view_fields" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"view_id" uuid NOT NULL,
	"field_source" text NOT NULL,
	"field_key" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"is_sortable" boolean DEFAULT true NOT NULL,
	"is_filterable" boolean DEFAULT true NOT NULL,
	"column_width" integer,
	"component_override" text,
	CONSTRAINT "entity_view_fields_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "entity_view_fields_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "entity_view_fields_source_chk" CHECK (field_source IN ('core','module','custom'))
);
--> statement-breakpoint
ALTER TABLE "entity_view_fields" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "entity_views" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"entity_type" text NOT NULL,
	"view_name" text NOT NULL,
	"view_type" text DEFAULT 'table' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "entity_views_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "entity_views_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "entity_views_view_type_chk" CHECK (view_type IN ('table','form','kanban','detail'))
);
--> statement-breakpoint
ALTER TABLE "entity_views" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "expense_reports" (
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
	"doc_status" "doc_status" DEFAULT 'draft' NOT NULL,
	"doc_no" text,
	"report_number" text,
	"employee_id" uuid NOT NULL,
	"report_date" date,
	"total_amount_minor" bigint DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'MYR' NOT NULL,
	"purpose" text,
	"expense_lines" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "expense_reports_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "expense_reports_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "expense_reports_doc_status_valid" CHECK (doc_status IN ('draft', 'submitted', 'active', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "expense_reports" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "financial_instruments" (
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
	"instrument_no" text NOT NULL,
	"name" text NOT NULL,
	"instrument_type" text NOT NULL,
	"classification" text NOT NULL,
	"business_model" text NOT NULL,
	"sppi_test_result" text,
	"counterparty_id" uuid,
	"face_value_minor" bigint NOT NULL,
	"carrying_amount_minor" bigint NOT NULL,
	"fair_value_minor" bigint,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"effective_interest_rate" numeric(12, 8),
	"stated_rate" numeric(12, 8),
	"origination_date" date NOT NULL,
	"maturity_date" date,
	"ecl_stage" text DEFAULT 'stage-1',
	"ecl_amount_minor" bigint DEFAULT 0 NOT NULL,
	"fair_value_level" text,
	"instrument_details" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "financial_instruments_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "fi_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "fi_valid_classification" CHECK (classification IN ('amortised-cost', 'fvoci', 'fvtpl')),
	CONSTRAINT "fi_valid_business_model" CHECK (business_model IN ('hold-to-collect', 'hold-to-collect-and-sell', 'other')),
	CONSTRAINT "fi_valid_ecl_stage" CHECK (ecl_stage IS NULL OR ecl_stage IN ('stage-1', 'stage-2', 'stage-3')),
	CONSTRAINT "fi_valid_fv_level" CHECK (fair_value_level IS NULL OR fair_value_level IN ('level-1', 'level-2', 'level-3'))
);
--> statement-breakpoint
ALTER TABLE "financial_instruments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "fiscal_periods" (
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
	"name" text NOT NULL,
	"period_type" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"is_closed" boolean DEFAULT false NOT NULL,
	"fiscal_year" text NOT NULL,
	"period_number" text,
	CONSTRAINT "fiscal_periods_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "fiscal_periods_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "fiscal_periods_valid_dates" CHECK (end_date >= start_date)
);
--> statement-breakpoint
ALTER TABLE "fiscal_periods" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "fixed_assets" (
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
	"asset_number" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"acquisition_date" date,
	"acquisition_cost" numeric(18, 2),
	"depreciation_method" text,
	"useful_life" integer,
	"salvage_value" numeric(18, 2),
	"asset_details" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "fixed_assets_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "fixed_assets_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "fixed_assets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "forecasts" (
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
	"doc_status" "doc_status" DEFAULT 'draft' NOT NULL,
	"doc_no" text,
	"forecast_number" text,
	"period" text NOT NULL,
	"forecast_type" text NOT NULL,
	"total_amount_minor" bigint DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'MYR' NOT NULL,
	"forecast_lines" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "forecasts_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "forecasts_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "forecasts_doc_status_valid" CHECK (doc_status IN ('draft', 'submitted', 'active', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "forecasts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "franchise_applications" (
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
	"doc_status" "doc_status" DEFAULT 'draft' NOT NULL,
	"doc_no" text,
	"application_number" text,
	"applicant_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"territory" text,
	"investment_capacity" numeric(18, 2),
	"application_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "franchise_applications_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "franchise_applications_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "franchise_applications_doc_status_valid" CHECK (doc_status IN ('draft', 'submitted', 'active', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "franchise_applications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "fx_rates" (
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
	"from_currency" text NOT NULL,
	"to_currency" text NOT NULL,
	"rate" numeric(18, 8) NOT NULL,
	"effective_date" date NOT NULL,
	"source" text DEFAULT 'manual' NOT NULL,
	CONSTRAINT "fx_rates_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "fx_rates_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "fx_rates_positive_rate" CHECK (rate > 0)
);
--> statement-breakpoint
ALTER TABLE "fx_rates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "government_grant_items" (
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
	"grant_no" text NOT NULL,
	"grant_type" text NOT NULL,
	"period_key" text NOT NULL,
	"currency_code" text NOT NULL,
	"grant_amount_minor" bigint DEFAULT 0 NOT NULL,
	"amortised_minor" bigint DEFAULT 0 NOT NULL,
	"deferred_minor" bigint DEFAULT 0 NOT NULL,
	"related_asset_id" uuid,
	"conditions" text,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "government_grant_items_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "government_grant_items_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "government_grant_items_valid_grant_type" CHECK (grant_type IN ('income', 'capital')),
	CONSTRAINT "government_grant_items_period_format" CHECK (period_key ~ '^[0-9]{4}-[0-9]{2}$')
);
--> statement-breakpoint
ALTER TABLE "government_grant_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "hedge_designations" (
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
	"designation_no" text NOT NULL,
	"hedge_type" text NOT NULL,
	"hedging_instrument_id" uuid NOT NULL,
	"hedged_item" text NOT NULL,
	"hedged_risk" text NOT NULL,
	"hedge_ratio" text DEFAULT '1' NOT NULL,
	"designation_date" date NOT NULL,
	"de_designation_date" date,
	"is_active" boolean DEFAULT true NOT NULL,
	"documentation" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"effectiveness_status" text DEFAULT 'pending' NOT NULL,
	CONSTRAINT "hedge_designations_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "hd_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "hd_valid_type" CHECK (hedge_type IN ('fair-value', 'cash-flow', 'net-investment')),
	CONSTRAINT "hd_valid_risk" CHECK (hedged_risk IN ('interest-rate', 'fx', 'commodity-price', 'credit', 'equity-price')),
	CONSTRAINT "hd_valid_effectiveness" CHECK (effectiveness_status IN ('effective', 'ineffective', 'pending'))
);
--> statement-breakpoint
ALTER TABLE "hedge_designations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "hedge_effectiveness_tests" (
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
	"designation_id" uuid NOT NULL,
	"test_type" text NOT NULL,
	"test_method" text NOT NULL,
	"test_date" date NOT NULL,
	"period_key" text,
	"instrument_fv_change_minor" bigint NOT NULL,
	"hedged_item_fv_change_minor" bigint NOT NULL,
	"effectiveness_ratio" numeric(12, 6),
	"result" text NOT NULL,
	"ineffective_portion_minor" bigint DEFAULT 0 NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"test_details" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"notes" text,
	CONSTRAINT "hedge_effectiveness_tests_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "het_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "het_valid_test_type" CHECK (test_type IN ('prospective', 'retrospective')),
	CONSTRAINT "het_valid_method" CHECK (test_method IN ('dollar-offset', 'regression', 'var-reduction', 'critical-terms', 'other')),
	CONSTRAINT "het_valid_result" CHECK (result IN ('effective', 'ineffective'))
);
--> statement-breakpoint
ALTER TABLE "hedge_effectiveness_tests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ic_agreements" (
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
	"agreement_code" text NOT NULL,
	"name" text NOT NULL,
	"party_a_company_id" uuid NOT NULL,
	"party_b_company_id" uuid NOT NULL,
	"agreement_type" text NOT NULL,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"tp_policy_id" uuid,
	"terms" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"notes" text,
	CONSTRAINT "ic_agreements_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "ica_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "ica_valid_type" CHECK (agreement_type IN ('goods', 'services', 'loan', 'cost-sharing', 'royalty', 'management-fee')),
	CONSTRAINT "ica_different_parties" CHECK (party_a_company_id <> party_b_company_id)
);
--> statement-breakpoint
ALTER TABLE "ic_agreements" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ic_transactions" (
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
	"transaction_no" text,
	"transaction_type" text NOT NULL,
	"from_company_id" uuid NOT NULL,
	"to_company_id" uuid NOT NULL,
	"amount_minor" bigint NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"transaction_date" date NOT NULL,
	"match_status" text DEFAULT 'unmatched' NOT NULL,
	"matched_transaction_id" uuid,
	"source_doc_ref" text,
	"description" text,
	CONSTRAINT "ic_transactions_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "ict_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "ict_valid_type" CHECK (transaction_type IN ('sale', 'purchase', 'service', 'loan', 'dividend', 'management-fee', 'royalty')),
	CONSTRAINT "ict_valid_match" CHECK (match_status IN ('unmatched', 'matched', 'disputed', 'eliminated')),
	CONSTRAINT "ict_different_companies" CHECK (from_company_id <> to_company_id)
);
--> statement-breakpoint
ALTER TABLE "ic_transactions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "idempotency_keys" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"idempotency_key" text NOT NULL,
	"action_type" text NOT NULL,
	"request_hash" text NOT NULL,
	"receipt" jsonb,
	"status" text DEFAULT 'complete' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone DEFAULT now() + interval '24 hours' NOT NULL,
	CONSTRAINT "idempotency_keys_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "idempotency_keys_key_not_empty" CHECK (idempotency_key <> '')
);
--> statement-breakpoint
CREATE TABLE "impairment_tests" (
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
	"test_date" date NOT NULL,
	"asset_id" uuid,
	"cgu_id" uuid,
	"currency_code" text NOT NULL,
	"carrying_minor" bigint DEFAULT 0 NOT NULL,
	"recoverable_minor" bigint DEFAULT 0 NOT NULL,
	"impairment_minor" bigint DEFAULT 0 NOT NULL,
	"recovery_method" text NOT NULL,
	"is_reversed" boolean DEFAULT false NOT NULL,
	CONSTRAINT "impairment_tests_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "impairment_tests_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "impairment_tests_valid_recovery_method" CHECK (recovery_method IN ('fvlcd', 'viu')),
	CONSTRAINT "impairment_tests_impairment_non_negative" CHECK (impairment_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE "impairment_tests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "intangible_assets" (
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
	"asset_number" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"measurement_model" text DEFAULT 'cost' NOT NULL,
	"useful_life_type" text DEFAULT 'finite' NOT NULL,
	"useful_life_months" integer,
	"amortization_method" text DEFAULT 'straight-line',
	"acquisition_date" date NOT NULL,
	"acquisition_cost_minor" bigint NOT NULL,
	"accumulated_amortization_minor" bigint DEFAULT 0 NOT NULL,
	"accumulated_impairment_minor" bigint DEFAULT 0 NOT NULL,
	"carrying_amount_minor" bigint NOT NULL,
	"residual_value_minor" bigint DEFAULT 0 NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"fair_value" numeric(18, 2),
	"rd_capitalization_met" boolean,
	"asset_details" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "intangible_assets_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "ia_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "ia_valid_category" CHECK (category IN ('software', 'patent', 'trademark', 'license', 'goodwill', 'development', 'other')),
	CONSTRAINT "ia_valid_model" CHECK (measurement_model IN ('cost', 'revaluation')),
	CONSTRAINT "ia_valid_life_type" CHECK (useful_life_type IN ('finite', 'indefinite'))
);
--> statement-breakpoint
ALTER TABLE "intangible_assets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "integration_outbox" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"trace_id" text,
	"intent_key" text NOT NULL,
	"target" text NOT NULL,
	"event" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"payload" jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" text DEFAULT '0' NOT NULL,
	"last_error" text,
	"process_after" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "integration_outbox_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
CREATE TABLE "inventory_transfers" (
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
	"doc_status" "doc_status" DEFAULT 'draft' NOT NULL,
	"doc_no" text,
	"transfer_number" text,
	"from_warehouse" uuid NOT NULL,
	"to_warehouse" uuid NOT NULL,
	"transfer_date" date,
	"transfer_lines" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "inventory_transfers_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "inventory_transfers_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "inventory_transfers_doc_status_valid" CHECK (doc_status IN ('draft', 'submitted', 'active', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "inventory_transfers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "investment_properties" (
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
	"property_name" text NOT NULL,
	"category" text NOT NULL,
	"measurement_model" text NOT NULL,
	"measurement_date" date NOT NULL,
	"currency_code" text NOT NULL,
	"fair_value_minor" bigint DEFAULT 0 NOT NULL,
	"cost_minor" bigint DEFAULT 0 NOT NULL,
	"accumulated_depr_minor" bigint DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "investment_properties_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "investment_properties_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "investment_properties_valid_category" CHECK (category IN ('land', 'building', 'mixed')),
	CONSTRAINT "investment_properties_valid_model" CHECK (measurement_model IN ('fair-value', 'cost'))
);
--> statement-breakpoint
ALTER TABLE "investment_properties" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "job_applications" (
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
	"applicant_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"position" text NOT NULL,
	"status" text DEFAULT 'received' NOT NULL,
	"resume_url" text,
	"application_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "job_applications_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "job_applications_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "job_applications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "journal_entries" (
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
	"entry_no" text,
	"entry_type" text DEFAULT 'manual' NOT NULL,
	"posting_status" text DEFAULT 'unposted' NOT NULL,
	"posting_date" date,
	"posted_at" timestamp with time zone,
	"posted_by" text,
	"memo" text,
	"source_type" text,
	"source_id" uuid,
	"currency" text DEFAULT 'MYR' NOT NULL,
	"total_debit_minor" bigint DEFAULT 0 NOT NULL,
	"total_credit_minor" bigint DEFAULT 0 NOT NULL,
	"reverses_entry_id" uuid,
	"external_source" text,
	"external_id" text,
	CONSTRAINT "journal_entries_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "je_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "je_valid_posting_status" CHECK (posting_status IN ('unposted', 'posting', 'posted', 'reversing', 'reversed')),
	CONSTRAINT "je_valid_entry_type" CHECK (entry_type IN ('manual', 'auto', 'reversal')),
	CONSTRAINT "je_balance" CHECK (total_debit_minor = total_credit_minor)
);
--> statement-breakpoint
ALTER TABLE "journal_entries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "journal_lines" (
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
	"journal_id" uuid NOT NULL,
	"line_no" integer NOT NULL,
	"account_id" uuid NOT NULL,
	"side" text NOT NULL,
	"amount_minor" bigint NOT NULL,
	"currency" text DEFAULT 'MYR' NOT NULL,
	"memo" text,
	"cost_center_id" uuid,
	"project_id" uuid,
	CONSTRAINT "journal_lines_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "jl_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "jl_valid_side" CHECK (side IN ('debit', 'credit')),
	CONSTRAINT "jl_positive_amount" CHECK (amount_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE "journal_lines" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "leads" (
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
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text,
	"phone" text,
	"company" text,
	"title" text,
	"source" text,
	"status" text DEFAULT 'new' NOT NULL,
	"assigned_to" text,
	"contact_info" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "leads_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "leads_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "leads" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "leases" (
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
	"doc_status" "doc_status" DEFAULT 'draft' NOT NULL,
	"doc_no" text,
	"lease_number" text,
	"lessor" text NOT NULL,
	"lessee" text NOT NULL,
	"start_date" date,
	"end_date" date,
	"monthly_payment" numeric(18, 2),
	"lease_type" text NOT NULL,
	"lease_terms" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "leases_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "leases_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "leases_doc_status_valid" CHECK (doc_status IN ('draft', 'submitted', 'active', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "leases" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "leave_requests" (
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
	"doc_status" "doc_status" DEFAULT 'draft' NOT NULL,
	"doc_no" text,
	"employee_id" uuid NOT NULL,
	"leave_type" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"days" numeric(5, 2),
	"reason" text,
	CONSTRAINT "leave_requests_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "leave_requests_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "leave_requests_doc_status_valid" CHECK (doc_status IN ('draft', 'submitted', 'active', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "leave_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ledgers" (
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
	"ledger_code" text NOT NULL,
	"name" text NOT NULL,
	"ledger_type" text DEFAULT 'primary' NOT NULL,
	"chart_of_accounts_id" uuid,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"calendar_type" text DEFAULT 'calendar' NOT NULL,
	"fiscal_year_start_month" text DEFAULT '1' NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	CONSTRAINT "ledgers_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "ledgers_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "ledgers_valid_type" CHECK (ledger_type IN ('primary', 'statutory', 'tax', 'management')),
	CONSTRAINT "ledgers_valid_calendar" CHECK (calendar_type IN ('calendar', '4-4-5', '4-5-4', '5-4-4', 'custom'))
);
--> statement-breakpoint
ALTER TABLE "ledgers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "legal_entities" (
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
	"legal_name" text NOT NULL,
	"registration_number" text,
	"jurisdiction" text,
	"entity_type" text NOT NULL,
	"incorporation_date" date,
	"entity_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "legal_entities_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "legal_entities_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "legal_entities" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "livestock_records" (
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
	"animal_id" text NOT NULL,
	"species" text NOT NULL,
	"breed" text,
	"birth_date" date,
	"gender" text,
	"status" text DEFAULT 'active' NOT NULL,
	"health_records" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "livestock_records_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "livestock_records_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "livestock_records" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "match_results" (
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
	"statement_line_id" uuid NOT NULL,
	"matched_entity_type" text NOT NULL,
	"matched_entity_id" uuid NOT NULL,
	"matched_amount_minor" bigint NOT NULL,
	"confidence" text NOT NULL,
	"score" integer,
	"status" text DEFAULT 'suggested' NOT NULL,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"match_metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "match_results_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "match_results_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "match_results_valid_score" CHECK (score IS NULL OR (score >= 0 AND score <= 100))
);
--> statement-breakpoint
ALTER TABLE "match_results" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "meta_alias_resolution_rules" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"scope_type" text NOT NULL,
	"scope_key" text NOT NULL,
	"alias_set_id" uuid NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meta_alias_resolution_rules_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "meta_alias_resolution_rules_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "meta_alias_resolution_rules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "meta_alias_sets" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"set_key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"locale" text,
	"is_default" boolean DEFAULT false NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meta_alias_sets_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "meta_alias_sets_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "meta_alias_sets_set_key_snake" CHECK (set_key ~ '^[a-z][a-z0-9_]*$')
);
--> statement-breakpoint
ALTER TABLE "meta_alias_sets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "meta_aliases" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"alias_set_id" uuid NOT NULL,
	"target_type" text NOT NULL,
	"target_key" text NOT NULL,
	"alias" text NOT NULL,
	"alias_slug" text,
	"description" text,
	"synonyms" text[] DEFAULT '{}'::text[] NOT NULL,
	"is_primary" boolean DEFAULT true NOT NULL,
	"effective_from" timestamp with time zone DEFAULT now() NOT NULL,
	"effective_to" timestamp with time zone,
	"search_text" text,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meta_aliases_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "meta_aliases_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "meta_aliases_alias_not_empty" CHECK (alias <> ''),
	CONSTRAINT "meta_aliases_slug_kebab" CHECK (alias_slug IS NULL OR alias_slug ~ '^[a-z0-9][a-z0-9-]*$'),
	CONSTRAINT "meta_aliases_target_key_asset_chk" CHECK (target_type <> 'asset' OR target_key LIKE 'db.%'),
	CONSTRAINT "meta_aliases_target_key_custom_field_chk" CHECK (target_type <> 'custom_field' OR target_key LIKE '%.custom:%'),
	CONSTRAINT "meta_aliases_target_key_metric_chk" CHECK (target_type <> 'metric' OR target_key LIKE 'metric:%'),
	CONSTRAINT "meta_aliases_target_key_view_field_chk" CHECK (target_type <> 'view_field' OR target_key LIKE 'view:%'),
	CONSTRAINT "meta_aliases_target_key_enum_value_chk" CHECK (target_type <> 'enum_value' OR target_key LIKE 'enum:%')
);
--> statement-breakpoint
ALTER TABLE "meta_aliases" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "meta_assets" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"asset_type" text NOT NULL,
	"asset_key" text NOT NULL,
	"canonical_name" text NOT NULL,
	"display_name" text NOT NULL,
	"description" text,
	"owner_team" text,
	"steward_user" text,
	"classification" text,
	"quality_tier" text,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meta_assets_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "meta_assets_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "meta_assets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "meta_lineage_edges" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"from_asset_id" uuid NOT NULL,
	"to_asset_id" uuid NOT NULL,
	"edge_type" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meta_lineage_edges_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "meta_lineage_edges_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "meta_lineage_edges" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "meta_quality_checks" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"target_asset_id" uuid NOT NULL,
	"rule_type" text NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"last_run_at" timestamp with time zone,
	"last_run_status" text,
	"last_run_detail" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meta_quality_checks_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "meta_quality_checks_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "meta_quality_checks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "meta_semantic_terms" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"term_key" text NOT NULL,
	"name" text NOT NULL,
	"definition" text,
	"examples" text[],
	"classification" text,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meta_semantic_terms_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "meta_semantic_terms_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "meta_semantic_terms_term_key_snake" CHECK (term_key ~ '^[a-z][a-z0-9_]*$')
);
--> statement-breakpoint
ALTER TABLE "meta_semantic_terms" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "meta_term_links" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"term_id" uuid NOT NULL,
	"target_key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meta_term_links_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "meta_term_links_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "meta_term_links" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "meta_value_aliases" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"alias_set_id" uuid NOT NULL,
	"target_key" text NOT NULL,
	"alias" text NOT NULL,
	"synonyms" text[] DEFAULT '{}'::text[] NOT NULL,
	"effective_from" timestamp with time zone DEFAULT now() NOT NULL,
	"effective_to" timestamp with time zone,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	CONSTRAINT "meta_value_aliases_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "meta_value_aliases_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "meta_value_aliases_target_enum_chk" CHECK (target_key LIKE 'enum:%'),
	CONSTRAINT "meta_value_aliases_alias_not_empty" CHECK (alias <> '')
);
--> statement-breakpoint
ALTER TABLE "meta_value_aliases" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "migration_checkpoints" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
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
	"org_id" uuid NOT NULL,
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
	CONSTRAINT "migration_conflict_resolutions_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "migration_conflict_resolutions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "migration_conflicts" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
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
	CONSTRAINT "migration_conflicts_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "migration_conflicts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "migration_jobs" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
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
	CONSTRAINT "migration_jobs_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "migration_jobs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "migration_lineage" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"migration_job_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"legacy_id" text NOT NULL,
	"legacy_system" text NOT NULL,
	"afenda_id" uuid,
	"state" text DEFAULT 'committed' NOT NULL,
	"reserved_at" timestamp with time zone,
	"reserved_by" text,
	"committed_at" timestamp with time zone,
	"migrated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"dedupe_key" text,
	CONSTRAINT "migration_lineage_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "migration_lineage_org_entity_legacy_uniq" UNIQUE("org_id","entity_type","legacy_system","legacy_id"),
	CONSTRAINT "migration_lineage_org_entity_afenda_uniq" UNIQUE("org_id","entity_type","afenda_id"),
	CONSTRAINT "migration_lineage_state_chk" CHECK (state IN ('reserved', 'committed')),
	CONSTRAINT "migration_lineage_reserved_requires_reserved_at" CHECK (state <> 'reserved' OR reserved_at IS NOT NULL),
	CONSTRAINT "migration_lineage_committed_requires_afenda_id" CHECK (state <> 'committed' OR afenda_id IS NOT NULL),
	CONSTRAINT "migration_lineage_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "migration_lineage" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "migration_merge_explanations" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
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
	"org_id" uuid NOT NULL,
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
	"org_id" uuid NOT NULL,
	"migration_job_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"before_write_core" jsonb NOT NULL,
	"before_write_custom" jsonb NOT NULL,
	"before_version" integer,
	"captured_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "migration_row_snapshots_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "migration_row_snapshots_job_entity_uniq" UNIQUE("migration_job_id","entity_type","entity_id"),
	CONSTRAINT "migration_row_snapshots_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "migration_row_snapshots" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "mutation_batches" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"action_type" text NOT NULL,
	"entity_type" text NOT NULL,
	"batch_count" integer NOT NULL,
	"success_count" integer DEFAULT 0,
	"failure_count" integer DEFAULT 0,
	"summary" jsonb,
	"request_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text NOT NULL,
	CONSTRAINT "mutation_batches_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "mutation_batches_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "mutation_batches" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "number_sequences" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"company_id" uuid,
	"entity_type" text NOT NULL,
	"prefix" text DEFAULT '' NOT NULL,
	"suffix" text DEFAULT '' NOT NULL,
	"next_value" integer DEFAULT 1 NOT NULL,
	"pad_length" integer DEFAULT 5 NOT NULL,
	"fiscal_year" integer,
	CONSTRAINT "number_sequences_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "number_sequences_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "number_sequences" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "opportunities" (
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
	"name" text NOT NULL,
	"account_name" text,
	"amount_minor" bigint DEFAULT 0 NOT NULL,
	"stage" text DEFAULT 'prospecting' NOT NULL,
	"probability" integer,
	"expected_close_date" date,
	"assigned_to" text,
	"details" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "opportunities_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "opportunities_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "opportunities" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "org_usage_daily" (
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"day" date NOT NULL,
	"api_requests" integer DEFAULT 0 NOT NULL,
	"job_runs" integer DEFAULT 0 NOT NULL,
	"job_ms" bigint DEFAULT 0 NOT NULL,
	"db_timeouts" integer DEFAULT 0 NOT NULL,
	"storage_bytes" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "org_usage_daily_org_id_day_pk" PRIMARY KEY("org_id","day"),
	CONSTRAINT "org_usage_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "org_usage_daily" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "outlet_audits" (
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
	"doc_status" "doc_status" DEFAULT 'draft' NOT NULL,
	"doc_no" text,
	"audit_number" text,
	"outlet_id" uuid NOT NULL,
	"audit_date" date,
	"auditor" text,
	"score" integer,
	"findings" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "outlet_audits_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "outlet_audits_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "outlet_audits_doc_status_valid" CHECK (doc_status IN ('draft', 'submitted', 'active', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "outlet_audits" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "payment_allocations" (
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
	"payment_id" uuid NOT NULL,
	"invoice_id" uuid NOT NULL,
	"allocated_amount_minor" bigint NOT NULL,
	"currency_code" text NOT NULL,
	"allocation_type" text DEFAULT 'principal' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"applied_at" timestamp with time zone,
	"journal_entry_id" uuid,
	"allocation_metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "payment_allocations_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "payment_allocations_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "payment_allocations_positive_amount" CHECK (allocated_amount_minor > 0)
);
--> statement-breakpoint
ALTER TABLE "payment_allocations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "payment_runs" (
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
	"payment_date" date NOT NULL,
	"bank_account_id" uuid NOT NULL,
	"payment_method" text DEFAULT 'bank-transfer' NOT NULL,
	"total_amount_minor" bigint DEFAULT 0 NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"invoice_count" integer DEFAULT 0 NOT NULL,
	"run_status" text DEFAULT 'draft' NOT NULL,
	"invoice_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"bank_file_ref" text,
	"approved_by" text,
	"notes" text,
	CONSTRAINT "payment_runs_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "pr_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "pr_valid_method" CHECK (payment_method IN ('bank-transfer', 'check', 'wire', 'ach', 'rtgs')),
	CONSTRAINT "pr_valid_status" CHECK (run_status IN ('draft', 'approved', 'processing', 'completed', 'failed', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "payment_runs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "performance_reviews" (
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
	"doc_status" "doc_status" DEFAULT 'draft' NOT NULL,
	"doc_no" text,
	"employee_id" uuid NOT NULL,
	"review_period" text NOT NULL,
	"review_date" date,
	"reviewer" text,
	"overall_rating" integer,
	"review_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "performance_reviews_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "performance_reviews_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "performance_reviews_doc_status_valid" CHECK (doc_status IN ('draft', 'submitted', 'active', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "performance_reviews" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "posting_periods" (
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
	"ledger_id" uuid NOT NULL,
	"fiscal_year" text NOT NULL,
	"period_number" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"soft_closed_by" text,
	"soft_closed_at" timestamp with time zone,
	"hard_closed_by" text,
	"hard_closed_at" timestamp with time zone,
	CONSTRAINT "posting_periods_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "pp_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "pp_valid_status" CHECK (status IN ('open', 'soft-close', 'hard-close')),
	CONSTRAINT "pp_valid_dates" CHECK (end_date >= start_date)
);
--> statement-breakpoint
ALTER TABLE "posting_periods" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "products" (
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
	"description" text,
	"category" text,
	"uom" text DEFAULT 'EA' NOT NULL,
	"unit_price" numeric(18, 6),
	"cost_price" numeric(18, 6),
	"tax_code" text,
	"is_active" text DEFAULT 'true' NOT NULL,
	"specifications" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "products_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "products_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "projects" (
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
	"description" text,
	"project_manager" text,
	"start_date" date,
	"end_date" date,
	"status" text DEFAULT 'active' NOT NULL,
	"budget" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "projects_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "projects_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "provision_movements" (
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
	"provision_id" uuid NOT NULL,
	"movement_type" text NOT NULL,
	"amount_minor" bigint NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"movement_date" date NOT NULL,
	"period_key" text,
	"journal_entry_id" uuid,
	"reason" text,
	CONSTRAINT "provision_movements_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "pmov_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "pmov_valid_type" CHECK (movement_type IN ('initial', 'increase', 'utilization', 'reversal', 'unwinding', 'revaluation'))
);
--> statement-breakpoint
ALTER TABLE "provision_movements" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "provisions" (
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
	"provision_no" text NOT NULL,
	"name" text NOT NULL,
	"provision_type" text NOT NULL,
	"liability_account_id" uuid,
	"expense_account_id" uuid,
	"best_estimate_minor" bigint NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"discount_rate" numeric(8, 6),
	"present_value_minor" bigint,
	"recognition_date" date NOT NULL,
	"expected_settlement_date" date,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	CONSTRAINT "provisions_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "prov_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "prov_valid_type" CHECK (provision_type IN ('legal', 'constructive', 'onerous-contract', 'decommissioning', 'warranty', 'restructuring'))
);
--> statement-breakpoint
ALTER TABLE "provisions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "purchase_requisitions" (
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
	"doc_status" "doc_status" DEFAULT 'draft' NOT NULL,
	"doc_no" text,
	"pr_number" text,
	"requestor_id" uuid NOT NULL,
	"request_date" date,
	"required_date" date,
	"total_amount_minor" bigint DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'MYR' NOT NULL,
	"pr_lines" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "purchase_requisitions_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "purchase_requisitions_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "purchase_requisitions_doc_status_valid" CHECK (doc_status IN ('draft', 'submitted', 'active', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "purchase_requisitions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "quality_inspections" (
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
	"doc_status" "doc_status" DEFAULT 'draft' NOT NULL,
	"doc_no" text,
	"inspection_number" text,
	"inspection_type" text NOT NULL,
	"inspection_date" date,
	"inspector" text,
	"result" text,
	"inspection_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "quality_inspections_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "quality_inspections_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "quality_inspections_doc_status_valid" CHECK (doc_status IN ('draft', 'submitted', 'active', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "quality_inspections" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "r2_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text DEFAULT (auth.user_id()) NOT NULL,
	"object_key" text NOT NULL,
	"file_url" text NOT NULL,
	"file_name" text,
	"content_type" text,
	"size_bytes" integer,
	"checksum" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "r2_files_object_key_unique" UNIQUE("object_key")
);
--> statement-breakpoint
ALTER TABLE "r2_files" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "recipes" (
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
	"product_id" uuid NOT NULL,
	"yield_quantity" numeric(18, 6),
	"instructions" text,
	"ingredients" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "recipes_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "recipes_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "recipes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "reconciliation_items" (
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
	"bank_statement_id" uuid NOT NULL,
	"transaction_date" date NOT NULL,
	"value_date" date,
	"amount_minor" bigint NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"bank_reference" text,
	"bank_description" text,
	"match_status" text DEFAULT 'unmatched' NOT NULL,
	"matched_document_id" uuid,
	"matched_document_type" text,
	"match_confidence" text,
	"matched_by" text,
	CONSTRAINT "reconciliation_items_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "ri_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "ri_valid_match_status" CHECK (match_status IN ('unmatched', 'auto-matched', 'manual-matched', 'disputed'))
);
--> statement-breakpoint
ALTER TABLE "reconciliation_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "returns" (
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
	"doc_status" "doc_status" DEFAULT 'draft' NOT NULL,
	"doc_no" text,
	"return_number" text,
	"return_type" text NOT NULL,
	"return_date" date,
	"reason" text,
	"total_amount_minor" bigint DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'MYR' NOT NULL,
	"return_lines" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "returns_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "returns_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "returns_doc_status_valid" CHECK (doc_status IN ('draft', 'submitted', 'active', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "returns" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "revenue_schedule_lines" (
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
	"schedule_id" uuid NOT NULL,
	"fiscal_period_id" uuid NOT NULL,
	"amount_minor" bigint NOT NULL,
	"cumulative_amount_minor" bigint NOT NULL,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"recognized_at" timestamp with time zone,
	"journal_entry_id" uuid,
	"recognized_by" uuid,
	CONSTRAINT "revenue_schedule_lines_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "revenue_schedule_lines_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "revenue_schedule_lines" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "revenue_schedules" (
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
	"source_entity_type" text NOT NULL,
	"source_entity_id" uuid NOT NULL,
	"total_amount_minor" bigint NOT NULL,
	"currency_code" text NOT NULL,
	"recognition_method" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"revenue_account_id" uuid,
	"deferred_account_id" uuid,
	"schedule_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "revenue_schedules_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "revenue_schedules_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "revenue_schedules_valid_dates" CHECK (end_date >= start_date)
);
--> statement-breakpoint
ALTER TABLE "revenue_schedules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "risk_assessments" (
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
	"risk_id" text NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"likelihood" text,
	"impact" text,
	"risk_score" integer,
	"owner" text,
	"status" text DEFAULT 'identified' NOT NULL,
	"mitigation_plan" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "risk_assessments_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "risk_assessments_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "risk_assessments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"role_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"verb" text NOT NULL,
	"scope" text DEFAULT 'org' NOT NULL,
	"field_rules_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "role_permissions_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "role_perms_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "role_perms_verb_valid" CHECK (verb IN ('create', 'update', 'delete', 'submit', 'cancel', 'amend', 'approve', 'reject', 'restore', '*')),
	CONSTRAINT "role_perms_scope_valid" CHECK (scope IN ('org', 'self', 'company', 'site', 'team'))
);
--> statement-breakpoint
ALTER TABLE "role_permissions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roles_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "roles_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "roles_key_not_empty" CHECK (key <> '')
);
--> statement-breakpoint
ALTER TABLE "roles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sbp_grants" (
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
	"grant_date" date NOT NULL,
	"vesting_period_months" integer NOT NULL,
	"currency_code" text NOT NULL,
	"exercise_price_minor" bigint DEFAULT 0 NOT NULL,
	"fair_value_per_unit_minor" bigint DEFAULT 0 NOT NULL,
	"units_granted" integer NOT NULL,
	"units_vested" integer DEFAULT 0 NOT NULL,
	"units_cancelled" integer DEFAULT 0 NOT NULL,
	"settlement_type" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	CONSTRAINT "sbp_grants_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "sbp_grants_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "sbp_grants_valid_settlement_type" CHECK (settlement_type IN ('equity', 'cash', 'choice')),
	CONSTRAINT "sbp_grants_valid_status" CHECK (status IN ('active', 'vested', 'exercised', 'forfeited', 'expired')),
	CONSTRAINT "sbp_grants_positive_units" CHECK (units_granted > 0)
);
--> statement-breakpoint
ALTER TABLE "sbp_grants" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "search_outbox" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"trace_id" text,
	"intent_key" text NOT NULL,
	"op" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"payload" jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" text DEFAULT '0' NOT NULL,
	"last_error" text,
	"process_after" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "search_outbox_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
CREATE TABLE "service_tickets" (
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
	"ticket_number" text NOT NULL,
	"subject" text NOT NULL,
	"description" text,
	"priority" text DEFAULT 'medium' NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"category" text,
	"assigned_to" text,
	"customer_id" uuid,
	"resolution" text,
	CONSTRAINT "service_tickets_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "service_tickets_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "service_tickets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "shipments" (
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
	"doc_status" "doc_status" DEFAULT 'draft' NOT NULL,
	"doc_no" text,
	"shipment_number" text,
	"carrier" text,
	"tracking_number" text,
	"ship_date" date,
	"expected_delivery_date" date,
	"origin" text,
	"destination" text,
	"shipment_lines" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "shipments_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "shipments_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "shipments_doc_status_valid" CHECK (doc_status IN ('draft', 'submitted', 'active', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "shipments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sites" (
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
	"name" text NOT NULL,
	"code" text NOT NULL,
	"type" text NOT NULL,
	"address" jsonb,
	CONSTRAINT "sites_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "sites_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "sites_type_chk" CHECK (type IN ('warehouse','branch','plant','office'))
);
--> statement-breakpoint
ALTER TABLE "sites" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "statement_layouts" (
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
	"layout_code" text NOT NULL,
	"name" text NOT NULL,
	"statement_type" text NOT NULL,
	"standard" text DEFAULT 'ifrs' NOT NULL,
	"layout_version" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	CONSTRAINT "statement_layouts_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "sl_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "sl_valid_type" CHECK (statement_type IN ('balance-sheet', 'income-statement', 'cash-flow', 'equity-changes')),
	CONSTRAINT "sl_valid_standard" CHECK (standard IN ('ifrs', 'local-gaap', 'tax', 'management'))
);
--> statement-breakpoint
ALTER TABLE "statement_layouts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "statement_lines" (
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
	"layout_id" uuid NOT NULL,
	"line_number" integer NOT NULL,
	"label" text NOT NULL,
	"line_type" text DEFAULT 'detail' NOT NULL,
	"indent_level" integer DEFAULT 0 NOT NULL,
	"parent_line_id" uuid,
	"account_ranges" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sign_convention" text DEFAULT 'normal' NOT NULL,
	"formula" text,
	"is_bold" boolean DEFAULT false NOT NULL,
	"show_if_zero" boolean DEFAULT false NOT NULL,
	CONSTRAINT "statement_lines_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "stl_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "stl_valid_line_type" CHECK (line_type IN ('header', 'detail', 'subtotal', 'total', 'blank')),
	CONSTRAINT "stl_valid_sign" CHECK (sign_convention IN ('normal', 'reversed')),
	CONSTRAINT "stl_positive_line_number" CHECK (line_number > 0)
);
--> statement-breakpoint
ALTER TABLE "statement_lines" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "subscriptions" (
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
	"subscription_no" text NOT NULL,
	"customer_id" uuid NOT NULL,
	"plan_name" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"billing_frequency" text DEFAULT 'monthly' NOT NULL,
	"recurring_amount_minor" bigint NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"next_billing_date" date,
	"auto_renew" boolean DEFAULT true NOT NULL,
	"cancelled_date" date,
	"subscription_details" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "subscriptions_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "sub_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "sub_valid_status" CHECK (status IN ('trial', 'active', 'paused', 'cancelled', 'expired')),
	CONSTRAINT "sub_valid_frequency" CHECK (billing_frequency IN ('monthly', 'quarterly', 'semi-annual', 'annual'))
);
--> statement-breakpoint
ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "supplier_invoices" (
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
	"invoice_no" text NOT NULL,
	"internal_doc_no" text,
	"supplier_id" uuid NOT NULL,
	"invoice_date" date NOT NULL,
	"due_date" date NOT NULL,
	"invoice_type" text DEFAULT 'standard' NOT NULL,
	"gross_amount_minor" bigint NOT NULL,
	"tax_amount_minor" bigint DEFAULT 0 NOT NULL,
	"net_amount_minor" bigint NOT NULL,
	"paid_amount_minor" bigint DEFAULT 0 NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"payment_status" text DEFAULT 'unpaid' NOT NULL,
	"payment_terms" text,
	"po_reference" text,
	"description" text,
	CONSTRAINT "supplier_invoices_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "si_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "si_valid_type" CHECK (invoice_type IN ('standard', 'credit-note', 'debit-note', 'prepayment')),
	CONSTRAINT "si_valid_payment_status" CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'overpaid'))
);
--> statement-breakpoint
ALTER TABLE "supplier_invoices" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "suppliers" (
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
	"legal_name" text,
	"tax_id" text,
	"email" text,
	"phone" text,
	"currency" text DEFAULT 'MYR' NOT NULL,
	"payment_terms" text,
	"address" jsonb,
	CONSTRAINT "suppliers_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "suppliers_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "suppliers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tax_rates" (
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
	"tax_code" text NOT NULL,
	"name" text NOT NULL,
	"rate" numeric(8, 6) NOT NULL,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"jurisdiction" text,
	"tax_type" text DEFAULT 'sales' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	CONSTRAINT "tax_rates_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "tax_rates_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "tax_rates_valid_rate" CHECK (rate >= 0 AND rate <= 1)
);
--> statement-breakpoint
ALTER TABLE "tax_rates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "timesheets" (
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
	"doc_status" "doc_status" DEFAULT 'draft' NOT NULL,
	"doc_no" text,
	"employee_id" uuid NOT NULL,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"total_hours" numeric(10, 2),
	"time_entries" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "timesheets_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "timesheets_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "timesheets_doc_status_valid" CHECK (doc_status IN ('draft', 'submitted', 'active', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "timesheets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tp_calculations" (
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
	"policy_id" uuid NOT NULL,
	"fiscal_year" text NOT NULL,
	"calculation_date" date NOT NULL,
	"applied_method" text NOT NULL,
	"transaction_value_minor" bigint DEFAULT 0 NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"pli_value" numeric(18, 6),
	"range_low" numeric(18, 6),
	"range_median" numeric(18, 6),
	"range_high" numeric(18, 6),
	"result" text NOT NULL,
	"adjustment_minor" bigint DEFAULT 0 NOT NULL,
	"calculation_details" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"notes" text,
	CONSTRAINT "tp_calculations_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "tpc_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "tpc_valid_result" CHECK (result IN ('within-range', 'below-range', 'above-range'))
);
--> statement-breakpoint
ALTER TABLE "tp_calculations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tp_policies" (
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
	"policy_code" text NOT NULL,
	"name" text NOT NULL,
	"tp_method" text NOT NULL,
	"transaction_type" text NOT NULL,
	"tested_party_id" uuid,
	"counterparty_id" uuid,
	"pli_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"arm_length_range" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"effective_from" date NOT NULL,
	"effective_to" date,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	CONSTRAINT "tp_policies_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "tpp_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "tpp_valid_method" CHECK (tp_method IN ('cup', 'rpm', 'cpm', 'tnmm', 'psm'))
);
--> statement-breakpoint
ALTER TABLE "tp_policies" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "treasury_accounts" (
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
	"account_type" text NOT NULL,
	"currency_code" text NOT NULL,
	"book_balance_minor" bigint DEFAULT 0 NOT NULL,
	"as_of_date" date NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"notes" text,
	CONSTRAINT "treasury_accounts_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "treasury_accounts_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "treasury_accounts_valid_account_type" CHECK (account_type IN ('current', 'savings', 'fixed-deposit', 'money-market', 'escrow'))
);
--> statement-breakpoint
ALTER TABLE "treasury_accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "uom" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"name" text NOT NULL,
	"symbol" text NOT NULL,
	"type" text NOT NULL,
	CONSTRAINT "uom_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "uom_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "uom_type_chk" CHECK (type IN ('weight','volume','length','area','count','time','custom'))
);
--> statement-breakpoint
ALTER TABLE "uom" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "uom_conversions" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"from_uom_id" uuid NOT NULL,
	"to_uom_id" uuid NOT NULL,
	"factor" numeric(20, 10) NOT NULL,
	CONSTRAINT "uom_conversions_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "uom_conversions_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "uom_conversions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"user_id" text NOT NULL,
	"role_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_roles_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "user_roles_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "user_roles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_scopes" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"user_id" text NOT NULL,
	"scope_type" text NOT NULL,
	"scope_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_scopes_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "user_scopes_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "user_scopes_type_valid" CHECK (scope_type IN ('company', 'site', 'team'))
);
--> statement-breakpoint
ALTER TABLE "user_scopes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text DEFAULT (auth.user_id()) NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "video_settings" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"provider" text,
	"credentials" jsonb,
	"cdn_base_url" text,
	"is_enabled" boolean DEFAULT false NOT NULL,
	"max_file_size_mb" text DEFAULT '500' NOT NULL,
	"allowed_formats" jsonb DEFAULT '["mp4","webm","mov"]'::jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "video_settings_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "video_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "warehouses" (
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
	"type" text DEFAULT 'standard' NOT NULL,
	"address" jsonb,
	"capacity" text,
	"is_active" text DEFAULT 'true' NOT NULL,
	CONSTRAINT "warehouses_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "warehouses_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "warehouses" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "webhook_deliveries" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
	"endpoint_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb,
	"status_code" text,
	"response_body" text,
	"attempt_number" text DEFAULT '1' NOT NULL,
	"duration_ms" text DEFAULT '0' NOT NULL,
	"error" text,
	"success" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "webhook_deliveries_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "webhook_deliveries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "webhook_endpoints" (
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
	"name" text NOT NULL,
	"url" text NOT NULL,
	"secret" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"subscribed_events" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"description" text,
	"last_delivered_at" timestamp with time zone,
	"last_status_code" text,
	"failure_count" text DEFAULT '0' NOT NULL,
	CONSTRAINT "webhook_endpoints_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "webhook_endpoints_url_not_empty" CHECK (url <> ''),
	CONSTRAINT "webhook_endpoints_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "webhook_endpoints" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "webhook_outbox" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"trace_id" text,
	"intent_key" text NOT NULL,
	"event" text NOT NULL,
	"url_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"payload" jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" text DEFAULT '0' NOT NULL,
	"last_error" text,
	"process_after" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "webhook_outbox_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
CREATE TABLE "wht_certificates" (
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
	"certificate_no" text,
	"wht_code_id" uuid NOT NULL,
	"payment_id" uuid,
	"payee_id" uuid NOT NULL,
	"gross_amount_minor" bigint NOT NULL,
	"wht_amount_minor" bigint NOT NULL,
	"net_amount_minor" bigint NOT NULL,
	"currency_code" text DEFAULT 'MYR' NOT NULL,
	"applied_rate" text NOT NULL,
	"income_type" text NOT NULL,
	"payment_date" date NOT NULL,
	"issued_date" date,
	"remittance_status" text DEFAULT 'pending' NOT NULL,
	"remitted_date" date,
	CONSTRAINT "wht_certificates_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "wcer_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "wcer_valid_remittance" CHECK (remittance_status IN ('pending', 'remitted', 'overdue')),
	CONSTRAINT "wcer_positive_amounts" CHECK (gross_amount_minor >= 0 AND wht_amount_minor >= 0 AND net_amount_minor >= 0)
);
--> statement-breakpoint
ALTER TABLE "wht_certificates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "wht_codes" (
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
	"wht_code" text NOT NULL,
	"name" text NOT NULL,
	"jurisdiction" text NOT NULL,
	"income_type" text NOT NULL,
	"wht_payable_account_id" uuid,
	"wht_expense_account_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"description" text,
	CONSTRAINT "wht_codes_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "wc_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
ALTER TABLE "wht_codes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "wht_rates" (
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
	"wht_code_id" uuid NOT NULL,
	"rate_type" text DEFAULT 'domestic' NOT NULL,
	"treaty_country" text,
	"rate" numeric(8, 6) NOT NULL,
	"effective_from" date NOT NULL,
	"effective_to" date,
	CONSTRAINT "wht_rates_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "wr_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "wr_valid_rate_type" CHECK (rate_type IN ('domestic', 'treaty', 'exempt')),
	CONSTRAINT "wr_rate_range" CHECK (rate >= 0 AND rate <= 1)
);
--> statement-breakpoint
ALTER TABLE "wht_rates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "work_orders" (
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
	"doc_status" "doc_status" DEFAULT 'draft' NOT NULL,
	"doc_no" text,
	"wo_number" text,
	"product_id" uuid NOT NULL,
	"quantity" numeric(18, 6) NOT NULL,
	"start_date" date,
	"due_date" date,
	"priority" text DEFAULT 'normal' NOT NULL,
	"wo_lines" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "work_orders_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "work_orders_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "work_orders_doc_status_valid" CHECK (doc_status IN ('draft', 'submitted', 'active', 'cancelled'))
);
--> statement-breakpoint
ALTER TABLE "work_orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workflow_executions" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"rule_id" text NOT NULL,
	"rule_name" text,
	"timing" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"action_type" text NOT NULL,
	"condition_matched" boolean NOT NULL,
	"action_result" jsonb,
	"error" text,
	"duration_ms" integer,
	"request_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workflow_executions_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "workflow_executions_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "workflow_executions_timing_check" CHECK (timing in ('before', 'after'))
);
--> statement-breakpoint
ALTER TABLE "workflow_executions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workflow_outbox" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"trace_id" text,
	"intent_key" text NOT NULL,
	"event" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"payload" jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" text DEFAULT '0' NOT NULL,
	"last_error" text,
	"process_after" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workflow_outbox_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)
);
--> statement-breakpoint
CREATE TABLE "workflow_rules" (
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
	"name" text NOT NULL,
	"description" text,
	"timing" text NOT NULL,
	"entity_types" text[] DEFAULT '{}'::text[] NOT NULL,
	"verbs" text[] DEFAULT '{}'::text[] NOT NULL,
	"priority" integer DEFAULT 100 NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"condition_json" jsonb NOT NULL,
	"action_json" jsonb NOT NULL,
	CONSTRAINT "workflow_rules_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "workflow_rules_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "workflow_rules_timing_check" CHECK (timing in ('before', 'after'))
);
--> statement-breakpoint
ALTER TABLE "workflow_rules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "advisory_evidence" ADD CONSTRAINT "advisory_evidence_advisory_fk" FOREIGN KEY ("org_id","advisory_id") REFERENCES "public"."advisories"("org_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_field_values" ADD CONSTRAINT "custom_field_values_field_fk" FOREIGN KEY ("org_id","entity_type","field_id") REFERENCES "public"."custom_fields"("org_id","entity_type","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entity_view_fields" ADD CONSTRAINT "entity_view_fields_view_fk" FOREIGN KEY ("org_id","view_id") REFERENCES "public"."entity_views"("org_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_alias_resolution_rules" ADD CONSTRAINT "meta_alias_resolution_rules_alias_set_fk" FOREIGN KEY ("org_id","alias_set_id") REFERENCES "public"."meta_alias_sets"("org_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_aliases" ADD CONSTRAINT "meta_aliases_alias_set_fk" FOREIGN KEY ("org_id","alias_set_id") REFERENCES "public"."meta_alias_sets"("org_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_lineage_edges" ADD CONSTRAINT "meta_lineage_edges_to_asset_fk" FOREIGN KEY ("org_id","to_asset_id") REFERENCES "public"."meta_assets"("org_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_lineage_edges" ADD CONSTRAINT "meta_lineage_edges_from_asset_fk" FOREIGN KEY ("org_id","from_asset_id") REFERENCES "public"."meta_assets"("org_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_quality_checks" ADD CONSTRAINT "meta_quality_checks_target_asset_fk" FOREIGN KEY ("org_id","target_asset_id") REFERENCES "public"."meta_assets"("org_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_term_links" ADD CONSTRAINT "meta_term_links_term_fk" FOREIGN KEY ("org_id","term_id") REFERENCES "public"."meta_semantic_terms"("org_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_value_aliases" ADD CONSTRAINT "meta_value_aliases_alias_set_fk" FOREIGN KEY ("org_id","alias_set_id") REFERENCES "public"."meta_alias_sets"("org_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "migration_checkpoints" ADD CONSTRAINT "migration_checkpoints_migration_job_fk" FOREIGN KEY ("org_id","migration_job_id") REFERENCES "public"."migration_jobs"("org_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "migration_conflict_resolutions" ADD CONSTRAINT "migration_conflict_resolutions_migration_job_fk" FOREIGN KEY ("org_id","migration_job_id") REFERENCES "public"."migration_jobs"("org_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "migration_conflict_resolutions" ADD CONSTRAINT "migration_conflict_resolutions_conflict_fk" FOREIGN KEY ("org_id","conflict_id") REFERENCES "public"."migration_conflicts"("org_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "migration_conflicts" ADD CONSTRAINT "migration_conflicts_migration_job_fk" FOREIGN KEY ("org_id","migration_job_id") REFERENCES "public"."migration_jobs"("org_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "migration_lineage" ADD CONSTRAINT "migration_lineage_migration_job_fk" FOREIGN KEY ("org_id","migration_job_id") REFERENCES "public"."migration_jobs"("org_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "migration_merge_explanations" ADD CONSTRAINT "migration_merge_explanations_migration_job_fk" FOREIGN KEY ("org_id","migration_job_id") REFERENCES "public"."migration_jobs"("org_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "migration_quarantine" ADD CONSTRAINT "migration_quarantine_migration_job_fk" FOREIGN KEY ("org_id","migration_job_id") REFERENCES "public"."migration_jobs"("org_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "migration_row_snapshots" ADD CONSTRAINT "migration_row_snapshots_migration_job_fk" FOREIGN KEY ("org_id","migration_job_id") REFERENCES "public"."migration_jobs"("org_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_fk" FOREIGN KEY ("org_id","role_id") REFERENCES "public"."roles"("org_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_fk" FOREIGN KEY ("org_id","role_id") REFERENCES "public"."roles"("org_id","id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ade_org_id_idx" ON "acct_derived_entries" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "ade_org_created_idx" ON "acct_derived_entries" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "ade_derivation_id_idx" ON "acct_derived_entries" USING btree ("org_id","derivation_id");--> statement-breakpoint
CREATE INDEX "ade_event_id_idx" ON "acct_derived_entries" USING btree ("org_id","event_id");--> statement-breakpoint
CREATE INDEX "ade_journal_idx" ON "acct_derived_entries" USING btree ("org_id","journal_entry_id");--> statement-breakpoint
CREATE INDEX "ade_status_idx" ON "acct_derived_entries" USING btree ("org_id","status");--> statement-breakpoint
CREATE INDEX "ae_org_id_idx" ON "acct_events" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "ae_org_created_idx" ON "acct_events" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "ae_event_id_idx" ON "acct_events" USING btree ("org_id","event_id");--> statement-breakpoint
CREATE INDEX "ae_source_doc_idx" ON "acct_events" USING btree ("org_id","source_package","source_document_id");--> statement-breakpoint
CREATE INDEX "ae_type_effective_idx" ON "acct_events" USING btree ("org_id","event_type","effective_at");--> statement-breakpoint
CREATE INDEX "ae_company_effective_idx" ON "acct_events" USING btree ("org_id","company_id","effective_at");--> statement-breakpoint
CREATE INDEX "amv_org_id_idx" ON "acct_mapping_versions" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "amv_org_created_idx" ON "acct_mapping_versions" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "amv_mapping_version_idx" ON "acct_mapping_versions" USING btree ("org_id","mapping_id","version_number");--> statement-breakpoint
CREATE INDEX "amv_mapping_current_idx" ON "acct_mapping_versions" USING btree ("org_id","mapping_id","is_current");--> statement-breakpoint
CREATE UNIQUE INDEX "amv_unique_version_idx" ON "acct_mapping_versions" USING btree ("org_id","mapping_id","version_number");--> statement-breakpoint
CREATE INDEX "am_org_id_idx" ON "acct_mappings" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "am_org_created_idx" ON "acct_mappings" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "am_event_type_idx" ON "acct_mappings" USING btree ("org_id","event_type");--> statement-breakpoint
CREATE UNIQUE INDEX "am_unique_code_idx" ON "acct_mappings" USING btree ("org_id","company_id","mapping_code");--> statement-breakpoint
CREATE INDEX "advisories_org_status_created_idx" ON "advisories" USING btree ("org_id","status","created_at");--> statement-breakpoint
CREATE INDEX "advisories_org_type_created_idx" ON "advisories" USING btree ("org_id","type","created_at");--> statement-breakpoint
CREATE INDEX "advisories_entity_idx" ON "advisories" USING btree ("org_id","entity_type","entity_id","created_at");--> statement-breakpoint
CREATE INDEX "advisories_org_created_idx" ON "advisories" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "advisories_fingerprint_dedupe_idx" ON "advisories" USING btree ("org_id","fingerprint") WHERE status IN ('open','ack');--> statement-breakpoint
CREATE INDEX "advisory_evidence_advisory_org_fk_idx" ON "advisory_evidence" USING btree ("org_id","advisory_id");--> statement-breakpoint
CREATE INDEX "advisory_evidence_advisory_idx" ON "advisory_evidence" USING btree ("advisory_id");--> statement-breakpoint
CREATE INDEX "advisory_evidence_org_created_idx" ON "advisory_evidence" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "api_keys_org_idx" ON "api_keys" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "api_keys_hash_idx" ON "api_keys" USING btree ("key_hash");--> statement-breakpoint
CREATE INDEX "assets_org_id_idx" ON "assets" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "assets_org_created_idx" ON "assets" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_org_created_idx" ON "audit_logs" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_entity_timeline_idx" ON "audit_logs" USING btree ("entity_type","entity_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_batch_idx" ON "audit_logs" USING btree ("batch_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_request_idx" ON "audit_logs" USING btree ("request_id");--> statement-breakpoint
CREATE UNIQUE INDEX "audit_logs_idempotency_idx" ON "audit_logs" USING btree ("org_id","action_type","idempotency_key") WHERE idempotency_key IS NOT NULL;--> statement-breakpoint
CREATE INDEX "audit_programs_org_id_idx" ON "audit_programs" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "audit_programs_org_created_idx" ON "audit_programs" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "bs_org_id_idx" ON "bank_statements" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "bs_org_created_idx" ON "bank_statements" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "bs_bank_date_idx" ON "bank_statements" USING btree ("org_id","bank_account_id","start_date");--> statement-breakpoint
CREATE INDEX "bs_recon_status_idx" ON "bank_statements" USING btree ("org_id","reconciliation_status");--> statement-breakpoint
CREATE UNIQUE INDEX "bs_unique_period_idx" ON "bank_statements" USING btree ("org_id","bank_account_id","start_date","end_date");--> statement-breakpoint
CREATE INDEX "bc_org_id_idx" ON "billing_cycles" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "bc_org_created_idx" ON "billing_cycles" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "bc_subscription_idx" ON "billing_cycles" USING btree ("org_id","subscription_id");--> statement-breakpoint
CREATE INDEX "bc_status_idx" ON "billing_cycles" USING btree ("org_id","status");--> statement-breakpoint
CREATE INDEX "bc_period_idx" ON "billing_cycles" USING btree ("org_id","period_start","period_end");--> statement-breakpoint
CREATE INDEX "biological_asset_items_org_created_idx" ON "biological_asset_items" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "biological_asset_items_org_company_class_idx" ON "biological_asset_items" USING btree ("org_id","company_id","asset_class");--> statement-breakpoint
CREATE INDEX "boms_org_id_idx" ON "boms" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "boms_org_created_idx" ON "boms" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "borrowing_cost_items_org_created_idx" ON "borrowing_cost_items" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "borrowing_cost_items_org_company_period_idx" ON "borrowing_cost_items" USING btree ("org_id","company_id","period_key");--> statement-breakpoint
CREATE INDEX "borrowing_cost_items_org_asset_idx" ON "borrowing_cost_items" USING btree ("org_id","qualifying_asset_id");--> statement-breakpoint
CREATE INDEX "budgets_org_id_idx" ON "budgets" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "budgets_org_created_idx" ON "budgets" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "campaigns_org_id_idx" ON "campaigns" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "campaigns_org_created_idx" ON "campaigns" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "coa_org_id_idx" ON "chart_of_accounts" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "coa_org_created_idx" ON "chart_of_accounts" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "coa_company_code_idx" ON "chart_of_accounts" USING btree ("org_id","company_id","account_code");--> statement-breakpoint
CREATE INDEX "coa_type_idx" ON "chart_of_accounts" USING btree ("org_id","company_id","account_type");--> statement-breakpoint
CREATE UNIQUE INDEX "coa_unique_code_idx" ON "chart_of_accounts" USING btree ("org_id","company_id","account_code");--> statement-breakpoint
CREATE INDEX "cev_org_id_idx" ON "close_evidence" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "cev_org_created_idx" ON "close_evidence" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "cev_task_idx" ON "close_evidence" USING btree ("org_id","close_task_id");--> statement-breakpoint
CREATE INDEX "cev_type_idx" ON "close_evidence" USING btree ("org_id","evidence_type");--> statement-breakpoint
CREATE INDEX "ct_org_id_idx" ON "close_tasks" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "ct_org_created_idx" ON "close_tasks" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "ct_ledger_period_idx" ON "close_tasks" USING btree ("org_id","ledger_id","fiscal_year","period_number");--> statement-breakpoint
CREATE INDEX "ct_status_idx" ON "close_tasks" USING btree ("org_id","task_status");--> statement-breakpoint
CREATE INDEX "ct_sequence_idx" ON "close_tasks" USING btree ("org_id","ledger_id","fiscal_year","period_number","sequence_order");--> statement-breakpoint
CREATE INDEX "comms_org_entity_idx" ON "communications" USING btree ("org_id","entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "comms_org_created_idx" ON "communications" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "companies_org_id_idx" ON "companies" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "companies_org_created_idx" ON "companies" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "contacts_org_id_idx" ON "contacts" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "contacts_org_created_idx" ON "contacts" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "contracts_org_id_idx" ON "contracts" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "contracts_org_created_idx" ON "contracts" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "cost_centers_org_id_idx" ON "cost_centers" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "cost_centers_org_code_idx" ON "cost_centers" USING btree ("org_id","code");--> statement-breakpoint
CREATE INDEX "cost_centers_org_created_idx" ON "cost_centers" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "ce_org_id_idx" ON "credit_exposures" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "ce_org_created_idx" ON "credit_exposures" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "ce_customer_date_idx" ON "credit_exposures" USING btree ("org_id","customer_id","snapshot_date");--> statement-breakpoint
CREATE INDEX "ce_ecl_stage_idx" ON "credit_exposures" USING btree ("org_id","ecl_stage");--> statement-breakpoint
CREATE INDEX "cl_org_id_idx" ON "credit_limits" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "cl_org_created_idx" ON "credit_limits" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "cl_customer_idx" ON "credit_limits" USING btree ("org_id","customer_id");--> statement-breakpoint
CREATE INDEX "cl_risk_idx" ON "credit_limits" USING btree ("org_id","risk_rating");--> statement-breakpoint
CREATE UNIQUE INDEX "cl_unique_active_idx" ON "credit_limits" USING btree ("org_id","customer_id","currency_code") WHERE is_active = true;--> statement-breakpoint
CREATE INDEX "crop_plans_org_id_idx" ON "crop_plans" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "crop_plans_org_created_idx" ON "crop_plans" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "currencies_org_id_idx" ON "currencies" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "currencies_org_code_uniq" ON "currencies" USING btree ("org_id","code");--> statement-breakpoint
CREATE INDEX "currency_exchanges_pair_date_idx" ON "currency_exchanges" USING btree ("org_id","from_currency","to_currency","rate_date");--> statement-breakpoint
CREATE INDEX "currency_exchanges_latest_idx" ON "currency_exchanges" USING btree ("org_id","from_currency","to_currency") WHERE is_latest = true;--> statement-breakpoint
CREATE INDEX "custom_field_sync_queue_pending_retry_idx" ON "custom_field_sync_queue" USING btree ("next_retry_at");--> statement-breakpoint
CREATE UNIQUE INDEX "custom_field_values_org_entity_field_uniq" ON "custom_field_values" USING btree ("org_id","entity_id","field_id");--> statement-breakpoint
CREATE INDEX "custom_field_values_entity_lookup_idx" ON "custom_field_values" USING btree ("org_id","entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "custom_field_values_field_lookup_idx" ON "custom_field_values" USING btree ("org_id","entity_type","field_id");--> statement-breakpoint
CREATE INDEX "custom_fields_org_id_idx" ON "custom_fields" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "custom_fields_org_entity_field_name_uniq" ON "custom_fields" USING btree ("org_id","entity_type","field_name");--> statement-breakpoint
CREATE INDEX "customers_org_id_idx" ON "customers" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "customers_org_code_idx" ON "customers" USING btree ("org_id","code");--> statement-breakpoint
CREATE INDEX "customers_org_created_idx" ON "customers" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "deferred_tax_items_org_created_idx" ON "deferred_tax_items" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "deferred_tax_items_org_company_period_idx" ON "deferred_tax_items" USING btree ("org_id","company_id","period_key");--> statement-breakpoint
CREATE INDEX "delivery_note_lines_note_idx" ON "delivery_note_lines" USING btree ("org_id","delivery_note_id","line_number");--> statement-breakpoint
CREATE INDEX "delivery_notes_org_status_idx" ON "delivery_notes" USING btree ("org_id","doc_status","created_at");--> statement-breakpoint
CREATE INDEX "delivery_notes_supplier_idx" ON "delivery_notes" USING btree ("org_id","supplier_id");--> statement-breakpoint
CREATE INDEX "delivery_notes_po_idx" ON "delivery_notes" USING btree ("org_id","purchase_order_id");--> statement-breakpoint
CREATE INDEX "depreciation_schedules_org_id_idx" ON "depreciation_schedules" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "depreciation_schedules_org_created_idx" ON "depreciation_schedules" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "depreciation_schedules_asset_idx" ON "depreciation_schedules" USING btree ("org_id","asset_id");--> statement-breakpoint
CREATE INDEX "depreciation_schedules_period_idx" ON "depreciation_schedules" USING btree ("org_id","fiscal_period_id");--> statement-breakpoint
CREATE UNIQUE INDEX "depreciation_schedules_unique_idx" ON "depreciation_schedules" USING btree ("org_id","asset_id","fiscal_period_id");--> statement-breakpoint
CREATE INDEX "dt_org_id_idx" ON "document_types" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "dt_org_created_idx" ON "document_types" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "dt_company_code_idx" ON "document_types" USING btree ("org_id","company_id","doc_type_code");--> statement-breakpoint
CREATE UNIQUE INDEX "dt_unique_code_idx" ON "document_types" USING btree ("org_id","company_id","doc_type_code");--> statement-breakpoint
CREATE INDEX "documents_org_id_idx" ON "documents" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "documents_org_created_idx" ON "documents" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "employee_benefit_plans_org_created_idx" ON "employee_benefit_plans" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "employee_benefit_plans_org_company_type_idx" ON "employee_benefit_plans" USING btree ("org_id","company_id","plan_type");--> statement-breakpoint
CREATE INDEX "employees_org_id_idx" ON "employees" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "employees_org_code_idx" ON "employees" USING btree ("org_id","code");--> statement-breakpoint
CREATE INDEX "employees_org_created_idx" ON "employees" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "entity_attach_org_entity_idx" ON "entity_attachments" USING btree ("org_id","entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "entity_attach_org_file_idx" ON "entity_attachments" USING btree ("org_id","file_id");--> statement-breakpoint
CREATE UNIQUE INDEX "entity_versions_unique_idx" ON "entity_versions" USING btree ("org_id","entity_type","entity_id","version");--> statement-breakpoint
CREATE INDEX "entity_view_fields_view_org_fk_idx" ON "entity_view_fields" USING btree ("org_id","view_id");--> statement-breakpoint
CREATE INDEX "entity_view_fields_org_id_idx" ON "entity_view_fields" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "entity_view_fields_org_view_field_key_uniq" ON "entity_view_fields" USING btree ("org_id","view_id","field_key");--> statement-breakpoint
CREATE INDEX "entity_views_org_id_idx" ON "entity_views" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "entity_views_org_entity_view_name_uniq" ON "entity_views" USING btree ("org_id","entity_type","view_name");--> statement-breakpoint
CREATE INDEX "expense_reports_org_id_idx" ON "expense_reports" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "expense_reports_org_created_idx" ON "expense_reports" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "fi_org_id_idx" ON "financial_instruments" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "fi_org_created_idx" ON "financial_instruments" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "fi_classification_idx" ON "financial_instruments" USING btree ("org_id","classification");--> statement-breakpoint
CREATE INDEX "fi_ecl_stage_idx" ON "financial_instruments" USING btree ("org_id","ecl_stage");--> statement-breakpoint
CREATE INDEX "fi_counterparty_idx" ON "financial_instruments" USING btree ("org_id","counterparty_id");--> statement-breakpoint
CREATE INDEX "fi_company_type_idx" ON "financial_instruments" USING btree ("org_id","company_id","instrument_type");--> statement-breakpoint
CREATE INDEX "fiscal_periods_org_id_idx" ON "fiscal_periods" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "fiscal_periods_org_created_idx" ON "fiscal_periods" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "fiscal_periods_date_idx" ON "fiscal_periods" USING btree ("org_id","start_date","end_date");--> statement-breakpoint
CREATE INDEX "fiscal_periods_year_idx" ON "fiscal_periods" USING btree ("org_id","fiscal_year","period_number");--> statement-breakpoint
CREATE UNIQUE INDEX "fiscal_periods_unique_idx" ON "fiscal_periods" USING btree ("org_id","period_type","start_date");--> statement-breakpoint
CREATE INDEX "fixed_assets_org_id_idx" ON "fixed_assets" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "fixed_assets_org_created_idx" ON "fixed_assets" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "forecasts_org_id_idx" ON "forecasts" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "forecasts_org_created_idx" ON "forecasts" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "franchise_applications_org_id_idx" ON "franchise_applications" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "franchise_applications_org_created_idx" ON "franchise_applications" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "fx_rates_org_id_idx" ON "fx_rates" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "fx_rates_org_created_idx" ON "fx_rates" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "fx_rates_lookup_idx" ON "fx_rates" USING btree ("org_id","from_currency","to_currency","effective_date");--> statement-breakpoint
CREATE UNIQUE INDEX "fx_rates_unique_idx" ON "fx_rates" USING btree ("org_id","from_currency","to_currency","effective_date","source");--> statement-breakpoint
CREATE INDEX "government_grant_items_org_created_idx" ON "government_grant_items" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq__government_grant_items__org_company_grant_no" ON "government_grant_items" USING btree ("org_id","company_id","grant_no");--> statement-breakpoint
CREATE INDEX "government_grant_items_org_company_type_idx" ON "government_grant_items" USING btree ("org_id","company_id","grant_type");--> statement-breakpoint
CREATE INDEX "hd_org_id_idx" ON "hedge_designations" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "hd_org_created_idx" ON "hedge_designations" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "hd_type_idx" ON "hedge_designations" USING btree ("org_id","hedge_type");--> statement-breakpoint
CREATE INDEX "hd_instrument_idx" ON "hedge_designations" USING btree ("org_id","hedging_instrument_id");--> statement-breakpoint
CREATE INDEX "hd_active_idx" ON "hedge_designations" USING btree ("org_id","is_active");--> statement-breakpoint
CREATE INDEX "het_org_id_idx" ON "hedge_effectiveness_tests" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "het_org_created_idx" ON "hedge_effectiveness_tests" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "het_designation_idx" ON "hedge_effectiveness_tests" USING btree ("org_id","designation_id");--> statement-breakpoint
CREATE INDEX "het_date_idx" ON "hedge_effectiveness_tests" USING btree ("org_id","test_date");--> statement-breakpoint
CREATE INDEX "het_result_idx" ON "hedge_effectiveness_tests" USING btree ("org_id","result");--> statement-breakpoint
CREATE INDEX "ica_org_id_idx" ON "ic_agreements" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "ica_org_created_idx" ON "ic_agreements" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "ica_parties_idx" ON "ic_agreements" USING btree ("org_id","party_a_company_id","party_b_company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ica_unique_code_idx" ON "ic_agreements" USING btree ("org_id","agreement_code");--> statement-breakpoint
CREATE INDEX "ict_org_id_idx" ON "ic_transactions" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "ict_org_created_idx" ON "ic_transactions" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "ict_from_to_idx" ON "ic_transactions" USING btree ("org_id","from_company_id","to_company_id");--> statement-breakpoint
CREATE INDEX "ict_match_status_idx" ON "ic_transactions" USING btree ("org_id","match_status");--> statement-breakpoint
CREATE INDEX "ict_date_idx" ON "ic_transactions" USING btree ("org_id","transaction_date");--> statement-breakpoint
CREATE INDEX "idempotency_keys_expires_idx" ON "idempotency_keys" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "impairment_tests_org_created_idx" ON "impairment_tests" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "impairment_tests_org_company_date_idx" ON "impairment_tests" USING btree ("org_id","company_id","test_date");--> statement-breakpoint
CREATE INDEX "impairment_tests_org_asset_idx" ON "impairment_tests" USING btree ("org_id","asset_id");--> statement-breakpoint
CREATE INDEX "impairment_tests_org_cgu_idx" ON "impairment_tests" USING btree ("org_id","cgu_id");--> statement-breakpoint
CREATE INDEX "ia_org_id_idx" ON "intangible_assets" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "ia_org_created_idx" ON "intangible_assets" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "ia_company_category_idx" ON "intangible_assets" USING btree ("org_id","company_id","category");--> statement-breakpoint
CREATE INDEX "ia_life_type_idx" ON "intangible_assets" USING btree ("org_id","useful_life_type");--> statement-breakpoint
CREATE INDEX "integration_outbox_poll_idx" ON "integration_outbox" USING btree ("status","process_after") WHERE status = 'pending';--> statement-breakpoint
CREATE INDEX "inventory_transfers_org_id_idx" ON "inventory_transfers" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "inventory_transfers_org_created_idx" ON "inventory_transfers" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "investment_properties_org_created_idx" ON "investment_properties" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "investment_properties_org_company_category_idx" ON "investment_properties" USING btree ("org_id","company_id","category");--> statement-breakpoint
CREATE INDEX "investment_properties_org_company_model_idx" ON "investment_properties" USING btree ("org_id","company_id","measurement_model");--> statement-breakpoint
CREATE INDEX "job_applications_org_id_idx" ON "job_applications" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "job_applications_org_created_idx" ON "job_applications" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "je_org_id_idx" ON "journal_entries" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "je_org_created_idx" ON "journal_entries" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "je_company_posting_idx" ON "journal_entries" USING btree ("org_id","company_id","posting_date");--> statement-breakpoint
CREATE INDEX "je_entry_no_idx" ON "journal_entries" USING btree ("org_id","entry_no");--> statement-breakpoint
CREATE INDEX "je_source_idx" ON "journal_entries" USING btree ("org_id","source_type","source_id");--> statement-breakpoint
CREATE UNIQUE INDEX "je_unique_entry_no_idx" ON "journal_entries" USING btree ("org_id","entry_no") WHERE entry_no IS NOT NULL;--> statement-breakpoint
CREATE INDEX "jl_org_id_idx" ON "journal_lines" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "jl_org_created_idx" ON "journal_lines" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "jl_journal_idx" ON "journal_lines" USING btree ("org_id","journal_id");--> statement-breakpoint
CREATE INDEX "jl_account_idx" ON "journal_lines" USING btree ("org_id","account_id");--> statement-breakpoint
CREATE INDEX "jl_company_account_idx" ON "journal_lines" USING btree ("org_id","company_id","account_id");--> statement-breakpoint
CREATE INDEX "leads_org_id_idx" ON "leads" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "leads_org_email_idx" ON "leads" USING btree ("org_id","email");--> statement-breakpoint
CREATE INDEX "leads_org_created_idx" ON "leads" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "leases_org_id_idx" ON "leases" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "leases_org_created_idx" ON "leases" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "leave_requests_org_id_idx" ON "leave_requests" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "leave_requests_org_created_idx" ON "leave_requests" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "ledgers_org_id_idx" ON "ledgers" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "ledgers_org_created_idx" ON "ledgers" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "ledgers_company_idx" ON "ledgers" USING btree ("org_id","company_id","ledger_code");--> statement-breakpoint
CREATE UNIQUE INDEX "ledgers_unique_code_idx" ON "ledgers" USING btree ("org_id","company_id","ledger_code");--> statement-breakpoint
CREATE INDEX "legal_entities_org_id_idx" ON "legal_entities" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "legal_entities_org_created_idx" ON "legal_entities" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "livestock_records_org_id_idx" ON "livestock_records" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "livestock_records_org_created_idx" ON "livestock_records" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "match_results_org_id_idx" ON "match_results" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "match_results_org_created_idx" ON "match_results" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "match_results_statement_idx" ON "match_results" USING btree ("org_id","statement_line_id");--> statement-breakpoint
CREATE INDEX "match_results_entity_idx" ON "match_results" USING btree ("org_id","matched_entity_type","matched_entity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "match_results_confirmed_idx" ON "match_results" USING btree ("org_id","statement_line_id") WHERE status = 'confirmed';--> statement-breakpoint
CREATE INDEX "meta_alias_resolution_rules_alias_set_org_fk_idx" ON "meta_alias_resolution_rules" USING btree ("org_id","alias_set_id");--> statement-breakpoint
CREATE INDEX "meta_alias_resolution_rules_org_id_idx" ON "meta_alias_resolution_rules" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "meta_alias_resolution_rules_scope_uniq" ON "meta_alias_resolution_rules" USING btree ("org_id","scope_type","scope_key");--> statement-breakpoint
CREATE INDEX "meta_alias_sets_org_id_idx" ON "meta_alias_sets" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "meta_aliases_alias_set_org_fk_idx" ON "meta_aliases" USING btree ("org_id","alias_set_id");--> statement-breakpoint
CREATE INDEX "meta_aliases_org_pk_idx" ON "meta_aliases" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "meta_assets_org_id_idx" ON "meta_assets" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "meta_assets_org_asset_key_uniq" ON "meta_assets" USING btree ("org_id","asset_key");--> statement-breakpoint
CREATE INDEX "meta_lineage_edges_to_asset_org_fk_idx" ON "meta_lineage_edges" USING btree ("org_id","to_asset_id");--> statement-breakpoint
CREATE INDEX "meta_lineage_edges_from_asset_org_fk_idx" ON "meta_lineage_edges" USING btree ("org_id","from_asset_id");--> statement-breakpoint
CREATE INDEX "meta_lineage_edges_org_id_idx" ON "meta_lineage_edges" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "meta_lineage_edges_uniq" ON "meta_lineage_edges" USING btree ("org_id","from_asset_id","to_asset_id","edge_type");--> statement-breakpoint
CREATE INDEX "meta_quality_checks_target_asset_org_fk_idx" ON "meta_quality_checks" USING btree ("org_id","target_asset_id");--> statement-breakpoint
CREATE INDEX "meta_quality_checks_org_id_idx" ON "meta_quality_checks" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "meta_semantic_terms_org_id_idx" ON "meta_semantic_terms" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "meta_term_links_term_org_fk_idx" ON "meta_term_links" USING btree ("org_id","term_id");--> statement-breakpoint
CREATE INDEX "meta_term_links_org_id_idx" ON "meta_term_links" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "meta_term_links_uniq" ON "meta_term_links" USING btree ("org_id","term_id","target_key");--> statement-breakpoint
CREATE INDEX "meta_value_aliases_alias_set_org_fk_idx" ON "meta_value_aliases" USING btree ("org_id","alias_set_id");--> statement-breakpoint
CREATE INDEX "meta_value_aliases_org_id_idx" ON "meta_value_aliases" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "migration_checkpoints_migration_job_org_fk_idx" ON "migration_checkpoints" USING btree ("org_id","migration_job_id");--> statement-breakpoint
CREATE INDEX "migration_checkpoints_job_idx" ON "migration_checkpoints" USING btree ("migration_job_id");--> statement-breakpoint
CREATE INDEX "migration_conflict_resolutions_migration_job_org_fk_idx" ON "migration_conflict_resolutions" USING btree ("org_id","migration_job_id");--> statement-breakpoint
CREATE INDEX "migration_conflict_resolutions_conflict_org_fk_idx" ON "migration_conflict_resolutions" USING btree ("org_id","conflict_id");--> statement-breakpoint
CREATE INDEX "migration_conflict_resolutions_conflict_idx" ON "migration_conflict_resolutions" USING btree ("conflict_id");--> statement-breakpoint
CREATE INDEX "migration_conflict_resolutions_job_idx" ON "migration_conflict_resolutions" USING btree ("migration_job_id","decision");--> statement-breakpoint
CREATE INDEX "migration_conflicts_migration_job_org_fk_idx" ON "migration_conflicts" USING btree ("org_id","migration_job_id");--> statement-breakpoint
CREATE INDEX "migration_conflicts_job_idx" ON "migration_conflicts" USING btree ("migration_job_id");--> statement-breakpoint
CREATE INDEX "migration_conflicts_resolution_idx" ON "migration_conflicts" USING btree ("org_id","resolution");--> statement-breakpoint
CREATE INDEX "migration_jobs_org_status_idx" ON "migration_jobs" USING btree ("org_id","status");--> statement-breakpoint
CREATE INDEX "migration_jobs_entity_type_idx" ON "migration_jobs" USING btree ("entity_type");--> statement-breakpoint
CREATE INDEX "migration_lineage_migration_job_org_fk_idx" ON "migration_lineage" USING btree ("org_id","migration_job_id");--> statement-breakpoint
CREATE INDEX "migration_lineage_job_idx" ON "migration_lineage" USING btree ("migration_job_id");--> statement-breakpoint
CREATE INDEX "migration_lineage_reservations_idx" ON "migration_lineage" USING btree ("org_id","entity_type","legacy_system","reserved_at") WHERE state = 'reserved';--> statement-breakpoint
CREATE UNIQUE INDEX "migration_lineage_dedupe_key_idx" ON "migration_lineage" USING btree ("dedupe_key") WHERE state = 'committed' AND dedupe_key IS NOT NULL;--> statement-breakpoint
CREATE INDEX "migration_merge_explanations_migration_job_org_fk_idx" ON "migration_merge_explanations" USING btree ("org_id","migration_job_id");--> statement-breakpoint
CREATE INDEX "migration_merge_explanations_job_idx" ON "migration_merge_explanations" USING btree ("migration_job_id");--> statement-breakpoint
CREATE INDEX "migration_merge_explanations_decision_idx" ON "migration_merge_explanations" USING btree ("migration_job_id","decision");--> statement-breakpoint
CREATE INDEX "migration_quarantine_migration_job_org_fk_idx" ON "migration_quarantine" USING btree ("org_id","migration_job_id");--> statement-breakpoint
CREATE INDEX "migration_quarantine_job_idx" ON "migration_quarantine" USING btree ("migration_job_id");--> statement-breakpoint
CREATE INDEX "migration_quarantine_status_idx" ON "migration_quarantine" USING btree ("migration_job_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "migration_quarantine_dedupe" ON "migration_quarantine" USING btree ("migration_job_id","entity_type","legacy_id","last_error_hash") WHERE status IN ('quarantined', 'retrying');--> statement-breakpoint
CREATE INDEX "migration_reports_job_idx" ON "migration_reports" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "migration_reports_hash_idx" ON "migration_reports" USING btree ("report_hash");--> statement-breakpoint
CREATE INDEX "migration_row_snapshots_migration_job_org_fk_idx" ON "migration_row_snapshots" USING btree ("org_id","migration_job_id");--> statement-breakpoint
CREATE INDEX "migration_row_snapshots_job_idx" ON "migration_row_snapshots" USING btree ("migration_job_id","entity_type");--> statement-breakpoint
CREATE INDEX "number_sequences_org_id_idx" ON "number_sequences" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "number_sequences_org_company_entity_fy_uniq" ON "number_sequences" USING btree ("org_id","company_id","entity_type","fiscal_year");--> statement-breakpoint
CREATE INDEX "opportunities_org_id_idx" ON "opportunities" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "opportunities_org_created_idx" ON "opportunities" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "outlet_audits_org_id_idx" ON "outlet_audits" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "outlet_audits_org_created_idx" ON "outlet_audits" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "payment_allocations_org_id_idx" ON "payment_allocations" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "payment_allocations_org_created_idx" ON "payment_allocations" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "payment_allocations_payment_idx" ON "payment_allocations" USING btree ("org_id","payment_id");--> statement-breakpoint
CREATE INDEX "payment_allocations_invoice_idx" ON "payment_allocations" USING btree ("org_id","invoice_id");--> statement-breakpoint
CREATE UNIQUE INDEX "payment_allocations_unique_idx" ON "payment_allocations" USING btree ("org_id","payment_id","invoice_id","allocation_type");--> statement-breakpoint
CREATE INDEX "pr_org_id_idx" ON "payment_runs" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "pr_org_created_idx" ON "payment_runs" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "pr_bank_idx" ON "payment_runs" USING btree ("org_id","bank_account_id");--> statement-breakpoint
CREATE INDEX "pr_status_idx" ON "payment_runs" USING btree ("org_id","run_status");--> statement-breakpoint
CREATE INDEX "pr_date_idx" ON "payment_runs" USING btree ("org_id","payment_date");--> statement-breakpoint
CREATE INDEX "performance_reviews_org_id_idx" ON "performance_reviews" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "performance_reviews_org_created_idx" ON "performance_reviews" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "pp_org_id_idx" ON "posting_periods" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "pp_org_created_idx" ON "posting_periods" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "pp_ledger_period_idx" ON "posting_periods" USING btree ("org_id","ledger_id","fiscal_year","period_number");--> statement-breakpoint
CREATE INDEX "pp_company_status_idx" ON "posting_periods" USING btree ("org_id","company_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "pp_unique_period_idx" ON "posting_periods" USING btree ("org_id","ledger_id","fiscal_year","period_number");--> statement-breakpoint
CREATE INDEX "products_org_id_idx" ON "products" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "products_org_code_idx" ON "products" USING btree ("org_id","code");--> statement-breakpoint
CREATE INDEX "products_org_created_idx" ON "products" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "projects_org_id_idx" ON "projects" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "projects_org_code_idx" ON "projects" USING btree ("org_id","code");--> statement-breakpoint
CREATE INDEX "projects_org_created_idx" ON "projects" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "pmov_org_id_idx" ON "provision_movements" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "pmov_org_created_idx" ON "provision_movements" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "pmov_provision_idx" ON "provision_movements" USING btree ("org_id","provision_id");--> statement-breakpoint
CREATE INDEX "pmov_date_idx" ON "provision_movements" USING btree ("org_id","movement_date");--> statement-breakpoint
CREATE INDEX "prov_org_id_idx" ON "provisions" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "prov_org_created_idx" ON "provisions" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "prov_company_type_idx" ON "provisions" USING btree ("org_id","company_id","provision_type");--> statement-breakpoint
CREATE INDEX "prov_active_idx" ON "provisions" USING btree ("org_id","is_active");--> statement-breakpoint
CREATE INDEX "purchase_requisitions_org_id_idx" ON "purchase_requisitions" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "purchase_requisitions_org_created_idx" ON "purchase_requisitions" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "quality_inspections_org_id_idx" ON "quality_inspections" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "quality_inspections_org_created_idx" ON "quality_inspections" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "r2_files_user_id_idx" ON "r2_files" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "recipes_org_id_idx" ON "recipes" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "recipes_org_created_idx" ON "recipes" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "ri_org_id_idx" ON "reconciliation_items" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "ri_org_created_idx" ON "reconciliation_items" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "ri_statement_idx" ON "reconciliation_items" USING btree ("org_id","bank_statement_id");--> statement-breakpoint
CREATE INDEX "ri_match_status_idx" ON "reconciliation_items" USING btree ("org_id","match_status");--> statement-breakpoint
CREATE INDEX "ri_matched_doc_idx" ON "reconciliation_items" USING btree ("org_id","matched_document_id");--> statement-breakpoint
CREATE INDEX "returns_org_id_idx" ON "returns" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "returns_org_created_idx" ON "returns" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "revenue_schedule_lines_org_id_idx" ON "revenue_schedule_lines" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "revenue_schedule_lines_org_created_idx" ON "revenue_schedule_lines" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "revenue_schedule_lines_schedule_idx" ON "revenue_schedule_lines" USING btree ("org_id","schedule_id");--> statement-breakpoint
CREATE INDEX "revenue_schedule_lines_period_idx" ON "revenue_schedule_lines" USING btree ("org_id","fiscal_period_id");--> statement-breakpoint
CREATE UNIQUE INDEX "revenue_schedule_lines_unique_idx" ON "revenue_schedule_lines" USING btree ("org_id","schedule_id","fiscal_period_id");--> statement-breakpoint
CREATE INDEX "revenue_schedules_org_id_idx" ON "revenue_schedules" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "revenue_schedules_org_created_idx" ON "revenue_schedules" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "revenue_schedules_source_idx" ON "revenue_schedules" USING btree ("org_id","source_entity_type","source_entity_id");--> statement-breakpoint
CREATE INDEX "revenue_schedules_date_idx" ON "revenue_schedules" USING btree ("org_id","start_date","end_date");--> statement-breakpoint
CREATE UNIQUE INDEX "revenue_schedules_unique_idx" ON "revenue_schedules" USING btree ("org_id","source_entity_type","source_entity_id") WHERE status IN ('draft', 'active');--> statement-breakpoint
CREATE INDEX "risk_assessments_org_id_idx" ON "risk_assessments" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "risk_assessments_org_created_idx" ON "risk_assessments" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "role_permissions_role_org_fk_idx" ON "role_permissions" USING btree ("org_id","role_id");--> statement-breakpoint
CREATE UNIQUE INDEX "role_perms_org_role_entity_verb_scope_idx" ON "role_permissions" USING btree ("org_id","role_id","entity_type","verb","scope");--> statement-breakpoint
CREATE INDEX "role_perms_org_entity_idx" ON "role_permissions" USING btree ("org_id","entity_type");--> statement-breakpoint
CREATE UNIQUE INDEX "roles_org_key_idx" ON "roles" USING btree ("org_id","key");--> statement-breakpoint
CREATE INDEX "roles_org_id_idx" ON "roles" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "sbp_grants_org_created_idx" ON "sbp_grants" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "sbp_grants_org_company_status_idx" ON "sbp_grants" USING btree ("org_id","company_id","status");--> statement-breakpoint
CREATE INDEX "sbp_grants_org_company_grant_date_idx" ON "sbp_grants" USING btree ("org_id","company_id","grant_date");--> statement-breakpoint
CREATE INDEX "search_outbox_poll_idx" ON "search_outbox" USING btree ("status","process_after") WHERE status = 'pending';--> statement-breakpoint
CREATE INDEX "search_outbox_org_idx" ON "search_outbox" USING btree ("org_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "service_tickets_org_id_idx" ON "service_tickets" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "service_tickets_org_created_idx" ON "service_tickets" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "shipments_org_id_idx" ON "shipments" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "shipments_org_created_idx" ON "shipments" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "sites_org_id_idx" ON "sites" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "sites_org_created_idx" ON "sites" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "sites_org_code_uniq" ON "sites" USING btree ("org_id","code");--> statement-breakpoint
CREATE INDEX "sl_org_id_idx" ON "statement_layouts" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "sl_org_created_idx" ON "statement_layouts" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "sl_type_idx" ON "statement_layouts" USING btree ("org_id","statement_type","standard");--> statement-breakpoint
CREATE UNIQUE INDEX "sl_unique_code_idx" ON "statement_layouts" USING btree ("org_id","company_id","layout_code");--> statement-breakpoint
CREATE INDEX "stl_org_id_idx" ON "statement_lines" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "stl_org_created_idx" ON "statement_lines" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "stl_layout_order_idx" ON "statement_lines" USING btree ("org_id","layout_id","line_number");--> statement-breakpoint
CREATE INDEX "stl_parent_idx" ON "statement_lines" USING btree ("org_id","layout_id","parent_line_id");--> statement-breakpoint
CREATE INDEX "sub_org_id_idx" ON "subscriptions" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "sub_org_created_idx" ON "subscriptions" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "sub_customer_idx" ON "subscriptions" USING btree ("org_id","customer_id");--> statement-breakpoint
CREATE INDEX "sub_status_idx" ON "subscriptions" USING btree ("org_id","status");--> statement-breakpoint
CREATE INDEX "sub_next_billing_idx" ON "subscriptions" USING btree ("org_id","next_billing_date","status");--> statement-breakpoint
CREATE INDEX "si_org_id_idx" ON "supplier_invoices" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "si_org_created_idx" ON "supplier_invoices" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "si_supplier_idx" ON "supplier_invoices" USING btree ("org_id","supplier_id");--> statement-breakpoint
CREATE INDEX "si_due_date_idx" ON "supplier_invoices" USING btree ("org_id","due_date","payment_status");--> statement-breakpoint
CREATE INDEX "si_payment_status_idx" ON "supplier_invoices" USING btree ("org_id","payment_status");--> statement-breakpoint
CREATE UNIQUE INDEX "si_dup_detect_idx" ON "supplier_invoices" USING btree ("org_id","supplier_id","invoice_no","gross_amount_minor");--> statement-breakpoint
CREATE INDEX "suppliers_org_id_idx" ON "suppliers" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "suppliers_org_code_idx" ON "suppliers" USING btree ("org_id","code");--> statement-breakpoint
CREATE INDEX "suppliers_org_created_idx" ON "suppliers" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "tax_rates_org_id_idx" ON "tax_rates" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "tax_rates_org_created_idx" ON "tax_rates" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "tax_rates_code_date_idx" ON "tax_rates" USING btree ("org_id","tax_code","effective_from");--> statement-breakpoint
CREATE INDEX "tax_rates_jurisdiction_idx" ON "tax_rates" USING btree ("org_id","jurisdiction","tax_code");--> statement-breakpoint
CREATE UNIQUE INDEX "tax_rates_unique_idx" ON "tax_rates" USING btree ("org_id","tax_code","effective_from");--> statement-breakpoint
CREATE INDEX "timesheets_org_id_idx" ON "timesheets" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "timesheets_org_created_idx" ON "timesheets" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "tpc_org_id_idx" ON "tp_calculations" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "tpc_org_created_idx" ON "tp_calculations" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "tpc_policy_year_idx" ON "tp_calculations" USING btree ("org_id","policy_id","fiscal_year");--> statement-breakpoint
CREATE INDEX "tpc_result_idx" ON "tp_calculations" USING btree ("org_id","result");--> statement-breakpoint
CREATE INDEX "tpp_org_id_idx" ON "tp_policies" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "tpp_org_created_idx" ON "tp_policies" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "tpp_tx_type_idx" ON "tp_policies" USING btree ("org_id","transaction_type");--> statement-breakpoint
CREATE INDEX "tpp_tested_party_idx" ON "tp_policies" USING btree ("org_id","tested_party_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tpp_unique_code_idx" ON "tp_policies" USING btree ("org_id","company_id","policy_code");--> statement-breakpoint
CREATE INDEX "treasury_accounts_org_created_idx" ON "treasury_accounts" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq__treasury_accounts__org_company_account_no" ON "treasury_accounts" USING btree ("org_id","company_id","account_no");--> statement-breakpoint
CREATE INDEX "treasury_accounts_org_company_type_idx" ON "treasury_accounts" USING btree ("org_id","company_id","account_type");--> statement-breakpoint
CREATE INDEX "uom_org_id_idx" ON "uom" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "uom_org_symbol_uniq" ON "uom" USING btree ("org_id","symbol");--> statement-breakpoint
CREATE INDEX "uom_conversions_org_id_idx" ON "uom_conversions" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "uom_conversions_org_from_to_uniq" ON "uom_conversions" USING btree ("org_id","from_uom_id","to_uom_id");--> statement-breakpoint
CREATE INDEX "user_roles_role_org_fk_idx" ON "user_roles" USING btree ("org_id","role_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_roles_org_user_role_idx" ON "user_roles" USING btree ("org_id","user_id","role_id");--> statement-breakpoint
CREATE INDEX "user_roles_org_user_idx" ON "user_roles" USING btree ("org_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_scopes_org_user_type_id_idx" ON "user_scopes" USING btree ("org_id","user_id","scope_type","scope_id");--> statement-breakpoint
CREATE INDEX "user_scopes_org_user_idx" ON "user_scopes" USING btree ("org_id","user_id");--> statement-breakpoint
CREATE INDEX "users_user_id_idx" ON "users" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "video_settings_org_unique_idx" ON "video_settings" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "warehouses_org_id_idx" ON "warehouses" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "warehouses_org_code_idx" ON "warehouses" USING btree ("org_id","code");--> statement-breakpoint
CREATE INDEX "warehouses_org_created_idx" ON "warehouses" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "webhook_deliveries_org_created_idx" ON "webhook_deliveries" USING btree ("org_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "webhook_deliveries_endpoint_idx" ON "webhook_deliveries" USING btree ("org_id","endpoint_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "webhook_endpoints_org_active_idx" ON "webhook_endpoints" USING btree ("org_id","is_active");--> statement-breakpoint
CREATE INDEX "webhook_outbox_poll_idx" ON "webhook_outbox" USING btree ("status","process_after") WHERE status = 'pending';--> statement-breakpoint
CREATE INDEX "wcer_org_id_idx" ON "wht_certificates" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "wcer_org_created_idx" ON "wht_certificates" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "wcer_payee_idx" ON "wht_certificates" USING btree ("org_id","payee_id");--> statement-breakpoint
CREATE INDEX "wcer_payment_idx" ON "wht_certificates" USING btree ("org_id","payment_id");--> statement-breakpoint
CREATE INDEX "wcer_remittance_idx" ON "wht_certificates" USING btree ("org_id","remittance_status");--> statement-breakpoint
CREATE UNIQUE INDEX "wcer_unique_cert_idx" ON "wht_certificates" USING btree ("org_id","certificate_no") WHERE certificate_no IS NOT NULL;--> statement-breakpoint
CREATE INDEX "wc_org_id_idx" ON "wht_codes" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "wc_org_created_idx" ON "wht_codes" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "wc_jurisdiction_idx" ON "wht_codes" USING btree ("org_id","jurisdiction","income_type");--> statement-breakpoint
CREATE UNIQUE INDEX "wc_unique_code_idx" ON "wht_codes" USING btree ("org_id","company_id","wht_code");--> statement-breakpoint
CREATE INDEX "wr_org_id_idx" ON "wht_rates" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "wr_org_created_idx" ON "wht_rates" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "wr_code_date_idx" ON "wht_rates" USING btree ("org_id","wht_code_id","effective_from");--> statement-breakpoint
CREATE INDEX "wr_treaty_idx" ON "wht_rates" USING btree ("org_id","treaty_country","effective_from");--> statement-breakpoint
CREATE UNIQUE INDEX "wr_unique_rate_idx" ON "wht_rates" USING btree ("org_id","wht_code_id","rate_type","treaty_country","effective_from");--> statement-breakpoint
CREATE INDEX "work_orders_org_id_idx" ON "work_orders" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "work_orders_org_created_idx" ON "work_orders" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "workflow_executions_org_created_idx" ON "workflow_executions" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "workflow_executions_org_rule_created_idx" ON "workflow_executions" USING btree ("org_id","rule_id","created_at");--> statement-breakpoint
CREATE INDEX "workflow_executions_org_request_idx" ON "workflow_executions" USING btree ("org_id","request_id");--> statement-breakpoint
CREATE INDEX "workflow_outbox_poll_idx" ON "workflow_outbox" USING btree ("status","process_after") WHERE status = 'pending';--> statement-breakpoint
CREATE INDEX "workflow_outbox_org_idx" ON "workflow_outbox" USING btree ("org_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "workflow_rules_org_id_idx" ON "workflow_rules" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "workflow_rules_org_enabled_idx" ON "workflow_rules" USING btree ("org_id","enabled");--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "acct_derived_entries" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "acct_derived_entries"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "acct_derived_entries" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "acct_derived_entries"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "acct_derived_entries" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "acct_derived_entries"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "acct_derived_entries"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "acct_derived_entries" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "acct_derived_entries"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "acct_events" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "acct_events"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "acct_events" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "acct_events"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "acct_events" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "acct_events"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "acct_events"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "acct_events" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "acct_events"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "acct_mapping_versions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "acct_mapping_versions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "acct_mapping_versions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "acct_mapping_versions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "acct_mapping_versions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "acct_mapping_versions"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "acct_mapping_versions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "acct_mapping_versions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "acct_mapping_versions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "acct_mappings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "acct_mappings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "acct_mappings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "acct_mappings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "acct_mappings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "acct_mappings"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "acct_mappings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "acct_mappings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "acct_mappings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "advisories" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "advisories"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "advisories" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "advisories"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "advisories" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "advisories"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "advisories"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "advisories" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "advisories"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "advisory_evidence" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "advisory_evidence"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "advisory_evidence" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "advisory_evidence"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "advisory_evidence" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "advisory_evidence"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "advisory_evidence"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "advisory_evidence" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "advisory_evidence"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "api_keys" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "api_keys"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "api_keys" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "api_keys"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "api_keys" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "api_keys"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "api_keys"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "api_keys" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "api_keys"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "assets" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "assets" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "assets" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "assets"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "assets" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "audit_logs" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "audit_logs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "audit_logs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "audit_logs"."org_id" AND ("audit_logs"."channel" = 'system' OR auth.user_id() = "audit_logs"."actor_user_id")));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "audit_logs" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "audit_logs"."org_id" AND ("audit_logs"."channel" = 'system' OR auth.user_id() = "audit_logs"."actor_user_id"))) WITH CHECK ((select auth.org_id()::uuid = "audit_logs"."org_id" AND ("audit_logs"."channel" = 'system' OR auth.user_id() = "audit_logs"."actor_user_id")));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "audit_logs" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "audit_logs"."org_id" AND ("audit_logs"."channel" = 'system' OR auth.user_id() = "audit_logs"."actor_user_id")));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "audit_programs" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "audit_programs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "audit_programs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "audit_programs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "audit_programs" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "audit_programs"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "audit_programs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "audit_programs" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "audit_programs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "bank_statements" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "bank_statements"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "bank_statements" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "bank_statements"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "bank_statements" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "bank_statements"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "bank_statements"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "bank_statements" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "bank_statements"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "billing_cycles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "billing_cycles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "billing_cycles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "billing_cycles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "billing_cycles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "billing_cycles"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "billing_cycles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "billing_cycles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "billing_cycles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "biological_asset_items" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "biological_asset_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "biological_asset_items" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "biological_asset_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "biological_asset_items" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "biological_asset_items"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "biological_asset_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "biological_asset_items" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "biological_asset_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "boms" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "boms"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "boms" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "boms"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "boms" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "boms"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "boms"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "boms" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "boms"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "borrowing_cost_items" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "borrowing_cost_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "borrowing_cost_items" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "borrowing_cost_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "borrowing_cost_items" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "borrowing_cost_items"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "borrowing_cost_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "borrowing_cost_items" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "borrowing_cost_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "budgets" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "budgets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "budgets" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "budgets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "budgets" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "budgets"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "budgets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "budgets" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "budgets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "campaigns" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "campaigns"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "campaigns" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "campaigns"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "campaigns" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "campaigns"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "campaigns"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "campaigns" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "campaigns"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "chart_of_accounts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "chart_of_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "chart_of_accounts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "chart_of_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "chart_of_accounts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "chart_of_accounts"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "chart_of_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "chart_of_accounts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "chart_of_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "close_evidence" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "close_evidence"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "close_evidence" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "close_evidence"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "close_evidence" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "close_evidence"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "close_evidence"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "close_evidence" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "close_evidence"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "close_tasks" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "close_tasks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "close_tasks" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "close_tasks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "close_tasks" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "close_tasks"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "close_tasks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "close_tasks" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "close_tasks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "communications" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "communications"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "communications" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "communications"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "communications" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "communications"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "communications"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "communications" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "communications"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "companies" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "companies"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "companies" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "companies"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "companies" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "companies"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "companies"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "companies" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "companies"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "contacts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "contacts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "contacts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "contacts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "contacts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "contacts"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "contacts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "contacts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "contacts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "contracts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "contracts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "contracts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "contracts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "contracts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "contracts"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "contracts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "contracts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "contracts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "cost_centers" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "cost_centers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "cost_centers" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "cost_centers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "cost_centers" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "cost_centers"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "cost_centers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "cost_centers" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "cost_centers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "credit_exposures" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "credit_exposures"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "credit_exposures" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "credit_exposures"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "credit_exposures" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "credit_exposures"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "credit_exposures"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "credit_exposures" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "credit_exposures"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "credit_limits" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "credit_limits"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "credit_limits" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "credit_limits"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "credit_limits" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "credit_limits"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "credit_limits"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "credit_limits" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "credit_limits"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "crop_plans" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "crop_plans"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "crop_plans" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "crop_plans"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "crop_plans" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "crop_plans"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "crop_plans"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "crop_plans" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "crop_plans"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "currencies" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "currencies"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "currencies" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "currencies"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "currencies" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "currencies"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "currencies"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "currencies" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "currencies"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "currency_exchanges" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "currency_exchanges"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "currency_exchanges" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "currency_exchanges"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "currency_exchanges" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "currency_exchanges"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "currency_exchanges"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "currency_exchanges" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "currency_exchanges"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "custom_field_sync_queue" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "custom_field_sync_queue"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "custom_field_sync_queue" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "custom_field_sync_queue"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "custom_field_sync_queue" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "custom_field_sync_queue"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "custom_field_sync_queue"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "custom_field_sync_queue" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "custom_field_sync_queue"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "custom_field_values" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "custom_field_values"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "custom_field_values" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "custom_field_values"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "custom_field_values" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "custom_field_values"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "custom_field_values"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "custom_field_values" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "custom_field_values"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "custom_fields" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "custom_fields"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "custom_fields" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "custom_fields"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "custom_fields" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "custom_fields"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "custom_fields"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "custom_fields" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "custom_fields"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "customers" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "customers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "customers" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "customers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "customers" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "customers"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "customers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "customers" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "customers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "deferred_tax_items" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "deferred_tax_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "deferred_tax_items" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "deferred_tax_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "deferred_tax_items" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "deferred_tax_items"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "deferred_tax_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "deferred_tax_items" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "deferred_tax_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "delivery_note_lines" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "delivery_note_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "delivery_note_lines" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "delivery_note_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "delivery_note_lines" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "delivery_note_lines"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "delivery_note_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "delivery_note_lines" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "delivery_note_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "delivery_notes" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "delivery_notes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "delivery_notes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "delivery_notes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "delivery_notes" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "delivery_notes"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "delivery_notes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "delivery_notes" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "delivery_notes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "depreciation_schedules" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "depreciation_schedules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "depreciation_schedules" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "depreciation_schedules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "depreciation_schedules" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "depreciation_schedules"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "depreciation_schedules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "depreciation_schedules" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "depreciation_schedules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "document_types" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "document_types"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "document_types" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "document_types"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "document_types" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "document_types"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "document_types"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "document_types" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "document_types"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "documents" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "documents"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "documents" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "documents"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "documents" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "documents"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "documents"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "documents" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "documents"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "employee_benefit_plans" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "employee_benefit_plans"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "employee_benefit_plans" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "employee_benefit_plans"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "employee_benefit_plans" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "employee_benefit_plans"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "employee_benefit_plans"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "employee_benefit_plans" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "employee_benefit_plans"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "employees" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "employees"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "employees" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "employees"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "employees" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "employees"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "employees"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "employees" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "employees"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "entity_attachments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "entity_attachments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "entity_attachments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "entity_attachments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "entity_attachments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "entity_attachments"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "entity_attachments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "entity_attachments" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "entity_attachments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "entity_versions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "entity_versions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "entity_versions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "entity_versions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "entity_versions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "entity_versions"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "entity_versions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "entity_versions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "entity_versions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "entity_view_fields" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "entity_view_fields"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "entity_view_fields" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "entity_view_fields"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "entity_view_fields" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "entity_view_fields"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "entity_view_fields"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "entity_view_fields" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "entity_view_fields"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "entity_views" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "entity_views"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "entity_views" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "entity_views"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "entity_views" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "entity_views"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "entity_views"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "entity_views" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "entity_views"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "expense_reports" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "expense_reports"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "expense_reports" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "expense_reports"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "expense_reports" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "expense_reports"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "expense_reports"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "expense_reports" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "expense_reports"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "financial_instruments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "financial_instruments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "financial_instruments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "financial_instruments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "financial_instruments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "financial_instruments"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "financial_instruments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "financial_instruments" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "financial_instruments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "fiscal_periods" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "fiscal_periods"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "fiscal_periods" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "fiscal_periods"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "fiscal_periods" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "fiscal_periods"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "fiscal_periods"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "fiscal_periods" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "fiscal_periods"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "fixed_assets" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "fixed_assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "fixed_assets" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "fixed_assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "fixed_assets" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "fixed_assets"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "fixed_assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "fixed_assets" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "fixed_assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "forecasts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "forecasts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "forecasts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "forecasts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "forecasts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "forecasts"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "forecasts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "forecasts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "forecasts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "franchise_applications" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "franchise_applications"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "franchise_applications" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "franchise_applications"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "franchise_applications" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "franchise_applications"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "franchise_applications"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "franchise_applications" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "franchise_applications"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "fx_rates" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "fx_rates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "fx_rates" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "fx_rates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "fx_rates" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "fx_rates"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "fx_rates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "fx_rates" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "fx_rates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "government_grant_items" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "government_grant_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "government_grant_items" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "government_grant_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "government_grant_items" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "government_grant_items"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "government_grant_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "government_grant_items" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "government_grant_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "hedge_designations" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "hedge_designations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "hedge_designations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "hedge_designations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "hedge_designations" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "hedge_designations"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "hedge_designations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "hedge_designations" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "hedge_designations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "hedge_effectiveness_tests" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "hedge_effectiveness_tests"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "hedge_effectiveness_tests" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "hedge_effectiveness_tests"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "hedge_effectiveness_tests" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "hedge_effectiveness_tests"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "hedge_effectiveness_tests"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "hedge_effectiveness_tests" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "hedge_effectiveness_tests"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "ic_agreements" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "ic_agreements"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "ic_agreements" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "ic_agreements"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "ic_agreements" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "ic_agreements"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "ic_agreements"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "ic_agreements" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "ic_agreements"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "ic_transactions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "ic_transactions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "ic_transactions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "ic_transactions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "ic_transactions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "ic_transactions"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "ic_transactions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "ic_transactions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "ic_transactions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "impairment_tests" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "impairment_tests"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "impairment_tests" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "impairment_tests"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "impairment_tests" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "impairment_tests"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "impairment_tests"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "impairment_tests" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "impairment_tests"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "intangible_assets" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "intangible_assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "intangible_assets" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "intangible_assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "intangible_assets" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "intangible_assets"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "intangible_assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "intangible_assets" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "intangible_assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "inventory_transfers" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "inventory_transfers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "inventory_transfers" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "inventory_transfers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "inventory_transfers" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "inventory_transfers"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "inventory_transfers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "inventory_transfers" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "inventory_transfers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "investment_properties" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "investment_properties"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "investment_properties" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "investment_properties"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "investment_properties" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "investment_properties"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "investment_properties"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "investment_properties" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "investment_properties"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "job_applications" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "job_applications"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "job_applications" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "job_applications"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "job_applications" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "job_applications"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "job_applications"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "job_applications" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "job_applications"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "journal_entries" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "journal_entries"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "journal_entries" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "journal_entries"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "journal_entries" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "journal_entries"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "journal_entries"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "journal_entries" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "journal_entries"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "journal_lines" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "journal_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "journal_lines" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "journal_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "journal_lines" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "journal_lines"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "journal_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "journal_lines" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "journal_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "leads" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "leads"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "leads" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "leads"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "leads" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "leads"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "leads"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "leads" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "leads"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "leases" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "leases"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "leases" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "leases"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "leases" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "leases"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "leases"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "leases" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "leases"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "leave_requests" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "leave_requests"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "leave_requests" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "leave_requests"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "leave_requests" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "leave_requests"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "leave_requests"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "leave_requests" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "leave_requests"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "ledgers" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "ledgers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "ledgers" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "ledgers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "ledgers" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "ledgers"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "ledgers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "ledgers" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "ledgers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "legal_entities" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "legal_entities"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "legal_entities" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "legal_entities"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "legal_entities" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "legal_entities"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "legal_entities"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "legal_entities" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "legal_entities"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "livestock_records" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "livestock_records"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "livestock_records" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "livestock_records"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "livestock_records" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "livestock_records"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "livestock_records"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "livestock_records" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "livestock_records"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "match_results" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "match_results"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "match_results" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "match_results"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "match_results" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "match_results"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "match_results"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "match_results" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "match_results"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "meta_alias_resolution_rules" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "meta_alias_resolution_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "meta_alias_resolution_rules" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "meta_alias_resolution_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "meta_alias_resolution_rules" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "meta_alias_resolution_rules"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "meta_alias_resolution_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "meta_alias_resolution_rules" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "meta_alias_resolution_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "meta_alias_sets" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "meta_alias_sets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "meta_alias_sets" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "meta_alias_sets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "meta_alias_sets" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "meta_alias_sets"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "meta_alias_sets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "meta_alias_sets" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "meta_alias_sets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "meta_aliases" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "meta_aliases"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "meta_aliases" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "meta_aliases"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "meta_aliases" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "meta_aliases"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "meta_aliases"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "meta_aliases" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "meta_aliases"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "meta_assets" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "meta_assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "meta_assets" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "meta_assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "meta_assets" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "meta_assets"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "meta_assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "meta_assets" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "meta_assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "meta_lineage_edges" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "meta_lineage_edges"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "meta_lineage_edges" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "meta_lineage_edges"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "meta_lineage_edges" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "meta_lineage_edges"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "meta_lineage_edges"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "meta_lineage_edges" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "meta_lineage_edges"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "meta_quality_checks" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "meta_quality_checks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "meta_quality_checks" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "meta_quality_checks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "meta_quality_checks" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "meta_quality_checks"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "meta_quality_checks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "meta_quality_checks" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "meta_quality_checks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "meta_semantic_terms" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "meta_semantic_terms"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "meta_semantic_terms" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "meta_semantic_terms"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "meta_semantic_terms" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "meta_semantic_terms"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "meta_semantic_terms"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "meta_semantic_terms" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "meta_semantic_terms"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "meta_term_links" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "meta_term_links"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "meta_term_links" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "meta_term_links"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "meta_term_links" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "meta_term_links"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "meta_term_links"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "meta_term_links" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "meta_term_links"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "meta_value_aliases" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "meta_value_aliases"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "meta_value_aliases" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "meta_value_aliases"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "meta_value_aliases" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "meta_value_aliases"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "meta_value_aliases"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "meta_value_aliases" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "meta_value_aliases"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "migration_checkpoints" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "migration_checkpoints"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "migration_checkpoints" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "migration_checkpoints"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "migration_checkpoints" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "migration_checkpoints"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "migration_checkpoints"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "migration_checkpoints" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "migration_checkpoints"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "migration_conflict_resolutions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "migration_conflict_resolutions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "migration_conflict_resolutions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "migration_conflict_resolutions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "migration_conflict_resolutions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "migration_conflict_resolutions"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "migration_conflict_resolutions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "migration_conflict_resolutions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "migration_conflict_resolutions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "migration_conflicts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "migration_conflicts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "migration_conflicts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "migration_conflicts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "migration_conflicts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "migration_conflicts"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "migration_conflicts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "migration_conflicts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "migration_conflicts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "migration_jobs" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "migration_jobs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "migration_jobs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "migration_jobs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "migration_jobs" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "migration_jobs"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "migration_jobs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "migration_jobs" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "migration_jobs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "migration_lineage" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "migration_lineage"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "migration_lineage" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "migration_lineage"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "migration_lineage" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "migration_lineage"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "migration_lineage"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "migration_lineage" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "migration_lineage"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "migration_merge_explanations" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "migration_merge_explanations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "migration_merge_explanations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "migration_merge_explanations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "migration_merge_explanations" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "migration_merge_explanations"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "migration_merge_explanations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "migration_merge_explanations" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "migration_merge_explanations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "migration_quarantine" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "migration_quarantine"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "migration_quarantine" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "migration_quarantine"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "migration_quarantine" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "migration_quarantine"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "migration_quarantine"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "migration_quarantine" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "migration_quarantine"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "migration_reports" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select EXISTS (SELECT 1 FROM migration_jobs WHERE migration_jobs.id = "migration_reports"."job_id" AND migration_jobs.org_id = auth.org_id()::uuid)));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "migration_reports" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select EXISTS (SELECT 1 FROM migration_jobs WHERE migration_jobs.id = "migration_reports"."job_id" AND migration_jobs.org_id = auth.org_id()::uuid)));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "migration_reports" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select EXISTS (SELECT 1 FROM migration_jobs WHERE migration_jobs.id = "migration_reports"."job_id" AND migration_jobs.org_id = auth.org_id()::uuid))) WITH CHECK ((select EXISTS (SELECT 1 FROM migration_jobs WHERE migration_jobs.id = "migration_reports"."job_id" AND migration_jobs.org_id = auth.org_id()::uuid)));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "migration_reports" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select EXISTS (SELECT 1 FROM migration_jobs WHERE migration_jobs.id = "migration_reports"."job_id" AND migration_jobs.org_id = auth.org_id()::uuid)));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "migration_row_snapshots" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "migration_row_snapshots"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "migration_row_snapshots" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "migration_row_snapshots"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "migration_row_snapshots" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "migration_row_snapshots"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "migration_row_snapshots"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "migration_row_snapshots" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "migration_row_snapshots"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "mutation_batches" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "mutation_batches"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "mutation_batches" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "mutation_batches"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "mutation_batches" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "mutation_batches"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "mutation_batches"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "mutation_batches" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "mutation_batches"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "number_sequences" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "number_sequences"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "number_sequences" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "number_sequences"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "number_sequences" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "number_sequences"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "number_sequences"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "number_sequences" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "number_sequences"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "opportunities" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "opportunities"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "opportunities" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "opportunities"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "opportunities" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "opportunities"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "opportunities"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "opportunities" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "opportunities"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "org_usage_daily" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "org_usage_daily"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "org_usage_daily" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "org_usage_daily"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "org_usage_daily" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "org_usage_daily"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "org_usage_daily"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "org_usage_daily" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "org_usage_daily"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "outlet_audits" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "outlet_audits"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "outlet_audits" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "outlet_audits"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "outlet_audits" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "outlet_audits"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "outlet_audits"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "outlet_audits" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "outlet_audits"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "payment_allocations" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "payment_allocations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "payment_allocations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "payment_allocations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "payment_allocations" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "payment_allocations"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "payment_allocations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "payment_allocations" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "payment_allocations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "payment_runs" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "payment_runs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "payment_runs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "payment_runs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "payment_runs" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "payment_runs"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "payment_runs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "payment_runs" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "payment_runs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "performance_reviews" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "performance_reviews"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "performance_reviews" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "performance_reviews"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "performance_reviews" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "performance_reviews"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "performance_reviews"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "performance_reviews" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "performance_reviews"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "posting_periods" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "posting_periods"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "posting_periods" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "posting_periods"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "posting_periods" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "posting_periods"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "posting_periods"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "posting_periods" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "posting_periods"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "products" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "products"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "products" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "products"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "products" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "products"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "products"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "products" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "products"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "projects" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "projects"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "projects" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "projects"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "projects" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "projects"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "projects"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "projects" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "projects"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "provision_movements" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "provision_movements"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "provision_movements" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "provision_movements"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "provision_movements" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "provision_movements"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "provision_movements"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "provision_movements" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "provision_movements"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "provisions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "provisions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "provisions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "provisions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "provisions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "provisions"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "provisions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "provisions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "provisions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "purchase_requisitions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "purchase_requisitions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "purchase_requisitions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "purchase_requisitions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "purchase_requisitions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "purchase_requisitions"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "purchase_requisitions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "purchase_requisitions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "purchase_requisitions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "quality_inspections" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "quality_inspections"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "quality_inspections" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "quality_inspections"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "quality_inspections" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "quality_inspections"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "quality_inspections"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "quality_inspections" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "quality_inspections"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "r2_files" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "r2_files"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "r2_files" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "r2_files"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "r2_files" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "r2_files"."user_id")) WITH CHECK ((select auth.user_id() = "r2_files"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "r2_files" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "r2_files"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "recipes" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "recipes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "recipes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "recipes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "recipes" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "recipes"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "recipes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "recipes" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "recipes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "reconciliation_items" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "reconciliation_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "reconciliation_items" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "reconciliation_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "reconciliation_items" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "reconciliation_items"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "reconciliation_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "reconciliation_items" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "reconciliation_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "returns" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "returns"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "returns" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "returns"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "returns" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "returns"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "returns"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "returns" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "returns"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "revenue_schedule_lines" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "revenue_schedule_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "revenue_schedule_lines" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "revenue_schedule_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "revenue_schedule_lines" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "revenue_schedule_lines"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "revenue_schedule_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "revenue_schedule_lines" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "revenue_schedule_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "revenue_schedules" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "revenue_schedules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "revenue_schedules" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "revenue_schedules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "revenue_schedules" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "revenue_schedules"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "revenue_schedules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "revenue_schedules" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "revenue_schedules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "risk_assessments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "risk_assessments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "risk_assessments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "risk_assessments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "risk_assessments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "risk_assessments"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "risk_assessments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "risk_assessments" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "risk_assessments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "role_permissions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "role_permissions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "role_permissions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "role_permissions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "role_permissions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "role_permissions"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "role_permissions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "role_permissions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "role_permissions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "roles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "roles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "roles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "roles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "roles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "roles"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "roles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "roles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "roles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "sbp_grants" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "sbp_grants"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "sbp_grants" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "sbp_grants"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "sbp_grants" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "sbp_grants"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "sbp_grants"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "sbp_grants" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "sbp_grants"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "service_tickets" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "service_tickets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "service_tickets" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "service_tickets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "service_tickets" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "service_tickets"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "service_tickets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "service_tickets" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "service_tickets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "shipments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "shipments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "shipments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "shipments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "shipments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "shipments"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "shipments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "shipments" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "shipments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "sites" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "sites"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "sites" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "sites"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "sites" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "sites"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "sites"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "sites" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "sites"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "statement_layouts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "statement_layouts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "statement_layouts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "statement_layouts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "statement_layouts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "statement_layouts"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "statement_layouts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "statement_layouts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "statement_layouts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "statement_lines" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "statement_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "statement_lines" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "statement_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "statement_lines" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "statement_lines"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "statement_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "statement_lines" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "statement_lines"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "subscriptions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "subscriptions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "subscriptions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "subscriptions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "subscriptions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "subscriptions"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "subscriptions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "subscriptions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "subscriptions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "supplier_invoices" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "supplier_invoices"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "supplier_invoices" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "supplier_invoices"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "supplier_invoices" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "supplier_invoices"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "supplier_invoices"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "supplier_invoices" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "supplier_invoices"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "suppliers" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "suppliers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "suppliers" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "suppliers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "suppliers" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "suppliers"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "suppliers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "suppliers" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "suppliers"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "tax_rates" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "tax_rates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "tax_rates" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "tax_rates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "tax_rates" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "tax_rates"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "tax_rates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "tax_rates" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "tax_rates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "timesheets" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "timesheets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "timesheets" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "timesheets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "timesheets" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "timesheets"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "timesheets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "timesheets" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "timesheets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "tp_calculations" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "tp_calculations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "tp_calculations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "tp_calculations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "tp_calculations" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "tp_calculations"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "tp_calculations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "tp_calculations" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "tp_calculations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "tp_policies" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "tp_policies"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "tp_policies" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "tp_policies"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "tp_policies" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "tp_policies"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "tp_policies"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "tp_policies" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "tp_policies"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "treasury_accounts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "treasury_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "treasury_accounts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "treasury_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "treasury_accounts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "treasury_accounts"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "treasury_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "treasury_accounts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "treasury_accounts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "uom" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "uom"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "uom" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "uom"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "uom" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "uom"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "uom"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "uom" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "uom"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "uom_conversions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "uom_conversions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "uom_conversions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "uom_conversions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "uom_conversions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "uom_conversions"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "uom_conversions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "uom_conversions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "uom_conversions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "user_roles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "user_roles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "user_roles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "user_roles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "user_roles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "user_roles"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "user_roles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "user_roles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "user_roles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "user_scopes" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "user_scopes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "user_scopes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "user_scopes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "user_scopes" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "user_scopes"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "user_scopes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "user_scopes" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "user_scopes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "users" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "users"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "users" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "users"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "users" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "users"."user_id")) WITH CHECK ((select auth.user_id() = "users"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "users" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "users"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "video_settings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "video_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "video_settings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "video_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "video_settings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "video_settings"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "video_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "video_settings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "video_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "warehouses" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "warehouses"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "warehouses" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "warehouses"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "warehouses" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "warehouses"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "warehouses"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "warehouses" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "warehouses"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "webhook_deliveries" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "webhook_deliveries"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "webhook_endpoints" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "webhook_endpoints"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "webhook_endpoints" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "webhook_endpoints"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "webhook_endpoints" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "webhook_endpoints"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "webhook_endpoints"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "webhook_endpoints" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "webhook_endpoints"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "wht_certificates" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "wht_certificates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "wht_certificates" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "wht_certificates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "wht_certificates" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "wht_certificates"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "wht_certificates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "wht_certificates" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "wht_certificates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "wht_codes" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "wht_codes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "wht_codes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "wht_codes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "wht_codes" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "wht_codes"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "wht_codes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "wht_codes" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "wht_codes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "wht_rates" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "wht_rates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "wht_rates" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "wht_rates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "wht_rates" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "wht_rates"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "wht_rates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "wht_rates" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "wht_rates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "work_orders" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "work_orders"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "work_orders" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "work_orders"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "work_orders" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "work_orders"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "work_orders"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "work_orders" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "work_orders"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "workflow_executions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "workflow_executions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "workflow_executions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "workflow_executions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "workflow_executions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "workflow_executions"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "workflow_executions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "workflow_executions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "workflow_executions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "workflow_rules" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "workflow_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "workflow_rules" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "workflow_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "workflow_rules" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "workflow_rules"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "workflow_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "workflow_rules" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "workflow_rules"."org_id"));