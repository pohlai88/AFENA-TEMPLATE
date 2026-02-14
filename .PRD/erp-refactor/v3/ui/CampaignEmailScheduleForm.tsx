// Form scaffold for Campaign Email Schedule
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { CampaignEmailSchedule } from '../types/campaign-email-schedule.js';

interface CampaignEmailScheduleFormProps {
  initialData?: Partial<CampaignEmailSchedule>;
  onSubmit: (data: Partial<CampaignEmailSchedule>) => void;
  mode: 'create' | 'edit';
}

export function CampaignEmailScheduleForm({ initialData = {}, onSubmit, mode }: CampaignEmailScheduleFormProps) {
  const [formData, setFormData] = useState<Partial<CampaignEmailSchedule>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Campaign Email Schedule' : 'New Campaign Email Schedule'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Template (→ Email Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Email Template..."
                value={String(formData.email_template ?? '')}
                onChange={e => {
                  handleChange('email_template', e.target.value);
                  // TODO: Implement async search for Email Template
                  // fetch(`/api/resource/Email Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Email Template"
                data-fieldname="email_template"
              />
              {/* Link indicator */}
              {formData.email_template && (
                <button
                  type="button"
                  onClick={() => handleChange('email_template', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Send After (days)</label>
            <input
              type="number"
              step="1"
              value={formData.send_after_days != null ? Number(formData.send_after_days) : ''}
              onChange={e => handleChange('send_after_days', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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