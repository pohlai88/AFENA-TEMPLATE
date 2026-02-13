// Form scaffold for Payment Reconciliation Invoice
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PaymentReconciliationInvoice } from '../types/payment-reconciliation-invoice.js';

interface PaymentReconciliationInvoiceFormProps {
  initialData?: Partial<PaymentReconciliationInvoice>;
  onSubmit: (data: Partial<PaymentReconciliationInvoice>) => void;
  mode: 'create' | 'edit';
}

export function PaymentReconciliationInvoiceForm({ initialData = {}, onSubmit, mode }: PaymentReconciliationInvoiceFormProps) {
  const [formData, setFormData] = useState<Partial<PaymentReconciliationInvoice>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Payment Reconciliation Invoice' : 'New Payment Reconciliation Invoice'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Invoice Type</label>
            <select
              value={String(formData.invoice_type ?? '')}
              onChange={e => handleChange('invoice_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Sales Invoice">Sales Invoice</option>
              <option value="Purchase Invoice">Purchase Invoice</option>
              <option value="Journal Entry">Journal Entry</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
            <input
              type="text"
              value={String(formData.invoice_number ?? '')}
              onChange={e => handleChange('invoice_number', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
            <input
              type="date"
              value={String(formData.invoice_date ?? '')}
              onChange={e => handleChange('invoice_date', e.target.value)}
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
            <label className="block text-sm font-medium text-gray-700">Outstanding Amount</label>
            <input
              type="number"
              step="any"
              value={formData.outstanding_amount != null ? Number(formData.outstanding_amount) : ''}
              onChange={e => handleChange('outstanding_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
              value={formData.exchange_rate != null ? Number(formData.exchange_rate) : ''}
              onChange={e => handleChange('exchange_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
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