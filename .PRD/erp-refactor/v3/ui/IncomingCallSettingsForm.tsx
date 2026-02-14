// Form scaffold for Incoming Call Settings
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { IncomingCallSettings } from '../types/incoming-call-settings.js';

interface IncomingCallSettingsFormProps {
  initialData?: Partial<IncomingCallSettings>;
  onSubmit: (data: Partial<IncomingCallSettings>) => void;
  mode: 'create' | 'edit';
}

export function IncomingCallSettingsForm({ initialData = {}, onSubmit, mode }: IncomingCallSettingsFormProps) {
  const [formData, setFormData] = useState<Partial<IncomingCallSettings>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Incoming Call Settings' : 'New Incoming Call Settings'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Call Routing</label>
            <select
              value={String(formData.call_routing ?? '')}
              onChange={e => handleChange('call_routing', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Sequential">Sequential</option>
              <option value="Simultaneous">Simultaneous</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Greeting Message</label>
            <input
              type="text"
              value={String(formData.greeting_message ?? '')}
              onChange={e => handleChange('greeting_message', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Agent Busy Message</label>
            <input
              type="text"
              value={String(formData.agent_busy_message ?? '')}
              onChange={e => handleChange('agent_busy_message', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Agent Unavailable Message</label>
            <input
              type="text"
              value={String(formData.agent_unavailable_message ?? '')}
              onChange={e => handleChange('agent_unavailable_message', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: section_break_6 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: call_handling_schedule → Incoming Call Handling Schedule */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Call Handling Schedule</label>
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
                  {(Array.isArray(formData.call_handling_schedule) ? (formData.call_handling_schedule as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.call_handling_schedule) ? formData.call_handling_schedule : [])];
                            rows.splice(idx, 1);
                            handleChange('call_handling_schedule', rows);
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
                  onClick={() => handleChange('call_handling_schedule', [...(Array.isArray(formData.call_handling_schedule) ? formData.call_handling_schedule : []), {}])}
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