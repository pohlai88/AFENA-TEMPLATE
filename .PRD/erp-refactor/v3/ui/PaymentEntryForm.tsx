// Form scaffold for Payment Entry
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PaymentEntry } from '../types/payment-entry.js';

interface PaymentEntryFormProps {
  initialData?: Partial<PaymentEntry>;
  onSubmit: (data: Partial<PaymentEntry>) => void;
  mode: 'create' | 'edit';
}

export function PaymentEntryForm({ initialData = {}, onSubmit, mode }: PaymentEntryFormProps) {
  const [formData, setFormData] = useState<Partial<PaymentEntry>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">
        {mode === 'edit' ? formData.title ?? 'Payment Entry' : 'New Payment Entry'}
      </h2>
      {/* Section: Type of Payment */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Type of Payment</h4>
        <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-gray-700">Payment Type</label>
            <select
              value={String(formData.payment_type ?? '')}
              onChange={e => handleChange('payment_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Receive">Receive</option>
              <option value="Pay">Pay</option>
              <option value="Internal Transfer">Internal Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Order Status</label>
            <select
              value={String(formData.payment_order_status ?? '')}
              onChange={e => handleChange('payment_order_status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Initiated">Initiated</option>
              <option value="Payment Ordered">Payment Ordered</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Posting Date</label>
            <input
              type="date"
              value={String(formData.posting_date ?? '')}
              onChange={e => handleChange('posting_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
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
        </div>
      </div>
      {/* Section: Payment From / To */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Payment From / To</h4>
        <div className="grid grid-cols-2 gap-4">
          {in_list(["Receive", "Pay"], formData.payment_type) && formData.docstatus===0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Party Type (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.party_type ?? '')}
                onChange={e => {
                  handleChange('party_type', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="party_type"
              />
              {/* Link indicator */}
              {formData.party_type && (
                <button
                  type="button"
                  onClick={() => handleChange('party_type', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {in_list(["Receive", "Pay"], formData.payment_type) && formData.party_type && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Party</label>
            <input
              type="text"
              value={String(formData.party ?? '')}
              onChange={e => handleChange('party', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {in_list(["Receive", "Pay"], formData.payment_type) && formData.party_type && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Party Name</label>
            <input
              type="text"
              value={String(formData.party_name ?? '')}
              onChange={e => handleChange('party_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.book_advance_payments_in_separate_party_account}
              onChange={e => handleChange('book_advance_payments_in_separate_party_account', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Book Advance Payments in Separate Party Account</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.reconcile_on_advance_payment_date}
              onChange={e => handleChange('reconcile_on_advance_payment_date', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Reconcile on Advance Payment Date</label>
          </div>
          {formData.party_type === 'Supplier' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.apply_tds}
              onChange={e => handleChange('apply_tds', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Consider for Tax Withholding</label>
          </div>
          )}
          {!!formData.apply_tds && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Withholding Category (→ Tax Withholding Category)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Tax Withholding Category..."
                value={String(formData.tax_withholding_category ?? '')}
                onChange={e => {
                  handleChange('tax_withholding_category', e.target.value);
                  // TODO: Implement async search for Tax Withholding Category
                  // fetch(`/api/resource/Tax Withholding Category?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Tax Withholding Category"
                data-fieldname="tax_withholding_category"
              />
              {/* Link indicator */}
              {formData.tax_withholding_category && (
                <button
                  type="button"
                  onClick={() => handleChange('tax_withholding_category', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {!!formData.party && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Bank Account (→ Bank Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Bank Account..."
                value={String(formData.bank_account ?? '')}
                onChange={e => {
                  handleChange('bank_account', e.target.value);
                  // TODO: Implement async search for Bank Account
                  // fetch(`/api/resource/Bank Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Bank Account"
                data-fieldname="bank_account"
              />
              {/* Link indicator */}
              {formData.bank_account && (
                <button
                  type="button"
                  onClick={() => handleChange('bank_account', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {!!formData.party && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Party Bank Account (→ Bank Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Bank Account..."
                value={String(formData.party_bank_account ?? '')}
                onChange={e => {
                  handleChange('party_bank_account', e.target.value);
                  // TODO: Implement async search for Bank Account
                  // fetch(`/api/resource/Bank Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Bank Account"
                data-fieldname="party_bank_account"
              />
              {/* Link indicator */}
              {formData.party_bank_account && (
                <button
                  type="button"
                  onClick={() => handleChange('party_bank_account', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.party && formData.party_type !==== "Employee" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact (→ Contact)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Contact..."
                value={String(formData.contact_person ?? '')}
                onChange={e => {
                  handleChange('contact_person', e.target.value);
                  // TODO: Implement async search for Contact
                  // fetch(`/api/resource/Contact?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Contact"
                data-fieldname="contact_person"
              />
              {/* Link indicator */}
              {formData.contact_person && (
                <button
                  type="button"
                  onClick={() => handleChange('contact_person', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {(formData.contact_person || formData.party_type ==== "Employee") && formData.contact_email && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="text"
              value={String(formData.contact_email ?? '')}
              onChange={e => handleChange('contact_email', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Accounts */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Accounts</h4>
        <div className="grid grid-cols-2 gap-4">
          {(in_list(["Internal Transfer", "Pay"], formData.payment_type) || formData.party) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Paid From (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.paid_from ?? '')}
                onChange={e => {
                  handleChange('paid_from', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="paid_from"
              />
              {/* Link indicator */}
              {formData.paid_from && (
                <button
                  type="button"
                  onClick={() => handleChange('paid_from', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Paid From Account Type</label>
            <input
              type="text"
              value={String(formData.paid_from_account_type ?? '')}
              onChange={e => handleChange('paid_from_account_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.paid_from && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Currency (From) (→ Currency)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Currency..."
                value={String(formData.paid_from_account_currency ?? '')}
                onChange={e => {
                  handleChange('paid_from_account_currency', e.target.value);
                  // TODO: Implement async search for Currency
                  // fetch(`/api/resource/Currency?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Currency"
                data-fieldname="paid_from_account_currency"
              />
              {/* Link indicator */}
              {formData.paid_from_account_currency && (
                <button
                  type="button"
                  onClick={() => handleChange('paid_from_account_currency', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {(in_list(["Internal Transfer", "Receive"], formData.payment_type) || formData.party) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Paid To (→ Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Account..."
                value={String(formData.paid_to ?? '')}
                onChange={e => {
                  handleChange('paid_to', e.target.value);
                  // TODO: Implement async search for Account
                  // fetch(`/api/resource/Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Account"
                data-fieldname="paid_to"
              />
              {/* Link indicator */}
              {formData.paid_to && (
                <button
                  type="button"
                  onClick={() => handleChange('paid_to', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Paid To Account Type</label>
            <input
              type="text"
              value={String(formData.paid_to_account_type ?? '')}
              onChange={e => handleChange('paid_to_account_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.paid_to && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Currency (To) (→ Currency)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Currency..."
                value={String(formData.paid_to_account_currency ?? '')}
                onChange={e => {
                  handleChange('paid_to_account_currency', e.target.value);
                  // TODO: Implement async search for Currency
                  // fetch(`/api/resource/Currency?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Currency"
                data-fieldname="paid_to_account_currency"
              />
              {/* Link indicator */}
              {formData.paid_to_account_currency && (
                <button
                  type="button"
                  onClick={() => handleChange('paid_to_account_currency', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
        </div>
      </div>
      {/* Section: Amount */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Amount</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Paid Amount</label>
            <input
              type="number"
              step="any"
              value={formData.paid_amount != null ? Number(formData.paid_amount) : ''}
              onChange={e => handleChange('paid_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Paid Amount After Tax</label>
            <input
              type="number"
              step="any"
              value={formData.paid_amount_after_tax != null ? Number(formData.paid_amount_after_tax) : ''}
              onChange={e => handleChange('paid_amount_after_tax', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Source Exchange Rate</label>
            <input
              type="number"
              step="any"
              value={formData.source_exchange_rate != null ? Number(formData.source_exchange_rate) : ''}
              onChange={e => handleChange('source_exchange_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Paid Amount (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_paid_amount != null ? Number(formData.base_paid_amount) : ''}
              onChange={e => handleChange('base_paid_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Paid Amount After Tax (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_paid_amount_after_tax != null ? Number(formData.base_paid_amount_after_tax) : ''}
              onChange={e => handleChange('base_paid_amount_after_tax', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Received Amount</label>
            <input
              type="number"
              step="any"
              value={formData.received_amount != null ? Number(formData.received_amount) : ''}
              onChange={e => handleChange('received_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          {formData.received_amount && formData.payment_type !== 'Internal Transfer' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Received Amount After Tax</label>
            <input
              type="number"
              step="any"
              value={formData.received_amount_after_tax != null ? Number(formData.received_amount_after_tax) : ''}
              onChange={e => handleChange('received_amount_after_tax', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Exchange Rate</label>
            <input
              type="number"
              step="any"
              value={formData.target_exchange_rate != null ? Number(formData.target_exchange_rate) : ''}
              onChange={e => handleChange('target_exchange_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          {!!formData.received_amount && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Received Amount (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_received_amount != null ? Number(formData.base_received_amount) : ''}
              onChange={e => handleChange('base_received_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          )}
          {!!formData.received_amount && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Received Amount After Tax (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_received_amount_after_tax != null ? Number(formData.base_received_amount_after_tax) : ''}
              onChange={e => handleChange('base_received_amount_after_tax', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Reference */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Reference</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: references → Payment Entry Reference */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Payment References</label>
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
                  {(Array.isArray(formData.references) ? (formData.references as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.references) ? formData.references : [])];
                            rows.splice(idx, 1);
                            handleChange('references', rows);
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
                  onClick={() => handleChange('references', [...(Array.isArray(formData.references) ? formData.references : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Writeoff */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Writeoff</h4>
        <div className="grid grid-cols-2 gap-4">
          {(formData.paid_amount && formData.received_amount && formData.references) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Allocated Amount</label>
            <input
              type="number"
              step="any"
              value={formData.total_allocated_amount != null ? Number(formData.total_allocated_amount) : ''}
              onChange={e => handleChange('total_allocated_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Allocated Amount (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_total_allocated_amount != null ? Number(formData.base_total_allocated_amount) : ''}
              onChange={e => handleChange('base_total_allocated_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {(formData.paid_amount && formData.received_amount && formData.references) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Unallocated Amount</label>
            <input
              type="number"
              step="any"
              value={formData.unallocated_amount != null ? Number(formData.unallocated_amount) : ''}
              onChange={e => handleChange('unallocated_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {(formData.paid_amount && formData.received_amount) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Difference Amount (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.difference_amount != null ? Number(formData.difference_amount) : ''}
              onChange={e => handleChange('difference_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Taxes and Charges */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Taxes and Charges</h4>
        <div className="grid grid-cols-2 gap-4">
          {formData.party_type === 'Supplier' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Taxes and Charges Template (→ Purchase Taxes and Charges Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Purchase Taxes and Charges Template..."
                value={String(formData.purchase_taxes_and_charges_template ?? '')}
                onChange={e => {
                  handleChange('purchase_taxes_and_charges_template', e.target.value);
                  // TODO: Implement async search for Purchase Taxes and Charges Template
                  // fetch(`/api/resource/Purchase Taxes and Charges Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Purchase Taxes and Charges Template"
                data-fieldname="purchase_taxes_and_charges_template"
              />
              {/* Link indicator */}
              {formData.purchase_taxes_and_charges_template && (
                <button
                  type="button"
                  onClick={() => handleChange('purchase_taxes_and_charges_template', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.party_type === 'Customer' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Taxes and Charges Template (→ Sales Taxes and Charges Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Taxes and Charges Template..."
                value={String(formData.sales_taxes_and_charges_template ?? '')}
                onChange={e => {
                  handleChange('sales_taxes_and_charges_template', e.target.value);
                  // TODO: Implement async search for Sales Taxes and Charges Template
                  // fetch(`/api/resource/Sales Taxes and Charges Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Taxes and Charges Template"
                data-fieldname="sales_taxes_and_charges_template"
              />
              {/* Link indicator */}
              {formData.sales_taxes_and_charges_template && (
                <button
                  type="button"
                  onClick={() => handleChange('sales_taxes_and_charges_template', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.party_type === 'Supplier' || formData.party_type === 'Customer' && (
          {/* Child table: taxes → Advance Taxes and Charges */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Advance Taxes and Charges</label>
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
                  {(Array.isArray(formData.taxes) ? (formData.taxes as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.taxes) ? formData.taxes : [])];
                            rows.splice(idx, 1);
                            handleChange('taxes', rows);
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
                  onClick={() => handleChange('taxes', [...(Array.isArray(formData.taxes) ? formData.taxes : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
      {/* Section: section_break_60 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Taxes and Charges (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_total_taxes_and_charges != null ? Number(formData.base_total_taxes_and_charges) : ''}
              onChange={e => handleChange('base_total_taxes_and_charges', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Taxes and Charges</label>
            <input
              type="number"
              step="any"
              value={formData.total_taxes_and_charges != null ? Number(formData.total_taxes_and_charges) : ''}
              onChange={e => handleChange('total_taxes_and_charges', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Deductions or Loss */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Deductions or Loss</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: deductions → Payment Entry Deduction */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Payment Deductions or Loss</label>
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
                  {(Array.isArray(formData.deductions) ? (formData.deductions as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.deductions) ? formData.deductions : [])];
                            rows.splice(idx, 1);
                            handleChange('deductions', rows);
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
                  onClick={() => handleChange('deductions', [...(Array.isArray(formData.deductions) ? formData.deductions : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Tax Withholding Entry */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Tax Withholding Entry</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Withholding Group (→ Tax Withholding Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Tax Withholding Group..."
                value={String(formData.tax_withholding_group ?? '')}
                onChange={e => {
                  handleChange('tax_withholding_group', e.target.value);
                  // TODO: Implement async search for Tax Withholding Group
                  // fetch(`/api/resource/Tax Withholding Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Tax Withholding Group"
                data-fieldname="tax_withholding_group"
              />
              {/* Link indicator */}
              {formData.tax_withholding_group && (
                <button
                  type="button"
                  onClick={() => handleChange('tax_withholding_group', '')}
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
              checked={!!formData.ignore_tax_withholding_threshold}
              onChange={e => handleChange('ignore_tax_withholding_threshold', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Ignore Tax Withholding Threshold</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.override_tax_withholding_entries}
              onChange={e => handleChange('override_tax_withholding_entries', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Edit Tax Withholding Entries</label>
          </div>
          {/* Child table: tax_withholding_entries → Tax Withholding Entry */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Tax Withholding Entries</label>
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
                  {(Array.isArray(formData.tax_withholding_entries) ? (formData.tax_withholding_entries as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.tax_withholding_entries) ? formData.tax_withholding_entries : [])];
                            rows.splice(idx, 1);
                            handleChange('tax_withholding_entries', rows);
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
                  onClick={() => handleChange('tax_withholding_entries', [...(Array.isArray(formData.tax_withholding_entries) ? formData.tax_withholding_entries : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Transaction ID */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Transaction ID</h4>
        <div className="grid grid-cols-2 gap-4">
          {(formData.paid_from && formData.paid_to) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Cheque/Reference No</label>
            <input
              type="text"
              value={String(formData.reference_no ?? '')}
              onChange={e => handleChange('reference_no', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {(formData.paid_from && formData.paid_to) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Cheque/Reference Date</label>
            <input
              type="date"
              value={String(formData.reference_date ?? '')}
              onChange={e => handleChange('reference_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.docstatus===1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Clearance Date</label>
            <input
              type="date"
              value={String(formData.clearance_date ?? '')}
              onChange={e => handleChange('clearance_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Accounting Dimensions */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Accounting Dimensions</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project (→ Project)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Project..."
                value={String(formData.project ?? '')}
                onChange={e => {
                  handleChange('project', e.target.value);
                  // TODO: Implement async search for Project
                  // fetch(`/api/resource/Project?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Project"
                data-fieldname="project"
              />
              {/* Link indicator */}
              {formData.project && (
                <button
                  type="button"
                  onClick={() => handleChange('project', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cost Center (→ Cost Center)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Cost Center..."
                value={String(formData.cost_center ?? '')}
                onChange={e => {
                  handleChange('cost_center', e.target.value);
                  // TODO: Implement async search for Cost Center
                  // fetch(`/api/resource/Cost Center?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Cost Center"
                data-fieldname="cost_center"
              />
              {/* Link indicator */}
              {formData.cost_center && (
                <button
                  type="button"
                  onClick={() => handleChange('cost_center', '')}
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
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
              checked={!!formData.custom_remarks}
              onChange={e => handleChange('custom_remarks', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Custom Remarks</label>
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
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">In Words (Company Currency)</label>
            <textarea
              value={String(formData.base_in_words ?? '')}
              onChange={e => handleChange('base_in_words', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {formData.book_advance_payments_in_separate_party_account === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Is Opening</label>
            <select
              value={String(formData.is_opening ?? '')}
              onChange={e => handleChange('is_opening', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          )}
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Print Heading (→ Print Heading)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Print Heading..."
                value={String(formData.print_heading ?? '')}
                onChange={e => {
                  handleChange('print_heading', e.target.value);
                  // TODO: Implement async search for Print Heading
                  // fetch(`/api/resource/Print Heading?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Print Heading"
                data-fieldname="print_heading"
              />
              {/* Link indicator */}
              {formData.print_heading && (
                <button
                  type="button"
                  onClick={() => handleChange('print_heading', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bank</label>
            <input
              type="text"
              value={String(formData.bank ?? '')}
              onChange={e => handleChange('bank', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bank Account No</label>
            <input
              type="text"
              value={String(formData.bank_account_no ?? '')}
              onChange={e => handleChange('bank_account_no', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Order (→ Payment Order)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Payment Order..."
                value={String(formData.payment_order ?? '')}
                onChange={e => {
                  handleChange('payment_order', e.target.value);
                  // TODO: Implement async search for Payment Order
                  // fetch(`/api/resource/Payment Order?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Payment Order"
                data-fieldname="payment_order"
              />
              {/* Link indicator */}
              {formData.payment_order && (
                <button
                  type="button"
                  onClick={() => handleChange('payment_order', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">In Words</label>
            <textarea
              value={String(formData.in_words ?? '')}
              onChange={e => handleChange('in_words', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Subscription Section */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Subscription Section</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Auto Repeat (→ Auto Repeat)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Auto Repeat..."
                value={String(formData.auto_repeat ?? '')}
                onChange={e => {
                  handleChange('auto_repeat', e.target.value);
                  // TODO: Implement async search for Auto Repeat
                  // fetch(`/api/resource/Auto Repeat?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Auto Repeat"
                data-fieldname="auto_repeat"
              />
              {/* Link indicator */}
              {formData.auto_repeat && (
                <button
                  type="button"
                  onClick={() => handleChange('auto_repeat', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Payment Entry)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Payment Entry..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Payment Entry
                  // fetch(`/api/resource/Payment Entry?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Payment Entry"
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={String(formData.title ?? '')}
              onChange={e => handleChange('title', e.target.value)}
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