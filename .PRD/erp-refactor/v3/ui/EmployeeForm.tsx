// Form scaffold for Employee
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { Employee } from '../types/employee.js';

interface EmployeeFormProps {
  initialData?: Partial<Employee>;
  onSubmit: (data: Partial<Employee>) => void;
  mode: 'create' | 'edit';
}

export function EmployeeForm({ initialData = {}, onSubmit, mode }: EmployeeFormProps) {
  const [formData, setFormData] = useState<Partial<Employee>>(initialData);

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
        {mode === 'edit' ? formData.employee_name ?? 'Employee' : 'New Employee'}
      </h2>
      {/* Tab: Overview */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Overview</h3>
      </div>
      {/* Section: basic_information */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee</label>
            <input
              type="text"
              value={String(formData.employee ?? '')}
              onChange={e => handleChange('employee', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
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
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={String(formData.first_name ?? '')}
              onChange={e => handleChange('first_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Middle Name</label>
            <input
              type="text"
              value={String(formData.middle_name ?? '')}
              onChange={e => handleChange('middle_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={String(formData.last_name ?? '')}
              onChange={e => handleChange('last_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={String(formData.employee_name ?? '')}
              onChange={e => handleChange('employee_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender (→ Gender)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Gender..."
                value={String(formData.gender ?? '')}
                onChange={e => {
                  handleChange('gender', e.target.value);
                  // TODO: Implement async search for Gender
                  // fetch(`/api/resource/Gender?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
                autoComplete="off"
                data-doctype="Gender"
                data-fieldname="gender"
              />
              {/* Link indicator */}
              {formData.gender && (
                <button
                  type="button"
                  onClick={() => handleChange('gender', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              value={String(formData.date_of_birth ?? '')}
              onChange={e => handleChange('date_of_birth', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Salutation (→ Salutation)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Salutation..."
                value={String(formData.salutation ?? '')}
                onChange={e => {
                  handleChange('salutation', e.target.value);
                  // TODO: Implement async search for Salutation
                  // fetch(`/api/resource/Salutation?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Salutation"
                data-fieldname="salutation"
              />
              {/* Link indicator */}
              {formData.salutation && (
                <button
                  type="button"
                  onClick={() => handleChange('salutation', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
            <input
              type="date"
              value={String(formData.date_of_joining ?? '')}
              onChange={e => handleChange('date_of_joining', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
              <option value="Left">Left</option>
            </select>
          </div>
        </div>
      </div>
      {/* Section: User Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">User Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">User ID (→ User)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search User..."
                value={String(formData.user_id ?? '')}
                onChange={e => {
                  handleChange('user_id', e.target.value);
                  // TODO: Implement async search for User
                  // fetch(`/api/resource/User?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="User"
                data-fieldname="user_id"
              />
              {/* Link indicator */}
              {formData.user_id && (
                <button
                  type="button"
                  onClick={() => handleChange('user_id', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {!!formData.user_id && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.create_user_permission}
              onChange={e => handleChange('create_user_permission', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Create User Permission</label>
          </div>
          )}
        </div>
      </div>
      {/* Section: Company Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Company Details</h4>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee Number</label>
            <input
              type="text"
              value={String(formData.employee_number ?? '')}
              onChange={e => handleChange('employee_number', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Designation (→ Designation)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Designation..."
                value={String(formData.designation ?? '')}
                onChange={e => {
                  handleChange('designation', e.target.value);
                  // TODO: Implement async search for Designation
                  // fetch(`/api/resource/Designation?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Designation"
                data-fieldname="designation"
              />
              {/* Link indicator */}
              {formData.designation && (
                <button
                  type="button"
                  onClick={() => handleChange('designation', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reports to (→ Employee)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Employee..."
                value={String(formData.reports_to ?? '')}
                onChange={e => {
                  handleChange('reports_to', e.target.value);
                  // TODO: Implement async search for Employee
                  // fetch(`/api/resource/Employee?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Employee"
                data-fieldname="reports_to"
              />
              {/* Link indicator */}
              {formData.reports_to && (
                <button
                  type="button"
                  onClick={() => handleChange('reports_to', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
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
        </div>
      </div>
      {/* Tab: Joining */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Joining</h3>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Offer Date</label>
            <input
              type="date"
              value={String(formData.scheduled_confirmation_date ?? '')}
              onChange={e => handleChange('scheduled_confirmation_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmation Date</label>
            <input
              type="date"
              value={String(formData.final_confirmation_date ?? '')}
              onChange={e => handleChange('final_confirmation_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contract End Date</label>
            <input
              type="date"
              value={String(formData.contract_end_date ?? '')}
              onChange={e => handleChange('contract_end_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notice (days)</label>
            <input
              type="number"
              step="1"
              value={formData.notice_number_of_days != null ? Number(formData.notice_number_of_days) : ''}
              onChange={e => handleChange('notice_number_of_days', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date Of Retirement</label>
            <input
              type="date"
              value={String(formData.date_of_retirement ?? '')}
              onChange={e => handleChange('date_of_retirement', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Tab: Address & Contacts */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Address & Contacts</h3>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile</label>
            <input
              type="text"
              value={String(formData.cell_number ?? '')}
              onChange={e => handleChange('cell_number', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Personal Email</label>
            <input
              type="text"
              value={String(formData.personal_email ?? '')}
              onChange={e => handleChange('personal_email', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Email</label>
            <input
              type="text"
              value={String(formData.company_email ?? '')}
              onChange={e => handleChange('company_email', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Contact Email</label>
            <select
              value={String(formData.prefered_contact_email ?? '')}
              onChange={e => handleChange('prefered_contact_email', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Company Email">Company Email</option>
              <option value="Personal Email">Personal Email</option>
              <option value="User ID">User ID</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Email</label>
            <input
              type="text"
              value={String(formData.prefered_email ?? '')}
              onChange={e => handleChange('prefered_email', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.unsubscribed}
              onChange={e => handleChange('unsubscribed', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Unsubscribed</label>
          </div>
      {/* Section: Address */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Address</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Current Address</label>
            <textarea
              value={String(formData.current_address ?? '')}
              onChange={e => handleChange('current_address', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Address Is</label>
            <select
              value={String(formData.current_accommodation_type ?? '')}
              onChange={e => handleChange('current_accommodation_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Rented">Rented</option>
              <option value="Owned">Owned</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Permanent Address</label>
            <textarea
              value={String(formData.permanent_address ?? '')}
              onChange={e => handleChange('permanent_address', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Permanent Address Is</label>
            <select
              value={String(formData.permanent_accommodation_type ?? '')}
              onChange={e => handleChange('permanent_accommodation_type', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Rented">Rented</option>
              <option value="Owned">Owned</option>
            </select>
          </div>
        </div>
      </div>
      {/* Section: Emergency Contact */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Emergency Contact</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Emergency Contact Name</label>
            <input
              type="text"
              value={String(formData.person_to_be_contacted ?? '')}
              onChange={e => handleChange('person_to_be_contacted', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Emergency Phone</label>
            <input
              type="text"
              value={String(formData.emergency_phone_number ?? '')}
              onChange={e => handleChange('emergency_phone_number', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Relation</label>
            <input
              type="text"
              value={String(formData.relation ?? '')}
              onChange={e => handleChange('relation', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Tab: Attendance & Leaves */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Attendance & Leaves</h3>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Attendance Device ID (Biometric/RF tag ID)</label>
            <input
              type="text"
              value={String(formData.attendance_device_id ?? '')}
              onChange={e => handleChange('attendance_device_id', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Holiday List (→ Holiday List)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Holiday List..."
                value={String(formData.holiday_list ?? '')}
                onChange={e => {
                  handleChange('holiday_list', e.target.value);
                  // TODO: Implement async search for Holiday List
                  // fetch(`/api/resource/Holiday List?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Holiday List"
                data-fieldname="holiday_list"
              />
              {/* Link indicator */}
              {formData.holiday_list && (
                <button
                  type="button"
                  onClick={() => handleChange('holiday_list', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
      {/* Tab: Salary */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Salary</h3>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cost to Company (CTC)</label>
            <input
              type="number"
              step="any"
              value={formData.ctc != null ? Number(formData.ctc) : ''}
              onChange={e => handleChange('ctc', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Salary Currency (→ Currency)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Currency..."
                value={String(formData.salary_currency ?? '')}
                onChange={e => {
                  handleChange('salary_currency', e.target.value);
                  // TODO: Implement async search for Currency
                  // fetch(`/api/resource/Currency?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Currency"
                data-fieldname="salary_currency"
              />
              {/* Link indicator */}
              {formData.salary_currency && (
                <button
                  type="button"
                  onClick={() => handleChange('salary_currency', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Salary Mode</label>
            <select
              value={String(formData.salary_mode ?? '')}
              onChange={e => handleChange('salary_mode', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Bank">Bank</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
      {/* Section: Bank Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Bank Details</h4>
        <div className="grid grid-cols-2 gap-4">
          {formData.salary_mode === 'Bank' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Bank Name</label>
            <input
              type="text"
              value={String(formData.bank_name ?? '')}
              onChange={e => handleChange('bank_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.salary_mode === 'Bank' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Bank A/C No.</label>
            <input
              type="text"
              value={String(formData.bank_ac_no ?? '')}
              onChange={e => handleChange('bank_ac_no', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
          {formData.salary_mode === 'Bank' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">IBAN</label>
            <input
              type="text"
              value={String(formData.iban ?? '')}
              onChange={e => handleChange('iban', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Tab: Personal Details */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Personal Details</h3>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Marital Status</label>
            <select
              value={String(formData.marital_status ?? '')}
              onChange={e => handleChange('marital_status', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Family Background</label>
            <textarea
              value={String(formData.family_background ?? '')}
              onChange={e => handleChange('family_background', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Blood Group</label>
            <select
              value={String(formData.blood_group ?? '')}
              onChange={e => handleChange('blood_group', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Health Details</label>
            <textarea
              value={String(formData.health_details ?? '')}
              onChange={e => handleChange('health_details', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: Passport Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Passport Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Passport Number</label>
            <input
              type="text"
              value={String(formData.passport_number ?? '')}
              onChange={e => handleChange('passport_number', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Valid Up To</label>
            <input
              type="date"
              value={String(formData.valid_upto ?? '')}
              onChange={e => handleChange('valid_upto', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Issue</label>
            <input
              type="date"
              value={String(formData.date_of_issue ?? '')}
              onChange={e => handleChange('date_of_issue', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Place of Issue</label>
            <input
              type="text"
              value={String(formData.place_of_issue ?? '')}
              onChange={e => handleChange('place_of_issue', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      {/* Tab: Profile */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Profile</h3>
      </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Bio / Cover Letter</label>
            <textarea
              value={String(formData.bio ?? '')}
              onChange={e => handleChange('bio', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: Educational Qualification */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Educational Qualification</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: education → Employee Education */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Education</label>
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
                  {(Array.isArray(formData.education) ? (formData.education as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.education) ? formData.education : [])];
                            rows.splice(idx, 1);
                            handleChange('education', rows);
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
                  onClick={() => handleChange('education', [...(Array.isArray(formData.education) ? formData.education : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: Previous Work Experience */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Previous Work Experience</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: external_work_history → Employee External Work History */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">External Work History</label>
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
                  {(Array.isArray(formData.external_work_history) ? (formData.external_work_history as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.external_work_history) ? formData.external_work_history : [])];
                            rows.splice(idx, 1);
                            handleChange('external_work_history', rows);
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
                  onClick={() => handleChange('external_work_history', [...(Array.isArray(formData.external_work_history) ? formData.external_work_history : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: History In Company */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">History In Company</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: internal_work_history → Employee Internal Work History */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Internal Work History</label>
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
                  {(Array.isArray(formData.internal_work_history) ? (formData.internal_work_history as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.internal_work_history) ? formData.internal_work_history : [])];
                            rows.splice(idx, 1);
                            handleChange('internal_work_history', rows);
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
                  onClick={() => handleChange('internal_work_history', [...(Array.isArray(formData.internal_work_history) ? formData.internal_work_history : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tab: Employee Exit */}
      <div className="border-b pb-2 mb-4">
        <h3 className="text-lg font-medium">Employee Exit</h3>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Resignation Letter Date</label>
            <input
              type="date"
              value={String(formData.resignation_letter_date ?? '')}
              onChange={e => handleChange('resignation_letter_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Relieving Date</label>
            <input
              type="date"
              value={String(formData.relieving_date ?? '')}
              onChange={e => handleChange('relieving_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Exit Interview Held On</label>
            <input
              type="date"
              value={String(formData.held_on ?? '')}
              onChange={e => handleChange('held_on', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Workplace</label>
            <input
              type="text"
              value={String(formData.new_workplace ?? '')}
              onChange={e => handleChange('new_workplace', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Leave Encashed?</label>
            <select
              value={String(formData.leave_encashed ?? '')}
              onChange={e => handleChange('leave_encashed', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          {formData.leave_encashed ==="Yes" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Encashment Date</label>
            <input
              type="date"
              value={String(formData.encashment_date ?? '')}
              onChange={e => handleChange('encashment_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
      {/* Section: Feedback */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Feedback</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Reason for Leaving</label>
            <textarea
              value={String(formData.reason_for_leaving ?? '')}
              onChange={e => handleChange('reason_for_leaving', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Feedback</label>
            <textarea
              value={String(formData.feedback ?? '')}
              onChange={e => handleChange('feedback', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">lft</label>
            <input
              type="number"
              step="1"
              value={formData.lft != null ? Number(formData.lft) : ''}
              onChange={e => handleChange('lft', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">rgt</label>
            <input
              type="number"
              step="1"
              value={formData.rgt != null ? Number(formData.rgt) : ''}
              onChange={e => handleChange('rgt', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Old Parent</label>
            <input
              type="text"
              value={String(formData.old_parent ?? '')}
              onChange={e => handleChange('old_parent', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
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