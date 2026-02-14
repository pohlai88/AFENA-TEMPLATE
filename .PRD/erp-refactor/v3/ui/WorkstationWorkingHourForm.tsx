// Form scaffold for Workstation Working Hour
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { WorkstationWorkingHour } from '../types/workstation-working-hour.js';

interface WorkstationWorkingHourFormProps {
  initialData?: Partial<WorkstationWorkingHour>;
  onSubmit: (data: Partial<WorkstationWorkingHour>) => void;
  mode: 'create' | 'edit';
}

export function WorkstationWorkingHourForm({ initialData = {}, onSubmit, mode }: WorkstationWorkingHourFormProps) {
  const [formData, setFormData] = useState<Partial<WorkstationWorkingHour>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Workstation Working Hour' : 'New Workstation Working Hour'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              value={String(formData.start_time ?? '')}
              onChange={e => handleChange('start_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hours</label>
            <input
              type="number"
              step="any"
              value={formData.hours != null ? Number(formData.hours) : ''}
              onChange={e => handleChange('hours', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              value={String(formData.end_time ?? '')}
              onChange={e => handleChange('end_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enabled}
              onChange={e => handleChange('enabled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enabled</label>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}