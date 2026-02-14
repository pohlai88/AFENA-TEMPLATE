// Form scaffold for Plaid Settings
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PlaidSettings } from '../types/plaid-settings.js';

interface PlaidSettingsFormProps {
  initialData?: Partial<PlaidSettings>;
  onSubmit: (data: Partial<PlaidSettings>) => void;
  mode: 'create' | 'edit';
}

export function PlaidSettingsForm({ initialData = {}, onSubmit, mode }: PlaidSettingsFormProps) {
  const [formData, setFormData] = useState<Partial<PlaidSettings>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Plaid Settings' : 'New Plaid Settings'}</h2>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enabled}
              onChange={e => handleChange('enabled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enabled</label>
          </div>
          {!!formData.enabled && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.automatic_sync}
              onChange={e => handleChange('automatic_sync', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Synchronize all accounts every hour</label>
          </div>
          )}
      {/* Section: section_break_4 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Plaid Client ID</label>
            <input
              type="text"
              value={String(formData.plaid_client_id ?? '')}
              onChange={e => handleChange('plaid_client_id', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Plaid Secret</label>
            <input
              type="text"
              value={String(formData.plaid_secret ?? '')}
              onChange={e => handleChange('plaid_secret', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Plaid Environment</label>
            <select
              value={String(formData.plaid_env ?? '')}
              onChange={e => handleChange('plaid_env', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="sandbox">sandbox</option>
              <option value="development">development</option>
              <option value="production">production</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enable_european_access}
              onChange={e => handleChange('enable_european_access', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enable European Access</label>
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