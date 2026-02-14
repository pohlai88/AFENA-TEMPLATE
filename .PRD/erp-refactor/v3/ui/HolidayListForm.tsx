// Form scaffold for Holiday List
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { HolidayList } from '../types/holiday-list.js';

interface HolidayListFormProps {
  initialData?: Partial<HolidayList>;
  onSubmit: (data: Partial<HolidayList>) => void;
  mode: 'create' | 'edit';
}

export function HolidayListForm({ initialData = {}, onSubmit, mode }: HolidayListFormProps) {
  const [formData, setFormData] = useState<Partial<HolidayList>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Holiday List' : 'New Holiday List'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Holiday List Name</label>
            <input
              type="text"
              value={String(formData.holiday_list_name ?? '')}
              onChange={e => handleChange('holiday_list_name', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={String(formData.from_date ?? '')}
              onChange={e => handleChange('from_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={String(formData.to_date ?? '')}
              onChange={e => handleChange('to_date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Holidays</label>
            <input
              type="number"
              step="1"
              value={formData.total_holidays != null ? Number(formData.total_holidays) : ''}
              onChange={e => handleChange('total_holidays', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
      {/* Section: Add Weekly Holidays */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Add Weekly Holidays</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Weekly Off</label>
            <select
              value={String(formData.weekly_off ?? '')}
              onChange={e => handleChange('weekly_off', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.is_half_day}
              onChange={e => handleChange('is_half_day', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">Is Half Day</label>
          </div>
        </div>
      </div>
      {/* Section: Add Local Holidays */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Add Local Holidays</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              value={String(formData.country ?? '')}
              onChange={e => handleChange('country', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {!!formData.country && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Subdivision</label>
            <input
              type="text"
              value={String(formData.subdivision ?? '')}
              onChange={e => handleChange('subdivision', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          )}
        </div>
      </div>
      {/* Section: Holidays */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Holidays</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: holidays → Holiday */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Holidays</label>
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
                  {(Array.isArray(formData.holidays) ? (formData.holidays as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.holidays) ? formData.holidays : [])];
                            rows.splice(idx, 1);
                            handleChange('holidays', rows);
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
                  onClick={() => handleChange('holidays', [...(Array.isArray(formData.holidays) ? formData.holidays : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section: section_break_9 */}
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <input
              type="color"
              value={String(formData.color ?? '#000000')}
              onChange={e => handleChange('color', e.target.value)}
              className="mt-1 h-10 w-20"
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