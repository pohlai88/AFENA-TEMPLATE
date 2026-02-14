# Afena Interaction Kernel (CRUD-SAP) — Architecture Reference

> **Auto-generated** by `afena readme gen` at 2026-02-14T08:34:54Z. Do not edit — regenerate instead.
> **Package:** `afena-crud` (`packages/crud`)
> **Purpose:** Single mutation entry point for all domain data — the Afena Interaction Kernel (AIK).

---

## 1. Architecture Overview

Every domain mutation flows through `mutate()` — no exceptions. ESLint INVARIANT-01 enforces
that no package outside `packages/crud` may call `db.insert()`, `db.update()`, or `db.delete()`
on domain tables.

The kernel pipeline: Validation → Lifecycle Guard → Policy Gate → Governor → Workflow Before →
Transaction (handler + audit + version) → Workflow After → Metering.

---

## 2. Data Flow

```
Server Action / API Route
    │
    ▼
mutate(spec, ctx)
    ├── Zod validation
    ├── Lifecycle guard (state machine)
    ├── Policy gate (RBAC)
    ├── Governor (SET LOCAL timeouts)
    ├── evaluateRules('before') — can block/enrich
    ├── Transaction
    │   ├── Entity handler (create/update/delete/restore)
    │   ├── audit_logs INSERT
    │   └── entity_versions INSERT
    ├── evaluateRules('after') — fire-and-forget
    └── Metering (fire-and-forget)
```

---

## 3. Key Design Decisions

- **K-01**: `mutate()` is the only way to write domain data
- **K-02**: Single DB transaction per mutation
- **K-03**: Every mutation writes audit_logs + entity_versions
- **K-04**: `expectedVersion` required on update/delete/restore (optimistic locking)
- **K-05**: Package exports ONLY `mutate`, `readEntity`, `listEntities`
- **K-06**: Namespaced actions `{entity}.{verb}`, verb = last segment
- **K-11**: Allowlist input (handler pick) + kernel denylist backstop (strips system cols)
- **K-13**: Diff normalizes snapshots first, no post-filter

---

## 4. Package Structure (live)

| Metric | Value |
| ------ | ----- |
| **Source files** | 40 |
| **Test files** | 12 |
| **Source directories** | handlers, services |

```
packages/crud/src/
├── handlers/
├── services/
```

---

## 5. Public API (barrel exports)

### Value Exports

| Export | Source |
| ------ | ------ |
| `mutate` | `./mutate` |
| `readEntity` | `./read` |
| `listEntities` | `./read` |
| `buildSystemContext` | `./context` |
| `checkRateLimit` | `./rate-limiter` |
| `getRateLimitConfig` | `./rate-limiter` |
| `_resetRateLimitStore` | `./rate-limiter` |
| `acquireJobSlot` | `./job-quota` |
| `releaseJob` | `./job-quota` |
| `getJobQuotaState` | `./job-quota` |
| `getJobQuotaConfig` | `./job-quota` |
| `_resetJobQuotaStore` | `./job-quota` |
| `meterApiRequest` | `./metering` |
| `meterJobRun` | `./metering` |
| `meterDbTimeout` | `./metering` |
| `meterStorageBytes` | `./metering` |
| `loadFieldDefs` | `./services/custom-field-validation` |
| `validateCustomData` | `./services/custom-field-validation` |
| `getValueColumn` | `./services/custom-field-validation` |
| `computeSchemaHash` | `./services/custom-field-validation` |
| `syncCustomFieldValues` | `./services/custom-field-sync` |
| `processSyncQueue` | `./services/custom-field-sync` |
| `allocateDocNumber` | `./services/doc-number` |
| `resolveFiscalYear` | `./services/doc-number` |
| `lookupFxRate` | `./services/fx-lookup` |
| `checkPeriodOpen` | `./services/fiscal-period` |
| `assertPeriodOpen` | `./services/fiscal-period` |
| `resolveTaxRate` | `./services/tax-calc` |
| `calculateLineTax` | `./services/tax-calc` |
| `calculateTaxForLine` | `./services/tax-calc` |
| `allocatePayment` | `./services/payment-allocation` |
| `getPaymentAllocationSummary` | `./services/payment-allocation` |
| `getAllocationsForTarget` | `./services/payment-allocation` |
| `dispatchWebhookEvent` | `./services/webhook-dispatch` |
| `verifyWebhookSignature` | `./services/webhook-dispatch` |
| `resolvePrice` | `./services/pricing-engine` |
| `evaluateDiscounts` | `./services/pricing-engine` |
| `priceLineItem` | `./services/pricing-engine` |
| `evaluateMatch` | `./services/three-way-match` |
| `matchDocumentLines` | `./services/three-way-match` |
| `overrideMatchException` | `./services/three-way-match` |
| `resolveConversion` | `./services/uom-conversion` |
| `convertQuantity` | `./services/uom-conversion` |
| `convertUom` | `./services/uom-conversion` |
| `generateDepreciationSchedule` | `./services/depreciation-engine` |
| `calculateDepreciation` | `./services/depreciation-engine` |
| `generateStraightLineSchedule` | `./services/revenue-recognition` |
| `createRevenueSchedule` | `./services/revenue-recognition` |
| `recognizeRevenue` | `./services/revenue-recognition` |
| `checkBudget` | `./services/budget-enforcement` |
| `commitBudget` | `./services/budget-enforcement` |
| `releaseBudgetCommitment` | `./services/budget-enforcement` |
| `allocateLandedCost` | `./services/landed-cost-engine` |
| `traceForward` | `./services/lot-recall` |
| `traceBackward` | `./services/lot-recall` |
| `traceRecall` | `./services/lot-recall` |
| `createIntercompanyTransaction` | `./services/intercompany` |
| `generateEliminationEntries` | `./services/intercompany` |
| `markEliminated` | `./services/intercompany` |
| `scoreMatch` | `./services/bank-reconciliation` |
| `autoMatchBatch` | `./services/bank-reconciliation` |
| `persistReconciliationMatch` | `./services/bank-reconciliation` |
| `explodeBom` | `./services/manufacturing-engine` |
| `explodeBomFromDb` | `./services/manufacturing-engine` |
| `calculateCostRollup` | `./services/manufacturing-engine` |
| `getCostRollup` | `./services/manufacturing-engine` |
| `generateWipJournalEntries` | `./services/manufacturing-engine` |

