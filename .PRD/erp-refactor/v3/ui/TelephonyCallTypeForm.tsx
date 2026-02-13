// Form scaffold for Telephony Call Type
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { TelephonyCallType } from '../types/telephony-call-type.js';

interface TelephonyCallTypeFormProps {
  initialData?: Partial<TelephonyCallType>;
  onSubmit: (data: Partial<TelephonyCallType>) => void;
  mode: 'create' | 'edit';
}

export function TelephonyCallTypeForm({ initialData = {}, onSubmit, mode }: TelephonyCallTypeFormProps) {
  const [formData, setFormData] = useState<Partial<TelephonyCallType>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Telephony Call Type' : 'New Telephony Call Type'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Call Type</label>
            <input
              type="text"
              value={String(formData.call_type ?? '')}
              onChange={e => handleChange('call_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Telephony Call Type)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Telephony Call Type..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Telephony Call Type
                  // fetch(`/api/resource/Telephony Call Type?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Telephony Call Type"
                data-fieldname="amended_from"
              />
              {/* Link indicator */}
              {formData.amended_from && (
                <button
                  type="button"
                  onClick={() => handleChange('amended_from', '')}
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