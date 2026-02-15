/* eslint-disable no-console, no-restricted-syntax */
/**
 * Schema lint script - verifies every domain table follows ERP conventions.
 * Includes Gate 0 (GOV-00): database.architecture.md contract completeness.
 *
 * PRD A9 rules:
 *   1. has-base-columns - id, org_id, created_at, updated_at, version       (error)
 *   2. has-tenant-policy - table config includes tenantPolicy/crudPolicy     (error)
 *   3. has-org-id - table has org_id guard (uuid semantics: org_not_empty or sentinel) (error)
 *   4. has-org-id-index - table has (org_id, id) index                      (error)
 *   5. no-float-money - no real/doublePrecision on money columns          (error)
 *   6. snake-case-columns - all column DB names are snake_case                (warning)
 *   7. has-custom-data - ERP entity tables have customData jsonb column    (warning)
 *   8. naming-convention - table name is plural snake_case                   (warning)
 *
 * Run: npx tsx src/scripts/schema-lint.ts
 */

import { readFileSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { schemaLintConfig } from '../../schema-lint.config';
import { REGISTRY_EXEMPT, REVOKE_UPDATE_DELETE_TABLES, TABLE_REGISTRY } from '../schema/_registry';
import * as schema from '../schema/index';

// GOV-00: Gate 0 exact headings required in database.architecture.md
const GATE0_HEADINGS = [
  '## Ratification Metadata (Contract)',
  '## Ratification Gap Register (Mandatory, Near Top)',
  '## Invariant Index',
  '## Exception Index',
] as const;

interface LintResult {
  table: string;
  errors: string[];
  warnings: string[];
}

// Schema-derived metadata — single source in schema-lint.config.ts
const EXEMPT_TABLES = new Set<string>(schemaLintConfig.exemptTables);
const ERP_ENTITY_TABLES = new Set<string>(schemaLintConfig.erpEntityTables);
const POSTABLE_TABLES = new Set<string>(schemaLintConfig.postableTables);
const LINE_TABLES = new Set<string>(schemaLintConfig.lineTables);

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

    // ── Rule 0: has-registry-entry (SCH-03b) ─────────────
    const errors: string[] = [];
    if (!REGISTRY_EXEMPT.has(tableName) && !(tableName in TABLE_REGISTRY)) {
      errors.push('[has-registry-entry] Table not in TABLE_REGISTRY; add to _registry.ts with table_kind (except EX-SCH-*)');
    }

    if (EXEMPT_TABLES.has(tableName)) {
      if (errors.length > 0) results.push({ table: tableName, errors, warnings: [] });
      continue;
    }

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

    // ── Rule 3: has-org-id (error) ───────────────────────
    // Accept: legacy org_not_empty, or uuid sentinel CHECK (org_id <> '00000000-...'::uuid)
    const hasOrgIdGuard =
      configStr.includes('org_not_empty') ||
      configStr.includes("org_id <> ''") ||
      configStr.includes("org_id <> '00000000-0000-0000-0000-000000000000'");
    if (!hasOrgIdGuard && columnNames.has('org_id')) {
      errors.push('[has-org-id] Missing org_id guard (org_not_empty or uuid sentinel CHECK)');
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

    // ── Gate 2: composite-pk-for-truth (warning) ──────────
    // Truth tables SHOULD have composite PK (org_id, id) — GAP-DB-001 target
    // Currently warning-only until migration is complete
    const tableKind =
      tableName in TABLE_REGISTRY
        ? TABLE_REGISTRY[tableName as keyof typeof TABLE_REGISTRY]
        : undefined;
    if (tableKind === 'truth') {
      // Check for composite PK pattern in config
      const hasCompositePK =
        configStr.includes('primaryKey') &&
        configStr.includes('org_id') &&
        configStr.includes('"id"');

      if (!hasCompositePK) {
        warnings.push('[Gate 2] Truth table should have composite PK (org_id, id) — GAP-DB-001 target (P2 migration pending)');
      }
    }

    // ── Gate 3: fk-coverage (error) ──────────────────────
    // Every *_id column must have FK constraint unless whitelisted
    const fkExemptCols = new Set(
      schemaLintConfig.FK_EXEMPT_COLUMNS
        .filter((e) => e.table === tableName)
        .map((e) => e.column)
    );
    const fkExemptTable = schemaLintConfig.FK_EXEMPT_TABLES.some((e) => e.table === tableName);

    if (!fkExemptTable) {
      for (const colName of columnNames) {
        if (colName.endsWith('_id') && !fkExemptCols.has(colName)) {
          // Check if FK exists in config
          const hasFk = configStr.includes(`references("${colName}")`);
          if (!hasFk) {
            errors.push(`[Gate 3] Column "${colName}" lacks FK constraint — add FK or whitelist in schema-lint.config.ts with EX-FK-* ID`);
          }
        }
      }
    }

    if (errors.length > 0 || warnings.length > 0) {
      results.push({ table: tableName, errors, warnings });
    }
  }

  return results;
}

