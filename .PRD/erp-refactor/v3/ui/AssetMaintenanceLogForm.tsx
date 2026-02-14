// Form scaffold for Asset Maintenance Log
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { AssetMaintenanceLog } from '../types/asset-maintenance-log.js';

interface AssetMaintenanceLogFormProps {
  initialData?: Partial<AssetMaintenanceLog>;
  onSubmit: (data: Partial<AssetMaintenanceLog>) => void;
  mode: 'create' | 'edit';
}

export function AssetMaintenanceLogForm({ initialData = {}, onSubmit, mode }: AssetMaintenanceLogFormProps) {
  const [formData, setFormData] = useState<Partial<AssetMaintenanceLog>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Asset Maintenance Log' : 'New Asset Maintenance Log'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Maintenance (→ Asset Maintenance)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Asset Maintenance..."
                value={String(formData.asset_maintenance ?? '')}
                onChange={e => {
                  handleChange('asset_maintenance', e.target.value);
                  // TODO: Implement async search for Asset Maintenance
                  // fetch(`/api/resource/Asset Maintenance?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Asset Maintenance"
                data-fieldname="asset_maintenance"
              />
              {/* Link indicator */}
              {formData.asset_maintenance && (
                <button
                  type="button"
                  onClick={() => handleChange('asset_maintenance', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Name</label>
            <input
              type="text"
              value={String(formData.asset_name ?? '')}
              onChange={e => handleChange('asset_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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
            <label className="block text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              value={String(formData.item_name ?? '')}
              onChange={e => handleChange('item_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: Maintenance Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Maintenance Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Task (→ Asset Maintenance Task)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Asset Maintenance Task..."
                value={String(formData.task ?? '')}
                onChange={e => {
                  handleChange('task', e.target.value);
                  // TODO: Implement async search for Asset Maintenance Task
                  // fetch(`/api/resource/Asset Maintenance Task?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Asset Maintenance Task"
                data-fieldname="task"
              />
              {/* Link indicator */}
              {formData.task && (
                <button
                  type="button"
                  onClick={() => handleChange('task', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Task Name</label>
            <input
              type="text"
              value={String(formData.task_name ?? '')}
              onChange={e => handleChange('task_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Maintenance Type</label>
            <input
              type="text"
              value={String(formData.maintenance_type ?? '')}
              onChange={e => handleChange('maintenance_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Periodicity</label>
            <input
              type="text"
              value={String(formData.periodicity ?? '')}
              onChange={e => handleChange('periodicity', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.has_certificate}
              onChange={e => handleChange('has_certificate', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Has Certificate </label>
          </div>
          {!!formData.has_certificate && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Certificate</label>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Maintenance Status</label>
            <select
              value={String(formData.maintenance_status ?? '')}
              onChange={e => handleChange('maintenance_status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Planned">Planned</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assign To</label>
            <input
              type="text"
              value={String(formData.assign_to_name ?? '')}
              onChange={e => handleChange('assign_to_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Task Assignee Email</label>
            <input
              type="text"
              value={String(formData.task_assignee_email ?? '')}
              onChange={e => handleChange('task_assignee_email', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              value={String(formData.due_date ?? '')}
              onChange={e => handleChange('due_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Completion Date</label>
            <input
              type="date"
              value={String(formData.completion_date ?? '')}
              onChange={e => handleChange('completion_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={String(formData.description ?? '')}
              onChange={e => handleChange('description', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: column_break_9 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Actions performed</label>
            <textarea
              value={String(formData.actions_performed ?? '')}
              onChange={e => handleChange('actions_performed', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Asset Maintenance Log)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Asset Maintenance Log..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Asset Maintenance Log
                  // fetch(`/api/resource/Asset Maintenance Log?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Asset Maintenance Log"
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