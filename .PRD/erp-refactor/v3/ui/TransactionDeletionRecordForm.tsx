// Form scaffold for Transaction Deletion Record
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { TransactionDeletionRecord } from '../types/transaction-deletion-record.js';

interface TransactionDeletionRecordFormProps {
  initialData?: Partial<TransactionDeletionRecord>;
  onSubmit: (data: Partial<TransactionDeletionRecord>) => void;
  mode: 'create' | 'edit';
}

export function TransactionDeletionRecordForm({ initialData = {}, onSubmit, mode }: TransactionDeletionRecordFormProps) {
  const [formData, setFormData] = useState<Partial<TransactionDeletionRecord>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Transaction Deletion Record' : 'New Transaction Deletion Record'}</h2>
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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
      {/* Section: section_break_qpwb */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Queued">Queued</option>
              <option value="Running">Running</option>
              <option value="Failed">Failed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          {!!formData.error_log && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Error Log</label>
            <textarea
              value={String(formData.error_log ?? '')}
              onChange={e => handleChange('error_log', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Tasks */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Tasks</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Delete Bins</label>
            <select
              value={String(formData.delete_bin_data_status ?? '')}
              onChange={e => handleChange('delete_bin_data_status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Skipped">Skipped</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Delete Leads and Addresses</label>
            <select
              value={String(formData.delete_leads_and_addresses_status ?? '')}
              onChange={e => handleChange('delete_leads_and_addresses_status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Skipped">Skipped</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reset Company Default Values</label>
            <select
              value={String(formData.reset_company_default_values_status ?? '')}
              onChange={e => handleChange('reset_company_default_values_status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Skipped">Skipped</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Clear Notifications</label>
            <select
              value={String(formData.clear_notifications_status ?? '')}
              onChange={e => handleChange('clear_notifications_status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Skipped">Skipped</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Initialize Summary Table</label>
            <select
              value={String(formData.initialize_doctypes_table_status ?? '')}
              onChange={e => handleChange('initialize_doctypes_table_status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Skipped">Skipped</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Delete Transactions</label>
            <select
              value={String(formData.delete_transactions_status ?? '')}
              onChange={e => handleChange('delete_transactions_status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Skipped">Skipped</option>
            </select>
          </div>
        </div>
      </div>
      {/* Section: section_break_tbej */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {formData.docstatus > 0 && (!formData.doctypes_to_delete || formData.doctypes_to_delete.length === 0) && (
          {/* Child table: doctypes → Transaction Deletion Record Details */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Summary</label>
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
                  {(Array.isArray(formData.doctypes) ? (formData.doctypes as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.doctypes) ? formData.doctypes : [])];
                            rows.splice(idx, 1);
                            handleChange('doctypes', rows);
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
                  onClick={() => handleChange('doctypes', [...(Array.isArray(formData.doctypes) ? formData.doctypes : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          )}
          {/* Child table: doctypes_to_delete → Transaction Deletion Record To Delete */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">DocTypes To Delete</label>
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
                  {(Array.isArray(formData.doctypes_to_delete) ? (formData.doctypes_to_delete as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.doctypes_to_delete) ? formData.doctypes_to_delete : [])];
                            rows.splice(idx, 1);
                            handleChange('doctypes_to_delete', rows);
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
                  onClick={() => handleChange('doctypes_to_delete', [...(Array.isArray(formData.doctypes_to_delete) ? formData.doctypes_to_delete : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          {/* Child table: doctypes_to_be_ignored → Transaction Deletion Record Item */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Excluded DocTypes</label>
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
                  {(Array.isArray(formData.doctypes_to_be_ignored) ? (formData.doctypes_to_be_ignored as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.doctypes_to_be_ignored) ? formData.doctypes_to_be_ignored : [])];
                            rows.splice(idx, 1);
                            handleChange('doctypes_to_be_ignored', rows);
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
                  onClick={() => handleChange('doctypes_to_be_ignored', [...(Array.isArray(formData.doctypes_to_be_ignored) ? formData.doctypes_to_be_ignored : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Transaction Deletion Record)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Transaction Deletion Record..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Transaction Deletion Record
                  // fetch(`/api/resource/Transaction Deletion Record?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Transaction Deletion Record"
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.process_in_single_transaction}
              onChange={e => handleChange('process_in_single_transaction', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Process in Single Transaction</label>
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