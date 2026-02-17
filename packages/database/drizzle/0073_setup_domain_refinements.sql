-- Migration: 0073_setup_domain_refinements.sql
-- Purpose: Add deferred FK constraints and performance indexes for Setup Domain
-- Date: 2026-02-16
-- 
-- This migration adds:
-- 1. FK constraints for deferred foreign keys (when target tables are adopted)
-- 2. Performance indexes for frequently queried columns
-- 3. Additional search indexes for user-facing queries
--
-- Note: Some FK constraints are commented out because target tables are not yet adopted.
-- Uncomment them when the target tables are adopted in future phases.

-- ============================================================================
-- PART 1: Add FK Constraints for Adopted Tables
-- ============================================================================

-- authorization-rules: to_designation FK can be added now (designations adopted in Phase 2)
ALTER TABLE "authorization_rules" 
ADD CONSTRAINT "authorization_rules_to_designation_designations_id_fk" 
FOREIGN KEY ("to_designation") REFERENCES "public"."designations"("id") 
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "authorization_rules_to_designation_idx" 
ON "authorization_rules" USING btree ("org_id", "to_designation") 
WHERE "to_designation" IS NOT NULL;

-- ============================================================================
-- PART 2: Add Performance Indexes for Frequently Queried Columns
-- ============================================================================

-- authorization-rules: search by transaction type (e.g., find all Purchase Order rules)
CREATE INDEX "authorization_rules_org_transaction_idx" 
ON "authorization_rules" USING btree ("org_id", "transaction");

-- authorization-rules: filter by company
CREATE INDEX "authorization_rules_org_company_idx" 
ON "authorization_rules" USING btree ("org_id", "company") 
WHERE "company" IS NOT NULL;

-- branches: search by branch name (autocomplete, prefix search)
CREATE INDEX "branches_org_branch_idx" 
ON "branches" USING btree ("org_id", "branch");

-- departments: search by department name (autocomplete, prefix search)
CREATE INDEX "departments_org_name_idx" 
ON "departments" USING btree ("org_id", "department_name");

-- departments: find child departments (hierarchy queries)
CREATE INDEX "departments_org_parent_idx" 
ON "departments" USING btree ("org_id", "parent_department") 
WHERE "parent_department" IS NOT NULL;

-- departments: filter by company
CREATE INDEX "departments_org_company_idx" 
ON "departments" USING btree ("org_id", "company") 
WHERE "company" IS NOT NULL;

-- designations: search by designation name (autocomplete, prefix search)
CREATE INDEX "designations_org_name_idx" 
ON "designations" USING btree ("org_id", "designation_name");

-- employee-groups: search by group name (autocomplete, prefix search)
CREATE INDEX "employee_groups_org_name_idx" 
ON "employee_groups" USING btree ("org_id", "employee_group_name");

-- holiday-lists: search by list name (autocomplete, prefix search)
CREATE INDEX "holiday_lists_org_name_idx" 
ON "holiday_lists" USING btree ("org_id", "holiday_list_name");

-- holiday-lists: filter by country
CREATE INDEX "holiday_lists_org_country_idx" 
ON "holiday_lists" USING btree ("org_id", "country") 
WHERE "country" IS NOT NULL;

-- holidays: find holidays by date range (calendar queries)
CREATE INDEX "holidays_org_date_idx" 
ON "holidays" USING btree ("org_id", "holiday_date");

-- ============================================================================
-- PART 3: Deferred FK Constraints (Commented Out - Target Tables Not Yet Adopted)
-- ============================================================================
-- Uncomment these constraints when the target tables are adopted in future phases.

-- global-defaults FKs (5 constraints)
-- Target: companies table (not yet adopted)
-- ALTER TABLE "global_defaults" 
-- ADD CONSTRAINT "global_defaults_default_company_companies_id_fk" 
-- FOREIGN KEY ("default_company") REFERENCES "public"."companies"("id") 
-- ON DELETE SET NULL ON UPDATE CASCADE;
-- 
-- CREATE INDEX "global_defaults_default_company_idx" 
-- ON "global_defaults" USING btree ("org_id", "default_company") 
-- WHERE "default_company" IS NOT NULL;

-- Target: countries table (not yet adopted)
-- ALTER TABLE "global_defaults" 
-- ADD CONSTRAINT "global_defaults_country_countries_id_fk" 
-- FOREIGN KEY ("country") REFERENCES "public"."countries"("id") 
-- ON DELETE SET NULL ON UPDATE CASCADE;
-- 
-- CREATE INDEX "global_defaults_country_idx" 
-- ON "global_defaults" USING btree ("org_id", "country") 
-- WHERE "country" IS NOT NULL;

