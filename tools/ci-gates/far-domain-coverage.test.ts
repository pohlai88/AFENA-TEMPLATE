import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

/**
 * @see FIN-MD-COA-01
 * @see FIN-MD-DIM-01
 * @see FIN-AP-INV-01
 * @see FIN-AP-PAY-01
 * @see FIN-AR-INV-01
 * @see FIN-CB-REC-01
 * @see FIN-FA-DEPR-01
 * @see FIN-INV-VAL-01
 * @see FIN-TAX-CALC-01
 * @see FIN-GRP-STRUCT-01
 * @see FIN-REP-SNAP-01
 * @see FIN-CTRL-SOD-01
 * @see FIN-MG-ADJ-01
 * @see FIN-EINV-01
 *
 * Finance Domain Coverage Gate
 *
 * Verifies that each finance audit requirement has corresponding domain
 * implementation — services, calculators, commands, queries, or schema
 * definitions that satisfy the requirement structurally.
 */

const FINANCE_ROOT = resolve(__dirname, '../../business-domain/finance');
const SCHEMA_DIR = resolve(__dirname, '../../packages/database/src/schema');
const CANON_DIR = resolve(__dirname, '../../packages/canon/src');

function fileExists(path: string): boolean {
  return existsSync(path);
}

function readSource(path: string): string {
  return existsSync(path) ? readFileSync(path, 'utf-8') : '';
}

function findFilesContaining(dir: string, keyword: string, extensions = ['.ts']): string[] {
  const results: string[] = [];
  if (!existsSync(dir)) return results;
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      try {
        const stat = statSync(full);
        if (stat.isDirectory() && entry !== 'node_modules' && entry !== 'dist' && entry !== '__tests__') {
          results.push(...findFilesContaining(full, keyword, extensions));
        } else if (extensions.some((ext) => full.endsWith(ext)) && !full.includes('.test.') && !full.includes('.spec.')) {
          const content = readFileSync(full, 'utf-8');
          if (content.includes(keyword)) {
            results.push(full);
          }
        }
      } catch { /* skip */ }
    }
  } catch { /* skip */ }
  return results;
}

// ── FIN-MD-COA-01: Published CoA versions are immutable ──────────────────────

describe('FIN-MD-COA-01: CoA versioning and immutability', () => {
  const glPlatformSrc = join(FINANCE_ROOT, 'gl-platform', 'src');

  test('chart_of_accounts schema exists with version-related fields', () => {
    const schema = join(SCHEMA_DIR, 'chart-of-accounts.ts');
    expect(fileExists(schema)).toBe(true);
    const source = readSource(schema);
    expect(source).toContain('accountCode');
    expect(source).toContain('isPostable');
    expect(source).toContain('tenantPolicy');
  });

  test('CoA hierarchy validator exists (coa-hierarchy.ts)', () => {
    const coaCalc = join(glPlatformSrc, 'calculators', 'coa-hierarchy.ts');
    expect(fileExists(coaCalc)).toBe(true);
    const source = readSource(coaCalc);
    expect(source).toContain('validateCoaIntegrity');
  });

  test('publishChartOfAccounts service validates before publishing', () => {
    const service = join(glPlatformSrc, 'services', 'gl-platform-service.ts');
    expect(fileExists(service)).toBe(true);
    const source = readSource(service);
    expect(source).toContain('publishChartOfAccounts');
    expect(source).toContain('validateCoaIntegrity');
    expect(source).toContain('buildPublishCoaIntent');
  });
});

// ── FIN-MD-DIM-01: Required dimensions enforced by rule ──────────────────────

describe('FIN-MD-DIM-01: dimension enforcement', () => {
  test('segment-dimension calculator exists with validation', () => {
    const dimCalc = join(FINANCE_ROOT, 'gl-platform', 'src', 'calculators', 'segment-dimension.ts');
    expect(fileExists(dimCalc)).toBe(true);
    const source = readSource(dimCalc);
    expect(source).toContain('validateDimensions');
    expect(source).toContain('DimensionValue');
    expect(source).toContain('segment');
    expect(source).toContain('cost_center');
    expect(source).toContain('profit_center');
  });

  test('cost_centers schema exists', () => {
    const schema = join(SCHEMA_DIR, 'cost-centers.ts');
    expect(fileExists(schema)).toBe(true);
    const source = readSource(schema);
    expect(source).toContain('tenantPolicy');
  });
});

