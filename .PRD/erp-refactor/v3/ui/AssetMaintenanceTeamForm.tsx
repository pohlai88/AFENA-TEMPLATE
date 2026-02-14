// Form scaffold for Asset Maintenance Team
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { AssetMaintenanceTeam } from '../types/asset-maintenance-team.js';

interface AssetMaintenanceTeamFormProps {
  initialData?: Partial<AssetMaintenanceTeam>;
  onSubmit: (data: Partial<AssetMaintenanceTeam>) => void;
  mode: 'create' | 'edit';
}

export function AssetMaintenanceTeamForm({ initialData = {}, onSubmit, mode }: AssetMaintenanceTeamFormProps) {
  const [formData, setFormData] = useState<Partial<AssetMaintenanceTeam>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Asset Maintenance Team' : 'New Asset Maintenance Team'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Maintenance Team Name</label>
            <input
              type="text"
              value={String(formData.maintenance_team_name ?? '')}
              onChange={e => handleChange('maintenance_team_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Maintenance Manager (→ User)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search User..."
                value={String(formData.maintenance_manager ?? '')}
                onChange={e => {
                  handleChange('maintenance_manager', e.target.value);
                  // TODO: Implement async search for User
                  // fetch(`/api/resource/User?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="User"
                data-fieldname="maintenance_manager"
              />
              {/* Link indicator */}
              {formData.maintenance_manager && (
                <button
                  type="button"
                  onClick={() => handleChange('maintenance_manager', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Maintenance Manager Name</label>
            <input
              type="text"
              value={String(formData.maintenance_manager_name ?? '')}
              onChange={e => handleChange('maintenance_manager_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company (→ Company)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Company..."
                value={String(formData.company ?? '')}
                onChange={e => {
                  handleChange('company', e.target.value);
                  // TODO: Implement async search for Company
                  // fetch(`/api/resource/Company?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Company"
                data-fieldname="company"
              />
              {/* Link indicator */}
              {formData.company && (
                <button
                  type="button"
                  onClick={() => handleChange('company', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
      {/* Section: Team */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Team</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: maintenance_team_members → Maintenance Team Member */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Maintenance Team Members</label>
            <div className="mt-1 border rounded overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(Array.isArray(formData.maintenance_team_members) ? (formData.maintenance_team_members as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.maintenance_team_members) ? formData.maintenance_team_members : [])];
                            rows.splice(idx, 1);
                            handleChange('maintenance_team_members', rows);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-2 bg-gray-50 border-t">
                <button
                  type="button"
                  onClick={() => handleChange('maintenance_team_members', [...(Array.isArray(formData.maintenance_team_members) ? formData.maintenance_team_members : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
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