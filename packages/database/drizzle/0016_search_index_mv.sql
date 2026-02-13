-- W5: Cross-Entity Search Materialized View
-- Unifies all searchable entities into a single MV for fast cross-entity search.
-- 3 sealed indexes: uidx (for CONCURRENTLY refresh), gin (FTS), org (tenant filter).

-- Step 1: Create the materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS search_index AS
  -- Contacts
  SELECT
    c.id                                    AS entity_id,
    'contacts'::text                        AS entity_type,
    c.org_id                                AS org_id,
    c.name                                  AS title,
    COALESCE(c.email, '') || ' ' || COALESCE(c.company, '') AS subtitle,
    to_tsvector('simple',
      COALESCE(c.name, '') || ' ' ||
      COALESCE(c.email, '') || ' ' ||
      COALESCE(c.company, '') || ' ' ||
      COALESCE(c.phone, '')
    )                                       AS search_vector,
    c.updated_at                            AS updated_at,
    c.is_deleted                            AS is_deleted
  FROM contacts c

  UNION ALL

  -- Companies
  SELECT
    co.id                                   AS entity_id,
    'companies'::text                       AS entity_type,
    co.org_id                               AS org_id,
    co.name                                 AS title,
    COALESCE(co.legal_name, '') || ' ' || COALESCE(co.registration_no, '') AS subtitle,
    to_tsvector('simple',
      COALESCE(co.name, '') || ' ' ||
      COALESCE(co.legal_name, '') || ' ' ||
      COALESCE(co.registration_no, '') || ' ' ||
      COALESCE(co.tax_id, '')
    )                                       AS search_vector,
    co.updated_at                           AS updated_at,
    co.is_deleted                           AS is_deleted
  FROM companies co
WITH NO DATA;

-- Step 2: Unique index (required for REFRESH CONCURRENTLY)
CREATE UNIQUE INDEX IF NOT EXISTS search_index_uidx
  ON search_index (entity_type, entity_id);

-- Step 3: GIN index for full-text search
CREATE INDEX IF NOT EXISTS search_index_fts_gin
  ON search_index USING gin (search_vector);

-- Step 4: Org-scoped index for tenant filtering
CREATE INDEX IF NOT EXISTS search_index_org_idx
  ON search_index (org_id, entity_type);

-- Step 5: Initial population
REFRESH MATERIALIZED VIEW search_index;

-- Step 6: RLS on the MV is not supported by Postgres.
-- Tenant isolation is enforced by the WHERE org_id = auth.org_id() clause
-- in all queries against this view.

-- To refresh (run periodically or after bulk mutations):
--   REFRESH MATERIALIZED VIEW CONCURRENTLY search_index;
