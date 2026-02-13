// Form scaffold for Bank Clearance Detail
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { BankClearanceDetail } from '../types/bank-clearance-detail.js';

interface BankClearanceDetailFormProps {
  initialData?: Partial<BankClearanceDetail>;
  onSubmit: (data: Partial<BankClearanceDetail>) => void;
  mode: 'create' | 'edit';
}

export function BankClearanceDetailForm({ initialData = {}, onSubmit, mode }: BankClearanceDetailFormProps) {
  const [formData, setFormData] = useState<Partial<BankClearanceDetail>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Bank Clearance Detail' : 'New Bank Clearance Detail'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Document (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.payment_document ?? '')}
                onChange={e => {
                  handleChange('payment_document', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="payment_document"
              />
              {/* Link indicator */}
              {formData.payment_document && (
                <button
                  type="button"
                  onClick={() => handleChange('payment_document', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Entry</label>
            <input
              type="text"
              value={String(formData.payment_entry ?? '')}
              onChange={e => handleChange('payment_entry', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Against Account</label>
            <input
              type="text"
              value={String(formData.against_account ?? '')}
              onChange={e => handleChange('against_account', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="text"
              value={String(formData.amount ?? '')}
              onChange={e => handleChange('amount', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Posting Date</label>
            <input
              type="date"
              value={String(formData.posting_date ?? '')}
              onChange={e => handleChange('posting_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cheque Number</label>
            <input
              type="text"
              value={String(formData.cheque_number ?? '')}
              onChange={e => handleChange('cheque_number', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cheque Date</label>
            <input
              type="date"
              value={String(formData.cheque_date ?? '')}
              onChange={e => handleChange('cheque_date', e.target.value)}
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