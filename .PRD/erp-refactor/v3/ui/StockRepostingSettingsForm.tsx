// Form scaffold for Stock Reposting Settings
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { StockRepostingSettings } from '../types/stock-reposting-settings.js';

interface StockRepostingSettingsFormProps {
  initialData?: Partial<StockRepostingSettings>;
  onSubmit: (data: Partial<StockRepostingSettings>) => void;
  mode: 'create' | 'edit';
}

export function StockRepostingSettingsForm({ initialData = {}, onSubmit, mode }: StockRepostingSettingsFormProps) {
  const [formData, setFormData] = useState<Partial<StockRepostingSettings>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Stock Reposting Settings' : 'New Stock Reposting Settings'}</h2>
      {/* Section: Scheduling */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Scheduling</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.limit_reposting_timeslot}
              onChange={e => handleChange('limit_reposting_timeslot', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Limit timeslot for Stock Reposting</label>
          </div>
          {!!formData.limit_reposting_timeslot && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              value={String(formData.start_time ?? '')}
              onChange={e => handleChange('start_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.limit_reposting_timeslot && (
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              value={String(formData.end_time ?? '')}
              onChange={e => handleChange('end_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.limit_reposting_timeslot && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Limits don't apply on</label>
            <select
              value={String(formData.limits_dont_apply_on ?? '')}
              onChange={e => handleChange('limits_dont_apply_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.item_based_reposting}
              onChange={e => handleChange('item_based_reposting', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Use Item based reposting</label>
          </div>
          {!!formData.item_based_reposting && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enable_parallel_reposting}
              onChange={e => handleChange('enable_parallel_reposting', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enable Parallel Reposting</label>
          </div>
          )}
          {formData.item_based_reposting ==== 1 && formData.enable_parallel_reposting ==== 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">No of Parallel Reposting (Per Item)</label>
            <input
              type="number"
              step="1"
              value={formData.no_of_parallel_reposting != null ? Number(formData.no_of_parallel_reposting) : ''}
              onChange={e => handleChange('no_of_parallel_reposting', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Errors Notification */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Errors Notification</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Notify Reposting Error to Role (→ Role)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Role..."
                value={String(formData.notify_reposting_error_to_role ?? '')}
                onChange={e => {
                  handleChange('notify_reposting_error_to_role', e.target.value);
                  // TODO: Implement async search for Role
                  // fetch(`/api/resource/Role?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Role"
                data-fieldname="notify_reposting_error_to_role"
              />
              {/* Link indicator */}
              {formData.notify_reposting_error_to_role && (
                <button
                  type="button"
                  onClick={() => handleChange('notify_reposting_error_to_role', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
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