// Form scaffold for Delivery Note Item
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { DeliveryNoteItem } from '../types/delivery-note-item.js';

interface DeliveryNoteItemFormProps {
  initialData?: Partial<DeliveryNoteItem>;
  onSubmit: (data: Partial<DeliveryNoteItem>) => void;
  mode: 'create' | 'edit';
}

export function DeliveryNoteItemForm({ initialData = {}, onSubmit, mode }: DeliveryNoteItemFormProps) {
  const [formData, setFormData] = useState<Partial<DeliveryNoteItem>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Delivery Note Item' : 'New Delivery Note Item'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Barcode</label>
            <input
              type="text"
              value={String(formData.barcode ?? '')}
              onChange={e => handleChange('barcode', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.barcode && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.has_item_scanned}
              onChange={e => handleChange('has_item_scanned', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Has Item Scanned</label>
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
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              value={String(formData.item_name ?? '')}
              onChange={e => handleChange('item_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
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
        </div>
      </div>
      {/* Section: stock_qty_sec_break */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {formData.uom !== formData.stock_uom && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Qty in Stock UOM</label>
            <input
              type="number"
              step="any"
              value={formData.stock_qty != null ? Number(formData.stock_qty) : ''}
              onChange={e => handleChange('stock_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.returned_qty && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Returned Qty in Stock UOM</label>
            <input
              type="number"
              step="any"
              value={formData.returned_qty != null ? Number(formData.returned_qty) : ''}
              onChange={e => handleChange('returned_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: section_break_17 */}
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
      {/* Section: section_break_1 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-gray-700">Rate (Company Currency)</label>
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
      {/* Section: section_break_25 */}
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
            <label className="block text-sm font-medium text-gray-700">Incoming Rate</label>
            <input
              type="number"
              step="any"
              value={formData.incoming_rate != null ? Number(formData.incoming_rate) : ''}
              onChange={e => handleChange('incoming_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Warehouse (→ Warehouse)</label>
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
          {parent.is_internal_customer || formData.target_warehouse && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Warehouse (→ Warehouse)</label>
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
          {!formData.__islocal && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Quality Inspection (→ Quality Inspection)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Quality Inspection..."
                value={String(formData.quality_inspection ?? '')}
                onChange={e => {
                  handleChange('quality_inspection', e.target.value);
                  // TODO: Implement async search for Quality Inspection
                  // fetch(`/api/resource/Quality Inspection?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Quality Inspection"
                data-fieldname="quality_inspection"
              />
              {/* Link indicator */}
              {formData.quality_inspection && (
                <button
                  type="button"
                  onClick={() => handleChange('quality_inspection', '')}
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
              checked={!!formData.allow_zero_valuation_rate}
              onChange={e => handleChange('allow_zero_valuation_rate', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Zero Valuation Rate</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Against Sales Order (→ Sales Order)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Order..."
                value={String(formData.against_sales_order ?? '')}
                onChange={e => {
                  handleChange('against_sales_order', e.target.value);
                  // TODO: Implement async search for Sales Order
                  // fetch(`/api/resource/Sales Order?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Order"
                data-fieldname="against_sales_order"
              />
              {/* Link indicator */}
              {formData.against_sales_order && (
                <button
                  type="button"
                  onClick={() => handleChange('against_sales_order', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Against Sales Order Item</label>
            <input
              type="text"
              value={String(formData.so_detail ?? '')}
              onChange={e => handleChange('so_detail', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Against Sales Invoice (→ Sales Invoice)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Invoice..."
                value={String(formData.against_sales_invoice ?? '')}
                onChange={e => {
                  handleChange('against_sales_invoice', e.target.value);
                  // TODO: Implement async search for Sales Invoice
                  // fetch(`/api/resource/Sales Invoice?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Invoice"
                data-fieldname="against_sales_invoice"
              />
              {/* Link indicator */}
              {formData.against_sales_invoice && (
                <button
                  type="button"
                  onClick={() => handleChange('against_sales_invoice', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Against Sales Invoice Item</label>
            <input
              type="text"
              value={String(formData.si_detail ?? '')}
              onChange={e => handleChange('si_detail', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Against Delivery Note Item</label>
            <input
              type="text"
              value={String(formData.dn_detail ?? '')}
              onChange={e => handleChange('dn_detail', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Against Pick List (→ Pick List)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Pick List..."
                value={String(formData.against_pick_list ?? '')}
                onChange={e => {
                  handleChange('against_pick_list', e.target.value);
                  // TODO: Implement async search for Pick List
                  // fetch(`/api/resource/Pick List?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Pick List"
                data-fieldname="against_pick_list"
              />
              {/* Link indicator */}
              {formData.against_pick_list && (
                <button
                  type="button"
                  onClick={() => handleChange('against_pick_list', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pick List Item</label>
            <input
              type="text"
              value={String(formData.pick_list_item ?? '')}
              onChange={e => handleChange('pick_list_item', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Serial and Batch No */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Serial and Batch No</h4>
        <div className="grid grid-cols-2 gap-4">
          {formData.use_serial_batch_fields ==== 0 || formData.docstatus ==== 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Serial and Batch Bundle (→ Serial and Batch Bundle)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Serial and Batch Bundle..."
                value={String(formData.serial_and_batch_bundle ?? '')}
                onChange={e => {
                  handleChange('serial_and_batch_bundle', e.target.value);
                  // TODO: Implement async search for Serial and Batch Bundle
                  // fetch(`/api/resource/Serial and Batch Bundle?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Serial and Batch Bundle"
                data-fieldname="serial_and_batch_bundle"
              />
              {/* Link indicator */}
              {formData.serial_and_batch_bundle && (
                <button
                  type="button"
                  onClick={() => handleChange('serial_and_batch_bundle', '')}
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
              checked={!!formData.use_serial_batch_fields}
              onChange={e => handleChange('use_serial_batch_fields', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Use Serial No / Batch Fields</label>
          </div>
        </div>
      </div>
      {/* Section: section_break_qyjv */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {formData.use_serial_batch_fields ==== 1 && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Serial No</label>
            <textarea
              value={String(formData.serial_no ?? '')}
              onChange={e => handleChange('serial_no', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.use_serial_batch_fields ==== 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Batch No (→ Batch)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Batch..."
                value={String(formData.batch_no ?? '')}
                onChange={e => {
                  handleChange('batch_no', e.target.value);
                  // TODO: Implement async search for Batch
                  // fetch(`/api/resource/Batch?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Batch"
                data-fieldname="batch_no"
              />
              {/* Link indicator */}
              {formData.batch_no && (
                <button
                  type="button"
                  onClick={() => handleChange('batch_no', '')}
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
      {/* Section: Available Qty */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Available Qty</h4>
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
          {!!formData.batch_no && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Available Batch Qty at From Warehouse</label>
            <input
              type="number"
              step="any"
              value={formData.actual_batch_qty != null ? Number(formData.actual_batch_qty) : ''}
              onChange={e => handleChange('actual_batch_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
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
      {/* Section: section_break_kejd */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Installed Qty</label>
            <input
              type="number"
              step="any"
              value={formData.installed_qty != null ? Number(formData.installed_qty) : ''}
              onChange={e => handleChange('installed_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.packed_qty && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Packed Qty</label>
            <input
              type="number"
              step="any"
              value={formData.packed_qty != null ? Number(formData.packed_qty) : ''}
              onChange={e => handleChange('packed_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {parent.is_internal_customer && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Received Qty</label>
            <input
              type="number"
              step="any"
              value={formData.received_qty != null ? Number(formData.received_qty) : ''}
              onChange={e => handleChange('received_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Accounting Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Accounting Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Expense Account (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.expense_account ?? '')}
                onChange={e => {
                  handleChange('expense_account', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="expense_account"
              />
              {/* Link indicator */}
              {formData.expense_account && (
                <button
                  type="button"
                  onClick={() => handleChange('expense_account', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
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
        </div>
      </div>
      {/* Section: Internal Transfer */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Internal Transfer</h4>
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
            <label className="block text-sm font-medium text-gray-700">Purchase Order Item</label>
            <input
              type="text"
              value={String(formData.purchase_order_item ?? '')}
              onChange={e => handleChange('purchase_order_item', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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
      {/* Section: section_break_72 */}
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