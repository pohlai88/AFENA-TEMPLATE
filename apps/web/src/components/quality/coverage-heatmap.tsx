'use client';

/**
 * Coverage Heatmap Component
 *
 * Visualizes test coverage across all workspace packages
 * Color-coded cells show coverage levels: green (>90%), yellow (80-90%), orange (60-80%), red (<60%)
 */

import { useEffect, useState } from 'react';

interface PackageCoverage {
  name: string;
  lines: number;
  functions: number;
  statements: number;
  branches: number;
  overall: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

interface CoverageHeatmapData {
  packages: PackageCoverage[];
  timestamp: string;
  averages: {
    lines: number;
    functions: number;
    statements: number;
    branches: number;
  };
}

/**
 * Get color class based on coverage percentage
 */
function getCoverageColor(coverage: number): string {
  if (coverage >= 90) return 'bg-green-500';
  if (coverage >= 80) return 'bg-yellow-500';
  if (coverage >= 60) return 'bg-orange-500';
  return 'bg-red-500';
}

/**
 * Get text color for contrast
 */
function getTextColor(coverage: number): string {
  return coverage >= 60 ? 'text-white' : 'text-gray-900';
}

export default function CoverageHeatmap() {
  const [data, setData] = useState<CoverageHeatmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHeatmap() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/quality/coverage-heatmap');

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `API returned ${res.status}`);
        }

        const heatmapData = await res.json();
        setData(heatmapData);
      } catch (err) {
        console.error('Failed to fetch coverage heatmap:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchHeatmap();

    // Refresh every 60 seconds
    const interval = setInterval(fetchHeatmap, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="mb-2 text-2xl">📊</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading coverage heatmap...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-700 dark:bg-red-900/20">
        <div className="text-center">
          <div className="mb-2 text-2xl">❌</div>
          <p className="text-sm font-medium text-red-800 dark:text-red-400">
            Failed to load coverage heatmap
          </p>
          <p className="mt-1 text-xs text-red-600 dark:text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!data || data.packages.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="text-center">
          <div className="mb-2 text-2xl">📦</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">No coverage data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          📊 Coverage Heatmap
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Test coverage across all workspace packages
        </p>
      </div>

      {/* Heatmap Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                Package
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                Lines
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                Functions
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                Statements
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                Branches
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-300">
                Overall
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.packages.map((pkg) => (
              <tr key={pkg.name} className="dark:hover:bg-gray-750 hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {pkg.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div
                    className={`inline-flex items-center justify-center rounded px-3 py-1 text-sm font-semibold ${getCoverageColor(pkg.lines)} ${getTextColor(pkg.lines)}`}
                  >
                    {pkg.lines.toFixed(1)}%
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div
                    className={`inline-flex items-center justify-center rounded px-3 py-1 text-sm font-semibold ${getCoverageColor(pkg.functions)} ${getTextColor(pkg.functions)}`}
                  >
                    {pkg.functions.toFixed(1)}%
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div
                    className={`inline-flex items-center justify-center rounded px-3 py-1 text-sm font-semibold ${getCoverageColor(pkg.statements)} ${getTextColor(pkg.statements)}`}
                  >
                    {pkg.statements.toFixed(1)}%
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div
                    className={`inline-flex items-center justify-center rounded px-3 py-1 text-sm font-semibold ${getCoverageColor(pkg.branches)} ${getTextColor(pkg.branches)}`}
                  >
                    {pkg.branches.toFixed(1)}%
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div
                    className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-base font-bold ${getCoverageColor(pkg.overall)} ${getTextColor(pkg.overall)}`}
                  >
                    {pkg.overall.toFixed(1)}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold dark:border-gray-600 dark:bg-gray-900">
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">Average</td>
              <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                {data.averages.lines.toFixed(1)}%
              </td>
              <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                {data.averages.functions.toFixed(1)}%
              </td>
              <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                {data.averages.statements.toFixed(1)}%
              </td>
              <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                {data.averages.branches.toFixed(1)}%
              </td>
              <td className="px-4 py-3 text-center text-sm font-bold text-gray-900 dark:text-gray-100">
                {(
                  (data.averages.lines +
                    data.averages.functions +
                    data.averages.statements +
                    data.averages.branches) /
                  4
                ).toFixed(1)}
                %
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-400">Legend:</span>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-green-500"></div>
              <span className="text-gray-700 dark:text-gray-300">≥90% Excellent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-yellow-500"></div>
              <span className="text-gray-700 dark:text-gray-300">80-90% Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-orange-500"></div>
              <span className="text-gray-700 dark:text-gray-300">60-80% Fair</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-red-500"></div>
              <span className="text-gray-700 dark:text-gray-300">&lt;60% Poor</span>
            </div>
          </div>
          <span className="text-gray-500 dark:text-gray-500">
            Updated: {new Date(data.timestamp).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
