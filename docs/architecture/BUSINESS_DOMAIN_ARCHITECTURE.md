# afenda NEXUS Business Domain Architecture

**Version:** 2.0\
**Last Updated:** February 17, 2026\
**Status:** Foundation Complete - 44 Domain Packages

---

## Executive Summary

afenda NEXUS implements a comprehensive Enterprise Resource Planning (ERP) system
organized into **44 domain packages** covering all major business functions. The
architecture follows Domain-Driven Design (DDD) principles with clear bounded
contexts and explicit dependencies.

**Total Coverage:**

- 44 domain packages
- 530+ business functions
- 7 business domain areas
- Zero circular dependencies ✅

---

## Business Domain Hierarchy

```
afenda NEXUS Enterprise System
│
├── 📊 FINANCE & ACCOUNTING (7 packages)
│   ├── Core Finance
│   ├── Planning & Control
│   └── Compliance
│
├── 🏭 SUPPLY CHAIN & OPERATIONS (11 packages)
│   ├── Procurement & Purchasing
│   ├── Manufacturing & Production
│   └── Warehouse & Logistics
│
├── 💼 SALES & CUSTOMER (3 packages)
│   ├── Customer Relationship
│   └── Order-to-Cash
│
├── 👥 HUMAN CAPITAL MANAGEMENT (5 packages)
│   ├── Payroll & Benefits
│   └── Talent Management
│
├── 📈 BUSINESS INTELLIGENCE & ANALYTICS (3 packages)
│   ├── Data Platform
│   └── Advanced Analytics
│
├── 🔗 INTEGRATION & CONFIGURATION (2 packages)
│   ├── Enterprise Integration
│   └── Product Configuration
│
└── 🚀 ADVANCED ENTERPRISE DOMAINS (13 packages)
    ├── Foundation & Governance
    ├── Advanced Finance
    ├── Commercial Operations
    └── Operations Excellence
```

---

## Domain Packages by Business Area

### 1️⃣ FINANCE & ACCOUNTING

#### 1.1 Core Accounting (`packages/accounting`)

**Purpose:** General ledger, multi-currency, tax engine\
**Key Services:**

- `tax-engine.ts` - Tax calculation and compliance
- `fx-rates.ts` - Foreign exchange rate management
- `depreciation.ts` - Asset depreciation schedules
- `revenue-recognition.ts` - Revenue recognition rules (ASC 606)
- `payment-terms.ts` - Payment terms and discounting
- `withholding-tax.ts` - Withholding tax calculations

**Business Value:** Foundation for financial reporting and compliance

---

#### 1.2 Budgeting & Planning (`packages/budgeting`)

**Purpose:** Budget creation, allocation, variance analysis\
**Key Services:**

- `budget-planning.ts` - Annual/rolling budget creation
- `budget-allocation.ts` - Departmental allocations
- `budget-tracking.ts` - Actual vs. budget monitoring
- `variance-analysis.ts` - Budget variance reporting
- `what-if-scenarios.ts` - Scenario planning and modeling

**Business Value:** Strategic financial planning and control

---

#### 1.3 Treasury Management (`packages/treasury`)

**Purpose:** Cash management, liquidity, investments\
**Key Services:**

- `cash-positioning.ts` - Real-time cash visibility
- `liquidity-management.ts` - Working capital optimization
- `bank-reconciliation.ts` - Automated bank statement matching
- `investment-tracking.ts` - Investment portfolio management
- `treasury-analytics.ts` - Cash flow forecasting

**Business Value:** Optimize working capital and reduce financing costs

---

#### 1.4 Fixed Assets (`packages/fixed-assets`)

**Purpose:** Asset lifecycle management\
**Key Services:**

- `asset-register.ts` - Asset master data management
- `acquisition.ts` - Asset acquisition and capitalization
- `disposal.ts` - Asset retirement and disposal
- `transfers.ts` - Inter-location/department transfers
- `asset-analytics.ts` - Asset utilization reporting

**Business Value:** Compliance with GAAP/IFRS, tax optimization

---

#### 1.5 Tax Compliance (`packages/tax-compliance`)

**Purpose:** Sales tax, VAT, multi-jurisdiction compliance\
**Key Services:**

