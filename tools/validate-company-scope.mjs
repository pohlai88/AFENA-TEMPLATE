#!/usr/bin/env node

/**
 * Company Scope Validator — SQL-based CI enforcement
 * 
 * Validates that:
 * R1: Tables with company_id are in allowlist
 * R2: Allowlisted tables have composite FK to companies
 * R3: ISSUER-scoped tables have company_id NOT NULL
 * 
 * Usage: node tools/validate-company-scope.mjs
 * Run after: drizzle-kit generate
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import allowlist (using dynamic import for ESM)
const { COMPANY_SCOPED_TABLES, COMPANY_REQUIRED_TABLES, LINE_TABLES_TO_CLEAN } = await import(
  '../packages/database/src/governance/company-scope.allowlist.ts'
);

const MIGRATIONS_DIR = join(__dirname, '../packages/database/drizzle');
const COMPOSITE_FK_PATTERN = /FOREIGN KEY\s*\(\s*"org_id"\s*,\s*"company_id"\s*\)\s*REFERENCES\s+(?:"[^"]+"\.)?"companies"\s*\(\s*"org_id"\s*,\s*"id"\s*\)/gi;
const ALTER_FK_PATTERN = /ALTER TABLE\s+"([^"]+)"\s+ADD CONSTRAINT[^;]+FOREIGN KEY\s*\(\s*"org_id"\s*,\s*"company_id"\s*\)\s*REFERENCES\s+(?:"[^"]+"\.)?"companies"/gi;
const ALTER_NOT_NULL_PATTERN = /ALTER TABLE\s+"([^"]+)"\s+ALTER COLUMN\s+"company_id"\s+SET NOT NULL/gi;
const DROP_COLUMN_PATTERN = /ALTER TABLE\s+"([^"]+)"\s+DROP COLUMN\s+"company_id"/gi;

/**
 * Parse SQL migrations to extract table metadata
 */
function parseMigrations() {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  const tableCompanyIdStatus = new Map(); // table -> has company_id
  const tableCompositeFK = new Set(); // tables with composite FK
  const tableCompanyIdNotNull = new Set(); // tables with company_id NOT NULL

  for (const file of files) {
    const path = join(MIGRATIONS_DIR, file);
    const sql = readFileSync(path, 'utf-8');

    // Extract CREATE TABLE statements
    const createTableRegex = /CREATE TABLE\s+"([^"]+)"\s*\(([\s\S]+?)\);/gi;
    let match;

    while ((match = createTableRegex.exec(sql)) !== null) {
      const tableName = match[1];
      const tableBody = match[2];

      // Check if table has company_id column
      const companyIdMatch = tableBody.match(/"company_id"\s+uuid/i);
      if (companyIdMatch) {
        tableCompanyIdStatus.set(tableName, true);

        // Check if company_id is NOT NULL
        const notNullMatch = tableBody.match(/"company_id"\s+uuid\s+NOT\s+NULL/i);
        if (notNullMatch) {
          tableCompanyIdNotNull.add(tableName);
        }
      }

      // Check for composite FK
      if (COMPOSITE_FK_PATTERN.test(tableBody)) {
        tableCompositeFK.add(tableName);
      }
    }

    // Also check ALTER TABLE for FKs (some migrations add FKs separately)
    while ((match = ALTER_FK_PATTERN.exec(sql)) !== null) {
      tableCompositeFK.add(match[1]);
    }

    // Check ALTER COLUMN SET NOT NULL for company_id
    while ((match = ALTER_NOT_NULL_PATTERN.exec(sql)) !== null) {
      tableCompanyIdNotNull.add(match[1]);
    }

    // Track DROP COLUMN company_id (table no longer has company_id)
    while ((match = DROP_COLUMN_PATTERN.exec(sql)) !== null) {
      tableCompanyIdStatus.delete(match[1]);
      tableCompanyIdNotNull.delete(match[1]);
    }
  }

  return { tableCompanyIdStatus, tableCompositeFK, tableCompanyIdNotNull };
}

/**
 * Validate RULE R1: Tables with company_id must be allowlisted
 */
