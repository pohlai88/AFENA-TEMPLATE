// Form scaffold for Item Reorder
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ItemReorder } from '../types/item-reorder.js';

interface ItemReorderFormProps {
  initialData?: Partial<ItemReorder>;
  onSubmit: (data: Partial<ItemReorder>) => void;
  mode: 'create' | 'edit';
}

export function ItemReorderForm({ initialData = {}, onSubmit, mode }: ItemReorderFormProps) {
  const [formData, setFormData] = useState<Partial<ItemReorder>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Item Reorder' : 'New Item Reorder'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Request for (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.warehouse ?? '')}
                onChange={e => {
                  handleChange('warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="warehouse"
              />
              {/* Link indicator */}
              {formData.warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('warehouse', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Check Availability in Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.warehouse_group ?? '')}
                onChange={e => {
                  handleChange('warehouse_group', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="warehouse_group"
              />
              {/* Link indicator */}
              {formData.warehouse_group && (
                <button
                  type="button"
                  onClick={() => handleChange('warehouse_group', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Re-order Level</label>
            <input
              type="number"
              step="any"
              value={formData.warehouse_reorder_level != null ? Number(formData.warehouse_reorder_level) : ''}
              onChange={e => handleChange('warehouse_reorder_level', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Re-order Qty</label>
            <input
              type="number"
              step="any"
              value={formData.warehouse_reorder_qty != null ? Number(formData.warehouse_reorder_qty) : ''}
              onChange={e => handleChange('warehouse_reorder_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Material Request Type</label>
            <select
              value={String(formData.material_request_type ?? '')}
              onChange={e => handleChange('material_request_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Purchase">Purchase</option>
              <option value="Transfer">Transfer</option>
              <option value="Material Issue">Material Issue</option>
              <option value="Manufacture">Manufacture</option>
            </select>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}