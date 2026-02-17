-- SPD-03: Match key partial indexes for conflict detection performance
-- All created CONCURRENTLY to avoid table locks during migration

CREATE INDEX CONCURRENTLY IF NOT EXISTS contacts_org_email_idx
  ON contacts (org_id, email) WHERE is_deleted = false AND email IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS contacts_org_phone_idx
  ON contacts (org_id, phone) WHERE is_deleted = false AND phone IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS invoices_org_invnum_idx
  ON invoices (org_id, invoice_number) WHERE is_deleted = false;

CREATE INDEX CONCURRENTLY IF NOT EXISTS products_org_sku_idx
  ON products (org_id, sku) WHERE is_deleted = false;
