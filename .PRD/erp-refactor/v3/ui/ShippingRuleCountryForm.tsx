// Form scaffold for Shipping Rule Country
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ShippingRuleCountry } from '../types/shipping-rule-country.js';

interface ShippingRuleCountryFormProps {
  initialData?: Partial<ShippingRuleCountry>;
  onSubmit: (data: Partial<ShippingRuleCountry>) => void;
  mode: 'create' | 'edit';
}

export function ShippingRuleCountryForm({ initialData = {}, onSubmit, mode }: ShippingRuleCountryFormProps) {
  const [formData, setFormData] = useState<Partial<ShippingRuleCountry>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Shipping Rule Country' : 'New Shipping Rule Country'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country (→ Country)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Country..."
                value={String(formData.country ?? '')}
                onChange={e => {
                  handleChange('country', e.target.value);
                  // TODO: Implement async search for Country
                  // fetch(`/api/resource/Country?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Country"
                data-fieldname="country"
              />
              {/* Link indicator */}
              {formData.country && (
                <button
                  type="button"
                  onClick={() => handleChange('country', '')}
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