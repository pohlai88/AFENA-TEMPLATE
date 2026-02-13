// Form scaffold for Subscription Plan Detail
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SubscriptionPlanDetail } from '../types/subscription-plan-detail.js';

interface SubscriptionPlanDetailFormProps {
  initialData?: Partial<SubscriptionPlanDetail>;
  onSubmit: (data: Partial<SubscriptionPlanDetail>) => void;
  mode: 'create' | 'edit';
}

export function SubscriptionPlanDetailForm({ initialData = {}, onSubmit, mode }: SubscriptionPlanDetailFormProps) {
  const [formData, setFormData] = useState<Partial<SubscriptionPlanDetail>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Subscription Plan Detail' : 'New Subscription Plan Detail'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Plan (→ Subscription Plan)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Subscription Plan..."
                value={String(formData.plan ?? '')}
                onChange={e => {
                  handleChange('plan', e.target.value);
                  // TODO: Implement async search for Subscription Plan
                  // fetch(`/api/resource/Subscription Plan?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Subscription Plan"
                data-fieldname="plan"
              />
              {/* Link indicator */}
              {formData.plan && (
                <button
                  type="button"
                  onClick={() => handleChange('plan', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              step="1"
              value={formData.qty != null ? Number(formData.qty) : ''}
              onChange={e => handleChange('qty', e.target.value ? parseInt(e.target.value) : undefined)}
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