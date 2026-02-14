// List scaffold for Quality Meeting Minutes
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { QualityMeetingMinutes } from '../types/quality-meeting-minutes.js';

interface QualityMeetingMinutesListProps {
  data: QualityMeetingMinutes[];
  onRowClick?: (id: string) => void;
}

export function QualityMeetingMinutesList({ data, onRowClick }: QualityMeetingMinutesListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Minute</th>
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
              <td className="px-4 py-3 text-sm">{String(row.document_type ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.document_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.minute ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}