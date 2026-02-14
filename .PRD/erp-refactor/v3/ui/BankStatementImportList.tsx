// List scaffold for Bank Statement Import
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { BankStatementImport } from '../types/bank-statement-import.js';

interface BankStatementImportListProps {
  data: BankStatementImport[];
  onRowClick?: (id: string) => void;
}

export function BankStatementImportList({ data, onRowClick }: BankStatementImportListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Import File</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Import Type</th>
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
              <td className="px-4 py-3 text-sm">{String(row.import_file ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.reference_doctype ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.import_type ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}