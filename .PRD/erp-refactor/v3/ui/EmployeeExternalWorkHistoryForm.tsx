// Form scaffold for Employee External Work History
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { EmployeeExternalWorkHistory } from '../types/employee-external-work-history.js';

interface EmployeeExternalWorkHistoryFormProps {
  initialData?: Partial<EmployeeExternalWorkHistory>;
  onSubmit: (data: Partial<EmployeeExternalWorkHistory>) => void;
  mode: 'create' | 'edit';
}

export function EmployeeExternalWorkHistoryForm({ initialData = {}, onSubmit, mode }: EmployeeExternalWorkHistoryFormProps) {
  const [formData, setFormData] = useState<Partial<EmployeeExternalWorkHistory>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Employee External Work History' : 'New Employee External Work History'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              value={String(formData.company_name ?? '')}
              onChange={e => handleChange('company_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Designation</label>
            <input
              type="text"
              value={String(formData.designation ?? '')}
              onChange={e => handleChange('designation', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Salary</label>
            <input
              type="number"
              step="any"
              value={formData.salary != null ? Number(formData.salary) : ''}
              onChange={e => handleChange('salary', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              value={String(formData.address ?? '')}
              onChange={e => handleChange('address', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact</label>
            <input
              type="text"
              value={String(formData.contact ?? '')}
              onChange={e => handleChange('contact', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Experience</label>
            <input
              type="text"
              value={String(formData.total_experience ?? '')}
              onChange={e => handleChange('total_experience', e.target.value)}
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