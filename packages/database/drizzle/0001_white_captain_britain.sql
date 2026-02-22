CREATE TABLE "inventory_valuation_items" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid DEFAULT (auth.org_id()::uuid) NOT NULL,
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
	"item_id" uuid NOT NULL,
	"period_key" text NOT NULL,
	"cost_method" text NOT NULL,
	"currency_code" text NOT NULL,
	"total_cost_minor" bigint DEFAULT 0 NOT NULL,
	"unit_cost_minor" bigint DEFAULT 0 NOT NULL,
	"nrv_minor" bigint DEFAULT 0 NOT NULL,
	"writedown_minor" bigint DEFAULT 0 NOT NULL,
	"quantity_on_hand" numeric(18, 6) DEFAULT '0' NOT NULL,
	CONSTRAINT "inventory_valuation_items_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "inventory_valuation_items_org_not_empty" CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid),
	CONSTRAINT "inventory_valuation_items_valid_cost_method" CHECK (cost_method IN ('fifo', 'weighted-average', 'specific-identification')),
	CONSTRAINT "inventory_valuation_items_period_format" CHECK (period_key ~ '^[0-9]{4}-P[0-9]{1,2}$')
);
--> statement-breakpoint
ALTER TABLE "inventory_valuation_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "inventory_valuation_items_org_created_idx" ON "inventory_valuation_items" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq__inv_val_items__org_company_item_period" ON "inventory_valuation_items" USING btree ("org_id","company_id","item_id","period_key");--> statement-breakpoint
CREATE INDEX "inventory_valuation_items_org_company_item_idx" ON "inventory_valuation_items" USING btree ("org_id","company_id","item_id");--> statement-breakpoint
CREATE INDEX "inventory_valuation_items_org_company_period_idx" ON "inventory_valuation_items" USING btree ("org_id","company_id","period_key");--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "inventory_valuation_items" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id()::uuid = "inventory_valuation_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "inventory_valuation_items" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id()::uuid = "inventory_valuation_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "inventory_valuation_items" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id()::uuid = "inventory_valuation_items"."org_id")) WITH CHECK ((select auth.org_id()::uuid = "inventory_valuation_items"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "inventory_valuation_items" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id()::uuid = "inventory_valuation_items"."org_id"));