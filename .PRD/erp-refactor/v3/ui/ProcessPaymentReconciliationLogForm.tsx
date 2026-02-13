// Form scaffold for Process Payment Reconciliation Log
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ProcessPaymentReconciliationLog } from '../types/process-payment-reconciliation-log.js';

interface ProcessPaymentReconciliationLogFormProps {
  initialData?: Partial<ProcessPaymentReconciliationLog>;
  onSubmit: (data: Partial<ProcessPaymentReconciliationLog>) => void;
  mode: 'create' | 'edit';
}

export function ProcessPaymentReconciliationLogForm({ initialData = {}, onSubmit, mode }: ProcessPaymentReconciliationLogFormProps) {
  const [formData, setFormData] = useState<Partial<ProcessPaymentReconciliationLog>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Process Payment Reconciliation Log' : 'New Process Payment Reconciliation Log'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Parent Document (→ Process Payment Reconciliation)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Process Payment Reconciliation..."
                value={String(formData.process_pr ?? '')}
                onChange={e => {
                  handleChange('process_pr', e.target.value);
                  // TODO: Implement async search for Process Payment Reconciliation
                  // fetch(`/api/resource/Process Payment Reconciliation?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Process Payment Reconciliation"
                data-fieldname="process_pr"
              />
              {/* Link indicator */}
              {formData.process_pr && (
                <button
                  type="button"
                  onClick={() => handleChange('process_pr', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
      {/* Section: Status */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Status</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Running">Running</option>
              <option value="Paused">Paused</option>
              <option value="Reconciled">Reconciled</option>
              <option value="Partially Reconciled">Partially Reconciled</option>
              <option value="Failed">Failed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      {/* Section: Tasks */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Tasks</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allocated}
              onChange={e => handleChange('allocated', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allocated</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.reconciled}
              onChange={e => handleChange('reconciled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Reconciled</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Allocations</label>
            <input
              type="number"
              step="1"
              value={formData.total_allocations != null ? Number(formData.total_allocations) : ''}
              onChange={e => handleChange('total_allocations', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reconciled Entries</label>
            <input
              type="number"
              step="1"
              value={formData.reconciled_entries != null ? Number(formData.reconciled_entries) : ''}
              onChange={e => handleChange('reconciled_entries', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: section_break_4ywv */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {!!formData.error_log && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Reconciliation Error Log</label>
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
      {/* Section: Allocations */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Allocations</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: allocations → Process Payment Reconciliation Log Allocations */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Allocations</label>
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
                  {(Array.isArray(formData.allocations) ? (formData.allocations as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.allocations) ? formData.allocations : [])];
                            rows.splice(idx, 1);
                            handleChange('allocations', rows);
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
                  onClick={() => handleChange('allocations', [...(Array.isArray(formData.allocations) ? formData.allocations : []), {}])}
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