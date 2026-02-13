// Form scaffold for Allowed Dimension
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { AllowedDimension } from '../types/allowed-dimension.js';

interface AllowedDimensionFormProps {
  initialData?: Partial<AllowedDimension>;
  onSubmit: (data: Partial<AllowedDimension>) => void;
  mode: 'create' | 'edit';
}

export function AllowedDimensionForm({ initialData = {}, onSubmit, mode }: AllowedDimensionFormProps) {
  const [formData, setFormData] = useState<Partial<AllowedDimension>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Allowed Dimension' : 'New Allowed Dimension'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Accounting Dimension (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.accounting_dimension ?? '')}
                onChange={e => {
                  handleChange('accounting_dimension', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="accounting_dimension"
              />
              {/* Link indicator */}
              {formData.accounting_dimension && (
                <button
                  type="button"
                  onClick={() => handleChange('accounting_dimension', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">dimension_value</label>
            <input
              type="text"
              value={String(formData.dimension_value ?? '')}
              onChange={e => handleChange('dimension_value', e.target.value)}
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