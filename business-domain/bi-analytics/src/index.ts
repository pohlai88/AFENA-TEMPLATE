/**
 * @afenda-bi-analytics
 */

export { createDashboard, updateDashboard, type Dashboard, type DashboardUpdate } from './services/dashboards.js';
export { defineKPI, trackKPIPerformance, type KPI, type KPIPerformance } from './services/kpis.js';
export { performDrillDown, aggregateMetrics, type DrillDownResult, type MetricAggregation } from './services/drill-down.js';
export { generateReport, exportReport, type AdHocReport, type ReportExport } from './services/ad-hoc-reporting.js';
export { analyzeUserActivity, recommendInsights, type UserActivity, type InsightRecommendation } from './services/bi-analytics.js';
