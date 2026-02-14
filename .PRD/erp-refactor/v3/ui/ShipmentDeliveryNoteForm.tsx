// Form scaffold for Shipment Delivery Note
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { ShipmentDeliveryNote } from '../types/shipment-delivery-note.js';

interface ShipmentDeliveryNoteFormProps {
  initialData?: Partial<ShipmentDeliveryNote>;
  onSubmit: (data: Partial<ShipmentDeliveryNote>) => void;
  mode: 'create' | 'edit';
}

export function ShipmentDeliveryNoteForm({ initialData = {}, onSubmit, mode }: ShipmentDeliveryNoteFormProps) {
  const [formData, setFormData] = useState<Partial<ShipmentDeliveryNote>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Shipment Delivery Note' : 'New Shipment Delivery Note'}</h2>
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
            <label className="block text-sm font-medium text-gray-700">Value</label>
            <input
              type="number"
              step="any"
              value={formData.grand_total != null ? Number(formData.grand_total) : ''}
              onChange={e => handleChange('grand_total', e.target.value ? parseFloat(e.target.value) : undefined)}
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