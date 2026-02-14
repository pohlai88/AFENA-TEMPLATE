// List scaffold for Work Order Item
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { WorkOrderItem } from '../types/work-order-item.js';

interface WorkOrderItemListProps {
  data: WorkOrderItem[];
  onRowClick?: (id: string) => void;
}

export function WorkOrderItemList({ data, onRowClick }: WorkOrderItemListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source Warehouse</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Required Qty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transferred Qty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Consumed Qty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Returned Qty </th>
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
              <td className="px-4 py-3 text-sm">{String(row.item_code ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.source_warehouse ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.required_qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.transferred_qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.consumed_qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.returned_qty ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}