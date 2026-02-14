// Form scaffold for Loyalty Point Entry Redemption
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { LoyaltyPointEntryRedemption } from '../types/loyalty-point-entry-redemption.js';

interface LoyaltyPointEntryRedemptionFormProps {
  initialData?: Partial<LoyaltyPointEntryRedemption>;
  onSubmit: (data: Partial<LoyaltyPointEntryRedemption>) => void;
  mode: 'create' | 'edit';
}

export function LoyaltyPointEntryRedemptionForm({ initialData = {}, onSubmit, mode }: LoyaltyPointEntryRedemptionFormProps) {
  const [formData, setFormData] = useState<Partial<LoyaltyPointEntryRedemption>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Loyalty Point Entry Redemption' : 'New Loyalty Point Entry Redemption'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Invoice</label>
            <input
              type="text"
              value={String(formData.sales_invoice ?? '')}
              onChange={e => handleChange('sales_invoice', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Redemption Date</label>
            <input
              type="date"
              value={String(formData.redemption_date ?? '')}
              onChange={e => handleChange('redemption_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Redeemed Points</label>
            <input
              type="number"
              step="1"
              value={formData.redeemed_points != null ? Number(formData.redeemed_points) : ''}
              onChange={e => handleChange('redeemed_points', e.target.value ? parseInt(e.target.value) : undefined)}
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