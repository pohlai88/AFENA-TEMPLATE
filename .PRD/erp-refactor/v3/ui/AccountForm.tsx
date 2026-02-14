// Form scaffold for Account
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { Account } from '../types/account.js';

interface AccountFormProps {
  initialData?: Partial<Account>;
  onSubmit: (data: Partial<Account>) => void;
  mode: 'create' | 'edit';
}

export function AccountForm({ initialData = {}, onSubmit, mode }: AccountFormProps) {
  const [formData, setFormData] = useState<Partial<Account>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Account' : 'New Account'}</h2>
      {/* Section: properties */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.disabled}
              onChange={e => handleChange('disabled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Disable</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Name</label>
            <input
              type="text"
              value={String(formData.account_name ?? '')}
              onChange={e => handleChange('account_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Number</label>
            <input
              type="text"
              value={String(formData.account_number ?? '')}
              onChange={e => handleChange('account_number', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_group}
              onChange={e => handleChange('is_group', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Group</label>
          </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Root Type</label>
            <select
              value={String(formData.root_type ?? '')}
              onChange={e => handleChange('root_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Asset">Asset</option>
              <option value="Liability">Liability</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
              <option value="Equity">Equity</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Report Type</label>
            <select
              value={String(formData.report_type ?? '')}
              onChange={e => handleChange('report_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Balance Sheet">Balance Sheet</option>
              <option value="Profit and Loss">Profit and Loss</option>
            </select>
          </div>
          {formData.is_group===0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency (→ Currency)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Currency..."
                value={String(formData.account_currency ?? '')}
                onChange={e => {
                  handleChange('account_currency', e.target.value);
                  // TODO: Implement async search for Currency
                  // fetch(`/api/resource/Currency?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Currency"
                data-fieldname="account_currency"
              />
              {/* Link indicator */}
              {formData.account_currency && (
                <button
                  type="button"
                  onClick={() => handleChange('account_currency', '')}
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
            <label className="block text-sm font-medium text-gray-700">Parent Account (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.parent_account ?? '')}
                onChange={e => {
                  handleChange('parent_account', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="parent_account"
              />
              {/* Link indicator */}
              {formData.parent_account && (
                <button
                  type="button"
                  onClick={() => handleChange('parent_account', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Category (→ Account Category)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account Category..."
                value={String(formData.account_category ?? '')}
                onChange={e => {
                  handleChange('account_category', e.target.value);
                  // TODO: Implement async search for Account Category
                  // fetch(`/api/resource/Account Category?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Account Category"
                data-fieldname="account_category"
              />
              {/* Link indicator */}
              {formData.account_category && (
                <button
                  type="button"
                  onClick={() => handleChange('account_category', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Type</label>
            <select
              value={String(formData.account_type ?? '')}
              onChange={e => handleChange('account_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Accumulated Depreciation">Accumulated Depreciation</option>
              <option value="Asset Received But Not Billed">Asset Received But Not Billed</option>
              <option value="Bank">Bank</option>
              <option value="Cash">Cash</option>
              <option value="Chargeable">Chargeable</option>
              <option value="Capital Work in Progress">Capital Work in Progress</option>
              <option value="Cost of Goods Sold">Cost of Goods Sold</option>
              <option value="Current Asset">Current Asset</option>
              <option value="Current Liability">Current Liability</option>
              <option value="Depreciation">Depreciation</option>
              <option value="Direct Expense">Direct Expense</option>
              <option value="Direct Income">Direct Income</option>
              <option value="Equity">Equity</option>
              <option value="Expense Account">Expense Account</option>
              <option value="Expenses Included In Asset Valuation">Expenses Included In Asset Valuation</option>
              <option value="Expenses Included In Valuation">Expenses Included In Valuation</option>
              <option value="Fixed Asset">Fixed Asset</option>
              <option value="Income Account">Income Account</option>
              <option value="Indirect Expense">Indirect Expense</option>
              <option value="Indirect Income">Indirect Income</option>
              <option value="Liability">Liability</option>
              <option value="Payable">Payable</option>
              <option value="Receivable">Receivable</option>
              <option value="Round Off">Round Off</option>
              <option value="Round Off for Opening">Round Off for Opening</option>
              <option value="Stock">Stock</option>
              <option value="Stock Adjustment">Stock Adjustment</option>
              <option value="Stock Received But Not Billed">Stock Received But Not Billed</option>
              <option value="Service Received But Not Billed">Service Received But Not Billed</option>
              <option value="Tax">Tax</option>
              <option value="Temporary">Temporary</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Rate</label>
            <input
              type="number"
              step="any"
              value={formData.tax_rate != null ? Number(formData.tax_rate) : ''}
              onChange={e => handleChange('tax_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Frozen</label>
            <select
              value={String(formData.freeze_account ?? '')}
              onChange={e => handleChange('freeze_account', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Balance must be</label>
            <select
              value={String(formData.balance_must_be ?? '')}
              onChange={e => handleChange('balance_must_be', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Debit">Debit</option>
              <option value="Credit">Credit</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lft</label>
            <input
              type="number"
              step="1"
              value={formData.lft != null ? Number(formData.lft) : ''}
              onChange={e => handleChange('lft', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rgt</label>
            <input
              type="number"
              step="1"
              value={formData.rgt != null ? Number(formData.rgt) : ''}
              onChange={e => handleChange('rgt', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Old Parent</label>
            <input
              type="text"
              value={String(formData.old_parent ?? '')}
              onChange={e => handleChange('old_parent', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {(formData.report_type === 'Profit && Loss' && !formData.is_group) && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.include_in_gross}
              onChange={e => handleChange('include_in_gross', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Include in gross</label>
          </div>
          )}
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