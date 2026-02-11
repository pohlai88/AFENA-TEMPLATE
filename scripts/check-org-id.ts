/**
 * INVARIANT-11 Schema Gate — AST-based enforcement
 *
 * Parses Drizzle schema files using ts-morph and verifies:
 *   1. Every pgTable() call has an `orgId` column
 *   2. The orgId column has a DEFAULT (auth.require_org_id() or auth.org_id())
 *   3. tenantPolicy() or ownerPolicy() is referenced in the table config
 *
 * Skipped tables: tables listed in EXEMPT_TABLES (auth-adjacent, no org scope)
 *
 * Usage:
 *   npx tsx scripts/check-org-id.ts
 *
 * Exit codes:
 *   0 = all domain tables compliant
 *   1 = violations found
 */

import { Project, SyntaxKind, type CallExpression } from 'ts-morph';
import * as path from 'path';

// Tables that are auth-adjacent and don't need org_id
const EXEMPT_TABLES = new Set(['users', 'r2_files']);

const SCHEMA_GLOB = 'packages/database/src/**/*.ts';
const ROOT = path.resolve(__dirname, '..');

interface Violation {
  file: string;
  table: string;
  issues: string[];
}

function main(): void {
  const project = new Project({
    tsConfigFilePath: path.join(ROOT, 'packages/database/tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  });

  project.addSourceFilesAtPaths(path.join(ROOT, SCHEMA_GLOB));

  const violations: Violation[] = [];

  for (const sourceFile of project.getSourceFiles()) {
    const relPath = path.relative(ROOT, sourceFile.getFilePath());

    // Find all pgTable() calls
    const calls = sourceFile
      .getDescendantsOfKind(SyntaxKind.CallExpression)
      .filter((call) => call.getExpression().getText() === 'pgTable');

    for (const call of calls) {
      const tableName = getTableName(call);
      if (!tableName) continue;
      if (EXEMPT_TABLES.has(tableName)) continue;

      const issues: string[] = [];
      const fullText = call.getText();

      // Check 1: orgId column exists
      if (!fullText.includes('orgId') && !fullText.includes("'org_id'") && !fullText.includes('"org_id"')) {
        issues.push('Missing orgId column');
      }

      // Check 2: DEFAULT uses auth.require_org_id() or auth.org_id()
      if (
        !fullText.includes('auth.require_org_id()') &&
        !fullText.includes('auth.org_id()')
      ) {
        issues.push('Missing DEFAULT auth.require_org_id() or auth.org_id() on org_id');
      }

      // Check 3: tenantPolicy or ownerPolicy referenced
      if (
        !fullText.includes('tenantPolicy') &&
        !fullText.includes('ownerPolicy')
      ) {
        issues.push('Missing tenantPolicy() or ownerPolicy() in table config');
      }

      if (issues.length > 0) {
        violations.push({ file: relPath, table: tableName, issues });
      }
    }
  }

  if (violations.length === 0) {
    console.log('✅ INVARIANT-11: All domain tables have org_id + tenant policy');
    process.exit(0);
  }

  console.error('❌ INVARIANT-11 VIOLATIONS:\n');
  for (const v of violations) {
    console.error(`  ${v.file} → table "${v.table}":`);
    for (const issue of v.issues) {
      console.error(`    - ${issue}`);
    }
    console.error('');
  }

  process.exit(1);
}

function getTableName(call: CallExpression): string | null {
  const args = call.getArguments();
  if (args.length === 0) return null;
  const first = args[0];
  if (first.getKind() === SyntaxKind.StringLiteral) {
    return first.getText().replace(/['"]/g, '');
  }
  return null;
}

main();
