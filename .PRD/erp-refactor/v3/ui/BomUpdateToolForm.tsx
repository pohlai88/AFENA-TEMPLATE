// Form scaffold for BOM Update Tool
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { BomUpdateTool } from '../types/bom-update-tool.js';

interface BomUpdateToolFormProps {
  initialData?: Partial<BomUpdateTool>;
  onSubmit: (data: Partial<BomUpdateTool>) => void;
  mode: 'create' | 'edit';
}

export function BomUpdateToolForm({ initialData = {}, onSubmit, mode }: BomUpdateToolFormProps) {
  const [formData, setFormData] = useState<Partial<BomUpdateTool>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'BOM Update Tool' : 'New BOM Update Tool'}</h2>
      {/* Section: Replace BOM */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Replace BOM</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current BOM (→ BOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search BOM..."
                value={String(formData.current_bom ?? '')}
                onChange={e => {
                  handleChange('current_bom', e.target.value);
                  // TODO: Implement async search for BOM
                  // fetch(`/api/resource/BOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="BOM"
                data-fieldname="current_bom"
              />
              {/* Link indicator */}
              {formData.current_bom && (
                <button
                  type="button"
                  onClick={() => handleChange('current_bom', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New BOM (→ BOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search BOM..."
                value={String(formData.new_bom ?? '')}
                onChange={e => {
                  handleChange('new_bom', e.target.value);
                  // TODO: Implement async search for BOM
                  // fetch(`/api/resource/BOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="BOM"
                data-fieldname="new_bom"
              />
              {/* Link indicator */}
              {formData.new_bom && (
                <button
                  type="button"
                  onClick={() => handleChange('new_bom', '')}
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
      {/* Section: Update Cost */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Update Cost</h4>
        <div className="grid grid-cols-2 gap-4">
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