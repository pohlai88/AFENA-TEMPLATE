// List scaffold for Production Plan Sales Order
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ProductionPlanSalesOrder } from '../types/production-plan-sales-order.js';

interface ProductionPlanSalesOrderListProps {
  data: ProductionPlanSalesOrder[];
  onRowClick?: (id: string) => void;
}

export function ProductionPlanSalesOrderList({ data, onRowClick }: ProductionPlanSalesOrderListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales Order</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales Order Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grand Total</th>
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
              <td className="px-4 py-3 text-sm">{String(row.sales_order ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.sales_order_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.customer ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.grand_total ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.status ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}