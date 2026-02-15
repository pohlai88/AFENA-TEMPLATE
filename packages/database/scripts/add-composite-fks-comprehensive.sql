-- Comprehensive script to add composite FKs to all 44 allowlisted tables
-- Handles existing single-column PKs by replacing them with composite PKs

-- ============================================================================
-- PART 1: Fix Primary Keys (convert single-column to composite)
-- ============================================================================

-- Tables that need PK replacement (have single-column PKs, need composite)
DO $$
DECLARE
    table_name text;
    tables_to_fix text[] := ARRAY[
        'bank_statement_lines', 'boms', 'budgets', 'chart_of_accounts',
        'discount_rules', 'fiscal_periods', 'assets', 'journal_entries',
        'journal_lines', 'landed_cost_docs', 'lot_tracking', 'match_results',
        'reporting_snapshots', 'revenue_schedules', 'stock_movements',
        'wip_movements', 'work_orders'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables_to_fix
    LOOP
        -- Drop existing single-column PK if exists
        EXECUTE format('ALTER TABLE %I DROP CONSTRAINT IF EXISTS %I CASCADE', 
                      table_name, table_name || '_pkey');
        
        -- Add composite PK (org_id, id)
        EXECUTE format('ALTER TABLE %I ADD CONSTRAINT %I PRIMARY KEY (org_id, id)', 
                      table_name, table_name || '_pkey');
    END LOOP;
END $$;

-- ============================================================================
-- PART 2: Add Composite Foreign Keys (org_id, company_id) -> companies
-- ============================================================================

-- GL/Banking (6 tables)
ALTER TABLE bank_accounts ADD CONSTRAINT bank_accounts_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE bank_reconciliation_sessions ADD CONSTRAINT bank_reconciliation_sessions_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE bank_statement_lines ADD CONSTRAINT bank_statement_lines_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE budgets ADD CONSTRAINT budgets_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE chart_of_accounts ADD CONSTRAINT chart_of_accounts_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE fiscal_periods ADD CONSTRAINT fiscal_periods_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);

-- Fixed Assets & Revenue
ALTER TABLE assets ADD CONSTRAINT assets_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE revenue_schedules ADD CONSTRAINT revenue_schedules_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE reporting_snapshots ADD CONSTRAINT reporting_snapshots_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);

-- Journal Entries
ALTER TABLE journal_entries ADD CONSTRAINT journal_entries_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE journal_lines ADD CONSTRAINT journal_lines_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);

-- AR/AP Documents
ALTER TABLE sales_invoices ADD CONSTRAINT sales_invoices_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE purchase_invoices ADD CONSTRAINT purchase_invoices_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE sales_orders ADD CONSTRAINT sales_orders_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE purchase_orders ADD CONSTRAINT purchase_orders_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE delivery_notes ADD CONSTRAINT delivery_notes_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE goods_receipts ADD CONSTRAINT goods_receipts_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE quotations ADD CONSTRAINT quotations_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE credit_notes ADD CONSTRAINT credit_notes_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE debit_notes ADD CONSTRAINT debit_notes_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE payments ADD CONSTRAINT payments_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE payment_allocations ADD CONSTRAINT payment_allocations_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE landed_cost_docs ADD CONSTRAINT landed_cost_docs_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE work_orders ADD CONSTRAINT work_orders_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);

-- Inventory/Operations
ALTER TABLE sites ADD CONSTRAINT sites_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE warehouses ADD CONSTRAINT warehouses_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE stock_balances ADD CONSTRAINT stock_balances_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE stock_movements ADD CONSTRAINT stock_movements_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE lot_tracking ADD CONSTRAINT lot_tracking_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE wip_movements ADD CONSTRAINT wip_movements_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE boms ADD CONSTRAINT boms_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);

-- Config/Overlay
ALTER TABLE cost_centers ADD CONSTRAINT cost_centers_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE projects ADD CONSTRAINT projects_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE company_addresses ADD CONSTRAINT company_addresses_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE price_lists ADD CONSTRAINT price_lists_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id) ON DELETE CASCADE;
    
ALTER TABLE discount_rules ADD CONSTRAINT discount_rules_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id) ON DELETE CASCADE;
    
ALTER TABLE customer_profiles ADD CONSTRAINT customer_profiles_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id) ON DELETE SET NULL;
    
ALTER TABLE supplier_profiles ADD CONSTRAINT supplier_profiles_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id) ON DELETE SET NULL;
    
ALTER TABLE number_sequences ADD CONSTRAINT number_sequences_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    
ALTER TABLE r2_files ADD CONSTRAINT r2_files_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id) ON DELETE SET NULL;
    
ALTER TABLE match_results ADD CONSTRAINT match_results_company_fk 
    FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);

-- Add contracts and purchase_requests if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contracts') THEN
        ALTER TABLE contracts ADD CONSTRAINT contracts_company_fk 
            FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'purchase_requests') THEN
        ALTER TABLE purchase_requests ADD CONSTRAINT purchase_requests_company_fk 
            FOREIGN KEY (org_id, company_id) REFERENCES companies(org_id, id);
    END IF;
END $$;
