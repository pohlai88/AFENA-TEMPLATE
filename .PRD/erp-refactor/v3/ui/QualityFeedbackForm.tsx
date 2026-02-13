// Form scaffold for Quality Feedback
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { QualityFeedback } from '../types/quality-feedback.js';

interface QualityFeedbackFormProps {
  initialData?: Partial<QualityFeedback>;
  onSubmit: (data: Partial<QualityFeedback>) => void;
  mode: 'create' | 'edit';
}

export function QualityFeedbackForm({ initialData = {}, onSubmit, mode }: QualityFeedbackFormProps) {
  const [formData, setFormData] = useState<Partial<QualityFeedback>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Quality Feedback' : 'New Quality Feedback'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Template (→ Quality Feedback Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Quality Feedback Template..."
                value={String(formData.template ?? '')}
                onChange={e => {
                  handleChange('template', e.target.value);
                  // TODO: Implement async search for Quality Feedback Template
                  // fetch(`/api/resource/Quality Feedback Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Quality Feedback Template"
                data-fieldname="template"
              />
              {/* Link indicator */}
              {formData.template && (
                <button
                  type="button"
                  onClick={() => handleChange('template', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={String(formData.document_type ?? '')}
              onChange={e => handleChange('document_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="User">User</option>
              <option value="Customer">Customer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Feedback By</label>
            <input
              type="text"
              value={String(formData.document_name ?? '')}
              onChange={e => handleChange('document_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
      {/* Section: sb_00 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: parameters → Quality Feedback Parameter */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Parameters</label>
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
                  {(Array.isArray(formData.parameters) ? (formData.parameters as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.parameters) ? formData.parameters : [])];
                            rows.splice(idx, 1);
                            handleChange('parameters', rows);
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
                  onClick={() => handleChange('parameters', [...(Array.isArray(formData.parameters) ? formData.parameters : []), {}])}
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