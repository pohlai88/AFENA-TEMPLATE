// List scaffold for Subcontracting Inward Order Scrap Item
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { SubcontractingInwardOrderScrapItem } from '../types/subcontracting-inward-order-scrap-item.js';

interface SubcontractingInwardOrderScrapItemListProps {
  data: SubcontractingInwardOrderScrapItem[];
  onRowClick?: (id: string) => void;
}

export function SubcontractingInwardOrderScrapItemList({ data, onRowClick }: SubcontractingInwardOrderScrapItemListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Finished Good Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produced Qty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivered Qty</th>
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
              <td className="px-4 py-3 text-sm">{String(row.fg_item_code ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.produced_qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.delivered_qty ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}