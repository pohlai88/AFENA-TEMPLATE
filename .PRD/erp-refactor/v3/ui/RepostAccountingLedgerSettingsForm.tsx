// Form scaffold for Repost Accounting Ledger Settings
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { RepostAccountingLedgerSettings } from '../types/repost-accounting-ledger-settings.js';

interface RepostAccountingLedgerSettingsFormProps {
  initialData?: Partial<RepostAccountingLedgerSettings>;
  onSubmit: (data: Partial<RepostAccountingLedgerSettings>) => void;
  mode: 'create' | 'edit';
}

export function RepostAccountingLedgerSettingsForm({ initialData = {}, onSubmit, mode }: RepostAccountingLedgerSettingsFormProps) {
  const [formData, setFormData] = useState<Partial<RepostAccountingLedgerSettings>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Repost Accounting Ledger Settings' : 'New Repost Accounting Ledger Settings'}</h2>
          {/* Child table: allowed_types → Repost Allowed Types */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Allowed Doctypes</label>
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
                  {(Array.isArray(formData.allowed_types) ? (formData.allowed_types as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.allowed_types) ? formData.allowed_types : [])];
                            rows.splice(idx, 1);
                            handleChange('allowed_types', rows);
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
                  onClick={() => handleChange('allowed_types', [...(Array.isArray(formData.allowed_types) ? formData.allowed_types : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
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