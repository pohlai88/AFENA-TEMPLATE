CREATE TABLE "org_usage_daily" (
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"day" date NOT NULL,
	"api_requests" integer DEFAULT 0 NOT NULL,
	"job_runs" integer DEFAULT 0 NOT NULL,
	"job_ms" bigint DEFAULT 0 NOT NULL,
	"db_timeouts" integer DEFAULT 0 NOT NULL,
	"storage_bytes" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "org_usage_daily_org_id_day_pk" PRIMARY KEY("org_id","day"),
	CONSTRAINT "org_usage_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "org_usage_daily" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"role_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"verb" text NOT NULL,
	"scope" text DEFAULT 'org' NOT NULL,
	"field_rules_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "role_perms_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "role_perms_verb_valid" CHECK (verb IN ('create', 'update', 'delete', 'submit', 'cancel', 'amend')),
	CONSTRAINT "role_perms_scope_valid" CHECK (scope IN ('org', 'self', 'company', 'site', 'team'))
);
--> statement-breakpoint
ALTER TABLE "role_permissions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roles_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "roles_key_not_empty" CHECK (key <> '')
);
--> statement-breakpoint
ALTER TABLE "roles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"user_id" text NOT NULL,
	"role_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_roles_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "user_roles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_scopes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"user_id" text NOT NULL,
	"scope_type" text NOT NULL,
	"scope_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_scopes_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "user_scopes_type_valid" CHECK (scope_type IN ('company', 'site', 'team'))
);
--> statement-breakpoint
ALTER TABLE "user_scopes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "role_perms_org_role_entity_verb_idx" ON "role_permissions" USING btree ("org_id","role_id","entity_type","verb");--> statement-breakpoint
CREATE INDEX "role_perms_org_entity_idx" ON "role_permissions" USING btree ("org_id","entity_type");--> statement-breakpoint
CREATE UNIQUE INDEX "roles_org_key_idx" ON "roles" USING btree ("org_id","key");--> statement-breakpoint
CREATE INDEX "roles_org_id_idx" ON "roles" USING btree ("org_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_roles_org_user_role_idx" ON "user_roles" USING btree ("org_id","user_id","role_id");--> statement-breakpoint
CREATE INDEX "user_roles_org_user_idx" ON "user_roles" USING btree ("org_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_scopes_org_user_type_id_idx" ON "user_scopes" USING btree ("org_id","user_id","scope_type","scope_id");--> statement-breakpoint
CREATE INDEX "user_scopes_org_user_idx" ON "user_scopes" USING btree ("org_id","user_id");--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "org_usage_daily" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "org_usage_daily"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "org_usage_daily" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "org_usage_daily"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "org_usage_daily" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "org_usage_daily"."org_id")) WITH CHECK ((select auth.org_id() = "org_usage_daily"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "org_usage_daily" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "org_usage_daily"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "role_permissions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "role_permissions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "role_permissions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "role_permissions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "role_permissions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "role_permissions"."org_id")) WITH CHECK ((select auth.org_id() = "role_permissions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "role_permissions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "role_permissions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "roles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "roles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "roles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "roles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "roles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "roles"."org_id")) WITH CHECK ((select auth.org_id() = "roles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "roles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "roles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "user_roles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "user_roles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "user_roles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "user_roles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "user_roles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "user_roles"."org_id")) WITH CHECK ((select auth.org_id() = "user_roles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "user_roles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "user_roles"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "user_scopes" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "user_scopes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "user_scopes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "user_scopes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "user_scopes" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "user_scopes"."org_id")) WITH CHECK ((select auth.org_id() = "user_scopes"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "user_scopes" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "user_scopes"."org_id"));