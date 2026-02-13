// List scaffold for Employee Group Table
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { EmployeeGroupTable } from '../types/employee-group-table.js';

interface EmployeeGroupTableListProps {
  data: EmployeeGroupTable[];
  onRowClick?: (id: string) => void;
}

export function EmployeeGroupTableList({ data, onRowClick }: EmployeeGroupTableListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ERPNext User ID</th>
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
              <td className="px-4 py-3 text-sm">{String(row.employee_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.user_id ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}