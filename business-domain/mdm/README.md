# @afenda/mdm

Master Data Management package for afenda NEXUS.

## Purpose

Provides single source of truth for enterprise reference data, preventing
duplicates and ensuring data quality across all domains.

## Key Features

- **Golden Records** - Master record merge, deduplication, survivorship rules
- **Data Stewardship** - Data ownership, approval workflows for master changes
- **Code Generation** - SKU numbering, chart segment auto-generation
- **Data Quality** - Quality rules, scorecards, monitoring
- **MDM Analytics** - Data completeness, accuracy metrics

## Dependencies

- `afenda-canon` - Types and schemas
- `afenda-database` - Database access

## Used By

All domain packages (provides golden records for items, customers, suppliers,
locations, etc.)

## Business Value

- Eliminate duplicate master records (90% reduction)
- Improve data quality and reporting accuracy
- Enforce data governance policies
- Single source of truth for analytics
