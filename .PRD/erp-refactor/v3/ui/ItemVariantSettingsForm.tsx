// Form scaffold for Item Variant Settings
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ItemVariantSettings } from '../types/item-variant-settings.js';

interface ItemVariantSettingsFormProps {
  initialData?: Partial<ItemVariantSettings>;
  onSubmit: (data: Partial<ItemVariantSettings>) => void;
  mode: 'create' | 'edit';
}

export function ItemVariantSettingsForm({ initialData = {}, onSubmit, mode }: ItemVariantSettingsFormProps) {
  const [formData, setFormData] = useState<Partial<ItemVariantSettings>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Item Variant Settings' : 'New Item Variant Settings'}</h2>
      {/* Section: section_break_3 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.do_not_update_variants}
              onChange={e => handleChange('do_not_update_variants', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Do not update variants on save</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_rename_attribute_value}
              onChange={e => handleChange('allow_rename_attribute_value', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Rename Attribute Value</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_different_uom}
              onChange={e => handleChange('allow_different_uom', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Variant UOM to be different from Template UOM</label>
          </div>
        </div>
      </div>
      {/* Section: Copy Fields to Variant */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Copy Fields to Variant</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: fields → Variant Field */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Fields</label>
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
                  {(Array.isArray(formData.fields) ? (formData.fields as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.fields) ? formData.fields : [])];
                            rows.splice(idx, 1);
                            handleChange('fields', rows);
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
                  onClick={() => handleChange('fields', [...(Array.isArray(formData.fields) ? formData.fields : []), {}])}
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