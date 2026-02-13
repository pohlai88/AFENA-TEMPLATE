// Form scaffold for Asset Finance Book
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { AssetFinanceBook } from '../types/asset-finance-book.js';

interface AssetFinanceBookFormProps {
  initialData?: Partial<AssetFinanceBook>;
  onSubmit: (data: Partial<AssetFinanceBook>) => void;
  mode: 'create' | 'edit';
}

export function AssetFinanceBookForm({ initialData = {}, onSubmit, mode }: AssetFinanceBookFormProps) {
  const [formData, setFormData] = useState<Partial<AssetFinanceBook>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Asset Finance Book' : 'New Asset Finance Book'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Finance Book (→ Finance Book)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Finance Book..."
                value={String(formData.finance_book ?? '')}
                onChange={e => {
                  handleChange('finance_book', e.target.value);
                  // TODO: Implement async search for Finance Book
                  // fetch(`/api/resource/Finance Book?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Finance Book"
                data-fieldname="finance_book"
              />
              {/* Link indicator */}
              {formData.finance_book && (
                <button
                  type="button"
                  onClick={() => handleChange('finance_book', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Depreciation Method</label>
            <select
              value={String(formData.depreciation_method ?? '')}
              onChange={e => handleChange('depreciation_method', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Straight Line">Straight Line</option>
              <option value="Double Declining Balance">Double Declining Balance</option>
              <option value="Written Down Value">Written Down Value</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Frequency of Depreciation (Months)</label>
            <input
              type="number"
              step="1"
              value={formData.frequency_of_depreciation != null ? Number(formData.frequency_of_depreciation) : ''}
              onChange={e => handleChange('frequency_of_depreciation', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Number of Depreciations</label>
            <input
              type="number"
              step="1"
              value={formData.total_number_of_depreciations != null ? Number(formData.total_number_of_depreciations) : ''}
              onChange={e => handleChange('total_number_of_depreciations', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Increase In Asset Life (Months)</label>
            <input
              type="number"
              step="1"
              value={formData.increase_in_asset_life != null ? Number(formData.increase_in_asset_life) : ''}
              onChange={e => handleChange('increase_in_asset_life', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Depreciation Posting Date</label>
            <input
              type="date"
              value={String(formData.depreciation_start_date ?? '')}
              onChange={e => handleChange('depreciation_start_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Salvage Value Percentage</label>
            <input
              type="number"
              step="any"
              value={formData.salvage_value_percentage != null ? Number(formData.salvage_value_percentage) : ''}
              onChange={e => handleChange('salvage_value_percentage', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {parent.doctype === 'Asset' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Salvage Value</label>
            <input
              type="number"
              step="any"
              value={formData.expected_value_after_useful_life != null ? Number(formData.expected_value_after_useful_life) : ''}
              onChange={e => handleChange('expected_value_after_useful_life', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.depreciation_method === 'Written Down Value' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Rate of Depreciation (%)</label>
            <input
              type="number"
              step="any"
              value={formData.rate_of_depreciation != null ? Number(formData.rate_of_depreciation) : ''}
              onChange={e => handleChange('rate_of_depreciation', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.daily_prorata_based}
              onChange={e => handleChange('daily_prorata_based', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Depreciate based on daily pro-rata</label>
          </div>
          {formData.depreciation_method === "Straight Line" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.shift_based}
              onChange={e => handleChange('shift_based', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Depreciate based on shifts</label>
          </div>
          )}
      {/* Section: section_break_jkdf */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Value After Depreciation</label>
            <input
              type="number"
              step="any"
              value={formData.value_after_depreciation != null ? Number(formData.value_after_depreciation) : ''}
              onChange={e => handleChange('value_after_depreciation', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.total_number_of_booked_depreciations && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Number of Booked Depreciations </label>
            <input
              type="number"
              step="1"
              value={formData.total_number_of_booked_depreciations != null ? Number(formData.total_number_of_booked_depreciations) : ''}
              onChange={e => handleChange('total_number_of_booked_depreciations', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
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