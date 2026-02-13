// List scaffold for Sales Order
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { SalesOrder } from '../types/sales-order.js';

interface SalesOrderListProps {
  data: SalesOrder[];
  onRowClick?: (id: string) => void;
}

export function SalesOrderList({ data, onRowClick }: SalesOrderListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grand Total</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">%  Delivered</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Amount Billed</th>
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
              <td className="px-4 py-3 text-sm">{String(row.delivery_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.grand_total ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.status ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.per_delivered ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.per_billed ?? '')}</td>
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