# Domain PRD vs. Current DB Schema — Gap Analysis

> Last updated: 2026-02-13 — reflects Transactional Spine migrations 0031–0037 (23 new tables + 1 trigger).

## Layer 0: Platform Foundations ✅ COMPLETE

| Capability             | Schema/Implementation                                                          |
| ---------------------- | ------------------------------------------------------------------------------ |
| Tenant isolation (RLS) | `tenantPolicy` on all tables, `auth.org_id()`                                  |
| Feature flags          | `capability-exceptions.json` + API routes                                      |
| Observability          | `audit-logs`, `workflow-executions` (append-only)                              |
| Rate limits            | `org-usage-daily`, rate limiter in crud                                        |
| Migration governance   | `migration-jobs`, `migration-lineage`, `migration-quarantine`, etc. (7 tables) |
| Perf controls          | Governor (`lock_timeout`, `statement_timeout`)                                 |

## Layer 1: Business Identity & Structure ✅ COMPLETE

| Capability                 | Schema                                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Legal entities / companies | [companies](cci:9://file:///C:/AI-BOS/AFENDA-NEXUS/apps/web/app/%28app%29/org/%5Bslug%5D/companies:0:0-0:0) |
| Branches / sites           | `sites`                                                                                                     |
| Cost centers               | `cost-centers`                                                                                              |
| Projects (profit centers)  | `projects`                                                                                                  |

## Layer 2: Master Data Truth ✅ COMPLETE

| Capability                           | Schema                                                                 | Status   |
| ------------------------------------ | ---------------------------------------------------------------------- | -------- |
| Customers/Vendors                    | `contacts`                                                             |          |
| Items/Products                       | `items`, `item_groups` (Migration 0031)                                |          |
| Warehouses                           | `warehouses` (Migration 0031)                                          |          |
| Addresses                            | `addresses`, `contact_addresses`, `company_addresses` (Migration 0031) |          |
| UOM                                  | `uom`, `uom-conversions`                                               |          |
| COA                                  | `chart-of-accounts`                                                    |          |
| Tax                                  | `tax-rates`                                                            |          |
| Currency                             | `currencies`, `fx-rates`                                               |          |
| MDM governance (dedupe/survivorship) | Migration engine has this, not master data                             | deferred |

## Layer 3: Transactional Operations ✅ COMPLETE

| Capability                     | Schema                                                                                   | Status |
| ------------------------------ | ---------------------------------------------------------------------------------------- | ------ |
| Sales Orders + Lines           | `sales_orders`, `sales_order_lines` (Migration 0035)                                     |        |
| Purchase Orders + Lines        | `purchase_orders`, `purchase_order_lines` (Migration 0036)                               |        |
| Sales Invoices + Lines (AR)    | `sales_invoices`, `sales_invoice_lines` (Migration 0033)                                 |        |
| Purchase Invoices + Lines (AP) | `purchase_invoices`, `purchase_invoice_lines` (Migration 0036)                           |        |
| Delivery Notes + Lines         | `delivery_notes`, `delivery_note_lines` (Migration 0035)                                 |        |
| Goods Receipts + Lines         | `goods_receipts`, `goods_receipt_lines` (Migration 0036)                                 |        |
| Payments                       | `payments` (Migration 0034)                                                              |        |
| Quotations + Lines             | `quotations`, `quotation_lines` (Migration 0037)                                         |        |
| Posting Bridge                 | `doc_postings`, `doc_links` + `check_warehouse_company_match()` trigger (Migration 0032) |        |
| Credit Notes                   | `credit-notes`                                                                           |        |
| Payment Allocations            | `payment-allocations`                                                                    |        |
| Number Sequences               | `number-sequences`                                                                       |        |

## Layer 4: Record-to-Report Finance ✅ MOSTLY COMPLETE

| Capability                 | Schema                                                                                     | Status |
| -------------------------- | ------------------------------------------------------------------------------------------ | ------ |
| GL (Journal Entries/Lines) | `journal-entries`, `journal-lines`                                                         |        |
| Fiscal Periods / Close     | `fiscal-periods`                                                                           |        |
| Fixed Assets               | `fixed-assets` (assets, depreciation, events)                                              |        |
| Bank Reconciliation        | `bank-statements`, `match-results`                                                         |        |
| Budgets                    | `budgets` (budgets + commitments)                                                          |        |
| Revenue Recognition        | `revenue-schedules`                                                                        |        |
| Stock Movements            | `stock-movements`                                                                          |        |
| Lot/Batch/Serial           | `lot-tracking`                                                                             |        |
| Traceability DAG           | `inventory-trace-links`                                                                    |        |
| Warehouses / Locations     | `warehouses` (Migration 0031) + `check_warehouse_company_match()` trigger (Migration 0032) |        |

## Layer 5: Inventory + Lot/Serial Traceability ✅ COMPLETE

| Capability             | Schema                                                                                     | Status |
| ---------------------- | ------------------------------------------------------------------------------------------ | ------ |
| Stock Movements        | `stock-movements`                                                                          |        |
| Lot/Batch/Serial       | `lot-tracking`                                                                             |        |
| Traceability DAG       | `inventory-trace-links`                                                                    |        |
| Warehouses / Locations | `warehouses` (Migration 0031) + `check_warehouse_company_match()` trigger (Migration 0032) |        |

## Layer 6: Planning 🟡 PARTIAL

| Capability                        | Status                                |
| --------------------------------- | ------------------------------------- |
| Items / Products (prerequisite)   | (items, item_groups — Migration 0031) |
| BOM (exists, items now available) | schema exists                         |
| MRP / DRP                         | future                                |
| Demand Forecasting                | future                                |

## Layer 7: Production Execution 🟡 PARTIAL

| Capability       | Schema          | Status |
| ---------------- | --------------- | ------ |
| BOMs / BOM Lines | `boms`          |        |
| Work Orders      | `work-orders`   |        |
| WIP Movements    | `wip-movements` |        |
| Landed Costs     | `landed-costs`  |        |

## Layer 8: Quality / Compliance / CAPA ❌ NOT STARTED

All missing — future vertical pack.

## Layer 9: Human Capital ❌ NOT STARTED

All missing — future vertical pack.

## Layer 10: Governance, Risk, Approvals ✅ COMPLETE

| Capability         | Schema                                                                     |
| ------------------ | -------------------------------------------------------------------------- |
| RBAC               | `roles`, `role-permissions`, `user-roles`, `user-scopes`                   |
| Approval Chains    | `approval-chains` (chains, steps, requests, decisions)                     |
| Immutable Evidence | `audit-logs`, `advisory-evidence`, `workflow-executions` (all append-only) |
| Policy enforcement | Workflow rules engine, governor                                            |

## Layer 11: Document & Evidence Management 🟡 PARTIAL

| Capability                 | Schema                           | Status |
| -------------------------- | -------------------------------- | ------ |
| Attachments                | `entity-attachments`, `r2-files` |        |
| Versioning                 | `entity-versions`                |        |
| Communications             | `communications`                 |        |
| Controlled templates / SOP | —                                | future |

## Layer 12: Integration & Ecosystem 🟡 PARTIAL

| Capability           | Schema                                       | Status |
| -------------------- | -------------------------------------------- | ------ |
| API Keys             | `api-keys`                                   |        |
| Webhooks             | `webhook-endpoints`, `webhook-deliveries`    |        |
| External idempotency | `external_source`/`external_id` on docEntity |        |
| Event bus / EDI      | —                                            | future |

## Layer 13: Analytics ✅ FOUNDATION

| Capability          | Schema                            | Status            |
| ------------------- | --------------------------------- | ----------------- |
| Reporting Snapshots | `reporting-snapshots`             |                   |
| Advisory Engine     | `advisories`, `advisory-evidence` |                   |
| KPI layer           | —                                 | app-layer, future |

## Layer 14: Automation ✅ COMPLETE

| Capability             | Schema                                  |
| ---------------------- | --------------------------------------- |
| Workflow Rules Engine  | `workflow-rules`, `workflow-executions` |
| Approval Orchestration | `approval-chains`                       |

## Layer 15: Commercial Control 🟡 PARTIAL

| Capability         | Schema                                           | Status |
| ------------------ | ------------------------------------------------ | ------ |
| Price Lists        | `price-lists`                                    |        |
| Discount Rules     | `discount-rules`                                 |        |
| Quotations + Lines | `quotations`, `quotation_lines` (Migration 0037) |        |
| CRM Pipeline       | —                                                | future |
| Contracts          | —                                                | future |

## Layer 16: Treasury ✅ FOUNDATION

| Capability      | Schema       | Status |
| --------------- | ------------ | ------ |
| FX Rates        | `fx-rates`   |        |
| Multi-currency  | `currencies` |        |
| Payment Factory | —            | future |

## Layer 17: Group / Enterprise Control 🟡 PARTIAL

| Capability    | Schema                      | Status |
| ------------- | --------------------------- | ------ |
| Intercompany  | `intercompany-transactions` |        |
| Consolidation | —                           | future |

## Layers 18–19: Security Privacy / Vertical Packs

Future — not in current scope.

---

# Summary: Current State (post Transactional Spine v6.3)

**Layers 0–5, 7, 10–14, 16–17** are complete or on-track with existing foundations.

**Layer 3 (Transactional Operations)** — the former critical gap — is now **COMPLETE** with 23 new tables across 7 migrations (0031–0037), all applied to Neon.

### Transactional Spine Tables (Migrations 0031–0037)

| Migration           | Tables                                                                                                                            | Key Features                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 0031 Master Data    | `item_groups`, `items`, `warehouses`, `addresses`, `contact_addresses`, `company_addresses`                                       | Hierarchical groups, item types, warehouse types, address links                              |
| 0032 Posting Bridge | `doc_postings`, `doc_links` + `check_warehouse_company_match()` trigger                                                           | v6.3 no-WHERE idempotency unique, active posting unique includes `reversing`, 5-state status |
| 0033 Sales Invoice  | `sales_invoices`, `sales_invoice_lines`                                                                                           | 6-state posting, partial aging indexes, customer analytics index, `reject_posted_mutation`   |
| 0034 Payments       | `payments`                                                                                                                        | 6-state posting, allocation lock strategy at service level                                   |
| 0035 Selling Cycle  | `sales_orders`, `sales_order_lines`, `delivery_notes`, `delivery_note_lines`                                                      | `deliveredQty`/`billedQty` tracking, lot/serial on DN lines                                  |
| 0036 Buying Cycle   | `purchase_orders`, `purchase_order_lines`, `goods_receipts`, `goods_receipt_lines`, `purchase_invoices`, `purchase_invoice_lines` | AP aging indexes, warehouse-company match trigger on GR lines                                |
| 0037 Quotations     | `quotations`, `quotation_lines`                                                                                                   | NO posting columns (never posted), party_type customer/supplier                              |

### Remaining Gaps (future work)

| Layer       | Gap                               | Priority        |
| ----------- | --------------------------------- | --------------- |
| Layer 6     | MRP / DRP / Demand Forecasting    | Future          |
| Layer 8     | Quality / Compliance / CAPA       | Future vertical |
| Layer 9     | Human Capital                     | Future vertical |
| Layer 11    | Controlled templates / SOP        | Future          |
| Layer 12    | Event bus / EDI                   | Future          |
| Layer 13    | KPI layer (app-layer)             | Future          |
| Layer 15    | CRM Pipeline, Contracts           | Future          |
| Layer 16    | Payment Factory                   | Future          |
| Layer 17    | Consolidation                     | Future          |
| Layer 18–19 | Security Privacy / Vertical Packs | Future          |

### Design Principles (established)

1. **Header + Lines pattern** — every transactional doc has header + lines tables
2. **Minor units for money** — `bigint` in minor currency units (cents/sen)
3. **docEntityColumns + postingColumns** — all postable doc headers use shared helpers
4. **baseEntityColumns** — master data and line tables
5. **tenantPolicy** — RLS on all tables
6. **6-state posting enum** — `unposted/posting/posted/failed/reversing/reversed` on headers; 5-state on `doc_postings` (no `unposted`)
7. **net CHECK on all line tables** — `net_minor = amount_minor - discount_minor + tax_minor`
8. **Hand-written SQL migrations** — drizzle-kit snapshot is stale from 0021+; all migrations manually authored
