// Form scaffold for Party Link
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PartyLink } from '../types/party-link.js';

interface PartyLinkFormProps {
  initialData?: Partial<PartyLink>;
  onSubmit: (data: Partial<PartyLink>) => void;
  mode: 'create' | 'edit';
}

export function PartyLinkForm({ initialData = {}, onSubmit, mode }: PartyLinkFormProps) {
  const [formData, setFormData] = useState<Partial<PartyLink>>(initialData);

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
        {mode === 'edit' ? formData.primary_party ?? 'Party Link' : 'New Party Link'}
      </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Primary Role (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.primary_role ?? '')}
                onChange={e => {
                  handleChange('primary_role', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="primary_role"
              />
              {/* Link indicator */}
              {formData.primary_role && (
                <button
                  type="button"
                  onClick={() => handleChange('primary_role', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {!!formData.primary_role && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Secondary Role (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.secondary_role ?? '')}
                onChange={e => {
                  handleChange('secondary_role', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="secondary_role"
              />
              {/* Link indicator */}
              {formData.secondary_role && (
                <button
                  type="button"
                  onClick={() => handleChange('secondary_role', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {!!formData.primary_role && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Primary Party</label>
            <input
              type="text"
              value={String(formData.primary_party ?? '')}
              onChange={e => handleChange('primary_party', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.secondary_role && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Secondary Party</label>
            <input
              type="text"
              value={String(formData.secondary_party ?? '')}
              onChange={e => handleChange('secondary_party', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}