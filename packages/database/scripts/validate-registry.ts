/**
 * Table Registry Validation Script
 * 
 * Validates that TABLE_REGISTRY is complete and compliant with taxonomy rules.
 * 
 * Enforces:
 * - Gate SCH-TAX-01: All tables in schema are registered
 * - Gate SCH-TAX-02: All registered tables comply with taxonomy rules
 * 
 * Usage:
 *   npx tsx scripts/validate-registry.ts
 */

import { readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { TABLE_REGISTRY, TAXONOMY_RULES, validateRegistry } from '../src/schema/_registry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalTables: number;
    registeredTables: number;
    unregisteredTables: number;
    byKind: Record<string, number>;
  };
}

/**
 * Get all schema files from src/schema directory
 * Converts kebab-case filenames to snake_case to match registry keys
 */
function getSchemaFiles(): string[] {
  const schemaDir = join(__dirname, '../src/schema');
  const files = readdirSync(schemaDir);

  return files
    .filter(f => f.endsWith('.ts'))
    .filter(f => f !== 'index.ts' && f !== '_registry.ts' && f !== 'relations.ts')
    .map(f => f.replace('.ts', '').replace(/-/g, '_')); // Convert kebab-case to snake_case
}

/**
 * Validate registry completeness
 */
function validateCompleteness(): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  const schemaFiles = getSchemaFiles();
  const registeredTables = Object.keys(TABLE_REGISTRY);

  // Check for unregistered tables
  const unregistered = schemaFiles.filter(f => !registeredTables.includes(f));
  if (unregistered.length > 0) {
    errors.push(`Gate SCH-TAX-01 FAILED: ${unregistered.length} unregistered tables found:`);
    unregistered.forEach(table => {
      errors.push(`  - ${table}.ts (schema file exists but not in TABLE_REGISTRY)`);
    });
  }

  // Check for registered tables without schema files
  const missingFiles = registeredTables.filter(t => !schemaFiles.includes(t));
  if (missingFiles.length > 0) {
    warnings.push(`${missingFiles.length} registered tables have no schema file:`);
    missingFiles.forEach(table => {
      warnings.push(`  - ${table} (in TABLE_REGISTRY but no ${table}.ts file)`);
    });
  }

  return { errors, warnings };
}

/**
 * Validate taxonomy compliance
 */
function validateTaxonomy(): { errors: string[]; warnings: string[] } {
  const result = validateRegistry();
  const warnings: string[] = [];

  if (!result.valid) {
    return {
      errors: [
        'Gate SCH-TAX-02 FAILED: Taxonomy rule violations:',
        ...result.errors.map(e => `  - ${e}`)
      ],
      warnings,
    };
  }

  return { errors: [], warnings };
}

/**
 * Generate statistics
 */
function generateStats(): ValidationResult['stats'] {
  const schemaFiles = getSchemaFiles();
  const registeredTables = Object.keys(TABLE_REGISTRY);

  const byKind: Record<string, number> = {};
  for (const [_, metadata] of Object.entries(TABLE_REGISTRY)) {
    byKind[metadata.kind] = (byKind[metadata.kind] || 0) + 1;
  }

  return {
    totalTables: schemaFiles.length,
    registeredTables: registeredTables.length,
    unregisteredTables: schemaFiles.length - registeredTables.length,
    byKind,
  };
}

/**
 * Main validation function
 */
function validateTableRegistry(): ValidationResult {
  console.log('🔍 Validating Table Registry...\n');

  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate completeness
  const completeness = validateCompleteness();
  errors.push(...completeness.errors);
  warnings.push(...completeness.warnings);

  // Validate taxonomy
  const taxonomy = validateTaxonomy();
  errors.push(...taxonomy.errors);
  warnings.push(...taxonomy.warnings);

  // Generate stats
  const stats = generateStats();

  return {
    success: errors.length === 0,
    errors,
    warnings,
    stats,
  };
}

/**
 * Print validation results
 */
function printResults(result: ValidationResult): void {
  // Print statistics
  console.log('📊 Statistics:');
  console.log(`  Total schema files: ${result.stats.totalTables}`);
  console.log(`  Registered tables: ${result.stats.registeredTables}`);
  console.log(`  Unregistered tables: ${result.stats.unregisteredTables}`);
  console.log('\n  By taxonomy kind:');
  for (const [kind, count] of Object.entries(result.stats.byKind)) {
    const rule = TAXONOMY_RULES[kind as keyof typeof TAXONOMY_RULES];
    console.log(`    ${kind}: ${count} (${rule?.description || 'no description'})`);
  }
  console.log('');

  // Print warnings
  if (result.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    result.warnings.forEach(w => console.log(w));
    console.log('');
  }

  // Print errors
  if (result.errors.length > 0) {
    console.log('❌ Errors:');
    result.errors.forEach(e => console.log(e));
    console.log('');
  }

  // Print result
  if (result.success) {
    console.log('✅ Registry validation PASSED');
    console.log('   All tables are registered and comply with taxonomy rules.');
  } else {
    console.log('❌ Registry validation FAILED');
    console.log(`   ${result.errors.length} error(s) found.`);
    console.log('   Fix errors above and run validation again.');
  }
}

// Run validation
const result = validateTableRegistry();
printResults(result);

// Exit with appropriate code
process.exit(result.success ? 0 : 1);
