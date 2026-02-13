// Form scaffold for Monthly Distribution
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { MonthlyDistribution } from '../types/monthly-distribution.js';

interface MonthlyDistributionFormProps {
  initialData?: Partial<MonthlyDistribution>;
  onSubmit: (data: Partial<MonthlyDistribution>) => void;
  mode: 'create' | 'edit';
}

export function MonthlyDistributionForm({ initialData = {}, onSubmit, mode }: MonthlyDistributionFormProps) {
  const [formData, setFormData] = useState<Partial<MonthlyDistribution>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Monthly Distribution' : 'New Monthly Distribution'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Distribution Name</label>
            <input
              type="text"
              value={String(formData.distribution_id ?? '')}
              onChange={e => handleChange('distribution_id', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fiscal Year (→ Fiscal Year)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Fiscal Year..."
                value={String(formData.fiscal_year ?? '')}
                onChange={e => {
                  handleChange('fiscal_year', e.target.value);
                  // TODO: Implement async search for Fiscal Year
                  // fetch(`/api/resource/Fiscal Year?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Fiscal Year"
                data-fieldname="fiscal_year"
              />
              {/* Link indicator */}
              {formData.fiscal_year && (
                <button
                  type="button"
                  onClick={() => handleChange('fiscal_year', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {/* Child table: percentages → Monthly Distribution Percentage */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Monthly Distribution Percentages</label>
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
                  {(Array.isArray(formData.percentages) ? (formData.percentages as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.percentages) ? formData.percentages : [])];
                            rows.splice(idx, 1);
                            handleChange('percentages', rows);
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
                  onClick={() => handleChange('percentages', [...(Array.isArray(formData.percentages) ? formData.percentages : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
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