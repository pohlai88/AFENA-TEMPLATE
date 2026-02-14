// Form scaffold for Communication Medium
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { CommunicationMedium } from '../types/communication-medium.js';

interface CommunicationMediumFormProps {
  initialData?: Partial<CommunicationMedium>;
  onSubmit: (data: Partial<CommunicationMedium>) => void;
  mode: 'create' | 'edit';
}

export function CommunicationMediumForm({ initialData = {}, onSubmit, mode }: CommunicationMediumFormProps) {
  const [formData, setFormData] = useState<Partial<CommunicationMedium>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Communication Medium' : 'New Communication Medium'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Communication Channel</label>
            <select
              value={String(formData.communication_channel ?? '')}
              onChange={e => handleChange('communication_channel', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>

            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Communication Medium Type</label>
            <select
              value={String(formData.communication_medium_type ?? '')}
              onChange={e => handleChange('communication_medium_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Voice">Voice</option>
              <option value="Email">Email</option>
              <option value="Chat">Chat</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Catch All (→ Employee Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Employee Group..."
                value={String(formData.catch_all ?? '')}
                onChange={e => {
                  handleChange('catch_all', e.target.value);
                  // TODO: Implement async search for Employee Group
                  // fetch(`/api/resource/Employee Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Employee Group"
                data-fieldname="catch_all"
              />
              {/* Link indicator */}
              {formData.catch_all && (
                <button
                  type="button"
                  onClick={() => handleChange('catch_all', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Provider (→ Supplier)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Supplier..."
                value={String(formData.provider ?? '')}
                onChange={e => {
                  handleChange('provider', e.target.value);
                  // TODO: Implement async search for Supplier
                  // fetch(`/api/resource/Supplier?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Supplier"
                data-fieldname="provider"
              />
              {/* Link indicator */}
              {formData.provider && (
                <button
                  type="button"
                  onClick={() => handleChange('provider', '')}
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
      {/* Section: Timeslots */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Timeslots</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: timeslots → Communication Medium Timeslot */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Timeslots</label>
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
                  {(Array.isArray(formData.timeslots) ? (formData.timeslots as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.timeslots) ? formData.timeslots : [])];
                            rows.splice(idx, 1);
                            handleChange('timeslots', rows);
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
                  onClick={() => handleChange('timeslots', [...(Array.isArray(formData.timeslots) ? formData.timeslots : []), {}])}
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