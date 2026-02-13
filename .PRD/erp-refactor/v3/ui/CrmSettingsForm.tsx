// Form scaffold for CRM Settings
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { CrmSettings } from '../types/crm-settings.js';

interface CrmSettingsFormProps {
  initialData?: Partial<CrmSettings>;
  onSubmit: (data: Partial<CrmSettings>) => void;
  mode: 'create' | 'edit';
}

export function CrmSettingsForm({ initialData = {}, onSubmit, mode }: CrmSettingsFormProps) {
  const [formData, setFormData] = useState<Partial<CrmSettings>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'CRM Settings' : 'New CRM Settings'}</h2>
      {/* Section: Lead */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Lead</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Campaign Naming By</label>
            <select
              value={String(formData.campaign_naming_by ?? '')}
              onChange={e => handleChange('campaign_naming_by', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Campaign Name">Campaign Name</option>
              <option value="Naming Series">Naming Series</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_lead_duplication_based_on_emails}
              onChange={e => handleChange('allow_lead_duplication_based_on_emails', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Lead Duplication based on Emails</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.auto_creation_of_contact}
              onChange={e => handleChange('auto_creation_of_contact', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Auto Creation of Contact</label>
          </div>
        </div>
      </div>
      {/* Section: Opportunity */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Opportunity</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Close Replied Opportunity After Days</label>
            <input
              type="number"
              step="1"
              value={formData.close_opportunity_after_days != null ? Number(formData.close_opportunity_after_days) : ''}
              onChange={e => handleChange('close_opportunity_after_days', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Quotation */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Quotation</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Quotation Validity Days</label>
            <input
              type="text"
              value={String(formData.default_valid_till ?? '')}
              onChange={e => handleChange('default_valid_till', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Activity */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Activity</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.carry_forward_communication_and_comments}
              onChange={e => handleChange('carry_forward_communication_and_comments', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Carry Forward Communication and Comments</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.update_timestamp_on_new_communication}
              onChange={e => handleChange('update_timestamp_on_new_communication', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Update timestamp on new communication</label>
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