-- Migration: Composite PK for Truth Tables (GAP-DB-001)
-- Converts single-column PK (id) to composite PK (org_id, id) for truth tables.
-- EXCLUDES org_usage_daily (has org_id, day; no id column).
--
-- Idempotent: DROP CONSTRAINT IF EXISTS + ADD CONSTRAINT.
-- Tables already with (org_id, id) will be updated to same.

BEGIN;

-- addresses
ALTER TABLE addresses DROP CONSTRAINT IF EXISTS addresses_pkey;
ALTER TABLE addresses ADD CONSTRAINT addresses_pkey PRIMARY KEY (org_id, id);

-- bank_accounts
ALTER TABLE bank_accounts DROP CONSTRAINT IF EXISTS bank_accounts_pkey;
ALTER TABLE bank_accounts ADD CONSTRAINT bank_accounts_pkey PRIMARY KEY (org_id, id);

-- bank_reconciliation_sessions
ALTER TABLE bank_reconciliation_sessions DROP CONSTRAINT IF EXISTS bank_reconciliation_sessions_pkey;
ALTER TABLE bank_reconciliation_sessions ADD CONSTRAINT bank_reconciliation_sessions_pkey PRIMARY KEY (org_id, id);

-- bank_statement_lines
ALTER TABLE bank_statement_lines DROP CONSTRAINT IF EXISTS bank_statement_lines_pkey;
ALTER TABLE bank_statement_lines ADD CONSTRAINT bank_statement_lines_pkey PRIMARY KEY (org_id, id);

-- boms
ALTER TABLE boms DROP CONSTRAINT IF EXISTS boms_pkey;
ALTER TABLE boms ADD CONSTRAINT boms_pkey PRIMARY KEY (org_id, id);

-- bom_lines
ALTER TABLE bom_lines DROP CONSTRAINT IF EXISTS bom_lines_pkey;
ALTER TABLE bom_lines ADD CONSTRAINT bom_lines_pkey PRIMARY KEY (org_id, id);

-- budgets
ALTER TABLE budgets DROP CONSTRAINT IF EXISTS budgets_pkey;
ALTER TABLE budgets ADD CONSTRAINT budgets_pkey PRIMARY KEY (org_id, id);

-- budget_commitments
ALTER TABLE budget_commitments DROP CONSTRAINT IF EXISTS budget_commitments_pkey;
ALTER TABLE budget_commitments ADD CONSTRAINT budget_commitments_pkey PRIMARY KEY (org_id, id);

-- chart_of_accounts
ALTER TABLE chart_of_accounts DROP CONSTRAINT IF EXISTS chart_of_accounts_pkey;
ALTER TABLE chart_of_accounts ADD CONSTRAINT chart_of_accounts_pkey PRIMARY KEY (org_id, id);

-- communications
ALTER TABLE communications DROP CONSTRAINT IF EXISTS communications_pkey;
ALTER TABLE communications ADD CONSTRAINT communications_pkey PRIMARY KEY (org_id, id);

-- companies
ALTER TABLE companies DROP CONSTRAINT IF EXISTS companies_pkey;
ALTER TABLE companies ADD CONSTRAINT companies_pkey PRIMARY KEY (org_id, id);

-- contacts
ALTER TABLE contacts DROP CONSTRAINT IF EXISTS contacts_pkey;
ALTER TABLE contacts ADD CONSTRAINT contacts_pkey PRIMARY KEY (org_id, id);

-- contracts
ALTER TABLE contracts DROP CONSTRAINT IF EXISTS contracts_pkey;
ALTER TABLE contracts ADD CONSTRAINT contracts_pkey PRIMARY KEY (org_id, id);

-- cost_centers
ALTER TABLE cost_centers DROP CONSTRAINT IF EXISTS cost_centers_pkey;
ALTER TABLE cost_centers ADD CONSTRAINT cost_centers_pkey PRIMARY KEY (org_id, id);

-- credit_notes
ALTER TABLE credit_notes DROP CONSTRAINT IF EXISTS credit_notes_pkey;
ALTER TABLE credit_notes ADD CONSTRAINT credit_notes_pkey PRIMARY KEY (org_id, id);

