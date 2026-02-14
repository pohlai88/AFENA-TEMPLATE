// Form scaffold for Sales Order Item
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SalesOrderItem } from '../types/sales-order-item.js';

interface SalesOrderItemFormProps {
  initialData?: Partial<SalesOrderItem>;
  onSubmit: (data: Partial<SalesOrderItem>) => void;
  mode: 'create' | 'edit';
}

export function SalesOrderItemForm({ initialData = {}, onSubmit, mode }: SalesOrderItemFormProps) {
  const [formData, setFormData] = useState<Partial<SalesOrderItem>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Sales Order Item' : 'New Sales Order Item'}</h2>
          {parent.is_subcontracted && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Finished Good (→ Item)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Item..."
                value={String(formData.fg_item ?? '')}
                onChange={e => {
                  handleChange('fg_item', e.target.value);
                  // TODO: Implement async search for Item
                  // fetch(`/api/resource/Item?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Item"
                data-fieldname="fg_item"
              />
              {/* Link indicator */}
              {formData.fg_item && (
                <button
                  type="button"
                  onClick={() => handleChange('fg_item', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {parent.is_subcontracted && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Finished Good Qty</label>
            <input
              type="number"
              step="any"
              value={formData.fg_item_qty != null ? Number(formData.fg_item_qty) : ''}
              onChange={e => handleChange('fg_item_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
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
            <label className="block text-sm font-medium text-gray-700">Customer's Item Code</label>
            <input
              type="text"
              value={String(formData.customer_item_code ?? '')}
              onChange={e => handleChange('customer_item_code', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.ensure_delivery_based_on_produced_serial_no}
              onChange={e => handleChange('ensure_delivery_based_on_produced_serial_no', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Ensure Delivery Based on Produced Serial No</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_stock_item}
              onChange={e => handleChange('is_stock_item', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Stock Item</label>
          </div>
          {(formData.is_stock_item && !parent.is_subcontracted) && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.reserve_stock}
              onChange={e => handleChange('reserve_stock', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Reserve Stock</label>
          </div>
          )}
          {!parent.skip_delivery_note && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery Date</label>
            <input
              type="date"
              value={String(formData.delivery_date ?? '')}
              onChange={e => handleChange('delivery_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              value={String(formData.item_name ?? '')}
              onChange={e => handleChange('item_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
            <label className="block text-sm font-medium text-gray-700">Brand Name (→ Brand)</label>
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
      {/* Section: Image */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Image</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image View</label>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>
      </div>
      {/* Section: Quantity and Rate */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Quantity and Rate</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              step="any"
              value={formData.qty != null ? Number(formData.qty) : ''}
              onChange={e => handleChange('qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          {formData.uom !== formData.stock_uom && (
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
          )}
          {parent.is_subcontracted && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Subcontracted Quantity</label>
            <input
              type="number"
              step="any"
              value={formData.subcontracted_qty != null ? Number(formData.subcontracted_qty) : ''}
              onChange={e => handleChange('subcontracted_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">UOM (→ UOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UOM..."
                value={String(formData.uom ?? '')}
                onChange={e => {
                  handleChange('uom', e.target.value);
                  // TODO: Implement async search for UOM
                  // fetch(`/api/resource/UOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="UOM"
                data-fieldname="uom"
              />
              {/* Link indicator */}
              {formData.uom && (
                <button
                  type="button"
                  onClick={() => handleChange('uom', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {formData.uom !== formData.stock_uom && (
          <div>
            <label className="block text-sm font-medium text-gray-700">UOM Conversion Factor</label>
            <input
              type="number"
              step="any"
              value={formData.conversion_factor != null ? Number(formData.conversion_factor) : ''}
              onChange={e => handleChange('conversion_factor', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          )}
          {formData.uom !== formData.stock_uom && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Qty as per Stock UOM</label>
            <input
              type="number"
              step="any"
              value={formData.stock_qty != null ? Number(formData.stock_qty) : ''}
              onChange={e => handleChange('stock_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.stock_reserved_qty && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Reserved Qty (in Stock UOM)</label>
            <input
              type="number"
              step="any"
              value={formData.stock_reserved_qty != null ? Number(formData.stock_reserved_qty) : ''}
              onChange={e => handleChange('stock_reserved_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: section_break_16 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price List Rate</label>
            <input
              type="number"
              step="any"
              value={formData.price_list_rate != null ? Number(formData.price_list_rate) : ''}
              onChange={e => handleChange('price_list_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price List Rate (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_price_list_rate != null ? Number(formData.base_price_list_rate) : ''}
              onChange={e => handleChange('base_price_list_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Discount and Margin */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Discount and Margin</h4>
        <div className="grid grid-cols-2 gap-4">
          {!!formData.price_list_rate && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Margin Type</label>
            <select
              value={String(formData.margin_type ?? '')}
              onChange={e => handleChange('margin_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Percentage">Percentage</option>
              <option value="Amount">Amount</option>
            </select>
          </div>
          )}
          {formData.margin_type && formData.price_list_rate && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Margin Rate or Amount</label>
            <input
              type="number"
              step="any"
              value={formData.margin_rate_or_amount != null ? Number(formData.margin_rate_or_amount) : ''}
              onChange={e => handleChange('margin_rate_or_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.margin_type && formData.price_list_rate && formData.margin_rate_or_amount && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Rate With Margin</label>
            <input
              type="number"
              step="any"
              value={formData.rate_with_margin != null ? Number(formData.rate_with_margin) : ''}
              onChange={e => handleChange('rate_with_margin', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.price_list_rate && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount (%) on Price List Rate with Margin</label>
            <input
              type="number"
              step="any"
              value={formData.discount_percentage != null ? Number(formData.discount_percentage) : ''}
              onChange={e => handleChange('discount_percentage', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.price_list_rate && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount Amount</label>
            <input
              type="number"
              step="any"
              value={formData.discount_amount != null ? Number(formData.discount_amount) : ''}
              onChange={e => handleChange('discount_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Distributed Discount Amount</label>
            <input
              type="number"
              step="any"
              value={formData.distributed_discount_amount != null ? Number(formData.distributed_discount_amount) : ''}
              onChange={e => handleChange('distributed_discount_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {formData.margin_type && formData.price_list_rate && formData.margin_rate_or_amount && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Rate With Margin (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_rate_with_margin != null ? Number(formData.base_rate_with_margin) : ''}
              onChange={e => handleChange('base_rate_with_margin', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: section_break_simple1 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {formData.type !== "" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Rate</label>
            <input
              type="number"
              step="any"
              value={formData.rate != null ? Number(formData.rate) : ''}
              onChange={e => handleChange('rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              step="any"
              value={formData.amount != null ? Number(formData.amount) : ''}
              onChange={e => handleChange('amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Tax Template (→ Item Tax Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Item Tax Template..."
                value={String(formData.item_tax_template ?? '')}
                onChange={e => {
                  handleChange('item_tax_template', e.target.value);
                  // TODO: Implement async search for Item Tax Template
                  // fetch(`/api/resource/Item Tax Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Item Tax Template"
                data-fieldname="item_tax_template"
              />
              {/* Link indicator */}
              {formData.item_tax_template && (
                <button
                  type="button"
                  onClick={() => handleChange('item_tax_template', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Basic Rate (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_rate != null ? Number(formData.base_rate) : ''}
              onChange={e => handleChange('base_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_amount != null ? Number(formData.base_amount) : ''}
              onChange={e => handleChange('base_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Pricing Rules</label>
            <textarea
              value={String(formData.pricing_rules ?? '')}
              onChange={e => handleChange('pricing_rules', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {formData.uom !== formData.stock_uom && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Rate of Stock UOM</label>
            <input
              type="number"
              step="any"
              value={formData.stock_uom_rate != null ? Number(formData.stock_uom_rate) : ''}
              onChange={e => handleChange('stock_uom_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_free_item}
              onChange={e => handleChange('is_free_item', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Free Item</label>
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
        </div>
      </div>
      {/* Section: section_break_24 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Net Rate</label>
            <input
              type="number"
              step="any"
              value={formData.net_rate != null ? Number(formData.net_rate) : ''}
              onChange={e => handleChange('net_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Net Amount</label>
            <input
              type="number"
              step="any"
              value={formData.net_amount != null ? Number(formData.net_amount) : ''}
              onChange={e => handleChange('net_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Net Rate (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_net_rate != null ? Number(formData.base_net_rate) : ''}
              onChange={e => handleChange('base_net_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Net Amount (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_net_amount != null ? Number(formData.base_net_amount) : ''}
              onChange={e => handleChange('base_net_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Billed Amt</label>
            <input
              type="number"
              step="any"
              value={formData.billed_amt != null ? Number(formData.billed_amt) : ''}
              onChange={e => handleChange('billed_amt', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Gross Profit</label>
            <input
              type="number"
              step="any"
              value={formData.gross_profit != null ? Number(formData.gross_profit) : ''}
              onChange={e => handleChange('gross_profit', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Drop Ship */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Drop Ship</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.delivered_by_supplier}
              onChange={e => handleChange('delivered_by_supplier', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Supplier delivers to Customer</label>
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
        </div>
      </div>
      {/* Section: Item Weight Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Item Weight Details</h4>
        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Weight</label>
            <input
              type="number"
              step="any"
              value={formData.total_weight != null ? Number(formData.total_weight) : ''}
              onChange={e => handleChange('total_weight', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
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
        </div>
      </div>
      {/* Section: Warehouse and Reference */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Warehouse and Reference</h4>
        <div className="grid grid-cols-2 gap-4">
          {formData.delivered_by_supplier!==1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery Warehouse (→ Warehouse)</label>
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
          )}
          {formData.delivered_by_supplier!==1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Warehouse (Optional) (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.target_warehouse ?? '')}
                onChange={e => {
                  handleChange('target_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="target_warehouse"
              />
              {/* Link indicator */}
              {formData.target_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('target_warehouse', '')}
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
            <label className="block text-sm font-medium text-gray-700">Quotation (→ Quotation)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Quotation..."
                value={String(formData.prevdoc_docname ?? '')}
                onChange={e => {
                  handleChange('prevdoc_docname', e.target.value);
                  // TODO: Implement async search for Quotation
                  // fetch(`/api/resource/Quotation?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Quotation"
                data-fieldname="prevdoc_docname"
              />
              {/* Link indicator */}
              {formData.prevdoc_docname && (
                <button
                  type="button"
                  onClick={() => handleChange('prevdoc_docname', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">quotation_item</label>
            <input
              type="text"
              value={String(formData.quotation_item ?? '')}
              onChange={e => handleChange('quotation_item', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.against_blanket_order}
              onChange={e => handleChange('against_blanket_order', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Against Blanket Order</label>
          </div>
          {!!formData.against_blanket_order && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Blanket Order (→ Blanket Order)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Blanket Order..."
                value={String(formData.blanket_order ?? '')}
                onChange={e => {
                  handleChange('blanket_order', e.target.value);
                  // TODO: Implement async search for Blanket Order
                  // fetch(`/api/resource/Blanket Order?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Blanket Order"
                data-fieldname="blanket_order"
              />
              {/* Link indicator */}
              {formData.blanket_order && (
                <button
                  type="button"
                  onClick={() => handleChange('blanket_order', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {!!formData.against_blanket_order && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Blanket Order Rate</label>
            <input
              type="number"
              step="any"
              value={formData.blanket_order_rate != null ? Number(formData.blanket_order_rate) : ''}
              onChange={e => handleChange('blanket_order_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Available Quantity */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Available Quantity</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Qty (Warehouse)</label>
            <input
              type="number"
              step="any"
              value={formData.actual_qty != null ? Number(formData.actual_qty) : ''}
              onChange={e => handleChange('actual_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Qty (Company)</label>
            <input
              type="number"
              step="any"
              value={formData.company_total_stock != null ? Number(formData.company_total_stock) : ''}
              onChange={e => handleChange('company_total_stock', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Sales Order Schedule */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Sales Order Schedule</h4>
        <div className="grid grid-cols-2 gap-4">
        </div>
      </div>
      {/* Section: Manufacturing Section */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Manufacturing Section</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">BOM No (→ BOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search BOM..."
                value={String(formData.bom_no ?? '')}
                onChange={e => {
                  handleChange('bom_no', e.target.value);
                  // TODO: Implement async search for BOM
                  // fetch(`/api/resource/BOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="BOM"
                data-fieldname="bom_no"
              />
              {/* Link indicator */}
              {formData.bom_no && (
                <button
                  type="button"
                  onClick={() => handleChange('bom_no', '')}
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
      {/* Section: Planning */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Planning</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Projected Qty</label>
            <input
              type="number"
              step="any"
              value={formData.projected_qty != null ? Number(formData.projected_qty) : ''}
              onChange={e => handleChange('projected_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ordered Qty</label>
            <input
              type="number"
              step="any"
              value={formData.ordered_qty != null ? Number(formData.ordered_qty) : ''}
              onChange={e => handleChange('ordered_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Planned Quantity</label>
            <input
              type="number"
              step="any"
              value={formData.planned_qty != null ? Number(formData.planned_qty) : ''}
              onChange={e => handleChange('planned_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Production Plan Qty</label>
            <input
              type="number"
              step="any"
              value={formData.production_plan_qty != null ? Number(formData.production_plan_qty) : ''}
              onChange={e => handleChange('production_plan_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Work Order Qty</label>
            <input
              type="number"
              step="any"
              value={formData.work_order_qty != null ? Number(formData.work_order_qty) : ''}
              onChange={e => handleChange('work_order_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Delivered Qty</label>
            <input
              type="number"
              step="any"
              value={formData.delivered_qty != null ? Number(formData.delivered_qty) : ''}
              onChange={e => handleChange('delivered_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Produced Quantity</label>
            <input
              type="number"
              step="any"
              value={formData.produced_qty != null ? Number(formData.produced_qty) : ''}
              onChange={e => handleChange('produced_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.returned_qty && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Returned Qty</label>
            <input
              type="number"
              step="any"
              value={formData.returned_qty != null ? Number(formData.returned_qty) : ''}
              onChange={e => handleChange('returned_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Picked Qty (in Stock UOM)</label>
            <input
              type="number"
              step="any"
              value={formData.picked_qty != null ? Number(formData.picked_qty) : ''}
              onChange={e => handleChange('picked_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Shopping Cart */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Shopping Cart</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
            <textarea
              value={String(formData.additional_notes ?? '')}
              onChange={e => handleChange('additional_notes', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: section_break_63 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.page_break}
              onChange={e => handleChange('page_break', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Page Break</label>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Item Tax Rate</label>
            <textarea
              value={String(formData.item_tax_rate ?? '')}
              onChange={e => handleChange('item_tax_rate', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Order Date</label>
            <input
              type="date"
              value={String(formData.transaction_date ?? '')}
              onChange={e => handleChange('transaction_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Inter Transfer Reference */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Inter Transfer Reference</h4>
        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Order (→ Purchase Order)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Purchase Order..."
                value={String(formData.purchase_order ?? '')}
                onChange={e => {
                  handleChange('purchase_order', e.target.value);
                  // TODO: Implement async search for Purchase Order
                  // fetch(`/api/resource/Purchase Order?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Purchase Order"
                data-fieldname="purchase_order"
              />
              {/* Link indicator */}
              {formData.purchase_order && (
                <button
                  type="button"
                  onClick={() => handleChange('purchase_order', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Material Request Item</label>
            <input
              type="text"
              value={String(formData.material_request_item ?? '')}
              onChange={e => handleChange('material_request_item', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Order Item</label>
            <input
              type="text"
              value={String(formData.purchase_order_item ?? '')}
              onChange={e => handleChange('purchase_order_item', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
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

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}