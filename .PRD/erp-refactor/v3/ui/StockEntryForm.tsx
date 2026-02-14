// Form scaffold for Stock Entry
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { StockEntry } from '../types/stock-entry.js';

interface StockEntryFormProps {
  initialData?: Partial<StockEntry>;
  onSubmit: (data: Partial<StockEntry>) => void;
  mode: 'create' | 'edit';
}

export function StockEntryForm({ initialData = {}, onSubmit, mode }: StockEntryFormProps) {
  const [formData, setFormData] = useState<Partial<StockEntry>>(initialData);

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
        {mode === 'edit' ? formData.stock_entry_type ?? 'Stock Entry' : 'New Stock Entry'}
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
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>

            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Entry Type (→ Stock Entry Type)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Stock Entry Type..."
                value={String(formData.stock_entry_type ?? '')}
                onChange={e => {
                  handleChange('stock_entry_type', e.target.value);
                  // TODO: Implement async search for Stock Entry Type
                  // fetch(`/api/resource/Stock Entry Type?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Stock Entry Type"
                data-fieldname="stock_entry_type"
              />
              {/* Link indicator */}
              {formData.stock_entry_type && (
                <button
                  type="button"
                  onClick={() => handleChange('stock_entry_type', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {formData.purpose === 'Material Transfer' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Entry (Outward GIT) (→ Stock Entry)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Stock Entry..."
                value={String(formData.outgoing_stock_entry ?? '')}
                onChange={e => {
                  handleChange('outgoing_stock_entry', e.target.value);
                  // TODO: Implement async search for Stock Entry
                  // fetch(`/api/resource/Stock Entry?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Stock Entry"
                data-fieldname="outgoing_stock_entry"
              />
              {/* Link indicator */}
              {formData.outgoing_stock_entry && (
                <button
                  type="button"
                  onClick={() => handleChange('outgoing_stock_entry', '')}
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
            <label className="block text-sm font-medium text-gray-700">Purpose</label>
            <select
              value={String(formData.purpose ?? '')}
              onChange={e => handleChange('purpose', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Material Issue">Material Issue</option>
              <option value="Material Receipt">Material Receipt</option>
              <option value="Material Transfer">Material Transfer</option>
              <option value="Material Transfer for Manufacture">Material Transfer for Manufacture</option>
              <option value="Material Consumption for Manufacture">Material Consumption for Manufacture</option>
              <option value="Manufacture">Manufacture</option>
              <option value="Repack">Repack</option>
              <option value="Send to Subcontractor">Send to Subcontractor</option>
              <option value="Disassemble">Disassemble</option>
              <option value="Receive from Customer">Receive from Customer</option>
              <option value="Return Raw Material to Customer">Return Raw Material to Customer</option>
              <option value="Subcontracting Delivery">Subcontracting Delivery</option>
              <option value="Subcontracting Return">Subcontracting Return</option>
            </select>
          </div>
          {formData.purpose==='Material Transfer' && !formData.outgoing_stock_entry && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.add_to_transit}
              onChange={e => handleChange('add_to_transit', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Add to Transit</label>
          </div>
          )}
          {in_list(["Material Transfer for Manufacture", "Manufacture", "Material Consumption for Manufacture", "Disassemble"], formData.purpose) && (
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Card (→ Job Card)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Job Card..."
                value={String(formData.job_card ?? '')}
                onChange={e => {
                  handleChange('job_card', e.target.value);
                  // TODO: Implement async search for Job Card
                  // fetch(`/api/resource/Job Card?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Job Card"
                data-fieldname="job_card"
              />
              {/* Link indicator */}
              {formData.job_card && (
                <button
                  type="button"
                  onClick={() => handleChange('job_card', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {erpnext.stock.is_subcontracting_or_return_transfer(doc) && (
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
          )}
          {erpnext.stock.is_subcontracting_or_return_transfer(doc) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Subcontracting Order (→ Subcontracting Order)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Subcontracting Order..."
                value={String(formData.subcontracting_order ?? '')}
                onChange={e => {
                  handleChange('subcontracting_order', e.target.value);
                  // TODO: Implement async search for Subcontracting Order
                  // fetch(`/api/resource/Subcontracting Order?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Subcontracting Order"
                data-fieldname="subcontracting_order"
              />
              {/* Link indicator */}
              {formData.subcontracting_order && (
                <button
                  type="button"
                  onClick={() => handleChange('subcontracting_order', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {!!formData.subcontracting_inward_order && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Subcontracting Inward Order (→ Subcontracting Inward Order)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Subcontracting Inward Order..."
                value={String(formData.subcontracting_inward_order ?? '')}
                onChange={e => {
                  handleChange('subcontracting_inward_order', e.target.value);
                  // TODO: Implement async search for Subcontracting Inward Order
                  // fetch(`/api/resource/Subcontracting Inward Order?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Subcontracting Inward Order"
                data-fieldname="subcontracting_inward_order"
              />
              {/* Link indicator */}
              {formData.subcontracting_inward_order && (
                <button
                  type="button"
                  onClick={() => handleChange('subcontracting_inward_order', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.purpose==="Sales Return" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery Note No (→ Delivery Note)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Delivery Note..."
                value={String(formData.delivery_note_no ?? '')}
                onChange={e => {
                  handleChange('delivery_note_no', e.target.value);
                  // TODO: Implement async search for Delivery Note
                  // fetch(`/api/resource/Delivery Note?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Delivery Note"
                data-fieldname="delivery_note_no"
              />
              {/* Link indicator */}
              {formData.delivery_note_no && (
                <button
                  type="button"
                  onClick={() => handleChange('delivery_note_no', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.purpose==="Sales Return" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Invoice No (→ Sales Invoice)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Invoice..."
                value={String(formData.sales_invoice_no ?? '')}
                onChange={e => {
                  handleChange('sales_invoice_no', e.target.value);
                  // TODO: Implement async search for Sales Invoice
                  // fetch(`/api/resource/Sales Invoice?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Invoice"
                data-fieldname="sales_invoice_no"
              />
              {/* Link indicator */}
              {formData.sales_invoice_no && (
                <button
                  type="button"
                  onClick={() => handleChange('sales_invoice_no', '')}
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
            <label className="block text-sm font-medium text-gray-700">Pick List (→ Pick List)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Pick List..."
                value={String(formData.pick_list ?? '')}
                onChange={e => {
                  handleChange('pick_list', e.target.value);
                  // TODO: Implement async search for Pick List
                  // fetch(`/api/resource/Pick List?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Pick List"
                data-fieldname="pick_list"
              />
              {/* Link indicator */}
              {formData.pick_list && (
                <button
                  type="button"
                  onClick={() => handleChange('pick_list', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {formData.purpose==="Purchase Return" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Receipt No (→ Purchase Receipt)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Purchase Receipt..."
                value={String(formData.purchase_receipt_no ?? '')}
                onChange={e => {
                  handleChange('purchase_receipt_no', e.target.value);
                  // TODO: Implement async search for Purchase Receipt
                  // fetch(`/api/resource/Purchase Receipt?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Purchase Receipt"
                data-fieldname="purchase_receipt_no"
              />
              {/* Link indicator */}
              {formData.purchase_receipt_no && (
                <button
                  type="button"
                  onClick={() => handleChange('purchase_receipt_no', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {!!formData.asset_repair && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Repair (→ Asset Repair)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Asset Repair..."
                value={String(formData.asset_repair ?? '')}
                onChange={e => {
                  handleChange('asset_repair', e.target.value);
                  // TODO: Implement async search for Asset Repair
                  // fetch(`/api/resource/Asset Repair?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Asset Repair"
                data-fieldname="asset_repair"
              />
              {/* Link indicator */}
              {formData.asset_repair && (
                <button
                  type="button"
                  onClick={() => handleChange('asset_repair', '')}
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
            <label className="block text-sm font-medium text-gray-700">Posting Date</label>
            <input
              type="date"
              value={String(formData.posting_date ?? '')}
              onChange={e => handleChange('posting_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Posting Time</label>
            <input
              type="time"
              value={String(formData.posting_time ?? '')}
              onChange={e => handleChange('posting_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {formData.docstatus===0 && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.set_posting_time}
              onChange={e => handleChange('set_posting_time', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Edit Posting Date and Time</label>
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.inspection_required}
              onChange={e => handleChange('inspection_required', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Inspection Required</label>
          </div>
          {in_list(["Material Transfer", "Material Receipt"], formData.purpose) && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.apply_putaway_rule}
              onChange={e => handleChange('apply_putaway_rule', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Apply Putaway Rule</label>
          </div>
          )}
          {formData.purpose === "Material Transfer for Manufacture" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_additional_transfer_entry}
              onChange={e => handleChange('is_additional_transfer_entry', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Additional Transfer Entry</label>
          </div>
          )}
      {/* Section: BOM Info */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">BOM Info</h4>
        <div className="grid grid-cols-2 gap-4">
          {in_list(["Material Issue", "Material Transfer", "Manufacture", "Repack", "Send to Subcontractor", "Material Transfer for Manufacture", "Material Consumption for Manufacture", "Disassemble"], formData.purpose) && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.from_bom}
              onChange={e => handleChange('from_bom', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">From BOM</label>
          </div>
          )}
          {!!formData.from_bom && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.use_multi_level_bom}
              onChange={e => handleChange('use_multi_level_bom', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Use Multi-Level BOM</label>
          </div>
          )}
          {!!formData.from_bom && (
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
          )}
          {!!formData.from_bom && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Finished Good Quantity </label>
            <input
              type="number"
              step="any"
              value={formData.fg_completed_qty != null ? Number(formData.fg_completed_qty) : ''}
              onChange={e => handleChange('fg_completed_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Process Loss */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Process Loss</h4>
        <div className="grid grid-cols-2 gap-4">
          {formData.from_bom && formData.fg_completed_qty && (
          <div>
            <label className="block text-sm font-medium text-gray-700">% Process Loss</label>
            <input
              type="number"
              step="any"
              value={formData.process_loss_percentage != null ? Number(formData.process_loss_percentage) : ''}
              onChange={e => handleChange('process_loss_percentage', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.fg_completed_qty > 0 && in_list(["Manufacture", "Repack"], formData.purpose) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Process Loss Qty</label>
            <input
              type="number"
              step="any"
              value={formData.process_loss_qty != null ? Number(formData.process_loss_qty) : ''}
              onChange={e => handleChange('process_loss_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Default Warehouse */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Default Warehouse</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Source Warehouse (→ Warehouse)</label>
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
          {!!formData.from_warehouse && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Source Warehouse Address Link (→ Address)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Address..."
                value={String(formData.source_warehouse_address ?? '')}
                onChange={e => {
                  handleChange('source_warehouse_address', e.target.value);
                  // TODO: Implement async search for Address
                  // fetch(`/api/resource/Address?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Address"
                data-fieldname="source_warehouse_address"
              />
              {/* Link indicator */}
              {formData.source_warehouse_address && (
                <button
                  type="button"
                  onClick={() => handleChange('source_warehouse_address', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Source Warehouse Address</label>
            <textarea
              value={String(formData.source_address_display ?? '')}
              onChange={e => handleChange('source_address_display', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Target Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.to_warehouse ?? '')}
                onChange={e => {
                  handleChange('to_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="to_warehouse"
              />
              {/* Link indicator */}
              {formData.to_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('to_warehouse', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {!!formData.to_warehouse && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Warehouse Address Link (→ Address)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Address..."
                value={String(formData.target_warehouse_address ?? '')}
                onChange={e => {
                  handleChange('target_warehouse_address', e.target.value);
                  // TODO: Implement async search for Address
                  // fetch(`/api/resource/Address?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Address"
                data-fieldname="target_warehouse_address"
              />
              {/* Link indicator */}
              {formData.target_warehouse_address && (
                <button
                  type="button"
                  onClick={() => handleChange('target_warehouse_address', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Target Warehouse Address</label>
            <textarea
              value={String(formData.target_address_display ?? '')}
              onChange={e => handleChange('target_address_display', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: sb0 */}
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
        </div>
      </div>
      {/* Section: Items */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Items</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: items → Stock Entry Detail */}
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
      {/* Section: section_break_19 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Outgoing Value (Consumption)</label>
            <input
              type="number"
              step="any"
              value={formData.total_outgoing_value != null ? Number(formData.total_outgoing_value) : ''}
              onChange={e => handleChange('total_outgoing_value', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Incoming Value (Receipt)</label>
            <input
              type="number"
              step="any"
              value={formData.total_incoming_value != null ? Number(formData.total_incoming_value) : ''}
              onChange={e => handleChange('total_incoming_value', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Value Difference (Incoming - Outgoing)</label>
            <input
              type="number"
              step="any"
              value={formData.value_difference != null ? Number(formData.value_difference) : ''}
              onChange={e => handleChange('value_difference', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Tab: Additional Costs */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Additional Costs</h3>
      </div>
          {/* Child table: additional_costs → Landed Cost Taxes and Charges */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Additional Costs</label>
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
                  {(Array.isArray(formData.additional_costs) ? (formData.additional_costs as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.additional_costs) ? formData.additional_costs : [])];
                            rows.splice(idx, 1);
                            handleChange('additional_costs', rows);
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
                  onClick={() => handleChange('additional_costs', [...(Array.isArray(formData.additional_costs) ? formData.additional_costs : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Additional Costs</label>
            <input
              type="number"
              step="any"
              value={formData.total_additional_costs != null ? Number(formData.total_additional_costs) : ''}
              onChange={e => handleChange('total_additional_costs', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Tab: Supplier Info */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Supplier Info</h3>
      </div>
      {/* Section: Supplier Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Supplier Details</h4>
        <div className="grid grid-cols-2 gap-4">
          {erpnext.stock.is_subcontracting_or_return_transfer(doc) && (
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
          {erpnext.stock.is_subcontracting_or_return_transfer(doc) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier Name</label>
            <input
              type="text"
              value={String(formData.supplier_name ?? '')}
              onChange={e => handleChange('supplier_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {erpnext.stock.is_subcontracting_or_return_transfer(doc) && (
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
          )}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              value={String(formData.address_display ?? '')}
              onChange={e => handleChange('address_display', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Tab: Accounting Dimensions */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Accounting Dimensions</h3>
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
      {/* Tab: Other Info */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Other Info</h3>
      </div>
      {/* Section: Printing Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Printing Settings</h4>
        <div className="grid grid-cols-2 gap-4">
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
        </div>
      </div>
      {/* Section: More Information */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">More Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Is Opening</label>
            <select
              value={String(formData.is_opening ?? '')}
              onChange={e => handleChange('is_opening', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Remarks</label>
            <textarea
              value={String(formData.remarks ?? '')}
              onChange={e => handleChange('remarks', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Per Transferred</label>
            <input
              type="number"
              step="any"
              value={formData.per_transferred != null ? Number(formData.per_transferred) : ''}
              onChange={e => handleChange('per_transferred', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.total_amount && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Amount</label>
            <input
              type="number"
              step="any"
              value={formData.total_amount != null ? Number(formData.total_amount) : ''}
              onChange={e => handleChange('total_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Stock Entry)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Stock Entry..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Stock Entry
                  // fetch(`/api/resource/Stock Entry?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Stock Entry"
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
            <label className="block text-sm font-medium text-gray-700">Credit Note (→ Journal Entry)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Journal Entry..."
                value={String(formData.credit_note ?? '')}
                onChange={e => {
                  handleChange('credit_note', e.target.value);
                  // TODO: Implement async search for Journal Entry
                  // fetch(`/api/resource/Journal Entry?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Journal Entry"
                data-fieldname="credit_note"
              />
              {/* Link indicator */}
              {formData.credit_note && (
                <button
                  type="button"
                  onClick={() => handleChange('credit_note', '')}
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
              checked={!!formData.is_return}
              onChange={e => handleChange('is_return', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Return</label>
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