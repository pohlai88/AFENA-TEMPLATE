// List scaffold for Transaction Deletion Record Details
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { TransactionDeletionRecordDetails } from '../types/transaction-deletion-record-details.js';

interface TransactionDeletionRecordDetailsListProps {
  data: TransactionDeletionRecordDetails[];
  onRowClick?: (id: string) => void;
}

export function TransactionDeletionRecordDetailsList({ data, onRowClick }: TransactionDeletionRecordDetailsListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">DocType</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No of Docs</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Done</th>
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
              <td className="px-4 py-3 text-sm">{String(row.no_of_docs ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.done ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}