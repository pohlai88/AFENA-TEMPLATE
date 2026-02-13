// Form scaffold for Request for Quotation Supplier
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { RequestForQuotationSupplier } from '../types/request-for-quotation-supplier.js';

interface RequestForQuotationSupplierFormProps {
  initialData?: Partial<RequestForQuotationSupplier>;
  onSubmit: (data: Partial<RequestForQuotationSupplier>) => void;
  mode: 'create' | 'edit';
}

export function RequestForQuotationSupplierForm({ initialData = {}, onSubmit, mode }: RequestForQuotationSupplierFormProps) {
  const [formData, setFormData] = useState<Partial<RequestForQuotationSupplier>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Request for Quotation Supplier' : 'New Request for Quotation Supplier'}</h2>
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
            <label className="block text-sm font-medium text-gray-700">Contact (→ Contact)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Contact..."
                value={String(formData.contact ?? '')}
                onChange={e => {
                  handleChange('contact', e.target.value);
                  // TODO: Implement async search for Contact
                  // fetch(`/api/resource/Contact?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Contact"
                data-fieldname="contact"
              />
              {/* Link indicator */}
              {formData.contact && (
                <button
                  type="button"
                  onClick={() => handleChange('contact', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {formData.docstatus >= 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Quote Status</label>
            <select
              value={String(formData.quote_status ?? '')}
              onChange={e => handleChange('quote_status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Pending">Pending</option>
              <option value="Received">Received</option>
            </select>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier Name</label>
            <input
              type="text"
              value={String(formData.supplier_name ?? '')}
              onChange={e => handleChange('supplier_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email ID</label>
            <input
              type="text"
              value={String(formData.email_id ?? '')}
              onChange={e => handleChange('email_id', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.send_email}
              onChange={e => handleChange('send_email', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Send Email</label>
          </div>
          {formData.docstatus >= 1 && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.email_sent}
              onChange={e => handleChange('email_sent', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Email Sent</label>
          </div>
          )}

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}