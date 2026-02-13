// List scaffold for Stock Ledger Entry
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { StockLedgerEntry } from '../types/stock-ledger-entry.js';

interface StockLedgerEntryListProps {
  data: StockLedgerEntry[];
  onRowClick?: (id: string) => void;
}

export function StockLedgerEntryList({ data, onRowClick }: StockLedgerEntryListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warehouse</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posting Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voucher No</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty Change</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Incoming Rate</th>
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
              <td className="px-4 py-3 text-sm">{String(row.posting_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.voucher_no ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.actual_qty ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.incoming_rate ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}