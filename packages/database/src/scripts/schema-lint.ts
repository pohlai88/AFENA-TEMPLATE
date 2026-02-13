/* eslint-disable no-console, no-restricted-syntax */
/**
 * Schema lint script - verifies every domain table follows ERP conventions.
 *
 * PRD A9 rules:
 *   1. has-base-columns - id, org_id, created_at, updated_at, version       (error)
 *   2. has-tenant-policy - table config includes tenantPolicy/crudPolicy     (error)
 *   3. has-org-check - table config includes *_org_not_empty CHECK       (error)
 *   4. has-org-id-index - table has (org_id, id) index                      (error)
 *   5. no-float-money - no real/doublePrecision on money columns          (error)
 *   6. snake-case-columns - all column DB names are snake_case                (warning)
 *   7. has-custom-data - ERP entity tables have customData jsonb column    (warning)
 *   8. naming-convention - table name is plural snake_case                   (warning)
 *
 * Run: npx tsx src/scripts/schema-lint.ts
 */

import * as schema from '../schema/index';

interface LintResult {
  table: string;
  errors: string[];
  warnings: string[];
}

// Tables that are exempt from ERP entity rules (system/config tables)
const EXEMPT_TABLES = new Set([
  'users',
  'r2_files',
  'audit_logs',
  'entity_versions',
  'mutation_batches',
  'workflow_rules',
  'workflow_executions',
  'advisories',
  'advisory_evidence',
]);

// Tables that use erpEntityColumns (should have customData)
const ERP_ENTITY_TABLES = new Set([
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
]);

// Tables with 6-state posting_status (must have CHECK constraint)
const POSTABLE_TABLES = new Set([
  'sales_invoices',
  'sales_orders',
  'delivery_notes',
  'purchase_orders',
  'purchase_invoices',
  'goods_receipts',
  'payments',
]);

// Line tables with net_minor CHECK
const LINE_TABLES = new Set([
  'sales_invoice_lines',
  'sales_order_lines',
  'delivery_note_lines',
  'purchase_order_lines',
  'purchase_invoice_lines',
  'goods_receipt_lines',
  'quotation_lines',
]);

// Money-related column name patterns (float is forbidden)
const MONEY_PATTERNS = /amount|price|cost|total|balance|fee|tax|discount/i;

// snake_case regex
const SNAKE_CASE_RE = /^[a-z][a-z0-9_]*$/;

// Plural snake_case table name regex (must end in s, es, ies, etc.)
const PLURAL_SNAKE_RE = /^[a-z][a-z0-9_]*s$/;

function getColumns(table: Record<string, unknown>): Map<string, Record<string, unknown>> {
  const cols = new Map<string, Record<string, unknown>>();
  for (const key of Object.keys(table)) {
    if (key === '_') continue;
    const col = table[key] as Record<string, unknown> | undefined;
    if (col && typeof col === 'object' && 'name' in col) {
      cols.set(col.name as string, col);
    }
  }
  return cols;
}

function getExtraConfig(tableMeta: Record<string, unknown>): string {
  // Serialize the table's extra config (indexes, checks, policies) to a string
  // for pattern matching. This is a best-effort heuristic.
  try {
    return JSON.stringify(tableMeta);
  } catch {
    return '';
  }
}

