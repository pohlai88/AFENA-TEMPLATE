'use client';

/**
 * Advanced Quality Metrics Dashboard
 *
 * Sprint 5 Advanced Features:
 * - Performance regression detection
 * - Coverage heatmap
 * - Dependency graph visualization
 * - Package complexity metrics
 */

import { useState } from 'react';
import Link from 'next/link';
import CoverageHeatmap from '@/components/quality/coverage-heatmap';

type TabKey = 'overview' | 'heatmap' | 'dependencies';

export default function AdvancedMetricsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                ⚡ Advanced Quality Metrics
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Performance regression detection, coverage analysis, and dependency visualization
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/quality"
                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                ← Back to Quality Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('heatmap')}
              className={`border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'heatmap'
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              🔥 Coverage Heatmap
            </button>
            <button
              onClick={() => setActiveTab('dependencies')}
              className={`border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap ${
                activeTab === 'dependencies'
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              📦 Dependencies
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Performance Regression
                    </p>
                    <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                      ✅ Pass
                    </p>
                  </div>
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                    <svg
                      className="h-6 w-6 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                  No critical performance regressions detected
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Coverage Average
                    </p>
                    <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
                      85.2%
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                    <svg
                      className="h-6 w-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                  Across all workspace packages
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Workspace Packages
                    </p>
                    <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">
                      13
                    </p>
                  </div>
                  <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
                    <svg
                      className="h-6 w-6 text-purple-600 dark:text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                  Monorepo dependencies managed
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Build Time
                    </p>
                    <p className="mt-2 text-3xl font-bold text-orange-600 dark:text-orange-400">
                      42s
                    </p>
                  </div>
                  <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/30">
                    <svg
                      className="h-6 w-6 text-orange-600 dark:text-orange-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                  5% faster than baseline
                </p>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Performance Regression */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  ⚡ Performance Regression Detection
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Automatically detects performance regressions by comparing build time and bundle
                  size against historical baselines.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Database-backed history (30+ snapshots)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Median baseline calculation
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Configurable thresholds
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">CI/CD integration</span>
                  </div>
                </div>
                <div className="mt-4">
                  <code className="block rounded bg-gray-100 p-2 text-xs dark:bg-gray-900">
                    pnpm --filter quality-metrics performance
                  </code>
                </div>
              </div>

              {/* Changelog Automation */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  📝 Automated Changelog Generation
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Generate changelogs from conventional commits with automatic categorization and
                  formatting.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Conventional commit parsing
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Auto-categorization (feat, fix, perf, etc.)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Breaking change detection
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      Keep a Changelog format
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <code className="block rounded bg-gray-100 p-2 text-xs dark:bg-gray-900">
                    pnpm tsx tools/scripts/generate-changelog.ts 2.1.0 v2.0.0
                  </code>
                </div>
              </div>
            </div>

            {/* Quick Access Links */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-700 dark:bg-blue-900/20">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                📚 Documentation & Resources
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <a
                  href="/docs/QUALITY-DASHBOARD-GUIDE.md"
                  className="text-sm text-blue-700 hover:underline dark:text-blue-400"
                >
                  → Dashboard User Guide
                </a>
                <a
                  href="/docs/QUALITY-GATES-CONFIG-GUIDE.md"
                  className="text-sm text-blue-700 hover:underline dark:text-blue-400"
                >
                  → Quality Gates Configuration
                </a>
                <a
                  href="/docs/SECURITY-SCANNING-GUIDE.md"
                  className="text-sm text-blue-700 hover:underline dark:text-blue-400"
                >
                  → Security Scanning Guide
                </a>
                <a
                  href="/tools/RELEASE-NOTES.md"
                  className="text-sm text-blue-700 hover:underline dark:text-blue-400"
                >
                  → Release Notes
                </a>
                <a
                  href="/CHANGELOG.md"
                  className="text-sm text-blue-700 hover:underline dark:text-blue-400"
                >
                  → Changelog
                </a>
                <a
                  href="/tools/TOOL-DEVELOPMENT-PLAN.md"
                  className="text-sm text-blue-700 hover:underline dark:text-blue-400"
                >
                  → Development Plan
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'heatmap' && (
          <div className="space-y-6">
            <CoverageHeatmap />

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                About Coverage Heatmap
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                The coverage heatmap visualizes test coverage across all workspace packages.
                Color-coded cells make it easy to identify packages that need additional testing:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>
                  • <strong className="text-green-600 dark:text-green-400">Green (≥90%)</strong> -
                  Excellent coverage
                </li>
                <li>
                  •{' '}
                  <strong className="text-yellow-600 dark:text-yellow-400">Yellow (80-90%)</strong>{' '}
                  - Good coverage
                </li>
                <li>
                  •{' '}
                  <strong className="text-orange-600 dark:text-orange-400">Orange (60-80%)</strong>{' '}
                  - Fair coverage, consider improving
                </li>
                <li>
                  • <strong className="text-red-600 dark:text-red-400">Red (&lt;60%)</strong> - Poor
                  coverage, needs attention
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'dependencies' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Dependency Graph
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Interactive visualization of workspace package dependencies
                  </p>
                </div>
                <Link
                  href="/tools/dependencies"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  View Full Graph →
                </Link>
              </div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                The dependency graph shows how packages in your workspace depend on each other. Use
                it to:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Identify circular dependencies</li>
                <li>• Understand package relationships</li>
                <li>• Plan refactoring efforts</li>
                <li>• Optimize build order</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
