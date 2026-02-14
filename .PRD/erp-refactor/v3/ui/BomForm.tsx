// Form scaffold for BOM
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { Bom } from '../types/bom.js';

interface BomFormProps {
  initialData?: Partial<Bom>;
  onSubmit: (data: Partial<Bom>) => void;
  mode: 'create' | 'edit';
}

export function BomForm({ initialData = {}, onSubmit, mode }: BomFormProps) {
  const [formData, setFormData] = useState<Partial<Bom>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'BOM' : 'New BOM'}</h2>
      {/* Tab: Production Item */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Production Item</h3>
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
            <label className="block text-sm font-medium text-gray-700">Item UOM (→ UOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UOM..."
                value={String(formData.uom ?? '')}
                onChange={e => {
                  handleChange('uom', e.target.value);
                  // TODO: Implement async search for UOM
                  // fetch(`/api/resource/UOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="UOM"
                data-fieldname="uom"
              />
              {/* Link indicator */}
              {formData.uom && (
                <button
                  type="button"
                  onClick={() => handleChange('uom', '')}
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
              step="any"
              value={formData.quantity != null ? Number(formData.quantity) : ''}
              onChange={e => handleChange('quantity', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_active}
              onChange={e => handleChange('is_active', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Active</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_default}
              onChange={e => handleChange('is_default', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Default</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_alternative_item}
              onChange={e => handleChange('allow_alternative_item', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Alternative Item</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.set_rate_of_sub_assembly_item_based_on_bom}
              onChange={e => handleChange('set_rate_of_sub_assembly_item_based_on_bom', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Set rate of sub-assembly item based on BOM</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_phantom_bom}
              onChange={e => handleChange('is_phantom_bom', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Phantom BOM</label>
          </div>
          {!formData.is_phantom_bom && (
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
      {/* Section: Cost Configuration */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Cost Configuration</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Rate Of Materials Based On</label>
            <select
              value={String(formData.rm_cost_as_per ?? '')}
              onChange={e => handleChange('rm_cost_as_per', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Valuation Rate">Valuation Rate</option>
              <option value="Last Purchase Rate">Last Purchase Rate</option>
              <option value="Price List">Price List</option>
            </select>
          </div>
          {formData.rm_cost_as_per===="Price List" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Price List (→ Price List)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Price List..."
                value={String(formData.buying_price_list ?? '')}
                onChange={e => {
                  handleChange('buying_price_list', e.target.value);
                  // TODO: Implement async search for Price List
                  // fetch(`/api/resource/Price List?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Price List"
                data-fieldname="buying_price_list"
              />
              {/* Link indicator */}
              {formData.buying_price_list && (
                <button
                  type="button"
                  onClick={() => handleChange('buying_price_list', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.rm_cost_as_per==='Price List' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Price List Currency (→ Currency)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Currency..."
                value={String(formData.price_list_currency ?? '')}
                onChange={e => {
                  handleChange('price_list_currency', e.target.value);
                  // TODO: Implement async search for Currency
                  // fetch(`/api/resource/Currency?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Currency"
                data-fieldname="price_list_currency"
              />
              {/* Link indicator */}
              {formData.price_list_currency && (
                <button
                  type="button"
                  onClick={() => handleChange('price_list_currency', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.rm_cost_as_per==='Price List' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Price List Exchange Rate</label>
            <input
              type="number"
              step="any"
              value={formData.plc_conversion_rate != null ? Number(formData.plc_conversion_rate) : ''}
              onChange={e => handleChange('plc_conversion_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
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
            <label className="block text-sm font-medium text-gray-700">Conversion Rate</label>
            <input
              type="number"
              step="any"
              value={formData.conversion_rate != null ? Number(formData.conversion_rate) : ''}
              onChange={e => handleChange('conversion_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
        </div>
      </div>
      {/* Section: Operations */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Operations</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.with_operations}
              onChange={e => handleChange('with_operations', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">With Operations</label>
          </div>
          {!!formData.with_operations && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.track_semi_finished_goods}
              onChange={e => handleChange('track_semi_finished_goods', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Track Semi Finished Goods</label>
          </div>
          )}
          {formData.with_operations ==== 1 && formData.track_semi_finished_goods ==== 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Transfer Material Against</label>
            <select
              value={String(formData.transfer_material_against ?? '')}
              onChange={e => handleChange('transfer_material_against', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Work Order">Work Order</option>
              <option value="Job Card">Job Card</option>
            </select>
          </div>
          )}
          {!!formData.with_operations && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Routing (→ Routing)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Routing..."
                value={String(formData.routing ?? '')}
                onChange={e => {
                  handleChange('routing', e.target.value);
                  // TODO: Implement async search for Routing
                  // fetch(`/api/resource/Routing?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Routing"
                data-fieldname="routing"
              />
              {/* Link indicator */}
              {formData.routing && (
                <button
                  type="button"
                  onClick={() => handleChange('routing', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.fg_based_operating_cost}
              onChange={e => handleChange('fg_based_operating_cost', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Finished Goods based Operating Cost</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Source Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.default_source_warehouse ?? '')}
                onChange={e => {
                  handleChange('default_source_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="default_source_warehouse"
              />
              {/* Link indicator */}
              {formData.default_source_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('default_source_warehouse', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Target Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.default_target_warehouse ?? '')}
                onChange={e => {
                  handleChange('default_target_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="default_target_warehouse"
              />
              {/* Link indicator */}
              {formData.default_target_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('default_target_warehouse', '')}
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
      {/* Section: Finished Goods Based Operating Cost */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Finished Goods Based Operating Cost</h4>
        <div className="grid grid-cols-2 gap-4">
          {!!formData.fg_based_operating_cost && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Operating Cost Per BOM Quantity</label>
            <input
              type="number"
              step="any"
              value={formData.operating_cost_per_bom_quantity != null ? Number(formData.operating_cost_per_bom_quantity) : ''}
              onChange={e => handleChange('operating_cost_per_bom_quantity', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: operations_section */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {!!formData.with_operations && (
          {/* Child table: operations → BOM Operation */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Operations</label>
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
                  {(Array.isArray(formData.operations) ? (formData.operations as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.operations) ? formData.operations : [])];
                            rows.splice(idx, 1);
                            handleChange('operations', rows);
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
                  onClick={() => handleChange('operations', [...(Array.isArray(formData.operations) ? formData.operations : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
      {/* Section: Raw Materials */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Raw Materials</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: items → BOM Item */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Items</label>
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
        </div>
      </div>
      {/* Tab: Scrap & Process Loss */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Scrap & Process Loss</h3>
      </div>
      {/* Section: Scrap Items */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Scrap Items</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: scrap_items → BOM Scrap Item */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Scrap Items</label>
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
                  {(Array.isArray(formData.scrap_items) ? (formData.scrap_items as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.scrap_items) ? formData.scrap_items : [])];
                            rows.splice(idx, 1);
                            handleChange('scrap_items', rows);
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
                  onClick={() => handleChange('scrap_items', [...(Array.isArray(formData.scrap_items) ? formData.scrap_items : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Process Loss */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Process Loss</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">% Process Loss</label>
            <input
              type="number"
              step="any"
              value={formData.process_loss_percentage != null ? Number(formData.process_loss_percentage) : ''}
              onChange={e => handleChange('process_loss_percentage', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Process Loss Qty</label>
            <input
              type="number"
              step="any"
              value={formData.process_loss_qty != null ? Number(formData.process_loss_qty) : ''}
              onChange={e => handleChange('process_loss_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Tab: Costing */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Costing</h3>
      </div>
          {!formData.is_phantom_bom && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Operating Cost</label>
            <input
              type="number"
              step="any"
              value={formData.operating_cost != null ? Number(formData.operating_cost) : ''}
              onChange={e => handleChange('operating_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Raw Material Cost</label>
            <input
              type="number"
              step="any"
              value={formData.raw_material_cost != null ? Number(formData.raw_material_cost) : ''}
              onChange={e => handleChange('raw_material_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!formData.is_phantom_bom && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Scrap Material Cost</label>
            <input
              type="number"
              step="any"
              value={formData.scrap_material_cost != null ? Number(formData.scrap_material_cost) : ''}
              onChange={e => handleChange('scrap_material_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!formData.is_phantom_bom && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Operating Cost (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_operating_cost != null ? Number(formData.base_operating_cost) : ''}
              onChange={e => handleChange('base_operating_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Raw Material Cost (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_raw_material_cost != null ? Number(formData.base_raw_material_cost) : ''}
              onChange={e => handleChange('base_raw_material_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!formData.is_phantom_bom && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Scrap Material Cost(Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_scrap_material_cost != null ? Number(formData.base_scrap_material_cost) : ''}
              onChange={e => handleChange('base_scrap_material_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Cost</label>
            <input
              type="number"
              step="any"
              value={formData.total_cost != null ? Number(formData.total_cost) : ''}
              onChange={e => handleChange('total_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Cost (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_total_cost != null ? Number(formData.base_total_cost) : ''}
              onChange={e => handleChange('base_total_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Tab: More Info */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">More Info</h3>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              value={String(formData.item_name ?? '')}
              onChange={e => handleChange('item_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Item Description</label>
            <textarea
              value={String(formData.description ?? '')}
              onChange={e => handleChange('description', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.has_variants}
              onChange={e => handleChange('has_variants', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Has Variants</label>
          </div>
      {/* Section: Quality Inspection */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Quality Inspection</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.inspection_required}
              onChange={e => handleChange('inspection_required', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Quality Inspection Required</label>
          </div>
          {!!formData.inspection_required && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Quality Inspection Template (→ Quality Inspection Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Quality Inspection Template..."
                value={String(formData.quality_inspection_template ?? '')}
                onChange={e => {
                  handleChange('quality_inspection_template', e.target.value);
                  // TODO: Implement async search for Quality Inspection Template
                  // fetch(`/api/resource/Quality Inspection Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Quality Inspection Template"
                data-fieldname="quality_inspection_template"
              />
              {/* Link indicator */}
              {formData.quality_inspection_template && (
                <button
                  type="button"
                  onClick={() => handleChange('quality_inspection_template', '')}
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
      {/* Tab: Exploded Items */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Exploded Items</h3>
      </div>
          {/* Child table: exploded_items → BOM Explosion Item */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Exploded Items</label>
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
                  {(Array.isArray(formData.exploded_items) ? (formData.exploded_items as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.exploded_items) ? formData.exploded_items : [])];
                            rows.splice(idx, 1);
                            handleChange('exploded_items', rows);
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
                  onClick={() => handleChange('exploded_items', [...(Array.isArray(formData.exploded_items) ? formData.exploded_items : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
      {/* Tab: Website */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Website</h3>
      </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.show_in_website}
              onChange={e => handleChange('show_in_website', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Show in Website</label>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Route</label>
            <textarea
              value={String(formData.route ?? '')}
              onChange={e => handleChange('route', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.show_in_website && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Website Image</label>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
            <input
              type="text"
              value={String(formData.thumbnail ?? '')}
              onChange={e => handleChange('thumbnail', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: Website Specifications */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Website Specifications</h4>
        <div className="grid grid-cols-2 gap-4">
          {!!formData.show_in_website && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.show_items}
              onChange={e => handleChange('show_items', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Show Items</label>
          </div>
          )}
          {(formData.show_in_website && formData.with_operations) && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.show_operations}
              onChange={e => handleChange('show_operations', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Show Operations</label>
          </div>
          )}
          {!!formData.show_in_website && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Website Description</label>
            <textarea
              value={String(formData.web_long_description ?? '')}
              onChange={e => handleChange('web_long_description', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Reference */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Reference</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">BOM Creator (→ BOM Creator)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search BOM Creator..."
                value={String(formData.bom_creator ?? '')}
                onChange={e => {
                  handleChange('bom_creator', e.target.value);
                  // TODO: Implement async search for BOM Creator
                  // fetch(`/api/resource/BOM Creator?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="BOM Creator"
                data-fieldname="bom_creator"
              />
              {/* Link indicator */}
              {formData.bom_creator && (
                <button
                  type="button"
                  onClick={() => handleChange('bom_creator', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">BOM Creator Item</label>
            <input
              type="text"
              value={String(formData.bom_creator_item ?? '')}
              onChange={e => handleChange('bom_creator_item', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ BOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search BOM..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for BOM
                  // fetch(`/api/resource/BOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="BOM"
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
      {/* Tab: Connections */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Connections</h3>
      </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}