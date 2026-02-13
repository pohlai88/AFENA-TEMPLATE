// Form scaffold for Item Lead Time
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ItemLeadTime } from '../types/item-lead-time.js';

interface ItemLeadTimeFormProps {
  initialData?: Partial<ItemLeadTime>;
  onSubmit: (data: Partial<ItemLeadTime>) => void;
  mode: 'create' | 'edit';
}

export function ItemLeadTimeForm({ initialData = {}, onSubmit, mode }: ItemLeadTimeFormProps) {
  const [formData, setFormData] = useState<Partial<ItemLeadTime>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Item Lead Time' : 'New Item Lead Time'}</h2>
      {/* Tab: Manufacturing Time */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Manufacturing Time</h3>
      </div>
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
      {/* Section: Workstation */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Workstation</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Shift Time (In Hours)</label>
            <input
              type="number"
              step="1"
              value={formData.shift_time_in_hours != null ? Number(formData.shift_time_in_hours) : ''}
              onChange={e => handleChange('shift_time_in_hours', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">No of Workstations</label>
            <input
              type="number"
              step="1"
              value={formData.no_of_workstations != null ? Number(formData.no_of_workstations) : ''}
              onChange={e => handleChange('no_of_workstations', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">No of Shift</label>
            <input
              type="number"
              step="1"
              value={formData.no_of_shift != null ? Number(formData.no_of_shift) : ''}
              onChange={e => handleChange('no_of_shift', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Workstation Time (In Hours)</label>
            <input
              type="number"
              step="1"
              value={formData.total_workstation_time != null ? Number(formData.total_workstation_time) : ''}
              onChange={e => handleChange('total_workstation_time', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Manufacturing */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Manufacturing</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Manufacturing Time</label>
            <input
              type="number"
              step="1"
              value={formData.manufacturing_time_in_mins != null ? Number(formData.manufacturing_time_in_mins) : ''}
              onChange={e => handleChange('manufacturing_time_in_mins', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">No of Units Produced</label>
            <input
              type="number"
              step="1"
              value={formData.no_of_units_produced != null ? Number(formData.no_of_units_produced) : ''}
              onChange={e => handleChange('no_of_units_produced', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Daily Yield (%)</label>
            <input
              type="number"
              step="any"
              value={formData.daily_yield != null ? Number(formData.daily_yield) : ''}
              onChange={e => handleChange('daily_yield', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity</label>
            <input
              type="number"
              step="1"
              value={formData.capacity_per_day != null ? Number(formData.capacity_per_day) : ''}
              onChange={e => handleChange('capacity_per_day', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Tab: Purchase Time */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Purchase Time</h3>
      </div>
      {/* Section: Purchase */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Purchase</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Time</label>
            <input
              type="number"
              step="1"
              value={formData.purchase_time != null ? Number(formData.purchase_time) : ''}
              onChange={e => handleChange('purchase_time', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Buffer Time</label>
            <input
              type="number"
              step="1"
              value={formData.buffer_time != null ? Number(formData.buffer_time) : ''}
              onChange={e => handleChange('buffer_time', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Tab: Item Details */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Item Details</h3>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock UOM (→ UOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UOM..."
                value={String(formData.stock_uom ?? '')}
                onChange={e => {
                  handleChange('stock_uom', e.target.value);
                  // TODO: Implement async search for UOM
                  // fetch(`/api/resource/UOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="UOM"
                data-fieldname="stock_uom"
              />
              {/* Link indicator */}
              {formData.stock_uom && (
                <button
                  type="button"
                  onClick={() => handleChange('stock_uom', '')}
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