- `sales-tax.ts` - US sales tax calculation
- `vat-management.ts` - EU VAT handling
- `nexus-tracking.ts` - Economic nexus monitoring
- `returns-filing.ts` - Tax return preparation
- `tax-analytics.ts` - Tax burden analysis

**Business Value:** Reduce audit risk, automate compliance

---

#### 1.6 Regulatory Reporting (`packages/regulatory-reporting`)

**Purpose:** SOX, audit trails, compliance management\
**Key Services:**

- `sox-compliance.ts` - Sarbanes-Oxley controls
- `audit-trails.ts` - Immutable audit logging
- `compliance-management.ts` - Compliance workflow engine
- `regulatory-filings.ts` - Automated report generation
- `compliance-analytics.ts` - Control effectiveness monitoring

**Business Value:** Ensure regulatory compliance, reduce audit costs

---

#### 1.7 Intercompany Accounting (`packages/intercompany`)

**Purpose:** Multi-entity transactions and eliminations\
**Key Services:**

- `intercompany-matching.ts` - Transaction matching
- `cross-entity-reconciliation.ts` - Elimination entries
- `intercompany-pricing.ts` - Transfer pricing rules
- `consolidation-support.ts` - Consolidation data prep

**Business Value:** Accurate consolidated financial statements

---

### 2️⃣ SUPPLY CHAIN & OPERATIONS

#### 2.1 Inventory Management (`packages/inventory`)

**Purpose:** Stock tracking, lot/serial control, costing\
**Key Services:**

- `stock-engine.ts` - Multi-location inventory tracking
- `lot-tracking.ts` - Lot/batch traceability
- `serial-tracking.ts` - Serial number control
- `manufacturing-bom.ts` - Bill of materials management
- `unit-conversions.ts` - UOM conversion engine
- `inventory-costing.ts` - FIFO/LIFO/Average costing

**Business Value:** Reduce carrying costs, improve accuracy

---

#### 2.2 Procurement (`packages/procurement`)

**Purpose:** Strategic sourcing, supplier management\
**Key Services:**

- `rfq-management.ts` - Request for quotation workflow
- `supplier-selection.ts` - Vendor evaluation and scoring
- `contract-management.ts` - Procurement contract lifecycle
- `spend-analytics.ts` - Spend visibility and analysis
- `supplier-performance.ts` - KPI tracking and scorecards

**Business Value:** Reduce procurement costs, improve supplier quality

---

#### 2.3 Purchasing (`packages/purchasing`)

**Purpose:** Purchase requisitions and orders\
**Key Services:**

- `pr-creation.ts` - Purchase requisition workflow
- `po-generation.ts` - Purchase order creation
- `po-approval.ts` - Multi-level approval routing
- `vendor-management.ts` - Vendor master data
- `purchase-analytics.ts` - Purchasing KPIs

**Business Value:** Streamline procurement process, enforce controls

---

#### 2.4 Receiving (`packages/receiving`)

**Purpose:** Goods receipt, quality inspection\
**Key Services:**

- `goods-receipt.ts` - Receipt processing (2-way/3-way match)
- `quality-inspection.ts` - Incoming quality control
- `discrepancy-handling.ts` - Quantity/quality variance management
- `put-away.ts` - Warehouse put-away optimization
- `receiving-analytics.ts` - Receipt cycle time analysis

**Business Value:** Improve receiving accuracy, reduce cycle time

---

#### 2.5 Accounts Payable (`packages/payables`)

**Purpose:** Invoice processing, payment execution\
**Key Services:**

- `invoice-processing.ts` - AP invoice matching
- `payment-runs.ts` - Batch payment processing
- `vendor-credits.ts` - Credit memo handling
- `cash-discount.ts` - Early payment discount optimization
- `ap-analytics.ts` - Days payable outstanding (DPO) tracking

**Business Value:** Optimize cash flow, capture discounts

---

#### 2.6 Planning (`packages/planning`)

**Purpose:** Demand planning, MRP, MPS\
**Key Services:**

- `demand-planning.ts` - Statistical demand forecasting
- `mrp.ts` - Material Requirements Planning
- `mps.ts` - Master Production Schedule
- `safety-stock.ts` - Buffer stock optimization
- `planning-analytics.ts` - Plan attainment metrics

**Business Value:** Reduce stockouts, improve service levels

