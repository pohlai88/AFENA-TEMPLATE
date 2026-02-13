// List scaffold for Process Deferred Accounting
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ProcessDeferredAccounting } from '../types/process-deferred-accounting.js';

interface ProcessDeferredAccountingListProps {
  data: ProcessDeferredAccounting[];
  onRowClick?: (id: string) => void;
}

export function ProcessDeferredAccountingList({ data, onRowClick }: ProcessDeferredAccountingListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posting Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Start Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service End Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
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
              <td className="px-4 py-3 text-sm">{String(row.type ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.posting_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.start_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.end_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">
                {(row as any).docstatus === 0 ? 'Draft' : (row as any).docstatus === 1 ? 'Submitted' : 'Cancelled'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}