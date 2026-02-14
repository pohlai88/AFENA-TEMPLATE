// Form scaffold for Request for Quotation
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { RequestForQuotation } from '../types/request-for-quotation.js';

interface RequestForQuotationFormProps {
  initialData?: Partial<RequestForQuotation>;
  onSubmit: (data: Partial<RequestForQuotation>) => void;
  mode: 'create' | 'edit';
}

export function RequestForQuotationForm({ initialData = {}, onSubmit, mode }: RequestForQuotationFormProps) {
  const [formData, setFormData] = useState<Partial<RequestForQuotation>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Request for Quotation' : 'New Request for Quotation'}</h2>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier (→ Supplier)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Supplier..."
                value={String(formData.vendor ?? '')}
                onChange={e => {
                  handleChange('vendor', e.target.value);
                  // TODO: Implement async search for Supplier
                  // fetch(`/api/resource/Supplier?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Supplier"
                data-fieldname="vendor"
              />
              {/* Link indicator */}
              {formData.vendor && (
                <button
                  type="button"
                  onClick={() => handleChange('vendor', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
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
            <label className="block text-sm font-medium text-gray-700">Required Date</label>
            <input
              type="date"
              value={String(formData.schedule_date ?? '')}
              onChange={e => handleChange('schedule_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Cancelled">Cancelled</option>
            </select>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Request for Quotation)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Request for Quotation..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Request for Quotation
                  // fetch(`/api/resource/Request for Quotation?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Request for Quotation"
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
      {/* Section: suppliers_section */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: suppliers → Request for Quotation Supplier */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Suppliers</label>
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
                  {(Array.isArray(formData.suppliers) ? (formData.suppliers as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.suppliers) ? formData.suppliers : [])];
                            rows.splice(idx, 1);
                            handleChange('suppliers', rows);
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
                  onClick={() => handleChange('suppliers', [...(Array.isArray(formData.suppliers) ? formData.suppliers : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: items_section */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: items → Request for Quotation Item */}
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
      {/* Section: Email Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Email Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Template (→ Email Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Email Template..."
                value={String(formData.email_template ?? '')}
                onChange={e => {
                  handleChange('email_template', e.target.value);
                  // TODO: Implement async search for Email Template
                  // fetch(`/api/resource/Email Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Email Template"
                data-fieldname="email_template"
              />
              {/* Link indicator */}
              {formData.email_template && (
                <button
                  type="button"
                  onClick={() => handleChange('email_template', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">html_llwp</label>
            <textarea
              value={String(formData.html_llwp ?? '')}
              onChange={e => handleChange('html_llwp', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.send_attached_files}
              onChange={e => handleChange('send_attached_files', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Send Attached Files</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.send_document_print}
              onChange={e => handleChange('send_document_print', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Send Document Print</label>
          </div>
        </div>
      </div>
      {/* Section: sec_break_email_2 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              value={String(formData.subject ?? '')}
              onChange={e => handleChange('subject', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Message for Supplier</label>
            <textarea
              value={String(formData.message_for_supplier ?? '')}
              onChange={e => handleChange('message_for_supplier', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
        </div>
      </div>
      {/* Section: Terms and Conditions */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Terms and Conditions</h4>
        <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-gray-700">Opportunity (→ Opportunity)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Opportunity..."
                value={String(formData.opportunity ?? '')}
                onChange={e => {
                  handleChange('opportunity', e.target.value);
                  // TODO: Implement async search for Opportunity
                  // fetch(`/api/resource/Opportunity?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Opportunity"
                data-fieldname="opportunity"
              />
              {/* Link indicator */}
              {formData.opportunity && (
                <button
                  type="button"
                  onClick={() => handleChange('opportunity', '')}
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