// Form scaffold for Website Attribute
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { WebsiteAttribute } from '../types/website-attribute.js';

interface WebsiteAttributeFormProps {
  initialData?: Partial<WebsiteAttribute>;
  onSubmit: (data: Partial<WebsiteAttribute>) => void;
  mode: 'create' | 'edit';
}

export function WebsiteAttributeForm({ initialData = {}, onSubmit, mode }: WebsiteAttributeFormProps) {
  const [formData, setFormData] = useState<Partial<WebsiteAttribute>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Website Attribute' : 'New Website Attribute'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Attribute (→ Item Attribute)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Item Attribute..."
                value={String(formData.attribute ?? '')}
                onChange={e => {
                  handleChange('attribute', e.target.value);
                  // TODO: Implement async search for Item Attribute
                  // fetch(`/api/resource/Item Attribute?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Item Attribute"
                data-fieldname="attribute"
              />
              {/* Link indicator */}
              {formData.attribute && (
                <button
                  type="button"
                  onClick={() => handleChange('attribute', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
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