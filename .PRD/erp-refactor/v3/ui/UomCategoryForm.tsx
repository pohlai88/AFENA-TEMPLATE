// Form scaffold for UOM Category
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { UomCategory } from '../types/uom-category.js';

interface UomCategoryFormProps {
  initialData?: Partial<UomCategory>;
  onSubmit: (data: Partial<UomCategory>) => void;
  mode: 'create' | 'edit';
}

export function UomCategoryForm({ initialData = {}, onSubmit, mode }: UomCategoryFormProps) {
  const [formData, setFormData] = useState<Partial<UomCategory>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'UOM Category' : 'New UOM Category'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              type="text"
              value={String(formData.category_name ?? '')}
              onChange={e => handleChange('category_name', e.target.value)}
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