// Form scaffold for Shipment Parcel
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ShipmentParcel } from '../types/shipment-parcel.js';

interface ShipmentParcelFormProps {
  initialData?: Partial<ShipmentParcel>;
  onSubmit: (data: Partial<ShipmentParcel>) => void;
  mode: 'create' | 'edit';
}

export function ShipmentParcelForm({ initialData = {}, onSubmit, mode }: ShipmentParcelFormProps) {
  const [formData, setFormData] = useState<Partial<ShipmentParcel>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Shipment Parcel' : 'New Shipment Parcel'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Length (cm)</label>
            <input
              type="number"
              step="1"
              value={formData.length != null ? Number(formData.length) : ''}
              onChange={e => handleChange('length', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Width (cm)</label>
            <input
              type="number"
              step="1"
              value={formData.width != null ? Number(formData.width) : ''}
              onChange={e => handleChange('width', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
            <input
              type="number"
              step="1"
              value={formData.height != null ? Number(formData.height) : ''}
              onChange={e => handleChange('height', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
            <input
              type="number"
              step="any"
              value={formData.weight != null ? Number(formData.weight) : ''}
              onChange={e => handleChange('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Count</label>
            <input
              type="number"
              step="1"
              value={formData.count != null ? Number(formData.count) : ''}
              onChange={e => handleChange('count', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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