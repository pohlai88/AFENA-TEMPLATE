// Form scaffold for Item Variant
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ItemVariant } from '../types/item-variant.js';

interface ItemVariantFormProps {
  initialData?: Partial<ItemVariant>;
  onSubmit: (data: Partial<ItemVariant>) => void;
  mode: 'create' | 'edit';
}

export function ItemVariantForm({ initialData = {}, onSubmit, mode }: ItemVariantFormProps) {
  const [formData, setFormData] = useState<Partial<ItemVariant>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Item Variant' : 'New Item Variant'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Attribute (→ Item Attribute)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Item Attribute..."
                value={String(formData.item_attribute ?? '')}
                onChange={e => {
                  handleChange('item_attribute', e.target.value);
                  // TODO: Implement async search for Item Attribute
                  // fetch(`/api/resource/Item Attribute?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Item Attribute"
                data-fieldname="item_attribute"
              />
              {/* Link indicator */}
              {formData.item_attribute && (
                <button
                  type="button"
                  onClick={() => handleChange('item_attribute', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Attribute Value</label>
            <input
              type="text"
              value={String(formData.item_attribute_value ?? '')}
              onChange={e => handleChange('item_attribute_value', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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