/* eslint-disable no-console, no-restricted-syntax */
/**
 * Add composite PK to all truth table schema files - GAP-DB-001 implementation
 * 
 * This script updates Drizzle schema files to use composite PK (org_id, id)
 * for all truth tables as defined in _registry.ts
 * 
 * Run: npx tsx src/scripts/add-composite-pk-to-schemas.ts
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { TABLE_REGISTRY } from '../schema/_registry';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tables already updated manually
const ALREADY_UPDATED = new Set(['contacts', 'companies']);

// Get all truth tables from registry
const truthTables = Object.entries(TABLE_REGISTRY)
  .filter(([_, kind]) => kind === 'truth')
  .map(([table]) => table)
  .filter((table) => !ALREADY_UPDATED.has(table));

console.log(`Found ${truthTables.length} truth tables to update (${ALREADY_UPDATED.size} already done)`);

let updated = 0;
let skipped = 0;
let errors = 0;

for (const tableName of truthTables) {
  const schemaFile = join(__dirname, `../schema/${tableName.replace(/_/g, '-')}.ts`);

  try {
    let content = readFileSync(schemaFile, 'utf-8');

    // Check if already has composite PK
    if (content.includes('primaryKey({')) {
      console.log(`⏭️  ${tableName}: Already has composite PK`);
      skipped++;
      continue;
    }

    // Check if file has pgTable
    if (!content.includes('pgTable')) {
      console.log(`⏭️  ${tableName}: Not a pgTable schema`);
      skipped++;
      continue;
    }

    // Add primaryKey to imports if not present
    if (!content.includes('primaryKey')) {
      content = content.replace(
        /from 'drizzle-orm\/pg-core'/,
        (match) => {
          // Find the import statement
          const importMatch = content.match(/import \{([^}]+)\} from 'drizzle-orm\/pg-core'/);
          if (importMatch) {
            const imports = importMatch[1].split(',').map((s) => s.trim());
            if (!imports.includes('primaryKey')) {
              imports.push('primaryKey');
              imports.sort();
              return `from 'drizzle-orm/pg-core'`;
            }
          }
          return match;
        }
      );

      // Actually update the import line
      content = content.replace(
        /import \{([^}]+)\} from 'drizzle-orm\/pg-core'/,
        (_match: string, imports: string) => {
          const importList = imports.split(',').map((s) => s.trim());
          if (!importList.includes('primaryKey')) {
            importList.push('primaryKey');
            importList.sort();
          }
          return `import { ${importList.join(', ')} } from 'drizzle-orm/pg-core'`;
        },
      );
    }

    // Add GAP-DB-001 comment if not present
    if (!content.includes('GAP-DB-001')) {
      content = content.replace(
        /export const \w+ = pgTable\(/,
        (match) => `/**\n * GAP-DB-001: Composite PK (org_id, id) for data integrity and tenant isolation.\n */\n${match}`
      );
    }

    // Add primaryKey declaration after table definition
    // Look for the (table) => [ pattern and add primaryKey as first item
    content = content.replace(
      /(\(table\) => \[)\s*\n\s*(index\(')/,
      (match, arrow, indexStart) => {
        return `${arrow}\n    primaryKey({ columns: [table.orgId, table.id] }),\n    ${indexStart}`;
      }
    );

    // Remove redundant org_id index if it exists (composite PK covers it)
    content = content.replace(
      /\s*index\('\w+_org_id_idx'\)\.on\(table\.orgId,\s*table\.id\),?\n/,
      ''
    );

    writeFileSync(schemaFile, content, 'utf-8');
    console.log(`✅ ${tableName}: Updated`);
    updated++;

  } catch (error) {
    console.error(`❌ ${tableName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    errors++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`   ✅ Updated: ${updated}`);
console.log(`   ⏭️  Skipped: ${skipped}`);
console.log(`   ❌ Errors: ${errors}`);
console.log(`   📝 Total truth tables: ${truthTables.length + ALREADY_UPDATED.size}`);

if (errors > 0) {
  console.log(`\n⚠️  Some files had errors. Please review and update manually.`);
  process.exit(1);
}

console.log(`\n✅ All truth tables updated with composite PK!`);
console.log(`\nNext steps:`);
console.log(`1. Run: pnpm --filter afena-database build`);
console.log(`2. Run: pnpm --filter afena-database db:lint`);
console.log(`3. Apply SQL migration: psql $DATABASE_URL -f drizzle/0045_composite_pk_truth_tables.sql`);
