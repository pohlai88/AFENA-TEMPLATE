// Form scaffold for Overdue Payment
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { OverduePayment } from '../types/overdue-payment.js';

interface OverduePaymentFormProps {
  initialData?: Partial<OverduePayment>;
  onSubmit: (data: Partial<OverduePayment>) => void;
  mode: 'create' | 'edit';
}

export function OverduePaymentForm({ initialData = {}, onSubmit, mode }: OverduePaymentFormProps) {
  const [formData, setFormData] = useState<Partial<OverduePayment>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Overdue Payment' : 'New Overdue Payment'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Invoice (→ Sales Invoice)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Invoice..."
                value={String(formData.sales_invoice ?? '')}
                onChange={e => {
                  handleChange('sales_invoice', e.target.value);
                  // TODO: Implement async search for Sales Invoice
                  // fetch(`/api/resource/Sales Invoice?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Sales Invoice"
                data-fieldname="sales_invoice"
              />
              {/* Link indicator */}
              {formData.sales_invoice && (
                <button
                  type="button"
                  onClick={() => handleChange('sales_invoice', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Schedule</label>
            <input
              type="text"
              value={String(formData.payment_schedule ?? '')}
              onChange={e => handleChange('payment_schedule', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dunning Level</label>
            <input
              type="number"
              step="1"
              value={formData.dunning_level != null ? Number(formData.dunning_level) : ''}
              onChange={e => handleChange('dunning_level', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Term (→ Payment Term)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Payment Term..."
                value={String(formData.payment_term ?? '')}
                onChange={e => {
                  handleChange('payment_term', e.target.value);
                  // TODO: Implement async search for Payment Term
                  // fetch(`/api/resource/Payment Term?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Payment Term"
                data-fieldname="payment_term"
              />
              {/* Link indicator */}
              {formData.payment_term && (
                <button
                  type="button"
                  onClick={() => handleChange('payment_term', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
      {/* Section: Description */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Description</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={String(formData.description ?? '')}
              onChange={e => handleChange('description', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: section_break_4 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              value={String(formData.due_date ?? '')}
              onChange={e => handleChange('due_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Overdue Days</label>
            <input
              type="text"
              value={String(formData.overdue_days ?? '')}
              onChange={e => handleChange('overdue_days', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Invoice Portion</label>
            <input
              type="number"
              step="any"
              value={formData.invoice_portion != null ? Number(formData.invoice_portion) : ''}
              onChange={e => handleChange('invoice_portion', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: section_break_16 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Amount</label>
            <input
              type="number"
              step="any"
              value={formData.payment_amount != null ? Number(formData.payment_amount) : ''}
              onChange={e => handleChange('payment_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Outstanding</label>
            <input
              type="number"
              step="any"
              value={formData.outstanding != null ? Number(formData.outstanding) : ''}
              onChange={e => handleChange('outstanding', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.paid_amount && (
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
          {!!formData.discounted_amount && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Discounted Amount</label>
            <input
              type="number"
              step="any"
              value={formData.discounted_amount != null ? Number(formData.discounted_amount) : ''}
              onChange={e => handleChange('discounted_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Interest</label>
            <input
              type="number"
              step="any"
              value={formData.interest != null ? Number(formData.interest) : ''}
              onChange={e => handleChange('interest', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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