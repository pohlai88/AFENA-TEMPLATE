// List scaffold for Project User
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { ProjectUser } from '../types/project-user.js';

interface ProjectUserListProps {
  data: ProjectUser[];
  onRowClick?: (id: string) => void;
}

export function ProjectUserList({ data, onRowClick }: ProjectUserListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">View attachments</th>
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
              <td className="px-4 py-3 text-sm">{String(row.user ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.full_name ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.view_attachments ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}