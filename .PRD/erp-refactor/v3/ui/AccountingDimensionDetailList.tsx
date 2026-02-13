// List scaffold for Accounting Dimension Detail
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { AccountingDimensionDetail } from '../types/accounting-dimension-detail.js';

interface AccountingDimensionDetailListProps {
  data: AccountingDimensionDetail[];
  onRowClick?: (id: string) => void;
}

export function AccountingDimensionDetailList({ data, onRowClick }: AccountingDimensionDetailListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Default Dimension</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mandatory For Balance Sheet</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mandatory For Profit and Loss Account</th>
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
              <td className="px-4 py-3 text-sm">{String(row.company ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.default_dimension ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.mandatory_for_bs ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.mandatory_for_pl ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}