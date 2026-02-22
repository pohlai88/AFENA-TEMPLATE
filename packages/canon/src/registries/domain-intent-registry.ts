import type { DomainIntent } from '../types/domain-intent';
import type { IdempotencyPolicy } from './shared-kernel-registry';

type IntentType = DomainIntent['type'];

export const DOMAIN_INTENT_REGISTRY: Record<
  IntentType,
  {
    owner: string;
    tableTarget: string;
    idempotency: {
      policy: IdempotencyPolicy;
      scope: 'org' | 'company' | 'document';
      recipe: string;
    };
    severity: 'low' | 'medium' | 'high';
    ledgerImpact: boolean;
    auditClass: 'financial' | 'operational' | 'administrative';
    effectiveDating: boolean;
  }
> = {
  // ── Core (existing) ────────────────────────────────────
  'accounting.post': {
    owner: 'accounting',
    tableTarget: 'accounting.journal_lines',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, company_id, journal_id)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'inventory.adjust': {
    owner: 'inventory',
    tableTarget: 'inventory.stock_ledger',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, company_id, item_id, reason, asOf)',
    },
    severity: 'medium',
    ledgerImpact: false,
    auditClass: 'operational',
    effectiveDating: false,
  },
  'tax.adjust': {
    owner: 'tax-engine',
    tableTarget: 'accounting.journal_lines',
    idempotency: {
      policy: 'optional',
      scope: 'document',
      recipe: 'hash(org_id, document_id, line_id, tax_code)',
    },
    severity: 'medium',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Accounting ─────────────────────────────────────────
  'accounting.reverse': {
    owner: 'accounting',
    tableTarget: 'accounting.journal_lines',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, company_id, original_journal_id)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'accounting.accrue': {
    owner: 'accounting',
    tableTarget: 'accounting.journal_lines',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, company_id, accrual_type, account_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── FX Management ──────────────────────────────────────
  'fx.revalue': {
    owner: 'fx-management',
    tableTarget: 'accounting.journal_lines',
    idempotency: {
      policy: 'required',
      scope: 'company',
      recipe: 'hash(org_id, company_id, ledger_id, period_key, rate_type)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'fx.hedge.designate': {
    owner: 'fx-management',
    tableTarget: 'fx.hedge_designations',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, hedge_id)',
    },
    severity: 'medium',
    ledgerImpact: false,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Fixed Assets ───────────────────────────────────────
  'asset.depreciate': {
    owner: 'fixed-assets',
    tableTarget: 'assets.depreciation_schedules',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, asset_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'asset.dispose': {
    owner: 'fixed-assets',
    tableTarget: 'assets.fixed_assets',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, asset_id, disposal_date)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'asset.revalue': {
    owner: 'fixed-assets',
    tableTarget: 'assets.fixed_assets',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, asset_id, revaluation_date)',
    },
    severity: 'medium',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Revenue Recognition ────────────────────────────────
  'revenue.recognize': {
    owner: 'revenue-recognition',
    tableTarget: 'revenue.revenue_schedule_lines',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, contract_id, obligation_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'revenue.defer': {
    owner: 'revenue-recognition',
    tableTarget: 'revenue.revenue_schedule_lines',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, contract_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Lease Accounting ───────────────────────────────────
  'lease.amortize': {
    owner: 'lease-accounting',
    tableTarget: 'leases.lease_schedules',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, lease_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'lease.modify': {
    owner: 'lease-accounting',
    tableTarget: 'leases.leases',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, lease_id, modification_date)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Payables ───────────────────────────────────────────
  'payables.pay': {
    owner: 'payables',
    tableTarget: 'ap.payment_runs',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, payment_run_id)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'payables.invoice.post': {
    owner: 'payables',
    tableTarget: 'ap.invoices',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, invoice_id)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'payables.invoice.approve': {
    owner: 'payables',
    tableTarget: 'ap.invoice_approvals',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, invoice_id, approver_id)',
    },
    severity: 'high',
    ledgerImpact: false,
    auditClass: 'financial',
    effectiveDating: false,
  },
  'payables.payment.approve': {
    owner: 'payables',
    tableTarget: 'ap.payment_approvals',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, payment_run_id, approver_id)',
    },
    severity: 'high',
    ledgerImpact: false,
    auditClass: 'financial',
    effectiveDating: false,
  },

  // ── Receivables ────────────────────────────────────────
  'receivables.allocate': {
    owner: 'receivables',
    tableTarget: 'ar.payment_allocations',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, payment_id)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'receivables.invoice.post': {
    owner: 'receivables',
    tableTarget: 'ar.invoices',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, invoice_id)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Budgeting ──────────────────────────────────────────
  'budget.commit': {
    owner: 'budgeting',
    tableTarget: 'budgets.budget_lines',
    idempotency: {
      policy: 'optional',
      scope: 'document',
      recipe: 'hash(org_id, budget_version_id, period_key, account_id)',
    },
    severity: 'medium',
    ledgerImpact: false,
    auditClass: 'administrative',
    effectiveDating: false,
  },

  // ── Intercompany ───────────────────────────────────────
  'ic.match': {
    owner: 'intercompany',
    tableTarget: 'ic.ic_transactions',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, sender_tx_id, receiver_tx_id)',
    },
    severity: 'high',
    ledgerImpact: false,
    auditClass: 'financial',
    effectiveDating: false,
  },
  'ic.mirror': {
    owner: 'intercompany',
    tableTarget: 'ic.ic_transactions',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, transaction_id, side)',
    },
    severity: 'high',
    ledgerImpact: false,
    auditClass: 'financial',
    effectiveDating: false,
  },
  'ic.eliminate': {
    owner: 'intercompany',
    tableTarget: 'consolidation.elimination_journals',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, match_id)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'ic.net': {
    owner: 'intercompany',
    tableTarget: 'ic.ic_netting',
    idempotency: {
      policy: 'required',
      scope: 'company',
      recipe: 'hash(org_id, company_pair_key, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Expense Management ─────────────────────────────────
  'expense.reimburse': {
    owner: 'expense-management',
    tableTarget: 'expenses.expense_reports',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, expense_report_id)',
    },
    severity: 'medium',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Subscription Billing ───────────────────────────────
  'subscription.invoice': {
    owner: 'subscription-billing',
    tableTarget: 'billing.subscription_invoices',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, subscription_id, billing_cycle_id)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Project Accounting ─────────────────────────────────
  'project.cost': {
    owner: 'project-accounting',
    tableTarget: 'projects.project_costs',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, project_id, cost_type, period_key)',
    },
    severity: 'medium',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── GL Platform ────────────────────────────────────────
  'gl.period.open': {
    owner: 'gl-platform',
    tableTarget: 'gl.posting_periods',
    idempotency: {
      policy: 'required',
      scope: 'company',
      recipe: 'hash(org_id, ledger_id, period_key, company_id)',
    },
    severity: 'high',
    ledgerImpact: false,
    auditClass: 'administrative',
    effectiveDating: false,
  },
  'gl.period.close': {
    owner: 'gl-platform',
    tableTarget: 'gl.posting_periods',
    idempotency: {
      policy: 'required',
      scope: 'company',
      recipe: 'hash(org_id, ledger_id, period_key, company_id)',
    },
    severity: 'high',
    ledgerImpact: false,
    auditClass: 'administrative',
    effectiveDating: false,
  },
  'gl.coa.publish': {
    owner: 'gl-platform',
    tableTarget: 'gl.chart_of_accounts',
    idempotency: {
      policy: 'required',
      scope: 'company',
      recipe: 'hash(org_id, ledger_id, version)',
    },
    severity: 'medium',
    ledgerImpact: false,
    auditClass: 'administrative',
    effectiveDating: false,
  },

  // ── Accounting Hub ─────────────────────────────────────
  'acct.derive.commit': {
    owner: 'accounting-hub',
    tableTarget: 'acct.acct_derived_entries',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(event_id, mapping_version)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'acct.mapping.publish': {
    owner: 'accounting-hub',
    tableTarget: 'acct.acct_mappings',
    idempotency: {
      policy: 'required',
      scope: 'org',
      recipe: 'hash(org_id, mapping_id, version)',
    },
    severity: 'medium',
    ledgerImpact: false,
    auditClass: 'administrative',
    effectiveDating: false,
  },
  'gl.reclass.run': {
    owner: 'accounting-hub',
    tableTarget: 'accounting.journal_lines',
    idempotency: {
      policy: 'required',
      scope: 'company',
      recipe: 'hash(org_id, company_id, period_key, reclass)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'gl.allocation.run': {
    owner: 'accounting-hub',
    tableTarget: 'accounting.journal_lines',
    idempotency: {
      policy: 'required',
      scope: 'company',
      recipe: 'hash(org_id, company_id, period_key, allocation)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'gl.accrual.run': {
    owner: 'accounting-hub',
    tableTarget: 'accounting.journal_lines',
    idempotency: {
      policy: 'required',
      scope: 'company',
      recipe: 'hash(org_id, company_id, period_key, accrual)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Financial Close ────────────────────────────────────
  'close.task.complete': {
    owner: 'financial-close',
    tableTarget: 'close.close_tasks',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, close_run_id, task_id)',
    },
    severity: 'medium',
    ledgerImpact: false,
    auditClass: 'administrative',
    effectiveDating: false,
  },
  'close.run.finalize': {
    owner: 'financial-close',
    tableTarget: 'close.close_runs',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, close_run_id)',
    },
    severity: 'high',
    ledgerImpact: false,
    auditClass: 'financial',
    effectiveDating: false,
  },
  'close.adjustment.post': {
    owner: 'financial-close',
    tableTarget: 'accounting.journal_lines',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, close_run_id, journal_id)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'close.lock.hard': {
    owner: 'financial-close',
    tableTarget: 'gl.posting_periods',
    idempotency: {
      policy: 'required',
      scope: 'company',
      recipe: 'hash(org_id, company_id, ledger_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: false,
    auditClass: 'financial',
    effectiveDating: false,
  },

  // ── Withholding Tax ────────────────────────────────────
  'wht.certificate.issue': {
    owner: 'withholding-tax',
    tableTarget: 'wht.wht_certificates',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, certificate_no)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'wht.remit': {
    owner: 'withholding-tax',
    tableTarget: 'wht.wht_remittances',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, remittance_id)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Transfer Pricing ───────────────────────────────────
  'tp.policy.publish': {
    owner: 'transfer-pricing',
    tableTarget: 'tp.tp_policies',
    idempotency: {
      policy: 'required',
      scope: 'org',
      recipe: 'hash(org_id, policy_id, version)',
    },
    severity: 'medium',
    ledgerImpact: false,
    auditClass: 'administrative',
    effectiveDating: false,
  },
  'tp.price.compute': {
    owner: 'transfer-pricing',
    tableTarget: 'tp.tp_calculations',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, transaction_id, policy_id)',
    },
    severity: 'medium',
    ledgerImpact: false,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Treasury ───────────────────────────────────────────
  'treasury.transfer': {
    owner: 'treasury',
    tableTarget: 'treasury.cash_transfers',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, from_account, to_account, amount, date)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Consolidation ─────────────────────────────────────
  'consolidation.eliminate': {
    owner: 'consolidation',
    tableTarget: 'consolidation.elimination_journals',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, subsidiary_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'consolidation.translate': {
    owner: 'consolidation',
    tableTarget: 'consolidation.translation_journals',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, subsidiary_id, period_key, target_currency)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Cost Accounting ───────────────────────────────────
  'cost.allocate': {
    owner: 'cost-accounting',
    tableTarget: 'cost.cost_allocation_journals',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, allocation_run_id, period_key)',
    },
    severity: 'medium',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Credit Management ─────────────────────────────────
  'credit.limit.update': {
    owner: 'credit-management',
    tableTarget: 'credit.credit_limits',
    idempotency: {
      policy: 'optional',
      scope: 'document',
      recipe: 'hash(org_id, customer_id, new_limit)',
    },
    severity: 'medium',
    ledgerImpact: false,
    auditClass: 'operational',
    effectiveDating: true,
  },
  'credit.dunning.create': {
    owner: 'credit-management',
    tableTarget: 'credit.dunning_runs',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, run_date, cutoff_date, customer_count)',
    },
    severity: 'medium',
    ledgerImpact: false,
    auditClass: 'operational',
    effectiveDating: false,
  },

  // ── Bank Reconciliation ───────────────────────────────
  'bank-recon.confirm': {
    owner: 'bank-reconciliation',
    tableTarget: 'bank.reconciliation_items',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, bank_statement_id, matches)',
    },
    severity: 'medium',
    ledgerImpact: false,
    auditClass: 'operational',
    effectiveDating: false,
  },

  // ── Payments ──────────────────────────────────────────
  'payment.create': {
    owner: 'receivables',
    tableTarget: 'payments.payments',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, payment_type, party_id, amount, date)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Provisions (IAS 37) ───────────────────────────────
  'provision.recognise': {
    owner: 'provisions',
    tableTarget: 'provisions.provisions',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, provision_id)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'provision.utilise': {
    owner: 'provisions',
    tableTarget: 'provisions.provision_movements',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, provision_id, utilisation_date)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'provision.reverse': {
    owner: 'provisions',
    tableTarget: 'provisions.provision_movements',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, provision_id, reversal_date)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Intangible Assets (IAS 38) ────────────────────────
  'intangible.capitalise': {
    owner: 'intangible-assets',
    tableTarget: 'intangible.intangible_assets',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, asset_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'intangible.amortise': {
    owner: 'intangible-assets',
    tableTarget: 'intangible.intangible_assets',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, asset_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'intangible.impair': {
    owner: 'intangible-assets',
    tableTarget: 'intangible.intangible_assets',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, asset_id, impairment_date)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Financial Instruments (IFRS 9) ────────────────────
  'fi.fv.change': {
    owner: 'financial-instruments',
    tableTarget: 'fi.financial_instruments',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, instrument_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'fi.eir.accrue': {
    owner: 'financial-instruments',
    tableTarget: 'fi.financial_instruments',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, instrument_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Hedge Accounting (IFRS 9 §6) ─────────────────────
  'hedge.designate': {
    owner: 'hedge-accounting',
    tableTarget: 'hedge.hedge_designations',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, designation_id)',
    },
    severity: 'high',
    ledgerImpact: false,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'hedge.effectiveness': {
    owner: 'hedge-accounting',
    tableTarget: 'hedge.hedge_effectiveness_tests',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, designation_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: false,
    auditClass: 'financial',
    effectiveDating: false,
  },
  'hedge.oci.reclass': {
    owner: 'hedge-accounting',
    tableTarget: 'hedge.hedge_designations',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, designation_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Deferred Tax (IAS 12) ─────────────────────────────
  'deferred-tax.calculate': {
    owner: 'deferred-tax',
    tableTarget: 'deferred-tax.deferred_tax_items',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, entity_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: false,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'deferred-tax.recognise': {
    owner: 'deferred-tax',
    tableTarget: 'deferred-tax.deferred_tax_items',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, entity_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Impairment of Assets (IAS 36) ────────────────────
  'impairment.test': {
    owner: 'impairment-of-assets',
    tableTarget: 'impairment.impairment_tests',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, asset_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: false,
    auditClass: 'financial',
    effectiveDating: false,
  },
  'impairment.recognise': {
    owner: 'impairment-of-assets',
    tableTarget: 'impairment.impairment_losses',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, asset_id, impairment_date)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'impairment.reverse': {
    owner: 'impairment-of-assets',
    tableTarget: 'impairment.impairment_losses',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, asset_id, reversal_date)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Inventory Valuation (IAS 2) ──────────────────────
  'inventory.costing': {
    owner: 'inventory-valuation',
    tableTarget: 'inventory.inventory_valuations',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, item_id, period_key)',
    },
    severity: 'medium',
    ledgerImpact: false,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'inventory.nrv.adjust': {
    owner: 'inventory-valuation',
    tableTarget: 'inventory.inventory_valuations',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, item_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Government Grants (IAS 20) ───────────────────────
  'grant.recognise': {
    owner: 'government-grants',
    tableTarget: 'grants.government_grants',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, grant_id)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'grant.amortise': {
    owner: 'government-grants',
    tableTarget: 'grants.government_grants',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, grant_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Biological Assets (IAS 41) ───────────────────────
  'bio-asset.measure': {
    owner: 'biological-assets',
    tableTarget: 'bio.biological_assets',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, asset_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'bio-asset.harvest': {
    owner: 'biological-assets',
    tableTarget: 'bio.harvest_events',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, asset_id, harvest_date)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Investment Property (IAS 40) ─────────────────────
  'inv-property.measure': {
    owner: 'investment-property',
    tableTarget: 'inv-property.investment_properties',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, property_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'inv-property.transfer': {
    owner: 'investment-property',
    tableTarget: 'inv-property.investment_properties',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, property_id, transfer_date)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Employee Benefits (IAS 19) ───────────────────────
  'emp-benefit.accrue': {
    owner: 'employee-benefits',
    tableTarget: 'emp-benefit.benefit_plans',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, plan_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'emp-benefit.remeasure': {
    owner: 'employee-benefits',
    tableTarget: 'emp-benefit.actuarial_valuations',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, plan_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Borrowing Costs (IAS 23) ─────────────────────────
  'borrow-cost.capitalise': {
    owner: 'borrowing-costs',
    tableTarget: 'borrow-cost.capitalised_costs',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, asset_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'borrow-cost.cease': {
    owner: 'borrowing-costs',
    tableTarget: 'borrow-cost.capitalised_costs',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, asset_id, cessation_date)',
    },
    severity: 'high',
    ledgerImpact: false,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── Share-Based Payment (IFRS 2) ─────────────────────
  'sbp.grant': {
    owner: 'share-based-payment',
    tableTarget: 'sbp.sbp_grants',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, grant_id)',
    },
    severity: 'high',
    ledgerImpact: false,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'sbp.vest': {
    owner: 'share-based-payment',
    tableTarget: 'sbp.sbp_grants',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, grant_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'sbp.expense': {
    owner: 'share-based-payment',
    tableTarget: 'sbp.sbp_grants',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, grant_id, period_key)',
    },
    severity: 'high',
    ledgerImpact: true,
    auditClass: 'financial',
    effectiveDating: true,
  },

  // ── E-Invoicing ─────────────────────────────────────────
  'einvoice.issue': {
    owner: 'e-invoicing',
    tableTarget: 'einvoice.e_invoices',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, invoice_id)',
    },
    severity: 'high',
    ledgerImpact: false,
    auditClass: 'financial',
    effectiveDating: true,
  },
  'einvoice.submit': {
    owner: 'e-invoicing',
    tableTarget: 'einvoice.e_invoice_submissions',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, invoice_id, submission_id)',
    },
    severity: 'high',
    ledgerImpact: false,
    auditClass: 'financial',
    effectiveDating: false,
  },
  'einvoice.clear': {
    owner: 'e-invoicing',
    tableTarget: 'einvoice.e_invoice_submissions',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, invoice_id, submission_id)',
    },
    severity: 'high',
    ledgerImpact: false,
    auditClass: 'financial',
    effectiveDating: false,
  },
};
