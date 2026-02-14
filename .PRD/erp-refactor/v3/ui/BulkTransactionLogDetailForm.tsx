// Form scaffold for Bulk Transaction Log Detail
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { BulkTransactionLogDetail } from '../types/bulk-transaction-log-detail.js';

interface BulkTransactionLogDetailFormProps {
  initialData?: Partial<BulkTransactionLogDetail>;
  onSubmit: (data: Partial<BulkTransactionLogDetail>) => void;
  mode: 'create' | 'edit';
}

export function BulkTransactionLogDetailForm({ initialData = {}, onSubmit, mode }: BulkTransactionLogDetailFormProps) {
  const [formData, setFormData] = useState<Partial<BulkTransactionLogDetail>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Bulk Transaction Log Detail' : 'New Bulk Transaction Log Detail'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">From Doctype (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.from_doctype ?? '')}
                onChange={e => {
                  handleChange('from_doctype', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="from_doctype"
              />
              {/* Link indicator */}
              {formData.from_doctype && (
                <button
                  type="button"
                  onClick={() => handleChange('from_doctype', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={String(formData.transaction_name ?? '')}
              onChange={e => handleChange('transaction_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date </label>
            <input
              type="date"
              value={String(formData.date ?? '')}
              onChange={e => handleChange('date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              value={String(formData.time ?? '')}
              onChange={e => handleChange('time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <input
              type="text"
              value={String(formData.transaction_status ?? '')}
              onChange={e => handleChange('transaction_status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Error Description</label>
            <textarea
              value={String(formData.error_description ?? '')}
              onChange={e => handleChange('error_description', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Doctype (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.to_doctype ?? '')}
                onChange={e => {
                  handleChange('to_doctype', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="to_doctype"
              />
              {/* Link indicator */}
              {formData.to_doctype && (
                <button
                  type="button"
                  onClick={() => handleChange('to_doctype', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Retried</label>
            <input
              type="number"
              step="1"
              value={formData.retried != null ? Number(formData.retried) : ''}
              onChange={e => handleChange('retried', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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