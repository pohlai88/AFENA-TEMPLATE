ALTER TABLE "project_types" DROP CONSTRAINT "project_types_org_id_id_pk";--> statement-breakpoint
ALTER TABLE "holiday_lists" ALTER COLUMN "from_date" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "holiday_lists" ALTER COLUMN "from_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "holiday_lists" ALTER COLUMN "to_date" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "holiday_lists" ALTER COLUMN "to_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "holiday_lists" ALTER COLUMN "total_holidays" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "holiday_lists" ALTER COLUMN "total_holidays" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "holidays" ALTER COLUMN "holiday_date" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "holidays" ALTER COLUMN "holiday_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "holidays" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "holidays" ADD COLUMN "weekly_off" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "designations_org_name_idx" ON "designations" USING btree ("org_id","designation_name");--> statement-breakpoint
CREATE INDEX "employee_groups_org_name_idx" ON "employee_groups" USING btree ("org_id","employee_group_name");--> statement-breakpoint
CREATE INDEX "holiday_lists_org_name_idx" ON "holiday_lists" USING btree ("org_id","holiday_list_name");--> statement-breakpoint
CREATE INDEX "holiday_lists_org_country_idx" ON "holiday_lists" USING btree ("org_id","country");--> statement-breakpoint
CREATE INDEX "holidays_org_date_idx" ON "holidays" USING btree ("org_id","holiday_date");--> statement-breakpoint
ALTER TABLE "holidays" DROP COLUMN "weekly";