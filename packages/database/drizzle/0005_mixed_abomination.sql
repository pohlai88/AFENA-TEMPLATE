-- Step 0: pgcrypto for gen_random_uuid() branch safety
CREATE EXTENSION IF NOT EXISTS pgcrypto;
--> statement-breakpoint
-- K-08: updated_at trigger function in public schema
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text NOT NULL,
	"actor_user_id" text NOT NULL,
	"action_type" text NOT NULL,
	"action_family" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"request_id" text,
	"mutation_id" uuid NOT NULL,
	"batch_id" uuid,
	"version_before" integer,
	"version_after" integer NOT NULL,
	"channel" text DEFAULT 'web_ui' NOT NULL,
	"ip" text,
	"user_agent" text,
	"reason" text,
	"authority_snapshot" jsonb,
	"idempotency_key" text,
	"affected_count" integer DEFAULT 1,
	"value_delta" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"before" jsonb,
	"after" jsonb,
	"diff" jsonb,
	CONSTRAINT "audit_logs_mutation_id_unique" UNIQUE("mutation_id"),
	CONSTRAINT "audit_logs_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "contacts" (
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
	"email" text,
	"phone" text,
	"company" text,
	"notes" text,
	CONSTRAINT "contacts_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "contacts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "entity_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"version" integer NOT NULL,
	"parent_version" integer,
	"snapshot" jsonb NOT NULL,
	"diff" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text NOT NULL,
	CONSTRAINT "entity_versions_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "entity_versions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "mutation_batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"action_type" text NOT NULL,
	"entity_type" text NOT NULL,
	"total_count" integer NOT NULL,
	"success_count" integer DEFAULT 0,
	"failure_count" integer DEFAULT 0,
	"summary" jsonb,
	"request_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text NOT NULL,
	CONSTRAINT "mutation_batches_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "mutation_batches" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "audit_logs_org_created_idx" ON "audit_logs" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_entity_timeline_idx" ON "audit_logs" USING btree ("entity_type","entity_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_batch_idx" ON "audit_logs" USING btree ("batch_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_request_idx" ON "audit_logs" USING btree ("request_id");--> statement-breakpoint
CREATE UNIQUE INDEX "audit_logs_idempotency_idx" ON "audit_logs" USING btree ("org_id","action_type","idempotency_key") WHERE idempotency_key IS NOT NULL;--> statement-breakpoint
CREATE INDEX "contacts_org_id_idx" ON "contacts" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "contacts_org_created_idx" ON "contacts" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "entity_versions_unique_idx" ON "entity_versions" USING btree ("org_id","entity_type","entity_id","version");--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "audit_logs" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "audit_logs"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "audit_logs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "audit_logs"."org_id" AND ("audit_logs"."channel" = 'system' OR auth.user_id() = "audit_logs"."actor_user_id")));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "audit_logs" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "audit_logs"."org_id" AND ("audit_logs"."channel" = 'system' OR auth.user_id() = "audit_logs"."actor_user_id"))) WITH CHECK ((select auth.org_id() = "audit_logs"."org_id" AND ("audit_logs"."channel" = 'system' OR auth.user_id() = "audit_logs"."actor_user_id")));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "audit_logs" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "audit_logs"."org_id" AND ("audit_logs"."channel" = 'system' OR auth.user_id() = "audit_logs"."actor_user_id")));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "contacts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "contacts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "contacts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "contacts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "contacts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "contacts"."org_id")) WITH CHECK ((select auth.org_id() = "contacts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "contacts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "contacts"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "entity_versions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "entity_versions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "entity_versions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "entity_versions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "entity_versions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "entity_versions"."org_id")) WITH CHECK ((select auth.org_id() = "entity_versions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "entity_versions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "entity_versions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "mutation_batches" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "mutation_batches"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "mutation_batches" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "mutation_batches"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "mutation_batches" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "mutation_batches"."org_id")) WITH CHECK ((select auth.org_id() = "mutation_batches"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "mutation_batches" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "mutation_batches"."org_id"));
--> statement-breakpoint
-- K-08: updated_at trigger on contacts
CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();