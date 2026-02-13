-- 0021_phase_a_unblock_real_docs.sql
-- PRD: ERP Database Architecture Audit — Phase A (Unblock Real Docs)
--
-- Contents:
-- 1. audit_logs append-only hardening (REVOKE UPDATE/DELETE)
-- 2. fx_rates table + indexes + CHECK constraints + RLS
-- 3. reject_posted_mutation() function (future-ready for financial doc triggers)
-- 4. Update seed_org_defaults() with fx_rates seed data + doc number sequences

-- ============================================================
-- Safety preamble: assert required tables exist
-- ============================================================
DO $$
BEGIN
  IF to_regclass('public.audit_logs') IS NULL THEN
    RAISE EXCEPTION 'Expected table audit_logs to exist';
  END IF;
  IF to_regclass('public.currencies') IS NULL THEN
    RAISE EXCEPTION 'Expected table currencies to exist';
  END IF;
  IF to_regclass('public.number_sequences') IS NULL THEN
    RAISE EXCEPTION 'Expected table number_sequences to exist';
  END IF;
END $$;
--> statement-breakpoint

-- ============================================================
-- 1. audit_logs: DB-level append-only (P0 immediate hardening)
-- ============================================================
-- RLS already handles row-level access. This REVOKE prevents ANY
-- authenticated user (including via direct SQL) from mutating audit history.
-- Matches the pattern used on advisory_evidence and workflow_executions.
REVOKE UPDATE, DELETE ON audit_logs FROM authenticated;
--> statement-breakpoint

-- ============================================================
-- 2. fx_rates table
-- ============================================================
CREATE TABLE IF NOT EXISTS fx_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  from_code TEXT NOT NULL,
  to_code TEXT NOT NULL,
  effective_date DATE NOT NULL,
  rate NUMERIC(20, 10) NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  captured_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),

  CONSTRAINT fx_rates_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT fx_rates_source_valid CHECK (source IN ('manual', 'api', 'import')),
  CONSTRAINT fx_rates_rate_positive CHECK (rate > 0)
);
--> statement-breakpoint

-- Indexes
CREATE INDEX IF NOT EXISTS fx_rates_org_id_idx
  ON fx_rates (org_id, id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS fx_rates_lookup_idx
  ON fx_rates (org_id, from_code, to_code, effective_date);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS fx_rates_org_pair_date_source_uniq
  ON fx_rates (org_id, from_code, to_code, effective_date, source);
--> statement-breakpoint

-- RLS
ALTER TABLE fx_rates ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE fx_rates FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY fx_rates_tenant_read ON fx_rates
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY fx_rates_tenant_write ON fx_rates
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

-- ============================================================
-- 3. reject_posted_mutation() — reusable trigger function
-- ============================================================
-- Used on financial doc tables (invoices, journal_entries, etc.)
-- to prevent modification of posted records at the DB level.
-- PRD: "anything that must never happen needs DB-level enforcement"
CREATE OR REPLACE FUNCTION public.reject_posted_mutation()
RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'Cannot modify a posted record (doc_status = %). Use amendment or reversal.',
    OLD.doc_status;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

COMMENT ON FUNCTION public.reject_posted_mutation() IS
  'DB-level guard: prevents UPDATE on records with doc_status IN (submitted, active). '
  'Attach as BEFORE UPDATE trigger on financial doc tables with WHEN clause.';
--> statement-breakpoint

-- ============================================================
-- 4. Update seed_org_defaults() — add fx_rates + more sequences
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

  -- ── FX Rates (seed initial rates from currency static rates) ──
  INSERT INTO fx_rates (org_id, from_code, to_code, effective_date, rate, source)
  VALUES
    (p_org_id, 'USD', 'MYR', CURRENT_DATE, 4.4700000000, 'manual'),
    (p_org_id, 'SGD', 'MYR', CURRENT_DATE, 3.3200000000, 'manual'),
    (p_org_id, 'EUR', 'MYR', CURRENT_DATE, 4.8500000000, 'manual'),
    (p_org_id, 'MYR', 'USD', CURRENT_DATE, 0.2237136465, 'manual'),
    (p_org_id, 'MYR', 'SGD', CURRENT_DATE, 0.3012048193, 'manual'),
    (p_org_id, 'MYR', 'EUR', CURRENT_DATE, 0.2061855670, 'manual')
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
    (p_org_id, 'table', 'db.entity_views', 'entity_views', 'Entity Views', 'Configurable entity views'),
    (p_org_id, 'table', 'db.fx_rates', 'fx_rates', 'FX Rates', 'Historical exchange rates')
  ON CONFLICT DO NOTHING;

  -- ── Default Entity Views ───────────────────────────────
  INSERT INTO entity_views (org_id, entity_type, view_name, view_type, is_default, is_system)
  VALUES
    (p_org_id, 'contacts', 'Default', 'table', true, true)
  ON CONFLICT DO NOTHING;

  -- ── Number Sequences ───────────────────────────────────
  INSERT INTO number_sequences (org_id, entity_type, prefix, suffix, next_value, pad_length)
  VALUES
    (p_org_id, 'contacts', 'CON-', '', 1, 5),
    (p_org_id, 'invoices', 'INV-', '', 1, 5),
    (p_org_id, 'purchase_orders', 'PO-', '', 1, 5),
    (p_org_id, 'sales_orders', 'SO-', '', 1, 5),
    (p_org_id, 'credit_notes', 'CN-', '', 1, 5),
    (p_org_id, 'delivery_notes', 'DN-', '', 1, 5),
    (p_org_id, 'receipts', 'REC-', '', 1, 5),
    (p_org_id, 'payments', 'PAY-', '', 1, 5)
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

COMMENT ON FUNCTION public.seed_org_defaults(text) IS 'Seeds default reference data (currencies, FX rates, UOM, alias sets, meta assets, views, number sequences, roles, permissions) for a new org. Call during org creation.';
