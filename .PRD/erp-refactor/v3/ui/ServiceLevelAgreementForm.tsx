// Form scaffold for Service Level Agreement
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ServiceLevelAgreement } from '../types/service-level-agreement.js';

interface ServiceLevelAgreementFormProps {
  initialData?: Partial<ServiceLevelAgreement>;
  onSubmit: (data: Partial<ServiceLevelAgreement>) => void;
  mode: 'create' | 'edit';
}

export function ServiceLevelAgreementForm({ initialData = {}, onSubmit, mode }: ServiceLevelAgreementFormProps) {
  const [formData, setFormData] = useState<Partial<ServiceLevelAgreement>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Service Level Agreement' : 'New Service Level Agreement'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Apply On (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.document_type ?? '')}
                onChange={e => {
                  handleChange('document_type', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="document_type"
              />
              {/* Link indicator */}
              {formData.document_type && (
                <button
                  type="button"
                  onClick={() => handleChange('document_type', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Priority (→ Issue Priority)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Issue Priority..."
                value={String(formData.default_priority ?? '')}
                onChange={e => {
                  handleChange('default_priority', e.target.value);
                  // TODO: Implement async search for Issue Priority
                  // fetch(`/api/resource/Issue Priority?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Issue Priority"
                data-fieldname="default_priority"
              />
              {/* Link indicator */}
              {formData.default_priority && (
                <button
                  type="button"
                  onClick={() => handleChange('default_priority', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Level Name</label>
            <input
              type="text"
              value={String(formData.service_level ?? '')}
              onChange={e => handleChange('service_level', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.enabled}
              onChange={e => handleChange('enabled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Enabled</label>
          </div>
      {/* Section: Assignment Conditions */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Assignment Conditions</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.default_service_level_agreement}
              onChange={e => handleChange('default_service_level_agreement', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Default Service Level Agreement</label>
          </div>
          {!formData.default_service_level_agreement && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Entity Type</label>
            <select
              value={String(formData.entity_type ?? '')}
              onChange={e => handleChange('entity_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Customer">Customer</option>
              <option value="Customer Group">Customer Group</option>
              <option value="Territory">Territory</option>
            </select>
          </div>
          )}
          {!formData.default_service_level_agreement && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Entity</label>
            <input
              type="text"
              value={String(formData.entity ?? '')}
              onChange={e => handleChange('entity', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!formData.default_service_level_agreement && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Condition</label>
            <textarea
              value={String(formData.condition ?? '')}
              onChange={e => handleChange('condition', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Valid From */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Valid From</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={String(formData.start_date ?? '')}
              onChange={e => handleChange('start_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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
        </div>
      </div>
      {/* Section: Response and Resolution */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Response and Resolution</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.apply_sla_for_resolution}
              onChange={e => handleChange('apply_sla_for_resolution', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Apply SLA for Resolution Time</label>
          </div>
          {/* Child table: priorities → Service Level Priority */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Priorities</label>
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
                  {(Array.isArray(formData.priorities) ? (formData.priorities as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.priorities) ? formData.priorities : [])];
                            rows.splice(idx, 1);
                            handleChange('priorities', rows);
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
                  onClick={() => handleChange('priorities', [...(Array.isArray(formData.priorities) ? formData.priorities : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Status Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Status Details</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: sla_fulfilled_on → SLA Fulfilled On Status */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">SLA Fulfilled On</label>
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
                  {(Array.isArray(formData.sla_fulfilled_on) ? (formData.sla_fulfilled_on as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.sla_fulfilled_on) ? formData.sla_fulfilled_on : [])];
                            rows.splice(idx, 1);
                            handleChange('sla_fulfilled_on', rows);
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
                  onClick={() => handleChange('sla_fulfilled_on', [...(Array.isArray(formData.sla_fulfilled_on) ? formData.sla_fulfilled_on : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          {/* Child table: pause_sla_on → Pause SLA On Status */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">SLA Paused On</label>
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
                  {(Array.isArray(formData.pause_sla_on) ? (formData.pause_sla_on as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.pause_sla_on) ? formData.pause_sla_on : [])];
                            rows.splice(idx, 1);
                            handleChange('pause_sla_on', rows);
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
                  onClick={() => handleChange('pause_sla_on', [...(Array.isArray(formData.pause_sla_on) ? formData.pause_sla_on : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Working Hours */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Working Hours</h4>
        <div className="grid grid-cols-2 gap-4">
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
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
          {/* Child table: support_and_resolution → Service Day */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Working Hours</label>
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
                  {(Array.isArray(formData.support_and_resolution) ? (formData.support_and_resolution as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.support_and_resolution) ? formData.support_and_resolution : [])];
                            rows.splice(idx, 1);
                            handleChange('support_and_resolution', rows);
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
                  onClick={() => handleChange('support_and_resolution', [...(Array.isArray(formData.support_and_resolution) ? formData.support_and_resolution : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
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