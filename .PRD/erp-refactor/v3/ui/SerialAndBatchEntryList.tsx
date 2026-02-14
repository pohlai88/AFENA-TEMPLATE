// List scaffold for Serial and Batch Entry
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { SerialAndBatchEntry } from '../types/serial-and-batch-entry.js';

interface SerialAndBatchEntryListProps {
  data: SerialAndBatchEntry[];
  onRowClick?: (id: string) => void;
}

export function SerialAndBatchEntryList({ data, onRowClick }: SerialAndBatchEntryListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial No</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch No</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
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
              <td className="px-4 py-3 text-sm">{String(row.serial_no ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.batch_no ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.warehouse ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}