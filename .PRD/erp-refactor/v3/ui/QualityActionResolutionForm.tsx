// Form scaffold for Quality Action Resolution
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { QualityActionResolution } from '../types/quality-action-resolution.js';

interface QualityActionResolutionFormProps {
  initialData?: Partial<QualityActionResolution>;
  onSubmit: (data: Partial<QualityActionResolution>) => void;
  mode: 'create' | 'edit';
}

export function QualityActionResolutionForm({ initialData = {}, onSubmit, mode }: QualityActionResolutionFormProps) {
  const [formData, setFormData] = useState<Partial<QualityActionResolution>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Quality Action Resolution' : 'New Quality Action Resolution'}</h2>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Problem</label>
            <textarea
              value={String(formData.problem ?? '')}
              onChange={e => handleChange('problem', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Resolution</label>
            <textarea
              value={String(formData.resolution ?? '')}
              onChange={e => handleChange('resolution', e.target.value)}
              rows={4}
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
              <option value="Open">Open</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Responsible (→ User)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search User..."
                value={String(formData.responsible ?? '')}
                onChange={e => {
                  handleChange('responsible', e.target.value);
                  // TODO: Implement async search for User
                  // fetch(`/api/resource/User?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="User"
                data-fieldname="responsible"
              />
              {/* Link indicator */}
              {formData.responsible && (
                <button
                  type="button"
                  onClick={() => handleChange('responsible', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Completion By</label>
            <input
              type="date"
              value={String(formData.completion_by ?? '')}
              onChange={e => handleChange('completion_by', e.target.value)}
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