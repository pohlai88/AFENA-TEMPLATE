// Form scaffold for Supplier Scorecard Standing
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SupplierScorecardStanding } from '../types/supplier-scorecard-standing.js';

interface SupplierScorecardStandingFormProps {
  initialData?: Partial<SupplierScorecardStanding>;
  onSubmit: (data: Partial<SupplierScorecardStanding>) => void;
  mode: 'create' | 'edit';
}

export function SupplierScorecardStandingForm({ initialData = {}, onSubmit, mode }: SupplierScorecardStandingFormProps) {
  const [formData, setFormData] = useState<Partial<SupplierScorecardStanding>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Supplier Scorecard Standing' : 'New Supplier Scorecard Standing'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Standing Name</label>
            <input
              type="text"
              value={String(formData.standing_name ?? '')}
              onChange={e => handleChange('standing_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <select
              value={String(formData.standing_color ?? '')}
              onChange={e => handleChange('standing_color', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Blue">Blue</option>
              <option value="Purple">Purple</option>
              <option value="Green">Green</option>
              <option value="Yellow">Yellow</option>
              <option value="Orange">Orange</option>
              <option value="Red">Red</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Min Grade</label>
            <input
              type="number"
              step="any"
              value={formData.min_grade != null ? Number(formData.min_grade) : ''}
              onChange={e => handleChange('min_grade', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Grade</label>
            <input
              type="number"
              step="any"
              value={formData.max_grade != null ? Number(formData.max_grade) : ''}
              onChange={e => handleChange('max_grade', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.warn_rfqs}
              onChange={e => handleChange('warn_rfqs', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Warn RFQs</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.warn_pos}
              onChange={e => handleChange('warn_pos', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Warn Purchase Orders</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.prevent_rfqs}
              onChange={e => handleChange('prevent_rfqs', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Prevent RFQs</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.prevent_pos}
              onChange={e => handleChange('prevent_pos', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Prevent Purchase Orders</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.notify_supplier}
              onChange={e => handleChange('notify_supplier', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Notify Supplier</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.notify_employee}
              onChange={e => handleChange('notify_employee', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Notify Other</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Other (→ Employee)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Employee..."
                value={String(formData.employee_link ?? '')}
                onChange={e => {
                  handleChange('employee_link', e.target.value);
                  // TODO: Implement async search for Employee
                  // fetch(`/api/resource/Employee?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Employee"
                data-fieldname="employee_link"
              />
              {/* Link indicator */}
              {formData.employee_link && (
                <button
                  type="button"
                  onClick={() => handleChange('employee_link', '')}
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