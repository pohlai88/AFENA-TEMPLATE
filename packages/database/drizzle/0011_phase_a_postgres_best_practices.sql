-- 0011_phase_a_postgres_best_practices.sql
-- Phase A Supplement: BRIN indexes, covering indexes, partial indexes for soft-delete
-- These are Postgres best practices that Drizzle schema builder cannot express.

-- ============================================================
-- BRIN indexes for time-series / append-only tables
-- ~1000x smaller than B-tree for naturally time-ordered data
-- ============================================================

CREATE INDEX IF NOT EXISTS audit_logs_created_at_brin
  ON audit_logs USING BRIN (created_at);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS workflow_executions_created_at_brin
  ON workflow_executions USING BRIN (created_at);
--> statement-breakpoint

-- ============================================================
-- Covering indexes (INCLUDE) for index-only scans on hot paths
-- ============================================================

-- custom_field_values: detail page resolves custom values without heap access
CREATE INDEX IF NOT EXISTS custom_field_values_covering_idx
  ON custom_field_values (org_id, entity_type, entity_id)
  INCLUDE (field_id, value_text, value_int, value_numeric, value_bool);
--> statement-breakpoint

-- meta_aliases: label resolution without heap access
CREATE INDEX IF NOT EXISTS meta_aliases_covering_idx
  ON meta_aliases (org_id, alias_set_id, target_key)
  INCLUDE (alias, alias_slug)
  WHERE effective_to IS NULL AND is_deleted = false;
--> statement-breakpoint

-- meta_alias_resolution_rules: resolution lookup without heap access
CREATE INDEX IF NOT EXISTS meta_alias_resolution_rules_covering_idx
  ON meta_alias_resolution_rules (org_id, scope_type, scope_key)
  INCLUDE (alias_set_id, priority)
  WHERE is_active = true;
--> statement-breakpoint

-- ============================================================
-- Partial indexes for soft-deleted rows (only index active records)
-- ============================================================

-- companies: active records only
CREATE INDEX IF NOT EXISTS companies_active_idx
  ON companies (org_id, name)
  WHERE is_deleted = false;
--> statement-breakpoint

-- sites: active records only
CREATE INDEX IF NOT EXISTS sites_active_idx
  ON sites (org_id, code)
  WHERE is_deleted = false;
--> statement-breakpoint

-- contacts: active records only
CREATE INDEX IF NOT EXISTS contacts_active_idx
  ON contacts (org_id, name)
  WHERE is_deleted = false;
--> statement-breakpoint

-- custom_field_sync_queue: pending items only (partial on completed_at)
CREATE INDEX IF NOT EXISTS custom_field_sync_queue_pending_idx
  ON custom_field_sync_queue (next_retry_at)
  WHERE completed_at IS NULL;
