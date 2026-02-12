ALTER TABLE "contacts" ADD COLUMN "company_id" uuid;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "site_id" uuid;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "custom_data" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "doc_status" text DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "submitted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "submitted_by" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "cancelled_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "cancelled_by" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "amended_from_id" uuid;