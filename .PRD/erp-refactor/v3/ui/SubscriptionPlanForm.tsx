// Form scaffold for Subscription Plan
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SubscriptionPlan } from '../types/subscription-plan.js';

interface SubscriptionPlanFormProps {
  initialData?: Partial<SubscriptionPlan>;
  onSubmit: (data: Partial<SubscriptionPlan>) => void;
  mode: 'create' | 'edit';
}

export function SubscriptionPlanForm({ initialData = {}, onSubmit, mode }: SubscriptionPlanFormProps) {
  const [formData, setFormData] = useState<Partial<SubscriptionPlan>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Subscription Plan' : 'New Subscription Plan'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Plan Name</label>
            <input
              type="text"
              value={String(formData.plan_name ?? '')}
              onChange={e => handleChange('plan_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency (→ Currency)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Currency..."
                value={String(formData.currency ?? '')}
                onChange={e => {
                  handleChange('currency', e.target.value);
                  // TODO: Implement async search for Currency
                  // fetch(`/api/resource/Currency?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Currency"
                data-fieldname="currency"
              />
              {/* Link indicator */}
              {formData.currency && (
                <button
                  type="button"
                  onClick={() => handleChange('currency', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Item (→ Item)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Item..."
                value={String(formData.item ?? '')}
                onChange={e => {
                  handleChange('item', e.target.value);
                  // TODO: Implement async search for Item
                  // fetch(`/api/resource/Item?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Item"
                data-fieldname="item"
              />
              {/* Link indicator */}
              {formData.item && (
                <button
                  type="button"
                  onClick={() => handleChange('item', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
      {/* Section: section_break_5 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Subscription Price Based On</label>
            <select
              value={String(formData.price_determination ?? '')}
              onChange={e => handleChange('price_determination', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Fixed Rate">Fixed Rate</option>
              <option value="Based On Price List">Based On Price List</option>
              <option value="Monthly Rate">Monthly Rate</option>
            </select>
          </div>
          {['Fixed Rate', 'Monthly Rate'].includes(formData.price_determination) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Cost</label>
            <input
              type="number"
              step="any"
              value={formData.cost != null ? Number(formData.cost) : ''}
              onChange={e => handleChange('cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.price_determination==="Based On Price List" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Price List (→ Price List)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Price List..."
                value={String(formData.price_list ?? '')}
                onChange={e => {
                  handleChange('price_list', e.target.value);
                  // TODO: Implement async search for Price List
                  // fetch(`/api/resource/Price List?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Price List"
                data-fieldname="price_list"
              />
              {/* Link indicator */}
              {formData.price_list && (
                <button
                  type="button"
                  onClick={() => handleChange('price_list', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
        </div>
      </div>
      {/* Section: section_break_11 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Billing Interval</label>
            <select
              value={String(formData.billing_interval ?? '')}
              onChange={e => handleChange('billing_interval', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Day">Day</option>
              <option value="Week">Week</option>
              <option value="Month">Month</option>
              <option value="Year">Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Billing Interval Count</label>
            <input
              type="number"
              step="1"
              value={formData.billing_interval_count != null ? Number(formData.billing_interval_count) : ''}
              onChange={e => handleChange('billing_interval_count', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
        </div>
      </div>
      {/* Section: Payment Plan */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Payment Plan</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Price ID</label>
            <input
              type="text"
              value={String(formData.product_price_id ?? '')}
              onChange={e => handleChange('product_price_id', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Gateway (→ Payment Gateway Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Payment Gateway Account..."
                value={String(formData.payment_gateway ?? '')}
                onChange={e => {
                  handleChange('payment_gateway', e.target.value);
                  // TODO: Implement async search for Payment Gateway Account
                  // fetch(`/api/resource/Payment Gateway Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Payment Gateway Account"
                data-fieldname="payment_gateway"
              />
              {/* Link indicator */}
              {formData.payment_gateway && (
                <button
                  type="button"
                  onClick={() => handleChange('payment_gateway', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Section: Accounting Dimensions */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Accounting Dimensions</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cost Center (→ Cost Center)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Cost Center..."
                value={String(formData.cost_center ?? '')}
                onChange={e => {
                  handleChange('cost_center', e.target.value);
                  // TODO: Implement async search for Cost Center
                  // fetch(`/api/resource/Cost Center?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Cost Center"
                data-fieldname="cost_center"
              />
              {/* Link indicator */}
              {formData.cost_center && (
                <button
                  type="button"
                  onClick={() => handleChange('cost_center', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
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