// Form scaffold for Bank Account Type
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { BankAccountType } from '../types/bank-account-type.js';

interface BankAccountTypeFormProps {
  initialData?: Partial<BankAccountType>;
  onSubmit: (data: Partial<BankAccountType>) => void;
  mode: 'create' | 'edit';
}

export function BankAccountTypeForm({ initialData = {}, onSubmit, mode }: BankAccountTypeFormProps) {
  const [formData, setFormData] = useState<Partial<BankAccountType>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Bank Account Type' : 'New Bank Account Type'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Type</label>
            <input
              type="text"
              value={String(formData.account_type ?? '')}
              onChange={e => handleChange('account_type', e.target.value)}
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