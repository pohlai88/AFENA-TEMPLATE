// Form scaffold for Shipment Parcel Template
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ShipmentParcelTemplate } from '../types/shipment-parcel-template.js';

interface ShipmentParcelTemplateFormProps {
  initialData?: Partial<ShipmentParcelTemplate>;
  onSubmit: (data: Partial<ShipmentParcelTemplate>) => void;
  mode: 'create' | 'edit';
}

export function ShipmentParcelTemplateForm({ initialData = {}, onSubmit, mode }: ShipmentParcelTemplateFormProps) {
  const [formData, setFormData] = useState<Partial<ShipmentParcelTemplate>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Shipment Parcel Template' : 'New Shipment Parcel Template'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Parcel Template Name</label>
            <input
              type="text"
              value={String(formData.parcel_template_name ?? '')}
              onChange={e => handleChange('parcel_template_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Length (cm)</label>
            <input
              type="number"
              step="1"
              value={formData.length != null ? Number(formData.length) : ''}
              onChange={e => handleChange('length', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Width (cm)</label>
            <input
              type="number"
              step="1"
              value={formData.width != null ? Number(formData.width) : ''}
              onChange={e => handleChange('width', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
            <input
              type="number"
              step="1"
              value={formData.height != null ? Number(formData.height) : ''}
              onChange={e => handleChange('height', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}