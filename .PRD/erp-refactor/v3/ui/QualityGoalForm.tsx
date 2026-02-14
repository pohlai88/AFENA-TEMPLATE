// Form scaffold for Quality Goal
// Generated from Canon schema — do not edit manually
import React, { useState } from 'react';
import type { QualityGoal } from '../types/quality-goal.js';

interface QualityGoalFormProps {
  initialData?: Partial<QualityGoal>;
  onSubmit: (data: Partial<QualityGoal>) => void;
  mode: 'create' | 'edit';
}

export function QualityGoalForm({ initialData = {}, onSubmit, mode }: QualityGoalFormProps) {
  const [formData, setFormData] = useState<Partial<QualityGoal>>(initialData);

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Quality Goal' : 'New Quality Goal'}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Goal</label>
            <input
              type="text"
              value={String(formData.goal ?? '')}
              onChange={e => handleChange('goal', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Monitoring Frequency</label>
            <select
              value={String(formData.frequency ?? '')}
              onChange={e => handleChange('frequency', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="None">None</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Procedure (→ Quality Procedure)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Quality Procedure..."
                value={String(formData.procedure ?? '')}
                onChange={e => {
                  handleChange('procedure', e.target.value);
                  // TODO: Implement async search for Quality Procedure
                  // fetch(`/api/resource/Quality Procedure?filters=[["name","like","${e.target.value}%"]]&limit=10`)
                  //   .then(r => r.json()).then(data => setSuggestions(data.data));
                }}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                autoComplete="off"
                data-doctype="Quality Procedure"
                data-fieldname="procedure"
              />
              {/* Link indicator */}
              {formData.procedure && (
                <button
                  type="button"
                  onClick={() => handleChange('procedure', '')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          {formData.frequency === 'Weekly'; && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Weekday</label>
            <select
              value={String(formData.weekday ?? '')}
              onChange={e => handleChange('weekday', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>
          )}
          {formData.frequency === 'Monthly' || formData.frequency === 'Quarterly'; && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <select
              value={String(formData.date ?? '')}
              onChange={e => handleChange('date', e.target.value)}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
              <option value="21">21</option>
              <option value="22">22</option>
              <option value="23">23</option>
              <option value="24">24</option>
              <option value="25">25</option>
              <option value="26">26</option>
              <option value="27">27</option>
              <option value="28">28</option>
              <option value="29">29</option>
              <option value="30">30</option>
            </select>
          </div>
          )}
      {/* Section: Objectives */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-700">Objectives</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Child table: objectives → Quality Goal Objective */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Objectives</label>
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
                  {(Array.isArray(formData.objectives) ? (formData.objectives as Record<string, unknown>[]) : []).map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm">{JSON.stringify(row)}</td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            const rows = [...(Array.isArray(formData.objectives) ? formData.objectives : [])];
                            rows.splice(idx, 1);
                            handleChange('objectives', rows);
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
                  onClick={() => handleChange('objectives', [...(Array.isArray(formData.objectives) ? formData.objectives : []), {}])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Row
                </button>
              </div>
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