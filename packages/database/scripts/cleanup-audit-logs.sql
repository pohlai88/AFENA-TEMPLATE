-- Drop old audit_logs table to allow schema push
-- This table conflicts with the new CRUD kernel audit_logs schema

DROP TABLE IF EXISTS audit_logs CASCADE;
