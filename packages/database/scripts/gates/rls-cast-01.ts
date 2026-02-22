/**
 * RLS-CAST-01: auth.org_id() Must Have ::uuid Cast in RLS Policies
 *
 * Ensures every `auth.org_id()` reference inside `crudPolicy` or `tenantPolicy`
 * expressions is cast to `::uuid`.  Without this, Postgres sees `text = uuid`
 * and throws "operator does not exist: text = uuid" at policy evaluation time.
 *
 * Scans:
 *   - src/schema/*.ts   — direct crudPolicy usages
 *   - src/helpers/tenant-policy.ts — shared tenantPolicy/ownerPolicy helper
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const PKG_ROOT = join(process.cwd());
const SCHEMA_DIR = join(PKG_ROOT, 'src/schema');
const HELPERS_DIR = join(PKG_ROOT, 'src/helpers');
const SKIP_FILES = ['index.ts', '_registry.ts', 'relations.ts'];

interface ValidationResult {
  passed: boolean;
  violations: Array<{
    file: string;
    issue: string;
    line: number;
  }>;
}

/**
 * Check a single file for `auth.org_id()` without `::uuid` cast
 * inside crudPolicy / tenantPolicy / ownerPolicy blocks.
 */
function checkFile(
  filePath: string,
  fileName: string,
): Array<{ file: string; issue: string; line: number }> {
  const content = readFileSync(filePath, 'utf-8');
  const violations: Array<{ file: string; issue: string; line: number }> = [];

  // We only care about files that contain RLS-related keywords
  if (
    !content.includes('crudPolicy') &&
    !content.includes('tenantPolicy') &&
    !content.includes('ownerPolicy')
  ) {
    return violations;
  }

  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip import statements
    if (line.trimStart().startsWith('import ')) continue;

    // Look for auth.org_id() NOT followed by ::uuid
    // This regex matches `auth.org_id()` when NOT immediately followed by `::uuid`
    const rgx = /auth\.org_id\(\)(?!::uuid)/g;
    let match: RegExpExecArray | null;

    while ((match = rgx.exec(line)) !== null) {
      // Exclude column defaults like `.default(sql`(auth.org_id()::uuid)`)` — those already have cast
      // Exclude comments
      const trimmed = line.trimStart();
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue;

      violations.push({
        file: fileName,
        issue: `auth.org_id() missing ::uuid cast — will cause "operator does not exist: text = uuid" at runtime`,
        line: i + 1,
      });
    }
  }

  return violations;
}

export function validateRlsCastGate(): ValidationResult {
  const violations: Array<{ file: string; issue: string; line: number }> = [];

  // 1. Check schema files
  const schemaFiles = readdirSync(SCHEMA_DIR).filter(
    (f) => f.endsWith('.ts') && !SKIP_FILES.includes(f),
  );

  for (const file of schemaFiles) {
    violations.push(...checkFile(join(SCHEMA_DIR, file), `schema/${file}`));
  }

  // 2. Check tenant-policy helper
  const tenantPolicyPath = join(HELPERS_DIR, 'tenant-policy.ts');
  violations.push(...checkFile(tenantPolicyPath, 'helpers/tenant-policy.ts'));

  return {
    passed: violations.length === 0,
    violations,
  };
}

export function getGateInfo() {
  return {
    id: 'RLS-CAST-01',
    name: 'auth.org_id() Must Have ::uuid Cast',
    description: 'Ensures auth.org_id() is cast to ::uuid in all RLS policy expressions',
    severity: 'critical',
    rationale:
      'auth.org_id() returns text; org_id columns are uuid. Without explicit cast, Postgres throws operator mismatch error at policy evaluation.',
  };
}
