// Form scaffold for Driving License Category
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { DrivingLicenseCategory } from '../types/driving-license-category.js';

interface DrivingLicenseCategoryFormProps {
  initialData?: Partial<DrivingLicenseCategory>;
  onSubmit: (data: Partial<DrivingLicenseCategory>) => void;
  mode: 'create' | 'edit';
}

export function DrivingLicenseCategoryForm({ initialData = {}, onSubmit, mode }: DrivingLicenseCategoryFormProps) {
  const [formData, setFormData] = useState<Partial<DrivingLicenseCategory>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Driving License Category' : 'New Driving License Category'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Driver licence class</label>
            <input
              type="text"
              value={String(formData.class ?? '')}
              onChange={e => handleChange('class', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={String(formData.description ?? '')}
              onChange={e => handleChange('description', e.target.value)}
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

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}