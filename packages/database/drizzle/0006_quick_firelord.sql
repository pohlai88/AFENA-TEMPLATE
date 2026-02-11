CREATE TABLE "advisories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"type" text NOT NULL,
	"severity" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"entity_type" text,
	"entity_id" uuid,
	"summary" text NOT NULL,
	"explanation" text NOT NULL,
	"explain_version" text DEFAULT 'v1' NOT NULL,
	"method" text NOT NULL,
	"params" jsonb NOT NULL,
	"score" double precision,
	"recommended_actions" jsonb,
	"fingerprint" text NOT NULL,
	"run_id" uuid,
	"window_start" timestamp with time zone,
	"window_end" timestamp with time zone,
	"channel" text DEFAULT 'system' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT COALESCE(auth.user_id(), 'system') NOT NULL,
	CONSTRAINT "advisories_type_taxonomy" CHECK (type ~ '^(anomaly|forecast|rule).[a-z0-9_]+.[a-z0-9_]+$'),
	CONSTRAINT "advisories_severity_enum" CHECK (severity IN ('info','warn','critical')),
	CONSTRAINT "advisories_status_enum" CHECK (status IN ('open','ack','dismissed')),
	CONSTRAINT "advisories_method_enum" CHECK (method IN ('EWMA','CUSUM','MAD','SES','HOLT','HOLT_WINTERS','RULE')),
	CONSTRAINT "advisories_fingerprint_len" CHECK (length(fingerprint) = 64),
	CONSTRAINT "advisories_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "advisories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "advisory_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"advisory_id" uuid NOT NULL,
	"evidence_type" text NOT NULL,
	"source" text NOT NULL,
	"payload" jsonb NOT NULL,
	"hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "advisory_evidence_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "advisory_evidence_type_enum" CHECK (evidence_type IN ('query','snapshot','metric_series','calculation'))
);
--> statement-breakpoint
ALTER TABLE "advisory_evidence" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "advisory_evidence" ADD CONSTRAINT "advisory_evidence_advisory_id_advisories_id_fk" FOREIGN KEY ("advisory_id") REFERENCES "public"."advisories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "advisories_org_status_created_idx" ON "advisories" USING btree ("org_id","status","created_at");--> statement-breakpoint
CREATE INDEX "advisories_org_type_created_idx" ON "advisories" USING btree ("org_id","type","created_at");--> statement-breakpoint
CREATE INDEX "advisories_entity_idx" ON "advisories" USING btree ("org_id","entity_type","entity_id","created_at");--> statement-breakpoint
CREATE INDEX "advisories_org_created_idx" ON "advisories" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "advisories_fingerprint_dedupe_idx" ON "advisories" USING btree ("org_id","fingerprint") WHERE status IN ('open','ack');--> statement-breakpoint
CREATE INDEX "advisory_evidence_advisory_idx" ON "advisory_evidence" USING btree ("advisory_id");--> statement-breakpoint
CREATE INDEX "advisory_evidence_org_created_idx" ON "advisory_evidence" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "advisories" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "advisories"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "advisories" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "advisories"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "advisories" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "advisories"."org_id")) WITH CHECK ((select auth.org_id() = "advisories"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "advisories" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "advisories"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "advisory_evidence" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "advisory_evidence"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "advisory_evidence" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "advisory_evidence"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "advisory_evidence" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "advisory_evidence"."org_id")) WITH CHECK ((select auth.org_id() = "advisory_evidence"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "advisory_evidence" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "advisory_evidence"."org_id"));--> statement-breakpoint
-- INVARIANT-P02: advisory_evidence is append-only (no UPDATE, no DELETE)
DROP POLICY IF EXISTS "crud-authenticated-policy-update" ON "advisory_evidence";--> statement-breakpoint
DROP POLICY IF EXISTS "crud-authenticated-policy-delete" ON "advisory_evidence";--> statement-breakpoint
REVOKE UPDATE, DELETE ON "advisory_evidence" FROM "authenticated";--> statement-breakpoint
-- INVARIANT-P01: advisories should not be deleted (status can be updated to 'dismissed')
DROP POLICY IF EXISTS "crud-authenticated-policy-delete" ON "advisories";