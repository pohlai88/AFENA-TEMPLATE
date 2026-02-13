// List scaffold for Asset Finance Book
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { AssetFinanceBook } from '../types/asset-finance-book.js';

interface AssetFinanceBookListProps {
  data: AssetFinanceBook[];
  onRowClick?: (id: string) => void;
}

export function AssetFinanceBookList({ data, onRowClick }: AssetFinanceBookListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Finance Book</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Depreciation Method</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequency of Depreciation (Months)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Number of Depreciations</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Depreciation Posting Date</th>
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
              <td className="px-4 py-3 text-sm">{String(row.finance_book ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.depreciation_method ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.frequency_of_depreciation ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.total_number_of_depreciations ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.depreciation_start_date ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}