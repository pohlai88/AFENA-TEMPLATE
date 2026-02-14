// Form scaffold for Payment Entry Reference
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PaymentEntryReference } from '../types/payment-entry-reference.js';

interface PaymentEntryReferenceFormProps {
  initialData?: Partial<PaymentEntryReference>;
  onSubmit: (data: Partial<PaymentEntryReference>) => void;
  mode: 'create' | 'edit';
}

export function PaymentEntryReferenceForm({ initialData = {}, onSubmit, mode }: PaymentEntryReferenceFormProps) {
  const [formData, setFormData] = useState<Partial<PaymentEntryReference>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Payment Entry Reference' : 'New Payment Entry Reference'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.reference_doctype ?? '')}
                onChange={e => {
                  handleChange('reference_doctype', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="reference_doctype"
              />
              {/* Link indicator */}
              {formData.reference_doctype && (
                <button
                  type="button"
                  onClick={() => handleChange('reference_doctype', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={String(formData.reference_name ?? '')}
              onChange={e => handleChange('reference_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
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
            <label className="block text-sm font-medium text-gray-700">Supplier Invoice No</label>
            <input
              type="text"
              value={String(formData.bill_no ?? '')}
              onChange={e => handleChange('bill_no', e.target.value)}
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
          {!!formData.payment_term && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Term Outstanding</label>
            <input
              type="number"
              step="any"
              value={formData.payment_term_outstanding != null ? Number(formData.payment_term_outstanding) : ''}
              onChange={e => handleChange('payment_term_outstanding', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Type</label>
            <input
              type="text"
              value={String(formData.account_type ?? '')}
              onChange={e => handleChange('account_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Type</label>
            <input
              type="text"
              value={String(formData.payment_type ?? '')}
              onChange={e => handleChange('payment_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reconcile Effect On</label>
            <input
              type="date"
              value={String(formData.reconcile_effect_on ?? '')}
              onChange={e => handleChange('reconcile_effect_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Grand Total</label>
            <input
              type="number"
              step="any"
              value={formData.total_amount != null ? Number(formData.total_amount) : ''}
              onChange={e => handleChange('total_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Outstanding</label>
            <input
              type="number"
              step="any"
              value={formData.outstanding_amount != null ? Number(formData.outstanding_amount) : ''}
              onChange={e => handleChange('outstanding_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Allocated</label>
            <input
              type="number"
              step="any"
              value={formData.allocated_amount != null ? Number(formData.allocated_amount) : ''}
              onChange={e => handleChange('allocated_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {(formData.reference_doctype==='Purchase Invoice') && (
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
          )}
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
            <label className="block text-sm font-medium text-gray-700">Payment Request (→ Payment Request)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Payment Request..."
                value={String(formData.payment_request ?? '')}
                onChange={e => {
                  handleChange('payment_request', e.target.value);
                  // TODO: Implement async search for Payment Request
                  // fetch(`/api/resource/Payment Request?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Payment Request"
                data-fieldname="payment_request"
              />
              {/* Link indicator */}
              {formData.payment_request && (
                <button
                  type="button"
                  onClick={() => handleChange('payment_request', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {formData.payment_request && formData.payment_request_outstanding && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Request Outstanding</label>
            <input
              type="number"
              step="any"
              value={formData.payment_request_outstanding != null ? Number(formData.payment_request_outstanding) : ''}
              onChange={e => handleChange('payment_request_outstanding', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Advance Voucher Type (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.advance_voucher_type ?? '')}
                onChange={e => {
                  handleChange('advance_voucher_type', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="advance_voucher_type"
              />
              {/* Link indicator */}
              {formData.advance_voucher_type && (
                <button
                  type="button"
                  onClick={() => handleChange('advance_voucher_type', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Advance Voucher No</label>
            <input
              type="text"
              value={String(formData.advance_voucher_no ?? '')}
              onChange={e => handleChange('advance_voucher_no', e.target.value)}
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