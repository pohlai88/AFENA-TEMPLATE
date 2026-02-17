ALTER TABLE "tasks" ALTER COLUMN "expected_time" SET DATA TYPE numeric(18, 2);--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "duration" SET DATA TYPE numeric(18, 2);--> statement-breakpoint
ALTER TABLE "activity_costs" ADD CONSTRAINT "activity_costs_activity_type_activity_types_id_fk" FOREIGN KEY ("activity_type") REFERENCES "public"."activity_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dependent_tasks" ADD CONSTRAINT "dependent_tasks_task_tasks_id_fk" FOREIGN KEY ("task") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dependent_tasks" ADD CONSTRAINT "dependent_tasks_dependent_task_tasks_id_fk" FOREIGN KEY ("dependent_task") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_projects_id_fk" FOREIGN KEY ("project") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_parent_task_tasks_id_fk" FOREIGN KEY ("parent_task") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timesheet_details" ADD CONSTRAINT "timesheet_details_activity_type_activity_types_id_fk" FOREIGN KEY ("activity_type") REFERENCES "public"."activity_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timesheet_details" ADD CONSTRAINT "timesheet_details_project_projects_id_fk" FOREIGN KEY ("project") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timesheet_details" ADD CONSTRAINT "timesheet_details_task_tasks_id_fk" FOREIGN KEY ("task") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "psoa_projects" ADD CONSTRAINT "psoa_projects_project_name_projects_id_fk" FOREIGN KEY ("project_name") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_types" ADD CONSTRAINT "activity_types_org_name_unique" UNIQUE("org_id","activity_type");--> statement-breakpoint
ALTER TABLE "project_types" ADD CONSTRAINT "project_types_org_name_unique" UNIQUE("org_id","name");