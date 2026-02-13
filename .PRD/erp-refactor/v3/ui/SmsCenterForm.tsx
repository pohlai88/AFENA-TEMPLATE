// Form scaffold for SMS Center
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { SmsCenter } from '../types/sms-center.js';

interface SmsCenterFormProps {
  initialData?: Partial<SmsCenter>;
  onSubmit: (data: Partial<SmsCenter>) => void;
  mode: 'create' | 'edit';
}

export function SmsCenterForm({ initialData = {}, onSubmit, mode }: SmsCenterFormProps) {
  const [formData, setFormData] = useState<Partial<SmsCenter>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'SMS Center' : 'New SMS Center'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Send To</label>
            <select
              value={String(formData.send_to ?? '')}
              onChange={e => handleChange('send_to', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="All Contact">All Contact</option>
              <option value="All Customer Contact">All Customer Contact</option>
              <option value="All Supplier Contact">All Supplier Contact</option>
              <option value="All Sales Partner Contact">All Sales Partner Contact</option>
              <option value="All Lead (Open)">All Lead (Open)</option>
              <option value="All Employee (Active)">All Employee (Active)</option>
              <option value="All Sales Person">All Sales Person</option>
            </select>
          </div>
          {formData.send_to==='All Customer Contact' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer (→ Customer)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Customer..."
                value={String(formData.customer ?? '')}
                onChange={e => {
                  handleChange('customer', e.target.value);
                  // TODO: Implement async search for Customer
                  // fetch(`/api/resource/Customer?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Customer"
                data-fieldname="customer"
              />
              {/* Link indicator */}
              {formData.customer && (
                <button
                  type="button"
                  onClick={() => handleChange('customer', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.send_to==='All Supplier Contact' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier (→ Supplier)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Supplier..."
                value={String(formData.supplier ?? '')}
                onChange={e => {
                  handleChange('supplier', e.target.value);
                  // TODO: Implement async search for Supplier
                  // fetch(`/api/resource/Supplier?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Supplier"
                data-fieldname="supplier"
              />
              {/* Link indicator */}
              {formData.supplier && (
                <button
                  type="button"
                  onClick={() => handleChange('supplier', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.send_to==='All Sales Partner Contact' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Partner (→ Sales Partner)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Partner..."
                value={String(formData.sales_partner ?? '')}
                onChange={e => {
                  handleChange('sales_partner', e.target.value);
                  // TODO: Implement async search for Sales Partner
                  // fetch(`/api/resource/Sales Partner?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Partner"
                data-fieldname="sales_partner"
              />
              {/* Link indicator */}
              {formData.sales_partner && (
                <button
                  type="button"
                  onClick={() => handleChange('sales_partner', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.send_to==='All Employee (Active)' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Department (→ Department)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Department..."
                value={String(formData.department ?? '')}
                onChange={e => {
                  handleChange('department', e.target.value);
                  // TODO: Implement async search for Department
                  // fetch(`/api/resource/Department?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Department"
                data-fieldname="department"
              />
              {/* Link indicator */}
              {formData.department && (
                <button
                  type="button"
                  onClick={() => handleChange('department', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          )}
          {formData.send_to==='All Employee (Active)' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Branch (→ Branch)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Branch..."
                value={String(formData.branch ?? '')}
                onChange={e => {
                  handleChange('branch', e.target.value);
                  // TODO: Implement async search for Branch
                  // fetch(`/api/resource/Branch?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Branch"
                data-fieldname="branch"
              />
              {/* Link indicator */}
              {formData.branch && (
                <button
                  type="button"
                  onClick={() => handleChange('branch', '')}
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
            <label className="block text-sm font-medium text-gray-700">Receiver List</label>
            <textarea
              value={String(formData.receiver_list ?? '')}
              onChange={e => handleChange('receiver_list', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={String(formData.message ?? '')}
              onChange={e => handleChange('message', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Characters</label>
            <input
              type="number"
              step="1"
              value={formData.total_characters != null ? Number(formData.total_characters) : ''}
              onChange={e => handleChange('total_characters', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Message(s)</label>
            <input
              type="number"
              step="1"
              value={formData.total_messages != null ? Number(formData.total_messages) : ''}
              onChange={e => handleChange('total_messages', e.target.value ? parseInt(e.target.value) : undefined)}
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