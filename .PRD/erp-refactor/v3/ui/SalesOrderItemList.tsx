// List scaffold for Sales Order Item
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { SalesOrderItem } from '../types/sales-order-item.js';

interface SalesOrderItemListProps {
  data: SalesOrderItem[];
  onRowClick?: (id: string) => void;
}

export function SalesOrderItemList({ data, onRowClick }: SalesOrderItemListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
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
              <td className="px-4 py-3 text-sm">{String(row.delivery_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.rate ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.amount ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}