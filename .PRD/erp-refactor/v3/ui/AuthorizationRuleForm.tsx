// Form scaffold for Authorization Rule
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { AuthorizationRule } from '../types/authorization-rule.js';

interface AuthorizationRuleFormProps {
  initialData?: Partial<AuthorizationRule>;
  onSubmit: (data: Partial<AuthorizationRule>) => void;
  mode: 'create' | 'edit';
}

export function AuthorizationRuleForm({ initialData = {}, onSubmit, mode }: AuthorizationRuleFormProps) {
  const [formData, setFormData] = useState<Partial<AuthorizationRule>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Authorization Rule' : 'New Authorization Rule'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Transaction</label>
            <select
              value={String(formData.transaction ?? '')}
              onChange={e => handleChange('transaction', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Sales Order">Sales Order</option>
              <option value="Purchase Order">Purchase Order</option>
              <option value="Quotation">Quotation</option>
              <option value="Delivery Note">Delivery Note</option>
              <option value="Sales Invoice">Sales Invoice</option>
              <option value="Purchase Invoice">Purchase Invoice</option>
              <option value="Purchase Receipt">Purchase Receipt</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Based On</label>
            <select
              value={String(formData.based_on ?? '')}
              onChange={e => handleChange('based_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Grand Total">Grand Total</option>
              <option value="Average Discount">Average Discount</option>
              <option value="Customerwise Discount">Customerwise Discount</option>
              <option value="Itemwise Discount">Itemwise Discount</option>
              <option value="Item Group wise Discount">Item Group wise Discount</option>
              <option value="Not Applicable">Not Applicable</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer or Item</label>
            <select
              value={String(formData.customer_or_item ?? '')}
              onChange={e => handleChange('customer_or_item', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Customer">Customer</option>
              <option value="Item">Item</option>
              <option value="Item Group">Item Group</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer / Item / Item Group</label>
            <input
              type="text"
              value={String(formData.master_name ?? '')}
              onChange={e => handleChange('master_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company (→ Company)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Company..."
                value={String(formData.company ?? '')}
                onChange={e => {
                  handleChange('company', e.target.value);
                  // TODO: Implement async search for Company
                  // fetch(`/api/resource/Company?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Company"
                data-fieldname="company"
              />
              {/* Link indicator */}
              {formData.company && (
                <button
                  type="button"
                  onClick={() => handleChange('company', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
      {/* Section: section_break_17 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Authorized Value</label>
            <input
              type="number"
              step="any"
              value={formData.value != null ? Number(formData.value) : ''}
              onChange={e => handleChange('value', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: section_break_7 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Applicable To (Role) (→ Role)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Role..."
                value={String(formData.system_role ?? '')}
                onChange={e => {
                  handleChange('system_role', e.target.value);
                  // TODO: Implement async search for Role
                  // fetch(`/api/resource/Role?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Role"
                data-fieldname="system_role"
              />
              {/* Link indicator */}
              {formData.system_role && (
                <button
                  type="button"
                  onClick={() => handleChange('system_role', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Applicable To (Employee) (→ Employee)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Employee..."
                value={String(formData.to_emp ?? '')}
                onChange={e => {
                  handleChange('to_emp', e.target.value);
                  // TODO: Implement async search for Employee
                  // fetch(`/api/resource/Employee?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Employee"
                data-fieldname="to_emp"
              />
              {/* Link indicator */}
              {formData.to_emp && (
                <button
                  type="button"
                  onClick={() => handleChange('to_emp', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Applicable To (User) (→ User)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search User..."
                value={String(formData.system_user ?? '')}
                onChange={e => {
                  handleChange('system_user', e.target.value);
                  // TODO: Implement async search for User
                  // fetch(`/api/resource/User?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="User"
                data-fieldname="system_user"
              />
              {/* Link indicator */}
              {formData.system_user && (
                <button
                  type="button"
                  onClick={() => handleChange('system_user', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Applicable To (Designation) (→ Designation)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Designation..."
                value={String(formData.to_designation ?? '')}
                onChange={e => {
                  handleChange('to_designation', e.target.value);
                  // TODO: Implement async search for Designation
                  // fetch(`/api/resource/Designation?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Designation"
                data-fieldname="to_designation"
              />
              {/* Link indicator */}
              {formData.to_designation && (
                <button
                  type="button"
                  onClick={() => handleChange('to_designation', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Section: section_break_13 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Approving Role (above authorized value) (→ Role)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Role..."
                value={String(formData.approving_role ?? '')}
                onChange={e => {
                  handleChange('approving_role', e.target.value);
                  // TODO: Implement async search for Role
                  // fetch(`/api/resource/Role?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Role"
                data-fieldname="approving_role"
              />
              {/* Link indicator */}
              {formData.approving_role && (
                <button
                  type="button"
                  onClick={() => handleChange('approving_role', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Approving User  (above authorized value) (→ User)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search User..."
                value={String(formData.approving_user ?? '')}
                onChange={e => {
                  handleChange('approving_user', e.target.value);
                  // TODO: Implement async search for User
                  // fetch(`/api/resource/User?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="User"
                data-fieldname="approving_user"
              />
              {/* Link indicator */}
              {formData.approving_user && (
                <button
                  type="button"
                  onClick={() => handleChange('approving_user', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
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