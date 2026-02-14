// Form scaffold for Customer Group
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { CustomerGroup } from '../types/customer-group.js';

interface CustomerGroupFormProps {
  initialData?: Partial<CustomerGroup>;
  onSubmit: (data: Partial<CustomerGroup>) => void;
  mode: 'create' | 'edit';
}

export function CustomerGroupForm({ initialData = {}, onSubmit, mode }: CustomerGroupFormProps) {
  const [formData, setFormData] = useState<Partial<CustomerGroup>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Customer Group' : 'New Customer Group'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Group Name</label>
            <input
              type="text"
              value={String(formData.customer_group_name ?? '')}
              onChange={e => handleChange('customer_group_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Parent Customer Group (→ Customer Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Customer Group..."
                value={String(formData.parent_customer_group ?? '')}
                onChange={e => {
                  handleChange('parent_customer_group', e.target.value);
                  // TODO: Implement async search for Customer Group
                  // fetch(`/api/resource/Customer Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Customer Group"
                data-fieldname="parent_customer_group"
              />
              {/* Link indicator */}
              {formData.parent_customer_group && (
                <button
                  type="button"
                  onClick={() => handleChange('parent_customer_group', '')}
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
              checked={!!formData.is_group}
              onChange={e => handleChange('is_group', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Group</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Price List (→ Price List)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Price List..."
                value={String(formData.default_price_list ?? '')}
                onChange={e => {
                  handleChange('default_price_list', e.target.value);
                  // TODO: Implement async search for Price List
                  // fetch(`/api/resource/Price List?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Price List"
                data-fieldname="default_price_list"
              />
              {/* Link indicator */}
              {formData.default_price_list && (
                <button
                  type="button"
                  onClick={() => handleChange('default_price_list', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Payment Terms Template (→ Payment Terms Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Payment Terms Template..."
                value={String(formData.payment_terms ?? '')}
                onChange={e => {
                  handleChange('payment_terms', e.target.value);
                  // TODO: Implement async search for Payment Terms Template
                  // fetch(`/api/resource/Payment Terms Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Payment Terms Template"
                data-fieldname="payment_terms"
              />
              {/* Link indicator */}
              {formData.payment_terms && (
                <button
                  type="button"
                  onClick={() => handleChange('payment_terms', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">lft</label>
            <input
              type="number"
              step="1"
              value={formData.lft != null ? Number(formData.lft) : ''}
              onChange={e => handleChange('lft', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">rgt</label>
            <input
              type="number"
              step="1"
              value={formData.rgt != null ? Number(formData.rgt) : ''}
              onChange={e => handleChange('rgt', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">old_parent (→ Customer Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Customer Group..."
                value={String(formData.old_parent ?? '')}
                onChange={e => {
                  handleChange('old_parent', e.target.value);
                  // TODO: Implement async search for Customer Group
                  // fetch(`/api/resource/Customer Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Customer Group"
                data-fieldname="old_parent"
              />
              {/* Link indicator */}
              {formData.old_parent && (
                <button
                  type="button"
                  onClick={() => handleChange('old_parent', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
      {/* Section: Default Accounts */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Default Accounts</h4>
        <div className="grid grid-cols-2 gap-4">
          {!formData.__islocal && (
          {/* Child table: accounts → Party Account */}
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
          )}
        </div>
      </div>
      {/* Section: Credit Limits */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Credit Limits</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: credit_limits → Customer Credit Limit */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Credit Limit</label>
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
                  {(Array.isArray(formData.credit_limits) ? (formData.credit_limits as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.credit_limits) ? formData.credit_limits : [])];
                            rows.splice(idx, 1);
                            handleChange('credit_limits', rows);
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
                  onClick={() => handleChange('credit_limits', [...(Array.isArray(formData.credit_limits) ? formData.credit_limits : []), {}])}
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