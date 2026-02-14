// Form scaffold for Purchase Invoice Advance
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PurchaseInvoiceAdvance } from '../types/purchase-invoice-advance.js';

interface PurchaseInvoiceAdvanceFormProps {
  initialData?: Partial<PurchaseInvoiceAdvance>;
  onSubmit: (data: Partial<PurchaseInvoiceAdvance>) => void;
  mode: 'create' | 'edit';
}

export function PurchaseInvoiceAdvanceForm({ initialData = {}, onSubmit, mode }: PurchaseInvoiceAdvanceFormProps) {
  const [formData, setFormData] = useState<Partial<PurchaseInvoiceAdvance>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Purchase Invoice Advance' : 'New Purchase Invoice Advance'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reference Type (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.reference_type ?? '')}
                onChange={e => {
                  handleChange('reference_type', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="reference_type"
              />
              {/* Link indicator */}
              {formData.reference_type && (
                <button
                  type="button"
                  onClick={() => handleChange('reference_type', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reference Name</label>
            <input
              type="text"
              value={String(formData.reference_name ?? '')}
              onChange={e => handleChange('reference_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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
            <label className="block text-sm font-medium text-gray-700">Reference Row</label>
            <input
              type="text"
              value={String(formData.reference_row ?? '')}
              onChange={e => handleChange('reference_row', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Advance Amount</label>
            <input
              type="number"
              step="any"
              value={formData.advance_amount != null ? Number(formData.advance_amount) : ''}
              onChange={e => handleChange('advance_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Allocated Amount</label>
            <input
              type="number"
              step="any"
              value={formData.allocated_amount != null ? Number(formData.allocated_amount) : ''}
              onChange={e => handleChange('allocated_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.exchange_gain_loss && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Exchange Gain/Loss</label>
            <input
              type="number"
              step="any"
              value={formData.exchange_gain_loss != null ? Number(formData.exchange_gain_loss) : ''}
              onChange={e => handleChange('exchange_gain_loss', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.exchange_gain_loss && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Reference Exchange Rate</label>
            <input
              type="number"
              step="any"
              value={formData.ref_exchange_rate != null ? Number(formData.ref_exchange_rate) : ''}
              onChange={e => handleChange('ref_exchange_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Difference Posting Date</label>
            <input
              type="date"
              value={String(formData.difference_posting_date ?? '')}
              onChange={e => handleChange('difference_posting_date', e.target.value)}
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