---

#### 2.7 Production (`packages/production`)

**Purpose:** Shop floor control, work order management\
**Key Services:**

- `work-orders.ts` - Production order lifecycle
- `routing.ts` - Manufacturing routing definition
- `scheduling.ts` - Finite capacity scheduling
- `shop-floor-control.ts` - Real-time production tracking
- `production-analytics.ts` - OEE and throughput metrics

**Business Value:** Increase manufacturing efficiency

---

#### 2.8 Quality Management (`packages/quality-mgmt`)

**Purpose:** Quality control, inspections, CAPA\
**Key Services:**

- `inspections.ts` - Quality inspection plans
- `ncr-management.ts` - Non-conformance reporting
- `capa.ts` - Corrective/preventive actions
- `certifications.ts` - Quality certification tracking
- `quality-analytics.ts` - First pass yield, defect rates

**Business Value:** Reduce defects, ensure compliance (ISO 9001)

---

#### 2.9 Warehouse Management (`packages/warehouse`)

**Purpose:** Warehouse operations, picking, packing\
**Key Services:**

- `warehouse-operations.ts` - Inbound/outbound operations
- `wave-picking.ts` - Pick wave optimization
- `cycle-counting.ts` - Perpetual inventory accuracy
- `slotting.ts` - Warehouse slotting optimization
- `wms-analytics.ts` - Warehouse productivity metrics

**Business Value:** Improve warehouse efficiency, reduce errors

---

#### 2.10 Shipping (`packages/shipping`)

**Purpose:** Order fulfillment, shipping execution\
**Key Services:**

- `order-picking.ts` - Pick list generation
- `packing.ts` - Packing slip creation
- `carrier-integration.ts` - Shipping label generation
- `freight-calculation.ts` - Freight cost estimation
- `shipping-analytics.ts` - On-time delivery tracking

**Business Value:** Improve fulfillment speed, reduce shipping costs

---

#### 2.11 Transportation Management (`packages/transportation`)

**Purpose:** Fleet management, route optimization\
**Key Services:**

- `load-planning.ts` - Load consolidation and planning
- `route-optimization.ts` - Optimal routing algorithms
- `carrier-selection.ts` - Carrier rate shopping
- `freight-audit.ts` - Freight invoice auditing
- `tms-analytics.ts` - Transportation cost analysis

**Business Value:** Reduce transportation costs, improve delivery

---

### 3️⃣ SALES & CUSTOMER

#### 3.1 Customer Relationship Management (`packages/crm`)

**Purpose:** Customer master, segmentation, pricing\
**Key Services:**

- `pricing-engine.ts` - Dynamic pricing rules
- `discount-tiers.ts` - Volume/loyalty discounts
- `credit-limits.ts` - Credit exposure management
- `customer-tiering.ts` - Customer segmentation (ABC)
- `crm-analytics.ts` - Customer lifetime value

**Business Value:** Maximize customer profitability

---

#### 3.2 Sales Order Management (`packages/sales`)

**Purpose:** Quote-to-order, pricing, availability\
**Key Services:**

- `quote-management.ts` - Sales quotation workflow
- `order-entry.ts` - Sales order creation
- `atp-check.ts` - Available-to-promise checking
- `order-allocation.ts` - Inventory allocation rules
- `sales-analytics.ts` - Order book and pipeline analysis

**Business Value:** Improve quote accuracy, reduce order cycle time

---

#### 3.3 Accounts Receivable (`packages/receivables`)

**Purpose:** Invoicing, collections, credit management\
**Key Services:**

- `invoicing.ts` - Sales invoice generation
- `collections.ts` - AR aging and dunning
- `credit-management.ts` - Credit limit enforcement
- `cash-application.ts` - Payment application
- `ar-analytics.ts` - Days sales outstanding (DSO) tracking

**Business Value:** Accelerate cash collection, reduce bad debt

---

### 4️⃣ HUMAN CAPITAL MANAGEMENT

#### 4.1 Payroll (`packages/payroll`)

**Purpose:** Payroll processing, withholding, reporting\
**Key Services:**

- `payroll-processing.ts` - Gross-to-net calculation
- `tax-withholding.ts` - Federal/state tax withholding
- `garnishments.ts` - Wage garnishment processing
- `year-end-reporting.ts` - W-2, 1099 generation
- `payroll-analytics.ts` - Labor cost analysis

