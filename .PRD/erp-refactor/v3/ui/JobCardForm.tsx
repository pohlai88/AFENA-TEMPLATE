// Form scaffold for Job Card
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { JobCard } from '../types/job-card.js';

interface JobCardFormProps {
  initialData?: Partial<JobCard>;
  onSubmit: (data: Partial<JobCard>) => void;
  mode: 'create' | 'edit';
}

export function JobCardForm({ initialData = {}, onSubmit, mode }: JobCardFormProps) {
  const [formData, setFormData] = useState<Partial<JobCard>>(initialData);

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
        {mode === 'edit' ? formData.operation ?? 'Job Card' : 'New Job Card'}
      </h2>
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
            <label className="block text-sm font-medium text-gray-700">Work Order (→ Work Order)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Work Order..."
                value={String(formData.work_order ?? '')}
                onChange={e => {
                  handleChange('work_order', e.target.value);
                  // TODO: Implement async search for Work Order
                  // fetch(`/api/resource/Work Order?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Work Order"
                data-fieldname="work_order"
              />
              {/* Link indicator */}
              {formData.work_order && (
                <button
                  type="button"
                  onClick={() => handleChange('work_order', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {/* Child table: employee → Job Card Time Log */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Employee</label>
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
                  {(Array.isArray(formData.employee) ? (formData.employee as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.employee) ? formData.employee : [])];
                            rows.splice(idx, 1);
                            handleChange('employee', rows);
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
                  onClick={() => handleChange('employee', [...(Array.isArray(formData.employee) ? formData.employee : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_subcontracted}
              onChange={e => handleChange('is_subcontracted', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700"> Is Subcontracted</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Posting Date</label>
            <input
              type="date"
              value={String(formData.posting_date ?? '')}
              onChange={e => handleChange('posting_date', e.target.value)}
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
          {!formData.finished_good && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Final BOM (→ BOM)</label>
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
      {/* Section: Semi Finished Good / Finished Good */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Semi Finished Good / Finished Good</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Item to Manufacture (→ Item)</label>
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
          {!formData.finished_good && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Final Product (→ Item)</label>
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Manufacturing BOM (→ BOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search BOM..."
                value={String(formData.semi_fg_bom ?? '')}
                onChange={e => {
                  handleChange('semi_fg_bom', e.target.value);
                  // TODO: Implement async search for BOM
                  // fetch(`/api/resource/BOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="BOM"
                data-fieldname="semi_fg_bom"
              />
              {/* Link indicator */}
              {formData.semi_fg_bom && (
                <button
                  type="button"
                  onClick={() => handleChange('semi_fg_bom', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {formData.is_subcontracted====0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Completed Qty</label>
            <input
              type="number"
              step="any"
              value={formData.total_completed_qty != null ? Number(formData.total_completed_qty) : ''}
              onChange={e => handleChange('total_completed_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Qty To Manufacture</label>
            <input
              type="number"
              step="any"
              value={formData.for_quantity != null ? Number(formData.for_quantity) : ''}
              onChange={e => handleChange('for_quantity', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.items && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Transferred Raw Materials</label>
            <input
              type="number"
              step="any"
              value={formData.transferred_qty != null ? Number(formData.transferred_qty) : ''}
              onChange={e => handleChange('transferred_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.finished_good && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Manufactured Qty</label>
            <input
              type="number"
              step="any"
              value={formData.manufactured_qty != null ? Number(formData.manufactured_qty) : ''}
              onChange={e => handleChange('manufactured_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
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
        </div>
      </div>
      {/* Section: Operation & Materials */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Operation & Materials</h4>
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
          {!!formData.finished_good && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.skip_material_transfer}
              onChange={e => handleChange('skip_material_transfer', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Skip Material Transfer to WIP</label>
          </div>
          )}
          {formData.finished_good && formData.skip_material_transfer ==== 1 && (
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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
          {!!formData.track_semi_finished_goods && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Warehouse (→ Warehouse)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Warehouse..."
                value={String(formData.target_warehouse ?? '')}
                onChange={e => {
                  handleChange('target_warehouse', e.target.value);
                  // TODO: Implement async search for Warehouse
                  // fetch(`/api/resource/Warehouse?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Warehouse"
                data-fieldname="target_warehouse"
              />
              {/* Link indicator */}
              {formData.target_warehouse && (
                <button
                  type="button"
                  onClick={() => handleChange('target_warehouse', '')}
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
      {/* Section: Raw Materials */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Raw Materials</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: items → Job Card Item */}
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
      {/* Section: Quality Inspection */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Quality Inspection</h4>
        <div className="grid grid-cols-2 gap-4">
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
          {!formData.__islocal; && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Quality Inspection (→ Quality Inspection)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Quality Inspection..."
                value={String(formData.quality_inspection ?? '')}
                onChange={e => {
                  handleChange('quality_inspection', e.target.value);
                  // TODO: Implement async search for Quality Inspection
                  // fetch(`/api/resource/Quality Inspection?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Quality Inspection"
                data-fieldname="quality_inspection"
              />
              {/* Link indicator */}
              {formData.quality_inspection && (
                <button
                  type="button"
                  onClick={() => handleChange('quality_inspection', '')}
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
      {/* Tab: Scheduled Time */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Scheduled Time</h3>
      </div>
      {/* Section: Scheduled Time */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Scheduled Time</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Expected Start Date</label>
            <input
              type="datetime-local"
              value={String(formData.expected_start_date ?? '')}
              onChange={e => handleChange('expected_start_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expected Time Required (In Mins)</label>
            <input
              type="number"
              step="any"
              value={formData.time_required != null ? Number(formData.time_required) : ''}
              onChange={e => handleChange('time_required', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expected End Date</label>
            <input
              type="datetime-local"
              value={String(formData.expected_end_date ?? '')}
              onChange={e => handleChange('expected_end_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: section_break_rzeo */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: scheduled_time_logs → Job Card Scheduled Time */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Scheduled Time Logs</label>
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
                  {(Array.isArray(formData.scheduled_time_logs) ? (formData.scheduled_time_logs as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.scheduled_time_logs) ? formData.scheduled_time_logs : [])];
                            rows.splice(idx, 1);
                            handleChange('scheduled_time_logs', rows);
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
                  onClick={() => handleChange('scheduled_time_logs', [...(Array.isArray(formData.scheduled_time_logs) ? formData.scheduled_time_logs : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tab: Actual Time */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Actual Time</h3>
      </div>
      {/* Section: section_break_13 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-gray-700">Total Time in Mins</label>
            <input
              type="number"
              step="any"
              value={formData.total_time_in_mins != null ? Number(formData.total_time_in_mins) : ''}
              onChange={e => handleChange('total_time_in_mins', e.target.value ? parseFloat(e.target.value) : undefined)}
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
        </div>
      </div>
      {/* Section: section_break_jbas */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: time_logs → Job Card Time Log */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Time Logs</label>
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
                  {(Array.isArray(formData.time_logs) ? (formData.time_logs as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.time_logs) ? formData.time_logs : [])];
                            rows.splice(idx, 1);
                            handleChange('time_logs', rows);
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
                  onClick={() => handleChange('time_logs', [...(Array.isArray(formData.time_logs) ? formData.time_logs : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tab: Sub Operations */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Sub Operations</h3>
      </div>
          {/* Child table: sub_operations → Job Card Operation */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Sub Operations</label>
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
                  {(Array.isArray(formData.sub_operations) ? (formData.sub_operations as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.sub_operations) ? formData.sub_operations : [])];
                            rows.splice(idx, 1);
                            handleChange('sub_operations', rows);
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
                  onClick={() => handleChange('sub_operations', [...(Array.isArray(formData.sub_operations) ? formData.sub_operations : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
      {/* Tab: Scrap Items */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Scrap Items</h3>
      </div>
          {/* Child table: scrap_items → Job Card Scrap Item */}
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
      {/* Tab: Corrective Operation */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Corrective Operation</h3>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">For Job Card (→ Job Card)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Job Card..."
                value={String(formData.for_job_card ?? '')}
                onChange={e => {
                  handleChange('for_job_card', e.target.value);
                  // TODO: Implement async search for Job Card
                  // fetch(`/api/resource/Job Card?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Job Card"
                data-fieldname="for_job_card"
              />
              {/* Link indicator */}
              {formData.for_job_card && (
                <button
                  type="button"
                  onClick={() => handleChange('for_job_card', '')}
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
              checked={!!formData.is_corrective_job_card}
              onChange={e => handleChange('is_corrective_job_card', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Corrective Job Card</label>
          </div>
          {!!formData.is_corrective_job_card && (
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
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">For Operation (→ Operation)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Operation..."
                value={String(formData.for_operation ?? '')}
                onChange={e => {
                  handleChange('for_operation', e.target.value);
                  // TODO: Implement async search for Operation
                  // fetch(`/api/resource/Operation?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Operation"
                data-fieldname="for_operation"
              />
              {/* Link indicator */}
              {formData.for_operation && (
                <button
                  type="button"
                  onClick={() => handleChange('for_operation', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
      {/* Tab: More Information */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">More Information</h3>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Requested Qty</label>
            <input
              type="number"
              step="any"
              value={formData.requested_qty != null ? Number(formData.requested_qty) : ''}
              onChange={e => handleChange('requested_qty', e.target.value ? parseFloat(e.target.value) : undefined)}
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
              <option value="Open">Open</option>
              <option value="Work In Progress">Work In Progress</option>
              <option value="Material Transferred">Material Transferred</option>
              <option value="On Hold">On Hold</option>
              <option value="Submitted">Submitted</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Operation Row ID</label>
            <input
              type="number"
              step="1"
              value={formData.operation_row_id != null ? Number(formData.operation_row_id) : ''}
              onChange={e => handleChange('operation_row_id', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_paused}
              onChange={e => handleChange('is_paused', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Paused</label>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Operation Row Number</label>
            <select
              value={String(formData.operation_row_number ?? '')}
              onChange={e => handleChange('operation_row_number', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>

            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Operation ID</label>
            <input
              type="text"
              value={String(formData.operation_id ?? '')}
              onChange={e => handleChange('operation_id', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sequence Id</label>
            <input
              type="number"
              step="1"
              value={formData.sequence_id != null ? Number(formData.sequence_id) : ''}
              onChange={e => handleChange('sequence_id', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Remarks</label>
            <textarea
              value={String(formData.remarks ?? '')}
              onChange={e => handleChange('remarks', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Serial and Batch Bundle (→ Serial and Batch Bundle)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Serial and Batch Bundle..."
                value={String(formData.serial_and_batch_bundle ?? '')}
                onChange={e => {
                  handleChange('serial_and_batch_bundle', e.target.value);
                  // TODO: Implement async search for Serial and Batch Bundle
                  // fetch(`/api/resource/Serial and Batch Bundle?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Serial and Batch Bundle"
                data-fieldname="serial_and_batch_bundle"
              />
              {/* Link indicator */}
              {formData.serial_and_batch_bundle && (
                <button
                  type="button"
                  onClick={() => handleChange('serial_and_batch_bundle', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Batch No (→ Batch)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Batch..."
                value={String(formData.batch_no ?? '')}
                onChange={e => {
                  handleChange('batch_no', e.target.value);
                  // TODO: Implement async search for Batch
                  // fetch(`/api/resource/Batch?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Batch"
                data-fieldname="batch_no"
              />
              {/* Link indicator */}
              {formData.batch_no && (
                <button
                  type="button"
                  onClick={() => handleChange('batch_no', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Serial No</label>
            <textarea
              value={String(formData.serial_no ?? '')}
              onChange={e => handleChange('serial_no', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Barcode</label>
            <input
              type="text"
              value={String(formData.barcode ?? '')}
              onChange={e => handleChange('barcode', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Started Time</label>
            <input
              type="datetime-local"
              value={String(formData.started_time ?? '')}
              onChange={e => handleChange('started_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Time</label>
            <input
              type="number"
              step="1"
              value={formData.current_time != null ? Number(formData.current_time) : ''}
              onChange={e => handleChange('current_time', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Job Card)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Job Card..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Job Card
                  // fetch(`/api/resource/Job Card?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Job Card"
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