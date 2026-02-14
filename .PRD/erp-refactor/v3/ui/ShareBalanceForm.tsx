// Form scaffold for Share Balance
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ShareBalance } from '../types/share-balance.js';

interface ShareBalanceFormProps {
  initialData?: Partial<ShareBalance>;
  onSubmit: (data: Partial<ShareBalance>) => void;
  mode: 'create' | 'edit';
}

export function ShareBalanceForm({ initialData = {}, onSubmit, mode }: ShareBalanceFormProps) {
  const [formData, setFormData] = useState<Partial<ShareBalance>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Share Balance' : 'New Share Balance'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Share Type (→ Share Type)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Share Type..."
                value={String(formData.share_type ?? '')}
                onChange={e => {
                  handleChange('share_type', e.target.value);
                  // TODO: Implement async search for Share Type
                  // fetch(`/api/resource/Share Type?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Share Type"
                data-fieldname="share_type"
              />
              {/* Link indicator */}
              {formData.share_type && (
                <button
                  type="button"
                  onClick={() => handleChange('share_type', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">From No</label>
            <input
              type="number"
              step="1"
              value={formData.from_no != null ? Number(formData.from_no) : ''}
              onChange={e => handleChange('from_no', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rate</label>
            <input
              type="number"
              step="any"
              value={formData.rate != null ? Number(formData.rate) : ''}
              onChange={e => handleChange('rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">No of Shares</label>
            <input
              type="number"
              step="1"
              value={formData.no_of_shares != null ? Number(formData.no_of_shares) : ''}
              onChange={e => handleChange('no_of_shares', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To No</label>
            <input
              type="number"
              step="1"
              value={formData.to_no != null ? Number(formData.to_no) : ''}
              onChange={e => handleChange('to_no', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              step="any"
              value={formData.amount != null ? Number(formData.amount) : ''}
              onChange={e => handleChange('amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
      {/* Section: section_break_8 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_company}
              onChange={e => handleChange('is_company', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Company</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current State</label>
            <select
              value={String(formData.current_state ?? '')}
              onChange={e => handleChange('current_state', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Issued">Issued</option>
              <option value="Purchased">Purchased</option>
            </select>
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