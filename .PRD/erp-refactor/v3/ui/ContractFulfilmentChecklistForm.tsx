// Form scaffold for Contract Fulfilment Checklist
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ContractFulfilmentChecklist } from '../types/contract-fulfilment-checklist.js';

interface ContractFulfilmentChecklistFormProps {
  initialData?: Partial<ContractFulfilmentChecklist>;
  onSubmit: (data: Partial<ContractFulfilmentChecklist>) => void;
  mode: 'create' | 'edit';
}

export function ContractFulfilmentChecklistForm({ initialData = {}, onSubmit, mode }: ContractFulfilmentChecklistFormProps) {
  const [formData, setFormData] = useState<Partial<ContractFulfilmentChecklist>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Contract Fulfilment Checklist' : 'New Contract Fulfilment Checklist'}</h2>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.fulfilled}
              onChange={e => handleChange('fulfilled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Fulfilled</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Requirement</label>
            <input
              type="text"
              value={String(formData.requirement ?? '')}
              onChange={e => handleChange('requirement', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: sb_notes */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={String(formData.notes ?? '')}
              onChange={e => handleChange('notes', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Contract Fulfilment Checklist)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Contract Fulfilment Checklist..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Contract Fulfilment Checklist
                  // fetch(`/api/resource/Contract Fulfilment Checklist?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Contract Fulfilment Checklist"
                data-fieldname="amended_from"
              />
              {/* Link indicator */}
              {formData.amended_from && (
                <button
                  type="button"
                  onClick={() => handleChange('amended_from', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
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