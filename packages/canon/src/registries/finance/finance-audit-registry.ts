/**
 * Finance & Accounting Availability Registry — SSOT
 *
 * Machine-readable registry of all finance/accounting capability requirements.
 * Used by CI gate (ci-finance-audit-gate.mjs) to verify codebase evidence.
 *
 * Sections are stable; requirement IDs must never be reused.
 */

import type { FinanceAuditRegistry } from '../../types/finance-audit';

const GLOBAL_SCOPE = {
  multiTenancy: true,
  multiCompany: true,
  interCompany: true,
  multiCurrency: true,
  multiLedger: true,
  multiNational: true,
  multiIndustry: true,
} as const;

export const FINANCE_AUDIT_REGISTRY: FinanceAuditRegistry = {
  version: '1.0.0',
  lastRatifiedAt: '2026-02-21T00:00:00.000Z',
  ratifiedBy: 'architecture.board',
  benchmarkNotes: [
    'Universal Journal truth architecture (single financial truth behavior)',
    'Automated intercompany balancing/mirroring expectations',
    'Multi-company consolidation readiness and group reporting patterns',
    'Multi-ledger / multi-book (Local GAAP + IFRS + Management) adjustments',
  ],
  globalGates: [
    'gate.rls.isolation',
    'gate.posting.immutability',
    'gate.posting.balancedByConstruction',
    'gate.idempotency',
    'gate.auditlog.coverage',
    'gate.migration.lineage',
  ],
  sections: [
    // ── 0) Cross-cutting baseline ──────────────────────────────────────────
    {
      key: 'finance.baseline',
      title: 'Cross-Cutting Baseline (applies to all finance capabilities)',
      scope: { ...GLOBAL_SCOPE, interCompany: true },
      requirements: [
        {
          id: 'FIN-BL-ISO-01',
          title: 'Tenant isolation enforced on all finance tables',
          severity: 'S0',
          weight: 5,
          rationale: 'No cross-tenant data access is permissible in enterprise ERP.',
          mustHaveEntities: ['Org', 'Company', 'Ledger', 'AuditLog'],
          mustHaveApis: [{ name: 'authz.check', kind: 'command' }],
          mustHaveReports: [{ name: 'security.tenantIsolationAudit', kind: 'audit' }],
          mustHaveTests: [{ name: 'rls.crossTenant.forbidden', kind: 'rls' }],
          mustHaveEvidence: [{ name: 'evidence.rls.testRun', kind: 'test_run' }],
          gates: ['gate.rls.isolation'],
        },
        {
          id: 'FIN-BL-AUD-01',
          title: 'Every mutation produces an auditable trail (who/what/when/why)',
          severity: 'S0',
          weight: 5,
          rationale: 'Finance must be court-grade auditable; no silent writes.',
          mustHaveEntities: ['AuditLog', 'PolicyDecision', 'Approval'],
          mustHaveApis: [{ name: 'mutate', kind: 'command' }],
          mustHaveReports: [{ name: 'audit.export', kind: 'audit' }],
          mustHaveTests: [{ name: 'auditlog.coverage.allWrites', kind: 'integration' }],
          mustHaveEvidence: [{ name: 'evidence.auditLog.export', kind: 'audit_log_export' }],
          gates: ['gate.auditlog.coverage'],
        },
      ],
    },

    // ── 1) Finance Master Data ─────────────────────────────────────────────
    {
      key: 'finance.masterdata',
      title: 'Finance Master Data (CoA, Periods, Dimensions, Policies)',
      scope: { ...GLOBAL_SCOPE, interCompany: false },
      requirements: [
        {
          id: 'FIN-MD-COA-01',
          title: 'Published CoA versions are immutable; postings reference a version',
          severity: 'S0',
          weight: 5,
          rationale: 'Prevents drift and ensures reproducible reporting/audit.',
          mustHaveEntities: ['ChartOfAccounts', 'GLAccount', 'CoAVersion'],
          mustHaveApis: [
            { name: 'coa.create', kind: 'command' },
            { name: 'coa.publishVersion', kind: 'command' },
          ],
          mustHaveReports: [{ name: 'coa.completeness', kind: 'audit' }],
          mustHaveTests: [{ name: 'coa.version.immutableWhenPublished', kind: 'integration' }],
          mustHaveEvidence: [{ name: 'evidence.coa.versionPublishLog', kind: 'audit_log_export' }],
          gates: ['gate.auditlog.coverage'],
        },
        {
          id: 'FIN-MD-PERIOD-01',
          title: 'Period controls enforced (open/soft-close/hard-close/lock + overrides)',
          severity: 'S0',
          weight: 5,
          rationale: 'Close integrity is non-negotiable in enterprise finance.',
          mustHaveEntities: ['FiscalCalendar', 'FiscalPeriod', 'PeriodStatus', 'Override'],
          mustHaveApis: [
            { name: 'period.open', kind: 'command' },
            { name: 'period.hardClose', kind: 'command' },
            { name: 'override.request', kind: 'command' },
            { name: 'override.approve', kind: 'command' },
          ],
          mustHaveReports: [{ name: 'period.status', kind: 'operational' }],
          mustHaveTests: [
            { name: 'posting.blockedWhenLocked', kind: 'integration' },
            { name: 'override.requiresApprovalAndReason', kind: 'integration' },
          ],
          mustHaveEvidence: [{ name: 'evidence.periodTransitions', kind: 'audit_log_export' }],
          gates: ['gate.posting.immutability'],
        },
        {
          id: 'FIN-MD-DIM-01',
          title: 'Required dimensions enforced by rule (by account/doc type)',
          severity: 'S0',
          weight: 5,
          rationale: 'Segment reporting and governance require dimension completeness.',
          mustHaveEntities: ['Dimension', 'DimensionValue', 'DimensionRule'],
          mustHaveApis: [{ name: 'dimension.assignRequiredRules', kind: 'command' }],
          mustHaveReports: [{ name: 'dimension.missingRequired', kind: 'reconciliation' }],
          mustHaveTests: [{ name: 'posting.rejectsMissingRequiredDimensions', kind: 'property' }],
          mustHaveEvidence: [{ name: 'evidence.dimensionRuleChanges', kind: 'audit_log_export' }],
          gates: ['gate.posting.balancedByConstruction'],
        },
      ],
    },

    // ── 2) General Ledger ──────────────────────────────────────────────────
    {
      key: 'finance.gl',
      title: 'General Ledger (Journals, Posting Kernel, Reversal, Allocations)',
      scope: { ...GLOBAL_SCOPE, interCompany: false },
      requirements: [
        {
          id: 'FIN-GL-POST-01',
          title: 'Posting is idempotent, atomic, and balanced-by-construction',
          severity: 'S0',
          weight: 5,
          rationale: 'Core ERP requirement: no duplicates, no partial postings, always balanced.',
          mustHaveEntities: ['JournalHeader', 'JournalLine', 'PostingRun', 'IdempotencyKey'],
          mustHaveApis: [
            { name: 'journal.post', kind: 'command' },
            { name: 'journal.validate', kind: 'command' },
          ],
          mustHaveReports: [{ name: 'gl.journalRegister', kind: 'operational' }],
          mustHaveTests: [
            { name: 'posting.idempotent.noDuplicates', kind: 'integration' },
            { name: 'posting.atomic.noPartialLines', kind: 'integration' },
            { name: 'posting.balancedByConstruction', kind: 'property' },
          ],
          mustHaveEvidence: [{ name: 'evidence.postingRun.logs', kind: 'test_run' }],
          gates: ['gate.idempotency', 'gate.posting.balancedByConstruction'],
        },
        {
          id: 'FIN-GL-IMMUT-01',
          title: 'Posted entries are immutable; corrections only via reversal + new entry',
          severity: 'S0',
          weight: 5,
          rationale: 'Audit-grade accounting requires immutability of posted journals.',
          mustHaveEntities: ['PostedJournal', 'ReversalRef'],
          mustHaveApis: [
            { name: 'journal.reverse', kind: 'command' },
            { name: 'journal.correct', kind: 'command' },
          ],
          mustHaveReports: [{ name: 'gl.postedEntryChanges', kind: 'audit' }],
          mustHaveTests: [{ name: 'postedEntries.immutable', kind: 'integration' }],
          mustHaveEvidence: [{ name: 'evidence.reversalLinkage', kind: 'audit_log_export' }],
          gates: ['gate.posting.immutability'],
        },
      ],
    },

    // ── 3) Accounts Payable ────────────────────────────────────────────────
    {
      key: 'finance.ap',
      title: 'Accounts Payable (Invoices, Matching, Payments, Reconciliation)',
      scope: { ...GLOBAL_SCOPE, interCompany: false },
      requirements: [
        {
          id: 'FIN-AP-INV-01',
          title: 'AP invoice posting produces governed GL entries + approval chain',
          severity: 'S0',
          weight: 5,
          rationale: 'Subledger integrity and SoD are mandatory.',
          mustHaveEntities: ['Vendor', 'APInvoice', 'APInvoiceLine', 'Approval'],
          mustHaveApis: [
            { name: 'ap.invoice.post', kind: 'command' },
            { name: 'ap.invoice.approve', kind: 'command' },
          ],
          mustHaveReports: [
            { name: 'ap.aging', kind: 'operational' },
            { name: 'ap.toGl.reconciliation', kind: 'reconciliation' },
          ],
          mustHaveTests: [
            { name: 'ap.posting.generatesGLAndLinksBack', kind: 'integration' },
            { name: 'ap.approval.sod.makerChecker', kind: 'integration' },
          ],
          mustHaveEvidence: [{ name: 'evidence.ap.invoiceToGl.trace', kind: 'audit_log_export' }],
          gates: ['gate.auditlog.coverage', 'gate.posting.balancedByConstruction'],
        },
        {
          id: 'FIN-AP-PAY-01',
          title: 'Payments are controlled (maker-checker) and bank files are hashable',
          severity: 'S0',
          weight: 5,
          rationale: 'Payment execution is a high-risk control area.',
          mustHaveEntities: ['PaymentBatch', 'BankFile', 'PaymentStatus'],
          mustHaveApis: [
            { name: 'ap.payment.propose', kind: 'command' },
            { name: 'ap.payment.execute', kind: 'command' },
            { name: 'ap.bankfile.generate', kind: 'job' },
          ],
          mustHaveReports: [{ name: 'ap.paymentRun.summary', kind: 'audit' }],
          mustHaveTests: [
            { name: 'payment.execution.requiresApproval', kind: 'integration' },
            { name: 'bankfile.hash.reproducible', kind: 'integration' },
          ],
          mustHaveEvidence: [{ name: 'evidence.bankFile.hash', kind: 'bank_file_hash' }],
          gates: ['gate.auditlog.coverage'],
        },
      ],
    },

    // ── 4) Accounts Receivable ─────────────────────────────────────────────
    {
      key: 'finance.ar',
      title: 'Accounts Receivable (Invoices, Receipts, Matching, Credit Control)',
      scope: { ...GLOBAL_SCOPE, interCompany: false },
      requirements: [
        {
          id: 'FIN-AR-INV-01',
          title: 'AR invoice posting generates GL entries, respects credit policy, traceable',
          severity: 'S0',
          weight: 5,
          rationale: 'Revenue + receivables are high materiality; must be governed.',
          mustHaveEntities: ['Customer', 'ARInvoice', 'Receipt', 'CreditLimit', 'Approval'],
          mustHaveApis: [
            { name: 'ar.invoice.post', kind: 'command' },
            { name: 'credit.override.request', kind: 'command' },
          ],
          mustHaveReports: [
            { name: 'ar.aging', kind: 'operational' },
            { name: 'ar.toGl.reconciliation', kind: 'reconciliation' },
          ],
          mustHaveTests: [
            { name: 'ar.creditPolicy.enforced', kind: 'integration' },
            { name: 'ar.invoiceToGl.traceable', kind: 'integration' },
          ],
          mustHaveEvidence: [{ name: 'evidence.creditOverrides', kind: 'policy_decision_log' }],
          gates: ['gate.auditlog.coverage'],
        },
      ],
    },

    // ── 5) Cash & Bank ─────────────────────────────────────────────────────
    {
      key: 'finance.cashbank',
      title: 'Cash & Bank (Statements, Reconciliation, Cash Positioning baseline)',
      scope: { ...GLOBAL_SCOPE, interCompany: false },
      requirements: [
        {
          id: 'FIN-CB-REC-01',
          title: 'Bank reconciliation sessions close immutably with full traceability',
          severity: 'S1',
          weight: 4,
          rationale: 'Cash integrity requires reconciliation evidence and immutability when closed.',
          mustHaveEntities: ['BankAccount', 'BankStatement', 'ReconciliationSession'],
          mustHaveApis: [
            { name: 'bank.statement.import', kind: 'command' },
            { name: 'bank.reconcile.close', kind: 'command' },
          ],
          mustHaveReports: [{ name: 'bank.reconciliation.status', kind: 'reconciliation' }],
          mustHaveTests: [{ name: 'bank.recon.closedSession.immutable', kind: 'integration' }],
          mustHaveEvidence: [{ name: 'evidence.bank.recon.pack', kind: 'reconciliation_pack' }],
          gates: ['gate.auditlog.coverage'],
        },
      ],
    },

    // ── 6) Fixed Assets ────────────────────────────────────────────────────
    {
      key: 'finance.fa',
      title: 'Fixed Assets (Capitalization, Depreciation, Disposal, Multi-book)',
      scope: { ...GLOBAL_SCOPE, interCompany: false },
      requirements: [
        {
          id: 'FIN-FA-DEPR-01',
          title: 'Depreciation runs are deterministic and post correctly to GL',
          severity: 'S1',
          weight: 4,
          rationale: 'FA impacts P&L/BS; depreciation must be reproducible.',
          mustHaveEntities: ['Asset', 'AssetClass', 'DepreciationBook', 'DepreciationRun'],
          mustHaveApis: [{ name: 'fa.depreciation.runAndPost', kind: 'job' }],
          mustHaveReports: [
            { name: 'fa.assetRegister', kind: 'operational' },
            { name: 'fa.toGl.reconciliation', kind: 'reconciliation' },
          ],
          mustHaveTests: [
            { name: 'fa.depreciation.deterministic', kind: 'integration' },
            { name: 'fa.posting.generatesGL', kind: 'integration' },
          ],
          mustHaveEvidence: [{ name: 'evidence.fa.depreciation.run', kind: 'test_run' }],
          gates: ['gate.posting.balancedByConstruction'],
        },
      ],
    },

    // ── 7) Inventory Accounting Interface ──────────────────────────────────
    {
      key: 'finance.inventoryAccounting',
      title: 'Inventory Accounting Interface (Valuation → GL, GR/IR if enabled)',
      scope: { ...GLOBAL_SCOPE, interCompany: false },
      requirements: [
        {
          id: 'FIN-INV-VAL-01',
          title: 'Inventory valuation events post to GL and reconcile to subledger',
          severity: 'S1',
          weight: 4,
          rationale: 'Inventory valuation is a core financial integrity area.',
          mustHaveEntities: ['InventoryValuationEvent', 'CostLayer', 'InventoryToGLPosting'],
          mustHaveApis: [{ name: 'inventory.postValuationEvent', kind: 'command' }],
          mustHaveReports: [{ name: 'inventory.toGl.reconciliation', kind: 'reconciliation' }],
          mustHaveTests: [{ name: 'inventory.tieOut.subledgerToGL', kind: 'integration' }],
          mustHaveEvidence: [{ name: 'evidence.inventory.recon.pack', kind: 'reconciliation_pack' }],
          gates: ['gate.auditlog.coverage'],
        },
      ],
    },

    // ── 8) Tax ─────────────────────────────────────────────────────────────
    {
      key: 'finance.tax',
      title: 'Tax Engine (Determination, Calculation, Posting, Reporting)',
      scope: { ...GLOBAL_SCOPE, interCompany: false },
      requirements: [
        {
          id: 'FIN-TAX-CALC-01',
          title: 'Tax calculation is correct, rounded deterministically, and mapped to accounts',
          severity: 'S1',
          weight: 4,
          rationale: 'Tax errors create legal exposure; must be deterministic and auditable.',
          mustHaveEntities: ['TaxCode', 'TaxRate', 'TaxRule', 'TaxAccountMapping'],
          mustHaveApis: [{ name: 'tax.determine', kind: 'query' }],
          mustHaveReports: [{ name: 'tax.summary.byJurisdiction', kind: 'statutory' }],
          mustHaveTests: [{ name: 'tax.calculation.deterministic', kind: 'property' }],
          mustHaveEvidence: [{ name: 'evidence.tax.trace', kind: 'audit_log_export' }],
          gates: ['gate.auditlog.coverage'],
        },
      ],
    },

    // ── 9) FX / Multi-currency ─────────────────────────────────────────────
    {
      key: 'finance.fx',
      title: 'Multi-Currency & FX (Rates, Revaluation, Translation, Audit)',
      scope: { ...GLOBAL_SCOPE, interCompany: true },
      requirements: [
        {
          id: 'FIN-FX-REV-01',
          title: 'FX revaluation runs are reproducible with rate snapshots and produce postings',
          severity: 'S0',
          weight: 5,
          rationale: 'FX is a frequent audit focus; must be reproducible and fully evidenced.',
          mustHaveEntities: ['ExchangeRate', 'RateType', 'FXRevaluationRun', 'FXPosting'],
          mustHaveApis: [
            { name: 'fx.rate.importAndLock', kind: 'job' },
            { name: 'fx.revalue.runAndPost', kind: 'job' },
          ],
          mustHaveReports: [{ name: 'fx.revaluation.results', kind: 'audit' }],
          mustHaveTests: [
            { name: 'fx.revaluation.reproducible', kind: 'integration' },
            { name: 'fx.money.noFloatingPoint', kind: 'unit' },
          ],
          mustHaveEvidence: [{ name: 'evidence.fx.rateSnapshot', kind: 'fx_rate_snapshot' }],
          gates: ['gate.posting.balancedByConstruction'],
        },
      ],
    },

    // ── 10) Multi-company & Group ──────────────────────────────────────────
    {
      key: 'finance.group',
      title: 'Multi-Company & Group Accounting (Structure, Mapping, Consolidation readiness)',
      scope: { ...GLOBAL_SCOPE, interCompany: true },
      requirements: [
        {
          id: 'FIN-GRP-STRUCT-01',
          title: 'Group structure is versioned by effective date; ownership changes auditable',
          severity: 'S1',
          weight: 4,
          rationale: 'Consolidation scope depends on effective ownership/control history.',
          mustHaveEntities: ['Group', 'Ownership', 'ConsolidationScope'],
          mustHaveApis: [{ name: 'group.updateOwnership', kind: 'command' }],
          mustHaveReports: [{ name: 'group.structure.effectiveView', kind: 'audit' }],
          mustHaveTests: [{ name: 'group.ownership.effectiveDate.correct', kind: 'integration' }],
          mustHaveEvidence: [{ name: 'evidence.group.ownership.history', kind: 'audit_log_export' }],
          gates: ['gate.auditlog.coverage'],
        },
      ],
    },

    // ── 11) Intercompany ───────────────────────────────────────────────────
    {
      key: 'finance.intercompany',
      title: 'Intercompany (Mirroring, Balancing, Reconciliation, Settlement, Eliminations)',
      scope: { ...GLOBAL_SCOPE, interCompany: true },
      requirements: [
        {
          id: 'FIN-IC-MIRROR-01',
          title: 'IC transactions are mirrored with shared references and auto-balancing',
          severity: 'S0',
          weight: 5,
          rationale: 'Industry benchmark expects IC balancing/mirroring to prevent mismatches.',
          mustHaveEntities: ['ICPartner', 'ICDocument', 'ICMatch', 'ICSettlement'],
          mustHaveApis: [
            { name: 'ic.createAndMirror', kind: 'command' },
            { name: 'ic.settle', kind: 'command' },
          ],
          mustHaveReports: [
            { name: 'ic.aging.byPartner', kind: 'reconciliation' },
            { name: 'ic.mismatches.register', kind: 'audit' },
          ],
          mustHaveTests: [
            { name: 'ic.mirroring.producesBothSides', kind: 'integration' },
            { name: 'ic.autoBalancing.generated', kind: 'integration' },
          ],
          mustHaveEvidence: [{ name: 'evidence.ic.recon.pack', kind: 'reconciliation_pack' }],
          gates: ['gate.posting.balancedByConstruction'],
        },
      ],
    },

    // ── 12) Close management ───────────────────────────────────────────────
    {
      key: 'finance.close',
      title: 'Financial Close (Checklist, Runs, Locks, Evidence Pack)',
      scope: { ...GLOBAL_SCOPE, interCompany: true },
      requirements: [
        {
          id: 'FIN-CLOSE-PACK-01',
          title: 'Close generates an evidence pack (TB, recons, run logs, approvals) and locks period',
          severity: 'S0',
          weight: 5,
          rationale: 'Close-to-report must be reproducible and evidentiary.',
          mustHaveEntities: ['CloseCalendar', 'CloseTask', 'CloseRun', 'ClosePack'],
          mustHaveApis: [
            { name: 'close.run.execute', kind: 'job' },
            { name: 'period.lock', kind: 'command' },
            { name: 'close.pack.generate', kind: 'job' },
          ],
          mustHaveReports: [{ name: 'close.status.dashboard', kind: 'operational' }],
          mustHaveTests: [
            { name: 'close.pack.includes.requiredArtifacts', kind: 'integration' },
            { name: 'close.lock.blocksPosting', kind: 'integration' },
          ],
          mustHaveEvidence: [{ name: 'evidence.close.pack', kind: 'close_pack' }],
          gates: ['gate.posting.immutability', 'gate.auditlog.coverage'],
        },
      ],
    },

    // ── 13) Reporting & Drill-down ─────────────────────────────────────────
    {
      key: 'finance.reporting',
      title: 'Financial Reporting (Statements, Drill-down, Snapshots)',
      scope: { ...GLOBAL_SCOPE, interCompany: true },
      requirements: [
        {
          id: 'FIN-REP-SNAP-01',
          title: 'Statement snapshots are reproducible and drill-down is complete',
          severity: 'S1',
          weight: 4,
          rationale: 'Audit and management require reproducible outputs with traceability.',
          mustHaveEntities: ['ReportDefinition', 'ReportSnapshot', 'StatementLineMapping'],
          mustHaveApis: [
            { name: 'report.runSnapshot', kind: 'job' },
            { name: 'report.drilldown', kind: 'query' },
          ],
          mustHaveReports: [
            { name: 'statements.pnl', kind: 'management' },
            { name: 'statements.balanceSheet', kind: 'management' },
            { name: 'statements.cashFlow', kind: 'management' },
          ],
          mustHaveTests: [
            { name: 'report.snapshot.reproducible', kind: 'integration' },
            { name: 'drilldown.links.notBroken', kind: 'integration' },
          ],
          mustHaveEvidence: [{ name: 'evidence.report.snapshot', kind: 'report_snapshot' }],
          gates: ['gate.auditlog.coverage'],
        },
      ],
    },

    // ── 14) Reconciliations ────────────────────────────────────────────────
    {
      key: 'finance.reconciliations',
      title: 'Reconciliations (AR/AP/FA/INV/BANK/IC tie-outs + resolution workflow)',
      scope: { ...GLOBAL_SCOPE, interCompany: true },
      requirements: [
        {
          id: 'FIN-RECON-01',
          title: 'Reconciliation runs produce tie-out status and enforce resolution/waiver policy',
          severity: 'S0',
          weight: 5,
          rationale: 'Enterprise finance requires formal tie-outs and controlled exceptions.',
          mustHaveEntities: ['ReconciliationDefinition', 'ReconciliationRun', 'ReconDifference', 'Waiver'],
          mustHaveApis: [
            { name: 'recon.run', kind: 'job' },
            { name: 'recon.resolve', kind: 'command' },
            { name: 'recon.waive', kind: 'command' },
          ],
          mustHaveReports: [{ name: 'recon.summary', kind: 'reconciliation' }],
          mustHaveTests: [{ name: 'recon.cannotCloseWithoutResolutionOrWaiver', kind: 'integration' }],
          mustHaveEvidence: [{ name: 'evidence.recon.pack', kind: 'reconciliation_pack' }],
          gates: ['gate.auditlog.coverage'],
        },
      ],
    },

    // ── 15) Controls & Security ────────────────────────────────────────────
    {
      key: 'finance.controls',
      title: 'Controls & Security (SoD, approvals, privileged actions, overrides)',
      scope: { ...GLOBAL_SCOPE, interCompany: true },
      requirements: [
        {
          id: 'FIN-CTRL-SOD-01',
          title: 'Segregation of Duties enforced for posting, payments, close locks',
          severity: 'S0',
          weight: 5,
          rationale: 'SoD is a baseline finance control in enterprise environments.',
          mustHaveEntities: ['SoDRule', 'Role', 'Permission', 'ApprovalPolicy'],
          mustHaveApis: [{ name: 'sod.evaluate', kind: 'command' }],
          mustHaveReports: [{ name: 'controls.sod.conflicts', kind: 'audit' }],
          mustHaveTests: [{ name: 'sod.makerChecker.enforced', kind: 'integration' }],
          mustHaveEvidence: [{ name: 'evidence.sod.evaluations', kind: 'policy_decision_log' }],
          gates: ['gate.auditlog.coverage'],
        },
      ],
    },

    // ── 16) Multi-GAAP / IFRS adjustments ──────────────────────────────────
    {
      key: 'finance.multigaap',
      title: 'Multi-GAAP / IFRS (Multi-book, Adjustments, Variance reporting)',
      scope: { ...GLOBAL_SCOPE, interCompany: true, multiLedger: true },
      requirements: [
        {
          id: 'FIN-MG-ADJ-01',
          title: 'Adjustments are isolated by book/ledger and variance reporting exists',
          severity: 'S1',
          weight: 4,
          rationale: 'Supports local GAAP + IFRS + management without contaminating base books.',
          mustHaveEntities: ['LedgerBook', 'AdjustmentJournal', 'BookVariance'],
          mustHaveApis: [
            { name: 'adjustment.post', kind: 'command' },
            { name: 'books.variance.report', kind: 'job' },
          ],
          mustHaveReports: [{ name: 'books.variance.localVsIFRS', kind: 'audit' }],
          mustHaveTests: [{ name: 'adjustments.isolated.byBook', kind: 'integration' }],
          mustHaveEvidence: [{ name: 'evidence.bookVariance.snapshot', kind: 'report_snapshot' }],
          gates: ['gate.auditlog.coverage'],
        },
      ],
    },

    // ── 17) Integrations ───────────────────────────────────────────────────
    {
      key: 'finance.integrations',
      title: 'Integrations (Imports, outbox, replay safety, external references)',
      scope: { ...GLOBAL_SCOPE, interCompany: true },
      requirements: [
        {
          id: 'FIN-INT-OUTBOX-01',
          title: 'Outbox-driven integration is replay-safe and idempotent',
          severity: 'S0',
          weight: 5,
          rationale: 'Finance postings must be exactly-once from external feeds.',
          mustHaveEntities: ['OutboxEvent', 'ImportBatch', 'ExternalRef', 'IdempotencyKey'],
          mustHaveApis: [
            { name: 'import.validate', kind: 'command' },
            { name: 'import.commit', kind: 'command' },
            { name: 'outbox.publish', kind: 'job' },
          ],
          mustHaveReports: [{ name: 'integration.import.failures', kind: 'operational' }],
          mustHaveTests: [
            { name: 'outbox.replay.safe', kind: 'integration' },
            { name: 'import.exactlyOnce.idempotent', kind: 'integration' },
          ],
          mustHaveEvidence: [{ name: 'evidence.import.batchLogs', kind: 'test_run' }],
          gates: ['gate.idempotency'],
        },
      ],
    },

    // ── 18) Operational Excellence ──────────────────────────────────────────
    {
      key: 'finance.ops',
      title: 'Operational Excellence (SLAs, performance baselines, observability)',
      scope: { ...GLOBAL_SCOPE, interCompany: true },
      requirements: [
        {
          id: 'FIN-OPS-SLA-01',
          title: 'Posting and close meet performance baselines with observability',
          severity: 'S2',
          weight: 3,
          rationale: 'Production readiness requires measurable performance and monitoring.',
          mustHaveEntities: ['Metric', 'SLA', 'AlertRule'],
          mustHaveApis: [
            { name: 'health.finance', kind: 'query' },
            { name: 'metrics.export', kind: 'query' },
          ],
          mustHaveReports: [{ name: 'ops.performance.baseline', kind: 'operational' }],
          mustHaveTests: [{ name: 'perf.postingThroughput.baseline', kind: 'performance' }],
          mustHaveEvidence: [{ name: 'evidence.performance.baseline', kind: 'performance_baseline' }],
          gates: ['gate.migration.lineage'],
        },
      ],
    },
  ],
};