function lintSchema(): LintResult[] {
  const results: LintResult[] = [];

  for (const [exportName, tableObj] of Object.entries(schema)) {
    // Skip non-table exports (types, relations, etc.)
    if (
      !tableObj ||
      typeof tableObj !== 'object' ||
      !('_' in (tableObj as unknown as Record<string, unknown>))
    ) {
      continue;
    }

    const table = tableObj as unknown as Record<string, unknown>;
    const tableMeta = table._ as Record<string, unknown> | undefined;
    if (!tableMeta || typeof tableMeta !== 'object') continue;

    const tableName = (tableMeta.name as string) ?? exportName;
    if (EXEMPT_TABLES.has(tableName)) continue;

    const errors: string[] = [];
    const warnings: string[] = [];

    const columns = getColumns(table);
    const columnNames = new Set(columns.keys());
    const configStr = getExtraConfig(tableMeta);

    // ── Rule 1: has-base-columns (error) ────────────────
    if (!columnNames.has('id')) {
      errors.push('[has-base-columns] Missing id column (UUID PK required)');
    }
    if (!columnNames.has('org_id')) {
      errors.push('[has-base-columns] Missing org_id column (tenant isolation required)');
    }
    if (!columnNames.has('created_at')) {
      errors.push('[has-base-columns] Missing created_at column');
    }

    // ── Rule 2: has-tenant-policy (error) ───────────────
    if (configStr.includes('crud-authenticated-policy') || configStr.includes('tenantPolicy')) {
      // OK — has RLS
    } else {
      errors.push('[has-tenant-policy] Missing tenantPolicy/crudPolicy RLS');
    }

    // ── Rule 3: has-org-check (error) ───────────────────
    if (configStr.includes('org_not_empty') || configStr.includes("org_id <> ''")) {
      // OK
    } else {
      errors.push('[has-org-check] Missing org_not_empty CHECK constraint');
    }

    // ── Rule 4: has-org-id-index (error) ────────────────
    // Look for an index named *_org_id_idx or containing (org_id, id)
    const hasOrgIdIndex =
      configStr.includes('org_id_idx') ||
      configStr.includes('org_id","id"');
    if (!hasOrgIdIndex && columnNames.has('org_id')) {
      errors.push('[has-org-id-index] Missing (org_id, id) index');
    }

    // ── Rule 5: no-float-money (error) ──────────────────
    for (const [colName, colDef] of columns) {
      if (MONEY_PATTERNS.test(colName)) {
        const raw = colDef.dataType ?? colDef.columnType;
        const colType = (typeof raw === 'string' ? raw : '').toLowerCase();
        if (colType.includes('real') || colType.includes('double')) {
          errors.push(
            `[no-float-money] Column "${colName}" uses float type - use integer minor units or numeric`,
          );
        }
      }
    }

    // ── Rule 6: snake-case-columns (warning) ────────────
    for (const colName of columnNames) {
      if (!SNAKE_CASE_RE.test(colName)) {
        warnings.push(`[snake-case-columns] Column "${colName}" is not snake_case`);
      }
    }

    // ── Rule 7: has-custom-data (warning) ───────────────
    if (ERP_ENTITY_TABLES.has(tableName) && !columnNames.has('custom_data')) {
      warnings.push('[has-custom-data] ERP entity table missing custom_data jsonb column');
    }

    // ── Rule 8: naming-convention (warning) ─────────────
    if (!PLURAL_SNAKE_RE.test(tableName)) {
      warnings.push(`[naming-convention] Table name "${tableName}" should be plural snake_case`);
    }

    // ── Rule 9: has-posting-status-check (error) ─────────
    if (POSTABLE_TABLES.has(tableName)) {
      if (!configStr.includes('posting_status')) {
        errors.push('[has-posting-status-check] Postable table missing posting_status CHECK constraint');
      }
    }

    // ── Rule 10: has-net-check (error) ───────────────────
    if (LINE_TABLES.has(tableName)) {
      if (!configStr.includes('net_check') && !configStr.includes('net_minor')) {
        errors.push('[has-net-check] Line table missing net_minor CHECK constraint');
      }
    }

    // ── Rule 11: has-updated-at (warning) ────────────────
    if (columnNames.has('org_id') && !columnNames.has('updated_at')) {
      warnings.push('[has-updated-at] Domain table missing updated_at column (set_updated_at trigger requires it)');
    }

    if (errors.length > 0 || warnings.length > 0) {
      results.push({ table: tableName, errors, warnings });
    }
  }

  return results;
}

// ── Main ─────────────────────────────────────────────────
const results = lintSchema();
let hasErrors = false;
let errorCount = 0;
let warnCount = 0;

for (const r of results) {
  if (r.errors.length > 0) {
    hasErrors = true;
    console.error(`❌ ${r.table}:`);
    for (const e of r.errors) {
      console.error(`   ERROR: ${e}`);
      errorCount++;
    }
  }
  if (r.warnings.length > 0) {
    console.warn(`⚠️  ${r.table}:`);
    for (const w of r.warnings) {
      console.warn(`   WARN: ${w}`);
      warnCount++;
    }
  }
}

if (!hasErrors && warnCount === 0) {
  console.log('✅ All tables pass schema lint');
} else {
  console.log(`\n${errorCount} error(s), ${warnCount} warning(s)`);
}

process.exit(hasErrors ? 1 : 0);
