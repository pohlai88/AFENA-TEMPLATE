// Form scaffold for Appointment Booking Settings
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { AppointmentBookingSettings } from '../types/appointment-booking-settings.js';

interface AppointmentBookingSettingsFormProps {
  initialData?: Partial<AppointmentBookingSettings>;
  onSubmit: (data: Partial<AppointmentBookingSettings>) => void;
  mode: 'create' | 'edit';
}

export function AppointmentBookingSettingsForm({ initialData = {}, onSubmit, mode }: AppointmentBookingSettingsFormProps) {
  const [formData, setFormData] = useState<Partial<AppointmentBookingSettings>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Appointment Booking Settings' : 'New Appointment Booking Settings'}</h2>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enable_scheduling}
              onChange={e => handleChange('enable_scheduling', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enable Appointment Scheduling</label>
          </div>
      {/* Section: Agent Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Agent Details</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: availability_of_slots → Appointment Booking Slots */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Availability Of Slots</label>
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
                  {(Array.isArray(formData.availability_of_slots) ? (formData.availability_of_slots as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.availability_of_slots) ? formData.availability_of_slots : [])];
                            rows.splice(idx, 1);
                            handleChange('availability_of_slots', rows);
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
                  onClick={() => handleChange('availability_of_slots', [...(Array.isArray(formData.availability_of_slots) ? formData.availability_of_slots : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Concurrent Appointments</label>
            <input
              type="number"
              step="1"
              value={formData.number_of_agents != null ? Number(formData.number_of_agents) : ''}
              onChange={e => handleChange('number_of_agents', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          {/* Child table: agent_list → Assignment Rule User */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Agents</label>
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
                  {(Array.isArray(formData.agent_list) ? (formData.agent_list as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.agent_list) ? formData.agent_list : [])];
                            rows.splice(idx, 1);
                            handleChange('agent_list', rows);
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
                  onClick={() => handleChange('agent_list', [...(Array.isArray(formData.agent_list) ? formData.agent_list : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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
        </div>
      </div>
      {/* Section: Appointment Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Appointment Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Appointment Duration (In Minutes)</label>
            <input
              type="number"
              step="1"
              value={formData.appointment_duration != null ? Number(formData.appointment_duration) : ''}
              onChange={e => handleChange('appointment_duration', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.email_reminders}
              onChange={e => handleChange('email_reminders', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Notify Via Email</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of days appointments can be booked in advance</label>
            <input
              type="number"
              step="1"
              value={formData.advance_booking_days != null ? Number(formData.advance_booking_days) : ''}
              onChange={e => handleChange('advance_booking_days', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
        </div>
      </div>
      {/* Section: Success Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Success Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Success Redirect URL</label>
            <input
              type="text"
              value={String(formData.success_redirect_url ?? '')}
              onChange={e => handleChange('success_redirect_url', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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