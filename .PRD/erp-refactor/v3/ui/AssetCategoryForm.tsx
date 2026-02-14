// Form scaffold for Asset Category
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { AssetCategory } from '../types/asset-category.js';

interface AssetCategoryFormProps {
  initialData?: Partial<AssetCategory>;
  onSubmit: (data: Partial<AssetCategory>) => void;
  mode: 'create' | 'edit';
}

export function AssetCategoryForm({ initialData = {}, onSubmit, mode }: AssetCategoryFormProps) {
  const [formData, setFormData] = useState<Partial<AssetCategory>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Asset Category' : 'New Asset Category'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Category Name</label>
            <input
              type="text"
              value={String(formData.asset_category_name ?? '')}
              onChange={e => handleChange('asset_category_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
      {/* Section: Depreciation Options */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Depreciation Options</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enable_cwip_accounting}
              onChange={e => handleChange('enable_cwip_accounting', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enable Capital Work in Progress Accounting</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.non_depreciable_category}
              onChange={e => handleChange('non_depreciable_category', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Non Depreciable Category</label>
          </div>
        </div>
      </div>
      {/* Section: Finance Book Detail */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Finance Book Detail</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: finance_books → Asset Finance Book */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Finance Books</label>
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
                  {(Array.isArray(formData.finance_books) ? (formData.finance_books as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.finance_books) ? formData.finance_books : [])];
                            rows.splice(idx, 1);
                            handleChange('finance_books', rows);
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
                  onClick={() => handleChange('finance_books', [...(Array.isArray(formData.finance_books) ? formData.finance_books : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Accounts */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Accounts</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: accounts → Asset Category Account */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Accounts</label>
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
                  {(Array.isArray(formData.accounts) ? (formData.accounts as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.accounts) ? formData.accounts : [])];
                            rows.splice(idx, 1);
                            handleChange('accounts', rows);
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
                  onClick={() => handleChange('accounts', [...(Array.isArray(formData.accounts) ? formData.accounts : []), {}])}
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