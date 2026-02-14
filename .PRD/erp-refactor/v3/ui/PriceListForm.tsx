// Form scaffold for Price List
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PriceList } from '../types/price-list.js';

interface PriceListFormProps {
  initialData?: Partial<PriceList>;
  onSubmit: (data: Partial<PriceList>) => void;
  mode: 'create' | 'edit';
}

export function PriceListForm({ initialData = {}, onSubmit, mode }: PriceListFormProps) {
  const [formData, setFormData] = useState<Partial<PriceList>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Price List' : 'New Price List'}</h2>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enabled}
              onChange={e => handleChange('enabled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enabled</label>
          </div>
      {/* Section: sb_1 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price List Name</label>
            <input
              type="text"
              value={String(formData.price_list_name ?? '')}
              onChange={e => handleChange('price_list_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency (→ Currency)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Currency..."
                value={String(formData.currency ?? '')}
                onChange={e => {
                  handleChange('currency', e.target.value);
                  // TODO: Implement async search for Currency
                  // fetch(`/api/resource/Currency?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Currency"
                data-fieldname="currency"
              />
              {/* Link indicator */}
              {formData.currency && (
                <button
                  type="button"
                  onClick={() => handleChange('currency', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.buying}
              onChange={e => handleChange('buying', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Buying</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.selling}
              onChange={e => handleChange('selling', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Selling</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.price_not_uom_dependent}
              onChange={e => handleChange('price_not_uom_dependent', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Price Not UOM Dependent</label>
          </div>
          {/* Child table: countries → Price List Country */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Applicable for Countries</label>
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
                  {(Array.isArray(formData.countries) ? (formData.countries as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.countries) ? formData.countries : [])];
                            rows.splice(idx, 1);
                            handleChange('countries', rows);
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
                  onClick={() => handleChange('countries', [...(Array.isArray(formData.countries) ? formData.countries : []), {}])}
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