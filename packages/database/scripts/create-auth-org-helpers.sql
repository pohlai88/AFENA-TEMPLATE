-- =============================================================================
-- Afena Multi-Tenancy: Auth Org Helper Functions
-- =============================================================================
-- Drop-in SQL for Phase 0 of the Neon + Drizzle multi-tenancy plan.
-- Creates 6 functions in the `auth` schema for org-scoped RLS.
--
-- Run once against the production branch via:
--   psql $DATABASE_URL -f packages/database/scripts/create-auth-org-helpers.sql
--
-- Plan reference: .windsurf/plans/neon-multitenancy-ee6154.md
-- Hardening points covered: #1, #2, #3, #10, #11, #12, #13, #17, #18, #21
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. auth.try_uuid(text) — Safe UUID cast (Hardening #1)
--    Returns NULL instead of throwing on invalid input.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION auth.try_uuid(v text)
RETURNS uuid AS $$
  SELECT CASE
    WHEN v ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    THEN v::uuid
    ELSE NULL
  END
$$ LANGUAGE sql IMMUTABLE;

-- ---------------------------------------------------------------------------
-- 2. auth.org_id() — JWT-only org claim (Hardening #10, #11, #18)
--    No app.org_id fallback. Returns NULL if claim is missing.
--    Future-proof: tries camelCase then snake_case claim key.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION auth.org_id()
RETURNS text AS $$
  SELECT COALESCE(
    nullif((nullif(current_setting('request.jwt.claims', true), ''))::json->>'activeOrganizationId', ''),
    nullif((nullif(current_setting('request.jwt.claims', true), ''))::json->>'active_organization_id', '')
  )
$$ LANGUAGE sql STABLE;

-- ---------------------------------------------------------------------------
-- 3. auth.org_id_uuid() — Safe UUID variant of org_id (Hardening #1)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION auth.org_id_uuid()
RETURNS uuid AS $$
  SELECT auth.try_uuid(auth.org_id())
$$ LANGUAGE sql STABLE;

-- ---------------------------------------------------------------------------
-- 4. auth.require_org_id() — Explicit write failure (Hardening #17)
--    Used as DEFAULT on org_id columns. Raises a clear exception
--    instead of cryptic NOT NULL violation when org claim is missing.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION auth.require_org_id()
RETURNS text
LANGUAGE plpgsql
STABLE
AS $$
DECLARE v text;
BEGIN
  v := auth.org_id();
  IF v IS NULL OR v = '' THEN
    RAISE EXCEPTION 'Missing activeOrganizationId in JWT — cannot write to domain table without org context';
  END IF;
  RETURN v;
END $$;

-- ---------------------------------------------------------------------------
-- 5. auth.org_id_or_setting() — Admin-only fallback (Hardening #13)
--    For migrations and admin scripts only. Never used in RLS policies.
--    NOT granted to authenticated role.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION auth.org_id_or_setting()
RETURNS text AS $$
  SELECT COALESCE(
    auth.org_id(),
    nullif(current_setting('app.org_id', true), '')
  )
$$ LANGUAGE sql STABLE;

-- ---------------------------------------------------------------------------
-- 6. auth.org_role() — Org membership role lookup (Hardening #1, #2)
--    SECURITY DEFINER with locked search_path to prevent shadowing.
--    Reads neon_auth.member using safe UUID casts.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION auth.org_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = neon_auth, auth, public
AS $$
  SELECT role
  FROM neon_auth.member
  WHERE "userId" = auth.try_uuid(auth.user_id())
    AND "organizationId" = auth.org_id_uuid()
  LIMIT 1
$$;

-- =============================================================================
-- OWNER pinning (Hardening #21)
-- =============================================================================
ALTER FUNCTION auth.try_uuid(text) OWNER TO neondb_owner;
ALTER FUNCTION auth.org_id() OWNER TO neondb_owner;
ALTER FUNCTION auth.org_id_uuid() OWNER TO neondb_owner;
ALTER FUNCTION auth.require_org_id() OWNER TO neondb_owner;
ALTER FUNCTION auth.org_id_or_setting() OWNER TO neondb_owner;
ALTER FUNCTION auth.org_role() OWNER TO neondb_owner;

-- =============================================================================
-- REVOKE ALL FROM PUBLIC (Hardening #12)
-- =============================================================================
REVOKE ALL ON FUNCTION auth.try_uuid(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION auth.org_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION auth.org_id_uuid() FROM PUBLIC;
REVOKE ALL ON FUNCTION auth.require_org_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION auth.org_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION auth.org_id_or_setting() FROM PUBLIC;

-- =============================================================================
-- GRANT to authenticated role (runtime)
-- =============================================================================
GRANT EXECUTE ON FUNCTION auth.try_uuid(text) TO authenticated;
GRANT EXECUTE ON FUNCTION auth.org_id() TO authenticated;
GRANT EXECUTE ON FUNCTION auth.org_id_uuid() TO authenticated;
GRANT EXECUTE ON FUNCTION auth.require_org_id() TO authenticated;
GRANT EXECUTE ON FUNCTION auth.org_role() TO authenticated;
-- auth.org_id_or_setting() deliberately NOT granted to authenticated — admin only

-- =============================================================================
-- Verification queries (run manually after deployment)
-- =============================================================================
-- SELECT auth.try_uuid('not-a-uuid');          -- → NULL
-- SELECT auth.try_uuid('550e8400-e29b-41d4-a716-446655440000'); -- → uuid
-- SELECT auth.org_id();                        -- → NULL (no JWT in psql)
-- SELECT auth.require_org_id();                -- → EXCEPTION (no JWT)
-- SELECT auth.org_id_or_setting();             -- → NULL (no JWT, no app.org_id)
-- SET app.org_id = 'test-org';
-- SELECT auth.org_id_or_setting();             -- → 'test-org' (admin only)
-- RESET app.org_id;
