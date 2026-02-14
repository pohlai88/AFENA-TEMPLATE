// List scaffold for Production Plan Sub Assembly Item
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ProductionPlanSubAssemblyItem } from '../types/production-plan-sub-assembly-item.js';

interface ProductionPlanSubAssemblyItemListProps {
  data: ProductionPlanSubAssemblyItem[];
  onRowClick?: (id: string) => void;
}

export function ProductionPlanSubAssemblyItemList({ data, onRowClick }: ProductionPlanSubAssemblyItemListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sub Assembly Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">BOM No</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manufacturing Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Required Qty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Projected Qty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty to Order</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
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
              <td className="px-4 py-3 text-sm">{String(row.production_item ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.bom_no ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.type_of_manufacturing ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.required_qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.projected_qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.supplier ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}