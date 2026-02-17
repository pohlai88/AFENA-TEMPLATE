ALTER TABLE "departments" ALTER COLUMN "is_group" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "departments" ALTER COLUMN "disabled" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "authorization_rules_org_transaction_idx" ON "authorization_rules" USING btree ("org_id","transaction");--> statement-breakpoint
CREATE INDEX "authorization_rules_org_company_idx" ON "authorization_rules" USING btree ("org_id","company");--> statement-breakpoint
CREATE INDEX "branches_org_branch_idx" ON "branches" USING btree ("org_id","branch");--> statement-breakpoint
CREATE INDEX "departments_org_name_idx" ON "departments" USING btree ("org_id","department_name");--> statement-breakpoint
CREATE INDEX "departments_org_company_idx" ON "departments" USING btree ("org_id","company");