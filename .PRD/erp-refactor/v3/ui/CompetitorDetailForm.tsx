// Form scaffold for Competitor Detail
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { CompetitorDetail } from '../types/competitor-detail.js';

interface CompetitorDetailFormProps {
  initialData?: Partial<CompetitorDetail>;
  onSubmit: (data: Partial<CompetitorDetail>) => void;
  mode: 'create' | 'edit';
}

export function CompetitorDetailForm({ initialData = {}, onSubmit, mode }: CompetitorDetailFormProps) {
  const [formData, setFormData] = useState<Partial<CompetitorDetail>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Competitor Detail' : 'New Competitor Detail'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Competitor (→ Competitor)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Competitor..."
                value={String(formData.competitor ?? '')}
                onChange={e => {
                  handleChange('competitor', e.target.value);
                  // TODO: Implement async search for Competitor
                  // fetch(`/api/resource/Competitor?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Competitor"
                data-fieldname="competitor"
              />
              {/* Link indicator */}
              {formData.competitor && (
                <button
                  type="button"
                  onClick={() => handleChange('competitor', '')}
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