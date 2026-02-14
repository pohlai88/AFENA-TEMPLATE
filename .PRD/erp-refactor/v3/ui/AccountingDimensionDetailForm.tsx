// Form scaffold for Accounting Dimension Detail
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { AccountingDimensionDetail } from '../types/accounting-dimension-detail.js';

interface AccountingDimensionDetailFormProps {
  initialData?: Partial<AccountingDimensionDetail>;
  onSubmit: (data: Partial<AccountingDimensionDetail>) => void;
  mode: 'create' | 'edit';
}

export function AccountingDimensionDetailForm({ initialData = {}, onSubmit, mode }: AccountingDimensionDetailFormProps) {
  const [formData, setFormData] = useState<Partial<AccountingDimensionDetail>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Accounting Dimension Detail' : 'New Accounting Dimension Detail'}</h2>
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
            <label className="block text-sm font-medium text-gray-700">Reference Document (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.reference_document ?? '')}
                onChange={e => {
                  handleChange('reference_document', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="reference_document"
              />
              {/* Link indicator */}
              {formData.reference_document && (
                <button
                  type="button"
                  onClick={() => handleChange('reference_document', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Dimension</label>
            <input
              type="text"
              value={String(formData.default_dimension ?? '')}
              onChange={e => handleChange('default_dimension', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.mandatory_for_bs}
              onChange={e => handleChange('mandatory_for_bs', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Mandatory For Balance Sheet</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.mandatory_for_pl}
              onChange={e => handleChange('mandatory_for_pl', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Mandatory For Profit and Loss Account</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.automatically_post_balancing_accounting_entry}
              onChange={e => handleChange('automatically_post_balancing_accounting_entry', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Automatically post balancing accounting entry</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Offsetting Account (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.offsetting_account ?? '')}
                onChange={e => {
                  handleChange('offsetting_account', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="offsetting_account"
              />
              {/* Link indicator */}
              {formData.offsetting_account && (
                <button
                  type="button"
                  onClick={() => handleChange('offsetting_account', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
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