// Form scaffold for CRM Note
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { CrmNote } from '../types/crm-note.js';

interface CrmNoteFormProps {
  initialData?: Partial<CrmNote>;
  onSubmit: (data: Partial<CrmNote>) => void;
  mode: 'create' | 'edit';
}

export function CrmNoteForm({ initialData = {}, onSubmit, mode }: CrmNoteFormProps) {
  const [formData, setFormData] = useState<Partial<CrmNote>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'CRM Note' : 'New CRM Note'}</h2>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Note</label>
            <textarea
              value={String(formData.note ?? '')}
              onChange={e => handleChange('note', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Added By (→ User)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search User..."
                value={String(formData.added_by ?? '')}
                onChange={e => {
                  handleChange('added_by', e.target.value);
                  // TODO: Implement async search for User
                  // fetch(`/api/resource/User?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="User"
                data-fieldname="added_by"
              />
              {/* Link indicator */}
              {formData.added_by && (
                <button
                  type="button"
                  onClick={() => handleChange('added_by', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Added On</label>
            <input
              type="datetime-local"
              value={String(formData.added_on ?? '')}
              onChange={e => handleChange('added_on', e.target.value)}
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