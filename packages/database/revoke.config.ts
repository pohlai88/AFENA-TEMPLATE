/**
 * Revoke config — append-only list of tables where UPDATE/DELETE is revoked.
 * Generator validates each name exists in discovered tables.
 *
 * GAP-DB-003: stock_balances; Gate 6: search_documents (projection worker-only).
 */

/** Append-only. Generator validates each name exists in discovered tables. */
export const REVOKE_UPDATE_DELETE_TABLES = [
  'audit_logs',
  'stock_movements',
  'stock_balances',
  'wip_movements',
  'depreciation_schedules',
  'asset_events',
  'reporting_snapshots',
  'approval_decisions',
  'webhook_deliveries',
  'bank_statement_lines',
  'search_documents',
] as const;
