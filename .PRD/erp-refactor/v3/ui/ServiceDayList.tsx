// List scaffold for Service Day
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ServiceDay } from '../types/service-day.js';

interface ServiceDayListProps {
  data: ServiceDay[];
  onRowClick?: (id: string) => void;
}

export function ServiceDayList({ data, onRowClick }: ServiceDayListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Workday</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Time</th>
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
              <td className="px-4 py-3 text-sm">{String(row.workday ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.start_time ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.end_time ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}