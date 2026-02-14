// Form scaffold for BOM Update Batch
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { BomUpdateBatch } from '../types/bom-update-batch.js';

interface BomUpdateBatchFormProps {
  initialData?: Partial<BomUpdateBatch>;
  onSubmit: (data: Partial<BomUpdateBatch>) => void;
  mode: 'create' | 'edit';
}

export function BomUpdateBatchForm({ initialData = {}, onSubmit, mode }: BomUpdateBatchFormProps) {
  const [formData, setFormData] = useState<Partial<BomUpdateBatch>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'BOM Update Batch' : 'New BOM Update Batch'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <input
              type="number"
              step="1"
              value={formData.level != null ? Number(formData.level) : ''}
              onChange={e => handleChange('level', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Batch No.</label>
            <input
              type="number"
              step="1"
              value={formData.batch_no != null ? Number(formData.batch_no) : ''}
              onChange={e => handleChange('batch_no', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">BOMs Updated</label>
            <textarea
              value={String(formData.boms_updated ?? '')}
              onChange={e => handleChange('boms_updated', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}