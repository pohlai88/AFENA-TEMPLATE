// Form scaffold for Journal Entry
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { JournalEntry } from '../types/journal-entry.js';

interface JournalEntryFormProps {
  initialData?: Partial<JournalEntry>;
  onSubmit: (data: Partial<JournalEntry>) => void;
  mode: 'create' | 'edit';
}

export function JournalEntryForm({ initialData = {}, onSubmit, mode }: JournalEntryFormProps) {
  const [formData, setFormData] = useState<Partial<JournalEntry>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">
        {mode === 'edit' ? formData.title ?? 'Journal Entry' : 'New Journal Entry'}
      </h2>
      {/* Section: entry_type_and_date */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company (→ Company)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Company..."
                value={String(formData.company ?? '')}
                onChange={e => {
                  handleChange('company', e.target.value);
                  // TODO: Implement async search for Company
                  // fetch(`/api/resource/Company?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Company"
                data-fieldname="company"
              />
              {/* Link indicator */}
              {formData.company && (
                <button
                  type="button"
                  onClick={() => handleChange('company', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {formData.is_system_generated === 1; && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_system_generated}
              onChange={e => handleChange('is_system_generated', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is System Generated</label>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={String(formData.title ?? '')}
              onChange={e => handleChange('title', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Entry Type</label>
            <select
              value={String(formData.voucher_type ?? '')}
              onChange={e => handleChange('voucher_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Journal Entry">Journal Entry</option>
              <option value="Inter Company Journal Entry">Inter Company Journal Entry</option>
              <option value="Bank Entry">Bank Entry</option>
              <option value="Cash Entry">Cash Entry</option>
              <option value="Credit Card Entry">Credit Card Entry</option>
              <option value="Debit Note">Debit Note</option>
              <option value="Credit Note">Credit Note</option>
              <option value="Contra Entry">Contra Entry</option>
              <option value="Excise Entry">Excise Entry</option>
              <option value="Write Off Entry">Write Off Entry</option>
              <option value="Opening Entry">Opening Entry</option>
              <option value="Depreciation Entry">Depreciation Entry</option>
              <option value="Asset Disposal">Asset Disposal</option>
              <option value="Periodic Accounting Entry">Periodic Accounting Entry</option>
              <option value="Exchange Rate Revaluation">Exchange Rate Revaluation</option>
              <option value="Exchange Gain Or Loss">Exchange Gain Or Loss</option>
              <option value="Deferred Revenue">Deferred Revenue</option>
              <option value="Deferred Expense">Deferred Expense</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Series</label>
            <select
              value={String(formData.naming_series ?? '')}
              onChange={e => handleChange('naming_series', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>

            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Process Deferred Accounting (→ Process Deferred Accounting)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Process Deferred Accounting..."
                value={String(formData.process_deferred_accounting ?? '')}
                onChange={e => {
                  handleChange('process_deferred_accounting', e.target.value);
                  // TODO: Implement async search for Process Deferred Accounting
                  // fetch(`/api/resource/Process Deferred Accounting?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Process Deferred Accounting"
                data-fieldname="process_deferred_accounting"
              />
              {/* Link indicator */}
              {formData.process_deferred_accounting && (
                <button
                  type="button"
                  onClick={() => handleChange('process_deferred_accounting', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {!!formData.docstatus && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Reversal Of (→ Journal Entry)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Journal Entry..."
                value={String(formData.reversal_of ?? '')}
                onChange={e => {
                  handleChange('reversal_of', e.target.value);
                  // TODO: Implement async search for Journal Entry
                  // fetch(`/api/resource/Journal Entry?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Journal Entry"
                data-fieldname="reversal_of"
              />
              {/* Link indicator */}
              {formData.reversal_of && (
                <button
                  type="button"
                  onClick={() => handleChange('reversal_of', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">From Template (→ Journal Entry Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Journal Entry Template..."
                value={String(formData.from_template ?? '')}
                onChange={e => {
                  handleChange('from_template', e.target.value);
                  // TODO: Implement async search for Journal Entry Template
                  // fetch(`/api/resource/Journal Entry Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Journal Entry Template"
                data-fieldname="from_template"
              />
              {/* Link indicator */}
              {formData.from_template && (
                <button
                  type="button"
                  onClick={() => handleChange('from_template', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Posting Date</label>
            <input
              type="date"
              value={String(formData.posting_date ?? '')}
              onChange={e => handleChange('posting_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Finance Book (→ Finance Book)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Finance Book..."
                value={String(formData.finance_book ?? '')}
                onChange={e => {
                  handleChange('finance_book', e.target.value);
                  // TODO: Implement async search for Finance Book
                  // fetch(`/api/resource/Finance Book?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Finance Book"
                data-fieldname="finance_book"
              />
              {/* Link indicator */}
              {formData.finance_book && (
                <button
                  type="button"
                  onClick={() => handleChange('finance_book', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {['Credit Note', 'Debit Note'].includes(formData.voucher_type) && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.apply_tds}
              onChange={e => handleChange('apply_tds', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Consider for Tax Withholding </label>
          </div>
          )}
          {!!formData.apply_tds && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Withholding Category (→ Tax Withholding Category)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Tax Withholding Category..."
                value={String(formData.tax_withholding_category ?? '')}
                onChange={e => {
                  handleChange('tax_withholding_category', e.target.value);
                  // TODO: Implement async search for Tax Withholding Category
                  // fetch(`/api/resource/Tax Withholding Category?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Tax Withholding Category"
                data-fieldname="tax_withholding_category"
              />
              {/* Link indicator */}
              {formData.tax_withholding_category && (
                <button
                  type="button"
                  onClick={() => handleChange('tax_withholding_category', '')}
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
      {/* Section: Periodic Accounting */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Periodic Accounting</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.for_all_stock_asset_accounts}
              onChange={e => handleChange('for_all_stock_asset_accounts', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">For All Stock Asset Accounts</label>
          </div>
          {formData.for_all_stock_asset_accounts ==== 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Asset Account (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.stock_asset_account ?? '')}
                onChange={e => {
                  handleChange('stock_asset_account', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="stock_asset_account"
              />
              {/* Link indicator */}
              {formData.stock_asset_account && (
                <button
                  type="button"
                  onClick={() => handleChange('stock_asset_account', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.voucher_type ==== "Periodic Accounting Entry" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Periodic Entry Difference Account (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.periodic_entry_difference_account ?? '')}
                onChange={e => {
                  handleChange('periodic_entry_difference_account', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="periodic_entry_difference_account"
              />
              {/* Link indicator */}
              {formData.periodic_entry_difference_account && (
                <button
                  type="button"
                  onClick={() => handleChange('periodic_entry_difference_account', '')}
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
      {/* Section: 2_add_edit_gl_entries */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: accounts → Journal Entry Account */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Accounting Entries</label>
            <div className="mt-1 border rounded overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(Array.isArray(formData.accounts) ? (formData.accounts as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.accounts) ? formData.accounts : [])];
                            rows.splice(idx, 1);
                            handleChange('accounts', rows);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-2 bg-gray-50 border-t">
                <button
                  type="button"
                  onClick={() => handleChange('accounts', [...(Array.isArray(formData.accounts) ? formData.accounts : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: section_break99 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Reference Number</label>
            <input
              type="text"
              value={String(formData.cheque_no ?? '')}
              onChange={e => handleChange('cheque_no', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reference Date</label>
            <input
              type="date"
              value={String(formData.cheque_date ?? '')}
              onChange={e => handleChange('cheque_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">User Remark</label>
            <textarea
              value={String(formData.user_remark ?? '')}
              onChange={e => handleChange('user_remark', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Debit</label>
            <input
              type="number"
              step="any"
              value={formData.total_debit != null ? Number(formData.total_debit) : ''}
              onChange={e => handleChange('total_debit', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Credit</label>
            <input
              type="number"
              step="any"
              value={formData.total_credit != null ? Number(formData.total_credit) : ''}
              onChange={e => handleChange('total_credit', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.difference && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Difference (Dr - Cr)</label>
            <input
              type="number"
              step="any"
              value={formData.difference != null ? Number(formData.difference) : ''}
              onChange={e => handleChange('difference', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.multi_currency}
              onChange={e => handleChange('multi_currency', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Multi Currency</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Amount Currency (→ Currency)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Currency..."
                value={String(formData.total_amount_currency ?? '')}
                onChange={e => {
                  handleChange('total_amount_currency', e.target.value);
                  // TODO: Implement async search for Currency
                  // fetch(`/api/resource/Currency?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Currency"
                data-fieldname="total_amount_currency"
              />
              {/* Link indicator */}
              {formData.total_amount_currency && (
                <button
                  type="button"
                  onClick={() => handleChange('total_amount_currency', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Amount</label>
            <input
              type="number"
              step="any"
              value={formData.total_amount != null ? Number(formData.total_amount) : ''}
              onChange={e => handleChange('total_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Amount in Words</label>
            <input
              type="text"
              value={String(formData.total_amount_in_words ?? '')}
              onChange={e => handleChange('total_amount_in_words', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Tax Withholding Entry */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Tax Withholding Entry</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Withholding Group (→ Tax Withholding Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Tax Withholding Group..."
                value={String(formData.tax_withholding_group ?? '')}
                onChange={e => {
                  handleChange('tax_withholding_group', e.target.value);
                  // TODO: Implement async search for Tax Withholding Group
                  // fetch(`/api/resource/Tax Withholding Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Tax Withholding Group"
                data-fieldname="tax_withholding_group"
              />
              {/* Link indicator */}
              {formData.tax_withholding_group && (
                <button
                  type="button"
                  onClick={() => handleChange('tax_withholding_group', '')}
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
              checked={!!formData.ignore_tax_withholding_threshold}
              onChange={e => handleChange('ignore_tax_withholding_threshold', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Ignore Tax Withholding Threshold</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.override_tax_withholding_entries}
              onChange={e => handleChange('override_tax_withholding_entries', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Edit Tax Withholding Entries</label>
          </div>
          {/* Child table: tax_withholding_entries → Tax Withholding Entry */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Tax Withholding Entries</label>
            <div className="mt-1 border rounded overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(Array.isArray(formData.tax_withholding_entries) ? (formData.tax_withholding_entries as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.tax_withholding_entries) ? formData.tax_withholding_entries : [])];
                            rows.splice(idx, 1);
                            handleChange('tax_withholding_entries', rows);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-2 bg-gray-50 border-t">
                <button
                  type="button"
                  onClick={() => handleChange('tax_withholding_entries', [...(Array.isArray(formData.tax_withholding_entries) ? formData.tax_withholding_entries : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Reference */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Reference</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Clearance Date</label>
            <input
              type="date"
              value={String(formData.clearance_date ?? '')}
              onChange={e => handleChange('clearance_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Remark</label>
            <textarea
              value={String(formData.remark ?? '')}
              onChange={e => handleChange('remark', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {formData.voucher_type=== "Inter Company Journal Entry" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Inter Company Journal Entry Reference (→ Journal Entry)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Journal Entry..."
                value={String(formData.inter_company_journal_entry_reference ?? '')}
                onChange={e => {
                  handleChange('inter_company_journal_entry_reference', e.target.value);
                  // TODO: Implement async search for Journal Entry
                  // fetch(`/api/resource/Journal Entry?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Journal Entry"
                data-fieldname="inter_company_journal_entry_reference"
              />
              {/* Link indicator */}
              {formData.inter_company_journal_entry_reference && (
                <button
                  type="button"
                  onClick={() => handleChange('inter_company_journal_entry_reference', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Bill No</label>
            <input
              type="text"
              value={String(formData.bill_no ?? '')}
              onChange={e => handleChange('bill_no', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bill Date</label>
            <input
              type="date"
              value={String(formData.bill_date ?? '')}
              onChange={e => handleChange('bill_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              value={String(formData.due_date ?? '')}
              onChange={e => handleChange('due_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Write Off */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Write Off</h4>
        <div className="grid grid-cols-2 gap-4">
          {formData.voucher_type === 'Write Off Entry' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Write Off Based On</label>
            <select
              value={String(formData.write_off_based_on ?? '')}
              onChange={e => handleChange('write_off_based_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Accounts Receivable">Accounts Receivable</option>
              <option value="Accounts Payable">Accounts Payable</option>
            </select>
          </div>
          )}
          {formData.voucher_type === 'Write Off Entry' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Write Off Amount</label>
            <input
              type="number"
              step="any"
              value={formData.write_off_amount != null ? Number(formData.write_off_amount) : ''}
              onChange={e => handleChange('write_off_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Printing Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Printing Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Pay To / Recd From</label>
            <input
              type="text"
              value={String(formData.pay_to_recd_from ?? '')}
              onChange={e => handleChange('pay_to_recd_from', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Letter Head (→ Letter Head)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Letter Head..."
                value={String(formData.letter_head ?? '')}
                onChange={e => {
                  handleChange('letter_head', e.target.value);
                  // TODO: Implement async search for Letter Head
                  // fetch(`/api/resource/Letter Head?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Letter Head"
                data-fieldname="letter_head"
              />
              {/* Link indicator */}
              {formData.letter_head && (
                <button
                  type="button"
                  onClick={() => handleChange('letter_head', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Print Heading (→ Print Heading)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Print Heading..."
                value={String(formData.select_print_heading ?? '')}
                onChange={e => {
                  handleChange('select_print_heading', e.target.value);
                  // TODO: Implement async search for Print Heading
                  // fetch(`/api/resource/Print Heading?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Print Heading"
                data-fieldname="select_print_heading"
              />
              {/* Link indicator */}
              {formData.select_print_heading && (
                <button
                  type="button"
                  onClick={() => handleChange('select_print_heading', '')}
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
      {/* Section: More Information */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">More Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mode of Payment (→ Mode of Payment)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Mode of Payment..."
                value={String(formData.mode_of_payment ?? '')}
                onChange={e => {
                  handleChange('mode_of_payment', e.target.value);
                  // TODO: Implement async search for Mode of Payment
                  // fetch(`/api/resource/Mode of Payment?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Mode of Payment"
                data-fieldname="mode_of_payment"
              />
              {/* Link indicator */}
              {formData.mode_of_payment && (
                <button
                  type="button"
                  onClick={() => handleChange('mode_of_payment', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Order (→ Payment Order)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Payment Order..."
                value={String(formData.payment_order ?? '')}
                onChange={e => {
                  handleChange('payment_order', e.target.value);
                  // TODO: Implement async search for Payment Order
                  // fetch(`/api/resource/Payment Order?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Payment Order"
                data-fieldname="payment_order"
              />
              {/* Link indicator */}
              {formData.payment_order && (
                <button
                  type="button"
                  onClick={() => handleChange('payment_order', '')}
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
              checked={!!formData.party_not_required}
              onChange={e => handleChange('party_not_required', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Party Not Required</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Is Opening</label>
            <select
              value={String(formData.is_opening ?? '')}
              onChange={e => handleChange('is_opening', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          {in_list(["Credit Note", "Debit Note"], formData.voucher_type) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Entry (→ Stock Entry)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Stock Entry..."
                value={String(formData.stock_entry ?? '')}
                onChange={e => {
                  handleChange('stock_entry', e.target.value);
                  // TODO: Implement async search for Stock Entry
                  // fetch(`/api/resource/Stock Entry?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Stock Entry"
                data-fieldname="stock_entry"
              />
              {/* Link indicator */}
              {formData.stock_entry && (
                <button
                  type="button"
                  onClick={() => handleChange('stock_entry', '')}
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
      {/* Section: Subscription Section */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Subscription Section</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Auto Repeat (→ Auto Repeat)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Auto Repeat..."
                value={String(formData.auto_repeat ?? '')}
                onChange={e => {
                  handleChange('auto_repeat', e.target.value);
                  // TODO: Implement async search for Auto Repeat
                  // fetch(`/api/resource/Auto Repeat?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Auto Repeat"
                data-fieldname="auto_repeat"
              />
              {/* Link indicator */}
              {formData.auto_repeat && (
                <button
                  type="button"
                  onClick={() => handleChange('auto_repeat', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Journal Entry)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Journal Entry..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Journal Entry
                  // fetch(`/api/resource/Journal Entry?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Journal Entry"
                data-fieldname="amended_from"
              />
              {/* Link indicator */}
              {formData.amended_from && (
                <button
                  type="button"
                  onClick={() => handleChange('amended_from', '')}
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

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}