// Form scaffold for UOM Conversion Factor
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { UomConversionFactor } from '../types/uom-conversion-factor.js';

interface UomConversionFactorFormProps {
  initialData?: Partial<UomConversionFactor>;
  onSubmit: (data: Partial<UomConversionFactor>) => void;
  mode: 'create' | 'edit';
}

export function UomConversionFactorForm({ initialData = {}, onSubmit, mode }: UomConversionFactorFormProps) {
  const [formData, setFormData] = useState<Partial<UomConversionFactor>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'UOM Conversion Factor' : 'New UOM Conversion Factor'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category (→ UOM Category)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UOM Category..."
                value={String(formData.category ?? '')}
                onChange={e => {
                  handleChange('category', e.target.value);
                  // TODO: Implement async search for UOM Category
                  // fetch(`/api/resource/UOM Category?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="UOM Category"
                data-fieldname="category"
              />
              {/* Link indicator */}
              {formData.category && (
                <button
                  type="button"
                  onClick={() => handleChange('category', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
      {/* Section: section_break_2 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From (→ UOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UOM..."
                value={String(formData.from_uom ?? '')}
                onChange={e => {
                  handleChange('from_uom', e.target.value);
                  // TODO: Implement async search for UOM
                  // fetch(`/api/resource/UOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="UOM"
                data-fieldname="from_uom"
              />
              {/* Link indicator */}
              {formData.from_uom && (
                <button
                  type="button"
                  onClick={() => handleChange('from_uom', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To (→ UOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UOM..."
                value={String(formData.to_uom ?? '')}
                onChange={e => {
                  handleChange('to_uom', e.target.value);
                  // TODO: Implement async search for UOM
                  // fetch(`/api/resource/UOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="UOM"
                data-fieldname="to_uom"
              />
              {/* Link indicator */}
              {formData.to_uom && (
                <button
                  type="button"
                  onClick={() => handleChange('to_uom', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Value</label>
            <input
              type="number"
              step="any"
              value={formData.value != null ? Number(formData.value) : ''}
              onChange={e => handleChange('value', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
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