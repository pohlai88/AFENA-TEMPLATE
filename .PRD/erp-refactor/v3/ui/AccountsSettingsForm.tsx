// Form scaffold for Accounts Settings
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { AccountsSettings } from '../types/accounts-settings.js';

interface AccountsSettingsFormProps {
  initialData?: Partial<AccountsSettings>;
  onSubmit: (data: Partial<AccountsSettings>) => void;
  mode: 'create' | 'edit';
}

export function AccountsSettingsForm({ initialData = {}, onSubmit, mode }: AccountsSettingsFormProps) {
  const [formData, setFormData] = useState<Partial<AccountsSettings>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Accounts Settings' : 'New Accounts Settings'}</h2>
      {/* Tab: Invoice and Billing */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Invoice and Billing</h3>
      </div>
      {/* Section: Invoice Cancellation */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Invoice Cancellation</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.unlink_payment_on_cancellation_of_invoice}
              onChange={e => handleChange('unlink_payment_on_cancellation_of_invoice', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Unlink Payment on Cancellation of Invoice</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.unlink_advance_payment_on_cancelation_of_order}
              onChange={e => handleChange('unlink_advance_payment_on_cancelation_of_order', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Unlink Advance Payment on Cancellation of Order</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.delete_linked_ledger_entries}
              onChange={e => handleChange('delete_linked_ledger_entries', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Delete Accounting and Stock Ledger Entries on deletion of Transaction</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enable_immutable_ledger}
              onChange={e => handleChange('enable_immutable_ledger', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enable Immutable Ledger</label>
          </div>
        </div>
      </div>
      {/* Section: Invoicing Features */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Invoicing Features</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.check_supplier_invoice_uniqueness}
              onChange={e => handleChange('check_supplier_invoice_uniqueness', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Check Supplier Invoice Number Uniqueness</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.automatically_fetch_payment_terms}
              onChange={e => handleChange('automatically_fetch_payment_terms', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Automatically Fetch Payment Terms from Order</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enable_common_party_accounting}
              onChange={e => handleChange('enable_common_party_accounting', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enable Common Party Accounting</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_multi_currency_invoices_against_single_party_account}
              onChange={e => handleChange('allow_multi_currency_invoices_against_single_party_account', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow multi-currency invoices against single party account </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.confirm_before_resetting_posting_date}
              onChange={e => handleChange('confirm_before_resetting_posting_date', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Confirm before resetting posting date</label>
          </div>
        </div>
      </div>
      {/* Section: Analytical Accounting */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Analytical Accounting</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enable_accounting_dimensions}
              onChange={e => handleChange('enable_accounting_dimensions', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enable Accounting Dimensions</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enable_discounts_and_margin}
              onChange={e => handleChange('enable_discounts_and_margin', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enable Discounts and Margin</label>
          </div>
        </div>
      </div>
      {/* Section: Journals */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Journals</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.merge_similar_account_heads}
              onChange={e => handleChange('merge_similar_account_heads', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Merge Similar Account Heads</label>
          </div>
        </div>
      </div>
      {/* Section: Deferred Accounting Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Deferred Accounting Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Book Deferred Entries Based On</label>
            <select
              value={String(formData.book_deferred_entries_based_on ?? '')}
              onChange={e => handleChange('book_deferred_entries_based_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Days">Days</option>
              <option value="Months">Months</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.automatically_process_deferred_accounting_entry}
              onChange={e => handleChange('automatically_process_deferred_accounting_entry', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Automatically Process Deferred Accounting Entry</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.book_deferred_entries_via_journal_entry}
              onChange={e => handleChange('book_deferred_entries_via_journal_entry', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Book Deferred Entries Via Journal Entry</label>
          </div>
          {!!formData.book_deferred_entries_via_journal_entry && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.submit_journal_entries}
              onChange={e => handleChange('submit_journal_entries', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Submit Journal Entries</label>
          </div>
          )}
        </div>
      </div>
      {/* Section: Tax Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Tax Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Determine Address Tax Category From</label>
            <select
              value={String(formData.determine_address_tax_category_from ?? '')}
              onChange={e => handleChange('determine_address_tax_category_from', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Billing Address">Billing Address</option>
              <option value="Shipping Address">Shipping Address</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.add_taxes_from_item_tax_template}
              onChange={e => handleChange('add_taxes_from_item_tax_template', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Automatically Add Taxes and Charges from Item Tax Template</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.add_taxes_from_taxes_and_charges_template}
              onChange={e => handleChange('add_taxes_from_taxes_and_charges_template', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Automatically Add Taxes from Taxes and Charges Template</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.book_tax_discount_loss}
              onChange={e => handleChange('book_tax_discount_loss', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Book Tax Loss on Early Payment Discount</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.round_row_wise_tax}
              onChange={e => handleChange('round_row_wise_tax', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Round Tax Amount Row-wise</label>
          </div>
        </div>
      </div>
      {/* Section: Print Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Print Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.show_inclusive_tax_in_print}
              onChange={e => handleChange('show_inclusive_tax_in_print', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Show Inclusive Tax in Print</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.show_taxes_as_table_in_print}
              onChange={e => handleChange('show_taxes_as_table_in_print', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Show Taxes as Table in Print</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.show_payment_schedule_in_print}
              onChange={e => handleChange('show_payment_schedule_in_print', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Show Payment Schedule in Print</label>
          </div>
        </div>
      </div>
      {/* Section: Item Price Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Item Price Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.maintain_same_internal_transaction_rate}
              onChange={e => handleChange('maintain_same_internal_transaction_rate', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Maintain Same Rate Throughout Internal Transaction</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.fetch_valuation_rate_for_internal_transaction}
              onChange={e => handleChange('fetch_valuation_rate_for_internal_transaction', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Fetch Valuation Rate for Internal Transaction</label>
          </div>
          {!!formData.maintain_same_internal_transaction_rate && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Action if Same Rate is Not Maintained Throughout  Internal Transaction</label>
            <select
              value={String(formData.maintain_same_rate_action ?? '')}
              onChange={e => handleChange('maintain_same_rate_action', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Stop">Stop</option>
              <option value="Warn">Warn</option>
            </select>
          </div>
          )}
          {formData.maintain_same_internal_transaction_rate && formData.maintain_same_rate_action === 'Stop' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Role Allowed to Override Stop Action (→ Role)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Role..."
                value={String(formData.role_to_override_stop_action ?? '')}
                onChange={e => {
                  handleChange('role_to_override_stop_action', e.target.value);
                  // TODO: Implement async search for Role
                  // fetch(`/api/resource/Role?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Role"
                data-fieldname="role_to_override_stop_action"
              />
              {/* Link indicator */}
              {formData.role_to_override_stop_action && (
                <button
                  type="button"
                  onClick={() => handleChange('role_to_override_stop_action', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
        </div>
      </div>
      {/* Section: Currency Exchange Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Currency Exchange Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_stale}
              onChange={e => handleChange('allow_stale', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Stale Exchange Rates</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_pegged_currencies_exchange_rates}
              onChange={e => handleChange('allow_pegged_currencies_exchange_rates', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Implicit Pegged Currency Conversion</label>
          </div>
          {formData.allow_stale===0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Stale Days</label>
            <input
              type="number"
              step="1"
              value={formData.stale_days != null ? Number(formData.stale_days) : ''}
              onChange={e => handleChange('stale_days', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Tab: Payments */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Payments</h3>
      </div>
      {/* Section: Payment Reconciliation Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Payment Reconciliation Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.auto_reconcile_payments}
              onChange={e => handleChange('auto_reconcile_payments', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Auto Reconcile Payments</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Auto Reconciliation Job Trigger</label>
            <input
              type="number"
              step="1"
              value={formData.auto_reconciliation_job_trigger != null ? Number(formData.auto_reconciliation_job_trigger) : ''}
              onChange={e => handleChange('auto_reconciliation_job_trigger', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reconciliation Queue Size</label>
            <input
              type="number"
              step="1"
              value={formData.reconciliation_queue_size != null ? Number(formData.reconciliation_queue_size) : ''}
              onChange={e => handleChange('reconciliation_queue_size', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Posting Date Inheritance for Exchange Gain / Loss</label>
            <select
              value={String(formData.exchange_gain_loss_posting_date ?? '')}
              onChange={e => handleChange('exchange_gain_loss_posting_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Invoice">Invoice</option>
              <option value="Payment">Payment</option>
              <option value="Reconciliation Date">Reconciliation Date</option>
            </select>
          </div>
        </div>
      </div>
      {/* Section: Payment Options */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Payment Options</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enable_loyalty_point_program}
              onChange={e => handleChange('enable_loyalty_point_program', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enable Loyalty Point Program</label>
          </div>
        </div>
      </div>
      {/* Tab: Credit Limits */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Credit Limits</h3>
      </div>
      {/* Section: Credit Limit Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Credit Limit Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Over Billing Allowance (%)</label>
            <input
              type="number"
              step="any"
              value={formData.over_billing_allowance != null ? Number(formData.over_billing_allowance) : ''}
              onChange={e => handleChange('over_billing_allowance', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role Allowed to Over Bill  (→ Role)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Role..."
                value={String(formData.role_allowed_to_over_bill ?? '')}
                onChange={e => {
                  handleChange('role_allowed_to_over_bill', e.target.value);
                  // TODO: Implement async search for Role
                  // fetch(`/api/resource/Role?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Role"
                data-fieldname="role_allowed_to_over_bill"
              />
              {/* Link indicator */}
              {formData.role_allowed_to_over_bill && (
                <button
                  type="button"
                  onClick={() => handleChange('role_allowed_to_over_bill', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role allowed to bypass Credit Limit (→ Role)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Role..."
                value={String(formData.credit_controller ?? '')}
                onChange={e => {
                  handleChange('credit_controller', e.target.value);
                  // TODO: Implement async search for Role
                  // fetch(`/api/resource/Role?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Role"
                data-fieldname="credit_controller"
              />
              {/* Link indicator */}
              {formData.credit_controller && (
                <button
                  type="button"
                  onClick={() => handleChange('credit_controller', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.make_payment_via_journal_entry}
              onChange={e => handleChange('make_payment_via_journal_entry', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Make Payment via Journal Entry</label>
          </div>
        </div>
      </div>
      {/* Tab: Assets */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Assets</h3>
      </div>
      {/* Section: Asset Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Asset Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.calculate_depr_using_total_days}
              onChange={e => handleChange('calculate_depr_using_total_days', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Calculate daily depreciation using total days in depreciation period</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.book_asset_depreciation_entry_automatically}
              onChange={e => handleChange('book_asset_depreciation_entry_automatically', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Book Asset Depreciation Entry Automatically</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role to Notify on Depreciation Failure (→ Role)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Role..."
                value={String(formData.role_to_notify_on_depreciation_failure ?? '')}
                onChange={e => {
                  handleChange('role_to_notify_on_depreciation_failure', e.target.value);
                  // TODO: Implement async search for Role
                  // fetch(`/api/resource/Role?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Role"
                data-fieldname="role_to_notify_on_depreciation_failure"
              />
              {/* Link indicator */}
              {formData.role_to_notify_on_depreciation_failure && (
                <button
                  type="button"
                  onClick={() => handleChange('role_to_notify_on_depreciation_failure', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Tab: Accounts Closing */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Accounts Closing</h3>
      </div>
      {/* Section: Period Closing Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Period Closing Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.ignore_account_closing_balance}
              onChange={e => handleChange('ignore_account_closing_balance', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Ignore Account Closing Balance</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.use_legacy_controller_for_pcv}
              onChange={e => handleChange('use_legacy_controller_for_pcv', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Use Legacy Controller For Period Closing Voucher</label>
          </div>
        </div>
      </div>
      {/* Tab: Reports */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Reports</h3>
      </div>
      {/* Section: Remarks Column Length */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Remarks Column Length</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">General Ledger</label>
            <input
              type="number"
              step="1"
              value={formData.general_ledger_remarks_length != null ? Number(formData.general_ledger_remarks_length) : ''}
              onChange={e => handleChange('general_ledger_remarks_length', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Accounts Receivable/Payable</label>
            <input
              type="number"
              step="1"
              value={formData.receivable_payable_remarks_length != null ? Number(formData.receivable_payable_remarks_length) : ''}
              onChange={e => handleChange('receivable_payable_remarks_length', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Accounts Receivable / Payable Tuning */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Accounts Receivable / Payable Tuning</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Data Fetch Method</label>
            <select
              value={String(formData.receivable_payable_fetch_method ?? '')}
              onChange={e => handleChange('receivable_payable_fetch_method', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Buffered Cursor">Buffered Cursor</option>
              <option value="UnBuffered Cursor">UnBuffered Cursor</option>
              <option value="Raw SQL">Raw SQL</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Ageing Range</label>
            <input
              type="text"
              value={String(formData.default_ageing_range ?? '')}
              onChange={e => handleChange('default_ageing_range', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Legacy Fields */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Legacy Fields</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.ignore_is_opening_check_for_reporting}
              onChange={e => handleChange('ignore_is_opening_check_for_reporting', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Ignore Is Opening check for reporting</label>
          </div>
        </div>
      </div>
      {/* Tab: Others */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Others</h3>
      </div>
      {/* Section: Chart Of Accounts */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Chart Of Accounts</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.show_balance_in_coa}
              onChange={e => handleChange('show_balance_in_coa', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Show Balances in Chart Of Accounts</label>
          </div>
        </div>
      </div>
      {/* Section: Banking */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Banking</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enable_party_matching}
              onChange={e => handleChange('enable_party_matching', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enable Automatic Party Matching</label>
          </div>
          {!!formData.enable_party_matching && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enable_fuzzy_matching}
              onChange={e => handleChange('enable_fuzzy_matching', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enable Fuzzy Matching</label>
          </div>
          )}
        </div>
      </div>
      {/* Section: Payment Request */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Payment Request</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.create_pr_in_draft_status}
              onChange={e => handleChange('create_pr_in_draft_status', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Create in Draft Status</label>
          </div>
        </div>
      </div>
      {/* Section: Budget */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Budget</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.use_legacy_budget_controller}
              onChange={e => handleChange('use_legacy_budget_controller', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Use Legacy Budget Controller</label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}