// List scaffold for Accounting Period
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { AccountingPeriod } from '../types/accounting-period.js';

interface AccountingPeriodListProps {
  data: AccountingPeriod[];
  onRowClick?: (id: string) => void;
}

export function AccountingPeriodList({ data, onRowClick }: AccountingPeriodListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disabled</th>
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
              <td className="px-4 py-3 text-sm">{String(row.period_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.start_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.end_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.company ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.disabled ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}