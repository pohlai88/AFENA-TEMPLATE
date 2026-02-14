// Form scaffold for Production Plan
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ProductionPlan } from '../types/production-plan.js';

interface ProductionPlanFormProps {
  initialData?: Partial<ProductionPlan>;
  onSubmit: (data: Partial<ProductionPlan>) => void;
  mode: 'create' | 'edit';
}

export function ProductionPlanForm({ initialData = {}, onSubmit, mode }: ProductionPlanFormProps) {
  const [formData, setFormData] = useState<Partial<ProductionPlan>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Production Plan' : 'New Production Plan'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Naming Series</label>
            <select
              value={String(formData.naming_series ?? '')}
              onChange={e => handleChange('naming_series', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>

            </select>
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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
            <label className="block text-sm font-medium text-gray-700">Get Items From</label>
            <select
              value={String(formData.get_items_from ?? '')}
              onChange={e => handleChange('get_items_from', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Sales Order">Sales Order</option>
              <option value="Material Request">Material Request</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Posting Date</label>
            <input
              type="date"
              value={String(formData.posting_date ?? '')}
              onChange={e => handleChange('posting_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.reserve_stock}
              onChange={e => handleChange('reserve_stock', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Reserve Stock</label>
          </div>
      {/* Section: Filters */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Filters</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Code (→ Item)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Item..."
                value={String(formData.item_code ?? '')}
                onChange={e => {
                  handleChange('item_code', e.target.value);
                  // TODO: Implement async search for Item
                  // fetch(`/api/resource/Item?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Item"
                data-fieldname="item_code"
              />
              {/* Link indicator */}
              {formData.item_code && (
                <button
                  type="button"
                  onClick={() => handleChange('item_code', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {formData.get_items_from === "Sales Order" && (
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
          {formData.get_items_from === "Material Request" && (
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
          {formData.get_items_from === "Sales Order" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Project (→ Project)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Project..."
                value={String(formData.project ?? '')}
                onChange={e => {
                  handleChange('project', e.target.value);
                  // TODO: Implement async search for Project
                  // fetch(`/api/resource/Project?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Project"
                data-fieldname="project"
              />
              {/* Link indicator */}
              {formData.project && (
                <button
                  type="button"
                  onClick={() => handleChange('project', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.get_items_from === "Sales Order" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Order Status</label>
            <select
              value={String(formData.sales_order_status ?? '')}
              onChange={e => handleChange('sales_order_status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="To Deliver and Bill">To Deliver and Bill</option>
              <option value="To Bill">To Bill</option>
              <option value="To Deliver">To Deliver</option>
            </select>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={String(formData.from_date ?? '')}
              onChange={e => handleChange('from_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={String(formData.to_date ?? '')}
              onChange={e => handleChange('to_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {formData.get_items_from === 'Sales Order' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">From Delivery Date</label>
            <input
              type="date"
              value={String(formData.from_delivery_date ?? '')}
              onChange={e => handleChange('from_delivery_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.get_items_from === 'Sales Order' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">To Delivery Date</label>
            <input
              type="date"
              value={String(formData.to_delivery_date ?? '')}
              onChange={e => handleChange('to_delivery_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Sales Orders */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Sales Orders</h4>
        <div className="grid grid-cols-2 gap-4">
          {formData.get_items_from === 'Sales Order' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.combine_items}
              onChange={e => handleChange('combine_items', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Consolidate Sales Order Items</label>
          </div>
          )}
          {/* Child table: sales_orders → Production Plan Sales Order */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Sales Orders</label>
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
                  {(Array.isArray(formData.sales_orders) ? (formData.sales_orders as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.sales_orders) ? formData.sales_orders : [])];
                            rows.splice(idx, 1);
                            handleChange('sales_orders', rows);
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
                  onClick={() => handleChange('sales_orders', [...(Array.isArray(formData.sales_orders) ? formData.sales_orders : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Material Request Detail */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Material Request Detail</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: material_requests → Production Plan Material Request */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Material Requests</label>
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
                  {(Array.isArray(formData.material_requests) ? (formData.material_requests as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.material_requests) ? formData.material_requests : [])];
                            rows.splice(idx, 1);
                            handleChange('material_requests', rows);
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
                  onClick={() => handleChange('material_requests', [...(Array.isArray(formData.material_requests) ? formData.material_requests : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Select Items to Manufacture */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Select Items to Manufacture</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: po_items → Production Plan Item */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Assembly Items</label>
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
                  {(Array.isArray(formData.po_items) ? (formData.po_items as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.po_items) ? formData.po_items : [])];
                            rows.splice(idx, 1);
                            handleChange('po_items', rows);
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
                  onClick={() => handleChange('po_items', [...(Array.isArray(formData.po_items) ? formData.po_items : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: section_break_25 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: prod_plan_references → Production Plan Item Reference */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Production Plan Item Reference</label>
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
                  {(Array.isArray(formData.prod_plan_references) ? (formData.prod_plan_references as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.prod_plan_references) ? formData.prod_plan_references : [])];
                            rows.splice(idx, 1);
                            handleChange('prod_plan_references', rows);
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
                  onClick={() => handleChange('prod_plan_references', [...(Array.isArray(formData.prod_plan_references) ? formData.prod_plan_references : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Sub Assembly Items */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Sub Assembly Items</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Sub Assembly Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.sub_assembly_warehouse ?? '')}
                onChange={e => {
                  handleChange('sub_assembly_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="sub_assembly_warehouse"
              />
              {/* Link indicator */}
              {formData.sub_assembly_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('sub_assembly_warehouse', '')}
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
              checked={!!formData.skip_available_sub_assembly_item}
              onChange={e => handleChange('skip_available_sub_assembly_item', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Consider Projected Qty in Calculation</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.combine_sub_items}
              onChange={e => handleChange('combine_sub_items', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Consolidate Sub Assembly Items</label>
          </div>
        </div>
      </div>
      {/* Section: section_break_g4ip */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: sub_assembly_items → Production Plan Sub Assembly Item */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">sub_assembly_items</label>
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
                  {(Array.isArray(formData.sub_assembly_items) ? (formData.sub_assembly_items as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.sub_assembly_items) ? formData.sub_assembly_items : [])];
                            rows.splice(idx, 1);
                            handleChange('sub_assembly_items', rows);
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
                  onClick={() => handleChange('sub_assembly_items', [...(Array.isArray(formData.sub_assembly_items) ? formData.sub_assembly_items : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Preview Required Materials */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Preview Required Materials</h4>
        <div className="grid grid-cols-2 gap-4">
        </div>
      </div>
      {/* Section: For Raw Materials */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">For Raw Materials</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.include_non_stock_items}
              onChange={e => handleChange('include_non_stock_items', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Include Non Stock Items</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.include_subcontracted_items}
              onChange={e => handleChange('include_subcontracted_items', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Include Subcontracted Items</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.consider_minimum_order_qty}
              onChange={e => handleChange('consider_minimum_order_qty', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Consider Minimum Order Qty</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.include_safety_stock}
              onChange={e => handleChange('include_safety_stock', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Include Safety Stock in Required Qty Calculation</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.ignore_existing_ordered_qty}
              onChange={e => handleChange('ignore_existing_ordered_qty', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Consider Projected Qty in Calculation (RM)</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">For Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.for_warehouse ?? '')}
                onChange={e => {
                  handleChange('for_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="for_warehouse"
              />
              {/* Link indicator */}
              {formData.for_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('for_warehouse', '')}
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
      {/* Section: section_break_27 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: mr_items → Material Request Plan Item */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Raw Materials</label>
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
                  {(Array.isArray(formData.mr_items) ? (formData.mr_items as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.mr_items) ? formData.mr_items : [])];
                            rows.splice(idx, 1);
                            handleChange('mr_items', rows);
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
                  onClick={() => handleChange('mr_items', [...(Array.isArray(formData.mr_items) ? formData.mr_items : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Other Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Other Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Planned Qty</label>
            <input
              type="number"
              step="any"
              value={formData.total_planned_qty != null ? Number(formData.total_planned_qty) : ''}
              onChange={e => handleChange('total_planned_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Produced Qty</label>
            <input
              type="number"
              step="any"
              value={formData.total_produced_qty != null ? Number(formData.total_produced_qty) : ''}
              onChange={e => handleChange('total_produced_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Not Started">Not Started</option>
              <option value="In Process">In Process</option>
              <option value="Completed">Completed</option>
              <option value="Closed">Closed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Material Requested">Material Requested</option>
            </select>
          </div>
          {/* Child table: warehouses → Production Plan Material Request Warehouse */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Warehouses</label>
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
                  {(Array.isArray(formData.warehouses) ? (formData.warehouses as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.warehouses) ? formData.warehouses : [])];
                            rows.splice(idx, 1);
                            handleChange('warehouses', rows);
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
                  onClick={() => handleChange('warehouses', [...(Array.isArray(formData.warehouses) ? formData.warehouses : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Production Plan)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Production Plan..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Production Plan
                  // fetch(`/api/resource/Production Plan?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Production Plan"
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