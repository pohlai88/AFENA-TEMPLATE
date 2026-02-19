/**
 * MONEY-01: Money Columns Must Use Bigint
 * 
 * Ensures all money columns use bigint minor units, not integer or numeric(18,2).
 * This prevents overflow on large transactions and avoids floating-point issues.
 * 
 * CRITICAL: integer max is ~2.1B, which is only $21M in cents. Bigint is required.
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

export function validateMoneyGate(): ValidationResult {
  const files = readdirSync(SCHEMA_DIR)
    .filter(f => f.endsWith('.ts') && !SKIP_FILES.includes(f));
  
  const violations: Array<{ file: string; issue: string }> = [];
  
  for (const file of files) {
    const filePath = join(SCHEMA_DIR, file);
    const content = readFileSync(filePath, 'utf-8');
    
    // Skip if no pgTable
    if (!content.includes('pgTable')) continue;
    
    // Check for money-related columns using integer (incorrect)
    const moneyPatterns = [
      /(\w*[Aa]mount\w*|total\w*|price\w*|cost\w*):\s*integer\(/,
      /(\w*Minor):\s*integer\(/,
    ];
    
    for (const pattern of moneyPatterns) {
      const match = content.match(pattern);
      if (match) {
        violations.push({
          file,
          issue: `Money column '${match[1]}' uses integer() instead of bigint() or moneyMinor()`,
        });
      }
    }
    
    // Check for numeric(18,2) pattern (old decimal money - incorrect)
    const numericMoneyMatch = content.match(/(\w*[Aa]mount\w*|total\w*|price\w*|cost\w*):\s*numeric\([^)]*18[^)]*2[^)]*\)/);
    if (numericMoneyMatch) {
      violations.push({
        file,
        issue: `Money column '${numericMoneyMatch[1]}' uses numeric(18,2) instead of bigint minor units`,
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
    id: 'MONEY-01',
    name: 'Money Columns Must Use Bigint',
    description: 'Ensures all money columns use bigint minor units via moneyMinor() helper',
    severity: 'high',
    rationale: 'Prevents overflow on large transactions and avoids floating-point issues',
  };
}
