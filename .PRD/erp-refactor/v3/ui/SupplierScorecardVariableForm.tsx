// Form scaffold for Supplier Scorecard Variable
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SupplierScorecardVariable } from '../types/supplier-scorecard-variable.js';

interface SupplierScorecardVariableFormProps {
  initialData?: Partial<SupplierScorecardVariable>;
  onSubmit: (data: Partial<SupplierScorecardVariable>) => void;
  mode: 'create' | 'edit';
}

export function SupplierScorecardVariableForm({ initialData = {}, onSubmit, mode }: SupplierScorecardVariableFormProps) {
  const [formData, setFormData] = useState<Partial<SupplierScorecardVariable>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Supplier Scorecard Variable' : 'New Supplier Scorecard Variable'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Variable Name</label>
            <input
              type="text"
              value={String(formData.variable_label ?? '')}
              onChange={e => handleChange('variable_label', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_custom}
              onChange={e => handleChange('is_custom', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Custom?</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Parameter Name</label>
            <input
              type="text"
              value={String(formData.param_name ?? '')}
              onChange={e => handleChange('param_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Path</label>
            <input
              type="text"
              value={String(formData.path ?? '')}
              onChange={e => handleChange('path', e.target.value)}
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