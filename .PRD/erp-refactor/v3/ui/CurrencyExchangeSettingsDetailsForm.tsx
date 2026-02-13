// Form scaffold for Currency Exchange Settings Details
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { CurrencyExchangeSettingsDetails } from '../types/currency-exchange-settings-details.js';

interface CurrencyExchangeSettingsDetailsFormProps {
  initialData?: Partial<CurrencyExchangeSettingsDetails>;
  onSubmit: (data: Partial<CurrencyExchangeSettingsDetails>) => void;
  mode: 'create' | 'edit';
}

export function CurrencyExchangeSettingsDetailsForm({ initialData = {}, onSubmit, mode }: CurrencyExchangeSettingsDetailsFormProps) {
  const [formData, setFormData] = useState<Partial<CurrencyExchangeSettingsDetails>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Currency Exchange Settings Details' : 'New Currency Exchange Settings Details'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Key</label>
            <input
              type="text"
              value={String(formData.key ?? '')}
              onChange={e => handleChange('key', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Value</label>
            <input
              type="text"
              value={String(formData.value ?? '')}
              onChange={e => handleChange('value', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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