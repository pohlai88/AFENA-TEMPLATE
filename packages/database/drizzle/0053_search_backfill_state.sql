-- GAP-DB-004: Chunked backfill state for search_documents
-- Tracks cursor per entity type so bootstrap completes over multiple invocations.
-- No RLS — worker-only table (BYPASSRLS role).

CREATE TABLE IF NOT EXISTS search_backfill_state (
  entity_type text NOT NULL PRIMARY KEY,
  cursor_org_id text,
  cursor_id uuid,
  rows_processed integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE search_backfill_state IS 'Worker-only: cursor for chunked backfill of search_documents (GAP-DB-004)';
