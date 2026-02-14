// Form scaffold for Email Campaign
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { EmailCampaign } from '../types/email-campaign.js';

interface EmailCampaignFormProps {
  initialData?: Partial<EmailCampaign>;
  onSubmit: (data: Partial<EmailCampaign>) => void;
  mode: 'create' | 'edit';
}

export function EmailCampaignForm({ initialData = {}, onSubmit, mode }: EmailCampaignFormProps) {
  const [formData, setFormData] = useState<Partial<EmailCampaign>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Email Campaign' : 'New Email Campaign'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Campaign (→ Campaign)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Campaign..."
                value={String(formData.campaign_name ?? '')}
                onChange={e => {
                  handleChange('campaign_name', e.target.value);
                  // TODO: Implement async search for Campaign
                  // fetch(`/api/resource/Campaign?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Campaign"
                data-fieldname="campaign_name"
              />
              {/* Link indicator */}
              {formData.campaign_name && (
                <button
                  type="button"
                  onClick={() => handleChange('campaign_name', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Campaign For </label>
            <select
              value={String(formData.email_campaign_for ?? '')}
              onChange={e => handleChange('email_campaign_for', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Lead">Lead</option>
              <option value="Contact">Contact</option>
              <option value="Email Group">Email Group</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Recipient</label>
            <input
              type="text"
              value={String(formData.recipient ?? '')}
              onChange={e => handleChange('recipient', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sender (→ User)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search User..."
                value={String(formData.sender ?? '')}
                onChange={e => {
                  handleChange('sender', e.target.value);
                  // TODO: Implement async search for User
                  // fetch(`/api/resource/User?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="User"
                data-fieldname="sender"
              />
              {/* Link indicator */}
              {formData.sender && (
                <button
                  type="button"
                  onClick={() => handleChange('sender', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={String(formData.start_date ?? '')}
              onChange={e => handleChange('start_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={String(formData.end_date ?? '')}
              onChange={e => handleChange('end_date', e.target.value)}
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
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Unsubscribed">Unsubscribed</option>
            </select>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}