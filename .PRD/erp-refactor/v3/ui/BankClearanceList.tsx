// List scaffold for Bank Clearance
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { BankClearance } from '../types/bank-clearance.js';

interface BankClearanceListProps {
  data: BankClearance[];
  onRowClick?: (id: string) => void;
}

export function BankClearanceList({ data, onRowClick }: BankClearanceListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">To Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Include Reconciled Entries</th>
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
              <td className="px-4 py-3 text-sm">{String(row.account ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.from_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.to_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.include_reconciled_entries ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}