-- currencies
ALTER TABLE currencies DROP CONSTRAINT IF EXISTS currencies_pkey;
ALTER TABLE currencies ADD CONSTRAINT currencies_pkey PRIMARY KEY (org_id, id);

-- custom_field_sync_queue
ALTER TABLE custom_field_sync_queue DROP CONSTRAINT IF EXISTS custom_field_sync_queue_pkey;
ALTER TABLE custom_field_sync_queue ADD CONSTRAINT custom_field_sync_queue_pkey PRIMARY KEY (org_id, id);

-- custom_field_values
ALTER TABLE custom_field_values DROP CONSTRAINT IF EXISTS custom_field_values_pkey;
ALTER TABLE custom_field_values ADD CONSTRAINT custom_field_values_pkey PRIMARY KEY (org_id, id);

-- custom_fields
ALTER TABLE custom_fields DROP CONSTRAINT IF EXISTS custom_fields_pkey;
ALTER TABLE custom_fields ADD CONSTRAINT custom_fields_pkey PRIMARY KEY (org_id, id);

-- customer_profiles
ALTER TABLE customer_profiles DROP CONSTRAINT IF EXISTS customer_profiles_pkey;
ALTER TABLE customer_profiles ADD CONSTRAINT customer_profiles_pkey PRIMARY KEY (org_id, id);

-- debit_notes
ALTER TABLE debit_notes DROP CONSTRAINT IF EXISTS debit_notes_pkey;
ALTER TABLE debit_notes ADD CONSTRAINT debit_notes_pkey PRIMARY KEY (org_id, id);

-- delivery_note_lines
ALTER TABLE delivery_note_lines DROP CONSTRAINT IF EXISTS delivery_note_lines_pkey;
ALTER TABLE delivery_note_lines ADD CONSTRAINT delivery_note_lines_pkey PRIMARY KEY (org_id, id);

-- delivery_notes
ALTER TABLE delivery_notes DROP CONSTRAINT IF EXISTS delivery_notes_pkey;
ALTER TABLE delivery_notes ADD CONSTRAINT delivery_notes_pkey PRIMARY KEY (org_id, id);

-- discount_rules
ALTER TABLE discount_rules DROP CONSTRAINT IF EXISTS discount_rules_pkey;
ALTER TABLE discount_rules ADD CONSTRAINT discount_rules_pkey PRIMARY KEY (org_id, id);

-- entity_attachments
ALTER TABLE entity_attachments DROP CONSTRAINT IF EXISTS entity_attachments_pkey;
ALTER TABLE entity_attachments ADD CONSTRAINT entity_attachments_pkey PRIMARY KEY (org_id, id);

-- entity_view_fields
ALTER TABLE entity_view_fields DROP CONSTRAINT IF EXISTS entity_view_fields_pkey;
ALTER TABLE entity_view_fields ADD CONSTRAINT entity_view_fields_pkey PRIMARY KEY (org_id, id);

-- entity_views
ALTER TABLE entity_views DROP CONSTRAINT IF EXISTS entity_views_pkey;
ALTER TABLE entity_views ADD CONSTRAINT entity_views_pkey PRIMARY KEY (org_id, id);

-- fiscal_periods
ALTER TABLE fiscal_periods DROP CONSTRAINT IF EXISTS fiscal_periods_pkey;
ALTER TABLE fiscal_periods ADD CONSTRAINT fiscal_periods_pkey PRIMARY KEY (org_id, id);

-- assets
ALTER TABLE assets DROP CONSTRAINT IF EXISTS assets_pkey;
ALTER TABLE assets ADD CONSTRAINT assets_pkey PRIMARY KEY (org_id, id);

-- depreciation_schedules
ALTER TABLE depreciation_schedules DROP CONSTRAINT IF EXISTS depreciation_schedules_pkey;
ALTER TABLE depreciation_schedules ADD CONSTRAINT depreciation_schedules_pkey PRIMARY KEY (org_id, id);

-- asset_events
ALTER TABLE asset_events DROP CONSTRAINT IF EXISTS asset_events_pkey;
ALTER TABLE asset_events ADD CONSTRAINT asset_events_pkey PRIMARY KEY (org_id, id);

-- fx_rates
ALTER TABLE fx_rates DROP CONSTRAINT IF EXISTS fx_rates_pkey;
ALTER TABLE fx_rates ADD CONSTRAINT fx_rates_pkey PRIMARY KEY (org_id, id);

