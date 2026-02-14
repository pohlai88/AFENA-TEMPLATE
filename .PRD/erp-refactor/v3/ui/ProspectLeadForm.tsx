// Form scaffold for Prospect Lead
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ProspectLead } from '../types/prospect-lead.js';

interface ProspectLeadFormProps {
  initialData?: Partial<ProspectLead>;
  onSubmit: (data: Partial<ProspectLead>) => void;
  mode: 'create' | 'edit';
}

export function ProspectLeadForm({ initialData = {}, onSubmit, mode }: ProspectLeadFormProps) {
  const [formData, setFormData] = useState<Partial<ProspectLead>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Prospect Lead' : 'New Prospect Lead'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lead (→ Lead)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Lead..."
                value={String(formData.lead ?? '')}
                onChange={e => {
                  handleChange('lead', e.target.value);
                  // TODO: Implement async search for Lead
                  // fetch(`/api/resource/Lead?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Lead"
                data-fieldname="lead"
              />
              {/* Link indicator */}
              {formData.lead && (
                <button
                  type="button"
                  onClick={() => handleChange('lead', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lead Name</label>
            <input
              type="text"
              value={String(formData.lead_name ?? '')}
              onChange={e => handleChange('lead_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="text"
              value={String(formData.email ?? '')}
              onChange={e => handleChange('email', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile No</label>
            <input
              type="text"
              value={String(formData.mobile_no ?? '')}
              onChange={e => handleChange('mobile_no', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lead Owner</label>
            <input
              type="text"
              value={String(formData.lead_owner ?? '')}
              onChange={e => handleChange('lead_owner', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <input
              type="text"
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
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