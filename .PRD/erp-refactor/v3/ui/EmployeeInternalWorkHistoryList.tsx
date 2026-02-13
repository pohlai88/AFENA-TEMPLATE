// List scaffold for Employee Internal Work History
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { EmployeeInternalWorkHistory } from '../types/employee-internal-work-history.js';

interface EmployeeInternalWorkHistoryListProps {
  data: EmployeeInternalWorkHistory[];
  onRowClick?: (id: string) => void;
}

export function EmployeeInternalWorkHistoryList({ data, onRowClick }: EmployeeInternalWorkHistoryListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">To Date</th>
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
              <td className="px-4 py-3 text-sm">{String(row.branch ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.department ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.designation ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.from_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.to_date ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}