/**
 * PK-ORG-01: Composite PK Required for Tenant Tables
 * 
 * Ensures all tenant tables use composite PK (org_id, id) instead of standalone id.
 * This is the foundation of database-level tenant isolation.
 * 
 * CRITICAL: Composite PK prevents cross-tenant references at the database level.
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const SCHEMA_DIR = join(process.cwd(), 'src/schema');
const SKIP_FILES = ['index.ts', '_registry.ts', 'relations.ts'];
const GLOBAL_TABLES = ['users']; // Tables without org_id

interface ValidationResult {
  passed: boolean;
  violations: Array<{
    file: string;
    issue: string;
  }>;
}

export function validatePkOrgGate(): ValidationResult {
  const files = readdirSync(SCHEMA_DIR)
    .filter(f => f.endsWith('.ts') && !SKIP_FILES.includes(f));
  
  const violations: Array<{ file: string; issue: string }> = [];
  
  for (const file of files) {
    const filePath = join(SCHEMA_DIR, file);
    const content = readFileSync(filePath, 'utf-8');
    
    // Skip if no pgTable
    if (!content.includes('pgTable')) continue;
    
    // Skip global tables (no org_id)
    const tableName = file.replace('.ts', '');
    if (GLOBAL_TABLES.includes(tableName)) continue;
    
    // Check if table has org_id (tenant table)
    const hasOrgId = content.includes('orgId:') || 
                     content.includes('baseEntityColumns') || 
                     content.includes('erpEntityColumns') ||
                     content.includes('docEntityColumns');
    
    if (!hasOrgId) continue; // Skip non-tenant tables

    // Skip tables that have org_id but no id column (e.g., metering tables with natural PK like (org_id, day))
    const hasIdColumn = content.includes("uuid('id')") ||
                        content.includes('baseEntityColumns') ||
                        content.includes('erpEntityColumns') ||
                        content.includes('docEntityColumns');
    if (!hasIdColumn) continue;
    
    // Check for standalone .primaryKey() on id (incorrect)
    const standaloneIdPk = content.match(/id:\s*uuid\(['"]id['"]\)[^,]*\.primaryKey\(\)/);
    if (standaloneIdPk) {
      violations.push({
        file,
        issue: 'id column has standalone .primaryKey() instead of composite PK',
      });
      continue;
    }
    
    // Check for tenantPk(table) in table definition (correct)
    const hasCompositePk = content.includes('tenantPk(table)') || content.includes('tenantPk(t)');
    if (!hasCompositePk) {
      violations.push({
        file,
        issue: 'Missing tenantPk(table) - composite PK (org_id, id) required',
      });
    }
  }
  
  return {
    passed: violations.length === 0,
    violations,
  };
}

export function getGateInfo() {
  return {
    id: 'PK-ORG-01',
    name: 'Composite PK Required for Tenant Tables',
    description: 'Ensures all tenant tables use composite PK (org_id, id) via tenantPk()',
    severity: 'critical',
    rationale: 'Foundation of database-level tenant isolation',
  };
}
