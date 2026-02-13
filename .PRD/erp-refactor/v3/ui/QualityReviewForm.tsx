// Form scaffold for Quality Review
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { QualityReview } from '../types/quality-review.js';

interface QualityReviewFormProps {
  initialData?: Partial<QualityReview>;
  onSubmit: (data: Partial<QualityReview>) => void;
  mode: 'create' | 'edit';
}

export function QualityReviewForm({ initialData = {}, onSubmit, mode }: QualityReviewFormProps) {
  const [formData, setFormData] = useState<Partial<QualityReview>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">
        {mode === 'edit' ? formData.goal ?? 'Quality Review' : 'New Quality Review'}
      </h2>
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={String(formData.date ?? '')}
              onChange={e => handleChange('date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Open">Open</option>
              <option value="Passed">Passed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
      {/* Section: Review */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Review</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: reviews → Quality Review Objective */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Reviews</label>
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
                  {(Array.isArray(formData.reviews) ? (formData.reviews as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.reviews) ? formData.reviews : [])];
                            rows.splice(idx, 1);
                            handleChange('reviews', rows);
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
                  onClick={() => handleChange('reviews', [...(Array.isArray(formData.reviews) ? formData.reviews : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Notes */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Notes</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Additional Information</label>
            <textarea
              value={String(formData.additional_information ?? '')}
              onChange={e => handleChange('additional_information', e.target.value)}
              rows={4}
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