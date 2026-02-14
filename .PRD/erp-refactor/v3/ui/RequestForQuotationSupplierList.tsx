// List scaffold for Request for Quotation Supplier
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { RequestForQuotationSupplier } from '../types/request-for-quotation-supplier.js';

interface RequestForQuotationSupplierListProps {
  data: RequestForQuotationSupplier[];
  onRowClick?: (id: string) => void;
}

export function RequestForQuotationSupplierList({ data, onRowClick }: RequestForQuotationSupplierListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Send Email</th>
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
              <td className="px-4 py-3 text-sm">{String(row.supplier ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.contact ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.email_id ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.send_email ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}