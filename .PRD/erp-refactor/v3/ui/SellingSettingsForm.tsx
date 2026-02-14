// Form scaffold for Selling Settings
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SellingSettings } from '../types/selling-settings.js';

interface SellingSettingsFormProps {
  initialData?: Partial<SellingSettings>;
  onSubmit: (data: Partial<SellingSettings>) => void;
  mode: 'create' | 'edit';
}

export function SellingSettingsForm({ initialData = {}, onSubmit, mode }: SellingSettingsFormProps) {
  const [formData, setFormData] = useState<Partial<SellingSettings>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Selling Settings' : 'New Selling Settings'}</h2>
      {/* Section: Customer Defaults */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Customer Defaults</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Naming By</label>
            <select
              value={String(formData.cust_master_name ?? '')}
              onChange={e => handleChange('cust_master_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Customer Name">Customer Name</option>
              <option value="Naming Series">Naming Series</option>
              <option value="Auto Name">Auto Name</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Customer Group (→ Customer Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Customer Group..."
                value={String(formData.customer_group ?? '')}
                onChange={e => {
                  handleChange('customer_group', e.target.value);
                  // TODO: Implement async search for Customer Group
                  // fetch(`/api/resource/Customer Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Customer Group"
                data-fieldname="customer_group"
              />
              {/* Link indicator */}
              {formData.customer_group && (
                <button
                  type="button"
                  onClick={() => handleChange('customer_group', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Territory (→ Territory)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Territory..."
                value={String(formData.territory ?? '')}
                onChange={e => {
                  handleChange('territory', e.target.value);
                  // TODO: Implement async search for Territory
                  // fetch(`/api/resource/Territory?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Territory"
                data-fieldname="territory"
              />
              {/* Link indicator */}
              {formData.territory && (
                <button
                  type="button"
                  onClick={() => handleChange('territory', '')}
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
      {/* Tab: Item Price */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Item Price</h3>
      </div>
      {/* Section: Item Price Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Item Price Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Price List (→ Price List)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Price List..."
                value={String(formData.selling_price_list ?? '')}
                onChange={e => {
                  handleChange('selling_price_list', e.target.value);
                  // TODO: Implement async search for Price List
                  // fetch(`/api/resource/Price List?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Price List"
                data-fieldname="selling_price_list"
              />
              {/* Link indicator */}
              {formData.selling_price_list && (
                <button
                  type="button"
                  onClick={() => handleChange('selling_price_list', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {!!formData.maintain_same_sales_rate && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Action if Same Rate is Not Maintained Throughout Sales Cycle</label>
            <select
              value={String(formData.maintain_same_rate_action ?? '')}
              onChange={e => handleChange('maintain_same_rate_action', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Stop">Stop</option>
              <option value="Warn">Warn</option>
            </select>
          </div>
          )}
          {formData.maintain_same_sales_rate && formData.maintain_same_rate_action === 'Stop' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Role Allowed to Override Stop Action (→ Role)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Role..."
                value={String(formData.role_to_override_stop_action ?? '')}
                onChange={e => {
                  handleChange('role_to_override_stop_action', e.target.value);
                  // TODO: Implement async search for Role
                  // fetch(`/api/resource/Role?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Role"
                data-fieldname="role_to_override_stop_action"
              />
              {/* Link indicator */}
              {formData.role_to_override_stop_action && (
                <button
                  type="button"
                  onClick={() => handleChange('role_to_override_stop_action', '')}
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
              checked={!!formData.maintain_same_sales_rate}
              onChange={e => handleChange('maintain_same_sales_rate', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Maintain Same Rate Throughout Sales Cycle</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.fallback_to_default_price_list}
              onChange={e => handleChange('fallback_to_default_price_list', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Use Prices from Default Price List as Fallback</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.editable_price_list_rate}
              onChange={e => handleChange('editable_price_list_rate', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow User to Edit Price List Rate in Transactions</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.validate_selling_price}
              onChange={e => handleChange('validate_selling_price', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Validate Selling Price for Item Against Purchase Rate or Valuation Rate</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.editable_bundle_item_rates}
              onChange={e => handleChange('editable_bundle_item_rates', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Calculate Product Bundle Price based on Child Items' Rates</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_negative_rates_for_items}
              onChange={e => handleChange('allow_negative_rates_for_items', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Negative rates for Items</label>
          </div>
        </div>
      </div>
      {/* Tab: Transaction */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Transaction</h3>
      </div>
      {/* Section: Transaction Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Transaction Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Is Sales Order Required for Sales Invoice & Delivery Note Creation?</label>
            <select
              value={String(formData.so_required ?? '')}
              onChange={e => handleChange('so_required', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Is Delivery Note Required for Sales Invoice Creation?</label>
            <select
              value={String(formData.dn_required ?? '')}
              onChange={e => handleChange('dn_required', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Update Frequency in Company and Project</label>
            <select
              value={String(formData.sales_update_frequency ?? '')}
              onChange={e => handleChange('sales_update_frequency', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Monthly">Monthly</option>
              <option value="Each Transaction">Each Transaction</option>
              <option value="Daily">Daily</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Blanket Order Allowance (%)</label>
            <input
              type="number"
              step="any"
              value={formData.blanket_order_allowance != null ? Number(formData.blanket_order_allowance) : ''}
              onChange={e => handleChange('blanket_order_allowance', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enable_tracking_sales_commissions}
              onChange={e => handleChange('enable_tracking_sales_commissions', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enable tracking sales commissions</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_multiple_items}
              onChange={e => handleChange('allow_multiple_items', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Item to be Added Multiple Times in a Transaction</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_against_multiple_purchase_orders}
              onChange={e => handleChange('allow_against_multiple_purchase_orders', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Multiple Sales Orders Against a Customer's Purchase Order</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_sales_order_creation_for_expired_quotation}
              onChange={e => handleChange('allow_sales_order_creation_for_expired_quotation', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Sales Order Creation For Expired Quotation</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.dont_reserve_sales_order_qty_on_sales_return}
              onChange={e => handleChange('dont_reserve_sales_order_qty_on_sales_return', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Don't Reserve Sales Order Qty on Sales Return</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.hide_tax_id}
              onChange={e => handleChange('hide_tax_id', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Hide Customer's Tax ID from Sales Transactions</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enable_discount_accounting}
              onChange={e => handleChange('enable_discount_accounting', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enable Discount Accounting for Selling</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enable_cutoff_date_on_bulk_delivery_note_creation}
              onChange={e => handleChange('enable_cutoff_date_on_bulk_delivery_note_creation', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enable Cut-Off Date on Bulk Delivery Note Creation</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_zero_qty_in_quotation}
              onChange={e => handleChange('allow_zero_qty_in_quotation', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Quotation with Zero Quantity</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_zero_qty_in_sales_order}
              onChange={e => handleChange('allow_zero_qty_in_sales_order', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Sales Order with Zero Quantity</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.set_zero_rate_for_expired_batch}
              onChange={e => handleChange('set_zero_rate_for_expired_batch', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Set Incoming Rate as Zero for Expired Batch</label>
          </div>
        </div>
      </div>
      {/* Section: Experimental */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Experimental</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.use_legacy_js_reactivity}
              onChange={e => handleChange('use_legacy_js_reactivity', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Use Legacy (Client side) Reactivity</label>
          </div>
        </div>
      </div>
      {/* Tab: Subcontracting Inward */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Subcontracting Inward</h3>
      </div>
      {/* Section: Subcontracting Inward Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Subcontracting Inward Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_delivery_of_overproduced_qty}
              onChange={e => handleChange('allow_delivery_of_overproduced_qty', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Delivery of Overproduced Qty</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.deliver_scrap_items}
              onChange={e => handleChange('deliver_scrap_items', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Deliver Scrap Items</label>
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