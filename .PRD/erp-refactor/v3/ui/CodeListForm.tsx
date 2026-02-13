// Form scaffold for Code List
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { CodeList } from '../types/code-list.js';

interface CodeListFormProps {
  initialData?: Partial<CodeList>;
  onSubmit: (data: Partial<CodeList>) => void;
  mode: 'create' | 'edit';
}

export function CodeListForm({ initialData = {}, onSubmit, mode }: CodeListFormProps) {
  const [formData, setFormData] = useState<Partial<CodeList>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">
        {mode === 'edit' ? formData.title ?? 'Code List' : 'New Code List'}
      </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={String(formData.title ?? '')}
              onChange={e => handleChange('title', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Canonical URI</label>
            <input
              type="text"
              value={String(formData.canonical_uri ?? '')}
              onChange={e => handleChange('canonical_uri', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="text"
              value={String(formData.url ?? '')}
              onChange={e => handleChange('url', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Common Code (→ Common Code)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Common Code..."
                value={String(formData.default_common_code ?? '')}
                onChange={e => {
                  handleChange('default_common_code', e.target.value);
                  // TODO: Implement async search for Common Code
                  // fetch(`/api/resource/Common Code?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Common Code"
                data-fieldname="default_common_code"
              />
              {/* Link indicator */}
              {formData.default_common_code && (
                <button
                  type="button"
                  onClick={() => handleChange('default_common_code', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Version</label>
            <input
              type="text"
              value={String(formData.version ?? '')}
              onChange={e => handleChange('version', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Publisher</label>
            <input
              type="text"
              value={String(formData.publisher ?? '')}
              onChange={e => handleChange('publisher', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Publisher ID</label>
            <input
              type="text"
              value={String(formData.publisher_id ?? '')}
              onChange={e => handleChange('publisher_id', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: section_break_npxp */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={String(formData.description ?? '')}
              onChange={e => handleChange('description', e.target.value)}
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