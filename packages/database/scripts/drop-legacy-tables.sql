-- =============================================================================
-- DROP LEGACY TABLES
-- =============================================================================
-- Run this against the Neon database to remove all legacy tables.
-- KEEP: users, r2_files (managed by Drizzle migrations)
-- KEEP: auth.* schema (managed by Neon Auth — do NOT touch)
-- KEEP: drizzle __drizzle_migrations journal table
--
-- Usage:
--   neonctl sql --project-id dark-band-87285012 < scripts/drop-legacy-tables.sql
--   OR paste into Neon SQL Editor
-- =============================================================================

BEGIN;

-- ── canontask ────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS "canontask_projects" CASCADE;

-- ── kernel ───────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS "kernel_admin_config" CASCADE;
DROP TABLE IF EXISTS "kernel_audit_log" CASCADE;
DROP TABLE IF EXISTS "kernel_network_incidents" CASCADE;
DROP TABLE IF EXISTS "kernel_service_registry" CASCADE;

-- ── magicdrive ───────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS "magicdrive_collection_objects" CASCADE;
DROP TABLE IF EXISTS "magicdrive_collections" CASCADE;
DROP TABLE IF EXISTS "magicdrive_duplicate_group_versions" CASCADE;
DROP TABLE IF EXISTS "magicdrive_duplicate_groups" CASCADE;
DROP TABLE IF EXISTS "magicdrive_object_index" CASCADE;
DROP TABLE IF EXISTS "magicdrive_object_tags" CASCADE;
DROP TABLE IF EXISTS "magicdrive_object_versions" CASCADE;
DROP TABLE IF EXISTS "magicdrive_objects" CASCADE;
DROP TABLE IF EXISTS "magicdrive_saved_views" CASCADE;
DROP TABLE IF EXISTS "magicdrive_tags" CASCADE;
DROP TABLE IF EXISTS "magicdrive_tenant_settings" CASCADE;
DROP TABLE IF EXISTS "magicdrive_uploads" CASCADE;
DROP TABLE IF EXISTS "magicdrive_user_preferences" CASCADE;

-- ── magictodo ────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS "magictodo_focus_session_queue" CASCADE;
DROP TABLE IF EXISTS "magictodo_focus_sessions" CASCADE;
DROP TABLE IF EXISTS "magictodo_immutable_memos" CASCADE;
DROP TABLE IF EXISTS "magictodo_projects" CASCADE;
DROP TABLE IF EXISTS "magictodo_saved_views" CASCADE;
DROP TABLE IF EXISTS "magictodo_snoozed_tasks" CASCADE;
DROP TABLE IF EXISTS "magictodo_task_activity" CASCADE;
DROP TABLE IF EXISTS "magictodo_task_comments" CASCADE;
DROP TABLE IF EXISTS "magictodo_task_dependencies" CASCADE;
DROP TABLE IF EXISTS "magictodo_tasks" CASCADE;
DROP TABLE IF EXISTS "magictodo_time_entries" CASCADE;

-- ── orchestra ────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS "orchestra_app_domains" CASCADE;
DROP TABLE IF EXISTS "orchestra_backup_history" CASCADE;
DROP TABLE IF EXISTS "orchestra_backup_schedule" CASCADE;
DROP TABLE IF EXISTS "orchestra_backups" CASCADE;
DROP TABLE IF EXISTS "orchestra_config_history" CASCADE;
DROP TABLE IF EXISTS "orchestra_custom_templates" CASCADE;
DROP TABLE IF EXISTS "orchestra_health_history" CASCADE;
DROP TABLE IF EXISTS "orchestra_template_history" CASCADE;

-- ── tenancy ──────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS "tenancy_audit_logs" CASCADE;
DROP TABLE IF EXISTS "tenancy_invitation_rate_limits" CASCADE;
DROP TABLE IF EXISTS "tenancy_invitation_templates" CASCADE;
DROP TABLE IF EXISTS "tenancy_invitations" CASCADE;
DROP TABLE IF EXISTS "tenancy_memberships" CASCADE;
DROP TABLE IF EXISTS "tenancy_organizations" CASCADE;
DROP TABLE IF EXISTS "tenancy_teams" CASCADE;
DROP TABLE IF EXISTS "tenancy_tenant_design_system" CASCADE;

-- ── Drop legacy enum types ──────────────────────────────────────────────────
DROP TYPE IF EXISTS "canontask_project_status" CASCADE;
DROP TYPE IF EXISTS "canontask_task_priority" CASCADE;
DROP TYPE IF EXISTS "magicdrive_doc_type" CASCADE;
DROP TYPE IF EXISTS "magicdrive_dup_reason" CASCADE;
DROP TYPE IF EXISTS "magicdrive_status" CASCADE;
DROP TYPE IF EXISTS "magicdrive_upload_status" CASCADE;
DROP TYPE IF EXISTS "magictodo_focus_session_status" CASCADE;
DROP TYPE IF EXISTS "magictodo_recurrence_pattern" CASCADE;
DROP TYPE IF EXISTS "magictodo_recurrence_frequency" CASCADE;
DROP TYPE IF EXISTS "magictodo_task_category" CASCADE;
DROP TYPE IF EXISTS "magictodo_task_priority" CASCADE;
DROP TYPE IF EXISTS "magictodo_task_status" CASCADE;
DROP TYPE IF EXISTS "tenancy_membership_status" CASCADE;
DROP TYPE IF EXISTS "tenancy_organization_status" CASCADE;
DROP TYPE IF EXISTS "tenancy_organization_tier" CASCADE;
DROP TYPE IF EXISTS "tenancy_team_status" CASCADE;
DROP TYPE IF EXISTS "tenancy_team_visibility" CASCADE;

-- ── Drop legacy functions ────────────────────────────────────────────────────
DROP FUNCTION IF EXISTS "show_db_tree"() CASCADE;
DROP FUNCTION IF EXISTS "current_user_id"() CASCADE;
DROP FUNCTION IF EXISTS "is_authenticated"() CASCADE;

COMMIT;

-- Verify: only users, r2_files, and drizzle journal should remain
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
