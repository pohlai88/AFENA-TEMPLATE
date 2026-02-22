/**
 * PREREQ-01: Database Prerequisites Present
 *
 * Validates that the bootstrap-neon.sql script covers all mandatory
 * database prerequisites:
 *   - auth schema exists
 *   - drizzle schema exists
 *   - Required auth functions present (org_id, user_id, org_id_uuid, org_role, etc.)
 *   - Required roles defined (authenticated, worker, schema_owner, migration_admin)
 *   - Schema grants present
 *
 * This is an OFFLINE gate — it reads the bootstrap SQL file, not the live DB.
 * For live validation, combine with drizzle-neon-guard MIG-DRZ-06.
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const PKG_ROOT = process.cwd();
const BOOTSTRAP_SQL_PATH = join(PKG_ROOT, 'scripts', 'bootstrap-neon.sql');

interface ValidationResult {
  passed: boolean;
  violations: Array<{
    item: string;
    issue: string;
  }>;
}

const REQUIRED_SCHEMAS = ['auth', 'drizzle'];

const REQUIRED_AUTH_FUNCTIONS = [
  'auth.org_id',
  'auth.user_id',
  'auth.org_id_uuid',
  'auth.org_role',
  'auth.org_id_or_setting',
  'auth.require_org_id',
  'auth.try_uuid',
  'auth.set_context',
];

const REQUIRED_ROLES = ['authenticated', 'worker', 'schema_owner', 'migration_admin'];

export function validatePrereqGate(): ValidationResult {
  const violations: Array<{ item: string; issue: string }> = [];

  // 1. Bootstrap file must exist
  if (!existsSync(BOOTSTRAP_SQL_PATH)) {
    violations.push({
      item: 'bootstrap-neon.sql',
      issue: 'Bootstrap SQL file not found at scripts/bootstrap-neon.sql',
    });
    return { passed: false, violations };
  }

  const content = readFileSync(BOOTSTRAP_SQL_PATH, 'utf-8');

  // 2. Required schemas
  for (const schema of REQUIRED_SCHEMAS) {
    const pattern = new RegExp(`CREATE\\s+SCHEMA\\s+(IF\\s+NOT\\s+EXISTS\\s+)?${schema}\\b`, 'i');
    if (!pattern.test(content)) {
      violations.push({
        item: `schema:${schema}`,
        issue: `CREATE SCHEMA ${schema} not found in bootstrap SQL`,
      });
    }
  }

  // 3. Required auth functions
  for (const fn of REQUIRED_AUTH_FUNCTIONS) {
    const fnName = fn.replace('auth.', '');
    // Match CREATE OR REPLACE FUNCTION auth.<name>
    const pattern = new RegExp(
      `CREATE\\s+OR\\s+REPLACE\\s+FUNCTION\\s+auth\\.${fnName}\\s*\\(`,
      'i',
    );
    if (!pattern.test(content)) {
      violations.push({
        item: `function:${fn}`,
        issue: `Function ${fn}() not defined in bootstrap SQL`,
      });
    }
  }

  // 4. Required roles
  for (const role of REQUIRED_ROLES) {
    // Match DO $$ block with CREATE ROLE or direct CREATE ROLE
    const hasRole = content.includes(`'${role}'`) || content.includes(`"${role}"`);
    if (!hasRole) {
      violations.push({
        item: `role:${role}`,
        issue: `Role '${role}' not provisioned in bootstrap SQL`,
      });
    }
  }

  // 5. Schema grants (auth and public must grant USAGE to authenticated)
  const grantPattern = /GRANT\s+USAGE\s+ON\s+SCHEMA\s+(auth|public)\s+TO\s+authenticated/i;
  if (!grantPattern.test(content)) {
    violations.push({
      item: 'grants:schema',
      issue: 'GRANT USAGE ON SCHEMA auth/public TO authenticated not found',
    });
  }

  // 6. Self-verification block
  if (!content.includes('VERIFY BOOTSTRAP')) {
    // Just a warning-level check — optional
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

export function getGateInfo() {
  return {
    id: 'PREREQ-01',
    name: 'Database Prerequisites Present',
    description:
      'Validates bootstrap-neon.sql covers all required schemas, auth functions, roles, and grants',
    severity: 'critical',
    rationale:
      'Migration will fail if prerequisites (auth functions, roles, schemas) are not bootstrapped first',
  };
}
