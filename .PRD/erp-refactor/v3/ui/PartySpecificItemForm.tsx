// Form scaffold for Party Specific Item
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PartySpecificItem } from '../types/party-specific-item.js';

interface PartySpecificItemFormProps {
  initialData?: Partial<PartySpecificItem>;
  onSubmit: (data: Partial<PartySpecificItem>) => void;
  mode: 'create' | 'edit';
}

export function PartySpecificItemForm({ initialData = {}, onSubmit, mode }: PartySpecificItemFormProps) {
  const [formData, setFormData] = useState<Partial<PartySpecificItem>>(initialData);

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
        {mode === 'edit' ? formData.party ?? 'Party Specific Item' : 'New Party Specific Item'}
      </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Party Type</label>
            <select
              value={String(formData.party_type ?? '')}
              onChange={e => handleChange('party_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Customer">Customer</option>
              <option value="Supplier">Supplier</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Party Name</label>
            <input
              type="text"
              value={String(formData.party ?? '')}
              onChange={e => handleChange('party', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Restrict Items Based On</label>
            <select
              value={String(formData.restrict_based_on ?? '')}
              onChange={e => handleChange('restrict_based_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Item">Item</option>
              <option value="Item Group">Item Group</option>
              <option value="Brand">Brand</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Based On Value</label>
            <input
              type="text"
              value={String(formData.based_on_value ?? '')}
              onChange={e => handleChange('based_on_value', e.target.value)}
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