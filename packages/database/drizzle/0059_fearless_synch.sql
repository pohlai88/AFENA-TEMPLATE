CREATE TABLE "delivery_settings" (
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
	"stop_delivery_after_days" text,
	"dispatch_address_template" text,
	CONSTRAINT "delivery_settings_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "delivery_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "projects_settings" (
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
	"ignore_user_time_overlap" boolean DEFAULT false,
	"ignore_employee_time_overlap" boolean DEFAULT false,
	CONSTRAINT "projects_settings_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "projects_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pos_settings" (
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
	"use_pos_in_offline_mode" boolean DEFAULT false,
	"unconditionally_apply_pricing_rule" boolean DEFAULT false,
	"allow_delete_sales_invoice" boolean DEFAULT false,
	"allow_user_to_edit_rate" boolean DEFAULT false,
	"allow_print_before_pay" boolean DEFAULT false,
	CONSTRAINT "pos_settings_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "pos_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "delivery_settings_org_created_id_idx" ON "delivery_settings" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "projects_settings_org_created_id_idx" ON "projects_settings" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "pos_settings_org_created_id_idx" ON "pos_settings" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "delivery_settings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "delivery_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "delivery_settings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "delivery_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "delivery_settings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "delivery_settings"."org_id")) WITH CHECK ((select auth.org_id() = "delivery_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "delivery_settings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "delivery_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "projects_settings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "projects_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "projects_settings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "projects_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "projects_settings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "projects_settings"."org_id")) WITH CHECK ((select auth.org_id() = "projects_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "projects_settings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "projects_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "pos_settings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "pos_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "pos_settings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "pos_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "pos_settings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "pos_settings"."org_id")) WITH CHECK ((select auth.org_id() = "pos_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "pos_settings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "pos_settings"."org_id"));