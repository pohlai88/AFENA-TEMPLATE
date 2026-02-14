// List scaffold for Production Plan Item Reference
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ProductionPlanItemReference } from '../types/production-plan-item-reference.js';

interface ProductionPlanItemReferenceListProps {
  data: ProductionPlanItemReference[];
  onRowClick?: (id: string) => void;
}

export function ProductionPlanItemReferenceList({ data, onRowClick }: ProductionPlanItemReferenceListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Reference</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales Order Reference</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales Order Item</th>
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
              <td className="px-4 py-3 text-sm">{String(row.item_reference ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.sales_order ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.sales_order_item ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.qty ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}