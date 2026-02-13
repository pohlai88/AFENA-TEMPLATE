// Form scaffold for Ledger Health
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { LedgerHealth } from '../types/ledger-health.js';

interface LedgerHealthFormProps {
  initialData?: Partial<LedgerHealth>;
  onSubmit: (data: Partial<LedgerHealth>) => void;
  mode: 'create' | 'edit';
}

export function LedgerHealthForm({ initialData = {}, onSubmit, mode }: LedgerHealthFormProps) {
  const [formData, setFormData] = useState<Partial<LedgerHealth>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Ledger Health' : 'New Ledger Health'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Voucher Type</label>
            <input
              type="text"
              value={String(formData.voucher_type ?? '')}
              onChange={e => handleChange('voucher_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Voucher No</label>
            <input
              type="text"
              value={String(formData.voucher_no ?? '')}
              onChange={e => handleChange('voucher_no', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Checked On</label>
            <input
              type="datetime-local"
              value={String(formData.checked_on ?? '')}
              onChange={e => handleChange('checked_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.debit_credit_mismatch}
              onChange={e => handleChange('debit_credit_mismatch', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Debit-Credit mismatch</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.general_and_payment_ledger_mismatch}
              onChange={e => handleChange('general_and_payment_ledger_mismatch', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">General and Payment Ledger mismatch</label>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}