// Form scaffold for Period Closing Voucher
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PeriodClosingVoucher } from '../types/period-closing-voucher.js';

interface PeriodClosingVoucherFormProps {
  initialData?: Partial<PeriodClosingVoucher>;
  onSubmit: (data: Partial<PeriodClosingVoucher>) => void;
  mode: 'create' | 'edit';
}

export function PeriodClosingVoucherForm({ initialData = {}, onSubmit, mode }: PeriodClosingVoucherFormProps) {
  const [formData, setFormData] = useState<Partial<PeriodClosingVoucher>>(initialData);

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
        {mode === 'edit' ? formData.closing_account_head ?? 'Period Closing Voucher' : 'New Period Closing Voucher'}
      </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Transaction Date</label>
            <input
              type="date"
              value={String(formData.transaction_date ?? '')}
              onChange={e => handleChange('transaction_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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
            <label className="block text-sm font-medium text-gray-700">Fiscal Year (→ Fiscal Year)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Fiscal Year..."
                value={String(formData.fiscal_year ?? '')}
                onChange={e => {
                  handleChange('fiscal_year', e.target.value);
                  // TODO: Implement async search for Fiscal Year
                  // fetch(`/api/resource/Fiscal Year?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Fiscal Year"
                data-fieldname="fiscal_year"
              />
              {/* Link indicator */}
              {formData.fiscal_year && (
                <button
                  type="button"
                  onClick={() => handleChange('fiscal_year', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Period Start Date</label>
            <input
              type="date"
              value={String(formData.period_start_date ?? '')}
              onChange={e => handleChange('period_start_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Period End Date</label>
            <input
              type="date"
              value={String(formData.period_end_date ?? '')}
              onChange={e => handleChange('period_end_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Period Closing Voucher)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Period Closing Voucher..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Period Closing Voucher
                  // fetch(`/api/resource/Period Closing Voucher?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Period Closing Voucher"
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Closing Account Head (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.closing_account_head ?? '')}
                onChange={e => {
                  handleChange('closing_account_head', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="closing_account_head"
              />
              {/* Link indicator */}
              {formData.closing_account_head && (
                <button
                  type="button"
                  onClick={() => handleChange('closing_account_head', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {formData.docstatus!==0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">GL Entry Processing Status</label>
            <select
              value={String(formData.gle_processing_status ?? '')}
              onChange={e => handleChange('gle_processing_status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          )}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Remarks</label>
            <textarea
              value={String(formData.remarks ?? '')}
              onChange={e => handleChange('remarks', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          {formData.gle_processing_status==='Failed' && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Error Message</label>
            <textarea
              value={String(formData.error_message ?? '')}
              onChange={e => handleChange('error_message', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}