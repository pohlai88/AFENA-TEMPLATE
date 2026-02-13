// List scaffold for Issue
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { Issue } from '../types/issue.js';

interface IssueListProps {
  data: Issue[];
  onRowClick?: (id: string) => void;
}

export function IssueList({ data, onRowClick }: IssueListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Raised By (Email)</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
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
              <td className="px-4 py-3 text-sm">{String(row.raised_by ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.status ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.priority ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}