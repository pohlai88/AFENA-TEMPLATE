// Form scaffold for Sales Team
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SalesTeam } from '../types/sales-team.js';

interface SalesTeamFormProps {
  initialData?: Partial<SalesTeam>;
  onSubmit: (data: Partial<SalesTeam>) => void;
  mode: 'create' | 'edit';
}

export function SalesTeamForm({ initialData = {}, onSubmit, mode }: SalesTeamFormProps) {
  const [formData, setFormData] = useState<Partial<SalesTeam>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Sales Team' : 'New Sales Team'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Person (→ Sales Person)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Person..."
                value={String(formData.sales_person ?? '')}
                onChange={e => {
                  handleChange('sales_person', e.target.value);
                  // TODO: Implement async search for Sales Person
                  // fetch(`/api/resource/Sales Person?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Sales Person"
                data-fieldname="sales_person"
              />
              {/* Link indicator */}
              {formData.sales_person && (
                <button
                  type="button"
                  onClick={() => handleChange('sales_person', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact No.</label>
            <input
              type="text"
              value={String(formData.contact_no ?? '')}
              onChange={e => handleChange('contact_no', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contribution (%)</label>
            <input
              type="number"
              step="any"
              value={formData.allocated_percentage != null ? Number(formData.allocated_percentage) : ''}
              onChange={e => handleChange('allocated_percentage', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contribution to Net Total</label>
            <input
              type="number"
              step="any"
              value={formData.allocated_amount != null ? Number(formData.allocated_amount) : ''}
              onChange={e => handleChange('allocated_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Commission Rate</label>
            <input
              type="text"
              value={String(formData.commission_rate ?? '')}
              onChange={e => handleChange('commission_rate', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Incentives</label>
            <input
              type="number"
              step="any"
              value={formData.incentives != null ? Number(formData.incentives) : ''}
              onChange={e => handleChange('incentives', e.target.value ? parseFloat(e.target.value) : undefined)}
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