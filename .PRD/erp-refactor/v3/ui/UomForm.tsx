// Form scaffold for UOM
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { Uom } from '../types/uom.js';

interface UomFormProps {
  initialData?: Partial<Uom>;
  onSubmit: (data: Partial<Uom>) => void;
  mode: 'create' | 'edit';
}

export function UomForm({ initialData = {}, onSubmit, mode }: UomFormProps) {
  const [formData, setFormData] = useState<Partial<Uom>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'UOM' : 'New UOM'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">UOM Name</label>
            <input
              type="text"
              value={String(formData.uom_name ?? '')}
              onChange={e => handleChange('uom_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Symbol</label>
            <input
              type="text"
              value={String(formData.symbol ?? '')}
              onChange={e => handleChange('symbol', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Common Code</label>
            <input
              type="text"
              value={String(formData.common_code ?? '')}
              onChange={e => handleChange('common_code', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={String(formData.description ?? '')}
              onChange={e => handleChange('description', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enabled}
              onChange={e => handleChange('enabled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enabled</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.must_be_whole_number}
              onChange={e => handleChange('must_be_whole_number', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Must be Whole Number</label>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}