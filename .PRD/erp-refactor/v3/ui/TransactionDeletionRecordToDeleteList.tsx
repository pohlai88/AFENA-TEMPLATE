// List scaffold for Transaction Deletion Record To Delete
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { TransactionDeletionRecordToDelete } from '../types/transaction-deletion-record-to-delete.js';

interface TransactionDeletionRecordToDeleteListProps {
  data: TransactionDeletionRecordToDelete[];
  onRowClick?: (id: string) => void;
}

export function TransactionDeletionRecordToDeleteList({ data, onRowClick }: TransactionDeletionRecordToDeleteListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">DocType</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company Field</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document Count</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Child DocTypes</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deleted</th>
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
              <td className="px-4 py-3 text-sm">{String(row.doctype_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.company_field ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.document_count ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.child_doctypes ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.deleted ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}