function validateAllowlist(tableCompanyIdStatus) {
  const violations = [];
  const allowlistSet = new Set(Object.keys(COMPANY_SCOPED_TABLES));

  for (const [table, hasCompanyId] of tableCompanyIdStatus) {
    if (hasCompanyId && !allowlistSet.has(table)) {
      violations.push({
        rule: 'R1',
        table,
        message: `Table "${table}" has company_id but is not in allowlist`,
        fix: `Add to COMPANY_SCOPED_TABLES in packages/database/src/governance/company-scope.allowlist.ts`,
      });
    }
  }

  return violations;
}

/**
 * Validate RULE R2: Allowlisted tables must have composite FK
 */
function validateCompositeFK(tableCompanyIdStatus, tableCompositeFK) {
  const violations = [];
  const allowlistSet = new Set(Object.keys(COMPANY_SCOPED_TABLES));

  for (const table of allowlistSet) {
    // Skip line tables being cleaned (they're in transition)
    if (LINE_TABLES_TO_CLEAN.includes(table)) {
      continue;
    }

    if (tableCompanyIdStatus.has(table) && !tableCompositeFK.has(table)) {
      violations.push({
        rule: 'R2',
        table,
        scope: COMPANY_SCOPED_TABLES[table],
        message: `Table "${table}" is allowlisted but missing composite FK to companies`,
        fix: `Add foreignKey({ columns: [table.orgId, table.companyId], foreignColumns: [companies.orgId, companies.id] })`,
      });
    }
  }

  return violations;
}

/**
 * Validate RULE R3: ISSUER-scoped tables must have company_id NOT NULL
 */
function validateNotNull(tableCompanyIdStatus, tableCompanyIdNotNull) {
  const violations = [];
  const requiredSet = new Set(COMPANY_REQUIRED_TABLES);

  for (const table of requiredSet) {
    if (tableCompanyIdStatus.has(table) && !tableCompanyIdNotNull.has(table)) {
      violations.push({
        rule: 'R3',
        table,
        scope: COMPANY_SCOPED_TABLES[table],
        message: `Table "${table}" should have company_id NOT NULL (scope: ${COMPANY_SCOPED_TABLES[table]})`,
        fix: `Change company_id column to .notNull() in schema`,
      });
    }
  }

  return violations;
}

/**
 * Main validation
 */
async function main() {
  console.log('🔍 Validating company_id scope governance...\n');

  const { tableCompanyIdStatus, tableCompositeFK, tableCompanyIdNotNull } = parseMigrations();

  console.log(`📊 Found ${tableCompanyIdStatus.size} tables with company_id`);
  console.log(`📊 Found ${tableCompositeFK.size} tables with composite FK`);
  console.log(`📊 Found ${tableCompanyIdNotNull.size} tables with company_id NOT NULL\n`);

  // Run validations
  const r1Violations = validateAllowlist(tableCompanyIdStatus);
  const r2Violations = validateCompositeFK(tableCompanyIdStatus, tableCompositeFK);
  const r3Violations = validateNotNull(tableCompanyIdStatus, tableCompanyIdNotNull);

  const allViolations = [...r1Violations, ...r2Violations, ...r3Violations];

  if (allViolations.length === 0) {
    console.log('✅ All company_id scope rules validated successfully!');
    console.log(`✅ R1: Allowlist check passed`);
    console.log(`✅ R2: Composite FK check passed`);
    console.log(`✅ R3: NOT NULL check passed`);
    process.exit(0);
  }

  // Report violations
  console.error('❌ Company scope violations found:\n');

  for (const violation of allViolations) {
    console.error(`[${violation.rule}] ${violation.message}`);
    if (violation.scope) {
      console.error(`    Scope: ${violation.scope}`);
    }
    console.error(`    Fix: ${violation.fix}\n`);
  }

  console.error(`\n❌ ${allViolations.length} violation(s) found`);
  console.error('\nRules:');
  console.error('  R1: Tables with company_id must be in allowlist');
  console.error('  R2: Allowlisted tables must have composite FK to companies');
  console.error('  R3: Required tables must have company_id NOT NULL');
  
  process.exit(1);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
