// List scaffold for Exchange Rate Revaluation Account
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ExchangeRateRevaluationAccount } from '../types/exchange-rate-revaluation-account.js';

interface ExchangeRateRevaluationAccountListProps {
  data: ExchangeRateRevaluationAccount[];
  onRowClick?: (id: string) => void;
}

export function ExchangeRateRevaluationAccountList({ data, onRowClick }: ExchangeRateRevaluationAccountListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">New Exchange Rate</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance In Base Currency</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">New Balance In Base Currency</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gain/Loss</th>
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
              <td className="px-4 py-3 text-sm">{String(row.account ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.new_exchange_rate ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.balance_in_base_currency ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.new_balance_in_base_currency ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.gain_loss ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}