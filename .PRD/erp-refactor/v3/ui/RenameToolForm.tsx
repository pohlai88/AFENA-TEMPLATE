// Form scaffold for Rename Tool
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { RenameTool } from '../types/rename-tool.js';

interface RenameToolFormProps {
  initialData?: Partial<RenameTool>;
  onSubmit: (data: Partial<RenameTool>) => void;
  mode: 'create' | 'edit';
}

export function RenameToolForm({ initialData = {}, onSubmit, mode }: RenameToolFormProps) {
  const [formData, setFormData] = useState<Partial<RenameTool>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Rename Tool' : 'New Rename Tool'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Select DocType (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.select_doctype ?? '')}
                onChange={e => {
                  handleChange('select_doctype', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="select_doctype"
              />
              {/* Link indicator */}
              {formData.select_doctype && (
                <button
                  type="button"
                  onClick={() => handleChange('select_doctype', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">File to Rename</label>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Rename Log</label>
            <textarea
              value={String(formData.rename_log ?? '')}
              onChange={e => handleChange('rename_log', e.target.value)}
              rows={4}
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