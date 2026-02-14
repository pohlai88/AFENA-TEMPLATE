// Form scaffold for Asset
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { Asset } from '../types/asset.js';

interface AssetFormProps {
  initialData?: Partial<Asset>;
  onSubmit: (data: Partial<Asset>) => void;
  mode: 'create' | 'edit';
}

export function AssetForm({ initialData = {}, onSubmit, mode }: AssetFormProps) {
  const [formData, setFormData] = useState<Partial<Asset>>(initialData);

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
        {mode === 'edit' ? formData.asset_name ?? 'Asset' : 'New Asset'}
      </h2>
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
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              value={String(formData.item_name ?? '')}
              onChange={e => handleChange('item_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.item_code && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Name</label>
            <input
              type="text"
              value={String(formData.asset_name ?? '')}
              onChange={e => handleChange('asset_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Location (→ Location)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Location..."
                value={String(formData.location ?? '')}
                onChange={e => {
                  handleChange('location', e.target.value);
                  // TODO: Implement async search for Location
                  // fetch(`/api/resource/Location?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Location"
                data-fieldname="location"
              />
              {/* Link indicator */}
              {formData.location && (
                <button
                  type="button"
                  onClick={() => handleChange('location', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {!!formData.item_code && (
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Type</label>
            <select
              value={String(formData.asset_type ?? '')}
              onChange={e => handleChange('asset_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Existing Asset">Existing Asset</option>
              <option value="Composite Asset">Composite Asset</option>
              <option value="Composite Component">Composite Component</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.maintenance_required}
              onChange={e => handleChange('maintenance_required', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Maintenance Required</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.calculate_depreciation}
              onChange={e => handleChange('calculate_depreciation', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Calculate Depreciation</label>
          </div>
      {/* Section: Purchase Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Purchase Details</h4>
        <div className="grid grid-cols-2 gap-4">
          {formData.asset_type !== "Composite Asset" && formData.asset_type !== "Existing Asset" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Receipt (→ Purchase Receipt)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Purchase Receipt..."
                value={String(formData.purchase_receipt ?? '')}
                onChange={e => {
                  handleChange('purchase_receipt', e.target.value);
                  // TODO: Implement async search for Purchase Receipt
                  // fetch(`/api/resource/Purchase Receipt?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Purchase Receipt"
                data-fieldname="purchase_receipt"
              />
              {/* Link indicator */}
              {formData.purchase_receipt && (
                <button
                  type="button"
                  onClick={() => handleChange('purchase_receipt', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Receipt Item</label>
            <input
              type="text"
              value={String(formData.purchase_receipt_item ?? '')}
              onChange={e => handleChange('purchase_receipt_item', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {formData.asset_type !== "Composite Asset" && formData.asset_type !== "Existing Asset" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Invoice (→ Purchase Invoice)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Purchase Invoice..."
                value={String(formData.purchase_invoice ?? '')}
                onChange={e => {
                  handleChange('purchase_invoice', e.target.value);
                  // TODO: Implement async search for Purchase Invoice
                  // fetch(`/api/resource/Purchase Invoice?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Purchase Invoice"
                data-fieldname="purchase_invoice"
              />
              {/* Link indicator */}
              {formData.purchase_invoice && (
                <button
                  type="button"
                  onClick={() => handleChange('purchase_invoice', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Invoice Item</label>
            <input
              type="text"
              value={String(formData.purchase_invoice_item ?? '')}
              onChange={e => handleChange('purchase_invoice_item', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
            <input
              type="date"
              value={String(formData.purchase_date ?? '')}
              onChange={e => handleChange('purchase_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Available for Use Date</label>
            <input
              type="date"
              value={String(formData.available_for_use_date ?? '')}
              onChange={e => handleChange('available_for_use_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Disposal Date</label>
            <input
              type="date"
              value={String(formData.disposal_date ?? '')}
              onChange={e => handleChange('disposal_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Net Purchase Amount</label>
            <input
              type="number"
              step="any"
              value={formData.net_purchase_amount != null ? Number(formData.net_purchase_amount) : ''}
              onChange={e => handleChange('net_purchase_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Amount</label>
            <input
              type="number"
              step="any"
              value={formData.purchase_amount != null ? Number(formData.purchase_amount) : ''}
              onChange={e => handleChange('purchase_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Quantity</label>
            <input
              type="number"
              step="1"
              value={formData.asset_quantity != null ? Number(formData.asset_quantity) : ''}
              onChange={e => handleChange('asset_quantity', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {formData.docstatus > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Asset Cost</label>
            <input
              type="number"
              step="any"
              value={formData.additional_asset_cost != null ? Number(formData.additional_asset_cost) : ''}
              onChange={e => handleChange('additional_asset_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: section_break_uiyd */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {formData.docstatus > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Asset Cost</label>
            <input
              type="number"
              step="any"
              value={formData.total_asset_cost != null ? Number(formData.total_asset_cost) : ''}
              onChange={e => handleChange('total_asset_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Tab: Depreciation */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Depreciation</h3>
      </div>
          {(formData.asset_type === "Existing Asset") && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Opening Accumulated Depreciation</label>
            <input
              type="number"
              step="any"
              value={formData.opening_accumulated_depreciation != null ? Number(formData.opening_accumulated_depreciation) : ''}
              onChange={e => handleChange('opening_accumulated_depreciation', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_fully_depreciated}
              onChange={e => handleChange('is_fully_depreciated', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Fully Depreciated</label>
          </div>
          {(formData.asset_type === "Existing Asset") && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Opening Number of Booked Depreciations</label>
            <input
              type="number"
              step="1"
              value={formData.opening_number_of_booked_depreciations != null ? Number(formData.opening_number_of_booked_depreciations) : ''}
              onChange={e => handleChange('opening_number_of_booked_depreciations', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
      {/* Section: section_break_36 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: finance_books → Asset Finance Book */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Finance Books</label>
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
                  {(Array.isArray(formData.finance_books) ? (formData.finance_books as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.finance_books) ? formData.finance_books : [])];
                            rows.splice(idx, 1);
                            handleChange('finance_books', rows);
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
                  onClick={() => handleChange('finance_books', [...(Array.isArray(formData.finance_books) ? formData.finance_books : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Depreciation Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Depreciation Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Depreciation Method</label>
            <select
              value={String(formData.depreciation_method ?? '')}
              onChange={e => handleChange('depreciation_method', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Straight Line">Straight Line</option>
              <option value="Double Declining Balance">Double Declining Balance</option>
              <option value="Written Down Value">Written Down Value</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Value After Depreciation</label>
            <input
              type="number"
              step="any"
              value={formData.value_after_depreciation != null ? Number(formData.value_after_depreciation) : ''}
              onChange={e => handleChange('value_after_depreciation', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Frequency of Depreciation (Months)</label>
            <input
              type="number"
              step="1"
              value={formData.frequency_of_depreciation != null ? Number(formData.frequency_of_depreciation) : ''}
              onChange={e => handleChange('frequency_of_depreciation', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Next Depreciation Date</label>
            <input
              type="date"
              value={String(formData.next_depreciation_date ?? '')}
              onChange={e => handleChange('next_depreciation_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Number of Depreciations</label>
            <input
              type="number"
              step="1"
              value={formData.total_number_of_depreciations != null ? Number(formData.total_number_of_depreciations) : ''}
              onChange={e => handleChange('total_number_of_depreciations', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Depreciation Schedule */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Depreciation Schedule</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Depreciation Schedule View</label>
            <textarea
              value={String(formData.depreciation_schedule_view ?? '')}
              onChange={e => handleChange('depreciation_schedule_view', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Tab: More Info */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">More Info</h3>
      </div>
      {/* Section: Accounting Dimensions */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Accounting Dimensions</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cost Center (→ Cost Center)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Cost Center..."
                value={String(formData.cost_center ?? '')}
                onChange={e => {
                  handleChange('cost_center', e.target.value);
                  // TODO: Implement async search for Cost Center
                  // fetch(`/api/resource/Cost Center?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Cost Center"
                data-fieldname="cost_center"
              />
              {/* Link indicator */}
              {formData.cost_center && (
                <button
                  type="button"
                  onClick={() => handleChange('cost_center', '')}
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
      {/* Section: Ownership */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Ownership</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Owner</label>
            <select
              value={String(formData.asset_owner ?? '')}
              onChange={e => handleChange('asset_owner', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Company">Company</option>
              <option value="Supplier">Supplier</option>
              <option value="Customer">Customer</option>
            </select>
          </div>
          {formData.asset_owner === "Company" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Owner Company (→ Company)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Company..."
                value={String(formData.asset_owner_company ?? '')}
                onChange={e => {
                  handleChange('asset_owner_company', e.target.value);
                  // TODO: Implement async search for Company
                  // fetch(`/api/resource/Company?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Company"
                data-fieldname="asset_owner_company"
              />
              {/* Link indicator */}
              {formData.asset_owner_company && (
                <button
                  type="button"
                  onClick={() => handleChange('asset_owner_company', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.asset_owner === "Customer" && (
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
          {formData.asset_owner === "Supplier" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier (→ Supplier)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Supplier..."
                value={String(formData.supplier ?? '')}
                onChange={e => {
                  handleChange('supplier', e.target.value);
                  // TODO: Implement async search for Supplier
                  // fetch(`/api/resource/Supplier?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Supplier"
                data-fieldname="supplier"
              />
              {/* Link indicator */}
              {formData.supplier && (
                <button
                  type="button"
                  onClick={() => handleChange('supplier', '')}
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
      {/* Section: Insurance */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Insurance</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Policy number</label>
            <input
              type="text"
              value={String(formData.policy_number ?? '')}
              onChange={e => handleChange('policy_number', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Insurer</label>
            <input
              type="text"
              value={String(formData.insurer ?? '')}
              onChange={e => handleChange('insurer', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Insured value</label>
            <input
              type="text"
              value={String(formData.insured_value ?? '')}
              onChange={e => handleChange('insured_value', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Insurance Start Date</label>
            <input
              type="date"
              value={String(formData.insurance_start_date ?? '')}
              onChange={e => handleChange('insurance_start_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Insurance End Date</label>
            <input
              type="date"
              value={String(formData.insurance_end_date ?? '')}
              onChange={e => handleChange('insurance_end_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Comprehensive Insurance</label>
            <input
              type="text"
              value={String(formData.comprehensive_insurance ?? '')}
              onChange={e => handleChange('comprehensive_insurance', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Additional Info */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Additional Info</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Partially Depreciated">Partially Depreciated</option>
              <option value="Fully Depreciated">Fully Depreciated</option>
              <option value="Sold">Sold</option>
              <option value="Scrapped">Scrapped</option>
              <option value="In Maintenance">In Maintenance</option>
              <option value="Out of Order">Out of Order</option>
              <option value="Issue">Issue</option>
              <option value="Receipt">Receipt</option>
              <option value="Capitalized">Capitalized</option>
              <option value="Work In Progress">Work In Progress</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Custodian (→ Employee)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Employee..."
                value={String(formData.custodian ?? '')}
                onChange={e => {
                  handleChange('custodian', e.target.value);
                  // TODO: Implement async search for Employee
                  // fetch(`/api/resource/Employee?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Employee"
                data-fieldname="custodian"
              />
              {/* Link indicator */}
              {formData.custodian && (
                <button
                  type="button"
                  onClick={() => handleChange('custodian', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department (→ Department)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Department..."
                value={String(formData.department ?? '')}
                onChange={e => {
                  handleChange('department', e.target.value);
                  // TODO: Implement async search for Department
                  // fetch(`/api/resource/Department?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Department"
                data-fieldname="department"
              />
              {/* Link indicator */}
              {formData.department && (
                <button
                  type="button"
                  onClick={() => handleChange('department', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Finance Book (→ Finance Book)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Finance Book..."
                value={String(formData.default_finance_book ?? '')}
                onChange={e => {
                  handleChange('default_finance_book', e.target.value);
                  // TODO: Implement async search for Finance Book
                  // fetch(`/api/resource/Finance Book?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Finance Book"
                data-fieldname="default_finance_book"
              />
              {/* Link indicator */}
              {formData.default_finance_book && (
                <button
                  type="button"
                  onClick={() => handleChange('default_finance_book', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Depreciation Entry Posting Status</label>
            <select
              value={String(formData.depr_entry_posting_status ?? '')}
              onChange={e => handleChange('depr_entry_posting_status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Successful">Successful</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Journal Entry for Scrap (→ Journal Entry)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Journal Entry..."
                value={String(formData.journal_entry_for_scrap ?? '')}
                onChange={e => {
                  handleChange('journal_entry_for_scrap', e.target.value);
                  // TODO: Implement async search for Journal Entry
                  // fetch(`/api/resource/Journal Entry?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Journal Entry"
                data-fieldname="journal_entry_for_scrap"
              />
              {/* Link indicator */}
              {formData.journal_entry_for_scrap && (
                <button
                  type="button"
                  onClick={() => handleChange('journal_entry_for_scrap', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Split From (→ Asset)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Asset..."
                value={String(formData.split_from ?? '')}
                onChange={e => {
                  handleChange('split_from', e.target.value);
                  // TODO: Implement async search for Asset
                  // fetch(`/api/resource/Asset?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Asset"
                data-fieldname="split_from"
              />
              {/* Link indicator */}
              {formData.split_from && (
                <button
                  type="button"
                  onClick={() => handleChange('split_from', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Asset)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Asset..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Asset
                  // fetch(`/api/resource/Asset?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Asset"
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.booked_fixed_asset}
              onChange={e => handleChange('booked_fixed_asset', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Booked Fixed Asset</label>
          </div>
        </div>
      </div>
      {/* Tab: Connections */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Connections</h3>
      </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}