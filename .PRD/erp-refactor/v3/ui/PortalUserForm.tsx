// Form scaffold for Portal User
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PortalUser } from '../types/portal-user.js';

interface PortalUserFormProps {
  initialData?: Partial<PortalUser>;
  onSubmit: (data: Partial<PortalUser>) => void;
  mode: 'create' | 'edit';
}

export function PortalUserForm({ initialData = {}, onSubmit, mode }: PortalUserFormProps) {
  const [formData, setFormData] = useState<Partial<PortalUser>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Portal User' : 'New Portal User'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">User (→ User)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search User..."
                value={String(formData.user ?? '')}
                onChange={e => {
                  handleChange('user', e.target.value);
                  // TODO: Implement async search for User
                  // fetch(`/api/resource/User?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="User"
                data-fieldname="user"
              />
              {/* Link indicator */}
              {formData.user && (
                <button
                  type="button"
                  onClick={() => handleChange('user', '')}
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