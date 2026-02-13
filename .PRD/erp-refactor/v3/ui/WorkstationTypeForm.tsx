// Form scaffold for Workstation Type
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { WorkstationType } from '../types/workstation-type.js';

interface WorkstationTypeFormProps {
  initialData?: Partial<WorkstationType>;
  onSubmit: (data: Partial<WorkstationType>) => void;
  mode: 'create' | 'edit';
}

export function WorkstationTypeForm({ initialData = {}, onSubmit, mode }: WorkstationTypeFormProps) {
  const [formData, setFormData] = useState<Partial<WorkstationType>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Workstation Type' : 'New Workstation Type'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Workstation Type</label>
            <input
              type="text"
              value={String(formData.workstation_type ?? '')}
              onChange={e => handleChange('workstation_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
      {/* Section: Operating Costs (Per Hour) */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Operating Costs (Per Hour)</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: workstation_costs → Workstation Cost */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Operating Components Cost</label>
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
                  {(Array.isArray(formData.workstation_costs) ? (formData.workstation_costs as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.workstation_costs) ? formData.workstation_costs : [])];
                            rows.splice(idx, 1);
                            handleChange('workstation_costs', rows);
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
                  onClick={() => handleChange('workstation_costs', [...(Array.isArray(formData.workstation_costs) ? formData.workstation_costs : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: section_break_8 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Net Hour Rate</label>
            <input
              type="number"
              step="any"
              value={formData.hour_rate != null ? Number(formData.hour_rate) : ''}
              onChange={e => handleChange('hour_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Tab: Description */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Description</h3>
      </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={String(formData.description ?? '')}
              onChange={e => handleChange('description', e.target.value)}
              rows={4}
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