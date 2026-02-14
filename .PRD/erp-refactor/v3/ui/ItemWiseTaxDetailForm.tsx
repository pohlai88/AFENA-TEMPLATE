// Form scaffold for Item Wise Tax Detail
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ItemWiseTaxDetail } from '../types/item-wise-tax-detail.js';

interface ItemWiseTaxDetailFormProps {
  initialData?: Partial<ItemWiseTaxDetail>;
  onSubmit: (data: Partial<ItemWiseTaxDetail>) => void;
  mode: 'create' | 'edit';
}

export function ItemWiseTaxDetailForm({ initialData = {}, onSubmit, mode }: ItemWiseTaxDetailFormProps) {
  const [formData, setFormData] = useState<Partial<ItemWiseTaxDetail>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Item Wise Tax Detail' : 'New Item Wise Tax Detail'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Row</label>
            <input
              type="text"
              value={String(formData.item_row ?? '')}
              onChange={e => handleChange('item_row', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Row</label>
            <input
              type="text"
              value={String(formData.tax_row ?? '')}
              onChange={e => handleChange('tax_row', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Rate</label>
            <input
              type="number"
              step="any"
              value={formData.rate != null ? Number(formData.rate) : ''}
              onChange={e => handleChange('rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tax Amount</label>
            <input
              type="number"
              step="any"
              value={formData.amount != null ? Number(formData.amount) : ''}
              onChange={e => handleChange('amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Taxable Amount</label>
            <input
              type="number"
              step="any"
              value={formData.taxable_amount != null ? Number(formData.taxable_amount) : ''}
              onChange={e => handleChange('taxable_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
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