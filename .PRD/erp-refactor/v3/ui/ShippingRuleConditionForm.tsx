// Form scaffold for Shipping Rule Condition
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ShippingRuleCondition } from '../types/shipping-rule-condition.js';

interface ShippingRuleConditionFormProps {
  initialData?: Partial<ShippingRuleCondition>;
  onSubmit: (data: Partial<ShippingRuleCondition>) => void;
  mode: 'create' | 'edit';
}

export function ShippingRuleConditionForm({ initialData = {}, onSubmit, mode }: ShippingRuleConditionFormProps) {
  const [formData, setFormData] = useState<Partial<ShippingRuleCondition>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Shipping Rule Condition' : 'New Shipping Rule Condition'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">From Value</label>
            <input
              type="number"
              step="any"
              value={formData.from_value != null ? Number(formData.from_value) : ''}
              onChange={e => handleChange('from_value', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Value</label>
            <input
              type="number"
              step="any"
              value={formData.to_value != null ? Number(formData.to_value) : ''}
              onChange={e => handleChange('to_value', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Shipping Amount</label>
            <input
              type="number"
              step="any"
              value={formData.shipping_amount != null ? Number(formData.shipping_amount) : ''}
              onChange={e => handleChange('shipping_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
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