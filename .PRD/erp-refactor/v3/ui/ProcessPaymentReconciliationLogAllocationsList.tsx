// List scaffold for Process Payment Reconciliation Log Allocations
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ProcessPaymentReconciliationLogAllocations } from '../types/process-payment-reconciliation-log-allocations.js';

interface ProcessPaymentReconciliationLogAllocationsListProps {
  data: ProcessPaymentReconciliationLogAllocations[];
  onRowClick?: (id: string) => void;
}

export function ProcessPaymentReconciliationLogAllocationsList({ data, onRowClick }: ProcessPaymentReconciliationLogAllocationsListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice Number</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allocated Amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difference Amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reconciled</th>
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
              <td className="px-4 py-3 text-sm">{String(row.invoice_number ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.allocated_amount ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.difference_amount ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.reconciled ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}