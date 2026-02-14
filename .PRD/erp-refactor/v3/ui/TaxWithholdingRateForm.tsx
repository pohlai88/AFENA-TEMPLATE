// Form scaffold for Tax Withholding Rate
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { TaxWithholdingRate } from '../types/tax-withholding-rate.js';

interface TaxWithholdingRateFormProps {
  initialData?: Partial<TaxWithholdingRate>;
  onSubmit: (data: Partial<TaxWithholdingRate>) => void;
  mode: 'create' | 'edit';
}

export function TaxWithholdingRateForm({ initialData = {}, onSubmit, mode }: TaxWithholdingRateFormProps) {
  const [formData, setFormData] = useState<Partial<TaxWithholdingRate>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Tax Withholding Rate' : 'New Tax Withholding Rate'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={String(formData.from_date ?? '')}
              onChange={e => handleChange('from_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={String(formData.to_date ?? '')}
              onChange={e => handleChange('to_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Withholding Group (→ Tax Withholding Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Tax Withholding Group..."
                value={String(formData.tax_withholding_group ?? '')}
                onChange={e => {
                  handleChange('tax_withholding_group', e.target.value);
                  // TODO: Implement async search for Tax Withholding Group
                  // fetch(`/api/resource/Tax Withholding Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Tax Withholding Group"
                data-fieldname="tax_withholding_group"
              />
              {/* Link indicator */}
              {formData.tax_withholding_group && (
                <button
                  type="button"
                  onClick={() => handleChange('tax_withholding_group', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Withholding Rate</label>
            <input
              type="number"
              step="any"
              value={formData.tax_withholding_rate != null ? Number(formData.tax_withholding_rate) : ''}
              onChange={e => handleChange('tax_withholding_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cumulative Threshold</label>
            <input
              type="number"
              step="any"
              value={formData.cumulative_threshold != null ? Number(formData.cumulative_threshold) : ''}
              onChange={e => handleChange('cumulative_threshold', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Transaction Threshold</label>
            <input
              type="number"
              step="any"
              value={formData.single_threshold != null ? Number(formData.single_threshold) : ''}
              onChange={e => handleChange('single_threshold', e.target.value ? parseFloat(e.target.value) : undefined)}
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