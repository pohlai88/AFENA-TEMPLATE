// Form scaffold for Currency Exchange
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { CurrencyExchange } from '../types/currency-exchange.js';

interface CurrencyExchangeFormProps {
  initialData?: Partial<CurrencyExchange>;
  onSubmit: (data: Partial<CurrencyExchange>) => void;
  mode: 'create' | 'edit';
}

export function CurrencyExchangeForm({ initialData = {}, onSubmit, mode }: CurrencyExchangeFormProps) {
  const [formData, setFormData] = useState<Partial<CurrencyExchange>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Currency Exchange' : 'New Currency Exchange'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={String(formData.date ?? '')}
              onChange={e => handleChange('date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">From Currency (→ Currency)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Currency..."
                value={String(formData.from_currency ?? '')}
                onChange={e => {
                  handleChange('from_currency', e.target.value);
                  // TODO: Implement async search for Currency
                  // fetch(`/api/resource/Currency?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Currency"
                data-fieldname="from_currency"
              />
              {/* Link indicator */}
              {formData.from_currency && (
                <button
                  type="button"
                  onClick={() => handleChange('from_currency', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Currency (→ Currency)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Currency..."
                value={String(formData.to_currency ?? '')}
                onChange={e => {
                  handleChange('to_currency', e.target.value);
                  // TODO: Implement async search for Currency
                  // fetch(`/api/resource/Currency?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Currency"
                data-fieldname="to_currency"
              />
              {/* Link indicator */}
              {formData.to_currency && (
                <button
                  type="button"
                  onClick={() => handleChange('to_currency', '')}
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
              type="number"
              step="any"
              value={formData.exchange_rate != null ? Number(formData.exchange_rate) : ''}
              onChange={e => handleChange('exchange_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.for_buying}
              onChange={e => handleChange('for_buying', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">For Buying</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.for_selling}
              onChange={e => handleChange('for_selling', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">For Selling</label>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}