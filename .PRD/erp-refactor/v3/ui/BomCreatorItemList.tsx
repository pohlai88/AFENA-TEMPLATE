// List scaffold for BOM Creator Item
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { BomCreatorItem } from '../types/bom-creator-item.js';

interface BomCreatorItemListProps {
  data: BomCreatorItem[];
  onRowClick?: (id: string) => void;
}

export function BomCreatorItemList({ data, onRowClick }: BomCreatorItemListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Finished Goods Item</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Is Expandable</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">UOM</th>
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
              <td className="px-4 py-3 text-sm">{String(row.fg_item ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.is_expandable ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.rate ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.uom ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}