**Business Value:** Ensure payroll accuracy, compliance

---

#### 4.2 Benefits Administration (`packages/benefits`)

**Purpose:** Health insurance, retirement, COBRA\
**Key Services:**

- `enrollment.ts` - Benefits enrollment workflow
- `claims.ts` - Claims processing integration
- `cobra.ts` - COBRA continuation coverage
- `fsa.ts` - Flexible spending account management
- `benefits-analytics.ts` - Benefits utilization analysis

**Business Value:** Streamline benefits administration

---

#### 4.3 Time & Attendance (`packages/time-attendance`)

**Purpose:** Timekeeping, PTO, overtime tracking\
**Key Services:**

- `timesheets.ts` - Time entry and approval
- `pto.ts` - Paid time off accrual and requests
- `overtime.ts` - Overtime calculation and approval
- `shift-management.ts` - Shift scheduling
- `attendance-analytics.ts` - Absenteeism tracking

**Business Value:** Improve time tracking accuracy, compliance

---

#### 4.4 Learning & Development (`packages/learning-dev`)

**Purpose:** Training, certifications, skill tracking\
**Key Services:**

- `training.ts` - Training program management
- `certifications.ts` - Certification tracking and renewal
- `career-paths.ts` - Career development planning
- `skill-assessments.ts` - Competency assessments
- `learning-analytics.ts` - Training effectiveness metrics

**Business Value:** Improve workforce capabilities

---

#### 4.5 Performance Management (`packages/performance-mgmt`)

**Purpose:** Goal setting, reviews, 360 feedback\
**Key Services:**

- `reviews.ts` - Performance review workflow
- `goals.ts` - Goal setting and tracking (OKRs)
- `competencies.ts` - Competency framework management
- `feedback-360.ts` - 360-degree feedback collection
- `performance-analytics.ts` - Performance distribution analysis

**Business Value:** Drive performance culture, talent development

---

### 5️⃣ BUSINESS INTELLIGENCE & ANALYTICS

#### 5.1 Data Warehouse (`packages/data-warehouse`)

**Purpose:** Enterprise data platform, ETL\
**Key Services:**

- `etl.ts` - Extract, transform, load pipelines
- `dimensional-modeling.ts` - Star schema management
- `data-quality.ts` - Data quality monitoring
- `metadata-management.ts` - Data catalog and lineage
- `warehouse-analytics.ts` - Data platform health metrics

**Business Value:** Single source of truth for analytics

---

#### 5.2 Business Intelligence & Analytics (`packages/bi-analytics`)

**Purpose:** Dashboards, KPIs, reporting\
**Key Services:**

- `dashboards.ts` - Interactive dashboard builder
- `kpis.ts` - KPI definition and tracking
- `drill-down.ts` - Multi-dimensional analysis
- `ad-hoc-reporting.ts` - Self-service reporting
- `bi-analytics.ts` - Usage and adoption metrics

**Business Value:** Data-driven decision making

---

#### 5.3 Predictive Analytics (`packages/predictive-analytics`)

**Purpose:** Machine learning, forecasting, optimization\
**Key Services:**

- `ml-models.ts` - Model training and evaluation
- `forecasting.ts` - Time series forecasting
- `optimization.ts` - Constrained optimization (linear programming)
- `scenario-planning.ts` - What-if scenario modeling
- `predictive-insights.ts` - Automated insight generation

**Business Value:** Proactive decision support, forecast accuracy

---

### 6️⃣ INTEGRATION & CONFIGURATION

#### 6.1 Integration Hub (`packages/integration-hub`)

**Purpose:** Enterprise integration, API gateway, EDI\
**Key Services:**

- `edi.ts` - EDI transaction processing (X12, EDIFACT)
- `api-gateway.ts` - External API management
- `message-broker.ts` - Event streaming (Kafka, RabbitMQ)
- `transformation.ts` - Data mapping and transformation
- `integration-monitoring.ts` - Integration health monitoring

**Business Value:** Seamless integration with external systems

---

#### 6.2 Product Configurator (`packages/configurator`)

**Purpose:** Complex product configuration (CPQ)\
**Key Services:**

