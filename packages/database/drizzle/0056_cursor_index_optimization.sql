-- DEV-1 expansion: Cursor index optimization — add id for (created_at, id) tie-breaker
-- See .architecture/tech-debt-cursor-indexes.md
-- Tables: audit_logs, communications, companies, advisories, advisory_evidence, sites, workflow_executions

DROP INDEX IF EXISTS "audit_logs_org_created_idx";--> statement-breakpoint
CREATE INDEX "audit_logs_org_created_id_idx" ON "audit_logs" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint

DROP INDEX IF EXISTS "comms_org_created_idx";--> statement-breakpoint
CREATE INDEX "comms_org_created_id_idx" ON "communications" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint

DROP INDEX IF EXISTS "companies_org_created_idx";--> statement-breakpoint
CREATE INDEX "companies_org_created_id_idx" ON "companies" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint

DROP INDEX IF EXISTS "advisories_org_created_idx";--> statement-breakpoint
CREATE INDEX "advisories_org_created_id_idx" ON "advisories" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint

DROP INDEX IF EXISTS "advisory_evidence_org_created_idx";--> statement-breakpoint
CREATE INDEX "advisory_evidence_org_created_id_idx" ON "advisory_evidence" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint

DROP INDEX IF EXISTS "sites_org_created_idx";--> statement-breakpoint
CREATE INDEX "sites_org_created_id_idx" ON "sites" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint

DROP INDEX IF EXISTS "workflow_executions_org_created_idx";--> statement-breakpoint
CREATE INDEX "workflow_executions_org_created_id_idx" ON "workflow_executions" USING btree ("org_id","created_at" desc,"id" desc);
