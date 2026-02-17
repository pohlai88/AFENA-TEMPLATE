CREATE TABLE "project_types" (
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
	"name" text NOT NULL,
	"description" text,
	CONSTRAINT "project_types_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "project_types_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "project_types" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "project_templates" (
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
	"name" text NOT NULL,
	"description" text,
	CONSTRAINT "project_templates_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "project_templates_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "project_templates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "project_template_tasks" (
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
	"task_name" text NOT NULL,
	"description" text,
	"duration" integer,
	CONSTRAINT "project_template_tasks_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "project_template_tasks_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "project_template_tasks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "project_types_org_created_id_idx" ON "project_types" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "project_templates_org_created_id_idx" ON "project_templates" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "project_template_tasks_org_created_id_idx" ON "project_template_tasks" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "project_types" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "project_types"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "project_types" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "project_types"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "project_types" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "project_types"."org_id")) WITH CHECK ((select auth.org_id() = "project_types"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "project_types" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "project_types"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "project_templates" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "project_templates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "project_templates" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "project_templates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "project_templates" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "project_templates"."org_id")) WITH CHECK ((select auth.org_id() = "project_templates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "project_templates" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "project_templates"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "project_template_tasks" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "project_template_tasks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "project_template_tasks" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "project_template_tasks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "project_template_tasks" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "project_template_tasks"."org_id")) WITH CHECK ((select auth.org_id() = "project_template_tasks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "project_template_tasks" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "project_template_tasks"."org_id"));