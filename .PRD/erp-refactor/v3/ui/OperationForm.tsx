// Form scaffold for Operation
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { Operation } from '../types/operation.js';

interface OperationFormProps {
  initialData?: Partial<Operation>;
  onSubmit: (data: Partial<Operation>) => void;
  mode: 'create' | 'edit';
}

export function OperationForm({ initialData = {}, onSubmit, mode }: OperationFormProps) {
  const [formData, setFormData] = useState<Partial<Operation>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Operation' : 'New Operation'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Workstation (→ Workstation)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Workstation..."
                value={String(formData.workstation ?? '')}
                onChange={e => {
                  handleChange('workstation', e.target.value);
                  // TODO: Implement async search for Workstation
                  // fetch(`/api/resource/Workstation?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Workstation"
                data-fieldname="workstation"
              />
              {/* Link indicator */}
              {formData.workstation && (
                <button
                  type="button"
                  onClick={() => handleChange('workstation', '')}
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
              checked={!!formData.is_corrective_operation}
              onChange={e => handleChange('is_corrective_operation', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Corrective Operation</label>
          </div>
      {/* Section: Job Card */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Job Card</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.create_job_card_based_on_batch_size}
              onChange={e => handleChange('create_job_card_based_on_batch_size', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Create Job Card based on Batch Size</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quality Inspection Template (→ Quality Inspection Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Quality Inspection Template..."
                value={String(formData.quality_inspection_template ?? '')}
                onChange={e => {
                  handleChange('quality_inspection_template', e.target.value);
                  // TODO: Implement async search for Quality Inspection Template
                  // fetch(`/api/resource/Quality Inspection Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Quality Inspection Template"
                data-fieldname="quality_inspection_template"
              />
              {/* Link indicator */}
              {formData.quality_inspection_template && (
                <button
                  type="button"
                  onClick={() => handleChange('quality_inspection_template', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {!!formData.create_job_card_based_on_batch_size && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Batch Size</label>
            <input
              type="number"
              step="1"
              value={formData.batch_size != null ? Number(formData.batch_size) : ''}
              onChange={e => handleChange('batch_size', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Sub Operations */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Sub Operations</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: sub_operations → Sub Operation */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">sub_operations</label>
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
                  {(Array.isArray(formData.sub_operations) ? (formData.sub_operations as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.sub_operations) ? formData.sub_operations : [])];
                            rows.splice(idx, 1);
                            handleChange('sub_operations', rows);
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
                  onClick={() => handleChange('sub_operations', [...(Array.isArray(formData.sub_operations) ? formData.sub_operations : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Operation Time</label>
            <input
              type="number"
              step="any"
              value={formData.total_operation_time != null ? Number(formData.total_operation_time) : ''}
              onChange={e => handleChange('total_operation_time', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Operation Description */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Operation Description</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={String(formData.description ?? '')}
              onChange={e => handleChange('description', e.target.value)}
              rows={4}
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