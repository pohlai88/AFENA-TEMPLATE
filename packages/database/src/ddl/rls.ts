/**
 * RLS Policy Generation Helpers
 * 
 * Provides safe SQL generation for Row-Level Security policies.
 * Enforces standard tenant isolation patterns.
 * 
 * CRITICAL: Only use in migrations. Never in runtime queries.
 */

import { qIdent } from './ident';

/**
 * Generate tenant isolation policy SQL
 * 
 * Creates a standard RLS policy that restricts access to rows
 * where org_id matches the current user's organization.
 * 
 * @param tableName - Table to apply policy to
 * @param policyName - Optional custom policy name (defaults to 'tenant_isolation')
 * @returns SQL statements to create the policy
 * 
 * @example
 * ```typescript
 * const sql = tenantPolicySql('invoices');
 * // Returns:
 * // ALTER TABLE "invoices" ENABLE ROW LEVEL SECURITY;
 * // ALTER TABLE "invoices" FORCE ROW LEVEL SECURITY;
 * // CREATE POLICY "tenant_isolation" ON "invoices"
 * //   USING ("org_id" = auth.org_id())
 * //   WITH CHECK ("org_id" = auth.org_id());
 * ```
 */
export function tenantPolicySql(
  tableName: string,
  policyName: string = 'tenant_isolation'
): string {
  const table = qIdent(tableName);
  const policy = qIdent(policyName);
  
  return `-- Enable RLS on ${tableName}
ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;
ALTER TABLE ${table} FORCE ROW LEVEL SECURITY;

-- Create tenant isolation policy
CREATE POLICY ${policy} ON ${table}
  USING ("org_id" = auth.org_id())
  WITH CHECK ("org_id" = auth.org_id());`;
}

/**
 * Generate RLS enable statements
 * 
 * @param tableName - Table to enable RLS on
 * @param force - Whether to force RLS for table owner (default: true)
 * @returns SQL to enable RLS
 */
export function enableRlsSql(tableName: string, force: boolean = true): string {
  const table = qIdent(tableName);
  
  const statements = [
    `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`
  ];
  
  if (force) {
    statements.push(`ALTER TABLE ${table} FORCE ROW LEVEL SECURITY;`);
  }
  
  return statements.join('\n');
}

/**
 * Generate custom RLS policy SQL
 * 
 * @param tableName - Table to apply policy to
 * @param policyName - Policy name
 * @param usingClause - USING clause (read filter)
 * @param withCheckClause - Optional WITH CHECK clause (write filter)
 * @returns SQL to create the policy
 * 
 * @example
 * ```typescript
 * const sql = customPolicySql(
 *   'documents',
 *   'owner_only',
 *   '"owner_id" = auth.user_id()',
 *   '"owner_id" = auth.user_id()'
 * );
 * ```
 */
export function customPolicySql(
  tableName: string,
  policyName: string,
  usingClause: string,
  withCheckClause?: string
): string {
  const table = qIdent(tableName);
  const policy = qIdent(policyName);
  
  let sql = `CREATE POLICY ${policy} ON ${table}\n  USING (${usingClause})`;
  
  if (withCheckClause) {
    sql += `\n  WITH CHECK (${withCheckClause})`;
  }
  
  return `${sql  };`;
}

/**
 * Generate policy for specific roles
 * 
 * @param tableName - Table to apply policy to
 * @param policyName - Policy name
 * @param roles - Array of role names
 * @param usingClause - USING clause
 * @param withCheckClause - Optional WITH CHECK clause
 * @returns SQL to create role-specific policy
 */
export function rolePolicySql(
  tableName: string,
  policyName: string,
  roles: string[],
  usingClause: string,
  withCheckClause?: string
): string {
  const table = qIdent(tableName);
  const policy = qIdent(policyName);
  const roleList = roles.map(qIdent).join(', ');
  
  let sql = `CREATE POLICY ${policy} ON ${table}\n  FOR ALL\n  TO ${roleList}\n  USING (${usingClause})`;
  
  if (withCheckClause) {
    sql += `\n  WITH CHECK (${withCheckClause})`;
  }
  
  return `${sql  };`;
}

/**
 * Generate worker bypass policy
 * 
 * Creates a policy that allows workers with BYPASSRLS to access all rows.
 * 
 * @param tableName - Table to apply policy to
 * @returns SQL to create worker policy
 */
