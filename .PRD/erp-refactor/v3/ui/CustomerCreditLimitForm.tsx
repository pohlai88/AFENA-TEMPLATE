// Form scaffold for Customer Credit Limit
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { CustomerCreditLimit } from '../types/customer-credit-limit.js';

interface CustomerCreditLimitFormProps {
  initialData?: Partial<CustomerCreditLimit>;
  onSubmit: (data: Partial<CustomerCreditLimit>) => void;
  mode: 'create' | 'edit';
}

export function CustomerCreditLimitForm({ initialData = {}, onSubmit, mode }: CustomerCreditLimitFormProps) {
  const [formData, setFormData] = useState<Partial<CustomerCreditLimit>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Customer Credit Limit' : 'New Customer Credit Limit'}</h2>
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
            <label className="block text-sm font-medium text-gray-700">Credit Limit</label>
            <input
              type="number"
              step="any"
              value={formData.credit_limit != null ? Number(formData.credit_limit) : ''}
              onChange={e => handleChange('credit_limit', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.bypass_credit_limit_check}
              onChange={e => handleChange('bypass_credit_limit_check', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Bypass Credit Limit Check at Sales Order</label>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}