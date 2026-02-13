// Form scaffold for Maintenance Team Member
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { MaintenanceTeamMember } from '../types/maintenance-team-member.js';

interface MaintenanceTeamMemberFormProps {
  initialData?: Partial<MaintenanceTeamMember>;
  onSubmit: (data: Partial<MaintenanceTeamMember>) => void;
  mode: 'create' | 'edit';
}

export function MaintenanceTeamMemberForm({ initialData = {}, onSubmit, mode }: MaintenanceTeamMemberFormProps) {
  const [formData, setFormData] = useState<Partial<MaintenanceTeamMember>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Maintenance Team Member' : 'New Maintenance Team Member'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Team Member (→ User)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search User..."
                value={String(formData.team_member ?? '')}
                onChange={e => {
                  handleChange('team_member', e.target.value);
                  // TODO: Implement async search for User
                  // fetch(`/api/resource/User?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="User"
                data-fieldname="team_member"
              />
              {/* Link indicator */}
              {formData.team_member && (
                <button
                  type="button"
                  onClick={() => handleChange('team_member', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={String(formData.full_name ?? '')}
              onChange={e => handleChange('full_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Maintenance Role (→ Role)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Role..."
                value={String(formData.maintenance_role ?? '')}
                onChange={e => {
                  handleChange('maintenance_role', e.target.value);
                  // TODO: Implement async search for Role
                  // fetch(`/api/resource/Role?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Role"
                data-fieldname="maintenance_role"
              />
              {/* Link indicator */}
              {formData.maintenance_role && (
                <button
                  type="button"
                  onClick={() => handleChange('maintenance_role', '')}
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