// Form scaffold for Employee Education
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { EmployeeEducation } from '../types/employee-education.js';

interface EmployeeEducationFormProps {
  initialData?: Partial<EmployeeEducation>;
  onSubmit: (data: Partial<EmployeeEducation>) => void;
  mode: 'create' | 'edit';
}

export function EmployeeEducationForm({ initialData = {}, onSubmit, mode }: EmployeeEducationFormProps) {
  const [formData, setFormData] = useState<Partial<EmployeeEducation>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Employee Education' : 'New Employee Education'}</h2>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">School/University</label>
            <textarea
              value={String(formData.school_univ ?? '')}
              onChange={e => handleChange('school_univ', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Qualification</label>
            <input
              type="text"
              value={String(formData.qualification ?? '')}
              onChange={e => handleChange('qualification', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <select
              value={String(formData.level ?? '')}
              onChange={e => handleChange('level', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Graduate">Graduate</option>
              <option value="Post Graduate">Post Graduate</option>
              <option value="Under Graduate">Under Graduate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year of Passing</label>
            <input
              type="number"
              step="1"
              value={formData.year_of_passing != null ? Number(formData.year_of_passing) : ''}
              onChange={e => handleChange('year_of_passing', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Class / Percentage</label>
            <input
              type="text"
              value={String(formData.class_per ?? '')}
              onChange={e => handleChange('class_per', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Major/Optional Subjects</label>
            <textarea
              value={String(formData.maj_opt_subj ?? '')}
              onChange={e => handleChange('maj_opt_subj', e.target.value)}
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