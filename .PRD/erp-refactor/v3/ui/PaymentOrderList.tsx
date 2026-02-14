// List scaffold for Payment Order
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { PaymentOrder } from '../types/payment-order.js';

interface PaymentOrderListProps {
  data: PaymentOrder[];
  onRowClick?: (id: string) => void;
}

export function PaymentOrderList({ data, onRowClick }: PaymentOrderListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posting Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
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
              <td className="px-4 py-3 text-sm">{String(row.party ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.posting_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.company_bank ?? '')}</td>
              <td className="px-4 py-3 text-sm">
                {(row as any).docstatus === 0 ? 'Draft' : (row as any).docstatus === 1 ? 'Submitted' : 'Cancelled'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}