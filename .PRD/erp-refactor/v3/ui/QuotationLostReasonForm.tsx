// Form scaffold for Quotation Lost Reason
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { QuotationLostReason } from '../types/quotation-lost-reason.js';

interface QuotationLostReasonFormProps {
  initialData?: Partial<QuotationLostReason>;
  onSubmit: (data: Partial<QuotationLostReason>) => void;
  mode: 'create' | 'edit';
}

export function QuotationLostReasonForm({ initialData = {}, onSubmit, mode }: QuotationLostReasonFormProps) {
  const [formData, setFormData] = useState<Partial<QuotationLostReason>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Quotation Lost Reason' : 'New Quotation Lost Reason'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quotation Lost Reason</label>
            <input
              type="text"
              value={String(formData.order_lost_reason ?? '')}
              onChange={e => handleChange('order_lost_reason', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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