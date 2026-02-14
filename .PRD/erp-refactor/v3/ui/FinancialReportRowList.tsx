// List scaffold for Financial Report Row
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { FinancialReportRow } from '../types/financial-report-row.js';

interface FinancialReportRowListProps {
  data: FinancialReportRow[];
  onRowClick?: (id: string) => void;
}

export function FinancialReportRowList({ data, onRowClick }: FinancialReportRowListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Line Reference</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Display Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Indent Level</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Source</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reverse Sign</th>
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
              <td className="px-4 py-3 text-sm">{String(row.reference_code ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.display_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.indentation_level ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.data_source ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.balance_type ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.reverse_sign ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}