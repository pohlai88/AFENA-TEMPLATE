-- Natural key immutability trigger function (shared across tables)
-- Prevents UPDATE on natural key columns after row creation.
-- Per-table triggers are appended by: pnpm --filter afenda-database db:patch-migration-triggers
CREATE OR REPLACE FUNCTION public.block_natural_key_update()
RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'Natural key column(s) are immutable after creation';
END;
$$ LANGUAGE plpgsql;
