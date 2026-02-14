// Form scaffold for Task
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { Task } from '../types/task.js';

interface TaskFormProps {
  initialData?: Partial<Task>;
  onSubmit: (data: Partial<Task>) => void;
  mode: 'create' | 'edit';
}

export function TaskForm({ initialData = {}, onSubmit, mode }: TaskFormProps) {
  const [formData, setFormData] = useState<Partial<Task>>(initialData);

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
        {mode === 'edit' ? formData.subject ?? 'Task' : 'New Task'}
      </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              value={String(formData.subject ?? '')}
              onChange={e => handleChange('subject', e.target.value)}
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Issue (→ Issue)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Issue..."
                value={String(formData.issue ?? '')}
                onChange={e => {
                  handleChange('issue', e.target.value);
                  // TODO: Implement async search for Issue
                  // fetch(`/api/resource/Issue?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Issue"
                data-fieldname="issue"
              />
              {/* Link indicator */}
              {formData.issue && (
                <button
                  type="button"
                  onClick={() => handleChange('issue', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type (→ Task Type)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Task Type..."
                value={String(formData.type ?? '')}
                onChange={e => {
                  handleChange('type', e.target.value);
                  // TODO: Implement async search for Task Type
                  // fetch(`/api/resource/Task Type?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Task Type"
                data-fieldname="type"
              />
              {/* Link indicator */}
              {formData.type && (
                <button
                  type="button"
                  onClick={() => handleChange('type', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <input
              type="color"
              value={String(formData.color ?? '#000000')}
              onChange={e => handleChange('color', e.target.value)}
              className="mt-1 h-10 w-20"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_group}
              onChange={e => handleChange('is_group', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Group</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_template}
              onChange={e => handleChange('is_template', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Template</label>
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
              <option value="Working">Working</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Overdue">Overdue</option>
              <option value="Template">Template</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={String(formData.priority ?? '')}
              onChange={e => handleChange('priority', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Weight</label>
            <input
              type="number"
              step="any"
              value={formData.task_weight != null ? Number(formData.task_weight) : ''}
              onChange={e => handleChange('task_weight', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Parent Task (→ Task)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Task..."
                value={String(formData.parent_task ?? '')}
                onChange={e => {
                  handleChange('parent_task', e.target.value);
                  // TODO: Implement async search for Task
                  // fetch(`/api/resource/Task?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Task"
                data-fieldname="parent_task"
              />
              {/* Link indicator */}
              {formData.parent_task && (
                <button
                  type="button"
                  onClick={() => handleChange('parent_task', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {formData.status === "Completed" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Completed By (→ User)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search User..."
                value={String(formData.completed_by ?? '')}
                onChange={e => {
                  handleChange('completed_by', e.target.value);
                  // TODO: Implement async search for User
                  // fetch(`/api/resource/User?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="User"
                data-fieldname="completed_by"
              />
              {/* Link indicator */}
              {formData.completed_by && (
                <button
                  type="button"
                  onClick={() => handleChange('completed_by', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.status === "Completed" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Completed On</label>
            <input
              type="date"
              value={String(formData.completed_on ?? '')}
              onChange={e => handleChange('completed_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
      {/* Section: Timeline */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Timeline</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Expected Start Date</label>
            <input
              type="datetime-local"
              value={String(formData.exp_start_date ?? '')}
              onChange={e => handleChange('exp_start_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expected Time (in hours)</label>
            <input
              type="number"
              step="any"
              value={formData.expected_time != null ? Number(formData.expected_time) : ''}
              onChange={e => handleChange('expected_time', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.is_template && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Begin On (Days)</label>
            <input
              type="number"
              step="1"
              value={formData.start != null ? Number(formData.start) : ''}
              onChange={e => handleChange('start', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Expected End Date</label>
            <input
              type="datetime-local"
              value={String(formData.exp_end_date ?? '')}
              onChange={e => handleChange('exp_end_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">% Progress</label>
            <input
              type="number"
              step="any"
              value={formData.progress != null ? Number(formData.progress) : ''}
              onChange={e => handleChange('progress', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.is_template && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (Days)</label>
            <input
              type="number"
              step="1"
              value={formData.duration != null ? Number(formData.duration) : ''}
              onChange={e => handleChange('duration', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_milestone}
              onChange={e => handleChange('is_milestone', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Milestone</label>
          </div>
        </div>
      </div>
      {/* Section: Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Task Description</label>
            <textarea
              value={String(formData.description ?? '')}
              onChange={e => handleChange('description', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Dependencies */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Dependencies</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: depends_on → Task Depends On */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Dependent Tasks</label>
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
                  {(Array.isArray(formData.depends_on) ? (formData.depends_on as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.depends_on) ? formData.depends_on : [])];
                            rows.splice(idx, 1);
                            handleChange('depends_on', rows);
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
                  onClick={() => handleChange('depends_on', [...(Array.isArray(formData.depends_on) ? formData.depends_on : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Depends on Tasks</label>
            <textarea
              value={String(formData.depends_on_tasks ?? '')}
              onChange={e => handleChange('depends_on_tasks', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: sb_actual */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Actual Start Date (via Timesheet)</label>
            <input
              type="date"
              value={String(formData.act_start_date ?? '')}
              onChange={e => handleChange('act_start_date', e.target.value)}
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
              value={String(formData.act_end_date ?? '')}
              onChange={e => handleChange('act_end_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Costing */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Costing</h4>
        <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-gray-700">Total Billable Amount (via Timesheet)</label>
            <input
              type="number"
              step="any"
              value={formData.total_billing_amount != null ? Number(formData.total_billing_amount) : ''}
              onChange={e => handleChange('total_billing_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: More Info */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">More Info</h4>
        <div className="grid grid-cols-2 gap-4">
          {formData.status === "Closed" || formData.status === "Pending Review" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Review Date</label>
            <input
              type="date"
              value={String(formData.review_date ?? '')}
              onChange={e => handleChange('review_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.status === "Closed" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Closing Date</label>
            <input
              type="date"
              value={String(formData.closing_date ?? '')}
              onChange={e => handleChange('closing_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
            <label className="block text-sm font-medium text-gray-700">lft</label>
            <input
              type="number"
              step="1"
              value={formData.lft != null ? Number(formData.lft) : ''}
              onChange={e => handleChange('lft', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">rgt</label>
            <input
              type="number"
              step="1"
              value={formData.rgt != null ? Number(formData.rgt) : ''}
              onChange={e => handleChange('rgt', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Old Parent</label>
            <input
              type="text"
              value={String(formData.old_parent ?? '')}
              onChange={e => handleChange('old_parent', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Template Task</label>
            <input
              type="text"
              value={String(formData.template_task ?? '')}
              onChange={e => handleChange('template_task', e.target.value)}
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