// Form scaffold for Process Period Closing Voucher
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ProcessPeriodClosingVoucher } from '../types/process-period-closing-voucher.js';

interface ProcessPeriodClosingVoucherFormProps {
  initialData?: Partial<ProcessPeriodClosingVoucher>;
  onSubmit: (data: Partial<ProcessPeriodClosingVoucher>) => void;
  mode: 'create' | 'edit';
}

export function ProcessPeriodClosingVoucherForm({ initialData = {}, onSubmit, mode }: ProcessPeriodClosingVoucherFormProps) {
  const [formData, setFormData] = useState<Partial<ProcessPeriodClosingVoucher>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Process Period Closing Voucher' : 'New Process Period Closing Voucher'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">PCV (→ Period Closing Voucher)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Period Closing Voucher..."
                value={String(formData.parent_pcv ?? '')}
                onChange={e => {
                  handleChange('parent_pcv', e.target.value);
                  // TODO: Implement async search for Period Closing Voucher
                  // fetch(`/api/resource/Period Closing Voucher?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Period Closing Voucher"
                data-fieldname="parent_pcv"
              />
              {/* Link indicator */}
              {formData.parent_pcv && (
                <button
                  type="button"
                  onClick={() => handleChange('parent_pcv', '')}
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
              <option value="Queued">Queued</option>
              <option value="Running">Running</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">P&L Closing Balance</label>
            <textarea
              value={String(formData.p_l_closing_balance ?? '')}
              onChange={e => handleChange('p_l_closing_balance', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {/* Child table: normal_balances → Process Period Closing Voucher Detail */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Dates to Process</label>
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
                  {(Array.isArray(formData.normal_balances) ? (formData.normal_balances as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.normal_balances) ? formData.normal_balances : [])];
                            rows.splice(idx, 1);
                            handleChange('normal_balances', rows);
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
                  onClick={() => handleChange('normal_balances', [...(Array.isArray(formData.normal_balances) ? formData.normal_balances : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Balance Sheet Closing Balance</label>
            <textarea
              value={String(formData.bs_closing_balance ?? '')}
              onChange={e => handleChange('bs_closing_balance', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {/* Child table: z_opening_balances → Process Period Closing Voucher Detail */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Opening Balances</label>
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
                  {(Array.isArray(formData.z_opening_balances) ? (formData.z_opening_balances as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.z_opening_balances) ? formData.z_opening_balances : [])];
                            rows.splice(idx, 1);
                            handleChange('z_opening_balances', rows);
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
                  onClick={() => handleChange('z_opening_balances', [...(Array.isArray(formData.z_opening_balances) ? formData.z_opening_balances : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Process Period Closing Voucher)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Process Period Closing Voucher..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Process Period Closing Voucher
                  // fetch(`/api/resource/Process Period Closing Voucher?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Process Period Closing Voucher"
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

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}