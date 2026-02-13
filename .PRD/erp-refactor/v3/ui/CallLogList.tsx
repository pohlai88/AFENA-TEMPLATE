// List scaffold for Call Log
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { CallLog } from '../types/call-log.js';

interface CallLogListProps {
  data: CallLog[];
  onRowClick?: (id: string) => void;
}

export function CallLogList({ data, onRowClick }: CallLogListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
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
              <td className="px-4 py-3 text-sm">{String(row.from ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.to ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.status ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.duration ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}