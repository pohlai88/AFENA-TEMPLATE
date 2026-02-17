-- Fix project_types table primary key constraint
-- This script removes the composite primary key and keeps only the id column as primary key

-- First, drop the composite primary key constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'project_types_org_id_id_pk' 
        AND table_name = 'project_types'
    ) THEN
        ALTER TABLE "project_types" DROP CONSTRAINT "project_types_org_id_id_pk";
    END IF;
END $$;

-- Ensure the id column is set as the primary key
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_type = 'PRIMARY KEY' 
        AND table_name = 'project_types'
    ) THEN
        ALTER TABLE "project_types" ADD PRIMARY KEY ("id");
    END IF;
END $$;
