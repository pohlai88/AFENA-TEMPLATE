// Form scaffold for Quality Procedure
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { QualityProcedure } from '../types/quality-procedure.js';

interface QualityProcedureFormProps {
  initialData?: Partial<QualityProcedure>;
  onSubmit: (data: Partial<QualityProcedure>) => void;
  mode: 'create' | 'edit';
}

export function QualityProcedureForm({ initialData = {}, onSubmit, mode }: QualityProcedureFormProps) {
  const [formData, setFormData] = useState<Partial<QualityProcedure>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Quality Procedure' : 'New Quality Procedure'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quality Procedure</label>
            <input
              type="text"
              value={String(formData.quality_procedure_name ?? '')}
              onChange={e => handleChange('quality_procedure_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Process Owner (→ User)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search User..."
                value={String(formData.process_owner ?? '')}
                onChange={e => {
                  handleChange('process_owner', e.target.value);
                  // TODO: Implement async search for User
                  // fetch(`/api/resource/User?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="User"
                data-fieldname="process_owner"
              />
              {/* Link indicator */}
              {formData.process_owner && (
                <button
                  type="button"
                  onClick={() => handleChange('process_owner', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Process Owner Full Name</label>
            <input
              type="text"
              value={String(formData.process_owner_full_name ?? '')}
              onChange={e => handleChange('process_owner_full_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: section_break_3 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: processes → Quality Procedure Process */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Processes</label>
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
                  {(Array.isArray(formData.processes) ? (formData.processes as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.processes) ? formData.processes : [])];
                            rows.splice(idx, 1);
                            handleChange('processes', rows);
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
                  onClick={() => handleChange('processes', [...(Array.isArray(formData.processes) ? formData.processes : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Parent */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Parent</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Parent Procedure (→ Quality Procedure)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Quality Procedure..."
                value={String(formData.parent_quality_procedure ?? '')}
                onChange={e => {
                  handleChange('parent_quality_procedure', e.target.value);
                  // TODO: Implement async search for Quality Procedure
                  // fetch(`/api/resource/Quality Procedure?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Quality Procedure"
                data-fieldname="parent_quality_procedure"
              />
              {/* Link indicator */}
              {formData.parent_quality_procedure && (
                <button
                  type="button"
                  onClick={() => handleChange('parent_quality_procedure', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_group}
              onChange={e => handleChange('is_group', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Group</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Right Index</label>
            <input
              type="number"
              step="1"
              value={formData.rgt != null ? Number(formData.rgt) : ''}
              onChange={e => handleChange('rgt', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Left Index</label>
            <input
              type="number"
              step="1"
              value={formData.lft != null ? Number(formData.lft) : ''}
              onChange={e => handleChange('lft', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">old_parent</label>
            <input
              type="text"
              value={String(formData.old_parent ?? '')}
              onChange={e => handleChange('old_parent', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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