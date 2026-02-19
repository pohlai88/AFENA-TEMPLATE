/**
 * Ownership Normalization Script
 * 
 * Enforces:
 * - INV-OWN-01: All objects owned by schema_owner
 * - INV-OWN-02: Correct privilege grants after migrations
 * 
 * Run at the end of every migration to normalize ownership and privileges.
 * 
 * Usage:
 *   psql $DATABASE_URL -f scripts/normalize-ownership.sql
 *   
 * Or in migration:
 *   \i scripts/normalize-ownership.sql
 */

-- ============================================================================
-- 1. OWNERSHIP SWEEP
-- ============================================================================
-- Transfer ownership of all objects to schema_owner

DO $$
DECLARE
  r RECORD;
BEGIN
  -- Tables, views, materialized views, sequences
  FOR r IN 
    SELECT n.nspname, c.relname, c.relkind
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind IN ('r','p','v','m','S')  -- table, partition, view, mview, sequence
      AND pg_get_userbyid(c.relowner) != 'schema_owner'
  LOOP
    EXECUTE format('ALTER TABLE %I.%I OWNER TO schema_owner', r.nspname, r.relname);
    RAISE NOTICE 'Transferred ownership: %.% (%) to schema_owner', r.nspname, r.relname, r.relkind;
  END LOOP;
  
  -- Functions and procedures
  FOR r IN
    SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname IN ('public', 'auth')
      AND pg_get_userbyid(p.proowner) != 'schema_owner'
  LOOP
    EXECUTE format('ALTER FUNCTION %I.%I(%s) OWNER TO schema_owner', 
      r.nspname, r.proname, r.args);
    RAISE NOTICE 'Transferred ownership: %.%() to schema_owner', r.nspname, r.proname;
  END LOOP;
  
  -- Types
  FOR r IN
    SELECT n.nspname, t.typname
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
      AND t.typtype = 'c'  -- composite types
      AND pg_get_userbyid(t.typowner) != 'schema_owner'
  LOOP
    EXECUTE format('ALTER TYPE %I.%I OWNER TO schema_owner', r.nspname, r.typname);
    RAISE NOTICE 'Transferred ownership: %.% (type) to schema_owner', r.nspname, r.typname;
  END LOOP;
END $$;

-- ============================================================================
-- 2. PRIVILEGE SWEEP
-- ============================================================================
-- Revoke all, then grant narrowly

-- Revoke all from PUBLIC
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;

-- Revoke all from runtime roles (clean slate)
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM worker;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM worker;

-- Grant to authenticated (app runtime) - full CRUD on truth/control tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant to worker (read all, write projections only)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO worker;

-- Revoke projection writes from authenticated (worker-only)
-- Note: Specific projection tables should be listed here
-- For now, this is a template - actual tables added as projections are created
-- REVOKE INSERT, UPDATE, DELETE ON search_documents FROM authenticated;
-- REVOKE INSERT, UPDATE, DELETE ON stock_balances FROM authenticated;
-- REVOKE INSERT, UPDATE, DELETE ON search_index FROM authenticated;

-- Grant projection writes to worker
-- GRANT INSERT, UPDATE, DELETE ON search_documents TO worker;
-- GRANT INSERT, UPDATE, DELETE ON stock_balances TO worker;
-- GRANT INSERT, UPDATE, DELETE ON search_index TO worker;

-- ============================================================================
-- 3. DEFAULT PRIVILEGES
-- ============================================================================
-- Set default privileges for future objects created by schema_owner

ALTER DEFAULT PRIVILEGES FOR ROLE schema_owner IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE schema_owner IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE schema_owner IN SCHEMA public
  GRANT SELECT ON TABLES TO worker;

-- ============================================================================
-- 4. VERIFICATION
-- ============================================================================
-- Check for any remaining ownership violations

DO $$
DECLARE
  violation_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO violation_count
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relkind IN ('r','p','v','m','S')
    AND pg_get_userbyid(c.relowner) != 'schema_owner';
  
  IF violation_count > 0 THEN
    RAISE WARNING 'Ownership normalization incomplete: % objects still not owned by schema_owner', violation_count;
  ELSE
    RAISE NOTICE 'Ownership normalization complete: All objects owned by schema_owner';
  END IF;
END $$;

-- ============================================================================
-- 5. AUDIT LOG
-- ============================================================================
-- Log normalization execution (optional - requires audit_logs table)

-- INSERT INTO audit_logs (
--   org_id,
--   user_id,
--   action,
--   entity_type,
--   entity_id,
--   metadata
-- ) VALUES (
--   '00000000-0000-0000-0000-000000000000'::uuid,  -- System
--   'system',
--   'ownership_normalized',
--   'database',
--   'public',
--   jsonb_build_object(
--     'timestamp', NOW(),
--     'script', 'normalize-ownership.sql'
--   )
-- );
