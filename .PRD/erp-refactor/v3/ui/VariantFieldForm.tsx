// Form scaffold for Variant Field
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { VariantField } from '../types/variant-field.js';

interface VariantFieldFormProps {
  initialData?: Partial<VariantField>;
  onSubmit: (data: Partial<VariantField>) => void;
  mode: 'create' | 'edit';
}

export function VariantFieldForm({ initialData = {}, onSubmit, mode }: VariantFieldFormProps) {
  const [formData, setFormData] = useState<Partial<VariantField>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Variant Field' : 'New Variant Field'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Field Name</label>
            <input
              type="text"
              value={String(formData.field_name ?? '')}
              onChange={e => handleChange('field_name', e.target.value)}
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