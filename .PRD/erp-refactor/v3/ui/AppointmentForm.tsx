// Form scaffold for Appointment
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { Appointment } from '../types/appointment.js';

interface AppointmentFormProps {
  initialData?: Partial<Appointment>;
  onSubmit: (data: Partial<Appointment>) => void;
  mode: 'create' | 'edit';
}

export function AppointmentForm({ initialData = {}, onSubmit, mode }: AppointmentFormProps) {
  const [formData, setFormData] = useState<Partial<Appointment>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Appointment' : 'New Appointment'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Scheduled Time</label>
            <input
              type="datetime-local"
              value={String(formData.scheduled_time ?? '')}
              onChange={e => handleChange('scheduled_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Open">Open</option>
              <option value="Unverified">Unverified</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
      {/* Section: Customer Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Customer Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={String(formData.customer_name ?? '')}
              onChange={e => handleChange('customer_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              value={String(formData.customer_phone_number ?? '')}
              onChange={e => handleChange('customer_phone_number', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Skype ID</label>
            <input
              type="text"
              value={String(formData.customer_skype ?? '')}
              onChange={e => handleChange('customer_skype', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="text"
              value={String(formData.customer_email ?? '')}
              onChange={e => handleChange('customer_email', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Details</label>
            <textarea
              value={String(formData.customer_details ?? '')}
              onChange={e => handleChange('customer_details', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Linked Documents */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Linked Documents</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Appointment With (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.appointment_with ?? '')}
                onChange={e => {
                  handleChange('appointment_with', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="appointment_with"
              />
              {/* Link indicator */}
              {formData.appointment_with && (
                <button
                  type="button"
                  onClick={() => handleChange('appointment_with', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Party</label>
            <input
              type="text"
              value={String(formData.party ?? '')}
              onChange={e => handleChange('party', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Calendar Event (→ Event)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Event..."
                value={String(formData.calendar_event ?? '')}
                onChange={e => {
                  handleChange('calendar_event', e.target.value);
                  // TODO: Implement async search for Event
                  // fetch(`/api/resource/Event?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Event"
                data-fieldname="calendar_event"
              />
              {/* Link indicator */}
              {formData.calendar_event && (
                <button
                  type="button"
                  onClick={() => handleChange('calendar_event', '')}
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

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}