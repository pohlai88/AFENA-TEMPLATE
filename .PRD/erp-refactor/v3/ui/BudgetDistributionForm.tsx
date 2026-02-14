// Form scaffold for Budget Distribution
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { BudgetDistribution } from '../types/budget-distribution.js';

interface BudgetDistributionFormProps {
  initialData?: Partial<BudgetDistribution>;
  onSubmit: (data: Partial<BudgetDistribution>) => void;
  mode: 'create' | 'edit';
}

export function BudgetDistributionForm({ initialData = {}, onSubmit, mode }: BudgetDistributionFormProps) {
  const [formData, setFormData] = useState<Partial<BudgetDistribution>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Budget Distribution' : 'New Budget Distribution'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={String(formData.start_date ?? '')}
              onChange={e => handleChange('start_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={String(formData.end_date ?? '')}
              onChange={e => handleChange('end_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              step="any"
              value={formData.amount != null ? Number(formData.amount) : ''}
              onChange={e => handleChange('amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Percent</label>
            <input
              type="number"
              step="any"
              value={formData.percent != null ? Number(formData.percent) : ''}
              onChange={e => handleChange('percent', e.target.value ? parseFloat(e.target.value) : undefined)}
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