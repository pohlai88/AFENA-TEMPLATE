// List scaffold for Timesheet Detail
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { TimesheetDetail } from '../types/timesheet-detail.js';

interface TimesheetDetailListProps {
  data: TimesheetDetail[];
  onRowClick?: (id: string) => void;
}

export function TimesheetDetailList({ data, onRowClick }: TimesheetDetailListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From Time</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hrs</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Is Billable</th>
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
              <td className="px-4 py-3 text-sm">{String(row.activity_type ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.from_time ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.hours ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.project ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.is_billable ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}