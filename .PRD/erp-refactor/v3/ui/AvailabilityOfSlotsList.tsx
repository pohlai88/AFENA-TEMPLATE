// List scaffold for Availability Of Slots
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { AvailabilityOfSlots } from '../types/availability-of-slots.js';

interface AvailabilityOfSlotsListProps {
  data: AvailabilityOfSlots[];
  onRowClick?: (id: string) => void;
}

export function AvailabilityOfSlotsList({ data, onRowClick }: AvailabilityOfSlotsListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day Of Week</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From Time</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">To Time</th>
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
              <td className="px-4 py-3 text-sm">{String(row.day_of_week ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.from_time ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.to_time ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}