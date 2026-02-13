// Form scaffold for Video Settings
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { VideoSettings } from '../types/video-settings.js';

interface VideoSettingsFormProps {
  initialData?: Partial<VideoSettings>;
  onSubmit: (data: Partial<VideoSettings>) => void;
  mode: 'create' | 'edit';
}

export function VideoSettingsForm({ initialData = {}, onSubmit, mode }: VideoSettingsFormProps) {
  const [formData, setFormData] = useState<Partial<VideoSettings>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Video Settings' : 'New Video Settings'}</h2>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enable_youtube_tracking}
              onChange={e => handleChange('enable_youtube_tracking', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enable YouTube Tracking</label>
          </div>
          {!!formData.enable_youtube_tracking && (
          <div>
            <label className="block text-sm font-medium text-gray-700">API Key</label>
            <input
              type="text"
              value={String(formData.api_key ?? '')}
              onChange={e => handleChange('api_key', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.enable_youtube_tracking && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Frequency</label>
            <select
              value={String(formData.frequency ?? '')}
              onChange={e => handleChange('frequency', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="30 mins">30 mins</option>
              <option value="1 hr">1 hr</option>
              <option value="6 hrs">6 hrs</option>
              <option value="Daily">Daily</option>
            </select>
          </div>
          )}

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}