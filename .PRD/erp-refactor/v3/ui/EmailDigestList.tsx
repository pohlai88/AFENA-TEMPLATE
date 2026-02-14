// List scaffold for Email Digest
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { EmailDigest } from '../types/email-digest.js';

interface EmailDigestListProps {
  data: EmailDigest[];
  onRowClick?: (id: string) => void;
}

export function EmailDigestList({ data, onRowClick }: EmailDigestListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enabled</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">For Company</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">How frequently?</th>
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
              <td className="px-4 py-3 text-sm">{String(row.enabled ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.company ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.frequency ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}