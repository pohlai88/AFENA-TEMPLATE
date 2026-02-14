// List scaffold for Sales Invoice Advance
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { SalesInvoiceAdvance } from '../types/sales-invoice-advance.js';

interface SalesInvoiceAdvanceListProps {
  data: SalesInvoiceAdvance[];
  onRowClick?: (id: string) => void;
}

export function SalesInvoiceAdvanceList({ data, onRowClick }: SalesInvoiceAdvanceListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Advance amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allocated amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difference Posting Date</th>
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
              <td className="px-4 py-3 text-sm">{String(row.reference_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.remarks ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.advance_amount ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.allocated_amount ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.difference_posting_date ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}