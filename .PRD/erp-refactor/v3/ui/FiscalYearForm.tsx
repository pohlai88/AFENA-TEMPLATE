// Form scaffold for Fiscal Year
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { FiscalYear } from '../types/fiscal-year.js';

interface FiscalYearFormProps {
  initialData?: Partial<FiscalYear>;
  onSubmit: (data: Partial<FiscalYear>) => void;
  mode: 'create' | 'edit';
}

export function FiscalYearForm({ initialData = {}, onSubmit, mode }: FiscalYearFormProps) {
  const [formData, setFormData] = useState<Partial<FiscalYear>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Fiscal Year' : 'New Fiscal Year'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year Name</label>
            <input
              type="text"
              value={String(formData.year ?? '')}
              onChange={e => handleChange('year', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.disabled}
              onChange={e => handleChange('disabled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Disabled</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_short_year}
              onChange={e => handleChange('is_short_year', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Short/Long Year</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year Start Date</label>
            <input
              type="date"
              value={String(formData.year_start_date ?? '')}
              onChange={e => handleChange('year_start_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year End Date</label>
            <input
              type="date"
              value={String(formData.year_end_date ?? '')}
              onChange={e => handleChange('year_end_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          {/* Child table: companies → Fiscal Year Company */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Companies</label>
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
                  {(Array.isArray(formData.companies) ? (formData.companies as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.companies) ? formData.companies : [])];
                            rows.splice(idx, 1);
                            handleChange('companies', rows);
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
                  onClick={() => handleChange('companies', [...(Array.isArray(formData.companies) ? formData.companies : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.auto_created}
              onChange={e => handleChange('auto_created', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Auto Created</label>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}