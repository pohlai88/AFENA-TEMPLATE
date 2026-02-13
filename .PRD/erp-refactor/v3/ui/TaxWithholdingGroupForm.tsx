// Form scaffold for Tax Withholding Group
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { TaxWithholdingGroup } from '../types/tax-withholding-group.js';

interface TaxWithholdingGroupFormProps {
  initialData?: Partial<TaxWithholdingGroup>;
  onSubmit: (data: Partial<TaxWithholdingGroup>) => void;
  mode: 'create' | 'edit';
}

export function TaxWithholdingGroupForm({ initialData = {}, onSubmit, mode }: TaxWithholdingGroupFormProps) {
  const [formData, setFormData] = useState<Partial<TaxWithholdingGroup>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Tax Withholding Group' : 'New Tax Withholding Group'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Group Name</label>
            <input
              type="text"
              value={String(formData.group_name ?? '')}
              onChange={e => handleChange('group_name', e.target.value)}
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