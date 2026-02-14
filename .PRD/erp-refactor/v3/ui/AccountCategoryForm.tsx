// Form scaffold for Account Category
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { AccountCategory } from '../types/account-category.js';

interface AccountCategoryFormProps {
  initialData?: Partial<AccountCategory>;
  onSubmit: (data: Partial<AccountCategory>) => void;
  mode: 'create' | 'edit';
}

export function AccountCategoryForm({ initialData = {}, onSubmit, mode }: AccountCategoryFormProps) {
  const [formData, setFormData] = useState<Partial<AccountCategory>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Account Category' : 'New Account Category'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Category Name</label>
            <input
              type="text"
              value={String(formData.account_category_name ?? '')}
              onChange={e => handleChange('account_category_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={String(formData.description ?? '')}
              onChange={e => handleChange('description', e.target.value)}
              rows={4}
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