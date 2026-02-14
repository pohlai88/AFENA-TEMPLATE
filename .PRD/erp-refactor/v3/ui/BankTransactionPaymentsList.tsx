// List scaffold for Bank Transaction Payments
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { BankTransactionPayments } from '../types/bank-transaction-payments.js';

interface BankTransactionPaymentsListProps {
  data: BankTransactionPayments[];
  onRowClick?: (id: string) => void;
}

export function BankTransactionPaymentsList({ data, onRowClick }: BankTransactionPaymentsListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Document</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Entry</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allocated Amount</th>
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
              <td className="px-4 py-3 text-sm">{String(row.payment_document ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.payment_entry ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.allocated_amount ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}