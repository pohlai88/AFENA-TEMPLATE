// List scaffold for Discounted Invoice
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { DiscountedInvoice } from '../types/discounted-invoice.js';

interface DiscountedInvoiceListProps {
  data: DiscountedInvoice[];
  onRowClick?: (id: string) => void;
}

export function DiscountedInvoiceList({ data, onRowClick }: DiscountedInvoiceListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Outstanding Amount</th>
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
              <td className="px-4 py-3 text-sm">{String(row.sales_invoice ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.customer ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.posting_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.outstanding_amount ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}