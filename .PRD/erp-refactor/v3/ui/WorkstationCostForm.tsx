// Form scaffold for Workstation Cost
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { WorkstationCost } from '../types/workstation-cost.js';

interface WorkstationCostFormProps {
  initialData?: Partial<WorkstationCost>;
  onSubmit: (data: Partial<WorkstationCost>) => void;
  mode: 'create' | 'edit';
}

export function WorkstationCostForm({ initialData = {}, onSubmit, mode }: WorkstationCostFormProps) {
  const [formData, setFormData] = useState<Partial<WorkstationCost>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Workstation Cost' : 'New Workstation Cost'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Operating Component (→ Workstation Operating Component)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Workstation Operating Component..."
                value={String(formData.operating_component ?? '')}
                onChange={e => {
                  handleChange('operating_component', e.target.value);
                  // TODO: Implement async search for Workstation Operating Component
                  // fetch(`/api/resource/Workstation Operating Component?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Workstation Operating Component"
                data-fieldname="operating_component"
              />
              {/* Link indicator */}
              {formData.operating_component && (
                <button
                  type="button"
                  onClick={() => handleChange('operating_component', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Operating Cost</label>
            <input
              type="number"
              step="any"
              value={formData.operating_cost != null ? Number(formData.operating_cost) : ''}
              onChange={e => handleChange('operating_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
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