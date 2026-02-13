import { z } from 'zod';

export const AccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  account_name: z.string(),
  account_number: z.string().optional(),
  is_group: z.boolean().optional().default(false),
  company: z.string(),
  root_type: z.enum(['Asset', 'Liability', 'Income', 'Expense', 'Equity']).optional(),
  report_type: z.enum(['Balance Sheet', 'Profit and Loss']).optional(),
  account_currency: z.string().optional(),
  parent_account: z.string(),
  account_category: z.string().optional(),
  account_type: z.enum(['Accumulated Depreciation', 'Asset Received But Not Billed', 'Bank', 'Cash', 'Chargeable', 'Capital Work in Progress', 'Cost of Goods Sold', 'Current Asset', 'Current Liability', 'Depreciation', 'Direct Expense', 'Direct Income', 'Equity', 'Expense Account', 'Expenses Included In Asset Valuation', 'Expenses Included In Valuation', 'Fixed Asset', 'Income Account', 'Indirect Expense', 'Indirect Income', 'Liability', 'Payable', 'Receivable', 'Round Off', 'Round Off for Opening', 'Stock', 'Stock Adjustment', 'Stock Received But Not Billed', 'Service Received But Not Billed', 'Tax', 'Temporary']).optional(),
  tax_rate: z.number().optional(),
  freeze_account: z.enum(['No', 'Yes']).optional(),
  balance_must_be: z.enum(['Debit', 'Credit']).optional(),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
  include_in_gross: z.boolean().optional().default(false),
});

export type Account = z.infer<typeof AccountSchema>;

export const AccountInsertSchema = AccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AccountInsert = z.infer<typeof AccountInsertSchema>;

export const AccountCategorySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account_category_name: z.string(),
  description: z.string().optional(),
});

export type AccountCategory = z.infer<typeof AccountCategorySchema>;

export const AccountCategoryInsertSchema = AccountCategorySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AccountCategoryInsert = z.infer<typeof AccountCategoryInsertSchema>;

export const AccountClosingBalanceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  closing_date: z.string().optional(),
  account: z.string().optional(),
  cost_center: z.string().optional(),
  debit: z.number().optional(),
  credit: z.number().optional(),
  reporting_currency_exchange_rate: z.number().optional(),
  debit_in_reporting_currency: z.number().optional(),
  credit_in_reporting_currency: z.number().optional(),
  account_currency: z.string().optional(),
  debit_in_account_currency: z.number().optional(),
  credit_in_account_currency: z.number().optional(),
  project: z.string().optional(),
  company: z.string().optional(),
  finance_book: z.string().optional(),
  period_closing_voucher: z.string().optional(),
  is_period_closing_voucher_entry: z.boolean().optional().default(false),
});

export type AccountClosingBalance = z.infer<typeof AccountClosingBalanceSchema>;

export const AccountClosingBalanceInsertSchema = AccountClosingBalanceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AccountClosingBalanceInsert = z.infer<typeof AccountClosingBalanceInsertSchema>;

export const AccountingDimensionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  document_type: z.string(),
  label: z.string().optional(),
  fieldname: z.string().optional(),
  dimension_defaults: z.array(z.unknown()).optional(),
  disabled: z.boolean().optional().default(false),
});

export type AccountingDimension = z.infer<typeof AccountingDimensionSchema>;

export const AccountingDimensionInsertSchema = AccountingDimensionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AccountingDimensionInsert = z.infer<typeof AccountingDimensionInsertSchema>;

export const AccountingDimensionDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  reference_document: z.string().optional(),
  default_dimension: z.string().optional(),
  mandatory_for_bs: z.boolean().optional().default(false),
  mandatory_for_pl: z.boolean().optional().default(false),
  automatically_post_balancing_accounting_entry: z.boolean().optional().default(false),
  offsetting_account: z.string().optional(),
});

export type AccountingDimensionDetail = z.infer<typeof AccountingDimensionDetailSchema>;

export const AccountingDimensionDetailInsertSchema = AccountingDimensionDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AccountingDimensionDetailInsert = z.infer<typeof AccountingDimensionDetailInsertSchema>;

export const AccountingDimensionFilterSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  accounting_dimension: z.string(),
  fieldname: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  company: z.string(),
  apply_restriction_on_values: z.boolean().optional().default(true),
  allow_or_restrict: z.enum(['Allow', 'Restrict']),
  accounts: z.array(z.unknown()),
  dimensions: z.array(z.unknown()).optional(),
  dimension_filter_help: z.string().optional(),
});

export type AccountingDimensionFilter = z.infer<typeof AccountingDimensionFilterSchema>;

export const AccountingDimensionFilterInsertSchema = AccountingDimensionFilterSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AccountingDimensionFilterInsert = z.infer<typeof AccountingDimensionFilterInsertSchema>;

export const AccountingPeriodSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  period_name: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  company: z.string(),
  disabled: z.boolean().optional().default(false),
  exempted_role: z.string().optional(),
  closed_documents: z.array(z.unknown()),
});

export type AccountingPeriod = z.infer<typeof AccountingPeriodSchema>;

export const AccountingPeriodInsertSchema = AccountingPeriodSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AccountingPeriodInsert = z.infer<typeof AccountingPeriodInsertSchema>;

export const AccountsSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  unlink_payment_on_cancellation_of_invoice: z.boolean().optional().default(true),
  unlink_advance_payment_on_cancelation_of_order: z.boolean().optional().default(true),
  delete_linked_ledger_entries: z.boolean().optional().default(false),
  enable_immutable_ledger: z.boolean().optional().default(false),
  check_supplier_invoice_uniqueness: z.boolean().optional().default(false),
  automatically_fetch_payment_terms: z.boolean().optional().default(false),
  enable_common_party_accounting: z.boolean().optional().default(false),
  allow_multi_currency_invoices_against_single_party_account: z.boolean().optional().default(false),
  confirm_before_resetting_posting_date: z.boolean().optional().default(true),
  enable_accounting_dimensions: z.boolean().optional().default(false),
  enable_discounts_and_margin: z.boolean().optional().default(false),
  merge_similar_account_heads: z.boolean().optional().default(false),
  book_deferred_entries_based_on: z.enum(['Days', 'Months']).optional().default('Days'),
  automatically_process_deferred_accounting_entry: z.boolean().optional().default(true),
  book_deferred_entries_via_journal_entry: z.boolean().optional().default(false),
  submit_journal_entries: z.boolean().optional().default(false),
  determine_address_tax_category_from: z.enum(['Billing Address', 'Shipping Address']).optional().default('Billing Address'),
  add_taxes_from_item_tax_template: z.boolean().optional().default(true),
  add_taxes_from_taxes_and_charges_template: z.boolean().optional().default(false),
  book_tax_discount_loss: z.boolean().optional().default(false),
  round_row_wise_tax: z.boolean().optional().default(false),
  show_inclusive_tax_in_print: z.boolean().optional().default(false),
  show_taxes_as_table_in_print: z.boolean().optional().default(false),
  show_payment_schedule_in_print: z.boolean().optional().default(false),
  maintain_same_internal_transaction_rate: z.boolean().optional().default(false),
  fetch_valuation_rate_for_internal_transaction: z.boolean().optional().default(false),
  maintain_same_rate_action: z.enum(['Stop', 'Warn']).optional().default('Stop'),
  role_to_override_stop_action: z.string().optional(),
  allow_stale: z.boolean().optional().default(true),
  allow_pegged_currencies_exchange_rates: z.boolean().optional().default(false),
  stale_days: z.number().int().optional().default(1),
  auto_reconcile_payments: z.boolean().optional().default(false),
  auto_reconciliation_job_trigger: z.number().int().optional().default(15),
  reconciliation_queue_size: z.number().int().optional().default(5),
  exchange_gain_loss_posting_date: z.enum(['Invoice', 'Payment', 'Reconciliation Date']).optional().default('Payment'),
  enable_loyalty_point_program: z.boolean().optional().default(false),
  over_billing_allowance: z.number().optional(),
  role_allowed_to_over_bill: z.string().optional(),
  credit_controller: z.string().optional(),
  make_payment_via_journal_entry: z.boolean().optional().default(false),
  calculate_depr_using_total_days: z.boolean().optional().default(false),
  book_asset_depreciation_entry_automatically: z.boolean().optional().default(true),
  role_to_notify_on_depreciation_failure: z.string().optional(),
  ignore_account_closing_balance: z.boolean().optional().default(false),
  use_legacy_controller_for_pcv: z.boolean().optional().default(true),
  general_ledger_remarks_length: z.number().int().optional().default(0),
  receivable_payable_remarks_length: z.number().int().optional().default(0),
  receivable_payable_fetch_method: z.enum(['Buffered Cursor', 'UnBuffered Cursor', 'Raw SQL']).optional().default('Buffered Cursor'),
  default_ageing_range: z.string().optional().default('30, 60, 90, 120'),
  ignore_is_opening_check_for_reporting: z.boolean().optional().default(false),
  show_balance_in_coa: z.boolean().optional().default(true),
  enable_party_matching: z.boolean().optional().default(false),
  enable_fuzzy_matching: z.boolean().optional().default(false),
  create_pr_in_draft_status: z.boolean().optional().default(true),
  use_legacy_budget_controller: z.boolean().optional().default(false),
});

export type AccountsSettings = z.infer<typeof AccountsSettingsSchema>;

export const AccountsSettingsInsertSchema = AccountsSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AccountsSettingsInsert = z.infer<typeof AccountsSettingsInsertSchema>;

export const AdvancePaymentLedgerEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  voucher_type: z.string().optional(),
  voucher_no: z.string().optional(),
  against_voucher_type: z.string().optional(),
  against_voucher_no: z.string().optional(),
  currency: z.string().optional(),
  exchange_rate: z.number().optional(),
  amount: z.number().optional(),
  base_amount: z.number().optional(),
  event: z.string().optional(),
  delinked: z.boolean().optional().default(false),
});

export type AdvancePaymentLedgerEntry = z.infer<typeof AdvancePaymentLedgerEntrySchema>;

export const AdvancePaymentLedgerEntryInsertSchema = AdvancePaymentLedgerEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AdvancePaymentLedgerEntryInsert = z.infer<typeof AdvancePaymentLedgerEntryInsertSchema>;

export const AdvanceTaxesAndChargesSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  add_deduct_tax: z.enum(['Add', 'Deduct']),
  charge_type: z.enum(['Actual', 'On Paid Amount', 'On Previous Row Amount', 'On Previous Row Total']),
  row_id: z.string().optional(),
  account_head: z.string(),
  description: z.string(),
  included_in_paid_amount: z.boolean().optional().default(false),
  set_by_item_tax_template: z.boolean().optional().default(false),
  is_tax_withholding_account: z.boolean().optional().default(false),
  cost_center: z.string().optional().default(':Company'),
  project: z.string().optional(),
  rate: z.number().optional(),
  currency: z.string().optional(),
  net_amount: z.number().optional(),
  tax_amount: z.number().optional(),
  total: z.number().optional(),
  base_tax_amount: z.number().optional(),
  base_net_amount: z.number().optional(),
  base_total: z.number().optional(),
});

export type AdvanceTaxesAndCharges = z.infer<typeof AdvanceTaxesAndChargesSchema>;

export const AdvanceTaxesAndChargesInsertSchema = AdvanceTaxesAndChargesSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AdvanceTaxesAndChargesInsert = z.infer<typeof AdvanceTaxesAndChargesInsertSchema>;

export const AllowedDimensionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  accounting_dimension: z.string().optional(),
  dimension_value: z.string().optional(),
});

export type AllowedDimension = z.infer<typeof AllowedDimensionSchema>;

export const AllowedDimensionInsertSchema = AllowedDimensionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AllowedDimensionInsert = z.infer<typeof AllowedDimensionInsertSchema>;

export const AllowedToTransactWithSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
});

export type AllowedToTransactWith = z.infer<typeof AllowedToTransactWithSchema>;

export const AllowedToTransactWithInsertSchema = AllowedToTransactWithSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AllowedToTransactWithInsert = z.infer<typeof AllowedToTransactWithInsertSchema>;

export const ApplicableOnAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  applicable_on_account: z.string(),
  is_mandatory: z.boolean().optional().default(false),
});

export type ApplicableOnAccount = z.infer<typeof ApplicableOnAccountSchema>;

export const ApplicableOnAccountInsertSchema = ApplicableOnAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ApplicableOnAccountInsert = z.infer<typeof ApplicableOnAccountInsertSchema>;

export const BankSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  bank_name: z.string(),
  swift_number: z.string().optional(),
  website: z.string().optional(),
  address_html: z.string().optional(),
  contact_html: z.string().optional(),
  bank_transaction_mapping: z.array(z.unknown()).optional(),
  plaid_access_token: z.string().optional(),
});

export type Bank = z.infer<typeof BankSchema>;

export const BankInsertSchema = BankSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankInsert = z.infer<typeof BankInsertSchema>;

export const BankAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account_name: z.string(),
  account: z.string().optional(),
  bank: z.string(),
  account_type: z.string().optional(),
  account_subtype: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  is_default: z.boolean().optional().default(false),
  is_company_account: z.boolean().optional().default(false),
  company: z.string().optional(),
  party_type: z.string().optional(),
  party: z.string().optional(),
  iban: z.string().max(34).optional(),
  branch_code: z.string().optional(),
  bank_account_no: z.string().max(30).optional(),
  address_html: z.string().optional(),
  contact_html: z.string().optional(),
  integration_id: z.string().optional(),
  last_integration_date: z.string().optional(),
  mask: z.string().optional(),
});

export type BankAccount = z.infer<typeof BankAccountSchema>;

export const BankAccountInsertSchema = BankAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankAccountInsert = z.infer<typeof BankAccountInsertSchema>;

export const BankAccountSubtypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account_subtype: z.string().optional(),
});

export type BankAccountSubtype = z.infer<typeof BankAccountSubtypeSchema>;

export const BankAccountSubtypeInsertSchema = BankAccountSubtypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankAccountSubtypeInsert = z.infer<typeof BankAccountSubtypeInsertSchema>;

export const BankAccountTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account_type: z.string().optional(),
});

export type BankAccountType = z.infer<typeof BankAccountTypeSchema>;

export const BankAccountTypeInsertSchema = BankAccountTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankAccountTypeInsert = z.infer<typeof BankAccountTypeInsertSchema>;

export const BankClearanceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account: z.string(),
  account_currency: z.string().optional(),
  from_date: z.string(),
  to_date: z.string(),
  bank_account: z.string().optional(),
  include_reconciled_entries: z.boolean().optional().default(false),
  include_pos_transactions: z.boolean().optional().default(false),
  payment_entries: z.array(z.unknown()).optional(),
});

export type BankClearance = z.infer<typeof BankClearanceSchema>;

export const BankClearanceInsertSchema = BankClearanceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankClearanceInsert = z.infer<typeof BankClearanceInsertSchema>;

export const BankClearanceDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  payment_document: z.string().optional(),
  payment_entry: z.string().optional(),
  against_account: z.string().optional(),
  amount: z.string().optional(),
  posting_date: z.string().optional(),
  cheque_number: z.string().optional(),
  cheque_date: z.string().optional(),
  clearance_date: z.string().optional(),
});

export type BankClearanceDetail = z.infer<typeof BankClearanceDetailSchema>;

export const BankClearanceDetailInsertSchema = BankClearanceDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankClearanceDetailInsert = z.infer<typeof BankClearanceDetailInsertSchema>;

export const BankGuaranteeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  bg_type: z.enum(['Receiving', 'Providing']),
  reference_doctype: z.string().optional(),
  reference_docname: z.string().optional(),
  customer: z.string().optional(),
  supplier: z.string().optional(),
  project: z.string().optional(),
  amount: z.number(),
  start_date: z.string(),
  validity: z.number().int().optional(),
  end_date: z.string().optional(),
  bank: z.string().optional(),
  bank_account: z.string().optional(),
  account: z.string().optional(),
  bank_account_no: z.string().optional(),
  iban: z.string().optional(),
  branch_code: z.string().optional(),
  swift_number: z.string().optional(),
  more_information: z.string().optional(),
  bank_guarantee_number: z.string().optional(),
  name_of_beneficiary: z.string().optional(),
  margin_money: z.number().optional(),
  charges: z.number().optional(),
  fixed_deposit_number: z.string().optional(),
  amended_from: z.string().optional(),
});

export type BankGuarantee = z.infer<typeof BankGuaranteeSchema>;

export const BankGuaranteeInsertSchema = BankGuaranteeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankGuaranteeInsert = z.infer<typeof BankGuaranteeInsertSchema>;

export const BankReconciliationToolSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  bank_account: z.string().optional(),
  bank_statement_from_date: z.string().optional(),
  bank_statement_to_date: z.string().optional(),
  from_reference_date: z.string().optional(),
  to_reference_date: z.string().optional(),
  filter_by_reference_date: z.boolean().optional().default(false),
  account_currency: z.string().optional(),
  account_opening_balance: z.number().optional(),
  bank_statement_closing_balance: z.number().optional(),
  reconciliation_tool_cards: z.string().optional(),
  reconciliation_tool_dt: z.string().optional(),
  no_bank_transactions: z.string().optional(),
});

export type BankReconciliationTool = z.infer<typeof BankReconciliationToolSchema>;

export const BankReconciliationToolInsertSchema = BankReconciliationToolSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankReconciliationToolInsert = z.infer<typeof BankReconciliationToolInsertSchema>;

export const BankStatementImportSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
  bank_account: z.string(),
  bank: z.string().optional(),
  import_mt940_fromat: z.boolean().optional().default(false),
  custom_delimiters: z.boolean().optional().default(false),
  delimiter_options: z.string().optional().default(',;\t|'),
  google_sheets_url: z.string().optional(),
  html_5: z.string().optional(),
  import_file: z.string().optional(),
  status: z.enum(['Pending', 'Success', 'Partial Success', 'Error']).optional().default('Pending'),
  template_options: z.string().optional(),
  use_csv_sniffer: z.boolean().optional().default(false),
  template_warnings: z.string().optional(),
  import_warnings: z.string().optional(),
  import_preview: z.string().optional(),
  show_failed_logs: z.boolean().optional().default(false),
  import_log_preview: z.string().optional(),
  reference_doctype: z.string().default('Bank Transaction'),
  import_type: z.enum(['Insert New Records', 'Update Existing Records']).default('Insert New Records'),
  submit_after_import: z.boolean().optional().default(true),
  mute_emails: z.boolean().optional().default(true),
});

export type BankStatementImport = z.infer<typeof BankStatementImportSchema>;

export const BankStatementImportInsertSchema = BankStatementImportSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankStatementImportInsert = z.infer<typeof BankStatementImportInsertSchema>;

export const BankTransactionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['ACC-BTN-.YYYY.-']).default('ACC-BTN-.YYYY.-'),
  date: z.string().optional(),
  status: z.enum(['Pending', 'Settled', 'Unreconciled', 'Reconciled', 'Cancelled']).optional().default('Pending'),
  bank_account: z.string().optional(),
  company: z.string().optional(),
  amended_from: z.string().optional(),
  deposit: z.number().optional(),
  withdrawal: z.number().optional(),
  currency: z.string().optional(),
  description: z.string().optional(),
  reference_number: z.string().optional(),
  transaction_id: z.string().optional(),
  transaction_type: z.string().max(50).optional(),
  payment_entries: z.array(z.unknown()).optional(),
  allocated_amount: z.number().optional(),
  unallocated_amount: z.number().optional(),
  party_type: z.string().optional(),
  party: z.string().optional(),
  bank_party_name: z.string().optional(),
  bank_party_account_number: z.string().optional(),
  bank_party_iban: z.string().optional(),
  included_fee: z.number().optional(),
  excluded_fee: z.number().optional(),
});

export type BankTransaction = z.infer<typeof BankTransactionSchema>;

export const BankTransactionInsertSchema = BankTransactionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankTransactionInsert = z.infer<typeof BankTransactionInsertSchema>;

export const BankTransactionMappingSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  bank_transaction_field: z.string(),
  file_field: z.string(),
});

export type BankTransactionMapping = z.infer<typeof BankTransactionMappingSchema>;

export const BankTransactionMappingInsertSchema = BankTransactionMappingSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankTransactionMappingInsert = z.infer<typeof BankTransactionMappingInsertSchema>;

export const BankTransactionPaymentsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  payment_document: z.string(),
  payment_entry: z.string(),
  allocated_amount: z.number(),
  clearance_date: z.string().optional(),
});

export type BankTransactionPayments = z.infer<typeof BankTransactionPaymentsSchema>;

export const BankTransactionPaymentsInsertSchema = BankTransactionPaymentsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankTransactionPaymentsInsert = z.infer<typeof BankTransactionPaymentsInsertSchema>;

export const BisectAccountingStatementsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  algorithm: z.enum(['BFS', 'DFS']).optional().default('BFS'),
  current_node: z.string().optional(),
  bisect_heatmap: z.string().optional(),
  current_from_date: z.string().optional(),
  current_to_date: z.string().optional(),
  p_l_summary: z.number().optional(),
  b_s_summary: z.number().optional(),
  difference: z.number().optional(),
});

export type BisectAccountingStatements = z.infer<typeof BisectAccountingStatementsSchema>;

export const BisectAccountingStatementsInsertSchema = BisectAccountingStatementsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BisectAccountingStatementsInsert = z.infer<typeof BisectAccountingStatementsInsertSchema>;

export const BisectNodesSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  root: z.string().optional(),
  left_child: z.string().optional(),
  right_child: z.string().optional(),
  period_from_date: z.string().optional(),
  period_to_date: z.string().optional(),
  difference: z.number().optional(),
  balance_sheet_summary: z.number().optional(),
  profit_loss_summary: z.number().optional(),
  generated: z.boolean().optional().default(false),
});

export type BisectNodes = z.infer<typeof BisectNodesSchema>;

export const BisectNodesInsertSchema = BisectNodesSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BisectNodesInsert = z.infer<typeof BisectNodesInsertSchema>;

export const BudgetSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['BUDGET-.########']).default('BUDGET-.########'),
  budget_against: z.enum(['Cost Center', 'Project']).default('Cost Center'),
  company: z.string(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  account: z.string(),
  amended_from: z.string().optional(),
  from_fiscal_year: z.string(),
  to_fiscal_year: z.string(),
  budget_start_date: z.string().optional(),
  budget_end_date: z.string().optional(),
  distribution_frequency: z.enum(['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly']).default('Monthly'),
  budget_amount: z.number(),
  distribute_equally: z.boolean().optional().default(true),
  budget_distribution: z.array(z.unknown()).optional(),
  budget_distribution_total: z.number().optional(),
  applicable_on_material_request: z.boolean().optional().default(false),
  action_if_annual_budget_exceeded_on_mr: z.enum(['Stop', 'Warn', 'Ignore']).optional().default('Stop'),
  action_if_accumulated_monthly_budget_exceeded_on_mr: z.enum(['Stop', 'Warn', 'Ignore']).optional().default('Warn'),
  applicable_on_purchase_order: z.boolean().optional().default(false),
  action_if_annual_budget_exceeded_on_po: z.enum(['Stop', 'Warn', 'Ignore']).optional().default('Stop'),
  action_if_accumulated_monthly_budget_exceeded_on_po: z.enum(['Stop', 'Warn', 'Ignore']).optional().default('Warn'),
  applicable_on_booking_actual_expenses: z.boolean().optional().default(false),
  action_if_annual_budget_exceeded: z.enum(['Stop', 'Warn', 'Ignore']).optional().default('Stop'),
  action_if_accumulated_monthly_budget_exceeded: z.enum(['Stop', 'Warn', 'Ignore']).optional().default('Warn'),
  applicable_on_cumulative_expense: z.boolean().optional().default(false),
  action_if_annual_exceeded_on_cumulative_expense: z.enum(['Stop', 'Warn', 'Ignore']).optional(),
  action_if_accumulated_monthly_exceeded_on_cumulative_expense: z.enum(['Stop', 'Warn', 'Ignore']).optional(),
  revision_of: z.string().optional(),
});

export type Budget = z.infer<typeof BudgetSchema>;

export const BudgetInsertSchema = BudgetSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BudgetInsert = z.infer<typeof BudgetInsertSchema>;

export const BudgetAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account: z.string(),
  budget_amount: z.number(),
});

export type BudgetAccount = z.infer<typeof BudgetAccountSchema>;

export const BudgetAccountInsertSchema = BudgetAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BudgetAccountInsert = z.infer<typeof BudgetAccountInsertSchema>;

export const BudgetDistributionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  amount: z.number().optional(),
  percent: z.number().optional(),
});

export type BudgetDistribution = z.infer<typeof BudgetDistributionSchema>;

export const BudgetDistributionInsertSchema = BudgetDistributionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BudgetDistributionInsert = z.infer<typeof BudgetDistributionInsertSchema>;

export const CampaignItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  campaign: z.string().optional(),
});

export type CampaignItem = z.infer<typeof CampaignItemSchema>;

export const CampaignItemInsertSchema = CampaignItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CampaignItemInsert = z.infer<typeof CampaignItemInsertSchema>;

export const CashierClosingSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['POS-CLO-']).optional().default('POS-CLO-'),
  user: z.string(),
  date: z.string().optional().default('Today'),
  from_time: z.string(),
  time: z.string(),
  expense: z.number().optional().default(0),
  custody: z.number().optional().default(0),
  returns: z.number().optional().default(0),
  outstanding_amount: z.number().optional().default(0),
  payments: z.array(z.unknown()).optional(),
  net_amount: z.number().optional(),
  amended_from: z.string().optional(),
});

export type CashierClosing = z.infer<typeof CashierClosingSchema>;

export const CashierClosingInsertSchema = CashierClosingSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CashierClosingInsert = z.infer<typeof CashierClosingInsertSchema>;

export const CashierClosingPaymentsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  mode_of_payment: z.string(),
  amount: z.number().optional().default(0),
});

export type CashierClosingPayments = z.infer<typeof CashierClosingPaymentsSchema>;

export const CashierClosingPaymentsInsertSchema = CashierClosingPaymentsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CashierClosingPaymentsInsert = z.infer<typeof CashierClosingPaymentsInsertSchema>;

export const ChartOfAccountsImporterSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  import_file: z.string().optional(),
  chart_tree: z.string().optional(),
});

export type ChartOfAccountsImporter = z.infer<typeof ChartOfAccountsImporterSchema>;

export const ChartOfAccountsImporterInsertSchema = ChartOfAccountsImporterSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ChartOfAccountsImporterInsert = z.infer<typeof ChartOfAccountsImporterInsertSchema>;

export const ChequePrintTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  settings: z.string().optional(),
  has_print_format: z.boolean().optional().default(false),
  bank_name: z.string(),
  cheque_size: z.enum(['Regular', 'A4']).optional().default('Regular'),
  starting_position_from_top_edge: z.number().optional(),
  cheque_width: z.number().optional().default(20),
  cheque_height: z.number().optional().default(9),
  scanned_cheque: z.string().optional(),
  is_account_payable: z.boolean().optional().default(true),
  acc_pay_dist_from_top_edge: z.number().optional().default(1),
  acc_pay_dist_from_left_edge: z.number().optional().default(9),
  message_to_show: z.string().optional().default('Acc. Payee'),
  date_settings: z.string().optional(),
  date_dist_from_top_edge: z.number().optional().default(1),
  date_dist_from_left_edge: z.number().optional().default(15),
  payer_name_from_top_edge: z.number().optional().default(2),
  payer_name_from_left_edge: z.number().optional().default(3),
  html_19: z.string().optional(),
  amt_in_words_from_top_edge: z.number().optional().default(3),
  amt_in_words_from_left_edge: z.number().optional().default(4),
  amt_in_word_width: z.number().optional().default(15),
  amt_in_words_line_spacing: z.number().optional().default(0.5),
  amt_in_figures_from_top_edge: z.number().optional().default(3.5),
  amt_in_figures_from_left_edge: z.number().optional().default(16),
  account_no_settings: z.string().optional(),
  acc_no_dist_from_top_edge: z.number().optional().default(5),
  acc_no_dist_from_left_edge: z.number().optional().default(4),
  signatory_from_top_edge: z.number().optional().default(6),
  signatory_from_left_edge: z.number().optional().default(15),
  cheque_print_preview: z.string().optional(),
});

export type ChequePrintTemplate = z.infer<typeof ChequePrintTemplateSchema>;

export const ChequePrintTemplateInsertSchema = ChequePrintTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ChequePrintTemplateInsert = z.infer<typeof ChequePrintTemplateInsertSchema>;

export const ClosedDocumentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  document_type: z.string(),
  closed: z.boolean().optional().default(false),
});

export type ClosedDocument = z.infer<typeof ClosedDocumentSchema>;

export const ClosedDocumentInsertSchema = ClosedDocumentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ClosedDocumentInsert = z.infer<typeof ClosedDocumentInsertSchema>;

export const CostCenterSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  cost_center_name: z.string(),
  cost_center_number: z.string().optional(),
  parent_cost_center: z.string(),
  company: z.string(),
  is_group: z.boolean().optional().default(false),
  disabled: z.boolean().optional().default(false),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
});

export type CostCenter = z.infer<typeof CostCenterSchema>;

export const CostCenterInsertSchema = CostCenterSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CostCenterInsert = z.infer<typeof CostCenterInsertSchema>;

export const CostCenterAllocationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  main_cost_center: z.string(),
  company: z.string(),
  valid_from: z.string().default('Today'),
  allocation_percentages: z.array(z.unknown()),
  amended_from: z.string().optional(),
});

export type CostCenterAllocation = z.infer<typeof CostCenterAllocationSchema>;

export const CostCenterAllocationInsertSchema = CostCenterAllocationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CostCenterAllocationInsert = z.infer<typeof CostCenterAllocationInsertSchema>;

export const CostCenterAllocationPercentageSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  cost_center: z.string(),
  percentage: z.number(),
});

export type CostCenterAllocationPercentage = z.infer<typeof CostCenterAllocationPercentageSchema>;

export const CostCenterAllocationPercentageInsertSchema = CostCenterAllocationPercentageSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CostCenterAllocationPercentageInsert = z.infer<typeof CostCenterAllocationPercentageInsertSchema>;

export const CouponCodeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  coupon_name: z.string(),
  coupon_type: z.enum(['Promotional', 'Gift Card']),
  customer: z.string().optional(),
  coupon_code: z.string().optional(),
  from_external_ecomm_platform: z.boolean().optional().default(false),
  pricing_rule: z.string().optional(),
  valid_from: z.string().optional(),
  valid_upto: z.string().optional(),
  maximum_use: z.number().int().optional(),
  used: z.number().int().optional().default(0),
  description: z.string().optional(),
  amended_from: z.string().optional(),
});

export type CouponCode = z.infer<typeof CouponCodeSchema>;

export const CouponCodeInsertSchema = CouponCodeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CouponCodeInsert = z.infer<typeof CouponCodeInsertSchema>;

export const CurrencyExchangeSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  service_provider: z.enum(['frankfurter.dev', 'exchangerate.host', 'Custom']),
  api_endpoint: z.string(),
  use_http: z.boolean().optional().default(false),
  access_key: z.string().optional(),
  url: z.string().optional(),
  help: z.string().optional(),
  req_params: z.array(z.unknown()),
  result_key: z.array(z.unknown()),
});

export type CurrencyExchangeSettings = z.infer<typeof CurrencyExchangeSettingsSchema>;

export const CurrencyExchangeSettingsInsertSchema = CurrencyExchangeSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CurrencyExchangeSettingsInsert = z.infer<typeof CurrencyExchangeSettingsInsertSchema>;

export const CurrencyExchangeSettingsDetailsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  key: z.string(),
  value: z.string(),
});

export type CurrencyExchangeSettingsDetails = z.infer<typeof CurrencyExchangeSettingsDetailsSchema>;

export const CurrencyExchangeSettingsDetailsInsertSchema = CurrencyExchangeSettingsDetailsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CurrencyExchangeSettingsDetailsInsert = z.infer<typeof CurrencyExchangeSettingsDetailsInsertSchema>;

export const CurrencyExchangeSettingsResultSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  key: z.string(),
});

export type CurrencyExchangeSettingsResult = z.infer<typeof CurrencyExchangeSettingsResultSchema>;

export const CurrencyExchangeSettingsResultInsertSchema = CurrencyExchangeSettingsResultSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CurrencyExchangeSettingsResultInsert = z.infer<typeof CurrencyExchangeSettingsResultInsertSchema>;

export const CustomerGroupItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  customer_group: z.string().optional(),
});

export type CustomerGroupItem = z.infer<typeof CustomerGroupItemSchema>;

export const CustomerGroupItemInsertSchema = CustomerGroupItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CustomerGroupItemInsert = z.infer<typeof CustomerGroupItemInsertSchema>;

export const CustomerItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  customer: z.string().optional(),
});

export type CustomerItem = z.infer<typeof CustomerItemSchema>;

export const CustomerItemInsertSchema = CustomerItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CustomerItemInsert = z.infer<typeof CustomerItemInsertSchema>;

export const DiscountedInvoiceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  sales_invoice: z.string(),
  customer: z.string().optional(),
  posting_date: z.string().optional(),
  outstanding_amount: z.number().optional(),
  debit_to: z.string().optional(),
});

export type DiscountedInvoice = z.infer<typeof DiscountedInvoiceSchema>;

export const DiscountedInvoiceInsertSchema = DiscountedInvoiceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DiscountedInvoiceInsert = z.infer<typeof DiscountedInvoiceInsertSchema>;

export const DunningSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['DUNN-.MM.-.YY.-']).optional().default('DUNN-.MM.-.YY.-'),
  customer: z.string(),
  customer_name: z.string().optional(),
  company: z.string(),
  posting_date: z.string().default('Today'),
  posting_time: z.string().optional(),
  status: z.enum(['Draft', 'Resolved', 'Unresolved', 'Cancelled']).optional().default('Unresolved'),
  currency: z.string().optional(),
  conversion_rate: z.number().optional(),
  dunning_type: z.string().optional(),
  rate_of_interest: z.number().optional().default(0),
  overdue_payments: z.array(z.unknown()).optional(),
  total_interest: z.number().optional().default(0),
  dunning_fee: z.number().optional().default(0),
  dunning_amount: z.number().optional().default(0),
  base_dunning_amount: z.number().optional().default(0),
  spacer: z.string().optional(),
  total_outstanding: z.number().optional(),
  grand_total: z.number().optional().default(0),
  language: z.string().optional(),
  body_text: z.string().optional(),
  letter_head: z.string().optional(),
  closing_text: z.string().optional(),
  income_account: z.string().optional(),
  cost_center: z.string().optional(),
  amended_from: z.string().optional(),
  customer_address: z.string().optional(),
  address_display: z.string().optional(),
  contact_person: z.string().optional(),
  contact_display: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().email().optional(),
  company_address: z.string().optional(),
  company_address_display: z.string().optional(),
});

export type Dunning = z.infer<typeof DunningSchema>;

export const DunningInsertSchema = DunningSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DunningInsert = z.infer<typeof DunningInsertSchema>;

export const DunningLetterTextSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  language: z.string().optional(),
  is_default_language: z.boolean().optional().default(false),
  body_text: z.string().optional(),
  closing_text: z.string().optional(),
  body_and_closing_text_help: z.string().optional(),
});

export type DunningLetterText = z.infer<typeof DunningLetterTextSchema>;

export const DunningLetterTextInsertSchema = DunningLetterTextSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DunningLetterTextInsert = z.infer<typeof DunningLetterTextInsertSchema>;

export const DunningTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  dunning_type: z.string(),
  is_default: z.boolean().optional().default(false),
  company: z.string(),
  dunning_fee: z.number().optional(),
  rate_of_interest: z.number().optional(),
  dunning_letter_text: z.array(z.unknown()).optional(),
  income_account: z.string().optional(),
  cost_center: z.string().optional(),
});

export type DunningType = z.infer<typeof DunningTypeSchema>;

export const DunningTypeInsertSchema = DunningTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DunningTypeInsert = z.infer<typeof DunningTypeInsertSchema>;

export const ExchangeRateRevaluationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  posting_date: z.string().default('Today'),
  rounding_loss_allowance: z.number().optional().default(0.05),
  company: z.string(),
  accounts: z.array(z.unknown()),
  gain_loss_unbooked: z.number().optional(),
  gain_loss_booked: z.number().optional(),
  total_gain_loss: z.number().optional(),
  amended_from: z.string().optional(),
});

export type ExchangeRateRevaluation = z.infer<typeof ExchangeRateRevaluationSchema>;

export const ExchangeRateRevaluationInsertSchema = ExchangeRateRevaluationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ExchangeRateRevaluationInsert = z.infer<typeof ExchangeRateRevaluationInsertSchema>;

export const ExchangeRateRevaluationAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account: z.string(),
  party_type: z.string().optional(),
  party: z.string().optional(),
  account_currency: z.string().optional(),
  balance_in_account_currency: z.number().optional(),
  new_balance_in_account_currency: z.number().optional(),
  current_exchange_rate: z.number().optional(),
  new_exchange_rate: z.number(),
  balance_in_base_currency: z.number().optional(),
  new_balance_in_base_currency: z.number().optional(),
  gain_loss: z.number().optional(),
  zero_balance: z.boolean().optional().default(false),
});

export type ExchangeRateRevaluationAccount = z.infer<typeof ExchangeRateRevaluationAccountSchema>;

export const ExchangeRateRevaluationAccountInsertSchema = ExchangeRateRevaluationAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ExchangeRateRevaluationAccountInsert = z.infer<typeof ExchangeRateRevaluationAccountInsertSchema>;

export const FinanceBookSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  finance_book_name: z.string().optional(),
});

export type FinanceBook = z.infer<typeof FinanceBookSchema>;

export const FinanceBookInsertSchema = FinanceBookSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type FinanceBookInsert = z.infer<typeof FinanceBookInsertSchema>;

export const FinancialReportRowSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  reference_code: z.string().optional(),
  display_name: z.string().optional(),
  indentation_level: z.number().int().optional(),
  data_source: z.enum(['Account Data', 'Calculated Amount', 'Custom API', 'Blank Line', 'Column Break', 'Section Break']).optional(),
  balance_type: z.enum(['Opening Balance', 'Closing Balance', 'Period Movement (Debits - Credits)']).optional(),
  fieldtype: z.enum(['Currency', 'Float', 'Int', 'Percent']).optional(),
  color: z.string().optional(),
  bold_text: z.boolean().optional().default(false),
  italic_text: z.boolean().optional().default(false),
  hidden_calculation: z.boolean().optional().default(false),
  hide_when_empty: z.boolean().optional().default(false),
  reverse_sign: z.boolean().optional().default(false),
  include_in_charts: z.boolean().optional().default(false),
  advanced_filtering: z.boolean().optional().default(false),
  filters_editor: z.string().optional(),
  calculation_formula: z.string().optional(),
  formula_description: z.string().optional(),
});

export type FinancialReportRow = z.infer<typeof FinancialReportRowSchema>;

export const FinancialReportRowInsertSchema = FinancialReportRowSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type FinancialReportRowInsert = z.infer<typeof FinancialReportRowInsertSchema>;

export const FinancialReportTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  template_name: z.string(),
  report_type: z.enum(['Profit and Loss Statement', 'Balance Sheet', 'Cash Flow', 'Custom Financial Statement']).optional(),
  module: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  rows: z.array(z.unknown()).optional(),
});

export type FinancialReportTemplate = z.infer<typeof FinancialReportTemplateSchema>;

export const FinancialReportTemplateInsertSchema = FinancialReportTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type FinancialReportTemplateInsert = z.infer<typeof FinancialReportTemplateInsertSchema>;

export const FiscalYearSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  year: z.string(),
  disabled: z.boolean().optional().default(false),
  is_short_year: z.boolean().optional().default(false),
  year_start_date: z.string(),
  year_end_date: z.string(),
  companies: z.array(z.unknown()).optional(),
  auto_created: z.boolean().optional().default(false),
});

export type FiscalYear = z.infer<typeof FiscalYearSchema>;

export const FiscalYearInsertSchema = FiscalYearSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type FiscalYearInsert = z.infer<typeof FiscalYearInsertSchema>;

export const FiscalYearCompanySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
});

export type FiscalYearCompany = z.infer<typeof FiscalYearCompanySchema>;

export const FiscalYearCompanyInsertSchema = FiscalYearCompanySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type FiscalYearCompanyInsert = z.infer<typeof FiscalYearCompanyInsertSchema>;

export const GlEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  posting_date: z.string().optional(),
  transaction_date: z.string().optional(),
  fiscal_year: z.string().optional(),
  due_date: z.string().optional(),
  account: z.string().optional(),
  account_currency: z.string().optional(),
  against: z.string().optional(),
  party_type: z.string().optional(),
  party: z.string().optional(),
  voucher_type: z.string().optional(),
  voucher_no: z.string().optional(),
  voucher_subtype: z.string().optional(),
  transaction_currency: z.string().optional(),
  against_voucher_type: z.string().optional(),
  against_voucher: z.string().optional(),
  voucher_detail_no: z.string().optional(),
  transaction_exchange_rate: z.number().optional(),
  reporting_currency_exchange_rate: z.number().optional(),
  debit_in_account_currency: z.number().optional(),
  debit: z.number().optional(),
  debit_in_transaction_currency: z.number().optional(),
  debit_in_reporting_currency: z.number().optional(),
  credit_in_account_currency: z.number().optional(),
  credit: z.number().optional(),
  credit_in_transaction_currency: z.number().optional(),
  credit_in_reporting_currency: z.number().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  finance_book: z.string().optional(),
  company: z.string().optional(),
  is_opening: z.enum(['No', 'Yes']).optional(),
  is_advance: z.enum(['No', 'Yes']).optional(),
  to_rename: z.boolean().optional().default(true),
  is_cancelled: z.boolean().optional().default(false),
  remarks: z.string().optional(),
});

export type GlEntry = z.infer<typeof GlEntrySchema>;

export const GlEntryInsertSchema = GlEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type GlEntryInsert = z.infer<typeof GlEntryInsertSchema>;

export const InvoiceDiscountingSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  posting_date: z.string().default('Today'),
  loan_start_date: z.string().optional(),
  loan_period: z.number().int().optional(),
  loan_end_date: z.string().optional(),
  status: z.enum(['Draft', 'Sanctioned', 'Disbursed', 'Settled', 'Cancelled']).optional(),
  company: z.string(),
  invoices: z.array(z.unknown()),
  total_amount: z.number().optional(),
  bank_charges: z.number().optional(),
  short_term_loan: z.string(),
  bank_account: z.string(),
  bank_charges_account: z.string(),
  accounts_receivable_credit: z.string(),
  accounts_receivable_discounted: z.string(),
  accounts_receivable_unpaid: z.string(),
  amended_from: z.string().optional(),
});

export type InvoiceDiscounting = z.infer<typeof InvoiceDiscountingSchema>;

export const InvoiceDiscountingInsertSchema = InvoiceDiscountingSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type InvoiceDiscountingInsert = z.infer<typeof InvoiceDiscountingInsertSchema>;

export const ItemTaxTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  title: z.string(),
  company: z.string(),
  disabled: z.boolean().optional().default(false),
  taxes: z.array(z.unknown()),
});

export type ItemTaxTemplate = z.infer<typeof ItemTaxTemplateSchema>;

export const ItemTaxTemplateInsertSchema = ItemTaxTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemTaxTemplateInsert = z.infer<typeof ItemTaxTemplateInsertSchema>;

export const ItemTaxTemplateDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  tax_type: z.string(),
  tax_rate: z.number().optional(),
});

export type ItemTaxTemplateDetail = z.infer<typeof ItemTaxTemplateDetailSchema>;

export const ItemTaxTemplateDetailInsertSchema = ItemTaxTemplateDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemTaxTemplateDetailInsert = z.infer<typeof ItemTaxTemplateDetailInsertSchema>;

export const ItemWiseTaxDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_row: z.string(),
  tax_row: z.string(),
  rate: z.number().optional(),
  amount: z.number().optional(),
  taxable_amount: z.number().optional(),
});

export type ItemWiseTaxDetail = z.infer<typeof ItemWiseTaxDetailSchema>;

export const ItemWiseTaxDetailInsertSchema = ItemWiseTaxDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemWiseTaxDetailInsert = z.infer<typeof ItemWiseTaxDetailInsertSchema>;

export const JournalEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string(),
  is_system_generated: z.boolean().optional().default(false),
  title: z.string().optional(),
  voucher_type: z.enum(['Journal Entry', 'Inter Company Journal Entry', 'Bank Entry', 'Cash Entry', 'Credit Card Entry', 'Debit Note', 'Credit Note', 'Contra Entry', 'Excise Entry', 'Write Off Entry', 'Opening Entry', 'Depreciation Entry', 'Asset Disposal', 'Periodic Accounting Entry', 'Exchange Rate Revaluation', 'Exchange Gain Or Loss', 'Deferred Revenue', 'Deferred Expense']).default('Journal Entry'),
  naming_series: z.enum(['ACC-JV-.YYYY.-']),
  process_deferred_accounting: z.string().optional(),
  reversal_of: z.string().optional(),
  from_template: z.string().optional(),
  posting_date: z.string(),
  finance_book: z.string().optional(),
  apply_tds: z.boolean().optional().default(false),
  tax_withholding_category: z.string().optional(),
  for_all_stock_asset_accounts: z.boolean().optional().default(true),
  stock_asset_account: z.string().optional(),
  periodic_entry_difference_account: z.string().optional(),
  accounts: z.array(z.unknown()),
  cheque_no: z.string().optional(),
  cheque_date: z.string().optional(),
  user_remark: z.string().optional(),
  total_debit: z.number().optional(),
  total_credit: z.number().optional(),
  difference: z.number().optional(),
  multi_currency: z.boolean().optional().default(false),
  total_amount_currency: z.string().optional(),
  total_amount: z.number().optional(),
  total_amount_in_words: z.string().optional(),
  tax_withholding_group: z.string().optional(),
  ignore_tax_withholding_threshold: z.boolean().optional().default(false),
  override_tax_withholding_entries: z.boolean().optional().default(false),
  tax_withholding_entries: z.array(z.unknown()).optional(),
  clearance_date: z.string().optional(),
  remark: z.string().optional(),
  inter_company_journal_entry_reference: z.string().optional(),
  bill_no: z.string().optional(),
  bill_date: z.string().optional(),
  due_date: z.string().optional(),
  write_off_based_on: z.enum(['Accounts Receivable', 'Accounts Payable']).optional().default('Accounts Receivable'),
  write_off_amount: z.number().optional(),
  pay_to_recd_from: z.string().optional(),
  letter_head: z.string().optional(),
  select_print_heading: z.string().optional(),
  mode_of_payment: z.string().optional(),
  payment_order: z.string().optional(),
  party_not_required: z.boolean().optional().default(false),
  is_opening: z.enum(['No', 'Yes']).optional().default('No'),
  stock_entry: z.string().optional(),
  auto_repeat: z.string().optional(),
  amended_from: z.string().optional(),
});

export type JournalEntry = z.infer<typeof JournalEntrySchema>;

export const JournalEntryInsertSchema = JournalEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type JournalEntryInsert = z.infer<typeof JournalEntryInsertSchema>;

export const JournalEntryAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account: z.string(),
  account_type: z.string().optional(),
  bank_account: z.string().optional(),
  party_type: z.string().optional(),
  party: z.string().optional(),
  cost_center: z.string().optional().default(':Company'),
  project: z.string().optional(),
  account_currency: z.string().optional(),
  exchange_rate: z.number().optional(),
  debit_in_account_currency: z.number().optional(),
  debit: z.number().optional(),
  credit_in_account_currency: z.number().optional(),
  credit: z.number().optional(),
  reference_type: z.enum(['Sales Invoice', 'Purchase Invoice', 'Journal Entry', 'Sales Order', 'Purchase Order', 'Expense Claim', 'Asset', 'Loan', 'Payroll Entry', 'Employee Advance', 'Exchange Rate Revaluation', 'Invoice Discounting', 'Fees', 'Full and Final Statement', 'Payment Entry']).optional(),
  reference_name: z.string().optional(),
  reference_due_date: z.string().optional(),
  reference_detail_no: z.string().optional(),
  advance_voucher_type: z.string().optional(),
  advance_voucher_no: z.string().optional(),
  is_tax_withholding_account: z.boolean().optional().default(false),
  is_advance: z.enum(['No', 'Yes']).optional(),
  user_remark: z.string().optional(),
  against_account: z.string().optional(),
});

export type JournalEntryAccount = z.infer<typeof JournalEntryAccountSchema>;

export const JournalEntryAccountInsertSchema = JournalEntryAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type JournalEntryAccountInsert = z.infer<typeof JournalEntryAccountInsertSchema>;

export const JournalEntryTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  template_title: z.string(),
  voucher_type: z.enum(['Journal Entry', 'Inter Company Journal Entry', 'Bank Entry', 'Cash Entry', 'Credit Card Entry', 'Debit Note', 'Credit Note', 'Contra Entry', 'Excise Entry', 'Write Off Entry', 'Opening Entry', 'Depreciation Entry', 'Exchange Rate Revaluation']),
  naming_series: z.string(),
  company: z.string(),
  is_opening: z.enum(['No', 'Yes']).optional().default('No'),
  multi_currency: z.boolean().optional().default(false),
  accounts: z.array(z.unknown()).optional(),
});

export type JournalEntryTemplate = z.infer<typeof JournalEntryTemplateSchema>;

export const JournalEntryTemplateInsertSchema = JournalEntryTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type JournalEntryTemplateInsert = z.infer<typeof JournalEntryTemplateInsertSchema>;

export const JournalEntryTemplateAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account: z.string(),
  party_type: z.string().optional(),
  party: z.string().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
});

export type JournalEntryTemplateAccount = z.infer<typeof JournalEntryTemplateAccountSchema>;

export const JournalEntryTemplateAccountInsertSchema = JournalEntryTemplateAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type JournalEntryTemplateAccountInsert = z.infer<typeof JournalEntryTemplateAccountInsertSchema>;

export const LedgerHealthSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  voucher_type: z.string().optional(),
  voucher_no: z.string().optional(),
  checked_on: z.string().optional(),
  debit_credit_mismatch: z.boolean().optional().default(false),
  general_and_payment_ledger_mismatch: z.boolean().optional().default(false),
});

export type LedgerHealth = z.infer<typeof LedgerHealthSchema>;

export const LedgerHealthInsertSchema = LedgerHealthSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LedgerHealthInsert = z.infer<typeof LedgerHealthInsertSchema>;

export const LedgerHealthMonitorSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  enable_health_monitor: z.boolean().optional().default(false),
  monitor_for_last_x_days: z.number().int().default(60),
  debit_credit_mismatch: z.boolean().optional().default(false),
  general_and_payment_ledger_mismatch: z.boolean().optional().default(false),
  companies: z.array(z.unknown()).optional(),
});

export type LedgerHealthMonitor = z.infer<typeof LedgerHealthMonitorSchema>;

export const LedgerHealthMonitorInsertSchema = LedgerHealthMonitorSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LedgerHealthMonitorInsert = z.infer<typeof LedgerHealthMonitorInsertSchema>;

export const LedgerHealthMonitorCompanySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
});

export type LedgerHealthMonitorCompany = z.infer<typeof LedgerHealthMonitorCompanySchema>;

export const LedgerHealthMonitorCompanyInsertSchema = LedgerHealthMonitorCompanySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LedgerHealthMonitorCompanyInsert = z.infer<typeof LedgerHealthMonitorCompanyInsertSchema>;

export const LedgerMergeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  root_type: z.enum(['Asset', 'Liability', 'Income', 'Expense', 'Equity']),
  account: z.string(),
  account_name: z.string(),
  company: z.string(),
  status: z.enum(['Pending', 'Success', 'Partial Success', 'Error']).optional(),
  is_group: z.boolean().optional().default(false),
  merge_accounts: z.array(z.unknown()),
});

export type LedgerMerge = z.infer<typeof LedgerMergeSchema>;

export const LedgerMergeInsertSchema = LedgerMergeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LedgerMergeInsert = z.infer<typeof LedgerMergeInsertSchema>;

export const LedgerMergeAccountsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account: z.string(),
  account_name: z.string(),
  merged: z.boolean().optional().default(false),
});

export type LedgerMergeAccounts = z.infer<typeof LedgerMergeAccountsSchema>;

export const LedgerMergeAccountsInsertSchema = LedgerMergeAccountsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LedgerMergeAccountsInsert = z.infer<typeof LedgerMergeAccountsInsertSchema>;

export const LoyaltyPointEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  loyalty_program: z.string(),
  loyalty_program_tier: z.string().optional(),
  customer: z.string(),
  invoice_type: z.string(),
  invoice: z.string().optional(),
  redeem_against: z.string().optional(),
  loyalty_points: z.number().int(),
  purchase_amount: z.number().optional(),
  expiry_date: z.string(),
  posting_date: z.string(),
  company: z.string(),
  discretionary_reason: z.string().optional(),
});

export type LoyaltyPointEntry = z.infer<typeof LoyaltyPointEntrySchema>;

export const LoyaltyPointEntryInsertSchema = LoyaltyPointEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LoyaltyPointEntryInsert = z.infer<typeof LoyaltyPointEntryInsertSchema>;

export const LoyaltyPointEntryRedemptionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  sales_invoice: z.string().optional(),
  redemption_date: z.string().optional(),
  redeemed_points: z.number().int().optional(),
});

export type LoyaltyPointEntryRedemption = z.infer<typeof LoyaltyPointEntryRedemptionSchema>;

export const LoyaltyPointEntryRedemptionInsertSchema = LoyaltyPointEntryRedemptionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LoyaltyPointEntryRedemptionInsert = z.infer<typeof LoyaltyPointEntryRedemptionInsertSchema>;

export const LoyaltyProgramSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  loyalty_program_name: z.string(),
  loyalty_program_type: z.enum(['Single Tier Program', 'Multiple Tier Program']).optional(),
  from_date: z.string(),
  to_date: z.string().optional(),
  customer_group: z.string().optional(),
  customer_territory: z.string().optional(),
  auto_opt_in: z.boolean().optional().default(false),
  collection_rules: z.array(z.unknown()),
  conversion_factor: z.number().optional(),
  expiry_duration: z.number().int().optional(),
  expense_account: z.string().optional(),
  company: z.string().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  loyalty_program_help: z.string().optional(),
});

export type LoyaltyProgram = z.infer<typeof LoyaltyProgramSchema>;

export const LoyaltyProgramInsertSchema = LoyaltyProgramSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LoyaltyProgramInsert = z.infer<typeof LoyaltyProgramInsertSchema>;

export const LoyaltyProgramCollectionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  tier_name: z.string(),
  min_spent: z.number().optional(),
  collection_factor: z.number(),
});

export type LoyaltyProgramCollection = z.infer<typeof LoyaltyProgramCollectionSchema>;

export const LoyaltyProgramCollectionInsertSchema = LoyaltyProgramCollectionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LoyaltyProgramCollectionInsert = z.infer<typeof LoyaltyProgramCollectionInsertSchema>;

export const ModeOfPaymentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  mode_of_payment: z.string(),
  enabled: z.boolean().optional().default(true),
  type: z.enum(['Cash', 'Bank', 'General', 'Phone']).optional(),
  accounts: z.array(z.unknown()).optional(),
});

export type ModeOfPayment = z.infer<typeof ModeOfPaymentSchema>;

export const ModeOfPaymentInsertSchema = ModeOfPaymentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ModeOfPaymentInsert = z.infer<typeof ModeOfPaymentInsertSchema>;

export const ModeOfPaymentAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  default_account: z.string().optional(),
});

export type ModeOfPaymentAccount = z.infer<typeof ModeOfPaymentAccountSchema>;

export const ModeOfPaymentAccountInsertSchema = ModeOfPaymentAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ModeOfPaymentAccountInsert = z.infer<typeof ModeOfPaymentAccountInsertSchema>;

export const MonthlyDistributionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  distribution_id: z.string(),
  fiscal_year: z.string().optional(),
  percentages: z.array(z.unknown()).optional(),
});

export type MonthlyDistribution = z.infer<typeof MonthlyDistributionSchema>;

export const MonthlyDistributionInsertSchema = MonthlyDistributionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MonthlyDistributionInsert = z.infer<typeof MonthlyDistributionInsertSchema>;

export const MonthlyDistributionPercentageSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  month: z.string(),
  percentage_allocation: z.number().optional(),
});

export type MonthlyDistributionPercentage = z.infer<typeof MonthlyDistributionPercentageSchema>;

export const MonthlyDistributionPercentageInsertSchema = MonthlyDistributionPercentageSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MonthlyDistributionPercentageInsert = z.infer<typeof MonthlyDistributionPercentageInsertSchema>;

export const OpeningInvoiceCreationToolSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
  create_missing_party: z.boolean().optional().default(false),
  invoice_type: z.enum(['Sales', 'Purchase']),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  invoices: z.array(z.unknown()),
});

export type OpeningInvoiceCreationTool = z.infer<typeof OpeningInvoiceCreationToolSchema>;

export const OpeningInvoiceCreationToolInsertSchema = OpeningInvoiceCreationToolSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type OpeningInvoiceCreationToolInsert = z.infer<typeof OpeningInvoiceCreationToolInsertSchema>;

export const OpeningInvoiceCreationToolItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  invoice_number: z.string().optional(),
  party_type: z.string().optional(),
  party: z.string(),
  temporary_opening_account: z.string().optional(),
  posting_date: z.string().optional().default('Today'),
  due_date: z.string().optional().default('Today'),
  supplier_invoice_date: z.string().optional(),
  item_name: z.string().optional().default('Opening Invoice Item'),
  outstanding_amount: z.number().default(0),
  qty: z.string().optional().default('1'),
  cost_center: z.string().optional(),
});

export type OpeningInvoiceCreationToolItem = z.infer<typeof OpeningInvoiceCreationToolItemSchema>;

export const OpeningInvoiceCreationToolItemInsertSchema = OpeningInvoiceCreationToolItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type OpeningInvoiceCreationToolItemInsert = z.infer<typeof OpeningInvoiceCreationToolItemInsertSchema>;

export const OverduePaymentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  sales_invoice: z.string(),
  payment_schedule: z.string().optional(),
  dunning_level: z.number().int().optional().default(1),
  payment_term: z.string().optional(),
  description: z.string().optional(),
  due_date: z.string().optional(),
  overdue_days: z.string().optional(),
  mode_of_payment: z.string().optional(),
  invoice_portion: z.number().optional(),
  payment_amount: z.number().optional(),
  outstanding: z.number().optional(),
  paid_amount: z.number().optional(),
  discounted_amount: z.number().optional().default(0),
  interest: z.number().optional(),
});

export type OverduePayment = z.infer<typeof OverduePaymentSchema>;

export const OverduePaymentInsertSchema = OverduePaymentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type OverduePaymentInsert = z.infer<typeof OverduePaymentInsertSchema>;

export const PosClosingEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  period_start_date: z.string(),
  period_end_date: z.string().default('Today'),
  posting_date: z.string().default('Today'),
  posting_time: z.string().default('Now'),
  pos_opening_entry: z.string(),
  status: z.enum(['Draft', 'Submitted', 'Queued', 'Failed', 'Cancelled']).optional().default('Draft'),
  company: z.string(),
  pos_profile: z.string(),
  user: z.string(),
  pos_invoices: z.array(z.unknown()).optional(),
  sales_invoices: z.array(z.unknown()).optional(),
  taxes: z.array(z.unknown()).optional(),
  total_quantity: z.number().optional(),
  net_total: z.number().optional().default(0),
  total_taxes_and_charges: z.number().optional(),
  grand_total: z.number().optional().default(0),
  payment_reconciliation: z.array(z.unknown()).optional(),
  error_message: z.string().optional(),
  amended_from: z.string().optional(),
});

export type PosClosingEntry = z.infer<typeof PosClosingEntrySchema>;

export const PosClosingEntryInsertSchema = PosClosingEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosClosingEntryInsert = z.infer<typeof PosClosingEntryInsertSchema>;

export const PosClosingEntryDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  mode_of_payment: z.string(),
  opening_amount: z.number(),
  expected_amount: z.number().optional(),
  closing_amount: z.number().default(0),
  difference: z.number().optional(),
});

export type PosClosingEntryDetail = z.infer<typeof PosClosingEntryDetailSchema>;

export const PosClosingEntryDetailInsertSchema = PosClosingEntryDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosClosingEntryDetailInsert = z.infer<typeof PosClosingEntryDetailInsertSchema>;

export const PosClosingEntryTaxesSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account_head: z.string().optional(),
  amount: z.number().optional(),
});

export type PosClosingEntryTaxes = z.infer<typeof PosClosingEntryTaxesSchema>;

export const PosClosingEntryTaxesInsertSchema = PosClosingEntryTaxesSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosClosingEntryTaxesInsert = z.infer<typeof PosClosingEntryTaxesInsertSchema>;

export const PosCustomerGroupSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  customer_group: z.string(),
});

export type PosCustomerGroup = z.infer<typeof PosCustomerGroupSchema>;

export const PosCustomerGroupInsertSchema = PosCustomerGroupSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosCustomerGroupInsert = z.infer<typeof PosCustomerGroupInsertSchema>;

export const PosFieldSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  fieldname: z.string().optional(),
  label: z.string().optional(),
  fieldtype: z.string().optional(),
  options: z.string().optional(),
  default_value: z.string().optional(),
  reqd: z.boolean().optional().default(false),
  read_only: z.boolean().optional().default(false),
});

export type PosField = z.infer<typeof PosFieldSchema>;

export const PosFieldInsertSchema = PosFieldSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosFieldInsert = z.infer<typeof PosFieldInsertSchema>;

export const PosInvoiceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['ACC-PSINV-.YYYY.-']),
  customer: z.string().optional(),
  customer_name: z.string().optional(),
  tax_id: z.string().optional(),
  pos_profile: z.string().optional(),
  consolidated_invoice: z.string().optional(),
  is_pos: z.boolean().default(true),
  is_return: z.boolean().optional().default(false),
  update_billed_amount_in_sales_order: z.boolean().optional().default(false),
  update_billed_amount_in_delivery_note: z.boolean().optional().default(true),
  company: z.string(),
  posting_date: z.string().default('Today'),
  posting_time: z.string().optional().default('Now'),
  set_posting_time: z.boolean().optional().default(false),
  due_date: z.string().optional(),
  amended_from: z.string().optional(),
  return_against: z.string().optional(),
  project: z.string().optional(),
  cost_center: z.string().optional(),
  currency: z.string(),
  conversion_rate: z.number(),
  selling_price_list: z.string(),
  price_list_currency: z.string(),
  plc_conversion_rate: z.number(),
  ignore_pricing_rule: z.boolean().optional().default(false),
  set_warehouse: z.string().optional(),
  update_stock: z.boolean().optional().default(false),
  scan_barcode: z.string().optional(),
  last_scanned_warehouse: z.string().optional(),
  items: z.array(z.unknown()),
  pricing_rules: z.array(z.unknown()).optional(),
  packed_items: z.array(z.unknown()).optional(),
  product_bundle_help: z.string().optional(),
  timesheets: z.array(z.unknown()).optional(),
  total_billing_amount: z.number().optional().default(0),
  total_qty: z.number().optional(),
  base_total: z.number().optional(),
  base_net_total: z.number(),
  total: z.number().optional(),
  net_total: z.number().optional(),
  total_net_weight: z.number().optional(),
  taxes_and_charges: z.string().optional(),
  shipping_rule: z.string().optional(),
  tax_category: z.string().optional(),
  taxes: z.array(z.unknown()).optional(),
  other_charges_calculation: z.string().optional(),
  item_wise_tax_details: z.array(z.unknown()).optional(),
  base_total_taxes_and_charges: z.number().optional(),
  total_taxes_and_charges: z.number().optional(),
  coupon_code: z.string().optional(),
  apply_discount_on: z.enum(['Grand Total', 'Net Total']).optional().default('Grand Total'),
  base_discount_amount: z.number().optional(),
  additional_discount_percentage: z.number().optional(),
  discount_amount: z.number().optional(),
  base_grand_total: z.number(),
  base_rounding_adjustment: z.number().optional(),
  base_rounded_total: z.number().optional(),
  base_in_words: z.string().optional(),
  grand_total: z.number(),
  rounding_adjustment: z.number().optional(),
  rounded_total: z.number().optional(),
  in_words: z.string().optional(),
  total_advance: z.number().optional(),
  outstanding_amount: z.number().optional(),
  cash_bank_account: z.string().optional(),
  payments: z.array(z.unknown()).optional(),
  base_paid_amount: z.number().optional(),
  paid_amount: z.number().optional(),
  base_change_amount: z.number().optional(),
  change_amount: z.number().optional(),
  account_for_change_amount: z.string().optional(),
  allocate_advances_automatically: z.boolean().optional().default(false),
  advances: z.array(z.unknown()).optional(),
  write_off_amount: z.number().optional(),
  base_write_off_amount: z.number().optional(),
  write_off_outstanding_amount_automatically: z.boolean().optional().default(false),
  write_off_account: z.string().optional(),
  write_off_cost_center: z.string().optional(),
  loyalty_points: z.number().int().optional(),
  loyalty_amount: z.number().optional(),
  redeem_loyalty_points: z.boolean().optional().default(false),
  loyalty_program: z.string().optional(),
  loyalty_redemption_account: z.string().optional(),
  loyalty_redemption_cost_center: z.string().optional(),
  customer_address: z.string().optional(),
  address_display: z.string().optional(),
  contact_person: z.string().optional(),
  contact_display: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().email().optional(),
  territory: z.string().optional(),
  shipping_address_name: z.string().optional(),
  shipping_address: z.string().optional(),
  company_address: z.string().optional(),
  company_address_display: z.string().optional(),
  company_contact_person: z.string().optional(),
  payment_terms_template: z.string().optional(),
  payment_schedule: z.array(z.unknown()).optional(),
  tc_name: z.string().optional(),
  terms: z.string().optional(),
  po_no: z.string().optional(),
  po_date: z.string().optional(),
  letter_head: z.string().optional(),
  group_same_items: z.boolean().optional().default(false),
  language: z.string().optional(),
  select_print_heading: z.string().optional(),
  inter_company_invoice_reference: z.string().optional(),
  customer_group: z.string().optional(),
  is_discounted: z.boolean().optional().default(false),
  utm_source: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_medium: z.string().optional(),
  status: z.enum(['Draft', 'Return', 'Credit Note Issued', 'Consolidated', 'Submitted', 'Paid', 'Partly Paid', 'Unpaid', 'Partly Paid and Discounted', 'Unpaid and Discounted', 'Overdue and Discounted', 'Overdue', 'Cancelled']).optional().default('Draft'),
  debit_to: z.string(),
  party_account_currency: z.string().optional(),
  is_opening: z.enum(['No', 'Yes']).optional().default('No'),
  remarks: z.string().optional(),
  sales_partner: z.string().optional(),
  amount_eligible_for_commission: z.number().optional(),
  commission_rate: z.number().optional(),
  total_commission: z.number().optional(),
  sales_team: z.array(z.unknown()).optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  auto_repeat: z.string().optional(),
  against_income_account: z.string().optional(),
});

export type PosInvoice = z.infer<typeof PosInvoiceSchema>;

export const PosInvoiceInsertSchema = PosInvoiceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosInvoiceInsert = z.infer<typeof PosInvoiceInsertSchema>;

export const PosInvoiceItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  barcode: z.string().optional(),
  has_item_scanned: z.boolean().optional().default(false),
  item_code: z.string().optional(),
  item_name: z.string(),
  customer_item_code: z.string().optional(),
  description: z.string().optional(),
  item_group: z.string().optional(),
  brand: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  qty: z.number().optional(),
  stock_uom: z.string().optional(),
  uom: z.string(),
  conversion_factor: z.number(),
  stock_qty: z.number().optional(),
  price_list_rate: z.number().optional(),
  base_price_list_rate: z.number().optional(),
  margin_type: z.enum(['Percentage', 'Amount']).optional(),
  margin_rate_or_amount: z.number().optional(),
  rate_with_margin: z.number().optional(),
  discount_percentage: z.number().optional(),
  discount_amount: z.number().optional(),
  distributed_discount_amount: z.number().optional(),
  base_rate_with_margin: z.number().optional(),
  rate: z.number(),
  amount: z.number(),
  item_tax_template: z.string().optional(),
  base_rate: z.number(),
  base_amount: z.number(),
  pricing_rules: z.string().optional(),
  is_free_item: z.boolean().optional().default(false),
  grant_commission: z.boolean().optional().default(false),
  net_rate: z.number().optional(),
  net_amount: z.number().optional(),
  base_net_rate: z.number().optional(),
  base_net_amount: z.number().optional(),
  delivered_by_supplier: z.boolean().optional().default(false),
  income_account: z.string(),
  is_fixed_asset: z.boolean().optional().default(false),
  asset: z.string().optional(),
  finance_book: z.string().optional(),
  expense_account: z.string().optional(),
  deferred_revenue_account: z.string().optional(),
  service_stop_date: z.string().optional(),
  enable_deferred_revenue: z.boolean().optional().default(false),
  service_start_date: z.string().optional(),
  service_end_date: z.string().optional(),
  weight_per_unit: z.number().optional(),
  total_weight: z.number().optional(),
  weight_uom: z.string().optional(),
  warehouse: z.string().optional(),
  target_warehouse: z.string().optional(),
  quality_inspection: z.string().optional(),
  serial_and_batch_bundle: z.string().optional(),
  use_serial_batch_fields: z.boolean().optional().default(false),
  allow_zero_valuation_rate: z.boolean().optional().default(false),
  item_tax_rate: z.string().optional(),
  actual_batch_qty: z.number().optional(),
  actual_qty: z.number().optional(),
  serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  sales_order: z.string().optional(),
  so_detail: z.string().optional(),
  pos_invoice_item: z.string().optional(),
  delivery_note: z.string().optional(),
  dn_detail: z.string().optional(),
  delivered_qty: z.number().optional(),
  cost_center: z.string().default(':Company'),
  project: z.string().optional(),
  page_break: z.boolean().optional().default(false),
});

export type PosInvoiceItem = z.infer<typeof PosInvoiceItemSchema>;

export const PosInvoiceItemInsertSchema = PosInvoiceItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosInvoiceItemInsert = z.infer<typeof PosInvoiceItemInsertSchema>;

export const PosInvoiceMergeLogSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string(),
  posting_date: z.string(),
  posting_time: z.string(),
  merge_invoices_based_on: z.enum(['Customer', 'Customer Group']),
  pos_closing_entry: z.string().optional(),
  customer: z.string(),
  customer_group: z.string().optional(),
  pos_invoices: z.array(z.unknown()),
  consolidated_invoice: z.string().optional(),
  consolidated_credit_note: z.string().optional(),
  amended_from: z.string().optional(),
});

export type PosInvoiceMergeLog = z.infer<typeof PosInvoiceMergeLogSchema>;

export const PosInvoiceMergeLogInsertSchema = PosInvoiceMergeLogSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosInvoiceMergeLogInsert = z.infer<typeof PosInvoiceMergeLogInsertSchema>;

export const PosInvoiceReferenceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  pos_invoice: z.string(),
  posting_date: z.string(),
  customer: z.string(),
  grand_total: z.number(),
  is_return: z.boolean().optional().default(false),
  return_against: z.string().optional(),
});

export type PosInvoiceReference = z.infer<typeof PosInvoiceReferenceSchema>;

export const PosInvoiceReferenceInsertSchema = PosInvoiceReferenceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosInvoiceReferenceInsert = z.infer<typeof PosInvoiceReferenceInsertSchema>;

export const PosItemGroupSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_group: z.string(),
});

export type PosItemGroup = z.infer<typeof PosItemGroupSchema>;

export const PosItemGroupInsertSchema = PosItemGroupSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosItemGroupInsert = z.infer<typeof PosItemGroupInsertSchema>;

export const PosOpeningEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  period_start_date: z.string(),
  period_end_date: z.string().optional(),
  status: z.enum(['Draft', 'Open', 'Closed', 'Cancelled']).optional().default('Draft'),
  posting_date: z.string().default('Today'),
  set_posting_date: z.boolean().optional().default(false),
  company: z.string(),
  pos_profile: z.string(),
  pos_closing_entry: z.string().optional(),
  user: z.string(),
  balance_details: z.array(z.unknown()),
  amended_from: z.string().optional(),
});

export type PosOpeningEntry = z.infer<typeof PosOpeningEntrySchema>;

export const PosOpeningEntryInsertSchema = PosOpeningEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosOpeningEntryInsert = z.infer<typeof PosOpeningEntryInsertSchema>;

export const PosOpeningEntryDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  mode_of_payment: z.string(),
  opening_amount: z.number().default(0),
});

export type PosOpeningEntryDetail = z.infer<typeof PosOpeningEntryDetailSchema>;

export const PosOpeningEntryDetailInsertSchema = PosOpeningEntryDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosOpeningEntryDetailInsert = z.infer<typeof PosOpeningEntryDetailInsertSchema>;

export const PosPaymentMethodSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  default: z.boolean().optional().default(false),
  allow_in_returns: z.boolean().optional().default(false),
  mode_of_payment: z.string(),
});

export type PosPaymentMethod = z.infer<typeof PosPaymentMethodSchema>;

export const PosPaymentMethodInsertSchema = PosPaymentMethodSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosPaymentMethodInsert = z.infer<typeof PosPaymentMethodInsertSchema>;

export const PosProfileSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
  customer: z.string().optional(),
  country: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  warehouse: z.string(),
  company_address: z.string().optional(),
  payments: z.array(z.unknown()),
  set_grand_total_to_default_mop: z.boolean().optional().default(true),
  currency: z.string(),
  selling_price_list: z.string().optional(),
  write_off_account: z.string(),
  write_off_cost_center: z.string(),
  write_off_limit: z.number().default(1),
  income_account: z.string().optional(),
  expense_account: z.string().optional(),
  taxes_and_charges: z.string().optional(),
  tax_category: z.string().optional(),
  account_for_change_amount: z.string().optional(),
  disable_rounded_total: z.boolean().optional().default(false),
  apply_discount_on: z.enum(['Grand Total', 'Net Total']).optional().default('Grand Total'),
  allow_partial_payment: z.boolean().optional().default(false),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  action_on_new_invoice: z.enum(['Always Ask', 'Save Changes and Load New Invoice', 'Discard Changes and Load New Invoice']).optional().default('Always Ask'),
  validate_stock_on_save: z.boolean().optional().default(false),
  update_stock: z.boolean().optional().default(true),
  ignore_pricing_rule: z.boolean().optional().default(false),
  print_receipt_on_order_complete: z.boolean().optional().default(false),
  hide_images: z.boolean().optional().default(false),
  hide_unavailable_items: z.boolean().optional().default(false),
  auto_add_item_to_cart: z.boolean().optional().default(false),
  allow_rate_change: z.boolean().optional().default(false),
  allow_discount_change: z.boolean().optional().default(false),
  allow_warehouse_change: z.boolean().optional().default(false),
  applicable_for_users: z.array(z.unknown()).optional(),
  item_groups: z.array(z.unknown()).optional(),
  customer_groups: z.array(z.unknown()).optional(),
  print_format: z.string().optional(),
  letter_head: z.string().optional(),
  tc_name: z.string().optional(),
  select_print_heading: z.string().optional(),
  utm_source: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_medium: z.string().optional(),
});

export type PosProfile = z.infer<typeof PosProfileSchema>;

export const PosProfileInsertSchema = PosProfileSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosProfileInsert = z.infer<typeof PosProfileInsertSchema>;

export const PosProfileUserSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  default: z.boolean().optional().default(false),
  user: z.string().optional(),
});

export type PosProfileUser = z.infer<typeof PosProfileUserSchema>;

export const PosProfileUserInsertSchema = PosProfileUserSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosProfileUserInsert = z.infer<typeof PosProfileUserInsertSchema>;

export const PosSearchFieldsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  field: z.string(),
  fieldname: z.string().optional(),
});

export type PosSearchFields = z.infer<typeof PosSearchFieldsSchema>;

export const PosSearchFieldsInsertSchema = PosSearchFieldsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosSearchFieldsInsert = z.infer<typeof PosSearchFieldsInsertSchema>;

export const PosSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  invoice_type: z.enum(['Sales Invoice', 'POS Invoice']).optional().default('Sales Invoice'),
  post_change_gl_entries: z.boolean().optional().default(false),
  invoice_fields: z.array(z.unknown()).optional(),
  pos_search_fields: z.array(z.unknown()).optional(),
});

export type PosSettings = z.infer<typeof PosSettingsSchema>;

export const PosSettingsInsertSchema = PosSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosSettingsInsert = z.infer<typeof PosSettingsInsertSchema>;

export const PsoaCostCenterSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  cost_center_name: z.string(),
});

export type PsoaCostCenter = z.infer<typeof PsoaCostCenterSchema>;

export const PsoaCostCenterInsertSchema = PsoaCostCenterSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PsoaCostCenterInsert = z.infer<typeof PsoaCostCenterInsertSchema>;

export const PsoaProjectSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  project_name: z.string().optional(),
});

export type PsoaProject = z.infer<typeof PsoaProjectSchema>;

export const PsoaProjectInsertSchema = PsoaProjectSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PsoaProjectInsert = z.infer<typeof PsoaProjectInsertSchema>;

export const PartyAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
  account: z.string().optional(),
  advance_account: z.string().optional(),
});

export type PartyAccount = z.infer<typeof PartyAccountSchema>;

export const PartyAccountInsertSchema = PartyAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PartyAccountInsert = z.infer<typeof PartyAccountInsertSchema>;

export const PartyLinkSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  primary_role: z.string(),
  secondary_role: z.string().optional(),
  primary_party: z.string().optional(),
  secondary_party: z.string().optional(),
});

export type PartyLink = z.infer<typeof PartyLinkSchema>;

export const PartyLinkInsertSchema = PartyLinkSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PartyLinkInsert = z.infer<typeof PartyLinkInsertSchema>;

export const PaymentEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['ACC-PAY-.YYYY.-']),
  payment_type: z.enum(['Receive', 'Pay', 'Internal Transfer']),
  payment_order_status: z.enum(['Initiated', 'Payment Ordered']).optional(),
  posting_date: z.string().default('Today'),
  company: z.string(),
  mode_of_payment: z.string().optional(),
  party_type: z.string().optional(),
  party: z.string().optional(),
  party_name: z.string().optional(),
  book_advance_payments_in_separate_party_account: z.boolean().optional().default(false),
  reconcile_on_advance_payment_date: z.boolean().optional().default(false),
  apply_tds: z.boolean().optional().default(false),
  tax_withholding_category: z.string().optional(),
  bank_account: z.string().optional(),
  party_bank_account: z.string().optional(),
  contact_person: z.string().optional(),
  contact_email: z.string().email().optional(),
  paid_from: z.string(),
  paid_from_account_type: z.string().optional(),
  paid_from_account_currency: z.string(),
  paid_to: z.string(),
  paid_to_account_type: z.string().optional(),
  paid_to_account_currency: z.string(),
  paid_amount: z.number(),
  paid_amount_after_tax: z.number().optional(),
  source_exchange_rate: z.number(),
  base_paid_amount: z.number(),
  base_paid_amount_after_tax: z.number().optional(),
  received_amount: z.number(),
  received_amount_after_tax: z.number().optional(),
  target_exchange_rate: z.number(),
  base_received_amount: z.number(),
  base_received_amount_after_tax: z.number().optional(),
  references: z.array(z.unknown()).optional(),
  total_allocated_amount: z.number().optional(),
  base_total_allocated_amount: z.number().optional(),
  unallocated_amount: z.number().optional(),
  difference_amount: z.number().optional(),
  purchase_taxes_and_charges_template: z.string().optional(),
  sales_taxes_and_charges_template: z.string().optional(),
  taxes: z.array(z.unknown()).optional(),
  base_total_taxes_and_charges: z.number().optional(),
  total_taxes_and_charges: z.number().optional(),
  deductions: z.array(z.unknown()).optional(),
  tax_withholding_group: z.string().optional(),
  ignore_tax_withholding_threshold: z.boolean().optional().default(false),
  override_tax_withholding_entries: z.boolean().optional().default(false),
  tax_withholding_entries: z.array(z.unknown()).optional(),
  reference_no: z.string().optional(),
  reference_date: z.string().optional(),
  clearance_date: z.string().optional(),
  project: z.string().optional(),
  cost_center: z.string().optional(),
  status: z.enum(['Draft', 'Submitted', 'Cancelled']).optional().default('Draft'),
  custom_remarks: z.boolean().optional().default(false),
  remarks: z.string().optional(),
  base_in_words: z.string().optional(),
  is_opening: z.enum(['No', 'Yes']).optional().default('No'),
  letter_head: z.string().optional(),
  print_heading: z.string().optional(),
  bank: z.string().optional(),
  bank_account_no: z.string().optional(),
  payment_order: z.string().optional(),
  in_words: z.string().optional(),
  auto_repeat: z.string().optional(),
  amended_from: z.string().optional(),
  title: z.string().optional(),
});

export type PaymentEntry = z.infer<typeof PaymentEntrySchema>;

export const PaymentEntryInsertSchema = PaymentEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentEntryInsert = z.infer<typeof PaymentEntryInsertSchema>;

export const PaymentEntryDeductionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account: z.string(),
  cost_center: z.string(),
  amount: z.number(),
  is_exchange_gain_loss: z.boolean().optional().default(false),
  description: z.string().optional(),
});

export type PaymentEntryDeduction = z.infer<typeof PaymentEntryDeductionSchema>;

export const PaymentEntryDeductionInsertSchema = PaymentEntryDeductionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentEntryDeductionInsert = z.infer<typeof PaymentEntryDeductionInsertSchema>;

export const PaymentEntryReferenceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  reference_doctype: z.string(),
  reference_name: z.string(),
  due_date: z.string().optional(),
  bill_no: z.string().optional(),
  payment_term: z.string().optional(),
  payment_term_outstanding: z.number().optional(),
  account_type: z.string().optional(),
  payment_type: z.string().optional(),
  reconcile_effect_on: z.string().optional(),
  total_amount: z.number().optional(),
  outstanding_amount: z.number().optional(),
  allocated_amount: z.number().optional(),
  exchange_rate: z.number().optional(),
  exchange_gain_loss: z.number().optional(),
  account: z.string().optional(),
  payment_request: z.string().optional(),
  payment_request_outstanding: z.number().optional(),
  advance_voucher_type: z.string().optional(),
  advance_voucher_no: z.string().optional(),
});

export type PaymentEntryReference = z.infer<typeof PaymentEntryReferenceSchema>;

export const PaymentEntryReferenceInsertSchema = PaymentEntryReferenceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentEntryReferenceInsert = z.infer<typeof PaymentEntryReferenceInsertSchema>;

export const PaymentGatewayAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  payment_gateway: z.string(),
  payment_channel: z.enum(['Email', 'Phone', 'Other']).optional().default('Email'),
  company: z.string(),
  is_default: z.boolean().optional().default(false),
  payment_account: z.string(),
  currency: z.string().optional(),
  message: z.string().optional().default('Please click on the link below to make your payment'),
  message_examples: z.string().optional(),
});

export type PaymentGatewayAccount = z.infer<typeof PaymentGatewayAccountSchema>;

export const PaymentGatewayAccountInsertSchema = PaymentGatewayAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentGatewayAccountInsert = z.infer<typeof PaymentGatewayAccountInsertSchema>;

export const PaymentLedgerEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  posting_date: z.string().optional(),
  company: z.string().optional(),
  account_type: z.enum(['Receivable', 'Payable']).optional(),
  account: z.string().optional(),
  party_type: z.string().optional(),
  party: z.string().optional(),
  due_date: z.string().optional(),
  voucher_detail_no: z.string().optional(),
  cost_center: z.string().optional(),
  finance_book: z.string().optional(),
  voucher_type: z.string().optional(),
  voucher_no: z.string().optional(),
  against_voucher_type: z.string().optional(),
  against_voucher_no: z.string().optional(),
  amount: z.number().optional(),
  account_currency: z.string().optional(),
  amount_in_account_currency: z.number().optional(),
  delinked: z.boolean().optional().default(false),
  remarks: z.string().optional(),
  project: z.string().optional(),
});

export type PaymentLedgerEntry = z.infer<typeof PaymentLedgerEntrySchema>;

export const PaymentLedgerEntryInsertSchema = PaymentLedgerEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentLedgerEntryInsert = z.infer<typeof PaymentLedgerEntryInsertSchema>;

export const PaymentOrderSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['PMO-']).default('PMO-'),
  company: z.string(),
  payment_order_type: z.enum(['Payment Request', 'Payment Entry']),
  party: z.string().optional(),
  posting_date: z.string().optional().default('Today'),
  company_bank: z.string().optional(),
  company_bank_account: z.string(),
  account: z.string().optional(),
  references: z.array(z.unknown()),
  amended_from: z.string().optional(),
});

export type PaymentOrder = z.infer<typeof PaymentOrderSchema>;

export const PaymentOrderInsertSchema = PaymentOrderSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentOrderInsert = z.infer<typeof PaymentOrderInsertSchema>;

export const PaymentOrderReferenceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  reference_doctype: z.string(),
  reference_name: z.string(),
  amount: z.number(),
  supplier: z.string().optional(),
  payment_request: z.string().optional(),
  mode_of_payment: z.string().optional(),
  bank_account: z.string(),
  account: z.string().optional(),
  payment_reference: z.string().optional(),
});

export type PaymentOrderReference = z.infer<typeof PaymentOrderReferenceSchema>;

export const PaymentOrderReferenceInsertSchema = PaymentOrderReferenceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentOrderReferenceInsert = z.infer<typeof PaymentOrderReferenceInsertSchema>;

export const PaymentReconciliationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
  party_type: z.string(),
  party: z.string(),
  receivable_payable_account: z.string(),
  default_advance_account: z.string().optional(),
  from_invoice_date: z.string().optional(),
  from_payment_date: z.string().optional(),
  minimum_invoice_amount: z.number().optional(),
  minimum_payment_amount: z.number().optional(),
  to_invoice_date: z.string().optional(),
  to_payment_date: z.string().optional(),
  maximum_invoice_amount: z.number().optional(),
  maximum_payment_amount: z.number().optional(),
  invoice_limit: z.number().int().optional().default(50),
  payment_limit: z.number().int().optional().default(50),
  bank_cash_account: z.string().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  invoice_name: z.string().optional(),
  invoices: z.array(z.unknown()).optional(),
  payment_name: z.string().optional(),
  payments: z.array(z.unknown()).optional(),
  allocation: z.array(z.unknown()).optional(),
});

export type PaymentReconciliation = z.infer<typeof PaymentReconciliationSchema>;

export const PaymentReconciliationInsertSchema = PaymentReconciliationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentReconciliationInsert = z.infer<typeof PaymentReconciliationInsertSchema>;

export const PaymentReconciliationAllocationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  reference_type: z.string(),
  reference_name: z.string(),
  reference_row: z.string().optional(),
  invoice_type: z.string(),
  invoice_number: z.string(),
  allocated_amount: z.number(),
  unreconciled_amount: z.number().optional(),
  amount: z.number().optional(),
  is_advance: z.string().optional(),
  difference_amount: z.number().optional(),
  gain_loss_posting_date: z.string().optional(),
  debit_or_credit_note_posting_date: z.string().optional(),
  difference_account: z.string().optional(),
  exchange_rate: z.number().optional(),
  currency: z.string().optional(),
  cost_center: z.string().optional(),
});

export type PaymentReconciliationAllocation = z.infer<typeof PaymentReconciliationAllocationSchema>;

export const PaymentReconciliationAllocationInsertSchema = PaymentReconciliationAllocationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentReconciliationAllocationInsert = z.infer<typeof PaymentReconciliationAllocationInsertSchema>;

export const PaymentReconciliationInvoiceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  invoice_type: z.enum(['Sales Invoice', 'Purchase Invoice', 'Journal Entry']).optional(),
  invoice_number: z.string().optional(),
  invoice_date: z.string().optional(),
  amount: z.number().optional(),
  outstanding_amount: z.number().optional(),
  currency: z.string().optional(),
  exchange_rate: z.number().optional(),
});

export type PaymentReconciliationInvoice = z.infer<typeof PaymentReconciliationInvoiceSchema>;

export const PaymentReconciliationInvoiceInsertSchema = PaymentReconciliationInvoiceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentReconciliationInvoiceInsert = z.infer<typeof PaymentReconciliationInvoiceInsertSchema>;

export const PaymentReconciliationPaymentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  reference_type: z.string().optional(),
  reference_name: z.string().optional(),
  posting_date: z.string().optional(),
  is_advance: z.string().optional(),
  reference_row: z.string().optional(),
  amount: z.number().optional(),
  difference_amount: z.number().optional(),
  remarks: z.string().optional(),
  currency: z.string().optional(),
  exchange_rate: z.number().optional(),
  cost_center: z.string().optional(),
});

export type PaymentReconciliationPayment = z.infer<typeof PaymentReconciliationPaymentSchema>;

export const PaymentReconciliationPaymentInsertSchema = PaymentReconciliationPaymentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentReconciliationPaymentInsert = z.infer<typeof PaymentReconciliationPaymentInsertSchema>;

export const PaymentRequestSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  payment_request_type: z.enum(['Outward', 'Inward']).default('Inward'),
  transaction_date: z.string().optional(),
  failed_reason: z.string().optional(),
  naming_series: z.enum(['ACC-PRQ-.YYYY.-']),
  company: z.string().optional(),
  mode_of_payment: z.string().optional(),
  party_type: z.string().optional(),
  party: z.string().optional(),
  party_name: z.string().optional(),
  reference_doctype: z.string().optional(),
  reference_name: z.string().optional(),
  grand_total: z.number(),
  currency: z.string().optional(),
  is_a_subscription: z.boolean().optional().default(false),
  outstanding_amount: z.number().optional(),
  party_account_currency: z.string().optional(),
  subscription_plans: z.array(z.unknown()).optional(),
  bank_account: z.string().optional(),
  bank: z.string().optional(),
  bank_account_no: z.string().optional(),
  account: z.string().optional(),
  iban: z.string().optional(),
  branch_code: z.string().optional(),
  swift_number: z.string().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  print_format: z.string().optional(),
  email_to: z.string().optional(),
  subject: z.string().optional(),
  payment_gateway_account: z.string().optional(),
  status: z.enum(['Draft', 'Requested', 'Initiated', 'Partially Paid', 'Payment Ordered', 'Paid', 'Failed', 'Cancelled']).optional().default('Draft'),
  make_sales_invoice: z.boolean().optional().default(false),
  message: z.string().optional(),
  message_examples: z.string().optional(),
  mute_email: z.boolean().optional().default(false),
  payment_gateway: z.string().optional(),
  payment_account: z.string().optional(),
  payment_channel: z.enum(['Email', 'Phone', 'Other']).optional(),
  payment_order: z.string().optional(),
  amended_from: z.string().optional(),
  payment_url: z.string().max(500).optional(),
  phone_number: z.string().optional(),
});

export type PaymentRequest = z.infer<typeof PaymentRequestSchema>;

export const PaymentRequestInsertSchema = PaymentRequestSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentRequestInsert = z.infer<typeof PaymentRequestInsertSchema>;

export const PaymentScheduleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  payment_term: z.string().optional(),
  description: z.string().optional(),
  due_date: z.string(),
  invoice_portion: z.number().optional(),
  mode_of_payment: z.string().optional(),
  due_date_based_on: z.enum(['Day(s) after invoice date', 'Day(s) after the end of the invoice month', 'Month(s) after the end of the invoice month']).optional(),
  credit_days: z.number().int().optional(),
  credit_months: z.number().int().optional(),
  discount_date: z.string().optional(),
  discount: z.number().optional(),
  discount_type: z.enum(['Percentage', 'Amount']).optional().default('Percentage'),
  discount_validity_based_on: z.enum(['Day(s) after invoice date', 'Day(s) after the end of the invoice month', 'Month(s) after the end of the invoice month']).optional(),
  discount_validity: z.number().int().optional(),
  payment_amount: z.number(),
  outstanding: z.number().optional(),
  paid_amount: z.number().optional(),
  discounted_amount: z.number().optional().default(0),
  base_payment_amount: z.number().optional(),
  base_outstanding: z.number().optional(),
  base_paid_amount: z.number().optional(),
});

export type PaymentSchedule = z.infer<typeof PaymentScheduleSchema>;

export const PaymentScheduleInsertSchema = PaymentScheduleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentScheduleInsert = z.infer<typeof PaymentScheduleInsertSchema>;

export const PaymentTermSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  payment_term_name: z.string().optional(),
  invoice_portion: z.number().optional(),
  mode_of_payment: z.string().optional(),
  due_date_based_on: z.enum(['Day(s) after invoice date', 'Day(s) after the end of the invoice month', 'Month(s) after the end of the invoice month']).optional(),
  credit_days: z.number().int().optional(),
  credit_months: z.number().int().optional(),
  discount_type: z.enum(['Percentage', 'Amount']).optional().default('Percentage'),
  discount: z.number().optional(),
  discount_validity_based_on: z.enum(['Day(s) after invoice date', 'Day(s) after the end of the invoice month', 'Month(s) after the end of the invoice month']).optional().default('Day(s) after invoice date'),
  discount_validity: z.number().int().optional(),
  description: z.string().optional(),
});

export type PaymentTerm = z.infer<typeof PaymentTermSchema>;

export const PaymentTermInsertSchema = PaymentTermSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentTermInsert = z.infer<typeof PaymentTermInsertSchema>;

export const PaymentTermsTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  template_name: z.string().optional(),
  allocate_payment_based_on_payment_terms: z.boolean().optional().default(false),
  terms: z.array(z.unknown()),
});

export type PaymentTermsTemplate = z.infer<typeof PaymentTermsTemplateSchema>;

export const PaymentTermsTemplateInsertSchema = PaymentTermsTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentTermsTemplateInsert = z.infer<typeof PaymentTermsTemplateInsertSchema>;

export const PaymentTermsTemplateDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  payment_term: z.string().optional(),
  description: z.string().optional(),
  invoice_portion: z.number(),
  mode_of_payment: z.string().optional(),
  due_date_based_on: z.enum(['Day(s) after invoice date', 'Day(s) after the end of the invoice month', 'Month(s) after the end of the invoice month']),
  credit_days: z.number().int().optional().default(0),
  credit_months: z.number().int().optional().default(0),
  discount_type: z.enum(['Percentage', 'Amount']).optional().default('Percentage'),
  discount: z.number().optional(),
  discount_validity_based_on: z.enum(['Day(s) after invoice date', 'Day(s) after the end of the invoice month', 'Month(s) after the end of the invoice month']).optional().default('Day(s) after invoice date'),
  discount_validity: z.number().int().optional(),
});

export type PaymentTermsTemplateDetail = z.infer<typeof PaymentTermsTemplateDetailSchema>;

export const PaymentTermsTemplateDetailInsertSchema = PaymentTermsTemplateDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentTermsTemplateDetailInsert = z.infer<typeof PaymentTermsTemplateDetailInsertSchema>;

export const PeggedCurrenciesSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  pegged_currency_item: z.array(z.unknown()).optional(),
});

export type PeggedCurrencies = z.infer<typeof PeggedCurrenciesSchema>;

export const PeggedCurrenciesInsertSchema = PeggedCurrenciesSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PeggedCurrenciesInsert = z.infer<typeof PeggedCurrenciesInsertSchema>;

export const PeggedCurrencyDetailsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  source_currency: z.string().optional(),
  pegged_against: z.string().optional(),
  pegged_exchange_rate: z.string().optional(),
});

export type PeggedCurrencyDetails = z.infer<typeof PeggedCurrencyDetailsSchema>;

export const PeggedCurrencyDetailsInsertSchema = PeggedCurrencyDetailsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PeggedCurrencyDetailsInsert = z.infer<typeof PeggedCurrencyDetailsInsertSchema>;

export const PeriodClosingVoucherSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  transaction_date: z.string().optional().default('Today'),
  company: z.string(),
  fiscal_year: z.string(),
  period_start_date: z.string(),
  period_end_date: z.string(),
  amended_from: z.string().optional(),
  closing_account_head: z.string(),
  gle_processing_status: z.enum(['In Progress', 'Completed', 'Failed']).optional(),
  remarks: z.string(),
  error_message: z.string().optional(),
});

export type PeriodClosingVoucher = z.infer<typeof PeriodClosingVoucherSchema>;

export const PeriodClosingVoucherInsertSchema = PeriodClosingVoucherSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PeriodClosingVoucherInsert = z.infer<typeof PeriodClosingVoucherInsertSchema>;

export const PricingRuleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  naming_series: z.enum(['PRLE-.####']).optional().default('PRLE-.####'),
  title: z.string(),
  disable: z.boolean().optional().default(false),
  apply_on: z.enum(['Item Code', 'Item Group', 'Brand', 'Transaction']).default('Item Code'),
  price_or_product_discount: z.enum(['Price', 'Product']),
  warehouse: z.string().optional(),
  items: z.array(z.unknown()).optional(),
  item_groups: z.array(z.unknown()).optional(),
  brands: z.array(z.unknown()).optional(),
  mixed_conditions: z.boolean().optional().default(false),
  is_cumulative: z.boolean().optional().default(false),
  coupon_code_based: z.boolean().optional().default(false),
  apply_rule_on_other: z.enum(['Item Code', 'Item Group', 'Brand']).optional(),
  other_item_code: z.string().optional(),
  other_item_group: z.string().optional(),
  other_brand: z.string().optional(),
  selling: z.boolean().optional().default(false),
  buying: z.boolean().optional().default(false),
  applicable_for: z.enum(['Customer', 'Customer Group', 'Territory', 'Sales Partner', 'Campaign', 'Supplier', 'Supplier Group']).optional(),
  customer: z.string().optional(),
  customer_group: z.string().optional(),
  territory: z.string().optional(),
  sales_partner: z.string().optional(),
  campaign: z.string().optional(),
  supplier: z.string().optional(),
  supplier_group: z.string().optional(),
  min_qty: z.number().optional(),
  max_qty: z.number().optional(),
  min_amt: z.number().optional().default(0),
  max_amt: z.number().optional().default(0),
  same_item: z.boolean().optional().default(false),
  free_item: z.string().optional(),
  free_qty: z.number().optional().default(0),
  free_item_rate: z.number().optional(),
  free_item_uom: z.string().optional(),
  round_free_qty: z.boolean().optional().default(false),
  dont_enforce_free_item_qty: z.boolean().optional().default(false),
  is_recursive: z.boolean().optional().default(false),
  recurse_for: z.number().optional(),
  apply_recursion_over: z.number().optional().default(0),
  valid_from: z.string().optional().default('Today'),
  valid_upto: z.string().optional(),
  company: z.string().optional(),
  currency: z.string(),
  margin_type: z.enum(['Percentage', 'Amount']).optional().default('Percentage'),
  margin_rate_or_amount: z.number().optional().default(0),
  rate_or_discount: z.enum(['Rate', 'Discount Percentage', 'Discount Amount']).optional().default('Discount Percentage'),
  apply_discount_on: z.enum(['Grand Total', 'Net Total']).optional().default('Grand Total'),
  rate: z.number().optional().default(0),
  discount_amount: z.number().optional().default(0),
  discount_percentage: z.number().optional(),
  for_price_list: z.string().optional(),
  condition: z.string().optional(),
  apply_multiple_pricing_rules: z.boolean().optional().default(false),
  apply_discount_on_rate: z.boolean().optional().default(false),
  threshold_percentage: z.number().optional(),
  validate_applied_rule: z.boolean().optional().default(false),
  rule_description: z.string().optional(),
  has_priority: z.boolean().optional().default(false),
  priority: z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']).optional(),
  pricing_rule_help: z.string().optional(),
  promotional_scheme_id: z.string().optional(),
  promotional_scheme: z.string().optional(),
});

export type PricingRule = z.infer<typeof PricingRuleSchema>;

export const PricingRuleInsertSchema = PricingRuleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PricingRuleInsert = z.infer<typeof PricingRuleInsertSchema>;

export const PricingRuleBrandSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  brand: z.string().optional(),
  uom: z.string().optional(),
});

export type PricingRuleBrand = z.infer<typeof PricingRuleBrandSchema>;

export const PricingRuleBrandInsertSchema = PricingRuleBrandSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PricingRuleBrandInsert = z.infer<typeof PricingRuleBrandInsertSchema>;

export const PricingRuleDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  pricing_rule: z.string().optional(),
  item_code: z.string().optional(),
  margin_type: z.string().optional(),
  rate_or_discount: z.string().optional(),
  child_docname: z.string().optional(),
  rule_applied: z.boolean().optional().default(true),
});

export type PricingRuleDetail = z.infer<typeof PricingRuleDetailSchema>;

export const PricingRuleDetailInsertSchema = PricingRuleDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PricingRuleDetailInsert = z.infer<typeof PricingRuleDetailInsertSchema>;

export const PricingRuleItemCodeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  uom: z.string().optional(),
});

export type PricingRuleItemCode = z.infer<typeof PricingRuleItemCodeSchema>;

export const PricingRuleItemCodeInsertSchema = PricingRuleItemCodeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PricingRuleItemCodeInsert = z.infer<typeof PricingRuleItemCodeInsertSchema>;

export const PricingRuleItemGroupSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_group: z.string().optional(),
  uom: z.string().optional(),
});

export type PricingRuleItemGroup = z.infer<typeof PricingRuleItemGroupSchema>;

export const PricingRuleItemGroupInsertSchema = PricingRuleItemGroupSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PricingRuleItemGroupInsert = z.infer<typeof PricingRuleItemGroupInsertSchema>;

export const ProcessDeferredAccountingSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string(),
  type: z.enum(['Income', 'Expense']),
  account: z.string().optional(),
  posting_date: z.string().default('Today'),
  start_date: z.string(),
  end_date: z.string(),
  amended_from: z.string().optional(),
});

export type ProcessDeferredAccounting = z.infer<typeof ProcessDeferredAccountingSchema>;

export const ProcessDeferredAccountingInsertSchema = ProcessDeferredAccountingSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProcessDeferredAccountingInsert = z.infer<typeof ProcessDeferredAccountingInsertSchema>;

export const ProcessPaymentReconciliationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string(),
  party_type: z.string(),
  party: z.string(),
  receivable_payable_account: z.string(),
  default_advance_account: z.string().optional(),
  from_invoice_date: z.string().optional(),
  to_invoice_date: z.string().optional(),
  from_payment_date: z.string().optional(),
  to_payment_date: z.string().optional(),
  cost_center: z.string().optional(),
  bank_cash_account: z.string().optional(),
  status: z.enum(['Queued', 'Running', 'Paused', 'Completed', 'Partially Reconciled', 'Failed', 'Cancelled']).optional(),
  error_log: z.string().optional(),
  amended_from: z.string().optional(),
});

export type ProcessPaymentReconciliation = z.infer<typeof ProcessPaymentReconciliationSchema>;

export const ProcessPaymentReconciliationInsertSchema = ProcessPaymentReconciliationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProcessPaymentReconciliationInsert = z.infer<typeof ProcessPaymentReconciliationInsertSchema>;

export const ProcessPaymentReconciliationLogSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  process_pr: z.string(),
  status: z.enum(['Running', 'Paused', 'Reconciled', 'Partially Reconciled', 'Failed', 'Cancelled']).optional(),
  allocated: z.boolean().optional().default(false),
  reconciled: z.boolean().optional().default(false),
  total_allocations: z.number().int().optional(),
  reconciled_entries: z.number().int().optional(),
  error_log: z.string().optional(),
  allocations: z.array(z.unknown()).optional(),
});

export type ProcessPaymentReconciliationLog = z.infer<typeof ProcessPaymentReconciliationLogSchema>;

export const ProcessPaymentReconciliationLogInsertSchema = ProcessPaymentReconciliationLogSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProcessPaymentReconciliationLogInsert = z.infer<typeof ProcessPaymentReconciliationLogInsertSchema>;

export const ProcessPaymentReconciliationLogAllocationsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  reference_type: z.string(),
  reference_name: z.string(),
  reference_row: z.string().optional(),
  invoice_type: z.string(),
  invoice_number: z.string(),
  allocated_amount: z.number(),
  unreconciled_amount: z.number().optional(),
  amount: z.number().optional(),
  is_advance: z.string().optional(),
  difference_amount: z.number().optional(),
  gain_loss_posting_date: z.string().optional(),
  difference_account: z.string().optional(),
  exchange_rate: z.number().optional(),
  currency: z.string().optional(),
  reconciled: z.boolean().optional().default(false),
});

export type ProcessPaymentReconciliationLogAllocations = z.infer<typeof ProcessPaymentReconciliationLogAllocationsSchema>;

export const ProcessPaymentReconciliationLogAllocationsInsertSchema = ProcessPaymentReconciliationLogAllocationsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProcessPaymentReconciliationLogAllocationsInsert = z.infer<typeof ProcessPaymentReconciliationLogAllocationsInsertSchema>;

export const ProcessPeriodClosingVoucherSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  parent_pcv: z.string(),
  status: z.enum(['Queued', 'Running', 'Paused', 'Completed', 'Cancelled']).optional().default('Queued'),
  p_l_closing_balance: z.unknown().optional(),
  normal_balances: z.array(z.unknown()).optional(),
  bs_closing_balance: z.unknown().optional(),
  z_opening_balances: z.array(z.unknown()).optional(),
  amended_from: z.string().optional(),
});

export type ProcessPeriodClosingVoucher = z.infer<typeof ProcessPeriodClosingVoucherSchema>;

export const ProcessPeriodClosingVoucherInsertSchema = ProcessPeriodClosingVoucherSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProcessPeriodClosingVoucherInsert = z.infer<typeof ProcessPeriodClosingVoucherInsertSchema>;

export const ProcessPeriodClosingVoucherDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  processing_date: z.string().optional(),
  report_type: z.enum(['Profit and Loss', 'Balance Sheet']).optional().default('Profit and Loss'),
  status: z.enum(['Queued', 'Running', 'Paused', 'Completed', 'Cancelled']).optional().default('Queued'),
  closing_balance: z.unknown().optional(),
});

export type ProcessPeriodClosingVoucherDetail = z.infer<typeof ProcessPeriodClosingVoucherDetailSchema>;

export const ProcessPeriodClosingVoucherDetailInsertSchema = ProcessPeriodClosingVoucherDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProcessPeriodClosingVoucherDetailInsert = z.infer<typeof ProcessPeriodClosingVoucherDetailInsertSchema>;

export const ProcessStatementOfAccountsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  report: z.enum(['General Ledger', 'Accounts Receivable']),
  from_date: z.string().optional(),
  posting_date: z.string().optional().default('Today'),
  company: z.string(),
  account: z.string().optional(),
  categorize_by: z.enum(['Categorize by Voucher', 'Categorize by Voucher (Consolidated)']).optional().default('Categorize by Voucher (Consolidated)'),
  cost_center: z.array(z.unknown()).optional(),
  territory: z.string().optional(),
  ignore_exchange_rate_revaluation_journals: z.boolean().optional().default(false),
  ignore_cr_dr_notes: z.boolean().optional().default(false),
  to_date: z.string().optional(),
  finance_book: z.string().optional(),
  currency: z.string().optional(),
  project: z.array(z.unknown()).optional(),
  payment_terms_template: z.string().optional(),
  sales_partner: z.string().optional(),
  sales_person: z.string().optional(),
  show_remarks: z.boolean().optional().default(false),
  based_on_payment_terms: z.boolean().optional().default(false),
  show_future_payments: z.boolean().optional().default(false),
  customer_collection: z.enum(['Customer Group', 'Territory', 'Sales Partner', 'Sales Person']).optional(),
  collection_name: z.string().optional(),
  primary_mandatory: z.boolean().optional().default(true),
  show_net_values_in_party_account: z.boolean().optional().default(false),
  customers: z.array(z.unknown()),
  print_format: z.string().optional(),
  orientation: z.enum(['Landscape', 'Portrait']).optional(),
  include_break: z.boolean().optional().default(true),
  include_ageing: z.boolean().optional().default(false),
  ageing_based_on: z.enum(['Due Date', 'Posting Date']).optional().default('Due Date'),
  letter_head: z.string().optional(),
  terms_and_conditions: z.string().optional(),
  enable_auto_email: z.boolean().optional().default(false),
  sender: z.string().optional(),
  frequency: z.enum(['Daily', 'Weekly', 'Biweekly', 'Monthly', 'Quarterly']).optional(),
  filter_duration: z.number().int().optional().default(1),
  start_date: z.string().optional().default('Today'),
  pdf_name: z.string().optional(),
  subject: z.string().optional(),
  cc_to: z.array(z.unknown()).optional(),
  body: z.string().optional(),
  help_text: z.string().optional(),
});

export type ProcessStatementOfAccounts = z.infer<typeof ProcessStatementOfAccountsSchema>;

export const ProcessStatementOfAccountsInsertSchema = ProcessStatementOfAccountsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProcessStatementOfAccountsInsert = z.infer<typeof ProcessStatementOfAccountsInsertSchema>;

export const ProcessStatementOfAccountsCcSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  cc: z.string().optional(),
});

export type ProcessStatementOfAccountsCc = z.infer<typeof ProcessStatementOfAccountsCcSchema>;

export const ProcessStatementOfAccountsCcInsertSchema = ProcessStatementOfAccountsCcSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProcessStatementOfAccountsCcInsert = z.infer<typeof ProcessStatementOfAccountsCcInsertSchema>;

export const ProcessStatementOfAccountsCustomerSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  customer: z.string(),
  customer_name: z.string().optional(),
  billing_email: z.string().optional(),
  primary_email: z.string().optional(),
});

export type ProcessStatementOfAccountsCustomer = z.infer<typeof ProcessStatementOfAccountsCustomerSchema>;

export const ProcessStatementOfAccountsCustomerInsertSchema = ProcessStatementOfAccountsCustomerSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProcessStatementOfAccountsCustomerInsert = z.infer<typeof ProcessStatementOfAccountsCustomerInsertSchema>;

export const ProcessSubscriptionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  posting_date: z.string(),
  subscription: z.string().optional(),
  amended_from: z.string().optional(),
});

export type ProcessSubscription = z.infer<typeof ProcessSubscriptionSchema>;

export const ProcessSubscriptionInsertSchema = ProcessSubscriptionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProcessSubscriptionInsert = z.infer<typeof ProcessSubscriptionInsertSchema>;

export const PromotionalSchemeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  apply_on: z.enum(['Item Code', 'Item Group', 'Brand', 'Transaction']).default('Item Code'),
  disable: z.boolean().optional().default(false),
  items: z.array(z.unknown()).optional(),
  item_groups: z.array(z.unknown()).optional(),
  brands: z.array(z.unknown()).optional(),
  mixed_conditions: z.boolean().optional().default(false),
  is_cumulative: z.boolean().optional().default(false),
  apply_rule_on_other: z.enum(['Item Code', 'Item Group', 'Brand']).optional(),
  other_item_code: z.string().optional(),
  other_item_group: z.string().optional(),
  other_brand: z.string().optional(),
  selling: z.boolean().optional().default(false),
  buying: z.boolean().optional().default(false),
  applicable_for: z.enum(['Customer', 'Customer Group', 'Territory', 'Sales Partner', 'Campaign', 'Supplier', 'Supplier Group']).optional(),
  customer: z.array(z.unknown()).optional(),
  customer_group: z.array(z.unknown()).optional(),
  territory: z.array(z.unknown()).optional(),
  sales_partner: z.array(z.unknown()).optional(),
  campaign: z.array(z.unknown()).optional(),
  supplier: z.array(z.unknown()).optional(),
  supplier_group: z.array(z.unknown()).optional(),
  valid_from: z.string().optional().default('Today'),
  valid_upto: z.string().optional(),
  company: z.string(),
  currency: z.string().optional(),
  price_discount_slabs: z.array(z.unknown()).optional(),
  product_discount_slabs: z.array(z.unknown()).optional(),
});

export type PromotionalScheme = z.infer<typeof PromotionalSchemeSchema>;

export const PromotionalSchemeInsertSchema = PromotionalSchemeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PromotionalSchemeInsert = z.infer<typeof PromotionalSchemeInsertSchema>;

export const PromotionalSchemePriceDiscountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  disable: z.boolean().optional().default(false),
  apply_multiple_pricing_rules: z.boolean().optional().default(false),
  rule_description: z.string(),
  min_qty: z.number().optional().default(0),
  max_qty: z.number().optional().default(0),
  min_amount: z.number().optional().default(0),
  max_amount: z.number().optional().default(0),
  rate_or_discount: z.enum(['Rate', 'Discount Percentage', 'Discount Amount']).optional().default('Discount Percentage'),
  rate: z.number().optional(),
  discount_amount: z.number().optional(),
  discount_percentage: z.number().optional(),
  for_price_list: z.string().optional(),
  warehouse: z.string().optional(),
  threshold_percentage: z.number().optional(),
  validate_applied_rule: z.boolean().optional().default(false),
  priority: z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']).optional(),
  apply_discount_on_rate: z.boolean().optional().default(false),
});

export type PromotionalSchemePriceDiscount = z.infer<typeof PromotionalSchemePriceDiscountSchema>;

export const PromotionalSchemePriceDiscountInsertSchema = PromotionalSchemePriceDiscountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PromotionalSchemePriceDiscountInsert = z.infer<typeof PromotionalSchemePriceDiscountInsertSchema>;

export const PromotionalSchemeProductDiscountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  disable: z.boolean().optional().default(false),
  apply_multiple_pricing_rules: z.boolean().optional().default(false),
  rule_description: z.string(),
  min_qty: z.number().optional().default(0),
  max_qty: z.number().optional().default(0),
  min_amount: z.number().optional().default(0),
  max_amount: z.number().optional().default(0),
  same_item: z.boolean().optional().default(false),
  free_item: z.string().optional(),
  free_qty: z.number().optional(),
  free_item_uom: z.string().optional(),
  free_item_rate: z.number().optional(),
  round_free_qty: z.boolean().optional().default(false),
  warehouse: z.string().optional(),
  threshold_percentage: z.number().optional(),
  priority: z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']).optional(),
  is_recursive: z.boolean().optional().default(false),
  recurse_for: z.number().optional().default(0),
  apply_recursion_over: z.number().optional().default(0),
});

export type PromotionalSchemeProductDiscount = z.infer<typeof PromotionalSchemeProductDiscountSchema>;

export const PromotionalSchemeProductDiscountInsertSchema = PromotionalSchemeProductDiscountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PromotionalSchemeProductDiscountInsert = z.infer<typeof PromotionalSchemeProductDiscountInsertSchema>;

export const PurchaseInvoiceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  title: z.string().optional().default('{supplier_name}'),
  naming_series: z.enum(['ACC-PINV-.YYYY.-', 'ACC-PINV-RET-.YYYY.-']),
  supplier: z.string(),
  supplier_name: z.string().optional(),
  tax_id: z.string().optional(),
  company: z.string().optional(),
  posting_date: z.string().default('Today'),
  posting_time: z.string().optional().default('Now'),
  set_posting_time: z.boolean().optional().default(false),
  due_date: z.string().optional(),
  is_paid: z.boolean().optional().default(false),
  is_return: z.boolean().optional().default(false),
  return_against: z.string().optional(),
  update_outstanding_for_self: z.boolean().optional().default(true),
  update_billed_amount_in_purchase_order: z.boolean().optional().default(false),
  update_billed_amount_in_purchase_receipt: z.boolean().optional().default(true),
  apply_tds: z.boolean().optional().default(false),
  amended_from: z.string().optional(),
  bill_no: z.string().optional(),
  bill_date: z.string().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  currency: z.string().optional(),
  conversion_rate: z.number().optional(),
  use_transaction_date_exchange_rate: z.boolean().optional().default(false),
  buying_price_list: z.string().optional(),
  price_list_currency: z.string().optional(),
  plc_conversion_rate: z.number().optional(),
  ignore_pricing_rule: z.boolean().optional().default(false),
  scan_barcode: z.string().optional(),
  last_scanned_warehouse: z.string().optional(),
  update_stock: z.boolean().optional().default(false),
  set_warehouse: z.string().optional(),
  set_from_warehouse: z.string().optional(),
  is_subcontracted: z.boolean().optional().default(false),
  rejected_warehouse: z.string().optional(),
  supplier_warehouse: z.string().optional(),
  items: z.array(z.unknown()),
  total_qty: z.number().optional(),
  total_net_weight: z.number().optional(),
  base_total: z.number().optional(),
  base_net_total: z.number().optional(),
  claimed_landed_cost_amount: z.number().optional(),
  total: z.number().optional(),
  net_total: z.number().optional(),
  tax_category: z.string().optional(),
  taxes_and_charges: z.string().optional(),
  shipping_rule: z.string().optional(),
  incoterm: z.string().optional(),
  named_place: z.string().optional(),
  taxes: z.array(z.unknown()).optional(),
  base_taxes_and_charges_added: z.number().optional(),
  base_taxes_and_charges_deducted: z.number().optional(),
  base_total_taxes_and_charges: z.number().optional(),
  taxes_and_charges_added: z.number().optional(),
  taxes_and_charges_deducted: z.number().optional(),
  total_taxes_and_charges: z.number().optional(),
  grand_total: z.number().optional(),
  disable_rounded_total: z.boolean().optional().default(false),
  rounding_adjustment: z.number().optional(),
  use_company_roundoff_cost_center: z.boolean().optional().default(false),
  in_words: z.string().max(240).optional(),
  rounded_total: z.number().optional(),
  base_grand_total: z.number().optional(),
  base_rounding_adjustment: z.number().optional(),
  base_in_words: z.string().max(240).optional(),
  base_rounded_total: z.number().optional(),
  total_advance: z.number().optional(),
  outstanding_amount: z.number().optional(),
  tax_withholding_group: z.string().optional(),
  ignore_tax_withholding_threshold: z.boolean().optional().default(false),
  override_tax_withholding_entries: z.boolean().optional().default(false),
  tax_withholding_entries: z.array(z.unknown()).optional(),
  apply_discount_on: z.enum(['Grand Total', 'Net Total']).optional().default('Grand Total'),
  base_discount_amount: z.number().optional(),
  additional_discount_percentage: z.number().optional(),
  discount_amount: z.number().optional(),
  other_charges_calculation: z.string().optional(),
  item_wise_tax_details: z.array(z.unknown()).optional(),
  pricing_rules: z.array(z.unknown()).optional(),
  supplied_items: z.array(z.unknown()).optional(),
  mode_of_payment: z.string().optional(),
  base_paid_amount: z.number().optional(),
  clearance_date: z.string().optional(),
  cash_bank_account: z.string().optional(),
  paid_amount: z.number().optional(),
  allocate_advances_automatically: z.boolean().optional().default(false),
  only_include_allocated_payments: z.boolean().optional().default(false),
  advances: z.array(z.unknown()).optional(),
  write_off_amount: z.number().optional(),
  base_write_off_amount: z.number().optional(),
  write_off_account: z.string().optional(),
  write_off_cost_center: z.string().optional(),
  supplier_address: z.string().optional(),
  address_display: z.string().optional(),
  contact_person: z.string().optional(),
  contact_display: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().optional(),
  dispatch_address: z.string().optional(),
  dispatch_address_display: z.string().optional(),
  shipping_address: z.string().optional(),
  shipping_address_display: z.string().optional(),
  billing_address: z.string().optional(),
  billing_address_display: z.string().optional(),
  payment_terms_template: z.string().optional(),
  ignore_default_payment_terms_template: z.boolean().optional().default(false),
  payment_schedule: z.array(z.unknown()).optional(),
  tc_name: z.string().optional(),
  terms: z.string().optional(),
  status: z.enum(['Draft', 'Return', 'Debit Note Issued', 'Submitted', 'Paid', 'Partly Paid', 'Unpaid', 'Overdue', 'Cancelled', 'Internal Transfer']).optional().default('Draft'),
  per_received: z.number().optional(),
  credit_to: z.string(),
  party_account_currency: z.string().optional(),
  is_opening: z.enum(['No', 'Yes']).optional().default('No'),
  against_expense_account: z.string().optional(),
  unrealized_profit_loss_account: z.string().optional(),
  subscription: z.string().optional(),
  auto_repeat: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  letter_head: z.string().optional(),
  group_same_items: z.boolean().optional().default(false),
  select_print_heading: z.string().optional(),
  language: z.string().optional(),
  on_hold: z.boolean().optional().default(false),
  release_date: z.string().optional(),
  hold_comment: z.string().optional(),
  is_internal_supplier: z.boolean().optional().default(false),
  represents_company: z.string().optional(),
  supplier_group: z.string().optional(),
  sender: z.string().email().optional(),
  inter_company_invoice_reference: z.string().optional(),
  is_old_subcontracting_flow: z.boolean().optional().default(false),
  remarks: z.string().optional(),
});

export type PurchaseInvoice = z.infer<typeof PurchaseInvoiceSchema>;

export const PurchaseInvoiceInsertSchema = PurchaseInvoiceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PurchaseInvoiceInsert = z.infer<typeof PurchaseInvoiceInsertSchema>;

export const PurchaseInvoiceAdvanceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  reference_type: z.string().optional(),
  reference_name: z.string().optional(),
  remarks: z.string().optional(),
  reference_row: z.string().optional(),
  advance_amount: z.number().optional(),
  allocated_amount: z.number().optional(),
  exchange_gain_loss: z.number().optional(),
  ref_exchange_rate: z.number().optional(),
  difference_posting_date: z.string().optional(),
});

export type PurchaseInvoiceAdvance = z.infer<typeof PurchaseInvoiceAdvanceSchema>;

export const PurchaseInvoiceAdvanceInsertSchema = PurchaseInvoiceAdvanceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PurchaseInvoiceAdvanceInsert = z.infer<typeof PurchaseInvoiceAdvanceInsertSchema>;

export const PurchaseInvoiceItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  product_bundle: z.string().optional(),
  item_name: z.string(),
  description: z.string().optional(),
  brand: z.string().optional(),
  item_group: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  received_qty: z.number().optional(),
  qty: z.number(),
  rejected_qty: z.number().optional(),
  uom: z.string(),
  conversion_factor: z.number(),
  stock_uom: z.string().optional(),
  stock_qty: z.number(),
  price_list_rate: z.number().optional(),
  base_price_list_rate: z.number().optional(),
  margin_type: z.enum(['Percentage', 'Amount']).optional(),
  margin_rate_or_amount: z.number().optional(),
  rate_with_margin: z.number().optional(),
  discount_percentage: z.number().optional(),
  discount_amount: z.number().optional(),
  distributed_discount_amount: z.number().optional(),
  base_rate_with_margin: z.number().optional(),
  rate: z.number(),
  amount: z.number(),
  item_tax_template: z.string().optional(),
  tax_withholding_category: z.string().optional(),
  base_rate: z.number(),
  base_amount: z.number(),
  pricing_rules: z.string().optional(),
  stock_uom_rate: z.number().optional(),
  is_free_item: z.boolean().optional().default(false),
  apply_tds: z.boolean().optional().default(true),
  net_rate: z.number().optional(),
  net_amount: z.number().optional(),
  base_net_rate: z.number().optional(),
  base_net_amount: z.number().optional(),
  valuation_rate: z.number().optional(),
  sales_incoming_rate: z.number().optional(),
  item_tax_amount: z.number().optional(),
  landed_cost_voucher_amount: z.number().optional(),
  rm_supp_cost: z.number().optional(),
  warehouse: z.string().optional(),
  serial_and_batch_bundle: z.string().optional(),
  use_serial_batch_fields: z.boolean().optional().default(false),
  from_warehouse: z.string().optional(),
  quality_inspection: z.string().optional(),
  rejected_warehouse: z.string().optional(),
  rejected_serial_and_batch_bundle: z.string().optional(),
  serial_no: z.string().optional(),
  rejected_serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  manufacturer: z.string().optional(),
  manufacturer_part_no: z.string().optional(),
  expense_account: z.string().optional(),
  wip_composite_asset: z.string().optional(),
  is_fixed_asset: z.boolean().optional().default(false),
  asset_location: z.string().optional(),
  asset_category: z.string().optional(),
  deferred_expense_account: z.string().optional(),
  service_stop_date: z.string().optional(),
  enable_deferred_expense: z.boolean().optional().default(false),
  service_start_date: z.string().optional(),
  service_end_date: z.string().optional(),
  allow_zero_valuation_rate: z.boolean().optional().default(false),
  item_tax_rate: z.string().optional(),
  bom: z.string().optional(),
  include_exploded_items: z.boolean().optional().default(false),
  purchase_invoice_item: z.string().optional(),
  purchase_order: z.string().optional(),
  po_detail: z.string().optional(),
  purchase_receipt: z.string().optional(),
  pr_detail: z.string().optional(),
  sales_invoice_item: z.string().optional(),
  material_request: z.string().optional(),
  material_request_item: z.string().optional(),
  weight_per_unit: z.number().optional(),
  total_weight: z.number().optional(),
  weight_uom: z.string().optional(),
  project: z.string().optional(),
  cost_center: z.string().optional().default(':Company'),
  page_break: z.boolean().optional().default(false),
});

export type PurchaseInvoiceItem = z.infer<typeof PurchaseInvoiceItemSchema>;

export const PurchaseInvoiceItemInsertSchema = PurchaseInvoiceItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PurchaseInvoiceItemInsert = z.infer<typeof PurchaseInvoiceItemInsertSchema>;

export const PurchaseTaxesAndChargesSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  category: z.enum(['Valuation and Total', 'Valuation', 'Total']).default('Total'),
  add_deduct_tax: z.enum(['Add', 'Deduct']).default('Add'),
  charge_type: z.enum(['Actual', 'On Net Total', 'On Previous Row Amount', 'On Previous Row Total', 'On Item Quantity']).default('On Net Total'),
  row_id: z.string().optional(),
  included_in_print_rate: z.boolean().optional().default(false),
  included_in_paid_amount: z.boolean().optional().default(false),
  account_head: z.string(),
  description: z.string(),
  is_tax_withholding_account: z.boolean().optional().default(false),
  set_by_item_tax_template: z.boolean().optional().default(false),
  rate: z.number().optional(),
  cost_center: z.string().optional().default(':Company'),
  project: z.string().optional(),
  account_currency: z.string().optional(),
  net_amount: z.number().optional(),
  tax_amount: z.number().optional(),
  tax_amount_after_discount_amount: z.number().optional(),
  total: z.number().optional(),
  base_net_amount: z.number().optional(),
  base_tax_amount: z.number().optional(),
  base_total: z.number().optional(),
  base_tax_amount_after_discount_amount: z.number().optional(),
  dont_recompute_tax: z.boolean().optional().default(false),
});

export type PurchaseTaxesAndCharges = z.infer<typeof PurchaseTaxesAndChargesSchema>;

export const PurchaseTaxesAndChargesInsertSchema = PurchaseTaxesAndChargesSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PurchaseTaxesAndChargesInsert = z.infer<typeof PurchaseTaxesAndChargesInsertSchema>;

export const PurchaseTaxesAndChargesTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  title: z.string(),
  is_default: z.boolean().optional().default(false),
  disabled: z.boolean().optional().default(false),
  company: z.string(),
  tax_category: z.string().optional(),
  taxes: z.array(z.unknown()).optional(),
});

export type PurchaseTaxesAndChargesTemplate = z.infer<typeof PurchaseTaxesAndChargesTemplateSchema>;

export const PurchaseTaxesAndChargesTemplateInsertSchema = PurchaseTaxesAndChargesTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PurchaseTaxesAndChargesTemplateInsert = z.infer<typeof PurchaseTaxesAndChargesTemplateInsertSchema>;

export const RepostAccountingLedgerSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string().optional(),
  delete_cancelled_entries: z.boolean().optional().default(false),
  vouchers: z.array(z.unknown()).optional(),
  amended_from: z.string().optional(),
});

export type RepostAccountingLedger = z.infer<typeof RepostAccountingLedgerSchema>;

export const RepostAccountingLedgerInsertSchema = RepostAccountingLedgerSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RepostAccountingLedgerInsert = z.infer<typeof RepostAccountingLedgerInsertSchema>;

export const RepostAccountingLedgerItemsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  voucher_type: z.string().optional(),
  voucher_no: z.string().optional(),
});

export type RepostAccountingLedgerItems = z.infer<typeof RepostAccountingLedgerItemsSchema>;

export const RepostAccountingLedgerItemsInsertSchema = RepostAccountingLedgerItemsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RepostAccountingLedgerItemsInsert = z.infer<typeof RepostAccountingLedgerItemsInsertSchema>;

export const RepostAccountingLedgerSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  allowed_types: z.array(z.unknown()).optional(),
});

export type RepostAccountingLedgerSettings = z.infer<typeof RepostAccountingLedgerSettingsSchema>;

export const RepostAccountingLedgerSettingsInsertSchema = RepostAccountingLedgerSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RepostAccountingLedgerSettingsInsert = z.infer<typeof RepostAccountingLedgerSettingsInsertSchema>;

export const RepostAllowedTypesSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  document_type: z.string().optional(),
  allowed: z.boolean().optional().default(false),
});

export type RepostAllowedTypes = z.infer<typeof RepostAllowedTypesSchema>;

export const RepostAllowedTypesInsertSchema = RepostAllowedTypesSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RepostAllowedTypesInsert = z.infer<typeof RepostAllowedTypesInsertSchema>;

export const RepostPaymentLedgerSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string(),
  posting_date: z.string().default('Today'),
  voucher_type: z.string().optional(),
  add_manually: z.boolean().optional().default(false),
  repost_status: z.enum(['Queued', 'Failed', 'Completed']).optional(),
  repost_error_log: z.string().optional(),
  repost_vouchers: z.array(z.unknown()).optional(),
  amended_from: z.string().optional(),
});

export type RepostPaymentLedger = z.infer<typeof RepostPaymentLedgerSchema>;

export const RepostPaymentLedgerInsertSchema = RepostPaymentLedgerSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RepostPaymentLedgerInsert = z.infer<typeof RepostPaymentLedgerInsertSchema>;

export const RepostPaymentLedgerItemsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  voucher_type: z.string().optional(),
  voucher_no: z.string().optional(),
});

export type RepostPaymentLedgerItems = z.infer<typeof RepostPaymentLedgerItemsSchema>;

export const RepostPaymentLedgerItemsInsertSchema = RepostPaymentLedgerItemsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RepostPaymentLedgerItemsInsert = z.infer<typeof RepostPaymentLedgerItemsInsertSchema>;

export const SalesInvoiceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string(),
  company_tax_id: z.string().optional(),
  naming_series: z.enum(['ACC-SINV-.YYYY.-', 'ACC-SINV-RET-.YYYY.-']),
  customer: z.string().optional(),
  customer_name: z.string().optional(),
  tax_id: z.string().optional(),
  posting_date: z.string().default('Today'),
  posting_time: z.string().optional().default('Now'),
  set_posting_time: z.boolean().optional().default(false),
  due_date: z.string().optional(),
  is_pos: z.boolean().optional().default(false),
  pos_profile: z.string().optional(),
  is_consolidated: z.boolean().optional().default(false),
  is_return: z.boolean().optional().default(false),
  return_against: z.string().optional(),
  update_outstanding_for_self: z.boolean().optional().default(true),
  update_billed_amount_in_sales_order: z.boolean().optional().default(false),
  update_billed_amount_in_delivery_note: z.boolean().optional().default(true),
  is_debit_note: z.boolean().optional().default(false),
  apply_tds: z.boolean().optional().default(false),
  amended_from: z.string().optional(),
  is_created_using_pos: z.boolean().optional().default(false),
  pos_closing_entry: z.string().optional(),
  has_subcontracted: z.boolean().optional().default(false),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  currency: z.string(),
  conversion_rate: z.number(),
  selling_price_list: z.string(),
  price_list_currency: z.string(),
  plc_conversion_rate: z.number(),
  ignore_pricing_rule: z.boolean().optional().default(false),
  scan_barcode: z.string().optional(),
  last_scanned_warehouse: z.string().optional(),
  update_stock: z.boolean().optional().default(false),
  set_warehouse: z.string().optional(),
  set_target_warehouse: z.string().optional(),
  items: z.array(z.unknown()),
  total_qty: z.number().optional(),
  total_net_weight: z.number().optional(),
  base_total: z.number().optional(),
  base_net_total: z.number(),
  total: z.number().optional(),
  net_total: z.number().optional(),
  tax_category: z.string().optional(),
  taxes_and_charges: z.string().optional(),
  shipping_rule: z.string().optional(),
  incoterm: z.string().optional(),
  named_place: z.string().optional(),
  taxes: z.array(z.unknown()).optional(),
  base_total_taxes_and_charges: z.number().optional(),
  total_taxes_and_charges: z.number().optional(),
  grand_total: z.number(),
  rounding_adjustment: z.number().optional(),
  in_words: z.string().max(240).optional(),
  rounded_total: z.number().optional(),
  disable_rounded_total: z.boolean().optional().default(false),
  total_advance: z.number().optional(),
  outstanding_amount: z.number().optional(),
  use_company_roundoff_cost_center: z.boolean().optional().default(false),
  base_grand_total: z.number(),
  base_rounding_adjustment: z.number().optional(),
  base_in_words: z.string().max(240).optional(),
  base_rounded_total: z.number().optional(),
  tax_withholding_group: z.string().optional(),
  ignore_tax_withholding_threshold: z.boolean().optional().default(false),
  override_tax_withholding_entries: z.boolean().optional().default(false),
  tax_withholding_entries: z.array(z.unknown()).optional(),
  apply_discount_on: z.enum(['Grand Total', 'Net Total']).optional().default('Grand Total'),
  base_discount_amount: z.number().optional(),
  coupon_code: z.string().optional(),
  additional_discount_percentage: z.number().optional(),
  discount_amount: z.number().optional(),
  is_cash_or_non_trade_discount: z.boolean().optional().default(false),
  additional_discount_account: z.string().optional(),
  other_charges_calculation: z.string().optional(),
  item_wise_tax_details: z.array(z.unknown()).optional(),
  pricing_rules: z.array(z.unknown()).optional(),
  packed_items: z.array(z.unknown()).optional(),
  product_bundle_help: z.string().optional(),
  timesheets: z.array(z.unknown()).optional(),
  total_billing_hours: z.number().optional(),
  total_billing_amount: z.number().optional().default(0),
  cash_bank_account: z.string().optional(),
  payments: z.array(z.unknown()).optional(),
  base_paid_amount: z.number().optional(),
  paid_amount: z.number().optional(),
  base_change_amount: z.number().optional(),
  change_amount: z.number().optional(),
  account_for_change_amount: z.string().optional(),
  allocate_advances_automatically: z.boolean().optional().default(false),
  only_include_allocated_payments: z.boolean().optional().default(false),
  advances: z.array(z.unknown()).optional(),
  write_off_amount: z.number().optional(),
  base_write_off_amount: z.number().optional(),
  write_off_outstanding_amount_automatically: z.boolean().optional().default(false),
  write_off_account: z.string().optional(),
  write_off_cost_center: z.string().optional(),
  redeem_loyalty_points: z.boolean().optional().default(false),
  loyalty_points: z.number().int().optional(),
  loyalty_amount: z.number().optional(),
  loyalty_program: z.string().optional(),
  dont_create_loyalty_points: z.boolean().optional().default(false),
  loyalty_redemption_account: z.string().optional(),
  loyalty_redemption_cost_center: z.string().optional(),
  customer_address: z.string().optional(),
  address_display: z.string().optional(),
  contact_person: z.string().optional(),
  contact_display: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().email().optional(),
  territory: z.string().optional(),
  shipping_address_name: z.string().optional(),
  shipping_address: z.string().optional(),
  dispatch_address_name: z.string().optional(),
  dispatch_address: z.string().optional(),
  company_address: z.string().optional(),
  company_address_display: z.string().optional(),
  company_contact_person: z.string().optional(),
  ignore_default_payment_terms_template: z.boolean().optional().default(false),
  payment_terms_template: z.string().optional(),
  payment_schedule: z.array(z.unknown()).optional(),
  tc_name: z.string().optional(),
  terms: z.string().optional(),
  po_no: z.string().optional(),
  po_date: z.string().optional(),
  debit_to: z.string(),
  party_account_currency: z.string().optional(),
  is_opening: z.enum(['No', 'Yes']).optional().default('No'),
  unrealized_profit_loss_account: z.string().optional(),
  against_income_account: z.string().optional(),
  sales_partner: z.string().optional(),
  amount_eligible_for_commission: z.number().optional(),
  commission_rate: z.number().optional(),
  total_commission: z.number().optional(),
  sales_team: z.array(z.unknown()).optional(),
  letter_head: z.string().optional(),
  group_same_items: z.boolean().optional().default(false),
  select_print_heading: z.string().optional(),
  language: z.string().optional(),
  subscription: z.string().optional(),
  from_date: z.string().optional(),
  auto_repeat: z.string().optional(),
  to_date: z.string().optional(),
  status: z.enum(['Draft', 'Return', 'Credit Note Issued', 'Submitted', 'Paid', 'Partly Paid', 'Unpaid', 'Unpaid and Discounted', 'Partly Paid and Discounted', 'Overdue and Discounted', 'Overdue', 'Cancelled', 'Internal Transfer']).optional().default('Draft'),
  remarks: z.string().optional(),
  customer_group: z.string().optional(),
  utm_source: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_content: z.string().optional(),
  is_internal_customer: z.boolean().optional().default(false),
  represents_company: z.string().optional(),
  inter_company_invoice_reference: z.string().optional(),
  is_discounted: z.boolean().optional().default(false),
});

export type SalesInvoice = z.infer<typeof SalesInvoiceSchema>;

export const SalesInvoiceInsertSchema = SalesInvoiceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesInvoiceInsert = z.infer<typeof SalesInvoiceInsertSchema>;

export const SalesInvoiceAdvanceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  reference_type: z.string().optional(),
  reference_name: z.string().optional(),
  remarks: z.string().optional(),
  reference_row: z.string().optional(),
  advance_amount: z.number().optional(),
  allocated_amount: z.number().optional(),
  exchange_gain_loss: z.number().optional(),
  ref_exchange_rate: z.number().optional(),
  difference_posting_date: z.string().optional(),
});

export type SalesInvoiceAdvance = z.infer<typeof SalesInvoiceAdvanceSchema>;

export const SalesInvoiceAdvanceInsertSchema = SalesInvoiceAdvanceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesInvoiceAdvanceInsert = z.infer<typeof SalesInvoiceAdvanceInsertSchema>;

export const SalesInvoiceItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  barcode: z.string().optional(),
  has_item_scanned: z.boolean().optional().default(false),
  item_code: z.string().optional(),
  item_name: z.string(),
  customer_item_code: z.string().optional(),
  description: z.string().optional(),
  item_group: z.string().optional(),
  brand: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  qty: z.number().optional(),
  stock_uom: z.string().optional(),
  uom: z.string(),
  conversion_factor: z.number(),
  stock_qty: z.number().optional(),
  price_list_rate: z.number().optional(),
  base_price_list_rate: z.number().optional(),
  margin_type: z.enum(['Percentage', 'Amount']).optional(),
  margin_rate_or_amount: z.number().optional(),
  rate_with_margin: z.number().optional(),
  discount_percentage: z.number().optional(),
  discount_amount: z.number().optional(),
  distributed_discount_amount: z.number().optional(),
  base_rate_with_margin: z.number().optional(),
  rate: z.number(),
  amount: z.number(),
  item_tax_template: z.string().optional(),
  tax_withholding_category: z.string().optional(),
  base_rate: z.number(),
  base_amount: z.number(),
  pricing_rules: z.string().optional(),
  stock_uom_rate: z.number().optional(),
  is_free_item: z.boolean().optional().default(false),
  apply_tds: z.boolean().optional().default(true),
  grant_commission: z.boolean().optional().default(false),
  net_rate: z.number().optional(),
  net_amount: z.number().optional(),
  base_net_rate: z.number().optional(),
  base_net_amount: z.number().optional(),
  delivered_by_supplier: z.boolean().optional().default(false),
  income_account: z.string(),
  is_fixed_asset: z.boolean().optional().default(false),
  asset: z.string().optional(),
  finance_book: z.string().optional(),
  expense_account: z.string().optional(),
  discount_account: z.string().optional(),
  deferred_revenue_account: z.string().optional(),
  service_stop_date: z.string().optional(),
  enable_deferred_revenue: z.boolean().optional().default(false),
  service_start_date: z.string().optional(),
  service_end_date: z.string().optional(),
  weight_per_unit: z.number().optional(),
  total_weight: z.number().optional(),
  weight_uom: z.string().optional(),
  warehouse: z.string().optional(),
  target_warehouse: z.string().optional(),
  quality_inspection: z.string().optional(),
  serial_and_batch_bundle: z.string().optional(),
  use_serial_batch_fields: z.boolean().optional().default(false),
  allow_zero_valuation_rate: z.boolean().optional().default(false),
  incoming_rate: z.number().optional(),
  item_tax_rate: z.string().optional(),
  actual_batch_qty: z.number().optional(),
  serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  actual_qty: z.number().optional(),
  company_total_stock: z.number().optional(),
  sales_order: z.string().optional(),
  so_detail: z.string().optional(),
  sales_invoice_item: z.string().optional(),
  delivery_note: z.string().optional(),
  dn_detail: z.string().optional(),
  delivered_qty: z.number().optional(),
  pos_invoice: z.string().optional(),
  pos_invoice_item: z.string().optional(),
  scio_detail: z.string().optional(),
  purchase_order: z.string().optional(),
  purchase_order_item: z.string().optional(),
  cost_center: z.string().default(':Company'),
  project: z.string().optional(),
  page_break: z.boolean().optional().default(false),
});

export type SalesInvoiceItem = z.infer<typeof SalesInvoiceItemSchema>;

export const SalesInvoiceItemInsertSchema = SalesInvoiceItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesInvoiceItemInsert = z.infer<typeof SalesInvoiceItemInsertSchema>;

export const SalesInvoicePaymentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  default: z.boolean().optional().default(false),
  mode_of_payment: z.string(),
  amount: z.number().default(0),
  reference_no: z.string().optional(),
  account: z.string().optional(),
  type: z.string().optional(),
  base_amount: z.number().optional(),
  clearance_date: z.string().optional(),
});

export type SalesInvoicePayment = z.infer<typeof SalesInvoicePaymentSchema>;

export const SalesInvoicePaymentInsertSchema = SalesInvoicePaymentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesInvoicePaymentInsert = z.infer<typeof SalesInvoicePaymentInsertSchema>;

export const SalesInvoiceReferenceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  sales_invoice: z.string(),
  posting_date: z.string(),
  customer: z.string(),
  grand_total: z.number(),
  is_return: z.boolean().optional().default(false),
  return_against: z.string().optional(),
});

export type SalesInvoiceReference = z.infer<typeof SalesInvoiceReferenceSchema>;

export const SalesInvoiceReferenceInsertSchema = SalesInvoiceReferenceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesInvoiceReferenceInsert = z.infer<typeof SalesInvoiceReferenceInsertSchema>;

export const SalesInvoiceTimesheetSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  activity_type: z.string().optional(),
  description: z.string().optional(),
  from_time: z.string().optional(),
  to_time: z.string().optional(),
  billing_hours: z.number().optional(),
  billing_amount: z.number().optional(),
  time_sheet: z.string().optional(),
  timesheet_detail: z.string().optional(),
  project_name: z.string().optional(),
});

export type SalesInvoiceTimesheet = z.infer<typeof SalesInvoiceTimesheetSchema>;

export const SalesInvoiceTimesheetInsertSchema = SalesInvoiceTimesheetSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesInvoiceTimesheetInsert = z.infer<typeof SalesInvoiceTimesheetInsertSchema>;

export const SalesPartnerItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  sales_partner: z.string().optional(),
});

export type SalesPartnerItem = z.infer<typeof SalesPartnerItemSchema>;

export const SalesPartnerItemInsertSchema = SalesPartnerItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesPartnerItemInsert = z.infer<typeof SalesPartnerItemInsertSchema>;

export const SalesTaxesAndChargesSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  charge_type: z.enum(['Actual', 'On Net Total', 'On Previous Row Amount', 'On Previous Row Total', 'On Item Quantity']),
  row_id: z.string().optional(),
  account_head: z.string(),
  description: z.string(),
  included_in_print_rate: z.boolean().optional().default(false),
  included_in_paid_amount: z.boolean().optional().default(false),
  set_by_item_tax_template: z.boolean().optional().default(false),
  is_tax_withholding_account: z.boolean().optional().default(false),
  cost_center: z.string().optional().default(':Company'),
  project: z.string().optional(),
  rate: z.number().optional(),
  account_currency: z.string().optional(),
  net_amount: z.number().optional(),
  tax_amount: z.number().optional(),
  total: z.number().optional(),
  tax_amount_after_discount_amount: z.number().optional(),
  base_net_amount: z.number().optional(),
  base_tax_amount: z.number().optional(),
  base_total: z.number().optional(),
  base_tax_amount_after_discount_amount: z.number().optional(),
  dont_recompute_tax: z.boolean().optional().default(false),
});

export type SalesTaxesAndCharges = z.infer<typeof SalesTaxesAndChargesSchema>;

export const SalesTaxesAndChargesInsertSchema = SalesTaxesAndChargesSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesTaxesAndChargesInsert = z.infer<typeof SalesTaxesAndChargesInsertSchema>;

export const SalesTaxesAndChargesTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  title: z.string(),
  is_default: z.boolean().optional().default(false),
  disabled: z.boolean().optional().default(false),
  company: z.string(),
  tax_category: z.string().optional(),
  taxes: z.array(z.unknown()).optional(),
});

export type SalesTaxesAndChargesTemplate = z.infer<typeof SalesTaxesAndChargesTemplateSchema>;

export const SalesTaxesAndChargesTemplateInsertSchema = SalesTaxesAndChargesTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesTaxesAndChargesTemplateInsert = z.infer<typeof SalesTaxesAndChargesTemplateInsertSchema>;

export const ShareBalanceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  share_type: z.string(),
  from_no: z.number().int(),
  rate: z.number(),
  no_of_shares: z.number().int(),
  to_no: z.number().int(),
  amount: z.number(),
  is_company: z.boolean().optional().default(false),
  current_state: z.enum(['Issued', 'Purchased']).optional(),
});

export type ShareBalance = z.infer<typeof ShareBalanceSchema>;

export const ShareBalanceInsertSchema = ShareBalanceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShareBalanceInsert = z.infer<typeof ShareBalanceInsertSchema>;

export const ShareTransferSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  transfer_type: z.enum(['Issue', 'Purchase', 'Transfer']),
  date: z.string(),
  from_shareholder: z.string().optional(),
  from_folio_no: z.string().optional(),
  to_shareholder: z.string().optional(),
  to_folio_no: z.string().optional(),
  equity_or_liability_account: z.string(),
  asset_account: z.string().optional(),
  share_type: z.string(),
  from_no: z.number().int(),
  rate: z.number(),
  no_of_shares: z.number().int(),
  to_no: z.number().int(),
  amount: z.number().optional(),
  company: z.string(),
  remarks: z.string().optional(),
  amended_from: z.string().optional(),
});

export type ShareTransfer = z.infer<typeof ShareTransferSchema>;

export const ShareTransferInsertSchema = ShareTransferSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShareTransferInsert = z.infer<typeof ShareTransferInsertSchema>;

export const ShareTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
});

export type ShareType = z.infer<typeof ShareTypeSchema>;

export const ShareTypeInsertSchema = ShareTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShareTypeInsert = z.infer<typeof ShareTypeInsertSchema>;

export const ShareholderSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  title: z.string(),
  naming_series: z.enum(['ACC-SH-.YYYY.-']).optional(),
  folio_no: z.string().optional(),
  company: z.string(),
  is_company: z.boolean().optional().default(false),
  address_html: z.string().optional(),
  contact_html: z.string().optional(),
  share_balance: z.array(z.unknown()).optional(),
  contact_list: z.string().optional(),
});

export type Shareholder = z.infer<typeof ShareholderSchema>;

export const ShareholderInsertSchema = ShareholderSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShareholderInsert = z.infer<typeof ShareholderInsertSchema>;

export const ShippingRuleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  label: z.string(),
  disabled: z.boolean().optional().default(false),
  shipping_rule_type: z.enum(['Selling', 'Buying']).optional(),
  company: z.string(),
  account: z.string(),
  cost_center: z.string(),
  project: z.string().optional(),
  calculate_based_on: z.enum(['Fixed', 'Net Total', 'Net Weight']).optional().default('Fixed'),
  shipping_amount: z.number().optional(),
  conditions: z.array(z.unknown()).optional(),
  countries: z.array(z.unknown()).optional(),
});

export type ShippingRule = z.infer<typeof ShippingRuleSchema>;

export const ShippingRuleInsertSchema = ShippingRuleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShippingRuleInsert = z.infer<typeof ShippingRuleInsertSchema>;

export const ShippingRuleConditionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  from_value: z.number(),
  to_value: z.number().optional(),
  shipping_amount: z.number(),
});

export type ShippingRuleCondition = z.infer<typeof ShippingRuleConditionSchema>;

export const ShippingRuleConditionInsertSchema = ShippingRuleConditionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShippingRuleConditionInsert = z.infer<typeof ShippingRuleConditionInsertSchema>;

export const ShippingRuleCountrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  country: z.string(),
});

export type ShippingRuleCountry = z.infer<typeof ShippingRuleCountrySchema>;

export const ShippingRuleCountryInsertSchema = ShippingRuleCountrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShippingRuleCountryInsert = z.infer<typeof ShippingRuleCountryInsertSchema>;

export const SouthAfricaVatAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account: z.string().optional(),
});

export type SouthAfricaVatAccount = z.infer<typeof SouthAfricaVatAccountSchema>;

export const SouthAfricaVatAccountInsertSchema = SouthAfricaVatAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SouthAfricaVatAccountInsert = z.infer<typeof SouthAfricaVatAccountInsertSchema>;

export const SubscriptionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  party_type: z.string(),
  party: z.string(),
  company: z.string().optional(),
  status: z.enum(['Trialing', 'Active', 'Grace Period', 'Cancelled', 'Unpaid', 'Completed']).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  cancelation_date: z.string().optional(),
  trial_period_start: z.string().optional(),
  trial_period_end: z.string().optional(),
  follow_calendar_months: z.boolean().optional().default(false),
  generate_new_invoices_past_due_date: z.boolean().optional().default(false),
  submit_invoice: z.boolean().optional().default(true),
  current_invoice_start: z.string().optional(),
  current_invoice_end: z.string().optional(),
  days_until_due: z.number().int().optional().default(0),
  generate_invoice_at: z.enum(['End of the current subscription period', 'Beginning of the current subscription period', 'Days before the current subscription period']).default('End of the current subscription period'),
  number_of_days: z.number().int().optional(),
  cancel_at_period_end: z.boolean().optional().default(false),
  plans: z.array(z.unknown()),
  sales_tax_template: z.string().optional(),
  purchase_tax_template: z.string().optional(),
  apply_additional_discount: z.enum(['Grand Total', 'Net Total']).optional(),
  additional_discount_percentage: z.number().optional(),
  additional_discount_amount: z.number().optional(),
  cost_center: z.string().optional(),
});

export type Subscription = z.infer<typeof SubscriptionSchema>;

export const SubscriptionInsertSchema = SubscriptionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubscriptionInsert = z.infer<typeof SubscriptionInsertSchema>;

export const SubscriptionInvoiceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  document_type: z.string().optional(),
  invoice: z.string().optional(),
});

export type SubscriptionInvoice = z.infer<typeof SubscriptionInvoiceSchema>;

export const SubscriptionInvoiceInsertSchema = SubscriptionInvoiceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubscriptionInvoiceInsert = z.infer<typeof SubscriptionInvoiceInsertSchema>;

export const SubscriptionPlanSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  plan_name: z.string(),
  currency: z.string(),
  item: z.string(),
  price_determination: z.enum(['Fixed Rate', 'Based On Price List', 'Monthly Rate']),
  cost: z.number().optional(),
  price_list: z.string().optional(),
  billing_interval: z.enum(['Day', 'Week', 'Month', 'Year']).default('Day'),
  billing_interval_count: z.number().int().default(1),
  product_price_id: z.string().optional(),
  payment_gateway: z.string().optional(),
  cost_center: z.string().optional(),
});

export type SubscriptionPlan = z.infer<typeof SubscriptionPlanSchema>;

export const SubscriptionPlanInsertSchema = SubscriptionPlanSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubscriptionPlanInsert = z.infer<typeof SubscriptionPlanInsertSchema>;

export const SubscriptionPlanDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  plan: z.string(),
  qty: z.number().int(),
});

export type SubscriptionPlanDetail = z.infer<typeof SubscriptionPlanDetailSchema>;

export const SubscriptionPlanDetailInsertSchema = SubscriptionPlanDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubscriptionPlanDetailInsert = z.infer<typeof SubscriptionPlanDetailInsertSchema>;

export const SubscriptionSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  grace_period: z.number().int().optional().default(1),
  cancel_after_grace: z.boolean().optional().default(false),
  prorate: z.boolean().optional().default(true),
});

export type SubscriptionSettings = z.infer<typeof SubscriptionSettingsSchema>;

export const SubscriptionSettingsInsertSchema = SubscriptionSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubscriptionSettingsInsert = z.infer<typeof SubscriptionSettingsInsertSchema>;

export const SupplierGroupItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  supplier_group: z.string().optional(),
});

export type SupplierGroupItem = z.infer<typeof SupplierGroupItemSchema>;

export const SupplierGroupItemInsertSchema = SupplierGroupItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierGroupItemInsert = z.infer<typeof SupplierGroupItemInsertSchema>;

export const SupplierItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  supplier: z.string().optional(),
});

export type SupplierItem = z.infer<typeof SupplierItemSchema>;

export const SupplierItemInsertSchema = SupplierItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierItemInsert = z.infer<typeof SupplierItemInsertSchema>;

export const TaxCategorySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  title: z.string(),
  disabled: z.boolean().optional().default(false),
});

export type TaxCategory = z.infer<typeof TaxCategorySchema>;

export const TaxCategoryInsertSchema = TaxCategorySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TaxCategoryInsert = z.infer<typeof TaxCategoryInsertSchema>;

export const TaxRuleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  tax_type: z.enum(['Sales', 'Purchase']).optional().default('Sales'),
  use_for_shopping_cart: z.boolean().optional().default(true),
  sales_tax_template: z.string().optional(),
  purchase_tax_template: z.string().optional(),
  customer: z.string().optional(),
  supplier: z.string().optional(),
  item: z.string().optional(),
  billing_city: z.string().optional(),
  billing_county: z.string().optional(),
  billing_state: z.string().optional(),
  billing_zipcode: z.string().optional(),
  billing_country: z.string().optional(),
  tax_category: z.string().optional(),
  customer_group: z.string().optional(),
  supplier_group: z.string().optional(),
  item_group: z.string().optional(),
  shipping_city: z.string().optional(),
  shipping_county: z.string().optional(),
  shipping_state: z.string().optional(),
  shipping_zipcode: z.string().optional(),
  shipping_country: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  priority: z.number().int().optional().default(1),
  company: z.string().optional(),
});

export type TaxRule = z.infer<typeof TaxRuleSchema>;

export const TaxRuleInsertSchema = TaxRuleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TaxRuleInsert = z.infer<typeof TaxRuleInsertSchema>;

export const TaxWithholdingAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
  account: z.string(),
});

export type TaxWithholdingAccount = z.infer<typeof TaxWithholdingAccountSchema>;

export const TaxWithholdingAccountInsertSchema = TaxWithholdingAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TaxWithholdingAccountInsert = z.infer<typeof TaxWithholdingAccountInsertSchema>;

export const TaxWithholdingCategorySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  category_name: z.string().optional(),
  tax_deduction_basis: z.enum(['Gross Total', 'Net Total']).default('Net Total'),
  round_off_tax_amount: z.boolean().optional().default(false),
  tax_on_excess_amount: z.boolean().optional().default(false),
  disable_cumulative_threshold: z.boolean().optional().default(false),
  disable_transaction_threshold: z.boolean().optional().default(false),
  rates: z.array(z.unknown()),
  accounts: z.array(z.unknown()),
});

export type TaxWithholdingCategory = z.infer<typeof TaxWithholdingCategorySchema>;

export const TaxWithholdingCategoryInsertSchema = TaxWithholdingCategorySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TaxWithholdingCategoryInsert = z.infer<typeof TaxWithholdingCategoryInsertSchema>;

export const TaxWithholdingEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  party_type: z.string().optional(),
  party: z.string().optional(),
  tax_id: z.string().optional(),
  tax_withholding_category: z.string().optional(),
  tax_withholding_group: z.string().optional(),
  taxable_amount: z.number().optional(),
  tax_rate: z.number().optional(),
  withholding_amount: z.number().optional(),
  taxable_doctype: z.string().optional(),
  taxable_name: z.string().optional(),
  taxable_date: z.string().optional(),
  currency: z.string().optional(),
  conversion_rate: z.number().optional(),
  under_withheld_reason: z.enum(['Threshold Exemption', 'Lower Deduction Certificate']).optional(),
  lower_deduction_certificate: z.string().optional(),
  withholding_doctype: z.string().optional(),
  withholding_name: z.string().optional(),
  withholding_date: z.string().optional(),
  status: z.enum(['Settled', 'Under Withheld', 'Over Withheld', 'Duplicate', 'Cancelled']).optional(),
  created_by_migration: z.boolean().optional().default(false),
});

export type TaxWithholdingEntry = z.infer<typeof TaxWithholdingEntrySchema>;

export const TaxWithholdingEntryInsertSchema = TaxWithholdingEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TaxWithholdingEntryInsert = z.infer<typeof TaxWithholdingEntryInsertSchema>;

export const TaxWithholdingGroupSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  group_name: z.string(),
});

export type TaxWithholdingGroup = z.infer<typeof TaxWithholdingGroupSchema>;

export const TaxWithholdingGroupInsertSchema = TaxWithholdingGroupSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TaxWithholdingGroupInsert = z.infer<typeof TaxWithholdingGroupInsertSchema>;

export const TaxWithholdingRateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  from_date: z.string(),
  to_date: z.string(),
  tax_withholding_group: z.string().optional(),
  tax_withholding_rate: z.number(),
  cumulative_threshold: z.number().optional(),
  single_threshold: z.number().optional(),
});

export type TaxWithholdingRate = z.infer<typeof TaxWithholdingRateSchema>;

export const TaxWithholdingRateInsertSchema = TaxWithholdingRateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TaxWithholdingRateInsert = z.infer<typeof TaxWithholdingRateInsertSchema>;

export const TerritoryItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  territory: z.string().optional(),
});

export type TerritoryItem = z.infer<typeof TerritoryItemSchema>;

export const TerritoryItemInsertSchema = TerritoryItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TerritoryItemInsert = z.infer<typeof TerritoryItemInsertSchema>;

export const TransactionDeletionRecordDetailsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  doctype_name: z.string(),
  docfield_name: z.string().optional(),
  no_of_docs: z.number().int().optional(),
  done: z.boolean().optional().default(false),
});

export type TransactionDeletionRecordDetails = z.infer<typeof TransactionDeletionRecordDetailsSchema>;

export const TransactionDeletionRecordDetailsInsertSchema = TransactionDeletionRecordDetailsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TransactionDeletionRecordDetailsInsert = z.infer<typeof TransactionDeletionRecordDetailsInsertSchema>;

export const UnreconcilePaymentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string().optional(),
  voucher_type: z.string().optional(),
  voucher_no: z.string().optional(),
  allocations: z.array(z.unknown()).optional(),
  amended_from: z.string().optional(),
});

export type UnreconcilePayment = z.infer<typeof UnreconcilePaymentSchema>;

export const UnreconcilePaymentInsertSchema = UnreconcilePaymentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type UnreconcilePaymentInsert = z.infer<typeof UnreconcilePaymentInsertSchema>;

export const UnreconcilePaymentEntriesSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account: z.string().optional(),
  party_type: z.string().optional(),
  party: z.string().optional(),
  reference_doctype: z.string().optional(),
  reference_name: z.string().optional(),
  allocated_amount: z.number().optional(),
  account_currency: z.string().optional(),
  unlinked: z.boolean().optional().default(false),
});

export type UnreconcilePaymentEntries = z.infer<typeof UnreconcilePaymentEntriesSchema>;

export const UnreconcilePaymentEntriesInsertSchema = UnreconcilePaymentEntriesSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type UnreconcilePaymentEntriesInsert = z.infer<typeof UnreconcilePaymentEntriesInsertSchema>;

export const AssetSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['ACC-ASS-.YYYY.-']).optional(),
  company: z.string(),
  item_code: z.string(),
  item_name: z.string().optional(),
  asset_name: z.string(),
  image: z.string().optional(),
  location: z.string(),
  asset_category: z.string().optional(),
  asset_type: z.enum(['Existing Asset', 'Composite Asset', 'Composite Component']).optional(),
  maintenance_required: z.boolean().optional().default(false),
  calculate_depreciation: z.boolean().optional().default(false),
  purchase_receipt: z.string().optional(),
  purchase_receipt_item: z.string().optional(),
  purchase_invoice: z.string().optional(),
  purchase_invoice_item: z.string().optional(),
  purchase_date: z.string(),
  available_for_use_date: z.string().optional(),
  disposal_date: z.string().optional(),
  net_purchase_amount: z.number().optional(),
  purchase_amount: z.number().optional(),
  asset_quantity: z.number().int().optional().default(1),
  additional_asset_cost: z.number().optional().default(0),
  total_asset_cost: z.number().optional(),
  opening_accumulated_depreciation: z.number().optional(),
  is_fully_depreciated: z.boolean().optional().default(false),
  opening_number_of_booked_depreciations: z.number().int().optional(),
  finance_books: z.array(z.unknown()).optional(),
  depreciation_method: z.enum(['Straight Line', 'Double Declining Balance', 'Written Down Value', 'Manual']).optional(),
  value_after_depreciation: z.number().optional(),
  frequency_of_depreciation: z.number().int().optional(),
  next_depreciation_date: z.string().optional(),
  total_number_of_depreciations: z.number().int().optional(),
  depreciation_schedule_view: z.string().optional(),
  cost_center: z.string().optional(),
  asset_owner: z.enum(['Company', 'Supplier', 'Customer']).optional().default('Company'),
  asset_owner_company: z.string().optional(),
  customer: z.string().optional(),
  supplier: z.string().optional(),
  policy_number: z.string().optional(),
  insurer: z.string().optional(),
  insured_value: z.string().optional(),
  insurance_start_date: z.string().optional(),
  insurance_end_date: z.string().optional(),
  comprehensive_insurance: z.string().optional(),
  status: z.enum(['Draft', 'Submitted', 'Cancelled', 'Partially Depreciated', 'Fully Depreciated', 'Sold', 'Scrapped', 'In Maintenance', 'Out of Order', 'Issue', 'Receipt', 'Capitalized', 'Work In Progress']).optional().default('Draft'),
  custodian: z.string().optional(),
  department: z.string().optional(),
  default_finance_book: z.string().optional(),
  depr_entry_posting_status: z.enum(['Successful', 'Failed']).optional(),
  journal_entry_for_scrap: z.string().optional(),
  split_from: z.string().optional(),
  amended_from: z.string().optional(),
  booked_fixed_asset: z.boolean().optional().default(false),
});

export type Asset = z.infer<typeof AssetSchema>;

export const AssetInsertSchema = AssetSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetInsert = z.infer<typeof AssetInsertSchema>;

export const AssetActivitySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  asset: z.string(),
  date: z.string().default('now'),
  user: z.string(),
  subject: z.string(),
});

export type AssetActivity = z.infer<typeof AssetActivitySchema>;

export const AssetActivityInsertSchema = AssetActivitySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetActivityInsert = z.infer<typeof AssetActivityInsertSchema>;

export const AssetCapitalizationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  title: z.string().optional(),
  naming_series: z.enum(['ACC-ASC-.YYYY.-']),
  company: z.string(),
  target_asset: z.string().optional(),
  target_asset_name: z.string().optional(),
  finance_book: z.string().optional(),
  posting_date: z.string().default('Today'),
  posting_time: z.string().default('Now'),
  set_posting_time: z.boolean().optional().default(false),
  target_item_code: z.string().optional(),
  amended_from: z.string().optional(),
  stock_items: z.array(z.unknown()).optional(),
  stock_items_total: z.number().optional(),
  asset_items: z.array(z.unknown()).optional(),
  asset_items_total: z.number().optional(),
  service_items: z.array(z.unknown()).optional(),
  service_items_total: z.number().optional(),
  total_value: z.number().optional(),
  target_incoming_rate: z.number().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  target_fixed_asset_account: z.string().optional(),
});

export type AssetCapitalization = z.infer<typeof AssetCapitalizationSchema>;

export const AssetCapitalizationInsertSchema = AssetCapitalizationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetCapitalizationInsert = z.infer<typeof AssetCapitalizationInsertSchema>;

export const AssetCapitalizationAssetItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  asset: z.string(),
  asset_name: z.string().optional(),
  finance_book: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  current_asset_value: z.number().optional(),
  asset_value: z.number().optional().default(0),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  fixed_asset_account: z.string().optional(),
});

export type AssetCapitalizationAssetItem = z.infer<typeof AssetCapitalizationAssetItemSchema>;

export const AssetCapitalizationAssetItemInsertSchema = AssetCapitalizationAssetItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetCapitalizationAssetItemInsert = z.infer<typeof AssetCapitalizationAssetItemInsertSchema>;

export const AssetCapitalizationServiceItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  expense_account: z.string(),
  qty: z.number().optional().default(1),
  uom: z.string().optional(),
  rate: z.number().optional(),
  amount: z.number().optional().default(0),
  cost_center: z.string().optional(),
});

export type AssetCapitalizationServiceItem = z.infer<typeof AssetCapitalizationServiceItemSchema>;

export const AssetCapitalizationServiceItemInsertSchema = AssetCapitalizationServiceItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetCapitalizationServiceItemInsert = z.infer<typeof AssetCapitalizationServiceItemInsertSchema>;

export const AssetCapitalizationStockItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  warehouse: z.string(),
  purchase_receipt_item: z.string().optional(),
  stock_qty: z.number().optional(),
  actual_qty: z.number().optional(),
  valuation_rate: z.number().optional(),
  amount: z.number().optional().default(0),
  stock_uom: z.string(),
  serial_and_batch_bundle: z.string().optional(),
  use_serial_batch_fields: z.boolean().optional().default(false),
  serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  cost_center: z.string().optional(),
});

export type AssetCapitalizationStockItem = z.infer<typeof AssetCapitalizationStockItemSchema>;

export const AssetCapitalizationStockItemInsertSchema = AssetCapitalizationStockItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetCapitalizationStockItemInsert = z.infer<typeof AssetCapitalizationStockItemInsertSchema>;

export const AssetCategorySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  asset_category_name: z.string(),
  enable_cwip_accounting: z.boolean().optional().default(false),
  non_depreciable_category: z.boolean().optional().default(false),
  finance_books: z.array(z.unknown()).optional(),
  accounts: z.array(z.unknown()),
});

export type AssetCategory = z.infer<typeof AssetCategorySchema>;

export const AssetCategoryInsertSchema = AssetCategorySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetCategoryInsert = z.infer<typeof AssetCategoryInsertSchema>;

export const AssetCategoryAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company_name: z.string(),
  fixed_asset_account: z.string(),
  accumulated_depreciation_account: z.string().optional(),
  depreciation_expense_account: z.string().optional(),
  capital_work_in_progress_account: z.string().optional(),
});

export type AssetCategoryAccount = z.infer<typeof AssetCategoryAccountSchema>;

export const AssetCategoryAccountInsertSchema = AssetCategoryAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetCategoryAccountInsert = z.infer<typeof AssetCategoryAccountInsertSchema>;

export const AssetDepreciationScheduleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  asset: z.string(),
  naming_series: z.enum(['ACC-ADS-.YYYY.-']).optional(),
  company: z.string().optional(),
  net_purchase_amount: z.number().optional(),
  opening_accumulated_depreciation: z.number().optional(),
  opening_number_of_booked_depreciations: z.number().int().optional(),
  finance_book: z.string().optional(),
  finance_book_id: z.number().int().optional(),
  depreciation_method: z.enum(['Straight Line', 'Double Declining Balance', 'Written Down Value', 'Manual']).optional(),
  total_number_of_depreciations: z.number().int().optional(),
  rate_of_depreciation: z.number().optional(),
  daily_prorata_based: z.boolean().optional().default(false),
  shift_based: z.boolean().optional().default(false),
  frequency_of_depreciation: z.number().int().optional(),
  expected_value_after_useful_life: z.number().optional(),
  value_after_depreciation: z.number().optional(),
  depreciation_schedule: z.array(z.unknown()).optional(),
  notes: z.string().optional(),
  status: z.enum(['Draft', 'Active', 'Cancelled']).optional(),
  amended_from: z.string().optional(),
});

export type AssetDepreciationSchedule = z.infer<typeof AssetDepreciationScheduleSchema>;

export const AssetDepreciationScheduleInsertSchema = AssetDepreciationScheduleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetDepreciationScheduleInsert = z.infer<typeof AssetDepreciationScheduleInsertSchema>;

export const AssetFinanceBookSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  finance_book: z.string().optional(),
  depreciation_method: z.enum(['Straight Line', 'Double Declining Balance', 'Written Down Value', 'Manual']),
  frequency_of_depreciation: z.number().int(),
  total_number_of_depreciations: z.number().int(),
  increase_in_asset_life: z.number().int().optional(),
  depreciation_start_date: z.string().optional(),
  salvage_value_percentage: z.number().optional(),
  expected_value_after_useful_life: z.number().optional().default(0),
  rate_of_depreciation: z.number().optional(),
  daily_prorata_based: z.boolean().optional().default(false),
  shift_based: z.boolean().optional().default(false),
  value_after_depreciation: z.number().optional(),
  total_number_of_booked_depreciations: z.number().int().optional().default(0),
});

export type AssetFinanceBook = z.infer<typeof AssetFinanceBookSchema>;

export const AssetFinanceBookInsertSchema = AssetFinanceBookSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetFinanceBookInsert = z.infer<typeof AssetFinanceBookInsertSchema>;

export const AssetMaintenanceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  asset_name: z.string(),
  asset_category: z.string().optional(),
  company: z.string(),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  maintenance_team: z.string(),
  maintenance_manager: z.string().optional(),
  maintenance_manager_name: z.string().optional(),
  asset_maintenance_tasks: z.array(z.unknown()),
});

export type AssetMaintenance = z.infer<typeof AssetMaintenanceSchema>;

export const AssetMaintenanceInsertSchema = AssetMaintenanceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetMaintenanceInsert = z.infer<typeof AssetMaintenanceInsertSchema>;

export const AssetMaintenanceLogSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  asset_maintenance: z.string().optional(),
  naming_series: z.enum(['ACC-AML-.YYYY.-']),
  asset_name: z.string().optional(),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  task: z.string().optional(),
  task_name: z.string().optional(),
  maintenance_type: z.string().optional(),
  periodicity: z.string().optional(),
  has_certificate: z.boolean().optional().default(false),
  certificate_attachement: z.string().optional(),
  maintenance_status: z.enum(['Planned', 'Completed', 'Cancelled', 'Overdue']),
  assign_to_name: z.string().optional(),
  task_assignee_email: z.string().optional(),
  due_date: z.string().optional(),
  completion_date: z.string().optional(),
  description: z.string().optional(),
  actions_performed: z.string().optional(),
  amended_from: z.string().optional(),
});

export type AssetMaintenanceLog = z.infer<typeof AssetMaintenanceLogSchema>;

export const AssetMaintenanceLogInsertSchema = AssetMaintenanceLogSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetMaintenanceLogInsert = z.infer<typeof AssetMaintenanceLogInsertSchema>;

export const AssetMaintenanceTaskSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  maintenance_task: z.string(),
  maintenance_type: z.enum(['Preventive Maintenance', 'Calibration']).optional(),
  maintenance_status: z.enum(['Planned', 'Overdue', 'Cancelled']),
  start_date: z.string().default('Today'),
  periodicity: z.enum(['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Half-yearly', 'Yearly', '2 Yearly', '3 Yearly']),
  end_date: z.string().optional(),
  certificate_required: z.boolean().optional().default(false),
  assign_to: z.string().optional(),
  assign_to_name: z.string().optional(),
  next_due_date: z.string().optional(),
  last_completion_date: z.string().optional(),
  description: z.string().optional(),
});

export type AssetMaintenanceTask = z.infer<typeof AssetMaintenanceTaskSchema>;

export const AssetMaintenanceTaskInsertSchema = AssetMaintenanceTaskSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetMaintenanceTaskInsert = z.infer<typeof AssetMaintenanceTaskInsertSchema>;

export const AssetMaintenanceTeamSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  maintenance_team_name: z.string(),
  maintenance_manager: z.string().optional(),
  maintenance_manager_name: z.string().optional(),
  company: z.string(),
  maintenance_team_members: z.array(z.unknown()),
});

export type AssetMaintenanceTeam = z.infer<typeof AssetMaintenanceTeamSchema>;

export const AssetMaintenanceTeamInsertSchema = AssetMaintenanceTeamSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetMaintenanceTeamInsert = z.infer<typeof AssetMaintenanceTeamInsertSchema>;

export const AssetMovementSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string(),
  purpose: z.enum(['Issue', 'Receipt', 'Transfer', 'Transfer and Issue']),
  transaction_date: z.string().default('Now'),
  assets: z.array(z.unknown()),
  reference_doctype: z.string().optional(),
  reference_name: z.string().optional(),
  amended_from: z.string().optional(),
});

export type AssetMovement = z.infer<typeof AssetMovementSchema>;

export const AssetMovementInsertSchema = AssetMovementSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetMovementInsert = z.infer<typeof AssetMovementInsertSchema>;

export const AssetMovementItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  asset: z.string(),
  source_location: z.string().optional(),
  from_employee: z.string().optional(),
  asset_name: z.string().optional(),
  target_location: z.string().optional(),
  to_employee: z.string().optional(),
});

export type AssetMovementItem = z.infer<typeof AssetMovementItemSchema>;

export const AssetMovementItemInsertSchema = AssetMovementItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetMovementItemInsert = z.infer<typeof AssetMovementItemInsertSchema>;

export const AssetRepairSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['ACC-ASR-.YYYY.-']),
  company: z.string().optional(),
  asset: z.string(),
  asset_name: z.string().optional(),
  repair_status: z.enum(['Pending', 'Completed', 'Cancelled']).optional().default('Pending'),
  failure_date: z.string(),
  completion_date: z.string().optional(),
  downtime: z.string().optional(),
  amended_from: z.string().optional(),
  description: z.string().optional(),
  actions_performed: z.string().optional(),
  invoices: z.array(z.unknown()).optional(),
  repair_cost: z.number().optional().default(0),
  stock_items: z.array(z.unknown()).optional(),
  consumed_items_cost: z.number().optional(),
  capitalize_repair_cost: z.boolean().optional().default(false),
  increase_in_asset_life: z.number().int().optional(),
  total_repair_cost: z.number().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
});

export type AssetRepair = z.infer<typeof AssetRepairSchema>;

export const AssetRepairInsertSchema = AssetRepairSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetRepairInsert = z.infer<typeof AssetRepairInsertSchema>;

export const AssetRepairConsumedItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  warehouse: z.string(),
  valuation_rate: z.number().optional(),
  consumed_quantity: z.string().optional(),
  total_value: z.number().optional(),
  serial_no: z.string().optional(),
  serial_and_batch_bundle: z.string().optional(),
});

export type AssetRepairConsumedItem = z.infer<typeof AssetRepairConsumedItemSchema>;

export const AssetRepairConsumedItemInsertSchema = AssetRepairConsumedItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetRepairConsumedItemInsert = z.infer<typeof AssetRepairConsumedItemInsertSchema>;

export const AssetRepairPurchaseInvoiceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  purchase_invoice: z.string().optional(),
  expense_account: z.string(),
  repair_cost: z.number(),
});

export type AssetRepairPurchaseInvoice = z.infer<typeof AssetRepairPurchaseInvoiceSchema>;

export const AssetRepairPurchaseInvoiceInsertSchema = AssetRepairPurchaseInvoiceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetRepairPurchaseInvoiceInsert = z.infer<typeof AssetRepairPurchaseInvoiceInsertSchema>;

export const AssetShiftAllocationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  asset: z.string(),
  naming_series: z.enum(['ACC-ASA-.YYYY.-']),
  finance_book: z.string().optional(),
  amended_from: z.string().optional(),
  depreciation_schedule: z.array(z.unknown()).optional(),
});

export type AssetShiftAllocation = z.infer<typeof AssetShiftAllocationSchema>;

export const AssetShiftAllocationInsertSchema = AssetShiftAllocationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetShiftAllocationInsert = z.infer<typeof AssetShiftAllocationInsertSchema>;

export const AssetShiftFactorSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  shift_name: z.string(),
  shift_factor: z.number(),
  default: z.boolean().optional().default(false),
});

export type AssetShiftFactor = z.infer<typeof AssetShiftFactorSchema>;

export const AssetShiftFactorInsertSchema = AssetShiftFactorSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetShiftFactorInsert = z.infer<typeof AssetShiftFactorInsertSchema>;

export const AssetValueAdjustmentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string().optional(),
  asset: z.string(),
  asset_category: z.string().optional(),
  date: z.string(),
  finance_book: z.string().optional(),
  amended_from: z.string().optional(),
  current_asset_value: z.number(),
  new_asset_value: z.number(),
  difference_amount: z.number().optional(),
  difference_account: z.string(),
  journal_entry: z.string().optional(),
  cost_center: z.string().optional(),
});

export type AssetValueAdjustment = z.infer<typeof AssetValueAdjustmentSchema>;

export const AssetValueAdjustmentInsertSchema = AssetValueAdjustmentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetValueAdjustmentInsert = z.infer<typeof AssetValueAdjustmentInsertSchema>;

export const DepreciationScheduleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  schedule_date: z.string(),
  depreciation_amount: z.number(),
  accumulated_depreciation_amount: z.number().optional(),
  journal_entry: z.string().optional(),
  shift: z.string().optional(),
});

export type DepreciationSchedule = z.infer<typeof DepreciationScheduleSchema>;

export const DepreciationScheduleInsertSchema = DepreciationScheduleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DepreciationScheduleInsert = z.infer<typeof DepreciationScheduleInsertSchema>;

export const LinkedLocationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  location: z.string(),
});

export type LinkedLocation = z.infer<typeof LinkedLocationSchema>;

export const LinkedLocationInsertSchema = LinkedLocationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LinkedLocationInsert = z.infer<typeof LinkedLocationInsertSchema>;

export const LocationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  location_name: z.string(),
  parent_location: z.string().optional(),
  is_container: z.boolean().optional().default(false),
  is_group: z.boolean().optional().default(false),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  area: z.number().optional(),
  area_uom: z.string().optional(),
  location: z.unknown().optional(),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
});

export type Location = z.infer<typeof LocationSchema>;

export const LocationInsertSchema = LocationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LocationInsert = z.infer<typeof LocationInsertSchema>;

export const MaintenanceTeamMemberSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  team_member: z.string(),
  full_name: z.string().optional(),
  maintenance_role: z.string(),
});

export type MaintenanceTeamMember = z.infer<typeof MaintenanceTeamMemberSchema>;

export const MaintenanceTeamMemberInsertSchema = MaintenanceTeamMemberSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MaintenanceTeamMemberInsert = z.infer<typeof MaintenanceTeamMemberInsertSchema>;

export const BulkTransactionLogSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  date: z.string().optional(),
  log_entries: z.number().int().optional(),
  succeeded: z.number().int().optional(),
  failed: z.number().int().optional(),
});

export type BulkTransactionLog = z.infer<typeof BulkTransactionLogSchema>;

export const BulkTransactionLogInsertSchema = BulkTransactionLogSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BulkTransactionLogInsert = z.infer<typeof BulkTransactionLogInsertSchema>;

export const BulkTransactionLogDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  from_doctype: z.string().optional(),
  transaction_name: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  transaction_status: z.string().optional(),
  error_description: z.string().optional(),
  to_doctype: z.string().optional(),
  retried: z.number().int().optional(),
});

export type BulkTransactionLogDetail = z.infer<typeof BulkTransactionLogDetailSchema>;

export const BulkTransactionLogDetailInsertSchema = BulkTransactionLogDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BulkTransactionLogDetailInsert = z.infer<typeof BulkTransactionLogDetailInsertSchema>;

export const BuyingSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  supp_master_name: z.enum(['Supplier Name', 'Naming Series', 'Auto Name']).optional().default('Supplier Name'),
  supplier_group: z.string().optional(),
  buying_price_list: z.string().optional(),
  maintain_same_rate_action: z.enum(['Stop', 'Warn']).optional().default('Stop'),
  role_to_override_stop_action: z.string().optional(),
  po_required: z.enum(['No', 'Yes']).optional(),
  blanket_order_allowance: z.number().optional().default(0),
  pr_required: z.enum(['No', 'Yes']).optional(),
  project_update_frequency: z.enum(['Each Transaction', 'Manual']).optional().default('Each Transaction'),
  set_landed_cost_based_on_purchase_invoice_rate: z.boolean().optional().default(false),
  allow_zero_qty_in_supplier_quotation: z.boolean().optional().default(false),
  use_transaction_date_exchange_rate: z.boolean().optional().default(false),
  allow_zero_qty_in_request_for_quotation: z.boolean().optional().default(false),
  maintain_same_rate: z.boolean().optional().default(false),
  allow_multiple_items: z.boolean().optional().default(false),
  bill_for_rejected_quantity_in_purchase_invoice: z.boolean().optional().default(true),
  set_valuation_rate_for_rejected_materials: z.boolean().optional().default(false),
  disable_last_purchase_rate: z.boolean().optional().default(false),
  show_pay_button: z.boolean().optional().default(true),
  allow_zero_qty_in_purchase_order: z.boolean().optional().default(false),
  backflush_raw_materials_of_subcontract_based_on: z.enum(['BOM', 'Material Transferred for Subcontract']).optional().default('BOM'),
  over_transfer_allowance: z.number().optional(),
  validate_consumed_qty: z.boolean().optional().default(false),
  auto_create_subcontracting_order: z.boolean().optional().default(false),
  auto_create_purchase_receipt: z.boolean().optional().default(false),
  fixed_email: z.string().optional(),
});

export type BuyingSettings = z.infer<typeof BuyingSettingsSchema>;

export const BuyingSettingsInsertSchema = BuyingSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BuyingSettingsInsert = z.infer<typeof BuyingSettingsInsertSchema>;

export const CustomerNumberAtSupplierSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  customer_number: z.string().optional(),
});

export type CustomerNumberAtSupplier = z.infer<typeof CustomerNumberAtSupplierSchema>;

export const CustomerNumberAtSupplierInsertSchema = CustomerNumberAtSupplierSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CustomerNumberAtSupplierInsert = z.infer<typeof CustomerNumberAtSupplierInsertSchema>;

export const PurchaseOrderSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  title: z.string().default('{supplier_name}'),
  naming_series: z.enum(['PUR-ORD-.YYYY.-']),
  supplier: z.string(),
  supplier_name: z.string().optional(),
  order_confirmation_no: z.string().optional(),
  order_confirmation_date: z.string().optional(),
  transaction_date: z.string().default('Today'),
  schedule_date: z.string().optional(),
  company: z.string(),
  is_subcontracted: z.boolean().optional().default(false),
  has_unit_price_items: z.boolean().optional().default(false),
  supplier_warehouse: z.string().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  currency: z.string(),
  conversion_rate: z.number(),
  buying_price_list: z.string().optional(),
  price_list_currency: z.string().optional(),
  plc_conversion_rate: z.number().optional(),
  ignore_pricing_rule: z.boolean().optional().default(false),
  scan_barcode: z.string().optional(),
  last_scanned_warehouse: z.string().optional(),
  set_from_warehouse: z.string().optional(),
  set_warehouse: z.string().optional(),
  items: z.array(z.unknown()),
  total_qty: z.number().optional(),
  total_net_weight: z.number().optional(),
  base_total: z.number().optional(),
  base_net_total: z.number().optional(),
  total: z.number().optional(),
  net_total: z.number().optional(),
  pricing_rules: z.array(z.unknown()).optional(),
  set_reserve_warehouse: z.string().optional(),
  supplied_items: z.array(z.unknown()).optional(),
  tax_category: z.string().optional(),
  taxes_and_charges: z.string().optional(),
  shipping_rule: z.string().optional(),
  incoterm: z.string().optional(),
  named_place: z.string().optional(),
  taxes: z.array(z.unknown()).optional(),
  base_taxes_and_charges_added: z.number().optional(),
  base_taxes_and_charges_deducted: z.number().optional(),
  base_total_taxes_and_charges: z.number().optional(),
  taxes_and_charges_added: z.number().optional(),
  taxes_and_charges_deducted: z.number().optional(),
  total_taxes_and_charges: z.number().optional(),
  grand_total: z.number().optional(),
  disable_rounded_total: z.boolean().optional().default(false),
  rounding_adjustment: z.number().optional(),
  in_words: z.string().max(240).optional(),
  rounded_total: z.number().optional(),
  base_grand_total: z.number().optional(),
  base_rounding_adjustment: z.number().optional(),
  base_in_words: z.string().max(240).optional(),
  base_rounded_total: z.number().optional(),
  advance_paid: z.number().optional(),
  apply_discount_on: z.enum(['Grand Total', 'Net Total']).optional().default('Grand Total'),
  base_discount_amount: z.number().optional(),
  additional_discount_percentage: z.number().optional(),
  discount_amount: z.number().optional(),
  other_charges_calculation: z.string().optional(),
  item_wise_tax_details: z.array(z.unknown()).optional(),
  supplier_address: z.string().optional(),
  address_display: z.string().optional(),
  supplier_group: z.string().optional(),
  contact_person: z.string().optional(),
  contact_display: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().optional(),
  dispatch_address: z.string().optional(),
  dispatch_address_display: z.string().optional(),
  shipping_address: z.string().optional(),
  shipping_address_display: z.string().optional(),
  billing_address: z.string().optional(),
  billing_address_display: z.string().optional(),
  customer: z.string().optional(),
  customer_name: z.string().optional(),
  customer_contact_person: z.string().optional(),
  customer_contact_display: z.string().optional(),
  customer_contact_mobile: z.string().optional(),
  customer_contact_email: z.string().optional(),
  payment_terms_template: z.string().optional(),
  payment_schedule: z.array(z.unknown()).optional(),
  tc_name: z.string().optional(),
  terms: z.string().optional(),
  status: z.enum(['Draft', 'On Hold', 'To Receive and Bill', 'To Bill', 'To Receive', 'Completed', 'Cancelled', 'Closed', 'Delivered']).default('Draft'),
  advance_payment_status: z.enum(['Not Initiated', 'Initiated', 'Partially Paid', 'Fully Paid']).optional(),
  per_billed: z.number().optional(),
  per_received: z.number().optional(),
  letter_head: z.string().optional(),
  group_same_items: z.boolean().optional().default(false),
  select_print_heading: z.string().optional(),
  language: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  auto_repeat: z.string().optional(),
  party_account_currency: z.string().optional(),
  represents_company: z.string().optional(),
  ref_sq: z.string().optional(),
  amended_from: z.string().optional(),
  mps: z.string().optional(),
  is_internal_supplier: z.boolean().optional().default(false),
  inter_company_order_reference: z.string().optional(),
  is_old_subcontracting_flow: z.boolean().optional().default(false),
});

export type PurchaseOrder = z.infer<typeof PurchaseOrderSchema>;

export const PurchaseOrderInsertSchema = PurchaseOrderSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PurchaseOrderInsert = z.infer<typeof PurchaseOrderInsertSchema>;

export const PurchaseOrderItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  fg_item: z.string().optional(),
  fg_item_qty: z.number().optional().default(1),
  item_code: z.string(),
  supplier_part_no: z.string().optional(),
  item_name: z.string(),
  brand: z.string().optional(),
  product_bundle: z.string().optional(),
  schedule_date: z.string(),
  expected_delivery_date: z.string().optional(),
  item_group: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  qty: z.number(),
  stock_uom: z.string(),
  subcontracted_qty: z.number().optional().default(0),
  uom: z.string(),
  conversion_factor: z.number(),
  stock_qty: z.number().optional(),
  price_list_rate: z.number().optional(),
  last_purchase_rate: z.number().optional(),
  base_price_list_rate: z.number().optional(),
  margin_type: z.enum(['Percentage', 'Amount']).optional(),
  margin_rate_or_amount: z.number().optional(),
  rate_with_margin: z.number().optional(),
  discount_percentage: z.number().optional(),
  discount_amount: z.number().optional(),
  distributed_discount_amount: z.number().optional(),
  base_rate_with_margin: z.number().optional(),
  rate: z.number().optional(),
  amount: z.number().optional(),
  item_tax_template: z.string().optional(),
  base_rate: z.number(),
  base_amount: z.number(),
  pricing_rules: z.string().optional(),
  stock_uom_rate: z.number().optional(),
  is_free_item: z.boolean().optional().default(false),
  net_rate: z.number().optional(),
  net_amount: z.number().optional(),
  base_net_rate: z.number().optional(),
  base_net_amount: z.number().optional(),
  from_warehouse: z.string().optional(),
  warehouse: z.string().optional(),
  actual_qty: z.number().optional(),
  company_total_stock: z.number().optional(),
  material_request: z.string().optional(),
  material_request_item: z.string().optional(),
  sales_order: z.string().optional(),
  sales_order_item: z.string().optional(),
  sales_order_packed_item: z.string().optional(),
  supplier_quotation: z.string().optional(),
  supplier_quotation_item: z.string().optional(),
  delivered_by_supplier: z.boolean().optional().default(false),
  against_blanket_order: z.boolean().optional().default(false),
  blanket_order: z.string().optional(),
  blanket_order_rate: z.number().optional(),
  received_qty: z.number().optional(),
  returned_qty: z.number().optional(),
  billed_amt: z.number().optional(),
  expense_account: z.string().optional(),
  wip_composite_asset: z.string().optional(),
  manufacturer: z.string().optional(),
  manufacturer_part_no: z.string().optional(),
  bom: z.string().optional(),
  include_exploded_items: z.boolean().optional().default(false),
  weight_per_unit: z.number().optional(),
  total_weight: z.number().optional(),
  weight_uom: z.string().optional(),
  project: z.string().optional(),
  cost_center: z.string().optional(),
  is_fixed_asset: z.boolean().optional().default(false),
  item_tax_rate: z.string().optional(),
  production_plan: z.string().optional(),
  production_plan_item: z.string().optional(),
  production_plan_sub_assembly_item: z.string().optional(),
  page_break: z.boolean().optional().default(false),
  job_card: z.string().optional(),
});

export type PurchaseOrderItem = z.infer<typeof PurchaseOrderItemSchema>;

export const PurchaseOrderItemInsertSchema = PurchaseOrderItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PurchaseOrderItemInsert = z.infer<typeof PurchaseOrderItemInsertSchema>;

export const PurchaseOrderItemSuppliedSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  main_item_code: z.string().optional(),
  rm_item_code: z.string().optional(),
  stock_uom: z.string().optional(),
  reserve_warehouse: z.string().optional(),
  conversion_factor: z.number().optional(),
  bom_detail_no: z.string().optional(),
  reference_name: z.string().optional(),
  rate: z.number().optional(),
  amount: z.number().optional(),
  required_qty: z.number().optional(),
  supplied_qty: z.number().optional(),
  consumed_qty: z.number().optional(),
  returned_qty: z.number().optional(),
  total_supplied_qty: z.number().optional(),
});

export type PurchaseOrderItemSupplied = z.infer<typeof PurchaseOrderItemSuppliedSchema>;

export const PurchaseOrderItemSuppliedInsertSchema = PurchaseOrderItemSuppliedSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PurchaseOrderItemSuppliedInsert = z.infer<typeof PurchaseOrderItemSuppliedInsertSchema>;

export const PurchaseReceiptItemSuppliedSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  main_item_code: z.string().optional(),
  rm_item_code: z.string().optional(),
  item_name: z.string().optional(),
  bom_detail_no: z.string().optional(),
  description: z.string().optional(),
  stock_uom: z.string().optional(),
  conversion_factor: z.number().optional(),
  reference_name: z.string().optional(),
  rate: z.number().optional(),
  amount: z.number().optional(),
  required_qty: z.number().optional(),
  consumed_qty: z.number(),
  current_stock: z.number().optional(),
  batch_no: z.string().optional(),
  serial_no: z.string().optional(),
  purchase_order: z.string().optional(),
});

export type PurchaseReceiptItemSupplied = z.infer<typeof PurchaseReceiptItemSuppliedSchema>;

export const PurchaseReceiptItemSuppliedInsertSchema = PurchaseReceiptItemSuppliedSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PurchaseReceiptItemSuppliedInsert = z.infer<typeof PurchaseReceiptItemSuppliedInsertSchema>;

export const RequestForQuotationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['PUR-RFQ-.YYYY.-']),
  company: z.string(),
  billing_address: z.string().optional(),
  billing_address_display: z.string().optional(),
  vendor: z.string().optional(),
  transaction_date: z.string().default('Today'),
  schedule_date: z.string().optional(),
  status: z.enum(['Draft', 'Submitted', 'Cancelled']),
  has_unit_price_items: z.boolean().optional().default(false),
  amended_from: z.string().optional(),
  suppliers: z.array(z.unknown()),
  items: z.array(z.unknown()),
  email_template: z.string().optional(),
  html_llwp: z.string().optional(),
  send_attached_files: z.boolean().optional().default(true),
  send_document_print: z.boolean().optional().default(false),
  subject: z.string().default('Request for Quotation'),
  message_for_supplier: z.string().default('Please supply the specified items at the best possible rates'),
  incoterm: z.string().optional(),
  named_place: z.string().optional(),
  tc_name: z.string().optional(),
  terms: z.string().optional(),
  select_print_heading: z.string().optional(),
  letter_head: z.string().optional(),
  opportunity: z.string().optional(),
});

export type RequestForQuotation = z.infer<typeof RequestForQuotationSchema>;

export const RequestForQuotationInsertSchema = RequestForQuotationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RequestForQuotationInsert = z.infer<typeof RequestForQuotationInsertSchema>;

export const RequestForQuotationItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  supplier_part_no: z.string().optional(),
  item_name: z.string().optional(),
  schedule_date: z.string().default('Today'),
  description: z.string().optional(),
  item_group: z.string().optional(),
  brand: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  qty: z.number(),
  stock_uom: z.string(),
  uom: z.string(),
  conversion_factor: z.number(),
  stock_qty: z.number().optional(),
  warehouse: z.string().optional(),
  material_request: z.string().optional(),
  material_request_item: z.string().optional(),
  project_name: z.string().optional(),
  page_break: z.boolean().optional().default(false),
});

export type RequestForQuotationItem = z.infer<typeof RequestForQuotationItemSchema>;

export const RequestForQuotationItemInsertSchema = RequestForQuotationItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RequestForQuotationItemInsert = z.infer<typeof RequestForQuotationItemInsertSchema>;

export const RequestForQuotationSupplierSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  supplier: z.string(),
  contact: z.string().optional(),
  quote_status: z.enum(['Pending', 'Received']).optional(),
  supplier_name: z.string().optional(),
  email_id: z.string().optional(),
  send_email: z.boolean().optional().default(true),
  email_sent: z.boolean().optional().default(false),
});

export type RequestForQuotationSupplier = z.infer<typeof RequestForQuotationSupplierSchema>;

export const RequestForQuotationSupplierInsertSchema = RequestForQuotationSupplierSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RequestForQuotationSupplierInsert = z.infer<typeof RequestForQuotationSupplierInsertSchema>;

export const SupplierSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  naming_series: z.enum(['SUP-.YYYY.-']).optional(),
  supplier_name: z.string(),
  supplier_type: z.enum(['Company', 'Individual', 'Partnership']).default('Company'),
  gender: z.string().optional(),
  supplier_group: z.string().optional(),
  country: z.string().optional(),
  is_transporter: z.boolean().optional().default(false),
  image: z.string().optional(),
  default_currency: z.string().optional(),
  default_bank_account: z.string().optional(),
  default_price_list: z.string().optional(),
  is_internal_supplier: z.boolean().optional().default(false),
  represents_company: z.string().optional(),
  companies: z.array(z.unknown()).optional(),
  supplier_details: z.string().optional(),
  website: z.string().optional(),
  language: z.string().optional(),
  customer_numbers: z.array(z.unknown()).optional(),
  tax_id: z.string().optional(),
  tax_category: z.string().optional(),
  tax_withholding_category: z.string().optional(),
  tax_withholding_group: z.string().optional(),
  address_html: z.string().optional(),
  contact_html: z.string().optional(),
  supplier_primary_address: z.string().optional(),
  primary_address: z.string().optional(),
  supplier_primary_contact: z.string().optional(),
  mobile_no: z.string().optional(),
  email_id: z.string().optional(),
  payment_terms: z.string().optional(),
  accounts: z.array(z.unknown()).optional(),
  allow_purchase_invoice_creation_without_purchase_order: z.boolean().optional().default(false),
  allow_purchase_invoice_creation_without_purchase_receipt: z.boolean().optional().default(false),
  disabled: z.boolean().optional().default(false),
  is_frozen: z.boolean().optional().default(false),
  warn_rfqs: z.boolean().optional().default(false),
  warn_pos: z.boolean().optional().default(false),
  prevent_rfqs: z.boolean().optional().default(false),
  prevent_pos: z.boolean().optional().default(false),
  on_hold: z.boolean().optional().default(false),
  hold_type: z.enum(['All', 'Invoices', 'Payments']).optional(),
  release_date: z.string().optional(),
  portal_users: z.array(z.unknown()).optional(),
});

export type Supplier = z.infer<typeof SupplierSchema>;

export const SupplierInsertSchema = SupplierSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierInsert = z.infer<typeof SupplierInsertSchema>;

export const SupplierQuotationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  title: z.string().optional().default('{supplier_name}'),
  naming_series: z.enum(['PUR-SQTN-.YYYY.-']),
  supplier: z.string(),
  supplier_name: z.string().optional(),
  company: z.string(),
  status: z.enum(['Draft', 'Submitted', 'Stopped', 'Cancelled', 'Expired']),
  transaction_date: z.string().default('Today'),
  valid_till: z.string().optional(),
  quotation_number: z.string().optional(),
  has_unit_price_items: z.boolean().optional().default(false),
  amended_from: z.string().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  currency: z.string(),
  conversion_rate: z.number(),
  buying_price_list: z.string().optional(),
  price_list_currency: z.string().optional(),
  plc_conversion_rate: z.number().optional(),
  ignore_pricing_rule: z.boolean().optional().default(false),
  items: z.array(z.unknown()),
  total_qty: z.number().optional(),
  total_net_weight: z.number().optional(),
  base_total: z.number().optional(),
  base_net_total: z.number().optional(),
  total: z.number().optional(),
  net_total: z.number().optional(),
  tax_category: z.string().optional(),
  taxes_and_charges: z.string().optional(),
  shipping_rule: z.string().optional(),
  incoterm: z.string().optional(),
  named_place: z.string().optional(),
  taxes: z.array(z.unknown()).optional(),
  base_taxes_and_charges_added: z.number().optional(),
  base_taxes_and_charges_deducted: z.number().optional(),
  base_total_taxes_and_charges: z.number().optional(),
  taxes_and_charges_added: z.number().optional(),
  taxes_and_charges_deducted: z.number().optional(),
  total_taxes_and_charges: z.number().optional(),
  apply_discount_on: z.enum(['Grand Total', 'Net Total']).optional().default('Grand Total'),
  base_discount_amount: z.number().optional(),
  additional_discount_percentage: z.number().optional(),
  discount_amount: z.number().optional(),
  base_grand_total: z.number().optional(),
  base_rounding_adjustment: z.number().optional(),
  base_rounded_total: z.number().optional(),
  base_in_words: z.string().max(240).optional(),
  grand_total: z.number().optional(),
  rounding_adjustment: z.number().optional(),
  rounded_total: z.number().optional(),
  in_words: z.string().max(240).optional(),
  disable_rounded_total: z.boolean().optional().default(false),
  other_charges_calculation: z.string().optional(),
  item_wise_tax_details: z.array(z.unknown()).optional(),
  pricing_rules: z.array(z.unknown()).optional(),
  supplier_address: z.string().optional(),
  address_display: z.string().optional(),
  contact_person: z.string().optional(),
  contact_display: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().email().optional(),
  shipping_address: z.string().optional(),
  shipping_address_display: z.string().optional(),
  billing_address: z.string().optional(),
  billing_address_display: z.string().optional(),
  tc_name: z.string().optional(),
  terms: z.string().optional(),
  letter_head: z.string().optional(),
  group_same_items: z.boolean().optional().default(false),
  select_print_heading: z.string().optional(),
  language: z.string().optional(),
  auto_repeat: z.string().optional(),
  is_subcontracted: z.boolean().optional().default(false),
  opportunity: z.string().optional(),
});

export type SupplierQuotation = z.infer<typeof SupplierQuotationSchema>;

export const SupplierQuotationInsertSchema = SupplierQuotationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierQuotationInsert = z.infer<typeof SupplierQuotationInsertSchema>;

export const SupplierQuotationItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  supplier_part_no: z.string().optional(),
  item_name: z.string().optional(),
  lead_time_days: z.number().int().optional(),
  expected_delivery_date: z.string().optional(),
  is_free_item: z.boolean().optional().default(false),
  description: z.string().optional(),
  item_group: z.string().optional(),
  brand: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  qty: z.number(),
  stock_uom: z.string(),
  uom: z.string(),
  conversion_factor: z.number(),
  stock_qty: z.number().optional(),
  price_list_rate: z.number().optional(),
  base_price_list_rate: z.number().optional(),
  margin_type: z.enum(['Percentage', 'Amount']).optional(),
  margin_rate_or_amount: z.number().optional(),
  rate_with_margin: z.number().optional(),
  discount_percentage: z.number().optional(),
  discount_amount: z.number().optional(),
  distributed_discount_amount: z.number().optional(),
  rate: z.number().optional(),
  amount: z.number().optional(),
  item_tax_template: z.string().optional(),
  base_rate: z.number(),
  base_amount: z.number(),
  pricing_rules: z.string().optional(),
  net_rate: z.number().optional(),
  net_amount: z.number().optional(),
  base_net_rate: z.number().optional(),
  base_net_amount: z.number().optional(),
  weight_per_unit: z.number().optional(),
  total_weight: z.number().optional(),
  weight_uom: z.string().optional(),
  warehouse: z.string().optional(),
  prevdoc_doctype: z.string().optional(),
  material_request: z.string().optional(),
  sales_order: z.string().optional(),
  request_for_quotation: z.string().optional(),
  material_request_item: z.string().optional(),
  request_for_quotation_item: z.string().optional(),
  item_tax_rate: z.string().optional(),
  manufacturer: z.string().optional(),
  manufacturer_part_no: z.string().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  page_break: z.boolean().optional().default(false),
});

export type SupplierQuotationItem = z.infer<typeof SupplierQuotationItemSchema>;

export const SupplierQuotationItemInsertSchema = SupplierQuotationItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierQuotationItemInsert = z.infer<typeof SupplierQuotationItemInsertSchema>;

export const SupplierScorecardSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  supplier: z.string().optional(),
  supplier_score: z.string().optional(),
  indicator_color: z.string().optional(),
  status: z.string().optional(),
  period: z.enum(['Per Week', 'Per Month', 'Per Year']).default('Per Month'),
  weighting_function: z.string().default('{total_score} * max( 0, min ( 1 , (12 - {period_number}) / 12) )'),
  standings: z.array(z.unknown()),
  criteria: z.array(z.unknown()),
  warn_rfqs: z.boolean().optional().default(false),
  warn_pos: z.boolean().optional().default(false),
  prevent_rfqs: z.boolean().optional().default(false),
  prevent_pos: z.boolean().optional().default(false),
  notify_supplier: z.boolean().optional().default(false),
  notify_employee: z.boolean().optional().default(false),
  employee: z.string().optional(),
});

export type SupplierScorecard = z.infer<typeof SupplierScorecardSchema>;

export const SupplierScorecardInsertSchema = SupplierScorecardSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierScorecardInsert = z.infer<typeof SupplierScorecardInsertSchema>;

export const SupplierScorecardCriteriaSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  criteria_name: z.string(),
  max_score: z.number().default(100),
  formula: z.string(),
  weight: z.number().optional(),
});

export type SupplierScorecardCriteria = z.infer<typeof SupplierScorecardCriteriaSchema>;

export const SupplierScorecardCriteriaInsertSchema = SupplierScorecardCriteriaSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierScorecardCriteriaInsert = z.infer<typeof SupplierScorecardCriteriaInsertSchema>;

export const SupplierScorecardPeriodSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  supplier: z.string(),
  naming_series: z.enum(['PU-SSP-.YYYY.-']),
  total_score: z.number().optional(),
  start_date: z.string(),
  end_date: z.string(),
  criteria: z.array(z.unknown()),
  variables: z.array(z.unknown()).optional(),
  scorecard: z.string(),
  amended_from: z.string().optional(),
});

export type SupplierScorecardPeriod = z.infer<typeof SupplierScorecardPeriodSchema>;

export const SupplierScorecardPeriodInsertSchema = SupplierScorecardPeriodSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierScorecardPeriodInsert = z.infer<typeof SupplierScorecardPeriodInsertSchema>;

export const SupplierScorecardScoringCriteriaSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  criteria_name: z.string(),
  score: z.number().optional(),
  weight: z.number(),
  max_score: z.number().optional().default(100),
  formula: z.string().optional(),
});

export type SupplierScorecardScoringCriteria = z.infer<typeof SupplierScorecardScoringCriteriaSchema>;

export const SupplierScorecardScoringCriteriaInsertSchema = SupplierScorecardScoringCriteriaSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierScorecardScoringCriteriaInsert = z.infer<typeof SupplierScorecardScoringCriteriaInsertSchema>;

export const SupplierScorecardScoringStandingSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  standing_name: z.string().optional(),
  standing_color: z.enum(['Blue', 'Purple', 'Green', 'Yellow', 'Orange', 'Red']).optional(),
  min_grade: z.number().optional(),
  max_grade: z.number().optional(),
  warn_rfqs: z.boolean().optional().default(false),
  warn_pos: z.boolean().optional().default(false),
  prevent_rfqs: z.boolean().optional().default(false),
  prevent_pos: z.boolean().optional().default(false),
  notify_supplier: z.boolean().optional().default(false),
  notify_employee: z.boolean().optional().default(false),
  employee_link: z.string().optional(),
});

export type SupplierScorecardScoringStanding = z.infer<typeof SupplierScorecardScoringStandingSchema>;

export const SupplierScorecardScoringStandingInsertSchema = SupplierScorecardScoringStandingSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierScorecardScoringStandingInsert = z.infer<typeof SupplierScorecardScoringStandingInsertSchema>;

export const SupplierScorecardScoringVariableSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  variable_label: z.string(),
  description: z.string().optional(),
  value: z.number().optional(),
  param_name: z.string().optional(),
  path: z.string().optional(),
});

export type SupplierScorecardScoringVariable = z.infer<typeof SupplierScorecardScoringVariableSchema>;

export const SupplierScorecardScoringVariableInsertSchema = SupplierScorecardScoringVariableSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierScorecardScoringVariableInsert = z.infer<typeof SupplierScorecardScoringVariableInsertSchema>;

export const SupplierScorecardStandingSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  standing_name: z.string().optional(),
  standing_color: z.enum(['Blue', 'Purple', 'Green', 'Yellow', 'Orange', 'Red']).optional(),
  min_grade: z.number().optional(),
  max_grade: z.number().optional(),
  warn_rfqs: z.boolean().optional().default(false),
  warn_pos: z.boolean().optional().default(false),
  prevent_rfqs: z.boolean().optional().default(false),
  prevent_pos: z.boolean().optional().default(false),
  notify_supplier: z.boolean().optional().default(false),
  notify_employee: z.boolean().optional().default(false),
  employee_link: z.string().optional(),
});

export type SupplierScorecardStanding = z.infer<typeof SupplierScorecardStandingSchema>;

export const SupplierScorecardStandingInsertSchema = SupplierScorecardStandingSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierScorecardStandingInsert = z.infer<typeof SupplierScorecardStandingInsertSchema>;

export const SupplierScorecardVariableSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  variable_label: z.string(),
  is_custom: z.boolean().optional().default(false),
  param_name: z.string(),
  path: z.string(),
  description: z.string().optional(),
});

export type SupplierScorecardVariable = z.infer<typeof SupplierScorecardVariableSchema>;

export const SupplierScorecardVariableInsertSchema = SupplierScorecardVariableSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierScorecardVariableInsert = z.infer<typeof SupplierScorecardVariableInsertSchema>;

export const AppointmentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  scheduled_time: z.string(),
  status: z.enum(['Open', 'Unverified', 'Closed']),
  customer_name: z.string(),
  customer_phone_number: z.string().optional(),
  customer_skype: z.string().optional(),
  customer_email: z.string(),
  customer_details: z.string().optional(),
  appointment_with: z.string().optional(),
  party: z.string().optional(),
  calendar_event: z.string().optional(),
});

export type Appointment = z.infer<typeof AppointmentSchema>;

export const AppointmentInsertSchema = AppointmentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AppointmentInsert = z.infer<typeof AppointmentInsertSchema>;

export const AppointmentBookingSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  enable_scheduling: z.boolean().default(false),
  availability_of_slots: z.array(z.unknown()),
  number_of_agents: z.number().int().default(1),
  agent_list: z.array(z.unknown()),
  holiday_list: z.string(),
  appointment_duration: z.number().int().default(60),
  email_reminders: z.boolean().optional().default(false),
  advance_booking_days: z.number().int().default(7),
  success_redirect_url: z.string().optional(),
});

export type AppointmentBookingSettings = z.infer<typeof AppointmentBookingSettingsSchema>;

export const AppointmentBookingSettingsInsertSchema = AppointmentBookingSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AppointmentBookingSettingsInsert = z.infer<typeof AppointmentBookingSettingsInsertSchema>;

export const AppointmentBookingSlotsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  day_of_week: z.enum(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
  from_time: z.string(),
  to_time: z.string(),
});

export type AppointmentBookingSlots = z.infer<typeof AppointmentBookingSlotsSchema>;

export const AppointmentBookingSlotsInsertSchema = AppointmentBookingSlotsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AppointmentBookingSlotsInsert = z.infer<typeof AppointmentBookingSlotsInsertSchema>;

export const AvailabilityOfSlotsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  day_of_week: z.enum(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
  from_time: z.string(),
  to_time: z.string(),
});

export type AvailabilityOfSlots = z.infer<typeof AvailabilityOfSlotsSchema>;

export const AvailabilityOfSlotsInsertSchema = AvailabilityOfSlotsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AvailabilityOfSlotsInsert = z.infer<typeof AvailabilityOfSlotsInsertSchema>;

export const CrmNoteSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  note: z.string().optional(),
  added_by: z.string().optional(),
  added_on: z.string().optional(),
});

export type CrmNote = z.infer<typeof CrmNoteSchema>;

export const CrmNoteInsertSchema = CrmNoteSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CrmNoteInsert = z.infer<typeof CrmNoteInsertSchema>;

export const CrmSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  campaign_naming_by: z.enum(['Campaign Name', 'Naming Series']).optional(),
  allow_lead_duplication_based_on_emails: z.boolean().optional().default(false),
  auto_creation_of_contact: z.boolean().optional().default(true),
  close_opportunity_after_days: z.number().int().optional().default(15),
  default_valid_till: z.string().optional(),
  carry_forward_communication_and_comments: z.boolean().optional().default(false),
  update_timestamp_on_new_communication: z.boolean().optional().default(false),
});

export type CrmSettings = z.infer<typeof CrmSettingsSchema>;

export const CrmSettingsInsertSchema = CrmSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CrmSettingsInsert = z.infer<typeof CrmSettingsInsertSchema>;

export const CampaignSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  campaign_name: z.string(),
  naming_series: z.enum(['SAL-CAM-.YYYY.-']).optional(),
  campaign_schedules: z.array(z.unknown()).optional(),
  description: z.string().optional(),
});

export type Campaign = z.infer<typeof CampaignSchema>;

export const CampaignInsertSchema = CampaignSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CampaignInsert = z.infer<typeof CampaignInsertSchema>;

export const CampaignEmailScheduleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  email_template: z.string(),
  send_after_days: z.number().int(),
});

export type CampaignEmailSchedule = z.infer<typeof CampaignEmailScheduleSchema>;

export const CampaignEmailScheduleInsertSchema = CampaignEmailScheduleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CampaignEmailScheduleInsert = z.infer<typeof CampaignEmailScheduleInsertSchema>;

export const CompetitorSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  competitor_name: z.string(),
  website: z.string().optional(),
});

export type Competitor = z.infer<typeof CompetitorSchema>;

export const CompetitorInsertSchema = CompetitorSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CompetitorInsert = z.infer<typeof CompetitorInsertSchema>;

export const CompetitorDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  competitor: z.string(),
});

export type CompetitorDetail = z.infer<typeof CompetitorDetailSchema>;

export const CompetitorDetailInsertSchema = CompetitorDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CompetitorDetailInsert = z.infer<typeof CompetitorDetailInsertSchema>;

export const ContractSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  party_type: z.enum(['Customer', 'Supplier', 'Employee']).default('Customer'),
  is_signed: z.boolean().optional().default(false),
  party_name: z.string(),
  party_user: z.string().optional(),
  status: z.enum(['Unsigned', 'Active', 'Inactive', 'Cancelled']).optional(),
  fulfilment_status: z.enum(['N/A', 'Unfulfilled', 'Partially Fulfilled', 'Fulfilled', 'Lapsed']).optional(),
  party_full_name: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  signee: z.string().optional(),
  signed_on: z.string().optional(),
  ip_address: z.string().optional(),
  contract_template: z.string().optional(),
  contract_terms: z.string(),
  requires_fulfilment: z.boolean().optional().default(false),
  fulfilment_deadline: z.string().optional(),
  fulfilment_terms: z.array(z.unknown()).optional(),
  signee_company: z.string().optional(),
  signed_by_company: z.string().optional(),
  document_type: z.enum(['Quotation', 'Project', 'Sales Order', 'Purchase Order', 'Sales Invoice', 'Purchase Invoice']).optional(),
  document_name: z.string().optional(),
  amended_from: z.string().optional(),
});

export type Contract = z.infer<typeof ContractSchema>;

export const ContractInsertSchema = ContractSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ContractInsert = z.infer<typeof ContractInsertSchema>;

export const ContractFulfilmentChecklistSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  fulfilled: z.boolean().optional().default(false),
  requirement: z.string().optional(),
  notes: z.string().optional(),
  amended_from: z.string().optional(),
});

export type ContractFulfilmentChecklist = z.infer<typeof ContractFulfilmentChecklistSchema>;

export const ContractFulfilmentChecklistInsertSchema = ContractFulfilmentChecklistSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ContractFulfilmentChecklistInsert = z.infer<typeof ContractFulfilmentChecklistInsertSchema>;

export const ContractTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  title: z.string().optional(),
  contract_terms: z.string().optional(),
  requires_fulfilment: z.boolean().optional().default(false),
  fulfilment_terms: z.array(z.unknown()).optional(),
  contract_template_help: z.string().optional(),
});

export type ContractTemplate = z.infer<typeof ContractTemplateSchema>;

export const ContractTemplateInsertSchema = ContractTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ContractTemplateInsert = z.infer<typeof ContractTemplateInsertSchema>;

export const ContractTemplateFulfilmentTermsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  requirement: z.string().optional(),
});

export type ContractTemplateFulfilmentTerms = z.infer<typeof ContractTemplateFulfilmentTermsSchema>;

export const ContractTemplateFulfilmentTermsInsertSchema = ContractTemplateFulfilmentTermsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ContractTemplateFulfilmentTermsInsert = z.infer<typeof ContractTemplateFulfilmentTermsInsertSchema>;

export const EmailCampaignSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  campaign_name: z.string(),
  email_campaign_for: z.enum(['Lead', 'Contact', 'Email Group']).default('Lead'),
  recipient: z.string(),
  sender: z.string().optional().default('__user'),
  start_date: z.string(),
  end_date: z.string().optional(),
  status: z.enum(['Scheduled', 'In Progress', 'Completed', 'Unsubscribed']).optional(),
});

export type EmailCampaign = z.infer<typeof EmailCampaignSchema>;

export const EmailCampaignInsertSchema = EmailCampaignSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type EmailCampaignInsert = z.infer<typeof EmailCampaignInsertSchema>;

export const LeadSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  naming_series: z.enum(['CRM-LEAD-.YYYY.-']).optional(),
  salutation: z.string().optional(),
  first_name: z.string().optional(),
  middle_name: z.string().optional(),
  last_name: z.string().optional(),
  lead_name: z.string().optional(),
  job_title: z.string().optional(),
  gender: z.string().optional(),
  lead_owner: z.string().optional().default('__user'),
  status: z.enum(['Lead', 'Open', 'Replied', 'Opportunity', 'Quotation', 'Lost Quotation', 'Interested', 'Converted', 'Do Not Contact']).default('Lead'),
  customer: z.string().optional(),
  type: z.enum(['Client', 'Channel Partner', 'Consultant']).optional(),
  request_type: z.enum(['Product Enquiry', 'Request for Information', 'Suggestions', 'Other']).optional(),
  email_id: z.string().email().optional(),
  website: z.string().optional(),
  mobile_no: z.string().optional(),
  whatsapp_no: z.string().optional(),
  phone: z.string().optional(),
  phone_ext: z.string().optional(),
  company_name: z.string().optional(),
  no_of_employees: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']).optional(),
  annual_revenue: z.number().optional(),
  industry: z.string().optional(),
  market_segment: z.string().optional(),
  territory: z.string().optional(),
  fax: z.string().optional(),
  address_html: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  contact_html: z.string().optional(),
  utm_source: z.string().optional(),
  utm_content: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_medium: z.string().optional(),
  qualification_status: z.enum(['Unqualified', 'In Process', 'Qualified']).optional(),
  qualified_by: z.string().optional(),
  qualified_on: z.string().optional(),
  company: z.string().optional(),
  language: z.string().optional(),
  image: z.string().optional(),
  title: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  unsubscribed: z.boolean().optional().default(false),
  blog_subscriber: z.boolean().optional().default(false),
  open_activities_html: z.string().optional(),
  all_activities_html: z.string().optional(),
  notes_html: z.string().optional(),
  notes: z.array(z.unknown()).optional(),
});

export type Lead = z.infer<typeof LeadSchema>;

export const LeadInsertSchema = LeadSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LeadInsert = z.infer<typeof LeadInsertSchema>;

export const LostReasonDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  lost_reason: z.string().optional(),
});

export type LostReasonDetail = z.infer<typeof LostReasonDetailSchema>;

export const LostReasonDetailInsertSchema = LostReasonDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LostReasonDetailInsert = z.infer<typeof LostReasonDetailInsertSchema>;

export const MarketSegmentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  market_segment: z.string().optional(),
});

export type MarketSegment = z.infer<typeof MarketSegmentSchema>;

export const MarketSegmentInsertSchema = MarketSegmentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MarketSegmentInsert = z.infer<typeof MarketSegmentInsertSchema>;

export const OpportunitySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  naming_series: z.enum(['CRM-OPP-.YYYY.-']),
  opportunity_from: z.string(),
  party_name: z.string(),
  customer_name: z.string().optional(),
  status: z.enum(['Open', 'Quotation', 'Converted', 'Lost', 'Replied', 'Closed']).default('Open'),
  opportunity_type: z.string().optional(),
  opportunity_owner: z.string().optional(),
  sales_stage: z.string().optional().default('Prospecting'),
  expected_closing: z.string().optional(),
  probability: z.number().optional().default(100),
  no_of_employees: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']).optional(),
  annual_revenue: z.number().optional(),
  customer_group: z.string().optional(),
  industry: z.string().optional(),
  market_segment: z.string().optional(),
  website: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  territory: z.string().optional(),
  currency: z.string().optional(),
  conversion_rate: z.number().optional(),
  opportunity_amount: z.number().optional(),
  base_opportunity_amount: z.number().optional(),
  utm_source: z.string().optional(),
  utm_content: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_medium: z.string().optional(),
  company: z.string(),
  transaction_date: z.string().default('Today'),
  language: z.string().optional(),
  amended_from: z.string().optional(),
  title: z.string().optional(),
  first_response_time: z.number().optional(),
  lost_reasons: z.array(z.unknown()).optional(),
  order_lost_reason: z.string().optional(),
  competitors: z.array(z.unknown()).optional(),
  contact_person: z.string().optional(),
  job_title: z.string().optional(),
  contact_email: z.string().email().optional(),
  contact_mobile: z.string().optional(),
  whatsapp: z.string().optional(),
  phone: z.string().optional(),
  phone_ext: z.string().optional(),
  address_html: z.string().optional(),
  customer_address: z.string().optional(),
  address_display: z.string().optional(),
  contact_html: z.string().optional(),
  contact_display: z.string().optional(),
  items: z.array(z.unknown()).optional(),
  base_total: z.number().optional(),
  total: z.number().optional(),
  open_activities_html: z.string().optional(),
  all_activities_html: z.string().optional(),
  notes_html: z.string().optional(),
  notes: z.array(z.unknown()).optional(),
});

export type Opportunity = z.infer<typeof OpportunitySchema>;

export const OpportunityInsertSchema = OpportunitySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type OpportunityInsert = z.infer<typeof OpportunityInsertSchema>;

export const OpportunityItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  uom: z.string().optional(),
  qty: z.number().optional().default(1),
  brand: z.string().optional(),
  item_group: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  base_rate: z.number(),
  base_amount: z.number(),
  rate: z.number(),
  amount: z.number(),
});

export type OpportunityItem = z.infer<typeof OpportunityItemSchema>;

export const OpportunityItemInsertSchema = OpportunityItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type OpportunityItemInsert = z.infer<typeof OpportunityItemInsertSchema>;

export const OpportunityLostReasonSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  lost_reason: z.string().optional(),
});

export type OpportunityLostReason = z.infer<typeof OpportunityLostReasonSchema>;

export const OpportunityLostReasonInsertSchema = OpportunityLostReasonSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type OpportunityLostReasonInsert = z.infer<typeof OpportunityLostReasonInsertSchema>;

export const OpportunityLostReasonDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  lost_reason: z.string().optional(),
});

export type OpportunityLostReasonDetail = z.infer<typeof OpportunityLostReasonDetailSchema>;

export const OpportunityLostReasonDetailInsertSchema = OpportunityLostReasonDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type OpportunityLostReasonDetailInsert = z.infer<typeof OpportunityLostReasonDetailInsertSchema>;

export const OpportunityTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  description: z.string().optional(),
});

export type OpportunityType = z.infer<typeof OpportunityTypeSchema>;

export const OpportunityTypeInsertSchema = OpportunityTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type OpportunityTypeInsert = z.infer<typeof OpportunityTypeInsertSchema>;

export const ProspectSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company_name: z.string().optional(),
  customer_group: z.string().optional(),
  no_of_employees: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']).optional(),
  annual_revenue: z.number().optional(),
  market_segment: z.string().optional(),
  industry: z.string().optional(),
  territory: z.string().optional(),
  prospect_owner: z.string().optional(),
  website: z.string().optional(),
  fax: z.string().optional(),
  company: z.string(),
  address_html: z.string().optional(),
  contact_html: z.string().optional(),
  leads: z.array(z.unknown()).optional(),
  opportunities: z.array(z.unknown()).optional(),
  open_activities_html: z.string().optional(),
  all_activities_html: z.string().optional(),
  notes_html: z.string().optional(),
  notes: z.array(z.unknown()).optional(),
});

export type Prospect = z.infer<typeof ProspectSchema>;

export const ProspectInsertSchema = ProspectSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProspectInsert = z.infer<typeof ProspectInsertSchema>;

export const ProspectLeadSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  lead: z.string(),
  lead_name: z.string().optional(),
  email: z.string().email().optional(),
  mobile_no: z.string().optional(),
  lead_owner: z.string().optional(),
  status: z.string().optional(),
});

export type ProspectLead = z.infer<typeof ProspectLeadSchema>;

export const ProspectLeadInsertSchema = ProspectLeadSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProspectLeadInsert = z.infer<typeof ProspectLeadInsertSchema>;

export const ProspectOpportunitySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  opportunity: z.string().optional(),
  amount: z.number().optional(),
  stage: z.string().optional(),
  deal_owner: z.string().optional(),
  probability: z.number().optional(),
  expected_closing: z.string().optional(),
  currency: z.string().optional(),
  contact_person: z.string().optional(),
});

export type ProspectOpportunity = z.infer<typeof ProspectOpportunitySchema>;

export const ProspectOpportunityInsertSchema = ProspectOpportunitySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProspectOpportunityInsert = z.infer<typeof ProspectOpportunityInsertSchema>;

export const SalesStageSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  stage_name: z.string().optional(),
});

export type SalesStage = z.infer<typeof SalesStageSchema>;

export const SalesStageInsertSchema = SalesStageSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesStageInsert = z.infer<typeof SalesStageInsertSchema>;

export const CommunicationMediumSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  communication_channel: z.string().optional(),
  communication_medium_type: z.enum(['Voice', 'Email', 'Chat']),
  catch_all: z.string().optional(),
  provider: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  timeslots: z.array(z.unknown()).optional(),
});

export type CommunicationMedium = z.infer<typeof CommunicationMediumSchema>;

export const CommunicationMediumInsertSchema = CommunicationMediumSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CommunicationMediumInsert = z.infer<typeof CommunicationMediumInsertSchema>;

export const CommunicationMediumTimeslotSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  day_of_week: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  from_time: z.string(),
  to_time: z.string(),
  employee_group: z.string(),
});

export type CommunicationMediumTimeslot = z.infer<typeof CommunicationMediumTimeslotSchema>;

export const CommunicationMediumTimeslotInsertSchema = CommunicationMediumTimeslotSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CommunicationMediumTimeslotInsert = z.infer<typeof CommunicationMediumTimeslotInsertSchema>;

export const CodeListSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  title: z.string().optional(),
  canonical_uri: z.string().optional(),
  url: z.string().optional(),
  default_common_code: z.string().optional(),
  version: z.string().optional(),
  publisher: z.string().optional(),
  publisher_id: z.string().optional(),
  description: z.string().optional(),
});

export type CodeList = z.infer<typeof CodeListSchema>;

export const CodeListInsertSchema = CodeListSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CodeListInsert = z.infer<typeof CodeListInsertSchema>;

export const CommonCodeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  code_list: z.string(),
  canonical_uri: z.string().optional(),
  title: z.string().max(300),
  common_code: z.string().max(300),
  description: z.string().optional(),
  additional_data: z.string().optional(),
  applies_to: z.array(z.unknown()).optional(),
});

export type CommonCode = z.infer<typeof CommonCodeSchema>;

export const CommonCodeInsertSchema = CommonCodeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CommonCodeInsert = z.infer<typeof CommonCodeInsertSchema>;

export const PlaidSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  enabled: z.boolean().optional().default(false),
  automatic_sync: z.boolean().optional().default(false),
  plaid_client_id: z.string().optional(),
  plaid_secret: z.string().optional(),
  plaid_env: z.enum(['sandbox', 'development', 'production']).optional(),
  enable_european_access: z.boolean().optional().default(false),
});

export type PlaidSettings = z.infer<typeof PlaidSettingsSchema>;

export const PlaidSettingsInsertSchema = PlaidSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PlaidSettingsInsert = z.infer<typeof PlaidSettingsInsertSchema>;

export const MaintenanceScheduleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MAT-MSH-.YYYY.-']),
  customer: z.string().optional(),
  status: z.enum(['Draft', 'Submitted', 'Cancelled']).default('Draft'),
  transaction_date: z.string(),
  items: z.array(z.unknown()),
  schedules: z.array(z.unknown()).optional(),
  customer_name: z.string().optional(),
  contact_person: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().email().optional(),
  contact_display: z.string().optional(),
  customer_address: z.string().optional(),
  address_display: z.string().optional(),
  territory: z.string().optional(),
  customer_group: z.string().optional(),
  company: z.string(),
  amended_from: z.string().optional(),
});

export type MaintenanceSchedule = z.infer<typeof MaintenanceScheduleSchema>;

export const MaintenanceScheduleInsertSchema = MaintenanceScheduleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MaintenanceScheduleInsert = z.infer<typeof MaintenanceScheduleInsertSchema>;

export const MaintenanceScheduleDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  scheduled_date: z.string(),
  actual_date: z.string().optional(),
  sales_person: z.string().optional(),
  completion_status: z.enum(['Pending', 'Partially Completed', 'Fully Completed']).optional().default('Pending'),
  serial_no: z.string().optional(),
  item_reference: z.string().optional(),
});

export type MaintenanceScheduleDetail = z.infer<typeof MaintenanceScheduleDetailSchema>;

export const MaintenanceScheduleDetailInsertSchema = MaintenanceScheduleDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MaintenanceScheduleDetailInsert = z.infer<typeof MaintenanceScheduleDetailInsertSchema>;

export const MaintenanceScheduleItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  start_date: z.string(),
  end_date: z.string(),
  periodicity: z.enum(['Weekly', 'Monthly', 'Quarterly', 'Half Yearly', 'Yearly', 'Random']).optional(),
  no_of_visits: z.number().int(),
  sales_person: z.string().optional(),
  serial_no: z.string().optional(),
  sales_order: z.string().optional(),
  serial_and_batch_bundle: z.string().optional(),
});

export type MaintenanceScheduleItem = z.infer<typeof MaintenanceScheduleItemSchema>;

export const MaintenanceScheduleItemInsertSchema = MaintenanceScheduleItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MaintenanceScheduleItemInsert = z.infer<typeof MaintenanceScheduleItemInsertSchema>;

export const MaintenanceVisitSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MAT-MVS-.YYYY.-']),
  customer: z.string(),
  customer_name: z.string().optional(),
  address_display: z.string().optional(),
  contact_display: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().email().optional(),
  maintenance_schedule: z.string().optional(),
  maintenance_schedule_detail: z.string().optional(),
  mntc_date: z.string().default('Today'),
  mntc_time: z.string().optional(),
  completion_status: z.enum(['Partially Completed', 'Fully Completed']),
  maintenance_type: z.enum(['Scheduled', 'Unscheduled', 'Breakdown']).default('Unscheduled'),
  purposes: z.array(z.unknown()).optional(),
  customer_feedback: z.string().optional(),
  status: z.enum(['Draft', 'Cancelled', 'Submitted']).default('Draft'),
  amended_from: z.string().optional(),
  company: z.string(),
  customer_address: z.string().optional(),
  contact_person: z.string().optional(),
  territory: z.string().optional(),
  customer_group: z.string().optional(),
});

export type MaintenanceVisit = z.infer<typeof MaintenanceVisitSchema>;

export const MaintenanceVisitInsertSchema = MaintenanceVisitSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MaintenanceVisitInsert = z.infer<typeof MaintenanceVisitInsertSchema>;

export const MaintenanceVisitPurposeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  service_person: z.string(),
  serial_no: z.string().optional(),
  description: z.string().optional(),
  work_done: z.string(),
  prevdoc_doctype: z.string().optional(),
  prevdoc_docname: z.string().optional(),
  maintenance_schedule_detail: z.string().optional(),
});

export type MaintenanceVisitPurpose = z.infer<typeof MaintenanceVisitPurposeSchema>;

export const MaintenanceVisitPurposeInsertSchema = MaintenanceVisitPurposeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MaintenanceVisitPurposeInsert = z.infer<typeof MaintenanceVisitPurposeInsertSchema>;

export const BomSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  item: z.string(),
  company: z.string(),
  uom: z.string().optional(),
  quantity: z.number().default(1),
  is_active: z.boolean().optional().default(true),
  is_default: z.boolean().optional().default(true),
  allow_alternative_item: z.boolean().optional().default(false),
  set_rate_of_sub_assembly_item_based_on_bom: z.boolean().optional().default(true),
  is_phantom_bom: z.boolean().optional().default(false),
  project: z.string().optional(),
  image: z.string().optional(),
  rm_cost_as_per: z.enum(['Valuation Rate', 'Last Purchase Rate', 'Price List']).optional().default('Valuation Rate'),
  buying_price_list: z.string().optional(),
  price_list_currency: z.string().optional(),
  plc_conversion_rate: z.number().optional(),
  currency: z.string(),
  conversion_rate: z.number().default(1),
  with_operations: z.boolean().optional().default(false),
  track_semi_finished_goods: z.boolean().optional().default(false),
  transfer_material_against: z.enum(['Work Order', 'Job Card']).optional().default('Work Order'),
  routing: z.string().optional(),
  fg_based_operating_cost: z.boolean().optional().default(false),
  default_source_warehouse: z.string().optional(),
  default_target_warehouse: z.string().optional(),
  operating_cost_per_bom_quantity: z.number().optional(),
  operations: z.array(z.unknown()).optional(),
  items: z.array(z.unknown()),
  scrap_items: z.array(z.unknown()).optional(),
  process_loss_percentage: z.number().optional(),
  process_loss_qty: z.number().optional(),
  operating_cost: z.number().optional(),
  raw_material_cost: z.number().optional(),
  scrap_material_cost: z.number().optional(),
  base_operating_cost: z.number().optional(),
  base_raw_material_cost: z.number().optional(),
  base_scrap_material_cost: z.number().optional(),
  total_cost: z.number().optional(),
  base_total_cost: z.number().optional(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  has_variants: z.boolean().optional().default(false),
  inspection_required: z.boolean().optional().default(false),
  quality_inspection_template: z.string().optional(),
  exploded_items: z.array(z.unknown()).optional(),
  show_in_website: z.boolean().optional().default(false),
  route: z.string().optional(),
  website_image: z.string().optional(),
  thumbnail: z.string().optional(),
  show_items: z.boolean().optional().default(false),
  show_operations: z.boolean().optional().default(false),
  web_long_description: z.string().optional(),
  bom_creator: z.string().optional(),
  bom_creator_item: z.string().optional(),
  amended_from: z.string().optional(),
});

export type Bom = z.infer<typeof BomSchema>;

export const BomInsertSchema = BomSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomInsert = z.infer<typeof BomInsertSchema>;

export const BomCreatorSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  bom_creator: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  item_group: z.string().optional(),
  qty: z.number(),
  project: z.string().optional(),
  uom: z.string().optional(),
  routing: z.string().optional(),
  rm_cost_as_per: z.enum(['Valuation Rate', 'Last Purchase Rate', 'Price List']).default('Valuation Rate'),
  set_rate_based_on_warehouse: z.boolean().optional().default(false),
  buying_price_list: z.string().optional(),
  price_list_currency: z.string().optional(),
  plc_conversion_rate: z.number().optional(),
  currency: z.string(),
  conversion_rate: z.number().optional().default(1),
  default_warehouse: z.string().optional(),
  company: z.string(),
  items: z.array(z.unknown()).optional(),
  raw_material_cost: z.number().optional(),
  remarks: z.string().optional(),
  status: z.enum(['Draft', 'Submitted', 'In Progress', 'Completed', 'Failed', 'Cancelled']).optional().default('Draft'),
  error_log: z.string().optional(),
  amended_from: z.string().optional(),
});

export type BomCreator = z.infer<typeof BomCreatorSchema>;

export const BomCreatorInsertSchema = BomCreatorSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomCreatorInsert = z.infer<typeof BomCreatorInsertSchema>;

export const BomCreatorItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  item_group: z.string().optional(),
  fg_item: z.string(),
  is_expandable: z.boolean().optional().default(false),
  sourced_by_supplier: z.boolean().optional().default(false),
  bom_created: z.boolean().optional().default(false),
  is_subcontracted: z.boolean().optional().default(false),
  is_phantom_item: z.boolean().optional().default(false),
  operation: z.string().optional(),
  description: z.string().optional(),
  qty: z.number().optional(),
  rate: z.number().optional(),
  uom: z.string().optional(),
  stock_qty: z.number().optional(),
  conversion_factor: z.number().optional(),
  stock_uom: z.string().optional(),
  amount: z.number().optional(),
  base_rate: z.number().optional(),
  base_amount: z.number().optional(),
  do_not_explode: z.boolean().optional().default(true),
  parent_row_no: z.string().optional(),
  fg_reference_id: z.string().optional(),
  instruction: z.string().optional(),
});

export type BomCreatorItem = z.infer<typeof BomCreatorItemSchema>;

export const BomCreatorItemInsertSchema = BomCreatorItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomCreatorItemInsert = z.infer<typeof BomCreatorItemInsertSchema>;

export const BomExplosionItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  source_warehouse: z.string().optional(),
  operation: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  stock_qty: z.number().optional(),
  rate: z.number().optional(),
  qty_consumed_per_unit: z.number().optional(),
  stock_uom: z.string().optional(),
  amount: z.number().optional(),
  include_item_in_manufacturing: z.boolean().optional().default(false),
  sourced_by_supplier: z.boolean().optional().default(false),
  is_sub_assembly_item: z.boolean().optional().default(false),
});

export type BomExplosionItem = z.infer<typeof BomExplosionItemSchema>;

export const BomExplosionItemInsertSchema = BomExplosionItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomExplosionItemInsert = z.infer<typeof BomExplosionItemInsertSchema>;

export const BomItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  operation: z.string().optional(),
  operation_row_id: z.number().int().optional(),
  do_not_explode: z.boolean().optional().default(false),
  bom_no: z.string().optional(),
  source_warehouse: z.string().optional(),
  allow_alternative_item: z.boolean().optional().default(false),
  is_stock_item: z.boolean().optional().default(false),
  description: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  qty: z.number(),
  uom: z.string(),
  stock_qty: z.number().optional(),
  stock_uom: z.string().optional(),
  conversion_factor: z.number().optional(),
  rate: z.number(),
  base_rate: z.number().optional(),
  amount: z.number().optional(),
  base_amount: z.number().optional(),
  qty_consumed_per_unit: z.number().optional(),
  has_variants: z.boolean().optional().default(false),
  include_item_in_manufacturing: z.boolean().optional().default(false),
  original_item: z.string().optional(),
  sourced_by_supplier: z.boolean().optional().default(false),
  is_sub_assembly_item: z.boolean().optional().default(false),
  is_phantom_item: z.boolean().optional().default(false),
});

export type BomItem = z.infer<typeof BomItemSchema>;

export const BomItemInsertSchema = BomItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomItemInsert = z.infer<typeof BomItemInsertSchema>;

export const BomOperationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  operation: z.string(),
  sequence_id: z.number().int().optional(),
  finished_good: z.string().optional(),
  finished_good_qty: z.number().optional().default(1),
  bom_no: z.string().optional(),
  workstation_type: z.string().optional(),
  workstation: z.string().optional(),
  time_in_mins: z.number(),
  fixed_time: z.boolean().optional().default(false),
  is_subcontracted: z.boolean().optional().default(false),
  is_final_finished_good: z.boolean().optional().default(false),
  set_cost_based_on_bom_qty: z.boolean().optional().default(false),
  skip_material_transfer: z.boolean().optional().default(false),
  backflush_from_wip_warehouse: z.boolean().optional().default(false),
  source_warehouse: z.string().optional(),
  wip_warehouse: z.string().optional(),
  fg_warehouse: z.string().optional(),
  hour_rate: z.number().optional(),
  base_hour_rate: z.number().optional(),
  batch_size: z.number().int().optional(),
  cost_per_unit: z.number().optional(),
  base_cost_per_unit: z.number().optional(),
  operating_cost: z.number().optional(),
  base_operating_cost: z.number().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export type BomOperation = z.infer<typeof BomOperationSchema>;

export const BomOperationInsertSchema = BomOperationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomOperationInsert = z.infer<typeof BomOperationInsertSchema>;

export const BomScrapItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  stock_qty: z.number(),
  rate: z.number().optional(),
  amount: z.number().optional(),
  stock_uom: z.string().optional(),
  base_rate: z.number().optional(),
  base_amount: z.number().optional(),
});

export type BomScrapItem = z.infer<typeof BomScrapItemSchema>;

export const BomScrapItemInsertSchema = BomScrapItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomScrapItemInsert = z.infer<typeof BomScrapItemInsertSchema>;

export const BomUpdateBatchSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  level: z.number().int().optional(),
  batch_no: z.number().int().optional(),
  boms_updated: z.string().optional(),
  status: z.enum(['Pending', 'Completed']).optional(),
});

export type BomUpdateBatch = z.infer<typeof BomUpdateBatchSchema>;

export const BomUpdateBatchInsertSchema = BomUpdateBatchSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomUpdateBatchInsert = z.infer<typeof BomUpdateBatchInsertSchema>;

export const BomUpdateLogSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  update_type: z.enum(['Replace BOM', 'Update Cost']).optional(),
  status: z.enum(['Queued', 'In Progress', 'Completed', 'Failed', 'Cancelled']).optional(),
  current_bom: z.string().optional(),
  new_bom: z.string().optional(),
  error_log: z.string().optional(),
  current_level: z.number().int().optional(),
  processed_boms: z.string().optional(),
  bom_batches: z.array(z.unknown()).optional(),
  amended_from: z.string().optional(),
});

export type BomUpdateLog = z.infer<typeof BomUpdateLogSchema>;

export const BomUpdateLogInsertSchema = BomUpdateLogSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomUpdateLogInsert = z.infer<typeof BomUpdateLogInsertSchema>;

export const BomUpdateToolSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  current_bom: z.string(),
  new_bom: z.string(),
});

export type BomUpdateTool = z.infer<typeof BomUpdateToolSchema>;

export const BomUpdateToolInsertSchema = BomUpdateToolSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomUpdateToolInsert = z.infer<typeof BomUpdateToolInsertSchema>;

export const BomWebsiteItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  qty: z.number().optional(),
  website_image: z.string().optional(),
});

export type BomWebsiteItem = z.infer<typeof BomWebsiteItemSchema>;

export const BomWebsiteItemInsertSchema = BomWebsiteItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomWebsiteItemInsert = z.infer<typeof BomWebsiteItemInsertSchema>;

export const BomWebsiteOperationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  operation: z.string(),
  workstation: z.string().optional(),
  time_in_mins: z.number(),
  website_image: z.string().optional(),
  thumbnail: z.string().optional(),
});

export type BomWebsiteOperation = z.infer<typeof BomWebsiteOperationSchema>;

export const BomWebsiteOperationInsertSchema = BomWebsiteOperationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomWebsiteOperationInsert = z.infer<typeof BomWebsiteOperationInsertSchema>;

export const BlanketOrderSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MFG-BLR-.YYYY.-']),
  blanket_order_type: z.enum(['Selling', 'Purchasing']),
  customer: z.string().optional(),
  customer_name: z.string().optional(),
  supplier: z.string().optional(),
  supplier_name: z.string().optional(),
  order_no: z.string().optional(),
  order_date: z.string().optional(),
  from_date: z.string(),
  to_date: z.string(),
  company: z.string(),
  items: z.array(z.unknown()),
  amended_from: z.string().optional(),
  tc_name: z.string().optional(),
  terms: z.string().optional(),
});

export type BlanketOrder = z.infer<typeof BlanketOrderSchema>;

export const BlanketOrderInsertSchema = BlanketOrderSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BlanketOrderInsert = z.infer<typeof BlanketOrderInsertSchema>;

export const BlanketOrderItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  party_item_code: z.string().optional(),
  qty: z.number().optional(),
  rate: z.number(),
  ordered_qty: z.number().optional(),
  terms_and_conditions: z.string().optional(),
});

export type BlanketOrderItem = z.infer<typeof BlanketOrderItemSchema>;

export const BlanketOrderItemInsertSchema = BlanketOrderItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BlanketOrderItemInsert = z.infer<typeof BlanketOrderItemInsertSchema>;

export const DowntimeEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  naming_series: z.enum(['DT-']),
  workstation: z.string(),
  operator: z.string(),
  from_time: z.string(),
  to_time: z.string(),
  downtime: z.number().optional(),
  stop_reason: z.enum(['Excessive machine set up time', 'Unplanned machine maintenance', 'On-machine press checks', 'Machine operator errors', 'Machine malfunction', 'Electricity down', 'Other']),
  remarks: z.string().optional(),
});

export type DowntimeEntry = z.infer<typeof DowntimeEntrySchema>;

export const DowntimeEntryInsertSchema = DowntimeEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DowntimeEntryInsert = z.infer<typeof DowntimeEntryInsertSchema>;

export const JobCardSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['PO-JOB.#####']).default('PO-JOB.#####'),
  work_order: z.string(),
  employee: z.array(z.unknown()).optional(),
  is_subcontracted: z.boolean().optional().default(false),
  posting_date: z.string().optional().default('Today'),
  company: z.string(),
  project: z.string().optional(),
  bom_no: z.string().optional(),
  finished_good: z.string().optional(),
  production_item: z.string().optional(),
  semi_fg_bom: z.string().optional(),
  total_completed_qty: z.number().optional().default(0),
  for_quantity: z.number().optional(),
  transferred_qty: z.number().optional().default(0),
  manufactured_qty: z.number().optional(),
  process_loss_qty: z.number().optional(),
  operation: z.string(),
  source_warehouse: z.string().optional(),
  wip_warehouse: z.string().optional(),
  skip_material_transfer: z.boolean().optional().default(false),
  backflush_from_wip_warehouse: z.boolean().optional().default(false),
  workstation_type: z.string().optional(),
  workstation: z.string(),
  target_warehouse: z.string().optional(),
  items: z.array(z.unknown()).optional(),
  quality_inspection_template: z.string().optional(),
  quality_inspection: z.string().optional(),
  expected_start_date: z.string().optional(),
  time_required: z.number().optional(),
  expected_end_date: z.string().optional(),
  scheduled_time_logs: z.array(z.unknown()).optional(),
  actual_start_date: z.string().optional(),
  total_time_in_mins: z.number().optional(),
  actual_end_date: z.string().optional(),
  time_logs: z.array(z.unknown()).optional(),
  sub_operations: z.array(z.unknown()).optional(),
  scrap_items: z.array(z.unknown()).optional(),
  for_job_card: z.string().optional(),
  is_corrective_job_card: z.boolean().optional().default(false),
  hour_rate: z.number().optional(),
  for_operation: z.string().optional(),
  item_name: z.string().optional(),
  requested_qty: z.number().optional().default(0),
  status: z.enum(['Open', 'Work In Progress', 'Material Transferred', 'On Hold', 'Submitted', 'Cancelled', 'Completed']).optional().default('Open'),
  operation_row_id: z.number().int().optional(),
  is_paused: z.boolean().optional().default(false),
  track_semi_finished_goods: z.boolean().optional().default(false),
  operation_row_number: z.string().optional(),
  operation_id: z.string().optional(),
  sequence_id: z.number().int().optional(),
  remarks: z.string().optional(),
  serial_and_batch_bundle: z.string().optional(),
  batch_no: z.string().optional(),
  serial_no: z.string().optional(),
  barcode: z.string().optional(),
  started_time: z.string().optional(),
  current_time: z.number().int().optional(),
  amended_from: z.string().optional(),
});

export type JobCard = z.infer<typeof JobCardSchema>;

export const JobCardInsertSchema = JobCardSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type JobCardInsert = z.infer<typeof JobCardInsertSchema>;

export const JobCardItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  source_warehouse: z.string().optional(),
  uom: z.string().optional(),
  item_group: z.string().optional(),
  stock_uom: z.string().optional(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  required_qty: z.number().optional(),
  transferred_qty: z.number().optional(),
  consumed_qty: z.number().optional(),
  allow_alternative_item: z.boolean().optional().default(false),
});

export type JobCardItem = z.infer<typeof JobCardItemSchema>;

export const JobCardItemInsertSchema = JobCardItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type JobCardItemInsert = z.infer<typeof JobCardItemInsertSchema>;

export const JobCardOperationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  sub_operation: z.string().optional(),
  completed_qty: z.number().optional(),
  completed_time: z.string().optional(),
  status: z.enum(['Complete', 'Pause', 'Pending', 'Work In Progress']).optional().default('Pending'),
});

export type JobCardOperation = z.infer<typeof JobCardOperationSchema>;

export const JobCardOperationInsertSchema = JobCardOperationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type JobCardOperationInsert = z.infer<typeof JobCardOperationInsertSchema>;

export const JobCardScheduledTimeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  from_time: z.string().optional(),
  to_time: z.string().optional(),
  time_in_mins: z.number().optional(),
});

export type JobCardScheduledTime = z.infer<typeof JobCardScheduledTimeSchema>;

export const JobCardScheduledTimeInsertSchema = JobCardScheduledTimeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type JobCardScheduledTimeInsert = z.infer<typeof JobCardScheduledTimeInsertSchema>;

export const JobCardScrapItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  stock_qty: z.number(),
  stock_uom: z.string().optional(),
});

export type JobCardScrapItem = z.infer<typeof JobCardScrapItemSchema>;

export const JobCardScrapItemInsertSchema = JobCardScrapItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type JobCardScrapItemInsert = z.infer<typeof JobCardScrapItemInsertSchema>;

export const JobCardTimeLogSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  employee: z.string().optional(),
  from_time: z.string().optional(),
  to_time: z.string().optional(),
  time_in_mins: z.number().optional(),
  completed_qty: z.number().optional().default(0),
  operation: z.string().optional(),
});

export type JobCardTimeLog = z.infer<typeof JobCardTimeLogSchema>;

export const JobCardTimeLogInsertSchema = JobCardTimeLogSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type JobCardTimeLogInsert = z.infer<typeof JobCardTimeLogInsertSchema>;

export const ManufacturingSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  material_consumption: z.boolean().optional().default(false),
  get_rm_cost_from_consumption_entry: z.boolean().optional().default(false),
  backflush_raw_materials_based_on: z.enum(['BOM', 'Material Transferred for Manufacture']).optional().default('BOM'),
  validate_components_quantities_per_bom: z.boolean().optional().default(false),
  update_bom_costs_automatically: z.boolean().optional().default(false),
  allow_editing_of_items_and_quantities_in_work_order: z.boolean().optional().default(false),
  overproduction_percentage_for_sales_order: z.number().optional(),
  overproduction_percentage_for_work_order: z.number().optional(),
  transfer_extra_materials_percentage: z.number().optional(),
  add_corrective_operation_cost_in_finished_good_valuation: z.boolean().optional().default(false),
  enforce_time_logs: z.boolean().optional().default(false),
  job_card_excess_transfer: z.boolean().optional().default(false),
  disable_capacity_planning: z.boolean().optional().default(false),
  allow_overtime: z.boolean().optional().default(false),
  allow_production_on_holidays: z.boolean().optional().default(false),
  capacity_planning_for_days: z.number().int().optional().default(30),
  mins_between_operations: z.number().int().optional(),
  set_op_cost_and_scrap_from_sub_assemblies: z.boolean().optional().default(false),
  make_serial_no_batch_from_work_order: z.boolean().optional().default(false),
});

export type ManufacturingSettings = z.infer<typeof ManufacturingSettingsSchema>;

export const ManufacturingSettingsInsertSchema = ManufacturingSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ManufacturingSettingsInsert = z.infer<typeof ManufacturingSettingsInsertSchema>;

export const MasterProductionScheduleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  naming_series: z.enum(['MPS.YY.-.######']).default('MPS.YY.-.######'),
  company: z.string(),
  posting_date: z.string().default('Today'),
  from_date: z.string(),
  to_date: z.string().optional(),
  select_items: z.array(z.unknown()).optional(),
  parent_warehouse: z.string().optional(),
  sales_orders: z.array(z.unknown()).optional(),
  material_requests: z.array(z.unknown()).optional(),
  items: z.array(z.unknown()).optional(),
  sales_forecast: z.string().optional(),
  amended_from: z.string().optional(),
});

export type MasterProductionSchedule = z.infer<typeof MasterProductionScheduleSchema>;

export const MasterProductionScheduleInsertSchema = MasterProductionScheduleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MasterProductionScheduleInsert = z.infer<typeof MasterProductionScheduleInsertSchema>;

export const MasterProductionScheduleItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  delivery_date: z.string().optional(),
  cumulative_lead_time: z.number().int().optional(),
  order_release_date: z.string().optional(),
  planned_qty: z.number().optional(),
  warehouse: z.string().optional(),
  item_name: z.string().optional(),
  bom_no: z.string().optional(),
  uom: z.string().optional(),
});

export type MasterProductionScheduleItem = z.infer<typeof MasterProductionScheduleItemSchema>;

export const MasterProductionScheduleItemInsertSchema = MasterProductionScheduleItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MasterProductionScheduleItemInsert = z.infer<typeof MasterProductionScheduleItemInsertSchema>;

export const MaterialRequestPlanItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  from_warehouse: z.string().optional(),
  warehouse: z.string(),
  material_request_type: z.enum(['Purchase', 'Material Transfer', 'Material Issue', 'Manufacture', 'Subcontracting', 'Customer Provided']).optional(),
  item_name: z.string().optional(),
  uom: z.string().optional(),
  conversion_factor: z.number().optional(),
  from_bom: z.string().optional(),
  main_item_code: z.string().optional(),
  required_bom_qty: z.number().optional(),
  projected_qty: z.number().optional(),
  quantity: z.number(),
  stock_reserved_qty: z.number().optional(),
  schedule_date: z.string().optional(),
  description: z.string().optional(),
  min_order_qty: z.number().optional(),
  sales_order: z.string().optional(),
  sub_assembly_item_reference: z.string().optional(),
  actual_qty: z.number().optional().default(0),
  requested_qty: z.number().optional().default(0),
  reserved_qty_for_production: z.number().optional(),
  ordered_qty: z.number().optional(),
  safety_stock: z.number().optional(),
});

export type MaterialRequestPlanItem = z.infer<typeof MaterialRequestPlanItemSchema>;

export const MaterialRequestPlanItemInsertSchema = MaterialRequestPlanItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MaterialRequestPlanItemInsert = z.infer<typeof MaterialRequestPlanItemInsertSchema>;

export const OperationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  workstation: z.string().optional(),
  is_corrective_operation: z.boolean().optional().default(false),
  create_job_card_based_on_batch_size: z.boolean().optional().default(false),
  quality_inspection_template: z.string().optional(),
  batch_size: z.number().int().optional().default(1),
  sub_operations: z.array(z.unknown()).optional(),
  total_operation_time: z.number().optional(),
  description: z.string().optional(),
});

export type Operation = z.infer<typeof OperationSchema>;

export const OperationInsertSchema = OperationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type OperationInsert = z.infer<typeof OperationInsertSchema>;

export const PlantFloorSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  plant_dashboard: z.string().optional(),
  stock_summary: z.string().optional(),
  floor_name: z.string().optional(),
  company: z.string().optional(),
  warehouse: z.string().optional(),
});

export type PlantFloor = z.infer<typeof PlantFloorSchema>;

export const PlantFloorInsertSchema = PlantFloorSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PlantFloorInsert = z.infer<typeof PlantFloorInsertSchema>;

export const ProductionPlanSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MFG-PP-.YYYY.-']),
  company: z.string(),
  get_items_from: z.enum(['Sales Order', 'Material Request']).optional(),
  posting_date: z.string().default('Today'),
  reserve_stock: z.boolean().optional().default(false),
  item_code: z.string().optional(),
  customer: z.string().optional(),
  warehouse: z.string().optional(),
  project: z.string().optional(),
  sales_order_status: z.enum(['To Deliver and Bill', 'To Bill', 'To Deliver']).optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  from_delivery_date: z.string().optional(),
  to_delivery_date: z.string().optional(),
  combine_items: z.boolean().optional().default(false),
  sales_orders: z.array(z.unknown()).optional(),
  material_requests: z.array(z.unknown()).optional(),
  po_items: z.array(z.unknown()),
  prod_plan_references: z.array(z.unknown()).optional(),
  sub_assembly_warehouse: z.string().optional(),
  skip_available_sub_assembly_item: z.boolean().optional().default(true),
  combine_sub_items: z.boolean().optional().default(false),
  sub_assembly_items: z.array(z.unknown()).optional(),
  include_non_stock_items: z.boolean().optional().default(true),
  include_subcontracted_items: z.boolean().optional().default(true),
  consider_minimum_order_qty: z.boolean().optional().default(false),
  include_safety_stock: z.boolean().optional().default(false),
  ignore_existing_ordered_qty: z.boolean().optional().default(true),
  for_warehouse: z.string().optional(),
  mr_items: z.array(z.unknown()).optional(),
  total_planned_qty: z.number().optional().default(0),
  total_produced_qty: z.number().optional().default(0),
  status: z.enum(['Draft', 'Submitted', 'Not Started', 'In Process', 'Completed', 'Closed', 'Cancelled', 'Material Requested']).optional().default('Draft'),
  warehouses: z.array(z.unknown()).optional(),
  amended_from: z.string().optional(),
});

export type ProductionPlan = z.infer<typeof ProductionPlanSchema>;

export const ProductionPlanInsertSchema = ProductionPlanSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProductionPlanInsert = z.infer<typeof ProductionPlanInsertSchema>;

export const ProductionPlanItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  include_exploded_items: z.boolean().optional().default(true),
  item_code: z.string(),
  bom_no: z.string(),
  planned_qty: z.number(),
  stock_uom: z.string(),
  warehouse: z.string().optional(),
  planned_start_date: z.string().default('Today'),
  pending_qty: z.number().optional().default(0),
  ordered_qty: z.number().optional().default(0),
  description: z.string().optional(),
  produced_qty: z.number().optional().default(0),
  sales_order: z.string().optional(),
  sales_order_item: z.string().optional(),
  material_request: z.string().optional(),
  material_request_item: z.string().optional(),
  product_bundle_item: z.string().optional(),
  item_reference: z.string().optional(),
  temporary_name: z.string().optional(),
});

export type ProductionPlanItem = z.infer<typeof ProductionPlanItemSchema>;

export const ProductionPlanItemInsertSchema = ProductionPlanItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProductionPlanItemInsert = z.infer<typeof ProductionPlanItemInsertSchema>;

export const ProductionPlanItemReferenceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_reference: z.string().optional(),
  sales_order: z.string().optional(),
  sales_order_item: z.string().optional(),
  qty: z.number().optional(),
});

export type ProductionPlanItemReference = z.infer<typeof ProductionPlanItemReferenceSchema>;

export const ProductionPlanItemReferenceInsertSchema = ProductionPlanItemReferenceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProductionPlanItemReferenceInsert = z.infer<typeof ProductionPlanItemReferenceInsertSchema>;

export const ProductionPlanMaterialRequestSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  material_request: z.string(),
  material_request_date: z.string().optional(),
});

export type ProductionPlanMaterialRequest = z.infer<typeof ProductionPlanMaterialRequestSchema>;

export const ProductionPlanMaterialRequestInsertSchema = ProductionPlanMaterialRequestSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProductionPlanMaterialRequestInsert = z.infer<typeof ProductionPlanMaterialRequestInsertSchema>;

export const ProductionPlanMaterialRequestWarehouseSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  warehouse: z.string().optional(),
});

export type ProductionPlanMaterialRequestWarehouse = z.infer<typeof ProductionPlanMaterialRequestWarehouseSchema>;

export const ProductionPlanMaterialRequestWarehouseInsertSchema = ProductionPlanMaterialRequestWarehouseSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProductionPlanMaterialRequestWarehouseInsert = z.infer<typeof ProductionPlanMaterialRequestWarehouseInsertSchema>;

export const ProductionPlanSalesOrderSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  sales_order: z.string(),
  sales_order_date: z.string().optional(),
  customer: z.string().optional(),
  grand_total: z.number().optional(),
  status: z.string().optional(),
});

export type ProductionPlanSalesOrder = z.infer<typeof ProductionPlanSalesOrderSchema>;

export const ProductionPlanSalesOrderInsertSchema = ProductionPlanSalesOrderSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProductionPlanSalesOrderInsert = z.infer<typeof ProductionPlanSalesOrderInsertSchema>;

export const ProductionPlanSubAssemblyItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  production_item: z.string().optional(),
  item_name: z.string().optional(),
  fg_warehouse: z.string().optional(),
  parent_item_code: z.string().optional(),
  bom_no: z.string().optional(),
  bom_level: z.number().int().optional(),
  type_of_manufacturing: z.enum(['In House', 'Subcontract', 'Material Request']).optional().default('In House'),
  required_qty: z.number().optional(),
  projected_qty: z.number().optional(),
  qty: z.number().optional(),
  supplier: z.string().optional(),
  purchase_order: z.string().optional(),
  production_plan_item: z.string().optional(),
  wo_produced_qty: z.number().optional(),
  stock_reserved_qty: z.number().optional(),
  ordered_qty: z.number().optional(),
  received_qty: z.number().optional(),
  indent: z.number().int().optional(),
  schedule_date: z.string().optional(),
  uom: z.string().optional(),
  stock_uom: z.string().optional(),
  actual_qty: z.number().optional(),
  description: z.string().optional(),
});

export type ProductionPlanSubAssemblyItem = z.infer<typeof ProductionPlanSubAssemblyItemSchema>;

export const ProductionPlanSubAssemblyItemInsertSchema = ProductionPlanSubAssemblyItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProductionPlanSubAssemblyItemInsert = z.infer<typeof ProductionPlanSubAssemblyItemInsertSchema>;

export const RoutingSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  routing_name: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  operations: z.array(z.unknown()).optional(),
});

export type Routing = z.infer<typeof RoutingSchema>;

export const RoutingInsertSchema = RoutingSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RoutingInsert = z.infer<typeof RoutingInsertSchema>;

export const SalesForecastSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['SF.YY.-.######']).default('SF.YY.-.######'),
  company: z.string(),
  posting_date: z.string().optional().default('Today'),
  from_date: z.string().default('Today'),
  frequency: z.enum(['Weekly', 'Monthly']).default('Monthly'),
  demand_number: z.number().int().default(6),
  selected_items: z.array(z.unknown()),
  parent_warehouse: z.string(),
  items: z.array(z.unknown()).optional(),
  amended_from: z.string().optional(),
  status: z.enum(['Planned', 'MPS Generated', 'Cancelled']).optional(),
});

export type SalesForecast = z.infer<typeof SalesForecastSchema>;

export const SalesForecastInsertSchema = SalesForecastSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesForecastInsert = z.infer<typeof SalesForecastInsertSchema>;

export const SalesForecastItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  uom: z.string().optional(),
  delivery_date: z.string().optional(),
  forecast_qty: z.number().optional(),
  adjust_qty: z.number().optional(),
  demand_qty: z.number(),
  warehouse: z.string().optional(),
});

export type SalesForecastItem = z.infer<typeof SalesForecastItemSchema>;

export const SalesForecastItemInsertSchema = SalesForecastItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesForecastItemInsert = z.infer<typeof SalesForecastItemInsertSchema>;

export const SubOperationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  operation: z.string().optional(),
  time_in_mins: z.number().optional().default(0),
  description: z.string().optional(),
});

export type SubOperation = z.infer<typeof SubOperationSchema>;

export const SubOperationInsertSchema = SubOperationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubOperationInsert = z.infer<typeof SubOperationInsertSchema>;

export const WorkOrderSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MFG-WO-.YYYY.-']),
  status: z.enum(['Draft', 'Submitted', 'Not Started', 'In Process', 'Stock Reserved', 'Stock Partially Reserved', 'Completed', 'Stopped', 'Closed', 'Cancelled']).default('Draft'),
  production_item: z.string(),
  item_name: z.string().optional(),
  image: z.string().optional(),
  bom_no: z.string(),
  mps: z.string().optional(),
  subcontracting_inward_order: z.string().optional(),
  subcontracting_inward_order_item: z.string().optional(),
  sales_order: z.string().optional(),
  company: z.string(),
  qty: z.number().default(1),
  project: z.string().optional(),
  track_semi_finished_goods: z.boolean().optional().default(false),
  reserve_stock: z.boolean().optional().default(false),
  max_producible_qty: z.number().optional(),
  material_transferred_for_manufacturing: z.number().optional().default(0),
  additional_transferred_qty: z.number().optional(),
  produced_qty: z.number().optional().default(0),
  disassembled_qty: z.number().optional(),
  process_loss_qty: z.number().optional(),
  source_warehouse: z.string().optional(),
  wip_warehouse: z.string().optional(),
  fg_warehouse: z.string().optional(),
  scrap_warehouse: z.string().optional(),
  transfer_material_against: z.enum(['Work Order', 'Job Card']).optional(),
  operations: z.array(z.unknown()).optional(),
  required_items: z.array(z.unknown()).optional(),
  allow_alternative_item: z.boolean().optional().default(false),
  use_multi_level_bom: z.boolean().optional().default(true),
  skip_transfer: z.boolean().optional().default(false),
  from_wip_warehouse: z.boolean().optional().default(false),
  update_consumed_material_cost_in_project: z.boolean().optional().default(true),
  planned_start_date: z.string().default('now'),
  planned_end_date: z.string().optional(),
  expected_delivery_date: z.string().optional(),
  actual_start_date: z.string().optional(),
  actual_end_date: z.string().optional(),
  lead_time: z.number().optional(),
  planned_operating_cost: z.number().optional(),
  actual_operating_cost: z.number().optional(),
  additional_operating_cost: z.number().optional(),
  corrective_operation_cost: z.number().optional(),
  total_operating_cost: z.number().optional(),
  has_serial_no: z.boolean().optional().default(false),
  has_batch_no: z.boolean().optional().default(false),
  batch_size: z.number().optional().default(0),
  description: z.string().optional(),
  stock_uom: z.string().optional(),
  material_request: z.string().optional(),
  material_request_item: z.string().optional(),
  sales_order_item: z.string().optional(),
  production_plan: z.string().optional(),
  production_plan_item: z.string().optional(),
  production_plan_sub_assembly_item: z.string().optional(),
  product_bundle_item: z.string().optional(),
  amended_from: z.string().optional(),
});

export type WorkOrder = z.infer<typeof WorkOrderSchema>;

export const WorkOrderInsertSchema = WorkOrderSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WorkOrderInsert = z.infer<typeof WorkOrderInsertSchema>;

export const WorkOrderItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  operation: z.string().optional(),
  item_code: z.string().optional(),
  source_warehouse: z.string().optional(),
  operation_row_id: z.number().int().optional(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  allow_alternative_item: z.boolean().optional().default(false),
  include_item_in_manufacturing: z.boolean().optional().default(false),
  required_qty: z.number().optional(),
  stock_uom: z.string().optional(),
  rate: z.number().optional(),
  amount: z.number().optional(),
  transferred_qty: z.number().optional(),
  consumed_qty: z.number().optional(),
  returned_qty: z.number().optional(),
  available_qty_at_source_warehouse: z.number().optional(),
  available_qty_at_wip_warehouse: z.number().optional(),
  stock_reserved_qty: z.number().optional(),
  is_additional_item: z.boolean().optional().default(false),
  is_customer_provided_item: z.boolean().optional().default(false),
  voucher_detail_reference: z.string().optional(),
});

export type WorkOrderItem = z.infer<typeof WorkOrderItemSchema>;

export const WorkOrderItemInsertSchema = WorkOrderItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WorkOrderItemInsert = z.infer<typeof WorkOrderItemInsertSchema>;

export const WorkOrderOperationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  operation: z.string(),
  status: z.enum(['Pending', 'Work in Progress', 'Completed']).optional().default('Pending'),
  completed_qty: z.number().optional(),
  process_loss_qty: z.number().optional(),
  bom: z.string().optional(),
  workstation_type: z.string().optional(),
  workstation: z.string().optional(),
  sequence_id: z.number().int().optional(),
  bom_no: z.string().optional(),
  finished_good: z.string().optional(),
  is_subcontracted: z.boolean().optional().default(false),
  skip_material_transfer: z.boolean().optional().default(false),
  backflush_from_wip_warehouse: z.boolean().optional().default(false),
  source_warehouse: z.string().optional(),
  wip_warehouse: z.string().optional(),
  fg_warehouse: z.string().optional(),
  description: z.string().optional(),
  planned_start_time: z.string().optional(),
  hour_rate: z.number().optional(),
  time_in_mins: z.number(),
  planned_end_time: z.string().optional(),
  batch_size: z.number().optional(),
  planned_operating_cost: z.number().optional(),
  actual_start_time: z.string().optional(),
  actual_operation_time: z.number().optional(),
  actual_end_time: z.string().optional(),
  actual_operating_cost: z.number().optional(),
});

export type WorkOrderOperation = z.infer<typeof WorkOrderOperationSchema>;

export const WorkOrderOperationInsertSchema = WorkOrderOperationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WorkOrderOperationInsert = z.infer<typeof WorkOrderOperationInsertSchema>;

export const WorkstationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  workstation_dashboard: z.string().optional(),
  workstation_name: z.string(),
  workstation_type: z.string().optional(),
  plant_floor: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  production_capacity: z.number().int().default(1),
  warehouse: z.string().optional(),
  status: z.enum(['Production', 'Off', 'Idle', 'Problem', 'Maintenance', 'Setup']).optional(),
  on_status_image: z.string().optional(),
  off_status_image: z.string().optional(),
  workstation_costs: z.array(z.unknown()).optional(),
  hour_rate: z.number().optional(),
  description: z.string().optional(),
  holiday_list: z.string().optional(),
  working_hours: z.array(z.unknown()).optional(),
  total_working_hours: z.number().optional(),
});

export type Workstation = z.infer<typeof WorkstationSchema>;

export const WorkstationInsertSchema = WorkstationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WorkstationInsert = z.infer<typeof WorkstationInsertSchema>;

export const WorkstationCostSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  operating_component: z.string(),
  operating_cost: z.number(),
});

export type WorkstationCost = z.infer<typeof WorkstationCostSchema>;

export const WorkstationCostInsertSchema = WorkstationCostSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WorkstationCostInsert = z.infer<typeof WorkstationCostInsertSchema>;

export const WorkstationOperatingComponentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  component_name: z.string(),
  accounts: z.array(z.unknown()).optional(),
});

export type WorkstationOperatingComponent = z.infer<typeof WorkstationOperatingComponentSchema>;

export const WorkstationOperatingComponentInsertSchema = WorkstationOperatingComponentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WorkstationOperatingComponentInsert = z.infer<typeof WorkstationOperatingComponentInsertSchema>;

export const WorkstationOperatingComponentAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
  expense_account: z.string().optional(),
});

export type WorkstationOperatingComponentAccount = z.infer<typeof WorkstationOperatingComponentAccountSchema>;

export const WorkstationOperatingComponentAccountInsertSchema = WorkstationOperatingComponentAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WorkstationOperatingComponentAccountInsert = z.infer<typeof WorkstationOperatingComponentAccountInsertSchema>;

export const WorkstationTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  workstation_type: z.string(),
  workstation_costs: z.array(z.unknown()).optional(),
  hour_rate: z.number().optional(),
  description: z.string().optional(),
});

export type WorkstationType = z.infer<typeof WorkstationTypeSchema>;

export const WorkstationTypeInsertSchema = WorkstationTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WorkstationTypeInsert = z.infer<typeof WorkstationTypeInsertSchema>;

export const WorkstationWorkingHourSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  start_time: z.string(),
  hours: z.number().optional(),
  end_time: z.string(),
  enabled: z.boolean().optional().default(true),
});

export type WorkstationWorkingHour = z.infer<typeof WorkstationWorkingHourSchema>;

export const WorkstationWorkingHourInsertSchema = WorkstationWorkingHourSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WorkstationWorkingHourInsert = z.infer<typeof WorkstationWorkingHourInsertSchema>;

export const WebsiteAttributeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  attribute: z.string(),
});

export type WebsiteAttribute = z.infer<typeof WebsiteAttributeSchema>;

export const WebsiteAttributeInsertSchema = WebsiteAttributeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WebsiteAttributeInsert = z.infer<typeof WebsiteAttributeInsertSchema>;

export const WebsiteFilterFieldSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  fieldname: z.string().optional(),
});

export type WebsiteFilterField = z.infer<typeof WebsiteFilterFieldSchema>;

export const WebsiteFilterFieldInsertSchema = WebsiteFilterFieldSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WebsiteFilterFieldInsert = z.infer<typeof WebsiteFilterFieldInsertSchema>;

export const ActivityCostSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  activity_type: z.string(),
  employee: z.string().optional(),
  employee_name: z.string().optional(),
  department: z.string().optional(),
  billing_rate: z.number().optional().default(0),
  costing_rate: z.number().optional().default(0),
  title: z.string().optional(),
});

export type ActivityCost = z.infer<typeof ActivityCostSchema>;

export const ActivityCostInsertSchema = ActivityCostSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ActivityCostInsert = z.infer<typeof ActivityCostInsertSchema>;

export const ActivityTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  activity_type: z.string(),
  costing_rate: z.number().optional(),
  billing_rate: z.number().optional(),
  disabled: z.boolean().optional().default(false),
});

export type ActivityType = z.infer<typeof ActivityTypeSchema>;

export const ActivityTypeInsertSchema = ActivityTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ActivityTypeInsert = z.infer<typeof ActivityTypeInsertSchema>;

export const DependentTaskSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  task: z.string().optional(),
});

export type DependentTask = z.infer<typeof DependentTaskSchema>;

export const DependentTaskInsertSchema = DependentTaskSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DependentTaskInsert = z.infer<typeof DependentTaskInsertSchema>;

export const ProjectSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  naming_series: z.enum(['PROJ-.####']),
  project_name: z.string(),
  status: z.enum(['Open', 'Completed', 'Cancelled']).optional().default('Open'),
  project_type: z.string().optional(),
  is_active: z.enum(['Yes', 'No']).optional(),
  percent_complete_method: z.enum(['Manual', 'Task Completion', 'Task Progress', 'Task Weight']).optional().default('Task Completion'),
  percent_complete: z.number().optional(),
  project_template: z.string().optional(),
  expected_start_date: z.string().optional(),
  expected_end_date: z.string().optional(),
  priority: z.enum(['Medium', 'Low', 'High']).optional(),
  department: z.string().optional(),
  customer: z.string().optional(),
  sales_order: z.string().optional(),
  users: z.array(z.unknown()).optional(),
  copied_from: z.string().optional(),
  notes: z.string().optional(),
  actual_start_date: z.string().optional(),
  actual_time: z.number().optional(),
  actual_end_date: z.string().optional(),
  estimated_costing: z.number().optional(),
  total_costing_amount: z.number().optional(),
  total_purchase_cost: z.number().optional(),
  company: z.string(),
  total_sales_amount: z.number().optional(),
  total_billable_amount: z.number().optional(),
  total_billed_amount: z.number().optional(),
  total_consumed_material_cost: z.number().optional(),
  cost_center: z.string().optional(),
  gross_margin: z.number().optional(),
  per_gross_margin: z.number().optional(),
  collect_progress: z.boolean().optional().default(false),
  holiday_list: z.string().optional(),
  frequency: z.enum(['Hourly', 'Twice Daily', 'Daily', 'Weekly']).optional(),
  from_time: z.string().optional(),
  to_time: z.string().optional(),
  first_email: z.string().optional(),
  second_email: z.string().optional(),
  daily_time_to_send: z.string().optional(),
  day_to_send: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).optional(),
  weekly_time_to_send: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const ProjectInsertSchema = ProjectSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProjectInsert = z.infer<typeof ProjectInsertSchema>;

export const ProjectTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  project_type: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  tasks: z.array(z.unknown()),
});

export type ProjectTemplate = z.infer<typeof ProjectTemplateSchema>;

export const ProjectTemplateInsertSchema = ProjectTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProjectTemplateInsert = z.infer<typeof ProjectTemplateInsertSchema>;

export const ProjectTemplateTaskSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  task: z.string(),
  subject: z.string().optional(),
});

export type ProjectTemplateTask = z.infer<typeof ProjectTemplateTaskSchema>;

export const ProjectTemplateTaskInsertSchema = ProjectTemplateTaskSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProjectTemplateTaskInsert = z.infer<typeof ProjectTemplateTaskInsertSchema>;

export const ProjectTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  project_type: z.string(),
  description: z.string().optional(),
});

export type ProjectType = z.infer<typeof ProjectTypeSchema>;

export const ProjectTypeInsertSchema = ProjectTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProjectTypeInsert = z.infer<typeof ProjectTypeInsertSchema>;

export const ProjectUpdateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.string().optional(),
  project: z.string(),
  sent: z.boolean().optional().default(false),
  date: z.string().optional(),
  time: z.string().optional(),
  users: z.array(z.unknown()).optional(),
  amended_from: z.string().optional(),
});

export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;

export const ProjectUpdateInsertSchema = ProjectUpdateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProjectUpdateInsert = z.infer<typeof ProjectUpdateInsertSchema>;

export const ProjectUserSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  user: z.string(),
  email: z.string().optional(),
  image: z.string().optional(),
  full_name: z.string().optional(),
  welcome_email_sent: z.boolean().optional().default(false),
  view_attachments: z.boolean().optional().default(false),
  hide_timesheets: z.boolean().optional().default(false),
  project_status: z.string().optional(),
});

export type ProjectUser = z.infer<typeof ProjectUserSchema>;

export const ProjectUserInsertSchema = ProjectUserSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProjectUserInsert = z.infer<typeof ProjectUserInsertSchema>;

export const ProjectsSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  ignore_workstation_time_overlap: z.boolean().optional().default(false),
  ignore_user_time_overlap: z.boolean().optional().default(false),
  ignore_employee_time_overlap: z.boolean().optional().default(false),
  fetch_timesheet_in_sales_invoice: z.boolean().optional().default(false),
});

export type ProjectsSettings = z.infer<typeof ProjectsSettingsSchema>;

export const ProjectsSettingsInsertSchema = ProjectsSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProjectsSettingsInsert = z.infer<typeof ProjectsSettingsInsertSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  subject: z.string(),
  project: z.string().optional(),
  issue: z.string().optional(),
  type: z.string().optional(),
  color: z.string().optional(),
  is_group: z.boolean().optional().default(false),
  is_template: z.boolean().optional().default(false),
  status: z.enum(['Open', 'Working', 'Pending Review', 'Overdue', 'Template', 'Completed', 'Cancelled']).optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional(),
  task_weight: z.number().optional(),
  parent_task: z.string().optional(),
  completed_by: z.string().optional(),
  completed_on: z.string().optional(),
  exp_start_date: z.string().optional(),
  expected_time: z.number().optional().default(0),
  start: z.number().int().optional(),
  exp_end_date: z.string().optional(),
  progress: z.number().optional(),
  duration: z.number().int().optional(),
  is_milestone: z.boolean().optional().default(false),
  description: z.string().optional(),
  depends_on: z.array(z.unknown()).optional(),
  depends_on_tasks: z.string().optional(),
  act_start_date: z.string().optional(),
  actual_time: z.number().optional(),
  act_end_date: z.string().optional(),
  total_costing_amount: z.number().optional(),
  total_billing_amount: z.number().optional(),
  review_date: z.string().optional(),
  closing_date: z.string().optional(),
  department: z.string().optional(),
  company: z.string().optional(),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
  template_task: z.string().optional(),
});

export type Task = z.infer<typeof TaskSchema>;

export const TaskInsertSchema = TaskSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TaskInsert = z.infer<typeof TaskInsertSchema>;

export const TaskDependsOnSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  task: z.string().optional(),
  subject: z.string().optional(),
  project: z.string().optional(),
});

export type TaskDependsOn = z.infer<typeof TaskDependsOnSchema>;

export const TaskDependsOnInsertSchema = TaskDependsOnSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TaskDependsOnInsert = z.infer<typeof TaskDependsOnInsertSchema>;

export const TaskTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  weight: z.number().optional(),
  description: z.string().optional(),
});

export type TaskType = z.infer<typeof TaskTypeSchema>;

export const TaskTypeInsertSchema = TaskTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TaskTypeInsert = z.infer<typeof TaskTypeInsertSchema>;

export const TimesheetSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  title: z.string().optional().default('{employee_name}'),
  naming_series: z.enum(['TS-.YYYY.-']),
  company: z.string().optional(),
  customer: z.string().optional(),
  currency: z.string().optional(),
  exchange_rate: z.number().optional().default(1),
  sales_invoice: z.string().optional(),
  status: z.enum(['Draft', 'Submitted', 'Partially Billed', 'Billed', 'Payslip', 'Completed', 'Cancelled']).optional().default('Draft'),
  parent_project: z.string().optional(),
  employee: z.string().optional(),
  employee_name: z.string().optional(),
  department: z.string().optional(),
  user: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  time_logs: z.array(z.unknown()),
  total_hours: z.number().optional().default(0),
  total_billable_hours: z.number().optional(),
  base_total_billable_amount: z.number().optional(),
  base_total_billed_amount: z.number().optional(),
  base_total_costing_amount: z.number().optional(),
  total_billed_hours: z.number().optional(),
  total_billable_amount: z.number().optional().default(0),
  total_billed_amount: z.number().optional(),
  total_costing_amount: z.number().optional(),
  per_billed: z.number().optional(),
  note: z.string().optional(),
  amended_from: z.string().optional(),
});

export type Timesheet = z.infer<typeof TimesheetSchema>;

export const TimesheetInsertSchema = TimesheetSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TimesheetInsert = z.infer<typeof TimesheetInsertSchema>;

export const TimesheetDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  activity_type: z.string().optional(),
  from_time: z.string().optional(),
  description: z.string().optional(),
  expected_hours: z.number().optional(),
  to_time: z.string().optional(),
  hours: z.number().optional(),
  completed: z.boolean().optional().default(false),
  project: z.string().optional(),
  project_name: z.string().optional(),
  task: z.string().optional(),
  is_billable: z.boolean().optional().default(false),
  sales_invoice: z.string().optional(),
  billing_hours: z.number().optional(),
  base_billing_rate: z.number().optional(),
  base_billing_amount: z.number().optional(),
  base_costing_rate: z.number().optional(),
  base_costing_amount: z.number().optional(),
  billing_rate: z.number().optional(),
  billing_amount: z.number().optional().default(0),
  costing_rate: z.number().optional(),
  costing_amount: z.number().optional().default(0),
});

export type TimesheetDetail = z.infer<typeof TimesheetDetailSchema>;

export const TimesheetDetailInsertSchema = TimesheetDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TimesheetDetailInsert = z.infer<typeof TimesheetDetailInsertSchema>;

export const NonConformanceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  subject: z.string(),
  procedure: z.string(),
  process_owner: z.string().optional(),
  full_name: z.string().optional(),
  status: z.enum(['Open', 'Resolved', 'Cancelled']),
  details: z.string().optional(),
  corrective_action: z.string().optional(),
  preventive_action: z.string().optional(),
});

export type NonConformance = z.infer<typeof NonConformanceSchema>;

export const NonConformanceInsertSchema = NonConformanceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type NonConformanceInsert = z.infer<typeof NonConformanceInsertSchema>;

export const QualityActionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  corrective_preventive: z.enum(['Corrective', 'Preventive']).default('Corrective'),
  review: z.string().optional(),
  feedback: z.string().optional(),
  status: z.enum(['Open', 'Completed']).optional().default('Open'),
  date: z.string().optional().default('Today'),
  goal: z.string().optional(),
  procedure: z.string().optional(),
  resolutions: z.array(z.unknown()).optional(),
});

export type QualityAction = z.infer<typeof QualityActionSchema>;

export const QualityActionInsertSchema = QualityActionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityActionInsert = z.infer<typeof QualityActionInsertSchema>;

export const QualityActionResolutionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  problem: z.string().optional(),
  resolution: z.string().optional(),
  status: z.enum(['Open', 'Completed']).optional(),
  responsible: z.string().optional(),
  completion_by: z.string().optional(),
});

export type QualityActionResolution = z.infer<typeof QualityActionResolutionSchema>;

export const QualityActionResolutionInsertSchema = QualityActionResolutionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityActionResolutionInsert = z.infer<typeof QualityActionResolutionInsertSchema>;

export const QualityFeedbackSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  template: z.string(),
  document_type: z.enum(['User', 'Customer']),
  document_name: z.string(),
  parameters: z.array(z.unknown()).optional(),
});

export type QualityFeedback = z.infer<typeof QualityFeedbackSchema>;

export const QualityFeedbackInsertSchema = QualityFeedbackSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityFeedbackInsert = z.infer<typeof QualityFeedbackInsertSchema>;

export const QualityFeedbackParameterSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  parameter: z.string().optional(),
  rating: z.enum(['1', '2', '3', '4', '5']).default('1'),
  feedback: z.string().optional(),
});

export type QualityFeedbackParameter = z.infer<typeof QualityFeedbackParameterSchema>;

export const QualityFeedbackParameterInsertSchema = QualityFeedbackParameterSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityFeedbackParameterInsert = z.infer<typeof QualityFeedbackParameterInsertSchema>;

export const QualityFeedbackTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  template: z.string(),
  parameters: z.array(z.unknown()),
});

export type QualityFeedbackTemplate = z.infer<typeof QualityFeedbackTemplateSchema>;

export const QualityFeedbackTemplateInsertSchema = QualityFeedbackTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityFeedbackTemplateInsert = z.infer<typeof QualityFeedbackTemplateInsertSchema>;

export const QualityFeedbackTemplateParameterSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  parameter: z.string().optional(),
});

export type QualityFeedbackTemplateParameter = z.infer<typeof QualityFeedbackTemplateParameterSchema>;

export const QualityFeedbackTemplateParameterInsertSchema = QualityFeedbackTemplateParameterSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityFeedbackTemplateParameterInsert = z.infer<typeof QualityFeedbackTemplateParameterInsertSchema>;

export const QualityGoalSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  goal: z.string(),
  frequency: z.enum(['None', 'Daily', 'Weekly', 'Monthly', 'Quarterly']).optional().default('None'),
  procedure: z.string().optional(),
  weekday: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']).optional(),
  date: z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']).optional(),
  objectives: z.array(z.unknown()).optional(),
});

export type QualityGoal = z.infer<typeof QualityGoalSchema>;

export const QualityGoalInsertSchema = QualityGoalSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityGoalInsert = z.infer<typeof QualityGoalInsertSchema>;

export const QualityGoalObjectiveSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  objective: z.string(),
  target: z.string().optional(),
  uom: z.string().optional(),
});

export type QualityGoalObjective = z.infer<typeof QualityGoalObjectiveSchema>;

export const QualityGoalObjectiveInsertSchema = QualityGoalObjectiveSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityGoalObjectiveInsert = z.infer<typeof QualityGoalObjectiveInsertSchema>;

export const QualityMeetingSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  status: z.enum(['Open', 'Closed']).optional().default('Open'),
  agenda: z.array(z.unknown()).optional(),
  minutes: z.array(z.unknown()).optional(),
});

export type QualityMeeting = z.infer<typeof QualityMeetingSchema>;

export const QualityMeetingInsertSchema = QualityMeetingSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityMeetingInsert = z.infer<typeof QualityMeetingInsertSchema>;

export const QualityMeetingAgendaSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  agenda: z.string().optional(),
});

export type QualityMeetingAgenda = z.infer<typeof QualityMeetingAgendaSchema>;

export const QualityMeetingAgendaInsertSchema = QualityMeetingAgendaSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityMeetingAgendaInsert = z.infer<typeof QualityMeetingAgendaInsertSchema>;

export const QualityMeetingMinutesSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  document_type: z.enum(['Quality Review', 'Quality Action', 'Quality Feedback']),
  document_name: z.string().optional(),
  minute: z.string().optional(),
});

export type QualityMeetingMinutes = z.infer<typeof QualityMeetingMinutesSchema>;

export const QualityMeetingMinutesInsertSchema = QualityMeetingMinutesSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityMeetingMinutesInsert = z.infer<typeof QualityMeetingMinutesInsertSchema>;

export const QualityProcedureSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  quality_procedure_name: z.string(),
  process_owner: z.string().optional(),
  process_owner_full_name: z.string().optional(),
  processes: z.array(z.unknown()).optional(),
  parent_quality_procedure: z.string().optional(),
  is_group: z.boolean().optional().default(false),
  rgt: z.number().int().optional(),
  lft: z.number().int().optional(),
  old_parent: z.string().optional(),
});

export type QualityProcedure = z.infer<typeof QualityProcedureSchema>;

export const QualityProcedureInsertSchema = QualityProcedureSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityProcedureInsert = z.infer<typeof QualityProcedureInsertSchema>;

export const QualityProcedureProcessSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  process_description: z.string().optional(),
  procedure: z.string().optional(),
});

export type QualityProcedureProcess = z.infer<typeof QualityProcedureProcessSchema>;

export const QualityProcedureProcessInsertSchema = QualityProcedureProcessSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityProcedureProcessInsert = z.infer<typeof QualityProcedureProcessInsertSchema>;

export const QualityReviewSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  goal: z.string(),
  date: z.string().optional().default('Today'),
  procedure: z.string().optional(),
  status: z.enum(['Open', 'Passed', 'Failed']).optional().default('Open'),
  reviews: z.array(z.unknown()).optional(),
  additional_information: z.string().optional(),
});

export type QualityReview = z.infer<typeof QualityReviewSchema>;

export const QualityReviewInsertSchema = QualityReviewSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityReviewInsert = z.infer<typeof QualityReviewInsertSchema>;

export const QualityReviewObjectiveSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  objective: z.string().optional(),
  target: z.string().optional(),
  uom: z.string().optional(),
  status: z.enum(['Open', 'Passed', 'Failed']).optional().default('Open'),
  review: z.string().optional(),
});

export type QualityReviewObjective = z.infer<typeof QualityReviewObjectiveSchema>;

export const QualityReviewObjectiveInsertSchema = QualityReviewObjectiveSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityReviewObjectiveInsert = z.infer<typeof QualityReviewObjectiveInsertSchema>;

export const ImportSupplierInvoiceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  invoice_series: z.enum(['ACC-PINV-.YYYY.-']),
  company: z.string(),
  item_code: z.string(),
  supplier_group: z.string(),
  tax_account: z.string(),
  default_buying_price_list: z.string(),
  zip_file: z.string().optional(),
  status: z.string().optional(),
});

export type ImportSupplierInvoice = z.infer<typeof ImportSupplierInvoiceSchema>;

export const ImportSupplierInvoiceInsertSchema = ImportSupplierInvoiceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ImportSupplierInvoiceInsert = z.infer<typeof ImportSupplierInvoiceInsertSchema>;

export const LowerDeductionCertificateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  tax_withholding_category: z.string(),
  fiscal_year: z.string(),
  company: z.string(),
  certificate_no: z.string(),
  supplier: z.string(),
  pan_no: z.string(),
  valid_from: z.string(),
  valid_upto: z.string(),
  rate: z.number(),
  certificate_limit: z.number(),
});

export type LowerDeductionCertificate = z.infer<typeof LowerDeductionCertificateSchema>;

export const LowerDeductionCertificateInsertSchema = LowerDeductionCertificateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LowerDeductionCertificateInsert = z.infer<typeof LowerDeductionCertificateInsertSchema>;

export const SouthAfricaVatSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
  vat_accounts: z.array(z.unknown()),
});

export type SouthAfricaVatSettings = z.infer<typeof SouthAfricaVatSettingsSchema>;

export const SouthAfricaVatSettingsInsertSchema = SouthAfricaVatSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SouthAfricaVatSettingsInsert = z.infer<typeof SouthAfricaVatSettingsInsertSchema>;

export const UaeVatAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account: z.string().optional(),
});

export type UaeVatAccount = z.infer<typeof UaeVatAccountSchema>;

export const UaeVatAccountInsertSchema = UaeVatAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type UaeVatAccountInsert = z.infer<typeof UaeVatAccountInsertSchema>;

export const UaeVatSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
  uae_vat_accounts: z.array(z.unknown()),
});

export type UaeVatSettings = z.infer<typeof UaeVatSettingsSchema>;

export const UaeVatSettingsInsertSchema = UaeVatSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type UaeVatSettingsInsert = z.infer<typeof UaeVatSettingsInsertSchema>;

export const CustomerSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  naming_series: z.enum(['CUST-.YYYY.-']).optional(),
  customer_type: z.enum(['Company', 'Individual', 'Partnership']).default('Company'),
  customer_name: z.string(),
  gender: z.string().optional(),
  customer_group: z.string().optional(),
  territory: z.string().optional(),
  image: z.string().optional(),
  default_currency: z.string().optional(),
  default_bank_account: z.string().optional(),
  default_price_list: z.string().optional(),
  address_html: z.string().optional(),
  contact_html: z.string().optional(),
  customer_primary_address: z.string().optional(),
  primary_address: z.string().optional(),
  customer_primary_contact: z.string().optional(),
  mobile_no: z.string().optional(),
  email_id: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  tax_id: z.string().optional(),
  tax_category: z.string().optional(),
  tax_withholding_category: z.string().optional(),
  tax_withholding_group: z.string().optional(),
  accounts: z.array(z.unknown()).optional(),
  payment_terms: z.string().optional(),
  credit_limits: z.array(z.unknown()).optional(),
  is_internal_customer: z.boolean().optional().default(false),
  represents_company: z.string().optional(),
  companies: z.array(z.unknown()).optional(),
  loyalty_program: z.string().optional(),
  loyalty_program_tier: z.string().optional(),
  account_manager: z.string().optional(),
  sales_team: z.array(z.unknown()).optional(),
  default_sales_partner: z.string().optional(),
  default_commission_rate: z.number().optional(),
  so_required: z.boolean().optional().default(false),
  dn_required: z.boolean().optional().default(false),
  disabled: z.boolean().optional().default(false),
  is_frozen: z.boolean().optional().default(false),
  portal_users: z.array(z.unknown()).optional(),
  lead_name: z.string().optional(),
  opportunity_name: z.string().optional(),
  prospect_name: z.string().optional(),
  market_segment: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().optional(),
  language: z.string().optional(),
  customer_pos_id: z.string().optional(),
  customer_details: z.string().optional(),
  supplier_numbers: z.array(z.unknown()).optional(),
});

export type Customer = z.infer<typeof CustomerSchema>;

export const CustomerInsertSchema = CustomerSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CustomerInsert = z.infer<typeof CustomerInsertSchema>;

export const CustomerCreditLimitSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  credit_limit: z.number().optional(),
  bypass_credit_limit_check: z.boolean().optional().default(false),
});

export type CustomerCreditLimit = z.infer<typeof CustomerCreditLimitSchema>;

export const CustomerCreditLimitInsertSchema = CustomerCreditLimitSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CustomerCreditLimitInsert = z.infer<typeof CustomerCreditLimitInsertSchema>;

export const DeliveryScheduleItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  warehouse: z.string().optional(),
  delivery_date: z.string().optional(),
  sales_order: z.string().optional(),
  sales_order_item: z.string().optional(),
  qty: z.number().optional(),
  uom: z.string().optional(),
  conversion_factor: z.number().optional(),
  stock_qty: z.number().optional(),
  stock_uom: z.string().optional(),
});

export type DeliveryScheduleItem = z.infer<typeof DeliveryScheduleItemSchema>;

export const DeliveryScheduleItemInsertSchema = DeliveryScheduleItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DeliveryScheduleItemInsert = z.infer<typeof DeliveryScheduleItemInsertSchema>;

export const IndustryTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  industry: z.string(),
});

export type IndustryType = z.infer<typeof IndustryTypeSchema>;

export const IndustryTypeInsertSchema = IndustryTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type IndustryTypeInsert = z.infer<typeof IndustryTypeInsertSchema>;

export const InstallationNoteSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MAT-INS-.YYYY.-']),
  customer: z.string(),
  customer_address: z.string().optional(),
  contact_person: z.string().optional(),
  customer_name: z.string().optional(),
  address_display: z.string().optional(),
  contact_display: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().email().optional(),
  territory: z.string(),
  customer_group: z.string().optional(),
  inst_date: z.string(),
  inst_time: z.string().optional(),
  status: z.enum(['Draft', 'Submitted', 'Cancelled']).default('Draft'),
  company: z.string(),
  project: z.string().optional(),
  amended_from: z.string().optional(),
  remarks: z.string().optional(),
  items: z.array(z.unknown()),
});

export type InstallationNote = z.infer<typeof InstallationNoteSchema>;

export const InstallationNoteInsertSchema = InstallationNoteSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type InstallationNoteInsert = z.infer<typeof InstallationNoteInsertSchema>;

export const InstallationNoteItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  serial_and_batch_bundle: z.string().optional(),
  serial_no: z.string().optional(),
  qty: z.number(),
  description: z.string().optional(),
  prevdoc_detail_docname: z.string().optional(),
  prevdoc_docname: z.string().optional(),
  prevdoc_doctype: z.string().optional(),
});

export type InstallationNoteItem = z.infer<typeof InstallationNoteItemSchema>;

export const InstallationNoteItemInsertSchema = InstallationNoteItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type InstallationNoteItemInsert = z.infer<typeof InstallationNoteItemInsertSchema>;

export const PartySpecificItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  party_type: z.enum(['Customer', 'Supplier']),
  party: z.string(),
  restrict_based_on: z.enum(['Item', 'Item Group', 'Brand']),
  based_on_value: z.string(),
});

export type PartySpecificItem = z.infer<typeof PartySpecificItemSchema>;

export const PartySpecificItemInsertSchema = PartySpecificItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PartySpecificItemInsert = z.infer<typeof PartySpecificItemInsertSchema>;

export const ProductBundleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  new_item_code: z.string(),
  description: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  items: z.array(z.unknown()),
  about: z.string().optional(),
});

export type ProductBundle = z.infer<typeof ProductBundleSchema>;

export const ProductBundleInsertSchema = ProductBundleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProductBundleInsert = z.infer<typeof ProductBundleInsertSchema>;

export const ProductBundleItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  qty: z.number(),
  description: z.string().optional(),
  rate: z.number().optional(),
  uom: z.string().optional(),
});

export type ProductBundleItem = z.infer<typeof ProductBundleItemSchema>;

export const ProductBundleItemInsertSchema = ProductBundleItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProductBundleItemInsert = z.infer<typeof ProductBundleItemInsertSchema>;

export const QuotationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['SAL-QTN-.YYYY.-']),
  quotation_to: z.string().default('Customer'),
  party_name: z.string().optional(),
  customer_name: z.string().optional(),
  transaction_date: z.string().default('Today'),
  valid_till: z.string().optional(),
  order_type: z.enum(['Sales', 'Maintenance', 'Shopping Cart']).default('Sales'),
  company: z.string(),
  has_unit_price_items: z.boolean().optional().default(false),
  amended_from: z.string().optional(),
  currency: z.string(),
  conversion_rate: z.number(),
  selling_price_list: z.string(),
  price_list_currency: z.string(),
  plc_conversion_rate: z.number(),
  ignore_pricing_rule: z.boolean().optional().default(false),
  scan_barcode: z.string().optional(),
  last_scanned_warehouse: z.string().optional(),
  items: z.array(z.unknown()),
  total_qty: z.number().optional(),
  total_net_weight: z.number().optional(),
  base_total: z.number().optional(),
  base_net_total: z.number().optional(),
  total: z.number().optional(),
  net_total: z.number().optional(),
  tax_category: z.string().optional(),
  taxes_and_charges: z.string().optional(),
  shipping_rule: z.string().optional(),
  incoterm: z.string().optional(),
  named_place: z.string().optional(),
  taxes: z.array(z.unknown()).optional(),
  base_total_taxes_and_charges: z.number().optional(),
  total_taxes_and_charges: z.number().optional(),
  grand_total: z.number().optional(),
  in_words: z.string().max(240).optional(),
  rounded_total: z.number().optional(),
  rounding_adjustment: z.number().optional(),
  disable_rounded_total: z.boolean().optional().default(false),
  base_grand_total: z.number().optional(),
  base_in_words: z.string().max(240).optional(),
  base_rounded_total: z.number().optional(),
  base_rounding_adjustment: z.number().optional(),
  apply_discount_on: z.enum(['Grand Total', 'Net Total']).optional().default('Grand Total'),
  base_discount_amount: z.number().optional(),
  coupon_code: z.string().optional(),
  additional_discount_percentage: z.number().optional(),
  discount_amount: z.number().optional(),
  referral_sales_partner: z.string().optional(),
  other_charges_calculation: z.string().optional(),
  item_wise_tax_details: z.array(z.unknown()).optional(),
  packed_items: z.array(z.unknown()).optional(),
  pricing_rules: z.array(z.unknown()).optional(),
  customer_address: z.string().optional(),
  address_display: z.string().optional(),
  contact_person: z.string().optional(),
  contact_display: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().email().optional(),
  shipping_address_name: z.string().optional(),
  shipping_address: z.string().optional(),
  company_address: z.string().optional(),
  company_address_display: z.string().optional(),
  company_contact_person: z.string().optional(),
  payment_terms_template: z.string().optional(),
  payment_schedule: z.array(z.unknown()).optional(),
  tc_name: z.string().optional(),
  terms: z.string().optional(),
  auto_repeat: z.string().optional(),
  letter_head: z.string().optional(),
  group_same_items: z.boolean().optional().default(false),
  select_print_heading: z.string().optional(),
  language: z.string().optional(),
  lost_reasons: z.array(z.unknown()).optional(),
  competitors: z.array(z.unknown()).optional(),
  order_lost_reason: z.string().optional(),
  status: z.enum(['Draft', 'Open', 'Replied', 'Partially Ordered', 'Ordered', 'Lost', 'Cancelled', 'Expired']).default('Draft'),
  customer_group: z.string().optional(),
  territory: z.string().optional(),
  utm_source: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_content: z.string().optional(),
  opportunity: z.string().optional(),
  supplier_quotation: z.string().optional(),
  enq_det: z.string().optional(),
});

export type Quotation = z.infer<typeof QuotationSchema>;

export const QuotationInsertSchema = QuotationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QuotationInsert = z.infer<typeof QuotationInsertSchema>;

export const QuotationItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  item_name: z.string(),
  customer_item_code: z.string().optional(),
  is_free_item: z.boolean().optional().default(false),
  is_alternative: z.boolean().optional().default(false),
  has_alternative_item: z.boolean().optional().default(false),
  description: z.string().optional(),
  item_group: z.string().optional(),
  brand: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  qty: z.number(),
  stock_uom: z.string().optional(),
  uom: z.string(),
  conversion_factor: z.number(),
  stock_qty: z.number().optional(),
  ordered_qty: z.number().default(0),
  actual_qty: z.number().optional(),
  company_total_stock: z.number().optional(),
  price_list_rate: z.number().optional(),
  base_price_list_rate: z.number().optional(),
  margin_type: z.enum(['Percentage', 'Amount']).optional(),
  margin_rate_or_amount: z.number().optional(),
  rate_with_margin: z.number().optional(),
  discount_percentage: z.number().optional(),
  discount_amount: z.number().optional(),
  distributed_discount_amount: z.number().optional(),
  base_rate_with_margin: z.number().optional(),
  rate: z.number().optional(),
  net_rate: z.number().optional(),
  amount: z.number().optional(),
  net_amount: z.number().optional(),
  item_tax_template: z.string().optional(),
  base_rate: z.number().optional(),
  base_net_rate: z.number().optional(),
  base_amount: z.number().optional(),
  base_net_amount: z.number().optional(),
  pricing_rules: z.string().optional(),
  stock_uom_rate: z.number().optional(),
  valuation_rate: z.number().optional(),
  gross_profit: z.number().optional(),
  weight_per_unit: z.number().optional(),
  total_weight: z.number().optional(),
  weight_uom: z.string().optional(),
  warehouse: z.string().optional(),
  against_blanket_order: z.boolean().optional().default(false),
  blanket_order: z.string().optional(),
  blanket_order_rate: z.number().optional(),
  prevdoc_doctype: z.string().optional(),
  prevdoc_docname: z.string().optional(),
  projected_qty: z.number().optional(),
  item_tax_rate: z.string().optional(),
  additional_notes: z.string().optional(),
  page_break: z.boolean().optional().default(false),
});

export type QuotationItem = z.infer<typeof QuotationItemSchema>;

export const QuotationItemInsertSchema = QuotationItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QuotationItemInsert = z.infer<typeof QuotationItemInsertSchema>;

export const SmsCenterSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  send_to: z.enum(['All Contact', 'All Customer Contact', 'All Supplier Contact', 'All Sales Partner Contact', 'All Lead (Open)', 'All Employee (Active)', 'All Sales Person']).optional(),
  customer: z.string().optional(),
  supplier: z.string().optional(),
  sales_partner: z.string().optional(),
  department: z.string().optional(),
  branch: z.string().optional(),
  receiver_list: z.string().optional(),
  message: z.string(),
  total_characters: z.number().int().optional(),
  total_messages: z.number().int().optional(),
});

export type SmsCenter = z.infer<typeof SmsCenterSchema>;

export const SmsCenterInsertSchema = SmsCenterSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SmsCenterInsert = z.infer<typeof SmsCenterInsertSchema>;

export const SalesOrderSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string(),
  naming_series: z.enum(['SAL-ORD-.YYYY.-']),
  customer: z.string(),
  customer_name: z.string().optional(),
  order_type: z.enum(['Sales', 'Maintenance', 'Shopping Cart']).default('Sales'),
  transaction_date: z.string().default('Today'),
  delivery_date: z.string().optional(),
  tax_id: z.string().optional(),
  skip_delivery_note: z.boolean().optional().default(false),
  has_unit_price_items: z.boolean().optional().default(false),
  is_subcontracted: z.boolean().optional().default(false),
  amended_from: z.string().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  currency: z.string(),
  conversion_rate: z.number(),
  selling_price_list: z.string(),
  price_list_currency: z.string(),
  plc_conversion_rate: z.number(),
  ignore_pricing_rule: z.boolean().optional().default(false),
  scan_barcode: z.string().optional(),
  last_scanned_warehouse: z.string().optional(),
  set_warehouse: z.string().optional(),
  reserve_stock: z.boolean().optional().default(false),
  items: z.array(z.unknown()),
  total_qty: z.number().optional(),
  total_net_weight: z.number().optional(),
  base_total: z.number().optional(),
  base_net_total: z.number().optional(),
  total: z.number().optional(),
  net_total: z.number().optional(),
  tax_category: z.string().optional(),
  taxes_and_charges: z.string().optional(),
  shipping_rule: z.string().optional(),
  incoterm: z.string().optional(),
  named_place: z.string().optional(),
  taxes: z.array(z.unknown()).optional(),
  base_total_taxes_and_charges: z.number().optional(),
  total_taxes_and_charges: z.number().optional(),
  grand_total: z.number().optional(),
  in_words: z.string().max(240).optional(),
  disable_rounded_total: z.boolean().optional().default(false),
  rounded_total: z.number().optional(),
  rounding_adjustment: z.number().optional(),
  base_grand_total: z.number().optional(),
  base_in_words: z.string().max(240).optional(),
  base_rounded_total: z.number().optional(),
  base_rounding_adjustment: z.number().optional(),
  advance_paid: z.number().optional(),
  apply_discount_on: z.enum(['Grand Total', 'Net Total']).optional().default('Grand Total'),
  base_discount_amount: z.number().optional(),
  coupon_code: z.string().optional(),
  additional_discount_percentage: z.number().optional(),
  discount_amount: z.number().optional(),
  other_charges_calculation: z.string().optional(),
  item_wise_tax_details: z.array(z.unknown()).optional(),
  packed_items: z.array(z.unknown()).optional(),
  pricing_rules: z.array(z.unknown()).optional(),
  customer_address: z.string().optional(),
  address_display: z.string().optional(),
  customer_group: z.string().optional(),
  territory: z.string().optional(),
  contact_person: z.string().optional(),
  contact_display: z.string().optional(),
  contact_phone: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().email().optional(),
  shipping_address_name: z.string().optional(),
  shipping_address: z.string().optional(),
  dispatch_address_name: z.string().optional(),
  dispatch_address: z.string().optional(),
  company_address: z.string().optional(),
  company_address_display: z.string().optional(),
  company_contact_person: z.string().optional(),
  payment_terms_template: z.string().optional(),
  payment_schedule: z.array(z.unknown()).optional(),
  tc_name: z.string().optional(),
  terms: z.string().optional(),
  status: z.enum(['Draft', 'On Hold', 'To Pay', 'To Deliver and Bill', 'To Bill', 'To Deliver', 'Completed', 'Cancelled', 'Closed']).default('Draft'),
  delivery_status: z.enum(['Not Delivered', 'Fully Delivered', 'Partly Delivered', 'Closed', 'Not Applicable']).optional(),
  per_delivered: z.number().optional(),
  per_billed: z.number().optional(),
  per_picked: z.number().optional(),
  billing_status: z.enum(['Not Billed', 'Fully Billed', 'Partly Billed', 'Closed']).optional(),
  advance_payment_status: z.enum(['Not Requested', 'Requested', 'Partially Paid', 'Fully Paid']).optional(),
  sales_partner: z.string().optional(),
  amount_eligible_for_commission: z.number().optional(),
  commission_rate: z.number().optional(),
  total_commission: z.number().optional(),
  sales_team: z.array(z.unknown()).optional(),
  loyalty_points: z.number().int().optional(),
  loyalty_amount: z.number().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  auto_repeat: z.string().optional(),
  letter_head: z.string().optional(),
  group_same_items: z.boolean().optional().default(false),
  select_print_heading: z.string().optional(),
  language: z.string().optional(),
  is_internal_customer: z.boolean().optional().default(false),
  po_no: z.string().optional(),
  po_date: z.string().optional(),
  represents_company: z.string().optional(),
  utm_source: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_content: z.string().optional(),
  inter_company_order_reference: z.string().optional(),
  party_account_currency: z.string().optional(),
});

export type SalesOrder = z.infer<typeof SalesOrderSchema>;

export const SalesOrderInsertSchema = SalesOrderSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesOrderInsert = z.infer<typeof SalesOrderInsertSchema>;

export const SalesOrderItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  fg_item: z.string().optional(),
  fg_item_qty: z.number().optional(),
  item_code: z.string(),
  customer_item_code: z.string().optional(),
  ensure_delivery_based_on_produced_serial_no: z.boolean().optional().default(false),
  is_stock_item: z.boolean().optional().default(false),
  reserve_stock: z.boolean().optional().default(true),
  delivery_date: z.string().optional(),
  item_name: z.string(),
  description: z.string().optional(),
  item_group: z.string().optional(),
  brand: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  qty: z.number(),
  stock_uom: z.string().optional(),
  subcontracted_qty: z.number().optional().default(0),
  uom: z.string(),
  conversion_factor: z.number(),
  stock_qty: z.number().optional(),
  stock_reserved_qty: z.number().optional().default(0),
  price_list_rate: z.number().optional(),
  base_price_list_rate: z.number().optional(),
  margin_type: z.enum(['Percentage', 'Amount']).optional(),
  margin_rate_or_amount: z.number().optional(),
  rate_with_margin: z.number().optional(),
  discount_percentage: z.number().optional(),
  discount_amount: z.number().optional(),
  distributed_discount_amount: z.number().optional(),
  base_rate_with_margin: z.number().optional(),
  rate: z.number().optional(),
  amount: z.number().optional(),
  item_tax_template: z.string().optional(),
  base_rate: z.number().optional(),
  base_amount: z.number().optional(),
  pricing_rules: z.string().optional(),
  stock_uom_rate: z.number().optional(),
  is_free_item: z.boolean().optional().default(false),
  grant_commission: z.boolean().optional().default(false),
  net_rate: z.number().optional(),
  net_amount: z.number().optional(),
  base_net_rate: z.number().optional(),
  base_net_amount: z.number().optional(),
  billed_amt: z.number().optional(),
  valuation_rate: z.number().optional(),
  gross_profit: z.number().optional(),
  delivered_by_supplier: z.boolean().optional().default(false),
  supplier: z.string().optional(),
  weight_per_unit: z.number().optional(),
  total_weight: z.number().optional(),
  weight_uom: z.string().optional(),
  warehouse: z.string().optional(),
  target_warehouse: z.string().optional(),
  prevdoc_docname: z.string().optional(),
  quotation_item: z.string().optional(),
  against_blanket_order: z.boolean().optional().default(false),
  blanket_order: z.string().optional(),
  blanket_order_rate: z.number().optional(),
  actual_qty: z.number().optional(),
  company_total_stock: z.number().optional(),
  bom_no: z.string().optional(),
  projected_qty: z.number().optional(),
  ordered_qty: z.number().optional(),
  planned_qty: z.number().optional(),
  production_plan_qty: z.number().optional(),
  work_order_qty: z.number().optional(),
  delivered_qty: z.number().optional(),
  produced_qty: z.number().optional(),
  returned_qty: z.number().optional(),
  picked_qty: z.number().optional(),
  additional_notes: z.string().optional(),
  page_break: z.boolean().optional().default(false),
  item_tax_rate: z.string().optional(),
  transaction_date: z.string().optional(),
  material_request: z.string().optional(),
  purchase_order: z.string().optional(),
  material_request_item: z.string().optional(),
  purchase_order_item: z.string().optional(),
  cost_center: z.string().optional().default(':Company'),
  project: z.string().optional(),
});

export type SalesOrderItem = z.infer<typeof SalesOrderItemSchema>;

export const SalesOrderItemInsertSchema = SalesOrderItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesOrderItemInsert = z.infer<typeof SalesOrderItemInsertSchema>;

export const SalesPartnerTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  sales_partner_type: z.string(),
});

export type SalesPartnerType = z.infer<typeof SalesPartnerTypeSchema>;

export const SalesPartnerTypeInsertSchema = SalesPartnerTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesPartnerTypeInsert = z.infer<typeof SalesPartnerTypeInsertSchema>;

export const SalesTeamSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  sales_person: z.string(),
  contact_no: z.string().optional(),
  allocated_percentage: z.number().optional(),
  allocated_amount: z.number().optional(),
  commission_rate: z.string().optional(),
  incentives: z.number().optional(),
});

export type SalesTeam = z.infer<typeof SalesTeamSchema>;

export const SalesTeamInsertSchema = SalesTeamSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesTeamInsert = z.infer<typeof SalesTeamInsertSchema>;

export const SellingSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  cust_master_name: z.enum(['Customer Name', 'Naming Series', 'Auto Name']).optional().default('Customer Name'),
  customer_group: z.string().optional(),
  territory: z.string().optional(),
  selling_price_list: z.string().optional(),
  maintain_same_rate_action: z.enum(['Stop', 'Warn']).optional().default('Stop'),
  role_to_override_stop_action: z.string().optional(),
  maintain_same_sales_rate: z.boolean().optional().default(false),
  fallback_to_default_price_list: z.boolean().optional().default(false),
  editable_price_list_rate: z.boolean().optional().default(false),
  validate_selling_price: z.boolean().optional().default(false),
  editable_bundle_item_rates: z.boolean().optional().default(false),
  allow_negative_rates_for_items: z.boolean().optional().default(false),
  so_required: z.enum(['No', 'Yes']).optional(),
  dn_required: z.enum(['No', 'Yes']).optional(),
  sales_update_frequency: z.enum(['Monthly', 'Each Transaction', 'Daily']).default('Daily'),
  blanket_order_allowance: z.number().optional(),
  enable_tracking_sales_commissions: z.boolean().optional().default(false),
  allow_multiple_items: z.boolean().optional().default(false),
  allow_against_multiple_purchase_orders: z.boolean().optional().default(false),
  allow_sales_order_creation_for_expired_quotation: z.boolean().optional().default(false),
  dont_reserve_sales_order_qty_on_sales_return: z.boolean().optional().default(false),
  hide_tax_id: z.boolean().optional().default(false),
  enable_discount_accounting: z.boolean().optional().default(false),
  enable_cutoff_date_on_bulk_delivery_note_creation: z.boolean().optional().default(false),
  allow_zero_qty_in_quotation: z.boolean().optional().default(false),
  allow_zero_qty_in_sales_order: z.boolean().optional().default(false),
  set_zero_rate_for_expired_batch: z.boolean().optional().default(false),
  use_legacy_js_reactivity: z.boolean().optional().default(false),
  allow_delivery_of_overproduced_qty: z.boolean().optional().default(false),
  deliver_scrap_items: z.boolean().optional().default(false),
});

export type SellingSettings = z.infer<typeof SellingSettingsSchema>;

export const SellingSettingsInsertSchema = SellingSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SellingSettingsInsert = z.infer<typeof SellingSettingsInsertSchema>;

export const SupplierNumberAtCustomerSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  supplier_number: z.string().optional(),
});

export type SupplierNumberAtCustomer = z.infer<typeof SupplierNumberAtCustomerSchema>;

export const SupplierNumberAtCustomerInsertSchema = SupplierNumberAtCustomerSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierNumberAtCustomerInsert = z.infer<typeof SupplierNumberAtCustomerInsertSchema>;

export const AuthorizationControlSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
});

export type AuthorizationControl = z.infer<typeof AuthorizationControlSchema>;

export const AuthorizationControlInsertSchema = AuthorizationControlSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AuthorizationControlInsert = z.infer<typeof AuthorizationControlInsertSchema>;

export const AuthorizationRuleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  transaction: z.enum(['Sales Order', 'Purchase Order', 'Quotation', 'Delivery Note', 'Sales Invoice', 'Purchase Invoice', 'Purchase Receipt']),
  based_on: z.enum(['Grand Total', 'Average Discount', 'Customerwise Discount', 'Itemwise Discount', 'Item Group wise Discount', 'Not Applicable']),
  customer_or_item: z.enum(['Customer', 'Item', 'Item Group']).optional(),
  master_name: z.string().optional(),
  company: z.string().optional(),
  value: z.number().optional(),
  system_role: z.string().optional(),
  to_emp: z.string().optional(),
  system_user: z.string().optional(),
  to_designation: z.string().optional(),
  approving_role: z.string().optional(),
  approving_user: z.string().optional(),
});

export type AuthorizationRule = z.infer<typeof AuthorizationRuleSchema>;

export const AuthorizationRuleInsertSchema = AuthorizationRuleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AuthorizationRuleInsert = z.infer<typeof AuthorizationRuleInsertSchema>;

export const BranchSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  branch: z.string(),
});

export type Branch = z.infer<typeof BranchSchema>;

export const BranchInsertSchema = BranchSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BranchInsert = z.infer<typeof BranchInsertSchema>;

export const BrandSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  brand: z.string(),
  image: z.string().optional(),
  description: z.string().optional(),
  brand_defaults: z.array(z.unknown()).optional(),
});

export type Brand = z.infer<typeof BrandSchema>;

export const BrandInsertSchema = BrandSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BrandInsert = z.infer<typeof BrandInsertSchema>;

export const CompanySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company_name: z.string(),
  abbr: z.string(),
  default_currency: z.string(),
  country: z.string(),
  is_group: z.boolean().optional().default(false),
  default_holiday_list: z.string().optional(),
  default_letter_head: z.string().optional(),
  tax_id: z.string().optional(),
  domain: z.string().optional(),
  date_of_establishment: z.string().optional(),
  parent_company: z.string().optional(),
  reporting_currency: z.string().optional(),
  company_logo: z.string().optional(),
  date_of_incorporation: z.string().optional(),
  phone_no: z.string().optional(),
  email: z.string().email().optional(),
  company_description: z.string().optional(),
  date_of_commencement: z.string().optional(),
  fax: z.string().optional(),
  website: z.string().optional(),
  address_html: z.string().optional(),
  registration_details: z.string().optional(),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
  create_chart_of_accounts_based_on: z.enum(['Standard Template', 'Existing Company']).optional(),
  existing_company: z.string().optional(),
  chart_of_accounts: z.string().optional(),
  default_bank_account: z.string().optional(),
  default_cash_account: z.string().optional(),
  default_receivable_account: z.string().optional(),
  default_payable_account: z.string().optional(),
  write_off_account: z.string().optional(),
  unrealized_profit_loss_account: z.string().optional(),
  allow_account_creation_against_child_company: z.boolean().optional().default(false),
  default_expense_account: z.string().optional(),
  default_income_account: z.string().optional(),
  default_discount_account: z.string().optional(),
  payment_terms: z.string().optional(),
  cost_center: z.string().optional(),
  default_finance_book: z.string().optional(),
  exchange_gain_loss_account: z.string().optional(),
  unrealized_exchange_gain_loss_account: z.string().optional(),
  round_off_account: z.string().optional(),
  round_off_cost_center: z.string().optional(),
  round_off_for_opening: z.string().optional(),
  default_deferred_revenue_account: z.string().optional(),
  default_deferred_expense_account: z.string().optional(),
  book_advance_payments_in_separate_party_account: z.boolean().optional().default(false),
  reconcile_on_advance_payment_date: z.boolean().optional().default(false),
  reconciliation_takes_effect_on: z.enum(['Advance Payment Date', 'Oldest Of Invoice Or Advance', 'Reconciliation Date']).optional().default('Oldest Of Invoice Or Advance'),
  default_advance_received_account: z.string().optional(),
  default_advance_paid_account: z.string().optional(),
  auto_exchange_rate_revaluation: z.boolean().optional().default(false),
  auto_err_frequency: z.enum(['Daily', 'Weekly', 'Monthly']).optional(),
  submit_err_jv: z.boolean().optional().default(false),
  exception_budget_approver_role: z.string().optional(),
  accumulated_depreciation_account: z.string().optional(),
  depreciation_expense_account: z.string().optional(),
  series_for_depreciation_entry: z.string().optional(),
  disposal_account: z.string().optional(),
  depreciation_cost_center: z.string().optional(),
  capital_work_in_progress_account: z.string().optional(),
  asset_received_but_not_billed: z.string().optional(),
  accounts_frozen_till_date: z.string().optional(),
  role_allowed_for_frozen_entries: z.string().optional(),
  default_buying_terms: z.string().optional(),
  sales_monthly_history: z.string().optional(),
  monthly_sales_target: z.number().optional(),
  total_monthly_sales: z.number().optional(),
  default_selling_terms: z.string().optional(),
  default_sales_contact: z.string().optional(),
  default_warehouse_for_sales_return: z.string().optional(),
  credit_limit: z.number().optional(),
  transactions_annual_history: z.string().optional(),
  purchase_expense_account: z.string().optional(),
  service_expense_account: z.string().optional(),
  purchase_expense_contra_account: z.string().optional(),
  enable_perpetual_inventory: z.boolean().optional().default(true),
  enable_item_wise_inventory_account: z.boolean().optional().default(false),
  enable_provisional_accounting_for_non_stock_items: z.boolean().optional().default(false),
  default_inventory_account: z.string().optional(),
  valuation_method: z.enum(['FIFO', 'Moving Average', 'LIFO']).default('FIFO'),
  stock_adjustment_account: z.string().optional(),
  stock_received_but_not_billed: z.string().optional(),
  default_provisional_account: z.string().optional(),
  default_in_transit_warehouse: z.string().optional(),
  default_operating_cost_account: z.string().optional(),
  default_wip_warehouse: z.string().optional(),
  default_fg_warehouse: z.string().optional(),
  default_scrap_warehouse: z.string().optional(),
});

export type Company = z.infer<typeof CompanySchema>;

export const CompanyInsertSchema = CompanySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CompanyInsert = z.infer<typeof CompanyInsertSchema>;

export const CurrencyExchangeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  date: z.string(),
  from_currency: z.string(),
  to_currency: z.string(),
  exchange_rate: z.number(),
  for_buying: z.boolean().optional().default(true),
  for_selling: z.boolean().optional().default(true),
});

export type CurrencyExchange = z.infer<typeof CurrencyExchangeSchema>;

export const CurrencyExchangeInsertSchema = CurrencyExchangeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CurrencyExchangeInsert = z.infer<typeof CurrencyExchangeInsertSchema>;

export const CustomerGroupSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  customer_group_name: z.string(),
  parent_customer_group: z.string().optional(),
  is_group: z.boolean().optional().default(false),
  default_price_list: z.string().optional(),
  payment_terms: z.string().optional(),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
  accounts: z.array(z.unknown()).optional(),
  credit_limits: z.array(z.unknown()).optional(),
});

export type CustomerGroup = z.infer<typeof CustomerGroupSchema>;

export const CustomerGroupInsertSchema = CustomerGroupSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CustomerGroupInsert = z.infer<typeof CustomerGroupInsertSchema>;

export const DepartmentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  department_name: z.string(),
  parent_department: z.string().optional(),
  company: z.string(),
  is_group: z.boolean().optional().default(false),
  disabled: z.boolean().optional().default(false),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
});

export type Department = z.infer<typeof DepartmentSchema>;

export const DepartmentInsertSchema = DepartmentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DepartmentInsert = z.infer<typeof DepartmentInsertSchema>;

export const DesignationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  designation_name: z.string(),
  description: z.string().optional(),
});

export type Designation = z.infer<typeof DesignationSchema>;

export const DesignationInsertSchema = DesignationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DesignationInsert = z.infer<typeof DesignationInsertSchema>;

export const DriverSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  naming_series: z.enum(['HR-DRI-.YYYY.-']).optional(),
  full_name: z.string(),
  status: z.enum(['Active', 'Suspended', 'Left']),
  transporter: z.string().optional(),
  employee: z.string().optional(),
  cell_number: z.string().optional(),
  address: z.string().optional(),
  user: z.string().optional(),
  license_number: z.string().optional(),
  issuing_date: z.string().optional(),
  expiry_date: z.string().optional(),
  driving_license_category: z.array(z.unknown()).optional(),
});

export type Driver = z.infer<typeof DriverSchema>;

export const DriverInsertSchema = DriverSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DriverInsert = z.infer<typeof DriverInsertSchema>;

export const DrivingLicenseCategorySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  class: z.string().optional(),
  description: z.string().optional(),
  issuing_date: z.string().optional(),
  expiry_date: z.string().optional(),
});

export type DrivingLicenseCategory = z.infer<typeof DrivingLicenseCategorySchema>;

export const DrivingLicenseCategoryInsertSchema = DrivingLicenseCategorySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DrivingLicenseCategoryInsert = z.infer<typeof DrivingLicenseCategoryInsertSchema>;

export const EmailDigestSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  enabled: z.boolean().optional().default(false),
  company: z.string(),
  frequency: z.enum(['Daily', 'Weekly', 'Monthly']),
  next_send: z.string().optional(),
  recipients: z.array(z.unknown()),
  income: z.boolean().optional().default(false),
  expenses_booked: z.boolean().optional().default(false),
  income_year_to_date: z.boolean().optional().default(false),
  expense_year_to_date: z.boolean().optional().default(false),
  bank_balance: z.boolean().optional().default(false),
  credit_balance: z.boolean().optional().default(false),
  invoiced_amount: z.boolean().optional().default(false),
  payables: z.boolean().optional().default(false),
  sales_orders_to_bill: z.boolean().optional().default(false),
  purchase_orders_to_bill: z.boolean().optional().default(false),
  sales_order: z.boolean().optional().default(false),
  purchase_order: z.boolean().optional().default(false),
  sales_orders_to_deliver: z.boolean().optional().default(false),
  purchase_orders_to_receive: z.boolean().optional().default(false),
  sales_invoice: z.boolean().optional().default(false),
  purchase_invoice: z.boolean().optional().default(false),
  new_quotations: z.boolean().optional().default(false),
  pending_quotations: z.boolean().optional().default(false),
  issue: z.boolean().optional().default(false),
  project: z.boolean().optional().default(false),
  purchase_orders_items_overdue: z.boolean().optional().default(false),
  calendar_events: z.boolean().optional().default(false),
  todo_list: z.boolean().optional().default(false),
  notifications: z.boolean().optional().default(false),
  add_quote: z.boolean().optional().default(false),
});

export type EmailDigest = z.infer<typeof EmailDigestSchema>;

export const EmailDigestInsertSchema = EmailDigestSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type EmailDigestInsert = z.infer<typeof EmailDigestInsertSchema>;

export const EmailDigestRecipientSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  recipient: z.string(),
});

export type EmailDigestRecipient = z.infer<typeof EmailDigestRecipientSchema>;

export const EmailDigestRecipientInsertSchema = EmailDigestRecipientSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type EmailDigestRecipientInsert = z.infer<typeof EmailDigestRecipientInsertSchema>;

export const EmployeeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  employee: z.string().optional(),
  naming_series: z.enum(['HR-EMP-']).optional(),
  first_name: z.string(),
  middle_name: z.string().optional(),
  last_name: z.string().optional(),
  employee_name: z.string().optional(),
  gender: z.string(),
  date_of_birth: z.string(),
  salutation: z.string().optional(),
  date_of_joining: z.string(),
  image: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'Suspended', 'Left']).default('Active'),
  user_id: z.string().optional(),
  create_user_permission: z.boolean().optional().default(true),
  company: z.string(),
  department: z.string().optional(),
  employee_number: z.string().optional(),
  designation: z.string().optional(),
  reports_to: z.string().optional(),
  branch: z.string().optional(),
  scheduled_confirmation_date: z.string().optional(),
  final_confirmation_date: z.string().optional(),
  contract_end_date: z.string().optional(),
  notice_number_of_days: z.number().int().optional(),
  date_of_retirement: z.string().optional(),
  cell_number: z.string().optional(),
  personal_email: z.string().email().optional(),
  company_email: z.string().email().optional(),
  prefered_contact_email: z.enum(['Company Email', 'Personal Email', 'User ID']).optional(),
  prefered_email: z.string().email().optional(),
  unsubscribed: z.boolean().optional().default(false),
  current_address: z.string().optional(),
  current_accommodation_type: z.enum(['Rented', 'Owned']).optional(),
  permanent_address: z.string().optional(),
  permanent_accommodation_type: z.enum(['Rented', 'Owned']).optional(),
  person_to_be_contacted: z.string().optional(),
  emergency_phone_number: z.string().optional(),
  relation: z.string().optional(),
  attendance_device_id: z.string().optional(),
  holiday_list: z.string().optional(),
  ctc: z.number().optional(),
  salary_currency: z.string().optional(),
  salary_mode: z.enum(['Bank', 'Cash', 'Cheque']).optional(),
  bank_name: z.string().optional(),
  bank_ac_no: z.string().optional(),
  iban: z.string().optional(),
  marital_status: z.enum(['Single', 'Married', 'Divorced', 'Widowed']).optional(),
  family_background: z.string().optional(),
  blood_group: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  health_details: z.string().optional(),
  passport_number: z.string().optional(),
  valid_upto: z.string().optional(),
  date_of_issue: z.string().optional(),
  place_of_issue: z.string().optional(),
  bio: z.string().optional(),
  education: z.array(z.unknown()).optional(),
  external_work_history: z.array(z.unknown()).optional(),
  internal_work_history: z.array(z.unknown()).optional(),
  resignation_letter_date: z.string().optional(),
  relieving_date: z.string().optional(),
  held_on: z.string().optional(),
  new_workplace: z.string().optional(),
  leave_encashed: z.enum(['Yes', 'No']).optional(),
  encashment_date: z.string().optional(),
  reason_for_leaving: z.string().optional(),
  feedback: z.string().optional(),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
});

export type Employee = z.infer<typeof EmployeeSchema>;

export const EmployeeInsertSchema = EmployeeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type EmployeeInsert = z.infer<typeof EmployeeInsertSchema>;

export const EmployeeEducationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  school_univ: z.string().optional(),
  qualification: z.string().optional(),
  level: z.enum(['Graduate', 'Post Graduate', 'Under Graduate']).optional(),
  year_of_passing: z.number().int().optional(),
  class_per: z.string().optional(),
  maj_opt_subj: z.string().optional(),
});

export type EmployeeEducation = z.infer<typeof EmployeeEducationSchema>;

export const EmployeeEducationInsertSchema = EmployeeEducationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type EmployeeEducationInsert = z.infer<typeof EmployeeEducationInsertSchema>;

export const EmployeeExternalWorkHistorySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company_name: z.string().optional(),
  designation: z.string().optional(),
  salary: z.number().optional(),
  address: z.string().optional(),
  contact: z.string().optional(),
  total_experience: z.string().optional(),
});

export type EmployeeExternalWorkHistory = z.infer<typeof EmployeeExternalWorkHistorySchema>;

export const EmployeeExternalWorkHistoryInsertSchema = EmployeeExternalWorkHistorySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type EmployeeExternalWorkHistoryInsert = z.infer<typeof EmployeeExternalWorkHistoryInsertSchema>;

export const EmployeeGroupSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  employee_group_name: z.string(),
  employee_list: z.array(z.unknown()).optional(),
});

export type EmployeeGroup = z.infer<typeof EmployeeGroupSchema>;

export const EmployeeGroupInsertSchema = EmployeeGroupSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type EmployeeGroupInsert = z.infer<typeof EmployeeGroupInsertSchema>;

export const EmployeeGroupTableSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  employee: z.string().optional(),
  employee_name: z.string().optional(),
  user_id: z.string().optional(),
});

export type EmployeeGroupTable = z.infer<typeof EmployeeGroupTableSchema>;

export const EmployeeGroupTableInsertSchema = EmployeeGroupTableSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type EmployeeGroupTableInsert = z.infer<typeof EmployeeGroupTableInsertSchema>;

export const EmployeeInternalWorkHistorySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  branch: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
});

export type EmployeeInternalWorkHistory = z.infer<typeof EmployeeInternalWorkHistorySchema>;

export const EmployeeInternalWorkHistoryInsertSchema = EmployeeInternalWorkHistorySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type EmployeeInternalWorkHistoryInsert = z.infer<typeof EmployeeInternalWorkHistoryInsertSchema>;

export const GlobalDefaultsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  default_company: z.string().optional(),
  country: z.string().optional(),
  default_distance_unit: z.string().optional(),
  default_currency: z.string().default('INR'),
  hide_currency_symbol: z.enum(['No', 'Yes']).optional(),
  disable_rounded_total: z.boolean().optional().default(false),
  disable_in_words: z.boolean().optional().default(false),
  use_posting_datetime_for_naming_documents: z.boolean().optional().default(false),
  demo_company: z.string().optional(),
});

export type GlobalDefaults = z.infer<typeof GlobalDefaultsSchema>;

export const GlobalDefaultsInsertSchema = GlobalDefaultsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type GlobalDefaultsInsert = z.infer<typeof GlobalDefaultsInsertSchema>;

export const HolidaySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  holiday_date: z.string(),
  weekly_off: z.boolean().optional().default(false),
  description: z.string(),
  is_half_day: z.boolean().optional().default(false),
});

export type Holiday = z.infer<typeof HolidaySchema>;

export const HolidayInsertSchema = HolidaySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type HolidayInsert = z.infer<typeof HolidayInsertSchema>;

export const HolidayListSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  holiday_list_name: z.string(),
  from_date: z.string(),
  to_date: z.string(),
  total_holidays: z.number().int().optional(),
  weekly_off: z.enum(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']).optional(),
  is_half_day: z.boolean().optional().default(false),
  country: z.string().optional(),
  subdivision: z.string().optional(),
  holidays: z.array(z.unknown()).optional(),
  color: z.string().optional(),
});

export type HolidayList = z.infer<typeof HolidayListSchema>;

export const HolidayListInsertSchema = HolidayListSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type HolidayListInsert = z.infer<typeof HolidayListInsertSchema>;

export const IncotermSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  code: z.string().max(3),
  title: z.string(),
  description: z.string().optional(),
});

export type Incoterm = z.infer<typeof IncotermSchema>;

export const IncotermInsertSchema = IncotermSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type IncotermInsert = z.infer<typeof IncotermInsertSchema>;

export const ItemGroupSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_group_name: z.string(),
  parent_item_group: z.string().optional(),
  is_group: z.boolean().optional().default(false),
  image: z.string().optional(),
  item_group_defaults: z.array(z.unknown()).optional(),
  taxes: z.array(z.unknown()).optional(),
  lft: z.number().int().optional(),
  old_parent: z.string().optional(),
  rgt: z.number().int().optional(),
});

export type ItemGroup = z.infer<typeof ItemGroupSchema>;

export const ItemGroupInsertSchema = ItemGroupSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemGroupInsert = z.infer<typeof ItemGroupInsertSchema>;

export const PartyTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  party_type: z.string(),
  account_type: z.enum(['Payable', 'Receivable']),
});

export type PartyType = z.infer<typeof PartyTypeSchema>;

export const PartyTypeInsertSchema = PartyTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PartyTypeInsert = z.infer<typeof PartyTypeInsertSchema>;

export const QuotationLostReasonSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  order_lost_reason: z.string(),
});

export type QuotationLostReason = z.infer<typeof QuotationLostReasonSchema>;

export const QuotationLostReasonInsertSchema = QuotationLostReasonSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QuotationLostReasonInsert = z.infer<typeof QuotationLostReasonInsertSchema>;

export const QuotationLostReasonDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  lost_reason: z.string().optional(),
});

export type QuotationLostReasonDetail = z.infer<typeof QuotationLostReasonDetailSchema>;

export const QuotationLostReasonDetailInsertSchema = QuotationLostReasonDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QuotationLostReasonDetailInsert = z.infer<typeof QuotationLostReasonDetailInsertSchema>;

export const SalesPartnerSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  partner_name: z.string(),
  partner_type: z.string().optional(),
  territory: z.string(),
  commission_rate: z.number(),
  address_desc: z.string().optional(),
  address_html: z.string().optional(),
  contact_desc: z.string().optional(),
  contact_html: z.string().optional(),
  targets: z.array(z.unknown()).optional(),
  show_in_website: z.boolean().optional().default(false),
  referral_code: z.string().max(8).optional(),
  route: z.string().optional(),
  logo: z.string().optional(),
  partner_website: z.string().optional(),
  introduction: z.string().optional(),
  description: z.string().optional(),
});

export type SalesPartner = z.infer<typeof SalesPartnerSchema>;

export const SalesPartnerInsertSchema = SalesPartnerSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesPartnerInsert = z.infer<typeof SalesPartnerInsertSchema>;

export const SalesPersonSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  sales_person_name: z.string(),
  parent_sales_person: z.string().optional(),
  commission_rate: z.string().optional(),
  is_group: z.boolean().default(false),
  enabled: z.boolean().optional().default(true),
  employee: z.string().optional(),
  department: z.string().optional(),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
  targets: z.array(z.unknown()).optional(),
});

export type SalesPerson = z.infer<typeof SalesPersonSchema>;

export const SalesPersonInsertSchema = SalesPersonSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesPersonInsert = z.infer<typeof SalesPersonInsertSchema>;

export const SupplierGroupSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  supplier_group_name: z.string(),
  parent_supplier_group: z.string().optional(),
  is_group: z.boolean().optional().default(false),
  payment_terms: z.string().optional(),
  accounts: z.array(z.unknown()).optional(),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
});

export type SupplierGroup = z.infer<typeof SupplierGroupSchema>;

export const SupplierGroupInsertSchema = SupplierGroupSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupplierGroupInsert = z.infer<typeof SupplierGroupInsertSchema>;

export const TargetDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_group: z.string().optional(),
  fiscal_year: z.string(),
  target_qty: z.number().optional(),
  target_amount: z.number().optional(),
  distribution_id: z.string(),
});

export type TargetDetail = z.infer<typeof TargetDetailSchema>;

export const TargetDetailInsertSchema = TargetDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TargetDetailInsert = z.infer<typeof TargetDetailInsertSchema>;

export const TermsAndConditionsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  title: z.string(),
  disabled: z.boolean().optional().default(false),
  selling: z.boolean().optional().default(true),
  buying: z.boolean().optional().default(true),
  terms: z.string().optional(),
  terms_and_conditions_help: z.string().optional(),
});

export type TermsAndConditions = z.infer<typeof TermsAndConditionsSchema>;

export const TermsAndConditionsInsertSchema = TermsAndConditionsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TermsAndConditionsInsert = z.infer<typeof TermsAndConditionsInsertSchema>;

export const TerritorySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  territory_name: z.string(),
  parent_territory: z.string().optional(),
  is_group: z.boolean().optional().default(false),
  territory_manager: z.string().optional(),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
  targets: z.array(z.unknown()).optional(),
});

export type Territory = z.infer<typeof TerritorySchema>;

export const TerritoryInsertSchema = TerritorySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TerritoryInsert = z.infer<typeof TerritoryInsertSchema>;

export const TransactionDeletionRecordSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string(),
  status: z.enum(['Queued', 'Running', 'Failed', 'Completed', 'Cancelled']).optional(),
  error_log: z.string().optional(),
  delete_bin_data_status: z.enum(['Pending', 'Completed', 'Skipped']).optional().default('Pending'),
  delete_leads_and_addresses_status: z.enum(['Pending', 'Completed', 'Skipped']).optional().default('Pending'),
  reset_company_default_values_status: z.enum(['Pending', 'Completed', 'Skipped']).optional().default('Pending'),
  clear_notifications_status: z.enum(['Pending', 'Completed', 'Skipped']).optional().default('Pending'),
  initialize_doctypes_table_status: z.enum(['Pending', 'Completed', 'Skipped']).optional().default('Pending'),
  delete_transactions_status: z.enum(['Pending', 'Completed', 'Skipped']).optional().default('Pending'),
  doctypes: z.array(z.unknown()).optional(),
  doctypes_to_delete: z.array(z.unknown()).optional(),
  doctypes_to_be_ignored: z.array(z.unknown()).optional(),
  amended_from: z.string().optional(),
  process_in_single_transaction: z.boolean().optional().default(false),
});

export type TransactionDeletionRecord = z.infer<typeof TransactionDeletionRecordSchema>;

export const TransactionDeletionRecordInsertSchema = TransactionDeletionRecordSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TransactionDeletionRecordInsert = z.infer<typeof TransactionDeletionRecordInsertSchema>;

export const TransactionDeletionRecordItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  doctype_name: z.string(),
});

export type TransactionDeletionRecordItem = z.infer<typeof TransactionDeletionRecordItemSchema>;

export const TransactionDeletionRecordItemInsertSchema = TransactionDeletionRecordItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TransactionDeletionRecordItemInsert = z.infer<typeof TransactionDeletionRecordItemInsertSchema>;

export const TransactionDeletionRecordToDeleteSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  doctype_name: z.string().optional(),
  company_field: z.string().optional(),
  document_count: z.number().int().optional(),
  child_doctypes: z.string().optional(),
  deleted: z.boolean().optional().default(false),
});

export type TransactionDeletionRecordToDelete = z.infer<typeof TransactionDeletionRecordToDeleteSchema>;

export const TransactionDeletionRecordToDeleteInsertSchema = TransactionDeletionRecordToDeleteSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TransactionDeletionRecordToDeleteInsert = z.infer<typeof TransactionDeletionRecordToDeleteInsertSchema>;

export const UomSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  uom_name: z.string(),
  symbol: z.string().optional(),
  common_code: z.string().max(3).optional(),
  description: z.string().optional(),
  enabled: z.boolean().optional().default(true),
  must_be_whole_number: z.boolean().optional().default(false),
});

export type Uom = z.infer<typeof UomSchema>;

export const UomInsertSchema = UomSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type UomInsert = z.infer<typeof UomInsertSchema>;

export const UomConversionFactorSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  category: z.string(),
  from_uom: z.string(),
  to_uom: z.string(),
  value: z.number(),
});

export type UomConversionFactor = z.infer<typeof UomConversionFactorSchema>;

export const UomConversionFactorInsertSchema = UomConversionFactorSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type UomConversionFactorInsert = z.infer<typeof UomConversionFactorInsertSchema>;

export const VehicleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  license_plate: z.string(),
  make: z.string(),
  model: z.string(),
  company: z.string().optional(),
  last_odometer: z.number().int(),
  acquisition_date: z.string().optional(),
  location: z.string().optional(),
  chassis_no: z.string().optional(),
  vehicle_value: z.number().optional(),
  employee: z.string().optional(),
  insurance_company: z.string().optional(),
  policy_no: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  fuel_type: z.enum(['Petrol', 'Diesel', 'Natural Gas', 'Electric']),
  uom: z.string(),
  carbon_check_date: z.string().optional(),
  color: z.string().optional(),
  wheels: z.number().int().optional(),
  doors: z.number().int().optional(),
  amended_from: z.string().optional(),
});

export type Vehicle = z.infer<typeof VehicleSchema>;

export const VehicleInsertSchema = VehicleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type VehicleInsert = z.infer<typeof VehicleInsertSchema>;

export const WebsiteItemGroupSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_group: z.string(),
});

export type WebsiteItemGroup = z.infer<typeof WebsiteItemGroupSchema>;

export const WebsiteItemGroupInsertSchema = WebsiteItemGroupSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WebsiteItemGroupInsert = z.infer<typeof WebsiteItemGroupInsertSchema>;

export const BatchSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  use_batchwise_valuation: z.boolean().optional().default(false),
  batch_id: z.string(),
  item: z.string(),
  item_name: z.string().optional(),
  image: z.string().optional(),
  parent_batch: z.string().optional(),
  manufacturing_date: z.string().optional().default('Today'),
  batch_qty: z.number().optional(),
  stock_uom: z.string().optional(),
  expiry_date: z.string().optional(),
  supplier: z.string().optional(),
  reference_doctype: z.string().optional(),
  reference_name: z.string().optional(),
  description: z.string().optional(),
  qty_to_produce: z.number().optional(),
  produced_qty: z.number().optional(),
});

export type Batch = z.infer<typeof BatchSchema>;

export const BatchInsertSchema = BatchSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BatchInsert = z.infer<typeof BatchInsertSchema>;

export const BinSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  warehouse: z.string(),
  actual_qty: z.number().optional().default(0),
  planned_qty: z.number().optional(),
  indented_qty: z.number().optional().default(0),
  ordered_qty: z.number().optional().default(0),
  reserved_qty: z.number().optional().default(0),
  reserved_qty_for_production: z.number().optional(),
  reserved_qty_for_sub_contract: z.number().optional(),
  reserved_qty_for_production_plan: z.number().optional(),
  projected_qty: z.number().optional(),
  reserved_stock: z.number().optional().default(0),
  stock_uom: z.string().optional(),
  company: z.string().optional(),
  valuation_rate: z.number().optional(),
  stock_value: z.number().optional(),
});

export type Bin = z.infer<typeof BinSchema>;

export const BinInsertSchema = BinSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BinInsert = z.infer<typeof BinInsertSchema>;

export const CustomsTariffNumberSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  tariff_number: z.string(),
  description: z.string().optional(),
});

export type CustomsTariffNumber = z.infer<typeof CustomsTariffNumberSchema>;

export const CustomsTariffNumberInsertSchema = CustomsTariffNumberSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CustomsTariffNumberInsert = z.infer<typeof CustomsTariffNumberInsertSchema>;

export const DeliveryNoteSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MAT-DN-.YYYY.-', 'MAT-DN-RET-.YYYY.-']),
  customer: z.string(),
  tax_id: z.string().optional(),
  customer_name: z.string().optional(),
  posting_date: z.string().default('Today'),
  posting_time: z.string().default('Now'),
  set_posting_time: z.boolean().optional().default(false),
  company: z.string(),
  amended_from: z.string().optional(),
  is_return: z.boolean().optional().default(false),
  issue_credit_note: z.boolean().optional().default(false),
  return_against: z.string().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  currency: z.string(),
  conversion_rate: z.number(),
  selling_price_list: z.string(),
  price_list_currency: z.string(),
  plc_conversion_rate: z.number(),
  ignore_pricing_rule: z.boolean().optional().default(false),
  scan_barcode: z.string().optional(),
  last_scanned_warehouse: z.string().optional(),
  set_warehouse: z.string().optional(),
  set_target_warehouse: z.string().optional(),
  items: z.array(z.unknown()),
  total_qty: z.number().optional(),
  total_net_weight: z.number().optional(),
  base_total: z.number().optional(),
  base_net_total: z.number().optional(),
  total: z.number().optional(),
  net_total: z.number().optional(),
  tax_category: z.string().optional(),
  taxes_and_charges: z.string().optional(),
  shipping_rule: z.string().optional(),
  incoterm: z.string().optional(),
  named_place: z.string().optional(),
  taxes: z.array(z.unknown()).optional(),
  base_total_taxes_and_charges: z.number().optional(),
  total_taxes_and_charges: z.number().optional(),
  base_grand_total: z.number().optional(),
  base_rounding_adjustment: z.number().optional(),
  base_rounded_total: z.number().optional(),
  base_in_words: z.string().max(240).optional(),
  grand_total: z.number().optional(),
  rounding_adjustment: z.number().optional(),
  rounded_total: z.number().optional(),
  in_words: z.string().max(240).optional(),
  disable_rounded_total: z.boolean().optional().default(false),
  apply_discount_on: z.enum(['Grand Total', 'Net Total']).optional().default('Grand Total'),
  base_discount_amount: z.number().optional(),
  additional_discount_percentage: z.number().optional(),
  discount_amount: z.number().optional(),
  other_charges_calculation: z.string().optional(),
  item_wise_tax_details: z.array(z.unknown()).optional(),
  packed_items: z.array(z.unknown()).optional(),
  product_bundle_help: z.string().optional(),
  pricing_rules: z.array(z.unknown()).optional(),
  customer_address: z.string().optional(),
  address_display: z.string().optional(),
  contact_person: z.string().optional(),
  contact_display: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().email().optional(),
  shipping_address_name: z.string().optional(),
  shipping_address: z.string().optional(),
  dispatch_address_name: z.string().optional(),
  dispatch_address: z.string().optional(),
  company_address: z.string().optional(),
  company_address_display: z.string().optional(),
  company_contact_person: z.string().optional(),
  tc_name: z.string().optional(),
  terms: z.string().optional(),
  per_billed: z.number().optional(),
  status: z.enum(['Draft', 'To Bill', 'Partially Billed', 'Completed', 'Return', 'Return Issued', 'Cancelled', 'Closed']).default('Draft'),
  per_installed: z.number().optional(),
  installation_status: z.string().optional(),
  per_returned: z.number().optional(),
  transporter: z.string().optional(),
  lr_no: z.string().optional(),
  delivery_trip: z.string().optional(),
  driver: z.string().optional(),
  transporter_name: z.string().optional(),
  lr_date: z.string().optional().default('Today'),
  vehicle_no: z.string().optional(),
  driver_name: z.string().optional(),
  po_no: z.string().optional(),
  po_date: z.string().optional(),
  sales_partner: z.string().optional(),
  amount_eligible_for_commission: z.number().optional(),
  commission_rate: z.number().optional(),
  total_commission: z.number().optional(),
  sales_team: z.array(z.unknown()).optional(),
  auto_repeat: z.string().optional(),
  letter_head: z.string().optional(),
  print_without_amount: z.boolean().optional().default(false),
  group_same_items: z.boolean().optional().default(false),
  select_print_heading: z.string().optional(),
  language: z.string().optional(),
  is_internal_customer: z.boolean().optional().default(false),
  represents_company: z.string().optional(),
  inter_company_reference: z.string().optional(),
  customer_group: z.string().optional(),
  territory: z.string().optional(),
  utm_source: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_content: z.string().optional(),
  excise_page: z.string().optional(),
  instructions: z.string().optional(),
});

export type DeliveryNote = z.infer<typeof DeliveryNoteSchema>;

export const DeliveryNoteInsertSchema = DeliveryNoteSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DeliveryNoteInsert = z.infer<typeof DeliveryNoteInsertSchema>;

export const DeliveryNoteItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  barcode: z.string().optional(),
  has_item_scanned: z.boolean().optional().default(false),
  item_code: z.string(),
  item_name: z.string(),
  customer_item_code: z.string().optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  item_group: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  qty: z.number(),
  stock_uom: z.string(),
  uom: z.string(),
  conversion_factor: z.number(),
  stock_qty: z.number().optional(),
  returned_qty: z.number().optional(),
  price_list_rate: z.number().optional(),
  base_price_list_rate: z.number().optional(),
  margin_type: z.enum(['Percentage', 'Amount']).optional(),
  margin_rate_or_amount: z.number().optional(),
  rate_with_margin: z.number().optional(),
  discount_percentage: z.number().optional(),
  discount_amount: z.number().optional(),
  distributed_discount_amount: z.number().optional(),
  base_rate_with_margin: z.number().optional(),
  rate: z.number().optional(),
  amount: z.number().optional(),
  base_rate: z.number().optional(),
  base_amount: z.number().optional(),
  pricing_rules: z.string().optional(),
  stock_uom_rate: z.number().optional(),
  is_free_item: z.boolean().optional().default(false),
  grant_commission: z.boolean().optional().default(false),
  net_rate: z.number().optional(),
  net_amount: z.number().optional(),
  item_tax_template: z.string().optional(),
  base_net_rate: z.number().optional(),
  base_net_amount: z.number().optional(),
  billed_amt: z.number().optional(),
  incoming_rate: z.number().optional(),
  weight_per_unit: z.number().optional(),
  total_weight: z.number().optional(),
  weight_uom: z.string().optional(),
  warehouse: z.string().optional(),
  target_warehouse: z.string().optional(),
  quality_inspection: z.string().optional(),
  allow_zero_valuation_rate: z.boolean().optional().default(false),
  against_sales_order: z.string().optional(),
  so_detail: z.string().optional(),
  against_sales_invoice: z.string().optional(),
  si_detail: z.string().optional(),
  dn_detail: z.string().optional(),
  against_pick_list: z.string().optional(),
  pick_list_item: z.string().optional(),
  serial_and_batch_bundle: z.string().optional(),
  use_serial_batch_fields: z.boolean().optional().default(false),
  serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  actual_qty: z.number().optional(),
  actual_batch_qty: z.number().optional(),
  company_total_stock: z.number().optional(),
  installed_qty: z.number().optional(),
  packed_qty: z.number().optional().default(0),
  received_qty: z.number().optional(),
  expense_account: z.string().optional(),
  item_tax_rate: z.string().optional(),
  material_request: z.string().optional(),
  purchase_order: z.string().optional(),
  purchase_order_item: z.string().optional(),
  material_request_item: z.string().optional(),
  cost_center: z.string().optional().default(':Company'),
  project: z.string().optional(),
  page_break: z.boolean().optional().default(false),
});

export type DeliveryNoteItem = z.infer<typeof DeliveryNoteItemSchema>;

export const DeliveryNoteItemInsertSchema = DeliveryNoteItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DeliveryNoteItemInsert = z.infer<typeof DeliveryNoteItemInsertSchema>;

export const DeliverySettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  dispatch_template: z.string().optional(),
  dispatch_attachment: z.string().optional(),
  send_with_attachment: z.boolean().optional().default(false),
  stop_delay: z.number().int().optional(),
});

export type DeliverySettings = z.infer<typeof DeliverySettingsSchema>;

export const DeliverySettingsInsertSchema = DeliverySettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DeliverySettingsInsert = z.infer<typeof DeliverySettingsInsertSchema>;

export const DeliveryStopSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  customer: z.string().optional(),
  address: z.string(),
  locked: z.boolean().optional().default(false),
  customer_address: z.string().optional(),
  visited: z.boolean().optional().default(false),
  delivery_note: z.string().optional(),
  grand_total: z.number().optional(),
  contact: z.string().optional(),
  email_sent_to: z.string().optional(),
  customer_contact: z.string().optional(),
  distance: z.number().optional(),
  estimated_arrival: z.string().optional(),
  lat: z.number().optional(),
  uom: z.string().optional(),
  lng: z.number().optional(),
  details: z.string().optional(),
});

export type DeliveryStop = z.infer<typeof DeliveryStopSchema>;

export const DeliveryStopInsertSchema = DeliveryStopSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DeliveryStopInsert = z.infer<typeof DeliveryStopInsertSchema>;

export const DeliveryTripSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MAT-DT-.YYYY.-']).optional(),
  company: z.string(),
  email_notification_sent: z.boolean().optional().default(false),
  driver: z.string().optional(),
  driver_name: z.string().optional(),
  driver_email: z.string().optional(),
  driver_address: z.string().optional(),
  total_distance: z.number().optional(),
  uom: z.string().optional(),
  vehicle: z.string(),
  departure_time: z.string(),
  employee: z.string().optional(),
  delivery_stops: z.array(z.unknown()),
  status: z.enum(['Draft', 'Scheduled', 'In Transit', 'Completed', 'Cancelled']).optional(),
  amended_from: z.string().optional(),
});

export type DeliveryTrip = z.infer<typeof DeliveryTripSchema>;

export const DeliveryTripInsertSchema = DeliveryTripSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DeliveryTripInsert = z.infer<typeof DeliveryTripInsertSchema>;

export const InventoryDimensionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  dimension_name: z.string(),
  reference_document: z.string(),
  disabled: z.boolean().optional().default(false),
  source_fieldname: z.string().optional(),
  target_fieldname: z.string().optional(),
  apply_to_all_doctypes: z.boolean().optional().default(true),
  validate_negative_stock: z.boolean().optional().default(false),
  document_type: z.string().optional(),
  type_of_transaction: z.enum(['Inward', 'Outward', 'Both']).optional(),
  fetch_from_parent: z.string().optional(),
  istable: z.boolean().optional().default(false),
  condition: z.string().optional(),
  reqd: z.boolean().optional().default(false),
  mandatory_depends_on: z.string().optional(),
  html_19: z.string().optional(),
});

export type InventoryDimension = z.infer<typeof InventoryDimensionSchema>;

export const InventoryDimensionInsertSchema = InventoryDimensionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type InventoryDimensionInsert = z.infer<typeof InventoryDimensionInsertSchema>;

export const ItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  naming_series: z.enum(['STO-ITEM-.YYYY.-']).optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  item_group: z.string(),
  stock_uom: z.string(),
  disabled: z.boolean().optional().default(false),
  allow_alternative_item: z.boolean().optional().default(false),
  is_stock_item: z.boolean().optional().default(true),
  has_variants: z.boolean().optional().default(false),
  is_fixed_asset: z.boolean().optional().default(false),
  auto_create_assets: z.boolean().optional().default(false),
  is_grouped_asset: z.boolean().optional().default(false),
  asset_category: z.string().optional(),
  asset_naming_series: z.string().optional(),
  opening_stock: z.number().optional(),
  standard_rate: z.number().optional(),
  over_delivery_receipt_allowance: z.number().optional(),
  over_billing_allowance: z.number().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  uoms: z.array(z.unknown()).optional(),
  valuation_method: z.enum(['FIFO', 'Moving Average', 'LIFO']).optional(),
  valuation_rate: z.number().optional(),
  shelf_life_in_days: z.number().int().optional(),
  end_of_life: z.string().optional().default('2099-12-31'),
  default_material_request_type: z.enum(['Purchase', 'Material Transfer', 'Material Issue', 'Manufacture', 'Customer Provided']).optional().default('Purchase'),
  warranty_period: z.string().optional(),
  weight_per_unit: z.number().optional(),
  weight_uom: z.string().optional(),
  allow_negative_stock: z.boolean().optional().default(false),
  barcodes: z.array(z.unknown()).optional(),
  reorder_levels: z.array(z.unknown()).optional(),
  has_batch_no: z.boolean().optional().default(false),
  create_new_batch: z.boolean().optional().default(false),
  batch_number_series: z.string().optional(),
  has_expiry_date: z.boolean().optional().default(false),
  retain_sample: z.boolean().optional().default(false),
  sample_quantity: z.number().int().optional(),
  has_serial_no: z.boolean().optional().default(false),
  serial_no_series: z.string().optional(),
  item_defaults: z.array(z.unknown()).optional(),
  variant_of: z.string().optional(),
  variant_based_on: z.enum(['Item Attribute', 'Manufacturer']).optional().default('Item Attribute'),
  attributes: z.array(z.unknown()).optional(),
  enable_deferred_expense: z.boolean().optional().default(false),
  no_of_months_exp: z.number().int().optional(),
  enable_deferred_revenue: z.boolean().optional().default(false),
  no_of_months: z.number().int().optional(),
  purchase_uom: z.string().optional(),
  min_order_qty: z.number().optional().default(0),
  safety_stock: z.number().optional(),
  is_purchase_item: z.boolean().optional().default(true),
  lead_time_days: z.number().int().optional(),
  last_purchase_rate: z.number().optional(),
  is_customer_provided_item: z.boolean().optional().default(false),
  customer: z.string().optional(),
  delivered_by_supplier: z.boolean().optional().default(false),
  supplier_items: z.array(z.unknown()).optional(),
  country_of_origin: z.string().optional(),
  customs_tariff_number: z.string().optional(),
  sales_uom: z.string().optional(),
  grant_commission: z.boolean().optional().default(true),
  is_sales_item: z.boolean().optional().default(true),
  max_discount: z.number().optional(),
  customer_items: z.array(z.unknown()).optional(),
  taxes: z.array(z.unknown()).optional(),
  purchase_tax_withholding_category: z.string().optional(),
  sales_tax_withholding_category: z.string().optional(),
  inspection_required_before_purchase: z.boolean().optional().default(false),
  inspection_required_before_delivery: z.boolean().optional().default(false),
  quality_inspection_template: z.string().optional(),
  include_item_in_manufacturing: z.boolean().optional().default(true),
  is_sub_contracted_item: z.boolean().optional().default(false),
  default_bom: z.string().optional(),
  production_capacity: z.number().int().optional(),
  total_projected_qty: z.number().optional(),
  customer_code: z.string().optional(),
  default_manufacturer_part_no: z.string().optional(),
  default_item_manufacturer: z.string().optional(),
});

export type Item = z.infer<typeof ItemSchema>;

export const ItemInsertSchema = ItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemInsert = z.infer<typeof ItemInsertSchema>;

export const ItemAlternativeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  alternative_item_code: z.string().optional(),
  two_way: z.boolean().optional().default(false),
  item_name: z.string().optional(),
  alternative_item_name: z.string().optional(),
});

export type ItemAlternative = z.infer<typeof ItemAlternativeSchema>;

export const ItemAlternativeInsertSchema = ItemAlternativeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemAlternativeInsert = z.infer<typeof ItemAlternativeInsertSchema>;

export const ItemAttributeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  attribute_name: z.string(),
  numeric_values: z.boolean().optional().default(false),
  disabled: z.boolean().optional().default(false),
  from_range: z.number().optional().default(0),
  increment: z.number().optional().default(0),
  to_range: z.number().optional().default(0),
  item_attribute_values: z.array(z.unknown()).optional(),
});

export type ItemAttribute = z.infer<typeof ItemAttributeSchema>;

export const ItemAttributeInsertSchema = ItemAttributeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemAttributeInsert = z.infer<typeof ItemAttributeInsertSchema>;

export const ItemAttributeValueSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  attribute_value: z.string(),
  abbr: z.string(),
});

export type ItemAttributeValue = z.infer<typeof ItemAttributeValueSchema>;

export const ItemAttributeValueInsertSchema = ItemAttributeValueSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemAttributeValueInsert = z.infer<typeof ItemAttributeValueInsertSchema>;

export const ItemBarcodeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  barcode: z.string(),
  barcode_type: z.enum(['EAN', 'UPC-A', 'CODE-39', 'EAN-13', 'EAN-8', 'GS1', 'GTIN', 'GTIN-14', 'ISBN', 'ISBN-10', 'ISBN-13', 'ISSN', 'JAN', 'PZN', 'UPC']).optional(),
  uom: z.string().optional(),
});

export type ItemBarcode = z.infer<typeof ItemBarcodeSchema>;

export const ItemBarcodeInsertSchema = ItemBarcodeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemBarcodeInsert = z.infer<typeof ItemBarcodeInsertSchema>;

export const ItemCustomerDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  customer_name: z.string().optional(),
  customer_group: z.string().optional(),
  ref_code: z.string(),
});

export type ItemCustomerDetail = z.infer<typeof ItemCustomerDetailSchema>;

export const ItemCustomerDetailInsertSchema = ItemCustomerDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemCustomerDetailInsert = z.infer<typeof ItemCustomerDetailInsertSchema>;

export const ItemDefaultSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
  default_warehouse: z.string().optional(),
  default_price_list: z.string().optional(),
  default_discount_account: z.string().optional(),
  default_inventory_account: z.string().optional(),
  inventory_account_currency: z.string().optional(),
  buying_cost_center: z.string().optional(),
  default_supplier: z.string().optional(),
  expense_account: z.string().optional(),
  default_provisional_account: z.string().optional(),
  purchase_expense_account: z.string().optional(),
  purchase_expense_contra_account: z.string().optional(),
  selling_cost_center: z.string().optional(),
  income_account: z.string().optional(),
  default_cogs_account: z.string().optional(),
  deferred_expense_account: z.string().optional(),
  deferred_revenue_account: z.string().optional(),
});

export type ItemDefault = z.infer<typeof ItemDefaultSchema>;

export const ItemDefaultInsertSchema = ItemDefaultSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemDefaultInsert = z.infer<typeof ItemDefaultInsertSchema>;

export const ItemLeadTimeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  shift_time_in_hours: z.number().int().optional(),
  no_of_workstations: z.number().int().optional(),
  no_of_shift: z.number().int().optional().default(1),
  total_workstation_time: z.number().int().optional(),
  manufacturing_time_in_mins: z.number().int().optional(),
  no_of_units_produced: z.number().int().optional(),
  daily_yield: z.number().optional().default(90),
  capacity_per_day: z.number().int().optional(),
  purchase_time: z.number().int().optional(),
  buffer_time: z.number().int().optional(),
  item_name: z.string().optional(),
  stock_uom: z.string().optional(),
});

export type ItemLeadTime = z.infer<typeof ItemLeadTimeSchema>;

export const ItemLeadTimeInsertSchema = ItemLeadTimeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemLeadTimeInsert = z.infer<typeof ItemLeadTimeInsertSchema>;

export const ItemManufacturerSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  manufacturer: z.string(),
  manufacturer_part_no: z.string(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  is_default: z.boolean().optional().default(false),
});

export type ItemManufacturer = z.infer<typeof ItemManufacturerSchema>;

export const ItemManufacturerInsertSchema = ItemManufacturerSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemManufacturerInsert = z.infer<typeof ItemManufacturerInsertSchema>;

export const ItemPriceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  uom: z.string(),
  packing_unit: z.number().int().optional().default(0),
  item_name: z.string().optional(),
  brand: z.string().optional(),
  item_description: z.string().optional(),
  price_list: z.string(),
  customer: z.string().optional(),
  supplier: z.string().optional(),
  batch_no: z.string().optional(),
  buying: z.boolean().optional().default(false),
  selling: z.boolean().optional().default(false),
  currency: z.string().optional(),
  price_list_rate: z.number(),
  valid_from: z.string().optional().default('Today'),
  lead_time_days: z.number().int().optional().default(0),
  valid_upto: z.string().optional(),
  note: z.string().optional(),
  reference: z.string().optional(),
});

export type ItemPrice = z.infer<typeof ItemPriceSchema>;

export const ItemPriceInsertSchema = ItemPriceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemPriceInsert = z.infer<typeof ItemPriceInsertSchema>;

export const ItemQualityInspectionParameterSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  specification: z.string(),
  parameter_group: z.string().optional(),
  value: z.string().optional(),
  numeric: z.boolean().optional().default(true),
  min_value: z.number().optional(),
  max_value: z.number().optional(),
  formula_based_criteria: z.boolean().optional().default(false),
  acceptance_formula: z.string().optional(),
});

export type ItemQualityInspectionParameter = z.infer<typeof ItemQualityInspectionParameterSchema>;

export const ItemQualityInspectionParameterInsertSchema = ItemQualityInspectionParameterSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemQualityInspectionParameterInsert = z.infer<typeof ItemQualityInspectionParameterInsertSchema>;

export const ItemReorderSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  warehouse: z.string(),
  warehouse_group: z.string().optional(),
  warehouse_reorder_level: z.number().optional(),
  warehouse_reorder_qty: z.number().optional(),
  material_request_type: z.enum(['Purchase', 'Transfer', 'Material Issue', 'Manufacture']),
});

export type ItemReorder = z.infer<typeof ItemReorderSchema>;

export const ItemReorderInsertSchema = ItemReorderSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemReorderInsert = z.infer<typeof ItemReorderInsertSchema>;

export const ItemSupplierSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  supplier: z.string(),
  supplier_part_no: z.string().optional(),
});

export type ItemSupplier = z.infer<typeof ItemSupplierSchema>;

export const ItemSupplierInsertSchema = ItemSupplierSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemSupplierInsert = z.infer<typeof ItemSupplierInsertSchema>;

export const ItemTaxSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_tax_template: z.string(),
  tax_category: z.string().optional(),
  valid_from: z.string().optional(),
  minimum_net_rate: z.number().optional(),
  maximum_net_rate: z.number().optional(),
});

export type ItemTax = z.infer<typeof ItemTaxSchema>;

export const ItemTaxInsertSchema = ItemTaxSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemTaxInsert = z.infer<typeof ItemTaxInsertSchema>;

export const ItemVariantSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_attribute: z.string(),
  item_attribute_value: z.string(),
});

export type ItemVariant = z.infer<typeof ItemVariantSchema>;

export const ItemVariantInsertSchema = ItemVariantSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemVariantInsert = z.infer<typeof ItemVariantInsertSchema>;

export const ItemVariantAttributeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  variant_of: z.string().optional(),
  attribute: z.string(),
  attribute_value: z.string().optional(),
  numeric_values: z.boolean().optional().default(false),
  disabled: z.boolean().optional().default(false),
  from_range: z.number().optional(),
  increment: z.number().optional(),
  to_range: z.number().optional(),
});

export type ItemVariantAttribute = z.infer<typeof ItemVariantAttributeSchema>;

export const ItemVariantAttributeInsertSchema = ItemVariantAttributeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemVariantAttributeInsert = z.infer<typeof ItemVariantAttributeInsertSchema>;

export const ItemVariantSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  do_not_update_variants: z.boolean().optional().default(false),
  allow_rename_attribute_value: z.boolean().optional().default(false),
  allow_different_uom: z.boolean().optional().default(false),
  fields: z.array(z.unknown()).optional(),
});

export type ItemVariantSettings = z.infer<typeof ItemVariantSettingsSchema>;

export const ItemVariantSettingsInsertSchema = ItemVariantSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemVariantSettingsInsert = z.infer<typeof ItemVariantSettingsInsertSchema>;

export const ItemWebsiteSpecificationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  label: z.string().optional(),
  description: z.string().optional(),
});

export type ItemWebsiteSpecification = z.infer<typeof ItemWebsiteSpecificationSchema>;

export const ItemWebsiteSpecificationInsertSchema = ItemWebsiteSpecificationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemWebsiteSpecificationInsert = z.infer<typeof ItemWebsiteSpecificationInsertSchema>;

export const LandedCostItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  description: z.string().optional(),
  receipt_document_type: z.enum(['Purchase Invoice', 'Purchase Receipt', 'Stock Entry', 'Subcontracting Receipt']).optional(),
  receipt_document: z.string().optional(),
  qty: z.number().optional(),
  rate: z.number().optional(),
  amount: z.number(),
  is_fixed_asset: z.boolean().optional().default(false),
  applicable_charges: z.number().optional(),
  purchase_receipt_item: z.string().optional(),
  stock_entry_item: z.string().optional(),
  cost_center: z.string().optional(),
});

export type LandedCostItem = z.infer<typeof LandedCostItemSchema>;

export const LandedCostItemInsertSchema = LandedCostItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LandedCostItemInsert = z.infer<typeof LandedCostItemInsertSchema>;

export const LandedCostPurchaseReceiptSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  receipt_document_type: z.enum(['Purchase Invoice', 'Purchase Receipt', 'Stock Entry', 'Subcontracting Receipt']),
  receipt_document: z.string(),
  supplier: z.string().optional(),
  posting_date: z.string().optional(),
  grand_total: z.number().optional(),
});

export type LandedCostPurchaseReceipt = z.infer<typeof LandedCostPurchaseReceiptSchema>;

export const LandedCostPurchaseReceiptInsertSchema = LandedCostPurchaseReceiptSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LandedCostPurchaseReceiptInsert = z.infer<typeof LandedCostPurchaseReceiptInsertSchema>;

export const LandedCostTaxesAndChargesSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  expense_account: z.string().optional(),
  account_currency: z.string().optional(),
  exchange_rate: z.number().optional(),
  description: z.string(),
  amount: z.number(),
  base_amount: z.number().optional(),
  has_corrective_cost: z.boolean().optional().default(false),
  has_operating_cost: z.boolean().optional().default(false),
});

export type LandedCostTaxesAndCharges = z.infer<typeof LandedCostTaxesAndChargesSchema>;

export const LandedCostTaxesAndChargesInsertSchema = LandedCostTaxesAndChargesSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LandedCostTaxesAndChargesInsert = z.infer<typeof LandedCostTaxesAndChargesInsertSchema>;

export const LandedCostVendorInvoiceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  vendor_invoice: z.string().optional(),
  amount: z.number().optional(),
});

export type LandedCostVendorInvoice = z.infer<typeof LandedCostVendorInvoiceSchema>;

export const LandedCostVendorInvoiceInsertSchema = LandedCostVendorInvoiceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LandedCostVendorInvoiceInsert = z.infer<typeof LandedCostVendorInvoiceInsertSchema>;

export const LandedCostVoucherSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MAT-LCV-.YYYY.-']),
  company: z.string(),
  posting_date: z.string().default('Today'),
  purchase_receipts: z.array(z.unknown()),
  items: z.array(z.unknown()),
  vendor_invoices: z.array(z.unknown()).optional(),
  taxes: z.array(z.unknown()),
  total_vendor_invoices_cost: z.number().optional(),
  total_taxes_and_charges: z.number(),
  distribute_charges_based_on: z.enum(['Qty', 'Amount', 'Distribute Manually']),
  amended_from: z.string().optional(),
  landed_cost_help: z.string().optional(),
});

export type LandedCostVoucher = z.infer<typeof LandedCostVoucherSchema>;

export const LandedCostVoucherInsertSchema = LandedCostVoucherSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LandedCostVoucherInsert = z.infer<typeof LandedCostVoucherInsertSchema>;

export const ManufacturerSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  short_name: z.string(),
  full_name: z.string().optional(),
  website: z.string().optional(),
  country: z.string().optional(),
  logo: z.string().optional(),
  address_html: z.string().optional(),
  contact_html: z.string().optional(),
  notes: z.string().optional(),
});

export type Manufacturer = z.infer<typeof ManufacturerSchema>;

export const ManufacturerInsertSchema = ManufacturerSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ManufacturerInsert = z.infer<typeof ManufacturerInsertSchema>;

export const MaterialRequestSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MAT-MR-.YYYY.-']),
  title: z.string().optional().default('{material_request_type}'),
  material_request_type: z.enum(['Purchase', 'Material Transfer', 'Material Issue', 'Manufacture', 'Subcontracting', 'Customer Provided']),
  customer: z.string().optional(),
  company: z.string(),
  auto_created_via_reorder: z.boolean().optional().default(false),
  transaction_date: z.string().default('Today'),
  schedule_date: z.string().optional(),
  buying_price_list: z.string().optional(),
  amended_from: z.string().optional(),
  scan_barcode: z.string().optional(),
  last_scanned_warehouse: z.string().optional(),
  set_from_warehouse: z.string().optional(),
  set_warehouse: z.string().optional(),
  items: z.array(z.unknown()),
  tc_name: z.string().optional(),
  terms: z.string().optional(),
  status: z.enum(['Draft', 'Submitted', 'Stopped', 'Cancelled', 'Pending', 'Partially Ordered', 'Partially Received', 'Ordered', 'Issued', 'Transferred', 'Received']).optional(),
  per_ordered: z.number().optional(),
  transfer_status: z.enum(['Not Started', 'In Transit', 'Completed']).optional(),
  per_received: z.number().optional(),
  letter_head: z.string().optional(),
  select_print_heading: z.string().optional(),
  job_card: z.string().optional(),
  work_order: z.string().optional(),
});

export type MaterialRequest = z.infer<typeof MaterialRequestSchema>;

export const MaterialRequestInsertSchema = MaterialRequestSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MaterialRequestInsert = z.infer<typeof MaterialRequestInsertSchema>;

export const MaterialRequestItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  schedule_date: z.string(),
  description: z.string().optional(),
  item_group: z.string().optional(),
  brand: z.string().optional(),
  image: z.string().optional(),
  qty: z.number(),
  stock_uom: z.string(),
  from_warehouse: z.string().optional(),
  warehouse: z.string().optional(),
  uom: z.string(),
  conversion_factor: z.number(),
  stock_qty: z.number().optional(),
  min_order_qty: z.number().optional(),
  projected_qty: z.number().optional(),
  picked_qty: z.number().optional(),
  actual_qty: z.number().optional(),
  ordered_qty: z.number().optional(),
  received_qty: z.number().optional(),
  rate: z.number().optional(),
  price_list_rate: z.number().optional(),
  amount: z.number().optional(),
  expense_account: z.string().optional(),
  wip_composite_asset: z.string().optional(),
  manufacturer: z.string().optional(),
  manufacturer_part_no: z.string().optional(),
  bom_no: z.string().optional(),
  project: z.string().optional(),
  cost_center: z.string().optional(),
  lead_time_date: z.string().optional(),
  sales_order: z.string().optional(),
  sales_order_item: z.string().optional(),
  packed_item: z.string().optional(),
  production_plan: z.string().optional(),
  material_request_plan_item: z.string().optional(),
  job_card_item: z.string().optional(),
  projected_on_hand: z.number().optional(),
  reorder_level: z.number().optional(),
  reorder_qty: z.number().optional(),
  page_break: z.boolean().optional().default(false),
});

export type MaterialRequestItem = z.infer<typeof MaterialRequestItemSchema>;

export const MaterialRequestItemInsertSchema = MaterialRequestItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type MaterialRequestItemInsert = z.infer<typeof MaterialRequestItemInsertSchema>;

export const PackedItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  parent_item: z.string().optional(),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  warehouse: z.string().optional(),
  target_warehouse: z.string().optional(),
  conversion_factor: z.number().optional(),
  qty: z.number().optional(),
  rate: z.number().optional(),
  uom: z.string().optional(),
  use_serial_batch_fields: z.boolean().optional().default(false),
  serial_and_batch_bundle: z.string().optional(),
  delivered_by_supplier: z.boolean().optional().default(false),
  serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  actual_batch_qty: z.number().optional(),
  actual_qty: z.number().optional(),
  projected_qty: z.number().optional(),
  ordered_qty: z.number().optional(),
  packed_qty: z.number().optional().default(0),
  incoming_rate: z.number().optional(),
  picked_qty: z.number().optional(),
  page_break: z.boolean().optional().default(false),
  prevdoc_doctype: z.string().optional(),
  parent_detail_docname: z.string().optional(),
});

export type PackedItem = z.infer<typeof PackedItemSchema>;

export const PackedItemInsertSchema = PackedItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PackedItemInsert = z.infer<typeof PackedItemInsertSchema>;

export const PackingSlipSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  delivery_note: z.string(),
  naming_series: z.enum(['MAT-PAC-.YYYY.-']),
  from_case_no: z.number().int(),
  to_case_no: z.number().int().optional(),
  items: z.array(z.unknown()),
  net_weight_pkg: z.number().optional(),
  net_weight_uom: z.string().optional(),
  gross_weight_pkg: z.number().optional(),
  gross_weight_uom: z.string().optional(),
  letter_head: z.string().optional(),
  amended_from: z.string().optional(),
});

export type PackingSlip = z.infer<typeof PackingSlipSchema>;

export const PackingSlipInsertSchema = PackingSlipSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PackingSlipInsert = z.infer<typeof PackingSlipInsertSchema>;

export const PackingSlipItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  batch_no: z.string().optional(),
  description: z.string().optional(),
  qty: z.number(),
  net_weight: z.number().optional(),
  stock_uom: z.string().optional(),
  weight_uom: z.string().optional(),
  page_break: z.boolean().optional().default(false),
  dn_detail: z.string().optional(),
  pi_detail: z.string().optional(),
});

export type PackingSlipItem = z.infer<typeof PackingSlipItemSchema>;

export const PackingSlipItemInsertSchema = PackingSlipItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PackingSlipItemInsert = z.infer<typeof PackingSlipItemInsertSchema>;

export const PickListSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['STO-PICK-.YYYY.-']),
  company: z.string(),
  purpose: z.enum(['Material Transfer for Manufacture', 'Material Transfer', 'Delivery']).optional().default('Material Transfer for Manufacture'),
  customer: z.string().optional(),
  customer_name: z.string().optional(),
  work_order: z.string().optional(),
  material_request: z.string().optional(),
  for_qty: z.number().optional(),
  parent_warehouse: z.string().optional(),
  consider_rejected_warehouses: z.boolean().optional().default(false),
  pick_manually: z.boolean().optional().default(false),
  ignore_pricing_rule: z.boolean().optional().default(false),
  scan_barcode: z.string().optional(),
  scan_mode: z.boolean().optional().default(false),
  prompt_qty: z.boolean().optional().default(false),
  locations: z.array(z.unknown()).optional(),
  amended_from: z.string().optional(),
  group_same_items: z.boolean().optional().default(false),
  status: z.enum(['Draft', 'Open', 'Partly Delivered', 'Completed', 'Cancelled']).default('Draft'),
  delivery_status: z.enum(['Not Delivered', 'Fully Delivered', 'Partly Delivered']).optional(),
  per_delivered: z.number().optional(),
});

export type PickList = z.infer<typeof PickListSchema>;

export const PickListInsertSchema = PickListSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PickListInsert = z.infer<typeof PickListInsertSchema>;

export const PickListItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  item_group: z.string().optional(),
  warehouse: z.string().optional(),
  qty: z.number().default(1),
  stock_qty: z.number().optional(),
  picked_qty: z.number().optional(),
  stock_reserved_qty: z.number().optional().default(0),
  uom: z.string().optional(),
  conversion_factor: z.number().optional(),
  stock_uom: z.string().optional(),
  delivered_qty: z.number().optional().default(0),
  actual_qty: z.number().optional(),
  company_total_stock: z.number().optional(),
  serial_and_batch_bundle: z.string().optional(),
  use_serial_batch_fields: z.boolean().optional().default(false),
  serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  sales_order: z.string().optional(),
  sales_order_item: z.string().optional(),
  product_bundle_item: z.string().optional(),
  material_request: z.string().optional(),
  material_request_item: z.string().optional(),
});

export type PickListItem = z.infer<typeof PickListItemSchema>;

export const PickListItemInsertSchema = PickListItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PickListItemInsert = z.infer<typeof PickListItemInsertSchema>;

export const PriceListSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  enabled: z.boolean().optional().default(true),
  price_list_name: z.string(),
  currency: z.string(),
  buying: z.boolean().optional().default(false),
  selling: z.boolean().optional().default(false),
  price_not_uom_dependent: z.boolean().optional().default(false),
  countries: z.array(z.unknown()).optional(),
});

export type PriceList = z.infer<typeof PriceListSchema>;

export const PriceListInsertSchema = PriceListSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PriceListInsert = z.infer<typeof PriceListInsertSchema>;

export const PriceListCountrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  country: z.string(),
});

export type PriceListCountry = z.infer<typeof PriceListCountrySchema>;

export const PriceListCountryInsertSchema = PriceListCountrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PriceListCountryInsert = z.infer<typeof PriceListCountryInsertSchema>;

export const PurchaseReceiptSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  title: z.string().optional().default('{supplier_name}'),
  naming_series: z.enum(['MAT-PRE-.YYYY.-', 'MAT-PR-RET-.YYYY.-']),
  supplier: z.string(),
  supplier_name: z.string().optional(),
  supplier_delivery_note: z.string().optional(),
  subcontracting_receipt: z.string().optional(),
  posting_date: z.string().default('Today'),
  posting_time: z.string().default('Now'),
  set_posting_time: z.boolean().optional().default(false),
  company: z.string(),
  apply_putaway_rule: z.boolean().optional().default(false),
  is_return: z.boolean().optional().default(false),
  return_against: z.string().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  currency: z.string(),
  conversion_rate: z.number(),
  buying_price_list: z.string().optional(),
  price_list_currency: z.string().optional(),
  plc_conversion_rate: z.number().optional(),
  ignore_pricing_rule: z.boolean().optional().default(false),
  scan_barcode: z.string().optional(),
  last_scanned_warehouse: z.string().optional(),
  set_warehouse: z.string().optional(),
  set_from_warehouse: z.string().optional(),
  rejected_warehouse: z.string().optional(),
  is_subcontracted: z.boolean().optional().default(false),
  supplier_warehouse: z.string().optional(),
  items: z.array(z.unknown()),
  total_qty: z.number().optional(),
  total_net_weight: z.number().optional(),
  base_total: z.number().optional(),
  base_net_total: z.number(),
  total: z.number().optional(),
  net_total: z.number().optional(),
  tax_category: z.string().optional(),
  taxes_and_charges: z.string().optional(),
  shipping_rule: z.string().optional(),
  incoterm: z.string().optional(),
  named_place: z.string().optional(),
  taxes: z.array(z.unknown()).optional(),
  base_taxes_and_charges_added: z.number().optional(),
  base_taxes_and_charges_deducted: z.number().optional(),
  base_total_taxes_and_charges: z.number().optional(),
  taxes_and_charges_added: z.number().optional(),
  taxes_and_charges_deducted: z.number().optional(),
  total_taxes_and_charges: z.number().optional(),
  grand_total: z.number().optional(),
  disable_rounded_total: z.boolean().optional().default(false),
  rounding_adjustment: z.number().optional(),
  in_words: z.string().max(240).optional(),
  rounded_total: z.number().optional(),
  base_grand_total: z.number().optional(),
  base_rounding_adjustment: z.number().optional(),
  base_in_words: z.string().max(240).optional(),
  base_rounded_total: z.number().optional(),
  apply_discount_on: z.enum(['Grand Total', 'Net Total']).optional().default('Grand Total'),
  base_discount_amount: z.number().optional(),
  additional_discount_percentage: z.number().optional(),
  discount_amount: z.number().optional(),
  other_charges_calculation: z.string().optional(),
  item_wise_tax_details: z.array(z.unknown()).optional(),
  pricing_rules: z.array(z.unknown()).optional(),
  supplied_items: z.array(z.unknown()).optional(),
  supplier_address: z.string().optional(),
  address_display: z.string().optional(),
  contact_person: z.string().optional(),
  contact_display: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().optional(),
  dispatch_address: z.string().optional(),
  dispatch_address_display: z.string().optional(),
  shipping_address: z.string().optional(),
  shipping_address_display: z.string().optional(),
  billing_address: z.string().optional(),
  billing_address_display: z.string().optional(),
  tc_name: z.string().optional(),
  terms: z.string().optional(),
  status: z.enum(['Draft', 'Partly Billed', 'To Bill', 'Completed', 'Return', 'Return Issued', 'Cancelled', 'Closed']).default('Draft'),
  per_billed: z.number().optional(),
  per_returned: z.number().optional(),
  auto_repeat: z.string().optional(),
  letter_head: z.string().optional(),
  group_same_items: z.boolean().optional().default(false),
  select_print_heading: z.string().optional(),
  language: z.string().optional(),
  transporter_name: z.string().optional(),
  lr_no: z.string().optional(),
  lr_date: z.string().optional(),
  instructions: z.string().optional(),
  is_internal_supplier: z.boolean().optional().default(false),
  represents_company: z.string().optional(),
  inter_company_reference: z.string().optional(),
  remarks: z.string().optional(),
  range: z.string().optional(),
  amended_from: z.string().optional(),
  is_old_subcontracting_flow: z.boolean().optional().default(false),
  other_details: z.string().optional(),
});

export type PurchaseReceipt = z.infer<typeof PurchaseReceiptSchema>;

export const PurchaseReceiptInsertSchema = PurchaseReceiptSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PurchaseReceiptInsert = z.infer<typeof PurchaseReceiptInsertSchema>;

export const PurchaseReceiptItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  barcode: z.string().optional(),
  has_item_scanned: z.boolean().optional().default(false),
  item_code: z.string(),
  product_bundle: z.string().optional(),
  supplier_part_no: z.string().optional(),
  item_name: z.string(),
  description: z.string().optional(),
  brand: z.string().optional(),
  item_group: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  received_qty: z.number().default(0),
  qty: z.number().optional(),
  rejected_qty: z.number().optional(),
  uom: z.string(),
  stock_uom: z.string(),
  conversion_factor: z.number(),
  retain_sample: z.boolean().optional().default(false),
  sample_quantity: z.number().int().optional(),
  received_stock_qty: z.number().optional(),
  stock_qty: z.number().optional(),
  returned_qty: z.number().optional(),
  price_list_rate: z.number().optional(),
  base_price_list_rate: z.number().optional(),
  margin_type: z.enum(['Percentage', 'Amount']).optional(),
  margin_rate_or_amount: z.number().optional(),
  rate_with_margin: z.number().optional(),
  discount_percentage: z.number().optional(),
  discount_amount: z.number().optional(),
  distributed_discount_amount: z.number().optional(),
  base_rate_with_margin: z.number().optional(),
  rate: z.number().optional(),
  amount: z.number().optional(),
  base_rate: z.number(),
  base_amount: z.number().optional(),
  pricing_rules: z.string().optional(),
  stock_uom_rate: z.number().optional(),
  is_free_item: z.boolean().optional().default(false),
  net_rate: z.number().optional(),
  net_amount: z.number().optional(),
  item_tax_template: z.string().optional(),
  base_net_rate: z.number().optional(),
  base_net_amount: z.number().optional(),
  valuation_rate: z.number().optional(),
  sales_incoming_rate: z.number().optional(),
  item_tax_amount: z.number().optional(),
  rm_supp_cost: z.number().optional(),
  landed_cost_voucher_amount: z.number().optional(),
  amount_difference_with_purchase_invoice: z.number().optional(),
  billed_amt: z.number().optional(),
  warehouse: z.string().optional(),
  rejected_warehouse: z.string().optional(),
  from_warehouse: z.string().optional(),
  material_request: z.string().optional(),
  purchase_order: z.string().optional(),
  purchase_invoice: z.string().optional(),
  allow_zero_valuation_rate: z.boolean().optional().default(false),
  return_qty_from_rejected_warehouse: z.boolean().optional().default(false),
  is_fixed_asset: z.boolean().optional().default(false),
  asset_location: z.string().optional(),
  asset_category: z.string().optional(),
  schedule_date: z.string().optional(),
  quality_inspection: z.string().optional(),
  material_request_item: z.string().optional(),
  purchase_order_item: z.string().optional(),
  purchase_invoice_item: z.string().optional(),
  purchase_receipt_item: z.string().optional(),
  delivery_note_item: z.string().optional(),
  putaway_rule: z.string().optional(),
  serial_and_batch_bundle: z.string().optional(),
  use_serial_batch_fields: z.boolean().optional().default(false),
  rejected_serial_and_batch_bundle: z.string().optional(),
  serial_no: z.string().optional(),
  rejected_serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  include_exploded_items: z.boolean().optional().default(false),
  bom: z.string().optional(),
  weight_per_unit: z.number().optional(),
  total_weight: z.number().optional(),
  weight_uom: z.string().optional(),
  manufacturer: z.string().optional(),
  manufacturer_part_no: z.string().optional(),
  expense_account: z.string().optional(),
  item_tax_rate: z.string().optional(),
  wip_composite_asset: z.string().optional(),
  provisional_expense_account: z.string().optional(),
  project: z.string().optional(),
  cost_center: z.string().optional().default(':Company'),
  page_break: z.boolean().optional().default(false),
  sales_order: z.string().optional(),
  sales_order_item: z.string().optional(),
  subcontracting_receipt_item: z.string().optional(),
});

export type PurchaseReceiptItem = z.infer<typeof PurchaseReceiptItemSchema>;

export const PurchaseReceiptItemInsertSchema = PurchaseReceiptItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PurchaseReceiptItemInsert = z.infer<typeof PurchaseReceiptItemInsertSchema>;

export const PutawayRuleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  disable: z.boolean().optional().default(false),
  item_code: z.string(),
  item_name: z.string().optional(),
  warehouse: z.string(),
  priority: z.number().int().optional().default(1),
  company: z.string(),
  capacity: z.number().default(0),
  uom: z.string().optional(),
  conversion_factor: z.number().optional().default(1),
  stock_uom: z.string().optional(),
  stock_capacity: z.number().optional(),
});

export type PutawayRule = z.infer<typeof PutawayRuleSchema>;

export const PutawayRuleInsertSchema = PutawayRuleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PutawayRuleInsert = z.infer<typeof PutawayRuleInsertSchema>;

export const QualityInspectionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MAT-QA-.YYYY.-']),
  company: z.string().optional(),
  report_date: z.string().default('Today'),
  status: z.enum(['Accepted', 'Rejected', 'Cancelled']).default('Accepted'),
  child_row_reference: z.string().optional(),
  inspection_type: z.enum(['Incoming', 'Outgoing', 'In Process']),
  reference_type: z.enum(['Purchase Receipt', 'Purchase Invoice', 'Subcontracting Receipt', 'Delivery Note', 'Sales Invoice', 'Stock Entry', 'Job Card']),
  reference_name: z.string(),
  item_code: z.string(),
  item_serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  sample_size: z.number(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  bom_no: z.string().optional(),
  quality_inspection_template: z.string().optional(),
  manual_inspection: z.boolean().optional().default(false),
  readings: z.array(z.unknown()).optional(),
  inspected_by: z.string().default('user'),
  verified_by: z.string().optional(),
  remarks: z.string().optional(),
  amended_from: z.string().optional(),
  letter_head: z.string().optional(),
});

export type QualityInspection = z.infer<typeof QualityInspectionSchema>;

export const QualityInspectionInsertSchema = QualityInspectionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityInspectionInsert = z.infer<typeof QualityInspectionInsertSchema>;

export const QualityInspectionParameterSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  parameter: z.string(),
  parameter_group: z.string().optional(),
  description: z.string().optional(),
});

export type QualityInspectionParameter = z.infer<typeof QualityInspectionParameterSchema>;

export const QualityInspectionParameterInsertSchema = QualityInspectionParameterSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityInspectionParameterInsert = z.infer<typeof QualityInspectionParameterInsertSchema>;

export const QualityInspectionParameterGroupSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  group_name: z.string(),
});

export type QualityInspectionParameterGroup = z.infer<typeof QualityInspectionParameterGroupSchema>;

export const QualityInspectionParameterGroupInsertSchema = QualityInspectionParameterGroupSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityInspectionParameterGroupInsert = z.infer<typeof QualityInspectionParameterGroupInsertSchema>;

export const QualityInspectionReadingSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  specification: z.string(),
  parameter_group: z.string().optional(),
  status: z.enum(['Accepted', 'Rejected']).optional().default('Accepted'),
  value: z.string().optional(),
  numeric: z.boolean().optional().default(true),
  manual_inspection: z.boolean().optional().default(false),
  min_value: z.number().optional(),
  max_value: z.number().optional(),
  formula_based_criteria: z.boolean().optional().default(false),
  acceptance_formula: z.string().optional(),
  reading_value: z.string().optional(),
  reading_1: z.string().optional(),
  reading_2: z.string().optional(),
  reading_3: z.string().optional(),
  reading_4: z.string().optional(),
  reading_5: z.string().optional(),
  reading_6: z.string().optional(),
  reading_7: z.string().optional(),
  reading_8: z.string().optional(),
  reading_9: z.string().optional(),
  reading_10: z.string().optional(),
});

export type QualityInspectionReading = z.infer<typeof QualityInspectionReadingSchema>;

export const QualityInspectionReadingInsertSchema = QualityInspectionReadingSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityInspectionReadingInsert = z.infer<typeof QualityInspectionReadingInsertSchema>;

export const QualityInspectionTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  quality_inspection_template_name: z.string(),
  item_quality_inspection_parameter: z.array(z.unknown()),
});

export type QualityInspectionTemplate = z.infer<typeof QualityInspectionTemplateSchema>;

export const QualityInspectionTemplateInsertSchema = QualityInspectionTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityInspectionTemplateInsert = z.infer<typeof QualityInspectionTemplateInsertSchema>;

export const QuickStockBalanceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  warehouse: z.string(),
  date: z.string().default('Today'),
  item_barcode: z.string().optional(),
  item: z.string(),
  item_name: z.string().optional(),
  item_description: z.string().optional().default('  '),
  image: z.string().optional(),
  qty: z.number().optional(),
  value: z.number().optional(),
});

export type QuickStockBalance = z.infer<typeof QuickStockBalanceSchema>;

export const QuickStockBalanceInsertSchema = QuickStockBalanceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QuickStockBalanceInsert = z.infer<typeof QuickStockBalanceInsertSchema>;

export const RepostItemValuationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  based_on: z.enum(['Transaction', 'Item and Warehouse']).default('Transaction'),
  voucher_type: z.string().optional(),
  voucher_no: z.string().optional(),
  item_code: z.string().optional(),
  warehouse: z.string().optional(),
  posting_date: z.string(),
  posting_time: z.string().optional(),
  status: z.enum(['Queued', 'In Progress', 'Completed', 'Skipped', 'Failed', 'Cancelled']).optional().default('Queued'),
  company: z.string().optional(),
  reposting_reference: z.string().optional(),
  repost_only_accounting_ledgers: z.boolean().optional().default(false),
  allow_negative_stock: z.boolean().optional().default(true),
  via_landed_cost_voucher: z.boolean().optional().default(false),
  allow_zero_rate: z.boolean().optional().default(false),
  recreate_stock_ledgers: z.boolean().optional().default(false),
  amended_from: z.string().optional(),
  error_log: z.string().optional(),
  reposting_data_file: z.string().optional(),
  items_to_be_repost: z.string().optional(),
  distinct_item_and_warehouse: z.string().optional(),
  total_reposting_count: z.number().int().optional(),
  current_index: z.number().int().optional(),
  gl_reposting_index: z.number().int().optional().default(0),
  affected_transactions: z.string().optional(),
});

export type RepostItemValuation = z.infer<typeof RepostItemValuationSchema>;

export const RepostItemValuationInsertSchema = RepostItemValuationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RepostItemValuationInsert = z.infer<typeof RepostItemValuationInsertSchema>;

export const SerialNoSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  serial_no: z.string(),
  item_code: z.string(),
  batch_no: z.string().optional(),
  warehouse: z.string().optional(),
  purchase_rate: z.number().optional(),
  customer: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'Consumed', 'Delivered', 'Expired']).optional(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  item_group: z.string().optional(),
  brand: z.string().optional(),
  asset: z.string().optional(),
  asset_status: z.enum(['Issue', 'Receipt', 'Transfer']).optional(),
  location: z.string().optional(),
  employee: z.string().optional(),
  warranty_expiry_date: z.string().optional(),
  amc_expiry_date: z.string().optional(),
  maintenance_status: z.enum(['Under Warranty', 'Out of Warranty', 'Under AMC', 'Out of AMC']).optional(),
  warranty_period: z.number().int().optional(),
  company: z.string(),
  work_order: z.string().optional(),
  reference_doctype: z.string().optional(),
  posting_date: z.string().optional(),
  reference_name: z.string().optional(),
});

export type SerialNo = z.infer<typeof SerialNoSchema>;

export const SerialNoInsertSchema = SerialNoSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SerialNoInsert = z.infer<typeof SerialNoInsertSchema>;

export const SerialAndBatchBundleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['SABB-.########']).optional().default('SABB-.########'),
  company: z.string(),
  item_name: z.string().optional(),
  has_serial_no: z.boolean().optional().default(false),
  has_batch_no: z.boolean().optional().default(false),
  item_code: z.string(),
  warehouse: z.string().optional(),
  type_of_transaction: z.enum(['Inward', 'Outward', 'Maintenance', 'Asset Repair']),
  entries: z.array(z.unknown()),
  total_qty: z.number().optional(),
  item_group: z.string().optional(),
  avg_rate: z.number().optional(),
  total_amount: z.number().optional(),
  voucher_type: z.string(),
  voucher_no: z.string().optional(),
  voucher_detail_no: z.string().optional(),
  posting_datetime: z.string().optional(),
  returned_against: z.string().optional(),
  is_cancelled: z.boolean().optional().default(false),
  is_packed: z.boolean().optional().default(false),
  is_rejected: z.boolean().optional().default(false),
  amended_from: z.string().optional(),
});

export type SerialAndBatchBundle = z.infer<typeof SerialAndBatchBundleSchema>;

export const SerialAndBatchBundleInsertSchema = SerialAndBatchBundleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SerialAndBatchBundleInsert = z.infer<typeof SerialAndBatchBundleInsertSchema>;

export const SerialAndBatchEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  item_code: z.string().optional(),
  qty: z.number().optional().default(1),
  warehouse: z.string().optional(),
  delivered_qty: z.number().optional().default(0),
  incoming_rate: z.number().optional(),
  outgoing_rate: z.number().optional(),
  stock_value_difference: z.number().optional(),
  is_outward: z.boolean().optional().default(false),
  stock_queue: z.string().optional(),
  reference_for_reservation: z.string().optional(),
  voucher_type: z.string().optional(),
  voucher_no: z.string().optional(),
  is_cancelled: z.boolean().optional().default(false),
  posting_datetime: z.string().optional(),
  type_of_transaction: z.string().optional(),
  voucher_detail_no: z.string().optional(),
});

export type SerialAndBatchEntry = z.infer<typeof SerialAndBatchEntrySchema>;

export const SerialAndBatchEntryInsertSchema = SerialAndBatchEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SerialAndBatchEntryInsert = z.infer<typeof SerialAndBatchEntryInsertSchema>;

export const ShipmentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  pickup_from_type: z.enum(['Company', 'Customer', 'Supplier']).optional().default('Company'),
  pickup_company: z.string().optional(),
  pickup_customer: z.string().optional(),
  pickup_supplier: z.string().optional(),
  pickup: z.string().optional(),
  pickup_address_name: z.string(),
  pickup_address: z.string().optional(),
  pickup_contact_person: z.string().optional(),
  pickup_contact_name: z.string().optional(),
  pickup_contact_email: z.string().optional(),
  pickup_contact: z.string().optional(),
  delivery_to_type: z.enum(['Company', 'Customer', 'Supplier']).optional().default('Customer'),
  delivery_company: z.string().optional(),
  delivery_customer: z.string().optional(),
  delivery_supplier: z.string().optional(),
  delivery_to: z.string().optional(),
  delivery_address_name: z.string(),
  delivery_address: z.string().optional(),
  delivery_contact_name: z.string().optional(),
  delivery_contact_email: z.string().optional(),
  delivery_contact: z.string().optional(),
  shipment_parcel: z.array(z.unknown()).optional(),
  parcel_template: z.string().optional(),
  total_weight: z.number().optional(),
  shipment_delivery_note: z.array(z.unknown()).optional(),
  pallets: z.enum(['No', 'Yes']).optional().default('No'),
  value_of_goods: z.number(),
  pickup_date: z.string(),
  pickup_from: z.string().default('09:00'),
  pickup_to: z.string().default('17:00'),
  shipment_type: z.enum(['Goods', 'Documents']).optional().default('Goods'),
  pickup_type: z.enum(['Pickup', 'Self delivery']).optional().default('Pickup'),
  incoterm: z.string().optional(),
  description_of_content: z.string(),
  service_provider: z.string().optional(),
  shipment_id: z.string().optional(),
  shipment_amount: z.number().optional(),
  status: z.enum(['Draft', 'Submitted', 'Booked', 'Cancelled', 'Completed']).optional(),
  tracking_url: z.string().optional(),
  carrier: z.string().optional(),
  carrier_service: z.string().optional(),
  awb_number: z.string().optional(),
  tracking_status: z.enum(['In Progress', 'Delivered', 'Returned', 'Lost']).optional(),
  tracking_status_info: z.string().optional(),
  amended_from: z.string().optional(),
});

export type Shipment = z.infer<typeof ShipmentSchema>;

export const ShipmentInsertSchema = ShipmentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShipmentInsert = z.infer<typeof ShipmentInsertSchema>;

export const ShipmentDeliveryNoteSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  delivery_note: z.string(),
  grand_total: z.number().optional(),
});

export type ShipmentDeliveryNote = z.infer<typeof ShipmentDeliveryNoteSchema>;

export const ShipmentDeliveryNoteInsertSchema = ShipmentDeliveryNoteSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShipmentDeliveryNoteInsert = z.infer<typeof ShipmentDeliveryNoteInsertSchema>;

export const ShipmentParcelSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  length: z.number().int().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  weight: z.number(),
  count: z.number().int().default(1),
});

export type ShipmentParcel = z.infer<typeof ShipmentParcelSchema>;

export const ShipmentParcelInsertSchema = ShipmentParcelSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShipmentParcelInsert = z.infer<typeof ShipmentParcelInsertSchema>;

export const ShipmentParcelTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  parcel_template_name: z.string(),
  length: z.number().int(),
  width: z.number().int(),
  height: z.number().int(),
  weight: z.number(),
});

export type ShipmentParcelTemplate = z.infer<typeof ShipmentParcelTemplateSchema>;

export const ShipmentParcelTemplateInsertSchema = ShipmentParcelTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShipmentParcelTemplateInsert = z.infer<typeof ShipmentParcelTemplateInsertSchema>;

export const StockClosingBalanceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  warehouse: z.string().optional(),
  batch_no: z.string().optional(),
  posting_date: z.string().optional(),
  posting_time: z.string().optional(),
  posting_datetime: z.string().optional(),
  actual_qty: z.number().optional(),
  valuation_rate: z.number().optional(),
  stock_value: z.number().optional(),
  stock_value_difference: z.number().optional(),
  company: z.string().optional(),
  stock_closing_entry: z.string().optional(),
  item_name: z.string().optional(),
  item_group: z.string().optional(),
  stock_uom: z.string().optional(),
  inventory_dimension_key: z.string().optional(),
  fifo_queue: z.string().optional(),
});

export type StockClosingBalance = z.infer<typeof StockClosingBalanceSchema>;

export const StockClosingBalanceInsertSchema = StockClosingBalanceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type StockClosingBalanceInsert = z.infer<typeof StockClosingBalanceInsertSchema>;

export const StockClosingEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['CBAL-.#####']).optional(),
  company: z.string().optional(),
  status: z.enum(['Draft', 'Queued', 'In Progress', 'Completed', 'Failed', 'Cancelled']).optional().default('Draft'),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  amended_from: z.string().optional(),
});

export type StockClosingEntry = z.infer<typeof StockClosingEntrySchema>;

export const StockClosingEntryInsertSchema = StockClosingEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type StockClosingEntryInsert = z.infer<typeof StockClosingEntryInsertSchema>;

export const StockEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MAT-STE-.YYYY.-']),
  stock_entry_type: z.string(),
  outgoing_stock_entry: z.string().optional(),
  purpose: z.enum(['Material Issue', 'Material Receipt', 'Material Transfer', 'Material Transfer for Manufacture', 'Material Consumption for Manufacture', 'Manufacture', 'Repack', 'Send to Subcontractor', 'Disassemble', 'Receive from Customer', 'Return Raw Material to Customer', 'Subcontracting Delivery', 'Subcontracting Return']).optional(),
  add_to_transit: z.boolean().optional().default(false),
  work_order: z.string().optional(),
  job_card: z.string().optional(),
  purchase_order: z.string().optional(),
  subcontracting_order: z.string().optional(),
  subcontracting_inward_order: z.string().optional(),
  delivery_note_no: z.string().optional(),
  sales_invoice_no: z.string().optional(),
  pick_list: z.string().optional(),
  purchase_receipt_no: z.string().optional(),
  asset_repair: z.string().optional(),
  company: z.string(),
  posting_date: z.string().optional().default('Today'),
  posting_time: z.string().optional().default('Now'),
  set_posting_time: z.boolean().optional().default(false),
  inspection_required: z.boolean().optional().default(false),
  apply_putaway_rule: z.boolean().optional().default(false),
  is_additional_transfer_entry: z.boolean().optional().default(false),
  from_bom: z.boolean().optional().default(false),
  use_multi_level_bom: z.boolean().optional().default(true),
  bom_no: z.string().optional(),
  fg_completed_qty: z.number().optional(),
  process_loss_percentage: z.number().optional(),
  process_loss_qty: z.number().optional(),
  from_warehouse: z.string().optional(),
  source_warehouse_address: z.string().optional(),
  source_address_display: z.string().optional(),
  to_warehouse: z.string().optional(),
  target_warehouse_address: z.string().optional(),
  target_address_display: z.string().optional(),
  scan_barcode: z.string().optional(),
  last_scanned_warehouse: z.string().optional(),
  items: z.array(z.unknown()),
  total_outgoing_value: z.number().optional(),
  total_incoming_value: z.number().optional(),
  value_difference: z.number().optional(),
  additional_costs: z.array(z.unknown()).optional(),
  total_additional_costs: z.number().optional(),
  supplier: z.string().optional(),
  supplier_name: z.string().optional(),
  supplier_address: z.string().optional(),
  address_display: z.string().optional(),
  project: z.string().optional(),
  select_print_heading: z.string().optional(),
  letter_head: z.string().optional(),
  is_opening: z.enum(['No', 'Yes']).optional(),
  remarks: z.string().optional(),
  per_transferred: z.number().optional(),
  total_amount: z.number().optional(),
  amended_from: z.string().optional(),
  credit_note: z.string().optional(),
  is_return: z.boolean().optional().default(false),
});

export type StockEntry = z.infer<typeof StockEntrySchema>;

export const StockEntryInsertSchema = StockEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type StockEntryInsert = z.infer<typeof StockEntryInsertSchema>;

export const StockEntryDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  barcode: z.string().optional(),
  has_item_scanned: z.boolean().optional().default(false),
  s_warehouse: z.string().optional(),
  t_warehouse: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  is_finished_item: z.boolean().optional().default(false),
  is_scrap_item: z.boolean().optional().default(false),
  quality_inspection: z.string().optional(),
  subcontracted_item: z.string().optional(),
  against_fg: z.string().optional(),
  description: z.string().optional(),
  item_group: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  qty: z.number(),
  transfer_qty: z.number(),
  retain_sample: z.boolean().optional().default(false),
  uom: z.string(),
  stock_uom: z.string(),
  conversion_factor: z.number(),
  sample_quantity: z.number().int().optional(),
  basic_rate: z.number().optional(),
  customer_provided_item_cost: z.number().optional(),
  additional_cost: z.number().optional(),
  landed_cost_voucher_amount: z.number().optional(),
  valuation_rate: z.number().optional(),
  allow_zero_valuation_rate: z.boolean().optional().default(false),
  set_basic_rate_manually: z.boolean().optional().default(false),
  basic_amount: z.number().optional(),
  amount: z.number().optional(),
  use_serial_batch_fields: z.boolean().optional().default(false),
  serial_and_batch_bundle: z.string().optional(),
  serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  expense_account: z.string().optional(),
  cost_center: z.string().optional().default(':Company'),
  project: z.string().optional(),
  actual_qty: z.number().optional(),
  transferred_qty: z.number().optional(),
  bom_no: z.string().optional(),
  allow_alternative_item: z.boolean().optional().default(false),
  material_request: z.string().optional(),
  material_request_item: z.string().optional(),
  original_item: z.string().optional(),
  against_stock_entry: z.string().optional(),
  ste_detail: z.string().optional(),
  po_detail: z.string().optional(),
  sco_rm_detail: z.string().optional(),
  scio_detail: z.string().optional(),
  putaway_rule: z.string().optional(),
  reference_purchase_receipt: z.string().optional(),
  job_card_item: z.string().optional(),
});

export type StockEntryDetail = z.infer<typeof StockEntryDetailSchema>;

export const StockEntryDetailInsertSchema = StockEntryDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type StockEntryDetailInsert = z.infer<typeof StockEntryDetailInsertSchema>;

export const StockEntryTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  purpose: z.enum(['Material Issue', 'Material Receipt', 'Material Transfer', 'Material Transfer for Manufacture', 'Material Consumption for Manufacture', 'Manufacture', 'Repack', 'Send to Subcontractor', 'Disassemble', 'Receive from Customer', 'Return Raw Material to Customer', 'Subcontracting Delivery', 'Subcontracting Return']).default('Material Issue'),
  add_to_transit: z.boolean().optional().default(false),
  is_standard: z.boolean().optional().default(false),
});

export type StockEntryType = z.infer<typeof StockEntryTypeSchema>;

export const StockEntryTypeInsertSchema = StockEntryTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type StockEntryTypeInsert = z.infer<typeof StockEntryTypeInsertSchema>;

export const StockLedgerEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  warehouse: z.string().optional(),
  posting_date: z.string().optional(),
  posting_time: z.string().optional(),
  posting_datetime: z.string().optional(),
  is_adjustment_entry: z.boolean().optional().default(false),
  auto_created_serial_and_batch_bundle: z.boolean().optional().default(false),
  voucher_type: z.string().optional(),
  voucher_no: z.string().optional(),
  voucher_detail_no: z.string().optional(),
  serial_and_batch_bundle: z.string().optional(),
  dependant_sle_voucher_detail_no: z.string().optional(),
  recalculate_rate: z.boolean().optional().default(false),
  actual_qty: z.number().optional(),
  qty_after_transaction: z.number().optional(),
  incoming_rate: z.number().optional(),
  outgoing_rate: z.number().optional(),
  valuation_rate: z.number().optional(),
  stock_value: z.number().optional(),
  stock_value_difference: z.number().optional(),
  stock_queue: z.string().optional(),
  company: z.string().optional(),
  stock_uom: z.string().optional(),
  project: z.string().optional(),
  fiscal_year: z.string().optional(),
  has_batch_no: z.boolean().optional().default(false),
  has_serial_no: z.boolean().optional().default(false),
  is_cancelled: z.boolean().optional().default(false),
  to_rename: z.boolean().optional().default(true),
  serial_no: z.string().optional(),
  batch_no: z.string().optional(),
});

export type StockLedgerEntry = z.infer<typeof StockLedgerEntrySchema>;

export const StockLedgerEntryInsertSchema = StockLedgerEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type StockLedgerEntryInsert = z.infer<typeof StockLedgerEntryInsertSchema>;

export const StockReconciliationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MAT-RECO-.YYYY.-']),
  company: z.string(),
  purpose: z.enum(['Opening Stock', 'Stock Reconciliation']),
  posting_date: z.string().default('Today'),
  posting_time: z.string().default('Now'),
  set_posting_time: z.boolean().optional().default(false),
  set_warehouse: z.string().optional(),
  scan_barcode: z.string().optional(),
  last_scanned_warehouse: z.string().optional(),
  scan_mode: z.boolean().optional().default(false),
  items: z.array(z.unknown()),
  expense_account: z.string().optional(),
  difference_amount: z.number().optional(),
  amended_from: z.string().optional(),
  cost_center: z.string().optional(),
});

export type StockReconciliation = z.infer<typeof StockReconciliationSchema>;

export const StockReconciliationInsertSchema = StockReconciliationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type StockReconciliationInsert = z.infer<typeof StockReconciliationInsertSchema>;

export const StockReconciliationItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  barcode: z.string().optional(),
  has_item_scanned: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  item_group: z.string().optional(),
  warehouse: z.string(),
  qty: z.number().optional(),
  stock_uom: z.string().optional(),
  valuation_rate: z.number().optional(),
  amount: z.number().optional(),
  allow_zero_valuation_rate: z.boolean().optional().default(false),
  use_serial_batch_fields: z.boolean().optional().default(false),
  reconcile_all_serial_batch: z.boolean().optional().default(false),
  serial_and_batch_bundle: z.string().optional(),
  current_serial_and_batch_bundle: z.string().optional(),
  serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  current_qty: z.number().optional().default(0),
  current_amount: z.number().optional(),
  current_valuation_rate: z.number().optional(),
  current_serial_no: z.string().optional(),
  quantity_difference: z.string().optional(),
  amount_difference: z.number().optional(),
});

export type StockReconciliationItem = z.infer<typeof StockReconciliationItemSchema>;

export const StockReconciliationItemInsertSchema = StockReconciliationItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type StockReconciliationItemInsert = z.infer<typeof StockReconciliationItemInsertSchema>;

export const StockRepostingSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  limit_reposting_timeslot: z.boolean().optional().default(false),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  limits_dont_apply_on: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).optional(),
  item_based_reposting: z.boolean().optional().default(true),
  enable_parallel_reposting: z.boolean().optional().default(false),
  no_of_parallel_reposting: z.number().int().optional().default(4),
  notify_reposting_error_to_role: z.string().optional(),
});

export type StockRepostingSettings = z.infer<typeof StockRepostingSettingsSchema>;

export const StockRepostingSettingsInsertSchema = StockRepostingSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type StockRepostingSettingsInsert = z.infer<typeof StockRepostingSettingsInsertSchema>;

export const StockReservationEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  voucher_type: z.enum(['Sales Order', 'Work Order', 'Subcontracting Inward Order', 'Production Plan', 'Subcontracting Order']).optional(),
  voucher_no: z.string().optional(),
  voucher_detail_no: z.string().optional(),
  voucher_qty: z.number().optional().default(0),
  available_qty: z.number().optional().default(0),
  reserved_qty: z.number().optional(),
  delivered_qty: z.number().optional().default(0),
  item_code: z.string().optional(),
  warehouse: z.string().optional(),
  stock_uom: z.string().optional(),
  has_serial_no: z.boolean().optional().default(false),
  has_batch_no: z.boolean().optional().default(false),
  from_voucher_type: z.enum(['Pick List', 'Purchase Receipt', 'Stock Entry', 'Work Order', 'Production Plan', 'Subcontracting Inward Order']).optional(),
  from_voucher_no: z.string().optional(),
  from_voucher_detail_no: z.string().optional(),
  transferred_qty: z.number().optional(),
  consumed_qty: z.number().optional(),
  reservation_based_on: z.enum(['Qty', 'Serial and Batch']).optional().default('Qty'),
  sb_entries: z.array(z.unknown()).optional(),
  company: z.string().optional(),
  project: z.string().optional(),
  status: z.enum(['Draft', 'Partially Reserved', 'Reserved', 'Partially Delivered', 'Partially Used', 'Delivered', 'Cancelled', 'Closed']).optional().default('Draft'),
  amended_from: z.string().optional(),
});

export type StockReservationEntry = z.infer<typeof StockReservationEntrySchema>;

export const StockReservationEntryInsertSchema = StockReservationEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type StockReservationEntryInsert = z.infer<typeof StockReservationEntryInsertSchema>;

export const StockSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_naming_by: z.enum(['Item Code', 'Naming Series']).optional().default('Item Code'),
  valuation_method: z.enum(['FIFO', 'Moving Average', 'LIFO']).optional(),
  item_group: z.string().optional(),
  default_warehouse: z.string().optional(),
  sample_retention_warehouse: z.string().optional(),
  stock_uom: z.string().optional(),
  auto_insert_price_list_rate_if_missing: z.boolean().optional().default(false),
  update_price_list_based_on: z.enum(['Rate', 'Price List Rate']).optional().default('Rate'),
  update_existing_price_list_rate: z.boolean().optional().default(false),
  allow_to_edit_stock_uom_qty_for_sales: z.boolean().optional().default(false),
  allow_to_edit_stock_uom_qty_for_purchase: z.boolean().optional().default(false),
  allow_uom_with_conversion_rate_defined_in_item: z.boolean().optional().default(false),
  over_delivery_receipt_allowance: z.number().optional(),
  mr_qty_allowance: z.number().optional(),
  over_picking_allowance: z.number().optional(),
  role_allowed_to_over_deliver_receive: z.string().optional(),
  allow_negative_stock: z.boolean().optional().default(false),
  show_barcode_field: z.boolean().optional().default(true),
  clean_description_html: z.boolean().optional().default(true),
  allow_internal_transfer_at_arms_length_price: z.boolean().optional().default(false),
  validate_material_transfer_warehouses: z.boolean().optional().default(false),
  allow_existing_serial_no: z.boolean().optional().default(true),
  do_not_use_batchwise_valuation: z.boolean().optional().default(false),
  auto_create_serial_and_batch_bundle_for_outward: z.boolean().optional().default(true),
  pick_serial_and_batch_based_on: z.enum(['FIFO', 'LIFO', 'Expiry']).optional().default('FIFO'),
  disable_serial_no_and_batch_selector: z.boolean().optional().default(false),
  use_serial_batch_fields: z.boolean().optional().default(true),
  do_not_update_serial_batch_on_creation_of_auto_bundle: z.boolean().optional().default(true),
  set_serial_and_batch_bundle_naming_based_on_naming_series: z.boolean().optional().default(false),
  use_naming_series: z.boolean().optional().default(false),
  naming_series_prefix: z.string().optional().default('BATCH-'),
  enable_stock_reservation: z.boolean().optional().default(false),
  auto_reserve_stock: z.boolean().optional().default(false),
  allow_partial_reservation: z.boolean().optional().default(true),
  auto_reserve_stock_for_sales_order_on_purchase: z.boolean().optional().default(false),
  auto_reserve_serial_and_batch: z.boolean().optional().default(true),
  action_if_quality_inspection_is_not_submitted: z.enum(['Stop', 'Warn']).optional().default('Stop'),
  action_if_quality_inspection_is_rejected: z.enum(['Stop', 'Warn']).optional().default('Stop'),
  allow_to_make_quality_inspection_after_purchase_or_delivery: z.boolean().optional().default(false),
  auto_indent: z.boolean().optional().default(false),
  reorder_email_notify: z.boolean().optional().default(false),
  allow_from_dn: z.boolean().optional().default(false),
  allow_from_pr: z.boolean().optional().default(false),
  stock_frozen_upto: z.string().optional(),
  stock_frozen_upto_days: z.number().int().optional(),
  role_allowed_to_create_edit_back_dated_transactions: z.string().optional(),
  stock_auth_role: z.string().optional(),
});

export type StockSettings = z.infer<typeof StockSettingsSchema>;

export const StockSettingsInsertSchema = StockSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type StockSettingsInsert = z.infer<typeof StockSettingsInsertSchema>;

export const UomCategorySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  category_name: z.string(),
});

export type UomCategory = z.infer<typeof UomCategorySchema>;

export const UomCategoryInsertSchema = UomCategorySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type UomCategoryInsert = z.infer<typeof UomCategoryInsertSchema>;

export const UomConversionDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  uom: z.string().optional(),
  conversion_factor: z.number().optional(),
});

export type UomConversionDetail = z.infer<typeof UomConversionDetailSchema>;

export const UomConversionDetailInsertSchema = UomConversionDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type UomConversionDetailInsert = z.infer<typeof UomConversionDetailInsertSchema>;

export const VariantFieldSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  field_name: z.string(),
});

export type VariantField = z.infer<typeof VariantFieldSchema>;

export const VariantFieldInsertSchema = VariantFieldSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type VariantFieldInsert = z.infer<typeof VariantFieldInsertSchema>;

export const WarehouseSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  warehouse_name: z.string(),
  company: z.string(),
  is_rejected_warehouse: z.boolean().optional().default(false),
  account: z.string().optional(),
  parent_warehouse: z.string().optional(),
  is_group: z.boolean().optional().default(false),
  customer: z.string().optional(),
  address_html: z.string().optional(),
  contact_html: z.string().optional(),
  email_id: z.string().optional(),
  phone_no: z.string().optional(),
  mobile_no: z.string().optional(),
  address_line_1: z.string().optional(),
  address_line_2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pin: z.string().optional(),
  warehouse_type: z.string().optional(),
  default_in_transit_warehouse: z.string().optional(),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
});

export type Warehouse = z.infer<typeof WarehouseSchema>;

export const WarehouseInsertSchema = WarehouseSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WarehouseInsert = z.infer<typeof WarehouseInsertSchema>;

export const WarehouseTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  description: z.string().optional(),
});

export type WarehouseType = z.infer<typeof WarehouseTypeSchema>;

export const WarehouseTypeInsertSchema = WarehouseTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WarehouseTypeInsert = z.infer<typeof WarehouseTypeInsertSchema>;

export const SubcontractingBomSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  is_active: z.boolean().optional().default(true),
  finished_good: z.string(),
  finished_good_qty: z.number().default(1),
  finished_good_uom: z.string().optional(),
  finished_good_bom: z.string(),
  service_item: z.string(),
  service_item_qty: z.number().default(1),
  service_item_uom: z.string(),
  conversion_factor: z.number().optional(),
});

export type SubcontractingBom = z.infer<typeof SubcontractingBomSchema>;

export const SubcontractingBomInsertSchema = SubcontractingBomSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingBomInsert = z.infer<typeof SubcontractingBomInsertSchema>;

export const SubcontractingInwardOrderSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  title: z.string().optional().default('{customer_name}'),
  naming_series: z.enum(['SCI-ORD-.YYYY.-']),
  sales_order: z.string(),
  customer: z.string(),
  customer_name: z.string(),
  currency: z.string().optional(),
  company: z.string(),
  transaction_date: z.string().default('Today'),
  customer_warehouse: z.string(),
  amended_from: z.string().optional(),
  set_delivery_warehouse: z.string().optional(),
  items: z.array(z.unknown()),
  received_items: z.array(z.unknown()).optional(),
  scrap_items: z.array(z.unknown()).optional(),
  service_items: z.array(z.unknown()),
  status: z.enum(['Draft', 'Open', 'Ongoing', 'Produced', 'Delivered', 'Returned', 'Cancelled', 'Closed']).default('Draft'),
  per_raw_material_received: z.number().optional(),
  per_produced: z.number().optional(),
  per_delivered: z.number().optional(),
  per_raw_material_returned: z.number().optional(),
  per_process_loss: z.number().optional(),
  per_returned: z.number().optional(),
});

export type SubcontractingInwardOrder = z.infer<typeof SubcontractingInwardOrderSchema>;

export const SubcontractingInwardOrderInsertSchema = SubcontractingInwardOrderSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingInwardOrderInsert = z.infer<typeof SubcontractingInwardOrderInsertSchema>;

export const SubcontractingInwardOrderItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string(),
  bom: z.string(),
  delivery_warehouse: z.string(),
  include_exploded_items: z.boolean().optional().default(false),
  qty: z.number().default(1),
  produced_qty: z.number().optional().default(0),
  returned_qty: z.number().optional().default(0),
  stock_uom: z.string(),
  process_loss_qty: z.number().optional().default(0),
  delivered_qty: z.number().optional().default(0),
  conversion_factor: z.number().optional().default(1),
  sales_order_item: z.string().optional(),
  subcontracting_conversion_factor: z.number().optional(),
});

export type SubcontractingInwardOrderItem = z.infer<typeof SubcontractingInwardOrderItemSchema>;

export const SubcontractingInwardOrderItemInsertSchema = SubcontractingInwardOrderItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingInwardOrderItemInsert = z.infer<typeof SubcontractingInwardOrderItemInsertSchema>;

export const SubcontractingInwardOrderReceivedItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  main_item_code: z.string(),
  rm_item_code: z.string(),
  is_customer_provided_item: z.boolean().default(false),
  is_additional_item: z.boolean().optional().default(false),
  stock_uom: z.string(),
  warehouse: z.string().optional(),
  bom_detail_no: z.string().optional(),
  reference_name: z.string(),
  required_qty: z.number().optional().default(0),
  billed_qty: z.number().optional().default(0),
  received_qty: z.number().optional().default(0),
  consumed_qty: z.number().optional().default(0),
  work_order_qty: z.number().optional().default(0),
  returned_qty: z.number().optional().default(0),
  rate: z.number().optional().default(0),
});

export type SubcontractingInwardOrderReceivedItem = z.infer<typeof SubcontractingInwardOrderReceivedItemSchema>;

export const SubcontractingInwardOrderReceivedItemInsertSchema = SubcontractingInwardOrderReceivedItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingInwardOrderReceivedItemInsert = z.infer<typeof SubcontractingInwardOrderReceivedItemInsertSchema>;

export const SubcontractingInwardOrderScrapItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  fg_item_code: z.string(),
  stock_uom: z.string(),
  warehouse: z.string(),
  reference_name: z.string(),
  produced_qty: z.number().default(0),
  delivered_qty: z.number().default(0),
});

export type SubcontractingInwardOrderScrapItem = z.infer<typeof SubcontractingInwardOrderScrapItemSchema>;

export const SubcontractingInwardOrderScrapItemInsertSchema = SubcontractingInwardOrderScrapItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingInwardOrderScrapItemInsert = z.infer<typeof SubcontractingInwardOrderScrapItemInsertSchema>;

export const SubcontractingInwardOrderServiceItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string(),
  qty: z.number(),
  uom: z.string(),
  rate: z.number(),
  amount: z.number(),
  fg_item: z.string(),
  fg_item_qty: z.number().default(1),
  sales_order_item: z.string().optional(),
});

export type SubcontractingInwardOrderServiceItem = z.infer<typeof SubcontractingInwardOrderServiceItemSchema>;

export const SubcontractingInwardOrderServiceItemInsertSchema = SubcontractingInwardOrderServiceItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingInwardOrderServiceItemInsert = z.infer<typeof SubcontractingInwardOrderServiceItemInsertSchema>;

export const SubcontractingOrderSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  title: z.string().optional().default('{supplier_name}'),
  naming_series: z.enum(['SC-ORD-.YYYY.-']),
  purchase_order: z.string(),
  supplier: z.string(),
  supplier_name: z.string(),
  supplier_warehouse: z.string(),
  supplier_currency: z.string().optional(),
  company: z.string(),
  transaction_date: z.string().default('Today'),
  schedule_date: z.string().optional(),
  amended_from: z.string().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  set_warehouse: z.string().optional(),
  items: z.array(z.unknown()),
  total_qty: z.number().optional(),
  total: z.number().optional(),
  service_items: z.array(z.unknown()),
  set_reserve_warehouse: z.string().optional(),
  reserve_stock: z.boolean().optional().default(false),
  supplied_items: z.array(z.unknown()).optional(),
  supplier_address: z.string().optional(),
  address_display: z.string().optional(),
  contact_person: z.string().optional(),
  contact_display: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().optional(),
  shipping_address: z.string().optional(),
  shipping_address_display: z.string().optional(),
  billing_address: z.string().optional(),
  billing_address_display: z.string().optional(),
  distribute_additional_costs_based_on: z.enum(['Qty', 'Amount']).optional().default('Qty'),
  additional_costs: z.array(z.unknown()).optional(),
  total_additional_costs: z.number().optional(),
  status: z.enum(['Draft', 'Open', 'Partially Received', 'Completed', 'Material Transferred', 'Partial Material Transferred', 'Cancelled', 'Closed']).default('Draft'),
  per_received: z.number().optional(),
  select_print_heading: z.string().optional(),
  letter_head: z.string().optional(),
  production_plan: z.string().optional(),
});

export type SubcontractingOrder = z.infer<typeof SubcontractingOrderSchema>;

export const SubcontractingOrderInsertSchema = SubcontractingOrderSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingOrderInsert = z.infer<typeof SubcontractingOrderInsertSchema>;

export const SubcontractingOrderItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string(),
  bom: z.string(),
  include_exploded_items: z.boolean().optional().default(false),
  schedule_date: z.string().optional(),
  expected_delivery_date: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  qty: z.number().default(1),
  received_qty: z.number().optional(),
  returned_qty: z.number().optional(),
  stock_uom: z.string(),
  conversion_factor: z.number().optional().default(1),
  rate: z.number(),
  amount: z.number(),
  rm_cost_per_qty: z.number().optional(),
  service_cost_per_qty: z.number(),
  additional_cost_per_qty: z.number().optional().default(0),
  warehouse: z.string(),
  expense_account: z.string().optional(),
  manufacturer: z.string().optional(),
  manufacturer_part_no: z.string().optional(),
  material_request: z.string().optional(),
  material_request_item: z.string().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  job_card: z.string().optional(),
  purchase_order_item: z.string().optional(),
  page_break: z.boolean().optional().default(false),
  subcontracting_conversion_factor: z.number().optional(),
  production_plan_sub_assembly_item: z.string().optional(),
});

export type SubcontractingOrderItem = z.infer<typeof SubcontractingOrderItemSchema>;

export const SubcontractingOrderItemInsertSchema = SubcontractingOrderItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingOrderItemInsert = z.infer<typeof SubcontractingOrderItemInsertSchema>;

export const SubcontractingOrderServiceItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string(),
  qty: z.number(),
  rate: z.number(),
  amount: z.number(),
  fg_item: z.string(),
  fg_item_qty: z.number().default(1),
  purchase_order_item: z.string().optional(),
  material_request: z.string().optional(),
  material_request_item: z.string().optional(),
});

export type SubcontractingOrderServiceItem = z.infer<typeof SubcontractingOrderServiceItemSchema>;

export const SubcontractingOrderServiceItemInsertSchema = SubcontractingOrderServiceItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingOrderServiceItemInsert = z.infer<typeof SubcontractingOrderServiceItemInsertSchema>;

export const SubcontractingOrderSuppliedItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  main_item_code: z.string().optional(),
  rm_item_code: z.string().optional(),
  stock_uom: z.string().optional(),
  conversion_factor: z.number().optional().default(1),
  reserve_warehouse: z.string().optional(),
  bom_detail_no: z.string().optional(),
  reference_name: z.string().optional(),
  rate: z.number().optional(),
  amount: z.number().optional(),
  required_qty: z.number().optional(),
  supplied_qty: z.number().optional(),
  stock_reserved_qty: z.number().optional().default(0),
  consumed_qty: z.number().optional(),
  returned_qty: z.number().optional(),
  total_supplied_qty: z.number().optional(),
});

export type SubcontractingOrderSuppliedItem = z.infer<typeof SubcontractingOrderSuppliedItemSchema>;

export const SubcontractingOrderSuppliedItemInsertSchema = SubcontractingOrderSuppliedItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingOrderSuppliedItemInsert = z.infer<typeof SubcontractingOrderSuppliedItemInsertSchema>;

export const SubcontractingReceiptSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  title: z.string().optional().default('{supplier_name}'),
  naming_series: z.enum(['MAT-SCR-.YYYY.-', 'MAT-SCR-RET-.YYYY.-']),
  supplier: z.string(),
  supplier_name: z.string().optional(),
  supplier_delivery_note: z.string().optional(),
  company: z.string(),
  posting_date: z.string().default('Today'),
  posting_time: z.string().default('Now'),
  set_posting_time: z.boolean().optional().default(false),
  is_return: z.boolean().optional().default(false),
  return_against: z.string().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  set_warehouse: z.string().optional(),
  rejected_warehouse: z.string().optional(),
  supplier_warehouse: z.string().optional(),
  items: z.array(z.unknown()),
  total_qty: z.number().optional(),
  total: z.number().optional(),
  supplied_items: z.array(z.unknown()).optional(),
  in_words: z.string().max(240).optional(),
  bill_no: z.string().optional(),
  bill_date: z.string().optional(),
  supplier_address: z.string().optional(),
  contact_person: z.string().optional(),
  address_display: z.string().optional(),
  contact_display: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().optional(),
  shipping_address: z.string().optional(),
  shipping_address_display: z.string().optional(),
  billing_address: z.string().optional(),
  billing_address_display: z.string().optional(),
  distribute_additional_costs_based_on: z.enum(['Qty', 'Amount']).optional().default('Qty'),
  additional_costs: z.array(z.unknown()).optional(),
  total_additional_costs: z.number().optional(),
  amended_from: z.string().optional(),
  range: z.string().optional(),
  represents_company: z.string().optional(),
  status: z.enum(['Draft', 'Completed', 'Return', 'Return Issued', 'Cancelled', 'Closed']).default('Draft'),
  per_returned: z.number().optional(),
  auto_repeat: z.string().optional(),
  letter_head: z.string().optional(),
  language: z.string().optional(),
  instructions: z.string().optional(),
  select_print_heading: z.string().optional(),
  other_details: z.string().optional(),
  remarks: z.string().optional(),
  transporter_name: z.string().optional(),
  lr_no: z.string().optional(),
  lr_date: z.string().optional(),
});

export type SubcontractingReceipt = z.infer<typeof SubcontractingReceiptSchema>;

export const SubcontractingReceiptInsertSchema = SubcontractingReceiptSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingReceiptInsert = z.infer<typeof SubcontractingReceiptInsertSchema>;

export const SubcontractingReceiptItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  is_scrap_item: z.boolean().optional().default(false),
  description: z.string().optional(),
  brand: z.string().optional(),
  image: z.string().optional(),
  image_view: z.string().optional(),
  received_qty: z.number().default(0),
  qty: z.number().optional(),
  rejected_qty: z.number().optional(),
  returned_qty: z.number().optional().default(0),
  stock_uom: z.string(),
  conversion_factor: z.number().optional().default(1),
  rate: z.number().optional(),
  amount: z.number().optional(),
  landed_cost_voucher_amount: z.number().optional(),
  rm_cost_per_qty: z.number().optional().default(0),
  service_cost_per_qty: z.number().default(0),
  additional_cost_per_qty: z.number().optional().default(0),
  scrap_cost_per_qty: z.number().optional().default(0),
  rm_supp_cost: z.number().optional(),
  warehouse: z.string().optional(),
  subcontracting_order: z.string().optional(),
  subcontracting_order_item: z.string().optional(),
  subcontracting_receipt_item: z.string().optional(),
  job_card: z.string().optional(),
  rejected_warehouse: z.string().optional(),
  bom: z.string().optional(),
  include_exploded_items: z.boolean().optional().default(false),
  quality_inspection: z.string().optional(),
  schedule_date: z.string().optional(),
  reference_name: z.string().optional(),
  serial_and_batch_bundle: z.string().optional(),
  use_serial_batch_fields: z.boolean().optional().default(false),
  rejected_serial_and_batch_bundle: z.string().optional(),
  serial_no: z.string().optional(),
  rejected_serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  manufacturer: z.string().optional(),
  manufacturer_part_no: z.string().optional(),
  expense_account: z.string().optional(),
  service_expense_account: z.string().optional(),
  cost_center: z.string().optional().default(':Company'),
  project: z.string().optional(),
  page_break: z.boolean().optional().default(false),
  purchase_order: z.string().optional(),
  purchase_order_item: z.string().optional(),
});

export type SubcontractingReceiptItem = z.infer<typeof SubcontractingReceiptItemSchema>;

export const SubcontractingReceiptItemInsertSchema = SubcontractingReceiptItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingReceiptItemInsert = z.infer<typeof SubcontractingReceiptItemInsertSchema>;

export const SubcontractingReceiptSuppliedItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  main_item_code: z.string().optional(),
  rm_item_code: z.string().optional(),
  item_name: z.string().optional(),
  bom_detail_no: z.string().optional(),
  description: z.string().optional(),
  stock_uom: z.string().optional(),
  conversion_factor: z.number().optional().default(1),
  reference_name: z.string().optional(),
  rate: z.number().optional(),
  amount: z.number().optional(),
  available_qty_for_consumption: z.number().optional().default(0),
  required_qty: z.number().optional(),
  consumed_qty: z.number(),
  current_stock: z.number().optional(),
  serial_and_batch_bundle: z.string().optional(),
  use_serial_batch_fields: z.boolean().optional().default(false),
  subcontracting_order: z.string().optional(),
  serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  expense_account: z.string().optional(),
  cost_center: z.string().optional(),
});

export type SubcontractingReceiptSuppliedItem = z.infer<typeof SubcontractingReceiptSuppliedItemSchema>;

export const SubcontractingReceiptSuppliedItemInsertSchema = SubcontractingReceiptSuppliedItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingReceiptSuppliedItemInsert = z.infer<typeof SubcontractingReceiptSuppliedItemInsertSchema>;

export const IssueSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  naming_series: z.enum(['ISS-.YYYY.-']).optional(),
  subject: z.string(),
  customer: z.string().optional(),
  raised_by: z.string().email().optional(),
  status: z.enum(['Open', 'Replied', 'On Hold', 'Resolved', 'Closed']).optional().default('Open'),
  priority: z.string().optional(),
  issue_type: z.string().optional(),
  issue_split_from: z.string().optional(),
  description: z.string().optional(),
  service_level_agreement: z.string().optional(),
  response_by: z.string().optional(),
  agreement_status: z.enum(['First Response Due', 'Resolution Due', 'Fulfilled', 'Failed']).optional().default('First Response Due'),
  sla_resolution_by: z.string().optional(),
  service_level_agreement_creation: z.string().optional(),
  on_hold_since: z.string().optional(),
  total_hold_time: z.number().optional(),
  first_response_time: z.number().optional(),
  first_responded_on: z.string().optional(),
  avg_response_time: z.number().optional(),
  resolution_details: z.string().optional(),
  opening_date: z.string().optional().default('Today'),
  opening_time: z.string().optional(),
  sla_resolution_date: z.string().optional(),
  resolution_time: z.number().optional(),
  user_resolution_time: z.number().optional(),
  lead: z.string().optional(),
  contact: z.string().optional(),
  email_account: z.string().optional(),
  customer_name: z.string().optional(),
  project: z.string().optional(),
  company: z.string().optional(),
  via_customer_portal: z.boolean().optional().default(false),
  attachment: z.string().optional(),
  content_type: z.string().optional(),
});

export type Issue = z.infer<typeof IssueSchema>;

export const IssueInsertSchema = IssueSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type IssueInsert = z.infer<typeof IssueInsertSchema>;

export const IssuePrioritySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  description: z.string().optional(),
});

export type IssuePriority = z.infer<typeof IssuePrioritySchema>;

export const IssuePriorityInsertSchema = IssuePrioritySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type IssuePriorityInsert = z.infer<typeof IssuePriorityInsertSchema>;

export const IssueTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  description: z.string().optional(),
});

export type IssueType = z.infer<typeof IssueTypeSchema>;

export const IssueTypeInsertSchema = IssueTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type IssueTypeInsert = z.infer<typeof IssueTypeInsertSchema>;

export const PauseSlaOnStatusSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  status: z.string(),
});

export type PauseSlaOnStatus = z.infer<typeof PauseSlaOnStatusSchema>;

export const PauseSlaOnStatusInsertSchema = PauseSlaOnStatusSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PauseSlaOnStatusInsert = z.infer<typeof PauseSlaOnStatusInsertSchema>;

export const SlaFulfilledOnStatusSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  status: z.string(),
});

export type SlaFulfilledOnStatus = z.infer<typeof SlaFulfilledOnStatusSchema>;

export const SlaFulfilledOnStatusInsertSchema = SlaFulfilledOnStatusSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SlaFulfilledOnStatusInsert = z.infer<typeof SlaFulfilledOnStatusInsertSchema>;

export const ServiceDaySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  workday: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  start_time: z.string(),
  end_time: z.string(),
});

export type ServiceDay = z.infer<typeof ServiceDaySchema>;

export const ServiceDayInsertSchema = ServiceDaySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ServiceDayInsert = z.infer<typeof ServiceDayInsertSchema>;

export const ServiceLevelAgreementSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  document_type: z.string(),
  default_priority: z.string().optional(),
  service_level: z.string(),
  enabled: z.boolean().optional().default(true),
  default_service_level_agreement: z.boolean().optional().default(false),
  entity_type: z.enum(['Customer', 'Customer Group', 'Territory']).optional(),
  entity: z.string().optional(),
  condition: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  apply_sla_for_resolution: z.boolean().optional().default(true),
  priorities: z.array(z.unknown()),
  sla_fulfilled_on: z.array(z.unknown()),
  pause_sla_on: z.array(z.unknown()).optional(),
  holiday_list: z.string(),
  support_and_resolution: z.array(z.unknown()),
});

export type ServiceLevelAgreement = z.infer<typeof ServiceLevelAgreementSchema>;

export const ServiceLevelAgreementInsertSchema = ServiceLevelAgreementSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ServiceLevelAgreementInsert = z.infer<typeof ServiceLevelAgreementInsertSchema>;

export const ServiceLevelPrioritySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  default_priority: z.boolean().optional().default(false),
  priority: z.string(),
  response_time: z.number(),
  resolution_time: z.number().optional(),
});

export type ServiceLevelPriority = z.infer<typeof ServiceLevelPrioritySchema>;

export const ServiceLevelPriorityInsertSchema = ServiceLevelPrioritySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ServiceLevelPriorityInsert = z.infer<typeof ServiceLevelPriorityInsertSchema>;

export const SupportSearchSourceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  source_name: z.string().optional(),
  source_type: z.enum(['API', 'Link']),
  base_url: z.string().optional(),
  query_route: z.string().optional(),
  search_term_param_name: z.string().optional(),
  response_result_key_path: z.string().optional(),
  post_route: z.string().optional(),
  post_route_key_list: z.string().optional(),
  post_title_key: z.string().optional(),
  post_description_key: z.string().optional(),
  source_doctype: z.string().optional(),
  result_title_field: z.string().optional(),
  result_preview_field: z.string().optional(),
  result_route_field: z.string().optional(),
});

export type SupportSearchSource = z.infer<typeof SupportSearchSourceSchema>;

export const SupportSearchSourceInsertSchema = SupportSearchSourceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupportSearchSourceInsert = z.infer<typeof SupportSearchSourceInsertSchema>;

export const SupportSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  track_service_level_agreement: z.boolean().optional().default(false),
  allow_resetting_service_level_agreement: z.boolean().optional().default(false),
  close_issue_after_days: z.number().int().optional().default(7),
  get_started_sections: z.string().optional(),
  show_latest_forum_posts: z.boolean().optional().default(false),
  forum_url: z.string().optional(),
  get_latest_query: z.string().optional(),
  response_key_list: z.string().optional(),
  post_title_key: z.string().optional(),
  post_description_key: z.string().optional(),
  post_route_key: z.string().optional(),
  post_route_string: z.string().optional(),
  greeting_title: z.string().optional().default('We\'re here to help'),
  greeting_subtitle: z.string().optional().default('Browse help topics'),
  search_apis: z.array(z.unknown()).optional(),
});

export type SupportSettings = z.infer<typeof SupportSettingsSchema>;

export const SupportSettingsInsertSchema = SupportSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SupportSettingsInsert = z.infer<typeof SupportSettingsInsertSchema>;

export const WarrantyClaimSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  naming_series: z.enum(['SER-WRN-.YYYY.-']),
  status: z.enum(['Open', 'Closed', 'Work In Progress', 'Cancelled']).default('Open'),
  complaint_date: z.string().default('Today'),
  customer: z.string(),
  serial_no: z.string().optional(),
  complaint: z.string(),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  warranty_amc_status: z.enum(['Under Warranty', 'Out of Warranty', 'Under AMC', 'Out of AMC']).optional(),
  warranty_expiry_date: z.string().optional(),
  amc_expiry_date: z.string().optional(),
  resolution_date: z.string().optional(),
  resolved_by: z.string().optional(),
  resolution_details: z.string().optional(),
  customer_name: z.string().optional(),
  contact_person: z.string().optional(),
  contact_display: z.string().optional(),
  contact_mobile: z.string().optional(),
  contact_email: z.string().email().optional(),
  territory: z.string().optional(),
  customer_group: z.string().optional(),
  customer_address: z.string().optional(),
  address_display: z.string().optional(),
  service_address: z.string().optional(),
  company: z.string(),
  complaint_raised_by: z.string().optional(),
  from_company: z.string().optional(),
  amended_from: z.string().optional(),
});

export type WarrantyClaim = z.infer<typeof WarrantyClaimSchema>;

export const WarrantyClaimInsertSchema = WarrantyClaimSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WarrantyClaimInsert = z.infer<typeof WarrantyClaimInsertSchema>;

export const CallLogSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  id: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  call_received_by: z.string().optional(),
  employee_user_id: z.string().optional(),
  medium: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  type: z.enum(['Incoming', 'Outgoing']).optional(),
  customer: z.string().optional(),
  status: z.enum(['Ringing', 'In Progress', 'Completed', 'Failed', 'Busy', 'No Answer', 'Queued', 'Cancelled']).optional(),
  duration: z.number().optional(),
  recording_url: z.string().optional(),
  recording_html: z.string().optional(),
  type_of_call: z.string().optional(),
  summary: z.string().optional(),
  links: z.array(z.unknown()).optional(),
});

export type CallLog = z.infer<typeof CallLogSchema>;

export const CallLogInsertSchema = CallLogSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CallLogInsert = z.infer<typeof CallLogInsertSchema>;

export const IncomingCallHandlingScheduleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  day_of_week: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  from_time: z.string().default('9:00:00'),
  to_time: z.string().default('17:00:00'),
  agent_group: z.string(),
});

export type IncomingCallHandlingSchedule = z.infer<typeof IncomingCallHandlingScheduleSchema>;

export const IncomingCallHandlingScheduleInsertSchema = IncomingCallHandlingScheduleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type IncomingCallHandlingScheduleInsert = z.infer<typeof IncomingCallHandlingScheduleInsertSchema>;

export const IncomingCallSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  call_routing: z.enum(['Sequential', 'Simultaneous']).optional().default('Sequential'),
  greeting_message: z.string().optional(),
  agent_busy_message: z.string().optional(),
  agent_unavailable_message: z.string().optional(),
  call_handling_schedule: z.array(z.unknown()),
});

export type IncomingCallSettings = z.infer<typeof IncomingCallSettingsSchema>;

export const IncomingCallSettingsInsertSchema = IncomingCallSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type IncomingCallSettingsInsert = z.infer<typeof IncomingCallSettingsInsertSchema>;

export const TelephonyCallTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  call_type: z.string(),
  amended_from: z.string().optional(),
});

export type TelephonyCallType = z.infer<typeof TelephonyCallTypeSchema>;

export const TelephonyCallTypeInsertSchema = TelephonyCallTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TelephonyCallTypeInsert = z.infer<typeof TelephonyCallTypeInsertSchema>;

export const VoiceCallSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  user: z.string(),
  call_receiving_device: z.enum(['Computer', 'Phone']).optional().default('Computer'),
  greeting_message: z.string().optional(),
  agent_busy_message: z.string().optional(),
  agent_unavailable_message: z.string().optional(),
});

export type VoiceCallSettings = z.infer<typeof VoiceCallSettingsSchema>;

export const VoiceCallSettingsInsertSchema = VoiceCallSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type VoiceCallSettingsInsert = z.infer<typeof VoiceCallSettingsInsertSchema>;

export const PortalUserSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  user: z.string(),
});

export type PortalUser = z.infer<typeof PortalUserSchema>;

export const PortalUserInsertSchema = PortalUserSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PortalUserInsert = z.infer<typeof PortalUserInsertSchema>;

export const RenameToolSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  select_doctype: z.string().optional(),
  file_to_rename: z.string().optional(),
  rename_log: z.string().optional(),
});

export type RenameTool = z.infer<typeof RenameToolSchema>;

export const RenameToolInsertSchema = RenameToolSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RenameToolInsert = z.infer<typeof RenameToolInsertSchema>;

export const VideoSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  title: z.string(),
  provider: z.enum(['YouTube', 'Vimeo']),
  url: z.string(),
  youtube_video_id: z.string().optional(),
  publish_date: z.string().optional(),
  duration: z.number().optional(),
  like_count: z.number().optional(),
  view_count: z.number().optional(),
  dislike_count: z.number().optional(),
  comment_count: z.number().optional(),
  description: z.string(),
  image: z.string().optional(),
});

export type Video = z.infer<typeof VideoSchema>;

export const VideoInsertSchema = VideoSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type VideoInsert = z.infer<typeof VideoInsertSchema>;

export const VideoSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  enable_youtube_tracking: z.boolean().optional().default(false),
  api_key: z.string().optional(),
  frequency: z.enum(['30 mins', '1 hr', '6 hrs', 'Daily']).optional().default('1 hr'),
});

export type VideoSettings = z.infer<typeof VideoSettingsSchema>;

export const VideoSettingsInsertSchema = VideoSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type VideoSettingsInsert = z.infer<typeof VideoSettingsInsertSchema>;
