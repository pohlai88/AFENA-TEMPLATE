-- Migration 0044: GAP-DB-003, GAP-DB-008
-- Ratification Gap Register closure.
--
-- GAP-DB-003: stock_balances projection-only — REVOKE UPDATE/DELETE from authenticated.
--   Projection tables are updated only by posting/rebuild workers (service role).
--   App users must not directly mutate stock_balances.
--
-- GAP-DB-008: doc_postings lacks doc_version — add column + unique constraint.
--   Enables multiple postings per document across versions (amendments).
--   Unique (org_id, doc_type, doc_id, doc_version).

-- ════════════════════════════════════════════════════════════
-- GAP-DB-003: stock_balances projection-only
-- ════════════════════════════════════════════════════════════
REVOKE UPDATE, DELETE ON stock_balances FROM authenticated;

-- ════════════════════════════════════════════════════════════
-- GAP-DB-008: doc_postings doc_version
-- ════════════════════════════════════════════════════════════
ALTER TABLE doc_postings ADD COLUMN IF NOT EXISTS doc_version integer NOT NULL DEFAULT 1;

-- Unique per (org, doc_type, doc_id, doc_version) — allows posting v1, v2, etc.
CREATE UNIQUE INDEX IF NOT EXISTS doc_postings_org_doc_version_uniq
  ON doc_postings (org_id, doc_type, doc_id, doc_version);
