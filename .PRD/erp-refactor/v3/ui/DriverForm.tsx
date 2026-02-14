// Form scaffold for Driver
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { Driver } from '../types/driver.js';

interface DriverFormProps {
  initialData?: Partial<Driver>;
  onSubmit: (data: Partial<Driver>) => void;
  mode: 'create' | 'edit';
}

export function DriverForm({ initialData = {}, onSubmit, mode }: DriverFormProps) {
  const [formData, setFormData] = useState<Partial<Driver>>(initialData);

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
        {mode === 'edit' ? formData.full_name ?? 'Driver' : 'New Driver'}
      </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Series</label>
            <select
              value={String(formData.naming_series ?? '')}
              onChange={e => handleChange('naming_series', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>

            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={String(formData.full_name ?? '')}
              onChange={e => handleChange('full_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Left">Left</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Transporter (→ Supplier)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Supplier..."
                value={String(formData.transporter ?? '')}
                onChange={e => {
                  handleChange('transporter', e.target.value);
                  // TODO: Implement async search for Supplier
                  // fetch(`/api/resource/Supplier?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Supplier"
                data-fieldname="transporter"
              />
              {/* Link indicator */}
              {formData.transporter && (
                <button
                  type="button"
                  onClick={() => handleChange('transporter', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
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
            <label className="block text-sm font-medium text-gray-700">Cellphone Number</label>
            <input
              type="text"
              value={String(formData.cell_number ?? '')}
              onChange={e => handleChange('cell_number', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address (→ Address)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Address..."
                value={String(formData.address ?? '')}
                onChange={e => {
                  handleChange('address', e.target.value);
                  // TODO: Implement async search for Address
                  // fetch(`/api/resource/Address?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Address"
                data-fieldname="address"
              />
              {/* Link indicator */}
              {formData.address && (
                <button
                  type="button"
                  onClick={() => handleChange('address', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">User (→ User)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search User..."
                value={String(formData.user ?? '')}
                onChange={e => {
                  handleChange('user', e.target.value);
                  // TODO: Implement async search for User
                  // fetch(`/api/resource/User?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="User"
                data-fieldname="user"
              />
              {/* Link indicator */}
              {formData.user && (
                <button
                  type="button"
                  onClick={() => handleChange('user', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
      {/* Section: License Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">License Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">License Number</label>
            <input
              type="text"
              value={String(formData.license_number ?? '')}
              onChange={e => handleChange('license_number', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Issuing Date</label>
            <input
              type="date"
              value={String(formData.issuing_date ?? '')}
              onChange={e => handleChange('issuing_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
            <input
              type="date"
              value={String(formData.expiry_date ?? '')}
              onChange={e => handleChange('expiry_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Driving License Categories */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Driving License Categories</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: driving_license_category → Driving License Category */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Driving License Category</label>
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
                  {(Array.isArray(formData.driving_license_category) ? (formData.driving_license_category as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.driving_license_category) ? formData.driving_license_category : [])];
                            rows.splice(idx, 1);
                            handleChange('driving_license_category', rows);
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
                  onClick={() => handleChange('driving_license_category', [...(Array.isArray(formData.driving_license_category) ? formData.driving_license_category : []), {}])}
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