// Form scaffold for Packing Slip
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { PackingSlip } from '../types/packing-slip.js';

interface PackingSlipFormProps {
  initialData?: Partial<PackingSlip>;
  onSubmit: (data: Partial<PackingSlip>) => void;
  mode: 'create' | 'edit';
}

export function PackingSlipForm({ initialData = {}, onSubmit, mode }: PackingSlipFormProps) {
  const [formData, setFormData] = useState<Partial<PackingSlip>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Packing Slip' : 'New Packing Slip'}</h2>
      {/* Section: packing_slip_details */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery Note (→ Delivery Note)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Delivery Note..."
                value={String(formData.delivery_note ?? '')}
                onChange={e => {
                  handleChange('delivery_note', e.target.value);
                  // TODO: Implement async search for Delivery Note
                  // fetch(`/api/resource/Delivery Note?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Delivery Note"
                data-fieldname="delivery_note"
              />
              {/* Link indicator */}
              {formData.delivery_note && (
                <button
                  type="button"
                  onClick={() => handleChange('delivery_note', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Series</label>
            <select
              value={String(formData.naming_series ?? '')}
              onChange={e => handleChange('naming_series', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>

            </select>
          </div>
        </div>
      </div>
      {/* Section: section_break0 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From Package No.</label>
            <input
              type="number"
              step="1"
              value={formData.from_case_no != null ? Number(formData.from_case_no) : ''}
              onChange={e => handleChange('from_case_no', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Package No.</label>
            <input
              type="number"
              step="1"
              value={formData.to_case_no != null ? Number(formData.to_case_no) : ''}
              onChange={e => handleChange('to_case_no', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: package_item_details */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: items → Packing Slip Item */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Items</label>
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
                  {(Array.isArray(formData.items) ? (formData.items as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.items) ? formData.items : [])];
                            rows.splice(idx, 1);
                            handleChange('items', rows);
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
                  onClick={() => handleChange('items', [...(Array.isArray(formData.items) ? formData.items : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Package Weight Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Package Weight Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Net Weight</label>
            <input
              type="number"
              step="any"
              value={formData.net_weight_pkg != null ? Number(formData.net_weight_pkg) : ''}
              onChange={e => handleChange('net_weight_pkg', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Net Weight UOM (→ UOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UOM..."
                value={String(formData.net_weight_uom ?? '')}
                onChange={e => {
                  handleChange('net_weight_uom', e.target.value);
                  // TODO: Implement async search for UOM
                  // fetch(`/api/resource/UOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="UOM"
                data-fieldname="net_weight_uom"
              />
              {/* Link indicator */}
              {formData.net_weight_uom && (
                <button
                  type="button"
                  onClick={() => handleChange('net_weight_uom', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gross Weight</label>
            <input
              type="number"
              step="any"
              value={formData.gross_weight_pkg != null ? Number(formData.gross_weight_pkg) : ''}
              onChange={e => handleChange('gross_weight_pkg', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gross Weight UOM (→ UOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UOM..."
                value={String(formData.gross_weight_uom ?? '')}
                onChange={e => {
                  handleChange('gross_weight_uom', e.target.value);
                  // TODO: Implement async search for UOM
                  // fetch(`/api/resource/UOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="UOM"
                data-fieldname="gross_weight_uom"
              />
              {/* Link indicator */}
              {formData.gross_weight_uom && (
                <button
                  type="button"
                  onClick={() => handleChange('gross_weight_uom', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Section: Letter Head */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Letter Head</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Letter Head (→ Letter Head)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Letter Head..."
                value={String(formData.letter_head ?? '')}
                onChange={e => {
                  handleChange('letter_head', e.target.value);
                  // TODO: Implement async search for Letter Head
                  // fetch(`/api/resource/Letter Head?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Letter Head"
                data-fieldname="letter_head"
              />
              {/* Link indicator */}
              {formData.letter_head && (
                <button
                  type="button"
                  onClick={() => handleChange('letter_head', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Section: misc_details */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Packing Slip)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Packing Slip..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Packing Slip
                  // fetch(`/api/resource/Packing Slip?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Packing Slip"
                data-fieldname="amended_from"
              />
              {/* Link indicator */}
              {formData.amended_from && (
                <button
                  type="button"
                  onClick={() => handleChange('amended_from', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
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