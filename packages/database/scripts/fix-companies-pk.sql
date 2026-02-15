-- Fix companies table composite primary key
-- Required before applying composite FK migrations

-- Drop existing single-column PK if it exists
ALTER TABLE companies DROP CONSTRAINT IF EXISTS companies_pkey;

-- Add composite primary key (org_id, id)
ALTER TABLE companies ADD CONSTRAINT companies_pkey PRIMARY KEY (org_id, id);
