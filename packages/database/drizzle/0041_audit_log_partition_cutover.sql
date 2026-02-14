-- 0041_audit_log_partition_cutover.sql
-- Audit log partitioning cutover
--
-- Strategy: Range partition by created_at (monthly)
-- 1. Create new partitioned table audit_logs_partitioned
-- 2. Create initial partitions (current month ± buffer)
-- 3. Copy existing data
-- 4. Swap tables atomically (rename)
-- 5. Re-apply RLS, indexes, grants
--
-- IMPORTANT: This migration should be run during a maintenance window.
-- The RENAME step requires an exclusive lock on audit_logs.
-- Estimated downtime: seconds (for the rename), data copy is the slow part.

-- ============================================================
-- 1. Create partitioned table matching actual audit_logs schema
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs_partitioned (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL CHECK (org_id <> ''),
  actor_user_id TEXT NOT NULL,
  actor_name TEXT,
  owner_id TEXT,
  geo_country TEXT,
  action_type TEXT NOT NULL,
  action_family TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  request_id TEXT,
  mutation_id UUID NOT NULL,
  batch_id UUID,
  version_before INTEGER,
  version_after INTEGER NOT NULL,
  channel TEXT NOT NULL DEFAULT 'web_ui',
  ip TEXT,
  user_agent TEXT,
  reason TEXT,
  authority_snapshot JSONB,
  idempotency_key TEXT,
  affected_count INTEGER DEFAULT 1,
  value_delta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  "before" JSONB,
  "after" JSONB,
  diff JSONB,
  PRIMARY KEY (created_at, id)
) PARTITION BY RANGE (created_at);
--> statement-breakpoint

-- ============================================================
-- 2. Create monthly partitions: 6 months back + 12 months ahead
-- ============================================================
DO $$
DECLARE
  start_date DATE;
  end_date DATE;
  partition_name TEXT;
  m INTEGER;
BEGIN
  FOR m IN -6..12 LOOP
    start_date := date_trunc('month', CURRENT_DATE + (m || ' months')::interval)::date;
    end_date := (start_date + interval '1 month')::date;
    partition_name := 'audit_logs_p_' || to_char(start_date, 'YYYY_MM');

    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS %I PARTITION OF audit_logs_partitioned FOR VALUES FROM (%L) TO (%L)',
      partition_name, start_date, end_date
    );
  END LOOP;
END;
$$;
--> statement-breakpoint

-- ============================================================
-- 3. Copy existing data from audit_logs → audit_logs_partitioned
-- ============================================================
INSERT INTO audit_logs_partitioned (
  id, org_id, actor_user_id, actor_name, owner_id, geo_country,
  action_type, action_family, entity_type, entity_id,
  request_id, mutation_id, batch_id,
  version_before, version_after,
  channel, ip, user_agent, reason,
  authority_snapshot, idempotency_key,
  affected_count, value_delta,
  created_at, "before", "after", diff
)
SELECT
  id, org_id, actor_user_id, actor_name, owner_id, geo_country,
  action_type, action_family, entity_type, entity_id,
  request_id, mutation_id, batch_id,
  version_before, version_after,
  channel, ip, user_agent, reason,
  authority_snapshot, idempotency_key,
  affected_count, value_delta,
  created_at, "before", "after", diff
FROM audit_logs;
--> statement-breakpoint

-- ============================================================
-- 4. Atomic swap
-- ============================================================
ALTER TABLE audit_logs RENAME TO audit_logs_old;
--> statement-breakpoint
ALTER TABLE audit_logs_partitioned RENAME TO audit_logs;
--> statement-breakpoint

-- ============================================================
-- 5. Re-apply indexes (matching original schema indexes)
-- ============================================================
CREATE INDEX IF NOT EXISTS audit_logs_part_org_created_idx
  ON audit_logs (org_id, created_at);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS audit_logs_part_entity_timeline_idx
  ON audit_logs (entity_type, entity_id, created_at);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS audit_logs_part_batch_idx
  ON audit_logs (batch_id, created_at);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS audit_logs_part_request_idx
  ON audit_logs (request_id);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS audit_logs_part_idempotency_idx
  ON audit_logs (org_id, action_type, idempotency_key, created_at)
  WHERE idempotency_key IS NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS audit_logs_part_mutation_idx
  ON audit_logs (mutation_id, created_at);
--> statement-breakpoint

-- BRIN index on created_at (excellent for time-range scans on partitioned data)
CREATE INDEX IF NOT EXISTS audit_logs_part_created_brin
  ON audit_logs USING BRIN (created_at);
--> statement-breakpoint

-- ============================================================
-- 6. Re-apply RLS
-- ============================================================
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE audit_logs FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY audit_logs_crud_policy ON audit_logs
  FOR ALL TO authenticated
  USING (org_id = (SELECT auth.org_id()))
  WITH CHECK (
    org_id = (SELECT auth.org_id())
    AND (channel = 'system' OR (SELECT auth.user_id()) = actor_user_id)
  );
--> statement-breakpoint

-- ============================================================
-- 7. Re-apply append-only protection
-- ============================================================
REVOKE UPDATE, DELETE ON audit_logs FROM authenticated;
--> statement-breakpoint

-- ============================================================
-- 8. Update create_audit_partition() to target new table
-- ============================================================
CREATE OR REPLACE FUNCTION public.create_audit_partition(
  p_year INTEGER,
  p_month INTEGER
)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  partition_name TEXT;
  start_date DATE;
  end_date DATE;
BEGIN
  partition_name := format('audit_logs_p_%s_%s',
    p_year::text,
    lpad(p_month::text, 2, '0'));
  start_date := make_date(p_year, p_month, 1);
  end_date := start_date + interval '1 month';

  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS %I PARTITION OF audit_logs FOR VALUES FROM (%L) TO (%L)',
    partition_name, start_date, end_date
  );
END;
$$;
--> statement-breakpoint

COMMENT ON FUNCTION public.create_audit_partition(INTEGER, INTEGER) IS
  'Creates a monthly partition for the partitioned audit_logs table. Call from cron monthly.';
--> statement-breakpoint

-- ============================================================
-- 9. Cleanup note
-- ============================================================
-- After verifying the partitioned table works correctly:
--   DROP TABLE audit_logs_old;
-- Do NOT drop immediately — keep as backup for at least 1 week.
