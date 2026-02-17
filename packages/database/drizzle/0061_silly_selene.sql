CREATE TABLE "project_users" (
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
	"user_col" uuid NOT NULL,
	"email" text,
	"image" text,
	"full_name" text,
	"welcome_email_sent" boolean DEFAULT false NOT NULL,
	"view_attachments" boolean DEFAULT false NOT NULL,
	CONSTRAINT "project_users_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "project_users_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "project_users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "project_updates" (
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
	"naming_series" text,
	"project" uuid NOT NULL,
	"sent" boolean DEFAULT false NOT NULL,
	"date" date,
	"time_col" text,
	"progress" text,
	"progress_percent" text,
	CONSTRAINT "project_updates_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "project_updates_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "project_updates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "project_users_org_created_id_idx" ON "project_users" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "project_users_org_user_idx" ON "project_users" USING btree ("org_id","user_col");--> statement-breakpoint
CREATE INDEX "project_updates_org_created_id_idx" ON "project_updates" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "project_updates_org_project_idx" ON "project_updates" USING btree ("org_id","project");--> statement-breakpoint
CREATE INDEX "project_updates_org_date_idx" ON "project_updates" USING btree ("org_id","date");--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "project_users" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "project_users"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "project_users" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "project_users"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "project_users" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "project_users"."org_id")) WITH CHECK ((select auth.org_id() = "project_users"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "project_users" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "project_users"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "project_updates" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "project_updates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "project_updates" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "project_updates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "project_updates" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "project_updates"."org_id")) WITH CHECK ((select auth.org_id() = "project_updates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "project_updates" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "project_updates"."org_id"));