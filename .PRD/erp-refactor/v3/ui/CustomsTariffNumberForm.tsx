// Form scaffold for Customs Tariff Number
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { CustomsTariffNumber } from '../types/customs-tariff-number.js';

interface CustomsTariffNumberFormProps {
  initialData?: Partial<CustomsTariffNumber>;
  onSubmit: (data: Partial<CustomsTariffNumber>) => void;
  mode: 'create' | 'edit';
}

export function CustomsTariffNumberForm({ initialData = {}, onSubmit, mode }: CustomsTariffNumberFormProps) {
  const [formData, setFormData] = useState<Partial<CustomsTariffNumber>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Customs Tariff Number' : 'New Customs Tariff Number'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tariff Number</label>
            <input
              type="text"
              value={String(formData.tariff_number ?? '')}
              onChange={e => handleChange('tariff_number', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={String(formData.description ?? '')}
              onChange={e => handleChange('description', e.target.value)}
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