-- DEV-1: Cursor index optimization — add id for (created_at, id) tie-breaker
-- See .architecture/tech-debt-cursor-indexes.md
DROP INDEX IF EXISTS "contacts_org_created_idx";--> statement-breakpoint
CREATE INDEX "contacts_org_created_id_idx" ON "contacts" USING btree ("org_id","created_at" desc,"id" desc);