CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid,
	"site_id" uuid,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"name" text NOT NULL,
	"legal_name" text,
	"registration_no" text,
	"tax_id" text,
	"base_currency" text DEFAULT 'MYR' NOT NULL,
	"fiscal_year_start" integer DEFAULT 1,
	"address" jsonb,
	CONSTRAINT "companies_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "companies" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "currencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"symbol" text,
	"minor_units" integer DEFAULT 2 NOT NULL,
	"is_base" boolean DEFAULT false NOT NULL,
	"fx_rate_to_base" numeric(20, 10) DEFAULT '1',
	"enabled" boolean DEFAULT true NOT NULL,
	CONSTRAINT "currencies_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "currencies" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "custom_field_sync_queue" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"queued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_error" text,
	"next_retry_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	CONSTRAINT "custom_field_sync_queue_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "custom_field_sync_queue" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "custom_field_values" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"field_id" uuid NOT NULL,
	"value_text" text,
	"value_int" integer,
	"value_numeric" numeric(20, 10),
	"value_bool" boolean,
	"value_date" date,
	"value_ts" timestamp with time zone,
	"value_json" jsonb,
	"value_uuid" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"source" text DEFAULT 'user' NOT NULL,
	CONSTRAINT "custom_field_values_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "custom_field_values_source_chk" CHECK (source IN ('user','rule','import','system')),
	CONSTRAINT "custom_field_values_exactly_one_typed_col" CHECK ((
        (value_text    IS NOT NULL)::int +
        (value_int     IS NOT NULL)::int +
        (value_numeric IS NOT NULL)::int +
        (value_bool    IS NOT NULL)::int +
        (value_date    IS NOT NULL)::int +
        (value_ts      IS NOT NULL)::int +
        (value_json    IS NOT NULL)::int +
        (value_uuid    IS NOT NULL)::int
        = 1
      ))
);
--> statement-breakpoint
ALTER TABLE "custom_field_values" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "custom_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"entity_type" text NOT NULL,
	"field_name" text NOT NULL,
	"field_label" text NOT NULL,
	"field_type" text NOT NULL,
	"type_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"storage_mode" text DEFAULT 'jsonb_only' NOT NULL,
	"default_value" jsonb,
	"is_required" boolean DEFAULT false NOT NULL,
	"is_searchable" boolean DEFAULT false NOT NULL,
	"is_filterable" boolean DEFAULT false NOT NULL,
	"is_sortable" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"section" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL,
	"is_deprecated" boolean DEFAULT false NOT NULL,
	"is_unique" boolean DEFAULT false NOT NULL,
	"schema_hash" text NOT NULL,
	CONSTRAINT "custom_fields_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "custom_fields_field_name_snake" CHECK (field_name ~ '^[a-z][a-z0-9_]*$'),
	CONSTRAINT "custom_fields_storage_mode_chk" CHECK (storage_mode IN ('jsonb_only','indexed')),
	CONSTRAINT "custom_fields_required_needs_default" CHECK (is_required = false OR default_value IS NOT NULL),
	CONSTRAINT "custom_fields_type_config_is_object" CHECK (jsonb_typeof(type_config) = 'object'),
	CONSTRAINT "custom_fields_type_config_enum_choices" CHECK (field_type NOT IN ('enum','multi_enum') OR (type_config ? 'choices')),
	CONSTRAINT "custom_fields_type_config_short_text_maxlen" CHECK (field_type <> 'short_text' OR (type_config ? 'maxLength')),
	CONSTRAINT "custom_fields_type_config_entity_ref_target" CHECK (field_type <> 'entity_ref' OR (type_config ? 'targetEntity'))
);
--> statement-breakpoint
ALTER TABLE "custom_fields" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "entity_view_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"view_id" uuid NOT NULL,
	"field_source" text NOT NULL,
	"field_key" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"is_sortable" boolean DEFAULT true NOT NULL,
	"is_filterable" boolean DEFAULT true NOT NULL,
	"column_width" integer,
	"component_override" text,
	CONSTRAINT "entity_view_fields_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "entity_view_fields_source_chk" CHECK (field_source IN ('core','module','custom'))
);
--> statement-breakpoint
ALTER TABLE "entity_view_fields" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "entity_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"entity_type" text NOT NULL,
	"view_name" text NOT NULL,
	"view_type" text DEFAULT 'table' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "entity_views_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "entity_views_view_type_chk" CHECK (view_type IN ('table','form','kanban','detail'))
);
--> statement-breakpoint
ALTER TABLE "entity_views" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "meta_alias_resolution_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"scope_type" text NOT NULL,
	"scope_key" text NOT NULL,
	"alias_set_id" uuid NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meta_alias_resolution_rules_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "meta_alias_resolution_rules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "meta_alias_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"set_key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"locale" text,
	"is_default" boolean DEFAULT false NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meta_alias_sets_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "meta_alias_sets_set_key_snake" CHECK (set_key ~ '^[a-z][a-z0-9_]*$')
);
--> statement-breakpoint
ALTER TABLE "meta_alias_sets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "meta_aliases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"alias_set_id" uuid NOT NULL,
	"target_type" text NOT NULL,
	"target_key" text NOT NULL,
	"alias" text NOT NULL,
	"alias_slug" text,
	"description" text,
	"synonyms" text[] DEFAULT '{}'::text[] NOT NULL,
	"is_primary" boolean DEFAULT true NOT NULL,
	"effective_from" timestamp with time zone DEFAULT now() NOT NULL,
	"effective_to" timestamp with time zone,
	"search_text" text,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meta_aliases_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "meta_aliases_alias_not_empty" CHECK (alias <> ''),
	CONSTRAINT "meta_aliases_slug_kebab" CHECK (alias_slug IS NULL OR alias_slug ~ '^[a-z0-9][a-z0-9-]*$'),
	CONSTRAINT "meta_aliases_target_key_asset_chk" CHECK (target_type <> 'asset' OR target_key LIKE 'db.%'),
	CONSTRAINT "meta_aliases_target_key_custom_field_chk" CHECK (target_type <> 'custom_field' OR target_key LIKE '%.custom:%'),
	CONSTRAINT "meta_aliases_target_key_metric_chk" CHECK (target_type <> 'metric' OR target_key LIKE 'metric:%'),
	CONSTRAINT "meta_aliases_target_key_view_field_chk" CHECK (target_type <> 'view_field' OR target_key LIKE 'view:%'),
	CONSTRAINT "meta_aliases_target_key_enum_value_chk" CHECK (target_type <> 'enum_value' OR target_key LIKE 'enum:%')
);
--> statement-breakpoint
ALTER TABLE "meta_aliases" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "meta_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"asset_type" text NOT NULL,
	"asset_key" text NOT NULL,
	"canonical_name" text NOT NULL,
	"display_name" text NOT NULL,
	"description" text,
	"owner_team" text,
	"steward_user" text,
	"classification" text,
	"quality_tier" text,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meta_assets_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "meta_assets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "meta_lineage_edges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"from_asset_id" uuid NOT NULL,
	"to_asset_id" uuid NOT NULL,
	"edge_type" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meta_lineage_edges_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "meta_lineage_edges" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "meta_quality_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"target_asset_id" uuid NOT NULL,
	"rule_type" text NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"last_run_at" timestamp with time zone,
	"last_run_status" text,
	"last_run_detail" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meta_quality_checks_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "meta_quality_checks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "meta_semantic_terms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"term_key" text NOT NULL,
	"name" text NOT NULL,
	"definition" text,
	"examples" text[],
	"classification" text,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meta_semantic_terms_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "meta_semantic_terms_term_key_snake" CHECK (term_key ~ '^[a-z][a-z0-9_]*$')
);
--> statement-breakpoint
ALTER TABLE "meta_semantic_terms" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "meta_term_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"term_id" uuid NOT NULL,
	"target_key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meta_term_links_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "meta_term_links" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "meta_value_aliases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"alias_set_id" uuid NOT NULL,
	"target_key" text NOT NULL,
	"alias" text NOT NULL,
	"synonyms" text[] DEFAULT '{}'::text[] NOT NULL,
	"effective_from" timestamp with time zone DEFAULT now() NOT NULL,
	"effective_to" timestamp with time zone,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	CONSTRAINT "meta_value_aliases_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "meta_value_aliases_target_enum_chk" CHECK (target_key LIKE 'enum:%'),
	CONSTRAINT "meta_value_aliases_alias_not_empty" CHECK (alias <> '')
);
--> statement-breakpoint
ALTER TABLE "meta_value_aliases" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "number_sequences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"company_id" uuid,
	"entity_type" text NOT NULL,
	"prefix" text DEFAULT '' NOT NULL,
	"suffix" text DEFAULT '' NOT NULL,
	"next_value" integer DEFAULT 1 NOT NULL,
	"pad_length" integer DEFAULT 5 NOT NULL,
	"fiscal_year" integer,
	CONSTRAINT "number_sequences_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "number_sequences" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT (auth.user_id()) NOT NULL,
	"updated_by" text DEFAULT (auth.user_id()) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" text,
	"company_id" uuid,
	"site_id" uuid,
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"type" text NOT NULL,
	"address" jsonb,
	CONSTRAINT "sites_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "sites_type_chk" CHECK (type IN ('warehouse','branch','plant','office'))
);
--> statement-breakpoint
ALTER TABLE "sites" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "uom" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"name" text NOT NULL,
	"symbol" text NOT NULL,
	"type" text NOT NULL,
	CONSTRAINT "uom_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "uom_type_chk" CHECK (type IN ('weight','volume','length','area','count','time','custom'))
);
--> statement-breakpoint
ALTER TABLE "uom" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "uom_conversions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text DEFAULT (auth.require_org_id()) NOT NULL,
	"from_uom_id" uuid NOT NULL,
	"to_uom_id" uuid NOT NULL,
	"factor" numeric(20, 10) NOT NULL,
	CONSTRAINT "uom_conversions_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "uom_conversions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
