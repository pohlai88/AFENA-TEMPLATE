CREATE TABLE "currency_exchanges" (
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
	"date" date NOT NULL,
	"from_currency" uuid NOT NULL,
	"to_currency" uuid NOT NULL,
	"exchange_rate" numeric(18, 6) NOT NULL,
	"for_buying" boolean DEFAULT false,
	"for_selling" boolean DEFAULT false,
	CONSTRAINT "currency_exchanges_org_id_id_pk" PRIMARY KEY("org_id","id"),
	CONSTRAINT "currency_exchanges_org_not_empty" CHECK (org_id <> ''),
	CONSTRAINT "currency_exchanges_rate_positive" CHECK (exchange_rate > 0)
);
--> statement-breakpoint
ALTER TABLE "currency_exchanges" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "currency_exchanges_org_created_id_idx" ON "currency_exchanges" USING btree ("org_id","created_at" desc,"id" desc);--> statement-breakpoint
CREATE INDEX "currency_exchanges_org_date_idx" ON "currency_exchanges" USING btree ("org_id","date");--> statement-breakpoint
CREATE INDEX "currency_exchanges_org_pair_idx" ON "currency_exchanges" USING btree ("org_id","from_currency","to_currency");--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "currency_exchanges" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.org_id() = "currency_exchanges"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "currency_exchanges" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.org_id() = "currency_exchanges"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "currency_exchanges" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.org_id() = "currency_exchanges"."org_id")) WITH CHECK ((select auth.org_id() = "currency_exchanges"."org_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "currency_exchanges" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.org_id() = "currency_exchanges"."org_id"));