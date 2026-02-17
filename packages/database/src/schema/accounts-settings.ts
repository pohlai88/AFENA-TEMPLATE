import { desc, sql } from 'drizzle-orm';
import { boolean, check, decimal, index, integer, pgTable, primaryKey, text, unique } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Accounts Settings — accounting module configuration.
 * Source: accounts-settings.spec.json (adopted from ERPNext Accounts Settings).
 * Singleton config entity for accounting defaults and behavior.
 */
export const accountsSettings = pgTable(
  'accounts_settings',
  {
    ...erpEntityColumns,
    unlinkPaymentOnCancellationOfInvoice: boolean('unlink_payment_on_cancellation_of_invoice').default(false),
    unlinkAdvancePaymentOnCancelationOfOrder: boolean('unlink_advance_payment_on_cancelation_of_order').default(false),
    bookAssetDepreciationEntryAutomatically: boolean('book_asset_depreciation_entry_automatically').default(false),
    allowCostCenterInEntryOfBsAccount: boolean('allow_cost_center_in_entry_of_bs_account').default(false),
    addFinYearInAbbr: boolean('add_fin_year_in_abbr').default(false),
    determineAddressForTax: text('determine_address_for_tax'),
    overBillingAllowance: decimal('over_billing_allowance', { precision: 18, scale: 2 }),
    roleAllowedToOverBill: text('role_allowed_to_over_bill'),
    creditLimit: decimal('credit_limit', { precision: 18, scale: 2 }),
    bypassCreditLimitCheckAtSalesOrder: boolean('bypass_credit_limit_check_at_sales_order').default(false),
    checkSupplierInvoiceNumberUniqueness: boolean('check_supplier_invoice_number_uniqueness').default(false),
    makePaymentViaJournalEntry: boolean('make_payment_via_journal_entry').default(false),
    unmapCurrentAccountBalanceInJournalEntry: boolean('unmap_current_account_balance_in_journal_entry').default(false),
    invoiceExchangeRateRevaluation: boolean('invoice_exchange_rate_revaluation').default(false),
    automaticAccountingForStockSettings: text('automatic_accounting_for_stock_settings'),
    accFrozenUpto: text('acc_frozen_upto'),
    frozenAccountsModifier: text('frozen_accounts_modifier'),
    enableCommonPartyAccounting: boolean('enable_common_party_accounting').default(false),
    enableDiscountAccounting: boolean('enable_discount_accounting').default(false),
    bookDeferredEntriesBasedOn: text('book_deferred_entries_based_on'),
    bookDeferredEntriesViaJournalEntry: boolean('book_deferred_entries_via_journal_entry').default(false),
    submitJournalEntriesAutomatically: boolean('submit_journal_entries_automatically').default(false),
    automaticallyProcessDeferredAccounting: boolean('automatically_process_deferred_accounting').default(false),
    automaticallyFetchPaymentTerms: boolean('automatically_fetch_payment_terms').default(false),
    allowMultiCurrencyInvoicesAgainstSinglePartyAccount: boolean('allow_multi_currency_invoices_against_single_party_account').default(false),
    postGstCessViaJournalEntry: boolean('post_gst_cess_via_journal_entry').default(false),
    roundOffPaymentAmount: boolean('round_off_payment_amount').default(false),
    reportSettingsJson: text('report_settings_json'),
    enableFuzzyMatching: boolean('enable_fuzzy_matching').default(false),
    partyMatchingAlgorithm: text('party_matching_algorithm'),
    autoReconcilePayments: boolean('auto_reconcile_payments').default(false),
    closeAccountingPeriodOnPeriodClosingVoucher: boolean('close_accounting_period_on_period_closing_voucher').default(false),
    taxIdStatusDetails: text('tax_id_status_details'),
    taxIdValidationUrl: text('tax_id_validation_url'),
    deferredAccountingBasedOnInvoiceDate: boolean('deferred_accounting_based_on_invoice_date').default(false),
    periodClosingVoucherClosingDate: text('period_closing_voucher_closing_date'),
    useCustomCashFlow: boolean('use_custom_cash_flow').default(false),
    allowStaleExchangeRates: boolean('allow_stale_exchange_rates').default(false),
    staleExchangeRatesAllowedFor: integer('stale_exchange_rates_allowed_for'),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('accounts_settings_org_singleton').on(table.orgId), // SINGLETON
    index('accounts_settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('accounts_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type AccountsSettings = typeof accountsSettings.$inferSelect;
export type NewAccountsSettings = typeof accountsSettings.$inferInsert;
