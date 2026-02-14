-- ============================================================
-- Migration 0042: Workflow V2 Trigger Fixes
--
-- Closes PRD gaps M1 + M2:
-- M1: restrict_step_execution_updates() — immutable identity columns
-- M2: restrict_status_regression() on step_executions + both outbox tables
-- ============================================================

-- ============================================================
-- 1. restrict_step_execution_updates() — M1
--    Identity columns are immutable after INSERT (PRD §755).
--    Only status/output/evidence columns may be updated.
-- ============================================================
CREATE OR REPLACE FUNCTION public.restrict_step_execution_updates()
RETURNS trigger AS $$
BEGIN
  IF NEW.instance_id IS DISTINCT FROM OLD.instance_id
    OR NEW.node_id IS DISTINCT FROM OLD.node_id
    OR NEW.token_id IS DISTINCT FROM OLD.token_id
    OR NEW.entity_version IS DISTINCT FROM OLD.entity_version
    OR NEW.idempotency_key IS DISTINCT FROM OLD.idempotency_key
    OR NEW.actor_user_id IS DISTINCT FROM OLD.actor_user_id
    OR NEW.snapshot_version_id IS DISTINCT FROM OLD.snapshot_version_id
  THEN
    RAISE EXCEPTION 'Cannot modify identity columns on workflow_step_executions: id=%',
      CASE WHEN OLD.id IS NOT NULL THEN OLD.id::text ELSE 'unknown' END
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

CREATE TRIGGER trg_restrict_step_exec_identity
  BEFORE UPDATE ON workflow_step_executions
  FOR EACH ROW
  EXECUTE FUNCTION public.restrict_step_execution_updates();
--> statement-breakpoint

-- ============================================================
-- 2. restrict_status_regression() on workflow_step_executions — M2
--    Terminal states: completed, failed, skipped, cancelled
--    Uses the existing restrict_status_regression() from 0040.
-- ============================================================
CREATE TRIGGER trg_restrict_status_wf_step_executions
  BEFORE UPDATE OF status ON workflow_step_executions
  FOR EACH ROW
  EXECUTE FUNCTION public.restrict_status_regression();
--> statement-breakpoint

-- ============================================================
-- 3. Outbox-specific status regression guard — M2
--    Outbox tables allow specific regressions per PRD §772-773:
--    - failed → pending (retry)
--    - dead_letter → pending (admin override)
--    All other regressions from terminal states are blocked.
-- ============================================================
CREATE OR REPLACE FUNCTION public.restrict_outbox_status_regression()
RETURNS trigger AS $$
BEGIN
  -- Allow retry: failed → pending
  IF OLD.status = 'failed' AND NEW.status = 'pending' THEN
    RETURN NEW;
  END IF;

  -- Allow admin override: dead_letter → pending
  IF OLD.status = 'dead_letter' AND NEW.status = 'pending' THEN
    RETURN NEW;
  END IF;

  -- Block all other regressions from terminal states
  IF OLD.status IN ('completed', 'dead_letter') AND NEW.status IS DISTINCT FROM OLD.status THEN
    RAISE EXCEPTION 'Cannot regress from terminal status % on table=%, id=composite-pk',
      OLD.status, TG_TABLE_NAME
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

CREATE TRIGGER trg_restrict_status_wf_events_outbox
  BEFORE UPDATE OF status ON workflow_events_outbox
  FOR EACH ROW
  EXECUTE FUNCTION public.restrict_outbox_status_regression();
--> statement-breakpoint

CREATE TRIGGER trg_restrict_status_wf_side_effects_outbox
  BEFORE UPDATE OF status ON workflow_side_effects_outbox
  FOR EACH ROW
  EXECUTE FUNCTION public.restrict_outbox_status_regression();
--> statement-breakpoint
