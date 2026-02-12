/**
 * Schema catalog collector — Drizzle introspection → entity manifest.
 * Scans packages/database/src/schema/*.ts for table definitions.
 * Uses regex to extract table names, column names, and types.
 */

import { readFileSync } from 'fs';
import fg from 'fast-glob';

export interface SchemaColumn {
  name: string;
  type: string;
  nullable: boolean;
  hasDefault: boolean;
}

export interface SchemaTable {
  file: string;
  tableName: string;
  columns: SchemaColumn[];
  hasRls: boolean;
  hasOrgId: boolean;
}

export interface SchemaCatalog {
  tables: SchemaTable[];
  totalColumns: number;
}

// Match pgTable('table_name', { ... })
const TABLE_REGEX = /pgTable\(\s*['"](\w+)['"]\s*,\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/gs;

// Match column definitions: columnName: type(...)
const COLUMN_REGEX = /(\w+)\s*:\s*(text|integer|boolean|timestamp|uuid|varchar|jsonb|doublePrecision|serial|bigint|numeric|smallint|real|date|time|interval|pgEnum)\s*\(/g;

// Simpler column match for chained methods
const COLUMN_CHAIN_REGEX = /(\w+)\s*:\s*(\w+)\([^)]*\)([^,]*)/g;

/**
 * Collect schema information from Drizzle table definitions.
 */
export async function collectSchemaCatalog(repoRoot: string): Promise<SchemaCatalog> {
  const tables: SchemaTable[] = [];

  const schemaFiles = await fg(
    ['packages/database/src/schema/*.ts'],
    { cwd: repoRoot, absolute: true },
  );

  for (const absPath of schemaFiles) {
    const content = readFileSync(absPath, 'utf-8');
    const relPath = absPath
      .replace(/\\/g, '/')
      .replace(repoRoot.replace(/\\/g, '/') + '/', '');

    // Skip index/barrel files and relation files
    if (relPath.endsWith('/index.ts') || relPath.endsWith('/relations.ts')) continue;

    // Find all pgTable definitions
    const tableMatches = content.matchAll(
      /pgTable\(\s*['"](\w+)['"]/g,
    );

    for (const match of tableMatches) {
      const tableName = match[1];
      const columns: SchemaColumn[] = [];

      // Extract column definitions using a simpler approach
      // Look for patterns like: columnName: type(...).method()
      const columnMatches = content.matchAll(
        /(\w+)\s*:\s*(?:text|integer|boolean|timestamp|uuid|varchar|jsonb|doublePrecision|serial|bigint|numeric|smallint|real|date|time|interval)\s*\(/g,
      );

      for (const colMatch of columnMatches) {
        const colName = colMatch[1];
        // Skip if it's a common non-column identifier
        if (['export', 'const', 'import', 'return', 'function'].includes(colName)) continue;

        const afterCol = content.slice(colMatch.index! + colMatch[0].length, colMatch.index! + colMatch[0].length + 200);
        columns.push({
          name: colName,
          type: colMatch[0].replace(colName + ': ', '').replace('(', ''),
          nullable: afterCol.includes('.notNull()') ? false : true,
          hasDefault: afterCol.includes('.default(') || afterCol.includes('.$default('),
        });
      }

      const hasRls = content.includes('enableRLS') || content.includes('pgPolicy');
      const hasOrgId = content.includes('org_id') || content.includes('orgId');

      tables.push({
        file: relPath,
        tableName,
        columns,
        hasRls,
        hasOrgId,
      });
    }
  }

  const totalColumns = tables.reduce((sum, t) => sum + t.columns.length, 0);

  return { tables, totalColumns };
}
