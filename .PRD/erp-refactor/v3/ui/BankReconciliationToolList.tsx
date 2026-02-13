// List scaffold for Bank Reconciliation Tool
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { BankReconciliationTool } from '../types/bank-reconciliation-tool.js';

interface BankReconciliationToolListProps {
  data: BankReconciliationTool[];
  onRowClick?: (id: string) => void;
}

export function BankReconciliationToolList({ data, onRowClick }: BankReconciliationToolListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank Account</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">To Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From Reference Date</th>
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
              <td className="px-4 py-3 text-sm">{String(row.company ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.bank_account ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.bank_statement_from_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.bank_statement_to_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.from_reference_date ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}