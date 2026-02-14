// Form scaffold for Coupon Code
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { CouponCode } from '../types/coupon-code.js';

interface CouponCodeFormProps {
  initialData?: Partial<CouponCode>;
  onSubmit: (data: Partial<CouponCode>) => void;
  mode: 'create' | 'edit';
}

export function CouponCodeForm({ initialData = {}, onSubmit, mode }: CouponCodeFormProps) {
  const [formData, setFormData] = useState<Partial<CouponCode>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">
        {mode === 'edit' ? formData.coupon_name ?? 'Coupon Code' : 'New Coupon Code'}
      </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Coupon Name</label>
            <input
              type="text"
              value={String(formData.coupon_name ?? '')}
              onChange={e => handleChange('coupon_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Coupon Type</label>
            <select
              value={String(formData.coupon_type ?? '')}
              onChange={e => handleChange('coupon_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Promotional">Promotional</option>
              <option value="Gift Card">Gift Card</option>
            </select>
          </div>
          {formData.coupon_type === "Gift Card" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer (→ Customer)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Customer..."
                value={String(formData.customer ?? '')}
                onChange={e => {
                  handleChange('customer', e.target.value);
                  // TODO: Implement async search for Customer
                  // fetch(`/api/resource/Customer?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Customer"
                data-fieldname="customer"
              />
              {/* Link indicator */}
              {formData.customer && (
                <button
                  type="button"
                  onClick={() => handleChange('customer', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
            <input
              type="text"
              value={String(formData.coupon_code ?? '')}
              onChange={e => handleChange('coupon_code', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.from_external_ecomm_platform}
              onChange={e => handleChange('from_external_ecomm_platform', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">From External Ecomm Platform</label>
          </div>
          {!formData.from_external_ecomm_platform && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Pricing Rule (→ Pricing Rule)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Pricing Rule..."
                value={String(formData.pricing_rule ?? '')}
                onChange={e => {
                  handleChange('pricing_rule', e.target.value);
                  // TODO: Implement async search for Pricing Rule
                  // fetch(`/api/resource/Pricing Rule?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Pricing Rule"
                data-fieldname="pricing_rule"
              />
              {/* Link indicator */}
              {formData.pricing_rule && (
                <button
                  type="button"
                  onClick={() => handleChange('pricing_rule', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
      {/* Section: Validity and Usage */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Validity and Usage</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Valid From</label>
            <input
              type="date"
              value={String(formData.valid_from ?? '')}
              onChange={e => handleChange('valid_from', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Valid Up To</label>
            <input
              type="date"
              value={String(formData.valid_upto ?? '')}
              onChange={e => handleChange('valid_upto', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {formData.coupon_type === "Promotional" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Use</label>
            <input
              type="number"
              step="1"
              value={formData.maximum_use != null ? Number(formData.maximum_use) : ''}
              onChange={e => handleChange('maximum_use', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Used</label>
            <input
              type="number"
              step="1"
              value={formData.used != null ? Number(formData.used) : ''}
              onChange={e => handleChange('used', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Coupon Description</label>
            <textarea
              value={String(formData.description ?? '')}
              onChange={e => handleChange('description', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Coupon Code)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Coupon Code..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Coupon Code
                  // fetch(`/api/resource/Coupon Code?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Coupon Code"
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