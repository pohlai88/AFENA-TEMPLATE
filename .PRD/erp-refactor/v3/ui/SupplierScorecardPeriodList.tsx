// List scaffold for Supplier Scorecard Period
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { SupplierScorecardPeriod } from '../types/supplier-scorecard-period.js';

interface SupplierScorecardPeriodListProps {
  data: SupplierScorecardPeriod[];
  onRowClick?: (id: string) => void;
}

export function SupplierScorecardPeriodList({ data, onRowClick }: SupplierScorecardPeriodListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period Score</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
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
              <td className="px-4 py-3 text-sm">{String(row.supplier ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.total_score ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.start_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">
                {(row as any).docstatus === 0 ? 'Draft' : (row as any).docstatus === 1 ? 'Submitted' : 'Cancelled'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}