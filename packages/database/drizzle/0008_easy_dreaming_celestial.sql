CREATE TABLE "workflow_rules" (
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
	"description" text,
	"timing" text NOT NULL,
	"entity_types" text[] DEFAULT '{}'::text[] NOT NULL,
	"verbs" text[] DEFAULT '{}'::text[] NOT NULL,
	"priority" integer DEFAULT 100 NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"condition_json" jsonb NOT NULL,
	"action_json" jsonb NOT NULL,
	CONSTRAINT "workflow_rules_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "workflow_rules_timing_check" CHECK (timing in ('before', 'after'))
);
--> statement-breakpoint
ALTER TABLE "workflow_rules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "workflow_rules_org_id_idx" ON "workflow_rules" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "workflow_rules_org_enabled_idx" ON "workflow_rules" USING btree ("org_id","enabled");--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "workflow_rules" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "workflow_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "workflow_rules" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "workflow_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "workflow_rules" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "workflow_rules"."org_id")) WITH CHECK ((select auth.org_id() = "workflow_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "workflow_rules" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "workflow_rules"."org_id"));