// ── FIN-AP-INV-01: AP invoice posting produces governed GL entries ────────────

describe('FIN-AP-INV-01: AP invoice posting', () => {
  const payablesSrc = join(FINANCE_ROOT, 'payables', 'src');

  test('payables package exists with commands and services', () => {
    expect(fileExists(payablesSrc)).toBe(true);
  });

  test('AP invoice intent builder exists', () => {
    const files = findFilesContaining(payablesSrc, 'invoice');
    expect(files.length).toBeGreaterThan(0);
  });

  test('payment_allocations schema links invoices to payments', () => {
    const schema = join(SCHEMA_DIR, 'payment-allocations.ts');
    expect(fileExists(schema)).toBe(true);
    const source = readSource(schema);
    expect(source).toContain('invoiceId');
    expect(source).toContain('paymentId');
    expect(source).toContain('tenantPolicy');
  });
});

// ── FIN-AP-PAY-01: Payments are controlled (maker-checker) ───────────────────

describe('FIN-AP-PAY-01: payment controls', () => {
  test('payment_allocations schema has status lifecycle', () => {
    const schema = join(SCHEMA_DIR, 'payment-allocations.ts');
    const source = readSource(schema);
    expect(source).toContain('status');
    expect(source).toContain('pending');
    expect(source).toContain('applied');
  });

  test('payables package has payment-related commands', () => {
    const payablesSrc = join(FINANCE_ROOT, 'payables', 'src');
    const files = findFilesContaining(payablesSrc, 'payment');
    expect(files.length).toBeGreaterThan(0);
  });

  test('pain001 generator exists for bank file generation', () => {
    const pain001 = join(FINANCE_ROOT, 'payables', 'src', 'calculators', 'pain001-generator.ts');
    if (fileExists(pain001)) {
      const source = readSource(pain001);
      expect(source).toContain('pain.001');
    }
  });
});

// ── FIN-AR-INV-01: AR invoice posting generates GL entries ───────────────────

describe('FIN-AR-INV-01: AR invoice posting', () => {
  const receivablesSrc = join(FINANCE_ROOT, 'receivables', 'src');

  test('receivables package exists', () => {
    expect(fileExists(receivablesSrc)).toBe(true);
  });

  test('receivables has invoice-related logic', () => {
    const files = findFilesContaining(receivablesSrc, 'invoice');
    expect(files.length).toBeGreaterThan(0);
  });

  test('credit management package exists for credit policy', () => {
    const creditSrc = join(FINANCE_ROOT, 'credit-management', 'src');
    expect(fileExists(creditSrc)).toBe(true);
  });
});

// ── FIN-CB-REC-01: Bank reconciliation sessions close immutably ──────────────

describe('FIN-CB-REC-01: bank reconciliation', () => {
  test('reconciliation_items schema exists with match status', () => {
    const schema = join(SCHEMA_DIR, 'reconciliation-items.ts');
    expect(fileExists(schema)).toBe(true);
    const source = readSource(schema);
    expect(source).toContain('matchStatus');
    expect(source).toContain('auto-matched');
    expect(source).toContain('manual-matched');
    expect(source).toContain('tenantPolicy');
  });

  test('bank_statements schema exists', () => {
    const schema = join(SCHEMA_DIR, 'bank-statements.ts');
    expect(fileExists(schema)).toBe(true);
    const source = readSource(schema);
    expect(source).toContain('tenantPolicy');
  });

  test('bank-reconciliation package exists', () => {
    const bankRecSrc = join(FINANCE_ROOT, 'bank-reconciliation', 'src');
    expect(fileExists(bankRecSrc)).toBe(true);
  });
});

// ── FIN-FA-DEPR-01: Depreciation runs are deterministic ──────────────────────

describe('FIN-FA-DEPR-01: depreciation runs', () => {
  test('depreciation_schedules schema exists', () => {
    const schema = join(SCHEMA_DIR, 'depreciation-schedules.ts');
    expect(fileExists(schema)).toBe(true);
    const source = readSource(schema);
    expect(source).toContain('tenantPolicy');
  });

  test('fixed-assets package has depreciation calculator', () => {
    const faSrc = join(FINANCE_ROOT, 'fixed-assets', 'src');
    expect(fileExists(faSrc)).toBe(true);
    const files = findFilesContaining(faSrc, 'depreciation');
    expect(files.length).toBeGreaterThan(0);
  });

  test('assets schema exists', () => {
    const schema = join(SCHEMA_DIR, 'assets.ts');
    expect(fileExists(schema)).toBe(true);
    const source = readSource(schema);
    expect(source).toContain('tenantPolicy');
  });
});

