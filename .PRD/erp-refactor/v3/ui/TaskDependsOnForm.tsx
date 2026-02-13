// Form scaffold for Task Depends On
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { TaskDependsOn } from '../types/task-depends-on.js';

interface TaskDependsOnFormProps {
  initialData?: Partial<TaskDependsOn>;
  onSubmit: (data: Partial<TaskDependsOn>) => void;
  mode: 'create' | 'edit';
}

export function TaskDependsOnForm({ initialData = {}, onSubmit, mode }: TaskDependsOnFormProps) {
  const [formData, setFormData] = useState<Partial<TaskDependsOn>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Task Depends On' : 'New Task Depends On'}</h2>
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
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <textarea
              value={String(formData.subject ?? '')}
              onChange={e => handleChange('subject', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Project</label>
            <textarea
              value={String(formData.project ?? '')}
              onChange={e => handleChange('project', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}