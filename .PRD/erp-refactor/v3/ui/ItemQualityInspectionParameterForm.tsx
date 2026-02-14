// Form scaffold for Item Quality Inspection Parameter
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ItemQualityInspectionParameter } from '../types/item-quality-inspection-parameter.js';

interface ItemQualityInspectionParameterFormProps {
  initialData?: Partial<ItemQualityInspectionParameter>;
  onSubmit: (data: Partial<ItemQualityInspectionParameter>) => void;
  mode: 'create' | 'edit';
}

export function ItemQualityInspectionParameterForm({ initialData = {}, onSubmit, mode }: ItemQualityInspectionParameterFormProps) {
  const [formData, setFormData] = useState<Partial<ItemQualityInspectionParameter>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Item Quality Inspection Parameter' : 'New Item Quality Inspection Parameter'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Parameter (→ Quality Inspection Parameter)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Quality Inspection Parameter..."
                value={String(formData.specification ?? '')}
                onChange={e => {
                  handleChange('specification', e.target.value);
                  // TODO: Implement async search for Quality Inspection Parameter
                  // fetch(`/api/resource/Quality Inspection Parameter?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Quality Inspection Parameter"
                data-fieldname="specification"
              />
              {/* Link indicator */}
              {formData.specification && (
                <button
                  type="button"
                  onClick={() => handleChange('specification', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Parameter Group (→ Quality Inspection Parameter Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Quality Inspection Parameter Group..."
                value={String(formData.parameter_group ?? '')}
                onChange={e => {
                  handleChange('parameter_group', e.target.value);
                  // TODO: Implement async search for Quality Inspection Parameter Group
                  // fetch(`/api/resource/Quality Inspection Parameter Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Quality Inspection Parameter Group"
                data-fieldname="parameter_group"
              />
              {/* Link indicator */}
              {formData.parameter_group && (
                <button
                  type="button"
                  onClick={() => handleChange('parameter_group', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {(!formData.formula_based_criteria && !formData.numeric) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Acceptance Criteria Value</label>
            <input
              type="text"
              value={String(formData.value ?? '')}
              onChange={e => handleChange('value', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.numeric}
              onChange={e => handleChange('numeric', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Numeric</label>
          </div>
          {(!formData.formula_based_criteria && formData.numeric) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Value</label>
            <input
              type="number"
              step="any"
              value={formData.min_value != null ? Number(formData.min_value) : ''}
              onChange={e => handleChange('min_value', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {(!formData.formula_based_criteria && formData.numeric) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Value</label>
            <input
              type="number"
              step="any"
              value={formData.max_value != null ? Number(formData.max_value) : ''}
              onChange={e => handleChange('max_value', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.formula_based_criteria}
              onChange={e => handleChange('formula_based_criteria', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Formula Based Criteria</label>
          </div>
          {!!formData.formula_based_criteria && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Acceptance Criteria Formula</label>
            <textarea
              value={String(formData.acceptance_formula ?? '')}
              onChange={e => handleChange('acceptance_formula', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}