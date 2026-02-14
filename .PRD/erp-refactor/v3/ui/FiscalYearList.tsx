// List scaffold for Fiscal Year
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { FiscalYear } from '../types/fiscal-year.js';

interface FiscalYearListProps {
  data: FiscalYear[];
  onRowClick?: (id: string) => void;
}

export function FiscalYearList({ data, onRowClick }: FiscalYearListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year Start Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year End Date</th>
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
              <td className="px-4 py-3 text-sm">{String(row.year ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.year_start_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.year_end_date ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}