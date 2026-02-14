// Form scaffold for Bulk Transaction Log
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { BulkTransactionLog } from '../types/bulk-transaction-log.js';

interface BulkTransactionLogFormProps {
  initialData?: Partial<BulkTransactionLog>;
  onSubmit: (data: Partial<BulkTransactionLog>) => void;
  mode: 'create' | 'edit';
}

export function BulkTransactionLogForm({ initialData = {}, onSubmit, mode }: BulkTransactionLogFormProps) {
  const [formData, setFormData] = useState<Partial<BulkTransactionLog>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">
        {mode === 'edit' ? formData.date ?? 'Bulk Transaction Log' : 'New Bulk Transaction Log'}
      </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={String(formData.date ?? '')}
              onChange={e => handleChange('date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Log Entries</label>
            <input
              type="number"
              step="1"
              value={formData.log_entries != null ? Number(formData.log_entries) : ''}
              onChange={e => handleChange('log_entries', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: section_break_mdmv */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Succeeded</label>
            <input
              type="number"
              step="1"
              value={formData.succeeded != null ? Number(formData.succeeded) : ''}
              onChange={e => handleChange('succeeded', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Failed</label>
            <input
              type="number"
              step="1"
              value={formData.failed != null ? Number(formData.failed) : ''}
              onChange={e => handleChange('failed', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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