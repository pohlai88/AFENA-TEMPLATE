// List scaffold for Subcontracting Receipt Supplied Item
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { SubcontractingReceiptSuppliedItem } from '../types/subcontracting-receipt-supplied-item.js';

interface SubcontractingReceiptSuppliedItemListProps {
  data: SubcontractingReceiptSuppliedItem[];
  onRowClick?: (id: string) => void;
}

export function SubcontractingReceiptSuppliedItemList({ data, onRowClick }: SubcontractingReceiptSuppliedItemListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Raw Material Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">BOM Detail No</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Required Qty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Consumed Qty</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial / Batch Bundle</th>
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
              <td className="px-4 py-3 text-sm">{String(row.bom_detail_no ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.reference_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.rate ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.required_qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.consumed_qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.serial_and_batch_bundle ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}