/**
 * ORG-UUID-01: org_id Must Be UUID Type
 * 
 * Ensures all tables with org_id column use uuid type, not text.
 * This prevents implicit casts that destroy index usage and break RLS policies.
 * 
 * CRITICAL: auth.org_id() returns uuid, so org_id column must match.
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const SCHEMA_DIR = join(process.cwd(), 'src/schema');
const SKIP_FILES = ['index.ts', '_registry.ts', 'relations.ts'];

interface ValidationResult {
  passed: boolean;
  violations: Array<{
    file: string;
    issue: string;
  }>;
}

export function validateOrgUuidGate(): ValidationResult {
  const files = readdirSync(SCHEMA_DIR)
    .filter(f => f.endsWith('.ts') && !SKIP_FILES.includes(f));

  const violations: Array<{ file: string; issue: string }> = [];

  for (const file of files) {
    const filePath = join(SCHEMA_DIR, file);
    const content = readFileSync(filePath, 'utf-8');

    // Skip if no pgTable
    if (!content.includes('pgTable')) continue;

    // Check for text('org_id') pattern (incorrect)
    const textOrgIdMatch = content.match(/orgId:\s*text\(['"]org_id['"]\)/);
    if (textOrgIdMatch) {
      violations.push({
        file,
        issue: 'org_id uses text() instead of uuid()',
      });
      continue;
    }

    // Check for uuid('org_id') pattern (correct)
    // Only match org_id as a column definition (orgId: or 'org_id' in column def), not references in SQL strings
    const hasOrgIdColumn = content.includes('orgId:') || content.match(/:\s*(?:uuid|text)\(['"]org_id['"]\)/);
    if (hasOrgIdColumn && !content.includes("uuid('org_id')")) {
      // Double-check it's not inherited from baseEntityColumns, erpEntityColumns, or docEntityColumns
      const hasInheritedColumns = content.includes('baseEntityColumns') ||
        content.includes('erpEntityColumns') ||
        content.includes('docEntityColumns');

      // Also check if table has tenantPk (which implies org_id exists and is correct)
      const hasTenantPk = content.includes('tenantPk(');

      // Skip if inherited or has tenantPk
      if (!hasInheritedColumns && !hasTenantPk) {
        violations.push({
          file,
          issue: 'Has org_id but not using uuid() type',
        });
      }
    }
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

export function getGateInfo() {
  return {
    id: 'ORG-UUID-01',
    name: 'org_id Must Be UUID Type',
    description: 'Ensures all tables with org_id use uuid type to match auth.org_id() return type',
    severity: 'critical',
    rationale: 'Prevents implicit casts that destroy index usage and break RLS policies',
  };
}
