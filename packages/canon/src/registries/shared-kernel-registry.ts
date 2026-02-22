export type TableKind = 'truth' | 'control' | 'evidence' | 'projection' | 'ledger';
export type PiiLevel = 'none' | 'low' | 'high';
export type IdempotencyPolicy = 'required' | 'optional' | 'forbidden';
export type WriteSurface = 'intent-only' | 'direct';

export type SharedKernelEntry = {
  kind: TableKind;
  owner: string;
  rls: 'tenantPolicy';
  pii: PiiLevel;
  write_policy: WriteSurface;
  invariants: string[];
  readers: string[];
  writes: string[];
  events?: string[];
  readModels?: { primary: string; exportsFrom: string };
  idempotency: IdempotencyPolicy;
  immutability?: { after?: string; fields: string[] };
  keys?: { natural?: string[][]; unique?: string[][] };
};

export const SHARED_KERNEL_REGISTRY = {
  'accounting.journal_lines': {
    kind: 'truth',
    owner: 'accounting',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['debit_total = credit_total per journal_id'],
    readers: [
      'consolidation',
      'reporting',
      'fixed-assets',
      'project-accounting',
      'financial-close',
      'statutory-reporting',
    ],
    writes: [
      'accounting.post',
      'tax.adjust',
      'accounting.reverse',
      'accounting.accrue',
      'fx.revalue',
      'close.adjustment.post',
      'gl.reclass.run',
      'gl.allocation.run',
      'gl.accrual.run',
    ],
    events: ['invoice.posted'],
    readModels: { primary: 'JournalLineReadModel', exportsFrom: 'afenda-database' },
    idempotency: 'required',
    immutability: { after: 'posted', fields: ['amount_minor', 'account_id', 'currency'] },
    keys: {
      natural: [['org_id', 'journal_id', 'line_number']],
      unique: [['org_id', 'journal_line_id']],
    },
  },
  'inventory.stock_ledger': {
    kind: 'truth',
    owner: 'inventory',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['quantity_on_hand >= 0'],
    readers: ['cost-accounting', 'mrp', 'demand-planning', 'feed-inventory'],
    writes: ['inventory.adjust'],
    events: ['stock.adjusted'],
    readModels: { primary: 'StockLedgerReadModel', exportsFrom: 'afenda-database' },
    idempotency: 'required',
    keys: {
      natural: [['org_id', 'item_id', 'lot_id', 'warehouse_id']],
      unique: [['org_id', 'ledger_entry_id']],
    },
  },

  // ── FX Management ────────────────────────────────────────
  'fx.hedge_designations': {
    kind: 'truth',
    owner: 'fx-management',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['hedge_type in (fair_value, cash_flow, net_investment)'],
    readers: ['fx-management', 'financial-close', 'statutory-reporting'],
    writes: ['fx.hedge.designate'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'hedge_id']] },
  },

  // ── Fixed Assets ─────────────────────────────────────────
  'assets.depreciation_schedules': {
    kind: 'truth',
    owner: 'fixed-assets',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['depreciation_minor >= 0'],
    readers: ['fixed-assets', 'financial-close', 'statutory-reporting'],
    writes: ['asset.depreciate'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'asset_id', 'period_key']] },
  },
  'assets.fixed_assets': {
    kind: 'truth',
    owner: 'fixed-assets',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['net_book_value = cost - accumulated_depreciation'],
    readers: ['fixed-assets', 'financial-close', 'consolidation'],
    writes: ['asset.dispose', 'asset.revalue'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'asset_id']] },
  },

  // ── Revenue Recognition ──────────────────────────────────
  'revenue.revenue_schedule_lines': {
    kind: 'truth',
    owner: 'revenue-recognition',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['recognized_amount + deferred_amount = total_transaction_price per contract'],
    readers: ['revenue-recognition', 'financial-close', 'statutory-reporting'],
    writes: ['revenue.recognize', 'revenue.defer'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'contract_id', 'obligation_id', 'period_key']] },
  },

  // ── Lease Accounting ─────────────────────────────────────
  'leases.lease_schedules': {
    kind: 'truth',
    owner: 'lease-accounting',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['principal + interest = total_payment per period'],
    readers: ['lease-accounting', 'financial-close'],
    writes: ['lease.amortize'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'lease_id', 'period_key']] },
  },
  'leases.leases': {
    kind: 'truth',
    owner: 'lease-accounting',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['end_date > start_date'],
    readers: ['lease-accounting', 'financial-close', 'statutory-reporting'],
    writes: ['lease.modify'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'lease_id']] },
  },

  // ── Accounts Payable ─────────────────────────────────────
  'ap.invoices': {
    kind: 'truth',
    owner: 'payables',
    rls: 'tenantPolicy',
    pii: 'low',
    write_policy: 'intent-only',
    invariants: ['gross_amount = net_amount + tax_amount'],
    readers: ['payables', 'accounting', 'financial-close', 'expense-management'],
    writes: ['payables.invoice.post'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'invoice_no']] },
  },
  'ap.invoice_approvals': {
    kind: 'evidence',
    owner: 'payables',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['one approval per approver per invoice'],
    readers: ['payables', 'financial-close'],
    writes: ['payables.invoice.approve'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'invoice_id', 'approver_id']] },
  },
  'ap.payment_approvals': {
    kind: 'evidence',
    owner: 'payables',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['one approval per approver per payment run'],
    readers: ['payables', 'treasury'],
    writes: ['payables.payment.approve'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'payment_run_id', 'approver_id']] },
  },
  'ap.payment_runs': {
    kind: 'truth',
    owner: 'payables',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['total = sum(line_amounts)'],
    readers: ['payables', 'treasury', 'bank-reconciliation'],
    writes: ['payables.pay'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'payment_run_id']] },
  },

  // ── Accounts Receivable ──────────────────────────────────
  'ar.invoices': {
    kind: 'truth',
    owner: 'receivables',
    rls: 'tenantPolicy',
    pii: 'low',
    write_policy: 'intent-only',
    invariants: ['gross_amount = net_amount + tax_amount'],
    readers: ['receivables', 'accounting', 'credit-management', 'financial-close'],
    writes: ['receivables.invoice.post'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'invoice_no']] },
  },
  'ar.payment_allocations': {
    kind: 'truth',
    owner: 'receivables',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['sum(allocated) <= payment_amount'],
    readers: ['receivables', 'credit-management', 'financial-close'],
    writes: ['receivables.allocate'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'payment_id', 'invoice_id']] },
  },

  // ── Budgeting ────────────────────────────────────────────
  'budgets.budget_lines': {
    kind: 'control',
    owner: 'budgeting',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['amount_minor >= 0'],
    readers: ['budgeting', 'financial-close', 'cost-accounting'],
    writes: ['budget.commit'],
    idempotency: 'optional',
    keys: { natural: [['org_id', 'budget_version_id', 'period_key', 'account_id']] },
  },

  // ── Intercompany ─────────────────────────────────────────
  'ic.ic_transactions': {
    kind: 'truth',
    owner: 'intercompany',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['sender_amount = receiver_amount in functional currency'],
    readers: ['intercompany', 'consolidation', 'financial-close'],
    writes: ['ic.match', 'ic.mirror'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'sender_tx_id', 'receiver_tx_id']] },
  },
  'ic.ic_netting': {
    kind: 'truth',
    owner: 'intercompany',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['net_amount = sum(receivable) - sum(payable)'],
    readers: ['intercompany', 'consolidation', 'treasury'],
    writes: ['ic.net'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'company_pair_key', 'period_key']] },
  },

  // ── Expense Management ───────────────────────────────────
  'expenses.expense_reports': {
    kind: 'truth',
    owner: 'expense-management',
    rls: 'tenantPolicy',
    pii: 'low',
    write_policy: 'intent-only',
    invariants: ['total = sum(line_amounts)'],
    readers: ['expense-management', 'payables', 'cost-accounting'],
    writes: ['expense.reimburse'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'expense_report_id']] },
  },

  // ── Subscription Billing ─────────────────────────────────
  'billing.subscription_invoices': {
    kind: 'truth',
    owner: 'subscription-billing',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['period_end > period_start'],
    readers: ['subscription-billing', 'receivables', 'revenue-recognition'],
    writes: ['subscription.invoice'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'subscription_id', 'billing_cycle_id']] },
  },

  // ── Project Accounting ───────────────────────────────────
  'projects.project_costs': {
    kind: 'truth',
    owner: 'project-accounting',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['amount_minor >= 0'],
    readers: ['project-accounting', 'cost-accounting', 'financial-close'],
    writes: ['project.cost'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'project_id', 'cost_type', 'period_key']] },
  },

  // ── GL Platform ──────────────────────────────────────────
  'gl.posting_periods': {
    kind: 'control',
    owner: 'gl-platform',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['status in (open, soft_close, hard_close)', 'end_date > start_date'],
    readers: ['gl-platform', 'accounting', 'financial-close', 'statutory-reporting'],
    writes: ['gl.period.open', 'gl.period.close', 'close.lock.hard'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'ledger_id', 'company_id', 'period_key']] },
  },
  'gl.chart_of_accounts': {
    kind: 'control',
    owner: 'gl-platform',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['account_code unique per ledger'],
    readers: ['gl-platform', 'accounting', 'financial-close', 'statutory-reporting', 'budgeting'],
    writes: ['gl.coa.publish'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'ledger_id', 'account_code']] },
  },

  // ── Accounting Hub ───────────────────────────────────────
  'acct.acct_derived_entries': {
    kind: 'evidence',
    owner: 'accounting-hub',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['derivation_id = hash(event_id + mapping_version + inputs_hash)'],
    readers: ['accounting-hub', 'financial-close', 'statutory-reporting'],
    writes: ['acct.derive.commit'],
    idempotency: 'required',
    immutability: { after: 'committed', fields: ['derivation_id', 'event_id', 'journal_lines'] },
    keys: { natural: [['org_id', 'event_id', 'mapping_version']] },
  },
  'acct.acct_mappings': {
    kind: 'control',
    owner: 'accounting-hub',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['version monotonically increasing per mapping_id'],
    readers: ['accounting-hub', 'financial-close'],
    writes: ['acct.mapping.publish'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'mapping_id', 'version']] },
  },

  // ── Financial Close ──────────────────────────────────────
  'close.close_tasks': {
    kind: 'control',
    owner: 'financial-close',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['status in (pending, completed, skipped)'],
    readers: ['financial-close', 'statutory-reporting'],
    writes: ['close.task.complete'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'close_run_id', 'task_id']] },
  },
  'close.close_runs': {
    kind: 'control',
    owner: 'financial-close',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['all tasks completed before finalize'],
    readers: ['financial-close', 'statutory-reporting'],
    writes: ['close.run.finalize'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'close_run_id']] },
  },

  // ── Withholding Tax ──────────────────────────────────────
  'wht.wht_certificates': {
    kind: 'truth',
    owner: 'withholding-tax',
    rls: 'tenantPolicy',
    pii: 'low',
    write_policy: 'intent-only',
    invariants: ['certificate_no unique per org'],
    readers: ['withholding-tax', 'payables', 'statutory-reporting'],
    writes: ['wht.certificate.issue'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'certificate_no']] },
  },
  'wht.wht_remittances': {
    kind: 'truth',
    owner: 'withholding-tax',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['total = sum(certificate_amounts)'],
    readers: ['withholding-tax', 'statutory-reporting'],
    writes: ['wht.remit'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'remittance_id']] },
  },

  // ── Treasury ─────────────────────────────────────────────
  'treasury.cash_transfers': {
    kind: 'truth',
    owner: 'treasury',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['from_account != to_account', 'amount_minor > 0'],
    readers: ['treasury', 'bank-reconciliation', 'financial-close'],
    writes: ['treasury.transfer'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'transfer_id']] },
  },

  // ── Consolidation ────────────────────────────────────────
  'consolidation.elimination_journals': {
    kind: 'evidence',
    owner: 'consolidation',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['debit_total = credit_total per elimination_id'],
    readers: ['consolidation', 'financial-close', 'statutory-reporting'],
    writes: ['consolidation.eliminate', 'ic.eliminate'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'period_key', 'source_type', 'source_ref_id']] },
  },
  'consolidation.translation_journals': {
    kind: 'evidence',
    owner: 'consolidation',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['target_currency != source_currency'],
    readers: ['consolidation', 'financial-close', 'statutory-reporting'],
    writes: ['consolidation.translate'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'subsidiary_id', 'period_key', 'target_currency']] },
  },

  // ── Cost Accounting ──────────────────────────────────────
  'cost.cost_allocation_journals': {
    kind: 'evidence',
    owner: 'cost-accounting',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['sum(allocated) = total_pool_amount'],
    readers: ['cost-accounting', 'financial-close', 'budgeting'],
    writes: ['cost.allocate'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'allocation_run_id', 'period_key']] },
  },

  // ── Credit Management ────────────────────────────────────
  'credit.credit_limits': {
    kind: 'control',
    owner: 'credit-management',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['limit_amount >= 0'],
    readers: ['credit-management', 'receivables', 'payables'],
    writes: ['credit.limit.update'],
    idempotency: 'optional',
    keys: { natural: [['org_id', 'customer_id']] },
  },

  'credit.dunning_runs': {
    kind: 'evidence',
    owner: 'credit-management',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['run_date <= cutoff_date'],
    readers: ['credit-management', 'receivables'],
    writes: ['credit.dunning.create'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'run_date', 'cutoff_date']] },
  },

  // ── Payments ─────────────────────────────────────────────
  'payments.payments': {
    kind: 'truth',
    owner: 'receivables',
    rls: 'tenantPolicy',
    pii: 'low',
    write_policy: 'intent-only',
    invariants: ['amount_minor > 0'],
    readers: ['receivables', 'payables', 'bank-reconciliation', 'treasury', 'accounting'],
    writes: ['payment.create'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'payment_no']] },
  },

  // ── Bank Reconciliation ──────────────────────────────────
  'bank.reconciliation_items': {
    kind: 'truth',
    owner: 'bank-reconciliation',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['statement_amount = sum(matched_transaction_amounts)'],
    readers: ['bank-reconciliation', 'treasury', 'financial-close'],
    writes: ['bank-recon.confirm'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'bank_statement_id', 'line_id']] },
  },

  // ── Transfer Pricing ─────────────────────────────────────
  'tp.tp_policies': {
    kind: 'control',
    owner: 'transfer-pricing',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['method in (cup, rpm, cpm, tnmm, psm)'],
    readers: ['transfer-pricing', 'intercompany'],
    writes: ['tp.policy.publish'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'policy_id', 'version']] },
  },
  'tp.tp_calculations': {
    kind: 'evidence',
    owner: 'transfer-pricing',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['computed_price within arm_length_range'],
    readers: ['transfer-pricing', 'intercompany', 'statutory-reporting'],
    writes: ['tp.price.compute'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'transaction_id', 'policy_id']] },
  },

  // ── Provisions (IAS 37) ──────────────────────────────────
  'provisions.provisions': {
    kind: 'truth',
    owner: 'provisions',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['best_estimate_minor >= 0', 'recognition requires probable + reliable estimate'],
    readers: ['provisions', 'financial-close', 'statutory-reporting'],
    writes: ['provision.recognise'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'provision_no']] },
  },
  'provisions.provision_movements': {
    kind: 'truth',
    owner: 'provisions',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['movement reversal cannot exceed remaining balance'],
    readers: ['provisions', 'financial-close', 'statutory-reporting'],
    writes: ['provision.utilise', 'provision.reverse'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'provision_id', 'movement_type', 'movement_date']] },
  },

  // ── Intangible Assets (IAS 38) ───────────────────────────
  'intangible.intangible_assets': {
    kind: 'truth',
    owner: 'intangible-assets',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: [
      'carrying_amount = cost - accumulated_amortization - accumulated_impairment',
      'research phase always expensed',
    ],
    readers: ['intangible-assets', 'financial-close', 'statutory-reporting'],
    writes: ['intangible.capitalise', 'intangible.amortise', 'intangible.impair'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'asset_number']] },
  },

  // ── Financial Instruments (IFRS 9) ───────────────────────
  'fi.financial_instruments': {
    kind: 'truth',
    owner: 'financial-instruments',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: [
      'classification locked at initial recognition',
      'ecl_stage in (stage-1, stage-2, stage-3)',
    ],
    readers: [
      'financial-instruments',
      'financial-close',
      'statutory-reporting',
      'hedge-accounting',
    ],
    writes: ['fi.fv.change', 'fi.eir.accrue'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'instrument_no']] },
  },

  // ── Hedge Accounting (IFRS 9 §6) ────────────────────────
  'hedge.hedge_designations': {
    kind: 'control',
    owner: 'hedge-accounting',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: [
      'hedge_type in (fair-value, cash-flow, net-investment)',
      'effectiveness required each period',
    ],
    readers: [
      'hedge-accounting',
      'financial-instruments',
      'financial-close',
      'statutory-reporting',
    ],
    writes: ['hedge.designate', 'hedge.oci.reclass'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'designation_no']] },
  },
  'hedge.hedge_effectiveness_tests': {
    kind: 'evidence',
    owner: 'hedge-accounting',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['effectiveness_ratio between 80% and 125% for pass'],
    readers: ['hedge-accounting', 'financial-close', 'statutory-reporting'],
    writes: ['hedge.effectiveness'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'designation_id', 'test_date']] },
  },

  // ── Deferred Tax (IAS 12) ────────────────────────────────
  'deferred-tax.deferred_tax_items': {
    kind: 'ledger',
    owner: 'deferred-tax',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: [
      'DTA recognised only if probable future taxable profit',
      'net DTA/DTL per entity per jurisdiction',
    ],
    readers: ['deferred-tax', 'statutory-reporting', 'financial-close', 'consolidation'],
    writes: ['deferred-tax.calculate', 'deferred-tax.recognise'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'entity_id', 'account_id', 'period_key']] },
  },

  // ── Impairment of Assets (IAS 36) ───────────────────────
  'impairment.impairment_tests': {
    kind: 'evidence',
    owner: 'impairment-of-assets',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: ['recoverable_amount = max(VIU, FVLCD)', 'impairment if carrying > recoverable'],
    readers: ['impairment-of-assets', 'fixed-assets', 'intangible-assets', 'financial-close'],
    writes: ['impairment.test'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'asset_id', 'period_key']] },
  },
  'impairment.impairment_losses': {
    kind: 'ledger',
    owner: 'impairment-of-assets',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: [
      'goodwill impairment is never reversed',
      'reversal capped at original carrying amount',
    ],
    readers: ['impairment-of-assets', 'fixed-assets', 'intangible-assets', 'statutory-reporting'],
    writes: ['impairment.recognise', 'impairment.reverse'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'asset_id', 'impairment_date']] },
  },

  // ── Inventory Valuation (IAS 2) ─────────────────────────
  'inventory.inventory_valuations': {
    kind: 'ledger',
    owner: 'inventory-valuation',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: [
      'cost = purchase + conversion + other IAS 2.10 costs',
      'carrying = lower of cost and NRV',
    ],
    readers: ['inventory-valuation', 'cost-accounting', 'financial-close', 'statutory-reporting'],
    writes: ['inventory.costing', 'inventory.nrv.adjust'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'item_id', 'period_key']] },
  },

  // ── Government Grants (IAS 20) ──────────────────────────
  'grants.government_grants': {
    kind: 'ledger',
    owner: 'government-grants',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: [
      'recognised only when reasonable assurance of compliance + receipt',
      'income approach: systematic over periods matching related costs',
      'capital approach: deferred income amortised over asset life',
    ],
    readers: ['government-grants', 'project-accounting', 'statutory-reporting', 'financial-close'],
    writes: ['grant.recognise', 'grant.amortise'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'grant_id']] },
  },

  // ── Biological Assets (IAS 41) ──────────────────────────
  'bio.biological_assets': {
    kind: 'ledger',
    owner: 'biological-assets',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: [
      'measured at fair value less costs to sell (IAS 41.12)',
      'bearer plants follow IAS 16 after maturity',
    ],
    readers: ['biological-assets', 'fixed-assets', 'financial-close', 'statutory-reporting'],
    writes: ['bio-asset.measure'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'asset_id']] },
  },
  'bio.harvest_events': {
    kind: 'evidence',
    owner: 'biological-assets',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: [
      'harvest measured at FV less costs to sell at point of harvest',
      'transferred to inventory at FV at harvest (IAS 41.13)',
    ],
    readers: ['biological-assets', 'inventory-valuation', 'cost-accounting'],
    writes: ['bio-asset.harvest'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'asset_id', 'harvest_date']] },
  },

  // ── Investment Property (IAS 40) ────────────────────────
  'inv-property.investment_properties': {
    kind: 'ledger',
    owner: 'investment-property',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: [
      'fair value model: changes to P&L',
      'cost model: depreciate per IAS 16, impairment per IAS 36',
      'transfers only on change of use with evidence',
    ],
    readers: ['investment-property', 'fixed-assets', 'financial-close', 'statutory-reporting'],
    writes: ['inv-property.measure', 'inv-property.transfer'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'property_id']] },
  },

  // ── Employee Benefits (IAS 19) ──────────────────────────
  'emp-benefit.benefit_plans': {
    kind: 'control',
    owner: 'employee-benefits',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: [
      'DB obligation = PV of future benefits (IAS 19.67)',
      'plan assets at fair value',
      'net defined benefit = DBO - plan assets',
    ],
    readers: ['employee-benefits', 'financial-close', 'statutory-reporting'],
    writes: ['emp-benefit.accrue'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'plan_id']] },
  },
  'emp-benefit.actuarial_valuations': {
    kind: 'evidence',
    owner: 'employee-benefits',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: [
      'actuarial gains/losses recognised in OCI (IAS 19.120)',
      'remeasurements not reclassified to P&L',
    ],
    readers: ['employee-benefits', 'statutory-reporting'],
    writes: ['emp-benefit.remeasure'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'plan_id', 'valuation_date']] },
  },

  // ── Borrowing Costs (IAS 23) ────────────────────────────
  'borrow-cost.capitalised_costs': {
    kind: 'ledger',
    owner: 'borrowing-costs',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: [
      'capitalise only during active construction/development period',
      'cease on completion, suspension, or abandonment',
      'cap rate = weighted avg borrowing cost (IAS 23.14)',
    ],
    readers: ['borrowing-costs', 'fixed-assets', 'project-accounting', 'financial-close'],
    writes: ['borrow-cost.capitalise', 'borrow-cost.cease'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'qualifying_asset_id', 'period_key']] },
  },

  // ── Share-Based Payment (IFRS 2) ────────────────────────
  'sbp.sbp_grants': {
    kind: 'ledger',
    owner: 'share-based-payment',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: [
      'equity-settled: expense over vesting period (IFRS 2.10)',
      'cash-settled: remeasure to fair value each period (IFRS 2.30)',
      'no reversal of equity-settled recognised amounts on lapse',
    ],
    readers: ['share-based-payment', 'financial-close', 'statutory-reporting'],
    writes: ['sbp.grant', 'sbp.vest', 'sbp.expense'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'grant_id']] },
  },

  // ── E-Invoicing ────────────────────────────────────────
  'einvoice.e_invoices': {
    kind: 'truth',
    owner: 'e-invoicing',
    rls: 'tenantPolicy',
    pii: 'low',
    write_policy: 'intent-only',
    invariants: [
      'format in (ubl, peppol-bis, myinvois, factur-x, xrechnung)',
      'total = sum(line_amounts)',
    ],
    readers: ['e-invoicing', 'receivables', 'payables', 'statutory-reporting'],
    writes: ['einvoice.issue'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'invoice_id']] },
  },
  'einvoice.e_invoice_submissions': {
    kind: 'evidence',
    owner: 'e-invoicing',
    rls: 'tenantPolicy',
    pii: 'none',
    write_policy: 'intent-only',
    invariants: [
      'clearance_status in (cleared, rejected, pending)',
      'one active submission per invoice',
    ],
    readers: ['e-invoicing', 'statutory-reporting'],
    writes: ['einvoice.submit', 'einvoice.clear'],
    idempotency: 'required',
    keys: { natural: [['org_id', 'invoice_id', 'submission_id']] },
  },
} as const satisfies Record<string, SharedKernelEntry>;

export type SharedKernelTableKey = keyof typeof SHARED_KERNEL_REGISTRY;
