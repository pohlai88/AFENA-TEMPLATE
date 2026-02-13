// List scaffold for Material Request Plan Item
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { MaterialRequestPlanItem } from '../types/material-request-plan-item.js';

interface MaterialRequestPlanItemListProps {
  data: MaterialRequestPlanItem[];
  onRowClick?: (id: string) => void;
}

export function MaterialRequestPlanItemList({ data, onRowClick }: MaterialRequestPlanItemListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">For Warehouse</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reqd Qty (BOM)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projected Qty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Required Qty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Required By</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Minimum Order Quantity</th>
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
              <td className="px-4 py-3 text-sm">{String(row.warehouse ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.material_request_type ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.required_bom_qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.projected_qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.quantity ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.schedule_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.min_order_qty ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}