-- goods_receipt_lines
ALTER TABLE goods_receipt_lines DROP CONSTRAINT IF EXISTS goods_receipt_lines_pkey;
ALTER TABLE goods_receipt_lines ADD CONSTRAINT goods_receipt_lines_pkey PRIMARY KEY (org_id, id);

-- goods_receipts
ALTER TABLE goods_receipts DROP CONSTRAINT IF EXISTS goods_receipts_pkey;
ALTER TABLE goods_receipts ADD CONSTRAINT goods_receipts_pkey PRIMARY KEY (org_id, id);

-- intercompany_transactions
ALTER TABLE intercompany_transactions DROP CONSTRAINT IF EXISTS intercompany_transactions_pkey;
ALTER TABLE intercompany_transactions ADD CONSTRAINT intercompany_transactions_pkey PRIMARY KEY (org_id, id);

-- item_groups
ALTER TABLE item_groups DROP CONSTRAINT IF EXISTS item_groups_pkey;
ALTER TABLE item_groups ADD CONSTRAINT item_groups_pkey PRIMARY KEY (org_id, id);

-- items
ALTER TABLE items DROP CONSTRAINT IF EXISTS items_pkey;
ALTER TABLE items ADD CONSTRAINT items_pkey PRIMARY KEY (org_id, id);

-- landed_cost_docs
ALTER TABLE landed_cost_docs DROP CONSTRAINT IF EXISTS landed_cost_docs_pkey;
ALTER TABLE landed_cost_docs ADD CONSTRAINT landed_cost_docs_pkey PRIMARY KEY (org_id, id);

-- landed_cost_allocations
ALTER TABLE landed_cost_allocations DROP CONSTRAINT IF EXISTS landed_cost_allocations_pkey;
ALTER TABLE landed_cost_allocations ADD CONSTRAINT landed_cost_allocations_pkey PRIMARY KEY (org_id, id);

-- lot_tracking
ALTER TABLE lot_tracking DROP CONSTRAINT IF EXISTS lot_tracking_pkey;
ALTER TABLE lot_tracking ADD CONSTRAINT lot_tracking_pkey PRIMARY KEY (org_id, id);

-- match_results
ALTER TABLE match_results DROP CONSTRAINT IF EXISTS match_results_pkey;
ALTER TABLE match_results ADD CONSTRAINT match_results_pkey PRIMARY KEY (org_id, id);

-- meta_aliases
ALTER TABLE meta_aliases DROP CONSTRAINT IF EXISTS meta_aliases_pkey;
ALTER TABLE meta_aliases ADD CONSTRAINT meta_aliases_pkey PRIMARY KEY (org_id, id);

-- meta_alias_resolution_rules
ALTER TABLE meta_alias_resolution_rules DROP CONSTRAINT IF EXISTS meta_alias_resolution_rules_pkey;
ALTER TABLE meta_alias_resolution_rules ADD CONSTRAINT meta_alias_resolution_rules_pkey PRIMARY KEY (org_id, id);

-- meta_alias_sets
ALTER TABLE meta_alias_sets DROP CONSTRAINT IF EXISTS meta_alias_sets_pkey;
ALTER TABLE meta_alias_sets ADD CONSTRAINT meta_alias_sets_pkey PRIMARY KEY (org_id, id);

-- meta_assets
ALTER TABLE meta_assets DROP CONSTRAINT IF EXISTS meta_assets_pkey;
ALTER TABLE meta_assets ADD CONSTRAINT meta_assets_pkey PRIMARY KEY (org_id, id);

-- meta_lineage_edges
ALTER TABLE meta_lineage_edges DROP CONSTRAINT IF EXISTS meta_lineage_edges_pkey;
ALTER TABLE meta_lineage_edges ADD CONSTRAINT meta_lineage_edges_pkey PRIMARY KEY (org_id, id);

-- meta_quality_checks
ALTER TABLE meta_quality_checks DROP CONSTRAINT IF EXISTS meta_quality_checks_pkey;
ALTER TABLE meta_quality_checks ADD CONSTRAINT meta_quality_checks_pkey PRIMARY KEY (org_id, id);

