// Form scaffold for Bank Transaction Mapping
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { BankTransactionMapping } from '../types/bank-transaction-mapping.js';

interface BankTransactionMappingFormProps {
  initialData?: Partial<BankTransactionMapping>;
  onSubmit: (data: Partial<BankTransactionMapping>) => void;
  mode: 'create' | 'edit';
}

export function BankTransactionMappingForm({ initialData = {}, onSubmit, mode }: BankTransactionMappingFormProps) {
  const [formData, setFormData] = useState<Partial<BankTransactionMapping>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Bank Transaction Mapping' : 'New Bank Transaction Mapping'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Field in Bank Transaction</label>
            <select
              value={String(formData.bank_transaction_field ?? '')}
              onChange={e => handleChange('bank_transaction_field', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>

            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Column in Bank File</label>
            <input
              type="text"
              value={String(formData.file_field ?? '')}
              onChange={e => handleChange('file_field', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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