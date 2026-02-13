// Form scaffold for Asset Shift Factor
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { AssetShiftFactor } from '../types/asset-shift-factor.js';

interface AssetShiftFactorFormProps {
  initialData?: Partial<AssetShiftFactor>;
  onSubmit: (data: Partial<AssetShiftFactor>) => void;
  mode: 'create' | 'edit';
}

export function AssetShiftFactorForm({ initialData = {}, onSubmit, mode }: AssetShiftFactorFormProps) {
  const [formData, setFormData] = useState<Partial<AssetShiftFactor>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Asset Shift Factor' : 'New Asset Shift Factor'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Shift Name</label>
            <input
              type="text"
              value={String(formData.shift_name ?? '')}
              onChange={e => handleChange('shift_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Shift Factor</label>
            <input
              type="number"
              step="any"
              value={formData.shift_factor != null ? Number(formData.shift_factor) : ''}
              onChange={e => handleChange('shift_factor', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.default}
              onChange={e => handleChange('default', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Default</label>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}