-- meta_semantic_terms
ALTER TABLE meta_semantic_terms DROP CONSTRAINT IF EXISTS meta_semantic_terms_pkey;
ALTER TABLE meta_semantic_terms ADD CONSTRAINT meta_semantic_terms_pkey PRIMARY KEY (org_id, id);

-- meta_value_aliases
ALTER TABLE meta_value_aliases DROP CONSTRAINT IF EXISTS meta_value_aliases_pkey;
ALTER TABLE meta_value_aliases ADD CONSTRAINT meta_value_aliases_pkey PRIMARY KEY (org_id, id);

-- migration_checkpoints
ALTER TABLE migration_checkpoints DROP CONSTRAINT IF EXISTS migration_checkpoints_pkey;
ALTER TABLE migration_checkpoints ADD CONSTRAINT migration_checkpoints_pkey PRIMARY KEY (org_id, id);

-- migration_conflict_resolutions
ALTER TABLE migration_conflict_resolutions DROP CONSTRAINT IF EXISTS migration_conflict_resolutions_pkey;
ALTER TABLE migration_conflict_resolutions ADD CONSTRAINT migration_conflict_resolutions_pkey PRIMARY KEY (org_id, id);

-- migration_conflicts
ALTER TABLE migration_conflicts DROP CONSTRAINT IF EXISTS migration_conflicts_pkey;
ALTER TABLE migration_conflicts ADD CONSTRAINT migration_conflicts_pkey PRIMARY KEY (org_id, id);

-- migration_jobs
ALTER TABLE migration_jobs DROP CONSTRAINT IF EXISTS migration_jobs_pkey;
ALTER TABLE migration_jobs ADD CONSTRAINT migration_jobs_pkey PRIMARY KEY (org_id, id);

-- migration_lineage
ALTER TABLE migration_lineage DROP CONSTRAINT IF EXISTS migration_lineage_pkey;
ALTER TABLE migration_lineage ADD CONSTRAINT migration_lineage_pkey PRIMARY KEY (org_id, id);

-- migration_merge_explanations
ALTER TABLE migration_merge_explanations DROP CONSTRAINT IF EXISTS migration_merge_explanations_pkey;
ALTER TABLE migration_merge_explanations ADD CONSTRAINT migration_merge_explanations_pkey PRIMARY KEY (org_id, id);

-- migration_quarantine
ALTER TABLE migration_quarantine DROP CONSTRAINT IF EXISTS migration_quarantine_pkey;
ALTER TABLE migration_quarantine ADD CONSTRAINT migration_quarantine_pkey PRIMARY KEY (org_id, id);

-- migration_reports
ALTER TABLE migration_reports DROP CONSTRAINT IF EXISTS migration_reports_pkey;
ALTER TABLE migration_reports ADD CONSTRAINT migration_reports_pkey PRIMARY KEY (org_id, id);

-- migration_row_snapshots
ALTER TABLE migration_row_snapshots DROP CONSTRAINT IF EXISTS migration_row_snapshots_pkey;
ALTER TABLE migration_row_snapshots ADD CONSTRAINT migration_row_snapshots_pkey PRIMARY KEY (org_id, id);

-- number_sequences
ALTER TABLE number_sequences DROP CONSTRAINT IF EXISTS number_sequences_pkey;
ALTER TABLE number_sequences ADD CONSTRAINT number_sequences_pkey PRIMARY KEY (org_id, id);

-- payment_allocations
ALTER TABLE payment_allocations DROP CONSTRAINT IF EXISTS payment_allocations_pkey;
ALTER TABLE payment_allocations ADD CONSTRAINT payment_allocations_pkey PRIMARY KEY (org_id, id);

-- payment_terms
ALTER TABLE payment_terms DROP CONSTRAINT IF EXISTS payment_terms_pkey;
ALTER TABLE payment_terms ADD CONSTRAINT payment_terms_pkey PRIMARY KEY (org_id, id);

-- payments
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_pkey;
ALTER TABLE payments ADD CONSTRAINT payments_pkey PRIMARY KEY (org_id, id);

-- price_list_items
ALTER TABLE price_list_items DROP CONSTRAINT IF EXISTS price_list_items_pkey;
ALTER TABLE price_list_items ADD CONSTRAINT price_list_items_pkey PRIMARY KEY (org_id, id);

