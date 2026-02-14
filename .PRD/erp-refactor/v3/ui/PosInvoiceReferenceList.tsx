// List scaffold for POS Invoice Reference
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { PosInvoiceReference } from '../types/pos-invoice-reference.js';

interface PosInvoiceReferenceListProps {
  data: PosInvoiceReference[];
  onRowClick?: (id: string) => void;
}

export function PosInvoiceReferenceList({ data, onRowClick }: PosInvoiceReferenceListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">POS Invoice</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
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
              <td className="px-4 py-3 text-sm">{String(row.pos_invoice ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.posting_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.grand_total ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}