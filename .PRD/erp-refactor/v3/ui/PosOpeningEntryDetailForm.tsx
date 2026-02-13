// Form scaffold for POS Opening Entry Detail
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PosOpeningEntryDetail } from '../types/pos-opening-entry-detail.js';

interface PosOpeningEntryDetailFormProps {
  initialData?: Partial<PosOpeningEntryDetail>;
  onSubmit: (data: Partial<PosOpeningEntryDetail>) => void;
  mode: 'create' | 'edit';
}

export function PosOpeningEntryDetailForm({ initialData = {}, onSubmit, mode }: PosOpeningEntryDetailFormProps) {
  const [formData, setFormData] = useState<Partial<PosOpeningEntryDetail>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'POS Opening Entry Detail' : 'New POS Opening Entry Detail'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mode of Payment (→ Mode of Payment)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Mode of Payment..."
                value={String(formData.mode_of_payment ?? '')}
                onChange={e => {
                  handleChange('mode_of_payment', e.target.value);
                  // TODO: Implement async search for Mode of Payment
                  // fetch(`/api/resource/Mode of Payment?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Mode of Payment"
                data-fieldname="mode_of_payment"
              />
              {/* Link indicator */}
              {formData.mode_of_payment && (
                <button
                  type="button"
                  onClick={() => handleChange('mode_of_payment', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Opening Amount</label>
            <input
              type="number"
              step="any"
              value={formData.opening_amount != null ? Number(formData.opening_amount) : ''}
              onChange={e => handleChange('opening_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
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