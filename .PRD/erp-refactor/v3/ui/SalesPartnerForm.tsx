// Form scaffold for Sales Partner
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SalesPartner } from '../types/sales-partner.js';

interface SalesPartnerFormProps {
  initialData?: Partial<SalesPartner>;
  onSubmit: (data: Partial<SalesPartner>) => void;
  mode: 'create' | 'edit';
}

export function SalesPartnerForm({ initialData = {}, onSubmit, mode }: SalesPartnerFormProps) {
  const [formData, setFormData] = useState<Partial<SalesPartner>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Sales Partner' : 'New Sales Partner'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Partner Name</label>
            <input
              type="text"
              value={String(formData.partner_name ?? '')}
              onChange={e => handleChange('partner_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Partner Type (→ Sales Partner Type)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Partner Type..."
                value={String(formData.partner_type ?? '')}
                onChange={e => {
                  handleChange('partner_type', e.target.value);
                  // TODO: Implement async search for Sales Partner Type
                  // fetch(`/api/resource/Sales Partner Type?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Partner Type"
                data-fieldname="partner_type"
              />
              {/* Link indicator */}
              {formData.partner_type && (
                <button
                  type="button"
                  onClick={() => handleChange('partner_type', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Territory (→ Territory)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Territory..."
                value={String(formData.territory ?? '')}
                onChange={e => {
                  handleChange('territory', e.target.value);
                  // TODO: Implement async search for Territory
                  // fetch(`/api/resource/Territory?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Territory"
                data-fieldname="territory"
              />
              {/* Link indicator */}
              {formData.territory && (
                <button
                  type="button"
                  onClick={() => handleChange('territory', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Commission Rate</label>
            <input
              type="number"
              step="any"
              value={formData.commission_rate != null ? Number(formData.commission_rate) : ''}
              onChange={e => handleChange('commission_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
      {/* Section: Address & Contacts */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Address & Contacts</h4>
        <div className="grid grid-cols-2 gap-4">
          {!!formData.__islocal && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address Desc</label>
            <textarea
              value={String(formData.address_desc ?? '')}
              onChange={e => handleChange('address_desc', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address HTML</label>
            <textarea
              value={String(formData.address_html ?? '')}
              onChange={e => handleChange('address_html', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.__islocal && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Contact Desc</label>
            <textarea
              value={String(formData.contact_desc ?? '')}
              onChange={e => handleChange('contact_desc', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Contact HTML</label>
            <textarea
              value={String(formData.contact_html ?? '')}
              onChange={e => handleChange('contact_html', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Sales Partner Target */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Sales Partner Target</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: targets → Target Detail */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Targets</label>
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
                  {(Array.isArray(formData.targets) ? (formData.targets as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.targets) ? formData.targets : [])];
                            rows.splice(idx, 1);
                            handleChange('targets', rows);
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
                  onClick={() => handleChange('targets', [...(Array.isArray(formData.targets) ? formData.targets : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Website */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Website</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.show_in_website}
              onChange={e => handleChange('show_in_website', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Show In Website</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Referral Code</label>
            <input
              type="text"
              value={String(formData.referral_code ?? '')}
              onChange={e => handleChange('referral_code', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: section_break_17 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Route</label>
            <input
              type="text"
              value={String(formData.route ?? '')}
              onChange={e => handleChange('route', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Logo</label>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Partner website</label>
            <input
              type="text"
              value={String(formData.partner_website ?? '')}
              onChange={e => handleChange('partner_website', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: section_break_22 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Introduction</label>
            <textarea
              value={String(formData.introduction ?? '')}
              onChange={e => handleChange('introduction', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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