// Form scaffold for Global Defaults
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { GlobalDefaults } from '../types/global-defaults.js';

interface GlobalDefaultsFormProps {
  initialData?: Partial<GlobalDefaults>;
  onSubmit: (data: Partial<GlobalDefaults>) => void;
  mode: 'create' | 'edit';
}

export function GlobalDefaultsForm({ initialData = {}, onSubmit, mode }: GlobalDefaultsFormProps) {
  const [formData, setFormData] = useState<Partial<GlobalDefaults>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Global Defaults' : 'New Global Defaults'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Company (→ Company)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Company..."
                value={String(formData.default_company ?? '')}
                onChange={e => {
                  handleChange('default_company', e.target.value);
                  // TODO: Implement async search for Company
                  // fetch(`/api/resource/Company?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Company"
                data-fieldname="default_company"
              />
              {/* Link indicator */}
              {formData.default_company && (
                <button
                  type="button"
                  onClick={() => handleChange('default_company', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country (→ Country)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Country..."
                value={String(formData.country ?? '')}
                onChange={e => {
                  handleChange('country', e.target.value);
                  // TODO: Implement async search for Country
                  // fetch(`/api/resource/Country?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Country"
                data-fieldname="country"
              />
              {/* Link indicator */}
              {formData.country && (
                <button
                  type="button"
                  onClick={() => handleChange('country', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Distance Unit (→ UOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UOM..."
                value={String(formData.default_distance_unit ?? '')}
                onChange={e => {
                  handleChange('default_distance_unit', e.target.value);
                  // TODO: Implement async search for UOM
                  // fetch(`/api/resource/UOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="UOM"
                data-fieldname="default_distance_unit"
              />
              {/* Link indicator */}
              {formData.default_distance_unit && (
                <button
                  type="button"
                  onClick={() => handleChange('default_distance_unit', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Currency (→ Currency)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Currency..."
                value={String(formData.default_currency ?? '')}
                onChange={e => {
                  handleChange('default_currency', e.target.value);
                  // TODO: Implement async search for Currency
                  // fetch(`/api/resource/Currency?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Currency"
                data-fieldname="default_currency"
              />
              {/* Link indicator */}
              {formData.default_currency && (
                <button
                  type="button"
                  onClick={() => handleChange('default_currency', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hide Currency Symbol</label>
            <select
              value={String(formData.hide_currency_symbol ?? '')}
              onChange={e => handleChange('hide_currency_symbol', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.disable_rounded_total}
              onChange={e => handleChange('disable_rounded_total', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Disable Rounded Total</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.disable_in_words}
              onChange={e => handleChange('disable_in_words', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Disable In Words</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.use_posting_datetime_for_naming_documents}
              onChange={e => handleChange('use_posting_datetime_for_naming_documents', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Use Posting Datetime for Naming Documents</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Demo Company (→ Company)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Company..."
                value={String(formData.demo_company ?? '')}
                onChange={e => {
                  handleChange('demo_company', e.target.value);
                  // TODO: Implement async search for Company
                  // fetch(`/api/resource/Company?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Company"
                data-fieldname="demo_company"
              />
              {/* Link indicator */}
              {formData.demo_company && (
                <button
                  type="button"
                  onClick={() => handleChange('demo_company', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
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