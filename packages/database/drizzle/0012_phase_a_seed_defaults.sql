-- 0012_phase_a_seed_defaults.sql
-- Phase A: Seed default reference data for new orgs.
-- These are org-agnostic defaults inserted with a placeholder org_id.
-- In production, org creation logic copies these rows with the real org_id.
-- For now, we create a reusable function that seeds defaults for a given org.

-- ============================================================
-- Seed function: call with an org_id to populate defaults
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
  -- kg ↔ g
  INSERT INTO uom_conversions (org_id, from_uom_id, to_uom_id, factor)
  SELECT p_org_id, kg.id, g.id, 1000.0000000000
  FROM uom kg, uom g
  WHERE kg.org_id = p_org_id AND kg.symbol = 'kg'
    AND g.org_id = p_org_id AND g.symbol = 'g'
  ON CONFLICT DO NOTHING;

  -- L ↔ mL
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

END;
$$;
--> statement-breakpoint

COMMENT ON FUNCTION public.seed_org_defaults(text) IS 'Seeds default reference data (currencies, UOM, alias sets, meta assets, views, number sequences) for a new org. Call during org creation.';
