// List scaffold for Projects Settings
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ProjectsSettings } from '../types/projects-settings.js';

interface ProjectsSettingsListProps {
  data: ProjectsSettings[];
  onRowClick?: (id: string) => void;
}

export function ProjectsSettingsList({ data, onRowClick }: ProjectsSettingsListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ignore Workstation Time Overlap</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ignore User Time Overlap</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ignore Employee Time Overlap</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fetch Timesheet in Sales Invoice</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row.id)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-4 py-3 text-sm">{row.id}</td>
              <td className="px-4 py-3 text-sm">{String(row.ignore_workstation_time_overlap ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.ignore_user_time_overlap ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.ignore_employee_time_overlap ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.fetch_timesheet_in_sales_invoice ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}