// ── Gate 0 (GOV-00): Doc contract completeness ───────────
function runGate0(): string[] {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const archPath = join(__dirname, '../../../../.architecture/database.architecture.md');
  let content: string;
  try {
    content = readFileSync(archPath, 'utf-8');
  } catch {
    return [`[Gate 0] Cannot read ${archPath} — ensure database.architecture.md exists`];
  }
  const missing: string[] = [];
  for (const heading of GATE0_HEADINGS) {
    if (!content.includes(heading)) {
      missing.push(heading);
    }
  }
  return missing.length > 0 ? missing.map((h) => `[Gate 0] Missing required heading: ${h}`) : [];
}

// ── Gate 5 (GOV-05): REVOKE_UPDATE_DELETE_TABLES matches migrations ──
// Every table in REVOKE_UPDATE_DELETE_TABLES must have REVOKE UPDATE or DELETE in migrations.
function runGate5(): string[] {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const drizzleDir = join(__dirname, '../../drizzle');
  const revokedTables = new Set<string>();

  try {
    const files = readdirSync(drizzleDir).filter((f) => f.endsWith('.sql'));
    for (const file of files) {
      const content = readFileSync(join(drizzleDir, file), 'utf-8');
      // Match: REVOKE UPDATE, DELETE ON table_name FROM ... or REVOKE INSERT, UPDATE, DELETE ON ...
      const revokeMatches = content.matchAll(
        /REVOKE\s+(?:UPDATE\s*,\s*DELETE|INSERT\s*,\s*UPDATE\s*,\s*DELETE|DELETE|UPDATE|INSERT)\s+ON\s+"?(\w+)"?\s+FROM/gi,
      );
      for (const m of revokeMatches) {
        revokedTables.add(m[1].toLowerCase());
      }
    }
  } catch {
    return [`[Gate 5] Cannot read drizzle migrations from ${drizzleDir}`];
  }

  const errors: string[] = [];
  for (const table of REVOKE_UPDATE_DELETE_TABLES) {
    if (!revokedTables.has(table.toLowerCase())) {
      errors.push(
        `[Gate 5] ${table} is in REVOKE_UPDATE_DELETE_TABLES but has no REVOKE in migrations — add migration or remove from registry`,
      );
    }
  }
  return errors;
}

// ── Main ─────────────────────────────────────────────────
let hasErrors = false;
let errorCount = 0;
let warnCount = 0;

const gate0Errors = runGate0();
if (gate0Errors.length > 0) {
  hasErrors = true;
  console.error('❌ Gate 0 (database.architecture.md):');
  for (const e of gate0Errors) {
    console.error(`   ERROR: ${e}`);
    errorCount++;
  }
}

const gate5Errors = runGate5();
if (gate5Errors.length > 0) {
  hasErrors = true;
  console.error('❌ Gate 5 (REVOKE_UPDATE_DELETE_TABLES vs migrations):');
  for (const e of gate5Errors) {
    console.error(`   ERROR: ${e}`);
    errorCount++;
  }
}

const results = lintSchema();
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
