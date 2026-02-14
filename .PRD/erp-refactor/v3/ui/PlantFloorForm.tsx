// Form scaffold for Plant Floor
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PlantFloor } from '../types/plant-floor.js';

interface PlantFloorFormProps {
  initialData?: Partial<PlantFloor>;
  onSubmit: (data: Partial<PlantFloor>) => void;
  mode: 'create' | 'edit';
}

export function PlantFloorForm({ initialData = {}, onSubmit, mode }: PlantFloorFormProps) {
  const [formData, setFormData] = useState<Partial<PlantFloor>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Plant Floor' : 'New Plant Floor'}</h2>
      {/* Tab: Workstations */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Workstations</h3>
      </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Plant Dashboard</label>
            <textarea
              value={String(formData.plant_dashboard ?? '')}
              onChange={e => handleChange('plant_dashboard', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Tab: Stock Summary */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Stock Summary</h3>
      </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Stock Summary</label>
            <textarea
              value={String(formData.stock_summary ?? '')}
              onChange={e => handleChange('stock_summary', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Tab: Floor */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Floor</h3>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Floor Name</label>
            <input
              type="text"
              value={String(formData.floor_name ?? '')}
              onChange={e => handleChange('floor_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company (→ Company)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Company..."
                value={String(formData.company ?? '')}
                onChange={e => {
                  handleChange('company', e.target.value);
                  // TODO: Implement async search for Company
                  // fetch(`/api/resource/Company?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Company"
                data-fieldname="company"
              />
              {/* Link indicator */}
              {formData.company && (
                <button
                  type="button"
                  onClick={() => handleChange('company', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.warehouse ?? '')}
                onChange={e => {
                  handleChange('warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="warehouse"
              />
              {/* Link indicator */}
              {formData.warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('warehouse', '')}
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