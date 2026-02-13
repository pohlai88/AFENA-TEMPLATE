// Form scaffold for Supplier Group Item
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SupplierGroupItem } from '../types/supplier-group-item.js';

interface SupplierGroupItemFormProps {
  initialData?: Partial<SupplierGroupItem>;
  onSubmit: (data: Partial<SupplierGroupItem>) => void;
  mode: 'create' | 'edit';
}

export function SupplierGroupItemForm({ initialData = {}, onSubmit, mode }: SupplierGroupItemFormProps) {
  const [formData, setFormData] = useState<Partial<SupplierGroupItem>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Supplier Group Item' : 'New Supplier Group Item'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier Group (→ Supplier Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Supplier Group..."
                value={String(formData.supplier_group ?? '')}
                onChange={e => {
                  handleChange('supplier_group', e.target.value);
                  // TODO: Implement async search for Supplier Group
                  // fetch(`/api/resource/Supplier Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Supplier Group"
                data-fieldname="supplier_group"
              />
              {/* Link indicator */}
              {formData.supplier_group && (
                <button
                  type="button"
                  onClick={() => handleChange('supplier_group', '')}
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