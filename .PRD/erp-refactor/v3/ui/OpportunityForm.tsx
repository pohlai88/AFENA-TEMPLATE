// Form scaffold for Opportunity
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { Opportunity } from '../types/opportunity.js';

interface OpportunityFormProps {
  initialData?: Partial<Opportunity>;
  onSubmit: (data: Partial<Opportunity>) => void;
  mode: 'create' | 'edit';
}

export function OpportunityForm({ initialData = {}, onSubmit, mode }: OpportunityFormProps) {
  const [formData, setFormData] = useState<Partial<Opportunity>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">
        {mode === 'edit' ? formData.title ?? 'Opportunity' : 'New Opportunity'}
      </h2>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Opportunity From (→ DocType)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search DocType..."
                value={String(formData.opportunity_from ?? '')}
                onChange={e => {
                  handleChange('opportunity_from', e.target.value);
                  // TODO: Implement async search for DocType
                  // fetch(`/api/resource/DocType?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="DocType"
                data-fieldname="opportunity_from"
              />
              {/* Link indicator */}
              {formData.opportunity_from && (
                <button
                  type="button"
                  onClick={() => handleChange('opportunity_from', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Party</label>
            <input
              type="text"
              value={String(formData.party_name ?? '')}
              onChange={e => handleChange('party_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <input
              type="text"
              value={String(formData.customer_name ?? '')}
              onChange={e => handleChange('customer_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            >
              <option value="">Select...</option>
              <option value="Open">Open</option>
              <option value="Quotation">Quotation</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
              <option value="Replied">Replied</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Opportunity Type (→ Opportunity Type)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Opportunity Type..."
                value={String(formData.opportunity_type ?? '')}
                onChange={e => {
                  handleChange('opportunity_type', e.target.value);
                  // TODO: Implement async search for Opportunity Type
                  // fetch(`/api/resource/Opportunity Type?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Opportunity Type"
                data-fieldname="opportunity_type"
              />
              {/* Link indicator */}
              {formData.opportunity_type && (
                <button
                  type="button"
                  onClick={() => handleChange('opportunity_type', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Opportunity Owner (→ User)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search User..."
                value={String(formData.opportunity_owner ?? '')}
                onChange={e => {
                  handleChange('opportunity_owner', e.target.value);
                  // TODO: Implement async search for User
                  // fetch(`/api/resource/User?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="User"
                data-fieldname="opportunity_owner"
              />
              {/* Link indicator */}
              {formData.opportunity_owner && (
                <button
                  type="button"
                  onClick={() => handleChange('opportunity_owner', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sales Stage (→ Sales Stage)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Sales Stage..."
                value={String(formData.sales_stage ?? '')}
                onChange={e => {
                  handleChange('sales_stage', e.target.value);
                  // TODO: Implement async search for Sales Stage
                  // fetch(`/api/resource/Sales Stage?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Sales Stage"
                data-fieldname="sales_stage"
              />
              {/* Link indicator */}
              {formData.sales_stage && (
                <button
                  type="button"
                  onClick={() => handleChange('sales_stage', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Expected Closing Date</label>
            <input
              type="date"
              value={String(formData.expected_closing ?? '')}
              onChange={e => handleChange('expected_closing', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Probability (%)</label>
            <input
              type="number"
              step="any"
              value={formData.probability != null ? Number(formData.probability) : ''}
              onChange={e => handleChange('probability', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: Organization */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Organization</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">No of Employees</label>
            <select
              value={String(formData.no_of_employees ?? '')}
              onChange={e => handleChange('no_of_employees', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="501-1000">501-1000</option>
              <option value="1000+">1000+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Annual Revenue</label>
            <input
              type="number"
              step="any"
              value={formData.annual_revenue != null ? Number(formData.annual_revenue) : ''}
              onChange={e => handleChange('annual_revenue', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {formData.opportunity_from==='Customer' && formData.party_name && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Group (→ Customer Group)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Customer Group..."
                value={String(formData.customer_group ?? '')}
                onChange={e => {
                  handleChange('customer_group', e.target.value);
                  // TODO: Implement async search for Customer Group
                  // fetch(`/api/resource/Customer Group?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Customer Group"
                data-fieldname="customer_group"
              />
              {/* Link indicator */}
              {formData.customer_group && (
                <button
                  type="button"
                  onClick={() => handleChange('customer_group', '')}
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
            <label className="block text-sm font-medium text-gray-700">Industry (→ Industry Type)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Industry Type..."
                value={String(formData.industry ?? '')}
                onChange={e => {
                  handleChange('industry', e.target.value);
                  // TODO: Implement async search for Industry Type
                  // fetch(`/api/resource/Industry Type?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Industry Type"
                data-fieldname="industry"
              />
              {/* Link indicator */}
              {formData.industry && (
                <button
                  type="button"
                  onClick={() => handleChange('industry', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Market Segment (→ Market Segment)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Market Segment..."
                value={String(formData.market_segment ?? '')}
                onChange={e => {
                  handleChange('market_segment', e.target.value);
                  // TODO: Implement async search for Market Segment
                  // fetch(`/api/resource/Market Segment?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Market Segment"
                data-fieldname="market_segment"
              />
              {/* Link indicator */}
              {formData.market_segment && (
                <button
                  type="button"
                  onClick={() => handleChange('market_segment', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="text"
              value={String(formData.website ?? '')}
              onChange={e => handleChange('website', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              value={String(formData.city ?? '')}
              onChange={e => handleChange('city', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State/Province</label>
            <input
              type="text"
              value={String(formData.state ?? '')}
              onChange={e => handleChange('state', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
        </div>
      </div>
      {/* Section: Opportunity Value */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Opportunity Value</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency (→ Currency)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Currency..."
                value={String(formData.currency ?? '')}
                onChange={e => {
                  handleChange('currency', e.target.value);
                  // TODO: Implement async search for Currency
                  // fetch(`/api/resource/Currency?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Currency"
                data-fieldname="currency"
              />
              {/* Link indicator */}
              {formData.currency && (
                <button
                  type="button"
                  onClick={() => handleChange('currency', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Exchange Rate</label>
            <input
              type="number"
              step="any"
              value={formData.conversion_rate != null ? Number(formData.conversion_rate) : ''}
              onChange={e => handleChange('conversion_rate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Opportunity Amount</label>
            <input
              type="number"
              step="any"
              value={formData.opportunity_amount != null ? Number(formData.opportunity_amount) : ''}
              onChange={e => handleChange('opportunity_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Opportunity Amount (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_opportunity_amount != null ? Number(formData.base_opportunity_amount) : ''}
              onChange={e => handleChange('base_opportunity_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Analytics */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Analytics</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Source (→ UTM Source)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UTM Source..."
                value={String(formData.utm_source ?? '')}
                onChange={e => {
                  handleChange('utm_source', e.target.value);
                  // TODO: Implement async search for UTM Source
                  // fetch(`/api/resource/UTM Source?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="UTM Source"
                data-fieldname="utm_source"
              />
              {/* Link indicator */}
              {formData.utm_source && (
                <button
                  type="button"
                  onClick={() => handleChange('utm_source', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <input
              type="text"
              value={String(formData.utm_content ?? '')}
              onChange={e => handleChange('utm_content', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Campaign (→ UTM Campaign)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UTM Campaign..."
                value={String(formData.utm_campaign ?? '')}
                onChange={e => {
                  handleChange('utm_campaign', e.target.value);
                  // TODO: Implement async search for UTM Campaign
                  // fetch(`/api/resource/UTM Campaign?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="UTM Campaign"
                data-fieldname="utm_campaign"
              />
              {/* Link indicator */}
              {formData.utm_campaign && (
                <button
                  type="button"
                  onClick={() => handleChange('utm_campaign', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Medium (→ UTM Medium)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search UTM Medium..."
                value={String(formData.utm_medium ?? '')}
                onChange={e => {
                  handleChange('utm_medium', e.target.value);
                  // TODO: Implement async search for UTM Medium
                  // fetch(`/api/resource/UTM Medium?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="UTM Medium"
                data-fieldname="utm_medium"
              />
              {/* Link indicator */}
              {formData.utm_medium && (
                <button
                  type="button"
                  onClick={() => handleChange('utm_medium', '')}
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
      {/* Section: More Information */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">More Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company (→ Company)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Company..."
                value={String(formData.company ?? '')}
                onChange={e => {
                  handleChange('company', e.target.value);
                  // TODO: Implement async search for Company
                  // fetch(`/api/resource/Company?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Company"
                data-fieldname="company"
              />
              {/* Link indicator */}
              {formData.company && (
                <button
                  type="button"
                  onClick={() => handleChange('company', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Opportunity Date</label>
            <input
              type="date"
              value={String(formData.transaction_date ?? '')}
              onChange={e => handleChange('transaction_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Print Language (→ Language)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Language..."
                value={String(formData.language ?? '')}
                onChange={e => {
                  handleChange('language', e.target.value);
                  // TODO: Implement async search for Language
                  // fetch(`/api/resource/Language?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Language"
                data-fieldname="language"
              />
              {/* Link indicator */}
              {formData.language && (
                <button
                  type="button"
                  onClick={() => handleChange('language', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amended From (→ Opportunity)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Opportunity..."
                value={String(formData.amended_from ?? '')}
                onChange={e => {
                  handleChange('amended_from', e.target.value);
                  // TODO: Implement async search for Opportunity
                  // fetch(`/api/resource/Opportunity?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Opportunity"
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={String(formData.title ?? '')}
              onChange={e => handleChange('title', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">First Response Time</label>
            <input
              type="number"
              step="any"
              value={formData.first_response_time != null ? Number(formData.first_response_time) : ''}
              onChange={e => handleChange('first_response_time', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Lost Reasons */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Lost Reasons</h4>
        <div className="grid grid-cols-2 gap-4">
          {formData.status===="Lost" && (
          {/* Child table: lost_reasons → Opportunity Lost Reason Detail */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Lost Reasons</label>
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
                  {(Array.isArray(formData.lost_reasons) ? (formData.lost_reasons as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.lost_reasons) ? formData.lost_reasons : [])];
                            rows.splice(idx, 1);
                            handleChange('lost_reasons', rows);
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
                  onClick={() => handleChange('lost_reasons', [...(Array.isArray(formData.lost_reasons) ? formData.lost_reasons : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
          )}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Detailed Reason</label>
            <textarea
              value={String(formData.order_lost_reason ?? '')}
              onChange={e => handleChange('order_lost_reason', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {/* Child table: competitors → Competitor Detail */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Competitors</label>
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
                  {(Array.isArray(formData.competitors) ? (formData.competitors as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.competitors) ? formData.competitors : [])];
                            rows.splice(idx, 1);
                            handleChange('competitors', rows);
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
                  onClick={() => handleChange('competitors', [...(Array.isArray(formData.competitors) ? formData.competitors : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tab: Contacts */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Contacts</h3>
      </div>
      {/* Section: Primary Contact */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Primary Contact</h4>
        <div className="grid grid-cols-2 gap-4">
          {!!formData.party_name && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Person (→ Contact)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Contact..."
                value={String(formData.contact_person ?? '')}
                onChange={e => {
                  handleChange('contact_person', e.target.value);
                  // TODO: Implement async search for Contact
                  // fetch(`/api/resource/Contact?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Contact"
                data-fieldname="contact_person"
              />
              {/* Link indicator */}
              {formData.contact_person && (
                <button
                  type="button"
                  onClick={() => handleChange('contact_person', '')}
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
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              value={String(formData.job_title ?? '')}
              onChange={e => handleChange('job_title', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="text"
              value={String(formData.contact_email ?? '')}
              onChange={e => handleChange('contact_email', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Mobile</label>
            <input
              type="text"
              value={String(formData.contact_mobile ?? '')}
              onChange={e => handleChange('contact_mobile', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
            <input
              type="text"
              value={String(formData.whatsapp ?? '')}
              onChange={e => handleChange('whatsapp', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              value={String(formData.phone ?? '')}
              onChange={e => handleChange('phone', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Ext.</label>
            <input
              type="text"
              value={String(formData.phone_ext ?? '')}
              onChange={e => handleChange('phone_ext', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Address & Contact */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Address & Contact</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address HTML</label>
            <textarea
              value={String(formData.address_html ?? '')}
              onChange={e => handleChange('address_html', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.party_name && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer / Lead Address (→ Address)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Address..."
                value={String(formData.customer_address ?? '')}
                onChange={e => {
                  handleChange('customer_address', e.target.value);
                  // TODO: Implement async search for Address
                  // fetch(`/api/resource/Address?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Address"
                data-fieldname="customer_address"
              />
              {/* Link indicator */}
              {formData.customer_address && (
                <button
                  type="button"
                  onClick={() => handleChange('customer_address', '')}
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
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              value={String(formData.address_display ?? '')}
              onChange={e => handleChange('address_display', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Contact HTML</label>
            <textarea
              value={String(formData.contact_html ?? '')}
              onChange={e => handleChange('contact_html', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {formData.opportunity_from==='Customer' && formData.party_name && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Contact</label>
            <textarea
              value={String(formData.contact_display ?? '')}
              onChange={e => handleChange('contact_display', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Tab: Items */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Items</h3>
      </div>
          {/* Child table: items → Opportunity Item */}
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
      {/* Section: section_break_32 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Total (Company Currency)</label>
            <input
              type="number"
              step="any"
              value={formData.base_total != null ? Number(formData.base_total) : ''}
              onChange={e => handleChange('base_total', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total</label>
            <input
              type="number"
              step="any"
              value={formData.total != null ? Number(formData.total) : ''}
              onChange={e => handleChange('total', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Tab: Activities */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Activities</h3>
      </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Open Activities HTML</label>
            <textarea
              value={String(formData.open_activities_html ?? '')}
              onChange={e => handleChange('open_activities_html', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: All Activities */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">All Activities</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">All Activities HTML</label>
            <textarea
              value={String(formData.all_activities_html ?? '')}
              onChange={e => handleChange('all_activities_html', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Tab: Comments */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Comments</h3>
      </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Notes HTML</label>
            <textarea
              value={String(formData.notes_html ?? '')}
              onChange={e => handleChange('notes_html', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {/* Child table: notes → CRM Note */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
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
                  {(Array.isArray(formData.notes) ? (formData.notes as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.notes) ? formData.notes : [])];
                            rows.splice(idx, 1);
                            handleChange('notes', rows);
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
                  onClick={() => handleChange('notes', [...(Array.isArray(formData.notes) ? formData.notes : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
      {/* Tab: Connections */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Connections</h3>
      </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  );
}