// Form scaffold for Purchase Order
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PurchaseOrder } from '../types/purchase-order.js';

interface PurchaseOrderFormProps {
  initialData?: Partial<PurchaseOrder>;
  onSubmit: (data: Partial<PurchaseOrder>) => void;
  mode: 'create' | 'edit';
}

export function PurchaseOrderForm({ initialData = {}, onSubmit, mode }: PurchaseOrderFormProps) {
  const [formData, setFormData] = useState<Partial<PurchaseOrder>>(initialData);

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
        {mode === 'edit' ? formData.supplier_name ?? 'Purchase Order' : 'New Purchase Order'}
      </h2>
      {/* Section: supplier_section */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={String(formData.title ?? '')}
              onChange={e => handleChange('title', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier Name</label>
            <input
              type="text"
              value={String(formData.supplier_name ?? '')}
              onChange={e => handleChange('supplier_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {formData.docstatus====1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Order Confirmation No</label>
            <input
              type="text"
              value={String(formData.order_confirmation_no ?? '')}
              onChange={e => handleChange('order_confirmation_no', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.order_confirmation_no && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Order Confirmation Date</label>
            <input
              type="date"
              value={String(formData.order_confirmation_date ?? '')}
              onChange={e => handleChange('order_confirmation_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={String(formData.transaction_date ?? '')}
              onChange={e => handleChange('transaction_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Required By</label>
            <input
              type="date"
              value={String(formData.schedule_date ?? '')}
              onChange={e => handleChange('schedule_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_subcontracted}
              onChange={e => handleChange('is_subcontracted', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Subcontracted</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.has_unit_price_items}
              onChange={e => handleChange('has_unit_price_items', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Has Unit Price Items</label>
          </div>
          {!!formData.is_subcontracted && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.supplier_warehouse ?? '')}
                onChange={e => {
                  handleChange('supplier_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="supplier_warehouse"
              />
              {/* Link indicator */}
              {formData.supplier_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('supplier_warehouse', '')}
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
      {/* Section: Accounting Dimensions  */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Accounting Dimensions </h4>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Project (→ Project)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Project..."
                value={String(formData.project ?? '')}
                onChange={e => {
                  handleChange('project', e.target.value);
                  // TODO: Implement async search for Project
                  // fetch(`/api/resource/Project?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Project"
                data-fieldname="project"
              />
              {/* Link indicator */}
              {formData.project && (
                <button
                  type="button"
                  onClick={() => handleChange('project', '')}
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
      {/* Section: Currency and Price List */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Currency and Price List</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency (→ Currency)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Currency..."
                value={String(formData.currency ?? '')}
                onChange={e => {
                  handleChange('currency', e.target.value);
                  // TODO: Implement async search for Currency
                  // fetch(`/api/resource/Currency?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Currency"
                data-fieldname="currency"
              />
              {/* Link indicator */}
              {formData.currency && (
                <button
                  type="button"
                  onClick={() => handleChange('currency', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Exchange Rate</label>
            <input
              type="number"
              step="any"
              value={formData.conversion_rate != null ? Number(formData.conversion_rate) : ''}
              onChange={e => handleChange('conversion_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price List (→ Price List)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Price List..."
                value={String(formData.buying_price_list ?? '')}
                onChange={e => {
                  handleChange('buying_price_list', e.target.value);
                  // TODO: Implement async search for Price List
                  // fetch(`/api/resource/Price List?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Price List"
                data-fieldname="buying_price_list"
              />
              {/* Link indicator */}
              {formData.buying_price_list && (
                <button
                  type="button"
                  onClick={() => handleChange('buying_price_list', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price List Currency (→ Currency)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Currency..."
                value={String(formData.price_list_currency ?? '')}
                onChange={e => {
                  handleChange('price_list_currency', e.target.value);
                  // TODO: Implement async search for Currency
                  // fetch(`/api/resource/Currency?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Currency"
                data-fieldname="price_list_currency"
              />
              {/* Link indicator */}
              {formData.price_list_currency && (
                <button
                  type="button"
                  onClick={() => handleChange('price_list_currency', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price List Exchange Rate</label>
            <input
              type="number"
              step="any"
              value={formData.plc_conversion_rate != null ? Number(formData.plc_conversion_rate) : ''}
              onChange={e => handleChange('plc_conversion_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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
        </div>
      </div>
      {/* Section: before_items_section */}
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
          {!!formData.last_scanned_warehouse && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Scanned Warehouse</label>
            <input
              type="text"
              value={String(formData.last_scanned_warehouse ?? '')}
              onChange={e => handleChange('last_scanned_warehouse', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.is_internal_supplier && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Set From Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.set_from_warehouse ?? '')}
                onChange={e => {
                  handleChange('set_from_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="set_from_warehouse"
              />
              {/* Link indicator */}
              {formData.set_from_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('set_from_warehouse', '')}
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
            <label className="block text-sm font-medium text-gray-700">Set Target Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.set_warehouse ?? '')}
                onChange={e => {
                  handleChange('set_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="set_warehouse"
              />
              {/* Link indicator */}
              {formData.set_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('set_warehouse', '')}
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
      {/* Section: items_section */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: items → Purchase Order Item */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Items</label>
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
                  {(Array.isArray(formData.items) ? (formData.items as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.items) ? formData.items : [])];
                            rows.splice(idx, 1);
                            handleChange('items', rows);
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
                  onClick={() => handleChange('items', [...(Array.isArray(formData.items) ? formData.items : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: sb_last_purchase */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Quantity</label>
            <input
              type="number"
              step="any"
              value={formData.total_qty != null ? Number(formData.total_qty) : ''}
              onChange={e => handleChange('total_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.total_net_weight && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Net Weight</label>
            <input
              type="number"
              step="any"
              value={formData.total_net_weight != null ? Number(formData.total_net_weight) : ''}
              onChange={e => handleChange('total_net_weight', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Total (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_total != null ? Number(formData.base_total) : ''}
              onChange={e => handleChange('base_total', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Net Total (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_net_total != null ? Number(formData.base_net_total) : ''}
              onChange={e => handleChange('base_net_total', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total</label>
            <input
              type="number"
              step="any"
              value={formData.total != null ? Number(formData.total) : ''}
              onChange={e => handleChange('total', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Net Total</label>
            <input
              type="number"
              step="any"
              value={formData.net_total != null ? Number(formData.net_total) : ''}
              onChange={e => handleChange('net_total', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Pricing Rules */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Pricing Rules</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: pricing_rules → Pricing Rule Detail */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Purchase Order Pricing Rule</label>
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
                  {(Array.isArray(formData.pricing_rules) ? (formData.pricing_rules as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.pricing_rules) ? formData.pricing_rules : [])];
                            rows.splice(idx, 1);
                            handleChange('pricing_rules', rows);
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
                  onClick={() => handleChange('pricing_rules', [...(Array.isArray(formData.pricing_rules) ? formData.pricing_rules : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Raw Materials Supplied */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Raw Materials Supplied</h4>
        <div className="grid grid-cols-2 gap-4">
          {!!formData.supplied_items && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Set Reserve Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.set_reserve_warehouse ?? '')}
                onChange={e => {
                  handleChange('set_reserve_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="set_reserve_warehouse"
              />
              {/* Link indicator */}
              {formData.set_reserve_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('set_reserve_warehouse', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {/* Child table: supplied_items → Purchase Order Item Supplied */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Supplied Items</label>
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
                  {(Array.isArray(formData.supplied_items) ? (formData.supplied_items as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.supplied_items) ? formData.supplied_items : [])];
                            rows.splice(idx, 1);
                            handleChange('supplied_items', rows);
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
                  onClick={() => handleChange('supplied_items', [...(Array.isArray(formData.supplied_items) ? formData.supplied_items : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Taxes and Charges */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Taxes and Charges</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Category (→ Tax Category)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Tax Category..."
                value={String(formData.tax_category ?? '')}
                onChange={e => {
                  handleChange('tax_category', e.target.value);
                  // TODO: Implement async search for Tax Category
                  // fetch(`/api/resource/Tax Category?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Tax Category"
                data-fieldname="tax_category"
              />
              {/* Link indicator */}
              {formData.tax_category && (
                <button
                  type="button"
                  onClick={() => handleChange('tax_category', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Taxes and Charges Template (→ Purchase Taxes and Charges Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Purchase Taxes and Charges Template..."
                value={String(formData.taxes_and_charges ?? '')}
                onChange={e => {
                  handleChange('taxes_and_charges', e.target.value);
                  // TODO: Implement async search for Purchase Taxes and Charges Template
                  // fetch(`/api/resource/Purchase Taxes and Charges Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Purchase Taxes and Charges Template"
                data-fieldname="taxes_and_charges"
              />
              {/* Link indicator */}
              {formData.taxes_and_charges && (
                <button
                  type="button"
                  onClick={() => handleChange('taxes_and_charges', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Shipping Rule (→ Shipping Rule)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Shipping Rule..."
                value={String(formData.shipping_rule ?? '')}
                onChange={e => {
                  handleChange('shipping_rule', e.target.value);
                  // TODO: Implement async search for Shipping Rule
                  // fetch(`/api/resource/Shipping Rule?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Shipping Rule"
                data-fieldname="shipping_rule"
              />
              {/* Link indicator */}
              {formData.shipping_rule && (
                <button
                  type="button"
                  onClick={() => handleChange('shipping_rule', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Incoterm (→ Incoterm)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Incoterm..."
                value={String(formData.incoterm ?? '')}
                onChange={e => {
                  handleChange('incoterm', e.target.value);
                  // TODO: Implement async search for Incoterm
                  // fetch(`/api/resource/Incoterm?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Incoterm"
                data-fieldname="incoterm"
              />
              {/* Link indicator */}
              {formData.incoterm && (
                <button
                  type="button"
                  onClick={() => handleChange('incoterm', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {!!formData.incoterm && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Named Place</label>
            <input
              type="text"
              value={String(formData.named_place ?? '')}
              onChange={e => handleChange('named_place', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: section_break_52 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: taxes → Purchase Taxes and Charges */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Purchase Taxes and Charges</label>
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
      {/* Section: totals */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {!!formData.base_taxes_and_charges_added && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Taxes and Charges Added (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_taxes_and_charges_added != null ? Number(formData.base_taxes_and_charges_added) : ''}
              onChange={e => handleChange('base_taxes_and_charges_added', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.base_taxes_and_charges_deducted && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Taxes and Charges Deducted (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_taxes_and_charges_deducted != null ? Number(formData.base_taxes_and_charges_deducted) : ''}
              onChange={e => handleChange('base_taxes_and_charges_deducted', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.base_total_taxes_and_charges && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Taxes and Charges (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_total_taxes_and_charges != null ? Number(formData.base_total_taxes_and_charges) : ''}
              onChange={e => handleChange('base_total_taxes_and_charges', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.taxes_and_charges_added && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Taxes and Charges Added</label>
            <input
              type="number"
              step="any"
              value={formData.taxes_and_charges_added != null ? Number(formData.taxes_and_charges_added) : ''}
              onChange={e => handleChange('taxes_and_charges_added', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.taxes_and_charges_deducted && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Taxes and Charges Deducted</label>
            <input
              type="number"
              step="any"
              value={formData.taxes_and_charges_deducted != null ? Number(formData.taxes_and_charges_deducted) : ''}
              onChange={e => handleChange('taxes_and_charges_deducted', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Taxes and Charges</label>
            <input
              type="number"
              step="any"
              value={formData.total_taxes_and_charges != null ? Number(formData.total_taxes_and_charges) : ''}
              onChange={e => handleChange('total_taxes_and_charges', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Totals */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Totals</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Grand Total</label>
            <input
              type="number"
              step="any"
              value={formData.grand_total != null ? Number(formData.grand_total) : ''}
              onChange={e => handleChange('grand_total', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.disable_rounded_total}
              onChange={e => handleChange('disable_rounded_total', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Disable Rounded Total</label>
          </div>
          {!formData.disable_rounded_total && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Rounding Adjustment</label>
            <input
              type="number"
              step="any"
              value={formData.rounding_adjustment != null ? Number(formData.rounding_adjustment) : ''}
              onChange={e => handleChange('rounding_adjustment', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">In Words</label>
            <input
              type="text"
              value={String(formData.in_words ?? '')}
              onChange={e => handleChange('in_words', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rounded Total</label>
            <input
              type="number"
              step="any"
              value={formData.rounded_total != null ? Number(formData.rounded_total) : ''}
              onChange={e => handleChange('rounded_total', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Totals (Company Currency) */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Totals (Company Currency)</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Grand Total</label>
            <input
              type="number"
              step="any"
              value={formData.base_grand_total != null ? Number(formData.base_grand_total) : ''}
              onChange={e => handleChange('base_grand_total', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!formData.disable_rounded_total && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Rounding Adjustment</label>
            <input
              type="number"
              step="any"
              value={formData.base_rounding_adjustment != null ? Number(formData.base_rounding_adjustment) : ''}
              onChange={e => handleChange('base_rounding_adjustment', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">In Words</label>
            <input
              type="text"
              value={String(formData.base_in_words ?? '')}
              onChange={e => handleChange('base_in_words', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rounded Total</label>
            <input
              type="number"
              step="any"
              value={formData.base_rounded_total != null ? Number(formData.base_rounded_total) : ''}
              onChange={e => handleChange('base_rounded_total', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: section_break_tnkm */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Advance Paid (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.advance_paid != null ? Number(formData.advance_paid) : ''}
              onChange={e => handleChange('advance_paid', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Additional Discount */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Additional Discount</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Apply Additional Discount On</label>
            <select
              value={String(formData.apply_discount_on ?? '')}
              onChange={e => handleChange('apply_discount_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Grand Total">Grand Total</option>
              <option value="Net Total">Net Total</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Discount Amount (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_discount_amount != null ? Number(formData.base_discount_amount) : ''}
              onChange={e => handleChange('base_discount_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Discount Percentage</label>
            <input
              type="number"
              step="any"
              value={formData.additional_discount_percentage != null ? Number(formData.additional_discount_percentage) : ''}
              onChange={e => handleChange('additional_discount_percentage', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Discount Amount</label>
            <input
              type="number"
              step="any"
              value={formData.discount_amount != null ? Number(formData.discount_amount) : ''}
              onChange={e => handleChange('discount_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Tax Breakup */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Tax Breakup</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Taxes and Charges Calculation</label>
            <textarea
              value={String(formData.other_charges_calculation ?? '')}
              onChange={e => handleChange('other_charges_calculation', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {/* Child table: item_wise_tax_details → Item Wise Tax Detail */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Item Wise Tax Details</label>
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
                  {(Array.isArray(formData.item_wise_tax_details) ? (formData.item_wise_tax_details as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.item_wise_tax_details) ? formData.item_wise_tax_details : [])];
                            rows.splice(idx, 1);
                            handleChange('item_wise_tax_details', rows);
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
                  onClick={() => handleChange('item_wise_tax_details', [...(Array.isArray(formData.item_wise_tax_details) ? formData.item_wise_tax_details : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tab: Address & Contact */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Address & Contact</h3>
      </div>
      {/* Section: Supplier Address */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Supplier Address</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier Address (→ Address)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Address..."
                value={String(formData.supplier_address ?? '')}
                onChange={e => {
                  handleChange('supplier_address', e.target.value);
                  // TODO: Implement async search for Address
                  // fetch(`/api/resource/Address?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Address"
                data-fieldname="supplier_address"
              />
              {/* Link indicator */}
              {formData.supplier_address && (
                <button
                  type="button"
                  onClick={() => handleChange('supplier_address', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Supplier Address Details</label>
            <textarea
              value={String(formData.address_display ?? '')}
              onChange={e => handleChange('address_display', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier Group (→ Supplier Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Supplier Group..."
                value={String(formData.supplier_group ?? '')}
                onChange={e => {
                  handleChange('supplier_group', e.target.value);
                  // TODO: Implement async search for Supplier Group
                  // fetch(`/api/resource/Supplier Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Supplier Group"
                data-fieldname="supplier_group"
              />
              {/* Link indicator */}
              {formData.supplier_group && (
                <button
                  type="button"
                  onClick={() => handleChange('supplier_group', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier Contact (→ Contact)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Contact..."
                value={String(formData.contact_person ?? '')}
                onChange={e => {
                  handleChange('contact_person', e.target.value);
                  // TODO: Implement async search for Contact
                  // fetch(`/api/resource/Contact?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Contact"
                data-fieldname="contact_person"
              />
              {/* Link indicator */}
              {formData.contact_person && (
                <button
                  type="button"
                  onClick={() => handleChange('contact_person', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Contact Name</label>
            <textarea
              value={String(formData.contact_display ?? '')}
              onChange={e => handleChange('contact_display', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Contact Mobile No</label>
            <textarea
              value={String(formData.contact_mobile ?? '')}
              onChange={e => handleChange('contact_mobile', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <textarea
              value={String(formData.contact_email ?? '')}
              onChange={e => handleChange('contact_email', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Shipping Address */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Shipping Address</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Dispatch Address (→ Address)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Address..."
                value={String(formData.dispatch_address ?? '')}
                onChange={e => {
                  handleChange('dispatch_address', e.target.value);
                  // TODO: Implement async search for Address
                  // fetch(`/api/resource/Address?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Address"
                data-fieldname="dispatch_address"
              />
              {/* Link indicator */}
              {formData.dispatch_address && (
                <button
                  type="button"
                  onClick={() => handleChange('dispatch_address', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Dispatch Address Details</label>
            <textarea
              value={String(formData.dispatch_address_display ?? '')}
              onChange={e => handleChange('dispatch_address_display', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Shipping Address (→ Address)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Address..."
                value={String(formData.shipping_address ?? '')}
                onChange={e => {
                  handleChange('shipping_address', e.target.value);
                  // TODO: Implement async search for Address
                  // fetch(`/api/resource/Address?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Address"
                data-fieldname="shipping_address"
              />
              {/* Link indicator */}
              {formData.shipping_address && (
                <button
                  type="button"
                  onClick={() => handleChange('shipping_address', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Shipping Address Details</label>
            <textarea
              value={String(formData.shipping_address_display ?? '')}
              onChange={e => handleChange('shipping_address_display', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Company Billing Address */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Company Billing Address</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Billing Address (→ Address)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Address..."
                value={String(formData.billing_address ?? '')}
                onChange={e => {
                  handleChange('billing_address', e.target.value);
                  // TODO: Implement async search for Address
                  // fetch(`/api/resource/Address?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Address"
                data-fieldname="billing_address"
              />
              {/* Link indicator */}
              {formData.billing_address && (
                <button
                  type="button"
                  onClick={() => handleChange('billing_address', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Billing Address Details</label>
            <textarea
              value={String(formData.billing_address_display ?? '')}
              onChange={e => handleChange('billing_address_display', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Tab: Drop Ship */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Drop Ship</h3>
      </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              value={String(formData.customer_name ?? '')}
              onChange={e => handleChange('customer_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Contact (→ Contact)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Contact..."
                value={String(formData.customer_contact_person ?? '')}
                onChange={e => {
                  handleChange('customer_contact_person', e.target.value);
                  // TODO: Implement async search for Contact
                  // fetch(`/api/resource/Contact?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Contact"
                data-fieldname="customer_contact_person"
              />
              {/* Link indicator */}
              {formData.customer_contact_person && (
                <button
                  type="button"
                  onClick={() => handleChange('customer_contact_person', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Customer Contact</label>
            <textarea
              value={String(formData.customer_contact_display ?? '')}
              onChange={e => handleChange('customer_contact_display', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Customer Mobile No</label>
            <textarea
              value={String(formData.customer_contact_mobile ?? '')}
              onChange={e => handleChange('customer_contact_mobile', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Customer Contact Email</label>
            <textarea
              value={String(formData.customer_contact_email ?? '')}
              onChange={e => handleChange('customer_contact_email', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Tab: Terms */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Terms</h3>
      </div>
      {/* Section: Payment Terms */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Payment Terms</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Terms Template (→ Payment Terms Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Payment Terms Template..."
                value={String(formData.payment_terms_template ?? '')}
                onChange={e => {
                  handleChange('payment_terms_template', e.target.value);
                  // TODO: Implement async search for Payment Terms Template
                  // fetch(`/api/resource/Payment Terms Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Payment Terms Template"
                data-fieldname="payment_terms_template"
              />
              {/* Link indicator */}
              {formData.payment_terms_template && (
                <button
                  type="button"
                  onClick={() => handleChange('payment_terms_template', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {/* Child table: payment_schedule → Payment Schedule */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Payment Schedule</label>
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
                  {(Array.isArray(formData.payment_schedule) ? (formData.payment_schedule as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.payment_schedule) ? formData.payment_schedule : [])];
                            rows.splice(idx, 1);
                            handleChange('payment_schedule', rows);
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
                  onClick={() => handleChange('payment_schedule', [...(Array.isArray(formData.payment_schedule) ? formData.payment_schedule : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Terms & Conditions */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Terms & Conditions</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Terms (→ Terms and Conditions)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Terms and Conditions..."
                value={String(formData.tc_name ?? '')}
                onChange={e => {
                  handleChange('tc_name', e.target.value);
                  // TODO: Implement async search for Terms and Conditions
                  // fetch(`/api/resource/Terms and Conditions?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Terms and Conditions"
                data-fieldname="tc_name"
              />
              {/* Link indicator */}
              {formData.tc_name && (
                <button
                  type="button"
                  onClick={() => handleChange('tc_name', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Terms and Conditions</label>
            <textarea
              value={String(formData.terms ?? '')}
              onChange={e => handleChange('terms', e.target.value)}
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
      {/* Section: Order Status */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Order Status</h4>
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
              <option value="On Hold">On Hold</option>
              <option value="To Receive and Bill">To Receive and Bill</option>
              <option value="To Bill">To Bill</option>
              <option value="To Receive">To Receive</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Closed">Closed</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Advance Payment Status</label>
            <select
              value={String(formData.advance_payment_status ?? '')}
              onChange={e => handleChange('advance_payment_status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Not Initiated">Not Initiated</option>
              <option value="Initiated">Initiated</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Fully Paid">Fully Paid</option>
            </select>
          </div>
          {!formData.__islocal && (
          <div>
            <label className="block text-sm font-medium text-gray-700">% Billed</label>
            <input
              type="number"
              step="any"
              value={formData.per_billed != null ? Number(formData.per_billed) : ''}
              onChange={e => handleChange('per_billed', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!formData.__islocal && (
          <div>
            <label className="block text-sm font-medium text-gray-700">% Received</label>
            <input
              type="number"
              step="any"
              value={formData.per_received != null ? Number(formData.per_received) : ''}
              onChange={e => handleChange('per_received', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Printing Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Printing Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Letter Head (→ Letter Head)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Letter Head..."
                value={String(formData.letter_head ?? '')}
                onChange={e => {
                  handleChange('letter_head', e.target.value);
                  // TODO: Implement async search for Letter Head
                  // fetch(`/api/resource/Letter Head?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Letter Head"
                data-fieldname="letter_head"
              />
              {/* Link indicator */}
              {formData.letter_head && (
                <button
                  type="button"
                  onClick={() => handleChange('letter_head', '')}
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
              checked={!!formData.group_same_items}
              onChange={e => handleChange('group_same_items', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Group same items</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Print Heading (→ Print Heading)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Print Heading..."
                value={String(formData.select_print_heading ?? '')}
                onChange={e => {
                  handleChange('select_print_heading', e.target.value);
                  // TODO: Implement async search for Print Heading
                  // fetch(`/api/resource/Print Heading?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Print Heading"
                data-fieldname="select_print_heading"
              />
              {/* Link indicator */}
              {formData.select_print_heading && (
                <button
                  type="button"
                  onClick={() => handleChange('select_print_heading', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Print Language</label>
            <input
              type="text"
              value={String(formData.language ?? '')}
              onChange={e => handleChange('language', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Auto Repeat */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Auto Repeat</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={String(formData.from_date ?? '')}
              onChange={e => handleChange('from_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={String(formData.to_date ?? '')}
              onChange={e => handleChange('to_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Auto Repeat (→ Auto Repeat)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Auto Repeat..."
                value={String(formData.auto_repeat ?? '')}
                onChange={e => {
                  handleChange('auto_repeat', e.target.value);
                  // TODO: Implement async search for Auto Repeat
                  // fetch(`/api/resource/Auto Repeat?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Auto Repeat"
                data-fieldname="auto_repeat"
              />
              {/* Link indicator */}
              {formData.auto_repeat && (
                <button
                  type="button"
                  onClick={() => handleChange('auto_repeat', '')}
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
      {/* Section: Additional Info */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Additional Info</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Party Account Currency (→ Currency)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Currency..."
                value={String(formData.party_account_currency ?? '')}
                onChange={e => {
                  handleChange('party_account_currency', e.target.value);
                  // TODO: Implement async search for Currency
                  // fetch(`/api/resource/Currency?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Currency"
                data-fieldname="party_account_currency"
              />
              {/* Link indicator */}
              {formData.party_account_currency && (
                <button
                  type="button"
                  onClick={() => handleChange('party_account_currency', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Represents Company (→ Company)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Company..."
                value={String(formData.represents_company ?? '')}
                onChange={e => {
                  handleChange('represents_company', e.target.value);
                  // TODO: Implement async search for Company
                  // fetch(`/api/resource/Company?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Company"
                data-fieldname="represents_company"
              />
              {/* Link indicator */}
              {formData.represents_company && (
                <button
                  type="button"
                  onClick={() => handleChange('represents_company', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier Quotation (→ Supplier Quotation)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Supplier Quotation..."
                value={String(formData.ref_sq ?? '')}
                onChange={e => {
                  handleChange('ref_sq', e.target.value);
                  // TODO: Implement async search for Supplier Quotation
                  // fetch(`/api/resource/Supplier Quotation?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Supplier Quotation"
                data-fieldname="ref_sq"
              />
              {/* Link indicator */}
              {formData.ref_sq && (
                <button
                  type="button"
                  onClick={() => handleChange('ref_sq', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Purchase Order)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Purchase Order..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Purchase Order
                  // fetch(`/api/resource/Purchase Order?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Purchase Order"
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
          <div>
            <label className="block text-sm font-medium text-gray-700">MPS (→ Master Production Schedule)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Master Production Schedule..."
                value={String(formData.mps ?? '')}
                onChange={e => {
                  handleChange('mps', e.target.value);
                  // TODO: Implement async search for Master Production Schedule
                  // fetch(`/api/resource/Master Production Schedule?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Master Production Schedule"
                data-fieldname="mps"
              />
              {/* Link indicator */}
              {formData.mps && (
                <button
                  type="button"
                  onClick={() => handleChange('mps', '')}
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
              checked={!!formData.is_internal_supplier}
              onChange={e => handleChange('is_internal_supplier', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Internal Supplier</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Inter Company Order Reference (→ Sales Order)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Order..."
                value={String(formData.inter_company_order_reference ?? '')}
                onChange={e => {
                  handleChange('inter_company_order_reference', e.target.value);
                  // TODO: Implement async search for Sales Order
                  // fetch(`/api/resource/Sales Order?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Order"
                data-fieldname="inter_company_order_reference"
              />
              {/* Link indicator */}
              {formData.inter_company_order_reference && (
                <button
                  type="button"
                  onClick={() => handleChange('inter_company_order_reference', '')}
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
              checked={!!formData.is_old_subcontracting_flow}
              onChange={e => handleChange('is_old_subcontracting_flow', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Old Subcontracting Flow</label>
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