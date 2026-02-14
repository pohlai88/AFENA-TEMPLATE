// Form scaffold for Quality Feedback Parameter
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { QualityFeedbackParameter } from '../types/quality-feedback-parameter.js';

interface QualityFeedbackParameterFormProps {
  initialData?: Partial<QualityFeedbackParameter>;
  onSubmit: (data: Partial<QualityFeedbackParameter>) => void;
  mode: 'create' | 'edit';
}

export function QualityFeedbackParameterForm({ initialData = {}, onSubmit, mode }: QualityFeedbackParameterFormProps) {
  const [formData, setFormData] = useState<Partial<QualityFeedbackParameter>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Quality Feedback Parameter' : 'New Quality Feedback Parameter'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Parameter</label>
            <input
              type="text"
              value={String(formData.parameter ?? '')}
              onChange={e => handleChange('parameter', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <select
              value={String(formData.rating ?? '')}
              onChange={e => handleChange('rating', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
      {/* Section: sb_00 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Feedback</label>
            <textarea
              value={String(formData.feedback ?? '')}
              onChange={e => handleChange('feedback', e.target.value)}
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