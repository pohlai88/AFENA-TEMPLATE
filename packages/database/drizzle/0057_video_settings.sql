-- 0057_video_settings.sql
-- Video Settings — org-level config for YouTube tracking.
-- Source: video-settings.spec.json (adopted from ERPNext Video Settings).
--
-- TENANCY-01: Composite PK (org_id, id), RLS, tenant policy.

CREATE TABLE IF NOT EXISTS video_settings (
  org_id                   TEXT NOT NULL DEFAULT (auth.require_org_id()),
  id                       UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by               TEXT NOT NULL DEFAULT (auth.user_id()),
  updated_by               TEXT NOT NULL DEFAULT (auth.user_id()),
  version                  INTEGER NOT NULL DEFAULT 1,
  is_deleted               BOOLEAN NOT NULL DEFAULT false,
  deleted_at               TIMESTAMPTZ,
  deleted_by               TEXT,
  custom_data              JSONB NOT NULL DEFAULT '{}'::jsonb,
  enable_youtube_tracking  BOOLEAN DEFAULT false,
  api_key                  TEXT,
  frequency                TEXT,

  CONSTRAINT video_settings_pkey PRIMARY KEY (org_id, id),
  CONSTRAINT video_settings_org_not_empty CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE video_settings ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE INDEX video_settings_org_created_id_idx ON video_settings (org_id, created_at DESC, id DESC);
--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON video_settings AS PERMISSIVE FOR SELECT TO authenticated USING ((select auth.org_id() = video_settings.org_id));
--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON video_settings AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK ((select auth.org_id() = video_settings.org_id));
--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON video_settings AS PERMISSIVE FOR UPDATE TO authenticated USING ((select auth.org_id() = video_settings.org_id)) WITH CHECK ((select auth.org_id() = video_settings.org_id));
--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON video_settings AS PERMISSIVE FOR DELETE TO authenticated USING ((select auth.org_id() = video_settings.org_id));
--> statement-breakpoint
CREATE TRIGGER set_updated_at BEFORE UPDATE ON video_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