- `product-configuration.ts` - Product customization engine
- `pricing-rules.ts` - Configuration-based pricing
- `bom-generation.ts` - Dynamic BOM generation
- `validation.ts` - Configuration business rules
- `configurator-analytics.ts` - Configuration insights

**Business Value:** Enable mass customization, reduce quoting time

---

### 7️⃣ ADVANCED ENTERPRISE DOMAINS

#### 7.1 Master Data Management (`packages/mdm`)

**Purpose:** Single source of truth for enterprise reference data\
**Key Services:**

- `golden-records.ts` - Master record merge and deduplication
- `data-stewardship.ts` - Data approval workflows and governance
- `code-generation.ts` - SKU and entity code generation
- `data-quality.ts` - Data quality rules and scoring
- `mdm-analytics.ts` - Data quality metrics and lineage

**Business Value:** Eliminate duplicate data, improve data quality

---

#### 7.2 Document Management (`packages/document-mgmt`)

**Purpose:** Document repository with OCR, transaction linking, audit evidence\
**Key Services:**

- `repository.ts` - Document versioning and retention
- `ocr-ingestion.ts` - OCR extraction pipelines
- `transaction-linking.ts` - Link documents to transactions
- `evidence-packs.ts` - Compliance evidence packages
- `document-analytics.ts` - Storage and retrieval metrics

**Business Value:** Fast document retrieval, compliance evidence

---

#### 7.3 Access Governance (`packages/access-governance`)

**Purpose:** RBAC, segregation of duties, access certification\
**Key Services:**

- `role-management.ts` - Role-based access control
- `access-requests.ts` - Self-service access workflows
- `sod-rules.ts` - Segregation of duties enforcement
- `access-reviews.ts` - Periodic access certification
- `governance-analytics.ts` - Access risk scoring

**Business Value:** Reduce security risk, ensure SOX compliance

---

#### 7.4 Financial Close Management (`packages/financial-close`)

**Purpose:** Month-end and quarter-end close automation\
**Key Services:**

- `close-calendar.ts` - Close period scheduling
- `task-management.ts` - Close task tracking and assignment
- `reconciliations.ts` - Account reconciliation workflows
- `approvals.ts` - Multi-level close sign-off chains
- `close-analytics.ts` - Close cycle time analysis

**Business Value:** Reduce close time, ensure completeness

---

#### 7.5 Rebate Management (`packages/rebate-mgmt`)

**Purpose:** Customer and supplier rebate programs with accrual accounting\
**Key Services:**

- `rebate-programs.ts` - Volume and tiered rebate programs
- `accrual-calculation.ts` - Automated rebate accrual
- `claims-processing.ts` - Claim approval and payment
- `compliance.ts` - Rebate audit trail and compliance
- `rebate-analytics.ts` - Rebate liability tracking

**Business Value:** Accurate accruals, reduce revenue leakage

---

#### 7.6 Lease Accounting (`packages/lease-accounting`)

**Purpose:** Lease lifecycle management and compliance (ASC 842/IFRS 16)\
**Key Services:**

- `lease-contracts.ts` - Contract management and classification
- `amortization.ts` - ROU asset depreciation and liability schedules
- `modifications.ts` - Lease modifications and reassessments
- `journal-entries.ts` - Automated GL entries
- `lease-analytics.ts` - Lease portfolio metrics

**Business Value:** ASC 842/IFRS 16 compliance, audit readiness

---

#### 7.7 Advanced Pricing Management (`packages/pricing`)

**Purpose:** Dynamic pricing, optimization, competitive analysis\
**Key Services:**

- `pricing-rules.ts` - Price lists and tier breaks
- `price-optimization.ts` - AI-driven pricing and elasticity
- `competitor-pricing.ts` - Market and competitor analysis
- `margin-analysis.ts` - Price realization and discount patterns
- `pricing-analytics.ts` - Pricing effectiveness dashboards

**Business Value:** Maximize margins, competitive positioning

---

#### 7.8 Contract Lifecycle Management (`packages/contract-mgmt`)

**Purpose:** Sales contract terms, renewals, obligations, compliance\
**Key Services:**

