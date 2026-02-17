CREATE TABLE "branches" (
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
	"branch" text NOT NULL,
	CONSTRAINT "branches_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "branches_org_name_unique" UNIQUE("org_id","branch"),
	CONSTRAINT "branches_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "branches" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "branches_org_created_id_idx" ON "branches" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "branches" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "branches"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "branches" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "branches"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "branches" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "branches"."org_id")) WITH CHECK ((select auth.org_id() = "branches"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "branches" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "branches"."org_id"));