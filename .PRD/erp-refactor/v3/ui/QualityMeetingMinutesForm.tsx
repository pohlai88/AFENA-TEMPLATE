// Form scaffold for Quality Meeting Minutes
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { QualityMeetingMinutes } from '../types/quality-meeting-minutes.js';

interface QualityMeetingMinutesFormProps {
  initialData?: Partial<QualityMeetingMinutes>;
  onSubmit: (data: Partial<QualityMeetingMinutes>) => void;
  mode: 'create' | 'edit';
}

export function QualityMeetingMinutesForm({ initialData = {}, onSubmit, mode }: QualityMeetingMinutesFormProps) {
  const [formData, setFormData] = useState<Partial<QualityMeetingMinutes>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Quality Meeting Minutes' : 'New Quality Meeting Minutes'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Document Type</label>
            <select
              value={String(formData.document_type ?? '')}
              onChange={e => handleChange('document_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Quality Review">Quality Review</option>
              <option value="Quality Action">Quality Action</option>
              <option value="Quality Feedback">Quality Feedback</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Document Name</label>
            <input
              type="text"
              value={String(formData.document_name ?? '')}
              onChange={e => handleChange('document_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: sb_00 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Minute</label>
            <textarea
              value={String(formData.minute ?? '')}
              onChange={e => handleChange('minute', e.target.value)}
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