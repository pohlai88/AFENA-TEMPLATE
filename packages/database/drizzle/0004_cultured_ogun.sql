ALTER TABLE "r2_files" DROP CONSTRAINT "r2_files_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "r2_files" ADD CONSTRAINT "r2_files_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;