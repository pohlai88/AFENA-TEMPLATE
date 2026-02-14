// Form scaffold for Stock Settings
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { StockSettings } from '../types/stock-settings.js';

interface StockSettingsFormProps {
  initialData?: Partial<StockSettings>;
  onSubmit: (data: Partial<StockSettings>) => void;
  mode: 'create' | 'edit';
}

export function StockSettingsForm({ initialData = {}, onSubmit, mode }: StockSettingsFormProps) {
  const [formData, setFormData] = useState<Partial<StockSettings>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Stock Settings' : 'New Stock Settings'}</h2>
      {/* Tab: Defaults */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Defaults</h3>
      </div>
      {/* Section: Item Defaults */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Item Defaults</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Naming By</label>
            <select
              value={String(formData.item_naming_by ?? '')}
              onChange={e => handleChange('item_naming_by', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Item Code">Item Code</option>
              <option value="Naming Series">Naming Series</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Valuation Method</label>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Item Group (→ Item Group)</label>
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
            <label className="block text-sm font-medium text-gray-700">Default Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.default_warehouse ?? '')}
                onChange={e => {
                  handleChange('default_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="default_warehouse"
              />
              {/* Link indicator */}
              {formData.default_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('default_warehouse', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sample Retention Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.sample_retention_warehouse ?? '')}
                onChange={e => {
                  handleChange('sample_retention_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="sample_retention_warehouse"
              />
              {/* Link indicator */}
              {formData.sample_retention_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('sample_retention_warehouse', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Stock UOM (→ UOM)</label>
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
        </div>
      </div>
      {/* Section: Price List Defaults */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Price List Defaults</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.auto_insert_price_list_rate_if_missing}
              onChange={e => handleChange('auto_insert_price_list_rate_if_missing', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Auto Insert Item Price If Missing</label>
          </div>
          {!!formData.auto_insert_price_list_rate_if_missing && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Update Price List Based On</label>
            <select
              value={String(formData.update_price_list_based_on ?? '')}
              onChange={e => handleChange('update_price_list_based_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Rate">Rate</option>
              <option value="Price List Rate">Price List Rate</option>
            </select>
          </div>
          )}
          {!!formData.auto_insert_price_list_rate_if_missing && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.update_existing_price_list_rate}
              onChange={e => handleChange('update_existing_price_list_rate', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Update Existing Price List Rate</label>
          </div>
          )}
        </div>
      </div>
      {/* Section: Stock UOM Quantity */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Stock UOM Quantity</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_to_edit_stock_uom_qty_for_sales}
              onChange={e => handleChange('allow_to_edit_stock_uom_qty_for_sales', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow to Edit Stock UOM Qty for Sales Documents</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_to_edit_stock_uom_qty_for_purchase}
              onChange={e => handleChange('allow_to_edit_stock_uom_qty_for_purchase', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow to Edit Stock UOM Qty for Purchase Documents</label>
          </div>
        </div>
      </div>
      {/* Section: section_break_ylhd */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_uom_with_conversion_rate_defined_in_item}
              onChange={e => handleChange('allow_uom_with_conversion_rate_defined_in_item', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow UOM with Conversion Rate Defined in Item</label>
          </div>
        </div>
      </div>
      {/* Tab: Stock Validations */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Stock Validations</h3>
      </div>
      {/* Section: Stock Transactions Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Stock Transactions Settings</h4>
        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Over Transfer Allowance</label>
            <input
              type="number"
              step="any"
              value={formData.mr_qty_allowance != null ? Number(formData.mr_qty_allowance) : ''}
              onChange={e => handleChange('mr_qty_allowance', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Over Picking Allowance</label>
            <input
              type="number"
              step="any"
              value={formData.over_picking_allowance != null ? Number(formData.over_picking_allowance) : ''}
              onChange={e => handleChange('over_picking_allowance', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role Allowed to Over Deliver/Receive (→ Role)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Role..."
                value={String(formData.role_allowed_to_over_deliver_receive ?? '')}
                onChange={e => {
                  handleChange('role_allowed_to_over_deliver_receive', e.target.value);
                  // TODO: Implement async search for Role
                  // fetch(`/api/resource/Role?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Role"
                data-fieldname="role_allowed_to_over_deliver_receive"
              />
              {/* Link indicator */}
              {formData.role_allowed_to_over_deliver_receive && (
                <button
                  type="button"
                  onClick={() => handleChange('role_allowed_to_over_deliver_receive', '')}
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
              checked={!!formData.allow_negative_stock}
              onChange={e => handleChange('allow_negative_stock', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Negative Stock</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.show_barcode_field}
              onChange={e => handleChange('show_barcode_field', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Show Barcode Field in Stock Transactions</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.clean_description_html}
              onChange={e => handleChange('clean_description_html', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Convert Item Description to Clean HTML in Transactions</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_internal_transfer_at_arms_length_price}
              onChange={e => handleChange('allow_internal_transfer_at_arms_length_price', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Internal Transfers at Arm's Length Price</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.validate_material_transfer_warehouses}
              onChange={e => handleChange('validate_material_transfer_warehouses', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Validate Material Transfer Warehouses</label>
          </div>
        </div>
      </div>
      {/* Tab: Serial & Batch Item */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Serial & Batch Item</h3>
      </div>
      {/* Section: Serial & Batch Item Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Serial & Batch Item Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_existing_serial_no}
              onChange={e => handleChange('allow_existing_serial_no', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow existing Serial No to be Manufactured/Received again</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.do_not_use_batchwise_valuation}
              onChange={e => handleChange('do_not_use_batchwise_valuation', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Do Not Use Batch-wise Valuation</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.auto_create_serial_and_batch_bundle_for_outward}
              onChange={e => handleChange('auto_create_serial_and_batch_bundle_for_outward', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Auto Create Serial and Batch Bundle For Outward</label>
          </div>
          {!!formData.auto_create_serial_and_batch_bundle_for_outward && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Pick Serial / Batch Based On</label>
            <select
              value={String(formData.pick_serial_and_batch_based_on ?? '')}
              onChange={e => handleChange('pick_serial_and_batch_based_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="FIFO">FIFO</option>
              <option value="LIFO">LIFO</option>
              <option value="Expiry">Expiry</option>
            </select>
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.disable_serial_no_and_batch_selector}
              onChange={e => handleChange('disable_serial_no_and_batch_selector', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Disable Serial No And Batch Selector</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.use_serial_batch_fields}
              onChange={e => handleChange('use_serial_batch_fields', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Use Serial / Batch Fields</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.do_not_update_serial_batch_on_creation_of_auto_bundle}
              onChange={e => handleChange('do_not_update_serial_batch_on_creation_of_auto_bundle', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Do Not Update Serial / Batch on Creation of Auto Bundle</label>
          </div>
        </div>
      </div>
      {/* Section: Serial and Batch Bundle */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Serial and Batch Bundle</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.set_serial_and_batch_bundle_naming_based_on_naming_series}
              onChange={e => handleChange('set_serial_and_batch_bundle_naming_based_on_naming_series', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Set Serial and Batch Bundle Naming Based on Naming Series</label>
          </div>
        </div>
      </div>
      {/* Section: section_break_gnhq */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.use_naming_series}
              onChange={e => handleChange('use_naming_series', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Have Default Naming Series for Batch ID?</label>
          </div>
          {formData.use_naming_series===1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Naming Series Prefix</label>
            <input
              type="text"
              value={String(formData.naming_series_prefix ?? '')}
              onChange={e => handleChange('naming_series_prefix', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Tab: Stock Reservation */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Stock Reservation</h3>
      </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enable_stock_reservation}
              onChange={e => handleChange('enable_stock_reservation', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enable Stock Reservation</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.auto_reserve_stock}
              onChange={e => handleChange('auto_reserve_stock', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Auto Reserve Stock</label>
          </div>
          {!!formData.enable_stock_reservation && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_partial_reservation}
              onChange={e => handleChange('allow_partial_reservation', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Partial Reservation</label>
          </div>
          )}
          {!!formData.enable_stock_reservation && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.auto_reserve_stock_for_sales_order_on_purchase}
              onChange={e => handleChange('auto_reserve_stock_for_sales_order_on_purchase', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Auto Reserve Stock for Sales Order on Purchase</label>
          </div>
          )}
      {/* Section: Serial and Batch Reservation */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Serial and Batch Reservation</h4>
        <div className="grid grid-cols-2 gap-4">
          {!!formData.enable_stock_reservation && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.auto_reserve_serial_and_batch}
              onChange={e => handleChange('auto_reserve_serial_and_batch', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Auto Reserve Serial and Batch Nos</label>
          </div>
          )}
        </div>
      </div>
      {/* Tab: Quality */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Quality</h3>
      </div>
      {/* Section: Quality Inspection Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Quality Inspection Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Action If Quality Inspection Is Not Submitted</label>
            <select
              value={String(formData.action_if_quality_inspection_is_not_submitted ?? '')}
              onChange={e => handleChange('action_if_quality_inspection_is_not_submitted', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Stop">Stop</option>
              <option value="Warn">Warn</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Action If Quality Inspection Is Rejected</label>
            <select
              value={String(formData.action_if_quality_inspection_is_rejected ?? '')}
              onChange={e => handleChange('action_if_quality_inspection_is_rejected', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Stop">Stop</option>
              <option value="Warn">Warn</option>
            </select>
          </div>
        </div>
      </div>
      {/* Section: section_break_uiau */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_to_make_quality_inspection_after_purchase_or_delivery}
              onChange={e => handleChange('allow_to_make_quality_inspection_after_purchase_or_delivery', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow to Make Quality Inspection after Purchase / Delivery</label>
          </div>
        </div>
      </div>
      {/* Tab: Stock Planning */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Stock Planning</h3>
      </div>
      {/* Section: Auto Material Request */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Auto Material Request</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.auto_indent}
              onChange={e => handleChange('auto_indent', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Raise Material Request When Stock Reaches Re-order Level</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.reorder_email_notify}
              onChange={e => handleChange('reorder_email_notify', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Notify by Email on Creation of Automatic Material Request</label>
          </div>
        </div>
      </div>
      {/* Section: Inter Warehouse Transfer Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Inter Warehouse Transfer Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_from_dn}
              onChange={e => handleChange('allow_from_dn', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Material Transfer from Delivery Note to Sales Invoice</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_from_pr}
              onChange={e => handleChange('allow_from_pr', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Material Transfer from Purchase Receipt to Purchase Invoice</label>
          </div>
        </div>
      </div>
      {/* Tab: Stock Closing */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Stock Closing</h3>
      </div>
      {/* Section: Control Historical Stock Transactions */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Control Historical Stock Transactions</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Frozen Up To</label>
            <input
              type="date"
              value={String(formData.stock_frozen_upto ?? '')}
              onChange={e => handleChange('stock_frozen_upto', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Freeze Stocks Older Than (Days)</label>
            <input
              type="number"
              step="1"
              value={formData.stock_frozen_upto_days != null ? Number(formData.stock_frozen_upto_days) : ''}
              onChange={e => handleChange('stock_frozen_upto_days', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role Allowed to Create/Edit Back-dated Transactions (→ Role)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Role..."
                value={String(formData.role_allowed_to_create_edit_back_dated_transactions ?? '')}
                onChange={e => {
                  handleChange('role_allowed_to_create_edit_back_dated_transactions', e.target.value);
                  // TODO: Implement async search for Role
                  // fetch(`/api/resource/Role?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Role"
                data-fieldname="role_allowed_to_create_edit_back_dated_transactions"
              />
              {/* Link indicator */}
              {formData.role_allowed_to_create_edit_back_dated_transactions && (
                <button
                  type="button"
                  onClick={() => handleChange('role_allowed_to_create_edit_back_dated_transactions', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {(formData.stock_frozen_upto || formData.stock_frozen_upto_days) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Role Allowed to Edit Frozen Stock (→ Role)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Role..."
                value={String(formData.stock_auth_role ?? '')}
                onChange={e => {
                  handleChange('stock_auth_role', e.target.value);
                  // TODO: Implement async search for Role
                  // fetch(`/api/resource/Role?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Role"
                data-fieldname="stock_auth_role"
              />
              {/* Link indicator */}
              {formData.stock_auth_role && (
                <button
                  type="button"
                  onClick={() => handleChange('stock_auth_role', '')}
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

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}