// Form scaffold for Sales Partner Item
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SalesPartnerItem } from '../types/sales-partner-item.js';

interface SalesPartnerItemFormProps {
  initialData?: Partial<SalesPartnerItem>;
  onSubmit: (data: Partial<SalesPartnerItem>) => void;
  mode: 'create' | 'edit';
}

export function SalesPartnerItemForm({ initialData = {}, onSubmit, mode }: SalesPartnerItemFormProps) {
  const [formData, setFormData] = useState<Partial<SalesPartnerItem>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Sales Partner Item' : 'New Sales Partner Item'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Partner  (→ Sales Partner)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Partner..."
                value={String(formData.sales_partner ?? '')}
                onChange={e => {
                  handleChange('sales_partner', e.target.value);
                  // TODO: Implement async search for Sales Partner
                  // fetch(`/api/resource/Sales Partner?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Partner"
                data-fieldname="sales_partner"
              />
              {/* Link indicator */}
              {formData.sales_partner && (
                <button
                  type="button"
                  onClick={() => handleChange('sales_partner', '')}
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