- `contract-repository.ts` - Contract CRUD and search
- `obligation-tracking.ts` - Deliverables and milestones
- `renewals.ts` - Renewal pipeline and alerts
- `contract-analytics.ts` - Contract value metrics
- `compliance-monitoring.ts` - Penalty clauses and auto-renew alerts

**Business Value:** Reduce contract leakage, improve renewals

---

#### 7.9 Customer Service (`packages/customer-service`)

**Purpose:** Case management, SLA tracking, escalations\
**Key Services:**

- `case-management.ts` - Complaint and inquiry handling
- `sla-tracking.ts` - SLA compliance monitoring
- `escalations.ts` - Escalation workflows
- `knowledge-base.ts` - Solution library management
- `service-analytics.ts` - CSAT and resolution metrics

**Business Value:** Improve customer satisfaction, reduce churn

---

#### 7.10 Enterprise Asset Management (`packages/asset-mgmt`)

**Purpose:** Operational uptime, preventive maintenance, equipment calibration\
**Key Services:**

- `preventive-maintenance.ts` - PM schedules and execution
- `work-requests.ts` - Maintenance requests and work orders
- `spare-parts.ts` - Parts planning linked to inventory
- `calibration.ts` - Equipment calibration schedules
- `eam-analytics.ts` - MTBF and MTTR metrics

**Business Value:** Reduce downtime, extend asset life

---

#### 7.11 Product Lifecycle Management (`packages/plm`)

**Purpose:** Engineering change control, BOM versioning\
**Key Services:**

- `engineering-change.ts` - ECO/ECN workflow
- `bom-versioning.ts` - Versioned BOMs and effectivity
- `impact-analysis.ts` - Cost, inventory, and order impact
- `specifications.ts` - Product formulas and tolerances
- `plm-analytics.ts` - Change velocity and impact metrics

**Business Value:** Controlled product evolution, compliance

---

#### 7.12 Returns Management (`packages/returns`)

**Purpose:** Returns/RMA processing, reverse logistics\
**Key Services:**

- `return-authorization.ts` - RMA creation and approval
- `inspection.ts` - Return inspection and disposition
- `warranty.ts` - Warranty entitlements and claims
- `refurbishment.ts` - Repair and refurb workflow
- `returns-analytics.ts` - Return rates and cost recovery

**Business Value:** Reduce return costs, improve recovery

---

#### 7.13 Trade & Customs Compliance (`packages/trade-compliance`)

**Purpose:** Global trade and customs management\
**Key Services:**

- `customs-declaration.ts` - HS codes, country of origin, customs forms
- `landed-cost.ts` - Duties, brokerage, freight allocation
- `restricted-party.ts` - Denied party screening, sanctions compliance
- `trade-documentation.ts` - Commercial invoice, packing list, certificates
- `trade-analytics.ts` - Duty costs, clearance time, compliance audit

**Business Value:** Customs compliance, accurate landed cost

---

## Cross-Cutting Domain Packages

### Advanced Finance

#### Project Accounting (`packages/project-accounting`)

**Purpose:** Project cost tracking, billing\
**Key Services:**

- `wbs.ts` - Work breakdown structure management
- `cost-tracking.ts` - Project cost capture and allocation
- `billing.ts` - Project billing (T&M, fixed-price, milestone)
- `change-orders.ts` - Change order management
- `project-analytics.ts` - EVM, budget vs. actual

**Business Value:** Improve project profitability

---

#### Forecasting (`packages/forecasting`)

**Purpose:** Statistical forecasting, demand sensing\
**Key Services:**

- `statistical-models.ts` - Time series models (ARIMA, exponential smoothing)
- `seasonal-adjustment.ts` - Seasonality detection and adjustment
- `demand-sensing.ts` - Short-term demand signals
- `consensus-planning.ts` - Collaborative forecasting
- `forecast-accuracy.ts` - Forecast error metrics (MAPE, bias)

**Business Value:** Improve forecast accuracy, reduce inventory

---

#### Sustainability (`packages/sustainability`)

**Purpose:** ESG reporting, carbon tracking\
**Key Services:**

- `carbon-tracking.ts` - Scope 1/2/3 emissions tracking
- `esg-metrics.ts` - Environmental, social, governance metrics
- `sustainability-reporting.ts` - GRI, SASB report generation
- `waste-management.ts` - Waste tracking and reduction
- `sustainability-analytics.ts` - Sustainability KPI dashboards