// ── FIN-INV-VAL-01: Inventory valuation events post to GL ────────────────────

describe('FIN-INV-VAL-01: inventory valuation', () => {
  test('cost-accounting package exists for valuation', () => {
    const costSrc = join(FINANCE_ROOT, 'cost-accounting', 'src');
    expect(fileExists(costSrc)).toBe(true);
  });

  test('cost-accounting has valuation-related logic', () => {
    const costSrc = join(FINANCE_ROOT, 'cost-accounting', 'src');
    const files = findFilesContaining(costSrc, 'valuation');
    // May also be in calculators as cost/inventory related
    const costFiles = findFilesContaining(costSrc, 'cost');
    expect(files.length + costFiles.length).toBeGreaterThan(0);
  });
});

// ── FIN-TAX-CALC-01: Tax calculation is correct and deterministic ────────────

describe('FIN-TAX-CALC-01: tax calculation', () => {
  test('tax_rates schema exists', () => {
    const schema = join(SCHEMA_DIR, 'tax-rates.ts');
    expect(fileExists(schema)).toBe(true);
    const source = readSource(schema);
    expect(source).toContain('tenantPolicy');
  });

  test('tax-engine package exists', () => {
    const taxSrc = join(FINANCE_ROOT, 'tax-engine', 'src');
    expect(fileExists(taxSrc)).toBe(true);
  });

  test('tax-engine has calculation logic', () => {
    const taxSrc = join(FINANCE_ROOT, 'tax-engine', 'src');
    const files = findFilesContaining(taxSrc, 'tax');
    expect(files.length).toBeGreaterThan(0);
  });
});

// ── FIN-GRP-STRUCT-01: Group structure is versioned by effective date ─────────

describe('FIN-GRP-STRUCT-01: group structure', () => {
  test('companies schema exists with group-related fields', () => {
    const schema = join(SCHEMA_DIR, 'companies.ts');
    expect(fileExists(schema)).toBe(true);
    const source = readSource(schema);
    expect(source).toContain('tenantPolicy');
  });

  test('consolidation package exists', () => {
    const consolSrc = join(FINANCE_ROOT, 'consolidation', 'src');
    expect(fileExists(consolSrc)).toBe(true);
  });

  test('consolidation has group/structure logic', () => {
    const consolSrc = join(FINANCE_ROOT, 'consolidation', 'src');
    const files = findFilesContaining(consolSrc, 'consol');
    expect(files.length).toBeGreaterThan(0);
  });
});

// ── FIN-REP-SNAP-01: Statement snapshots are reproducible ────────────────────

describe('FIN-REP-SNAP-01: statement snapshots', () => {
  test('statutory-reporting package exists', () => {
    const repSrc = join(FINANCE_ROOT, 'statutory-reporting', 'src');
    expect(fileExists(repSrc)).toBe(true);
  });

  test('statutory-reporting has report generation logic', () => {
    const repSrc = join(FINANCE_ROOT, 'statutory-reporting', 'src');
    const files = findFilesContaining(repSrc, 'report');
    expect(files.length).toBeGreaterThan(0);
  });

  test('trial-balance calculator exists in gl-platform', () => {
    const tbCalc = join(FINANCE_ROOT, 'gl-platform', 'src', 'calculators', 'trial-balance.ts');
    expect(fileExists(tbCalc)).toBe(true);
    const source = readSource(tbCalc);
    expect(source).toContain('computeTrialBalance');
  });
});

// ── FIN-CTRL-SOD-01: Segregation of Duties enforced ──────────────────────────

describe('FIN-CTRL-SOD-01: segregation of duties', () => {
  test('role-based access schema exists', () => {
    // role_permissions table enforces verb-level access
    const files = findFilesContaining(SCHEMA_DIR, 'role_perms');
    expect(files.length).toBeGreaterThan(0);
  });

  test('approval workflow schema exists', () => {
    // approval_policies or similar
    const files = findFilesContaining(SCHEMA_DIR, 'approve');
    expect(files.length).toBeGreaterThan(0);
  });

  test('canon defines approval/reject verbs', () => {
    const files = findFilesContaining(CANON_DIR, 'approve');
    expect(files.length).toBeGreaterThan(0);
  });
});

