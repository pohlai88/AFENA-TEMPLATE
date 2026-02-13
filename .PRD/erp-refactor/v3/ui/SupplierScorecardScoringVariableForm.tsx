// Form scaffold for Supplier Scorecard Scoring Variable
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SupplierScorecardScoringVariable } from '../types/supplier-scorecard-scoring-variable.js';

interface SupplierScorecardScoringVariableFormProps {
  initialData?: Partial<SupplierScorecardScoringVariable>;
  onSubmit: (data: Partial<SupplierScorecardScoringVariable>) => void;
  mode: 'create' | 'edit';
}

export function SupplierScorecardScoringVariableForm({ initialData = {}, onSubmit, mode }: SupplierScorecardScoringVariableFormProps) {
  const [formData, setFormData] = useState<Partial<SupplierScorecardScoringVariable>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Supplier Scorecard Scoring Variable' : 'New Supplier Scorecard Scoring Variable'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Variable Name (→ Supplier Scorecard Variable)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Supplier Scorecard Variable..."
                value={String(formData.variable_label ?? '')}
                onChange={e => {
                  handleChange('variable_label', e.target.value);
                  // TODO: Implement async search for Supplier Scorecard Variable
                  // fetch(`/api/resource/Supplier Scorecard Variable?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Supplier Scorecard Variable"
                data-fieldname="variable_label"
              />
              {/* Link indicator */}
              {formData.variable_label && (
                <button
                  type="button"
                  onClick={() => handleChange('variable_label', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Value</label>
            <input
              type="number"
              step="any"
              value={formData.value != null ? Number(formData.value) : ''}
              onChange={e => handleChange('value', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Parameter Name</label>
            <input
              type="text"
              value={String(formData.param_name ?? '')}
              onChange={e => handleChange('param_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Path</label>
            <input
              type="text"
              value={String(formData.path ?? '')}
              onChange={e => handleChange('path', e.target.value)}
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