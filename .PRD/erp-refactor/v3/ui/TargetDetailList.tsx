// List scaffold for Target Detail
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { TargetDetail } from '../types/target-detail.js';

interface TargetDetailListProps {
  data: TargetDetail[];
  onRowClick?: (id: string) => void;
}

export function TargetDetailList({ data, onRowClick }: TargetDetailListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Group</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fiscal Year</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target Qty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target  Amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target Distribution</th>
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
              <td className="px-4 py-3 text-sm">{String(row.item_group ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.fiscal_year ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.target_qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.target_amount ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.distribution_id ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}