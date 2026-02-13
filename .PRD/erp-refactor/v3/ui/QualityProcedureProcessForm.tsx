// Form scaffold for Quality Procedure Process
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { QualityProcedureProcess } from '../types/quality-procedure-process.js';

interface QualityProcedureProcessFormProps {
  initialData?: Partial<QualityProcedureProcess>;
  onSubmit: (data: Partial<QualityProcedureProcess>) => void;
  mode: 'create' | 'edit';
}

export function QualityProcedureProcessForm({ initialData = {}, onSubmit, mode }: QualityProcedureProcessFormProps) {
  const [formData, setFormData] = useState<Partial<QualityProcedureProcess>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Quality Procedure Process' : 'New Quality Procedure Process'}</h2>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Process Description</label>
            <textarea
              value={String(formData.process_description ?? '')}
              onChange={e => handleChange('process_description', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sub Procedure (→ Quality Procedure)</label>
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}