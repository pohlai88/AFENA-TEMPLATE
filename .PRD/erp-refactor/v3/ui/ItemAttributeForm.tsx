// Form scaffold for Item Attribute
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ItemAttribute } from '../types/item-attribute.js';

interface ItemAttributeFormProps {
  initialData?: Partial<ItemAttribute>;
  onSubmit: (data: Partial<ItemAttribute>) => void;
  mode: 'create' | 'edit';
}

export function ItemAttributeForm({ initialData = {}, onSubmit, mode }: ItemAttributeFormProps) {
  const [formData, setFormData] = useState<Partial<ItemAttribute>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Item Attribute' : 'New Item Attribute'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Attribute Name</label>
            <input
              type="text"
              value={String(formData.attribute_name ?? '')}
              onChange={e => handleChange('attribute_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.numeric_values}
              onChange={e => handleChange('numeric_values', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Numeric Values</label>
          </div>
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
      {/* Section: section_break_5 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: item_attribute_values → Item Attribute Value */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Item Attribute Values</label>
            <div className="mt-1 border rounded overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(Array.isArray(formData.item_attribute_values) ? (formData.item_attribute_values as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.item_attribute_values) ? formData.item_attribute_values : [])];
                            rows.splice(idx, 1);
                            handleChange('item_attribute_values', rows);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-2 bg-gray-50 border-t">
                <button
                  type="button"
                  onClick={() => handleChange('item_attribute_values', [...(Array.isArray(formData.item_attribute_values) ? formData.item_attribute_values : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
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