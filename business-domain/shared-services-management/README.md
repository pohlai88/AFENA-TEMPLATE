# Shared Services Management

Shared service center (SSC) cost allocation and chargeback automation.

## Purpose

Centralized shared services with:
- Service catalog (shared service offerings and SLAs)
- Allocation drivers (FTE count, revenue, transaction volume)
- Chargeback calculation (monthly cost allocation to entities)
- Service level tracking (SLA compliance monitoring)
- Cost center management (shared service center P&L)
- Transfer pricing (arm's length pricing documentation)

## Key Services

- `service-catalog.ts` - Service offerings and SLAs
- `allocation-drivers.ts` - FTE, revenue, transaction-based drivers
- `chargeback-calculation.ts` - Monthly cost allocation
- `service-level-tracking.ts` - SLA compliance monitoring
- `cost-center-management.ts` - SSC P&L management
- `transfer-pricing.ts` - Arm's length pricing documentation
- `ssc-analytics.ts` - Cost per transaction, utilization metrics

## Business Value

- 20-30% cost reduction through centralization
- Transfer pricing compliance
- Transparency and accountability
- Scalable multi-entity support

## Dependencies

- `afenda-database` - Database access
- `afenda-canon` - Standard types and utilities
- `zod` - Schema validation
- `drizzle-orm` - Type-safe SQL queries
