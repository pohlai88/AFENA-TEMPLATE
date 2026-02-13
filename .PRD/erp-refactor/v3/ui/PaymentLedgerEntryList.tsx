// List scaffold for Payment Ledger Entry
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { PaymentLedgerEntry } from '../types/payment-ledger-entry.js';

interface PaymentLedgerEntryListProps {
  data: PaymentLedgerEntry[];
  onRowClick?: (id: string) => void;
}

export function PaymentLedgerEntryList({ data, onRowClick }: PaymentLedgerEntryListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voucher No</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Against Voucher No</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">DeLinked</th>
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
              <td className="px-4 py-3 text-sm">{String(row.voucher_no ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.against_voucher_no ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.amount ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.delinked ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}