-- price_lists
ALTER TABLE price_lists DROP CONSTRAINT IF EXISTS price_lists_pkey;
ALTER TABLE price_lists ADD CONSTRAINT price_lists_pkey PRIMARY KEY (org_id, id);

-- projects
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_pkey;
ALTER TABLE projects ADD CONSTRAINT projects_pkey PRIMARY KEY (org_id, id);

-- purchase_invoice_lines
ALTER TABLE purchase_invoice_lines DROP CONSTRAINT IF EXISTS purchase_invoice_lines_pkey;
ALTER TABLE purchase_invoice_lines ADD CONSTRAINT purchase_invoice_lines_pkey PRIMARY KEY (org_id, id);

-- purchase_invoices
ALTER TABLE purchase_invoices DROP CONSTRAINT IF EXISTS purchase_invoices_pkey;
ALTER TABLE purchase_invoices ADD CONSTRAINT purchase_invoices_pkey PRIMARY KEY (org_id, id);

-- purchase_order_lines
ALTER TABLE purchase_order_lines DROP CONSTRAINT IF EXISTS purchase_order_lines_pkey;
ALTER TABLE purchase_order_lines ADD CONSTRAINT purchase_order_lines_pkey PRIMARY KEY (org_id, id);

-- purchase_orders
ALTER TABLE purchase_orders DROP CONSTRAINT IF EXISTS purchase_orders_pkey;
ALTER TABLE purchase_orders ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (org_id, id);

-- purchase_requests
ALTER TABLE purchase_requests DROP CONSTRAINT IF EXISTS purchase_requests_pkey;
ALTER TABLE purchase_requests ADD CONSTRAINT purchase_requests_pkey PRIMARY KEY (org_id, id);

-- quotation_lines
ALTER TABLE quotation_lines DROP CONSTRAINT IF EXISTS quotation_lines_pkey;
ALTER TABLE quotation_lines ADD CONSTRAINT quotation_lines_pkey PRIMARY KEY (org_id, id);

-- quotations
ALTER TABLE quotations DROP CONSTRAINT IF EXISTS quotations_pkey;
ALTER TABLE quotations ADD CONSTRAINT quotations_pkey PRIMARY KEY (org_id, id);

-- revenue_schedule_lines
ALTER TABLE revenue_schedule_lines DROP CONSTRAINT IF EXISTS revenue_schedule_lines_pkey;
ALTER TABLE revenue_schedule_lines ADD CONSTRAINT revenue_schedule_lines_pkey PRIMARY KEY (org_id, id);

-- revenue_schedules
ALTER TABLE revenue_schedules DROP CONSTRAINT IF EXISTS revenue_schedules_pkey;
ALTER TABLE revenue_schedules ADD CONSTRAINT revenue_schedules_pkey PRIMARY KEY (org_id, id);

-- sales_invoice_lines
ALTER TABLE sales_invoice_lines DROP CONSTRAINT IF EXISTS sales_invoice_lines_pkey;
ALTER TABLE sales_invoice_lines ADD CONSTRAINT sales_invoice_lines_pkey PRIMARY KEY (org_id, id);

-- sales_invoices
ALTER TABLE sales_invoices DROP CONSTRAINT IF EXISTS sales_invoices_pkey;
ALTER TABLE sales_invoices ADD CONSTRAINT sales_invoices_pkey PRIMARY KEY (org_id, id);

-- sales_order_lines
ALTER TABLE sales_order_lines DROP CONSTRAINT IF EXISTS sales_order_lines_pkey;
ALTER TABLE sales_order_lines ADD CONSTRAINT sales_order_lines_pkey PRIMARY KEY (org_id, id);

-- sales_orders
ALTER TABLE sales_orders DROP CONSTRAINT IF EXISTS sales_orders_pkey;
ALTER TABLE sales_orders ADD CONSTRAINT sales_orders_pkey PRIMARY KEY (org_id, id);

-- sites
ALTER TABLE sites DROP CONSTRAINT IF EXISTS sites_pkey;
ALTER TABLE sites ADD CONSTRAINT sites_pkey PRIMARY KEY (org_id, id);

