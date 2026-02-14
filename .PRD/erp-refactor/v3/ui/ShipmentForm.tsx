// Form scaffold for Shipment
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { Shipment } from '../types/shipment.js';

interface ShipmentFormProps {
  initialData?: Partial<Shipment>;
  onSubmit: (data: Partial<Shipment>) => void;
  mode: 'create' | 'edit';
}

export function ShipmentForm({ initialData = {}, onSubmit, mode }: ShipmentFormProps) {
  const [formData, setFormData] = useState<Partial<Shipment>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Shipment' : 'New Shipment'}</h2>
      {/* Section: Pickup from */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Pickup from</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Pickup from</label>
            <select
              value={String(formData.pickup_from_type ?? '')}
              onChange={e => handleChange('pickup_from_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Company">Company</option>
              <option value="Customer">Customer</option>
              <option value="Supplier">Supplier</option>
            </select>
          </div>
          {formData.pickup_from_type === 'Company' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Company (→ Company)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Company..."
                value={String(formData.pickup_company ?? '')}
                onChange={e => {
                  handleChange('pickup_company', e.target.value);
                  // TODO: Implement async search for Company
                  // fetch(`/api/resource/Company?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Company"
                data-fieldname="pickup_company"
              />
              {/* Link indicator */}
              {formData.pickup_company && (
                <button
                  type="button"
                  onClick={() => handleChange('pickup_company', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.pickup_from_type === 'Customer' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer (→ Customer)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Customer..."
                value={String(formData.pickup_customer ?? '')}
                onChange={e => {
                  handleChange('pickup_customer', e.target.value);
                  // TODO: Implement async search for Customer
                  // fetch(`/api/resource/Customer?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Customer"
                data-fieldname="pickup_customer"
              />
              {/* Link indicator */}
              {formData.pickup_customer && (
                <button
                  type="button"
                  onClick={() => handleChange('pickup_customer', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.pickup_from_type === 'Supplier' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier (→ Supplier)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Supplier..."
                value={String(formData.pickup_supplier ?? '')}
                onChange={e => {
                  handleChange('pickup_supplier', e.target.value);
                  // TODO: Implement async search for Supplier
                  // fetch(`/api/resource/Supplier?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Supplier"
                data-fieldname="pickup_supplier"
              />
              {/* Link indicator */}
              {formData.pickup_supplier && (
                <button
                  type="button"
                  onClick={() => handleChange('pickup_supplier', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Pickup From</label>
            <input
              type="text"
              value={String(formData.pickup ?? '')}
              onChange={e => handleChange('pickup', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {formData.pickup_customer || formData.pickup_supplier || formData.pickup_from_type === "Company" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Address (→ Address)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Address..."
                value={String(formData.pickup_address_name ?? '')}
                onChange={e => {
                  handleChange('pickup_address_name', e.target.value);
                  // TODO: Implement async search for Address
                  // fetch(`/api/resource/Address?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Address"
                data-fieldname="pickup_address_name"
              />
              {/* Link indicator */}
              {formData.pickup_address_name && (
                <button
                  type="button"
                  onClick={() => handleChange('pickup_address_name', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">pickup_address</label>
            <textarea
              value={String(formData.pickup_address ?? '')}
              onChange={e => handleChange('pickup_address', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {formData.pickup_from_type ==== 'Company' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Pickup Contact Person (→ User)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search User..."
                value={String(formData.pickup_contact_person ?? '')}
                onChange={e => {
                  handleChange('pickup_contact_person', e.target.value);
                  // TODO: Implement async search for User
                  // fetch(`/api/resource/User?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="User"
                data-fieldname="pickup_contact_person"
              />
              {/* Link indicator */}
              {formData.pickup_contact_person && (
                <button
                  type="button"
                  onClick={() => handleChange('pickup_contact_person', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.pickup_customer || formData.pickup_supplier || formData.pickup_from_type !==== "Company" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact (→ Contact)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Contact..."
                value={String(formData.pickup_contact_name ?? '')}
                onChange={e => {
                  handleChange('pickup_contact_name', e.target.value);
                  // TODO: Implement async search for Contact
                  // fetch(`/api/resource/Contact?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Contact"
                data-fieldname="pickup_contact_name"
              />
              {/* Link indicator */}
              {formData.pickup_contact_name && (
                <button
                  type="button"
                  onClick={() => handleChange('pickup_contact_name', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="text"
              value={String(formData.pickup_contact_email ?? '')}
              onChange={e => handleChange('pickup_contact_email', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">pickup_contact</label>
            <textarea
              value={String(formData.pickup_contact ?? '')}
              onChange={e => handleChange('pickup_contact', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Delivery to */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Delivery to</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery to</label>
            <select
              value={String(formData.delivery_to_type ?? '')}
              onChange={e => handleChange('delivery_to_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Company">Company</option>
              <option value="Customer">Customer</option>
              <option value="Supplier">Supplier</option>
            </select>
          </div>
          {formData.delivery_to_type === 'Company' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Company (→ Company)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Company..."
                value={String(formData.delivery_company ?? '')}
                onChange={e => {
                  handleChange('delivery_company', e.target.value);
                  // TODO: Implement async search for Company
                  // fetch(`/api/resource/Company?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Company"
                data-fieldname="delivery_company"
              />
              {/* Link indicator */}
              {formData.delivery_company && (
                <button
                  type="button"
                  onClick={() => handleChange('delivery_company', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.delivery_to_type === 'Customer' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer (→ Customer)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Customer..."
                value={String(formData.delivery_customer ?? '')}
                onChange={e => {
                  handleChange('delivery_customer', e.target.value);
                  // TODO: Implement async search for Customer
                  // fetch(`/api/resource/Customer?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Customer"
                data-fieldname="delivery_customer"
              />
              {/* Link indicator */}
              {formData.delivery_customer && (
                <button
                  type="button"
                  onClick={() => handleChange('delivery_customer', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.delivery_to_type === 'Supplier' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier (→ Supplier)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Supplier..."
                value={String(formData.delivery_supplier ?? '')}
                onChange={e => {
                  handleChange('delivery_supplier', e.target.value);
                  // TODO: Implement async search for Supplier
                  // fetch(`/api/resource/Supplier?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Supplier"
                data-fieldname="delivery_supplier"
              />
              {/* Link indicator */}
              {formData.delivery_supplier && (
                <button
                  type="button"
                  onClick={() => handleChange('delivery_supplier', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery To</label>
            <input
              type="text"
              value={String(formData.delivery_to ?? '')}
              onChange={e => handleChange('delivery_to', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {formData.delivery_customer || formData.delivery_supplier || formData.delivery_to_type === "Company" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Address (→ Address)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Address..."
                value={String(formData.delivery_address_name ?? '')}
                onChange={e => {
                  handleChange('delivery_address_name', e.target.value);
                  // TODO: Implement async search for Address
                  // fetch(`/api/resource/Address?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Address"
                data-fieldname="delivery_address_name"
              />
              {/* Link indicator */}
              {formData.delivery_address_name && (
                <button
                  type="button"
                  onClick={() => handleChange('delivery_address_name', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">delivery_address</label>
            <textarea
              value={String(formData.delivery_address ?? '')}
              onChange={e => handleChange('delivery_address', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {formData.delivery_customer || formData.delivery_supplier || formData.delivery_to_type === "Company" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact (→ Contact)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Contact..."
                value={String(formData.delivery_contact_name ?? '')}
                onChange={e => {
                  handleChange('delivery_contact_name', e.target.value);
                  // TODO: Implement async search for Contact
                  // fetch(`/api/resource/Contact?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Contact"
                data-fieldname="delivery_contact_name"
              />
              {/* Link indicator */}
              {formData.delivery_contact_name && (
                <button
                  type="button"
                  onClick={() => handleChange('delivery_contact_name', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="text"
              value={String(formData.delivery_contact_email ?? '')}
              onChange={e => handleChange('delivery_contact_email', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.delivery_contact_name && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">delivery_contact</label>
            <textarea
              value={String(formData.delivery_contact ?? '')}
              onChange={e => handleChange('delivery_contact', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Parcels */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Parcels</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: shipment_parcel → Shipment Parcel */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Shipment Parcel</label>
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
                  {(Array.isArray(formData.shipment_parcel) ? (formData.shipment_parcel as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.shipment_parcel) ? formData.shipment_parcel : [])];
                            rows.splice(idx, 1);
                            handleChange('shipment_parcel', rows);
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
                  onClick={() => handleChange('shipment_parcel', [...(Array.isArray(formData.shipment_parcel) ? formData.shipment_parcel : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Parcel Template (→ Shipment Parcel Template)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Shipment Parcel Template..."
                value={String(formData.parcel_template ?? '')}
                onChange={e => {
                  handleChange('parcel_template', e.target.value);
                  // TODO: Implement async search for Shipment Parcel Template
                  // fetch(`/api/resource/Shipment Parcel Template?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Shipment Parcel Template"
                data-fieldname="parcel_template"
              />
              {/* Link indicator */}
              {formData.parcel_template && (
                <button
                  type="button"
                  onClick={() => handleChange('parcel_template', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Weight (kg)</label>
            <input
              type="number"
              step="any"
              value={formData.total_weight != null ? Number(formData.total_weight) : ''}
              onChange={e => handleChange('total_weight', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {/* Child table: shipment_delivery_note → Shipment Delivery Note */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Shipment Delivery Note</label>
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
                  {(Array.isArray(formData.shipment_delivery_note) ? (formData.shipment_delivery_note as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.shipment_delivery_note) ? formData.shipment_delivery_note : [])];
                            rows.splice(idx, 1);
                            handleChange('shipment_delivery_note', rows);
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
                  onClick={() => handleChange('shipment_delivery_note', [...(Array.isArray(formData.shipment_delivery_note) ? formData.shipment_delivery_note : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Shipment details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Shipment details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Pallets</label>
            <select
              value={String(formData.pallets ?? '')}
              onChange={e => handleChange('pallets', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Value of Goods</label>
            <input
              type="number"
              step="any"
              value={formData.value_of_goods != null ? Number(formData.value_of_goods) : ''}
              onChange={e => handleChange('value_of_goods', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pickup Date</label>
            <input
              type="date"
              value={String(formData.pickup_date ?? '')}
              onChange={e => handleChange('pickup_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pickup from</label>
            <input
              type="time"
              value={String(formData.pickup_from ?? '')}
              onChange={e => handleChange('pickup_from', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pickup to</label>
            <input
              type="time"
              value={String(formData.pickup_to ?? '')}
              onChange={e => handleChange('pickup_to', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Shipment Type</label>
            <select
              value={String(formData.shipment_type ?? '')}
              onChange={e => handleChange('shipment_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Goods">Goods</option>
              <option value="Documents">Documents</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pickup Type</label>
            <select
              value={String(formData.pickup_type ?? '')}
              onChange={e => handleChange('pickup_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Pickup">Pickup</option>
              <option value="Self delivery">Self delivery</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Incoterm (→ Incoterm)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Incoterm..."
                value={String(formData.incoterm ?? '')}
                onChange={e => {
                  handleChange('incoterm', e.target.value);
                  // TODO: Implement async search for Incoterm
                  // fetch(`/api/resource/Incoterm?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Incoterm"
                data-fieldname="incoterm"
              />
              {/* Link indicator */}
              {formData.incoterm && (
                <button
                  type="button"
                  onClick={() => handleChange('incoterm', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description of Content</label>
            <textarea
              value={String(formData.description_of_content ?? '')}
              onChange={e => handleChange('description_of_content', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
        </div>
      </div>
      {/* Section: section_break_40 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
        </div>
      </div>
      {/* Section: Shipment Information */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Shipment Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Provider</label>
            <input
              type="text"
              value={String(formData.service_provider ?? '')}
              onChange={e => handleChange('service_provider', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Shipment ID</label>
            <input
              type="text"
              value={String(formData.shipment_id ?? '')}
              onChange={e => handleChange('shipment_id', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Shipment Amount</label>
            <input
              type="number"
              step="any"
              value={formData.shipment_amount != null ? Number(formData.shipment_amount) : ''}
              onChange={e => handleChange('shipment_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Booked">Booked</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Tracking URL</label>
            <textarea
              value={String(formData.tracking_url ?? '')}
              onChange={e => handleChange('tracking_url', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Carrier</label>
            <input
              type="text"
              value={String(formData.carrier ?? '')}
              onChange={e => handleChange('carrier', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Carrier Service</label>
            <input
              type="text"
              value={String(formData.carrier_service ?? '')}
              onChange={e => handleChange('carrier_service', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">AWB Number</label>
            <input
              type="text"
              value={String(formData.awb_number ?? '')}
              onChange={e => handleChange('awb_number', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tracking Status</label>
            <select
              value={String(formData.tracking_status ?? '')}
              onChange={e => handleChange('tracking_status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="In Progress">In Progress</option>
              <option value="Delivered">Delivered</option>
              <option value="Returned">Returned</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tracking Status Info</label>
            <input
              type="text"
              value={String(formData.tracking_status_info ?? '')}
              onChange={e => handleChange('tracking_status_info', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Shipment)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Shipment..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Shipment
                  // fetch(`/api/resource/Shipment?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Shipment"
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