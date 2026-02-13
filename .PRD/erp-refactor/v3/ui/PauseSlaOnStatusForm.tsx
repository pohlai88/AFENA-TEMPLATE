// Form scaffold for Pause SLA On Status
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PauseSlaOnStatus } from '../types/pause-sla-on-status.js';

interface PauseSlaOnStatusFormProps {
  initialData?: Partial<PauseSlaOnStatus>;
  onSubmit: (data: Partial<PauseSlaOnStatus>) => void;
  mode: 'create' | 'edit';
}

export function PauseSlaOnStatusForm({ initialData = {}, onSubmit, mode }: PauseSlaOnStatusFormProps) {
  const [formData, setFormData] = useState<Partial<PauseSlaOnStatus>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Pause SLA On Status' : 'New Pause SLA On Status'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>

            </select>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}