// List scaffold for Payment Reconciliation
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { PaymentReconciliation } from '../types/payment-reconciliation.js';

interface PaymentReconciliationListProps {
  data: PaymentReconciliation[];
  onRowClick?: (id: string) => void;
}

export function PaymentReconciliationList({ data, onRowClick }: PaymentReconciliationListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From Invoice Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">To Invoice Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank / Cash Account</th>
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
              <td className="px-4 py-3 text-sm">{String(row.from_invoice_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.to_invoice_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.bank_cash_account ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}