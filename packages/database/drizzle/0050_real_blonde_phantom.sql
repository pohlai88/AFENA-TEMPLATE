-- GAP-DB-008: doc_version (idempotent; may already exist from 0044)
ALTER TABLE "doc_postings" ADD COLUMN IF NOT EXISTS "doc_version" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "doc_postings_org_doc_version_uniq" ON "doc_postings" USING btree ("org_id","doc_type","doc_id","doc_version");