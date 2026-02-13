// Form scaffold for Work Order
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { WorkOrder } from '../types/work-order.js';

interface WorkOrderFormProps {
  initialData?: Partial<WorkOrder>;
  onSubmit: (data: Partial<WorkOrder>) => void;
  mode: 'create' | 'edit';
}

export function WorkOrderForm({ initialData = {}, onSubmit, mode }: WorkOrderFormProps) {
  const [formData, setFormData] = useState<Partial<WorkOrder>>(initialData);

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
        {mode === 'edit' ? formData.production_item ?? 'Work Order' : 'New Work Order'}
      </h2>
      {/* Tab: Production Item */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Production Item</h3>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Series</label>
            <select
              value={String(formData.naming_series ?? '')}
              onChange={e => handleChange('naming_series', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>

            </select>
          </div>
          {!formData.__islocal && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Not Started">Not Started</option>
              <option value="In Process">In Process</option>
              <option value="Stock Reserved">Stock Reserved</option>
              <option value="Stock Partially Reserved">Stock Partially Reserved</option>
              <option value="Completed">Completed</option>
              <option value="Stopped">Stopped</option>
              <option value="Closed">Closed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Item To Manufacture (→ Item)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Item..."
                value={String(formData.production_item ?? '')}
                onChange={e => {
                  handleChange('production_item', e.target.value);
                  // TODO: Implement async search for Item
                  // fetch(`/api/resource/Item?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Item"
                data-fieldname="production_item"
              />
              {/* Link indicator */}
              {formData.production_item && (
                <button
                  type="button"
                  onClick={() => handleChange('production_item', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {!!formData.production_item && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              value={String(formData.item_name ?? '')}
              onChange={e => handleChange('item_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">BOM No (→ BOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search BOM..."
                value={String(formData.bom_no ?? '')}
                onChange={e => {
                  handleChange('bom_no', e.target.value);
                  // TODO: Implement async search for BOM
                  // fetch(`/api/resource/BOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="BOM"
                data-fieldname="bom_no"
              />
              {/* Link indicator */}
              {formData.bom_no && (
                <button
                  type="button"
                  onClick={() => handleChange('bom_no', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">MPS (→ Master Production Schedule)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Master Production Schedule..."
                value={String(formData.mps ?? '')}
                onChange={e => {
                  handleChange('mps', e.target.value);
                  // TODO: Implement async search for Master Production Schedule
                  // fetch(`/api/resource/Master Production Schedule?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Master Production Schedule"
                data-fieldname="mps"
              />
              {/* Link indicator */}
              {formData.mps && (
                <button
                  type="button"
                  onClick={() => handleChange('mps', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {!!formData.subcontracting_inward_order && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Subcontracting Inward Order (→ Subcontracting Inward Order)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Subcontracting Inward Order..."
                value={String(formData.subcontracting_inward_order ?? '')}
                onChange={e => {
                  handleChange('subcontracting_inward_order', e.target.value);
                  // TODO: Implement async search for Subcontracting Inward Order
                  // fetch(`/api/resource/Subcontracting Inward Order?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Subcontracting Inward Order"
                data-fieldname="subcontracting_inward_order"
              />
              {/* Link indicator */}
              {formData.subcontracting_inward_order && (
                <button
                  type="button"
                  onClick={() => handleChange('subcontracting_inward_order', '')}
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
            <label className="block text-sm font-medium text-gray-700">Subcontracting Inward Order Item</label>
            <input
              type="text"
              value={String(formData.subcontracting_inward_order_item ?? '')}
              onChange={e => handleChange('subcontracting_inward_order_item', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!formData.subcontracting_inward_order && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Order (→ Sales Order)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Order..."
                value={String(formData.sales_order ?? '')}
                onChange={e => {
                  handleChange('sales_order', e.target.value);
                  // TODO: Implement async search for Sales Order
                  // fetch(`/api/resource/Sales Order?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Order"
                data-fieldname="sales_order"
              />
              {/* Link indicator */}
              {formData.sales_order && (
                <button
                  type="button"
                  onClick={() => handleChange('sales_order', '')}
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
            <label className="block text-sm font-medium text-gray-700">Qty To Manufacture</label>
            <input
              type="number"
              step="any"
              value={formData.qty != null ? Number(formData.qty) : ''}
              onChange={e => handleChange('qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.track_semi_finished_goods}
              onChange={e => handleChange('track_semi_finished_goods', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Track Semi Finished Goods</label>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Producible Qty</label>
            <input
              type="number"
              step="any"
              value={formData.max_producible_qty != null ? Number(formData.max_producible_qty) : ''}
              onChange={e => handleChange('max_producible_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {formData.docstatus===1 && formData.skip_transfer===0 && formData.track_semi_finished_goods ==== 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Material Transferred for Manufacturing</label>
            <input
              type="number"
              step="any"
              value={formData.material_transferred_for_manufacturing != null ? Number(formData.material_transferred_for_manufacturing) : ''}
              onChange={e => handleChange('material_transferred_for_manufacturing', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Transferred Qty</label>
            <input
              type="number"
              step="any"
              value={formData.additional_transferred_qty != null ? Number(formData.additional_transferred_qty) : ''}
              onChange={e => handleChange('additional_transferred_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {formData.docstatus===1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Manufactured Qty</label>
            <input
              type="number"
              step="any"
              value={formData.produced_qty != null ? Number(formData.produced_qty) : ''}
              onChange={e => handleChange('produced_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.docstatus===1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Disassembled Qty</label>
            <input
              type="number"
              step="any"
              value={formData.disassembled_qty != null ? Number(formData.disassembled_qty) : ''}
              onChange={e => handleChange('disassembled_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.process_loss_qty && (
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
          )}
      {/* Section: Warehouse */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Warehouse</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Source Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.source_warehouse ?? '')}
                onChange={e => {
                  handleChange('source_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="source_warehouse"
              />
              {/* Link indicator */}
              {formData.source_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('source_warehouse', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {!(formData.skip_transfer && formData.subcontracting_inward_order) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Work-in-Progress Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.wip_warehouse ?? '')}
                onChange={e => {
                  handleChange('wip_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="wip_warehouse"
              />
              {/* Link indicator */}
              {formData.wip_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('wip_warehouse', '')}
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
            <label className="block text-sm font-medium text-gray-700">Target Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.fg_warehouse ?? '')}
                onChange={e => {
                  handleChange('fg_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="fg_warehouse"
              />
              {/* Link indicator */}
              {formData.fg_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('fg_warehouse', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Scrap Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.scrap_warehouse ?? '')}
                onChange={e => {
                  handleChange('scrap_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="scrap_warehouse"
              />
              {/* Link indicator */}
              {formData.scrap_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('scrap_warehouse', '')}
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
      {/* Section: Operations */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Operations</h4>
        <div className="grid grid-cols-2 gap-4">
          {formData.operations?.length && formData.track_semi_finished_goods ==== 0 && (
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
          {/* Child table: operations → Work Order Operation */}
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
        </div>
      </div>
      {/* Section: Required Items */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Required Items</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: required_items → Work Order Item */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">required_items</label>
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
                  {(Array.isArray(formData.required_items) ? (formData.required_items as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.required_items) ? formData.required_items : [])];
                            rows.splice(idx, 1);
                            handleChange('required_items', rows);
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
                  onClick={() => handleChange('required_items', [...(Array.isArray(formData.required_items) ? formData.required_items : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tab: Configuration */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Configuration</h3>
      </div>
      {/* Section: settings_section */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {!formData.subcontracting_inward_order && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.allow_alternative_item}
              onChange={e => handleChange('allow_alternative_item', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Allow Alternative Item</label>
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.use_multi_level_bom}
              onChange={e => handleChange('use_multi_level_bom', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Use Multi-Level BOM</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.skip_transfer}
              onChange={e => handleChange('skip_transfer', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Skip Material Transfer to WIP Warehouse</label>
          </div>
          {formData.skip_transfer && !formData.subcontracting_inward_order && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.from_wip_warehouse}
              onChange={e => handleChange('from_wip_warehouse', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Backflush Raw Materials From Work-in-Progress Warehouse</label>
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.update_consumed_material_cost_in_project}
              onChange={e => handleChange('update_consumed_material_cost_in_project', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Update Consumed Material Cost In Project</label>
          </div>
        </div>
      </div>
      {/* Section: Time */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Time</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Planned Start Date</label>
            <input
              type="datetime-local"
              value={String(formData.planned_start_date ?? '')}
              onChange={e => handleChange('planned_start_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Planned End Date</label>
            <input
              type="datetime-local"
              value={String(formData.planned_end_date ?? '')}
              onChange={e => handleChange('planned_end_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expected Delivery Date</label>
            <input
              type="date"
              value={String(formData.expected_delivery_date ?? '')}
              onChange={e => handleChange('expected_delivery_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Actual Start Date</label>
            <input
              type="datetime-local"
              value={String(formData.actual_start_date ?? '')}
              onChange={e => handleChange('actual_start_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Actual End Date</label>
            <input
              type="datetime-local"
              value={String(formData.actual_end_date ?? '')}
              onChange={e => handleChange('actual_end_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lead Time</label>
            <input
              type="number"
              step="any"
              value={formData.lead_time != null ? Number(formData.lead_time) : ''}
              onChange={e => handleChange('lead_time', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Operation Cost */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Operation Cost</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Planned Operating Cost</label>
            <input
              type="number"
              step="any"
              value={formData.planned_operating_cost != null ? Number(formData.planned_operating_cost) : ''}
              onChange={e => handleChange('planned_operating_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Actual Operating Cost</label>
            <input
              type="number"
              step="any"
              value={formData.actual_operating_cost != null ? Number(formData.actual_operating_cost) : ''}
              onChange={e => handleChange('actual_operating_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Operating Cost</label>
            <input
              type="number"
              step="any"
              value={formData.additional_operating_cost != null ? Number(formData.additional_operating_cost) : ''}
              onChange={e => handleChange('additional_operating_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Corrective Operation Cost</label>
            <input
              type="number"
              step="any"
              value={formData.corrective_operation_cost != null ? Number(formData.corrective_operation_cost) : ''}
              onChange={e => handleChange('corrective_operation_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Operating Cost</label>
            <input
              type="number"
              step="any"
              value={formData.total_operating_cost != null ? Number(formData.total_operating_cost) : ''}
              onChange={e => handleChange('total_operating_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Finished Good Serial / Batch */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Finished Good Serial / Batch</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.has_serial_no}
              onChange={e => handleChange('has_serial_no', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Has Serial No</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.has_batch_no}
              onChange={e => handleChange('has_batch_no', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Has Batch No</label>
          </div>
          {!!formData.has_batch_no && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Batch Size</label>
            <input
              type="number"
              step="any"
              value={formData.batch_size != null ? Number(formData.batch_size) : ''}
              onChange={e => handleChange('batch_size', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Tab: More Info */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">More Info</h3>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock UOM (→ UOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UOM..."
                value={String(formData.stock_uom ?? '')}
                onChange={e => {
                  handleChange('stock_uom', e.target.value);
                  // TODO: Implement async search for UOM
                  // fetch(`/api/resource/UOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="UOM"
                data-fieldname="stock_uom"
              />
              {/* Link indicator */}
              {formData.stock_uom && (
                <button
                  type="button"
                  onClick={() => handleChange('stock_uom', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {!formData.subcontracting_inward_order && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Material Request (→ Material Request)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Material Request..."
                value={String(formData.material_request ?? '')}
                onChange={e => {
                  handleChange('material_request', e.target.value);
                  // TODO: Implement async search for Material Request
                  // fetch(`/api/resource/Material Request?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Material Request"
                data-fieldname="material_request"
              />
              {/* Link indicator */}
              {formData.material_request && (
                <button
                  type="button"
                  onClick={() => handleChange('material_request', '')}
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
            <label className="block text-sm font-medium text-gray-700">Material Request Item</label>
            <input
              type="text"
              value={String(formData.material_request_item ?? '')}
              onChange={e => handleChange('material_request_item', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Order Item</label>
            <input
              type="text"
              value={String(formData.sales_order_item ?? '')}
              onChange={e => handleChange('sales_order_item', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Production Plan (→ Production Plan)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Production Plan..."
                value={String(formData.production_plan ?? '')}
                onChange={e => {
                  handleChange('production_plan', e.target.value);
                  // TODO: Implement async search for Production Plan
                  // fetch(`/api/resource/Production Plan?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Production Plan"
                data-fieldname="production_plan"
              />
              {/* Link indicator */}
              {formData.production_plan && (
                <button
                  type="button"
                  onClick={() => handleChange('production_plan', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Production Plan Item</label>
            <input
              type="text"
              value={String(formData.production_plan_item ?? '')}
              onChange={e => handleChange('production_plan_item', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Production Plan Sub-assembly Item</label>
            <input
              type="text"
              value={String(formData.production_plan_sub_assembly_item ?? '')}
              onChange={e => handleChange('production_plan_sub_assembly_item', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Bundle Item (→ Item)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Item..."
                value={String(formData.product_bundle_item ?? '')}
                onChange={e => {
                  handleChange('product_bundle_item', e.target.value);
                  // TODO: Implement async search for Item
                  // fetch(`/api/resource/Item?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Item"
                data-fieldname="product_bundle_item"
              />
              {/* Link indicator */}
              {formData.product_bundle_item && (
                <button
                  type="button"
                  onClick={() => handleChange('product_bundle_item', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Work Order)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Work Order..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Work Order
                  // fetch(`/api/resource/Work Order?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Work Order"
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