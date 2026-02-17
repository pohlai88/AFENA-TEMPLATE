'use client';

/**
 * Advanced Analytics Dashboard
 *
 * Displays advanced quality analytics:
 * - Package complexity metrics
 * - Code churn hotspots
 * - Refactoring recommendations
 * - Maintainability trends
 *
 * @since Sprint 6
 */

import { Badge } from 'afenda-ui/components/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'afenda-ui/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'afenda-ui/components/tabs';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// --- Types ---

interface ComplexityMetrics {
  package: string;
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  linesOfCode: number;
  maintainabilityIndex: number;
}

interface Hotspot {
  file: string;
  churn: number;
  complexity: number;
  risk: 'high' | 'medium' | 'low';
}

interface ChurnMetrics {
  topChurnedFiles: Array<{
    file: string;
    changes: number;
    authors: string[];
  }>;
  hotspots: Hotspot[];
  volatility: number;
}

interface Recommendation {
  severity: 'critical' | 'warning' | 'info';
  message: string;
  package?: string;
}

// --- Components ---

function ComplexityChart({ data }: { data: ComplexityMetrics[] }) {
  const getColor = (mi: number) => {
    if (mi >= 80) return '#22c55e'; // green
    if (mi >= 60) return '#eab308'; // yellow
    if (mi >= 40) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="package" angle={-45} textAnchor="end" height={120} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="maintainabilityIndex" name="Maintainability Index">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.maintainabilityIndex)} />
          ))}
        </Bar>
        <Bar dataKey="cyclomaticComplexity" name="Cyclomatic Complexity" fill="#8b5cf6" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function HotspotScatterPlot({ data }: { data: Hotspot[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="churn" name="Churn (Changes)" />
        <YAxis dataKey="complexity" name="Complexity" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        <Scatter name="High Risk" data={data.filter((h) => h.risk === 'high')} fill="#ef4444" />
        <Scatter name="Medium Risk" data={data.filter((h) => h.risk === 'medium')} fill="#f97316" />
        <Scatter name="Low Risk" data={data.filter((h) => h.risk === 'low')} fill="#eab308" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

function RecommendationList({ recommendations }: { recommendations: Recommendation[] }) {
  const getSeverityBadge = (severity: Recommendation['severity']) => {
    const variants: Record<string, 'destructive' | 'default' | 'secondary'> = {
      critical: 'destructive',
      warning: 'default',
      info: 'secondary',
    };

    const labels = {
      critical: '🚨 Critical',
      warning: '⚠️ Warning',
      info: 'ℹ️ Info',
    };

    return <Badge variant={variants[severity] || 'default'}>{labels[severity]}</Badge>;
  };

  return (
    <div className="space-y-4">
      {recommendations.length === 0 ? (
        <p className="text-muted-foreground">No recommendations at this time. Great work! 🎉</p>
      ) : (
        recommendations.map((rec, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">{getSeverityBadge(rec.severity)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{rec.message}</p>
                  {rec.package && (
                    <p className="text-muted-foreground mt-1 text-xs">Package: {rec.package}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

function TopChurnedFiles({ files }: { files: ChurnMetrics['topChurnedFiles'] }) {
  return (
    <div className="space-y-2">
      {files.slice(0, 10).map((file, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-sm">{file.file}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {file.authors.length} author(s)
                </p>
              </div>
              <Badge variant="outline" className="ml-4">
                {file.changes} changes
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// --- Main Component ---

export default function AnalyticsDashboard() {
  const [complexityData, setComplexityData] = useState<ComplexityMetrics[]>([]);
  const [churnData, setChurnData] = useState<ChurnMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // TODO: Implement API endpoints
        // For now, use mock data

        const mockComplexity: ComplexityMetrics[] = [
          {
            package: 'accounting',
            cyclomaticComplexity: 45,
            cognitiveComplexity: 32,
            linesOfCode: 1250,
            maintainabilityIndex: 75,
          },
          {
            package: 'crm',
            cyclomaticComplexity: 38,
            cognitiveComplexity: 28,
            linesOfCode: 980,
            maintainabilityIndex: 82,
          },
          {
            package: 'inventory',
            cyclomaticComplexity: 62,
            cognitiveComplexity: 48,
            linesOfCode: 1890,
            maintainabilityIndex: 58,
          },
          {
            package: 'payroll',
            cyclomaticComplexity: 28,
            cognitiveComplexity: 20,
            linesOfCode: 720,
            maintainabilityIndex: 88,
          },
          {
            package: 'workflow',
            cyclomaticComplexity: 52,
            cognitiveComplexity: 40,
            linesOfCode: 1450,
            maintainabilityIndex: 65,
          },
        ];

        const mockChurn: ChurnMetrics = {
          topChurnedFiles: [
            {
              file: 'packages/inventory/src/stock-manager.ts',
              changes: 28,
              authors: ['Alice', 'Bob'],
            },
            { file: 'packages/crm/src/customer-service.ts', changes: 22, authors: ['Charlie'] },
            { file: 'packages/accounting/src/ledger.ts', changes: 19, authors: ['Alice', 'David'] },
            { file: 'packages/workflow/src/engine.ts', changes: 15, authors: ['Bob', 'Eve'] },
            { file: 'packages/payroll/src/calculator.ts', changes: 12, authors: ['Alice'] },
          ],
          hotspots: [
            {
              file: 'packages/inventory/src/stock-manager.ts',
              churn: 28,
              complexity: 35,
              risk: 'high',
            },
            { file: 'packages/workflow/src/engine.ts', churn: 15, complexity: 28, risk: 'medium' },
            {
              file: 'packages/accounting/src/ledger.ts',
              churn: 19,
              complexity: 18,
              risk: 'medium',
            },
            {
              file: 'packages/crm/src/customer-service.ts',
              churn: 22,
              complexity: 12,
              risk: 'low',
            },
          ],
          volatility: 8.2,
        };

        const mockRecommendations: Recommendation[] = [
          {
            severity: 'critical',
            message:
              'inventory package has low maintainability index (58) - urgent refactoring needed',
            package: 'inventory',
          },
          {
            severity: 'warning',
            message: 'High-risk hotspot detected: stock-manager.ts (28 changes, complexity 35)',
            package: 'inventory',
          },
          {
            severity: 'warning',
            message: 'workflow package has high cyclomatic complexity (52) - simplify control flow',
            package: 'workflow',
          },
          {
            severity: 'info',
            message: 'payroll package shows excellent maintainability (88) - good job!',
            package: 'payroll',
          },
        ];

        setComplexityData(mockComplexity);
        setChurnData(mockChurn);
        setRecommendations(mockRecommendations);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">📊 Advanced Analytics</h1>
        <p className="text-muted-foreground">
          Package complexity, code churn, and refactoring recommendations
        </p>
      </div>

      <Tabs defaultValue="complexity" className="space-y-6">
        <TabsList>
          <TabsTrigger value="complexity">Complexity</TabsTrigger>
          <TabsTrigger value="churn">Code Churn</TabsTrigger>
          <TabsTrigger value="hotspots">Hotspots</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="complexity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Package Complexity Analysis</CardTitle>
              <CardDescription>
                Cyclomatic complexity and maintainability index by package
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ComplexityChart data={complexityData} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {complexityData.map((pkg) => (
              <Card key={pkg.package}>
                <CardHeader>
                  <CardTitle className="text-lg">{pkg.package}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Maintainability:</span>
                    <Badge
                      variant={
                        pkg.maintainabilityIndex >= 80
                          ? 'default'
                          : pkg.maintainabilityIndex >= 60
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {pkg.maintainabilityIndex}/100
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Complexity:</span>
                    <span className="font-mono">{pkg.cyclomaticComplexity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lines of Code:</span>
                    <span className="font-mono">{pkg.linesOfCode.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="churn" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Churned Files</CardTitle>
              <CardDescription>
                Files with the most changes (last 90 days) • Volatility:{' '}
                {churnData?.volatility.toFixed(1)} changes/file
              </CardDescription>
            </CardHeader>
            <CardContent>
              {churnData && <TopChurnedFiles files={churnData.topChurnedFiles} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hotspots" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Churn Hotspots</CardTitle>
              <CardDescription>
                Files with high churn AND high complexity (refactoring candidates)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {churnData && <HotspotScatterPlot data={churnData.hotspots} />}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hotspot Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {churnData?.hotspots.map((hotspot, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Badge
                          variant={
                            hotspot.risk === 'high'
                              ? 'destructive'
                              : hotspot.risk === 'medium'
                                ? 'default'
                                : 'secondary'
                          }
                        >
                          {hotspot.risk.toUpperCase()}
                        </Badge>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-mono text-sm">{hotspot.file}</p>
                          <p className="text-muted-foreground mt-1 text-xs">
                            Churn: {hotspot.churn} changes • Complexity: {hotspot.complexity}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Refactoring Recommendations</CardTitle>
              <CardDescription>
                Actionable recommendations based on complexity and churn analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecommendationList recommendations={recommendations} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
