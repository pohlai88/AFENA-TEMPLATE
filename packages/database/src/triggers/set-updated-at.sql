-- Migration step 0: ensure pgcrypto for gen_random_uuid() branch safety
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- K-08: updated_at is enforced by DB trigger, not app code.
-- Lives in public schema for stable cross-schema reference.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Applied per domain table after table creation:
-- CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON contacts
--   FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
