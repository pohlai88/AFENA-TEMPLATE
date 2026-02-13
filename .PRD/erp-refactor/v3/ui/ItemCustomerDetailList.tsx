// List scaffold for Item Customer Detail
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ItemCustomerDetail } from '../types/item-customer-detail.js';

interface ItemCustomerDetailListProps {
  data: ItemCustomerDetail[];
  onRowClick?: (id: string) => void;
}

export function ItemCustomerDetailList({ data, onRowClick }: ItemCustomerDetailListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Group</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ref Code</th>
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
              <td className="px-4 py-3 text-sm">{String(row.customer_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.customer_group ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.ref_code ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}