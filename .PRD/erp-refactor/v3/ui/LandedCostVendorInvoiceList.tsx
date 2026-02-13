// List scaffold for Landed Cost Vendor Invoice
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { LandedCostVendorInvoice } from '../types/landed-cost-vendor-invoice.js';

interface LandedCostVendorInvoiceListProps {
  data: LandedCostVendorInvoice[];
  onRowClick?: (id: string) => void;
}

export function LandedCostVendorInvoiceList({ data, onRowClick }: LandedCostVendorInvoiceListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor Invoice</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount (Company Currency)</th>
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
              <td className="px-4 py-3 text-sm">{String(row.vendor_invoice ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.amount ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}