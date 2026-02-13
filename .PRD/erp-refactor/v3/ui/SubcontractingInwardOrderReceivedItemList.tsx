// List scaffold for Subcontracting Inward Order Received Item
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { SubcontractingInwardOrderReceivedItem } from '../types/subcontracting-inward-order-received-item.js';

interface SubcontractingInwardOrderReceivedItemListProps {
  data: SubcontractingInwardOrderReceivedItem[];
  onRowClick?: (id: string) => void;
}

export function SubcontractingInwardOrderReceivedItemList({ data, onRowClick }: SubcontractingInwardOrderReceivedItemListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Raw Material Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Required Qty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Received Qty</th>
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
              <td className="px-4 py-3 text-sm">{String(row.main_item_code ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.rm_item_code ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.required_qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.received_qty ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}