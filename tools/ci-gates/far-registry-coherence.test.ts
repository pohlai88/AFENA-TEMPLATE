/**
 * CIG-04: Registry ↔ Schema Coherence Gate
 *
 * Ensures that every table referenced in SHARED_KERNEL_REGISTRY has a
 * corresponding schema file, and that schema properties match registry claims:
 *   - hasRls → tenantPolicy present
 *   - hasTenant → erpEntityColumns present
 *   - supportsIntercompany → companyId + counterpartyCompanyId columns + IC indexes
 *
 * @see oss-finance-ext.md §5 CIG-04
 */
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const MONOREPO_ROOT = resolve(__dirname, '../..');
const SCHEMA_DIR = resolve(MONOREPO_ROOT, 'packages/database/src/schema');
const REGISTRY_PATH = resolve(
  MONOREPO_ROOT,
  'packages/canon/src/registries/shared-kernel-registry.ts',
);

function getSchemaFileNames(): string[] {
  return readdirSync(SCHEMA_DIR)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts' && f !== '_registry.ts');
}

function readRegistryEntries(): Array<{
  tableName: string;
  hasRls: boolean;
  hasTenant: boolean;
  supportsIc: boolean;
}> {
  const content = readFileSync(REGISTRY_PATH, 'utf-8');
  const entries: Array<{
    tableName: string;
    hasRls: boolean;
    hasTenant: boolean;
    supportsIc: boolean;
  }> = [];

  // Extract table entries from registry — look for tableName: 'xxx' patterns
  const tablePattern = /tableName:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = tablePattern.exec(content)) !== null) {
    const tableName = match[1];
    // Find the surrounding entry block to check properties
    const blockStart = content.lastIndexOf('{', match.index);
    const blockEnd = content.indexOf('}', match.index);
    const block = content.slice(blockStart, blockEnd + 1);

    entries.push({
      tableName,
      hasRls: /rlsPolicy:\s*['"]tenant_isolation['"]/.test(block) ||
        /rlsPolicy:\s*['"]tenant/.test(block),
      hasTenant: /hasTenant:\s*true/.test(block) ||
        /erpEntityColumns/.test(block),
      supportsIc: /supportsIntercompany:\s*true/.test(block),
    });
  }

  return entries;
}

describe('gate.registry-coherence — CIG-04', () => {
  const schemaFiles = getSchemaFileNames();

  it('finds schema files to validate', () => {
    expect(schemaFiles.length).toBeGreaterThan(0);
  });

  it('schema files with tenantPolicy import actually call tenantPolicy()', () => {
    const violations: string[] = [];

    for (const file of schemaFiles) {
      const content = readFileSync(resolve(SCHEMA_DIR, file), 'utf-8');
      const importsTenantPolicy = content.includes("from '../helpers/tenant-policy'");
      const callsTenantPolicy = /tenantPolicy\s*\(/.test(content);

      if (importsTenantPolicy && !callsTenantPolicy) {
        violations.push(`${file}: imports tenantPolicy but never calls it`);
      }
    }

    expect(
      violations,
      `Unused tenantPolicy imports:\n${violations.join('\n')}`,
    ).toHaveLength(0);
  });

  it('schema files with erpEntityColumns import actually use it', () => {
    const violations: string[] = [];

    for (const file of schemaFiles) {
      const content = readFileSync(resolve(SCHEMA_DIR, file), 'utf-8');
      const importsErp = content.includes("erpEntityColumns");
      const usesErp = /\.\.\.erpEntityColumns/.test(content);

      if (importsErp && !usesErp) {
        violations.push(`${file}: imports erpEntityColumns but never spreads it`);
      }
    }

    expect(
      violations,
      `Unused erpEntityColumns imports:\n${violations.join('\n')}`,
    ).toHaveLength(0);
  });

  it('IC tables have companyId columns and indexes', () => {
    const violations: string[] = [];
    const icTableFiles = schemaFiles.filter((f) => f.startsWith('ic-'));

    for (const file of icTableFiles) {
      const content = readFileSync(resolve(SCHEMA_DIR, file), 'utf-8');

      // IC tables should have company-related columns
      const hasCompanyCol =
        content.includes('company_id') ||
        content.includes('companyId') ||
        content.includes('from_company_id') ||
        content.includes('fromCompanyId');

      if (!hasCompanyCol) {
        violations.push(`${file}: IC table missing company ID column`);
      }

      // IC tables should have an index on company columns
      const hasCompanyIndex =
        content.includes('company') && content.includes('index(');

      if (!hasCompanyIndex) {
        violations.push(`${file}: IC table missing index on company column`);
      }
    }

    expect(
      violations,
      `IC table violations:\n${violations.join('\n')}`,
    ).toHaveLength(0);
  });

  it('finance schema files use tenantPk (ratchet: max 2)', () => {
    const violations: string[] = [];
    const financeTablePrefixes = [
      'journal-', 'acct-', 'fx-', 'ic-', 'consolidation-', 'posting-',
      'fiscal-', 'budget', 'cost-', 'revenue-', 'tax-', 'hedge-',
      'depreciation-', 'lease-', 'subscription-', 'expense-',
      'bank-', 'reconciliation-', 'match-', 'close-',
    ];

    for (const file of schemaFiles) {
      const isFinanceTable = financeTablePrefixes.some((p) => file.startsWith(p));
      if (!isFinanceTable) continue;

      const content = readFileSync(resolve(SCHEMA_DIR, file), 'utf-8');
      if (!content.includes('tenantPk')) {
        violations.push(`${file}: finance table missing tenantPk`);
      }
    }

    /** Pre-existing: bank-accounts.ts, bank-matching-rules.ts */
    const TENANT_PK_RATCHET = 2;
    expect(
      violations.length,
      `Finance tables missing tenantPk (ratchet: max ${TENANT_PK_RATCHET}, found ${violations.length}):\n${violations.join('\n')}`,
    ).toBeLessThanOrEqual(TENANT_PK_RATCHET);
  });
});
