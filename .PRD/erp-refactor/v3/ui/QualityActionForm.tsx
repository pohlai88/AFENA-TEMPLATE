// Form scaffold for Quality Action
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { QualityAction } from '../types/quality-action.js';

interface QualityActionFormProps {
  initialData?: Partial<QualityAction>;
  onSubmit: (data: Partial<QualityAction>) => void;
  mode: 'create' | 'edit';
}

export function QualityActionForm({ initialData = {}, onSubmit, mode }: QualityActionFormProps) {
  const [formData, setFormData] = useState<Partial<QualityAction>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Quality Action' : 'New Quality Action'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Corrective/Preventive</label>
            <select
              value={String(formData.corrective_preventive ?? '')}
              onChange={e => handleChange('corrective_preventive', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Corrective">Corrective</option>
              <option value="Preventive">Preventive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Review (→ Quality Review)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Quality Review..."
                value={String(formData.review ?? '')}
                onChange={e => {
                  handleChange('review', e.target.value);
                  // TODO: Implement async search for Quality Review
                  // fetch(`/api/resource/Quality Review?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Quality Review"
                data-fieldname="review"
              />
              {/* Link indicator */}
              {formData.review && (
                <button
                  type="button"
                  onClick={() => handleChange('review', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Feedback (→ Quality Feedback)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Quality Feedback..."
                value={String(formData.feedback ?? '')}
                onChange={e => {
                  handleChange('feedback', e.target.value);
                  // TODO: Implement async search for Quality Feedback
                  // fetch(`/api/resource/Quality Feedback?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Quality Feedback"
                data-fieldname="feedback"
              />
              {/* Link indicator */}
              {formData.feedback && (
                <button
                  type="button"
                  onClick={() => handleChange('feedback', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
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
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={String(formData.date ?? '')}
              onChange={e => handleChange('date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Goal (→ Quality Goal)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Quality Goal..."
                value={String(formData.goal ?? '')}
                onChange={e => {
                  handleChange('goal', e.target.value);
                  // TODO: Implement async search for Quality Goal
                  // fetch(`/api/resource/Quality Goal?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Quality Goal"
                data-fieldname="goal"
              />
              {/* Link indicator */}
              {formData.goal && (
                <button
                  type="button"
                  onClick={() => handleChange('goal', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Procedure (→ Quality Procedure)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Quality Procedure..."
                value={String(formData.procedure ?? '')}
                onChange={e => {
                  handleChange('procedure', e.target.value);
                  // TODO: Implement async search for Quality Procedure
                  // fetch(`/api/resource/Quality Procedure?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Quality Procedure"
                data-fieldname="procedure"
              />
              {/* Link indicator */}
              {formData.procedure && (
                <button
                  type="button"
                  onClick={() => handleChange('procedure', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
      {/* Section: Resolution */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Resolution</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: resolutions → Quality Action Resolution */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Resolutions</label>
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
                  {(Array.isArray(formData.resolutions) ? (formData.resolutions as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.resolutions) ? formData.resolutions : [])];
                            rows.splice(idx, 1);
                            handleChange('resolutions', rows);
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
                  onClick={() => handleChange('resolutions', [...(Array.isArray(formData.resolutions) ? formData.resolutions : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
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