// Form scaffold for Quality Feedback Template Parameter
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { QualityFeedbackTemplateParameter } from '../types/quality-feedback-template-parameter.js';

interface QualityFeedbackTemplateParameterFormProps {
  initialData?: Partial<QualityFeedbackTemplateParameter>;
  onSubmit: (data: Partial<QualityFeedbackTemplateParameter>) => void;
  mode: 'create' | 'edit';
}

export function QualityFeedbackTemplateParameterForm({ initialData = {}, onSubmit, mode }: QualityFeedbackTemplateParameterFormProps) {
  const [formData, setFormData] = useState<Partial<QualityFeedbackTemplateParameter>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Quality Feedback Template Parameter' : 'New Quality Feedback Template Parameter'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Parameter</label>
            <input
              type="text"
              value={String(formData.parameter ?? '')}
              onChange={e => handleChange('parameter', e.target.value)}
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