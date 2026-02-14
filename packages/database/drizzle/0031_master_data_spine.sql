-- 0031_master_data_spine.sql
-- Transactional Spine Migration 0031: Master Data
--
-- Contents:
-- 1. item_groups (hierarchical product categorisation)
-- 2. items (products, services, consumables, raw materials)
-- 3. warehouses (stock locations scoped to company)
-- 4. addresses (reusable address records)
-- 5. contact_addresses (lightweight link: contacts ↔ addresses)
-- 6. company_addresses (lightweight link: companies ↔ addresses)
--
-- All tables: RLS enabled, tenant policy, org_id <> '' CHECK

-- ============================================================
-- 1. item_groups
-- ============================================================
CREATE TABLE item_groups (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        TEXT NOT NULL DEFAULT (auth.require_org_id()),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by    TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by    TEXT NOT NULL DEFAULT (auth.user_id()),
  version       INTEGER NOT NULL DEFAULT 1,
  is_deleted    BOOLEAN NOT NULL DEFAULT false,
  deleted_at    TIMESTAMPTZ,
  deleted_by    TEXT,
  name          TEXT NOT NULL,
  parent_group_id UUID,
  description   TEXT,
  sort_order    INTEGER DEFAULT 0,

  CONSTRAINT item_groups_org_not_empty  CHECK (org_id <> ''),
  CONSTRAINT item_groups_name_not_empty CHECK (name <> '')
);
--> statement-breakpoint
ALTER TABLE item_groups ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE UNIQUE INDEX item_groups_org_name_uniq ON item_groups (org_id, name);
--> statement-breakpoint
CREATE INDEX item_groups_org_parent_idx ON item_groups (org_id, parent_group_id);
--> statement-breakpoint
CREATE POLICY "item_groups_crud_policy" ON item_groups
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint

-- set_updated_at trigger (reuse existing function)
CREATE TRIGGER set_updated_at BEFORE UPDATE ON item_groups
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 2. items
-- ============================================================
CREATE TABLE items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        TEXT NOT NULL DEFAULT (auth.require_org_id()),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by    TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by    TEXT NOT NULL DEFAULT (auth.user_id()),
  version       INTEGER NOT NULL DEFAULT 1,
  is_deleted    BOOLEAN NOT NULL DEFAULT false,
  deleted_at    TIMESTAMPTZ,
  deleted_by    TEXT,
  code          TEXT NOT NULL,
  name          TEXT NOT NULL,
  item_group_id UUID,
  item_type     TEXT NOT NULL DEFAULT 'product',
  -- UOM references
  default_uom_id   UUID,
  inventory_uom_id UUID,
  purchase_uom_id  UUID,
  sales_uom_id     UUID,
  -- Inventory flags
  is_stock_item    BOOLEAN NOT NULL DEFAULT true,
  is_purchase_item BOOLEAN NOT NULL DEFAULT true,
  is_sales_item    BOOLEAN NOT NULL DEFAULT true,
  is_fixed_asset   BOOLEAN NOT NULL DEFAULT false,
  -- Valuation
  valuation_method TEXT NOT NULL DEFAULT 'weighted_average',
  default_warehouse_id UUID,
  -- Batch/serial
  has_batch_no   BOOLEAN NOT NULL DEFAULT false,
  has_serial_no  BOOLEAN NOT NULL DEFAULT false,
  shelf_life_days INTEGER,
  -- Weight
  weight_per_unit NUMERIC(10,4),
  weight_uom_id   UUID,
  -- Classification
  hsn_code    TEXT,
  barcode     TEXT,
  description TEXT,
  -- Planning
  min_order_qty NUMERIC(20,6),
  reorder_level NUMERIC(20,6),
  reorder_qty   NUMERIC(20,6),
  lead_time_days INTEGER,
  safety_stock   NUMERIC(20,6),
  -- Default accounts
  default_expense_account_id UUID,
  default_income_account_id  UUID,
  default_cost_center_id     UUID,

  CONSTRAINT items_org_not_empty    CHECK (org_id <> ''),
  CONSTRAINT items_code_not_empty   CHECK (code <> ''),
  CONSTRAINT items_type_valid       CHECK (item_type IN ('product', 'service', 'consumable', 'raw_material')),
  CONSTRAINT items_valuation_valid  CHECK (valuation_method IN ('fifo', 'weighted_average'))
);
--> statement-breakpoint
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE UNIQUE INDEX items_org_code_uniq ON items (org_id, code);
--> statement-breakpoint
CREATE INDEX items_org_group_idx ON items (org_id, item_group_id);
--> statement-breakpoint
CREATE INDEX items_org_type_idx ON items (org_id, item_type);
--> statement-breakpoint
CREATE INDEX items_org_stock_idx ON items (org_id, is_stock_item) WHERE is_stock_item = true;
--> statement-breakpoint
CREATE POLICY "items_crud_policy" ON items
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint

