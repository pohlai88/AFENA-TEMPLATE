// Form scaffold for Dunning Letter Text
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { DunningLetterText } from '../types/dunning-letter-text.js';

interface DunningLetterTextFormProps {
  initialData?: Partial<DunningLetterText>;
  onSubmit: (data: Partial<DunningLetterText>) => void;
  mode: 'create' | 'edit';
}

export function DunningLetterTextForm({ initialData = {}, onSubmit, mode }: DunningLetterTextFormProps) {
  const [formData, setFormData] = useState<Partial<DunningLetterText>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Dunning Letter Text' : 'New Dunning Letter Text'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Language (→ Language)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Language..."
                value={String(formData.language ?? '')}
                onChange={e => {
                  handleChange('language', e.target.value);
                  // TODO: Implement async search for Language
                  // fetch(`/api/resource/Language?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Language"
                data-fieldname="language"
              />
              {/* Link indicator */}
              {formData.language && (
                <button
                  type="button"
                  onClick={() => handleChange('language', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_default_language}
              onChange={e => handleChange('is_default_language', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Default Language</label>
          </div>
      {/* Section: section_break_4 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Body Text</label>
            <textarea
              value={String(formData.body_text ?? '')}
              onChange={e => handleChange('body_text', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Closing Text</label>
            <textarea
              value={String(formData.closing_text ?? '')}
              onChange={e => handleChange('closing_text', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: section_break_7 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Body and Closing Text Help</label>
            <textarea
              value={String(formData.body_and_closing_text_help ?? '')}
              onChange={e => handleChange('body_and_closing_text_help', e.target.value)}
              rows={4}
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