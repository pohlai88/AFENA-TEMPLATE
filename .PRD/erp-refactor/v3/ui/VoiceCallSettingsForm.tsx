// Form scaffold for Voice Call Settings
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { VoiceCallSettings } from '../types/voice-call-settings.js';

interface VoiceCallSettingsFormProps {
  initialData?: Partial<VoiceCallSettings>;
  onSubmit: (data: Partial<VoiceCallSettings>) => void;
  mode: 'create' | 'edit';
}

export function VoiceCallSettingsForm({ initialData = {}, onSubmit, mode }: VoiceCallSettingsFormProps) {
  const [formData, setFormData] = useState<Partial<VoiceCallSettings>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Voice Call Settings' : 'New Voice Call Settings'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">User (→ User)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search User..."
                value={String(formData.user ?? '')}
                onChange={e => {
                  handleChange('user', e.target.value);
                  // TODO: Implement async search for User
                  // fetch(`/api/resource/User?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="User"
                data-fieldname="user"
              />
              {/* Link indicator */}
              {formData.user && (
                <button
                  type="button"
                  onClick={() => handleChange('user', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Call Receiving Device</label>
            <select
              value={String(formData.call_receiving_device ?? '')}
              onChange={e => handleChange('call_receiving_device', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Computer">Computer</option>
              <option value="Phone">Phone</option>
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

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}