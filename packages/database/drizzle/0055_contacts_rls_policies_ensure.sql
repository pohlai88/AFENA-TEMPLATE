-- Ensure contacts RLS policies exist (idempotent).
-- Some Neon branches may have been created before 0005 or with partial migrations.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contacts' AND policyname = 'crud-authenticated-policy-select') THEN
    CREATE POLICY "crud-authenticated-policy-select" ON "contacts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "contacts"."org_id"));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contacts' AND policyname = 'crud-authenticated-policy-insert') THEN
    CREATE POLICY "crud-authenticated-policy-insert" ON "contacts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "contacts"."org_id"));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contacts' AND policyname = 'crud-authenticated-policy-update') THEN
    CREATE POLICY "crud-authenticated-policy-update" ON "contacts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "contacts"."org_id")) WITH CHECK ((select auth.org_id() = "contacts"."org_id"));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contacts' AND policyname = 'crud-authenticated-policy-delete') THEN
    CREATE POLICY "crud-authenticated-policy-delete" ON "contacts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "contacts"."org_id"));
  END IF;
END $$;
