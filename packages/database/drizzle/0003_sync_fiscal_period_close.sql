-- M-08: sync_fiscal_period_close trigger
-- Fires when fiscal_periods.is_closed transitions false→true.
-- Updates matching posting_periods rows to 'hard-close' (idempotent).
-- Multi-ledger scoped: updates ALL posting_periods for the same org + fiscal_year + period_number.
-- AD-09: Two tables serve different purposes; trigger sync avoids schema merge.

CREATE OR REPLACE FUNCTION sync_fiscal_period_close()
RETURNS trigger AS $$
BEGIN
  -- Only fire on false→true transition
  IF NEW.is_closed = true AND (OLD.is_closed IS DISTINCT FROM true) THEN
    UPDATE posting_periods
    SET    status         = 'hard-close',
           hard_closed_at = now(),
           hard_closed_by = current_setting('app.user_id', true)
    WHERE  org_id         = NEW.org_id
      AND  fiscal_year    = NEW.fiscal_year
      AND  period_number  = NEW.period_number
      AND  status        <> 'hard-close';  -- idempotent: skip already closed
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_fiscal_period_close ON fiscal_periods;
CREATE TRIGGER trg_sync_fiscal_period_close
  AFTER UPDATE OF is_closed ON fiscal_periods
  FOR EACH ROW
  WHEN (NEW.is_closed = true AND OLD.is_closed = false)
  EXECUTE FUNCTION sync_fiscal_period_close();

-- M-09: elimination_journals table
-- Unified elimination routing — single audit trail per AD-03.
-- sourceType discriminator: ic_elimination, consolidation_adjustment, translation, ownership_change
-- AD-12: unique constraint prevents duplicate eliminations.

CREATE TABLE IF NOT EXISTS elimination_journals (
  id              uuid        NOT NULL DEFAULT gen_random_uuid(),
  org_id          uuid        NOT NULL DEFAULT (auth.org_id()::uuid),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  created_by      text        NOT NULL DEFAULT (auth.user_id()),
  updated_by      text        NOT NULL DEFAULT (auth.user_id()),
  version         integer     NOT NULL DEFAULT 1,
  is_deleted      boolean     NOT NULL DEFAULT false,
  deleted_at      timestamptz,
  deleted_by      text,
  company_id      uuid,
  site_id         uuid,
  custom_data     jsonb       NOT NULL DEFAULT '{}'::jsonb,
  subsidiary_id   uuid        NOT NULL,
  period_key      text        NOT NULL,
  source_type     text        NOT NULL,
  source_ref_id   text        NOT NULL,
  elimination_entries jsonb   NOT NULL DEFAULT '[]'::jsonb,
  effective_at    date        NOT NULL,

  CONSTRAINT elimination_journals_pkey PRIMARY KEY (org_id, id),
  CONSTRAINT ej_org_not_empty CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
  CONSTRAINT ej_valid_source_type CHECK (source_type IN ('ic_elimination', 'consolidation_adjustment', 'translation', 'ownership_change'))
);

-- AD-12: Prevent duplicate eliminations
CREATE UNIQUE INDEX IF NOT EXISTS uq__elimination_journals__org_period_source_ref
  ON elimination_journals (org_id, period_key, source_type, source_ref_id);

-- Audit query index
CREATE INDEX IF NOT EXISTS ej_audit_idx
  ON elimination_journals (org_id, source_type, period_key);

-- Subsidiary lookup
CREATE INDEX IF NOT EXISTS ej_subsidiary_idx
  ON elimination_journals (org_id, subsidiary_id, period_key);

-- Standard org indexes
CREATE INDEX IF NOT EXISTS ej_org_id_idx
  ON elimination_journals (org_id, id);

CREATE INDEX IF NOT EXISTS ej_org_created_idx
  ON elimination_journals (org_id, created_at);

-- RLS
ALTER TABLE elimination_journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE elimination_journals FORCE ROW LEVEL SECURITY;

CREATE POLICY elimination_journals_tenant_isolation ON elimination_journals
  USING (org_id = (auth.org_id())::uuid);
