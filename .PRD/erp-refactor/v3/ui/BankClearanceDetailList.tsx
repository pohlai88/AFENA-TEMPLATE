// List scaffold for Bank Clearance Detail
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { BankClearanceDetail } from '../types/bank-clearance-detail.js';

interface BankClearanceDetailListProps {
  data: BankClearanceDetail[];
  onRowClick?: (id: string) => void;
}

export function BankClearanceDetailList({ data, onRowClick }: BankClearanceDetailListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Entry</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Against Account</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cheque Number</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cheque Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clearance Date</th>
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
              <td className="px-4 py-3 text-sm">{String(row.payment_entry ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.against_account ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.amount ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.cheque_number ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.cheque_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.clearance_date ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}