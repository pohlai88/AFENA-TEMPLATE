// List scaffold for Sales Taxes and Charges
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { SalesTaxesAndCharges } from '../types/sales-taxes-and-charges.js';

interface SalesTaxesAndChargesListProps {
  data: SalesTaxesAndCharges[];
  onRowClick?: (id: string) => void;
}

export function SalesTaxesAndChargesList({ data, onRowClick }: SalesTaxesAndChargesListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Head</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax Rate</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
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
              <td className="px-4 py-3 text-sm">{String(row.charge_type ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.account_head ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.rate ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.net_amount ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.tax_amount ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.total ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}