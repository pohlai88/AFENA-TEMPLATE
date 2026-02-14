// List scaffold for Subcontracting Inward Order
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { SubcontractingInwardOrder } from '../types/subcontracting-inward-order.js';

interface SubcontractingInwardOrderListProps {
  data: SubcontractingInwardOrder[];
  onRowClick?: (id: string) => void;
}

export function SubcontractingInwardOrderList({ data, onRowClick }: SubcontractingInwardOrderListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Raw Material Received</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Produced</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Delivered</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Raw Material Returned</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Process Loss</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Returned</th>
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
              <td className="px-4 py-3 text-sm">{String(row.transaction_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.per_raw_material_received ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.per_produced ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.per_delivered ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.per_raw_material_returned ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.per_process_loss ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.per_returned ?? '')}</td>
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