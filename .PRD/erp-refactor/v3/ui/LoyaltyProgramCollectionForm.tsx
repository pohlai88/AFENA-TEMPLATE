// Form scaffold for Loyalty Program Collection
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { LoyaltyProgramCollection } from '../types/loyalty-program-collection.js';

interface LoyaltyProgramCollectionFormProps {
  initialData?: Partial<LoyaltyProgramCollection>;
  onSubmit: (data: Partial<LoyaltyProgramCollection>) => void;
  mode: 'create' | 'edit';
}

export function LoyaltyProgramCollectionForm({ initialData = {}, onSubmit, mode }: LoyaltyProgramCollectionFormProps) {
  const [formData, setFormData] = useState<Partial<LoyaltyProgramCollection>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Loyalty Program Collection' : 'New Loyalty Program Collection'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tier Name</label>
            <input
              type="text"
              value={String(formData.tier_name ?? '')}
              onChange={e => handleChange('tier_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Total Spent</label>
            <input
              type="number"
              step="any"
              value={formData.min_spent != null ? Number(formData.min_spent) : ''}
              onChange={e => handleChange('min_spent', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Collection Factor (=1 LP)</label>
            <input
              type="number"
              step="any"
              value={formData.collection_factor != null ? Number(formData.collection_factor) : ''}
              onChange={e => handleChange('collection_factor', e.target.value ? parseFloat(e.target.value) : undefined)}
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