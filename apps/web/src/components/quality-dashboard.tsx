'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Badge } from '@/components/badge';
import { Skeleton } from '@/components/skeleton';

interface QualityMetrics {
  timestamp: string;
  coverage: {
    lines: number;
    functions: number;
    branches: number;
    statements: number;
  };
  build: {
    duration: number;
    cacheHitRate: number;
    bundleSize: number;
  };
  codeQuality: {
    typeErrors: number;
    lintWarnings: number;
    lintErrors: number;
    todoCount: number;
    filesCount: number;
    linesOfCode: number;
  };
  git: {
    commitCount: number;
    contributors: number;
    lastCommitDate: string;
    filesChanged: number;
  };
}

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  status?: 'pass' | 'warn' | 'fail';
  progress?: number;
}

function MetricCard({ title, value, description, status, progress }: MetricCardProps) {
  const statusColors = {
    pass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warn: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    fail: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {title}
        </CardTitle>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
          {status && (
            <Badge className={statusColors[status]}>
              {status === 'pass' ? '✓' : status === 'warn' ? '⚠' : '✗'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
        {progress !== undefined && (
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-3 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function QualityDashboard() {
  const [metrics, setMetrics] = useState<QualityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch('/api/quality/metrics');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch metrics');
        }

        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();

    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 dark:text-slate-400">{error}</p>
          <p className="mt-2 text-sm text-slate-500">
            Run{' '}
            <code className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">
              pnpm --filter quality-metrics collect
            </code>{' '}
            to generate metrics.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return null;
  }

  const { coverage, build, codeQuality, git } = metrics;

  return (
    <div className="space-y-6">
      {/* Updated timestamp */}
      <div className="text-sm text-slate-500 dark:text-slate-400">
        Last updated: {new Date(metrics.timestamp).toLocaleString()}
      </div>

      {/* Metrics grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Test Coverage"
          value={`${coverage.lines.toFixed(1)}%`}
          description="Lines covered by tests"
          status={coverage.lines >= 80 ? 'pass' : coverage.lines >= 70 ? 'warn' : 'fail'}
          progress={coverage.lines}
        />

        <MetricCard
          title="Type Safety"
          value={codeQuality.typeErrors}
          description="TypeScript errors"
          status={codeQuality.typeErrors === 0 ? 'pass' : 'fail'}
        />

        <MetricCard
          title="Lint Quality"
          value={codeQuality.lintErrors}
          description={`${codeQuality.lintWarnings} warnings`}
          status={codeQuality.lintErrors === 0 ? 'pass' : 'fail'}
        />

        <MetricCard
          title="Build Time"
          value={`${(build.duration / 1000).toFixed(1)}s`}
          description="Build duration"
          status={build.duration < 60000 ? 'pass' : 'warn'}
        />

        <MetricCard
          title="Cache Hit Rate"
          value={`${build.cacheHitRate.toFixed(1)}%`}
          description="Turborepo cache efficiency"
          progress={build.cacheHitRate}
        />

        <MetricCard
          title="Code Size"
          value={codeQuality.linesOfCode.toLocaleString()}
          description={`${codeQuality.filesCount} files`}
        />

        <MetricCard
          title="Technical Debt"
          value={codeQuality.todoCount}
          description="TODO/FIXME comments"
          status={
            codeQuality.todoCount < 50 ? 'pass' : codeQuality.todoCount < 100 ? 'warn' : 'fail'
          }
        />

        <MetricCard
          title="Contributors"
          value={git.contributors}
          description={`${git.commitCount} commits`}
        />
      </div>

      {/* Coverage breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Coverage Breakdown</CardTitle>
          <CardDescription>Detailed test coverage metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: 'Lines', value: coverage.lines, threshold: 80 },
              { label: 'Functions', value: coverage.functions, threshold: 80 },
              { label: 'Branches', value: coverage.branches, threshold: 75 },
              { label: 'Statements', value: coverage.statements, threshold: 80 },
            ].map(({ label, value, threshold }) => (
              <div key={label}>
                <div className="mb-1 flex justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {value.toFixed(1)}% {value >= threshold ? '✓' : '✗'}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className={`h-full transition-all duration-500 ${
                      value >= threshold
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-600'
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
