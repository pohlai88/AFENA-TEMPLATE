-- Idempotent: safe to re-run in dev
DROP TRIGGER IF EXISTS trg_contacts_search_vector ON contacts;
DROP FUNCTION IF EXISTS contacts_search_vector_update();

ALTER TABLE contacts ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE INDEX IF NOT EXISTS contacts_search_vector_idx ON contacts USING GIN (search_vector);

CREATE OR REPLACE FUNCTION contacts_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('simple',
    coalesce(NEW.name, '') || ' ' ||
    coalesce(NEW.email, '') || ' ' ||
    coalesce(NEW.company, '')
  );
  RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_contacts_search_vector
  BEFORE INSERT OR UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION contacts_search_vector_update();

-- Backfill existing rows
UPDATE contacts SET search_vector = to_tsvector('simple',
  coalesce(name, '') || ' ' || coalesce(email, '') || ' ' || coalesce(company, '')
);
