// Form scaffold for Payment Term
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PaymentTerm } from '../types/payment-term.js';

interface PaymentTermFormProps {
  initialData?: Partial<PaymentTerm>;
  onSubmit: (data: Partial<PaymentTerm>) => void;
  mode: 'create' | 'edit';
}

export function PaymentTermForm({ initialData = {}, onSubmit, mode }: PaymentTermFormProps) {
  const [formData, setFormData] = useState<Partial<PaymentTerm>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Payment Term' : 'New Payment Term'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Term Name</label>
            <input
              type="text"
              value={String(formData.payment_term_name ?? '')}
              onChange={e => handleChange('payment_term_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Invoice Portion (%)</label>
            <input
              type="number"
              step="any"
              value={formData.invoice_portion != null ? Number(formData.invoice_portion) : ''}
              onChange={e => handleChange('invoice_portion', e.target.value ? parseFloat(e.target.value) : undefined)}
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
            <label className="block text-sm font-medium text-gray-700">Due Date Based On</label>
            <select
              value={String(formData.due_date_based_on ?? '')}
              onChange={e => handleChange('due_date_based_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Day(s) after invoice date">Day(s) after invoice date</option>
              <option value="Day(s) after the end of the invoice month">Day(s) after the end of the invoice month</option>
              <option value="Month(s) after the end of the invoice month">Month(s) after the end of the invoice month</option>
            </select>
          </div>
          {in_list(['Day(s) after invoice date', 'Day(s) after the end of the invoice month'], formData.due_date_based_on) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Credit Days</label>
            <input
              type="number"
              step="1"
              value={formData.credit_days != null ? Number(formData.credit_days) : ''}
              onChange={e => handleChange('credit_days', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.due_date_based_on==='Month(s) after the end of the invoice month' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Credit Months</label>
            <input
              type="number"
              step="1"
              value={formData.credit_months != null ? Number(formData.credit_months) : ''}
              onChange={e => handleChange('credit_months', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
      {/* Section: Discount Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Discount Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount Type</label>
            <select
              value={String(formData.discount_type ?? '')}
              onChange={e => handleChange('discount_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Percentage">Percentage</option>
              <option value="Amount">Amount</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount</label>
            <input
              type="number"
              step="any"
              value={formData.discount != null ? Number(formData.discount) : ''}
              onChange={e => handleChange('discount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.discount && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount Validity Based On</label>
            <select
              value={String(formData.discount_validity_based_on ?? '')}
              onChange={e => handleChange('discount_validity_based_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Day(s) after invoice date">Day(s) after invoice date</option>
              <option value="Day(s) after the end of the invoice month">Day(s) after the end of the invoice month</option>
              <option value="Month(s) after the end of the invoice month">Month(s) after the end of the invoice month</option>
            </select>
          </div>
          )}
          {!!formData.discount && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount Validity</label>
            <input
              type="number"
              step="1"
              value={formData.discount_validity != null ? Number(formData.discount_validity) : ''}
              onChange={e => handleChange('discount_validity', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: section_break_6 */}
      <div className="border rounded-lg p-4 space-y-4">
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

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}