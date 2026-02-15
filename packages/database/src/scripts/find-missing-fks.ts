/* eslint-disable no-console, no-restricted-syntax */
/**
 * Find missing FK constraints - identifies *_id columns without FK references.
 * Helps populate FK_EXEMPT_COLUMNS whitelist for Gate 3 validation.
 * 
 * Run: npx tsx src/scripts/find-missing-fks.ts
 */

import * as schema from '../schema/index';

interface MissingFK {
  table: string;
  column: string;
  reason?: string;
}

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
  try {
    return JSON.stringify(tableMeta);
  } catch {
    return '';
  }
}

function findMissingFKs(): MissingFK[] {
  const missing: MissingFK[] = [];

  for (const [exportName, tableObj] of Object.entries(schema)) {
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
    const columns = getColumns(table);
    const configStr = getExtraConfig(tableMeta);

    // Find all *_id columns
    for (const [colName] of columns) {
      if (!colName.endsWith('_id')) continue;

      // Skip known system columns that don't need FKs
      if (['org_id', 'created_by', 'updated_by', 'deleted_by', 'submitted_by', 'posted_by', 'approved_by', 'rejected_by', 'cancelled_by'].includes(colName)) {
        continue;
      }

      // Check if FK exists
      const hasFk = configStr.includes(`references("${colName}")`);
      
      if (!hasFk) {
        // Determine likely reason for missing FK
        let reason: string | undefined;
        
        if (colName === 'parent_id') {
          reason = 'Self-referential FK (same table)';
        } else if (colName.includes('legacy_')) {
          reason = 'Legacy system reference (external)';
        } else if (colName.includes('external_')) {
          reason = 'External system reference';
        } else if (colName === 'amended_from_id' || colName === 'reversed_from_id') {
          reason = 'Same-table document reference';
        } else if (tableName.includes('migration_')) {
          reason = 'Migration metadata (may reference external systems)';
        }

        missing.push({ table: tableName, column: colName, reason });
      }
    }
  }

  return missing;
}

// ── Main ─────────────────────────────────────────────────
const missing = findMissingFKs();

if (missing.length === 0) {
  console.log('✅ All *_id columns have FK constraints');
} else {
  console.log(`\n⚠️  Found ${missing.length} columns without FK constraints:\n`);
  
  // Group by reason
  const byReason = new Map<string, MissingFK[]>();
  const noReason: MissingFK[] = [];
  
  for (const item of missing) {
    if (item.reason) {
      const list = byReason.get(item.reason) ?? [];
      list.push(item);
      byReason.set(item.reason, list);
    } else {
      noReason.push(item);
    }
  }

  // Print by category
  for (const [reason, items] of byReason) {
    console.log(`\n## ${reason} (${items.length})`);
    for (const item of items) {
      console.log(`   ${item.table}.${item.column}`);
    }
  }

  if (noReason.length > 0) {
    console.log(`\n## Needs Investigation (${noReason.length})`);
    for (const item of noReason) {
      console.log(`   ${item.table}.${item.column}`);
    }
  }

  console.log(`\n\nNext steps:`);
  console.log(`1. Review each missing FK and determine if it should:`);
  console.log(`   a) Have FK constraint added (preferred)`);
  console.log(`   b) Be whitelisted in schema-lint.config.ts with EX-FK-* ID`);
  console.log(`2. For whitelisted columns, add to FK_EXEMPT_COLUMNS with rationale`);
  console.log(`3. Run schema-lint to verify Gate 3 passes`);
}
