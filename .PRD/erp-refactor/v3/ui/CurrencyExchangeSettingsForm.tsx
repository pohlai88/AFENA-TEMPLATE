// Form scaffold for Currency Exchange Settings
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { CurrencyExchangeSettings } from '../types/currency-exchange-settings.js';

interface CurrencyExchangeSettingsFormProps {
  initialData?: Partial<CurrencyExchangeSettings>;
  onSubmit: (data: Partial<CurrencyExchangeSettings>) => void;
  mode: 'create' | 'edit';
}

export function CurrencyExchangeSettingsForm({ initialData = {}, onSubmit, mode }: CurrencyExchangeSettingsFormProps) {
  const [formData, setFormData] = useState<Partial<CurrencyExchangeSettings>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Currency Exchange Settings' : 'New Currency Exchange Settings'}</h2>
      {/* Section: API Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">API Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.disabled}
              onChange={e => handleChange('disabled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Disabled</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Provider</label>
            <select
              value={String(formData.service_provider ?? '')}
              onChange={e => handleChange('service_provider', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="frankfurter.dev">frankfurter.dev</option>
              <option value="exchangerate.host">exchangerate.host</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">API Endpoint</label>
            <input
              type="text"
              value={String(formData.api_endpoint ?? '')}
              onChange={e => handleChange('api_endpoint', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          {formData.service_provider !== "Custom" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.use_http}
              onChange={e => handleChange('use_http', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Use HTTP Protocol</label>
          </div>
          )}
          {formData.service_provider === 'exchangerate.host'; && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Access Key</label>
            <input
              type="text"
              value={String(formData.access_key ?? '')}
              onChange={e => handleChange('access_key', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Example URL</label>
            <input
              type="text"
              value={String(formData.url ?? '')}
              onChange={e => handleChange('url', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Help</label>
            <textarea
              value={String(formData.help ?? '')}
              onChange={e => handleChange('help', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Request Parameters */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Request Parameters</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: req_params → Currency Exchange Settings Details */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Parameters</label>
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
                  {(Array.isArray(formData.req_params) ? (formData.req_params as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.req_params) ? formData.req_params : [])];
                            rows.splice(idx, 1);
                            handleChange('req_params', rows);
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
                  onClick={() => handleChange('req_params', [...(Array.isArray(formData.req_params) ? formData.req_params : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          {/* Child table: result_key → Currency Exchange Settings Result */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Result Key</label>
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
                  {(Array.isArray(formData.result_key) ? (formData.result_key as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.result_key) ? formData.result_key : [])];
                            rows.splice(idx, 1);
                            handleChange('result_key', rows);
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
                  onClick={() => handleChange('result_key', [...(Array.isArray(formData.result_key) ? formData.result_key : []), {}])}
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