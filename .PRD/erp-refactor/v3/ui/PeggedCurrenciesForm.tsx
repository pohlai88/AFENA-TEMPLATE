// Form scaffold for Pegged Currencies
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PeggedCurrencies } from '../types/pegged-currencies.js';

interface PeggedCurrenciesFormProps {
  initialData?: Partial<PeggedCurrencies>;
  onSubmit: (data: Partial<PeggedCurrencies>) => void;
  mode: 'create' | 'edit';
}

export function PeggedCurrenciesForm({ initialData = {}, onSubmit, mode }: PeggedCurrenciesFormProps) {
  const [formData, setFormData] = useState<Partial<PeggedCurrencies>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Pegged Currencies' : 'New Pegged Currencies'}</h2>
      {/* Section: pegged_currencies_item_section */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: pegged_currency_item → Pegged Currency Details */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">pegged_currency_item</label>
            <div className="mt-1 border rounded overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-3 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(Array.isArray(formData.pegged_currency_item) ? (formData.pegged_currency_item as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.pegged_currency_item) ? formData.pegged_currency_item : [])];
                            rows.splice(idx, 1);
                            handleChange('pegged_currency_item', rows);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-2 bg-gray-50 border-t">
                <button
                  type="button"
                  onClick={() => handleChange('pegged_currency_item', [...(Array.isArray(formData.pegged_currency_item) ? formData.pegged_currency_item : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
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