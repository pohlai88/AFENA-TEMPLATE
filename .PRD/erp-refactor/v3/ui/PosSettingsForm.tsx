// Form scaffold for POS Settings
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PosSettings } from '../types/pos-settings.js';

interface PosSettingsFormProps {
  initialData?: Partial<PosSettings>;
  onSubmit: (data: Partial<PosSettings>) => void;
  mode: 'create' | 'edit';
}

export function PosSettingsForm({ initialData = {}, onSubmit, mode }: PosSettingsFormProps) {
  const [formData, setFormData] = useState<Partial<PosSettings>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'POS Settings' : 'New POS Settings'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Invoice Type Created via POS Screen</label>
            <select
              value={String(formData.invoice_type ?? '')}
              onChange={e => handleChange('invoice_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Sales Invoice">Sales Invoice</option>
              <option value="POS Invoice">POS Invoice</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.post_change_gl_entries}
              onChange={e => handleChange('post_change_gl_entries', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Create Ledger Entries for Change Amount</label>
          </div>
      {/* Section: section_break_gyos */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: invoice_fields → POS Field */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">POS Additional Fields</label>
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
                  {(Array.isArray(formData.invoice_fields) ? (formData.invoice_fields as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.invoice_fields) ? formData.invoice_fields : [])];
                            rows.splice(idx, 1);
                            handleChange('invoice_fields', rows);
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
                  onClick={() => handleChange('invoice_fields', [...(Array.isArray(formData.invoice_fields) ? formData.invoice_fields : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          {/* Child table: pos_search_fields → POS Search Fields */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">POS Search Fields</label>
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
                  {(Array.isArray(formData.pos_search_fields) ? (formData.pos_search_fields as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.pos_search_fields) ? formData.pos_search_fields : [])];
                            rows.splice(idx, 1);
                            handleChange('pos_search_fields', rows);
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
                  onClick={() => handleChange('pos_search_fields', [...(Array.isArray(formData.pos_search_fields) ? formData.pos_search_fields : []), {}])}
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