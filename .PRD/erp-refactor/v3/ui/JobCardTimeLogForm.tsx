// Form scaffold for Job Card Time Log
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { JobCardTimeLog } from '../types/job-card-time-log.js';

interface JobCardTimeLogFormProps {
  initialData?: Partial<JobCardTimeLog>;
  onSubmit: (data: Partial<JobCardTimeLog>) => void;
  mode: 'create' | 'edit';
}

export function JobCardTimeLogForm({ initialData = {}, onSubmit, mode }: JobCardTimeLogFormProps) {
  const [formData, setFormData] = useState<Partial<JobCardTimeLog>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Job Card Time Log' : 'New Job Card Time Log'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee (→ Employee)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Employee..."
                value={String(formData.employee ?? '')}
                onChange={e => {
                  handleChange('employee', e.target.value);
                  // TODO: Implement async search for Employee
                  // fetch(`/api/resource/Employee?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Employee"
                data-fieldname="employee"
              />
              {/* Link indicator */}
              {formData.employee && (
                <button
                  type="button"
                  onClick={() => handleChange('employee', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">From Time</label>
            <input
              type="datetime-local"
              value={String(formData.from_time ?? '')}
              onChange={e => handleChange('from_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Time</label>
            <input
              type="datetime-local"
              value={String(formData.to_time ?? '')}
              onChange={e => handleChange('to_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time In Mins</label>
            <input
              type="number"
              step="any"
              value={formData.time_in_mins != null ? Number(formData.time_in_mins) : ''}
              onChange={e => handleChange('time_in_mins', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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
            <label className="block text-sm font-medium text-gray-700">Sub Operation (→ Operation)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Operation..."
                value={String(formData.operation ?? '')}
                onChange={e => {
                  handleChange('operation', e.target.value);
                  // TODO: Implement async search for Operation
                  // fetch(`/api/resource/Operation?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Operation"
                data-fieldname="operation"
              />
              {/* Link indicator */}
              {formData.operation && (
                <button
                  type="button"
                  onClick={() => handleChange('operation', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
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