// Form scaffold for Sales Invoice Timesheet
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SalesInvoiceTimesheet } from '../types/sales-invoice-timesheet.js';

interface SalesInvoiceTimesheetFormProps {
  initialData?: Partial<SalesInvoiceTimesheet>;
  onSubmit: (data: Partial<SalesInvoiceTimesheet>) => void;
  mode: 'create' | 'edit';
}

export function SalesInvoiceTimesheetForm({ initialData = {}, onSubmit, mode }: SalesInvoiceTimesheetFormProps) {
  const [formData, setFormData] = useState<Partial<SalesInvoiceTimesheet>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Sales Invoice Timesheet' : 'New Sales Invoice Timesheet'}</h2>
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
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={String(formData.description ?? '')}
              onChange={e => handleChange('description', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: Time */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Time</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From Time</label>
            <input
              type="datetime-local"
              value={String(formData.from_time ?? '')}
              onChange={e => handleChange('from_time', e.target.value)}
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
        </div>
      </div>
      {/* Section: Totals */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Totals</h4>
        <div className="grid grid-cols-2 gap-4">
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
        </div>
      </div>
      {/* Section: Reference */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Reference</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Time Sheet (→ Timesheet)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Timesheet..."
                value={String(formData.time_sheet ?? '')}
                onChange={e => {
                  handleChange('time_sheet', e.target.value);
                  // TODO: Implement async search for Timesheet
                  // fetch(`/api/resource/Timesheet?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Timesheet"
                data-fieldname="time_sheet"
              />
              {/* Link indicator */}
              {formData.time_sheet && (
                <button
                  type="button"
                  onClick={() => handleChange('time_sheet', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Timesheet Detail</label>
            <input
              type="text"
              value={String(formData.timesheet_detail ?? '')}
              onChange={e => handleChange('timesheet_detail', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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