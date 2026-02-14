// Form scaffold for Subscription Settings
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SubscriptionSettings } from '../types/subscription-settings.js';

interface SubscriptionSettingsFormProps {
  initialData?: Partial<SubscriptionSettings>;
  onSubmit: (data: Partial<SubscriptionSettings>) => void;
  mode: 'create' | 'edit';
}

export function SubscriptionSettingsForm({ initialData = {}, onSubmit, mode }: SubscriptionSettingsFormProps) {
  const [formData, setFormData] = useState<Partial<SubscriptionSettings>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Subscription Settings' : 'New Subscription Settings'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Grace Period</label>
            <input
              type="number"
              step="1"
              value={formData.grace_period != null ? Number(formData.grace_period) : ''}
              onChange={e => handleChange('grace_period', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.cancel_after_grace}
              onChange={e => handleChange('cancel_after_grace', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Cancel Subscription After Grace Period</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.prorate}
              onChange={e => handleChange('prorate', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Prorate</label>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}