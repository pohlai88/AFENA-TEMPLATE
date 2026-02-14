// Form scaffold for BOM Website Operation
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { BomWebsiteOperation } from '../types/bom-website-operation.js';

interface BomWebsiteOperationFormProps {
  initialData?: Partial<BomWebsiteOperation>;
  onSubmit: (data: Partial<BomWebsiteOperation>) => void;
  mode: 'create' | 'edit';
}

export function BomWebsiteOperationForm({ initialData = {}, onSubmit, mode }: BomWebsiteOperationFormProps) {
  const [formData, setFormData] = useState<Partial<BomWebsiteOperation>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'BOM Website Operation' : 'New BOM Website Operation'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Operation (→ Operation)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Operation..."
                value={String(formData.operation ?? '')}
                onChange={e => {
                  handleChange('operation', e.target.value);
                  // TODO: Implement async search for Operation
                  // fetch(`/api/resource/Operation?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Operation"
                data-fieldname="operation"
              />
              {/* Link indicator */}
              {formData.operation && (
                <button
                  type="button"
                  onClick={() => handleChange('operation', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Workstation (→ Workstation)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Workstation..."
                value={String(formData.workstation ?? '')}
                onChange={e => {
                  handleChange('workstation', e.target.value);
                  // TODO: Implement async search for Workstation
                  // fetch(`/api/resource/Workstation?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Workstation"
                data-fieldname="workstation"
              />
              {/* Link indicator */}
              {formData.workstation && (
                <button
                  type="button"
                  onClick={() => handleChange('workstation', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Operation Time</label>
            <input
              type="number"
              step="any"
              value={formData.time_in_mins != null ? Number(formData.time_in_mins) : ''}
              onChange={e => handleChange('time_in_mins', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
            <input
              type="text"
              value={String(formData.thumbnail ?? '')}
              onChange={e => handleChange('thumbnail', e.target.value)}
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