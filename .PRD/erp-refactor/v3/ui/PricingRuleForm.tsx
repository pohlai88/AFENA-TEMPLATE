// Form scaffold for Pricing Rule
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PricingRule } from '../types/pricing-rule.js';

interface PricingRuleFormProps {
  initialData?: Partial<PricingRule>;
  onSubmit: (data: Partial<PricingRule>) => void;
  mode: 'create' | 'edit';
}

export function PricingRuleForm({ initialData = {}, onSubmit, mode }: PricingRuleFormProps) {
  const [formData, setFormData] = useState<Partial<PricingRule>>(initialData);

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
        {mode === 'edit' ? formData.title ?? 'Pricing Rule' : 'New Pricing Rule'}
      </h2>
      {/* Section: applicability_section */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Naming Series</label>
            <select
              value={String(formData.naming_series ?? '')}
              onChange={e => handleChange('naming_series', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>

            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={String(formData.title ?? '')}
              onChange={e => handleChange('title', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.disable}
              onChange={e => handleChange('disable', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Disable</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Apply On</label>
            <select
              value={String(formData.apply_on ?? '')}
              onChange={e => handleChange('apply_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Item Code">Item Code</option>
              <option value="Item Group">Item Group</option>
              <option value="Brand">Brand</option>
              <option value="Transaction">Transaction</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price or Product Discount</label>
            <select
              value={String(formData.price_or_product_discount ?? '')}
              onChange={e => handleChange('price_or_product_discount', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Price">Price</option>
              <option value="Product">Product</option>
            </select>
          </div>
          {formData.apply_on !== 'Transaction' && (
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
          )}
          {formData.apply_on === 'Item Code' && (
          {/* Child table: items → Pricing Rule Item Code */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Apply Rule On Item Code</label>
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
                  {(Array.isArray(formData.items) ? (formData.items as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.items) ? formData.items : [])];
                            rows.splice(idx, 1);
                            handleChange('items', rows);
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
                  onClick={() => handleChange('items', [...(Array.isArray(formData.items) ? formData.items : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          )}
          {formData.apply_on === 'Item Group' && (
          {/* Child table: item_groups → Pricing Rule Item Group */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Apply Rule On Item Group</label>
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
                  {(Array.isArray(formData.item_groups) ? (formData.item_groups as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.item_groups) ? formData.item_groups : [])];
                            rows.splice(idx, 1);
                            handleChange('item_groups', rows);
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
                  onClick={() => handleChange('item_groups', [...(Array.isArray(formData.item_groups) ? formData.item_groups : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          )}
          {formData.apply_on === 'Brand' && (
          {/* Child table: brands → Pricing Rule Brand */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Apply Rule On Brand</label>
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
                  {(Array.isArray(formData.brands) ? (formData.brands as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.brands) ? formData.brands : [])];
                            rows.splice(idx, 1);
                            handleChange('brands', rows);
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
                  onClick={() => handleChange('brands', [...(Array.isArray(formData.brands) ? formData.brands : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          )}
          {formData.apply_on !== 'Transaction' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.mixed_conditions}
              onChange={e => handleChange('mixed_conditions', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Mixed Conditions</label>
          </div>
          )}
          {formData.apply_on !== 'Transaction' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_cumulative}
              onChange={e => handleChange('is_cumulative', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Cumulative</label>
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.coupon_code_based}
              onChange={e => handleChange('coupon_code_based', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Coupon Code Based</label>
          </div>
        </div>
      </div>
      {/* Section: Discount on Other Item */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Discount on Other Item</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Apply Rule On Other</label>
            <select
              value={String(formData.apply_rule_on_other ?? '')}
              onChange={e => handleChange('apply_rule_on_other', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Item Code">Item Code</option>
              <option value="Item Group">Item Group</option>
              <option value="Brand">Brand</option>
            </select>
          </div>
          {formData.apply_rule_on_other === 'Item Code' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Code (→ Item)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Item..."
                value={String(formData.other_item_code ?? '')}
                onChange={e => {
                  handleChange('other_item_code', e.target.value);
                  // TODO: Implement async search for Item
                  // fetch(`/api/resource/Item?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Item"
                data-fieldname="other_item_code"
              />
              {/* Link indicator */}
              {formData.other_item_code && (
                <button
                  type="button"
                  onClick={() => handleChange('other_item_code', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.apply_rule_on_other === 'Item Group' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Group (→ Item Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Item Group..."
                value={String(formData.other_item_group ?? '')}
                onChange={e => {
                  handleChange('other_item_group', e.target.value);
                  // TODO: Implement async search for Item Group
                  // fetch(`/api/resource/Item Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Item Group"
                data-fieldname="other_item_group"
              />
              {/* Link indicator */}
              {formData.other_item_group && (
                <button
                  type="button"
                  onClick={() => handleChange('other_item_group', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.apply_rule_on_other === 'Brand' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand (→ Brand)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Brand..."
                value={String(formData.other_brand ?? '')}
                onChange={e => {
                  handleChange('other_brand', e.target.value);
                  // TODO: Implement async search for Brand
                  // fetch(`/api/resource/Brand?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Brand"
                data-fieldname="other_brand"
              />
              {/* Link indicator */}
              {formData.other_brand && (
                <button
                  type="button"
                  onClick={() => handleChange('other_brand', '')}
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
      {/* Section: Party Information */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Party Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.selling}
              onChange={e => handleChange('selling', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Selling</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.buying}
              onChange={e => handleChange('buying', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Buying</label>
          </div>
          {formData.buying || formData.selling && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Applicable For</label>
            <select
              value={String(formData.applicable_for ?? '')}
              onChange={e => handleChange('applicable_for', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Customer">Customer</option>
              <option value="Customer Group">Customer Group</option>
              <option value="Territory">Territory</option>
              <option value="Sales Partner">Sales Partner</option>
              <option value="Campaign">Campaign</option>
              <option value="Supplier">Supplier</option>
              <option value="Supplier Group">Supplier Group</option>
            </select>
          </div>
          )}
          {formData.applicable_for==="Customer" && (
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
          {formData.applicable_for==="Customer Group" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Group (→ Customer Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Customer Group..."
                value={String(formData.customer_group ?? '')}
                onChange={e => {
                  handleChange('customer_group', e.target.value);
                  // TODO: Implement async search for Customer Group
                  // fetch(`/api/resource/Customer Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Customer Group"
                data-fieldname="customer_group"
              />
              {/* Link indicator */}
              {formData.customer_group && (
                <button
                  type="button"
                  onClick={() => handleChange('customer_group', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.applicable_for==="Territory" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Territory (→ Territory)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Territory..."
                value={String(formData.territory ?? '')}
                onChange={e => {
                  handleChange('territory', e.target.value);
                  // TODO: Implement async search for Territory
                  // fetch(`/api/resource/Territory?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Territory"
                data-fieldname="territory"
              />
              {/* Link indicator */}
              {formData.territory && (
                <button
                  type="button"
                  onClick={() => handleChange('territory', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.applicable_for==="Sales Partner" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Partner (→ Sales Partner)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Partner..."
                value={String(formData.sales_partner ?? '')}
                onChange={e => {
                  handleChange('sales_partner', e.target.value);
                  // TODO: Implement async search for Sales Partner
                  // fetch(`/api/resource/Sales Partner?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Partner"
                data-fieldname="sales_partner"
              />
              {/* Link indicator */}
              {formData.sales_partner && (
                <button
                  type="button"
                  onClick={() => handleChange('sales_partner', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.applicable_for==="Campaign" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Campaign (→ UTM Campaign)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UTM Campaign..."
                value={String(formData.campaign ?? '')}
                onChange={e => {
                  handleChange('campaign', e.target.value);
                  // TODO: Implement async search for UTM Campaign
                  // fetch(`/api/resource/UTM Campaign?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="UTM Campaign"
                data-fieldname="campaign"
              />
              {/* Link indicator */}
              {formData.campaign && (
                <button
                  type="button"
                  onClick={() => handleChange('campaign', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.applicable_for==="Supplier" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier (→ Supplier)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Supplier..."
                value={String(formData.supplier ?? '')}
                onChange={e => {
                  handleChange('supplier', e.target.value);
                  // TODO: Implement async search for Supplier
                  // fetch(`/api/resource/Supplier?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Supplier"
                data-fieldname="supplier"
              />
              {/* Link indicator */}
              {formData.supplier && (
                <button
                  type="button"
                  onClick={() => handleChange('supplier', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.applicable_for==="Supplier Group" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier Group (→ Supplier Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Supplier Group..."
                value={String(formData.supplier_group ?? '')}
                onChange={e => {
                  handleChange('supplier_group', e.target.value);
                  // TODO: Implement async search for Supplier Group
                  // fetch(`/api/resource/Supplier Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Supplier Group"
                data-fieldname="supplier_group"
              />
              {/* Link indicator */}
              {formData.supplier_group && (
                <button
                  type="button"
                  onClick={() => handleChange('supplier_group', '')}
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
      {/* Section: Quantity and Amount */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Quantity and Amount</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Min Qty (As Per Stock UOM)</label>
            <input
              type="number"
              step="any"
              value={formData.min_qty != null ? Number(formData.min_qty) : ''}
              onChange={e => handleChange('min_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Qty (As Per Stock UOM)</label>
            <input
              type="number"
              step="any"
              value={formData.max_qty != null ? Number(formData.max_qty) : ''}
              onChange={e => handleChange('max_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Min Amt</label>
            <input
              type="number"
              step="any"
              value={formData.min_amt != null ? Number(formData.min_amt) : ''}
              onChange={e => handleChange('min_amt', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Amt</label>
            <input
              type="number"
              step="any"
              value={formData.max_amt != null ? Number(formData.max_amt) : ''}
              onChange={e => handleChange('max_amt', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Product Discount Scheme */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Product Discount Scheme</h4>
        <div className="grid grid-cols-2 gap-4">
          {!formData.mixed_conditions && formData.apply_on !== 'Transaction' && (
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
          {(!formData.same_item || formData.apply_on === 'Transaction') || formData.mixed_conditions && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Free Item (→ Item)</label>
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
            <label className="block text-sm font-medium text-gray-700">Free Item Rate</label>
            <input
              type="number"
              step="any"
              value={formData.free_item_rate != null ? Number(formData.free_item_rate) : ''}
              onChange={e => handleChange('free_item_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.round_free_qty}
              onChange={e => handleChange('round_free_qty', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Round Free Qty</label>
          </div>
          {formData.price_or_product_discount === 'Product' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.dont_enforce_free_item_qty}
              onChange={e => handleChange('dont_enforce_free_item_qty', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Don't Enforce Free Item Qty</label>
          </div>
          )}
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
      {/* Section: Period Settings */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Period Settings</h4>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Company (→ Company)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Company..."
                value={String(formData.company ?? '')}
                onChange={e => {
                  handleChange('company', e.target.value);
                  // TODO: Implement async search for Company
                  // fetch(`/api/resource/Company?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Company"
                data-fieldname="company"
              />
              {/* Link indicator */}
              {formData.company && (
                <button
                  type="button"
                  onClick={() => handleChange('company', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
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
        </div>
      </div>
      {/* Section: Margin */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Margin</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Margin Type</label>
            <select
              value={String(formData.margin_type ?? '')}
              onChange={e => handleChange('margin_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Percentage">Percentage</option>
              <option value="Amount">Amount</option>
            </select>
          </div>
          {!!formData.margin_type && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Margin Rate or Amount</label>
            <input
              type="number"
              step="any"
              value={formData.margin_rate_or_amount != null ? Number(formData.margin_rate_or_amount) : ''}
              onChange={e => handleChange('margin_rate_or_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Price Discount Scheme */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Price Discount Scheme</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Rate or Discount</label>
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
          {formData.apply_on === 'Transaction' && formData.rate_or_discount !== 'Rate' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Apply Discount On</label>
            <select
              value={String(formData.apply_discount_on ?? '')}
              onChange={e => handleChange('apply_discount_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Grand Total">Grand Total</option>
              <option value="Net Total">Net Total</option>
            </select>
          </div>
          )}
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
      {/* Tab: Dynamic Condition */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Dynamic Condition</h3>
      </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Condition</label>
            <textarea
              value={String(formData.condition ?? '')}
              onChange={e => handleChange('condition', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Tab: Advanced Settings */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Advanced Settings</h3>
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
          {in_list(['Discount Percentage'], formData.rate_or_discount) && formData.apply_multiple_pricing_rules && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.apply_discount_on_rate}
              onChange={e => handleChange('apply_discount_on_rate', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Apply Discount on Discounted Rate</label>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Threshold for Suggestion (In Percentage)</label>
            <input
              type="number"
              step="any"
              value={formData.threshold_percentage != null ? Number(formData.threshold_percentage) : ''}
              onChange={e => handleChange('threshold_percentage', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: Validate Pricing Rule */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Validate Pricing Rule</h4>
        <div className="grid grid-cols-2 gap-4">
          {formData.price_or_product_discount === 'Price' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.validate_applied_rule}
              onChange={e => handleChange('validate_applied_rule', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Validate Applied Rule</label>
          </div>
          )}
          {!!formData.validate_applied_rule && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Rule Description</label>
            <textarea
              value={String(formData.rule_description ?? '')}
              onChange={e => handleChange('rule_description', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Priority */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Priority</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.has_priority}
              onChange={e => handleChange('has_priority', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Has Priority</label>
          </div>
          {!!formData.has_priority && (
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
          )}
        </div>
      </div>
      {/* Tab: Help Article */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Help Article</h3>
      </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Pricing Rule Help</label>
            <textarea
              value={String(formData.pricing_rule_help ?? '')}
              onChange={e => handleChange('pricing_rule_help', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: Reference */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Reference</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Promotional Scheme Id</label>
            <input
              type="text"
              value={String(formData.promotional_scheme_id ?? '')}
              onChange={e => handleChange('promotional_scheme_id', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Promotional Scheme (→ Promotional Scheme)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Promotional Scheme..."
                value={String(formData.promotional_scheme ?? '')}
                onChange={e => {
                  handleChange('promotional_scheme', e.target.value);
                  // TODO: Implement async search for Promotional Scheme
                  // fetch(`/api/resource/Promotional Scheme?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Promotional Scheme"
                data-fieldname="promotional_scheme"
              />
              {/* Link indicator */}
              {formData.promotional_scheme && (
                <button
                  type="button"
                  onClick={() => handleChange('promotional_scheme', '')}
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