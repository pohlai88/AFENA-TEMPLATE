CREATE TABLE "r2_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text DEFAULT (auth.user_id()) NOT NULL,
	"object_key" text NOT NULL,
	"file_url" text NOT NULL,
	"file_name" text,
	"content_type" text,
	"size_bytes" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "r2_files_object_key_unique" UNIQUE("object_key")
);
--> statement-breakpoint
ALTER TABLE "r2_files" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "r2_files" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "r2_files"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "r2_files" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "r2_files"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "r2_files" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "r2_files"."user_id")) WITH CHECK ((select auth.user_id() = "r2_files"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "r2_files" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "r2_files"."user_id"));