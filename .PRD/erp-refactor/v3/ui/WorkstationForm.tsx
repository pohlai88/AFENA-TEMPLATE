// Form scaffold for Workstation
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { Workstation } from '../types/workstation.js';

interface WorkstationFormProps {
  initialData?: Partial<Workstation>;
  onSubmit: (data: Partial<Workstation>) => void;
  mode: 'create' | 'edit';
}

export function WorkstationForm({ initialData = {}, onSubmit, mode }: WorkstationFormProps) {
  const [formData, setFormData] = useState<Partial<Workstation>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Workstation' : 'New Workstation'}</h2>
      {/* Tab: Job Cards */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Job Cards</h3>
      </div>
      {/* Section: section_break_mqqv */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Workstation Dashboard</label>
            <textarea
              value={String(formData.workstation_dashboard ?? '')}
              onChange={e => handleChange('workstation_dashboard', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Tab: Details */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Details</h3>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Workstation Name</label>
            <input
              type="text"
              value={String(formData.workstation_name ?? '')}
              onChange={e => handleChange('workstation_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Workstation Type (→ Workstation Type)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Workstation Type..."
                value={String(formData.workstation_type ?? '')}
                onChange={e => {
                  handleChange('workstation_type', e.target.value);
                  // TODO: Implement async search for Workstation Type
                  // fetch(`/api/resource/Workstation Type?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Workstation Type"
                data-fieldname="workstation_type"
              />
              {/* Link indicator */}
              {formData.workstation_type && (
                <button
                  type="button"
                  onClick={() => handleChange('workstation_type', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Plant Floor (→ Plant Floor)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Plant Floor..."
                value={String(formData.plant_floor ?? '')}
                onChange={e => {
                  handleChange('plant_floor', e.target.value);
                  // TODO: Implement async search for Plant Floor
                  // fetch(`/api/resource/Plant Floor?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Plant Floor"
                data-fieldname="plant_floor"
              />
              {/* Link indicator */}
              {formData.plant_floor && (
                <button
                  type="button"
                  onClick={() => handleChange('plant_floor', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.disabled}
              onChange={e => handleChange('disabled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Disabled</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Capacity</label>
            <input
              type="number"
              step="1"
              value={formData.production_capacity != null ? Number(formData.production_capacity) : ''}
              onChange={e => handleChange('production_capacity', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.warehouse ?? '')}
                onChange={e => {
                  handleChange('warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="warehouse"
              />
              {/* Link indicator */}
              {formData.warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('warehouse', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
      {/* Tab: Workstation Status */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Workstation Status</h3>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Production">Production</option>
              <option value="Off">Off</option>
              <option value="Idle">Idle</option>
              <option value="Problem">Problem</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Setup">Setup</option>
            </select>
          </div>
      {/* Section: Status Illustration */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Status Illustration</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Active Status</label>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Inactive Status</label>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>
      </div>
      {/* Tab: Operating Costs */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Operating Costs</h3>
      </div>
      {/* Section: Operating Costs (Per Hour) */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Operating Costs (Per Hour)</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: workstation_costs → Workstation Cost */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Operating Components Cost</label>
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
                  {(Array.isArray(formData.workstation_costs) ? (formData.workstation_costs as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.workstation_costs) ? formData.workstation_costs : [])];
                            rows.splice(idx, 1);
                            handleChange('workstation_costs', rows);
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
                  onClick={() => handleChange('workstation_costs', [...(Array.isArray(formData.workstation_costs) ? formData.workstation_costs : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: section_break_11 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Net Hour Rate</label>
            <input
              type="number"
              step="any"
              value={formData.hour_rate != null ? Number(formData.hour_rate) : ''}
              onChange={e => handleChange('hour_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Tab: Description */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Description</h3>
      </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={String(formData.description ?? '')}
              onChange={e => handleChange('description', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Tab: Working Hours */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Working Hours</h3>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Holiday List (→ Holiday List)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Holiday List..."
                value={String(formData.holiday_list ?? '')}
                onChange={e => {
                  handleChange('holiday_list', e.target.value);
                  // TODO: Implement async search for Holiday List
                  // fetch(`/api/resource/Holiday List?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Holiday List"
                data-fieldname="holiday_list"
              />
              {/* Link indicator */}
              {formData.holiday_list && (
                <button
                  type="button"
                  onClick={() => handleChange('holiday_list', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {/* Child table: working_hours → Workstation Working Hour */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Working Hours</label>
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
                  {(Array.isArray(formData.working_hours) ? (formData.working_hours as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.working_hours) ? formData.working_hours : [])];
                            rows.splice(idx, 1);
                            handleChange('working_hours', rows);
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
                  onClick={() => handleChange('working_hours', [...(Array.isArray(formData.working_hours) ? formData.working_hours : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Working Hours</label>
            <input
              type="number"
              step="any"
              value={formData.total_working_hours != null ? Number(formData.total_working_hours) : ''}
              onChange={e => handleChange('total_working_hours', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Tab: Connections */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Connections</h3>
      </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}