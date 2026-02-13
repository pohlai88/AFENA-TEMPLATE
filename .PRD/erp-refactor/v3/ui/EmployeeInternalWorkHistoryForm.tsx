// Form scaffold for Employee Internal Work History
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { EmployeeInternalWorkHistory } from '../types/employee-internal-work-history.js';

interface EmployeeInternalWorkHistoryFormProps {
  initialData?: Partial<EmployeeInternalWorkHistory>;
  onSubmit: (data: Partial<EmployeeInternalWorkHistory>) => void;
  mode: 'create' | 'edit';
}

export function EmployeeInternalWorkHistoryForm({ initialData = {}, onSubmit, mode }: EmployeeInternalWorkHistoryFormProps) {
  const [formData, setFormData] = useState<Partial<EmployeeInternalWorkHistory>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Employee Internal Work History' : 'New Employee Internal Work History'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Branch (→ Branch)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Branch..."
                value={String(formData.branch ?? '')}
                onChange={e => {
                  handleChange('branch', e.target.value);
                  // TODO: Implement async search for Branch
                  // fetch(`/api/resource/Branch?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Branch"
                data-fieldname="branch"
              />
              {/* Link indicator */}
              {formData.branch && (
                <button
                  type="button"
                  onClick={() => handleChange('branch', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department (→ Department)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Department..."
                value={String(formData.department ?? '')}
                onChange={e => {
                  handleChange('department', e.target.value);
                  // TODO: Implement async search for Department
                  // fetch(`/api/resource/Department?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Department"
                data-fieldname="department"
              />
              {/* Link indicator */}
              {formData.department && (
                <button
                  type="button"
                  onClick={() => handleChange('department', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Designation (→ Designation)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Designation..."
                value={String(formData.designation ?? '')}
                onChange={e => {
                  handleChange('designation', e.target.value);
                  // TODO: Implement async search for Designation
                  // fetch(`/api/resource/Designation?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Designation"
                data-fieldname="designation"
              />
              {/* Link indicator */}
              {formData.designation && (
                <button
                  type="button"
                  onClick={() => handleChange('designation', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={String(formData.from_date ?? '')}
              onChange={e => handleChange('from_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={String(formData.to_date ?? '')}
              onChange={e => handleChange('to_date', e.target.value)}
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