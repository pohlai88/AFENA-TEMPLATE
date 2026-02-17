CREATE TABLE "authorization_controls" (
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
	CONSTRAINT "authorization_controls_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "authorization_controls_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "authorization_controls" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "authorization_rules" (
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
	"transaction" text NOT NULL,
	"based_on" text NOT NULL,
	"customer_or_item" text,
	"master_name" text,
	"company" uuid,
	"value" numeric(20, 6),
	"system_role" uuid,
	"to_emp" uuid,
	"system_user_col" uuid,
	"to_designation" uuid,
	"approving_role" uuid,
	"approving_user" uuid,
	CONSTRAINT "authorization_rules_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "authorization_rules_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "authorization_rules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "currency_exchange_settings_details" (
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
	"parent" uuid NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	CONSTRAINT "currency_exchange_settings_details_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "currency_exchange_settings_details_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "currency_exchange_settings_details" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "currency_exchange_settings" (
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
	"disabled" boolean DEFAULT false,
	"service_provider" text NOT NULL,
	"api_endpoint" text NOT NULL,
	"use_http" boolean DEFAULT false,
	"access_key" text,
	"url" text,
	"help" text,
	CONSTRAINT "currency_exchange_settings_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "currency_exchange_settings_org_singleton" UNIQUE("org_id"),
	CONSTRAINT "currency_exchange_settings_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "currency_exchange_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "item_variant_settings" (
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
	"do_not_update_variants" boolean DEFAULT false,
	"allow_rename_attribute_value" boolean DEFAULT false,
	"allow_different_uom" boolean DEFAULT false,
	CONSTRAINT "item_variant_settings_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "item_variant_settings_org_singleton" UNIQUE("org_id"),
	CONSTRAINT "item_variant_settings_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "item_variant_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "currency_exchange_settings_details" ADD CONSTRAINT "currency_exchange_settings_details_parent_currency_exchange_settings_id_fk" FOREIGN KEY ("parent") REFERENCES "public"."currency_exchange_settings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "authorization_controls_org_created_id_idx" ON "authorization_controls" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "authorization_rules_org_created_id_idx" ON "authorization_rules" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "currency_exchange_settings_details_org_parent_idx" ON "currency_exchange_settings_details" USING btree ("org_id","parent");--> statement-breakpoint
CREATE INDEX "currency_exchange_settings_details_org_created_id_idx" ON "currency_exchange_settings_details" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "currency_exchange_settings_org_created_id_idx" ON "currency_exchange_settings" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "item_variant_settings_org_created_id_idx" ON "item_variant_settings" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "authorization_controls" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "authorization_controls"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "authorization_controls" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "authorization_controls"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "authorization_controls" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "authorization_controls"."org_id")) WITH CHECK ((select auth.org_id() = "authorization_controls"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "authorization_controls" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "authorization_controls"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "authorization_rules" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "authorization_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "authorization_rules" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "authorization_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "authorization_rules" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "authorization_rules"."org_id")) WITH CHECK ((select auth.org_id() = "authorization_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "authorization_rules" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "authorization_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "currency_exchange_settings_details" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "currency_exchange_settings_details"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "currency_exchange_settings_details" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "currency_exchange_settings_details"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "currency_exchange_settings_details" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "currency_exchange_settings_details"."org_id")) WITH CHECK ((select auth.org_id() = "currency_exchange_settings_details"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "currency_exchange_settings_details" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "currency_exchange_settings_details"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "currency_exchange_settings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "currency_exchange_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "currency_exchange_settings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "currency_exchange_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "currency_exchange_settings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "currency_exchange_settings"."org_id")) WITH CHECK ((select auth.org_id() = "currency_exchange_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "currency_exchange_settings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "currency_exchange_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "item_variant_settings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "item_variant_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "item_variant_settings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "item_variant_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "item_variant_settings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "item_variant_settings"."org_id")) WITH CHECK ((select auth.org_id() = "item_variant_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "item_variant_settings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "item_variant_settings"."org_id"));