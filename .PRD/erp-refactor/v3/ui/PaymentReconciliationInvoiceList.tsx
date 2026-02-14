// List scaffold for Payment Reconciliation Invoice
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { PaymentReconciliationInvoice } from '../types/payment-reconciliation-invoice.js';

interface PaymentReconciliationInvoiceListProps {
  data: PaymentReconciliationInvoice[];
  onRowClick?: (id: string) => void;
}

export function PaymentReconciliationInvoiceList({ data, onRowClick }: PaymentReconciliationInvoiceListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice Number</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice Date</th>
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
              <td className="px-4 py-3 text-sm">{String(row.invoice_type ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.invoice_number ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.invoice_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.outstanding_amount ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}