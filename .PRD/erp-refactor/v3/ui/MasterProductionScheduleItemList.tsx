// List scaffold for Master Production Schedule Item
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { MasterProductionScheduleItem } from '../types/master-production-schedule-item.js';

interface MasterProductionScheduleItemListProps {
  data: MasterProductionScheduleItem[];
  onRowClick?: (id: string) => void;
}

export function MasterProductionScheduleItemList({ data, onRowClick }: MasterProductionScheduleItemListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead Time</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Planned Qty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">BOM No</th>
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
              <td className="px-4 py-3 text-sm">{String(row.cumulative_lead_time ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.order_release_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.planned_qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.bom_no ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}