// List scaffold for Ledger Health
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { LedgerHealth } from '../types/ledger-health.js';

interface LedgerHealthListProps {
  data: LedgerHealth[];
  onRowClick?: (id: string) => void;
}

export function LedgerHealthList({ data, onRowClick }: LedgerHealthListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voucher Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voucher No</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Checked On</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Debit-Credit mismatch</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">General and Payment Ledger mismatch</th>
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
              <td className="px-4 py-3 text-sm">{String(row.voucher_type ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.voucher_no ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.checked_on ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.debit_credit_mismatch ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.general_and_payment_ledger_mismatch ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}