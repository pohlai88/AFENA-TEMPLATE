# Subscription Billing

Recurring revenue management for SaaS and subscription businesses.

## Purpose

SaaS subscription management with:
- Subscription lifecycle (trial, active, paused, cancelled, expired states)
- Billing schedules (monthly/annual recurring, usage-based)
- Metering (usage tracking and aggregation)
- Pricing tiers (per-seat, tiered, volume-based pricing)
- Proration (mid-cycle upgrade/downgrade calculations)
- Credits and refunds (account credits and refund management)
- Dunning (failed payment retry workflows)
- Subscription analytics (MRR, ARR, churn, LTV metrics)

## Key Services

- `subscription-lifecycle.ts` - Subscription state management
- `billing-schedules.ts` - Recurring and usage-based billing
- `metering.ts` - Usage tracking and aggregation
- `pricing-tiers.ts` - Per-seat, tiered, volume pricing
- `proration.ts` - Mid-cycle calculations
- `credits-refunds.ts` - Account credits and refunds
- `dunning.ts` - Failed payment retry workflows
- `subscription-analytics.ts` - MRR, ARR, churn, LTV

## Business Value

- SaaS business enablement
- Automated revenue operations
- Accurate MRR/ARR reporting
- Payment processor integration

## Dependencies

- `afenda-database` - Database access
- `afenda-canon` - Standard types and utilities
- `zod` - Schema validation
- `drizzle-orm` - Type-safe SQL queries
