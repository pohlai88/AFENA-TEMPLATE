// Form scaffold for Purchase Receipt Item
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PurchaseReceiptItem } from '../types/purchase-receipt-item.js';

interface PurchaseReceiptItemFormProps {
  initialData?: Partial<PurchaseReceiptItem>;
  onSubmit: (data: Partial<PurchaseReceiptItem>) => void;
  mode: 'create' | 'edit';
}

export function PurchaseReceiptItemForm({ initialData = {}, onSubmit, mode }: PurchaseReceiptItemFormProps) {
  const [formData, setFormData] = useState<Partial<PurchaseReceiptItem>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Purchase Receipt Item' : 'New Purchase Receipt Item'}</h2>
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
      {/* Section: section_break_2 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-gray-700">Product Bundle (→ Product Bundle)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Product Bundle..."
                value={String(formData.product_bundle ?? '')}
                onChange={e => {
                  handleChange('product_bundle', e.target.value);
                  // TODO: Implement async search for Product Bundle
                  // fetch(`/api/resource/Product Bundle?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Product Bundle"
                data-fieldname="product_bundle"
              />
              {/* Link indicator */}
              {formData.product_bundle && (
                <button
                  type="button"
                  onClick={() => handleChange('product_bundle', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier Part Number</label>
            <input
              type="text"
              value={String(formData.supplier_part_no ?? '')}
              onChange={e => handleChange('supplier_part_no', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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
      {/* Section: Received and Accepted */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Received and Accepted</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Received Quantity</label>
            <input
              type="number"
              step="any"
              value={formData.received_qty != null ? Number(formData.received_qty) : ''}
              onChange={e => handleChange('received_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Accepted Quantity</label>
            <input
              type="number"
              step="any"
              value={formData.qty != null ? Number(formData.qty) : ''}
              onChange={e => handleChange('qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rejected Quantity</label>
            <input
              type="number"
              step="any"
              value={formData.rejected_qty != null ? Number(formData.rejected_qty) : ''}
              onChange={e => handleChange('rejected_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
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
          {formData.uom !== formData.stock_uom && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Conversion Factor</label>
            <input
              type="number"
              step="any"
              value={formData.conversion_factor != null ? Number(formData.conversion_factor) : ''}
              onChange={e => handleChange('conversion_factor', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.retain_sample}
              onChange={e => handleChange('retain_sample', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Retain Sample</label>
          </div>
          {!!formData.retain_sample && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Sample Quantity</label>
            <input
              type="number"
              step="1"
              value={formData.sample_quantity != null ? Number(formData.sample_quantity) : ''}
              onChange={e => handleChange('sample_quantity', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Qty as Per Stock UOM */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Qty as Per Stock UOM</h4>
        <div className="grid grid-cols-2 gap-4">
          {formData.uom !== formData.stock_uom && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Received Qty in Stock UOM</label>
            <input
              type="number"
              step="any"
              value={formData.received_stock_qty != null ? Number(formData.received_stock_qty) : ''}
              onChange={e => handleChange('received_stock_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.uom !== formData.stock_uom && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Accepted Qty in Stock UOM</label>
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
      {/* Section: Rate and Amount */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Rate and Amount</h4>
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
            <label className="block text-sm font-medium text-gray-700">Discount on Price List Rate (%)</label>
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
      {/* Section: sec_break1 */}
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
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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
        </div>
      </div>
      {/* Section: section_break_29 */}
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
            <label className="block text-sm font-medium text-gray-700">Sales Incoming Rate</label>
            <input
              type="number"
              step="any"
              value={formData.sales_incoming_rate != null ? Number(formData.sales_incoming_rate) : ''}
              onChange={e => handleChange('sales_incoming_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Tax Amount Included in Value</label>
            <input
              type="number"
              step="any"
              value={formData.item_tax_amount != null ? Number(formData.item_tax_amount) : ''}
              onChange={e => handleChange('item_tax_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Raw Materials Supplied Cost</label>
            <input
              type="number"
              step="any"
              value={formData.rm_supp_cost != null ? Number(formData.rm_supp_cost) : ''}
              onChange={e => handleChange('rm_supp_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Landed Cost Voucher Amount</label>
            <input
              type="number"
              step="any"
              value={formData.landed_cost_voucher_amount != null ? Number(formData.landed_cost_voucher_amount) : ''}
              onChange={e => handleChange('landed_cost_voucher_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount Difference with Purchase Invoice</label>
            <input
              type="number"
              step="any"
              value={formData.amount_difference_with_purchase_invoice != null ? Number(formData.amount_difference_with_purchase_invoice) : ''}
              onChange={e => handleChange('amount_difference_with_purchase_invoice', e.target.value ? parseFloat(e.target.value) : undefined)}
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
        </div>
      </div>
      {/* Section: Warehouse and Reference */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Warehouse and Reference</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Accepted Warehouse (→ Warehouse)</label>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Rejected Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.rejected_warehouse ?? '')}
                onChange={e => {
                  handleChange('rejected_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="rejected_warehouse"
              />
              {/* Link indicator */}
              {formData.rejected_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('rejected_warehouse', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {parent.is_internal_supplier && (
          <div>
            <label className="block text-sm font-medium text-gray-700">From Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.from_warehouse ?? '')}
                onChange={e => {
                  handleChange('from_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="from_warehouse"
              />
              {/* Link indicator */}
              {formData.from_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('from_warehouse', '')}
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_zero_valuation_rate}
              onChange={e => handleChange('allow_zero_valuation_rate', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Zero Valuation Rate</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.return_qty_from_rejected_warehouse}
              onChange={e => handleChange('return_qty_from_rejected_warehouse', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Return Qty from Rejected Warehouse</label>
          </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Location (→ Location)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Location..."
                value={String(formData.asset_location ?? '')}
                onChange={e => {
                  handleChange('asset_location', e.target.value);
                  // TODO: Implement async search for Location
                  // fetch(`/api/resource/Location?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Location"
                data-fieldname="asset_location"
              />
              {/* Link indicator */}
              {formData.asset_location && (
                <button
                  type="button"
                  onClick={() => handleChange('asset_location', '')}
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
            <label className="block text-sm font-medium text-gray-700">Required By</label>
            <input
              type="date"
              value={String(formData.schedule_date ?? '')}
              onChange={e => handleChange('schedule_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
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
            <label className="block text-sm font-medium text-gray-700">Purchase Receipt Item</label>
            <input
              type="text"
              value={String(formData.purchase_receipt_item ?? '')}
              onChange={e => handleChange('purchase_receipt_item', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery Note Item</label>
            <input
              type="text"
              value={String(formData.delivery_note_item ?? '')}
              onChange={e => handleChange('delivery_note_item', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Putaway Rule (→ Putaway Rule)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Putaway Rule..."
                value={String(formData.putaway_rule ?? '')}
                onChange={e => {
                  handleChange('putaway_rule', e.target.value);
                  // TODO: Implement async search for Putaway Rule
                  // fetch(`/api/resource/Putaway Rule?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Putaway Rule"
                data-fieldname="putaway_rule"
              />
              {/* Link indicator */}
              {formData.putaway_rule && (
                <button
                  type="button"
                  onClick={() => handleChange('putaway_rule', '')}
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
          {formData.use_serial_batch_fields ==== 0 || formData.docstatus ==== 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Rejected Serial and Batch Bundle (→ Serial and Batch Bundle)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Serial and Batch Bundle..."
                value={String(formData.rejected_serial_and_batch_bundle ?? '')}
                onChange={e => {
                  handleChange('rejected_serial_and_batch_bundle', e.target.value);
                  // TODO: Implement async search for Serial and Batch Bundle
                  // fetch(`/api/resource/Serial and Batch Bundle?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Serial and Batch Bundle"
                data-fieldname="rejected_serial_and_batch_bundle"
              />
              {/* Link indicator */}
              {formData.rejected_serial_and_batch_bundle && (
                <button
                  type="button"
                  onClick={() => handleChange('rejected_serial_and_batch_bundle', '')}
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
      {/* Section: section_break_3vxt */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Serial No</label>
            <textarea
              value={String(formData.serial_no ?? '')}
              onChange={e => handleChange('serial_no', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Rejected Serial No</label>
            <textarea
              value={String(formData.rejected_serial_no ?? '')}
              onChange={e => handleChange('rejected_serial_no', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
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
        </div>
      </div>
      {/* Section: Subcontract BOM */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Subcontract BOM</h4>
        <div className="grid grid-cols-2 gap-4">
          {parent.is_subcontracted && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.include_exploded_items}
              onChange={e => handleChange('include_exploded_items', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Include Exploded Items</label>
          </div>
          )}
          {parent.is_old_subcontracting_flow && (
          <div>
            <label className="block text-sm font-medium text-gray-700">BOM (→ BOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search BOM..."
                value={String(formData.bom ?? '')}
                onChange={e => {
                  handleChange('bom', e.target.value);
                  // TODO: Implement async search for BOM
                  // fetch(`/api/resource/BOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="BOM"
                data-fieldname="bom"
              />
              {/* Link indicator */}
              {formData.bom && (
                <button
                  type="button"
                  onClick={() => handleChange('bom', '')}
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
      {/* Section: Manufacture */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Manufacture</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Manufacturer (→ Manufacturer)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Manufacturer..."
                value={String(formData.manufacturer ?? '')}
                onChange={e => {
                  handleChange('manufacturer', e.target.value);
                  // TODO: Implement async search for Manufacturer
                  // fetch(`/api/resource/Manufacturer?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Manufacturer"
                data-fieldname="manufacturer"
              />
              {/* Link indicator */}
              {formData.manufacturer && (
                <button
                  type="button"
                  onClick={() => handleChange('manufacturer', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Manufacturer Part Number</label>
            <input
              type="text"
              value={String(formData.manufacturer_part_no ?? '')}
              onChange={e => handleChange('manufacturer_part_no', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">WIP Composite Asset (→ Asset)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Asset..."
                value={String(formData.wip_composite_asset ?? '')}
                onChange={e => {
                  handleChange('wip_composite_asset', e.target.value);
                  // TODO: Implement async search for Asset
                  // fetch(`/api/resource/Asset?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Asset"
                data-fieldname="wip_composite_asset"
              />
              {/* Link indicator */}
              {formData.wip_composite_asset && (
                <button
                  type="button"
                  onClick={() => handleChange('wip_composite_asset', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Provisional Expense Account (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.provisional_expense_account ?? '')}
                onChange={e => {
                  handleChange('provisional_expense_account', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="provisional_expense_account"
              />
              {/* Link indicator */}
              {formData.provisional_expense_account && (
                <button
                  type="button"
                  onClick={() => handleChange('provisional_expense_account', '')}
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
      {/* Section: Accounting Dimensions */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Accounting Dimensions</h4>
        <div className="grid grid-cols-2 gap-4">
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
          {cint(erpnext.is_perpetual_inventory_enabled(parent.company)) && (
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
          )}
        </div>
      </div>
      {/* Section: section_break_80 */}
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Order (→ Sales Order)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Order..."
                value={String(formData.sales_order ?? '')}
                onChange={e => {
                  handleChange('sales_order', e.target.value);
                  // TODO: Implement async search for Sales Order
                  // fetch(`/api/resource/Sales Order?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Order"
                data-fieldname="sales_order"
              />
              {/* Link indicator */}
              {formData.sales_order && (
                <button
                  type="button"
                  onClick={() => handleChange('sales_order', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Order Item</label>
            <input
              type="text"
              value={String(formData.sales_order_item ?? '')}
              onChange={e => handleChange('sales_order_item', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subcontracting Receipt Item</label>
            <input
              type="text"
              value={String(formData.subcontracting_receipt_item ?? '')}
              onChange={e => handleChange('subcontracting_receipt_item', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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