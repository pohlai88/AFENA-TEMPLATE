/**
 * FK-ORG-01: Composite FK Required for Tenant Tables
 * 
 * Ensures all foreign keys to tenant tables use composite FK (org_id, fk_id).
 * This prevents cross-tenant joins at the database level.
 * 
 * CRITICAL: Single-column FKs allow cross-tenant references, breaking isolation.
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

export function validateFkOrgGate(): ValidationResult {
  const files = readdirSync(SCHEMA_DIR)
    .filter(f => f.endsWith('.ts') && !SKIP_FILES.includes(f));
  
  const violations: Array<{ file: string; issue: string }> = [];
  
  for (const file of files) {
    const filePath = join(SCHEMA_DIR, file);
    const content = readFileSync(filePath, 'utf-8');
    
    // Skip if no pgTable
    if (!content.includes('pgTable')) continue;
    
    // Check for old-style .references() (incorrect)
    const hasReferences = content.match(/\.references\(\s*\(\)\s*=>/);
    if (hasReferences) {
      violations.push({
        file,
        issue: 'Uses .references() instead of composite FK via tenantFkPattern()',
      });
      continue;
    }
    
    // Check for standalone foreignKey without org_id (incorrect)
    const foreignKeyMatches = content.matchAll(/foreignKey\(\{[\s\S]*?columns:\s*\[([^\]]+)\]/g);
    for (const match of foreignKeyMatches) {
      const columns = match[1];
      // If foreignKey has columns but doesn't include orgId or table.orgId, it's wrong
      if (!columns.includes('orgId') && !columns.includes('table.orgId')) {
        violations.push({
          file,
          issue: 'foreignKey() missing org_id in columns array - use tenantFkPattern()',
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
    id: 'FK-ORG-01',
    name: 'Composite FK Required for Tenant Tables',
    description: 'Ensures all FKs to tenant tables use composite FK (org_id, fk_id) via tenantFkPattern()',
    severity: 'critical',
    rationale: 'Prevents cross-tenant joins at the database level',
  };
}
