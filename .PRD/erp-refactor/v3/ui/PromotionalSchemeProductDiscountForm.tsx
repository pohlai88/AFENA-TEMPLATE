// Form scaffold for Promotional Scheme Product Discount
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PromotionalSchemeProductDiscount } from '../types/promotional-scheme-product-discount.js';

interface PromotionalSchemeProductDiscountFormProps {
  initialData?: Partial<PromotionalSchemeProductDiscount>;
  onSubmit: (data: Partial<PromotionalSchemeProductDiscount>) => void;
  mode: 'create' | 'edit';
}

export function PromotionalSchemeProductDiscountForm({ initialData = {}, onSubmit, mode }: PromotionalSchemeProductDiscountFormProps) {
  const [formData, setFormData] = useState<Partial<PromotionalSchemeProductDiscount>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Promotional Scheme Product Discount' : 'New Promotional Scheme Product Discount'}</h2>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.disable}
              onChange={e => handleChange('disable', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Disable</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.apply_multiple_pricing_rules}
              onChange={e => handleChange('apply_multiple_pricing_rules', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Apply Multiple Pricing Rules</label>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Rule Description</label>
            <textarea
              value={String(formData.rule_description ?? '')}
              onChange={e => handleChange('rule_description', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
      {/* Section: section_break_1 */}
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
      {/* Section: Free Item */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Free Item</h4>
        <div className="grid grid-cols-2 gap-4">
          {!parent.mixed_conditions && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.same_item}
              onChange={e => handleChange('same_item', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Same Item</label>
          </div>
          )}
          {!formData.same_item || parent.mixed_conditions && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Code (→ Item)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Item..."
                value={String(formData.free_item ?? '')}
                onChange={e => {
                  handleChange('free_item', e.target.value);
                  // TODO: Implement async search for Item
                  // fetch(`/api/resource/Item?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Item"
                data-fieldname="free_item"
              />
              {/* Link indicator */}
              {formData.free_item && (
                <button
                  type="button"
                  onClick={() => handleChange('free_item', '')}
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
            <label className="block text-sm font-medium text-gray-700">Qty</label>
            <input
              type="number"
              step="any"
              value={formData.free_qty != null ? Number(formData.free_qty) : ''}
              onChange={e => handleChange('free_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">UOM (→ UOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UOM..."
                value={String(formData.free_item_uom ?? '')}
                onChange={e => {
                  handleChange('free_item_uom', e.target.value);
                  // TODO: Implement async search for UOM
                  // fetch(`/api/resource/UOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="UOM"
                data-fieldname="free_item_uom"
              />
              {/* Link indicator */}
              {formData.free_item_uom && (
                <button
                  type="button"
                  onClick={() => handleChange('free_item_uom', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rate</label>
            <input
              type="number"
              step="any"
              value={formData.free_item_rate != null ? Number(formData.free_item_rate) : ''}
              onChange={e => handleChange('free_item_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.round_free_qty}
              onChange={e => handleChange('round_free_qty', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Round Free Qty</label>
          </div>
        </div>
      </div>
      {/* Section: section_break_12 */}
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_recursive}
              onChange={e => handleChange('is_recursive', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Recursive</label>
          </div>
          {!!formData.is_recursive && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Recurse Every (As Per Transaction UOM)</label>
            <input
              type="number"
              step="any"
              value={formData.recurse_for != null ? Number(formData.recurse_for) : ''}
              onChange={e => handleChange('recurse_for', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.is_recursive && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Apply Recursion Over (As Per Transaction UOM)</label>
            <input
              type="number"
              step="any"
              value={formData.apply_recursion_over != null ? Number(formData.apply_recursion_over) : ''}
              onChange={e => handleChange('apply_recursion_over', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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