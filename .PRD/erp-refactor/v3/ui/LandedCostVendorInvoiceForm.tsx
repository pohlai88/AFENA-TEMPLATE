// Form scaffold for Landed Cost Vendor Invoice
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { LandedCostVendorInvoice } from '../types/landed-cost-vendor-invoice.js';

interface LandedCostVendorInvoiceFormProps {
  initialData?: Partial<LandedCostVendorInvoice>;
  onSubmit: (data: Partial<LandedCostVendorInvoice>) => void;
  mode: 'create' | 'edit';
}

export function LandedCostVendorInvoiceForm({ initialData = {}, onSubmit, mode }: LandedCostVendorInvoiceFormProps) {
  const [formData, setFormData] = useState<Partial<LandedCostVendorInvoice>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Landed Cost Vendor Invoice' : 'New Landed Cost Vendor Invoice'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Vendor Invoice (→ Purchase Invoice)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Purchase Invoice..."
                value={String(formData.vendor_invoice ?? '')}
                onChange={e => {
                  handleChange('vendor_invoice', e.target.value);
                  // TODO: Implement async search for Purchase Invoice
                  // fetch(`/api/resource/Purchase Invoice?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Purchase Invoice"
                data-fieldname="vendor_invoice"
              />
              {/* Link indicator */}
              {formData.vendor_invoice && (
                <button
                  type="button"
                  onClick={() => handleChange('vendor_invoice', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.amount != null ? Number(formData.amount) : ''}
              onChange={e => handleChange('amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}