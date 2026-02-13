// Form scaffold for PSOA Project
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PsoaProject } from '../types/psoa-project.js';

interface PsoaProjectFormProps {
  initialData?: Partial<PsoaProject>;
  onSubmit: (data: Partial<PsoaProject>) => void;
  mode: 'create' | 'edit';
}

export function PsoaProjectForm({ initialData = {}, onSubmit, mode }: PsoaProjectFormProps) {
  const [formData, setFormData] = useState<Partial<PsoaProject>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'PSOA Project' : 'New PSOA Project'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Project (→ Project)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Project..."
                value={String(formData.project_name ?? '')}
                onChange={e => {
                  handleChange('project_name', e.target.value);
                  // TODO: Implement async search for Project
                  // fetch(`/api/resource/Project?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Project"
                data-fieldname="project_name"
              />
              {/* Link indicator */}
              {formData.project_name && (
                <button
                  type="button"
                  onClick={() => handleChange('project_name', '')}
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