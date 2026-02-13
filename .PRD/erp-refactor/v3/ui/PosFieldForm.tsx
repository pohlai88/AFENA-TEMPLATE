// Form scaffold for POS Field
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PosField } from '../types/pos-field.js';

interface PosFieldFormProps {
  initialData?: Partial<PosField>;
  onSubmit: (data: Partial<PosField>) => void;
  mode: 'create' | 'edit';
}

export function PosFieldForm({ initialData = {}, onSubmit, mode }: PosFieldFormProps) {
  const [formData, setFormData] = useState<Partial<PosField>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'POS Field' : 'New POS Field'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fieldname</label>
            <select
              value={String(formData.fieldname ?? '')}
              onChange={e => handleChange('fieldname', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>

            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Label</label>
            <input
              type="text"
              value={String(formData.label ?? '')}
              onChange={e => handleChange('label', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fieldtype</label>
            <input
              type="text"
              value={String(formData.fieldtype ?? '')}
              onChange={e => handleChange('fieldtype', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Options</label>
            <textarea
              value={String(formData.options ?? '')}
              onChange={e => handleChange('options', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Value</label>
            <input
              type="text"
              value={String(formData.default_value ?? '')}
              onChange={e => handleChange('default_value', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.reqd}
              onChange={e => handleChange('reqd', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Mandatory</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.read_only}
              onChange={e => handleChange('read_only', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Read Only</label>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}