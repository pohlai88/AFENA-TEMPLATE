// Form scaffold for Item Variant Attribute
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ItemVariantAttribute } from '../types/item-variant-attribute.js';

interface ItemVariantAttributeFormProps {
  initialData?: Partial<ItemVariantAttribute>;
  onSubmit: (data: Partial<ItemVariantAttribute>) => void;
  mode: 'create' | 'edit';
}

export function ItemVariantAttributeForm({ initialData = {}, onSubmit, mode }: ItemVariantAttributeFormProps) {
  const [formData, setFormData] = useState<Partial<ItemVariantAttribute>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Item Variant Attribute' : 'New Item Variant Attribute'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Variant Of (→ Item)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Item..."
                value={String(formData.variant_of ?? '')}
                onChange={e => {
                  handleChange('variant_of', e.target.value);
                  // TODO: Implement async search for Item
                  // fetch(`/api/resource/Item?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Item"
                data-fieldname="variant_of"
              />
              {/* Link indicator */}
              {formData.variant_of && (
                <button
                  type="button"
                  onClick={() => handleChange('variant_of', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Attribute Value</label>
            <input
              type="text"
              value={String(formData.attribute_value ?? '')}
              onChange={e => handleChange('attribute_value', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.has_variants && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.numeric_values}
              onChange={e => handleChange('numeric_values', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Numeric Values</label>
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.disabled}
              onChange={e => handleChange('disabled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Disabled</label>
          </div>
      {/* Section: section_break_4 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From Range</label>
            <input
              type="number"
              step="any"
              value={formData.from_range != null ? Number(formData.from_range) : ''}
              onChange={e => handleChange('from_range', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Increment</label>
            <input
              type="number"
              step="any"
              value={formData.increment != null ? Number(formData.increment) : ''}
              onChange={e => handleChange('increment', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Range</label>
            <input
              type="number"
              step="any"
              value={formData.to_range != null ? Number(formData.to_range) : ''}
              onChange={e => handleChange('to_range', e.target.value ? parseFloat(e.target.value) : undefined)}
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