**Business Value:** ESG compliance, corporate responsibility

---

### Supply Chain Collaboration

#### Supplier Portal (`packages/supplier-portal`)

**Purpose:** Supplier self-service, collaboration\
**Key Services:**

- `self-service.ts` - PO acknowledgment, invoice submission
- `collaboration.ts` - Forecast sharing, capacity planning
- `performance-scorecards.ts` - Supplier KPI visibility
- `communications.ts` - Supplier messaging and alerts
- `portal-analytics.ts` - Portal adoption and usage metrics

**Business Value:** Improve supplier responsiveness, reduce errors

---

## Foundation Packages (Non-Domain)

### Core Infrastructure

#### Canon (`packages/canon`)

**Purpose:** Types, schemas, contracts (ubiquitous language)\
**Exports:** Entity types, Zod schemas, Result type, error codes

#### Database (`packages/database`)

**Purpose:** Schema definitions, ORM configuration\
**Exports:** Drizzle schema, DbInstance, migrations

#### CRUD (`packages/crud`)

**Purpose:** Generic entity operations with policy enforcement\
**Exports:** createEntity, updateEntity, deleteEntity with workflow/policy

#### Workflow (`packages/workflow`)

**Purpose:** Rules engine, state machine, action orchestration\
**Exports:** Rule evaluator, action executor, workflow definitions

#### Advisory (`packages/advisory`)

**Purpose:** Business rules, validation, compliance checks\
**Exports:** Rule definitions, validation functions

#### Migration (`packages/migration`)

**Purpose:** Data migration from legacy systems\
**Exports:** Migration pipelines, data transformation

#### Observability (`packages/observability`)

**Purpose:** Tracing, metrics, logging infrastructure\
**Exports:** OpenTelemetry integration, trace context

#### Logger (`packages/logger`)

**Purpose:** Structured logging\
**Exports:** Logger instance, log levels, formatters

#### Search (`packages/search`)

**Purpose:** Full-text search\
**Exports:** Search indexing, query API

#### UI (`packages/ui`)

**Purpose:** Shared React components\
**Exports:** Form components, layouts, themes

---

## Domain Dependency Patterns

### Pattern 1: Domain → Foundation

All domain packages depend on foundation packages:

```
accounting → canon, database
inventory → canon, database
sales → canon, database, inventory, crm
```

### Pattern 2: Domain Composition

Higher-level domains compose lower-level domains:

```
sales → inventory (ATP check)
sales → crm (pricing, credit)
purchasing → procurement (contracts)
receivables → sales (invoicing)
```

### Pattern 3: Event-Driven Integration

Packages communicate via domain events:

```
production (emit: WorkOrderCompleted)
  → inventory (listen: update stock)
  → accounting (listen: create journal entry)
```

---

## Business Process Coverage

### Order-to-Cash

1. `crm` - Customer pricing and credit
2. `pricing` - Advanced pricing and optimization
3. `contract-mgmt` - Contract terms and renewals
4. `sales` - Order entry and allocation
5. `warehouse` - Picking and packing
6. `shipping` - Shipment execution
7. `receivables` - Invoice and collection
8. `customer-service` - Case management and support
9. `returns` - RMA processing and reverse logistics

### Procure-to-Pay

1. `procurement` - Supplier selection
2. `purchasing` - Purchase order creation
3. `receiving` - Goods receipt
4. `trade-compliance` - Customs clearance and landed cost
5. `payables` - Invoice processing and payment
6. `rebate-mgmt` - Supplier rebate accruals and claims

### Plan-to-Produce

1. `forecasting` - Demand forecast
2. `plm` - Engineering change control and BOM versioning
3. `planning` - MRP/MPS execution
4. `purchasing` - Material procurement
5. `production` - Manufacturing execution
6. `asset-mgmt` - Equipment maintenance and calibration
7. `warehouse` - Finished goods receipt

### Hire-to-Retire

1. `learning-dev` - Onboarding and training
2. `performance-mgmt` - Performance tracking
3. `time-attendance` - Time tracking
4. `payroll` - Payroll processing
5. `benefits` - Benefits administration

### Record-to-Report

