CREATE TABLE "tasks" (
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
	"subject" text NOT NULL,
	"project" uuid,
	"issue" uuid,
	"type_col" uuid,
	"color" text,
	"is_group" boolean DEFAULT false NOT NULL,
	"is_template" boolean DEFAULT false NOT NULL,
	"priority" text,
	"status_col" text,
	"exp_start_date" date,
	"exp_end_date" date,
	"expected_time" integer,
	"progress" text,
	"duration" integer,
	"description" text,
	"parent_task" uuid,
	CONSTRAINT "tasks_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "tasks_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "timesheets" (
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
	"title" text,
	"naming_series" text NOT NULL,
	"company" uuid,
	"customer" uuid,
	"currency" uuid,
	"exchange_rate" numeric(18, 6),
	"sales_invoice" uuid,
	"employee" uuid,
	"employee_name" text,
	"user_col" uuid,
	"start_date" date,
	"end_date" date,
	"total_hours" numeric(18, 2),
	"total_billable_hours" numeric(18, 2),
	"total_billed_hours" numeric(18, 2),
	"total_costing_amount" numeric(18, 2),
	"total_billable_amount" numeric(18, 2),
	"total_billed_amount" numeric(18, 2),
	"per_billed" numeric(18, 2),
	"status_col" text,
	CONSTRAINT "timesheets_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "timesheets_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "timesheets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "timesheet_details" (
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
	"activity_type" uuid,
	"from_time" timestamp with time zone,
	"description" text,
	"expected_hours" numeric(18, 2),
	"to_time" timestamp with time zone,
	"hours" numeric(18, 2),
	"completed" boolean DEFAULT false NOT NULL,
	"project" uuid,
	"task" uuid,
	"billing_hours" numeric(18, 2),
	"costing_hours" numeric(18, 2),
	"billing_amount" numeric(18, 2),
	"costing_amount" numeric(18, 2),
	"billing_rate" numeric(18, 2),
	"costing_rate" numeric(18, 2),
	CONSTRAINT "timesheet_details_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "timesheet_details_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "timesheet_details" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "tasks_org_created_id_idx" ON "tasks" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "tasks_org_project_idx" ON "tasks" USING btree ("org_id","project");--> statement-breakpoint
CREATE INDEX "tasks_org_status_idx" ON "tasks" USING btree ("org_id","status_col");--> statement-breakpoint
CREATE INDEX "tasks_org_parent_idx" ON "tasks" USING btree ("org_id","parent_task");--> statement-breakpoint
CREATE INDEX "timesheets_org_created_id_idx" ON "timesheets" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "timesheets_org_employee_idx" ON "timesheets" USING btree ("org_id","employee");--> statement-breakpoint
CREATE INDEX "timesheets_org_status_idx" ON "timesheets" USING btree ("org_id","status_col");--> statement-breakpoint
CREATE INDEX "timesheets_org_start_date_idx" ON "timesheets" USING btree ("org_id","start_date");--> statement-breakpoint
CREATE INDEX "timesheet_details_org_created_id_idx" ON "timesheet_details" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "timesheet_details_org_project_idx" ON "timesheet_details" USING btree ("org_id","project");--> statement-breakpoint
CREATE INDEX "timesheet_details_org_task_idx" ON "timesheet_details" USING btree ("org_id","task");--> statement-breakpoint
CREATE INDEX "timesheet_details_org_activity_idx" ON "timesheet_details" USING btree ("org_id","activity_type");--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "tasks" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "tasks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "tasks" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "tasks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "tasks" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "tasks"."org_id")) WITH CHECK ((select auth.org_id() = "tasks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "tasks" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "tasks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "timesheets" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "timesheets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "timesheets" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "timesheets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "timesheets" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "timesheets"."org_id")) WITH CHECK ((select auth.org_id() = "timesheets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "timesheets" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "timesheets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "timesheet_details" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "timesheet_details"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "timesheet_details" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "timesheet_details"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "timesheet_details" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "timesheet_details"."org_id")) WITH CHECK ((select auth.org_id() = "timesheet_details"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "timesheet_details" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "timesheet_details"."org_id"));