// List scaffold for Packing Slip
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { PackingSlip } from '../types/packing-slip.js';

interface PackingSlipListProps {
  data: PackingSlip[];
  onRowClick?: (id: string) => void;
}

export function PackingSlipList({ data, onRowClick }: PackingSlipListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Note</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From Package No.</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">To Package No.</th>
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
              <td className="px-4 py-3 text-sm">{String(row.delivery_note ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.from_case_no ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.to_case_no ?? '')}</td>
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