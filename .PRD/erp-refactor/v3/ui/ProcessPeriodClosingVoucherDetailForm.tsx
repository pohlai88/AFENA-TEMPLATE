// Form scaffold for Process Period Closing Voucher Detail
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ProcessPeriodClosingVoucherDetail } from '../types/process-period-closing-voucher-detail.js';

interface ProcessPeriodClosingVoucherDetailFormProps {
  initialData?: Partial<ProcessPeriodClosingVoucherDetail>;
  onSubmit: (data: Partial<ProcessPeriodClosingVoucherDetail>) => void;
  mode: 'create' | 'edit';
}

export function ProcessPeriodClosingVoucherDetailForm({ initialData = {}, onSubmit, mode }: ProcessPeriodClosingVoucherDetailFormProps) {
  const [formData, setFormData] = useState<Partial<ProcessPeriodClosingVoucherDetail>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Process Period Closing Voucher Detail' : 'New Process Period Closing Voucher Detail'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Processing Date</label>
            <input
              type="date"
              value={String(formData.processing_date ?? '')}
              onChange={e => handleChange('processing_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Report Type</label>
            <select
              value={String(formData.report_type ?? '')}
              onChange={e => handleChange('report_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Profit and Loss">Profit and Loss</option>
              <option value="Balance Sheet">Balance Sheet</option>
            </select>
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
            <label className="block text-sm font-medium text-gray-700">Closing Balance</label>
            <textarea
              value={String(formData.closing_balance ?? '')}
              onChange={e => handleChange('closing_balance', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}