-- Must create composite unique index BEFORE the composite FK that references it
CREATE UNIQUE INDEX "custom_fields_org_entity_id_uniq" ON "custom_fields" USING btree ("org_id","entity_type","id");--> statement-breakpoint
ALTER TABLE "custom_field_values" ADD CONSTRAINT "custom_field_values_field_fk" FOREIGN KEY ("org_id","entity_type","field_id") REFERENCES "public"."custom_fields"("org_id","entity_type","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entity_view_fields" ADD CONSTRAINT "entity_view_fields_view_id_entity_views_id_fk" FOREIGN KEY ("view_id") REFERENCES "public"."entity_views"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_alias_resolution_rules" ADD CONSTRAINT "meta_alias_resolution_rules_alias_set_id_meta_alias_sets_id_fk" FOREIGN KEY ("alias_set_id") REFERENCES "public"."meta_alias_sets"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_aliases" ADD CONSTRAINT "meta_aliases_alias_set_id_meta_alias_sets_id_fk" FOREIGN KEY ("alias_set_id") REFERENCES "public"."meta_alias_sets"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_lineage_edges" ADD CONSTRAINT "meta_lineage_edges_from_asset_id_meta_assets_id_fk" FOREIGN KEY ("from_asset_id") REFERENCES "public"."meta_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_lineage_edges" ADD CONSTRAINT "meta_lineage_edges_to_asset_id_meta_assets_id_fk" FOREIGN KEY ("to_asset_id") REFERENCES "public"."meta_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_quality_checks" ADD CONSTRAINT "meta_quality_checks_target_asset_id_meta_assets_id_fk" FOREIGN KEY ("target_asset_id") REFERENCES "public"."meta_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_term_links" ADD CONSTRAINT "meta_term_links_term_id_meta_semantic_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."meta_semantic_terms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_value_aliases" ADD CONSTRAINT "meta_value_aliases_alias_set_id_meta_alias_sets_id_fk" FOREIGN KEY ("alias_set_id") REFERENCES "public"."meta_alias_sets"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "companies_org_id_idx" ON "companies" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "companies_org_created_idx" ON "companies" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "currencies_org_id_idx" ON "currencies" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "currencies_org_code_uniq" ON "currencies" USING btree ("org_id","code");--> statement-breakpoint
CREATE INDEX "custom_field_sync_queue_pending_retry_idx" ON "custom_field_sync_queue" USING btree ("next_retry_at");--> statement-breakpoint
CREATE UNIQUE INDEX "custom_field_values_org_entity_field_uniq" ON "custom_field_values" USING btree ("org_id","entity_id","field_id");--> statement-breakpoint
CREATE INDEX "custom_field_values_entity_lookup_idx" ON "custom_field_values" USING btree ("org_id","entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "custom_field_values_field_lookup_idx" ON "custom_field_values" USING btree ("org_id","entity_type","field_id");--> statement-breakpoint
CREATE INDEX "custom_fields_org_id_idx" ON "custom_fields" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "custom_fields_org_entity_field_name_uniq" ON "custom_fields" USING btree ("org_id","entity_type","field_name");--> statement-breakpoint
CREATE INDEX "entity_view_fields_org_id_idx" ON "entity_view_fields" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "entity_view_fields_org_view_field_key_uniq" ON "entity_view_fields" USING btree ("org_id","view_id","field_key");--> statement-breakpoint
CREATE INDEX "entity_views_org_id_idx" ON "entity_views" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "entity_views_org_entity_view_name_uniq" ON "entity_views" USING btree ("org_id","entity_type","view_name");--> statement-breakpoint
CREATE INDEX "meta_alias_resolution_rules_org_id_idx" ON "meta_alias_resolution_rules" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "meta_alias_resolution_rules_scope_uniq" ON "meta_alias_resolution_rules" USING btree ("org_id","scope_type","scope_key");--> statement-breakpoint
CREATE INDEX "meta_alias_sets_org_id_idx" ON "meta_alias_sets" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "meta_aliases_org_id_idx" ON "meta_aliases" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "meta_assets_org_id_idx" ON "meta_assets" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "meta_assets_org_asset_key_uniq" ON "meta_assets" USING btree ("org_id","asset_key");--> statement-breakpoint
CREATE INDEX "meta_lineage_edges_org_id_idx" ON "meta_lineage_edges" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "meta_lineage_edges_uniq" ON "meta_lineage_edges" USING btree ("org_id","from_asset_id","to_asset_id","edge_type");--> statement-breakpoint
CREATE INDEX "meta_quality_checks_org_id_idx" ON "meta_quality_checks" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "meta_semantic_terms_org_id_idx" ON "meta_semantic_terms" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "meta_term_links_org_id_idx" ON "meta_term_links" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "meta_term_links_uniq" ON "meta_term_links" USING btree ("org_id","term_id","target_key");--> statement-breakpoint
CREATE INDEX "meta_value_aliases_org_id_idx" ON "meta_value_aliases" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "number_sequences_org_id_idx" ON "number_sequences" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "number_sequences_org_company_entity_fy_uniq" ON "number_sequences" USING btree ("org_id","company_id","entity_type","fiscal_year");--> statement-breakpoint
CREATE INDEX "sites_org_id_idx" ON "sites" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "sites_org_created_idx" ON "sites" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "sites_org_code_uniq" ON "sites" USING btree ("org_id","code");--> statement-breakpoint
CREATE INDEX "uom_org_id_idx" ON "uom" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "uom_org_symbol_uniq" ON "uom" USING btree ("org_id","symbol");--> statement-breakpoint
CREATE INDEX "uom_conversions_org_id_idx" ON "uom_conversions" USING btree ("org_id","id");--> statement-breakpoint
CREATE UNIQUE INDEX "uom_conversions_org_from_to_uniq" ON "uom_conversions" USING btree ("org_id","from_uom_id","to_uom_id");--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "companies" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "companies"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "companies" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "companies"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "companies" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "companies"."org_id")) WITH CHECK ((select auth.org_id() = "companies"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "companies" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "companies"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "currencies" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "currencies"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "currencies" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "currencies"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "currencies" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "currencies"."org_id")) WITH CHECK ((select auth.org_id() = "currencies"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "currencies" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "currencies"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "custom_field_sync_queue" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "custom_field_sync_queue"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "custom_field_sync_queue" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "custom_field_sync_queue"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "custom_field_sync_queue" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "custom_field_sync_queue"."org_id")) WITH CHECK ((select auth.org_id() = "custom_field_sync_queue"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "custom_field_sync_queue" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "custom_field_sync_queue"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "custom_field_values" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "custom_field_values"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "custom_field_values" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "custom_field_values"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "custom_field_values" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "custom_field_values"."org_id")) WITH CHECK ((select auth.org_id() = "custom_field_values"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "custom_field_values" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "custom_field_values"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "custom_fields" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "custom_fields"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "custom_fields" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "custom_fields"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "custom_fields" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "custom_fields"."org_id")) WITH CHECK ((select auth.org_id() = "custom_fields"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "custom_fields" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "custom_fields"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "entity_view_fields" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "entity_view_fields"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "entity_view_fields" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "entity_view_fields"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "entity_view_fields" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "entity_view_fields"."org_id")) WITH CHECK ((select auth.org_id() = "entity_view_fields"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "entity_view_fields" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "entity_view_fields"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "entity_views" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "entity_views"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "entity_views" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "entity_views"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "entity_views" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "entity_views"."org_id")) WITH CHECK ((select auth.org_id() = "entity_views"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "entity_views" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "entity_views"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "meta_alias_resolution_rules" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "meta_alias_resolution_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "meta_alias_resolution_rules" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "meta_alias_resolution_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "meta_alias_resolution_rules" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "meta_alias_resolution_rules"."org_id")) WITH CHECK ((select auth.org_id() = "meta_alias_resolution_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "meta_alias_resolution_rules" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "meta_alias_resolution_rules"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "meta_alias_sets" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "meta_alias_sets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "meta_alias_sets" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "meta_alias_sets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "meta_alias_sets" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "meta_alias_sets"."org_id")) WITH CHECK ((select auth.org_id() = "meta_alias_sets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "meta_alias_sets" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "meta_alias_sets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "meta_aliases" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "meta_aliases"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "meta_aliases" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "meta_aliases"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "meta_aliases" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "meta_aliases"."org_id")) WITH CHECK ((select auth.org_id() = "meta_aliases"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "meta_aliases" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "meta_aliases"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "meta_assets" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "meta_assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "meta_assets" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "meta_assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "meta_assets" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "meta_assets"."org_id")) WITH CHECK ((select auth.org_id() = "meta_assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "meta_assets" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "meta_assets"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "meta_lineage_edges" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "meta_lineage_edges"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "meta_lineage_edges" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "meta_lineage_edges"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "meta_lineage_edges" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "meta_lineage_edges"."org_id")) WITH CHECK ((select auth.org_id() = "meta_lineage_edges"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "meta_lineage_edges" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "meta_lineage_edges"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "meta_quality_checks" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "meta_quality_checks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "meta_quality_checks" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "meta_quality_checks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "meta_quality_checks" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "meta_quality_checks"."org_id")) WITH CHECK ((select auth.org_id() = "meta_quality_checks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "meta_quality_checks" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "meta_quality_checks"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "meta_semantic_terms" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "meta_semantic_terms"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "meta_semantic_terms" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "meta_semantic_terms"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "meta_semantic_terms" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "meta_semantic_terms"."org_id")) WITH CHECK ((select auth.org_id() = "meta_semantic_terms"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "meta_semantic_terms" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "meta_semantic_terms"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "meta_term_links" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "meta_term_links"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "meta_term_links" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "meta_term_links"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "meta_term_links" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "meta_term_links"."org_id")) WITH CHECK ((select auth.org_id() = "meta_term_links"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "meta_term_links" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "meta_term_links"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "meta_value_aliases" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "meta_value_aliases"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "meta_value_aliases" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "meta_value_aliases"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "meta_value_aliases" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "meta_value_aliases"."org_id")) WITH CHECK ((select auth.org_id() = "meta_value_aliases"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "meta_value_aliases" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "meta_value_aliases"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "number_sequences" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "number_sequences"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "number_sequences" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "number_sequences"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "number_sequences" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "number_sequences"."org_id")) WITH CHECK ((select auth.org_id() = "number_sequences"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "number_sequences" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "number_sequences"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "sites" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "sites"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "sites" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "sites"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "sites" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "sites"."org_id")) WITH CHECK ((select auth.org_id() = "sites"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "sites" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "sites"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "uom" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "uom"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "uom" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "uom"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "uom" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "uom"."org_id")) WITH CHECK ((select auth.org_id() = "uom"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "uom" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "uom"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "uom_conversions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "uom_conversions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "uom_conversions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "uom_conversions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "uom_conversions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "uom_conversions"."org_id")) WITH CHECK ((select auth.org_id() = "uom_conversions"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "uom_conversions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "uom_conversions"."org_id"));--> statement-breakpoint

-- ============================================================
-- Phase A Supplement: Partial unique indexes, GIN, expression
-- indexes, and search_text trigger that Drizzle cannot express.
-- ============================================================

-- custom_fields: hot query index (active, non-deprecated fields)
CREATE INDEX IF NOT EXISTS custom_fields_active_by_entity
  ON custom_fields (org_id, entity_type, display_order, field_name)
  WHERE is_active = true AND is_deprecated = false;--> statement-breakpoint

-- custom_fields: case-insensitive field lookup
CREATE INDEX IF NOT EXISTS custom_fields_lower_field_name_idx
  ON custom_fields (org_id, entity_type, lower(field_name));--> statement-breakpoint

-- custom_field_values: per-type partial indexes
CREATE INDEX IF NOT EXISTS custom_field_values_text_idx
  ON custom_field_values (org_id, entity_type, field_id, value_text)
  WHERE value_text IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS custom_field_values_int_idx
  ON custom_field_values (org_id, entity_type, field_id, value_int)
  WHERE value_int IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS custom_field_values_numeric_idx
  ON custom_field_values (org_id, entity_type, field_id, value_numeric)
  WHERE value_numeric IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS custom_field_values_date_idx
  ON custom_field_values (org_id, entity_type, field_id, value_date)
  WHERE value_date IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS custom_field_values_ts_idx
  ON custom_field_values (org_id, entity_type, field_id, value_ts)
  WHERE value_ts IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS custom_field_values_bool_idx
  ON custom_field_values (org_id, entity_type, field_id, value_bool)
  WHERE value_bool IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS custom_field_values_uuid_idx
  ON custom_field_values (org_id, entity_type, field_id, value_uuid)
  WHERE value_uuid IS NOT NULL;--> statement-breakpoint

-- meta_alias_sets: partial unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS meta_alias_sets_set_key_uniq
  ON meta_alias_sets (org_id, set_key)
  WHERE is_deleted = false;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS meta_alias_sets_one_default_per_org
  ON meta_alias_sets (org_id)
  WHERE is_default = true AND is_deleted = false;--> statement-breakpoint

-- meta_aliases: search_text trigger (array_to_string is not IMMUTABLE,
-- so we use a trigger instead of GENERATED ALWAYS AS)
CREATE OR REPLACE FUNCTION public.meta_aliases_search_text_trigger()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_text := NEW.alias || ' ' || array_to_string(NEW.synonyms, ' ') || ' ' || NEW.target_key;
  RETURN NEW;
END;
$$;--> statement-breakpoint
CREATE TRIGGER trg_meta_aliases_search_text
  BEFORE INSERT OR UPDATE ON meta_aliases
  FOR EACH ROW EXECUTE FUNCTION public.meta_aliases_search_text_trigger();--> statement-breakpoint

-- meta_aliases: partial unique indexes + GIN search
CREATE UNIQUE INDEX IF NOT EXISTS meta_aliases_active_target_uniq
  ON meta_aliases (org_id, alias_set_id, target_key)
  WHERE effective_to IS NULL AND is_deleted = false;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS meta_aliases_active_slug_uniq
  ON meta_aliases (org_id, alias_set_id, alias_slug)
  WHERE effective_to IS NULL AND is_deleted = false AND alias_slug IS NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS meta_aliases_search_gin
  ON meta_aliases USING GIN (to_tsvector('simple', coalesce(search_text, '')))
  WHERE is_deleted = false;--> statement-breakpoint

-- meta_alias_resolution_rules: priority DESC lookup index
CREATE INDEX IF NOT EXISTS meta_alias_resolution_rules_lookup
  ON meta_alias_resolution_rules (org_id, scope_type, scope_key, is_active, priority DESC);--> statement-breakpoint

-- meta_value_aliases: partial unique index
CREATE UNIQUE INDEX IF NOT EXISTS meta_value_aliases_active_target_uniq
  ON meta_value_aliases (org_id, alias_set_id, target_key)
  WHERE effective_to IS NULL AND is_deleted = false;--> statement-breakpoint

-- meta_semantic_terms: partial unique index
CREATE UNIQUE INDEX IF NOT EXISTS meta_semantic_terms_term_key_uniq
  ON meta_semantic_terms (org_id, term_key)
  WHERE is_deleted = false;