### Type Exports

| Type | Source |
| ---- | ------ |
| `MutationContext` | `./context` |
| `RateLimitConfig` | `./rate-limiter` |
| `RateLimitResult` | `./rate-limiter` |
| `JobQuotaConfig` | `./job-quota` |
| `JobQuotaResult` | `./job-quota` |
| `JobQuotaDenyReason` | `./job-quota` |
| `CustomFieldDef` | `./services/custom-field-validation` |
| `ValidationError` | `./services/custom-field-validation` |
| `DocNumberResult` | `./services/doc-number` |
| `FxRateResult` | `./services/fx-lookup` |
| `FiscalPeriodStatus` | `./services/fiscal-period` |
| `ResolvedTaxRate` | `./services/tax-calc` |
| `TaxLineResult` | `./services/tax-calc` |
| `AllocationResult` | `./services/payment-allocation` |
| `PaymentAllocationSummary` | `./services/payment-allocation` |
| `WebhookDeliveryResult` | `./services/webhook-dispatch` |
| `WebhookDispatchResult` | `./services/webhook-dispatch` |
| `ResolvedPrice` | `./services/pricing-engine` |
| `AppliedDiscount` | `./services/pricing-engine` |
| `LinePricingResult` | `./services/pricing-engine` |
| `MatchInput` | `./services/three-way-match` |
| `MatchTolerance` | `./services/three-way-match` |
| `MatchEvaluation` | `./services/three-way-match` |
| `ResolvedConversion` | `./services/uom-conversion` |
| `ConversionResult` | `./services/uom-conversion` |
| `DepreciationPeriodResult` | `./services/depreciation-engine` |
| `DepreciationScheduleResult` | `./services/depreciation-engine` |
| `RecognitionLineResult` | `./services/revenue-recognition` |
| `RecognitionScheduleResult` | `./services/revenue-recognition` |
| `BudgetCheckResult` | `./services/budget-enforcement` |
| `ReceiptLineInput` | `./services/landed-cost-engine` |
| `LandedCostLineAllocation` | `./services/landed-cost-engine` |
| `LandedCostAllocationResult` | `./services/landed-cost-engine` |
| `AffectedMovement` | `./services/lot-recall` |
| `RecallTraceResult` | `./services/lot-recall` |
| `IntercompanyPairResult` | `./services/intercompany` |
| `EliminationEntry` | `./services/intercompany` |
| `StatementLineForMatch` | `./services/bank-reconciliation` |
| `MatchCandidate` | `./services/bank-reconciliation` |
| `AutoMatchResult` | `./services/bank-reconciliation` |
| `WipMovementType` | `./services/manufacturing-engine` |
| `BomExplosionLine` | `./services/manufacturing-engine` |
| `BomExplosionResult` | `./services/manufacturing-engine` |
| `CostRollupResult` | `./services/manufacturing-engine` |
| `WipJournalSpec` | `./services/manufacturing-engine` |
| `WipJournalEntry` | `./services/manufacturing-engine` |

---

## 6. Dependencies

### Internal (workspace)

- `afena-canon`
- `afena-database`
- `afena-eslint-config`
- `afena-logger`
- `afena-typescript-config`
- `afena-vitest-config`
- `afena-workflow`

### External

| Package | Version |
| ------- | ------- |
| `drizzle-orm` | `^0.44.0` |
| `fast-json-patch` | `catalog:` |

---

## 7. Invariants

- `INVARIANT-07`
- `INVARIANT-GOVERNORS`
- `INVARIANT-LIFECYCLE`
- `INVARIANT-POLICY`
- `INVARIANT-RL`
- `K-01`
- `K-02`
- `K-03`
- `K-04`
- `K-05`
- `K-10`
- `K-11`
- `K-12`
- `K-13`
- `K-15`

---

## Design Patterns Detected

- **Factory**
- **Observer**
- **Registry**

---

## Cross-References

- [`business.logic.architecture.md`](./business.logic.architecture.md)
- [`database.architecture.md`](./database.architecture.md)
