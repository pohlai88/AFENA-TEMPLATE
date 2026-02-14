// Form scaffold for Support Settings
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SupportSettings } from '../types/support-settings.js';

interface SupportSettingsFormProps {
  initialData?: Partial<SupportSettings>;
  onSubmit: (data: Partial<SupportSettings>) => void;
  mode: 'create' | 'edit';
}

export function SupportSettingsForm({ initialData = {}, onSubmit, mode }: SupportSettingsFormProps) {
  const [formData, setFormData] = useState<Partial<SupportSettings>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Support Settings' : 'New Support Settings'}</h2>
      {/* Section: Service Level Agreements */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Service Level Agreements</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.track_service_level_agreement}
              onChange={e => handleChange('track_service_level_agreement', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Track Service Level Agreement</label>
          </div>
          {formData.track_service_level_agreement; && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_resetting_service_level_agreement}
              onChange={e => handleChange('allow_resetting_service_level_agreement', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Resetting Service Level Agreement</label>
          </div>
          )}
        </div>
      </div>
      {/* Section: Issues */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Issues</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Close Issue After Days</label>
            <input
              type="number"
              step="1"
              value={formData.close_issue_after_days != null ? Number(formData.close_issue_after_days) : ''}
              onChange={e => handleChange('close_issue_after_days', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Support Portal */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Support Portal</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Get Started Sections</label>
            <textarea
              value={String(formData.get_started_sections ?? '')}
              onChange={e => handleChange('get_started_sections', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.show_latest_forum_posts}
              onChange={e => handleChange('show_latest_forum_posts', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Show Latest Forum Posts</label>
          </div>
        </div>
      </div>
      {/* Section: Forum Posts */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Forum Posts</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Forum URL</label>
            <input
              type="text"
              value={String(formData.forum_url ?? '')}
              onChange={e => handleChange('forum_url', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Get Latest Query</label>
            <input
              type="text"
              value={String(formData.get_latest_query ?? '')}
              onChange={e => handleChange('get_latest_query', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Response Key List</label>
            <input
              type="text"
              value={String(formData.response_key_list ?? '')}
              onChange={e => handleChange('response_key_list', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Post Title Key</label>
            <input
              type="text"
              value={String(formData.post_title_key ?? '')}
              onChange={e => handleChange('post_title_key', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Post Description Key</label>
            <input
              type="text"
              value={String(formData.post_description_key ?? '')}
              onChange={e => handleChange('post_description_key', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Post Route Key</label>
            <input
              type="text"
              value={String(formData.post_route_key ?? '')}
              onChange={e => handleChange('post_route_key', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Post Route String</label>
            <input
              type="text"
              value={String(formData.post_route_string ?? '')}
              onChange={e => handleChange('post_route_string', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Greetings Section */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Greetings Section</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Greeting Title</label>
            <input
              type="text"
              value={String(formData.greeting_title ?? '')}
              onChange={e => handleChange('greeting_title', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Greeting Subtitle</label>
            <input
              type="text"
              value={String(formData.greeting_subtitle ?? '')}
              onChange={e => handleChange('greeting_subtitle', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Search APIs */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Search APIs</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: search_apis → Support Search Source */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Search APIs</label>
            <div className="mt-1 border rounded overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(Array.isArray(formData.search_apis) ? (formData.search_apis as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.search_apis) ? formData.search_apis : [])];
                            rows.splice(idx, 1);
                            handleChange('search_apis', rows);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-2 bg-gray-50 border-t">
                <button
                  type="button"
                  onClick={() => handleChange('search_apis', [...(Array.isArray(formData.search_apis) ? formData.search_apis : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
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