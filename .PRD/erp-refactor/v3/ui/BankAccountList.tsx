// List scaffold for Bank Account
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { BankAccount } from '../types/bank-account.js';

interface BankAccountListProps {
  data: BankAccount[];
  onRowClick?: (id: string) => void;
}

export function BankAccountList({ data, onRowClick }: BankAccountListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company Account</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IBAN</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank Account No</th>
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
              <td className="px-4 py-3 text-sm">{String(row.account_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.account ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.company ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.iban ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.bank_account_no ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}