-- stock_movements
ALTER TABLE stock_movements DROP CONSTRAINT IF EXISTS stock_movements_pkey;
ALTER TABLE stock_movements ADD CONSTRAINT stock_movements_pkey PRIMARY KEY (org_id, id);

-- supplier_profiles
ALTER TABLE supplier_profiles DROP CONSTRAINT IF EXISTS supplier_profiles_pkey;
ALTER TABLE supplier_profiles ADD CONSTRAINT supplier_profiles_pkey PRIMARY KEY (org_id, id);

-- tax_rates
ALTER TABLE tax_rates DROP CONSTRAINT IF EXISTS tax_rates_pkey;
ALTER TABLE tax_rates ADD CONSTRAINT tax_rates_pkey PRIMARY KEY (org_id, id);

-- uom
ALTER TABLE uom DROP CONSTRAINT IF EXISTS uom_pkey;
ALTER TABLE uom ADD CONSTRAINT uom_pkey PRIMARY KEY (org_id, id);

-- uom_conversions
ALTER TABLE uom_conversions DROP CONSTRAINT IF EXISTS uom_conversions_pkey;
ALTER TABLE uom_conversions ADD CONSTRAINT uom_conversions_pkey PRIMARY KEY (org_id, id);

-- warehouses
ALTER TABLE warehouses DROP CONSTRAINT IF EXISTS warehouses_pkey;
ALTER TABLE warehouses ADD CONSTRAINT warehouses_pkey PRIMARY KEY (org_id, id);

-- webhook_deliveries
ALTER TABLE webhook_deliveries DROP CONSTRAINT IF EXISTS webhook_deliveries_pkey;
ALTER TABLE webhook_deliveries ADD CONSTRAINT webhook_deliveries_pkey PRIMARY KEY (org_id, id);

-- webhook_endpoints
ALTER TABLE webhook_endpoints DROP CONSTRAINT IF EXISTS webhook_endpoints_pkey;
ALTER TABLE webhook_endpoints ADD CONSTRAINT webhook_endpoints_pkey PRIMARY KEY (org_id, id);

-- wip_movements
ALTER TABLE wip_movements DROP CONSTRAINT IF EXISTS wip_movements_pkey;
ALTER TABLE wip_movements ADD CONSTRAINT wip_movements_pkey PRIMARY KEY (org_id, id);

-- work_orders
ALTER TABLE work_orders DROP CONSTRAINT IF EXISTS work_orders_pkey;
ALTER TABLE work_orders ADD CONSTRAINT work_orders_pkey PRIMARY KEY (org_id, id);

-- approval_chains
ALTER TABLE approval_chains DROP CONSTRAINT IF EXISTS approval_chains_pkey;
ALTER TABLE approval_chains ADD CONSTRAINT approval_chains_pkey PRIMARY KEY (org_id, id);

-- approval_steps
ALTER TABLE approval_steps DROP CONSTRAINT IF EXISTS approval_steps_pkey;
ALTER TABLE approval_steps ADD CONSTRAINT approval_steps_pkey PRIMARY KEY (org_id, id);

-- approval_requests
ALTER TABLE approval_requests DROP CONSTRAINT IF EXISTS approval_requests_pkey;
ALTER TABLE approval_requests ADD CONSTRAINT approval_requests_pkey PRIMARY KEY (org_id, id);

-- approval_decisions
ALTER TABLE approval_decisions DROP CONSTRAINT IF EXISTS approval_decisions_pkey;
ALTER TABLE approval_decisions ADD CONSTRAINT approval_decisions_pkey PRIMARY KEY (org_id, id);

-- doc_postings (GAP-DB-008 doc_version already applied; composite PK for consistency)
ALTER TABLE doc_postings DROP CONSTRAINT IF EXISTS doc_postings_pkey;
ALTER TABLE doc_postings ADD CONSTRAINT doc_postings_pkey PRIMARY KEY (org_id, id);

COMMIT;

-- EXCLUDED (applied manually or different schema):
-- stock_balances: applied via Neon MCP 2026-02-15 (projection table)
-- companies: already (org_id, id); FK deps block DROP
-- entity_views, entity_view_fields: FK cycle
-- meta_alias_sets, meta_semantic_terms: FK deps
-- migration_reports: no org_id column
-- org_usage_daily: PK (org_id, day), no id column
