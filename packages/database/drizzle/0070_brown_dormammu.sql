CREATE TABLE "buying_settings" (
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
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"supplier_naming_by" text,
	"supp_master_name" text,
	"buying_price_list" text,
	"po_required" boolean DEFAULT false,
	"pr_required" boolean DEFAULT false,
	"maintain_same_rate" boolean DEFAULT false,
	"allow_multiple_suppliers_for_same_item" boolean DEFAULT false,
	"role_to_override_price_list_rate_validation" text,
	"blanket_order_allowance" integer,
	"auto_create_purchase_receipt" boolean DEFAULT false,
	"bill_for_rejected_quantity_in_purchase_invoice" boolean DEFAULT false,
	"backflush_raw_materials_of_subcontract_based_on" text,
	"over_transfer_allowance" integer,
	CONSTRAINT "buying_settings_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "buying_settings_org_singleton" UNIQUE("org_id"),
	CONSTRAINT "buying_settings_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "buying_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "designations" (
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
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"designation_name" text NOT NULL,
	"description" text,
	CONSTRAINT "designations_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "designations_org_name_unique" UNIQUE("org_id","designation_name"),
	CONSTRAINT "designations_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "designations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "employee_groups" (
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
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"employee_group_name" text NOT NULL,
	CONSTRAINT "employee_groups_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "employee_groups_org_name_unique" UNIQUE("org_id","employee_group_name"),
	CONSTRAINT "employee_groups_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "employee_groups" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "holiday_lists" (
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
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"holiday_list_name" text NOT NULL,
	"from_date" text,
	"to_date" text,
	"total_holidays" text,
	"weekly_off" text,
	"country" uuid,
	CONSTRAINT "holiday_lists_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "holiday_lists_org_name_unique" UNIQUE("org_id","holiday_list_name"),
	CONSTRAINT "holiday_lists_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "holiday_lists" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "holidays" (
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
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"parent" uuid NOT NULL,
	"holiday_date" text,
	"description" text,
	"weekly" boolean DEFAULT false,
	CONSTRAINT "holidays_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "holidays_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "holidays" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "manufacturing_settings" (
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
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"allow_production_on_holidays" boolean DEFAULT false,
	"allow_overlapping_work_orders" boolean DEFAULT false,
	"capacity_planning_for_work_order" boolean DEFAULT false,
	"default_wip_warehouse" text,
	"default_fg_warehouse" text,
	"default_scrap_warehouse" text,
	"update_bom_cost_automatically" boolean DEFAULT false,
	"make_serial_no_and_batch_from_work_order" boolean DEFAULT false,
	"material_consumption" boolean DEFAULT false,
	"material_transfer_for_manufacture" text,
	"backflush_raw_materials_based_on" text,
	"over_production_allowance_percentage" integer,
	"disable_capacity_planning" boolean DEFAULT false,
	"allow_multiple_work_orders" boolean DEFAULT false,
	CONSTRAINT "manufacturing_settings_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "manufacturing_settings_org_singleton" UNIQUE("org_id"),
	CONSTRAINT "manufacturing_settings_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "manufacturing_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "selling_settings" (
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
	"custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"customer_naming_by" text,
	"campaign_naming_by" text,
	"cust_master_name" text,
	"quotation_validity_days" integer,
	"so_required" boolean DEFAULT false,
	"dn_required" boolean DEFAULT false,
	"sales_update_frequency" text,
	"selling_price_list" text,
	"hide_customer_group" boolean DEFAULT false,
	"close_sales_order_on_delivery_note" boolean DEFAULT false,
	"allow_multiple_sales_orders_against_customers_po" boolean DEFAULT false,
	"validate_selling_price" boolean DEFAULT false,
	"maintain_same_rate" boolean DEFAULT false,
	"maintain_same_rate_throughout_sales_order" boolean DEFAULT false,
	"editable" boolean DEFAULT false,
	"allow_user_to_edit_rate_in_transactions" boolean DEFAULT false,
	"allow_item_to_be_added_multiple_times" boolean DEFAULT false,
	"allow_against_multiple_purchase_orders" boolean DEFAULT false,
	"role_to_override_price_list_rate_validation" text,
	"auto_fill_customer_details" boolean DEFAULT false,
	"enable_discount_accounting" boolean DEFAULT false,
	"book_deferred_entries_via_journal_entry" boolean DEFAULT false,
	"book_deferred_entries_based_on" text,
	"add_delivered_qty_in_sales_order" boolean DEFAULT false,
	CONSTRAINT "selling_settings_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "selling_settings_org_singleton" UNIQUE("org_id"),
	CONSTRAINT "selling_settings_org_not_empty" CHECK (org_id <> '')
);
--> statement-breakpoint
ALTER TABLE "selling_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_parent_holiday_lists_id_fk" FOREIGN KEY ("parent") REFERENCES "public"."holiday_lists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "buying_settings_org_created_id_idx" ON "buying_settings" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "designations_org_created_id_idx" ON "designations" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "employee_groups_org_created_id_idx" ON "employee_groups" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "holiday_lists_org_created_id_idx" ON "holiday_lists" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "holidays_org_created_id_idx" ON "holidays" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "holidays_org_parent_idx" ON "holidays" USING btree ("org_id","parent");--> statement-breakpoint
CREATE INDEX "manufacturing_settings_org_created_id_idx" ON "manufacturing_settings" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "selling_settings_org_created_id_idx" ON "selling_settings" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "buying_settings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "buying_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "buying_settings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "buying_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "buying_settings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "buying_settings"."org_id")) WITH CHECK ((select auth.org_id() = "buying_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "buying_settings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "buying_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "designations" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "designations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "designations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "designations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "designations" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "designations"."org_id")) WITH CHECK ((select auth.org_id() = "designations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "designations" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "designations"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "employee_groups" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "employee_groups"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "employee_groups" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "employee_groups"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "employee_groups" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "employee_groups"."org_id")) WITH CHECK ((select auth.org_id() = "employee_groups"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "employee_groups" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "employee_groups"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "holiday_lists" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "holiday_lists"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "holiday_lists" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "holiday_lists"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "holiday_lists" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "holiday_lists"."org_id")) WITH CHECK ((select auth.org_id() = "holiday_lists"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "holiday_lists" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "holiday_lists"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "holidays" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "holidays"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "holidays" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "holidays"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "holidays" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "holidays"."org_id")) WITH CHECK ((select auth.org_id() = "holidays"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "holidays" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "holidays"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "manufacturing_settings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "manufacturing_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "manufacturing_settings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "manufacturing_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "manufacturing_settings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "manufacturing_settings"."org_id")) WITH CHECK ((select auth.org_id() = "manufacturing_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "manufacturing_settings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "manufacturing_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "selling_settings" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "selling_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "selling_settings" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "selling_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "selling_settings" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "selling_settings"."org_id")) WITH CHECK ((select auth.org_id() = "selling_settings"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "selling_settings" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "selling_settings"."org_id"));