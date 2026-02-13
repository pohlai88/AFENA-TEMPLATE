// Form scaffold for Sales Invoice Payment
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SalesInvoicePayment } from '../types/sales-invoice-payment.js';

interface SalesInvoicePaymentFormProps {
  initialData?: Partial<SalesInvoicePayment>;
  onSubmit: (data: Partial<SalesInvoicePayment>) => void;
  mode: 'create' | 'edit';
}

export function SalesInvoicePaymentForm({ initialData = {}, onSubmit, mode }: SalesInvoicePaymentFormProps) {
  const [formData, setFormData] = useState<Partial<SalesInvoicePayment>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Sales Invoice Payment' : 'New Sales Invoice Payment'}</h2>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.default}
              onChange={e => handleChange('default', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Default</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mode of Payment (→ Mode of Payment)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Mode of Payment..."
                value={String(formData.mode_of_payment ?? '')}
                onChange={e => {
                  handleChange('mode_of_payment', e.target.value);
                  // TODO: Implement async search for Mode of Payment
                  // fetch(`/api/resource/Mode of Payment?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Mode of Payment"
                data-fieldname="mode_of_payment"
              />
              {/* Link indicator */}
              {formData.mode_of_payment && (
                <button
                  type="button"
                  onClick={() => handleChange('mode_of_payment', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {parent.doctype === 'Sales Invoice' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              step="any"
              value={formData.amount != null ? Number(formData.amount) : ''}
              onChange={e => handleChange('amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Reference No</label>
            <input
              type="text"
              value={String(formData.reference_no ?? '')}
              onChange={e => handleChange('reference_no', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.account ?? '')}
                onChange={e => {
                  handleChange('account', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="account"
              />
              {/* Link indicator */}
              {formData.account && (
                <button
                  type="button"
                  onClick={() => handleChange('account', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <input
              type="text"
              value={String(formData.type ?? '')}
              onChange={e => handleChange('type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Base Amount (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_amount != null ? Number(formData.base_amount) : ''}
              onChange={e => handleChange('base_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Clearance Date</label>
            <input
              type="date"
              value={String(formData.clearance_date ?? '')}
              onChange={e => handleChange('clearance_date', e.target.value)}
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