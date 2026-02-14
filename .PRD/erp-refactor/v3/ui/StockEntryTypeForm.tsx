// Form scaffold for Stock Entry Type
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { StockEntryType } from '../types/stock-entry-type.js';

interface StockEntryTypeFormProps {
  initialData?: Partial<StockEntryType>;
  onSubmit: (data: Partial<StockEntryType>) => void;
  mode: 'create' | 'edit';
}

export function StockEntryTypeForm({ initialData = {}, onSubmit, mode }: StockEntryTypeFormProps) {
  const [formData, setFormData] = useState<Partial<StockEntryType>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Stock Entry Type' : 'New Stock Entry Type'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Purpose</label>
            <select
              value={String(formData.purpose ?? '')}
              onChange={e => handleChange('purpose', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Material Issue">Material Issue</option>
              <option value="Material Receipt">Material Receipt</option>
              <option value="Material Transfer">Material Transfer</option>
              <option value="Material Transfer for Manufacture">Material Transfer for Manufacture</option>
              <option value="Material Consumption for Manufacture">Material Consumption for Manufacture</option>
              <option value="Manufacture">Manufacture</option>
              <option value="Repack">Repack</option>
              <option value="Send to Subcontractor">Send to Subcontractor</option>
              <option value="Disassemble">Disassemble</option>
              <option value="Receive from Customer">Receive from Customer</option>
              <option value="Return Raw Material to Customer">Return Raw Material to Customer</option>
              <option value="Subcontracting Delivery">Subcontracting Delivery</option>
              <option value="Subcontracting Return">Subcontracting Return</option>
            </select>
          </div>
          {formData.purpose === 'Material Transfer' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.add_to_transit}
              onChange={e => handleChange('add_to_transit', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Add to Transit</label>
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_standard}
              onChange={e => handleChange('is_standard', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Standard</label>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}