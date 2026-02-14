// List scaffold for Journal Entry Account
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { JournalEntryAccount } from '../types/journal-entry-account.js';

interface JournalEntryAccountListProps {
  data: JournalEntryAccount[];
  onRowClick?: (id: string) => void;
}

export function JournalEntryAccountList({ data, onRowClick }: JournalEntryAccountListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Party Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Party</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Debit</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credit</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference Name</th>
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
              <td className="px-4 py-3 text-sm">{String(row.party_type ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.party ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.debit_in_account_currency ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.credit_in_account_currency ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.reference_name ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}