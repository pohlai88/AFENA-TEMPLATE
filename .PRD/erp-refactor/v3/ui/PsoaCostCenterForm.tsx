// Form scaffold for PSOA Cost Center
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PsoaCostCenter } from '../types/psoa-cost-center.js';

interface PsoaCostCenterFormProps {
  initialData?: Partial<PsoaCostCenter>;
  onSubmit: (data: Partial<PsoaCostCenter>) => void;
  mode: 'create' | 'edit';
}

export function PsoaCostCenterForm({ initialData = {}, onSubmit, mode }: PsoaCostCenterFormProps) {
  const [formData, setFormData] = useState<Partial<PsoaCostCenter>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'PSOA Cost Center' : 'New PSOA Cost Center'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cost Center (→ Cost Center)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Cost Center..."
                value={String(formData.cost_center_name ?? '')}
                onChange={e => {
                  handleChange('cost_center_name', e.target.value);
                  // TODO: Implement async search for Cost Center
                  // fetch(`/api/resource/Cost Center?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Cost Center"
                data-fieldname="cost_center_name"
              />
              {/* Link indicator */}
              {formData.cost_center_name && (
                <button
                  type="button"
                  onClick={() => handleChange('cost_center_name', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
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