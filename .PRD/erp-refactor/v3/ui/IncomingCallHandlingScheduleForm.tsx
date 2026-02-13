// Form scaffold for Incoming Call Handling Schedule
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { IncomingCallHandlingSchedule } from '../types/incoming-call-handling-schedule.js';

interface IncomingCallHandlingScheduleFormProps {
  initialData?: Partial<IncomingCallHandlingSchedule>;
  onSubmit: (data: Partial<IncomingCallHandlingSchedule>) => void;
  mode: 'create' | 'edit';
}

export function IncomingCallHandlingScheduleForm({ initialData = {}, onSubmit, mode }: IncomingCallHandlingScheduleFormProps) {
  const [formData, setFormData] = useState<Partial<IncomingCallHandlingSchedule>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Incoming Call Handling Schedule' : 'New Incoming Call Handling Schedule'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Day Of Week</label>
            <select
              value={String(formData.day_of_week ?? '')}
              onChange={e => handleChange('day_of_week', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">From Time</label>
            <input
              type="time"
              value={String(formData.from_time ?? '')}
              onChange={e => handleChange('from_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Time</label>
            <input
              type="time"
              value={String(formData.to_time ?? '')}
              onChange={e => handleChange('to_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Agent Group (→ Employee Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Employee Group..."
                value={String(formData.agent_group ?? '')}
                onChange={e => {
                  handleChange('agent_group', e.target.value);
                  // TODO: Implement async search for Employee Group
                  // fetch(`/api/resource/Employee Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Employee Group"
                data-fieldname="agent_group"
              />
              {/* Link indicator */}
              {formData.agent_group && (
                <button
                  type="button"
                  onClick={() => handleChange('agent_group', '')}
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