export function workerBypassPolicySql(tableName: string): string {
  const table = qIdent(tableName);
  
  return `-- Worker bypass policy (BYPASSRLS role ignores this)
-- This is a no-op but documents intent
CREATE POLICY "worker_bypass" ON ${table}
  FOR ALL
  TO worker
  USING (true)
  WITH CHECK (true);`;
}

/**
 * Generate DROP POLICY statement
 * 
 * @param tableName - Table name
 * @param policyName - Policy name to drop
 * @param ifExists - Add IF EXISTS clause (default: true)
 * @returns SQL to drop policy
 */
export function dropPolicySql(
  tableName: string,
  policyName: string,
  ifExists: boolean = true
): string {
  const table = qIdent(tableName);
  const policy = qIdent(policyName);
  const ifExistsClause = ifExists ? 'IF EXISTS ' : '';
  
  return `DROP POLICY ${ifExistsClause}${policy} ON ${table};`;
}

/**
 * Generate complete RLS setup for standard tenant table
 * 
 * Includes:
 * - Enable RLS
 * - Force RLS
 * - Tenant isolation policy
 * - Comments
 * 
 * @param tableName - Table name
 * @returns Complete RLS setup SQL
 */
export function standardRlsSetup(tableName: string): string {
  return `-- RLS Setup for ${tableName}
${enableRlsSql(tableName, true)}

${tenantPolicySql(tableName)}

-- Grant access to authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON ${qIdent(tableName)} TO authenticated;`;
}

/**
 * Generate RLS setup for evidence table (append-only)
 * 
 * @param tableName - Table name
 * @returns RLS setup SQL for evidence table
 */
export function evidenceRlsSetup(tableName: string): string {
  const table = qIdent(tableName);
  
  return `-- RLS Setup for evidence table ${tableName}
${enableRlsSql(tableName, true)}

-- Tenant isolation (read)
CREATE POLICY "tenant_isolation_read" ON ${table}
  FOR SELECT
  USING ("org_id" = auth.org_id());

-- Tenant isolation (insert only - no update/delete)
CREATE POLICY "tenant_isolation_insert" ON ${table}
  FOR INSERT
  WITH CHECK ("org_id" = auth.org_id());

-- Grant SELECT and INSERT only (no UPDATE/DELETE)
GRANT SELECT, INSERT ON ${table} TO authenticated;
REVOKE UPDATE, DELETE ON ${table} FROM authenticated;`;
}

/**
 * Generate RLS setup for projection table (worker-only writes)
 * 
 * @param tableName - Table name
 * @returns RLS setup SQL for projection table
 */
export function projectionRlsSetup(tableName: string): string {
  const table = qIdent(tableName);
  
  return `-- RLS Setup for projection table ${tableName}
${enableRlsSql(tableName, true)}

-- Tenant isolation (read for authenticated)
CREATE POLICY "tenant_isolation_read" ON ${table}
  FOR SELECT
  TO authenticated
  USING ("org_id" = auth.org_id());

-- Worker can write (BYPASSRLS ignores policies)
-- Revoke write access from authenticated
GRANT SELECT ON ${table} TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ${table} TO worker;
REVOKE INSERT, UPDATE, DELETE ON ${table} FROM authenticated;`;
}

/**
 * Validate RLS policy clause
 * 
 * Basic validation to catch common errors.
 * 
 * @param clause - Policy clause to validate
 * @returns Validation errors (empty if valid)
 */
export function validatePolicyClause(clause: string): string[] {
  const errors: string[] = [];
  
  // Check for common mistakes
  if (clause.includes('SELECT') || clause.includes('INSERT')) {
    errors.push('Policy clause should not contain SELECT/INSERT keywords');
  }
  
  if (clause.includes(';')) {
    errors.push('Policy clause should not contain semicolons');
  }
  
  if (!clause.trim()) {
    errors.push('Policy clause cannot be empty');
  }
  
  // Check for balanced parentheses
  const openCount = (clause.match(/\(/g) || []).length;
  const closeCount = (clause.match(/\)/g) || []).length;
  if (openCount !== closeCount) {
    errors.push('Unbalanced parentheses in policy clause');
  }
  
  return errors;
}
