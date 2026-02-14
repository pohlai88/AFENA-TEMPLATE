// Form scaffold for Support Search Source
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SupportSearchSource } from '../types/support-search-source.js';

interface SupportSearchSourceFormProps {
  initialData?: Partial<SupportSearchSource>;
  onSubmit: (data: Partial<SupportSearchSource>) => void;
  mode: 'create' | 'edit';
}

export function SupportSearchSourceForm({ initialData = {}, onSubmit, mode }: SupportSearchSourceFormProps) {
  const [formData, setFormData] = useState<Partial<SupportSearchSource>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Support Search Source' : 'New Support Search Source'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Source Name</label>
            <input
              type="text"
              value={String(formData.source_name ?? '')}
              onChange={e => handleChange('source_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Source Type</label>
            <select
              value={String(formData.source_type ?? '')}
              onChange={e => handleChange('source_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="API">API</option>
              <option value="Link">Link</option>
            </select>
          </div>
      {/* Section: API */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">API</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Base URL</label>
            <input
              type="text"
              value={String(formData.base_url ?? '')}
              onChange={e => handleChange('base_url', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Query Options */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Query Options</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Query Route String</label>
            <input
              type="text"
              value={String(formData.query_route ?? '')}
              onChange={e => handleChange('query_route', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Search Term Param Name</label>
            <input
              type="text"
              value={String(formData.search_term_param_name ?? '')}
              onChange={e => handleChange('search_term_param_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Response Options */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Response Options</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Response Result Key Path</label>
            <input
              type="text"
              value={String(formData.response_result_key_path ?? '')}
              onChange={e => handleChange('response_result_key_path', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Post Route String</label>
            <input
              type="text"
              value={String(formData.post_route ?? '')}
              onChange={e => handleChange('post_route', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Post Route Key List</label>
            <input
              type="text"
              value={String(formData.post_route_key_list ?? '')}
              onChange={e => handleChange('post_route_key_list', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Post Title Key</label>
            <input
              type="text"
              value={String(formData.post_title_key ?? '')}
              onChange={e => handleChange('post_title_key', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Post Description Key</label>
            <input
              type="text"
              value={String(formData.post_description_key ?? '')}
              onChange={e => handleChange('post_description_key', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Link Options */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Link Options</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Source DocType (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.source_doctype ?? '')}
                onChange={e => {
                  handleChange('source_doctype', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="source_doctype"
              />
              {/* Link indicator */}
              {formData.source_doctype && (
                <button
                  type="button"
                  onClick={() => handleChange('source_doctype', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Result Title Field</label>
            <input
              type="text"
              value={String(formData.result_title_field ?? '')}
              onChange={e => handleChange('result_title_field', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Result Preview Field</label>
            <input
              type="text"
              value={String(formData.result_preview_field ?? '')}
              onChange={e => handleChange('result_preview_field', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Result Route Field</label>
            <input
              type="text"
              value={String(formData.result_route_field ?? '')}
              onChange={e => handleChange('result_route_field', e.target.value)}
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