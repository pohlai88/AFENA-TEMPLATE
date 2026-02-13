// Form scaffold for Sales Invoice
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SalesInvoice } from '../types/sales-invoice.js';

interface SalesInvoiceFormProps {
  initialData?: Partial<SalesInvoice>;
  onSubmit: (data: Partial<SalesInvoice>) => void;
  mode: 'create' | 'edit';
}

export function SalesInvoiceForm({ initialData = {}, onSubmit, mode }: SalesInvoiceFormProps) {
  const [formData, setFormData] = useState<Partial<SalesInvoice>>(initialData);

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
        {mode === 'edit' ? formData.customer_name ?? 'Sales Invoice' : 'New Sales Invoice'}
      </h2>
      {/* Section: customer_section */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-gray-700">Company Tax ID</label>
            <input
              type="text"
              value={String(formData.company_tax_id ?? '')}
              onChange={e => handleChange('company_tax_id', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
          {!!formData.customer && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <textarea
              value={String(formData.customer_name ?? '')}
              onChange={e => handleChange('customer_name', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Id</label>
            <input
              type="text"
              value={String(formData.tax_id ?? '')}
              onChange={e => handleChange('tax_id', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={String(formData.posting_date ?? '')}
              onChange={e => handleChange('posting_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Due Date</label>
            <input
              type="date"
              value={String(formData.due_date ?? '')}
              onChange={e => handleChange('due_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_pos}
              onChange={e => handleChange('is_pos', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Include Payment (POS)</label>
          </div>
          {!!formData.is_pos && (
          <div>
            <label className="block text-sm font-medium text-gray-700">POS Profile (→ POS Profile)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search POS Profile..."
                value={String(formData.pos_profile ?? '')}
                onChange={e => {
                  handleChange('pos_profile', e.target.value);
                  // TODO: Implement async search for POS Profile
                  // fetch(`/api/resource/POS Profile?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="POS Profile"
                data-fieldname="pos_profile"
              />
              {/* Link indicator */}
              {formData.pos_profile && (
                <button
                  type="button"
                  onClick={() => handleChange('pos_profile', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {(formData.is_pos && formData.is_consolidated) && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_consolidated}
              onChange={e => handleChange('is_consolidated', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Consolidated</label>
          </div>
          )}
          {!formData.is_debit_note && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_return}
              onChange={e => handleChange('is_return', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Return (Credit Note)</label>
          </div>
          )}
          {formData.return_against || formData.is_debit_note && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Return Against (→ Sales Invoice)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Invoice..."
                value={String(formData.return_against ?? '')}
                onChange={e => {
                  handleChange('return_against', e.target.value);
                  // TODO: Implement async search for Sales Invoice
                  // fetch(`/api/resource/Sales Invoice?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Invoice"
                data-fieldname="return_against"
              />
              {/* Link indicator */}
              {formData.return_against && (
                <button
                  type="button"
                  onClick={() => handleChange('return_against', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.is_return && formData.return_against && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.update_outstanding_for_self}
              onChange={e => handleChange('update_outstanding_for_self', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Update Outstanding for Self</label>
          </div>
          )}
          {!!formData.is_return && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.update_billed_amount_in_sales_order}
              onChange={e => handleChange('update_billed_amount_in_sales_order', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Update Billed Amount in Sales Order</label>
          </div>
          )}
          {!!formData.is_return && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.update_billed_amount_in_delivery_note}
              onChange={e => handleChange('update_billed_amount_in_delivery_note', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Update Billed Amount in Delivery Note</label>
          </div>
          )}
          {!formData.is_return && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_debit_note}
              onChange={e => handleChange('is_debit_note', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Rate Adjustment Entry (Debit Note)</label>
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.apply_tds}
              onChange={e => handleChange('apply_tds', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Consider for Tax Withholding</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Sales Invoice)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Invoice..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Sales Invoice
                  // fetch(`/api/resource/Sales Invoice?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Invoice"
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
              checked={!!formData.is_created_using_pos}
              onChange={e => handleChange('is_created_using_pos', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is created using POS</label>
          </div>
          {!!formData.is_created_using_pos && (
          <div>
            <label className="block text-sm font-medium text-gray-700">POS Closing Entry (→ POS Closing Entry)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search POS Closing Entry..."
                value={String(formData.pos_closing_entry ?? '')}
                onChange={e => {
                  handleChange('pos_closing_entry', e.target.value);
                  // TODO: Implement async search for POS Closing Entry
                  // fetch(`/api/resource/POS Closing Entry?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="POS Closing Entry"
                data-fieldname="pos_closing_entry"
              />
              {/* Link indicator */}
              {formData.pos_closing_entry && (
                <button
                  type="button"
                  onClick={() => handleChange('pos_closing_entry', '')}
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
              checked={!!formData.has_subcontracted}
              onChange={e => handleChange('has_subcontracted', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Has Subcontracted</label>
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
                value={String(formData.selling_price_list ?? '')}
                onChange={e => {
                  handleChange('selling_price_list', e.target.value);
                  // TODO: Implement async search for Price List
                  // fetch(`/api/resource/Price List?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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
      {/* Section: Items */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Items</h4>
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
          {formData.items.every((item) => !item.dn_detail) && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.update_stock}
              onChange={e => handleChange('update_stock', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Update Stock</label>
          </div>
          )}
          {!!formData.update_stock && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Source Warehouse (→ Warehouse)</label>
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
          )}
          {formData.is_internal_customer && formData.update_stock && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Set Target Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.set_target_warehouse ?? '')}
                onChange={e => {
                  handleChange('set_target_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="set_target_warehouse"
              />
              {/* Link indicator */}
              {formData.set_target_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('set_target_warehouse', '')}
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
      {/* Section: section_break_42 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: items → Sales Invoice Item */}
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
      {/* Section: section_break_30 */}
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
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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
            <label className="block text-sm font-medium text-gray-700">Sales Taxes and Charges Template (→ Sales Taxes and Charges Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Taxes and Charges Template..."
                value={String(formData.taxes_and_charges ?? '')}
                onChange={e => {
                  handleChange('taxes_and_charges', e.target.value);
                  // TODO: Implement async search for Sales Taxes and Charges Template
                  // fetch(`/api/resource/Sales Taxes and Charges Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Taxes and Charges Template"
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
      {/* Section: section_break_40 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: taxes → Sales Taxes and Charges */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Sales Taxes and Charges</label>
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
      {/* Section: section_break_43 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
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
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">In Words</label>
            <textarea
              value={String(formData.in_words ?? '')}
              onChange={e => handleChange('in_words', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!formData.disable_rounded_total && (
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
          )}
          {!!formData.grand_total && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.disable_rounded_total}
              onChange={e => handleChange('disable_rounded_total', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Disable Rounded Total</label>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Advance</label>
            <input
              type="number"
              step="any"
              value={formData.total_advance != null ? Number(formData.total_advance) : ''}
              onChange={e => handleChange('total_advance', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Outstanding Amount</label>
            <input
              type="number"
              step="any"
              value={formData.outstanding_amount != null ? Number(formData.outstanding_amount) : ''}
              onChange={e => handleChange('outstanding_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.use_company_roundoff_cost_center}
              onChange={e => handleChange('use_company_roundoff_cost_center', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Use Company default Cost Center for Round off</label>
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
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">In Words</label>
            <textarea
              value={String(formData.base_in_words ?? '')}
              onChange={e => handleChange('base_in_words', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!formData.disable_rounded_total && (
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
          )}
        </div>
      </div>
      {/* Section: Tax Withholding Entry */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Tax Withholding Entry</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Withholding Group (→ Tax Withholding Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Tax Withholding Group..."
                value={String(formData.tax_withholding_group ?? '')}
                onChange={e => {
                  handleChange('tax_withholding_group', e.target.value);
                  // TODO: Implement async search for Tax Withholding Group
                  // fetch(`/api/resource/Tax Withholding Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Tax Withholding Group"
                data-fieldname="tax_withholding_group"
              />
              {/* Link indicator */}
              {formData.tax_withholding_group && (
                <button
                  type="button"
                  onClick={() => handleChange('tax_withholding_group', '')}
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
              checked={!!formData.ignore_tax_withholding_threshold}
              onChange={e => handleChange('ignore_tax_withholding_threshold', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Ignore Tax Withholding Threshold</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.override_tax_withholding_entries}
              onChange={e => handleChange('override_tax_withholding_entries', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Edit Tax Withholding Entries</label>
          </div>
          {/* Child table: tax_withholding_entries → Tax Withholding Entry */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Tax Withholding Entries</label>
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
                  {(Array.isArray(formData.tax_withholding_entries) ? (formData.tax_withholding_entries as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.tax_withholding_entries) ? formData.tax_withholding_entries : [])];
                            rows.splice(idx, 1);
                            handleChange('tax_withholding_entries', rows);
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
                  onClick={() => handleChange('tax_withholding_entries', [...(Array.isArray(formData.tax_withholding_entries) ? formData.tax_withholding_entries : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
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
            <label className="block text-sm font-medium text-gray-700">Coupon Code (→ Coupon Code)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Coupon Code..."
                value={String(formData.coupon_code ?? '')}
                onChange={e => {
                  handleChange('coupon_code', e.target.value);
                  // TODO: Implement async search for Coupon Code
                  // fetch(`/api/resource/Coupon Code?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Coupon Code"
                data-fieldname="coupon_code"
              />
              {/* Link indicator */}
              {formData.coupon_code && (
                <button
                  type="button"
                  onClick={() => handleChange('coupon_code', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
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
          {formData.apply_discount_on === "Grand Total" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_cash_or_non_trade_discount}
              onChange={e => handleChange('is_cash_or_non_trade_discount', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Cash or Non Trade Discount</label>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount Account (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.additional_discount_account ?? '')}
                onChange={e => {
                  handleChange('additional_discount_account', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="additional_discount_account"
              />
              {/* Link indicator */}
              {formData.additional_discount_account && (
                <button
                  type="button"
                  onClick={() => handleChange('additional_discount_account', '')}
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
      {/* Section: Pricing Rules */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Pricing Rules</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: pricing_rules → Pricing Rule Detail */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Pricing Rule Detail</label>
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
      {/* Section: Packing List */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Packing List</h4>
        <div className="grid grid-cols-2 gap-4">
          {!!formData.packed_items && (
          {/* Child table: packed_items → Packed Item */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Packed Items</label>
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
                  {(Array.isArray(formData.packed_items) ? (formData.packed_items as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.packed_items) ? formData.packed_items : [])];
                            rows.splice(idx, 1);
                            handleChange('packed_items', rows);
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
                  onClick={() => handleChange('packed_items', [...(Array.isArray(formData.packed_items) ? formData.packed_items : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          )}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Product Bundle Help</label>
            <textarea
              value={String(formData.product_bundle_help ?? '')}
              onChange={e => handleChange('product_bundle_help', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Time Sheet List */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Time Sheet List</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: timesheets → Sales Invoice Timesheet */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Time Sheets</label>
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
                  {(Array.isArray(formData.timesheets) ? (formData.timesheets as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.timesheets) ? formData.timesheets : [])];
                            rows.splice(idx, 1);
                            handleChange('timesheets', rows);
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
                  onClick={() => handleChange('timesheets', [...(Array.isArray(formData.timesheets) ? formData.timesheets : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: section_break_104 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Billing Hours</label>
            <input
              type="number"
              step="any"
              value={formData.total_billing_hours != null ? Number(formData.total_billing_hours) : ''}
              onChange={e => handleChange('total_billing_hours', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Billing Amount</label>
            <input
              type="number"
              step="any"
              value={formData.total_billing_amount != null ? Number(formData.total_billing_amount) : ''}
              onChange={e => handleChange('total_billing_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Tab: Payments */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Payments</h3>
      </div>
      {/* Section: Payments */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Payments</h4>
        <div className="grid grid-cols-2 gap-4">
          {!!formData.is_pos && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Cash/Bank Account (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.cash_bank_account ?? '')}
                onChange={e => {
                  handleChange('cash_bank_account', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="cash_bank_account"
              />
              {/* Link indicator */}
              {formData.cash_bank_account && (
                <button
                  type="button"
                  onClick={() => handleChange('cash_bank_account', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.is_pos====1 && (
          {/* Child table: payments → Sales Invoice Payment */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Sales Invoice Payment</label>
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
                  {(Array.isArray(formData.payments) ? (formData.payments as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.payments) ? formData.payments : [])];
                            rows.splice(idx, 1);
                            handleChange('payments', rows);
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
                  onClick={() => handleChange('payments', [...(Array.isArray(formData.payments) ? formData.payments : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
      {/* Section: section_break_84 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {formData.is_pos || formData.redeem_loyalty_points && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Paid Amount (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_paid_amount != null ? Number(formData.base_paid_amount) : ''}
              onChange={e => handleChange('base_paid_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.is_pos || formData.redeem_loyalty_points && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Paid Amount</label>
            <input
              type="number"
              step="any"
              value={formData.paid_amount != null ? Number(formData.paid_amount) : ''}
              onChange={e => handleChange('paid_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Changes */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Changes</h4>
        <div className="grid grid-cols-2 gap-4">
          {!!formData.is_pos && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Base Change Amount (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_change_amount != null ? Number(formData.base_change_amount) : ''}
              onChange={e => handleChange('base_change_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.is_pos && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Change Amount</label>
            <input
              type="number"
              step="any"
              value={formData.change_amount != null ? Number(formData.change_amount) : ''}
              onChange={e => handleChange('change_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.is_pos && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Account for Change Amount (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.account_for_change_amount ?? '')}
                onChange={e => {
                  handleChange('account_for_change_amount', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="account_for_change_amount"
              />
              {/* Link indicator */}
              {formData.account_for_change_amount && (
                <button
                  type="button"
                  onClick={() => handleChange('account_for_change_amount', '')}
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
      {/* Section: Advance Payments */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Advance Payments</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allocate_advances_automatically}
              onChange={e => handleChange('allocate_advances_automatically', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allocate Advances Automatically (FIFO)</label>
          </div>
          {!!formData.allocate_advances_automatically && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.only_include_allocated_payments}
              onChange={e => handleChange('only_include_allocated_payments', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Only Include Allocated Payments</label>
          </div>
          )}
          {/* Child table: advances → Sales Invoice Advance */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Advances</label>
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
                  {(Array.isArray(formData.advances) ? (formData.advances as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.advances) ? formData.advances : [])];
                            rows.splice(idx, 1);
                            handleChange('advances', rows);
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
                  onClick={() => handleChange('advances', [...(Array.isArray(formData.advances) ? formData.advances : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Write Off */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Write Off</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Write Off Amount</label>
            <input
              type="number"
              step="any"
              value={formData.write_off_amount != null ? Number(formData.write_off_amount) : ''}
              onChange={e => handleChange('write_off_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Write Off Amount (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_write_off_amount != null ? Number(formData.base_write_off_amount) : ''}
              onChange={e => handleChange('base_write_off_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.is_pos && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.write_off_outstanding_amount_automatically}
              onChange={e => handleChange('write_off_outstanding_amount_automatically', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Write Off Outstanding Amount</label>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Write Off Account (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.write_off_account ?? '')}
                onChange={e => {
                  handleChange('write_off_account', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="write_off_account"
              />
              {/* Link indicator */}
              {formData.write_off_account && (
                <button
                  type="button"
                  onClick={() => handleChange('write_off_account', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Write Off Cost Center (→ Cost Center)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Cost Center..."
                value={String(formData.write_off_cost_center ?? '')}
                onChange={e => {
                  handleChange('write_off_cost_center', e.target.value);
                  // TODO: Implement async search for Cost Center
                  // fetch(`/api/resource/Cost Center?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Cost Center"
                data-fieldname="write_off_cost_center"
              />
              {/* Link indicator */}
              {formData.write_off_cost_center && (
                <button
                  type="button"
                  onClick={() => handleChange('write_off_cost_center', '')}
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
      {/* Section: Loyalty Points Redemption */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Loyalty Points Redemption</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.redeem_loyalty_points}
              onChange={e => handleChange('redeem_loyalty_points', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Redeem Loyalty Points</label>
          </div>
          {!!formData.redeem_loyalty_points && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Loyalty Points</label>
            <input
              type="number"
              step="1"
              value={formData.loyalty_points != null ? Number(formData.loyalty_points) : ''}
              onChange={e => handleChange('loyalty_points', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.redeem_loyalty_points && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Loyalty Amount</label>
            <input
              type="number"
              step="any"
              value={formData.loyalty_amount != null ? Number(formData.loyalty_amount) : ''}
              onChange={e => handleChange('loyalty_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Loyalty Program (→ Loyalty Program)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Loyalty Program..."
                value={String(formData.loyalty_program ?? '')}
                onChange={e => {
                  handleChange('loyalty_program', e.target.value);
                  // TODO: Implement async search for Loyalty Program
                  // fetch(`/api/resource/Loyalty Program?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Loyalty Program"
                data-fieldname="loyalty_program"
              />
              {/* Link indicator */}
              {formData.loyalty_program && (
                <button
                  type="button"
                  onClick={() => handleChange('loyalty_program', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {!!formData.loyalty_program && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.dont_create_loyalty_points}
              onChange={e => handleChange('dont_create_loyalty_points', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Don't Create Loyalty Points</label>
          </div>
          )}
          {!!formData.redeem_loyalty_points && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Redemption Account (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.loyalty_redemption_account ?? '')}
                onChange={e => {
                  handleChange('loyalty_redemption_account', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="loyalty_redemption_account"
              />
              {/* Link indicator */}
              {formData.loyalty_redemption_account && (
                <button
                  type="button"
                  onClick={() => handleChange('loyalty_redemption_account', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {!!formData.redeem_loyalty_points && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Redemption Cost Center (→ Cost Center)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Cost Center..."
                value={String(formData.loyalty_redemption_cost_center ?? '')}
                onChange={e => {
                  handleChange('loyalty_redemption_cost_center', e.target.value);
                  // TODO: Implement async search for Cost Center
                  // fetch(`/api/resource/Cost Center?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Cost Center"
                data-fieldname="loyalty_redemption_cost_center"
              />
              {/* Link indicator */}
              {formData.loyalty_redemption_cost_center && (
                <button
                  type="button"
                  onClick={() => handleChange('loyalty_redemption_cost_center', '')}
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
      {/* Tab: Address & Contact */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Address & Contact</h3>
      </div>
      {/* Section: Billing Address */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Billing Address</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Address (→ Address)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Address..."
                value={String(formData.customer_address ?? '')}
                onChange={e => {
                  handleChange('customer_address', e.target.value);
                  // TODO: Implement async search for Address
                  // fetch(`/api/resource/Address?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Address"
                data-fieldname="customer_address"
              />
              {/* Link indicator */}
              {formData.customer_address && (
                <button
                  type="button"
                  onClick={() => handleChange('customer_address', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              value={String(formData.address_display ?? '')}
              onChange={e => handleChange('address_display', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Person (→ Contact)</label>
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
            <label className="block text-sm font-medium text-gray-700">Contact</label>
            <textarea
              value={String(formData.contact_display ?? '')}
              onChange={e => handleChange('contact_display', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Mobile No</label>
            <textarea
              value={String(formData.contact_mobile ?? '')}
              onChange={e => handleChange('contact_mobile', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="text"
              value={String(formData.contact_email ?? '')}
              onChange={e => handleChange('contact_email', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Territory (→ Territory)</label>
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
      {/* Section: Shipping Address */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Shipping Address</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Shipping Address Name (→ Address)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Address..."
                value={String(formData.shipping_address_name ?? '')}
                onChange={e => {
                  handleChange('shipping_address_name', e.target.value);
                  // TODO: Implement async search for Address
                  // fetch(`/api/resource/Address?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Address"
                data-fieldname="shipping_address_name"
              />
              {/* Link indicator */}
              {formData.shipping_address_name && (
                <button
                  type="button"
                  onClick={() => handleChange('shipping_address_name', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
            <textarea
              value={String(formData.shipping_address ?? '')}
              onChange={e => handleChange('shipping_address', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dispatch Address Name (→ Address)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Address..."
                value={String(formData.dispatch_address_name ?? '')}
                onChange={e => {
                  handleChange('dispatch_address_name', e.target.value);
                  // TODO: Implement async search for Address
                  // fetch(`/api/resource/Address?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Address"
                data-fieldname="dispatch_address_name"
              />
              {/* Link indicator */}
              {formData.dispatch_address_name && (
                <button
                  type="button"
                  onClick={() => handleChange('dispatch_address_name', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Dispatch Address</label>
            <textarea
              value={String(formData.dispatch_address ?? '')}
              onChange={e => handleChange('dispatch_address', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Company Address */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Company Address</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Address Name (→ Address)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Address..."
                value={String(formData.company_address ?? '')}
                onChange={e => {
                  handleChange('company_address', e.target.value);
                  // TODO: Implement async search for Address
                  // fetch(`/api/resource/Address?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Address"
                data-fieldname="company_address"
              />
              {/* Link indicator */}
              {formData.company_address && (
                <button
                  type="button"
                  onClick={() => handleChange('company_address', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Company Address</label>
            <textarea
              value={String(formData.company_address_display ?? '')}
              onChange={e => handleChange('company_address_display', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Contact Person (→ Contact)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Contact..."
                value={String(formData.company_contact_person ?? '')}
                onChange={e => {
                  handleChange('company_contact_person', e.target.value);
                  // TODO: Implement async search for Contact
                  // fetch(`/api/resource/Contact?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Contact"
                data-fieldname="company_contact_person"
              />
              {/* Link indicator */}
              {formData.company_contact_person && (
                <button
                  type="button"
                  onClick={() => handleChange('company_contact_person', '')}
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
      {/* Tab: Terms */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Terms</h3>
      </div>
      {/* Section: Payment Terms */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Payment Terms</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.ignore_default_payment_terms_template}
              onChange={e => handleChange('ignore_default_payment_terms_template', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Ignore Default Payment Terms Template</label>
          </div>
          {(!formData.is_pos && !formData.is_return) && (
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
          )}
          {(!formData.is_pos && !formData.is_return) && (
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
          )}
        </div>
      </div>
      {/* Section: Terms and Conditions */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Terms and Conditions</h4>
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
            <label className="block text-sm font-medium text-gray-700">Terms and Conditions Details</label>
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
      {/* Section: Customer PO Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Customer PO Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer's Purchase Order</label>
            <input
              type="text"
              value={String(formData.po_no ?? '')}
              onChange={e => handleChange('po_no', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer's Purchase Order Date</label>
            <input
              type="date"
              value={String(formData.po_date ?? '')}
              onChange={e => handleChange('po_date', e.target.value)}
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
            <label className="block text-sm font-medium text-gray-700">Debit To (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.debit_to ?? '')}
                onChange={e => {
                  handleChange('debit_to', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="debit_to"
              />
              {/* Link indicator */}
              {formData.debit_to && (
                <button
                  type="button"
                  onClick={() => handleChange('debit_to', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
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
            <label className="block text-sm font-medium text-gray-700">Is Opening Entry</label>
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
          {!!formData.is_internal_customer && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Unrealized Profit / Loss Account (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.unrealized_profit_loss_account ?? '')}
                onChange={e => {
                  handleChange('unrealized_profit_loss_account', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="unrealized_profit_loss_account"
              />
              {/* Link indicator */}
              {formData.unrealized_profit_loss_account && (
                <button
                  type="button"
                  onClick={() => handleChange('unrealized_profit_loss_account', '')}
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
            <label className="block text-sm font-medium text-gray-700">Against Income Account</label>
            <textarea
              value={String(formData.against_income_account ?? '')}
              onChange={e => handleChange('against_income_account', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Commission */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Commission</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Partner (→ Sales Partner)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Partner..."
                value={String(formData.sales_partner ?? '')}
                onChange={e => {
                  handleChange('sales_partner', e.target.value);
                  // TODO: Implement async search for Sales Partner
                  // fetch(`/api/resource/Sales Partner?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Partner"
                data-fieldname="sales_partner"
              />
              {/* Link indicator */}
              {formData.sales_partner && (
                <button
                  type="button"
                  onClick={() => handleChange('sales_partner', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount Eligible for Commission</label>
            <input
              type="number"
              step="any"
              value={formData.amount_eligible_for_commission != null ? Number(formData.amount_eligible_for_commission) : ''}
              onChange={e => handleChange('amount_eligible_for_commission', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Commission Rate (%)</label>
            <input
              type="number"
              step="any"
              value={formData.commission_rate != null ? Number(formData.commission_rate) : ''}
              onChange={e => handleChange('commission_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Commission</label>
            <input
              type="number"
              step="any"
              value={formData.total_commission != null ? Number(formData.total_commission) : ''}
              onChange={e => handleChange('total_commission', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Sales Team */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Sales Team</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: sales_team → Sales Team */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Sales Contributions and Incentives</label>
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
                  {(Array.isArray(formData.sales_team) ? (formData.sales_team as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.sales_team) ? formData.sales_team : [])];
                            rows.splice(idx, 1);
                            handleChange('sales_team', rows);
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
                  onClick={() => handleChange('sales_team', [...(Array.isArray(formData.sales_team) ? formData.sales_team : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Print Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Print Settings</h4>
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
            <label className="block text-sm font-medium text-gray-700">Print Language (→ Language)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Language..."
                value={String(formData.language ?? '')}
                onChange={e => {
                  handleChange('language', e.target.value);
                  // TODO: Implement async search for Language
                  // fetch(`/api/resource/Language?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Language"
                data-fieldname="language"
              />
              {/* Link indicator */}
              {formData.language && (
                <button
                  type="button"
                  onClick={() => handleChange('language', '')}
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
      {/* Section: Subscription */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Subscription</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Subscription (→ Subscription)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Subscription..."
                value={String(formData.subscription ?? '')}
                onChange={e => {
                  handleChange('subscription', e.target.value);
                  // TODO: Implement async search for Subscription
                  // fetch(`/api/resource/Subscription?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Subscription"
                data-fieldname="subscription"
              />
              {/* Link indicator */}
              {formData.subscription && (
                <button
                  type="button"
                  onClick={() => handleChange('subscription', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={String(formData.to_date ?? '')}
              onChange={e => handleChange('to_date', e.target.value)}
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
              <option value="Return">Return</option>
              <option value="Credit Note Issued">Credit Note Issued</option>
              <option value="Submitted">Submitted</option>
              <option value="Paid">Paid</option>
              <option value="Partly Paid">Partly Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Unpaid and Discounted">Unpaid and Discounted</option>
              <option value="Partly Paid and Discounted">Partly Paid and Discounted</option>
              <option value="Overdue and Discounted">Overdue and Discounted</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Internal Transfer">Internal Transfer</option>
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
            <label className="block text-sm font-medium text-gray-700">Customer Group (→ Customer Group)</label>
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
            <label className="block text-sm font-medium text-gray-700">Source (→ UTM Source)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UTM Source..."
                value={String(formData.utm_source ?? '')}
                onChange={e => {
                  handleChange('utm_source', e.target.value);
                  // TODO: Implement async search for UTM Source
                  // fetch(`/api/resource/UTM Source?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="UTM Source"
                data-fieldname="utm_source"
              />
              {/* Link indicator */}
              {formData.utm_source && (
                <button
                  type="button"
                  onClick={() => handleChange('utm_source', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Campaign (→ UTM Campaign)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UTM Campaign..."
                value={String(formData.utm_campaign ?? '')}
                onChange={e => {
                  handleChange('utm_campaign', e.target.value);
                  // TODO: Implement async search for UTM Campaign
                  // fetch(`/api/resource/UTM Campaign?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="UTM Campaign"
                data-fieldname="utm_campaign"
              />
              {/* Link indicator */}
              {formData.utm_campaign && (
                <button
                  type="button"
                  onClick={() => handleChange('utm_campaign', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Medium (→ UTM Medium)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UTM Medium..."
                value={String(formData.utm_medium ?? '')}
                onChange={e => {
                  handleChange('utm_medium', e.target.value);
                  // TODO: Implement async search for UTM Medium
                  // fetch(`/api/resource/UTM Medium?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="UTM Medium"
                data-fieldname="utm_medium"
              />
              {/* Link indicator */}
              {formData.utm_medium && (
                <button
                  type="button"
                  onClick={() => handleChange('utm_medium', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <input
              type="text"
              value={String(formData.utm_content ?? '')}
              onChange={e => handleChange('utm_content', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_internal_customer}
              onChange={e => handleChange('is_internal_customer', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Internal Customer</label>
          </div>
          {!!formData.is_internal_customer && (
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
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Inter Company Invoice Reference (→ Purchase Invoice)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Purchase Invoice..."
                value={String(formData.inter_company_invoice_reference ?? '')}
                onChange={e => {
                  handleChange('inter_company_invoice_reference', e.target.value);
                  // TODO: Implement async search for Purchase Invoice
                  // fetch(`/api/resource/Purchase Invoice?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Purchase Invoice"
                data-fieldname="inter_company_invoice_reference"
              />
              {/* Link indicator */}
              {formData.inter_company_invoice_reference && (
                <button
                  type="button"
                  onClick={() => handleChange('inter_company_invoice_reference', '')}
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
              checked={!!formData.is_discounted}
              onChange={e => handleChange('is_discounted', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Discounted</label>
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