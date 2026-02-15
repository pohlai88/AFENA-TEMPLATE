DROP INDEX "bank_acct_org_id_idx";--> statement-breakpoint
DROP INDEX "journal_lines_entry_idx";--> statement-breakpoint
ALTER TABLE "bank_reconciliation_sessions" ADD CONSTRAINT "bank_reconciliation_sessions_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD CONSTRAINT "bank_statement_lines_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "boms" ADD CONSTRAINT "boms_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "chart_of_accounts" ADD CONSTRAINT "chart_of_accounts_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "discount_rules" ADD CONSTRAINT "discount_rules_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "fiscal_periods" ADD CONSTRAINT "fiscal_periods_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "journal_lines" ADD CONSTRAINT "journal_lines_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "landed_cost_docs" ADD CONSTRAINT "landed_cost_docs_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "lot_tracking" ADD CONSTRAINT "lot_tracking_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "match_results" ADD CONSTRAINT "match_results_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "purchase_requests" ADD CONSTRAINT "purchase_requests_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "r2_files" ADD CONSTRAINT "r2_files_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "reporting_snapshots" ADD CONSTRAINT "reporting_snapshots_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "revenue_schedules" ADD CONSTRAINT "revenue_schedules_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "wip_movements" ADD CONSTRAINT "wip_movements_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_org_id_id_pk" PRIMARY KEY("org_id","id");--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_reconciliation_sessions" ADD CONSTRAINT "bank_reconciliation_sessions_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_statement_lines" ADD CONSTRAINT "bank_statement_lines_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boms" ADD CONSTRAINT "boms_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chart_of_accounts" ADD CONSTRAINT "chart_of_accounts_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_addresses" ADD CONSTRAINT "company_addresses_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cost_centers" ADD CONSTRAINT "cost_centers_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_notes" ADD CONSTRAINT "credit_notes_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_profiles" ADD CONSTRAINT "customer_profiles_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "debit_notes" ADD CONSTRAINT "debit_notes_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_notes" ADD CONSTRAINT "delivery_notes_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discount_rules" ADD CONSTRAINT "discount_rules_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fiscal_periods" ADD CONSTRAINT "fiscal_periods_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_lines" ADD CONSTRAINT "journal_lines_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "landed_cost_docs" ADD CONSTRAINT "landed_cost_docs_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lot_tracking" ADD CONSTRAINT "lot_tracking_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_results" ADD CONSTRAINT "match_results_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_allocations" ADD CONSTRAINT "payment_allocations_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price_lists" ADD CONSTRAINT "price_lists_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_invoices" ADD CONSTRAINT "purchase_invoices_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_requests" ADD CONSTRAINT "purchase_requests_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "r2_files" ADD CONSTRAINT "r2_files_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reporting_snapshots" ADD CONSTRAINT "reporting_snapshots_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revenue_schedules" ADD CONSTRAINT "revenue_schedules_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_balances" ADD CONSTRAINT "stock_balances_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_profiles" ADD CONSTRAINT "supplier_profiles_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wip_movements" ADD CONSTRAINT "wip_movements_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_company_fk" FOREIGN KEY ("org_id","company_id") REFERENCES "public"."companies"("org_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bank_accounts_org_id_idx" ON "bank_accounts" USING btree ("org_id","id");--> statement-breakpoint
CREATE INDEX "journal_lines_org_entry_idx" ON "journal_lines" USING btree ("org_id","journal_entry_id");