// Form scaffold for Activity Type
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ActivityType } from '../types/activity-type.js';

interface ActivityTypeFormProps {
  initialData?: Partial<ActivityType>;
  onSubmit: (data: Partial<ActivityType>) => void;
  mode: 'create' | 'edit';
}

export function ActivityTypeForm({ initialData = {}, onSubmit, mode }: ActivityTypeFormProps) {
  const [formData, setFormData] = useState<Partial<ActivityType>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Activity Type' : 'New Activity Type'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Activity Type</label>
            <input
              type="text"
              value={String(formData.activity_type ?? '')}
              onChange={e => handleChange('activity_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Costing Rate</label>
            <input
              type="number"
              step="any"
              value={formData.costing_rate != null ? Number(formData.costing_rate) : ''}
              onChange={e => handleChange('costing_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Billing Rate</label>
            <input
              type="number"
              step="any"
              value={formData.billing_rate != null ? Number(formData.billing_rate) : ''}
              onChange={e => handleChange('billing_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}