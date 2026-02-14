// Form scaffold for Item
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { Item } from '../types/item.js';

interface ItemFormProps {
  initialData?: Partial<Item>;
  onSubmit: (data: Partial<Item>) => void;
  mode: 'create' | 'edit';
}

export function ItemForm({ initialData = {}, onSubmit, mode }: ItemFormProps) {
  const [formData, setFormData] = useState<Partial<Item>>(initialData);

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
        {mode === 'edit' ? formData.item_name ?? 'Item' : 'New Item'}
      </h2>
      {/* Tab: Details */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Details</h3>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Series</label>
            <select
              value={String(formData.naming_series ?? '')}
              onChange={e => handleChange('naming_series', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>

            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Code</label>
            <input
              type="text"
              value={String(formData.item_code ?? '')}
              onChange={e => handleChange('item_code', e.target.value)}
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Group (→ Item Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Item Group..."
                value={String(formData.item_group ?? '')}
                onChange={e => {
                  handleChange('item_group', e.target.value);
                  // TODO: Implement async search for Item Group
                  // fetch(`/api/resource/Item Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Item Group"
                data-fieldname="item_group"
              />
              {/* Link indicator */}
              {formData.item_group && (
                <button
                  type="button"
                  onClick={() => handleChange('item_group', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Unit of Measure (→ UOM)</label>
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.disabled}
              onChange={e => handleChange('disabled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Disabled</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_alternative_item}
              onChange={e => handleChange('allow_alternative_item', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Alternative Item</label>
          </div>
          {!formData.is_fixed_asset && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_stock_item}
              onChange={e => handleChange('is_stock_item', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Maintain Stock</label>
          </div>
          )}
          {!formData.variant_of && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.has_variants}
              onChange={e => handleChange('has_variants', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Has Variants</label>
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_fixed_asset}
              onChange={e => handleChange('is_fixed_asset', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Fixed Asset</label>
          </div>
          {!!formData.is_fixed_asset && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.auto_create_assets}
              onChange={e => handleChange('auto_create_assets', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Auto Create Assets on Purchase</label>
          </div>
          )}
          {!!formData.auto_create_assets && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_grouped_asset}
              onChange={e => handleChange('is_grouped_asset', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Create Grouped Asset</label>
          </div>
          )}
          {!!formData.is_fixed_asset && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Category (→ Asset Category)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Asset Category..."
                value={String(formData.asset_category ?? '')}
                onChange={e => {
                  handleChange('asset_category', e.target.value);
                  // TODO: Implement async search for Asset Category
                  // fetch(`/api/resource/Asset Category?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Asset Category"
                data-fieldname="asset_category"
              />
              {/* Link indicator */}
              {formData.asset_category && (
                <button
                  type="button"
                  onClick={() => handleChange('asset_category', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {!!formData.is_fixed_asset && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Naming Series</label>
            <select
              value={String(formData.asset_naming_series ?? '')}
              onChange={e => handleChange('asset_naming_series', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>

            </select>
          </div>
          )}
      {/* Section: section_break_gjns */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {(formData.__islocal&&formData.is_stock_item && !formData.has_serial_no && !formData.has_batch_no) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Opening Stock</label>
            <input
              type="number"
              step="any"
              value={formData.opening_stock != null ? Number(formData.opening_stock) : ''}
              onChange={e => handleChange('opening_stock', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.__islocal && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Standard Selling Rate</label>
            <input
              type="number"
              step="any"
              value={formData.standard_rate != null ? Number(formData.standard_rate) : ''}
              onChange={e => handleChange('standard_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: section_break_znra */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {!formData.__islocal && !formData.is_fixed_asset && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Over Delivery/Receipt Allowance (%)</label>
            <input
              type="number"
              step="any"
              value={formData.over_delivery_receipt_allowance != null ? Number(formData.over_delivery_receipt_allowance) : ''}
              onChange={e => handleChange('over_delivery_receipt_allowance', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!formData.__islocal && !formData.is_fixed_asset && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Over Billing Allowance (%)</label>
            <input
              type="number"
              step="any"
              value={formData.over_billing_allowance != null ? Number(formData.over_billing_allowance) : ''}
              onChange={e => handleChange('over_billing_allowance', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>
      </div>
      {/* Section: Description */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Description</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={String(formData.description ?? '')}
              onChange={e => handleChange('description', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand (→ Brand)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Brand..."
                value={String(formData.brand ?? '')}
                onChange={e => {
                  handleChange('brand', e.target.value);
                  // TODO: Implement async search for Brand
                  // fetch(`/api/resource/Brand?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Brand"
                data-fieldname="brand"
              />
              {/* Link indicator */}
              {formData.brand && (
                <button
                  type="button"
                  onClick={() => handleChange('brand', '')}
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
      {/* Section: Units of Measure */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Units of Measure</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: uoms → UOM Conversion Detail */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">UOMs</label>
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
                  {(Array.isArray(formData.uoms) ? (formData.uoms as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.uoms) ? formData.uoms : [])];
                            rows.splice(idx, 1);
                            handleChange('uoms', rows);
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
                  onClick={() => handleChange('uoms', [...(Array.isArray(formData.uoms) ? formData.uoms : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tab: Dashboard */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Dashboard</h3>
      </div>
      {/* Tab: Inventory */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Inventory</h3>
      </div>
      {/* Section: Inventory Valuation */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Inventory Valuation</h4>
        <div className="grid grid-cols-2 gap-4">
          {!!formData.is_stock_item && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Valuation Method</label>
            <select
              value={String(formData.valuation_method ?? '')}
              onChange={e => handleChange('valuation_method', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="FIFO">FIFO</option>
              <option value="Moving Average">Moving Average</option>
              <option value="LIFO">LIFO</option>
            </select>
          </div>
          )}
          {!!formData.is_stock_item && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Valuation Rate</label>
            <input
              type="number"
              step="any"
              value={formData.valuation_rate != null ? Number(formData.valuation_rate) : ''}
              onChange={e => handleChange('valuation_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Inventory Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Inventory Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Shelf Life In Days</label>
            <input
              type="number"
              step="1"
              value={formData.shelf_life_in_days != null ? Number(formData.shelf_life_in_days) : ''}
              onChange={e => handleChange('shelf_life_in_days', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.is_stock_item && (
          <div>
            <label className="block text-sm font-medium text-gray-700">End of Life</label>
            <input
              type="date"
              value={String(formData.end_of_life ?? '')}
              onChange={e => handleChange('end_of_life', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Material Request Type</label>
            <select
              value={String(formData.default_material_request_type ?? '')}
              onChange={e => handleChange('default_material_request_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Purchase">Purchase</option>
              <option value="Material Transfer">Material Transfer</option>
              <option value="Material Issue">Material Issue</option>
              <option value="Manufacture">Manufacture</option>
              <option value="Customer Provided">Customer Provided</option>
            </select>
          </div>
          {!!formData.is_stock_item && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Warranty Period (in days)</label>
            <input
              type="text"
              value={String(formData.warranty_period ?? '')}
              onChange={e => handleChange('warranty_period', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.is_stock_item && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Weight Per Unit</label>
            <input
              type="number"
              step="any"
              value={formData.weight_per_unit != null ? Number(formData.weight_per_unit) : ''}
              onChange={e => handleChange('weight_per_unit', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.is_stock_item && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Weight UOM (→ UOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UOM..."
                value={String(formData.weight_uom ?? '')}
                onChange={e => {
                  handleChange('weight_uom', e.target.value);
                  // TODO: Implement async search for UOM
                  // fetch(`/api/resource/UOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="UOM"
                data-fieldname="weight_uom"
              />
              {/* Link indicator */}
              {formData.weight_uom && (
                <button
                  type="button"
                  onClick={() => handleChange('weight_uom', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_negative_stock}
              onChange={e => handleChange('allow_negative_stock', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Negative Stock</label>
          </div>
        </div>
      </div>
      {/* Section: Barcodes */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Barcodes</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: barcodes → Item Barcode */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Barcodes</label>
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
                  {(Array.isArray(formData.barcodes) ? (formData.barcodes as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.barcodes) ? formData.barcodes : [])];
                            rows.splice(idx, 1);
                            handleChange('barcodes', rows);
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
                  onClick={() => handleChange('barcodes', [...(Array.isArray(formData.barcodes) ? formData.barcodes : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Auto re-order */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Auto re-order</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: reorder_levels → Item Reorder */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Reorder level based on Warehouse</label>
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
                  {(Array.isArray(formData.reorder_levels) ? (formData.reorder_levels as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.reorder_levels) ? formData.reorder_levels : [])];
                            rows.splice(idx, 1);
                            handleChange('reorder_levels', rows);
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
                  onClick={() => handleChange('reorder_levels', [...(Array.isArray(formData.reorder_levels) ? formData.reorder_levels : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Serial Nos and Batches */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Serial Nos and Batches</h4>
        <div className="grid grid-cols-2 gap-4">
          {!!formData.is_stock_item && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.has_batch_no}
              onChange={e => handleChange('has_batch_no', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Has Batch No</label>
          </div>
          )}
          {!!formData.has_batch_no && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.create_new_batch}
              onChange={e => handleChange('create_new_batch', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Automatically Create New Batch</label>
          </div>
          )}
          {formData.has_batch_no===1 && formData.create_new_batch===1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Batch Number Series</label>
            <input
              type="text"
              value={String(formData.batch_number_series ?? '')}
              onChange={e => handleChange('batch_number_series', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.has_batch_no && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.has_expiry_date}
              onChange={e => handleChange('has_expiry_date', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Has Expiry Date</label>
          </div>
          )}
          {!!formData.has_batch_no && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.retain_sample}
              onChange={e => handleChange('retain_sample', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Retain Sample</label>
          </div>
          )}
          {(formData.retain_sample && formData.has_batch_no) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Sample Quantity</label>
            <input
              type="number"
              step="1"
              value={formData.sample_quantity != null ? Number(formData.sample_quantity) : ''}
              onChange={e => handleChange('sample_quantity', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.is_stock_item && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.has_serial_no}
              onChange={e => handleChange('has_serial_no', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Has Serial No</label>
          </div>
          )}
          {!!formData.has_serial_no && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Serial Number Series</label>
            <input
              type="text"
              value={String(formData.serial_no_series ?? '')}
              onChange={e => handleChange('serial_no_series', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Tab: Defaults */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Defaults</h3>
      </div>
          {/* Child table: item_defaults → Item Default */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Item Defaults</label>
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
                  {(Array.isArray(formData.item_defaults) ? (formData.item_defaults as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.item_defaults) ? formData.item_defaults : [])];
                            rows.splice(idx, 1);
                            handleChange('item_defaults', rows);
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
                  onClick={() => handleChange('item_defaults', [...(Array.isArray(formData.item_defaults) ? formData.item_defaults : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
      {/* Tab: Variants */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Variants</h3>
      </div>
          {!!formData.variant_of && (
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
          )}
          {!!formData.has_variants && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Variant Based On</label>
            <select
              value={String(formData.variant_based_on ?? '')}
              onChange={e => handleChange('variant_based_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Item Attribute">Item Attribute</option>
              <option value="Manufacturer">Manufacturer</option>
            </select>
          </div>
          )}
          {(formData.has_variants || formData.variant_of) && formData.variant_based_on===='Item Attribute' && (
          {/* Child table: attributes → Item Variant Attribute */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Variant Attributes</label>
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
                  {(Array.isArray(formData.attributes) ? (formData.attributes as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.attributes) ? formData.attributes : [])];
                            rows.splice(idx, 1);
                            handleChange('attributes', rows);
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
                  onClick={() => handleChange('attributes', [...(Array.isArray(formData.attributes) ? formData.attributes : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          )}
      {/* Tab: Accounting */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Accounting</h3>
      </div>
      {/* Section: Deferred Accounting */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Deferred Accounting</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enable_deferred_expense}
              onChange={e => handleChange('enable_deferred_expense', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enable Deferred Expense</label>
          </div>
          {!!formData.enable_deferred_expense && (
          <div>
            <label className="block text-sm font-medium text-gray-700">No of Months (Expense)</label>
            <input
              type="number"
              step="1"
              value={formData.no_of_months_exp != null ? Number(formData.no_of_months_exp) : ''}
              onChange={e => handleChange('no_of_months_exp', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enable_deferred_revenue}
              onChange={e => handleChange('enable_deferred_revenue', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enable Deferred Revenue</label>
          </div>
          {!!formData.enable_deferred_revenue && (
          <div>
            <label className="block text-sm font-medium text-gray-700">No of Months (Revenue)</label>
            <input
              type="number"
              step="1"
              value={formData.no_of_months != null ? Number(formData.no_of_months) : ''}
              onChange={e => handleChange('no_of_months', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Tab: Purchasing */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Purchasing</h3>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Purchase Unit of Measure (→ UOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UOM..."
                value={String(formData.purchase_uom ?? '')}
                onChange={e => {
                  handleChange('purchase_uom', e.target.value);
                  // TODO: Implement async search for UOM
                  // fetch(`/api/resource/UOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="UOM"
                data-fieldname="purchase_uom"
              />
              {/* Link indicator */}
              {formData.purchase_uom && (
                <button
                  type="button"
                  onClick={() => handleChange('purchase_uom', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {!!formData.is_stock_item && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Order Qty</label>
            <input
              type="number"
              step="any"
              value={formData.min_order_qty != null ? Number(formData.min_order_qty) : ''}
              onChange={e => handleChange('min_order_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Safety Stock</label>
            <input
              type="number"
              step="any"
              value={formData.safety_stock != null ? Number(formData.safety_stock) : ''}
              onChange={e => handleChange('safety_stock', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_purchase_item}
              onChange={e => handleChange('is_purchase_item', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Purchase</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lead Time in days</label>
            <input
              type="number"
              step="1"
              value={formData.lead_time_days != null ? Number(formData.lead_time_days) : ''}
              onChange={e => handleChange('lead_time_days', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Purchase Rate</label>
            <input
              type="number"
              step="any"
              value={formData.last_purchase_rate != null ? Number(formData.last_purchase_rate) : ''}
              onChange={e => handleChange('last_purchase_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_customer_provided_item}
              onChange={e => handleChange('is_customer_provided_item', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Customer Provided Item</label>
          </div>
          {!!formData.is_customer_provided_item && (
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
      {/* Section: Supplier Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Supplier Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.delivered_by_supplier}
              onChange={e => handleChange('delivered_by_supplier', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Delivered by Supplier (Drop Ship)</label>
          </div>
          {/* Child table: supplier_items → Item Supplier */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Supplier Items</label>
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
                  {(Array.isArray(formData.supplier_items) ? (formData.supplier_items as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.supplier_items) ? formData.supplier_items : [])];
                            rows.splice(idx, 1);
                            handleChange('supplier_items', rows);
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
                  onClick={() => handleChange('supplier_items', [...(Array.isArray(formData.supplier_items) ? formData.supplier_items : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Foreign Trade Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Foreign Trade Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Country of Origin (→ Country)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Country..."
                value={String(formData.country_of_origin ?? '')}
                onChange={e => {
                  handleChange('country_of_origin', e.target.value);
                  // TODO: Implement async search for Country
                  // fetch(`/api/resource/Country?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Country"
                data-fieldname="country_of_origin"
              />
              {/* Link indicator */}
              {formData.country_of_origin && (
                <button
                  type="button"
                  onClick={() => handleChange('country_of_origin', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Customs Tariff Number (→ Customs Tariff Number)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Customs Tariff Number..."
                value={String(formData.customs_tariff_number ?? '')}
                onChange={e => {
                  handleChange('customs_tariff_number', e.target.value);
                  // TODO: Implement async search for Customs Tariff Number
                  // fetch(`/api/resource/Customs Tariff Number?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Customs Tariff Number"
                data-fieldname="customs_tariff_number"
              />
              {/* Link indicator */}
              {formData.customs_tariff_number && (
                <button
                  type="button"
                  onClick={() => handleChange('customs_tariff_number', '')}
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
      {/* Tab: Sales */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Sales</h3>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Sales Unit of Measure (→ UOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UOM..."
                value={String(formData.sales_uom ?? '')}
                onChange={e => {
                  handleChange('sales_uom', e.target.value);
                  // TODO: Implement async search for UOM
                  // fetch(`/api/resource/UOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="UOM"
                data-fieldname="sales_uom"
              />
              {/* Link indicator */}
              {formData.sales_uom && (
                <button
                  type="button"
                  onClick={() => handleChange('sales_uom', '')}
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
              checked={!!formData.grant_commission}
              onChange={e => handleChange('grant_commission', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Grant Commission</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_sales_item}
              onChange={e => handleChange('is_sales_item', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Sales</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Discount (%)</label>
            <input
              type="number"
              step="any"
              value={formData.max_discount != null ? Number(formData.max_discount) : ''}
              onChange={e => handleChange('max_discount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: Customer Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Customer Details</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: customer_items → Item Customer Detail */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Customer Items</label>
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
                  {(Array.isArray(formData.customer_items) ? (formData.customer_items as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.customer_items) ? formData.customer_items : [])];
                            rows.splice(idx, 1);
                            handleChange('customer_items', rows);
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
                  onClick={() => handleChange('customer_items', [...(Array.isArray(formData.customer_items) ? formData.customer_items : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tab: Tax */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Tax</h3>
      </div>
      {/* Section: section_break_oilf */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: taxes → Item Tax */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Taxes</label>
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
                  {(Array.isArray(formData.taxes) ? (formData.taxes as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.taxes) ? formData.taxes : [])];
                            rows.splice(idx, 1);
                            handleChange('taxes', rows);
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
                  onClick={() => handleChange('taxes', [...(Array.isArray(formData.taxes) ? formData.taxes : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: section_break_fxqz */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {!!formData.is_purchase_item && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Tax Withholding Category (→ Tax Withholding Category)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Tax Withholding Category..."
                value={String(formData.purchase_tax_withholding_category ?? '')}
                onChange={e => {
                  handleChange('purchase_tax_withholding_category', e.target.value);
                  // TODO: Implement async search for Tax Withholding Category
                  // fetch(`/api/resource/Tax Withholding Category?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Tax Withholding Category"
                data-fieldname="purchase_tax_withholding_category"
              />
              {/* Link indicator */}
              {formData.purchase_tax_withholding_category && (
                <button
                  type="button"
                  onClick={() => handleChange('purchase_tax_withholding_category', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {!!formData.is_sales_item && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Tax Withholding Category (→ Tax Withholding Category)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Tax Withholding Category..."
                value={String(formData.sales_tax_withholding_category ?? '')}
                onChange={e => {
                  handleChange('sales_tax_withholding_category', e.target.value);
                  // TODO: Implement async search for Tax Withholding Category
                  // fetch(`/api/resource/Tax Withholding Category?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Tax Withholding Category"
                data-fieldname="sales_tax_withholding_category"
              />
              {/* Link indicator */}
              {formData.sales_tax_withholding_category && (
                <button
                  type="button"
                  onClick={() => handleChange('sales_tax_withholding_category', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
        </div>
      </div>
      {/* Tab: Quality */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Quality</h3>
      </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.inspection_required_before_purchase}
              onChange={e => handleChange('inspection_required_before_purchase', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Inspection Required before Purchase</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.inspection_required_before_delivery}
              onChange={e => handleChange('inspection_required_before_delivery', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Inspection Required before Delivery</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quality Inspection Template (→ Quality Inspection Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Quality Inspection Template..."
                value={String(formData.quality_inspection_template ?? '')}
                onChange={e => {
                  handleChange('quality_inspection_template', e.target.value);
                  // TODO: Implement async search for Quality Inspection Template
                  // fetch(`/api/resource/Quality Inspection Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Quality Inspection Template"
                data-fieldname="quality_inspection_template"
              />
              {/* Link indicator */}
              {formData.quality_inspection_template && (
                <button
                  type="button"
                  onClick={() => handleChange('quality_inspection_template', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
      {/* Tab: Manufacturing */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Manufacturing</h3>
      </div>
          {!formData.is_fixed_asset && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.include_item_in_manufacturing}
              onChange={e => handleChange('include_item_in_manufacturing', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Include Item In Manufacturing</label>
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_sub_contracted_item}
              onChange={e => handleChange('is_sub_contracted_item', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Subcontracted Item</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default BOM (→ BOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search BOM..."
                value={String(formData.default_bom ?? '')}
                onChange={e => {
                  handleChange('default_bom', e.target.value);
                  // TODO: Implement async search for BOM
                  // fetch(`/api/resource/BOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="BOM"
                data-fieldname="default_bom"
              />
              {/* Link indicator */}
              {formData.default_bom && (
                <button
                  type="button"
                  onClick={() => handleChange('default_bom', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Production Capacity</label>
            <input
              type="number"
              step="1"
              value={formData.production_capacity != null ? Number(formData.production_capacity) : ''}
              onChange={e => handleChange('production_capacity', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Projected Qty</label>
            <input
              type="number"
              step="any"
              value={formData.total_projected_qty != null ? Number(formData.total_projected_qty) : ''}
              onChange={e => handleChange('total_projected_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: section_break_xili */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Customer Code</label>
            <textarea
              value={String(formData.customer_code ?? '')}
              onChange={e => handleChange('customer_code', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Manufacturer Part No</label>
            <input
              type="text"
              value={String(formData.default_manufacturer_part_no ?? '')}
              onChange={e => handleChange('default_manufacturer_part_no', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Item Manufacturer (→ Manufacturer)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Manufacturer..."
                value={String(formData.default_item_manufacturer ?? '')}
                onChange={e => {
                  handleChange('default_item_manufacturer', e.target.value);
                  // TODO: Implement async search for Manufacturer
                  // fetch(`/api/resource/Manufacturer?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Manufacturer"
                data-fieldname="default_item_manufacturer"
              />
              {/* Link indicator */}
              {formData.default_item_manufacturer && (
                <button
                  type="button"
                  onClick={() => handleChange('default_item_manufacturer', '')}
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

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}