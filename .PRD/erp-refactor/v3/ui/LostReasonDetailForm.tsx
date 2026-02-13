// Form scaffold for Lost Reason Detail
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { LostReasonDetail } from '../types/lost-reason-detail.js';

interface LostReasonDetailFormProps {
  initialData?: Partial<LostReasonDetail>;
  onSubmit: (data: Partial<LostReasonDetail>) => void;
  mode: 'create' | 'edit';
}

export function LostReasonDetailForm({ initialData = {}, onSubmit, mode }: LostReasonDetailFormProps) {
  const [formData, setFormData] = useState<Partial<LostReasonDetail>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Lost Reason Detail' : 'New Lost Reason Detail'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Opportunity Lost Reason (→ Opportunity Lost Reason)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Opportunity Lost Reason..."
                value={String(formData.lost_reason ?? '')}
                onChange={e => {
                  handleChange('lost_reason', e.target.value);
                  // TODO: Implement async search for Opportunity Lost Reason
                  // fetch(`/api/resource/Opportunity Lost Reason?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Opportunity Lost Reason"
                data-fieldname="lost_reason"
              />
              {/* Link indicator */}
              {formData.lost_reason && (
                <button
                  type="button"
                  onClick={() => handleChange('lost_reason', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
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