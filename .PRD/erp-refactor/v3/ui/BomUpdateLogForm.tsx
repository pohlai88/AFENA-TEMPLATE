// Form scaffold for BOM Update Log
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { BomUpdateLog } from '../types/bom-update-log.js';

interface BomUpdateLogFormProps {
  initialData?: Partial<BomUpdateLog>;
  onSubmit: (data: Partial<BomUpdateLog>) => void;
  mode: 'create' | 'edit';
}

export function BomUpdateLogForm({ initialData = {}, onSubmit, mode }: BomUpdateLogFormProps) {
  const [formData, setFormData] = useState<Partial<BomUpdateLog>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'BOM Update Log' : 'New BOM Update Log'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Update Type</label>
            <select
              value={String(formData.update_type ?? '')}
              onChange={e => handleChange('update_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Replace BOM">Replace BOM</option>
              <option value="Update Cost">Update Cost</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Queued">Queued</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current BOM (→ BOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search BOM..."
                value={String(formData.current_bom ?? '')}
                onChange={e => {
                  handleChange('current_bom', e.target.value);
                  // TODO: Implement async search for BOM
                  // fetch(`/api/resource/BOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="BOM"
                data-fieldname="current_bom"
              />
              {/* Link indicator */}
              {formData.current_bom && (
                <button
                  type="button"
                  onClick={() => handleChange('current_bom', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New BOM (→ BOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search BOM..."
                value={String(formData.new_bom ?? '')}
                onChange={e => {
                  handleChange('new_bom', e.target.value);
                  // TODO: Implement async search for BOM
                  // fetch(`/api/resource/BOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="BOM"
                data-fieldname="new_bom"
              />
              {/* Link indicator */}
              {formData.new_bom && (
                <button
                  type="button"
                  onClick={() => handleChange('new_bom', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Error Log (→ Error Log)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Error Log..."
                value={String(formData.error_log ?? '')}
                onChange={e => {
                  handleChange('error_log', e.target.value);
                  // TODO: Implement async search for Error Log
                  // fetch(`/api/resource/Error Log?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Error Log"
                data-fieldname="error_log"
              />
              {/* Link indicator */}
              {formData.error_log && (
                <button
                  type="button"
                  onClick={() => handleChange('error_log', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
      {/* Section: Progress */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Progress</h4>
        <div className="grid grid-cols-2 gap-4">
          {formData.status !==== "Completed" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Level</label>
            <input
              type="number"
              step="1"
              value={formData.current_level != null ? Number(formData.current_level) : ''}
              onChange={e => handleChange('current_level', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Processed BOMs</label>
            <textarea
              value={String(formData.processed_boms ?? '')}
              onChange={e => handleChange('processed_boms', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {/* Child table: bom_batches → BOM Update Batch */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">bom_batches</label>
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
                  {(Array.isArray(formData.bom_batches) ? (formData.bom_batches as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.bom_batches) ? formData.bom_batches : [])];
                            rows.splice(idx, 1);
                            handleChange('bom_batches', rows);
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
                  onClick={() => handleChange('bom_batches', [...(Array.isArray(formData.bom_batches) ? formData.bom_batches : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ BOM Update Log)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search BOM Update Log..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for BOM Update Log
                  // fetch(`/api/resource/BOM Update Log?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="BOM Update Log"
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