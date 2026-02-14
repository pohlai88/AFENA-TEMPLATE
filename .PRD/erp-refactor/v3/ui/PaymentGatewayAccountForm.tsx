// Form scaffold for Payment Gateway Account
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PaymentGatewayAccount } from '../types/payment-gateway-account.js';

interface PaymentGatewayAccountFormProps {
  initialData?: Partial<PaymentGatewayAccount>;
  onSubmit: (data: Partial<PaymentGatewayAccount>) => void;
  mode: 'create' | 'edit';
}

export function PaymentGatewayAccountForm({ initialData = {}, onSubmit, mode }: PaymentGatewayAccountFormProps) {
  const [formData, setFormData] = useState<Partial<PaymentGatewayAccount>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Payment Gateway Account' : 'New Payment Gateway Account'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Gateway (→ Payment Gateway)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Payment Gateway..."
                value={String(formData.payment_gateway ?? '')}
                onChange={e => {
                  handleChange('payment_gateway', e.target.value);
                  // TODO: Implement async search for Payment Gateway
                  // fetch(`/api/resource/Payment Gateway?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Payment Gateway"
                data-fieldname="payment_gateway"
              />
              {/* Link indicator */}
              {formData.payment_gateway && (
                <button
                  type="button"
                  onClick={() => handleChange('payment_gateway', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Channel</label>
            <select
              value={String(formData.payment_channel ?? '')}
              onChange={e => handleChange('payment_channel', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
              <option value="Other">Other</option>
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_default}
              onChange={e => handleChange('is_default', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Default</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Account (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.payment_account ?? '')}
                onChange={e => {
                  handleChange('payment_account', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="payment_account"
              />
              {/* Link indicator */}
              {formData.payment_account && (
                <button
                  type="button"
                  onClick={() => handleChange('payment_account', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency</label>
            <input
              type="text"
              value={String(formData.currency ?? '')}
              onChange={e => handleChange('currency', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: payment_request_message */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Default Payment Request Message</label>
            <textarea
              value={String(formData.message ?? '')}
              onChange={e => handleChange('message', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Message Examples</label>
            <textarea
              value={String(formData.message_examples ?? '')}
              onChange={e => handleChange('message_examples', e.target.value)}
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