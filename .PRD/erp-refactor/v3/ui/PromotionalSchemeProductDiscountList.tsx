// List scaffold for Promotional Scheme Product Discount
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { PromotionalSchemeProductDiscount } from '../types/promotional-scheme-product-discount.js';

interface PromotionalSchemeProductDiscountListProps {
  data: PromotionalSchemeProductDiscount[];
  onRowClick?: (id: string) => void;
}

export function PromotionalSchemeProductDiscountList({ data, onRowClick }: PromotionalSchemeProductDiscountListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Qty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Qty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
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
              <td className="px-4 py-3 text-sm">{String(row.min_qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.max_qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.min_amount ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.max_amount ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.free_item ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.free_qty ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}