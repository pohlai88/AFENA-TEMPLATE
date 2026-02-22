# Business Domain Architecture

**AFENDA-NEXUS — Enterprise-Grade Multi-Tenant, Multi-Company, Multi-National ERP**

> **Location:** `business-domain/`
> **Layer:** 2 (Domain Services) in the 4-Layer Architecture
> **Depends on:** `afenda-canon` (Layer 1), `afenda-database` (Layer 1), `afenda-logger` (Layer 1)
> **Consumed by:** `afenda-crud` (Layer 3), `apps/web` (Application)
> **Version:** 2.3 — Ratified (Feb 20, 2026)

---

## Table of Contents

1. [Strategic Intent](#1-strategic-intent)
2. [Industry Benchmark Reference](#2-industry-benchmark-reference)
3. [Multi-Dimensional Architecture Model](#3-multi-dimensional-architecture-model)
4. [Multi-Tenancy Design](#4-multi-tenancy-design)
5. [Multi-Company & Intercompany](#5-multi-company--intercompany)
6. [Multi-National & International](#6-multi-national--international)
7. [Multi-Industry Extensibility](#7-multi-industry-extensibility)
8. [Domain Package Taxonomy](#8-domain-package-taxonomy)
   - 8.10 [Investor Relations & Corporate Governance](#810-investor-relations--corporate-governance-5-packages)
   - 8.11 [R&D / Product Development](#811-rd--product-development-5-packages)
   - 8.12 [Retail + POS + Omnichannel](#812-retail--pos--omnichannel-7-packages)
   - 8.13 [F&B + Recipe + Franchise](#813-fb--recipe--franchise-7-packages)
   - 8.14 [Agriculture](#814-agriculture-livestock--feed-mill--greenhouse--vertical-farming-16-packages)
   - 8A. [Domain Families & Naming Rules](#8a-domain-families--naming-rules)
9. [Domain Package Standard](#9-domain-package-standard)
   - 9.8 [Test Strategy & CI Wiring](#98-test-strategy--ci-wiring)
10. [Cross-Domain Coordination Rules](#10-cross-domain-coordination-rules)
11. [Financial Integrity Model](#11-financial-integrity-model)
12. [Data Sovereignty & Compliance](#12-data-sovereignty--compliance)
13. [Governance Invariants](#13-governance-invariants)
14. [Dependency Rules](#14-dependency-rules)
15. [OSS ERP Benchmark Scorecard](#15-oss-erp-benchmark-scorecard)
16. [Platform Infrastructure (non-domain)](#16-platform-infrastructure-non-domain)

---

## 1. Strategic Intent

The `business-domain/` layer is the **pure business logic heart** of AFENDA-NEXUS. Each package implements one coherent business subdomain. No package in this layer touches HTTP, renders UI, or orchestrates cross-domain flows — those concerns belong to Layer 3 (`afenda-crud`).

### Design Goals

| Goal                              | Mechanism                                                                                                 |
| --------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Zero cross-domain coupling**    | Domains never import each other; `afenda-crud` orchestrates                                               |
| **Deterministic, testable logic** | Pure functions wherever possible; DB reads allowed; truth-table writes forbidden — domains return intents |
| **Multi-tenant by default**       | Every function receives `orgId`; no global state                                                          |
| **Multi-company aware**           | `companyId` is a first-class parameter alongside `orgId`                                                  |
| **Intercompany correct**          | IC transactions, eliminations, and matching are dedicated packages                                        |
| **Multi-national ready**          | Currency, FX, tax, address, and locale are parameterized, not hardcoded                                   |
| **Multi-industry extensible**     | Industry overlays extend base packages without forking them                                               |
| **Audit-grade correctness**       | Every financial calculation is deterministic, reproducible, and traceable                                 |

---

## 2. Industry Benchmark Reference

### 2.1 OSS ERP Peer Analysis

| System                     | Strengths                                                           | AFENDA Advantage                                                  |
| -------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **SAP S/4HANA**            | Gold standard for enterprise finance, multi-company, multi-currency | Matches core financial model; adds serverless-native architecture |
| **Oracle NetSuite**        | Best-in-class multi-subsidiary, intercompany, multi-currency        | Matches subsidiary model; adds RLS-enforced tenant isolation      |
| **Microsoft Dynamics 365** | Deep multi-entity, multi-currency, global compliance                | Matches financial dimensions; adds immutable audit trail          |
| **ERPNext / Frappe**       | Most popular OSS ERP, full module coverage                          | Matches all modules; adds type-safe monorepo + outbox pattern     |
| **Tryton**                 | Most architecturally sophisticated OSS ERP; mixin-based schema      | `docEntityColumns` mirrors Tryton mixins; adds Postgres RLS       |
| **LedgerSMB**              | PostgreSQL-native, closest peer                                     | Matches + exceeds (adds idempotent `doc_postings`, outbox)        |
| **FrontAccounting**        | 20-year production ERP, near-complete coverage                      | Full feature parity + modern TypeScript + serverless              |

### 2.2 Key Architectural Decisions Derived from Benchmarks

- **Posting contract** (SAP/Oracle): 5-state lifecycle `unposted → posting → posted → reversing → reversed` with DB-enforced immutability after posting
- **Subsidiary/company model** (NetSuite): `org_id` (tenant) + `company_id` (legal entity) as separate dimensions
- **Document numbering** (Tryton): Per-table `UNIQUE(org_id, doc_no) WHERE doc_no IS NOT NULL` with fiscal-year-aware sequences
- **Intercompany eliminations** (Dynamics 365): Dedicated `intercompany` package with matching, netting, and elimination workflows
- **Line contract** (FrontAccounting): `grand_total_minor = subtotal_minor - discount_minor + tax_minor` CHECK enforced at DB level
- **Money representation** (LedgerSMB): Integer minor units (`BIGINT`) for all monetary values; no floating-point arithmetic in business logic

---

## 3. Multi-Dimensional Architecture Model

AFENDA-NEXUS operates across **five orthogonal dimensions** simultaneously. Every domain package must handle all five.

```
┌─────────────────────────────────────────────────────────────────────┐
│  Dimension 1: TENANT (org_id)                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Org Alpha   │  │  Org Beta    │  │  Org Gamma   │  ...         │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                     │
│  Dimension 2: COMPANY (company_id) — within a tenant               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ HQ Corp  │  │ Sub A    │  │ Sub B    │  │ Sub C    │  ...       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘           │
│                                                                     │
│  Dimension 3: CURRENCY (currency_code)                              │
│  MYR  USD  SGD  EUR  GBP  JPY  CNY  AUD  CAD  ...                  │
│                                                                     │
│  Dimension 4: LOCALE (country_code + language)                      │
│  MY  US  SG  GB  DE  JP  CN  AU  ...                                │
│                                                                     │
│  Dimension 5: INDUSTRY (industry_overlay)                           │
│  Manufacturing  Retail  Services  Healthcare  Construction  ...     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.1 Domain Function Signature Contract

Every domain service function MUST follow this contract:

```typescript
// All branded types come from afenda-canon
import type { RoleKey, CurrencyCode, OrgId, CompanyId, UserId, IsoDateTime } from 'afenda-canon';

interface DomainContext {
  orgId: OrgId; // Branded string — tenant isolation (RLS boundary)
  companyId: CompanyId; // Branded string — legal entity (financial boundary)
  currency: CurrencyCode; // ISO 4217 e.g. 'MYR' | 'USD' | 'SGD' — never plain string
  locale?: string; // BCP 47 locale (e.g., 'en-MY', 'zh-CN')
  fiscalYear?: number; // Fiscal year context (for period-sensitive ops)
  actor: {
    userId: UserId; // Branded string — never plain string
    roles: RoleKey[]; // Compile-time safe — from afenda-canon ROLE_REGISTRY
  };
  asOf: IsoDateTime; // Branded ISO 8601 date-time, injected by kernel — replaces new Date()
  activeOverlays: ReadonlySet<IndustryOverlayKey>; // Computed by resolveActiveOverlays() in Layer 3
}

// Every service function returns one of these shapes — no ad-hoc returns
export type DomainResult<TRead = unknown> =
  | { kind: 'read'; data: TRead }
  | { kind: 'intent'; intents: DomainIntent[] }
  | { kind: 'intent+read'; data: TRead; intents: DomainIntent[] };

// Example: a service that reads current stock AND emits an adjustment intent
export async function adjustStock(
  db: DbSession,
  ctx: DomainContext,
  input: StockAdjustInput,
): Promise<DomainResult<StockBalance>>;

// Example: a pure read (no mutation)
export async function calculateLineTax(
  db: DbSession,
  ctx: DomainContext,
  input: TaxInput,
): Promise<DomainResult<TaxResult>>;
```

> **Why `actor` and `asOf`?** `actor` enables domain-level authorization checks (e.g., "only finance role can approve") without coupling to the HTTP layer. `asOf` makes all time-sensitive calculations deterministic and testable — no domain function ever calls `new Date()` directly (enforced by INV-C03).

---

## 4. Multi-Tenancy Design

### 4.1 Tenancy Model

**Model:** Shared schema + Row-Level Security (RLS)

Every domain table carries `org_id` as the primary tenant discriminator. The database enforces isolation at the Postgres RLS layer — no application-level filtering can bypass it.

```
Tenant (org_id)
  └── Organization
        ├── Members (users with roles)
        ├── Companies (legal entities)
        ├── Sites (physical locations)
        └── All domain data (invoices, contacts, products, ...)
```

### 4.2 RLS Enforcement

```sql
-- Every domain table MUST have:
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON invoices
  USING (org_id = auth.org_id())        -- blocks cross-tenant reads
  WITH CHECK (org_id = auth.org_id());  -- blocks cross-tenant writes
```

> **`WITH CHECK` is mandatory.** `USING` alone only blocks reads. Without `WITH CHECK`, a compromised application layer could insert rows with a foreign `org_id`. Both clauses are required on every truth table.

**Invariant MT-01:** Every domain table MUST have `org_id TEXT NOT NULL` + RLS ENABLED + FORCE + `tenantPolicy`. No exceptions.

**Invariant MT-02:** Domain functions NEVER filter by `orgId` in application code — they rely on RLS. The `orgId` parameter is used only for writes and explicit cross-tenant operations (admin only).

**Invariant MT-03:** `auth.org_id()` returns NULL if no JWT claim → zero rows returned + writes fail. This is the security backstop.

### 4.3 Tenant Onboarding

When a new organization is created, `seed_org_defaults(p_org_id)` provisions:

- Default currencies (functional + reporting)
- Default units of measure
- Default chart of accounts structure
- Default fiscal periods (12 monthly periods for current year)
- Default roles and permissions (owner, admin, member, viewer)
- Default number sequences (invoices, POs, SOs, etc.)
- Default tax rates (jurisdiction-specific)

### 4.4 Tenant Data Isolation Guarantees

| Guarantee        | Mechanism                                                  |
| ---------------- | ---------------------------------------------------------- |
| Read isolation   | RLS `USING` clause — zero rows cross-tenant                |
| Write isolation  | RLS `WITH CHECK` clause — writes rejected cross-tenant     |
| Schema isolation | Shared schema; no per-tenant schemas                       |
| Backup isolation | Neon branching per tenant (optional, enterprise tier)      |
| Audit isolation  | `audit_logs.org_id` indexed; cross-tenant audit impossible |

---

## 5. Multi-Company & Intercompany

### 5.1 Company Model

Within a single tenant, multiple legal entities (companies) can coexist:

```
Tenant (org_id: "acme-group")
  ├── Company: ACME Holdings Sdn Bhd  (company_id: "acme-hq",  currency: MYR)
  ├── Company: ACME Singapore Pte Ltd (company_id: "acme-sg",  currency: SGD)
  ├── Company: ACME US Inc            (company_id: "acme-us",  currency: USD)
  └── Company: ACME Manufacturing    (company_id: "acme-mfg", currency: MYR)
```

**Key rules:**

- Every financial document belongs to exactly one company
- `company_id` is required on all financial tables
- Warehouse-company match is DB-enforced via `check_warehouse_company_match()` trigger
- Chart of accounts is per-company (each company has its own COA)
- Fiscal periods are per-company (different year-ends allowed)

### 5.2 Intercompany Transactions

The `business-domain/intercompany` package handles all cross-company flows:

```
ACME Holdings → sells to → ACME Singapore
  ├── IC Sales Invoice (ACME Holdings books)
  ├── IC Purchase Invoice (ACME Singapore books)
  ├── IC Receivable (ACME Holdings)
  ├── IC Payable (ACME Singapore)
  └── Elimination entry (consolidation removes both)
```

**IC Transaction Types:**

| Type          | Description                           |
| ------------- | ------------------------------------- |
| `invoice`     | IC sales/purchase invoice pair        |
| `payment`     | IC payment settlement                 |
| `transfer`    | Cash/asset transfer between companies |
| `allocation`  | Cost/revenue allocation               |
| `elimination` | Consolidation elimination entry       |

**Invariant IC-01:** Every IC transaction MUST have a matching counterpart in the other company. `intercompany_transactions` enforces `CHECK (from_company_id <> to_company_id)`.

**Invariant IC-02:** IC eliminations are generated by the `consolidation` package only, never manually. They reference `reverses_ic_transaction_id` for full traceability.

**Invariant IC-03:** IC matching status follows `pending → matched → eliminated → cancelled`. Regression is forbidden (DB trigger enforced).

### 5.3 Consolidation

The `business-domain/consolidation` package implements multi-level consolidation:

```
Level 0: Statutory entities (individual companies)
Level 1: Sub-group consolidation (e.g., ACME Asia)
Level 2: Group consolidation (e.g., ACME Group)
```

Consolidation steps:

1. **Aggregate** — Sum all entity financials in reporting currency
2. **Translate** — Apply FX translation (closing rate for BS, average rate for P&L)
3. **Eliminate** — Remove IC transactions, IC balances, IC dividends
4. **Adjust** — Minority interest, goodwill, acquisition adjustments
5. **Report** — Consolidated financial statements

---

## 6. Multi-National & International

### 6.1 Currency Architecture

**Principle:** All monetary values are stored as **integer minor units** (e.g., cents, sen). No floating-point arithmetic in business logic.

```typescript
// ✅ CORRECT — integer minor units
const totalMinor: number = 10000; // MYR 100.00

// ❌ WRONG — floating point
const total: number = 100.0; // Precision loss risk
```

**Currency layers:**

| Layer                     | Purpose                    | Example                 |
| ------------------------- | -------------------------- | ----------------------- |
| **Transaction currency**  | Currency of the document   | USD invoice             |
| **Functional currency**   | Company's primary currency | MYR (ACME Holdings)     |
| **Reporting currency**    | Group reporting currency   | USD (ACME Group)        |
| **Presentation currency** | User display preference    | EUR (European investor) |

**FX Rate Types:**

| Type      | Usage                                       |
| --------- | ------------------------------------------- |
| `spot`    | Transaction-date rate                       |
| `average` | Monthly/annual average (P&L translation)    |
| `closing` | Period-end rate (Balance Sheet translation) |
| `budget`  | Budgeted rate (variance analysis)           |
| `hedge`   | Hedged rate (hedge accounting)              |

**Invariant FX-01:** FX rates are stored in `fx_rates` with `(org_id, from_currency, to_currency, rate_date, source)` uniqueness. Rates are never hardcoded in business logic.

**Invariant FX-02:** `lookupFxRate(db, ctx, { from, to, date })` returns the latest rate ≤ document date. If no rate exists, throws `FX_RATE_NOT_FOUND` — never silently returns 1.0.

**Invariant FX-03:** All monetary CHECKs are enforced at DB level: `grand_total_minor = subtotal_minor - discount_minor + tax_minor`.

### 6.2 Tax Architecture

Tax is jurisdiction-specific and time-bounded. The `business-domain/tax-engine` package handles:

| Tax Type      | Jurisdictions                                       |
| ------------- | --------------------------------------------------- |
| `gst`         | Malaysia, Australia, Canada, New Zealand, Singapore |
| `vat`         | EU, UK, UAE, Saudi Arabia, South Africa             |
| `sales_tax`   | USA (state-level)                                   |
| `service_tax` | Malaysia, India                                     |
| `withholding` | Cross-border payments (most jurisdictions)          |
| `exempt`      | Zero-rated / exempt supplies                        |

**Tax rate versioning:** Rates are time-bounded with `effective_from` / `effective_to`. Historical documents always use the rate effective on the document date.

**Invariant TAX-01:** Tax calculation is always `calculateLineTax(baseMinor, rate, roundingMethod)` — a pure function. Never inline `amount * rate`.

**Invariant TAX-02:** Rounding method is per-tax-code: `half_up | half_down | ceil | floor | banker`. Default is `half_up`.

**Invariant TAX-03:** Tax codes are never hardcoded in business logic. They are resolved from `tax_rates` by `(org_id, tax_code, effective_date)`.

### 6.3 Address & Locale

```typescript
interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  countryCode: string; // ISO 3166-1 alpha-2
}
```

Address validation is locale-aware: Malaysia 5-digit postcode, USA ZIP format, UK postcode regex, Singapore 6-digit postal code, etc.

Locale-sensitive formatting covers: date formats (`DD/MM/YYYY` vs `MM/DD/YYYY`), number separators, currency symbol position, and minor unit display.

### 6.4 Fiscal Year Variants

| Configuration     | Example                                 |
| ----------------- | --------------------------------------- |
| Calendar year     | Jan 1 – Dec 31                          |
| Malaysian fiscal  | Jan 1 – Dec 31 (most) or Apr 1 – Mar 31 |
| UK fiscal         | Apr 6 – Apr 5                           |
| Australian fiscal | Jul 1 – Jun 30                          |
| Custom            | Any 12-month period                     |

**Invariant FY-01:** `resolveFiscalYear(companyId, date)` is the only way to determine fiscal year. Never compute `date.getFullYear()` directly for financial period assignment.

**Invariant FY-02:** Fiscal period close is enforced by `reject_closed_period_posting()` DB trigger. Application-level checks alone are insufficient.

---

## 7. Multi-Industry Extensibility

### 7.1 Industry Overlay Pattern

Base domain packages implement the universal ERP core. Industry overlays extend them without forking:

```
business-domain/
├── inventory/               ← Base: stock management (all industries)
├── inventory-manufacturing/ ← Overlay: BOM explosion, WIP tracking
└── inventory-retail/        ← Overlay: POS integration, shrinkage
```

**Overlay rules:**

- Overlays import from the base package they extend
- Overlays NEVER modify base package behavior
- Overlays are activated via feature flags or tenant configuration
- Base packages remain industry-agnostic

### 7.2 Industry Coverage

| Industry               | Core Packages                            | Overlay Packages                                                 |
| ---------------------- | ---------------------------------------- | ---------------------------------------------------------------- |
| **Manufacturing**      | inventory, production, quality-mgmt, plm | inventory-manufacturing, production-discrete, production-process |
| **Retail**             | crm, sales, inventory, pos               | inventory-retail, crm-loyalty, sales-ecommerce                   |
| **Services**           | crm, projects, billing, time-attendance  | billing-subscription, projects-professional-services             |
| **Healthcare**         | crm, billing, compliance                 | billing-healthcare, compliance-hipaa                             |
| **Construction**       | projects, procurement, fixed-assets      | projects-construction, billing-progress                          |
| **Distribution**       | inventory, warehouse, logistics          | inventory-3pl, logistics-route-optimization                      |
| **Financial Services** | accounting, treasury, compliance         | compliance-aml, treasury-derivatives                             |

---

## 8. Domain Package Taxonomy

### 8.1 Financial Management (37 packages)

> Validated 2026-02-21. All 37 packages pass `tsc --noEmit` with zero errors. Type-check sweep completed — all canon payload fields supplied, `exactOptionalPropertyTypes` enforced, branded types at adapter boundaries, `db.read()` wrapper used consistently. See `business-domain/finance/README.md` for the full package map and `business-domain/AGENT.md` for the rule set.

#### Core Ledger & GL (4 packages)

| Package          | Key Functions                                                       | Standard |
| ---------------- | ------------------------------------------------------------------- | -------- |
| `accounting`     | `postJournalEntry`, `reverseEntry`, `trialBalance`                  | —        |
| `gl-platform`    | `openPeriod`, `closePeriod`, `publishCoA`, `periodBalanceQuery`     | —        |
| `accounting-hub` | `deriveJournalLines`, `computeReclassLines`, `allocateProportional` | —        |
| `intercompany`   | `createIcTransaction`, `matchIcTransactions`, `eliminateIC`         | —        |

#### Sub-Ledgers (6 packages)

| Package                | Key Functions                                               | Standard |
| ---------------------- | ----------------------------------------------------------- | -------- |
| `payables`             | `agingReport`, `paymentRun`, `supplierStatement`            | —        |
| `receivables`          | `getOutstandingReceivables`, `allocatePayment`              | —        |
| `revenue-recognition`  | `recognizeRevenue`, `deferRevenue`, `performanceObligation` | IFRS 15  |
| `subscription-billing` | `generateInvoice`, `prorateBilling`, `renewalForecast`      | —        |
| `expense-management`   | `submitExpense`, `approveExpense`, `reimburse`              | —        |
| `project-accounting`   | `projectCost`, `projectRevenue`, `wipValuation`             | —        |

#### Asset & Liability (3 packages)

| Package             | Key Functions                                            | Standard |
| ------------------- | -------------------------------------------------------- | -------- |
| `fixed-assets`      | `calculateDepreciation`, `disposeAsset`, `revalueAsset`  | IAS 16   |
| `lease-accounting`  | `calculateLiability`, `rightOfUseAsset`, `leaseSchedule` | IFRS 16  |
| `intangible-assets` | `capitalise`, `amortise`, `impair`                       | IAS 38   |

#### Treasury & FX (4 packages)

| Package               | Key Functions                                        | Standard |
| --------------------- | ---------------------------------------------------- | -------- |
| `treasury`            | `cashPosition`, `cashForecast`, `bankReconcile`      | —        |
| `fx-management`       | `lookupFxRate`, `revalueFxBalance`, `hedgeDesignate` | IAS 21   |
| `bank-reconciliation` | `matchStatementLine`, `reconcileAccount`             | —        |
| `credit-management`   | `checkCreditLimit`, `creditExposure`, `creditReview` | —        |

#### Tax & Transfer Pricing (3 packages)

| Package            | Key Functions                                               | Standard |
| ------------------ | ----------------------------------------------------------- | -------- |
| `tax-engine`       | `calculateLineTax`, `resolveTaxRate`, `taxReturnData`       | —        |
| `withholding-tax`  | `computeWht`, `issueCertificate`, `remitWht`                | —        |
| `transfer-pricing` | `computeArmLengthPrice`, `publishPolicy`, `tpDocumentation` | OECD TP  |

#### Consolidation & Close (3 packages)

| Package               | Key Functions                                          | Standard |
| --------------------- | ------------------------------------------------------ | -------- |
| `consolidation`       | `consolidateGroup`, `eliminateIC`, `translateCurrency` | IFRS 10  |
| `financial-close`     | `closeChecklist`, `accrualRun`, `allocationRun`        | —        |
| `statutory-reporting` | `renderStatement`, `buildStatementArtifact`            | IAS 1    |

#### Planning & Costing (2 packages)

| Package           | Key Functions                                      | Standard |
| ----------------- | -------------------------------------------------- | -------- |
| `budgeting`       | `createBudget`, `budgetVariance`, `reforecast`     | —        |
| `cost-accounting` | `allocateCost`, `varianceAnalysis`, `standardCost` | —        |

#### IFRS Packages (12 packages)

| Package                 | Key Functions                                                | Standard  |
| ----------------------- | ------------------------------------------------------------ | --------- |
| `provisions`            | `recognise`, `utilise`, `reverse`, `discountProvision`       | IAS 37    |
| `financial-instruments` | `classifyInstrument`, `computeEir`, `computeFvChange`        | IFRS 9    |
| `hedge-accounting`      | `designateHedge`, `testEffectiveness`, `reclassOci`          | IFRS 9 §6 |
| `deferred-tax`          | `calculateTemporaryDifferences`, `computeDeferredTax`        | IAS 12    |
| `impairment-of-assets`  | `testImpairment`, `recogniseImpairment`, `reverseImpairment` | IAS 36    |
| `inventory-valuation`   | `computeNrv`, `costingMethod`, `nrvAdjust`                   | IAS 2     |
| `government-grants`     | `computeGrantAmortisation`, `recogniseGrant`                 | IAS 20    |
| `biological-assets`     | `measureFairValue`, `harvestTransfer`                        | IAS 41    |
| `investment-property`   | `measureProperty`, `transferProperty`                        | IAS 40    |
| `employee-benefits`     | `computeDefinedBenefitCost`, `remeasureObligation`           | IAS 19    |
| `borrowing-costs`       | `capitalise`, `cease`                                        | IAS 23    |
| `share-based-payment`   | `grantAward`, `vestAward`, `expenseSbp`                      | IFRS 2    |

### 8.2 Procurement & Supply Chain (14 packages)

| Package               | Key Functions                                          |
| --------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `procurement`         | `createRequisition`, `sendRfq`, `evaluateQuote`        |
| `purchasing`          | `createPurchaseOrder`, `approvePo`, `closePo`          |
| `receiving`           | `receiveGoods`, `qualityInspect`, `returnToSupplier`   |
| `inventory`           | `stockBalance`, `stockMovement`, `reorderCheck`        |
| `lot-tracking`        | `assignLot`, `traceLot`, `expiryManagement`            |
| `warehouse`           | `pickOrder`, `packShipment`, `putaway`                 |
| `landed-costs`        | `allocateLandedCost`, `landedCostVariance`             |
| `supplier-management` | `supplierScore`, `supplierOnboard`, `supplierPortal`   |
| `contract-management` | `createContract`, `contractCompliance`, `renewalAlert` |
| `demand-planning`     | `forecastDemand`, `safetyStock`, `reorderPoint`        |
| `mrp`                 | `runMrp`, `plannedOrder`, `capacityCheck`              |
| `logistics`           | `shipOrder`, `trackShipment`, `freightCost`            |
| `returns-management`  | `createRma`, `processReturn`, `creditNote`             |
| `quality-control`     | `inspectionPlan`, `recordNcr`, `dispositionDecision`   | **Scope:** incoming/warehouse/vendor QC + NCR on receipts and returns. Does NOT cover in-process manufacturing defects. |

### 8.3 Order-to-Cash (10 packages)

| Package           | Key Functions                                              |
| ----------------- | ---------------------------------------------------------- |
| `crm`             | `priceLineItem`, `checkCreditLimit`, `customerScore`       |
| `sales`           | `createQuote`, `convertToOrder`, `orderFulfillment`        |
| `pricing`         | `resolvePrice`, `applyDiscount`, `promotionEngine`         |
| `shipping`        | `createDelivery`, `shipConfirm`, `deliveryProof`           |
| `ecommerce`       | `syncCatalog`, `processWebOrder`, `abandonedCart`          |
| `pos-core`        | `openSession`, `processTransaction`, `closeSession`        |
| `loyalty`         | `earnPoints`, `redeemPoints`, `tierUpgrade`                |
| `collections`     | `agingAlert`, `collectionAction`, `writeOff`               |
| `customer-portal` | `portalInvoice`, `portalPayment`, `portalStatement`        |
| `sales-analytics` | `salesPerformance`, `pipelineAnalysis`, `forecastAccuracy` |

### 8.4 Manufacturing (12 packages)

| Package                 | Key Functions                                            |
| ----------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `production`            | `createWorkOrder`, `issueComponents`, `reportProduction` |
| `bom`                   | `createBom`, `bomExplosion`, `whereUsed`                 |
| `routing`               | `createRouting`, `scheduleOperation`, `capacityLoad`     |
| `quality-mgmt`          | `createInspectionPlan`, `recordResult`, `spcAnalysis`    | **Scope:** in-process SPC, lab results, CAPA, shop-floor defects. Does NOT cover incoming/vendor QC (that is `quality-control`). |
| `plm`                   | `createProduct`, `engineeringChange`, `productRelease`   |
| `shop-floor`            | `startOperation`, `reportScrap`, `machineDowntime`       |
| `maintenance`           | `preventiveMaintenance`, `workOrder`, `failureAnalysis`  |
| `subcontracting`        | `sendToSubcontractor`, `receiveFromSubcontractor`        |
| `process-manufacturing` | `createBatch`, `processOrder`, `yieldVariance`           |
| `variant-management`    | `configureVariant`, `variantPricing`, `bomVariant`       |
| `production-planning`   | `masterSchedule`, `capacityPlan`, `loadLeveling`         |
| `traceability`          | `traceForward`, `traceBackward`, `recallManagement`      |

### 8.5 Human Resources (10 packages)

| Package           | Key Functions                                              |
| ----------------- | ---------------------------------------------------------- |
| `hr-core`         | `onboardEmployee`, `transferEmployee`, `terminateEmployee` |
| `payroll`         | `calculatePayroll`, `processPayslip`, `payrollJournal`     |
| `time-attendance` | `clockIn`, `approveTimesheet`, `leaveBalance`              |
| `recruitment`     | `createJobPosting`, `screenApplicant`, `makeOffer`         |
| `performance`     | `createAppraisal`, `setKpi`, `performanceScore`            |
| `learning`        | `enrollCourse`, `trackCompletion`, `certificationExpiry`   |
| `compensation`    | `salaryReview`, `benefitsEnrollment`, `equityGrant`        |
| `compliance-hr`   | `epfContribution`, `socsoContribution`, `eisContribution`  |
| `org-chart`       | `createPosition`, `reportingLine`, `orgHierarchy`          |
| `employee-portal` | `leaveApplication`, `payslipDownload`, `profileUpdate`     |

### 8.6 Projects & Professional Services (8 packages)

| Package               | Key Functions                                          |
| --------------------- | ------------------------------------------------------ |
| `projects`            | `createProject`, `projectPlan`, `milestoneTracking`    |
| `project-billing`     | `billableHours`, `progressBilling`, `retentionRelease` |
| `resource-management` | `allocateResource`, `utilizationReport`, `skillMatrix` |
| `timesheets`          | `submitTimesheet`, `approveTime`, `billableAnalysis`   |
| `project-procurement` | `projectPo`, `budgetCheck`, `commitmentTracking`       |
| `project-costing`     | `earnedValue`, `costVariance`, `completionForecast`    |
| `contracts-ps`        | `createEngagement`, `sowManagement`, `changeOrder`     |
| `field-service`       | `dispatchTechnician`, `serviceReport`, `partsUsed`     |

### 8.7 Compliance & Governance (8 packages)

| Package               | Key Functions                                              |
| --------------------- | ---------------------------------------------------------- |
| `compliance`          | `complianceCheck`, `regulatoryReport`, `auditTrail`        |
| `data-privacy`        | `dataSubjectRequest`, `consentManagement`, `dataRetention` |
| `sox-compliance`      | `controlTest`, `deficiencyReport`, `managementAssessment`  |
| `aml`                 | `sanctionsCheck`, `transactionMonitoring`, `sarReport`     |
| `risk-management`     | `riskAssessment`, `controlMatrix`, `riskRegister`          |
| `internal-audit`      | `auditPlan`, `auditFinding`, `remediationTracking`         |
| `document-management` | `documentVersion`, `approvalWorkflow`, `retentionPolicy`   |
| `policy-management`   | `createPolicy`, `policyReview`, `acknowledgement`          |

### 8.8 Analytics & Intelligence (8 packages)

| Package                   | Key Functions                                          |
| ------------------------- | ------------------------------------------------------ |
| `advisory`                | `detectAnomaly`, `forecastMetric`, `scoreRisk`         |
| `reporting`               | `balanceSheet`, `incomeStatement`, `cashFlowStatement` |
| `dashboards`              | `kpiSnapshot`, `trendAnalysis`, `drillDown`            |
| `data-export`             | `exportToExcel`, `exportToCsv`, `apiExport`            |
| `benchmarking`            | `benchmarkKpi`, `peerComparison`, `industryRank`       |
| `forecasting`             | `revenueForecast`, `expenseForecast`, `cashForecast`   |
| `consolidation-reporting` | `consolidatedBs`, `consolidatedPl`, `segmentReport`    |
| `esg-reporting`           | `carbonFootprint`, `socialMetrics`, `governanceScore`  |

### 8.9 Cross-Cutting Services (11 packages)

> Renamed from "platform" to **`cross-cutting/`** to avoid confusion with `packages/platform-*` infrastructure. These packages implement **business rules** that span multiple domains. They live at `business-domain/cross-cutting/`.

| Package                  | Key Functions                                                | Notes                                                                              |
| ------------------------ | ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `search`                 | `indexEntity`, `fullTextSearch`, `facetedSearch`             | Business indexing rules                                                            |
| `custom-fields`          | `defineField`, `validateValue`, `syncFields`                 | Field schema governance                                                            |
| `entity-views`           | `createView`, `applyView`, `shareView`                       | View policy                                                                        |
| `number-sequences`       | `allocateDocNumber`, `resetSequence`, `sequenceAudit`        | Sequence rules                                                                     |
| `entitlements`           | `checkPlanLimit`, `resolveFeatureGate`, `overagePolicy`      | Plans, limits, feature gates — replaces `metering`                                 |
| `integration-mapping`    | `mapCanonicalToExternal`, `transformField`, `mappingVersion` | Business field mapping rules                                                       |
| `integration-connectors` | `connectorConfig`, `credentialRef`, `syncPolicy`             | Connector configuration (business, not infra)                                      |
| `data-quality`           | `qualityScore`, `qualityRule`, `qualityReport`               | Quality policy                                                                     |
| `permissions`            | `resolvePermission`, `roleAssignment`, `permissionAudit`     | Authorization **evaluation** and policy vocabulary only — not compliance workflows |
| `audit-query`            | `auditReport`, `auditClassification`, `retentionPolicy`      | Audit policy + read-only queries only                                              |
| `versioning`             | `snapshotEntity`, `diffVersions`, `revertVersion`            | Entity version policy                                                              |

> **`audit-query` note:** This package defines audit **policy** (retention rules, severity classification, what must be audited) and provides **read-only** audit queries. It NEVER calls `writeAuditLog()` — that is the exclusive responsibility of the `afenda-crud` kernel (K-03).

> **`entitlements` note:** Raw usage ingestion/aggregation lives in `packages/platform-metering`. `entitlements` only makes **business decisions** (is this org over their plan limit?) and returns intents.

> **`integration-mapping` / `integration-connectors` note:** Webhook delivery, retries, signatures, and idempotency live in `packages/platform-webhooks`. These two packages handle only business mapping rules and connector configuration.

> **`permissions` vs `governance/*` boundary:** `cross-cutting/permissions` handles authorization **evaluation** — "can this actor perform this action on this entity?" It owns the policy vocabulary (`RoleKey`, `PermissionRule`) and the `resolvePermission()` function. `governance/*` packages handle compliance **workflows** — evidence collection, attestations, SOX controls, audit reporting, CAPA. If it involves proving something to an auditor, it belongs in `governance/`. If it involves deciding whether a user can do something at runtime, it belongs in `permissions`.

> **Cross-cutting package gate rules (enforced by SK-07):**
>
> - ✅ **MAY define:** policy vocabularies, shared evaluation engines (permissions, quality scoring, mapping rules), read-only queries
> - ❌ **MAY NOT own** truth tables that represent a domain's ledger of record
> - ❌ **MAY NOT implement** workflows that produce audit evidence (belongs to `governance/*`)
> - ❌ **MAY NOT become a backdoor orchestrator** — no calling other domains' `services/*`
> - ❌ **MAY NOT import** `services/*` from any domain package (same rule as overlays, enforced by SK-07)

### 8.10 Investor Relations & Corporate Governance (5 packages)

> IPO-ready disclosure-grade data lineage. Connects directly to the truth engine.

| Package                 | Key Functions                                               |
| ----------------------- | ----------------------------------------------------------- |
| `investor-relations`    | `earningsDeck`, `guidanceKpi`, `investorQaLog`              |
| `equity-management`     | `capTable`, `vestingSchedule`, `esopGrant`, `valuationHook` |
| `board-governance`      | `boardMeeting`, `resolution`, `minuteBook`                  |
| `corporate-secretariat` | `entityFiling`, `directorRegister`, `shareCertificate`      |
| `disclosure-controls`   | `controlSignOff`, `disclosureEvidence`, `soxCertification`  |

### 8.11 R&D / Product Development (5 packages)

> Beyond PLM — proper R&D accounting + governance (IAS 38 / ASC 730).

| Package               | Key Functions                                          |
| --------------------- | ------------------------------------------------------ |
| `rnd-portfolio`       | `stageGateReview`, `portfolioScore`, `ideaToProject`   |
| `rnd-project-costing` | `capitalizeVsExpense`, `ias38Mapping`, `asc730Mapping` |
| `innovation-grants`   | `grantTerms`, `milestoneClaim`, `claimPack`            |
| `lab-management`      | `sampleTracking`, `testResult`, `certificationExpiry`  |
| `engineering-ops`     | `changeRequest`, `deviation`, `ncrCapaTieIn`           |

### 8.12 Retail + POS + Omnichannel (7 packages)

> Full retail stack — not just a `pos` stub.

| Package                     | Key Functions                                                         |
| --------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------- |
| `retail-pos`                | `openSession`, `processTender`, `cashManagement`, `fiscalPrinterHook` | **Extends:** `pos-core` (imports calculators + types only) |
| `store-operations`          | `storeCalendar`, `cashDrop`, `storeKpi`                               |
| `merchandising`             | `assortmentPlan`, `planogram`, `seasonality`                          |
| `promotions-retail`         | `mixAndMatch`, `couponEngine`, `bundleRule`, `loyaltyRule`            |
| `returns-retail`            | `rtvProcess`, `fraudCheck`, `serialValidation`                        |
| `omnichannel-order`         | `bopis`, `shipFromStore`, `splitShipment`                             |
| `shrinkage-loss-prevention` | `cycleCountVariance`, `incidentManagement`                            |

### 8.13 F&B + Recipe + Franchise (7 packages)

> Restaurant-grade: recipe BOM, menu engineering, franchise royalties.

| Package                  | Key Functions                                             |
| ------------------------ | --------------------------------------------------------- |
| `recipe-management`      | `ingredientBom`, `yieldFactor`, `prepLoss`, `allergenTag` |
| `menu-engineering`       | `menuPricing`, `contributionMargin`, `popularityAnalysis` |
| `kitchen-production`     | `prepPlan`, `batchCooking`, `wasteLog`                    |
| `food-costing`           | `theoreticalVsActual`, `portionControl`, `costVariance`   |
| `franchise-management`   | `franchiseeOnboard`, `royaltyFee`, `brandComplianceAudit` |
| `store-supply`           | `centralKitchenReplenishment`, `transferOrder`            |
| `food-safety-compliance` | `haccpLog`, `temperatureLog`, `recallWorkflow`            |

### 8.14 Agriculture: Livestock + Feed Mill + Greenhouse + Vertical Farming (16 packages)

> Full agri industry overlay set — livestock, feed, plantation, indoor farming.

**Animal / Livestock (4 packages)**

| Package                  | Key Functions                                                 |
| ------------------------ | ------------------------------------------------------------- |
| `livestock-management`   | `herdLifecycle`, `weightRecord`, `healthEvent`                |
| `breeding-management`    | `lineageRecord`, `matingPlan`, `fertilityScore`               |
| `veterinary-health`      | `treatmentRecord`, `vaccinationSchedule`, `withdrawalPeriod`  |
| `biosecurity-compliance` | `movementControl`, `biosecurityAudit`, `quarantineManagement` |

**Feed Mill (4 packages)**

| Package             | Key Functions                                                 |
| ------------------- | ------------------------------------------------------------- |
| `feed-formulation`  | `nutritionalTarget`, `leastCostFormulation`, `formulaVersion` |
| `feed-production`   | `batchOrder`, `qcSampling`, `yieldLoss`, `rework`             |
| `feed-inventory`    | `siloBinBalance`, `lotExpiry`, `feedMovement`                 |
| `feed-traceability` | `ingredientToBatch`, `batchToAnimalGroup`, `traceReport`      |

**Plantation / Greenhouse (4 packages)**

| Package                 | Key Functions                                          |
| ----------------------- | ------------------------------------------------------ |
| `crop-management`       | `cropCycle`, `fieldBlockActivity`, `yieldEstimate`     |
| `greenhouse-operations` | `climateZone`, `irrigationSchedule`, `fertigationPlan` |
| `nursery-propagation`   | `seedLot`, `germinationRate`, `transplantBatch`        |
| `harvest-grading`       | `gradeClassification`, `packhouse`, `yieldReport`      |

**Indoor / Vertical Farming (3 packages)**

| Package                     | Key Functions                                                 |
| --------------------------- | ------------------------------------------------------------- |
| `controlled-environment-ag` | `rackZoneRecipe`, `lightNutrientSchedule`, `environmentAlert` |
| `growth-forecasting`        | `harvestPrediction`, `demandMatching`, `yieldForecast`        |
| `agri-inputs`               | `fertilizerPlan`, `pesticideCompliance`, `complianceInterval` |

> **`iot-sensor-integration` removed from `business-domain/`.** Telemetry ingestion is infrastructure. It lives in `packages/platform-iot`. `controlled-environment-ag` consumes platform-iot **read models** to compute business decisions (alerts, recipes, plans) and returns `DomainIntent[]`.

---

**Total: 80 core domain packages + 39 industry-overlay packages + 11 cross-cutting = 130 packages**

> **Platform infrastructure** (`workflow`, `notifications`, `webhooks`, `file-storage`, `email`, `sms`, `rate-limiting`, `migration`, `metering`, `iot`) lives in `packages/platform-*` (Layer 1/2 boundary — see §16).

---

## 8A. Domain Families & Naming Rules

### 8A.1 Domain Families

All `business-domain/` packages belong to one of these families. The family determines the subdirectory:

```
business-domain/
├── finance/          accounting, tax-engine, fx-management, consolidation, treasury,
│                     fixed-assets, revenue-recognition, cost-accounting, budgeting,
│                     intercompany, payables, receivables, bank-reconciliation,
│                     credit-management, expense-management, subscription-billing,
│                     project-accounting, lease-accounting
├── supply-chain/     procurement, purchasing, receiving, inventory, lot-tracking,
│                     warehouse, landed-costs, supplier-management, contract-management,
│                     demand-planning, mrp, logistics, returns-management, quality-control
├── order-to-cash/    crm, sales, pricing, shipping, ecommerce, pos-core, loyalty,
│                     collections, customer-portal, sales-analytics
├── manufacturing/    production, bom, routing, quality-mgmt, plm, shop-floor,
│                     maintenance, subcontracting, process-manufacturing,
│                     variant-management, production-planning, traceability
├── people/           hr-core, payroll, time-attendance, recruitment, performance,
│                     learning, compensation, compliance-hr, org-chart, employee-portal
├── projects/         projects, project-billing, resource-management, timesheets,
│                     project-procurement, project-costing, contracts-ps, field-service
├── governance/       compliance, data-privacy, sox-compliance, aml, risk-management,
│                     internal-audit, document-management, policy-management,
│                     investor-relations, equity-management, board-governance,
│                     corporate-secretariat, disclosure-controls
├── rnd/              rnd-portfolio, rnd-project-costing, innovation-grants,
│                     lab-management, engineering-ops
├── analytics/        advisory, reporting, dashboards, data-export, benchmarking,
│                     forecasting, consolidation-reporting, esg-reporting
├── cross-cutting/    search, custom-fields, entity-views, number-sequences,
│                     entitlements, integration-mapping, integration-connectors,
│                     data-quality, permissions, audit-query, versioning
└── industry-overlays/
    ├── retail/       retail-pos, store-operations, merchandising, promotions-retail,
    │                 returns-retail, omnichannel-order, shrinkage-loss-prevention
    ├── fnb/          recipe-management, menu-engineering, kitchen-production,
    │                 food-costing, franchise-management, store-supply,
    │                 food-safety-compliance
    └── agriculture/
        ├── livestock/ livestock-management, breeding-management, veterinary-health,
        │              biosecurity-compliance
        ├── feed-mill/ feed-formulation, feed-production, feed-inventory, feed-traceability
        └── crop/      crop-management, greenhouse-operations, nursery-propagation,
                       harvest-grading, controlled-environment-ag, growth-forecasting,
                       agri-inputs
                       # iot-sensor-integration → packages/platform-iot (see §16)
```

### 8A.2 Naming Rules

| Pattern                 | Example                                                              | Location                             | Rule                                                      |
| ----------------------- | -------------------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------- |
| Base domain             | `inventory`, `sales`, `accounting`                                   | `business-domain/{family}/`          | Single noun, no suffix                                    |
| Industry overlay        | `inventory-retail`, `production-process`, `feed-formulation`         | `business-domain/industry-overlays/` | `{base}-{industry}` or `{subject}-{function}`             |
| Cross-cutting service   | `entitlements`, `audit-query`, `integration-mapping`                 | `business-domain/cross-cutting/`     | Descriptive compound, never just `audit` or `integration` |
| Enterprise/governance   | `sox-compliance`, `disclosure-controls`, `aml`                       | `business-domain/governance/`        | Descriptive compound                                      |
| Platform infrastructure | `platform-metering`, `platform-iot`, `platform-webhooks`             | `packages/platform-*/`               | Always `platform-{function}`                              |
| Package name            | `afenda-inventory`, `afenda-feed-formulation`, `afenda-entitlements` | npm registry                         | Always `afenda-{kebab-name}`                              |

### 8A.3 `afenda-canon` File Structure for Domain Contracts

The domain contract types are split across three focused files to prevent `shared-kernel.ts` from becoming a monolith:

```
afenda-canon/src/
├── types/
│   ├── domain-intent.ts          ← DomainIntent union + all payload types
│   ├── domain-event.ts           ← DomainEvent union + all event payload types
│   ├── domain-result.ts          ← DomainResult<T> union (read | intent | intent+read)
│   ├── domain-error.ts           ← DomainErrorCode enum + DomainError class
│   ├── domain-context.ts         ← DomainContext interface
│   ├── branded.ts                ← OrgId, CompanyId, CurrencyCode, RoleKey, UserId, IsoDateTime
│   └── industry-overlay.ts       ← IndustryOverlayKey
└── registries/
    ├── shared-kernel-registry.ts ← SHARED_KERNEL_REGISTRY (tables only)
    └── domain-intent-registry.ts ← Optional metadata per intent type
```

**`afenda-canon/src/types/domain-error.ts`** — standardized error contract:

```typescript
export type DomainErrorCode =
  | 'FX_RATE_NOT_FOUND'
  | 'ALREADY_POSTING'
  | 'PERIOD_CLOSED'
  | 'VALIDATION_FAILED'
  | 'NOT_AUTHORIZED'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'IDEMPOTENCY_CONFLICT'
  | 'OVERLAY_NOT_ACTIVE'
  | 'SHARED_KERNEL_VIOLATION';

export class DomainError extends Error {
  readonly name = 'DomainError';
  constructor(
    public readonly code: DomainErrorCode,
    message: string,
    public readonly meta?: Record<string, unknown>, // JSON-safe, no PII
  ) {
    super(message);
  }
}
```

**`afenda-canon/src/types/domain-intent.ts`** — union types only, no registry logic:

```typescript
export type DomainIntent =
  | { type: 'inventory.adjust'; payload: StockAdjustPayload }
  | { type: 'inventory.receive'; payload: GoodsReceiptPayload }
  | { type: 'inventory.issue'; payload: StockIssuePayload }
  | { type: 'accounting.post'; payload: JournalPostPayload }
  | { type: 'crm.update-credit'; payload: CreditUpdatePayload }
  | { type: 'livestock.record-weight'; payload: WeightEventPayload }
  | { type: 'feed.consume-batch'; payload: FeedConsumptionPayload };

export type DomainEvent =
  | { type: 'invoice.posted'; payload: InvoicePostedEvent }
  | { type: 'stock.adjusted'; payload: StockAdjustedEvent }
  | { type: 'payment.settled'; payload: PaymentSettledEvent }
  | { type: 'animal.weighed'; payload: AnimalWeighedEvent };
```

**`afenda-canon/src/registries/shared-kernel-registry.ts`** — table ownership only:

```typescript
export type TableKind = 'truth' | 'control' | 'evidence' | 'projection';
export type PiiLevel = 'none' | 'low' | 'high';
export type IdempotencyPolicy = 'required' | 'optional' | 'forbidden';

export type WriteSurface = 'intent-only' | 'direct'; // 'direct' reserved for Layer 3 only

export const SHARED_KERNEL_REGISTRY = {
  'inventory.stock_ledger': {
    kind: 'truth' as TableKind,
    owner: 'inventory' as const,
    rls: 'tenantPolicy',
    pii: 'none' as PiiLevel,
    write_policy: 'intent-only' as WriteSurface, // Layer 2 emits intents; Layer 3 executes
    invariants: ['quantity_on_hand >= 0', 'lot_id references lot_tracking'],
    readers: ['cost-accounting', 'mrp', 'demand-planning', 'feed-inventory'],
    writes: ['inventory.adjust', 'inventory.receive', 'inventory.issue'],
    events: ['stock.adjusted'],
    readModels: {
      primary: 'StockLedgerReadModel',
      exportsFrom: 'afenda-database' as const,
    },
    immutability: { after: undefined, fields: ['lot_id', 'item_id', 'org_id'] },
    keys: {
      natural: [['org_id', 'item_id', 'lot_id', 'warehouse_id']],
      unique: [['org_id', 'ledger_entry_id']],
    },
  },
  'accounting.journal_lines': {
    kind: 'truth' as TableKind,
    owner: 'accounting' as const,
    rls: 'tenantPolicy',
    pii: 'none' as PiiLevel,
    write_policy: 'intent-only' as WriteSurface,
    invariants: ['debit_total = credit_total per journal_id', 'status in posting lifecycle'],
    readers: ['consolidation', 'reporting', 'fixed-assets', 'project-accounting'],
    writes: ['accounting.post'],
    events: ['invoice.posted'],
    readModels: {
      primary: 'JournalLineReadModel',
      exportsFrom: 'afenda-database' as const,
    },
    immutability: { after: 'posted', fields: ['amount_minor', 'account_id', 'currency'] },
    keys: {
      natural: [['org_id', 'journal_id', 'line_number']],
      unique: [['org_id', 'journal_line_id']],
    },
  },
  'livestock.animals': {
    kind: 'truth' as TableKind,
    owner: 'livestock-management' as const,
    rls: 'tenantPolicy',
    pii: 'none' as PiiLevel,
    write_policy: 'intent-only' as WriteSurface,
    invariants: ['status in (active, sold, deceased, transferred)'],
    readers: ['breeding-management', 'veterinary-health', 'biosecurity-compliance'],
    writes: ['livestock.record-weight', 'livestock.update-status'],
    events: ['animal.weighed'],
    readModels: {
      primary: 'AnimalReadModel',
      exportsFrom: 'afenda-database' as const,
    },
    immutability: { after: 'deceased', fields: ['animal_id', 'breed', 'birth_date'] },
    keys: {
      natural: [['org_id', 'tag_number']],
      unique: [['org_id', 'animal_id']],
    },
  },
} as const;
```

**`afenda-canon/src/registries/domain-intent-registry.ts`** — optional per-intent metadata:

```typescript
import type { DomainIntent } from '../types/domain-intent';

type IntentType = DomainIntent['type'];

export const DOMAIN_INTENT_REGISTRY: Record<
  IntentType,
  {
    owner: string;
    tableTarget: string; // key in SHARED_KERNEL_REGISTRY
    idempotency: {
      policy: IdempotencyPolicy;
      scope: 'org' | 'company' | 'document';
      recipe: string; // symbolic key derivation — CI validates payload has required fields
    };
    severity: 'low' | 'medium' | 'high';
  }
> = {
  'inventory.adjust': {
    owner: 'inventory',
    tableTarget: 'inventory.stock_ledger',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, item_id, lot_id, adjustment_ref)',
    },
    severity: 'medium',
  },
  'inventory.receive': {
    owner: 'inventory',
    tableTarget: 'inventory.stock_ledger',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, po_id, receipt_line_id)',
    },
    severity: 'medium',
  },
  'inventory.issue': {
    owner: 'inventory',
    tableTarget: 'inventory.stock_ledger',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, source_doc_id, line_id)',
    },
    severity: 'medium',
  },
  'accounting.post': {
    owner: 'accounting',
    tableTarget: 'accounting.journal_lines',
    idempotency: { policy: 'required', scope: 'document', recipe: 'hash(org_id, journal_id)' },
    severity: 'high',
  },
  'crm.update-credit': {
    owner: 'crm',
    tableTarget: 'crm.customers',
    idempotency: {
      policy: 'optional',
      scope: 'company',
      recipe: 'hash(org_id, customer_id, review_date)',
    },
    severity: 'medium',
  },
  'livestock.record-weight': {
    owner: 'livestock-management',
    tableTarget: 'livestock.animals',
    idempotency: {
      policy: 'optional',
      scope: 'document',
      recipe: 'hash(org_id, animal_id, weigh_date)',
    },
    severity: 'low',
  },
  'feed.consume-batch': {
    owner: 'feed-production',
    tableTarget: 'inventory.stock_ledger',
    idempotency: {
      policy: 'required',
      scope: 'document',
      recipe: 'hash(org_id, batch_id, consumption_ref)',
    },
    severity: 'medium',
  },
};
```

### 8A.4 CI Gate: Shared Kernel Enforcement

Three CI rules enforce the registry at build time:

**Gate SK-01 — Unregistered truth tables fail the build**

```bash
# tools/ci-invariants.mjs — SK-01
# Any Drizzle pgTable() with kind='truth' not present in SHARED_KERNEL_REGISTRY → exit 1
pnpm ci:shared-kernel-check
```

**Gate SK-02 — Unknown intent types fail the build**

```bash
# Any DomainIntent type not present in DOMAIN_INTENT_REGISTRY → exit 1
pnpm ci:intent-check
```

**Gate SK-03 — Domain taxonomy count matches folder enumeration**

```bash
# domain-taxonomy.ts package count must equal actual business-domain/ folder count → exit 1
pnpm ci:taxonomy-check
```

**Gate SK-04 — writes/intents cross-reference must be consistent**

```bash
# For every SHARED_KERNEL_REGISTRY entry:
# writes[] must exactly equal { DOMAIN_INTENT_REGISTRY[*].tableTarget === thisTable } → exit 1
pnpm ci:writes-crossref-check
```

This prevents drift where a new intent writes a table but the registry `writes[]` array is not updated (or vice versa).

**Gate SK-05 — Only `src/index.ts` may export from a domain package**

```bash
# Any file in business-domain/**/src/** (except index.ts) that contains 'export ' → exit 1
pnpm ci:export-boundary-check
```

**Gate SK-06 — No `new Date()` in domain packages**

```bash
# Static scan: any 'new Date(' in business-domain/**  (excluding __tests__/) → exit 1
pnpm ci:no-new-date-check
```

**Gate SK-07 — No cross-domain service imports**

```bash
# Any import matching 'business-domain/*/src/services/**' from any other domain/overlay/cross-cutting → exit 1
pnpm ci:cross-domain-service-check
```

This enforces INV-IND-02 and INV-L02 at the import level. Overlays may import `calculators/*` and `types/*` but never `services/*`.

**Gate SK-08 — Read permissions must match registry**

```bash
# Any db.select() in business-domain/X/src/queries/** targeting a table not owned by X
# AND not listing X in SHARED_KERNEL_REGISTRY[table].readers → exit 1
pnpm ci:reader-registry-check
```

**What the CI scanner does:**

1. Reads all `pgTable()` definitions from `packages/database/src/schema/**`
2. Classifies each table by `kind` via naming convention or explicit `$kind` tag
3. Cross-references every `truth` table against `SHARED_KERNEL_REGISTRY` keys (SK-01)
4. Cross-references every `DomainIntent` variant against `DOMAIN_INTENT_REGISTRY` keys (SK-02)
5. Counts `business-domain/` leaf package folders **recursively** (handles nested `industry-overlays/retail/`, `industry-overlays/fnb/`, etc.) and compares to declared total in `domain-taxonomy.ts` (SK-03)
6. Verifies `SHARED_KERNEL_REGISTRY[t].writes` equals the set of intents targeting table `t` in `DOMAIN_INTENT_REGISTRY` (SK-04)
7. Scans all non-`index.ts` files in `src/` for `export ` keyword (SK-05)
8. Scans `business-domain/**` (excluding `__tests__/`) for `new Date(` (SK-06)
9. Scans all imports in `business-domain/**` for cross-domain service path patterns (SK-07)
10. Resolves all `db.select()` table targets and checks `readers` registry (SK-08)
11. Fails with a clear error listing unregistered tables, orphaned intents, count mismatches, writes drift, export leaks, Date() calls, illegal service imports, or unregistered readers

---

## 8B. Truth Engine

The Truth Engine is the conceptual core of AFENDA-NEXUS. It defines three table categories with distinct mutation rules, and establishes that **only Layer 3 may mutate any of them**.

### 8B.1 Table Categories

| Category       | Definition                                                              | Who Mutates                         | Examples                                                            |
| -------------- | ----------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------- |
| **Truth**      | Ledger of record — the authoritative state of a business entity         | Layer 3 only (via `mutate()`)       | `stock_ledger`, `journal_lines`, `animals`                          |
| **Control**    | Configuration that governs how truth behaves — versioned, audited       | Layer 3 only (via `mutate()`)       | `fiscal_periods`, `tax_rates`, `exchange_rates`, `bom_versions`     |
| **Evidence**   | Auditor proof — attestations, sign-offs, compliance records             | Layer 3 + Governance workflows only | `audit_logs`, `entity_versions`, `sox_attestations`, `capa_records` |
| **Projection** | Derived/cached read models — rebuilt from truth, never source of record | Layer 3 or background jobs          | `inventory_summary`, `aging_buckets`, `consolidated_balances`       |

### 8B.2 Mutation Rules

```
Truth tables:
  ✅ Layer 3 (afenda-crud) via mutate() + DomainIntent
  ❌ Layer 2 domain packages (intent-only output)
  ❌ Direct SQL from application code

Control tables:
  ✅ Layer 3 (afenda-crud) via mutate() + admin intents
  ❌ Layer 2 domain packages
  ❌ Background jobs (control changes must be audited)

Evidence tables:
  ✅ Layer 3 kernel (K-03: audit_logs + entity_versions on every mutate())
  ✅ Governance workflows (attestations, CAPA, SOX sign-offs)
  ❌ Domain packages directly
  ❌ Application code bypassing the kernel

Projection tables:
  ✅ Layer 3 or background rebuild jobs
  ❌ Treated as truth (never used as source of record for financial calculations)
```

### 8B.3 Why This Matters

- **Truth can only be wrong if Layer 3 is wrong** — eliminates the "which code path wrote this?" debugging problem
- **Evidence is tamper-evident** — `audit_logs` written by kernel K-03 cannot be bypassed by domain packages
- **Control changes are audited** — fiscal period close, tax rate changes, exchange rate updates all go through `mutate()` and produce `entity_versions`
- **Projections are disposable** — any projection can be rebuilt from truth; they are never the source of financial correctness

### 8B.4 Domain Package Relationship to Truth Engine

```
Domain packages (Layer 2):
  ✅ READ truth tables (via queries/ — registered in SHARED_KERNEL_REGISTRY.readers)
  ✅ READ control tables (e.g., tax rates, exchange rates for calculations)
  ✅ READ evidence tables (audit-query package — read-only queries only)
  ✅ EMIT DomainIntent[] targeting truth tables (via commands/ or services/)
  ❌ WRITE to any table category directly
```

---

## 9. Domain Package Standard

Every domain package in `business-domain/` MUST conform to this standard.

### 9.1 Directory Structure

> **Source-first pattern.** Domain packages point directly to TypeScript source. No build step. No dist output. Consumers resolve `./src/index.ts` via workspace symlinks. See the `ts-tsup-config` skill for the full decision table.

```
business-domain/{family}/my-domain/
├── src/
│   ├── index.ts              # Public API — ONLY file that exports
│   ├── calculators/          # Pure deterministic math — no DB, no side effects
│   │   └── tax-calc.ts       # Returns: primitive values or plain objects only
│   ├── queries/              # Read-only DB access — Drizzle SELECT only
│   │   └── stock-query.ts    # Returns: canonical read-model types (NOT $inferSelect)
│   ├── commands/             # Pure intent builders — no DB, no side effects
│   │   └── adjust-intent.ts  # Returns: DomainIntent[] only
│   ├── services/             # Orchestrate: queries + calculators + commands → DomainResult
│   │   └── stock-service.ts  # Returns: Promise<DomainResult<T>> ONLY — never DomainIntent[] directly
│   └── __tests__/
│       ├── tax-calc.test.ts
│       └── stock-service.test.ts
├── package.json
├── tsconfig.json             # Source-first: NO composite, NO outDir, NO declaration
├── eslint.config.cjs         # CJS format ("type": "module" in package.json — RULE-02)
├── vitest.config.ts
└── README.md
```

> **❌ NEVER add** to a source-first domain package: `tsup.config.ts`, `tsconfig.build.json`, `"build": "tsup"` script, `"main": "./dist/..."`, `composite: true`, or `outDir`.

### 9.2 package.json Template

```json
{
  "name": "afenda-my-domain",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "scripts": {
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src --ext .ts --cache",
    "lint:fix": "eslint src --ext .ts --cache --fix",
    "lint:ci": "eslint src --ext .ts --rule 'import/no-cycle: error'"
  },
  "dependencies": {
    "afenda-canon": "workspace:*",
    "afenda-database": "workspace:*",
    "afenda-logger": "workspace:*"
  },
  "devDependencies": {
    "afenda-eslint-config": "workspace:*",
    "afenda-typescript-config": "workspace:*",
    "drizzle-orm": "catalog:",
    "typescript": "catalog:",
    "vitest": "catalog:"
  }
}
```

> **Key differences from Library packages (`packages/*`):** No `"build"` script, no `tsup` devDep, `main`/`types`/`exports` point to `./src/index.ts` (not `./dist/`). See the `ts-tsup-config` skill §1 for the full rationale.

### 9.3 tsconfig.json (Source-First Domain)

```jsonc
{
  "extends": "afenda-typescript-config/react-library.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./dist/.tsbuildinfo",
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "build", "**/*.test.*", "**/*.spec.*"],
}
```

> **❌ NEVER set** on source-first packages: `composite: true`, `noEmit: false`, `outDir`, `declaration`, `declarationMap`.
>
> **❌ NEVER add** source-first packages to root `tsconfig.json` → `references`. Only Library packages (`packages/*`) appear there.

### 9.4 eslint.config.cjs (Domain Package)

Domain packages use `"type": "module"` in `package.json`, so the ESLint config MUST be `.cjs` (RULE-02 from the `eslint-config` skill). The `ignores` block MUST be the first element (RULE-03). Uses `projectService: true` (RULE-07).

```javascript
const baseConfig = require('afenda-eslint-config/base');

module.exports = [
  { ignores: ['dist/**', '*.config.*'] },
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Domain layer: no DB writes (INV-DOM-04 / INV-L04)
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'CallExpression[callee.property.name=/^(insert|update|delete|execute|transaction)$/]',
          message: 'Domain layer may not write to DB. Return DomainIntent[] to afenda-crud.',
        },
        {
          selector: "NewExpression[callee.name='Date']",
          message:
            'Do not use new Date() in business-domain. Use ctx.asOf or pass time explicitly (INV-C03).',
        },
        {
          selector: "ThrowStatement > NewExpression[callee.name='Error']",
          message: 'Throw DomainError (from afenda-canon) only (INV-DOM-03).',
        },
      ],
    },
  },
];
```

### 9.5 vitest.config.ts (Domain Package)

Source-first domain packages need `resolve.alias` to redirect `afenda-canon` and `afenda-database` to their source entry points (their `exports` fields point to `dist/`, which Vite cannot resolve without the alias).

```typescript
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      'afenda-canon': resolve(__dirname, '../../../packages/canon/src/index.ts'),
      'afenda-database': resolve(__dirname, '../../../packages/database/src/index.ts'),
    },
  },
  test: {
    name: 'afenda-my-domain',
    globals: true,
    pool: 'threads',
    include: ['src/**/__tests__/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    testTimeout: 5000,
    passWithNoTests: true,
  },
});
```

> **Why `resolve.alias`?** `afenda-canon` and `afenda-database` have `exports` fields pointing to `dist/`. Vite (used by Vitest) resolves via `exports` first, so without the alias it fails with `Failed to resolve entry for package`. The alias redirects to source, bypassing the missing dist. See the `ts-tsup-config` skill §1 for details.

### 9.6 Public API Rules

- `src/index.ts` is the **only** file that exports from the package
- Only export what consumers need — keep internal helpers unexported
- Never re-export from `afenda-canon`, `afenda-database`, or `afenda-logger` — consumers import those directly
- Export types alongside functions: `export type { TaxResult }` alongside `export { calculateLineTax }`
- **`queries/` modules MUST only export functions returning read-model types** (e.g., `StockBalance`, `JournalLineReadModel`). Drizzle schema types (`typeof stockLedger.$inferSelect`) MUST NOT be exported from a domain package — they are internal implementation details. Consumers receive canonical read models, not raw schema shapes.

### 9.7 Testing Requirements

- Every service function MUST have at least one unit test
- Pure calculator functions MUST have property-based or table-driven tests
- DB-touching functions MUST have integration tests (skipped when `DATABASE_URL` is absent)
- Test files MUST be in `src/__tests__/` — never co-located with source files
- Minimum coverage targets: **lines 80%, functions 90%, branches 75%**

### 9.8 Test Strategy & CI Wiring

Domain packages use **three layers of automated verification**:

| Layer                             | What it catches                                                                                                                                                       | Command                           |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| **Calculator unit tests**         | Wrong math, rounding, edge cases (negative amounts, non-integer minor units, same-company IC)                                                                         | `pnpm --filter afenda-{pkg} test` |
| **Canon invariant tests**         | Registry drift — e.g. adding an intent type but forgetting the `DOMAIN_INTENT_REGISTRY` entry, or `SHARED_KERNEL_REGISTRY.writes[]` referencing a non-existent intent | `pnpm --filter afenda-canon test` |
| **CI domain gates (SK-01…SK-08)** | Architectural violations — cross-domain imports, `new Date()` in domain code, DB mutations, missing `src/index.ts`, package count drift                               | `pnpm ci:domain-gates`            |

**Run all domain tests in one command:**

```bash
pnpm test:domain
```

**Test file conventions:**

- `src/__tests__/{calculator}.test.ts` — pure calculator tests (no mocks needed)
- `src/__tests__/{service}.test.ts` — service tests (mock `DbSession` for DB-touching functions)
- `packages/canon/src/registries/__tests__/domain-registries.invariants.test.ts` — cross-registry contract tests

**What each test type prevents:**

- **Calculator tests** → catches off-by-one in aging buckets, wrong priority sort in payment scheduling, broken confidence scoring in bank reconciliation
- **Invariant tests** → catches forgotten registry entries when new intent types or shared kernel tables are added
- **Domain gates** → catches violations of the 8 structural invariants (SK-01 through SK-08) that ESLint alone cannot enforce

---

## 10. Cross-Domain Coordination Rules

### 10.1 The Fundamental Rule

**Domain packages NEVER import from each other.** All cross-domain coordination flows through `afenda-crud` (Layer 3).

```
✅ ALLOWED:
  afenda-crud → business-domain/accounting
  afenda-crud → business-domain/inventory
  afenda-crud orchestrates: accounting + inventory together

❌ FORBIDDEN:
  business-domain/accounting → business-domain/inventory
  business-domain/inventory → business-domain/crm
```

### 10.2 Why This Rule Exists

Cross-domain imports create hidden coupling that:

- Makes packages impossible to test in isolation
- Creates circular dependency risks
- Prevents independent deployment and versioning
- Violates the Single Responsibility Principle

### 10.3 Coordination Patterns

When domain A needs data from domain B, use one of these patterns:

**Pattern 1 — Domain returns intents, Layer 3 executes (canonical pattern)**

Domain packages **read** freely but **never write** truth tables. They return `DomainIntent[]` for `afenda-crud` to execute via `mutate()`.

```typescript
// afenda-canon/src/types/domain-intent.ts
export type DomainIntent =
  | { type: 'inventory.adjust'; payload: { itemId: string; deltaMinor: number; reason: string } }
  | { type: 'accounting.post'; payload: { journalLines: JournalLine[] } }
  | { type: 'crm.update-credit'; payload: { customerId: string; newLimitMinor: number } };

// business-domain/inventory/src/services/stock-service.ts
export async function buildStockAdjustmentIntents(
  db: DbSession,
  ctx: DomainContext,
  input: StockAdjustInput,
): Promise<DomainIntent[]> {
  // ✅ reads are fine
  const current = await queries.getStockBalance(db, ctx, input.itemId);
  const calc = calculators.computeAdjustment(current, input);
  // ✅ returns intents — never writes
  return [{ type: 'inventory.adjust', payload: calc }];
}
```

**Pattern 2 — Pass data as input**

```typescript
// afenda-crud passes inventory data to accounting
const stockValue = await inventoryService.getStockValue(db, ctx, itemId);
await accountingService.postInventoryAdjustment(db, ctx, { stockValue });
```

**Pattern 3 — Canon types as shared vocabulary**

```typescript
// Both domains use afenda-canon types — no direct dependency
import type { EntityRef, DomainIntent } from 'afenda-canon';
```

**Pattern 4 — Outbox for async side effects**

```typescript
// afenda-crud emits outbox event; downstream consumers pick it up
outboxIntents.push({ type: 'search.index', payload: { entityRef } });
```

### 10.4 Shared Data Access & Shared Kernel

Multiple domain packages may query the same database tables — they share the `afenda-database` schema. What is forbidden is importing another domain's **service functions**.

**Shared Kernel Rule:** If two or more domains touch the same truth table, that table MUST be declared a **Shared Kernel** entry in `afenda-canon` with:

- A designated **owner domain** (controls invariants and write intents)
- An **invariant list** (what must always be true about the data)
- **Canonical read model types** exported from `afenda-canon` or `afenda-database`

```typescript
// afenda-canon/src/shared-kernel.ts
export const SHARED_KERNEL_REGISTRY = {
  'inventory.stock_ledger': {
    owner: 'inventory',
    invariants: ['quantity_on_hand >= 0', 'lot_id references lot_tracking'],
    readers: ['cost-accounting', 'mrp', 'demand-planning'],
  },
  'accounting.journal_lines': {
    owner: 'accounting',
    invariants: ['debit_total = credit_total per journal_id'],
    readers: ['consolidation', 'reporting', 'fixed-assets'],
  },
} as const;
```

---

## 11. Financial Integrity Model

### 11.1 Double-Entry Accounting Invariant

Every financial posting MUST balance: **Σ debits = Σ credits**.

```typescript
// Enforced by accounting package
function validateJournalBalance(lines: JournalLine[]): void {
  const debitTotal = lines
    .filter((l) => l.side === 'debit')
    .reduce((sum, l) => sum + l.amountMinor, 0);
  const creditTotal = lines
    .filter((l) => l.side === 'credit')
    .reduce((sum, l) => sum + l.amountMinor, 0);
  if (debitTotal !== creditTotal) {
    throw new Error(`Journal imbalance: DR ${debitTotal} ≠ CR ${creditTotal}`);
  }
}
```

**Invariant FIN-01:** `postJournalEntry` MUST call `validateJournalBalance` before any DB write. An imbalanced journal is a programming error, not a user error.

### 11.2 Posting Lifecycle

```
unposted → posting → posted → reversing → reversed
                ↑                              ↓
                └──────── (reversal creates) ──┘
```

- `unposted`: Document created, not yet posted to GL
- `posting`: In-flight (prevents double-posting under concurrent requests)
- `posted`: Immutable — no further edits to amounts or accounts
- `reversing`: Reversal in progress
- `reversed`: Original entry reversed; reversal entry is `posted`

**Invariant FIN-02:** A `posted` document's financial lines are immutable. Corrections require a reversal + new posting.

**Invariant FIN-03:** The `posting` state is set atomically with a DB-level lock. Concurrent posting attempts for the same document MUST fail with `ALREADY_POSTING`.

### 11.3 Period Control

```sql
-- DB trigger enforces period close
CREATE OR REPLACE FUNCTION reject_closed_period_posting()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM fiscal_periods
    WHERE org_id = NEW.org_id
      AND company_id = NEW.company_id
      AND period_start <= NEW.posting_date
      AND period_end >= NEW.posting_date
      AND status = 'closed'
  ) THEN
    RAISE EXCEPTION 'Cannot post to closed fiscal period';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 11.4 Audit Trail

Every financial mutation writes to `audit_logs` and `entity_versions` via the `afenda-crud` kernel (K-03). Domain packages do NOT write audit logs directly — the kernel handles this automatically.

---

## 12. Data Sovereignty & Compliance

### 12.1 Data Residency

For multi-national deployments, data residency requirements vary by jurisdiction:

| Jurisdiction    | Requirement                       | Implementation                       |
| --------------- | --------------------------------- | ------------------------------------ |
| EU (GDPR)       | Personal data must stay in EU     | Neon EU region (`eu-central-1`)      |
| Malaysia (PDPA) | No explicit residency requirement | Default: `ap-southeast-1`            |
| China (PIPL)    | Data must stay in China           | Separate Neon project (China region) |
| USA (CCPA)      | No residency requirement          | Default: `us-east-1`                 |
| Saudi Arabia    | Data must stay in KSA             | Separate Neon project (ME region)    |

**Invariant SOV-01:** Tenant region assignment is set at org creation and is immutable. Cross-region data movement requires explicit data export/import with user consent.

### 12.2 GDPR / PDPA Compliance

The `business-domain/data-privacy` package implements:

- **Right to Access** (`dataSubjectRequest('access', subjectId)`) — exports all personal data for a subject
- **Right to Erasure** (`dataSubjectRequest('erase', subjectId)`) — anonymizes personal data (hard delete is not possible for financial records)
- **Consent Management** (`recordConsent`, `withdrawConsent`, `consentHistory`)
- **Data Retention** (`applyRetentionPolicy`) — automated deletion/anonymization after retention period

**Invariant GDPR-01:** Financial records (invoices, payments, journal entries) are NEVER hard-deleted — they are anonymized (personal identifiers replaced with `[REDACTED]`). This satisfies both GDPR erasure and accounting record retention requirements.

### 12.3 Statutory Reporting

| Country   | Report                           | Package                       |
| --------- | -------------------------------- | ----------------------------- |
| Malaysia  | SST Return, e-Invoice (MyInvois) | `tax-engine`, `compliance`    |
| Singapore | GST F5/F7, XBRL                  | `tax-engine`, `compliance`    |
| UK        | VAT Return (MTD), iXBRL          | `tax-engine`, `compliance`    |
| USA       | 1099, W-2, Sales Tax Return      | `tax-engine`, `compliance-hr` |
| Australia | BAS, STP                         | `tax-engine`, `compliance-hr` |
| EU        | VAT OSS, DAC7                    | `tax-engine`, `compliance`    |

---

## 13. Governance Invariants

The following invariants are enforced by ESLint rules, CI gates, and DB triggers. Violations fail the build.

### Domain Output Invariants

**INV-DOM-01 (Typed outputs only):** All exported domain service functions MUST return `Promise<DomainResult<T>>`. Returning `void`, raw `DomainIntent[]`, or untyped objects is forbidden. This makes every service function's output shape explicit and auditable at the type level.

**INV-DOM-02 (Explicit cross-domain flows):** Any service function that produces intents affecting multiple domains MUST declare all intent types in its return type signature. This makes multi-domain actions auditable at the type level.

**INV-DOM-03 (No raw errors):** Domain service functions MUST throw only `DomainError` (from `afenda-canon`). Raw `Error`, `TypeError`, or string throws are forbidden. This ensures Layer 3 can always map domain failures to structured audit entries and UX messages.

**INV-DOM-04 (No raw SQL in Layer 2):** Domain packages may only perform `SELECT` via Drizzle query builder against `DbSession`. The following are forbidden in any `business-domain/*` package, even for `control`, `evidence`, or `projection` tables:

- `db.execute(sql\`...\`)` — raw SQL execution
- `db.insert()`, `db.update()`, `db.delete()` — mutation APIs
- Any helper function that internally calls the above

If a non-truth write is genuinely required in Layer 2 (rare), it must be declared as a named exception in `packages/eslint-config/domain-writes-exceptions.json` and reviewed by the architecture owner.

### Table Ownership Invariants

**INV-OWN-01 (Every truth table has an owner):** Every truth table in `afenda-database` MUST be registered in `SHARED_KERNEL_REGISTRY` with a designated owner domain. The owner controls write intents; other domains may only read. Unowned tables are a CI gate failure.

### Event Invariants

**INV-EVT-01 (Financial mutations emit outbox events):** Every posted financial mutation (journal entry, invoice, payment) MUST emit at least one `DomainEvent` to the outbox. Reporting, search, and workflow MUST NOT depend on synchronous coupling to financial writes.

### Industry Overlay Invariants

**INV-IND-01 (Overlays are additive only, no shadowing):** Industry overlay packages MUST NOT change base domain behavior. Specifically:

**Overlays CAN:**

- Add new intent types (e.g., `retail.apply-loyalty-discount`)
- Add new validation functions **with new names**
- Add new read models and query functions
- Add new services **with new names**
- Import `calculators/*` and `types/*` from the base domain package (prevents duplicate business math)

**Overlays CANNOT:**

- Export a function with the **same name or signature** as a base domain function (shadowing)
- Change or override base domain invariants
- Import `services/*` from the base domain package (prevents implicit orchestration coupling)

Modifying a base package's existing behavior requires a base package change reviewed by the base domain owner, not an overlay workaround.

**INV-IND-02 (Overlay import boundary):** Enforced by ESLint `no-restricted-imports` rule:

```javascript
// packages/eslint-config/overlay-imports.js
// Applied to all business-domain/industry-overlays/* packages
{
  'no-restricted-imports': ['error', {
    patterns: [
      // ❌ Overlays MUST NOT import base domain services
      { group: ['*/business-domain/*/src/services/**'], message: 'Overlays may not import base services. Use calculators or types only.' },
      // ✅ Allowed: calculators and types (enforced by absence of restriction)
    ]
  }]
}
```

### Read Model Invariants

**INV-READ-01 (Read model discipline):** `queries/` modules in a domain package may only query:

- The domain's **own** truth tables (owner in `SHARED_KERNEL_REGISTRY`)
- Shared-kernel tables where the domain is explicitly listed as a `reader`

Cross-domain reads require:

1. A canonical read model type declared in `afenda-database` or `afenda-canon`
2. The querying domain listed under `readers` in `SHARED_KERNEL_REGISTRY` for that table

Ad-hoc cross-domain queries without registry registration are a CI gate failure (SK-01 covers this).

```typescript
// ✅ CORRECT — inventory is listed as reader of accounting.journal_lines
// SHARED_KERNEL_REGISTRY['accounting.journal_lines'].readers includes 'cost-accounting'
import type { JournalLineReadModel } from 'afenda-database';

// ❌ WRONG — crm is not listed as reader of inventory.stock_ledger
// This query has no registry backing and will fail SK-01
const stock = await db.select().from(stockLedger).where(...);
```

### Error Invariants

**INV-ERR-01 (DomainError only):** Domain service functions MUST throw only `DomainError`. Raw `new Error(...)`, `throw 'string'`, or rethrowing non-`DomainError` exceptions without wrapping are forbidden. Enforced by ESLint `no-restricted-syntax` rule targeting `throw new Error`.

**INV-ERR-02 (JSON-safe meta, no PII):** `DomainError.meta` MUST be JSON-serializable. It MUST NOT contain: passwords, tokens, full PII (name, email, IC number), or objects with circular references. The meta is written to `audit_logs` — treat it as audit evidence, not debug output.

### Idempotency Invariants

**INV-IDEMP-01 (Required intents must define idempotency key recipe):** Every entry in `DOMAIN_INTENT_REGISTRY` MUST use the unified object form for `idempotency`. The `policy: 'required'` case additionally requires non-empty `scope` and `recipe` fields:

```typescript
// Unified form — all three fields required for every intent
idempotency: {
  policy: 'required',           // 'required' | 'optional' | 'forbidden'
  scope:  'document',           // 'org' | 'company' | 'document'
  recipe: 'hash(org_id, journal_id)', // symbolic key derivation
}
```

Layer 3 (`afenda-crud`) derives the actual idempotency key from `recipe` before calling `mutate()`. CI gate SK-02 fails if any `required` intent has an empty `recipe` or missing `scope`.

### Industry Overlay Invariants (continued)

**INV-IND-03 (Overlay activation is deterministic):** Overlay activation MUST be computed by a single deterministic closure function in `afenda-canon`. Ad-hoc `if (tenant.industry === 'retail')` checks scattered across domain packages are forbidden.

```typescript
// afenda-canon/src/registries/overlay-activation.ts
export function resolveActiveOverlays(
  enabledOverlays: IndustryOverlayKey[],
): Set<IndustryOverlayKey> {
  // Deterministic closure: activating 'retail' also activates 'pos-core' dependencies
  return computeOverlayClosure(enabledOverlays, OVERLAY_DEPENDENCY_GRAPH);
}
```

Tenant config stores `enabledOverlays: IndustryOverlayKey[]`. Layer 3 calls `resolveActiveOverlays()` once per request and injects the result as `ctx.activeOverlays`. Overlay service functions MUST guard their entry point:

```typescript
// business-domain/industry-overlays/retail/retail-pos/src/services/pos-service.ts
export async function openRetailSession(
  db: DbSession,
  ctx: DomainContext,
  input: OpenSessionInput,
): Promise<DomainResult<SessionReadModel>> {
  if (!ctx.activeOverlays.has('retail')) {
    throw new DomainError('OVERLAY_NOT_ACTIVE', 'retail overlay is not enabled for this tenant');
  }
  // ... rest of service
}
```

### Layer Invariants

**INV-L01:** Domain packages MUST NOT import from Layer 3 (`afenda-crud`, `afenda-observability`).

**INV-L02:** Domain packages MUST NOT import from other domain packages (`business-domain/*`).

**INV-L03:** Domain packages MUST NOT import from `apps/*`.

**INV-L04:** Domain packages MUST NOT contain direct `db.insert()`, `db.update()`, `db.delete()` calls on truth tables. All writes flow through `afenda-crud`'s `mutate()`. See also INV-DOM-04 for the broader raw SQL prohibition.

### Data Invariants

**INV-D01:** Every domain table MUST have `org_id TEXT NOT NULL DEFAULT auth.org_id()`.

**INV-D02:** Every domain table MUST have RLS ENABLED + FORCE + `tenantPolicy`.

**INV-D03:** All monetary columns MUST be `BIGINT` (minor units). `NUMERIC`, `DECIMAL`, and `FLOAT` are forbidden for money.

**INV-D04:** All monetary CHECK constraints MUST be enforced at DB level, not application level alone.

**INV-D05:** Fiscal period close MUST be enforced by DB trigger, not application code alone.

### Code Quality Invariants

**INV-C01:** No `console.log` / `console.error` in domain packages — use `afenda-logger`.

**INV-C02:** No hardcoded currency codes, tax rates, or locale strings in business logic.

**INV-C03:** No `new Date()` in financial calculations — accept `date` as a parameter.

**INV-C04:** No floating-point arithmetic on monetary values.

**INV-C05:** Every exported function MUST have a TypeScript return type annotation.

---

## 14. Dependency Rules

### 14.1 Allowed Imports

```
business-domain/my-domain
  ├── ✅ afenda-canon          (Layer 1 — types, schemas, enums)
  ├── ✅ afenda-database       (Layer 1 — DbSession, schema types)
  ├── ✅ afenda-logger         (Layer 1 — structured logging)
  ├── ✅ zod                  (external — validation)
  ├── ✅ drizzle-orm          (external — query builder)
  └── ✅ other external libs  (date-fns, decimal.js for rates/ratios only — see note below)
```

### 14.2 Forbidden Imports

```
business-domain/my-domain
  ├── ❌ afenda-crud               (Layer 3 — would create upward dependency)
  ├── ❌ afenda-observability      (Layer 3 — would create upward dependency)
  ├── ❌ business-domain/*/src/services/**  (Layer 2 peer services — use Layer 3 orchestration)
  ├── ❌ apps/*                   (Application layer)
  └── ❌ tools/*                  (CLI tools)
```

### 14.2a Forbidden DB API Patterns (Layer 2)

The **only** allowed DB surface in `business-domain/**` is `db.select()` via Drizzle query builder. All of the following are forbidden even for `control`, `evidence`, or `projection` tables:

```
❌ db.insert(...)                          — mutation
❌ db.update(...)                          — mutation
❌ db.delete(...)                          — mutation
❌ db.execute(sql`...`)                    — raw SQL bypass
❌ db.transaction(async (tx) => tx.insert(...))  — hidden mutation
❌ saveSomething(db, ...)                  — helper that internally mutates
❌ any DrizzleDB method that is not .select()   — default-deny
```

ESLint enforcement: `no-restricted-syntax` bans `CallExpression[callee.property.name=/^(insert|update|delete|execute|transaction)$/]` in `business-domain/**` (except `packages/eslint-config/domain-writes-exceptions.json` allowlist).

### 14.3 Dependency Graph

```
Layer 3: afenda-crud
    ↓ imports
Layer 2: business-domain/* (130 packages)
    ↓ imports
Layer 1: afenda-canon, afenda-database, afenda-logger
    ↓ imports
Layer 0: afenda-typescript-config, afenda-eslint-config
```

> **`decimal.js` usage rule:** `decimal.js` is allowed **only** for rates, ratios, percentages, and unit conversions (e.g., FX rates, tax rates, unit-of-measure conversions). It is **forbidden** for stored monetary amounts — those MUST use `BIGINT` minor units (enforced by INV-D03 and INV-C04). Mixing `Decimal` and minor-unit integers in the same calculation is a code review failure.

The graph is a strict DAG. Any cycle is a build error (enforced by `tsc --build` with project references).

### 14.4 Root tsconfig.json References

Domain packages use the **source-first** pattern and MUST NOT appear in root `tsconfig.json` references. Only Library packages (`packages/*`) that emit `.d.ts` via tsup belong there:

```jsonc
{
  "references": [
    { "path": "./packages/canon" },
    { "path": "./packages/database" },
    { "path": "./packages/logger" },
    { "path": "./packages/ui" },
    { "path": "./packages/crud" },
    { "path": "./packages/search" },
    { "path": "./packages/workflow" },
    { "path": "./packages/migration" },
    // ❌ NEVER: { "path": "./business-domain/finance/accounting" }
    // ❌ NEVER: { "path": "./business-domain/finance/tax-engine" }
    // Source-first packages have no composite:true — adding them causes TS6306
  ],
}
```

> **Why?** Source-first packages do not set `composite: true`. Adding them to `references` causes `error TS6306: Referenced project must have setting "composite": true`. See the `ts-tsup-config` skill §1 for the full decision table.

---

## 15. OSS ERP Benchmark Scorecard

This scorecard rates AFENDA-NEXUS against the industry benchmark criteria derived from the five peer ERPs.

| Criterion                  | Weight | Score  | Notes                                                               |
| -------------------------- | ------ | ------ | ------------------------------------------------------------------- |
| **Multi-tenancy (RLS)**    | 10%    | 10/10  | Postgres RLS + Neon Auth; zero cross-tenant leakage possible        |
| **Multi-company**          | 10%    | 9.5/10 | `org_id` + `company_id` separation; IC transactions; consolidation  |
| **Intercompany**           | 8%     | 9/10   | Matching, netting, elimination; IC status machine DB-enforced       |
| **Multi-currency**         | 8%     | 9.5/10 | Integer minor units; 5 FX rate types; revaluation; hedge accounting |
| **Multi-national tax**     | 8%     | 9/10   | GST/VAT/WHT/SST; time-bounded rates; pure calculation functions     |
| **Fiscal year variants**   | 5%     | 9.5/10 | Per-company fiscal year; DB trigger for period close                |
| **Double-entry integrity** | 10%    | 10/10  | Balance validation + posting lifecycle + immutable posted entries   |
| **Audit trail**            | 8%     | 10/10  | K-03: every mutation writes audit_logs + entity_versions            |
| **Layered architecture**   | 8%     | 10/10  | Strict DAG; zero circular deps; enforced by tsc project references  |
| **Domain isolation**       | 7%     | 9.5/10 | No peer imports; ESLint + CI gates enforce the rule                 |
| **Industry extensibility** | 6%     | 9/10   | Overlay pattern; 7 industries covered; feature-flag activation      |
| **Compliance (GDPR/SOX)**  | 6%     | 8.5/10 | Data privacy package; anonymization (not hard delete); SOX controls |
| **Testability**            | 6%     | 9/10   | Pure functions; DomainContext injection; DB tests skippable         |

**Overall Score: 9.4 / 10**

### Benchmark Comparison

| System                 | Architecture Score | Completeness | AFENDA Delta            |
| ---------------------- | ------------------ | ------------ | ----------------------- |
| SAP S/4HANA            | 9.5                | 10/10        | −0.1 arch, +serverless  |
| Oracle NetSuite        | 9.0                | 9/10         | +0.4 arch, +RLS         |
| Microsoft Dynamics 365 | 8.5                | 9/10         | +0.9 arch, +type-safety |
| ERPNext / Frappe       | 7.5                | 9/10         | +1.9 arch, +monorepo    |
| Tryton                 | 9.0                | 8/10         | +0.4 arch, +serverless  |
| LedgerSMB              | 8.5                | 7/10         | +0.9 arch, +full ERP    |
| **AFENDA-NEXUS**       | **9.4**            | **9/10**     | —                       |

### Key Differentiators

- **Serverless-native** — Neon + Vercel Fluid Compute; no connection pool management overhead
- **Type-safe monorepo** — TypeScript project references enforce layer boundaries at compile time
- **Outbox pattern** — Best-effort side effects (search, webhooks, workflow) without distributed transactions
- **Immutable audit trail** — `entity_versions` + `audit_logs` on every mutation; no manual audit coding required
- **Math-first advisory** — Deterministic anomaly detection and forecasting (EWMA, CUSUM, Holt-Winters); no LLMs in the data path
- **RLS-first security** — Tenant isolation enforced at the database layer; impossible to bypass via application bugs
- **Intent-based domain outputs** — Domain packages return `DomainIntent[]`; Layer 3 executes. No truth-table writes in Layer 2.
- **Shared Kernel Registry** — Every truth table has a declared owner domain; enforced by CI gate
- **130-package taxonomy** — Covers Finance, Supply Chain, OTC, Manufacturing, HR, Projects, Governance, R&D, Retail, F&B, Agri (Livestock/Feed/Greenhouse/Vertical)

---

## 16. Platform Infrastructure (non-domain)

The following services are **NOT** in `business-domain/`. They live in `packages/platform-*` because they are infrastructure, not business logic. They have no `DomainIntent` outputs and no truth-table ownership.

```
packages/
├── platform-workflow/       afenda-workflow    — process engine (already exists)
├── platform-notifications/  afenda-notifications — push/email/SMS dispatch
├── platform-webhooks/       afenda-webhooks    — outbound webhook delivery
├── platform-storage/        afenda-storage     — file upload/presign/delete
├── platform-email/          afenda-email       — transactional email (Resend/SES)
├── platform-sms/            afenda-sms         — SMS dispatch
├── platform-rate-limiting/  afenda-rate-limit  — quota enforcement
├── platform-metering/       afenda-metering    — raw usage ingestion + aggregation
├── platform-iot/            afenda-iot         — telemetry ingestion + sensor query models
└── platform-migration/      afenda-migration   — data migration engine (already exists)
```

### 16.1 Platform Package Rules

- Platform packages live in `packages/platform-*`, NOT `business-domain/`
- Platform packages are Layer 1/2 boundary — they may be imported by Layer 2 domain packages for **read-only** operations (e.g., querying sensor telemetry, checking usage totals)
- **Platform packages MUST NEVER be required to compute financial truth.** They provide availability ("what is the current sensor reading?"), not correctness ("what is the authoritative stock balance?"). Financial correctness lives in `business-domain/` truth tables only.
- **Platform packages MUST NEVER be required to compute inventory truth.** Stock balances, lot quantities, and warehouse positions are owned by `business-domain/supply-chain/inventory`. `platform-iot` may report sensor readings; it never determines authoritative stock levels.
- Specifically forbidden: pricing, tax calculation, posting decisions, stock balance queries, and any computation that feeds into a `DomainIntent` payload MUST NOT depend on a platform package result.
- Platform packages MUST NOT import from `business-domain/*`
- Platform packages MUST NOT own truth tables (they use their own infra tables)
- Platform packages are NOT listed in `SHARED_KERNEL_REGISTRY`

### 16.2 Why the Separation Matters

| Concern                             | `business-domain/` | `packages/platform-*/`  |
| ----------------------------------- | ------------------ | ----------------------- |
| Owns business truth tables          | ✅ Yes             | ❌ No                   |
| Returns `DomainIntent[]`            | ✅ Yes             | ❌ No                   |
| Implements business rules           | ✅ Yes             | ❌ No                   |
| Infrastructure dispatch             | ❌ No              | ✅ Yes                  |
| Can be swapped (e.g., Resend → SES) | N/A                | ✅ Yes                  |
| Tested with domain logic            | ✅ Yes             | ❌ Tested independently |
