// Form scaffold for Tax Category
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { TaxCategory } from '../types/tax-category.js';

interface TaxCategoryFormProps {
  initialData?: Partial<TaxCategory>;
  onSubmit: (data: Partial<TaxCategory>) => void;
  mode: 'create' | 'edit';
}

export function TaxCategoryForm({ initialData = {}, onSubmit, mode }: TaxCategoryFormProps) {
  const [formData, setFormData] = useState<Partial<TaxCategory>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Tax Category' : 'New Tax Category'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={String(formData.title ?? '')}
              onChange={e => handleChange('title', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.disabled}
              onChange={e => handleChange('disabled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Disabled</label>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}