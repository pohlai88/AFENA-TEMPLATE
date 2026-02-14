// Form scaffold for Party Type
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PartyType } from '../types/party-type.js';

interface PartyTypeFormProps {
  initialData?: Partial<PartyType>;
  onSubmit: (data: Partial<PartyType>) => void;
  mode: 'create' | 'edit';
}

export function PartyTypeForm({ initialData = {}, onSubmit, mode }: PartyTypeFormProps) {
  const [formData, setFormData] = useState<Partial<PartyType>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Party Type' : 'New Party Type'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Party Type (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.party_type ?? '')}
                onChange={e => {
                  handleChange('party_type', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="party_type"
              />
              {/* Link indicator */}
              {formData.party_type && (
                <button
                  type="button"
                  onClick={() => handleChange('party_type', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Type</label>
            <select
              value={String(formData.account_type ?? '')}
              onChange={e => handleChange('account_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Payable">Payable</option>
              <option value="Receivable">Receivable</option>
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