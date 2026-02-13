// List scaffold for Employee Education
// Generated from Canon schema — do not edit manually
import React from 'react';
import type { EmployeeEducation } from '../types/employee-education.js';

interface EmployeeEducationListProps {
  data: EmployeeEducation[];
  onRowClick?: (id: string) => void;
}

export function EmployeeEducationList({ data, onRowClick }: EmployeeEducationListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">School/University</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qualification</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year of Passing</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class / Percentage</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Major/Optional Subjects</th>
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
              <td className="px-4 py-3 text-sm">{String(row.school_univ ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.qualification ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.level ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.year_of_passing ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.class_per ?? '')}</td>
              <td className="px-4 py-3 text-sm">{String(row.maj_opt_subj ?? '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}