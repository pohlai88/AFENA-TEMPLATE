// Form scaffold for Service Level Priority
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ServiceLevelPriority } from '../types/service-level-priority.js';

interface ServiceLevelPriorityFormProps {
  initialData?: Partial<ServiceLevelPriority>;
  onSubmit: (data: Partial<ServiceLevelPriority>) => void;
  mode: 'create' | 'edit';
}

export function ServiceLevelPriorityForm({ initialData = {}, onSubmit, mode }: ServiceLevelPriorityFormProps) {
  const [formData, setFormData] = useState<Partial<ServiceLevelPriority>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Service Level Priority' : 'New Service Level Priority'}</h2>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.default_priority}
              onChange={e => handleChange('default_priority', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Default Priority</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority (→ Issue Priority)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Issue Priority..."
                value={String(formData.priority ?? '')}
                onChange={e => {
                  handleChange('priority', e.target.value);
                  // TODO: Implement async search for Issue Priority
                  // fetch(`/api/resource/Issue Priority?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Issue Priority"
                data-fieldname="priority"
              />
              {/* Link indicator */}
              {formData.priority && (
                <button
                  type="button"
                  onClick={() => handleChange('priority', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
      {/* Section: sb_00 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Response Time</label>
            <input
              type="number"
              step="any"
              value={formData.response_time != null ? Number(formData.response_time) : ''}
              onChange={e => handleChange('response_time', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Resolution Time</label>
            <input
              type="number"
              step="any"
              value={formData.resolution_time != null ? Number(formData.resolution_time) : ''}
              onChange={e => handleChange('resolution_time', e.target.value ? parseFloat(e.target.value) : undefined)}
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