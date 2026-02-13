-- 0023_phase_b_tax_payments.sql
-- PRD: ERP Database Architecture Audit — Phase B (Tax Engine V1 + Payment Allocation)
--
-- Contents:
-- 1. tax_rates table + indexes + CHECK constraints + RLS
-- 2. payment_allocations table + indexes + CHECK constraints + RLS
-- 3. credit_notes table (docEntity) + indexes + CHECK constraints + RLS
-- 4. Posted-record trigger on credit_notes
-- 5. Default tax rates in seed_org_defaults()

-- ============================================================
-- 1. tax_rates — versioned, time-bounded, never retroactively edited
-- ============================================================
CREATE TABLE IF NOT EXISTS tax_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  tax_code TEXT NOT NULL,
  name TEXT NOT NULL,
  rate NUMERIC(10, 6) NOT NULL,
  jurisdiction TEXT,
  tax_type TEXT NOT NULL DEFAULT 'gst',
  rounding_method TEXT NOT NULL DEFAULT 'half_up',
  rounding_precision INTEGER NOT NULL DEFAULT 2,
  effective_from DATE NOT NULL,
  effective_to DATE,
  is_compound BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT tax_rates_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT tax_rates_rate_non_negative CHECK (rate >= 0),
  CONSTRAINT tax_rates_tax_type_valid CHECK (tax_type IN ('gst', 'vat', 'sales_tax', 'service_tax', 'withholding', 'exempt', 'zero_rated')),
  CONSTRAINT tax_rates_rounding_valid CHECK (rounding_method IN ('half_up', 'half_down', 'ceil', 'floor', 'banker')),
  CONSTRAINT tax_rates_date_order CHECK (effective_to IS NULL OR effective_from <= effective_to)
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS tax_rates_org_id_idx
  ON tax_rates (org_id, id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS tax_rates_org_code_idx
  ON tax_rates (org_id, tax_code);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS tax_rates_effective_idx
  ON tax_rates (org_id, tax_code, effective_from);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS tax_rates_org_code_effective_uniq
  ON tax_rates (org_id, tax_code, effective_from);
--> statement-breakpoint

ALTER TABLE tax_rates ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE tax_rates FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY tax_rates_tenant_read ON tax_rates
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY tax_rates_tenant_write ON tax_rates
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE TRIGGER set_updated_at_tax_rates
  BEFORE UPDATE ON tax_rates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 2. payment_allocations
-- ============================================================
CREATE TABLE IF NOT EXISTS payment_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id UUID NOT NULL,
  payment_id UUID NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  allocation_type TEXT NOT NULL DEFAULT 'payment',
  allocated_amount BIGINT NOT NULL,
  currency_code TEXT NOT NULL DEFAULT 'MYR',
  fx_rate TEXT,
  base_allocated_amount BIGINT NOT NULL,
  allocation_date DATE NOT NULL,
  journal_entry_id UUID,
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT payment_alloc_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT payment_alloc_amount_positive CHECK (allocated_amount > 0),
  CONSTRAINT payment_alloc_type_valid CHECK (allocation_type IN ('payment', 'credit_note', 'write_off', 'refund')),
  CONSTRAINT payment_alloc_target_type_valid CHECK (target_type IN ('invoice', 'credit_note', 'debit_note'))
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS payment_alloc_org_id_idx
  ON payment_allocations (org_id, id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS payment_alloc_payment_idx
  ON payment_allocations (org_id, payment_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS payment_alloc_target_idx
  ON payment_allocations (org_id, target_type, target_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS payment_alloc_company_idx
  ON payment_allocations (org_id, company_id);
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS payment_alloc_payment_target_uniq
  ON payment_allocations (org_id, payment_id, target_id);
--> statement-breakpoint

ALTER TABLE payment_allocations ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE payment_allocations FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY payment_alloc_tenant_read ON payment_allocations
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY payment_alloc_tenant_write ON payment_allocations
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE TRIGGER set_updated_at_payment_alloc
  BEFORE UPDATE ON payment_allocations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 3. credit_notes (docEntity lifecycle)
-- ============================================================
CREATE TABLE IF NOT EXISTS credit_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id TEXT NOT NULL DEFAULT (auth.require_org_id()),
  company_id UUID,
  site_id UUID,
  custom_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  doc_status TEXT NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,
  submitted_by TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_by TEXT,
  amended_from_id UUID,
  credit_note_no TEXT,
  reverses_type TEXT NOT NULL,
  reverses_id UUID NOT NULL,
  reason_code TEXT NOT NULL,
  reason_description TEXT,
  contact_id UUID,
  currency_code TEXT NOT NULL DEFAULT 'MYR',
  fx_rate TEXT,
  subtotal_minor BIGINT NOT NULL DEFAULT 0,
  tax_minor BIGINT NOT NULL DEFAULT 0,
  total_minor BIGINT NOT NULL DEFAULT 0,
  base_subtotal_minor BIGINT NOT NULL DEFAULT 0,
  base_tax_minor BIGINT NOT NULL DEFAULT 0,
  base_total_minor BIGINT NOT NULL DEFAULT 0,
  posted_at TIMESTAMPTZ,
  journal_entry_id UUID,
  memo TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by TEXT NOT NULL DEFAULT (auth.user_id()),
  version INTEGER NOT NULL DEFAULT 1,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by TEXT,

  CONSTRAINT credit_notes_org_not_empty CHECK (org_id <> ''),
  CONSTRAINT credit_notes_reverses_type_valid CHECK (reverses_type IN ('invoice', 'debit_note')),
  CONSTRAINT credit_notes_amounts_non_negative CHECK (subtotal_minor >= 0 AND tax_minor >= 0 AND total_minor >= 0)
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS credit_notes_org_id_idx
  ON credit_notes (org_id, id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS credit_notes_org_company_idx
  ON credit_notes (org_id, company_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS credit_notes_reverses_idx
  ON credit_notes (org_id, reverses_type, reverses_id);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS credit_notes_contact_idx
  ON credit_notes (org_id, contact_id);
--> statement-breakpoint

ALTER TABLE credit_notes ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE credit_notes FORCE ROW LEVEL SECURITY;
--> statement-breakpoint

CREATE POLICY credit_notes_tenant_read ON credit_notes
  FOR SELECT TO authenticated
  USING ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE POLICY credit_notes_tenant_write ON credit_notes
  FOR ALL TO authenticated
  USING ((select auth.org_id()) = org_id)
  WITH CHECK ((select auth.org_id()) = org_id);
--> statement-breakpoint

CREATE TRIGGER set_updated_at_credit_notes
  BEFORE UPDATE ON credit_notes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
--> statement-breakpoint

-- ============================================================
-- 4. Posted-record immutability on credit_notes
-- ============================================================
CREATE TRIGGER trg_reject_posted_credit_note
  BEFORE UPDATE ON credit_notes
  FOR EACH ROW
  WHEN (OLD.doc_status IN ('submitted', 'active') AND NEW.doc_status = OLD.doc_status)
  EXECUTE FUNCTION public.reject_posted_mutation();
--> statement-breakpoint

-- ============================================================
-- 5. Seed default tax rates in seed_org_defaults()
-- ============================================================
-- Add Malaysian default tax rates to the org seed function.
-- These are time-bounded and can be overridden per-org.
DO $$
BEGIN
  -- We don't modify seed_org_defaults() here since tax rates
  -- are jurisdiction-specific. Instead we provide a helper.
  NULL;
END $$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION public.seed_org_tax_defaults(p_org_id text)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO tax_rates (org_id, tax_code, name, rate, tax_type, jurisdiction, rounding_method, rounding_precision, effective_from)
  VALUES
    (p_org_id, 'SST-6',   'Sales Tax 6%',       6.000000, 'sales_tax',    'MY', 'half_up', 2, '2018-09-01'),
    (p_org_id, 'SST-10',  'Service Tax 10%',    10.000000, 'service_tax',  'MY', 'half_up', 2, '2024-03-01'),
    (p_org_id, 'SST-8',   'Service Tax 8%',      8.000000, 'service_tax',  'MY', 'half_up', 2, '2024-03-01'),
    (p_org_id, 'EXEMPT',  'Tax Exempt',           0.000000, 'exempt',       NULL, 'half_up', 2, '2000-01-01'),
    (p_org_id, 'ZERO',    'Zero Rated',           0.000000, 'zero_rated',   NULL, 'half_up', 2, '2000-01-01')
  ON CONFLICT DO NOTHING;
END;
$$;
--> statement-breakpoint

COMMENT ON FUNCTION public.seed_org_tax_defaults(text) IS
  'Seeds default Malaysian tax rates for a new org. Call during org creation. Rates are time-bounded and jurisdiction-specific.';
