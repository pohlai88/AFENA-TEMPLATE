/**
 * Schema lint configuration — single source for exempt/override tables.
 * Reduces hardcoded lists in schema-lint.ts; add new tables here when needed.
 */
export const schemaLintConfig = {
  /** Tables exempt from ERP entity rules (system/config tables) */
  exemptTables: [
    'users',
    'r2_files',
    'audit_logs',
    'entity_versions',
    'mutation_batches',
    'workflow_rules',
    'workflow_executions',
    'advisories',
    'advisory_evidence',
  ] as const,

  /** Tables that use erpEntityColumns (should have customData) — extend as new ERP entities are added */
  erpEntityTables: [
    'companies',
    'sites',
    'contacts',
    'sales_invoices',
    'sales_orders',
    'delivery_notes',
    'purchase_orders',
    'purchase_invoices',
    'goods_receipts',
    'payments',
    'quotations',
  ] as const,

  /** Tables with 6-state posting_status (must have CHECK constraint) */
  postableTables: [
    'sales_invoices',
    'sales_orders',
    'delivery_notes',
    'purchase_orders',
    'purchase_invoices',
    'goods_receipts',
    'payments',
  ] as const,

  /** Line tables with net_minor CHECK */
  lineTables: [
    'sales_invoice_lines',
    'sales_order_lines',
    'delivery_note_lines',
    'purchase_order_lines',
    'purchase_invoice_lines',
    'goods_receipt_lines',
    'quotation_lines',
  ] as const,
} as const;

export type SchemaLintConfig = typeof schemaLintConfig;
