// Form scaffold for Promotional Scheme Price Discount
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PromotionalSchemePriceDiscount } from '../types/promotional-scheme-price-discount.js';

interface PromotionalSchemePriceDiscountFormProps {
  initialData?: Partial<PromotionalSchemePriceDiscount>;
  onSubmit: (data: Partial<PromotionalSchemePriceDiscount>) => void;
  mode: 'create' | 'edit';
}

export function PromotionalSchemePriceDiscountForm({ initialData = {}, onSubmit, mode }: PromotionalSchemePriceDiscountFormProps) {
  const [formData, setFormData] = useState<Partial<PromotionalSchemePriceDiscount>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Promotional Scheme Price Discount' : 'New Promotional Scheme Price Discount'}</h2>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.disable}
              onChange={e => handleChange('disable', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Disable</label>
          </div>
          {!!formData.priority && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.apply_multiple_pricing_rules}
              onChange={e => handleChange('apply_multiple_pricing_rules', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Apply Multiple Pricing Rules</label>
          </div>
          )}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Rule Description</label>
            <textarea
              value={String(formData.rule_description ?? '')}
              onChange={e => handleChange('rule_description', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
      {/* Section: section_break_2 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Min Qty</label>
            <input
              type="number"
              step="any"
              value={formData.min_qty != null ? Number(formData.min_qty) : ''}
              onChange={e => handleChange('min_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Qty</label>
            <input
              type="number"
              step="any"
              value={formData.max_qty != null ? Number(formData.max_qty) : ''}
              onChange={e => handleChange('max_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Min Amount</label>
            <input
              type="number"
              step="any"
              value={formData.min_amount != null ? Number(formData.min_amount) : ''}
              onChange={e => handleChange('min_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Amount</label>
            <input
              type="number"
              step="any"
              value={formData.max_amount != null ? Number(formData.max_amount) : ''}
              onChange={e => handleChange('max_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: section_break_6 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount Type</label>
            <select
              value={String(formData.rate_or_discount ?? '')}
              onChange={e => handleChange('rate_or_discount', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Rate">Rate</option>
              <option value="Discount Percentage">Discount Percentage</option>
              <option value="Discount Amount">Discount Amount</option>
            </select>
          </div>
          {formData.rate_or_discount==="Rate" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Rate</label>
            <input
              type="number"
              step="any"
              value={formData.rate != null ? Number(formData.rate) : ''}
              onChange={e => handleChange('rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.rate_or_discount==="Discount Amount" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount Amount</label>
            <input
              type="number"
              step="any"
              value={formData.discount_amount != null ? Number(formData.discount_amount) : ''}
              onChange={e => handleChange('discount_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.rate_or_discount==="Discount Percentage" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount Percentage</label>
            <input
              type="number"
              step="any"
              value={formData.discount_percentage != null ? Number(formData.discount_percentage) : ''}
              onChange={e => handleChange('discount_percentage', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.rate_or_discount!=="Rate" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">For Price List (→ Price List)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Price List..."
                value={String(formData.for_price_list ?? '')}
                onChange={e => {
                  handleChange('for_price_list', e.target.value);
                  // TODO: Implement async search for Price List
                  // fetch(`/api/resource/Price List?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Price List"
                data-fieldname="for_price_list"
              />
              {/* Link indicator */}
              {formData.for_price_list && (
                <button
                  type="button"
                  onClick={() => handleChange('for_price_list', '')}
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
            <label className="block text-sm font-medium text-gray-700">Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.warehouse ?? '')}
                onChange={e => {
                  handleChange('warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="warehouse"
              />
              {/* Link indicator */}
              {formData.warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('warehouse', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Threshold for Suggestion</label>
            <input
              type="number"
              step="any"
              value={formData.threshold_percentage != null ? Number(formData.threshold_percentage) : ''}
              onChange={e => handleChange('threshold_percentage', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.validate_applied_rule}
              onChange={e => handleChange('validate_applied_rule', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Validate Applied Rule</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={String(formData.priority ?? '')}
              onChange={e => handleChange('priority', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
            </select>
          </div>
          {in_list(['Discount Percentage', 'Discount Amount'], formData.rate_or_discount) && formData.apply_multiple_pricing_rules && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.apply_discount_on_rate}
              onChange={e => handleChange('apply_discount_on_rate', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Apply Discount on Rate</label>
          </div>
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