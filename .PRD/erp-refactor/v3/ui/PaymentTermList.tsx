// List scaffold for Payment Term
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { PaymentTerm } from '../types/payment-term.js';

interface PaymentTermListProps {
  data: PaymentTerm[];
  onRowClick?: (id: string) => void;
}

export function PaymentTermList({ data, onRowClick }: PaymentTermListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Term Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice Portion (%)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode of Payment</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date Based On</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credit Days</th>
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
              <td className="px-4 py-3 text-sm">{String(row.payment_term_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.invoice_portion ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.mode_of_payment ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.due_date_based_on ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.credit_days ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}