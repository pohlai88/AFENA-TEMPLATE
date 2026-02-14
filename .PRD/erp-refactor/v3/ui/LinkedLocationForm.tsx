// Form scaffold for Linked Location
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { LinkedLocation } from '../types/linked-location.js';

interface LinkedLocationFormProps {
  initialData?: Partial<LinkedLocation>;
  onSubmit: (data: Partial<LinkedLocation>) => void;
  mode: 'create' | 'edit';
}

export function LinkedLocationForm({ initialData = {}, onSubmit, mode }: LinkedLocationFormProps) {
  const [formData, setFormData] = useState<Partial<LinkedLocation>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Linked Location' : 'New Linked Location'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location (→ Location)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Location..."
                value={String(formData.location ?? '')}
                onChange={e => {
                  handleChange('location', e.target.value);
                  // TODO: Implement async search for Location
                  // fetch(`/api/resource/Location?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Location"
                data-fieldname="location"
              />
              {/* Link indicator */}
              {formData.location && (
                <button
                  type="button"
                  onClick={() => handleChange('location', '')}
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