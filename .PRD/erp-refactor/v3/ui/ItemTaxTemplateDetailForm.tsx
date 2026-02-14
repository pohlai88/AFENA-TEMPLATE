// Form scaffold for Item Tax Template Detail
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ItemTaxTemplateDetail } from '../types/item-tax-template-detail.js';

interface ItemTaxTemplateDetailFormProps {
  initialData?: Partial<ItemTaxTemplateDetail>;
  onSubmit: (data: Partial<ItemTaxTemplateDetail>) => void;
  mode: 'create' | 'edit';
}

export function ItemTaxTemplateDetailForm({ initialData = {}, onSubmit, mode }: ItemTaxTemplateDetailFormProps) {
  const [formData, setFormData] = useState<Partial<ItemTaxTemplateDetail>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Item Tax Template Detail' : 'New Item Tax Template Detail'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.tax_type ?? '')}
                onChange={e => {
                  handleChange('tax_type', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="tax_type"
              />
              {/* Link indicator */}
              {formData.tax_type && (
                <button
                  type="button"
                  onClick={() => handleChange('tax_type', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Rate</label>
            <input
              type="number"
              step="any"
              value={formData.tax_rate != null ? Number(formData.tax_rate) : ''}
              onChange={e => handleChange('tax_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
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