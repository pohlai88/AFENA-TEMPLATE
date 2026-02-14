// List scaffold for Bulk Transaction Log Detail
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { BulkTransactionLogDetail } from '../types/bulk-transaction-log-detail.js';

interface BulkTransactionLogDetailListProps {
  data: BulkTransactionLogDetail[];
  onRowClick?: (id: string) => void;
}

export function BulkTransactionLogDetailList({ data, onRowClick }: BulkTransactionLogDetailListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Retried</th>
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
              <td className="px-4 py-3 text-sm">{String(row.transaction_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.transaction_status ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.retried ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}