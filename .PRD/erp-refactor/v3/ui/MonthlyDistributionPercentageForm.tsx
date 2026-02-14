// Form scaffold for Monthly Distribution Percentage
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { MonthlyDistributionPercentage } from '../types/monthly-distribution-percentage.js';

interface MonthlyDistributionPercentageFormProps {
  initialData?: Partial<MonthlyDistributionPercentage>;
  onSubmit: (data: Partial<MonthlyDistributionPercentage>) => void;
  mode: 'create' | 'edit';
}

export function MonthlyDistributionPercentageForm({ initialData = {}, onSubmit, mode }: MonthlyDistributionPercentageFormProps) {
  const [formData, setFormData] = useState<Partial<MonthlyDistributionPercentage>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Monthly Distribution Percentage' : 'New Monthly Distribution Percentage'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Month</label>
            <input
              type="text"
              value={String(formData.month ?? '')}
              onChange={e => handleChange('month', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Percentage Allocation</label>
            <input
              type="number"
              step="any"
              value={formData.percentage_allocation != null ? Number(formData.percentage_allocation) : ''}
              onChange={e => handleChange('percentage_allocation', e.target.value ? parseFloat(e.target.value) : undefined)}
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