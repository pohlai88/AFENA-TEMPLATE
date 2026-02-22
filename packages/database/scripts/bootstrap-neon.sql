/**
 * Bootstrap Neon — Pre-Migration Prerequisites
 *
 * Creates all roles, schemas, and auth functions required BEFORE
 * Drizzle migrations can run.  Every statement is idempotent so
 * the script is safe to execute repeatedly (CI, new branches, etc.).
 *
 * Run BEFORE `pnpm db:migrate` (which runs `node scripts/run-migrate.mjs`).
 *
 * Prerequisites created:
 *   1. `auth` schema + auth context functions
 *   2. `drizzle` schema (migration tracking)
 *   3. Database roles: authenticated, worker, schema_owner, migration_admin
 *   4. Schema-level grants
 *
 * Usage:
 *   psql $DATABASE_URL_MIGRATIONS -f scripts/bootstrap-neon.sql
 *   -- or --
 *   node scripts/bootstrap-neon.mjs          (programmatic runner)
 *
 * Gate: PREREQ-01 validates these exist before migration.
 */

-- ============================================================================
-- 1. SCHEMAS
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS drizzle;

-- ============================================================================
-- 2. AUTH CONTEXT FUNCTIONS
-- ============================================================================
-- These provide default values for org_id / created_by / updated_by columns
-- and are called by RLS policies at row-access time.

-- auth.org_id() → text  (reads JWT claim → text)
CREATE OR REPLACE FUNCTION auth.org_id()
RETURNS text
LANGUAGE sql STABLE
AS $$
  SELECT NULLIF(
    current_setting('request.jwt.claims', true)::json->>'activeOrganizationId',
    ''
  );
$$;

-- auth.org_id_uuid() → uuid  (cast helper used by column defaults)
CREATE OR REPLACE FUNCTION auth.org_id_uuid()
RETURNS uuid
LANGUAGE sql STABLE
AS $$
  SELECT NULLIF(
    current_setting('request.jwt.claims', true)::json->>'activeOrganizationId',
    ''
  )::uuid;
$$;

-- auth.user_id() → text
CREATE OR REPLACE FUNCTION auth.user_id()
RETURNS text
LANGUAGE sql STABLE
AS $$
  SELECT current_setting('request.jwt.claims', true)::json->>'sub';
$$;

-- auth.org_role() → text  (org-level role from JWT)
CREATE OR REPLACE FUNCTION auth.org_role()
RETURNS text
LANGUAGE sql STABLE
AS $$
  SELECT current_setting('request.jwt.claims', true)::json->>'orgRole';
$$;

-- auth.org_id_or_setting() → text  (fallback for worker sessions)
CREATE OR REPLACE FUNCTION auth.org_id_or_setting()
RETURNS text
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(
    NULLIF(
      current_setting('request.jwt.claims', true)::json->>'activeOrganizationId',
      ''
    ),
    NULLIF(current_setting('app.current_org_id', true), '')
  );
$$;

-- auth.require_org_id() → text  (raises if missing)
CREATE OR REPLACE FUNCTION auth.require_org_id()
RETURNS text
LANGUAGE plpgsql STABLE
AS $$
DECLARE
  oid text;
BEGIN
  oid := auth.org_id();
  IF oid IS NULL OR oid = '' THEN
    RAISE EXCEPTION 'auth.require_org_id: org_id is not set in JWT claims';
  END IF;
  RETURN oid;
END;
$$;

-- auth.try_uuid(text) → uuid | NULL  (safe cast via regex)
CREATE OR REPLACE FUNCTION auth.try_uuid(v text)
RETURNS uuid
LANGUAGE sql IMMUTABLE
AS $$
  SELECT CASE
    WHEN v ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    THEN v::uuid
    ELSE NULL
  END;
$$;

-- auth.set_context(uuid, text) → void  (used by DbSession)
CREATE OR REPLACE FUNCTION auth.set_context(p_org_id uuid, p_user_id text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM set_config(
    'request.jwt.claims',
    json_build_object(
      'activeOrganizationId', p_org_id,
      'sub', p_user_id
    )::text,
    true  -- local to transaction
  );
END;
$$;

-- ============================================================================
-- 3. DATABASE ROLES (idempotent)
-- ============================================================================

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'schema_owner') THEN
    CREATE ROLE schema_owner NOLOGIN;
    RAISE NOTICE 'Created role: schema_owner';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'migration_admin') THEN
    CREATE ROLE migration_admin NOLOGIN;
    RAISE NOTICE 'Created role: migration_admin';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
    RAISE NOTICE 'Created role: authenticated';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'worker') THEN
    CREATE ROLE worker NOLOGIN BYPASSRLS;
    RAISE NOTICE 'Created role: worker';
  END IF;
END $$;

-- ============================================================================
-- 4. SCHEMA-LEVEL GRANTS
-- ============================================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO worker;
GRANT USAGE ON SCHEMA auth   TO authenticated;
GRANT USAGE ON SCHEMA auth   TO worker;

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO worker;

-- migration_admin gets DDL privileges
GRANT CREATE ON SCHEMA public TO migration_admin;
GRANT USAGE  ON SCHEMA public TO migration_admin;
GRANT USAGE  ON SCHEMA drizzle TO migration_admin;
GRANT CREATE ON SCHEMA drizzle TO migration_admin;

-- ============================================================================
-- 5. VERIFICATION
-- ============================================================================

DO $$
DECLARE
  missing_roles text[];
  missing_funcs text[];
  r text;
BEGIN
  -- Check roles
  missing_roles := ARRAY[]::text[];
  FOREACH r IN ARRAY ARRAY['authenticated','worker','schema_owner','migration_admin']
  LOOP
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = r) THEN
      missing_roles := array_append(missing_roles, r);
    END IF;
  END LOOP;

  IF array_length(missing_roles, 1) > 0 THEN
    RAISE EXCEPTION 'Bootstrap FAILED — missing roles: %', array_to_string(missing_roles, ', ');
  END IF;

  -- Check auth functions
  missing_funcs := ARRAY[]::text[];
  FOREACH r IN ARRAY ARRAY['org_id','user_id','org_id_uuid','org_role','org_id_or_setting','require_org_id','try_uuid','set_context']
  LOOP
    IF NOT EXISTS (
      SELECT FROM information_schema.routines
      WHERE routine_schema = 'auth' AND routine_name = r
    ) THEN
      missing_funcs := array_append(missing_funcs, r);
    END IF;
  END LOOP;

  IF array_length(missing_funcs, 1) > 0 THEN
    RAISE EXCEPTION 'Bootstrap FAILED — missing auth functions: %', array_to_string(missing_funcs, ', ');
  END IF;

  RAISE NOTICE '✅ Bootstrap verification passed: 4 roles, 8 auth functions';
END $$;
