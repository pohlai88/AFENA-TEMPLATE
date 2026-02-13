// Form scaffold for Quality Inspection Reading
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { QualityInspectionReading } from '../types/quality-inspection-reading.js';

interface QualityInspectionReadingFormProps {
  initialData?: Partial<QualityInspectionReading>;
  onSubmit: (data: Partial<QualityInspectionReading>) => void;
  mode: 'create' | 'edit';
}

export function QualityInspectionReadingForm({ initialData = {}, onSubmit, mode }: QualityInspectionReadingFormProps) {
  const [formData, setFormData] = useState<Partial<QualityInspectionReading>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Quality Inspection Reading' : 'New Quality Inspection Reading'}</h2>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.manual_inspection}
              onChange={e => handleChange('manual_inspection', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Manual Inspection</label>
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
      {/* Section: Value Based Inspection */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Value Based Inspection</h4>
        <div className="grid grid-cols-2 gap-4">
          {!formData.numeric && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Reading Value</label>
            <input
              type="text"
              value={String(formData.reading_value ?? '')}
              onChange={e => handleChange('reading_value', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Numeric Inspection */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Numeric Inspection</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Reading 1</label>
            <input
              type="text"
              value={String(formData.reading_1 ?? '')}
              onChange={e => handleChange('reading_1', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reading 2</label>
            <input
              type="text"
              value={String(formData.reading_2 ?? '')}
              onChange={e => handleChange('reading_2', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reading 3</label>
            <input
              type="text"
              value={String(formData.reading_3 ?? '')}
              onChange={e => handleChange('reading_3', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reading 4</label>
            <input
              type="text"
              value={String(formData.reading_4 ?? '')}
              onChange={e => handleChange('reading_4', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reading 5</label>
            <input
              type="text"
              value={String(formData.reading_5 ?? '')}
              onChange={e => handleChange('reading_5', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reading 6</label>
            <input
              type="text"
              value={String(formData.reading_6 ?? '')}
              onChange={e => handleChange('reading_6', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reading 7</label>
            <input
              type="text"
              value={String(formData.reading_7 ?? '')}
              onChange={e => handleChange('reading_7', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reading 8</label>
            <input
              type="text"
              value={String(formData.reading_8 ?? '')}
              onChange={e => handleChange('reading_8', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reading 9</label>
            <input
              type="text"
              value={String(formData.reading_9 ?? '')}
              onChange={e => handleChange('reading_9', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reading 10</label>
            <input
              type="text"
              value={String(formData.reading_10 ?? '')}
              onChange={e => handleChange('reading_10', e.target.value)}
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