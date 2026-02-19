/**
 * Migration Safety Validation Script
 * 
 * Validates migration SQL for zero-downtime deployment safety.
 * 
 * Enforces:
 * - Gate MIG-ONLINE-01: Online DDL safety (no blocking operations)
 * - Gate MIG-TX-01: CONCURRENTLY operations must be non-transactional
 * 
 * Usage:
 *   npx tsx scripts/validate-migration-safety.ts <migration-file.sql>
 */

import { readFileSync } from 'fs';
import { join } from 'path';

interface MigrationMetadata {
  useTransaction?: boolean;
  ddlClass?: 'online-safe' | 'online-conditional' | 'offline-required';
  tableSize?: number;
  lockImpact?: 'none' | 'brief' | 'extended';
}

interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  metadata?: MigrationMetadata;
}

/**
 * Forbidden online DDL patterns (require maintenance window)
 */
const FORBIDDEN_ONLINE_PATTERNS = [
  // Table structure changes
  /ALTER\s+TABLE\s+\S+\s+ADD\s+COLUMN\s+\S+\s+.*NOT\s+NULL(?!\s+DEFAULT)/i, // NOT NULL without DEFAULT
  /ALTER\s+TABLE\s+\S+\s+ALTER\s+COLUMN\s+\S+\s+SET\s+NOT\s+NULL/i, // SET NOT NULL
  /ALTER\s+TABLE\s+\S+\s+ALTER\s+COLUMN\s+\S+\s+TYPE\s+(?!.*USING)/i, // TYPE without USING
  /ALTER\s+TABLE\s+\S+\s+DROP\s+COLUMN/i, // DROP COLUMN (use soft delete)
  
  // Constraints
  /ALTER\s+TABLE\s+\S+\s+ADD\s+CONSTRAINT\s+\S+\s+CHECK/i, // CHECK constraint (use NOT VALID)
  /ALTER\s+TABLE\s+\S+\s+ADD\s+CONSTRAINT\s+\S+\s+FOREIGN\s+KEY(?!.*NOT\s+VALID)/i, // FK without NOT VALID
  /ALTER\s+TABLE\s+\S+\s+ADD\s+CONSTRAINT\s+\S+\s+UNIQUE(?!.*USING\s+INDEX)/i, // UNIQUE without existing index
  
  // Indexes
  /CREATE\s+(?!.*CONCURRENTLY).*INDEX/i, // CREATE INDEX without CONCURRENTLY
  /DROP\s+INDEX(?!.*CONCURRENTLY)/i, // DROP INDEX without CONCURRENTLY
  /REINDEX/i, // REINDEX (always locks)
  
  // Table operations
  /TRUNCATE/i, // TRUNCATE (use DELETE)
  /VACUUM\s+FULL/i, // VACUUM FULL (locks table)
  /CLUSTER/i, // CLUSTER (locks table)
];

/**
 * Patterns requiring justification for large tables
 */
const REQUIRES_JUSTIFICATION = [
  /ALTER\s+TABLE\s+\S+\s+ADD\s+COLUMN/i,
  /CREATE\s+INDEX\s+CONCURRENTLY/i,
  /ALTER\s+TABLE\s+\S+\s+ADD\s+CONSTRAINT.*NOT\s+VALID/i,
];

/**
 * Patterns that must be non-transactional
 */
const NON_TRANSACTIONAL_PATTERNS = [
  /CREATE\s+INDEX\s+CONCURRENTLY/i,
  /DROP\s+INDEX\s+CONCURRENTLY/i,
  /CREATE\s+UNIQUE\s+INDEX\s+CONCURRENTLY/i,
  /REINDEX\s+.*CONCURRENTLY/i,
];

/**
 * Extract table name from DDL statement
 */
function extractTableName(statement: string): string | null {
  const match = statement.match(/(?:ALTER\s+TABLE|CREATE\s+INDEX.*ON)\s+["']?(\w+)["']?/i);
  return match ? match[1] : null;
}

/**
 * Check if migration contains CONCURRENTLY operations
 */
function hasConcurrentlyOperations(sql: string): boolean {
  return NON_TRANSACTIONAL_PATTERNS.some(pattern => pattern.test(sql));
}

/**
 * Validate online DDL safety
 */
function validateOnlineSafety(sql: string, tableSizes: Record<string, number> = {}): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const lines = sql.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNum = i + 1;
    
    // Skip comments and empty lines
    if (!line || line.startsWith('--') || line.startsWith('/*')) {
      continue;
    }
    
    // Check forbidden patterns
    for (const pattern of FORBIDDEN_ONLINE_PATTERNS) {
      if (pattern.test(line)) {
        errors.push(
          `Line ${lineNum}: MIG-ONLINE-01 violation - Forbidden online DDL pattern:\n` +
          `  ${line}\n` +
          `  This operation requires a maintenance window or blue-green deployment.`
        );
      }
    }
    
    // Check patterns requiring justification
    for (const pattern of REQUIRES_JUSTIFICATION) {
      if (pattern.test(line)) {
        const tableName = extractTableName(line);
        const tableSize = tableName ? tableSizes[tableName] || 0 : 0;
        
        if (tableSize > 1_000_000) {
          // Look for justification comment in previous lines
          const prevLines = lines.slice(Math.max(0, i - 5), i);
          const hasJustification = prevLines.some(l => 
            l.includes('JUSTIFIED:') || l.includes('JUSTIFICATION:')
          );
          
          if (!hasJustification) {
            warnings.push(
              `Line ${lineNum}: Operation on large table (${tableSize.toLocaleString()} rows) requires justification:\n` +
              `  ${line}\n` +
              `  Add comment: -- JUSTIFIED: ${tableName} - <reason>`
            );
          }
        }
      }
    }
  }
  
  return { errors, warnings };
}

