// Form scaffold for Pick List
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PickList } from '../types/pick-list.js';

interface PickListFormProps {
  initialData?: Partial<PickList>;
  onSubmit: (data: Partial<PickList>) => void;
  mode: 'create' | 'edit';
}

export function PickListForm({ initialData = {}, onSubmit, mode }: PickListFormProps) {
  const [formData, setFormData] = useState<Partial<PickList>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Pick List' : 'New Pick List'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Series</label>
            <select
              value={String(formData.naming_series ?? '')}
              onChange={e => handleChange('naming_series', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>

            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company (→ Company)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Company..."
                value={String(formData.company ?? '')}
                onChange={e => {
                  handleChange('company', e.target.value);
                  // TODO: Implement async search for Company
                  // fetch(`/api/resource/Company?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Company"
                data-fieldname="company"
              />
              {/* Link indicator */}
              {formData.company && (
                <button
                  type="button"
                  onClick={() => handleChange('company', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Purpose</label>
            <select
              value={String(formData.purpose ?? '')}
              onChange={e => handleChange('purpose', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Material Transfer for Manufacture">Material Transfer for Manufacture</option>
              <option value="Material Transfer">Material Transfer</option>
              <option value="Delivery">Delivery</option>
            </select>
          </div>
          {formData.purpose===='Delivery' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer (→ Customer)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Customer..."
                value={String(formData.customer ?? '')}
                onChange={e => {
                  handleChange('customer', e.target.value);
                  // TODO: Implement async search for Customer
                  // fetch(`/api/resource/Customer?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Customer"
                data-fieldname="customer"
              />
              {/* Link indicator */}
              {formData.customer && (
                <button
                  type="button"
                  onClick={() => handleChange('customer', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.purpose===='Delivery' && formData.customer && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              value={String(formData.customer_name ?? '')}
              onChange={e => handleChange('customer_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.purpose===='Material Transfer for Manufacture' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Work Order (→ Work Order)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Work Order..."
                value={String(formData.work_order ?? '')}
                onChange={e => {
                  handleChange('work_order', e.target.value);
                  // TODO: Implement async search for Work Order
                  // fetch(`/api/resource/Work Order?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Work Order"
                data-fieldname="work_order"
              />
              {/* Link indicator */}
              {formData.work_order && (
                <button
                  type="button"
                  onClick={() => handleChange('work_order', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {['Material Transfer', 'Material Issue'].includes(formData.purpose) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Material Request (→ Material Request)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Material Request..."
                value={String(formData.material_request ?? '')}
                onChange={e => {
                  handleChange('material_request', e.target.value);
                  // TODO: Implement async search for Material Request
                  // fetch(`/api/resource/Material Request?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Material Request"
                data-fieldname="material_request"
              />
              {/* Link indicator */}
              {formData.material_request && (
                <button
                  type="button"
                  onClick={() => handleChange('material_request', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.purpose===='Material Transfer for Manufacture' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Qty of Finished Goods Item</label>
            <input
              type="number"
              step="any"
              value={formData.for_qty != null ? Number(formData.for_qty) : ''}
              onChange={e => handleChange('for_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.parent_warehouse ?? '')}
                onChange={e => {
                  handleChange('parent_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="parent_warehouse"
              />
              {/* Link indicator */}
              {formData.parent_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('parent_warehouse', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.consider_rejected_warehouses}
              onChange={e => handleChange('consider_rejected_warehouses', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Consider Rejected Warehouses</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.pick_manually}
              onChange={e => handleChange('pick_manually', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Pick Manually</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.ignore_pricing_rule}
              onChange={e => handleChange('ignore_pricing_rule', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Ignore Pricing Rule</label>
          </div>
      {/* Section: section_break_6 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Scan Barcode</label>
            <input
              type="text"
              value={String(formData.scan_barcode ?? '')}
              onChange={e => handleChange('scan_barcode', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.scan_mode}
              onChange={e => handleChange('scan_mode', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Scan Mode</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.prompt_qty}
              onChange={e => handleChange('prompt_qty', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Prompt Qty</label>
          </div>
        </div>
      </div>
      {/* Section: section_break_15 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: locations → Pick List Item */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Item Locations</label>
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
                  {(Array.isArray(formData.locations) ? (formData.locations as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.locations) ? formData.locations : [])];
                            rows.splice(idx, 1);
                            handleChange('locations', rows);
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
                  onClick={() => handleChange('locations', [...(Array.isArray(formData.locations) ? formData.locations : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Pick List)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Pick List..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Pick List
                  // fetch(`/api/resource/Pick List?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Pick List"
                data-fieldname="amended_from"
              />
              {/* Link indicator */}
              {formData.amended_from && (
                <button
                  type="button"
                  onClick={() => handleChange('amended_from', '')}
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
      {/* Section: Print Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Print Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.group_same_items}
              onChange={e => handleChange('group_same_items', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Group Same Items</label>
          </div>
        </div>
      </div>
      {/* Section: Status */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Status</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Draft">Draft</option>
              <option value="Open">Open</option>
              <option value="Partly Delivered">Partly Delivered</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery Status</label>
            <select
              value={String(formData.delivery_status ?? '')}
              onChange={e => handleChange('delivery_status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Not Delivered">Not Delivered</option>
              <option value="Fully Delivered">Fully Delivered</option>
              <option value="Partly Delivered">Partly Delivered</option>
            </select>
          </div>
          {!formData.__islocal && formData.purpose ==== "Delivery" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">% Delivered</label>
            <input
              type="number"
              step="any"
              value={formData.per_delivered != null ? Number(formData.per_delivered) : ''}
              onChange={e => handleChange('per_delivered', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
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