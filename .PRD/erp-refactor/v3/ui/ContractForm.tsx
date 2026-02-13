// Form scaffold for Contract
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { Contract } from '../types/contract.js';

interface ContractFormProps {
  initialData?: Partial<Contract>;
  onSubmit: (data: Partial<Contract>) => void;
  mode: 'create' | 'edit';
}

export function ContractForm({ initialData = {}, onSubmit, mode }: ContractFormProps) {
  const [formData, setFormData] = useState<Partial<Contract>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">
        {mode === 'edit' ? formData.party_name ?? 'Contract' : 'New Contract'}
      </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Party Type</label>
            <select
              value={String(formData.party_type ?? '')}
              onChange={e => handleChange('party_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Customer">Customer</option>
              <option value="Supplier">Supplier</option>
              <option value="Employee">Employee</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_signed}
              onChange={e => handleChange('is_signed', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Signed</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Party Name</label>
            <input
              type="text"
              value={String(formData.party_name ?? '')}
              onChange={e => handleChange('party_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Party User (→ User)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search User..."
                value={String(formData.party_user ?? '')}
                onChange={e => {
                  handleChange('party_user', e.target.value);
                  // TODO: Implement async search for User
                  // fetch(`/api/resource/User?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="User"
                data-fieldname="party_user"
              />
              {/* Link indicator */}
              {formData.party_user && (
                <button
                  type="button"
                  onClick={() => handleChange('party_user', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Unsigned">Unsigned</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fulfilment Status</label>
            <select
              value={String(formData.fulfilment_status ?? '')}
              onChange={e => handleChange('fulfilment_status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="N/A">N/A</option>
              <option value="Unfulfilled">Unfulfilled</option>
              <option value="Partially Fulfilled">Partially Fulfilled</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Lapsed">Lapsed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Party Full Name</label>
            <input
              type="text"
              value={String(formData.party_full_name ?? '')}
              onChange={e => handleChange('party_full_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: Contract Period */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Contract Period</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={String(formData.start_date ?? '')}
              onChange={e => handleChange('start_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={String(formData.end_date ?? '')}
              onChange={e => handleChange('end_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Signee Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Signee Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Signee</label>
            <input
              type="text"
              value={String(formData.signee ?? '')}
              onChange={e => handleChange('signee', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Signed On</label>
            <input
              type="datetime-local"
              value={String(formData.signed_on ?? '')}
              onChange={e => handleChange('signed_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">IP Address</label>
            <input
              type="text"
              value={String(formData.ip_address ?? '')}
              onChange={e => handleChange('ip_address', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Contract Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Contract Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Contract Template (→ Contract Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Contract Template..."
                value={String(formData.contract_template ?? '')}
                onChange={e => {
                  handleChange('contract_template', e.target.value);
                  // TODO: Implement async search for Contract Template
                  // fetch(`/api/resource/Contract Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Contract Template"
                data-fieldname="contract_template"
              />
              {/* Link indicator */}
              {formData.contract_template && (
                <button
                  type="button"
                  onClick={() => handleChange('contract_template', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Contract Terms</label>
            <textarea
              value={String(formData.contract_terms ?? '')}
              onChange={e => handleChange('contract_terms', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
        </div>
      </div>
      {/* Section: Fulfilment Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Fulfilment Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.requires_fulfilment}
              onChange={e => handleChange('requires_fulfilment', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Requires Fulfilment</label>
          </div>
          {formData.requires_fulfilment===1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Fulfilment Deadline</label>
            <input
              type="date"
              value={String(formData.fulfilment_deadline ?? '')}
              onChange={e => handleChange('fulfilment_deadline', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.requires_fulfilment===1 && (
          {/* Child table: fulfilment_terms → Contract Fulfilment Checklist */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Fulfilment Terms</label>
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
                  {(Array.isArray(formData.fulfilment_terms) ? (formData.fulfilment_terms as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.fulfilment_terms) ? formData.fulfilment_terms : [])];
                            rows.splice(idx, 1);
                            handleChange('fulfilment_terms', rows);
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
                  onClick={() => handleChange('fulfilment_terms', [...(Array.isArray(formData.fulfilment_terms) ? formData.fulfilment_terms : []), {}])}
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
      {/* Section: Authorised By */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Authorised By</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Signee (Company)</label>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Signed By (Company) (→ User)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search User..."
                value={String(formData.signed_by_company ?? '')}
                onChange={e => {
                  handleChange('signed_by_company', e.target.value);
                  // TODO: Implement async search for User
                  // fetch(`/api/resource/User?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="User"
                data-fieldname="signed_by_company"
              />
              {/* Link indicator */}
              {formData.signed_by_company && (
                <button
                  type="button"
                  onClick={() => handleChange('signed_by_company', '')}
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
      {/* Section: References */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">References</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Document Type</label>
            <select
              value={String(formData.document_type ?? '')}
              onChange={e => handleChange('document_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Quotation">Quotation</option>
              <option value="Project">Project</option>
              <option value="Sales Order">Sales Order</option>
              <option value="Purchase Order">Purchase Order</option>
              <option value="Sales Invoice">Sales Invoice</option>
              <option value="Purchase Invoice">Purchase Invoice</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Document Name</label>
            <input
              type="text"
              value={String(formData.document_name ?? '')}
              onChange={e => handleChange('document_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Contract)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Contract..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Contract
                  // fetch(`/api/resource/Contract?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Contract"
                data-fieldname="amended_from"
              />
              {/* Link indicator */}
              {formData.amended_from && (
                <button
                  type="button"
                  onClick={() => handleChange('amended_from', '')}
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