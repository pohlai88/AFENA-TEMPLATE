// Form scaffold for Item Barcode
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ItemBarcode } from '../types/item-barcode.js';

interface ItemBarcodeFormProps {
  initialData?: Partial<ItemBarcode>;
  onSubmit: (data: Partial<ItemBarcode>) => void;
  mode: 'create' | 'edit';
}

export function ItemBarcodeForm({ initialData = {}, onSubmit, mode }: ItemBarcodeFormProps) {
  const [formData, setFormData] = useState<Partial<ItemBarcode>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Item Barcode' : 'New Item Barcode'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Barcode</label>
            <input
              type="text"
              value={String(formData.barcode ?? '')}
              onChange={e => handleChange('barcode', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Barcode Type</label>
            <select
              value={String(formData.barcode_type ?? '')}
              onChange={e => handleChange('barcode_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="EAN">EAN</option>
              <option value="UPC-A">UPC-A</option>
              <option value="CODE-39">CODE-39</option>
              <option value="EAN-13">EAN-13</option>
              <option value="EAN-8">EAN-8</option>
              <option value="GS1">GS1</option>
              <option value="GTIN">GTIN</option>
              <option value="GTIN-14">GTIN-14</option>
              <option value="ISBN">ISBN</option>
              <option value="ISBN-10">ISBN-10</option>
              <option value="ISBN-13">ISBN-13</option>
              <option value="ISSN">ISSN</option>
              <option value="JAN">JAN</option>
              <option value="PZN">PZN</option>
              <option value="UPC">UPC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">UOM (→ UOM)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UOM..."
                value={String(formData.uom ?? '')}
                onChange={e => {
                  handleChange('uom', e.target.value);
                  // TODO: Implement async search for UOM
                  // fetch(`/api/resource/UOM?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="UOM"
                data-fieldname="uom"
              />
              {/* Link indicator */}
              {formData.uom && (
                <button
                  type="button"
                  onClick={() => handleChange('uom', '')}
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