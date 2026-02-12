CREATE TABLE "communications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"type" text NOT NULL,
	"subject" text,
	"body" text,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "comms_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "comms_entity_type_not_empty" CHECK (entity_type <> ''),
	CONSTRAINT "comms_type_valid" CHECK (type IN ('email', 'comment', 'note', 'call'))
);
--> statement-breakpoint
ALTER TABLE "communications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "entity_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"file_id" uuid NOT NULL,
	"label" text,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "entity_attach_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "entity_attach_entity_type_not_empty" CHECK (entity_type <> '')
);
--> statement-breakpoint
ALTER TABLE "entity_attachments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "comms_org_entity_idx" ON "communications" USING btree ("org_id","entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "comms_org_created_idx" ON "communications" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "entity_attach_org_entity_idx" ON "entity_attachments" USING btree ("org_id","entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "entity_attach_org_file_idx" ON "entity_attachments" USING btree ("org_id","file_id");--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "communications" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "communications"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "communications" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "communications"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "communications" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "communications"."org_id")) WITH CHECK ((select auth.org_id() = "communications"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "communications" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "communications"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "entity_attachments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "entity_attachments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "entity_attachments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "entity_attachments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "entity_attachments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "entity_attachments"."org_id")) WITH CHECK ((select auth.org_id() = "entity_attachments"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "entity_attachments" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "entity_attachments"."org_id"));