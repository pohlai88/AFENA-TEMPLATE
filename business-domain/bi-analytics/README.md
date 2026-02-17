# @afenda-bi-analytics

Enterprise business intelligence and analytics.

## Purpose

Layer 2 domain package providing interactive dashboards, KPI management,
drill-down analysis, ad-hoc reporting, and BI analytics capabilities.

## Services

### dashboards.ts

- `createDashboard` - Create BI dashboard
- `updateDashboard` - Update dashboard configuration

### kpis.ts

- `defineKPI` - Define key performance indicator
- `trackKPIPerformance` - Track KPI against targets

### drill-down.ts

- `performDrillDown` - Perform dimensional drill-down
- `aggregateMetrics` - Aggregate metrics by dimension

### ad-hoc-reporting.ts

- `generateReport` - Generate ad-hoc report
- `exportReport` - Export report to format

### bi-analytics.ts

- `analyzeUserActivity` - Analyze BI usage
- `recommendInsights` - Recommend analytical insights

## Architecture

Layer 2 (Domain Services), afenda-canon + afenda-database dependencies, pure
domain functions, no logging, Zod validation.
