ALTER TABLE "users" ADD CONSTRAINT "users_user_id_unique" UNIQUE("user_id");--> statement-breakpoint
CREATE INDEX "users_user_id_idx" ON "users" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "r2_files_user_id_idx" ON "r2_files" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "r2_files" ADD CONSTRAINT "r2_files_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;