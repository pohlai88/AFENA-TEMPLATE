// List scaffold for Monthly Distribution
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { MonthlyDistribution } from '../types/monthly-distribution.js';

interface MonthlyDistributionListProps {
  data: MonthlyDistribution[];
  onRowClick?: (id: string) => void;
}

export function MonthlyDistributionList({ data, onRowClick }: MonthlyDistributionListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distribution Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fiscal Year</th>
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
              <td className="px-4 py-3 text-sm">{String(row.distribution_id ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.fiscal_year ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}