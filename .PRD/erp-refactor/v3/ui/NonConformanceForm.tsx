// Form scaffold for Non Conformance
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { NonConformance } from '../types/non-conformance.js';

interface NonConformanceFormProps {
  initialData?: Partial<NonConformance>;
  onSubmit: (data: Partial<NonConformance>) => void;
  mode: 'create' | 'edit';
}

export function NonConformanceForm({ initialData = {}, onSubmit, mode }: NonConformanceFormProps) {
  const [formData, setFormData] = useState<Partial<NonConformance>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Non Conformance' : 'New Non Conformance'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              value={String(formData.subject ?? '')}
              onChange={e => handleChange('subject', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Procedure (→ Quality Procedure)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Quality Procedure..."
                value={String(formData.procedure ?? '')}
                onChange={e => {
                  handleChange('procedure', e.target.value);
                  // TODO: Implement async search for Quality Procedure
                  // fetch(`/api/resource/Quality Procedure?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Quality Procedure"
                data-fieldname="procedure"
              />
              {/* Link indicator */}
              {formData.procedure && (
                <button
                  type="button"
                  onClick={() => handleChange('procedure', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Process Owner</label>
            <input
              type="text"
              value={String(formData.process_owner ?? '')}
              onChange={e => handleChange('process_owner', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={String(formData.full_name ?? '')}
              onChange={e => handleChange('full_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Open">Open</option>
              <option value="Resolved">Resolved</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
      {/* Section: section_break_4 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Details</label>
            <textarea
              value={String(formData.details ?? '')}
              onChange={e => handleChange('details', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Corrective Action</label>
            <textarea
              value={String(formData.corrective_action ?? '')}
              onChange={e => handleChange('corrective_action', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Preventive Action</label>
            <textarea
              value={String(formData.preventive_action ?? '')}
              onChange={e => handleChange('preventive_action', e.target.value)}
              rows={4}
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