CREATE TRIGGER set_updated_at BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 3. warehouses
-- ============================================================
CREATE TABLE warehouses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        TEXT NOT NULL DEFAULT (auth.require_org_id()),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by    TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by    TEXT NOT NULL DEFAULT (auth.user_id()),
  version       INTEGER NOT NULL DEFAULT 1,
  is_deleted    BOOLEAN NOT NULL DEFAULT false,
  deleted_at    TIMESTAMPTZ,
  deleted_by    TEXT,
  company_id    UUID NOT NULL,
  site_id       UUID,
  code          TEXT NOT NULL,
  name          TEXT NOT NULL,
  warehouse_type TEXT NOT NULL DEFAULT 'store',
  parent_warehouse_id UUID,
  is_group      BOOLEAN NOT NULL DEFAULT false,

  CONSTRAINT warehouses_org_not_empty  CHECK (org_id <> ''),
  CONSTRAINT warehouses_code_not_empty CHECK (code <> ''),
  CONSTRAINT warehouses_type_valid     CHECK (warehouse_type IN ('store', 'transit', 'scrap', 'wip', 'finished', 'returns'))
);
--> statement-breakpoint
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE UNIQUE INDEX warehouses_org_code_uniq ON warehouses (org_id, code);
--> statement-breakpoint
CREATE INDEX warehouses_org_company_idx ON warehouses (org_id, company_id);
--> statement-breakpoint
CREATE INDEX warehouses_org_parent_idx ON warehouses (org_id, parent_warehouse_id);
--> statement-breakpoint
CREATE POLICY "warehouses_crud_policy" ON warehouses
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint

CREATE TRIGGER set_updated_at BEFORE UPDATE ON warehouses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 4. addresses
-- ============================================================
CREATE TABLE addresses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        TEXT NOT NULL DEFAULT (auth.require_org_id()),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by    TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by    TEXT NOT NULL DEFAULT (auth.user_id()),
  version       INTEGER NOT NULL DEFAULT 1,
  is_deleted    BOOLEAN NOT NULL DEFAULT false,
  deleted_at    TIMESTAMPTZ,
  deleted_by    TEXT,
  address_type  TEXT NOT NULL DEFAULT 'billing',
  line1         TEXT,
  line2         TEXT,
  city          TEXT,
  state         TEXT,
  postal_code   TEXT,
  country       TEXT,
  phone         TEXT,
  email         TEXT,

  CONSTRAINT addresses_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT addresses_type_valid    CHECK (address_type IN ('billing', 'shipping', 'registered', 'warehouse'))
);
--> statement-breakpoint
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE INDEX addresses_org_id_idx ON addresses (org_id, id);
--> statement-breakpoint
CREATE POLICY "addresses_crud_policy" ON addresses
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint

CREATE TRIGGER set_updated_at BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 5. contact_addresses (lightweight link)
-- ============================================================
CREATE TABLE contact_addresses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        TEXT NOT NULL DEFAULT (auth.require_org_id()),
  contact_id    UUID NOT NULL,
  address_id    UUID NOT NULL,
  address_type  TEXT NOT NULL DEFAULT 'billing',
  is_primary    BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by    TEXT NOT NULL DEFAULT (auth.user_id()),

  CONSTRAINT contact_addr_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT contact_addr_type_valid    CHECK (address_type IN ('billing', 'shipping', 'registered', 'warehouse'))
);
--> statement-breakpoint
ALTER TABLE contact_addresses ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE UNIQUE INDEX contact_addr_org_contact_addr_uniq
  ON contact_addresses (org_id, contact_id, address_id);
--> statement-breakpoint
CREATE UNIQUE INDEX contact_addr_org_contact_type_primary_uniq
  ON contact_addresses (org_id, contact_id, address_type)
  WHERE is_primary = true;
--> statement-breakpoint
CREATE POLICY "contact_addresses_crud_policy" ON contact_addresses
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
--> statement-breakpoint

-- ============================================================
-- 6. company_addresses (lightweight link)
-- ============================================================
CREATE TABLE company_addresses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id    UUID NOT NULL,
  address_id    UUID NOT NULL,
  address_type  TEXT NOT NULL DEFAULT 'billing',
  is_primary    BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by    TEXT NOT NULL DEFAULT (auth.user_id()),

  CONSTRAINT company_addr_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT company_addr_type_valid    CHECK (address_type IN ('billing', 'shipping', 'registered', 'warehouse'))
);
--> statement-breakpoint
ALTER TABLE company_addresses ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE UNIQUE INDEX company_addr_org_company_addr_uniq
  ON company_addresses (org_id, company_id, address_id);
--> statement-breakpoint
CREATE UNIQUE INDEX company_addr_org_company_type_primary_uniq
  ON company_addresses (org_id, company_id, address_type)
  WHERE is_primary = true;
--> statement-breakpoint
CREATE POLICY "company_addresses_crud_policy" ON company_addresses
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((select auth.org_id() = org_id))
  WITH CHECK ((select auth.org_id() = org_id));