/**
 * Validate CONCURRENTLY non-transaction requirement
 */
function validateConcurrentlyNonTransaction(
  sql: string,
  metadata: MigrationMetadata
): string[] {
  const errors: string[] = [];
  
  if (hasConcurrentlyOperations(sql)) {
    if (metadata.useTransaction !== false) {
      errors.push(
        'MIG-TX-01 violation: Migration contains CONCURRENTLY operations but useTransaction is not false.\n' +
        '  CONCURRENTLY operations cannot run inside a transaction block.\n' +
        '  Set useTransaction: false in migration metadata.'
      );
    }
  }
  
  return errors;
}

/**
 * Validate lock timeout and statement timeout
 */
function validateTimeouts(sql: string): string[] {
  const warnings: string[] = [];
  
  const hasLockTimeout = /SET\s+lock_timeout\s*=/i.test(sql);
  const hasStatementTimeout = /SET\s+statement_timeout\s*=/i.test(sql);
  
  if (!hasLockTimeout) {
    warnings.push(
      'Missing lock_timeout setting. Add at start of migration:\n' +
      '  SET lock_timeout = \'2s\';'
    );
  }
  
  if (!hasStatementTimeout) {
    warnings.push(
      'Missing statement_timeout setting. Add at start of migration:\n' +
      '  SET statement_timeout = \'30s\';'
    );
  }
  
  return warnings;
}

/**
 * Validate migration file
 */
function validateMigration(
  sqlContent: string,
  metadata: MigrationMetadata = {},
  tableSizes: Record<string, number> = {}
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validate online DDL safety
  const onlineSafety = validateOnlineSafety(sqlContent, tableSizes);
  errors.push(...onlineSafety.errors);
  warnings.push(...onlineSafety.warnings);
  
  // Validate CONCURRENTLY non-transaction
  const concurrentlyErrors = validateConcurrentlyNonTransaction(sqlContent, metadata);
  errors.push(...concurrentlyErrors);
  
  // Validate timeouts
  const timeoutWarnings = validateTimeouts(sqlContent);
  warnings.push(...timeoutWarnings);
  
  return {
    success: errors.length === 0,
    errors,
    warnings,
    metadata,
  };
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: npx tsx scripts/validate-migration-safety.ts <migration-file.sql>');
    process.exit(1);
  }
  
  const migrationFile = args[0];
  
  try {
    // Read migration file
    const sqlContent = readFileSync(migrationFile, 'utf-8');
    
    // Try to read metadata (if exists)
    const metadataFile = migrationFile.replace('.sql', '.meta.json');
    let metadata: MigrationMetadata = {};
    try {
      metadata = JSON.parse(readFileSync(metadataFile, 'utf-8'));
    } catch {
      // No metadata file, use defaults
    }
    
    // Validate
    console.log(`🔍 Validating migration: ${migrationFile}\n`);
    const result = validateMigration(sqlContent, metadata);
    
    // Print warnings
    if (result.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      result.warnings.forEach(w => console.log(`  ${w}\n`));
    }
    
    // Print errors
    if (result.errors.length > 0) {
      console.log('❌ Errors:');
      result.errors.forEach(e => console.log(`  ${e}\n`));
    }
    
    // Print result
    if (result.success) {
      console.log('✅ Migration validation PASSED');
      if (result.warnings.length > 0) {
        console.log(`   ${result.warnings.length} warning(s) - review recommended`);
      }
      process.exit(0);
    } else {
      console.log('❌ Migration validation FAILED');
      console.log(`   ${result.errors.length} error(s) must be fixed`);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error reading migration file:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

// Export for testing
export {
  validateMigration,
  validateOnlineSafety,
  validateConcurrentlyNonTransaction,
  hasConcurrentlyOperations,
  type ValidationResult,
  type MigrationMetadata,
};
