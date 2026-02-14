// Form scaffold for Job Card Scheduled Time
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { JobCardScheduledTime } from '../types/job-card-scheduled-time.js';

interface JobCardScheduledTimeFormProps {
  initialData?: Partial<JobCardScheduledTime>;
  onSubmit: (data: Partial<JobCardScheduledTime>) => void;
  mode: 'create' | 'edit';
}

export function JobCardScheduledTimeForm({ initialData = {}, onSubmit, mode }: JobCardScheduledTimeFormProps) {
  const [formData, setFormData] = useState<Partial<JobCardScheduledTime>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Job Card Scheduled Time' : 'New Job Card Scheduled Time'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">From Time</label>
            <input
              type="datetime-local"
              value={String(formData.from_time ?? '')}
              onChange={e => handleChange('from_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Time</label>
            <input
              type="datetime-local"
              value={String(formData.to_time ?? '')}
              onChange={e => handleChange('to_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time (In Mins)</label>
            <input
              type="number"
              step="any"
              value={formData.time_in_mins != null ? Number(formData.time_in_mins) : ''}
              onChange={e => handleChange('time_in_mins', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}