// Form scaffold for Asset Maintenance Task
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { AssetMaintenanceTask } from '../types/asset-maintenance-task.js';

interface AssetMaintenanceTaskFormProps {
  initialData?: Partial<AssetMaintenanceTask>;
  onSubmit: (data: Partial<AssetMaintenanceTask>) => void;
  mode: 'create' | 'edit';
}

export function AssetMaintenanceTaskForm({ initialData = {}, onSubmit, mode }: AssetMaintenanceTaskFormProps) {
  const [formData, setFormData] = useState<Partial<AssetMaintenanceTask>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Asset Maintenance Task' : 'New Asset Maintenance Task'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Maintenance Task</label>
            <input
              type="text"
              value={String(formData.maintenance_task ?? '')}
              onChange={e => handleChange('maintenance_task', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Maintenance Type</label>
            <select
              value={String(formData.maintenance_type ?? '')}
              onChange={e => handleChange('maintenance_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Preventive Maintenance">Preventive Maintenance</option>
              <option value="Calibration">Calibration</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Maintenance Status</label>
            <select
              value={String(formData.maintenance_status ?? '')}
              onChange={e => handleChange('maintenance_status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Planned">Planned</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
      {/* Section: section_break_2 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={String(formData.start_date ?? '')}
              onChange={e => handleChange('start_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Periodicity</label>
            <select
              value={String(formData.periodicity ?? '')}
              onChange={e => handleChange('periodicity', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Half-yearly">Half-yearly</option>
              <option value="Yearly">Yearly</option>
              <option value="2 Yearly">2 Yearly</option>
              <option value="3 Yearly">3 Yearly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={String(formData.end_date ?? '')}
              onChange={e => handleChange('end_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.certificate_required}
              onChange={e => handleChange('certificate_required', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Certificate Required</label>
          </div>
        </div>
      </div>
      {/* Section: section_break_9 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Assign To (→ User)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search User..."
                value={String(formData.assign_to ?? '')}
                onChange={e => {
                  handleChange('assign_to', e.target.value);
                  // TODO: Implement async search for User
                  // fetch(`/api/resource/User?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="User"
                data-fieldname="assign_to"
              />
              {/* Link indicator */}
              {formData.assign_to && (
                <button
                  type="button"
                  onClick={() => handleChange('assign_to', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assign to Name</label>
            <input
              type="text"
              value={String(formData.assign_to_name ?? '')}
              onChange={e => handleChange('assign_to_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: section_break_10 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Next Due Date</label>
            <input
              type="date"
              value={String(formData.next_due_date ?? '')}
              onChange={e => handleChange('next_due_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Completion Date</label>
            <input
              type="date"
              value={String(formData.last_completion_date ?? '')}
              onChange={e => handleChange('last_completion_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: section_break_7 */}
      <div className="border rounded-lg p-4 space-y-4">
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