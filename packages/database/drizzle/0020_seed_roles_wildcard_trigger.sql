-- 0020_seed_roles_wildcard_trigger.sql
-- Multi-tenancy gap closure: procedural SQL that Drizzle schema builder cannot express.
-- - Update verb CHECK to include '*' for wildcard support
-- - Update seed_org_defaults() to seed roles + permissions
-- - Add trigger to prevent system role assignment to humans
-- - Add roles_org_key_idx unique index

-- ============================================================
-- Safety preamble: assert required tables exist
-- ============================================================
DO $$
BEGIN
  IF to_regclass('public.user_roles') IS NULL THEN
    RAISE EXCEPTION 'Expected table user_roles to exist';
  END IF;
  IF to_regclass('public.roles') IS NULL THEN
    RAISE EXCEPTION 'Expected table roles to exist';
  END IF;
  IF to_regclass('public.role_permissions') IS NULL THEN
    RAISE EXCEPTION 'Expected table role_permissions to exist';
  END IF;
END $$;
--> statement-breakpoint

-- ============================================================
-- 1. Unique index on roles(org_id, key) if not exists
-- ============================================================
CREATE UNIQUE INDEX IF NOT EXISTS roles_org_key_idx ON roles(org_id, key);
--> statement-breakpoint

-- ============================================================
-- 2. Update verb CHECK to include '*' for wildcard support
-- ============================================================
ALTER TABLE role_permissions DROP CONSTRAINT IF EXISTS role_perms_verb_valid;
--> statement-breakpoint
ALTER TABLE role_permissions ADD CONSTRAINT role_perms_verb_valid
  CHECK (verb IN ('create', 'update', 'delete', 'submit', 'cancel', 'amend', 'approve', 'reject', 'restore', '*'));
--> statement-breakpoint

