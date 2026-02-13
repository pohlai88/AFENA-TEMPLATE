CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"label" text NOT NULL,
	"key_hash" text NOT NULL,
	"key_prefix" text NOT NULL,
	"scopes" text[] DEFAULT '{}'::text[] NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"last_used_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	CONSTRAINT "api_keys_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "api_keys_label_not_empty" CHECK (label <> '')
);
--> statement-breakpoint
ALTER TABLE "api_keys" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "api_keys_org_idx" ON "api_keys" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "api_keys_hash_idx" ON "api_keys" USING btree ("key_hash");--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "api_keys" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "api_keys"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "api_keys" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "api_keys"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "api_keys" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "api_keys"."org_id")) WITH CHECK ((select auth.org_id() = "api_keys"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "api_keys" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "api_keys"."org_id"));