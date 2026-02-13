-- 0029_phase_e_uom_rounding.sql
-- PRD: ERP Database Architecture Audit — Phase E #25 + G0.15
--
-- Enhances uom_conversions with deterministic rounding rules
-- and per-product override support.

-- Add rounding_method column
ALTER TABLE uom_conversions
  ADD COLUMN IF NOT EXISTS rounding_method TEXT NOT NULL DEFAULT 'half_up';
--> statement-breakpoint

-- Add rounding_precision column
ALTER TABLE uom_conversions
  ADD COLUMN IF NOT EXISTS rounding_precision INTEGER NOT NULL DEFAULT 6;
--> statement-breakpoint

-- Add scope column (global or product-specific)
ALTER TABLE uom_conversions
  ADD COLUMN IF NOT EXISTS scope TEXT NOT NULL DEFAULT 'global';
--> statement-breakpoint

-- Add product_id for per-product overrides
ALTER TABLE uom_conversions
  ADD COLUMN IF NOT EXISTS product_id UUID;
--> statement-breakpoint

-- CHECK constraints
ALTER TABLE uom_conversions
  ADD CONSTRAINT uom_conversions_rounding_valid
  CHECK (rounding_method IN ('half_up', 'half_down', 'ceil', 'floor', 'banker'));
--> statement-breakpoint

ALTER TABLE uom_conversions
  ADD CONSTRAINT uom_conversions_scope_valid
  CHECK (scope IN ('global', 'product'));
--> statement-breakpoint

ALTER TABLE uom_conversions
  ADD CONSTRAINT uom_conversions_factor_positive
  CHECK (factor > 0);
--> statement-breakpoint

ALTER TABLE uom_conversions
  ADD CONSTRAINT uom_conversions_product_scope
  CHECK ((scope = 'global' AND product_id IS NULL) OR (scope = 'product' AND product_id IS NOT NULL));
--> statement-breakpoint

-- Drop old unique index and create new one that includes product_id
DROP INDEX IF EXISTS uom_conversions_org_from_to_uniq;
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS uom_conversions_org_from_to_product_uniq
  ON uom_conversions (org_id, from_uom_id, to_uom_id, product_id);