1. `accounting` - Transaction recording
2. `lease-accounting` - Lease accounting and compliance
3. `intercompany` - Consolidation
4. `budgeting` - Budget vs. actual
5. `financial-close` - Month-end close automation
6. `document-mgmt` - Audit evidence and documentation
7. `regulatory-reporting` - Compliance reporting
8. `bi-analytics` - Financial dashboards

---

## Technology Stack

### Language & Runtime

- **TypeScript 5+** - Strict type safety
- **Node.js 20+** - Server runtime
- **Zod 4** - Schema validation

### Database & ORM

- **PostgreSQL 16** (Neon Serverless)
- **Drizzle ORM** - Type-safe queries
- **Neon branching** - Database branches per feature

### Frontend

- **Next.js 15** - React framework
- **React 19** - UI library
- **Tailwind CSS** - Styling

### Build & Tooling

- **pnpm** - Package manager
- **Turborepo** - Monorepo build system
- **Vitest** - Unit testing
- **Playwright** - E2E testing

---

## Deployment Architecture

### Package Organization

```
afenda-NEXUS/
├── apps/
│   └── web/                  ← Next.js application
├── packages/
│   ├── Foundation Layer (7)
│   │   ├── canon
│   │   ├── database
│   │   ├── logger
│   │   └── ...
│   ├── Domain Layer (44)     ← THIS DOCUMENT
│   │   ├── accounting
│   │   ├── inventory
│   │   ├── mdm
│   │   ├── pricing
│   │   └── ...
│   └── Application Layer (3)
│       ├── crud
│       ├── workflow
│       └── advisory
└── tools/
    └── afenda-cli             ← CLI tooling
```

### Runtime Deployment

- **Vercel** - Frontend hosting (Next.js)
- **Neon** - PostgreSQL database
- **Edge Functions** - API routes (serverless)

---

## Implementation Status

### ✅ Phase 1: Foundation Complete

- All 44 domain packages created
- 530 business functions defined
- Consistent architecture patterns
- Zero circular dependencies

### 🚧 Phase 2: Implementation (Next)

- Replace stub functions with real queries
- Add comprehensive test coverage
- Implement business logic
- Build API endpoints

### 📋 Phase 3: Integration (Future)

- Wire up packages in web application
- Build UI components
- End-to-end process automation
- Performance optimization

---

## Governance & Standards

### Package Standards

- Each package has 5 service files
- All functions use Zod validation
- Result<T> for error handling
- Pure domain logic (no side effects)
- ESM module format

### Naming Conventions

- Package: `kebab-case` (e.g., `time-attendance`)
- Service: `entity-action.ts` (e.g., `invoice-processing.ts`)
- Function: `verbNoun` (e.g., `createBudget`)

### Documentation Requirements

- Each package has README.md
- Service files have TSDoc comments
- Public API explicitly exported from index.ts

---

## Metrics & KPIs

### Code Quality

- **44** domain packages
- **220** service files
- **530** business functions
- **0** circular dependencies ✅
- **100%** type-safe ✅

### Test Coverage (Target)

- Unit tests: 80%
- Integration tests: 60%
- E2E tests: Critical paths

---

## Next Steps

1. **Implement Domain Logic**
   - Replace stubs with database queries
   - Add business rule validation
   - Implement calculations

2. **Build API Layer**
   - Create tRPC routers per domain
   - Add authentication/authorization
   - Rate limiting and caching

3. **User Interface**
   - Build domain-specific UI components
   - Create workflow screens
   - Dashboards and analytics

4. **Testing**
   - Unit tests for all packages
   - Integration tests for workflows
   - Performance benchmarks

5. **Documentation**
   - API documentation (OpenAPI/Swagger)
   - User guides per domain
   - Architecture decision records (ADRs)

---

## Conclusion

The afenda NEXUS business domain architecture provides a comprehensive, scalable
foundation for enterprise resource planning. With 44 domain packages covering
all major business functions, the system is architected for:

- **Modularity** - Each domain is independently deployable
- **Scalability** - Packages scale independently
- **Maintainability** - Clear boundaries and dependencies
- **Extensibility** - New domains easily added
- **Testability** - Pure functions, dependency injection

**Status:** Foundation complete, ready for implementation phase.

---

**Document Owner:** Engineering Architecture\
**Review Cycle:** Quarterly\
**Last Review:** February 17, 2026
