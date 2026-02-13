// Form scaffold for Issue
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { Issue } from '../types/issue.js';

interface IssueFormProps {
  initialData?: Partial<Issue>;
  onSubmit: (data: Partial<Issue>) => void;
  mode: 'create' | 'edit';
}

export function IssueForm({ initialData = {}, onSubmit, mode }: IssueFormProps) {
  const [formData, setFormData] = useState<Partial<Issue>>(initialData);

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
        {mode === 'edit' ? formData.subject ?? 'Issue' : 'New Issue'}
      </h2>
      {/* Section: subject_section */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Series</label>
            <select
              value={String(formData.naming_series ?? '')}
              onChange={e => handleChange('naming_series', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>

            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              value={String(formData.subject ?? '')}
              onChange={e => handleChange('subject', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
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
          {!!formData.__islocal && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Raised By (Email)</label>
            <input
              type="text"
              value={String(formData.raised_by ?? '')}
              onChange={e => handleChange('raised_by', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={String(formData.status ?? '')}
              onChange={e => handleChange('status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Open">Open</option>
              <option value="Replied">Replied</option>
              <option value="On Hold">On Hold</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority (→ Issue Priority)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Issue Priority..."
                value={String(formData.priority ?? '')}
                onChange={e => {
                  handleChange('priority', e.target.value);
                  // TODO: Implement async search for Issue Priority
                  // fetch(`/api/resource/Issue Priority?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Issue Priority"
                data-fieldname="priority"
              />
              {/* Link indicator */}
              {formData.priority && (
                <button
                  type="button"
                  onClick={() => handleChange('priority', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Issue Type (→ Issue Type)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Issue Type..."
                value={String(formData.issue_type ?? '')}
                onChange={e => {
                  handleChange('issue_type', e.target.value);
                  // TODO: Implement async search for Issue Type
                  // fetch(`/api/resource/Issue Type?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Issue Type"
                data-fieldname="issue_type"
              />
              {/* Link indicator */}
              {formData.issue_type && (
                <button
                  type="button"
                  onClick={() => handleChange('issue_type', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Issue Split From (→ Issue)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Issue..."
                value={String(formData.issue_split_from ?? '')}
                onChange={e => {
                  handleChange('issue_split_from', e.target.value);
                  // TODO: Implement async search for Issue
                  // fetch(`/api/resource/Issue?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Issue"
                data-fieldname="issue_split_from"
              />
              {/* Link indicator */}
              {formData.issue_split_from && (
                <button
                  type="button"
                  onClick={() => handleChange('issue_split_from', '')}
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
      {/* Section: Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Details</h4>
        <div className="grid grid-cols-2 gap-4">
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
      {/* Section: Service Level Agreement Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Service Level Agreement Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Level Agreement (→ Service Level Agreement)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Service Level Agreement..."
                value={String(formData.service_level_agreement ?? '')}
                onChange={e => {
                  handleChange('service_level_agreement', e.target.value);
                  // TODO: Implement async search for Service Level Agreement
                  // fetch(`/api/resource/Service Level Agreement?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Service Level Agreement"
                data-fieldname="service_level_agreement"
              />
              {/* Link indicator */}
              {formData.service_level_agreement && (
                <button
                  type="button"
                  onClick={() => handleChange('service_level_agreement', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {formData.status !== 'Replied' && formData.service_level_agreement; && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Response By</label>
            <input
              type="datetime-local"
              value={String(formData.response_by ?? '')}
              onChange={e => handleChange('response_by', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {!!formData.service_level_agreement && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Level Agreement Status</label>
            <select
              value={String(formData.agreement_status ?? '')}
              onChange={e => handleChange('agreement_status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="First Response Due">First Response Due</option>
              <option value="Resolution Due">Resolution Due</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          )}
          {formData.status !== 'Replied' && formData.service_level_agreement; && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Resolution By</label>
            <input
              type="datetime-local"
              value={String(formData.sla_resolution_by ?? '')}
              onChange={e => handleChange('sla_resolution_by', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Service Level Agreement Creation</label>
            <input
              type="datetime-local"
              value={String(formData.service_level_agreement_creation ?? '')}
              onChange={e => handleChange('service_level_agreement_creation', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">On Hold Since</label>
            <input
              type="datetime-local"
              value={String(formData.on_hold_since ?? '')}
              onChange={e => handleChange('on_hold_since', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Hold Time</label>
            <input
              type="number"
              step="any"
              value={formData.total_hold_time != null ? Number(formData.total_hold_time) : ''}
              onChange={e => handleChange('total_hold_time', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Response Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Response Details</h4>
        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700">First Responded On</label>
            <input
              type="datetime-local"
              value={String(formData.first_responded_on ?? '')}
              onChange={e => handleChange('first_responded_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Average Response Time</label>
            <input
              type="number"
              step="any"
              value={formData.avg_response_time != null ? Number(formData.avg_response_time) : ''}
              onChange={e => handleChange('avg_response_time', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Resolution Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Resolution Details</h4>
        <div className="grid grid-cols-2 gap-4">
          {!formData.__islocal && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Resolution Details</label>
            <textarea
              value={String(formData.resolution_details ?? '')}
              onChange={e => handleChange('resolution_details', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Opening Date</label>
            <input
              type="date"
              value={String(formData.opening_date ?? '')}
              onChange={e => handleChange('opening_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Opening Time</label>
            <input
              type="time"
              value={String(formData.opening_time ?? '')}
              onChange={e => handleChange('opening_time', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!formData.__islocal && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Resolution Date</label>
            <input
              type="datetime-local"
              value={String(formData.sla_resolution_date ?? '')}
              onChange={e => handleChange('sla_resolution_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Resolution Time</label>
            <input
              type="number"
              step="any"
              value={formData.resolution_time != null ? Number(formData.resolution_time) : ''}
              onChange={e => handleChange('resolution_time', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">User Resolution Time</label>
            <input
              type="number"
              step="any"
              value={formData.user_resolution_time != null ? Number(formData.user_resolution_time) : ''}
              onChange={e => handleChange('user_resolution_time', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Section: Reference */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Reference</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Lead (→ Lead)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Lead..."
                value={String(formData.lead ?? '')}
                onChange={e => {
                  handleChange('lead', e.target.value);
                  // TODO: Implement async search for Lead
                  // fetch(`/api/resource/Lead?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Lead"
                data-fieldname="lead"
              />
              {/* Link indicator */}
              {formData.lead && (
                <button
                  type="button"
                  onClick={() => handleChange('lead', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact (→ Contact)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Contact..."
                value={String(formData.contact ?? '')}
                onChange={e => {
                  handleChange('contact', e.target.value);
                  // TODO: Implement async search for Contact
                  // fetch(`/api/resource/Contact?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Contact"
                data-fieldname="contact"
              />
              {/* Link indicator */}
              {formData.contact && (
                <button
                  type="button"
                  onClick={() => handleChange('contact', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Account (→ Email Account)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Email Account..."
                value={String(formData.email_account ?? '')}
                onChange={e => {
                  handleChange('email_account', e.target.value);
                  // TODO: Implement async search for Email Account
                  // fetch(`/api/resource/Email Account?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Email Account"
                data-fieldname="email_account"
              />
              {/* Link indicator */}
              {formData.email_account && (
                <button
                  type="button"
                  onClick={() => handleChange('email_account', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
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
            <label className="block text-sm font-medium text-gray-700">Project (→ Project)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Project..."
                value={String(formData.project ?? '')}
                onChange={e => {
                  handleChange('project', e.target.value);
                  // TODO: Implement async search for Project
                  // fetch(`/api/resource/Project?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Project"
                data-fieldname="project"
              />
              {/* Link indicator */}
              {formData.project && (
                <button
                  type="button"
                  onClick={() => handleChange('project', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
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
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.via_customer_portal}
              onChange={e => handleChange('via_customer_portal', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Via Customer Portal</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Attachment</label>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content Type</label>
            <input
              type="text"
              value={String(formData.content_type ?? '')}
              onChange={e => handleChange('content_type', e.target.value)}
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