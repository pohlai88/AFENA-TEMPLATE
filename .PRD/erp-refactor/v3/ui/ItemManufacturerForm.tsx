// Form scaffold for Item Manufacturer
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ItemManufacturer } from '../types/item-manufacturer.js';

interface ItemManufacturerFormProps {
  initialData?: Partial<ItemManufacturer>;
  onSubmit: (data: Partial<ItemManufacturer>) => void;
  mode: 'create' | 'edit';
}

export function ItemManufacturerForm({ initialData = {}, onSubmit, mode }: ItemManufacturerFormProps) {
  const [formData, setFormData] = useState<Partial<ItemManufacturer>>(initialData);

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
        {mode === 'edit' ? formData.item_code ?? 'Item Manufacturer' : 'New Item Manufacturer'}
      </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Code (→ Item)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Item..."
                value={String(formData.item_code ?? '')}
                onChange={e => {
                  handleChange('item_code', e.target.value);
                  // TODO: Implement async search for Item
                  // fetch(`/api/resource/Item?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Item"
                data-fieldname="item_code"
              />
              {/* Link indicator */}
              {formData.item_code && (
                <button
                  type="button"
                  onClick={() => handleChange('item_code', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Manufacturer (→ Manufacturer)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Manufacturer..."
                value={String(formData.manufacturer ?? '')}
                onChange={e => {
                  handleChange('manufacturer', e.target.value);
                  // TODO: Implement async search for Manufacturer
                  // fetch(`/api/resource/Manufacturer?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Manufacturer"
                data-fieldname="manufacturer"
              />
              {/* Link indicator */}
              {formData.manufacturer && (
                <button
                  type="button"
                  onClick={() => handleChange('manufacturer', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Manufacturer Part Number</label>
            <input
              type="text"
              value={String(formData.manufacturer_part_no ?? '')}
              onChange={e => handleChange('manufacturer_part_no', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              value={String(formData.item_name ?? '')}
              onChange={e => handleChange('item_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={String(formData.description ?? '')}
              onChange={e => handleChange('description', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_default}
              onChange={e => handleChange('is_default', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Default</label>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}