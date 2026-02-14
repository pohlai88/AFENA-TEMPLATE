// Form scaffold for Sales Person
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SalesPerson } from '../types/sales-person.js';

interface SalesPersonFormProps {
  initialData?: Partial<SalesPerson>;
  onSubmit: (data: Partial<SalesPerson>) => void;
  mode: 'create' | 'edit';
}

export function SalesPersonForm({ initialData = {}, onSubmit, mode }: SalesPersonFormProps) {
  const [formData, setFormData] = useState<Partial<SalesPerson>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Sales Person' : 'New Sales Person'}</h2>
      {/* Section: Name and Employee ID */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Name and Employee ID</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Person Name</label>
            <input
              type="text"
              value={String(formData.sales_person_name ?? '')}
              onChange={e => handleChange('sales_person_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Parent Sales Person (→ Sales Person)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Person..."
                value={String(formData.parent_sales_person ?? '')}
                onChange={e => {
                  handleChange('parent_sales_person', e.target.value);
                  // TODO: Implement async search for Sales Person
                  // fetch(`/api/resource/Sales Person?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Person"
                data-fieldname="parent_sales_person"
              />
              {/* Link indicator */}
              {formData.parent_sales_person && (
                <button
                  type="button"
                  onClick={() => handleChange('parent_sales_person', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_group}
              onChange={e => handleChange('is_group', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Group</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enabled}
              onChange={e => handleChange('enabled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enabled</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee (→ Employee)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Employee..."
                value={String(formData.employee ?? '')}
                onChange={e => {
                  handleChange('employee', e.target.value);
                  // TODO: Implement async search for Employee
                  // fetch(`/api/resource/Employee?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Employee"
                data-fieldname="employee"
              />
              {/* Link indicator */}
              {formData.employee && (
                <button
                  type="button"
                  onClick={() => handleChange('employee', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department (→ Department)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Department..."
                value={String(formData.department ?? '')}
                onChange={e => {
                  handleChange('department', e.target.value);
                  // TODO: Implement async search for Department
                  // fetch(`/api/resource/Department?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Department"
                data-fieldname="department"
              />
              {/* Link indicator */}
              {formData.department && (
                <button
                  type="button"
                  onClick={() => handleChange('department', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">lft</label>
            <input
              type="number"
              step="1"
              value={formData.lft != null ? Number(formData.lft) : ''}
              onChange={e => handleChange('lft', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">rgt</label>
            <input
              type="number"
              step="1"
              value={formData.rgt != null ? Number(formData.rgt) : ''}
              onChange={e => handleChange('rgt', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">old_parent</label>
            <input
              type="text"
              value={String(formData.old_parent ?? '')}
              onChange={e => handleChange('old_parent', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Sales Person Targets */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Sales Person Targets</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: targets → Target Detail */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Targets</label>
            <div className="mt-1 border rounded overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(Array.isArray(formData.targets) ? (formData.targets as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.targets) ? formData.targets : [])];
                            rows.splice(idx, 1);
                            handleChange('targets', rows);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-2 bg-gray-50 border-t">
                <button
                  type="button"
                  onClick={() => handleChange('targets', [...(Array.isArray(formData.targets) ? formData.targets : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
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