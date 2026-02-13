// Form scaffold for Projects Settings
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ProjectsSettings } from '../types/projects-settings.js';

interface ProjectsSettingsFormProps {
  initialData?: Partial<ProjectsSettings>;
  onSubmit: (data: Partial<ProjectsSettings>) => void;
  mode: 'create' | 'edit';
}

export function ProjectsSettingsForm({ initialData = {}, onSubmit, mode }: ProjectsSettingsFormProps) {
  const [formData, setFormData] = useState<Partial<ProjectsSettings>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Projects Settings' : 'New Projects Settings'}</h2>
      {/* Section: Timesheets */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Timesheets</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.ignore_workstation_time_overlap}
              onChange={e => handleChange('ignore_workstation_time_overlap', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Ignore Workstation Time Overlap</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.ignore_user_time_overlap}
              onChange={e => handleChange('ignore_user_time_overlap', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Ignore User Time Overlap</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.ignore_employee_time_overlap}
              onChange={e => handleChange('ignore_employee_time_overlap', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Ignore Employee Time Overlap</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.fetch_timesheet_in_sales_invoice}
              onChange={e => handleChange('fetch_timesheet_in_sales_invoice', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Fetch Timesheet in Sales Invoice</label>
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