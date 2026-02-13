// Form scaffold for Transaction Deletion Record Details
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { TransactionDeletionRecordDetails } from '../types/transaction-deletion-record-details.js';

interface TransactionDeletionRecordDetailsFormProps {
  initialData?: Partial<TransactionDeletionRecordDetails>;
  onSubmit: (data: Partial<TransactionDeletionRecordDetails>) => void;
  mode: 'create' | 'edit';
}

export function TransactionDeletionRecordDetailsForm({ initialData = {}, onSubmit, mode }: TransactionDeletionRecordDetailsFormProps) {
  const [formData, setFormData] = useState<Partial<TransactionDeletionRecordDetails>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Transaction Deletion Record Details' : 'New Transaction Deletion Record Details'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">DocType (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.doctype_name ?? '')}
                onChange={e => {
                  handleChange('doctype_name', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="doctype_name"
              />
              {/* Link indicator */}
              {formData.doctype_name && (
                <button
                  type="button"
                  onClick={() => handleChange('doctype_name', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">DocField</label>
            <input
              type="text"
              value={String(formData.docfield_name ?? '')}
              onChange={e => handleChange('docfield_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">No of Docs</label>
            <input
              type="number"
              step="1"
              value={formData.no_of_docs != null ? Number(formData.no_of_docs) : ''}
              onChange={e => handleChange('no_of_docs', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.done}
              onChange={e => handleChange('done', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Done</label>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}