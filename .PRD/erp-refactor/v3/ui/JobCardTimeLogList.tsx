// List scaffold for Job Card Time Log
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { JobCardTimeLog } from '../types/job-card-time-log.js';

interface JobCardTimeLogListProps {
  data: JobCardTimeLog[];
  onRowClick?: (id: string) => void;
}

export function JobCardTimeLogList({ data, onRowClick }: JobCardTimeLogListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From Time</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">To Time</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time In Mins</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed Qty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sub Operation</th>
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
              <td className="px-4 py-3 text-sm">{String(row.employee ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.from_time ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.to_time ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.time_in_mins ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.completed_qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.operation ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}