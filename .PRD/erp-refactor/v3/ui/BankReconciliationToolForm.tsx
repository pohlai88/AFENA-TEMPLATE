// Form scaffold for Bank Reconciliation Tool
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { BankReconciliationTool } from '../types/bank-reconciliation-tool.js';

interface BankReconciliationToolFormProps {
  initialData?: Partial<BankReconciliationTool>;
  onSubmit: (data: Partial<BankReconciliationTool>) => void;
  mode: 'create' | 'edit';
}

export function BankReconciliationToolForm({ initialData = {}, onSubmit, mode }: BankReconciliationToolFormProps) {
  const [formData, setFormData] = useState<Partial<BankReconciliationTool>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Bank Reconciliation Tool' : 'New Bank Reconciliation Tool'}</h2>
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
            <label className="block text-sm font-medium text-gray-700">Bank Account (→ Bank Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Bank Account..."
                value={String(formData.bank_account ?? '')}
                onChange={e => {
                  handleChange('bank_account', e.target.value);
                  // TODO: Implement async search for Bank Account
                  // fetch(`/api/resource/Bank Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Bank Account"
                data-fieldname="bank_account"
              />
              {/* Link indicator */}
              {formData.bank_account && (
                <button
                  type="button"
                  onClick={() => handleChange('bank_account', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {formData.bank_account && !formData.filter_by_reference_date && (
          <div>
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={String(formData.bank_statement_from_date ?? '')}
              onChange={e => handleChange('bank_statement_from_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.bank_account && !formData.filter_by_reference_date && (
          <div>
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={String(formData.bank_statement_to_date ?? '')}
              onChange={e => handleChange('bank_statement_to_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.filter_by_reference_date && (
          <div>
            <label className="block text-sm font-medium text-gray-700">From Reference Date</label>
            <input
              type="date"
              value={String(formData.from_reference_date ?? '')}
              onChange={e => handleChange('from_reference_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.filter_by_reference_date && (
          <div>
            <label className="block text-sm font-medium text-gray-700">To Reference Date</label>
            <input
              type="date"
              value={String(formData.to_reference_date ?? '')}
              onChange={e => handleChange('to_reference_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.filter_by_reference_date}
              onChange={e => handleChange('filter_by_reference_date', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Filter by Reference Date</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Currency (→ Currency)</label>
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
          {!!formData.bank_statement_from_date && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Opening Balance</label>
            <input
              type="number"
              step="any"
              value={formData.account_opening_balance != null ? Number(formData.account_opening_balance) : ''}
              onChange={e => handleChange('account_opening_balance', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.bank_statement_to_date && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Closing Balance</label>
            <input
              type="number"
              step="any"
              value={formData.bank_statement_closing_balance != null ? Number(formData.bank_statement_closing_balance) : ''}
              onChange={e => handleChange('bank_statement_closing_balance', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
      {/* Section: Reconcile */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Reconcile</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">reconciliation_tool_cards</label>
            <textarea
              value={String(formData.reconciliation_tool_cards ?? '')}
              onChange={e => handleChange('reconciliation_tool_cards', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">reconciliation_tool_dt</label>
            <textarea
              value={String(formData.reconciliation_tool_dt ?? '')}
              onChange={e => handleChange('reconciliation_tool_dt', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">no_bank_transactions</label>
            <textarea
              value={String(formData.no_bank_transactions ?? '')}
              onChange={e => handleChange('no_bank_transactions', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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