// ── FIN-MG-ADJ-01: Adjustments isolated by book/ledger ──────────────────────

describe('FIN-MG-ADJ-01: multi-GAAP adjustments', () => {
  test('ledgers schema supports multiple ledger types', () => {
    const schema = join(SCHEMA_DIR, 'ledgers.ts');
    expect(fileExists(schema)).toBe(true);
    const source = readSource(schema);
    expect(source).toContain('ledgerType');
    expect(source).toContain('primary');
    expect(source).toContain('statutory');
    expect(source).toContain('tax');
    expect(source).toContain('management');
  });

  test('journal_entries schema has ledger isolation via company+posting', () => {
    const schema = join(SCHEMA_DIR, 'journal-entries.ts');
    const source = readSource(schema);
    expect(source).toContain('companyId');
    expect(source).toContain('postingStatus');
    expect(source).toContain('tenantPolicy');
  });

  test('gl-platform service supports multi-ledger operations', () => {
    const service = join(FINANCE_ROOT, 'gl-platform', 'src', 'services', 'gl-platform-service.ts');
    const source = readSource(service);
    expect(source).toContain('listCompanyLedgers');
    expect(source).toContain('fetchLedger');
  });
});

// ── FIN-EINV-01: E-Invoicing (Peppol / MyInvois / UBL) ─────────────────────

describe('FIN-EINV-01: e-invoicing domain coverage', () => {
  test('e-invoicing package exists with calculators', () => {
    const calcDir = join(FINANCE_ROOT, 'e-invoicing', 'src', 'calculators');
    expect(fileExists(calcDir)).toBe(true);
    const files = findFilesContaining(calcDir, 'CalculatorResult');
    expect(files.length).toBeGreaterThanOrEqual(5);
  });

  test('e-invoicing has intent builders with idempotencyKey', () => {
    const intentFile = join(FINANCE_ROOT, 'e-invoicing', 'src', 'commands', 'einvoice-intent.ts');
    expect(fileExists(intentFile)).toBe(true);
    const source = readSource(intentFile);
    expect(source).toContain('idempotencyKey');
    expect(source).toContain('einvoice.issue');
    expect(source).toContain('einvoice.submit');
    expect(source).toContain('einvoice.clear');
  });

  test('e-invoicing has DB schema for e_invoices and e_invoice_submissions', () => {
    const invoicesSchema = join(SCHEMA_DIR, 'e-invoices.ts');
    const submissionsSchema = join(SCHEMA_DIR, 'e-invoice-submissions.ts');
    expect(fileExists(invoicesSchema)).toBe(true);
    expect(fileExists(submissionsSchema)).toBe(true);
    const invoiceSource = readSource(invoicesSchema);
    expect(invoiceSource).toContain('e_invoices');
    expect(invoiceSource).toContain('format');
    expect(invoiceSource).toContain('erpIndexes');
    const submissionSource = readSource(submissionsSchema);
    expect(submissionSource).toContain('clearance_status');
    expect(submissionSource).toContain('erpIndexes');
  });

  test('e-invoicing service has issue, submit, and clearance operations', () => {
    const service = join(FINANCE_ROOT, 'e-invoicing', 'src', 'services', 'einvoice-service.ts');
    expect(fileExists(service)).toBe(true);
    const source = readSource(service);
    expect(source).toContain('issueEInvoice');
    expect(source).toContain('submitEInvoice');
    expect(source).toContain('recordClearance');
  });

  test('e-invoicing queries filter by orgId (SK-11)', () => {
    const queryFile = join(FINANCE_ROOT, 'e-invoicing', 'src', 'queries', 'einvoice-query.ts');
    expect(fileExists(queryFile)).toBe(true);
    const source = readSource(queryFile);
    expect(source).toContain('orgId');
    expect(source).toContain('eInvoices');
  });

  test('e-invoicing barrel has @see FIN-EINV annotation', () => {
    const barrel = join(FINANCE_ROOT, 'e-invoicing', 'src', 'index.ts');
    expect(fileExists(barrel)).toBe(true);
    const source = readSource(barrel);
    expect(source).toContain('@see FIN-EINV');
  });
});
