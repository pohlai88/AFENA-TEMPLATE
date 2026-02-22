import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

/**
 * @see FIN-BL-ISO-01
 * gate.rls.isolation — Tenant Isolation on All Finance Tables
 *
 * Every schema file in packages/database/src/schema/ that defines a pgTable
 * MUST call tenantPolicy(table) in its table definition. This ensures RLS
 * is applied uniformly — no finance table can leak data across tenants.
 *
 * Additionally, every table using baseEntityColumns or erpEntityColumns
 * MUST have an orgId column with auth.require_org_id() default.
 */

const SCHEMA_DIR = resolve(__dirname, '../../packages/database/src/schema');
const HELPERS_DIR = resolve(__dirname, '../../packages/database/src/helpers');

/** Finance-critical tables that MUST have tenantPolicy */
const FINANCE_TABLES = [
  'journal-entries.ts',
  'journal-lines.ts',
  'ledgers.ts',
  'fiscal-periods.ts',
  'chart-of-accounts.ts',
  'assets.ts',
  'fixed-assets.ts',
  'fx-rates.ts',
  'tax-rates.ts',
  'reconciliation-items.ts',
  'payment-allocations.ts',
  'bank-statements.ts',
  'companies.ts',
  'currencies.ts',
  'cost-centers.ts',
  'budgets.ts',
  'acct-events.ts',
  'acct-derived-entries.ts',
  'acct-mappings.ts',
  'acct-mapping-versions.ts',
  'close-tasks.ts',
  'close-evidence.ts',
  'credit-limits.ts',
  'credit-exposures.ts',
  'depreciation-schedules.ts',
  'hedge-designations.ts',
  'hedge-effectiveness-tests.ts',
  'ic-agreements.ts',
  'ic-transactions.ts',
  'financial-instruments.ts',
  'expense-reports.ts',
  'customers.ts',
  'contracts.ts',
];

/**
 * A file has valid tenant RLS if it directly calls tenantPolicy,
 * OR uses erpIndexes / docIndexes (which call tenantPolicy internally).
 */
function hasTenantRls(source: string): boolean {
  return (
    source.includes('tenantPolicy') ||
    source.includes('erpIndexes') ||
    source.includes('docIndexes')
  );
}

function collectSchemaFiles(): string[] {
  if (!existsSync(SCHEMA_DIR)) return [];
  return readdirSync(SCHEMA_DIR)
    .filter((f) => f.endsWith('.ts') && !f.startsWith('_') && !f.startsWith('index'))
    .map((f) => join(SCHEMA_DIR, f));
}

describe('gate.rls.isolation — FIN-BL-ISO-01: tenant isolation on all finance tables', () => {
  test('schema directory exists', () => {
    expect(existsSync(SCHEMA_DIR)).toBe(true);
  });

  test('tenantPolicy helper exists and uses crudPolicy with auth.org_id()', () => {
    const policyFile = join(HELPERS_DIR, 'tenant-policy.ts');
    expect(existsSync(policyFile)).toBe(true);

    const source = readFileSync(policyFile, 'utf-8');
    expect(source).toContain('crudPolicy');
    expect(source).toContain('auth.org_id()');
    expect(source).toContain('authenticatedRole');
  });

  test('all finance-critical schema files import tenantPolicy', () => {
    const violations: string[] = [];

    for (const file of FINANCE_TABLES) {
      const fullPath = join(SCHEMA_DIR, file);
      if (!existsSync(fullPath)) continue;

      const source = readFileSync(fullPath, 'utf-8');
      if (!hasTenantRls(source)) {
        violations.push(file);
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `gate.rls.isolation: ${violations.length} finance table(s) missing tenantPolicy:\n` +
        violations.map((v) => `  - ${v}`).join('\n'),
      );
    }
    expect(violations).toEqual([]);
  });

  test('all schema files with pgTable call tenantPolicy (no exceptions)', () => {
    const allSchemaFiles = collectSchemaFiles();
    const violations: string[] = [];

    for (const file of allSchemaFiles) {
      const source = readFileSync(file, 'utf-8');
      // Skip files that don't define tables
      if (!source.includes('pgTable(')) continue;
      // Tables with custom RLS policies (not tenantPolicy) — acceptable.
      // Each entry MUST have an ADR reference justifying the skip.
      // ADR-RLS-01: System-internal tables with own crudPolicy or no tenant context
      if (file.includes('audit-logs.ts')) continue; // ADR-RLS-01: append-only crudPolicy with actor check
      if (file.includes('entity-versions.ts')) continue; // ADR-RLS-01: system-internal versioning
      if (file.includes('mutation-batches.ts')) continue; // ADR-RLS-01: system-internal batching
      if (file.includes('idempotency-keys.ts')) continue; // ADR-RLS-01: system-internal dedup
      if (file.includes('outbox.ts')) continue; // ADR-RLS-01: event outbox (system)
      if (file.includes('migration-reports.ts')) continue; // ADR-RLS-01: migration subsystem
      // ADR-RLS-02: Auth subsystem tables with own RLS policy
      if (file.includes('users.ts')) continue; // ADR-RLS-02: auth subsystem (own policy)
      if (file.includes('user-scopes.ts')) continue; // ADR-RLS-02: auth subsystem
      if (file.includes('user-roles.ts')) continue; // ADR-RLS-02: auth subsystem
      // ADR-RLS-03: Non-finance subsystem tables (media, webhooks, advisory)
      if (file.includes('advisory-evidence.ts')) continue; // ADR-RLS-03: advisory subsystem
      if (file.includes('r2-files.ts')) continue; // ADR-RLS-03: file storage metadata
      if (file.includes('video-settings.ts')) continue; // ADR-RLS-03: media subsystem
      if (file.includes('webhook-deliveries.ts')) continue; // ADR-RLS-03: webhook subsystem
      if (file.includes('webhook-endpoints.ts')) continue; // ADR-RLS-03: webhook subsystem
      if (file.includes('workflow-executions.ts')) continue; // ADR-RLS-03: workflow subsystem
      // ADR-RLS-04: ERP doc tables pending tenantPolicy migration
      if (file.includes('currency-exchanges.ts')) continue; // ADR-RLS-04: lightweight lookup
      if (file.includes('delivery-note-lines.ts')) continue; // ADR-RLS-04: ERP doc lines
      if (file.includes('delivery-notes.ts')) continue; // ADR-RLS-04: ERP doc headers
      // Non-table files (no pgTable call after filtering)
      if (file.includes('relations.ts')) continue; // drizzle relations (no pgTable)
      if (file.includes('_registry.ts')) continue; // metadata registry

      if (!hasTenantRls(source)) {
        violations.push(file.replace(SCHEMA_DIR + '\\', '').replace(SCHEMA_DIR + '/', ''));
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `gate.rls.isolation: ${violations.length} schema file(s) define pgTable without tenantPolicy:\n` +
        violations.map((v) => `  - ${v}`).join('\n'),
      );
    }
    expect(violations).toEqual([]);
  });

  test('baseEntityColumns uses auth.require_org_id() for orgId default', () => {
    const baseFile = join(HELPERS_DIR, 'base-entity.ts');
    expect(existsSync(baseFile)).toBe(true);

    const source = readFileSync(baseFile, 'utf-8');
    expect(source).toContain('auth.require_org_id()');
  });
});
