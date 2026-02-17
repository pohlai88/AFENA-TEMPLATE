CREATE TABLE "activity_costs" (
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
	"activity_type" uuid NOT NULL,
	"employee" uuid,
	"employee_name" uuid,
	"costing_rate" numeric(18, 2),
	"billing_rate" numeric(18, 2),
	CONSTRAINT "activity_costs_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "activity_costs_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "activity_costs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "activity_types" (
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
	"activity_type" text NOT NULL,
	"costing_rate" numeric(18, 2),
	"billing_rate" numeric(18, 2),
	"disabled" boolean DEFAULT false NOT NULL,
	CONSTRAINT "activity_types_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "activity_types_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "activity_types" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "dependent_tasks" (
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
	"task" uuid,
	"dependent_task" uuid,
	CONSTRAINT "dependent_tasks_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "dependent_tasks_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "dependent_tasks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "psoa_projects" (
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
	"project_name" uuid,
	"cost_center" uuid,
	CONSTRAINT "psoa_projects_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "psoa_projects_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "psoa_projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "activity_costs_org_created_id_idx" ON "activity_costs" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "activity_costs_org_activity_idx" ON "activity_costs" USING btree ("org_id","activity_type");--> statement-breakpoint
CREATE INDEX "activity_costs_org_employee_idx" ON "activity_costs" USING btree ("org_id","employee");--> statement-breakpoint
CREATE INDEX "activity_types_org_created_id_idx" ON "activity_types" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "activity_types_org_name_idx" ON "activity_types" USING btree ("org_id","activity_type");--> statement-breakpoint
CREATE INDEX "dependent_tasks_org_created_id_idx" ON "dependent_tasks" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "dependent_tasks_org_task_idx" ON "dependent_tasks" USING btree ("org_id","task");--> statement-breakpoint
CREATE INDEX "dependent_tasks_org_dependent_idx" ON "dependent_tasks" USING btree ("org_id","dependent_task");--> statement-breakpoint
CREATE INDEX "psoa_projects_org_created_id_idx" ON "psoa_projects" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "psoa_projects_org_project_idx" ON "psoa_projects" USING btree ("org_id","project_name");--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "activity_costs" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "activity_costs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "activity_costs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "activity_costs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "activity_costs" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "activity_costs"."org_id")) WITH CHECK ((select auth.org_id() = "activity_costs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "activity_costs" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "activity_costs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "activity_types" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "activity_types"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "activity_types" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "activity_types"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "activity_types" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "activity_types"."org_id")) WITH CHECK ((select auth.org_id() = "activity_types"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "activity_types" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "activity_types"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "dependent_tasks" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "dependent_tasks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "dependent_tasks" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "dependent_tasks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "dependent_tasks" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "dependent_tasks"."org_id")) WITH CHECK ((select auth.org_id() = "dependent_tasks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "dependent_tasks" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "dependent_tasks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "psoa_projects" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "psoa_projects"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "psoa_projects" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "psoa_projects"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "psoa_projects" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "psoa_projects"."org_id")) WITH CHECK ((select auth.org_id() = "psoa_projects"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "psoa_projects" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "psoa_projects"."org_id"));