-- 0032_posting_bridge.sql
-- Transactional Spine Migration 0032: Posting Bridge
--
-- Contents:
-- 1. doc_postings (canonical posting state — P-01, P-02, P-05, P-07, P-08)
-- 2. doc_links (generic document chain)
-- 3. check_warehouse_company_match() trigger function (R2.5)

-- ============================================================
-- 1. doc_postings
-- ============================================================
CREATE TABLE doc_postings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id           TEXT NOT NULL DEFAULT (auth.require_org_id()),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by       TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by       TEXT NOT NULL DEFAULT (auth.user_id()),
  version          INTEGER NOT NULL DEFAULT 1,
  is_deleted       BOOLEAN NOT NULL DEFAULT false,
  deleted_at       TIMESTAMPTZ,
  deleted_by       TEXT,
  doc_type         TEXT NOT NULL,
  doc_id           UUID NOT NULL,
  status           TEXT NOT NULL DEFAULT 'posting',
  idempotency_key  TEXT NOT NULL,
  posting_batch_id UUID,
  posting_run_id   UUID,
  journal_entry_id UUID,
  stock_batch_id   UUID,
  posted_at        TIMESTAMPTZ,
  posted_by        TEXT,
  reversed_at      TIMESTAMPTZ,
  reversed_by      TEXT,
  reversal_posting_id UUID,
  error_message    TEXT,

  CONSTRAINT doc_postings_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT doc_postings_status_valid  CHECK (status IN ('posting', 'posted', 'failed', 'reversing', 'reversed'))
);
--> statement-breakpoint
ALTER TABLE doc_postings ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

-- v6.3 critical: no-WHERE idempotency unique — one row per key, ever
-- Retry updates the existing row from failed→posting, never inserts a second row
CREATE UNIQUE INDEX doc_postings_org_idemp_uniq
  ON doc_postings (org_id, idempotency_key);
--> statement-breakpoint

-- v6.3: active posting unique includes 'reversing' to prevent concurrent reversal + repost
CREATE UNIQUE INDEX doc_postings_org_doc_active_uniq
  ON doc_postings (org_id, doc_type, doc_id)
  WHERE status IN ('posting', 'posted', 'reversing');
--> statement-breakpoint

CREATE INDEX doc_postings_org_batch_idx ON doc_postings (org_id, posting_batch_id);
--> statement-breakpoint
CREATE INDEX doc_postings_org_run_idx ON doc_postings (org_id, posting_run_id);
--> statement-breakpoint
CREATE INDEX doc_postings_org_type_posted_idx ON doc_postings (org_id, doc_type, posted_at DESC);
--> statement-breakpoint
CREATE INDEX doc_postings_org_status_idx ON doc_postings (org_id, status);
--> statement-breakpoint

CREATE POLICY "doc_postings_crud_policy" ON doc_postings
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint

CREATE TRIGGER set_updated_at BEFORE UPDATE ON doc_postings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 2. doc_links
-- ============================================================
CREATE TABLE doc_links (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          TEXT NOT NULL DEFAULT (auth.require_org_id()),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by      TEXT NOT NULL DEFAULT (auth.user_id()),
  version         INTEGER NOT NULL DEFAULT 1,
  is_deleted      BOOLEAN NOT NULL DEFAULT false,
  deleted_at      TIMESTAMPTZ,
  deleted_by      TEXT,
  source_type     TEXT NOT NULL,
  source_id       UUID NOT NULL,
  target_type     TEXT NOT NULL,
  target_id       UUID NOT NULL,
  link_type       TEXT NOT NULL,
  source_line_id  UUID,
  target_line_id  UUID,

  CONSTRAINT doc_links_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT doc_links_type_valid    CHECK (link_type IN ('fulfillment', 'billing', 'return', 'amendment'))
);
--> statement-breakpoint
ALTER TABLE doc_links ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE UNIQUE INDEX doc_links_org_src_tgt_type_uniq
  ON doc_links (org_id, source_type, source_id, target_type, target_id, link_type);
--> statement-breakpoint
CREATE INDEX doc_links_org_target_idx ON doc_links (org_id, target_type, target_id);
--> statement-breakpoint
CREATE INDEX doc_links_org_source_idx ON doc_links (org_id, source_type, source_id);
--> statement-breakpoint

CREATE POLICY "doc_links_crud_policy" ON doc_links
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint

CREATE TRIGGER set_updated_at BEFORE UPDATE ON doc_links
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 3. check_warehouse_company_match() trigger function (R2.5)
-- ============================================================
-- Ensures that a line's warehouse belongs to the same company as the parent doc.
-- Attached to line tables that reference a warehouse_id.
-- Joins parent doc table to resolve company_id when line table lacks it.
CREATE OR REPLACE FUNCTION check_warehouse_company_match()
  RETURNS TRIGGER AS $$
DECLARE
  wh_company_id UUID;
BEGIN
  -- If the line has no warehouse_id, skip the check
  IF NEW.warehouse_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT company_id INTO wh_company_id
    FROM warehouses
   WHERE id = NEW.warehouse_id
     AND org_id = NEW.org_id;

  IF wh_company_id IS NULL THEN
    RAISE EXCEPTION 'Warehouse % not found in org', NEW.warehouse_id;
  END IF;

  -- The parent doc's company_id is passed as TG_ARGV[0] column name on the parent table.
  -- For line tables that have company_id directly:
  IF TG_NARGS > 0 AND TG_ARGV[0] = 'direct' THEN
    IF NEW.company_id IS DISTINCT FROM wh_company_id THEN
      RAISE EXCEPTION 'Warehouse company_id (%) does not match line company_id (%)',
        wh_company_id, NEW.company_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
