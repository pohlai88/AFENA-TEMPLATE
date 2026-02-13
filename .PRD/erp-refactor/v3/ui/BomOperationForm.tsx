// Form scaffold for BOM Operation
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { BomOperation } from '../types/bom-operation.js';

interface BomOperationFormProps {
  initialData?: Partial<BomOperation>;
  onSubmit: (data: Partial<BomOperation>) => void;
  mode: 'create' | 'edit';
}

export function BomOperationForm({ initialData = {}, onSubmit, mode }: BomOperationFormProps) {
  const [formData, setFormData] = useState<Partial<BomOperation>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'BOM Operation' : 'New BOM Operation'}</h2>
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
          {formData.parenttype === "Routing" && (
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
          )}
          {parent.track_semi_finished_goods ==== 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">FG / Semi FG Item (→ Item)</label>
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
          )}
          {parent.track_semi_finished_goods ==== 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Qty to Produce</label>
            <input
              type="number"
              step="any"
              value={formData.finished_good_qty != null ? Number(formData.finished_good_qty) : ''}
              onChange={e => handleChange('finished_good_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {parent.track_semi_finished_goods ==== 1 && (
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
          )}
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
          {!formData.workstation_type && (
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
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Operation Time</label>
            <input
              type="number"
              step="any"
              value={formData.time_in_mins != null ? Number(formData.time_in_mins) : ''}
              onChange={e => handleChange('time_in_mins', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.fixed_time}
              onChange={e => handleChange('fixed_time', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Fixed Time</label>
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
              checked={!!formData.is_final_finished_good}
              onChange={e => handleChange('is_final_finished_good', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Final Finished Good</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.set_cost_based_on_bom_qty}
              onChange={e => handleChange('set_cost_based_on_bom_qty', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Set Operating Cost Based On BOM Quantity</label>
          </div>
      {/* Section: Warehouse */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Warehouse</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.skip_material_transfer}
              onChange={e => handleChange('skip_material_transfer', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700"> Skip Material Transfer</label>
          </div>
          {!!formData.skip_material_transfer && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.backflush_from_wip_warehouse}
              onChange={e => handleChange('backflush_from_wip_warehouse', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Backflush Materials From WIP Warehouse</label>
          </div>
          )}
          {formData.skip_material_transfer && !formData.backflush_from_wip_warehouse && (
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
          )}
          {!formData.skip_material_transfer || formData.backflush_from_wip_warehouse && (
          <div>
            <label className="block text-sm font-medium text-gray-700">WIP Warehouse (→ Warehouse)</label>
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
      {/* Section: Costing */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Costing</h4>
        <div className="grid grid-cols-2 gap-4">
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
          {parent.doctype === 'BOM' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Base Hour Rate(Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_hour_rate != null ? Number(formData.base_hour_rate) : ''}
              onChange={e => handleChange('base_hour_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Batch Size</label>
            <input
              type="number"
              step="1"
              value={formData.batch_size != null ? Number(formData.batch_size) : ''}
              onChange={e => handleChange('batch_size', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {formData.batch_size > 0 && formData.set_cost_based_on_bom_qty && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Cost Per Unit</label>
            <input
              type="number"
              step="any"
              value={formData.cost_per_unit != null ? Number(formData.cost_per_unit) : ''}
              onChange={e => handleChange('cost_per_unit', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Base Cost Per Unit</label>
            <input
              type="number"
              step="any"
              value={formData.base_cost_per_unit != null ? Number(formData.base_cost_per_unit) : ''}
              onChange={e => handleChange('base_cost_per_unit', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
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
          {parent.doctype === 'BOM' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Operating Cost(Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_operating_cost != null ? Number(formData.base_operating_cost) : ''}
              onChange={e => handleChange('base_operating_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: More Information */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">More Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={String(formData.description ?? '')}
              onChange={e => handleChange('description', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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