-- ============================================================
-- 3. Update seed_org_defaults() to include roles + permissions
-- ============================================================
CREATE OR REPLACE FUNCTION public.seed_org_defaults(p_org_id text)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  -- ── Currencies ─────────────────────────────────────────
  INSERT INTO currencies (org_id, code, name, symbol, minor_units, is_base, fx_rate_to_base, enabled)
  VALUES
    (p_org_id, 'MYR', 'Malaysian Ringgit', 'RM', 2, true, 1, true),
    (p_org_id, 'USD', 'US Dollar', '$', 2, false, 4.4700000000, true),
    (p_org_id, 'SGD', 'Singapore Dollar', 'S$', 2, false, 3.3200000000, true),
    (p_org_id, 'EUR', 'Euro', '€', 2, false, 4.8500000000, true)
  ON CONFLICT DO NOTHING;

  -- ── Units of Measure ───────────────────────────────────
  INSERT INTO uom (org_id, name, symbol, type)
  VALUES
    (p_org_id, 'Pieces', 'pcs', 'count'),
    (p_org_id, 'Kilogram', 'kg', 'weight'),
    (p_org_id, 'Litre', 'L', 'volume'),
    (p_org_id, 'Metre', 'm', 'length'),
    (p_org_id, 'Box', 'box', 'count'),
    (p_org_id, 'Hour', 'hr', 'time'),
    (p_org_id, 'Gram', 'g', 'weight'),
    (p_org_id, 'Millilitre', 'mL', 'volume')
  ON CONFLICT DO NOTHING;

  -- ── UOM Conversions ────────────────────────────────────
  INSERT INTO uom_conversions (org_id, from_uom_id, to_uom_id, factor)
  SELECT p_org_id, kg.id, g.id, 1000.0000000000
  FROM uom kg, uom g
  WHERE kg.org_id = p_org_id AND kg.symbol = 'kg'
    AND g.org_id = p_org_id AND g.symbol = 'g'
  ON CONFLICT DO NOTHING;

  INSERT INTO uom_conversions (org_id, from_uom_id, to_uom_id, factor)
  SELECT p_org_id, l.id, ml.id, 1000.0000000000
  FROM uom l, uom ml
  WHERE l.org_id = p_org_id AND l.symbol = 'L'
    AND ml.org_id = p_org_id AND ml.symbol = 'mL'
  ON CONFLICT DO NOTHING;

  -- ── Default Alias Set ──────────────────────────────────
  INSERT INTO meta_alias_sets (org_id, set_key, name, description, is_default, is_system)
  VALUES (p_org_id, 'default_system', 'System Default', 'Auto-created system alias set', true, true)
  ON CONFLICT DO NOTHING;

  -- ── Default Alias Resolution Rule ──────────────────────
  INSERT INTO meta_alias_resolution_rules (org_id, scope_type, scope_key, alias_set_id, priority, is_active)
  SELECT p_org_id, 'org', 'default', mas.id, 0, true
  FROM meta_alias_sets mas
  WHERE mas.org_id = p_org_id AND mas.set_key = 'default_system'
  ON CONFLICT DO NOTHING;

  -- ── Meta Assets: register existing tables ──────────────
  INSERT INTO meta_assets (org_id, asset_type, asset_key, canonical_name, display_name, description)
  VALUES
    (p_org_id, 'table', 'db.contacts', 'contacts', 'Contacts', 'Contact records'),
    (p_org_id, 'table', 'db.companies', 'companies', 'Companies', 'Company entities'),
    (p_org_id, 'table', 'db.sites', 'sites', 'Sites', 'Warehouse/branch/plant/office locations'),
    (p_org_id, 'table', 'db.currencies', 'currencies', 'Currencies', 'Currency reference data'),
    (p_org_id, 'table', 'db.uom', 'uom', 'Units of Measure', 'Unit of measure reference data'),
    (p_org_id, 'table', 'db.custom_fields', 'custom_fields', 'Custom Fields', 'Custom field definitions'),
    (p_org_id, 'table', 'db.entity_views', 'entity_views', 'Entity Views', 'Configurable entity views')
  ON CONFLICT DO NOTHING;

  -- ── Default Entity Views ───────────────────────────────
  INSERT INTO entity_views (org_id, entity_type, view_name, view_type, is_default, is_system)
  VALUES
    (p_org_id, 'contacts', 'Default', 'table', true, true)
  ON CONFLICT DO NOTHING;

  -- ── Number Sequences ───────────────────────────────────
  INSERT INTO number_sequences (org_id, entity_type, prefix, suffix, next_value, pad_length)
  VALUES
    (p_org_id, 'contacts', 'CON-', '', 1, 5)
  ON CONFLICT DO NOTHING;

  -- ── Default Roles (no system role — bypass doesn't need it) ──
  INSERT INTO roles (org_id, key, name, description, is_system)
  VALUES
    (p_org_id, 'owner',  'Owner',  'Full access to all resources',           true),
    (p_org_id, 'admin',  'Admin',  'Administrative access to all resources', true),
    (p_org_id, 'member', 'Member', 'Standard member access',                false),
    (p_org_id, 'viewer', 'Viewer', 'Read-only access (no permissions)',      false)
  ON CONFLICT DO NOTHING;

  -- ── Default Permissions ────────────────────────────────
  -- owner: all 9 AUTH_VERBS on entity_type='*', scope='org' (explicit)
  INSERT INTO role_permissions (org_id, role_id, entity_type, verb, scope, field_rules_json)
  SELECT p_org_id, r.id, '*', v.verb, 'org', '{}'::jsonb
  FROM roles r,
       (VALUES ('create'),('update'),('delete'),('submit'),('cancel'),('amend'),('approve'),('reject'),('restore')) AS v(verb)
  WHERE r.org_id = p_org_id AND r.key = 'owner'
  ON CONFLICT DO NOTHING;

  -- admin: all 9 AUTH_VERBS on entity_type='*', scope='org' (explicit)
  INSERT INTO role_permissions (org_id, role_id, entity_type, verb, scope, field_rules_json)
  SELECT p_org_id, r.id, '*', v.verb, 'org', '{}'::jsonb
  FROM roles r,
       (VALUES ('create'),('update'),('delete'),('submit'),('cancel'),('amend'),('approve'),('reject'),('restore')) AS v(verb)
  WHERE r.org_id = p_org_id AND r.key = 'admin'
  ON CONFLICT DO NOTHING;

  -- member: create, update, delete, restore on entity_type='*', scope='org' (explicit)
  INSERT INTO role_permissions (org_id, role_id, entity_type, verb, scope, field_rules_json)
  SELECT p_org_id, r.id, '*', v.verb, 'org', '{}'::jsonb
  FROM roles r,
       (VALUES ('create'),('update'),('delete'),('restore')) AS v(verb)
  WHERE r.org_id = p_org_id AND r.key = 'member'
  ON CONFLICT DO NOTHING;

  -- viewer: 0 permissions (placeholder — engine correctly denies when no permissions match)

END;
$$;
--> statement-breakpoint

COMMENT ON FUNCTION public.seed_org_defaults(text) IS 'Seeds default reference data (currencies, UOM, alias sets, meta assets, views, number sequences, roles, permissions) for a new org. Call during org creation.';
--> statement-breakpoint

-- ============================================================
-- 4. Trigger: prevent system role assignment to humans
-- ============================================================
CREATE OR REPLACE FUNCTION public.prevent_system_role_assignment()
RETURNS trigger AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM roles r WHERE r.id = NEW.role_id AND r.key = 'system'
  ) THEN
    RAISE EXCEPTION 'system role is reserved and cannot be assigned to users';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

DROP TRIGGER IF EXISTS trg_prevent_system_role ON user_roles;
--> statement-breakpoint
CREATE TRIGGER trg_prevent_system_role
BEFORE INSERT OR UPDATE ON user_roles
FOR EACH ROW EXECUTE FUNCTION prevent_system_role_assignment();
