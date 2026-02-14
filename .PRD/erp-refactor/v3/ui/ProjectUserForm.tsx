// Form scaffold for Project User
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ProjectUser } from '../types/project-user.js';

interface ProjectUserFormProps {
  initialData?: Partial<ProjectUser>;
  onSubmit: (data: Partial<ProjectUser>) => void;
  mode: 'create' | 'edit';
}

export function ProjectUserForm({ initialData = {}, onSubmit, mode }: ProjectUserFormProps) {
  const [formData, setFormData] = useState<Partial<ProjectUser>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Project User' : 'New Project User'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">User (→ User)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search User..."
                value={String(formData.user ?? '')}
                onChange={e => {
                  handleChange('user', e.target.value);
                  // TODO: Implement async search for User
                  // fetch(`/api/resource/User?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="User"
                data-fieldname="user"
              />
              {/* Link indicator */}
              {formData.user && (
                <button
                  type="button"
                  onClick={() => handleChange('user', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="text"
              value={String(formData.email ?? '')}
              onChange={e => handleChange('email', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="text"
              value={String(formData.image ?? '')}
              onChange={e => handleChange('image', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={String(formData.full_name ?? '')}
              onChange={e => handleChange('full_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.welcome_email_sent}
              onChange={e => handleChange('welcome_email_sent', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Welcome email sent</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.view_attachments}
              onChange={e => handleChange('view_attachments', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">View attachments</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.hide_timesheets}
              onChange={e => handleChange('hide_timesheets', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Hide timesheets</label>
          </div>
      {/* Section: section_break_5 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {parent.doctype === 'Project Update' && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Project Status</label>
            <textarea
              value={String(formData.project_status ?? '')}
              onChange={e => handleChange('project_status', e.target.value)}
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