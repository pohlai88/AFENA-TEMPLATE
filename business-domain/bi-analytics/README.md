# @afenda-bi-analytics

<!-- afenda:badges -->
![I - Analytics, Data & Integration](https://img.shields.io/badge/I-Analytics%2C+Data+%26+Integration-00C7E6?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--bi--analytics-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-I%20·%20of%2010-lightgrey?style=flat-square)


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
