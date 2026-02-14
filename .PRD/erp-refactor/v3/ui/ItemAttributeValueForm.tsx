// Form scaffold for Item Attribute Value
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ItemAttributeValue } from '../types/item-attribute-value.js';

interface ItemAttributeValueFormProps {
  initialData?: Partial<ItemAttributeValue>;
  onSubmit: (data: Partial<ItemAttributeValue>) => void;
  mode: 'create' | 'edit';
}

export function ItemAttributeValueForm({ initialData = {}, onSubmit, mode }: ItemAttributeValueFormProps) {
  const [formData, setFormData] = useState<Partial<ItemAttributeValue>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Item Attribute Value' : 'New Item Attribute Value'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Attribute Value</label>
            <input
              type="text"
              value={String(formData.attribute_value ?? '')}
              onChange={e => handleChange('attribute_value', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Abbreviation</label>
            <input
              type="text"
              value={String(formData.abbr ?? '')}
              onChange={e => handleChange('abbr', e.target.value)}
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