// Form scaffold for Asset Depreciation Schedule
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { AssetDepreciationSchedule } from '../types/asset-depreciation-schedule.js';

interface AssetDepreciationScheduleFormProps {
  initialData?: Partial<AssetDepreciationSchedule>;
  onSubmit: (data: Partial<AssetDepreciationSchedule>) => void;
  mode: 'create' | 'edit';
}

export function AssetDepreciationScheduleForm({ initialData = {}, onSubmit, mode }: AssetDepreciationScheduleFormProps) {
  const [formData, setFormData] = useState<Partial<AssetDepreciationSchedule>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Asset Depreciation Schedule' : 'New Asset Depreciation Schedule'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset (→ Asset)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Asset..."
                value={String(formData.asset ?? '')}
                onChange={e => {
                  handleChange('asset', e.target.value);
                  // TODO: Implement async search for Asset
                  // fetch(`/api/resource/Asset?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Asset"
                data-fieldname="asset"
              />
              {/* Link indicator */}
              {formData.asset && (
                <button
                  type="button"
                  onClick={() => handleChange('asset', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Naming Series</label>
            <select
              value={String(formData.naming_series ?? '')}
              onChange={e => handleChange('naming_series', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>

            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company (→ Company)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Company..."
                value={String(formData.company ?? '')}
                onChange={e => {
                  handleChange('company', e.target.value);
                  // TODO: Implement async search for Company
                  // fetch(`/api/resource/Company?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Company"
                data-fieldname="company"
              />
              {/* Link indicator */}
              {formData.company && (
                <button
                  type="button"
                  onClick={() => handleChange('company', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Net Purchase Amount</label>
            <input
              type="number"
              step="any"
              value={formData.net_purchase_amount != null ? Number(formData.net_purchase_amount) : ''}
              onChange={e => handleChange('net_purchase_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Opening Accumulated Depreciation</label>
            <input
              type="number"
              step="any"
              value={formData.opening_accumulated_depreciation != null ? Number(formData.opening_accumulated_depreciation) : ''}
              onChange={e => handleChange('opening_accumulated_depreciation', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Opening Number of Booked Depreciations</label>
            <input
              type="number"
              step="1"
              value={formData.opening_number_of_booked_depreciations != null ? Number(formData.opening_number_of_booked_depreciations) : ''}
              onChange={e => handleChange('opening_number_of_booked_depreciations', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
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
            <label className="block text-sm font-medium text-gray-700">Finance Book Id</label>
            <input
              type="number"
              step="1"
              value={formData.finance_book_id != null ? Number(formData.finance_book_id) : ''}
              onChange={e => handleChange('finance_book_id', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: Depreciation Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Depreciation Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Depreciation Method</label>
            <select
              value={String(formData.depreciation_method ?? '')}
              onChange={e => handleChange('depreciation_method', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Straight Line">Straight Line</option>
              <option value="Double Declining Balance">Double Declining Balance</option>
              <option value="Written Down Value">Written Down Value</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          {!!formData.total_number_of_depreciations && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Number of Depreciations</label>
            <input
              type="number"
              step="1"
              value={formData.total_number_of_depreciations != null ? Number(formData.total_number_of_depreciations) : ''}
              onChange={e => handleChange('total_number_of_depreciations', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.depreciation_method === 'Written Down Value' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Rate of Depreciation</label>
            <input
              type="number"
              step="any"
              value={formData.rate_of_depreciation != null ? Number(formData.rate_of_depreciation) : ''}
              onChange={e => handleChange('rate_of_depreciation', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.depreciation_method === "Straight Line" || formData.depreciation_method === "Manual" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.daily_prorata_based}
              onChange={e => handleChange('daily_prorata_based', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Depreciate based on daily pro-rata</label>
          </div>
          )}
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
          {!!formData.frequency_of_depreciation && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Frequency of Depreciation (Months)</label>
            <input
              type="number"
              step="1"
              value={formData.frequency_of_depreciation != null ? Number(formData.frequency_of_depreciation) : ''}
              onChange={e => handleChange('frequency_of_depreciation', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Expected Value After Useful Life</label>
            <input
              type="number"
              step="any"
              value={formData.expected_value_after_useful_life != null ? Number(formData.expected_value_after_useful_life) : ''}
              onChange={e => handleChange('expected_value_after_useful_life', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
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
        </div>
      </div>
      {/* Section: Depreciation Schedule */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Depreciation Schedule</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: depreciation_schedule → Depreciation Schedule */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Depreciation Schedule</label>
            <div className="mt-1 border rounded overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(Array.isArray(formData.depreciation_schedule) ? (formData.depreciation_schedule as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.depreciation_schedule) ? formData.depreciation_schedule : [])];
                            rows.splice(idx, 1);
                            handleChange('depreciation_schedule', rows);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-2 bg-gray-50 border-t">
                <button
                  type="button"
                  onClick={() => handleChange('depreciation_schedule', [...(Array.isArray(formData.depreciation_schedule) ? formData.depreciation_schedule : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={String(formData.notes ?? '')}
              onChange={e => handleChange('notes', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Asset Depreciation Schedule)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Asset Depreciation Schedule..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Asset Depreciation Schedule
                  // fetch(`/api/resource/Asset Depreciation Schedule?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Asset Depreciation Schedule"
                data-fieldname="amended_from"
              />
              {/* Link indicator */}
              {formData.amended_from && (
                <button
                  type="button"
                  onClick={() => handleChange('amended_from', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
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