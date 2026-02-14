// Form scaffold for Project
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { Project } from '../types/project.js';

interface ProjectFormProps {
  initialData?: Partial<Project>;
  onSubmit: (data: Partial<Project>) => void;
  mode: 'create' | 'edit';
}

export function ProjectForm({ initialData = {}, onSubmit, mode }: ProjectFormProps) {
  const [formData, setFormData] = useState<Partial<Project>>(initialData);

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
        {mode === 'edit' ? formData.project_name ?? 'Project' : 'New Project'}
      </h2>
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
            <label className="block text-sm font-medium text-gray-700">Project Name</label>
            <input
              type="text"
              value={String(formData.project_name ?? '')}
              onChange={e => handleChange('project_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Type (→ Project Type)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Project Type..."
                value={String(formData.project_type ?? '')}
                onChange={e => {
                  handleChange('project_type', e.target.value);
                  // TODO: Implement async search for Project Type
                  // fetch(`/api/resource/Project Type?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Project Type"
                data-fieldname="project_type"
              />
              {/* Link indicator */}
              {formData.project_type && (
                <button
                  type="button"
                  onClick={() => handleChange('project_type', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Is Active</label>
            <select
              value={String(formData.is_active ?? '')}
              onChange={e => handleChange('is_active', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">% Complete Method</label>
            <select
              value={String(formData.percent_complete_method ?? '')}
              onChange={e => handleChange('percent_complete_method', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Manual">Manual</option>
              <option value="Task Completion">Task Completion</option>
              <option value="Task Progress">Task Progress</option>
              <option value="Task Weight">Task Weight</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">% Completed</label>
            <input
              type="number"
              step="any"
              value={formData.percent_complete != null ? Number(formData.percent_complete) : ''}
              onChange={e => handleChange('percent_complete', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">From Template (→ Project Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Project Template..."
                value={String(formData.project_template ?? '')}
                onChange={e => {
                  handleChange('project_template', e.target.value);
                  // TODO: Implement async search for Project Template
                  // fetch(`/api/resource/Project Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Project Template"
                data-fieldname="project_template"
              />
              {/* Link indicator */}
              {formData.project_template && (
                <button
                  type="button"
                  onClick={() => handleChange('project_template', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expected Start Date</label>
            <input
              type="date"
              value={String(formData.expected_start_date ?? '')}
              onChange={e => handleChange('expected_start_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expected End Date</label>
            <input
              type="date"
              value={String(formData.expected_end_date ?? '')}
              onChange={e => handleChange('expected_end_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={String(formData.priority ?? '')}
              onChange={e => handleChange('priority', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department (→ Department)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Department..."
                value={String(formData.department ?? '')}
                onChange={e => {
                  handleChange('department', e.target.value);
                  // TODO: Implement async search for Department
                  // fetch(`/api/resource/Department?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Department"
                data-fieldname="department"
              />
              {/* Link indicator */}
              {formData.department && (
                <button
                  type="button"
                  onClick={() => handleChange('department', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
      {/* Section: Customer Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Customer Details</h4>
        <div className="grid grid-cols-2 gap-4">
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
        </div>
      </div>
      {/* Section: Users */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Users</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: users → Project User */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Users</label>
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
                  {(Array.isArray(formData.users) ? (formData.users as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.users) ? formData.users : [])];
                            rows.splice(idx, 1);
                            handleChange('users', rows);
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
                  onClick={() => handleChange('users', [...(Array.isArray(formData.users) ? formData.users : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Copied From</label>
            <input
              type="text"
              value={String(formData.copied_from ?? '')}
              onChange={e => handleChange('copied_from', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Notes */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Notes</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={String(formData.notes ?? '')}
              onChange={e => handleChange('notes', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Start and End Dates */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Start and End Dates</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Actual Start Date (via Timesheet)</label>
            <input
              type="date"
              value={String(formData.actual_start_date ?? '')}
              onChange={e => handleChange('actual_start_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Actual Time in Hours (via Timesheet)</label>
            <input
              type="number"
              step="any"
              value={formData.actual_time != null ? Number(formData.actual_time) : ''}
              onChange={e => handleChange('actual_time', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Actual End Date (via Timesheet)</label>
            <input
              type="date"
              value={String(formData.actual_end_date ?? '')}
              onChange={e => handleChange('actual_end_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Costing and Billing */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Costing and Billing</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Estimated Cost</label>
            <input
              type="number"
              step="any"
              value={formData.estimated_costing != null ? Number(formData.estimated_costing) : ''}
              onChange={e => handleChange('estimated_costing', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Costing Amount (via Timesheet)</label>
            <input
              type="number"
              step="any"
              value={formData.total_costing_amount != null ? Number(formData.total_costing_amount) : ''}
              onChange={e => handleChange('total_costing_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Purchase Cost (via Purchase Invoice)</label>
            <input
              type="number"
              step="any"
              value={formData.total_purchase_cost != null ? Number(formData.total_purchase_cost) : ''}
              onChange={e => handleChange('total_purchase_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
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
            <label className="block text-sm font-medium text-gray-700">Total Sales Amount (via Sales Order)</label>
            <input
              type="number"
              step="any"
              value={formData.total_sales_amount != null ? Number(formData.total_sales_amount) : ''}
              onChange={e => handleChange('total_sales_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Billable Amount (via Timesheet)</label>
            <input
              type="number"
              step="any"
              value={formData.total_billable_amount != null ? Number(formData.total_billable_amount) : ''}
              onChange={e => handleChange('total_billable_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Billed Amount (via Sales Invoice)</label>
            <input
              type="number"
              step="any"
              value={formData.total_billed_amount != null ? Number(formData.total_billed_amount) : ''}
              onChange={e => handleChange('total_billed_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Consumed Material Cost (via Stock Entry)</label>
            <input
              type="number"
              step="any"
              value={formData.total_consumed_material_cost != null ? Number(formData.total_consumed_material_cost) : ''}
              onChange={e => handleChange('total_consumed_material_cost', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Cost Center (→ Cost Center)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Cost Center..."
                value={String(formData.cost_center ?? '')}
                onChange={e => {
                  handleChange('cost_center', e.target.value);
                  // TODO: Implement async search for Cost Center
                  // fetch(`/api/resource/Cost Center?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Cost Center"
                data-fieldname="cost_center"
              />
              {/* Link indicator */}
              {formData.cost_center && (
                <button
                  type="button"
                  onClick={() => handleChange('cost_center', '')}
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
            <label className="block text-sm font-medium text-gray-700">Gross Margin</label>
            <input
              type="number"
              step="any"
              value={formData.gross_margin != null ? Number(formData.gross_margin) : ''}
              onChange={e => handleChange('gross_margin', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gross Margin %</label>
            <input
              type="number"
              step="any"
              value={formData.per_gross_margin != null ? Number(formData.per_gross_margin) : ''}
              onChange={e => handleChange('per_gross_margin', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Monitor Progress */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Monitor Progress</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.collect_progress}
              onChange={e => handleChange('collect_progress', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Collect Progress</label>
          </div>
          {!!formData.collect_progress && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Holiday List (→ Holiday List)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Holiday List..."
                value={String(formData.holiday_list ?? '')}
                onChange={e => {
                  handleChange('holiday_list', e.target.value);
                  // TODO: Implement async search for Holiday List
                  // fetch(`/api/resource/Holiday List?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Holiday List"
                data-fieldname="holiday_list"
              />
              {/* Link indicator */}
              {formData.holiday_list && (
                <button
                  type="button"
                  onClick={() => handleChange('holiday_list', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.collect_progress === true && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Frequency To Collect Progress</label>
            <select
              value={String(formData.frequency ?? '')}
              onChange={e => handleChange('frequency', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Hourly">Hourly</option>
              <option value="Twice Daily">Twice Daily</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>
          )}
          {(formData.frequency === "Hourly" && formData.collect_progress) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">From Time</label>
            <input
              type="time"
              value={String(formData.from_time ?? '')}
              onChange={e => handleChange('from_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {(formData.frequency === "Hourly" && formData.collect_progress) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">To Time</label>
            <input
              type="time"
              value={String(formData.to_time ?? '')}
              onChange={e => handleChange('to_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {(formData.frequency === "Twice Daily" && formData.collect_progress === true) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">First Email</label>
            <input
              type="time"
              value={String(formData.first_email ?? '')}
              onChange={e => handleChange('first_email', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {(formData.frequency === "Twice Daily" && formData.collect_progress === true) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Second Email</label>
            <input
              type="time"
              value={String(formData.second_email ?? '')}
              onChange={e => handleChange('second_email', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {(formData.frequency === "Daily" && formData.collect_progress === true) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Daily Time to send</label>
            <input
              type="time"
              value={String(formData.daily_time_to_send ?? '')}
              onChange={e => handleChange('daily_time_to_send', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {(formData.frequency === "Weekly" && formData.collect_progress === true) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Day to Send</label>
            <select
              value={String(formData.day_to_send ?? '')}
              onChange={e => handleChange('day_to_send', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
          )}
          {(formData.frequency === "Weekly" && formData.collect_progress === true) && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Weekly Time to send</label>
            <input
              type="time"
              value={String(formData.weekly_time_to_send ?? '')}
              onChange={e => handleChange('weekly_time_to_send', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.collect_progress && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              value={String(formData.subject ?? '')}
              onChange={e => handleChange('subject', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.collect_progress && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={String(formData.message ?? '')}
              onChange={e => handleChange('message', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
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