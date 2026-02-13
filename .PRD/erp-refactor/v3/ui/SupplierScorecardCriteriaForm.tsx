// Form scaffold for Supplier Scorecard Criteria
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SupplierScorecardCriteria } from '../types/supplier-scorecard-criteria.js';

interface SupplierScorecardCriteriaFormProps {
  initialData?: Partial<SupplierScorecardCriteria>;
  onSubmit: (data: Partial<SupplierScorecardCriteria>) => void;
  mode: 'create' | 'edit';
}

export function SupplierScorecardCriteriaForm({ initialData = {}, onSubmit, mode }: SupplierScorecardCriteriaFormProps) {
  const [formData, setFormData] = useState<Partial<SupplierScorecardCriteria>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Supplier Scorecard Criteria' : 'New Supplier Scorecard Criteria'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Criteria Name</label>
            <input
              type="text"
              value={String(formData.criteria_name ?? '')}
              onChange={e => handleChange('criteria_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Score</label>
            <input
              type="number"
              step="any"
              value={formData.max_score != null ? Number(formData.max_score) : ''}
              onChange={e => handleChange('max_score', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Criteria Formula</label>
            <textarea
              value={String(formData.formula ?? '')}
              onChange={e => handleChange('formula', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Criteria Weight</label>
            <input
              type="number"
              step="any"
              value={formData.weight != null ? Number(formData.weight) : ''}
              onChange={e => handleChange('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
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