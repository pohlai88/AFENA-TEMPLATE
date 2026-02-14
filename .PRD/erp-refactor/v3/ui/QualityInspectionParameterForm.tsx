// Form scaffold for Quality Inspection Parameter
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { QualityInspectionParameter } from '../types/quality-inspection-parameter.js';

interface QualityInspectionParameterFormProps {
  initialData?: Partial<QualityInspectionParameter>;
  onSubmit: (data: Partial<QualityInspectionParameter>) => void;
  mode: 'create' | 'edit';
}

export function QualityInspectionParameterForm({ initialData = {}, onSubmit, mode }: QualityInspectionParameterFormProps) {
  const [formData, setFormData] = useState<Partial<QualityInspectionParameter>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Quality Inspection Parameter' : 'New Quality Inspection Parameter'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Parameter</label>
            <input
              type="text"
              value={String(formData.parameter ?? '')}
              onChange={e => handleChange('parameter', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Parameter Group (→ Quality Inspection Parameter Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Quality Inspection Parameter Group..."
                value={String(formData.parameter_group ?? '')}
                onChange={e => {
                  handleChange('parameter_group', e.target.value);
                  // TODO: Implement async search for Quality Inspection Parameter Group
                  // fetch(`/api/resource/Quality Inspection Parameter Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Quality Inspection Parameter Group"
                data-fieldname="parameter_group"
              />
              {/* Link indicator */}
              {formData.parameter_group && (
                <button
                  type="button"
                  onClick={() => handleChange('parameter_group', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
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