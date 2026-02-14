// Form scaffold for Inventory Dimension
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { InventoryDimension } from '../types/inventory-dimension.js';

interface InventoryDimensionFormProps {
  initialData?: Partial<InventoryDimension>;
  onSubmit: (data: Partial<InventoryDimension>) => void;
  mode: 'create' | 'edit';
}

export function InventoryDimensionForm({ initialData = {}, onSubmit, mode }: InventoryDimensionFormProps) {
  const [formData, setFormData] = useState<Partial<InventoryDimension>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Inventory Dimension' : 'New Inventory Dimension'}</h2>
      {/* Tab: Dimension Details */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Dimension Details</h3>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dimension Name</label>
            <input
              type="text"
              value={String(formData.dimension_name ?? '')}
              onChange={e => handleChange('dimension_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reference Document (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.reference_document ?? '')}
                onChange={e => {
                  handleChange('reference_document', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="reference_document"
              />
              {/* Link indicator */}
              {formData.reference_document && (
                <button
                  type="button"
                  onClick={() => handleChange('reference_document', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.disabled}
              onChange={e => handleChange('disabled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Disabled</label>
          </div>
      {/* Section: Field Mapping */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Field Mapping</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Source Fieldname</label>
            <input
              type="text"
              value={String(formData.source_fieldname ?? '')}
              onChange={e => handleChange('source_fieldname', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Target Fieldname (Stock Ledger Entry)</label>
            <input
              type="text"
              value={String(formData.target_fieldname ?? '')}
              onChange={e => handleChange('target_fieldname', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Tab: Applicable For */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Applicable For</h3>
      </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.apply_to_all_doctypes}
              onChange={e => handleChange('apply_to_all_doctypes', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Apply to All Inventory Documents</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.validate_negative_stock}
              onChange={e => handleChange('validate_negative_stock', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Validate Negative Stock</label>
          </div>
      {/* Section: column_break_13 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {!formData.apply_to_all_doctypes && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Apply to Document (→ DocType)</label>
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
          )}
          {!formData.apply_to_all_doctypes && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Type of Transaction</label>
            <select
              value={String(formData.type_of_transaction ?? '')}
              onChange={e => handleChange('type_of_transaction', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Inward">Inward</option>
              <option value="Outward">Outward</option>
              <option value="Both">Both</option>
            </select>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Fetch Value From</label>
            <select
              value={String(formData.fetch_from_parent ?? '')}
              onChange={e => handleChange('fetch_from_parent', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>

            </select>
          </div>
          {!formData.apply_to_all_doctypes && formData.document_type && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.istable}
              onChange={e => handleChange('istable', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700"> Is Child Table</label>
          </div>
          )}
          {!formData.apply_to_all_doctypes && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Conditional Rule</label>
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
      {/* Section: Mandatory Section */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Mandatory Section</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.reqd}
              onChange={e => handleChange('reqd', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Mandatory</label>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Mandatory Depends On</label>
            <textarea
              value={String(formData.mandatory_depends_on ?? '')}
              onChange={e => handleChange('mandatory_depends_on', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Conditional Rule Examples */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Conditional Rule Examples</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">html_19</label>
            <textarea
              value={String(formData.html_19 ?? '')}
              onChange={e => handleChange('html_19', e.target.value)}
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