// List scaffold for Process Payment Reconciliation Log
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ProcessPaymentReconciliationLog } from '../types/process-payment-reconciliation-log.js';

interface ProcessPaymentReconciliationLogListProps {
  data: ProcessPaymentReconciliationLog[];
  onRowClick?: (id: string) => void;
}

export function ProcessPaymentReconciliationLogList({ data, onRowClick }: ProcessPaymentReconciliationLogListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Document</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Allocations</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reconciled Entries</th>
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
              <td className="px-4 py-3 text-sm">{String(row.process_pr ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.total_allocations ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.reconciled_entries ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}