-- Target: uoms table (not yet adopted)
-- ALTER TABLE "global_defaults" 
-- ADD CONSTRAINT "global_defaults_default_distance_unit_uoms_id_fk" 
-- FOREIGN KEY ("default_distance_unit") REFERENCES "public"."uoms"("id") 
-- ON DELETE SET NULL ON UPDATE CASCADE;

-- Target: currencies table (not yet adopted)
-- ALTER TABLE "global_defaults" 
-- ADD CONSTRAINT "global_defaults_default_currency_currencies_id_fk" 
-- FOREIGN KEY ("default_currency") REFERENCES "public"."currencies"("id") 
-- ON DELETE SET NULL ON UPDATE CASCADE;

-- Target: letterheads table (not yet adopted)
-- ALTER TABLE "global_defaults" 
-- ADD CONSTRAINT "global_defaults_default_letterhead_letterheads_id_fk" 
-- FOREIGN KEY ("default_letterhead") REFERENCES "public"."letterheads"("id") 
-- ON DELETE SET NULL ON UPDATE CASCADE;

-- departments FK (1 constraint)
-- Target: companies table (not yet adopted)
-- ALTER TABLE "departments" 
-- ADD CONSTRAINT "departments_company_companies_id_fk" 
-- FOREIGN KEY ("company") REFERENCES "public"."companies"("id") 
-- ON DELETE SET NULL ON UPDATE CASCADE;

-- holiday-lists FK (1 constraint)
-- Target: countries table (not yet adopted)
-- ALTER TABLE "holiday_lists" 
-- ADD CONSTRAINT "holiday_lists_country_countries_id_fk" 
-- FOREIGN KEY ("country") REFERENCES "public"."countries"("id") 
-- ON DELETE SET NULL ON UPDATE CASCADE;

-- authorization-rules FKs (6 remaining constraints)
-- Target: companies table (not yet adopted)
-- ALTER TABLE "authorization_rules" 
-- ADD CONSTRAINT "authorization_rules_company_companies_id_fk" 
-- FOREIGN KEY ("company") REFERENCES "public"."companies"("id") 
-- ON DELETE SET NULL ON UPDATE CASCADE;

-- Target: roles table (not yet adopted)
-- ALTER TABLE "authorization_rules" 
-- ADD CONSTRAINT "authorization_rules_system_role_roles_id_fk" 
-- FOREIGN KEY ("system_role") REFERENCES "public"."roles"("id") 
-- ON DELETE SET NULL ON UPDATE CASCADE;
-- 
-- ALTER TABLE "authorization_rules" 
-- ADD CONSTRAINT "authorization_rules_approving_role_roles_id_fk" 
-- FOREIGN KEY ("approving_role") REFERENCES "public"."roles"("id") 
-- ON DELETE SET NULL ON UPDATE CASCADE;

-- Target: employees table (not yet adopted)
-- ALTER TABLE "authorization_rules" 
-- ADD CONSTRAINT "authorization_rules_to_emp_employees_id_fk" 
-- FOREIGN KEY ("to_emp") REFERENCES "public"."employees"("id") 
-- ON DELETE SET NULL ON UPDATE CASCADE;

-- Target: users table (not yet adopted)
-- ALTER TABLE "authorization_rules" 
-- ADD CONSTRAINT "authorization_rules_system_user_col_users_id_fk" 
-- FOREIGN KEY ("system_user_col") REFERENCES "public"."users"("id") 
-- ON DELETE SET NULL ON UPDATE CASCADE;
-- 
-- ALTER TABLE "authorization_rules" 
-- ADD CONSTRAINT "authorization_rules_approving_user_users_id_fk" 
-- FOREIGN KEY ("approving_user") REFERENCES "public"."users"("id") 
-- ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================================================
-- PART 4: Summary
-- ============================================================================
-- 
-- Applied in this migration:
-- - 1 FK constraint (authorization_rules.to_designation → designations.id)
-- - 11 performance indexes for frequently queried columns
-- 
-- Deferred for future migrations (13 FK constraints):
-- - 5 FKs from global_defaults (companies, countries, uoms, currencies, letterheads)
-- - 1 FK from departments (companies)
-- - 1 FK from holiday_lists (countries)
-- - 6 FKs from authorization_rules (companies, roles×2, employees, users×2)
-- 
-- These will be added when target tables are adopted in future domain phases.
