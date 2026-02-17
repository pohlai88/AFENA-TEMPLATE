CREATE TABLE "appointment_booking_settings" (
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
	CONSTRAINT "appointment_booking_settings_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "appointment_booking_settings_org_singleton" UNIQUE("org_id"),
	CONSTRAINT "appointment_booking_settings_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "appointment_booking_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "incoming_call_settings" (
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
	CONSTRAINT "incoming_call_settings_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "incoming_call_settings_org_singleton" UNIQUE("org_id"),
	CONSTRAINT "incoming_call_settings_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "incoming_call_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "uae_vat_settings" (
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
	CONSTRAINT "uae_vat_settings_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "uae_vat_settings_org_singleton" UNIQUE("org_id"),
	CONSTRAINT "uae_vat_settings_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "uae_vat_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "voice_call_settings" (
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
	CONSTRAINT "voice_call_settings_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "voice_call_settings_org_singleton" UNIQUE("org_id"),
	CONSTRAINT "voice_call_settings_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "voice_call_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "plaid_settings" (
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
	CONSTRAINT "plaid_settings_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "plaid_settings_org_singleton" UNIQUE("org_id"),
	CONSTRAINT "plaid_settings_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "plaid_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "repost_accounting_ledger_settings" (
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
	CONSTRAINT "repost_accounting_ledger_settings_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "repost_accounting_ledger_settings_org_singleton" UNIQUE("org_id"),
	CONSTRAINT "repost_accounting_ledger_settings_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "repost_accounting_ledger_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "south_africa_vat_settings" (
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
	CONSTRAINT "south_africa_vat_settings_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "south_africa_vat_settings_org_singleton" UNIQUE("org_id"),
	CONSTRAINT "south_africa_vat_settings_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "south_africa_vat_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "stock_reposting_settings" (
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
	CONSTRAINT "stock_reposting_settings_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "stock_reposting_settings_org_singleton" UNIQUE("org_id"),
	CONSTRAINT "stock_reposting_settings_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "stock_reposting_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "subscription_settings" (
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
	CONSTRAINT "subscription_settings_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "subscription_settings_org_singleton" UNIQUE("org_id"),
	CONSTRAINT "subscription_settings_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "subscription_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "appointment_booking_settings_org_created_id_idx" ON "appointment_booking_settings" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "incoming_call_settings_org_created_id_idx" ON "incoming_call_settings" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "uae_vat_settings_org_created_id_idx" ON "uae_vat_settings" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "voice_call_settings_org_created_id_idx" ON "voice_call_settings" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "plaid_settings_org_created_id_idx" ON "plaid_settings" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "repost_accounting_ledger_settings_org_created_id_idx" ON "repost_accounting_ledger_settings" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "south_africa_vat_settings_org_created_id_idx" ON "south_africa_vat_settings" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "stock_reposting_settings_org_created_id_idx" ON "stock_reposting_settings" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "subscription_settings_org_created_id_idx" ON "subscription_settings" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "appointment_booking_settings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "appointment_booking_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "appointment_booking_settings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "appointment_booking_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "appointment_booking_settings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "appointment_booking_settings"."org_id")) WITH CHECK ((select auth.org_id() = "appointment_booking_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "appointment_booking_settings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "appointment_booking_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "incoming_call_settings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "incoming_call_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "incoming_call_settings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "incoming_call_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "incoming_call_settings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "incoming_call_settings"."org_id")) WITH CHECK ((select auth.org_id() = "incoming_call_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "incoming_call_settings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "incoming_call_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "uae_vat_settings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "uae_vat_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "uae_vat_settings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "uae_vat_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "uae_vat_settings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "uae_vat_settings"."org_id")) WITH CHECK ((select auth.org_id() = "uae_vat_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "uae_vat_settings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "uae_vat_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "voice_call_settings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "voice_call_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "voice_call_settings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "voice_call_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "voice_call_settings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "voice_call_settings"."org_id")) WITH CHECK ((select auth.org_id() = "voice_call_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "voice_call_settings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "voice_call_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "plaid_settings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "plaid_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "plaid_settings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "plaid_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "plaid_settings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "plaid_settings"."org_id")) WITH CHECK ((select auth.org_id() = "plaid_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "plaid_settings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "plaid_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "repost_accounting_ledger_settings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "repost_accounting_ledger_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "repost_accounting_ledger_settings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "repost_accounting_ledger_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "repost_accounting_ledger_settings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "repost_accounting_ledger_settings"."org_id")) WITH CHECK ((select auth.org_id() = "repost_accounting_ledger_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "repost_accounting_ledger_settings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "repost_accounting_ledger_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "south_africa_vat_settings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "south_africa_vat_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "south_africa_vat_settings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "south_africa_vat_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "south_africa_vat_settings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "south_africa_vat_settings"."org_id")) WITH CHECK ((select auth.org_id() = "south_africa_vat_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "south_africa_vat_settings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "south_africa_vat_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "stock_reposting_settings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "stock_reposting_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "stock_reposting_settings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "stock_reposting_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "stock_reposting_settings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "stock_reposting_settings"."org_id")) WITH CHECK ((select auth.org_id() = "stock_reposting_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "stock_reposting_settings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "stock_reposting_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "subscription_settings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "subscription_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "subscription_settings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "subscription_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "subscription_settings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "subscription_settings"."org_id")) WITH CHECK ((select auth.org_id() = "subscription_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "subscription_settings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "subscription_settings"."org_id"));