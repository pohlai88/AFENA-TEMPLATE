// Form scaffold for Work Order Operation
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { WorkOrderOperation } from '../types/work-order-operation.js';

interface WorkOrderOperationFormProps {
  initialData?: Partial<WorkOrderOperation>;
  onSubmit: (data: Partial<WorkOrderOperation>) => void;
  mode: 'create' | 'edit';
}

export function WorkOrderOperationForm({ initialData = {}, onSubmit, mode }: WorkOrderOperationFormProps) {
  const [formData, setFormData] = useState<Partial<WorkOrderOperation>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Work Order Operation' : 'New Work Order Operation'}</h2>
      {/* Section: details */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Operation (→ Operation)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Operation..."
                value={String(formData.operation ?? '')}
                onChange={e => {
                  handleChange('operation', e.target.value);
                  // TODO: Implement async search for Operation
                  // fetch(`/api/resource/Operation?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Operation"
                data-fieldname="operation"
              />
              {/* Link indicator */}
              {formData.operation && (
                <button
                  type="button"
                  onClick={() => handleChange('operation', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Pending">Pending</option>
              <option value="Work in Progress">Work in Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Completed Qty</label>
            <input
              type="number"
              step="any"
              value={formData.completed_qty != null ? Number(formData.completed_qty) : ''}
              onChange={e => handleChange('completed_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
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
          <div>
            <label className="block text-sm font-medium text-gray-700">BOM (→ BOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search BOM..."
                value={String(formData.bom ?? '')}
                onChange={e => {
                  handleChange('bom', e.target.value);
                  // TODO: Implement async search for BOM
                  // fetch(`/api/resource/BOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="BOM"
                data-fieldname="bom"
              />
              {/* Link indicator */}
              {formData.bom && (
                <button
                  type="button"
                  onClick={() => handleChange('bom', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Workstation Type (→ Workstation Type)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Workstation Type..."
                value={String(formData.workstation_type ?? '')}
                onChange={e => {
                  handleChange('workstation_type', e.target.value);
                  // TODO: Implement async search for Workstation Type
                  // fetch(`/api/resource/Workstation Type?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Workstation Type"
                data-fieldname="workstation_type"
              />
              {/* Link indicator */}
              {formData.workstation_type && (
                <button
                  type="button"
                  onClick={() => handleChange('workstation_type', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Workstation (→ Workstation)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Workstation..."
                value={String(formData.workstation ?? '')}
                onChange={e => {
                  handleChange('workstation', e.target.value);
                  // TODO: Implement async search for Workstation
                  // fetch(`/api/resource/Workstation?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Workstation"
                data-fieldname="workstation"
              />
              {/* Link indicator */}
              {formData.workstation && (
                <button
                  type="button"
                  onClick={() => handleChange('workstation', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sequence ID</label>
            <input
              type="number"
              step="1"
              value={formData.sequence_id != null ? Number(formData.sequence_id) : ''}
              onChange={e => handleChange('sequence_id', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: section_break_insy */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">BOM No (For Semi-Finished Goods) (→ BOM)</label>
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
            <label className="block text-sm font-medium text-gray-700">Semi Finished Goods / Finished Goods (→ Item)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Item..."
                value={String(formData.finished_good ?? '')}
                onChange={e => {
                  handleChange('finished_good', e.target.value);
                  // TODO: Implement async search for Item
                  // fetch(`/api/resource/Item?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Item"
                data-fieldname="finished_good"
              />
              {/* Link indicator */}
              {formData.finished_good && (
                <button
                  type="button"
                  onClick={() => handleChange('finished_good', '')}
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
              checked={!!formData.is_subcontracted}
              onChange={e => handleChange('is_subcontracted', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Subcontracted</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.skip_material_transfer}
              onChange={e => handleChange('skip_material_transfer', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Skip Material Transfer</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.backflush_from_wip_warehouse}
              onChange={e => handleChange('backflush_from_wip_warehouse', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Backflush Materials From WIP Warehouse</label>
          </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">WIP WH (→ Warehouse)</label>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Finished Goods Warehouse (→ Warehouse)</label>
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
        </div>
      </div>
      {/* Section: section_break_10 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Operation Description</label>
            <textarea
              value={String(formData.description ?? '')}
              onChange={e => handleChange('description', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Estimated Time and Cost */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Estimated Time and Cost</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Planned Start Time</label>
            <input
              type="datetime-local"
              value={String(formData.planned_start_time ?? '')}
              onChange={e => handleChange('planned_start_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hour Rate</label>
            <input
              type="number"
              step="any"
              value={formData.hour_rate != null ? Number(formData.hour_rate) : ''}
              onChange={e => handleChange('hour_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="number"
              step="any"
              value={formData.time_in_mins != null ? Number(formData.time_in_mins) : ''}
              onChange={e => handleChange('time_in_mins', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Planned End Time</label>
            <input
              type="datetime-local"
              value={String(formData.planned_end_time ?? '')}
              onChange={e => handleChange('planned_end_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
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
        </div>
      </div>
      {/* Section: Actual Time and Cost */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Actual Time and Cost</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Actual Start Time</label>
            <input
              type="datetime-local"
              value={String(formData.actual_start_time ?? '')}
              onChange={e => handleChange('actual_start_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Actual Operation Time</label>
            <input
              type="number"
              step="any"
              value={formData.actual_operation_time != null ? Number(formData.actual_operation_time) : ''}
              onChange={e => handleChange('actual_operation_time', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Actual End Time</label>
            <input
              type="datetime-local"
              value={String(formData.actual_end_time ?? '')}
              onChange={e => handleChange('actual_end_time', e.target.value)}
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