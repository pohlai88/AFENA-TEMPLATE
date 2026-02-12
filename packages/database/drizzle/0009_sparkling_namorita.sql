CREATE TABLE "workflow_executions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text NOT NULL,
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
	CONSTRAINT "workflow_executions_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "workflow_executions_timing_check" CHECK (timing in ('before', 'after'))
);
--> statement-breakpoint
ALTER TABLE "workflow_executions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "actor_name" text;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "owner_id" text;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "geo_country" text;--> statement-breakpoint
ALTER TABLE "entity_versions" ADD COLUMN "is_fork" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "entity_versions" ADD COLUMN "fork_reason" text;--> statement-breakpoint
CREATE INDEX "workflow_executions_org_created_idx" ON "workflow_executions" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "workflow_executions_org_rule_created_idx" ON "workflow_executions" USING btree ("org_id","rule_id","created_at");--> statement-breakpoint
CREATE INDEX "workflow_executions_org_request_idx" ON "workflow_executions" USING btree ("org_id","request_id");--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "workflow_executions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "workflow_executions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "workflow_executions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "workflow_executions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "workflow_executions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "workflow_executions"."org_id")) WITH CHECK ((select auth.org_id() = "workflow_executions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "workflow_executions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "workflow_executions"."org_id"));--> statement-breakpoint
-- Append-only enforcement (matches advisory_evidence pattern in 0006)
DROP POLICY IF EXISTS "crud-authenticated-policy-update" ON "workflow_executions";--> statement-breakpoint
DROP POLICY IF EXISTS "crud-authenticated-policy-delete" ON "workflow_executions";--> statement-breakpoint
REVOKE UPDATE, DELETE ON "workflow_executions" FROM "authenticated";