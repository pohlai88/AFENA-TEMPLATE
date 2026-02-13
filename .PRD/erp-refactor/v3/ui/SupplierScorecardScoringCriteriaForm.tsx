// Form scaffold for Supplier Scorecard Scoring Criteria
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SupplierScorecardScoringCriteria } from '../types/supplier-scorecard-scoring-criteria.js';

interface SupplierScorecardScoringCriteriaFormProps {
  initialData?: Partial<SupplierScorecardScoringCriteria>;
  onSubmit: (data: Partial<SupplierScorecardScoringCriteria>) => void;
  mode: 'create' | 'edit';
}

export function SupplierScorecardScoringCriteriaForm({ initialData = {}, onSubmit, mode }: SupplierScorecardScoringCriteriaFormProps) {
  const [formData, setFormData] = useState<Partial<SupplierScorecardScoringCriteria>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Supplier Scorecard Scoring Criteria' : 'New Supplier Scorecard Scoring Criteria'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Criteria Name (→ Supplier Scorecard Criteria)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Supplier Scorecard Criteria..."
                value={String(formData.criteria_name ?? '')}
                onChange={e => {
                  handleChange('criteria_name', e.target.value);
                  // TODO: Implement async search for Supplier Scorecard Criteria
                  // fetch(`/api/resource/Supplier Scorecard Criteria?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Supplier Scorecard Criteria"
                data-fieldname="criteria_name"
              />
              {/* Link indicator */}
              {formData.criteria_name && (
                <button
                  type="button"
                  onClick={() => handleChange('criteria_name', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Score</label>
            <input
              type="number"
              step="any"
              value={formData.score != null ? Number(formData.score) : ''}
              onChange={e => handleChange('score', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Criteria Weight</label>
            <input
              type="number"
              step="any"
              value={formData.weight != null ? Number(formData.weight) : ''}
              onChange={e => handleChange('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
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
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: section_break_6 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Criteria Formula</label>
            <textarea
              value={String(formData.formula ?? '')}
              onChange={e => handleChange('formula', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}