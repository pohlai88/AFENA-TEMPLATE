// Form scaffold for Ledger Health Monitor
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { LedgerHealthMonitor } from '../types/ledger-health-monitor.js';

interface LedgerHealthMonitorFormProps {
  initialData?: Partial<LedgerHealthMonitor>;
  onSubmit: (data: Partial<LedgerHealthMonitor>) => void;
  mode: 'create' | 'edit';
}

export function LedgerHealthMonitorForm({ initialData = {}, onSubmit, mode }: LedgerHealthMonitorFormProps) {
  const [formData, setFormData] = useState<Partial<LedgerHealthMonitor>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Ledger Health Monitor' : 'New Ledger Health Monitor'}</h2>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enable_health_monitor}
              onChange={e => handleChange('enable_health_monitor', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enable Health Monitor</label>
          </div>
      {/* Section: Configuration */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Configuration</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Monitor for Last 'X' days</label>
            <input
              type="number"
              step="1"
              value={formData.monitor_for_last_x_days != null ? Number(formData.monitor_for_last_x_days) : ''}
              onChange={e => handleChange('monitor_for_last_x_days', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.debit_credit_mismatch}
              onChange={e => handleChange('debit_credit_mismatch', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Debit-Credit Mismatch</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.general_and_payment_ledger_mismatch}
              onChange={e => handleChange('general_and_payment_ledger_mismatch', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Discrepancy between General and Payment Ledger</label>
          </div>
        </div>
      </div>
      {/* Section: Companies */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Companies</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: companies → Ledger Health Monitor Company */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">companies</label>
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
                  {(Array.isArray(formData.companies) ? (formData.companies as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.companies) ? formData.companies : [])];
                            rows.splice(idx, 1);
                            handleChange('companies', rows);
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
                  onClick={() => handleChange('companies', [...(Array.isArray(formData.companies) ? formData.companies : []), {}])}
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