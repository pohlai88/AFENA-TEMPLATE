-- GAP-DB-004: Outbox + search_documents for incremental search
-- Replaces per-mutation MV refresh with outbox-driven worker updates.

-- search_documents: incremental search index (same shape as search_index MV)
CREATE TABLE IF NOT EXISTS search_documents (
  org_id text NOT NULL DEFAULT (auth.require_org_id()),
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  title text NOT NULL DEFAULT '',
  subtitle text,
  search_vector tsvector NOT NULL DEFAULT ''::tsvector,
  updated_at timestamptz NOT NULL DEFAULT now(),
  is_deleted boolean NOT NULL DEFAULT false,
  PRIMARY KEY (org_id, entity_type, entity_id),
  CONSTRAINT search_docs_org_not_empty CHECK (org_id <> '')
);

CREATE INDEX IF NOT EXISTS search_docs_fts_gin ON search_documents USING gin (search_vector);
CREATE INDEX IF NOT EXISTS search_docs_org_type_idx ON search_documents (org_id, entity_type);

ALTER TABLE search_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY search_docs_tenant_policy ON search_documents
  FOR ALL TO authenticated
  USING ((SELECT auth.org_id()) = org_id)
  WITH CHECK ((SELECT auth.org_id()) = org_id);

-- search_outbox: transactional outbox for search worker
CREATE TABLE IF NOT EXISTS search_outbox (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  org_id text NOT NULL DEFAULT (auth.require_org_id()),
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  action text NOT NULL DEFAULT 'upsert' CHECK (action IN ('upsert', 'delete')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'dead_letter')),
  attempts integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 5,
  next_retry_at timestamptz,
  completed_at timestamptz,
  error text,
  CONSTRAINT search_outbox_org_not_empty CHECK (org_id <> '')
);

CREATE INDEX IF NOT EXISTS search_outbox_poll_idx ON search_outbox (status, created_at)
  WHERE status IN ('pending', 'failed');
CREATE INDEX IF NOT EXISTS search_outbox_org_idx ON search_outbox (org_id);

ALTER TABLE search_outbox ENABLE ROW LEVEL SECURITY;

CREATE POLICY search_outbox_tenant_policy ON search_outbox
  FOR ALL TO authenticated
  USING ((SELECT auth.org_id()) = org_id)
  WITH CHECK ((SELECT auth.org_id()) = org_id);
