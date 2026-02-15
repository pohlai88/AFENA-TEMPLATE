-- Diagnose schema drift between Neon database and Drizzle schema

-- 1. Check if audit_logs exists and its structure
SELECT 
    'audit_logs_check' as check_type,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs') as exists,
    (SELECT string_agg(column_name, ', ' ORDER BY ordinal_position) 
     FROM information_schema.columns 
     WHERE table_name = 'audit_logs') as columns;

-- 2. List all tables with 'audit' in name (old partitioned tables)
SELECT 
    'audit_related_tables' as check_type,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name LIKE '%audit%'
ORDER BY table_name;

-- 3. Check companies table primary key
SELECT
    'companies_pk_check' as check_type,
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints
WHERE table_name = 'companies' AND constraint_type = 'PRIMARY KEY';

-- 4. Count existing composite foreign keys referencing companies
SELECT
    'composite_fks_count' as check_type,
    COUNT(*) as existing_composite_fks
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND kcu.column_name IN ('org_id', 'company_id')
    AND tc.constraint_name LIKE '%_company_fk';

-- 5. List tables missing composite FKs (from allowlist)
WITH allowlist AS (
    SELECT unnest(ARRAY[
        'chart_of_accounts', 'fiscal_periods', 'budgets', 'bank_accounts',
        'bank_reconciliation_sessions', 'journal_entries', 'journal_lines',
        'sales_invoices', 'purchase_invoices', 'sales_orders', 'purchase_orders',
        'delivery_notes', 'goods_receipts', 'quotations', 'credit_notes',
        'payments', 'payment_allocations', 'contracts', 'purchase_requests',
        'landed_cost_docs', 'work_orders', 'sites', 'warehouses', 'stock_balances',
        'stock_movements', 'lot_tracking', 'wip_movements', 'boms', 'cost_centers',
        'projects', 'company_addresses', 'price_lists', 'discount_rules',
        'customer_profiles', 'supplier_profiles', 'number_sequences', 'r2_files',
        'fixed_assets', 'revenue_schedules', 'reporting_snapshots', 'match_results',
        'debit_notes', 'bank_statement_lines'
    ]) as table_name
)
SELECT
    'missing_composite_fks' as check_type,
    a.table_name,
    CASE WHEN tc.constraint_name IS NULL THEN 'MISSING' ELSE 'EXISTS' END as fk_status
FROM allowlist a
LEFT JOIN information_schema.table_constraints tc
    ON a.table_name = tc.table_name 
    AND tc.constraint_type = 'FOREIGN KEY'
    AND tc.constraint_name LIKE '%_company_fk'
WHERE EXISTS (SELECT 1 FROM information_schema.tables t WHERE t.table_name = a.table_name)
ORDER BY fk_status DESC, a.table_name;
