// Form scaffold for Depreciation Schedule
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { DepreciationSchedule } from '../types/depreciation-schedule.js';

interface DepreciationScheduleFormProps {
  initialData?: Partial<DepreciationSchedule>;
  onSubmit: (data: Partial<DepreciationSchedule>) => void;
  mode: 'create' | 'edit';
}

export function DepreciationScheduleForm({ initialData = {}, onSubmit, mode }: DepreciationScheduleFormProps) {
  const [formData, setFormData] = useState<Partial<DepreciationSchedule>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Depreciation Schedule' : 'New Depreciation Schedule'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Schedule Date</label>
            <input
              type="date"
              value={String(formData.schedule_date ?? '')}
              onChange={e => handleChange('schedule_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Depreciation Amount</label>
            <input
              type="number"
              step="any"
              value={formData.depreciation_amount != null ? Number(formData.depreciation_amount) : ''}
              onChange={e => handleChange('depreciation_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Accumulated Depreciation Amount</label>
            <input
              type="number"
              step="any"
              value={formData.accumulated_depreciation_amount != null ? Number(formData.accumulated_depreciation_amount) : ''}
              onChange={e => handleChange('accumulated_depreciation_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {formData.docstatus===1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Journal Entry (→ Journal Entry)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Journal Entry..."
                value={String(formData.journal_entry ?? '')}
                onChange={e => {
                  handleChange('journal_entry', e.target.value);
                  // TODO: Implement async search for Journal Entry
                  // fetch(`/api/resource/Journal Entry?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Journal Entry"
                data-fieldname="journal_entry"
              />
              {/* Link indicator */}
              {formData.journal_entry && (
                <button
                  type="button"
                  onClick={() => handleChange('journal_entry', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Shift (→ Asset Shift Factor)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Asset Shift Factor..."
                value={String(formData.shift ?? '')}
                onChange={e => {
                  handleChange('shift', e.target.value);
                  // TODO: Implement async search for Asset Shift Factor
                  // fetch(`/api/resource/Asset Shift Factor?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Asset Shift Factor"
                data-fieldname="shift"
              />
              {/* Link indicator */}
              {formData.shift && (
                <button
                  type="button"
                  onClick={() => handleChange('shift', '')}
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