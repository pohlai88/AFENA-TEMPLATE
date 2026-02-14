// Form scaffold for Customer Group Item
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { CustomerGroupItem } from '../types/customer-group-item.js';

interface CustomerGroupItemFormProps {
  initialData?: Partial<CustomerGroupItem>;
  onSubmit: (data: Partial<CustomerGroupItem>) => void;
  mode: 'create' | 'edit';
}

export function CustomerGroupItemForm({ initialData = {}, onSubmit, mode }: CustomerGroupItemFormProps) {
  const [formData, setFormData] = useState<Partial<CustomerGroupItem>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Customer Group Item' : 'New Customer Group Item'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Group (→ Customer Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Customer Group..."
                value={String(formData.customer_group ?? '')}
                onChange={e => {
                  handleChange('customer_group', e.target.value);
                  // TODO: Implement async search for Customer Group
                  // fetch(`/api/resource/Customer Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Customer Group"
                data-fieldname="customer_group"
              />
              {/* Link indicator */}
              {formData.customer_group && (
                <button
                  type="button"
                  onClick={() => handleChange('customer_group', '')}
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