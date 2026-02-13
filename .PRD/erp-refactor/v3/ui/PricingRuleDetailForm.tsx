// Form scaffold for Pricing Rule Detail
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PricingRuleDetail } from '../types/pricing-rule-detail.js';

interface PricingRuleDetailFormProps {
  initialData?: Partial<PricingRuleDetail>;
  onSubmit: (data: Partial<PricingRuleDetail>) => void;
  mode: 'create' | 'edit';
}

export function PricingRuleDetailForm({ initialData = {}, onSubmit, mode }: PricingRuleDetailFormProps) {
  const [formData, setFormData] = useState<Partial<PricingRuleDetail>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Pricing Rule Detail' : 'New Pricing Rule Detail'}</h2>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Code</label>
            <input
              type="text"
              value={String(formData.item_code ?? '')}
              onChange={e => handleChange('item_code', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Margin Type</label>
            <input
              type="text"
              value={String(formData.margin_type ?? '')}
              onChange={e => handleChange('margin_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rate or Discount</label>
            <input
              type="text"
              value={String(formData.rate_or_discount ?? '')}
              onChange={e => handleChange('rate_or_discount', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Child Docname</label>
            <input
              type="text"
              value={String(formData.child_docname ?? '')}
              onChange={e => handleChange('child_docname', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.rule_applied}
              onChange={e => handleChange('rule_applied', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Rule Applied</label>
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}