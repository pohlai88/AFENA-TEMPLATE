// Form scaffold for Finance Book
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { FinanceBook } from '../types/finance-book.js';

interface FinanceBookFormProps {
  initialData?: Partial<FinanceBook>;
  onSubmit: (data: Partial<FinanceBook>) => void;
  mode: 'create' | 'edit';
}

export function FinanceBookForm({ initialData = {}, onSubmit, mode }: FinanceBookFormProps) {
  const [formData, setFormData] = useState<Partial<FinanceBook>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Finance Book' : 'New Finance Book'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={String(formData.finance_book_name ?? '')}
              onChange={e => handleChange('finance_book_name', e.target.value)}
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