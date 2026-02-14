// Form scaffold for Project Template
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ProjectTemplate } from '../types/project-template.js';

interface ProjectTemplateFormProps {
  initialData?: Partial<ProjectTemplate>;
  onSubmit: (data: Partial<ProjectTemplate>) => void;
  mode: 'create' | 'edit';
}

export function ProjectTemplateForm({ initialData = {}, onSubmit, mode }: ProjectTemplateFormProps) {
  const [formData, setFormData] = useState<Partial<ProjectTemplate>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Project Template' : 'New Project Template'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Type (→ Project Type)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Project Type..."
                value={String(formData.project_type ?? '')}
                onChange={e => {
                  handleChange('project_type', e.target.value);
                  // TODO: Implement async search for Project Type
                  // fetch(`/api/resource/Project Type?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Project Type"
                data-fieldname="project_type"
              />
              {/* Link indicator */}
              {formData.project_type && (
                <button
                  type="button"
                  onClick={() => handleChange('project_type', '')}
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
              checked={!!formData.disabled}
              onChange={e => handleChange('disabled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Disabled</label>
          </div>
          {/* Child table: tasks → Project Template Task */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Tasks</label>
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
                  {(Array.isArray(formData.tasks) ? (formData.tasks as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.tasks) ? formData.tasks : [])];
                            rows.splice(idx, 1);
                            handleChange('tasks', rows);
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
                  onClick={() => handleChange('tasks', [...(Array.isArray(formData.tasks) ? formData.tasks : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
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