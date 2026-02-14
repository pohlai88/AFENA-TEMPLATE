// List scaffold for Purchase Receipt Item
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { PurchaseReceiptItem } from '../types/purchase-receipt-item.js';

interface PurchaseReceiptItemListProps {
  data: PurchaseReceiptItem[];
  onRowClick?: (id: string) => void;
}

export function PurchaseReceiptItemList({ data, onRowClick }: PurchaseReceiptItemListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accepted Quantity</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rejected Quantity</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Accepted Warehouse</th>
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
              <td className="px-4 py-3 text-sm">{String(row.qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.rejected_qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.rate ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.amount ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.warehouse ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}