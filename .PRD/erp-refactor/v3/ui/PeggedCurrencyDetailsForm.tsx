// Form scaffold for Pegged Currency Details
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PeggedCurrencyDetails } from '../types/pegged-currency-details.js';

interface PeggedCurrencyDetailsFormProps {
  initialData?: Partial<PeggedCurrencyDetails>;
  onSubmit: (data: Partial<PeggedCurrencyDetails>) => void;
  mode: 'create' | 'edit';
}

export function PeggedCurrencyDetailsForm({ initialData = {}, onSubmit, mode }: PeggedCurrencyDetailsFormProps) {
  const [formData, setFormData] = useState<Partial<PeggedCurrencyDetails>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Pegged Currency Details' : 'New Pegged Currency Details'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency (→ Currency)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Currency..."
                value={String(formData.source_currency ?? '')}
                onChange={e => {
                  handleChange('source_currency', e.target.value);
                  // TODO: Implement async search for Currency
                  // fetch(`/api/resource/Currency?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Currency"
                data-fieldname="source_currency"
              />
              {/* Link indicator */}
              {formData.source_currency && (
                <button
                  type="button"
                  onClick={() => handleChange('source_currency', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pegged Against (→ Currency)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Currency..."
                value={String(formData.pegged_against ?? '')}
                onChange={e => {
                  handleChange('pegged_against', e.target.value);
                  // TODO: Implement async search for Currency
                  // fetch(`/api/resource/Currency?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Currency"
                data-fieldname="pegged_against"
              />
              {/* Link indicator */}
              {formData.pegged_against && (
                <button
                  type="button"
                  onClick={() => handleChange('pegged_against', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Exchange Rate</label>
            <input
              type="text"
              value={String(formData.pegged_exchange_rate ?? '')}
              onChange={e => handleChange('pegged_exchange_rate', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}