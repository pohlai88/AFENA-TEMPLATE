// List scaffold for Project
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { Project } from '../types/project.js';

interface ProjectListProps {
  data: Project[];
  onRowClick?: (id: string) => void;
}

export function ProjectList({ data, onRowClick }: ProjectListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project Type</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected End Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estimated Cost</th>
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
              <td className="px-4 py-3 text-sm">{String(row.project_type ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.expected_end_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.estimated_costing ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}