// Form scaffold for Delivery Settings
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { DeliverySettings } from '../types/delivery-settings.js';

interface DeliverySettingsFormProps {
  initialData?: Partial<DeliverySettings>;
  onSubmit: (data: Partial<DeliverySettings>) => void;
  mode: 'create' | 'edit';
}

export function DeliverySettingsForm({ initialData = {}, onSubmit, mode }: DeliverySettingsFormProps) {
  const [formData, setFormData] = useState<Partial<DeliverySettings>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Delivery Settings' : 'New Delivery Settings'}</h2>
      {/* Section: Dispatch Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Dispatch Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Dispatch Notification Template (→ Email Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Email Template..."
                value={String(formData.dispatch_template ?? '')}
                onChange={e => {
                  handleChange('dispatch_template', e.target.value);
                  // TODO: Implement async search for Email Template
                  // fetch(`/api/resource/Email Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Email Template"
                data-fieldname="dispatch_template"
              />
              {/* Link indicator */}
              {formData.dispatch_template && (
                <button
                  type="button"
                  onClick={() => handleChange('dispatch_template', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {!!formData.send_with_attachment && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Dispatch Notification Attachment (→ Print Format)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Print Format..."
                value={String(formData.dispatch_attachment ?? '')}
                onChange={e => {
                  handleChange('dispatch_attachment', e.target.value);
                  // TODO: Implement async search for Print Format
                  // fetch(`/api/resource/Print Format?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Print Format"
                data-fieldname="dispatch_attachment"
              />
              {/* Link indicator */}
              {formData.dispatch_attachment && (
                <button
                  type="button"
                  onClick={() => handleChange('dispatch_attachment', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.send_with_attachment}
              onChange={e => handleChange('send_with_attachment', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Send with Attachment</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Delay between Delivery Stops</label>
            <input
              type="number"
              step="1"
              value={formData.stop_delay != null ? Number(formData.stop_delay) : ''}
              onChange={e => handleChange('stop_delay', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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