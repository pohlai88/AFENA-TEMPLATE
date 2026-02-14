// Form scaffold for Buying Settings
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { BuyingSettings } from '../types/buying-settings.js';

interface BuyingSettingsFormProps {
  initialData?: Partial<BuyingSettings>;
  onSubmit: (data: Partial<BuyingSettings>) => void;
  mode: 'create' | 'edit';
}

export function BuyingSettingsForm({ initialData = {}, onSubmit, mode }: BuyingSettingsFormProps) {
  const [formData, setFormData] = useState<Partial<BuyingSettings>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Buying Settings' : 'New Buying Settings'}</h2>
      {/* Tab: Naming Series and Price Defaults */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Naming Series and Price Defaults</h3>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier Naming By</label>
            <select
              value={String(formData.supp_master_name ?? '')}
              onChange={e => handleChange('supp_master_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Supplier Name">Supplier Name</option>
              <option value="Naming Series">Naming Series</option>
              <option value="Auto Name">Auto Name</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Supplier Group (→ Supplier Group)</label>
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
            <label className="block text-sm font-medium text-gray-700">Default Buying Price List (→ Price List)</label>
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
          {!!formData.maintain_same_rate && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Action If Same Rate is Not Maintained</label>
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
          {formData.maintain_same_rate_action === 'Stop' && (
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
      {/* Section: section_break_xmlt */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Is Purchase Order Required for Purchase Invoice & Receipt Creation?</label>
            <select
              value={String(formData.po_required ?? '')}
              onChange={e => handleChange('po_required', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Is Purchase Receipt Required for Purchase Invoice Creation?</label>
            <select
              value={String(formData.pr_required ?? '')}
              onChange={e => handleChange('pr_required', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Update frequency of Project</label>
            <select
              value={String(formData.project_update_frequency ?? '')}
              onChange={e => handleChange('project_update_frequency', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Each Transaction">Each Transaction</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
        </div>
      </div>
      {/* Tab: Transaction Settings */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Transaction Settings</h3>
      </div>
          {!formData.maintain_same_rate && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.set_landed_cost_based_on_purchase_invoice_rate}
              onChange={e => handleChange('set_landed_cost_based_on_purchase_invoice_rate', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Set Landed Cost Based on Purchase Invoice Rate</label>
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_zero_qty_in_supplier_quotation}
              onChange={e => handleChange('allow_zero_qty_in_supplier_quotation', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Supplier Quotation with Zero Quantity</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.use_transaction_date_exchange_rate}
              onChange={e => handleChange('use_transaction_date_exchange_rate', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Use Transaction Date Exchange Rate</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_zero_qty_in_request_for_quotation}
              onChange={e => handleChange('allow_zero_qty_in_request_for_quotation', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Request for Quotation with Zero Quantity</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.maintain_same_rate}
              onChange={e => handleChange('maintain_same_rate', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Maintain Same Rate Throughout the Purchase Cycle</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_multiple_items}
              onChange={e => handleChange('allow_multiple_items', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Item To Be Added Multiple Times in a Transaction</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.bill_for_rejected_quantity_in_purchase_invoice}
              onChange={e => handleChange('bill_for_rejected_quantity_in_purchase_invoice', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Bill for Rejected Quantity in Purchase Invoice</label>
          </div>
          {!!formData.bill_for_rejected_quantity_in_purchase_invoice && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.set_valuation_rate_for_rejected_materials}
              onChange={e => handleChange('set_valuation_rate_for_rejected_materials', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Set Valuation Rate for Rejected Materials</label>
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.disable_last_purchase_rate}
              onChange={e => handleChange('disable_last_purchase_rate', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Disable Last Purchase Rate</label>
          </div>
          {frappe.boot.versions && frappe.boot.versions.payments && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.show_pay_button}
              onChange={e => handleChange('show_pay_button', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Show Pay Button in Purchase Order Portal</label>
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_zero_qty_in_purchase_order}
              onChange={e => handleChange('allow_zero_qty_in_purchase_order', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Purchase Order with Zero Quantity</label>
          </div>
      {/* Tab: Subcontracting Settings */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Subcontracting Settings</h3>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Backflush Raw Materials of Subcontract Based On</label>
            <select
              value={String(formData.backflush_raw_materials_of_subcontract_based_on ?? '')}
              onChange={e => handleChange('backflush_raw_materials_of_subcontract_based_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="BOM">BOM</option>
              <option value="Material Transferred for Subcontract">Material Transferred for Subcontract</option>
            </select>
          </div>
          {formData.backflush_raw_materials_of_subcontract_based_on === "BOM" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Over Transfer Allowance (%)</label>
            <input
              type="number"
              step="any"
              value={formData.over_transfer_allowance != null ? Number(formData.over_transfer_allowance) : ''}
              onChange={e => handleChange('over_transfer_allowance', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.backflush_raw_materials_of_subcontract_based_on === "Material Transferred for Subcontract" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.validate_consumed_qty}
              onChange={e => handleChange('validate_consumed_qty', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Validate Consumed Qty (as per BOM)</label>
          </div>
          )}
      {/* Section: section_break_xcug */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.auto_create_subcontracting_order}
              onChange={e => handleChange('auto_create_subcontracting_order', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Auto Create Subcontracting Order</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.auto_create_purchase_receipt}
              onChange={e => handleChange('auto_create_purchase_receipt', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Auto Create Purchase Receipt</label>
          </div>
        </div>
      </div>
      {/* Tab: Request for Quotation */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Request for Quotation</h3>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fixed Outgoing Email Account (→ Email Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Email Account..."
                value={String(formData.fixed_email ?? '')}
                onChange={e => {
                  handleChange('fixed_email', e.target.value);
                  // TODO: Implement async search for Email Account
                  // fetch(`/api/resource/Email Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Email Account"
                data-fieldname="fixed_email"
              />
              {/* Link indicator */}
              {formData.fixed_email && (
                <button
                  type="button"
                  onClick={() => handleChange('fixed_email', '')}
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