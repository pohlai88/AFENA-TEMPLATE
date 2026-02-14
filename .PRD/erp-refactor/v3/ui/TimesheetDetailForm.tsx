// Form scaffold for Timesheet Detail
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { TimesheetDetail } from '../types/timesheet-detail.js';

interface TimesheetDetailFormProps {
  initialData?: Partial<TimesheetDetail>;
  onSubmit: (data: Partial<TimesheetDetail>) => void;
  mode: 'create' | 'edit';
}

export function TimesheetDetailForm({ initialData = {}, onSubmit, mode }: TimesheetDetailFormProps) {
  const [formData, setFormData] = useState<Partial<TimesheetDetail>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Timesheet Detail' : 'New Timesheet Detail'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Activity Type (→ Activity Type)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Activity Type..."
                value={String(formData.activity_type ?? '')}
                onChange={e => {
                  handleChange('activity_type', e.target.value);
                  // TODO: Implement async search for Activity Type
                  // fetch(`/api/resource/Activity Type?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Activity Type"
                data-fieldname="activity_type"
              />
              {/* Link indicator */}
              {formData.activity_type && (
                <button
                  type="button"
                  onClick={() => handleChange('activity_type', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">From Time</label>
            <input
              type="datetime-local"
              value={String(formData.from_time ?? '')}
              onChange={e => handleChange('from_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
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
            <label className="block text-sm font-medium text-gray-700">Expected Hrs</label>
            <input
              type="number"
              step="any"
              value={formData.expected_hours != null ? Number(formData.expected_hours) : ''}
              onChange={e => handleChange('expected_hours', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Time</label>
            <input
              type="datetime-local"
              value={String(formData.to_time ?? '')}
              onChange={e => handleChange('to_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hrs</label>
            <input
              type="number"
              step="any"
              value={formData.hours != null ? Number(formData.hours) : ''}
              onChange={e => handleChange('hours', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.completed}
              onChange={e => handleChange('completed', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Completed</label>
          </div>
      {/* Section: project_details */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Name</label>
            <input
              type="text"
              value={String(formData.project_name ?? '')}
              onChange={e => handleChange('project_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Task (→ Task)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Task..."
                value={String(formData.task ?? '')}
                onChange={e => {
                  handleChange('task', e.target.value);
                  // TODO: Implement async search for Task
                  // fetch(`/api/resource/Task?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Task"
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
        </div>
      </div>
      {/* Section: section_break_6 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_billable}
              onChange={e => handleChange('is_billable', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Billable</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Invoice (→ Sales Invoice)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Invoice..."
                value={String(formData.sales_invoice ?? '')}
                onChange={e => {
                  handleChange('sales_invoice', e.target.value);
                  // TODO: Implement async search for Sales Invoice
                  // fetch(`/api/resource/Sales Invoice?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Invoice"
                data-fieldname="sales_invoice"
              />
              {/* Link indicator */}
              {formData.sales_invoice && (
                <button
                  type="button"
                  onClick={() => handleChange('sales_invoice', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {!!formData.is_billable && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Billing Hours</label>
            <input
              type="number"
              step="any"
              value={formData.billing_hours != null ? Number(formData.billing_hours) : ''}
              onChange={e => handleChange('billing_hours', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: section_break_11 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Billing Rate</label>
            <input
              type="number"
              step="any"
              value={formData.base_billing_rate != null ? Number(formData.base_billing_rate) : ''}
              onChange={e => handleChange('base_billing_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Billing Amount</label>
            <input
              type="number"
              step="any"
              value={formData.base_billing_amount != null ? Number(formData.base_billing_amount) : ''}
              onChange={e => handleChange('base_billing_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Costing Rate</label>
            <input
              type="number"
              step="any"
              value={formData.base_costing_rate != null ? Number(formData.base_costing_rate) : ''}
              onChange={e => handleChange('base_costing_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Costing Amount</label>
            <input
              type="number"
              step="any"
              value={formData.base_costing_amount != null ? Number(formData.base_costing_amount) : ''}
              onChange={e => handleChange('base_costing_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Billing Rate</label>
            <input
              type="number"
              step="any"
              value={formData.billing_rate != null ? Number(formData.billing_rate) : ''}
              onChange={e => handleChange('billing_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Billing Amount</label>
            <input
              type="number"
              step="any"
              value={formData.billing_amount != null ? Number(formData.billing_amount) : ''}
              onChange={e => handleChange('billing_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Costing Rate</label>
            <input
              type="number"
              step="any"
              value={formData.costing_rate != null ? Number(formData.costing_rate) : ''}
              onChange={e => handleChange('costing_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Costing Amount</label>
            <input
              type="number"
              step="any"
              value={formData.costing_amount != null ? Number(formData.costing_amount) : ''}
              onChange={e => handleChange('costing_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
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