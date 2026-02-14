// Form scaffold for Sales Partner Type
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SalesPartnerType } from '../types/sales-partner-type.js';

interface SalesPartnerTypeFormProps {
  initialData?: Partial<SalesPartnerType>;
  onSubmit: (data: Partial<SalesPartnerType>) => void;
  mode: 'create' | 'edit';
}

export function SalesPartnerTypeForm({ initialData = {}, onSubmit, mode }: SalesPartnerTypeFormProps) {
  const [formData, setFormData] = useState<Partial<SalesPartnerType>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Sales Partner Type' : 'New Sales Partner Type'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Partner Type</label>
            <input
              type="text"
              value={String(formData.sales_partner_type ?? '')}
              onChange={e => handleChange('sales_partner_type', e.target.value)}
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