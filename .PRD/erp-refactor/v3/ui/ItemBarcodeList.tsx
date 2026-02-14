// List scaffold for Item Barcode
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ItemBarcode } from '../types/item-barcode.js';

interface ItemBarcodeListProps {
  data: ItemBarcode[];
  onRowClick?: (id: string) => void;
}

export function ItemBarcodeList({ data, onRowClick }: ItemBarcodeListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Barcode</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Barcode Type</th>
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
              <td className="px-4 py-3 text-sm">{String(row.barcode ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.barcode_type ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.uom ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}