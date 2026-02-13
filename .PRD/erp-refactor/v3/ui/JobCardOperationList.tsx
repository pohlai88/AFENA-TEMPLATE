// List scaffold for Job Card Operation
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { JobCardOperation } from '../types/job-card-operation.js';

interface JobCardOperationListProps {
  data: JobCardOperation[];
  onRowClick?: (id: string) => void;
}

export function JobCardOperationList({ data, onRowClick }: JobCardOperationListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operation</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed Qty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed Time</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
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
              <td className="px-4 py-3 text-sm">{String(row.sub_operation ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.completed_qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.completed_time ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.status ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}