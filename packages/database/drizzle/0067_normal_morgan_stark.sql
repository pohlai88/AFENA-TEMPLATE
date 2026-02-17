CREATE TABLE "departments" (
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
	"department_name" text NOT NULL,
	"parent_department" uuid,
	"company" uuid,
	"is_group" boolean DEFAULT false,
	"disabled" boolean DEFAULT false,
	CONSTRAINT "departments_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "departments_org_name_unique" UNIQUE("org_id","department_name"),
	CONSTRAINT "departments_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "departments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_parent_department_departments_id_fk" FOREIGN KEY ("parent_department") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "departments_org_created_id_idx" ON "departments" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "departments_org_parent_idx" ON "departments" USING btree ("org_id","parent_department");--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "departments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "departments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "departments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "departments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "departments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "departments"."org_id")) WITH CHECK ((select auth.org_id() = "departments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "departments" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "departments"."org_id"));