// Form scaffold for Job Card Operation
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { JobCardOperation } from '../types/job-card-operation.js';

interface JobCardOperationFormProps {
  initialData?: Partial<JobCardOperation>;
  onSubmit: (data: Partial<JobCardOperation>) => void;
  mode: 'create' | 'edit';
}

export function JobCardOperationForm({ initialData = {}, onSubmit, mode }: JobCardOperationFormProps) {
  const [formData, setFormData] = useState<Partial<JobCardOperation>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Job Card Operation' : 'New Job Card Operation'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Operation (→ Operation)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Operation..."
                value={String(formData.sub_operation ?? '')}
                onChange={e => {
                  handleChange('sub_operation', e.target.value);
                  // TODO: Implement async search for Operation
                  // fetch(`/api/resource/Operation?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Operation"
                data-fieldname="sub_operation"
              />
              {/* Link indicator */}
              {formData.sub_operation && (
                <button
                  type="button"
                  onClick={() => handleChange('sub_operation', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Completed Qty</label>
            <input
              type="number"
              step="any"
              value={formData.completed_qty != null ? Number(formData.completed_qty) : ''}
              onChange={e => handleChange('completed_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Completed Time</label>
            <input
              type="text"
              value={String(formData.completed_time ?? '')}
              onChange={e => handleChange('completed_time', e.target.value)}
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
              <option value="Complete">Complete</option>
              <option value="Pause">Pause</option>
              <option value="Pending">Pending</option>
              <option value="Work In Progress">Work In Progress</option>
            </select>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}