'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Badge } from '@/components/badge';
import { Skeleton } from '@/components/skeleton';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Code,
  GitBranch,
  Package,
} from 'lucide-react';

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

interface TrendData {
  date: string;
  coverage: number;
  buildTime: number;
  typeErrors: number;
  lintErrors: number;
  bundleSize: number;
  cacheHitRate: number;
}

interface PackageMetric {
  packageName: string;
  coverage: number;
  lines: number;
  complexity: number;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  status?: 'pass' | 'warn' | 'fail';
  progress?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
}

function MetricCard({ title, value, description, status, progress, icon, trend }: MetricCardProps) {
  const statusColors = {
    pass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warn: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    fail: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const trendIcons = {
    up: <TrendingUp className="h-4 w-4 text-green-600" />,
    down: <TrendingDown className="h-4 w-4 text-red-600" />,
    stable: <div className="h-4 w-4" />,
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            {icon}
            {title}
          </CardTitle>
          {status && (
            <Badge className={statusColors[status]} variant="secondary">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{value}</div>
          {trend && trendIcons[trend]}
        </div>
        <p className="text-muted-foreground mt-1 text-xs">{description}</p>
        {progress !== undefined && (
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 transition-all duration-500"
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
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-2 h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${seconds}s`;
}

function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function QualityDashboard() {
  const [metrics, setMetrics] = useState<QualityMetrics | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [packageMetrics, setPackageMetrics] = useState<PackageMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch current metrics
        const metricsRes = await fetch('/api/quality/metrics');
        if (!metricsRes.ok) throw new Error('Failed to fetch metrics');
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);

        // Fetch trends (last 7 days)
        const trendsRes = await fetch('/api/quality/trends?days=7');
        if (trendsRes.ok) {
          const trendsData = await trendsRes.json();
          setTrends(trendsData);
        }

        // Fetch package metrics
        const historyRes = await fetch('/api/quality/history?limit=1');
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          if (historyData[0]?.packages) {
            setPackageMetrics(historyData[0].packages.slice(0, 5)); // Top 5 packages
          }
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-100">
            <AlertTriangle className="h-5 w-5" />
            Error Loading Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) return null;

  const { coverage, build, codeQuality, git } = metrics;

  const coverageStatus = coverage.lines >= 80 ? 'pass' : coverage.lines >= 70 ? 'warn' : 'fail';
  const qualityStatus =
    codeQuality.typeErrors === 0 && codeQuality.lintErrors === 0
      ? 'pass'
      : codeQuality.typeErrors < 5 && codeQuality.lintErrors < 10
        ? 'warn'
        : 'fail';

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Test Coverage"
          value={`${coverage.lines.toFixed(1)}%`}
          description="Line coverage"
          status={coverageStatus}
          progress={coverage.lines}
          icon={<CheckCircle className="h-4 w-4" />}
        />
        <MetricCard
          title="Type Errors"
          value={codeQuality.typeErrors}
          description={`${codeQuality.lintErrors} lint errors`}
          status={qualityStatus}
          icon={<Code className="h-4 w-4" />}
        />
        <MetricCard
          title="Build Time"
          value={formatDuration(build.duration)}
          description={`Cache: ${build.cacheHitRate.toFixed(1)}%`}
          icon={<Clock className="h-4 w-4" />}
        />
        <MetricCard
          title="Bundle Size"
          value={formatBytes(build.bundleSize)}
          description={`${codeQuality.filesCount} files`}
          icon={<Package className="h-4 w-4" />}
        />
      </div>

      {/* Coverage Breakdown */}
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

      {/* Trend Charts */}
      {trends.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Coverage Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Coverage Trend (7 Days)</CardTitle>
              <CardDescription>Test coverage over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={trends}>
                  <defs>
                    <linearGradient id="colorCoverage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-slate-200 dark:stroke-slate-700"
                  />
                  <XAxis dataKey="date" tickFormatter={formatDate} className="text-xs" />
                  <YAxis domain={[0, 100]} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="coverage"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorCoverage)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Build Time Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Build Performance (7 Days)</CardTitle>
              <CardDescription>Build time and bundle size trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trends}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-slate-200 dark:stroke-slate-700"
                  />
                  <XAxis dataKey="date" tickFormatter={formatDate} className="text-xs" />
                  <YAxis yAxisId="left" className="text-xs" />
                  <YAxis yAxisId="right" orientation="right" className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="buildTime"
                    stroke="#3b82f6"
                    name="Build Time (ms)"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="bundleSize"
                    stroke="#8b5cf6"
                    name="Bundle Size (MB)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quality Metrics Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Quality Metrics (7 Days)</CardTitle>
              <CardDescription>Type and lint errors over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={trends}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-slate-200 dark:stroke-slate-700"
                  />
                  <XAxis dataKey="date" tickFormatter={formatDate} className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="typeErrors" fill="#ef4444" name="Type Errors" />
                  <Bar dataKey="lintErrors" fill="#f59e0b" name="Lint Errors" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cache Hit Rate Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Build Cache Performance</CardTitle>
              <CardDescription>Cache hit rate over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={trends}>
                  <defs>
                    <linearGradient id="colorCache" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-slate-200 dark:stroke-slate-700"
                  />
                  <XAxis dataKey="date" tickFormatter={formatDate} className="text-xs" />
                  <YAxis domain={[0, 100]} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cacheHitRate"
                    stroke="#06b6d4"
                    fillOpacity={1}
                    fill="url(#colorCache)"
                    name="Cache Hit Rate (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Package Metrics */}
      {packageMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Packages by Coverage</CardTitle>
            <CardDescription>Coverage metrics for key packages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {packageMetrics.map((pkg) => (
                <div key={pkg.packageName} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-medium">{pkg.packageName}</span>
                      <span className="text-muted-foreground text-xs">
                        {pkg.lines} lines | Complexity: {pkg.complexity}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className={`h-full transition-all duration-500 ${
                          pkg.coverage >= 80
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                            : pkg.coverage >= 60
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-600'
                              : 'bg-gradient-to-r from-red-500 to-rose-600'
                        }`}
                        style={{ width: `${pkg.coverage}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 w-16 text-right text-sm font-semibold">
                    {pkg.coverage.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Code Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Lines of Code</span>
                <span className="text-sm font-medium">
                  {codeQuality.linesOfCode.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Files</span>
                <span className="text-sm font-medium">{codeQuality.filesCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Technical Debt</span>
                <span className="text-sm font-medium">{codeQuality.todoCount} TODOs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Lint Warnings</span>
                <span className="text-sm font-medium">{codeQuality.lintWarnings}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Build Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Bundle Size</span>
                <span className="text-sm font-medium">{formatBytes(build.bundleSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Build Duration</span>
                <span className="text-sm font-medium">{formatDuration(build.duration)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Cache Hit Rate</span>
                <span className="text-sm font-medium">{build.cacheHitRate.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Repository Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Total Commits</span>
                <span className="text-sm font-medium">{git.commitCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Contributors</span>
                <span className="text-sm font-medium">{git.contributors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Files Changed</span>
                <span className="text-sm font-medium">{git.filesChanged}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Last Commit</span>
                <span className="text-sm font-medium">
                  {new Date(git.lastCommitDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
