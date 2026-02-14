// List scaffold for Video
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { Video } from '../types/video.js';

interface VideoListProps {
  data: Video[];
  onRowClick?: (id: string) => void;
}

export function VideoList({ data, onRowClick }: VideoListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Publish Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Likes</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
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
              <td className="px-4 py-3 text-sm">{String(row.title ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.provider ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.publish_date ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.like_count ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.view_count ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}