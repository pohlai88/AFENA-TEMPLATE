// Form scaffold for Project Type
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ProjectType } from '../types/project-type.js';

interface ProjectTypeFormProps {
  initialData?: Partial<ProjectType>;
  onSubmit: (data: Partial<ProjectType>) => void;
  mode: 'create' | 'edit';
}

export function ProjectTypeForm({ initialData = {}, onSubmit, mode }: ProjectTypeFormProps) {
  const [formData, setFormData] = useState<Partial<ProjectType>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Project Type' : 'New Project Type'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Type</label>
            <input
              type="text"
              value={String(formData.project_type ?? '')}
              onChange={e => handleChange('project_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
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