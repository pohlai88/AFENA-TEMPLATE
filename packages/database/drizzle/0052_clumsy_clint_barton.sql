CREATE TABLE IF NOT EXISTS "search_documents" (
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"subtitle" text DEFAULT '',
	"search_vector" "tsvector" DEFAULT ''::tsvector NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "search_documents_org_id_entity_type_entity_id_pk" PRIMARY KEY("org_id","entity_type","entity_id"),
	CONSTRAINT "search_docs_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "search_documents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "search_outbox" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"action" text DEFAULT 'upsert' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 5 NOT NULL,
	"next_retry_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"error" text,
	CONSTRAINT "search_outbox_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "search_outbox_status_valid" CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'dead_letter')),
	CONSTRAINT "search_outbox_action_valid" CHECK (action IN ('upsert', 'delete'))
);
--> statement-breakpoint
ALTER TABLE "search_outbox" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "search_docs_fts_gin" ON "search_documents" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "search_docs_org_type_idx" ON "search_documents" USING btree ("org_id","entity_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "search_outbox_poll_idx" ON "search_outbox" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "search_outbox_org_idx" ON "search_outbox" USING btree ("org_id");--> statement-breakpoint
ALTER TABLE "contacts" DROP COLUMN IF EXISTS "company_id";--> statement-breakpoint
ALTER TABLE "contacts" DROP COLUMN IF EXISTS "doc_status";--> statement-breakpoint
ALTER TABLE "contacts" DROP COLUMN IF EXISTS "submitted_at";--> statement-breakpoint
ALTER TABLE "contacts" DROP COLUMN IF EXISTS "submitted_by";--> statement-breakpoint
ALTER TABLE "contacts" DROP COLUMN IF EXISTS "cancelled_at";--> statement-breakpoint
ALTER TABLE "contacts" DROP COLUMN IF EXISTS "cancelled_by";--> statement-breakpoint
ALTER TABLE "contacts" DROP COLUMN IF EXISTS "amended_from_id";--> statement-breakpoint
ALTER TABLE "contacts" DROP COLUMN IF EXISTS "external_source";--> statement-breakpoint
ALTER TABLE "contacts" DROP COLUMN IF EXISTS "external_id";--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "search_documents" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "search_documents"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "search_documents" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "search_documents"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "search_documents" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "search_documents"."org_id")) WITH CHECK ((select auth.org_id() = "search_documents"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "search_documents" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "search_documents"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "search_outbox" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "search_outbox"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "search_outbox" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "search_outbox"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "search_outbox" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "search_outbox"."org_id")) WITH CHECK ((select auth.org_id() = "search_outbox"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "search_outbox" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "search_outbox"."org_id"));