/**
 * Natural Key Immutability — Trigger SQL Generator
 *
 * Generates per-table trigger SQL for blocking UPDATE on natural key columns.
 * Used by the patch script (scripts/patch-migration-triggers.mjs), NOT by Drizzle schema.
 *
 * @see S9 — Natural Key Enforcement
 */

/**
 * Generate the shared trigger function SQL (idempotent — CREATE OR REPLACE).
 */
export function generateBlockFunctionSql(): string {
  return `-- Natural key immutability trigger function (shared)
CREATE OR REPLACE FUNCTION public.block_natural_key_update()
RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'Natural key column(s) are immutable after creation';
END;
$$ LANGUAGE plpgsql;`;
}

/**
 * Generate per-table trigger SQL for a given table and its natural key columns.
 *
 * @param tableName - SQL table name (snake_case)
 * @param columns - Natural key column names (snake_case)
 * @returns SQL string for the trigger (idempotent via DROP IF EXISTS + CREATE)
 */
export function generateNkTriggerSql(tableName: string, columns: string[]): string {
  const triggerName = `trg_nk_immutable_${tableName}`;
  const columnList = columns.join(', ');
  const whenClauses = columns.map((col) => `OLD.${col} IS DISTINCT FROM NEW.${col}`).join(' OR ');

  return `-- NK immutability: ${tableName} (${columnList})
DROP TRIGGER IF EXISTS ${triggerName} ON ${tableName};
CREATE TRIGGER ${triggerName}
  BEFORE UPDATE OF ${columnList} ON ${tableName}
  FOR EACH ROW WHEN (${whenClauses})
  EXECUTE FUNCTION public.block_natural_key_update();`;
}

/**
 * Registry of tables with natural keys and their immutable columns.
 * Must be kept in sync with TABLE_REGISTRY entries where hasNaturalKey: true + naturalKeyImmutable: true.
 */
export const NK_TABLES: Record<string, string[]> = {
  treasury_accounts: ['account_no'],
  government_grant_items: ['grant_no'],
  bank_accounts: ['account_no'],
  payment_methods: ['code'],
  payment_terms_templates: ['code'],
};

/**
 * Generate all NK trigger SQL for all registered tables.
 */
export function generateAllNkTriggerSql(): string {
  const parts: string[] = [generateBlockFunctionSql(), ''];

  for (const [table, columns] of Object.entries(NK_TABLES)) {
    parts.push(generateNkTriggerSql(table, columns));
    parts.push('');
  }

  return parts.join('\n');
}
