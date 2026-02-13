// List scaffold for Payment Entry Reference
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { PaymentEntryReference } from '../types/payment-entry-reference.js';

interface PaymentEntryReferenceListProps {
  data: PaymentEntryReference[];
  onRowClick?: (id: string) => void;
}

export function PaymentEntryReferenceList({ data, onRowClick }: PaymentEntryReferenceListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grand Total</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Outstanding</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allocated</th>
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
              <td className="px-4 py-3 text-sm">{String(row.reference_doctype ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.reference_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.due_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.total_amount ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.outstanding_amount ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.allocated_amount ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}