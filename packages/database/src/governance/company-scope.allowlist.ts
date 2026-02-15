/**
 * Company Scope Allowlist — Contract Over Prose
 * 
 * RULE C-01: A table gets company_id only if semantics require it:
 * - LEGAL: Legal ownership / statutory reporting
 * - OPERATIONS: Operational ownership (warehouse, inventory)
 * - ISSUER: Document numbering / issuer identity
 * 
 * This file is the single source of truth for CI validation.
 * Any table with company_id not in this list will FAIL CI.
 */

export type CompanyScope = 'LEGAL' | 'OPERATIONS' | 'ISSUER';

export const COMPANY_SCOPED_TABLES: Record<string, CompanyScope> = {
  // GL/Accounting (LEGAL) — Legal entity = accounting entity
  chart_of_accounts: 'LEGAL',
  fiscal_periods: 'LEGAL',
  budgets: 'LEGAL',
  bank_accounts: 'LEGAL',
  bank_statements: 'LEGAL',
  bank_reconciliation_sessions: 'LEGAL',
  bank_statement_lines: 'LEGAL',

  // Approval workflow
  approval_chains: 'ISSUER',

  // Fixed assets
  assets: 'LEGAL',

  // Line tables (Phase 3 cleanup: derive from header)
  delivery_note_lines: 'ISSUER',
  goods_receipt_lines: 'ISSUER',
  landed_cost_docs: 'ISSUER',
  purchase_invoice_lines: 'ISSUER',
  purchase_order_lines: 'ISSUER',
  sales_invoice_lines: 'ISSUER',
  sales_order_lines: 'ISSUER',
  journal_entries: 'LEGAL',
  journal_lines: 'LEGAL',
  fixed_assets: 'LEGAL',
  revenue_schedules: 'LEGAL',
  reporting_snapshots: 'LEGAL',

  // AR/AP Documents (ISSUER) — Legal entity issues documents
  sales_invoices: 'ISSUER',
  purchase_invoices: 'ISSUER',
  sales_orders: 'ISSUER',
  purchase_orders: 'ISSUER',
  delivery_notes: 'ISSUER',
  goods_receipts: 'ISSUER',
  quotations: 'ISSUER',
  credit_notes: 'ISSUER',
  debit_notes: 'ISSUER',
  payments: 'ISSUER',
  payment_allocations: 'ISSUER',
  contracts: 'ISSUER',
  purchase_requests: 'ISSUER',
  landed_costs: 'ISSUER',
  work_orders: 'ISSUER',

  // Inventory/Operations (OPERATIONS) — Company owns/operates
  sites: 'OPERATIONS',
  warehouses: 'OPERATIONS',
  stock_balances: 'OPERATIONS',
  stock_movements: 'OPERATIONS',
  lot_tracking: 'OPERATIONS',
  wip_movements: 'OPERATIONS',
  boms: 'OPERATIONS',

  // Company-specific config (LEGAL/OPERATIONS)
  cost_centers: 'LEGAL',
  projects: 'LEGAL',
  company_addresses: 'LEGAL', // Junction table

  // Master data with company overrides (nullable, overlay pattern)
  price_lists: 'OPERATIONS', // nullable until overlay created
  discount_rules: 'OPERATIONS', // nullable until overlay created
  customer_profiles: 'OPERATIONS', // nullable = org-wide contact
  supplier_profiles: 'OPERATIONS', // nullable = org-wide contact

  // System with company context (nullable)
  number_sequences: 'ISSUER', // nullable for org-wide sequences
  r2_files: 'OPERATIONS', // nullable = org-wide files

  // 3-way match
  match_results: 'OPERATIONS',
};

/**
 * Line tables that should NOT have company_id (derive from header)
 * 
 * These tables currently have company_id but SHOULD remove it.
 * They're tracked here for Phase 3 cleanup.
 */
export const LINE_TABLES_TO_CLEAN: string[] = [
  'sales_invoice_lines',
  'purchase_invoice_lines',
  'sales_order_lines',
  'purchase_order_lines',
  'delivery_note_lines',
  'goods_receipt_lines',
];

/**
 * Tables that must have company_id NOT NULL
 * (ISSUER/LEGAL/OPERATIONS with required company scope)
 */
export const COMPANY_REQUIRED_TABLES = Object.entries(COMPANY_SCOPED_TABLES)
  .filter(([table, scope]) =>
    !['price_lists', 'discount_rules', 'customer_profiles', 'supplier_profiles', 'number_sequences', 'r2_files', 'approval_chains'].includes(table) &&
    (scope === 'ISSUER' ||
      scope === 'LEGAL' ||
      (scope === 'OPERATIONS' && !['price_lists', 'discount_rules', 'customer_profiles', 'supplier_profiles', 'r2_files'].includes(table)))
  )
  .map(([table]) => table);
