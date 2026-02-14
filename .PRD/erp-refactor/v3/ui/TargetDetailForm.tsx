// Form scaffold for Target Detail
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { TargetDetail } from '../types/target-detail.js';

interface TargetDetailFormProps {
  initialData?: Partial<TargetDetail>;
  onSubmit: (data: Partial<TargetDetail>) => void;
  mode: 'create' | 'edit';
}

export function TargetDetailForm({ initialData = {}, onSubmit, mode }: TargetDetailFormProps) {
  const [formData, setFormData] = useState<Partial<TargetDetail>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Target Detail' : 'New Target Detail'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Group (→ Item Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Item Group..."
                value={String(formData.item_group ?? '')}
                onChange={e => {
                  handleChange('item_group', e.target.value);
                  // TODO: Implement async search for Item Group
                  // fetch(`/api/resource/Item Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Item Group"
                data-fieldname="item_group"
              />
              {/* Link indicator */}
              {formData.item_group && (
                <button
                  type="button"
                  onClick={() => handleChange('item_group', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fiscal Year (→ Fiscal Year)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Fiscal Year..."
                value={String(formData.fiscal_year ?? '')}
                onChange={e => {
                  handleChange('fiscal_year', e.target.value);
                  // TODO: Implement async search for Fiscal Year
                  // fetch(`/api/resource/Fiscal Year?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Fiscal Year"
                data-fieldname="fiscal_year"
              />
              {/* Link indicator */}
              {formData.fiscal_year && (
                <button
                  type="button"
                  onClick={() => handleChange('fiscal_year', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Qty</label>
            <input
              type="number"
              step="any"
              value={formData.target_qty != null ? Number(formData.target_qty) : ''}
              onChange={e => handleChange('target_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Target  Amount</label>
            <input
              type="number"
              step="any"
              value={formData.target_amount != null ? Number(formData.target_amount) : ''}
              onChange={e => handleChange('target_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Distribution (→ Monthly Distribution)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Monthly Distribution..."
                value={String(formData.distribution_id ?? '')}
                onChange={e => {
                  handleChange('distribution_id', e.target.value);
                  // TODO: Implement async search for Monthly Distribution
                  // fetch(`/api/resource/Monthly Distribution?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Monthly Distribution"
                data-fieldname="distribution_id"
              />
              {/* Link indicator */}
              {formData.distribution_id && (
                <button
                  type="button"
                  onClick={() => handleChange('distribution_id', '')}
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