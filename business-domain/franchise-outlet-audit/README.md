# afenda-franchise-outlet-audit

<!-- afenda:badges -->
![G - Franchise & Retail](https://img.shields.io/badge/G-Franchise+%26+Retail-FF8B00?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--franchise--outlet--audit-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-G%20·%20of%2010-lightgrey?style=flat-square)

Structured outlet inspection, findings tracking, corrective action management, and continuous improvement for franchise networks.

---

## Purpose

`afenda-franchise-outlet-audit` provides the full audit lifecycle for franchise outlets — from scheduling and on-site execution through findings capture, corrective action plans, and PDCA-driven improvement initiatives. It supports six audit types and produces the scored performance data that feeds brand-standard enforcement and franchisee accountability.

## When to Use This Package

Use `afenda-franchise-outlet-audit` when you need to:

- Schedule risk-based audits across a franchise outlet network
- Execute structured inspections with per-category scoring
- Record findings with severity grades and photographic evidence references
- Raise and track corrective action plans through to verified closure
- Identify recurring non-conformances and systemic patterns
- Run PDCA continuous-improvement initiatives with KPI tracking
- Benchmark outlet performance across regions and audit types
- Generate compliance reports and audit calendars

**Do NOT use directly** — import through `afenda-crud`, which adds authorization and audit logging.

---

## Audit Types

| Type | Enum | Focus |
|------|------|-------|
| Quality | `QUALITY` | Product and service quality standards |
| Health & Safety | `HEALTH_SAFETY` | H&S compliance, HACCP, fire safety |
| Brand Standards | `BRAND_STANDARDS` | Visual identity, signage, uniform, VM |
| Operational | `OPERATIONAL` | SOPs, staff training, systems adherence |
| Financial | `FINANCIAL` | POS reconciliation, cash handling, wastage |
| Mystery Shopper | `MYSTERY_SHOPPER` | Anonymous customer experience evaluation |

---

## Scoring & Results

Audits are scored 0–100 across weighted categories. The overall score maps to a result grade:

| Score | Result | Action Required |
|-------|--------|----------------|
| 90–100 | `EXCELLENT` | None |
| 75–89 | `GOOD` | Optional improvement plan |
| 60–74 | `SATISFACTORY` | Mandatory finding resolution |
| 40–59 | `NEEDS_IMPROVEMENT` | Corrective action plan + follow-up audit |
| 0–39 | `CRITICAL_FAILURE` | Escalation + urgent corrective action |

---

## Key Concepts

### Finding Severity

| Severity | Trigger | CAP Deadline |
|----------|---------|--------------|
| `CRITICAL` | Safety risk or legal breach | 24 hours |
| `MAJOR` | Brand or operational failure | 7 days |
| `MINOR` | Deviation from standard | 30 days |
| `OBSERVATION` | Improvement opportunity | 90 days |

### Corrective Action Lifecycle

```
OPEN → IN_PROGRESS → COMPLETED → VERIFIED
                 ↘ OVERDUE → escalateAction()
```

### Continuous Improvement (PDCA)

Improvement initiatives follow a Plan → Do → Check → Act cycle with:
- Baseline KPI capture
- Target KPI definition
- Progress tracking (`updateProgress`)
- ROI calculation on completion (`calculateInitiativeROI`)

### Risk-Based Scheduling

`determineAuditFrequency` adjusts inspection cadence based on prior performance:
- `CRITICAL_FAILURE` → 30-day follow-up
- `NEEDS_IMPROVEMENT` → 90-day cycle
- `GOOD` / `EXCELLENT` → 180-day cycle

---

## Services

### `audit-execution`

Core audit lifecycle management.

| Function | Type | Description |
|----------|------|-------------|
| `createAudit` | async | Create a new outlet audit with `SCHEDULED` status |
| `startAudit` | async | Transition audit to `IN_PROGRESS` |
| `addCategoryScore` | async | Record per-category score and weight |
| `calculateOverallScore` | pure | Weighted average of category scores |
| `determineAuditResult` | pure | Map score to `AuditResult` enum |
| `generateAuditChecklist` | pure | Generate checklist items by `AuditType` |
| `validateAuditCompletion` | pure | Assert all mandatory categories scored |
| `completeAudit` | async | Finalise audit with score, result, timestamp |
| `compareWithPreviousAudit` | async | Delta report against last audit of same type |
| `getOutletAudits` | async | Retrieve audit history with optional date range |

### `findings-management`

Finding capture, severity classification, and pattern detection.

| Function | Type | Description |
|----------|------|-------------|
| `createFinding` | async | Record a finding with evidence references |
| `getAuditFindings` | async | Retrieve findings with optional severity filter |
| `categorizeSeverity` | pure | Classify severity from safety/brand/legal/customer impact flags |
| `prioritizeFindings` | pure | Sort findings by severity and business impact |
| `generateFindingsSummary` | pure | Aggregate finding counts by severity and category |
| `getRecurringFindings` | async | Detect findings appearing across multiple audits |
| `identifyFindingPatterns` | async | Cross-outlet systemic non-conformance analysis |
| `calculateOutletRiskScore` | pure | Composite risk score from open criticals and recurrence |
| `exportFindings` | async | Export finding data for external reporting |

### `corrective-actions`

Action plan creation, assignment, escalation, and verification.

| Function | Type | Description |
|----------|------|-------------|
| `createAction` | async | Open a corrective action linked to a finding |
| `assignAction` | async | Assign responsible party and target date |
| `updateActionStatus` | async | Transition action through its lifecycle |
| `completeAction` | async | Submit completion evidence |
| `verifyAction` | async | Auditor verification of completed action |
| `escalateAction` | async | Escalate overdue actions with notification |
| `getActions` | async | Query actions by finding, status, or assignee |
| `getOverdueActions` | async | Retrieve all actions past target date |
| `calculateCompletionRate` | pure | % of actions closed within deadline |
| `trackActionEffectiveness` | async | Re-occurrence rate after corrective action |
| `generateActionPlanSummary` | pure | Summary dashboard for a finding's CAP |
| `generateActionReport` | async | Full action status report for an outlet |
| `determineActionPriority` | pure | Priority mapping from finding severity |

### `continuous-improvement`

PDCA-driven improvement initiatives with ROI measurement.

| Function | Type | Description |
|----------|------|-------------|
| `createInitiative` | async | Create a CI initiative with baseline and target KPIs |
| `getActiveInitiatives` | async | Retrieve in-flight initiatives by outlet |
| `updateProgress` | async | Record current KPI value and progress notes |
| `calculateImprovement` | pure | `((current - baseline) / baseline) * 100` |
| `prioritizeInitiatives` | pure | Rank initiatives by priority and impact |
| `identifyImprovementOpportunities` | async | Mine audit history for recurring weak areas |
| `completeInitiative` | async | Close initiative with final outcomes |
| `generatePDCAReport` | pure | Full Plan-Do-Check-Act cycle report |
| `calculateInitiativeROI` | pure | Financial return on improvement investment |
| `generateImprovementDashboard` | async | Portfolio view of all CI initiatives |

### `audit-scheduling`

Risk-based scheduling, conflict detection, and calendar generation.

| Function | Type | Description |
|----------|------|-------------|
| `createSchedule` | async | Create a recurring audit schedule for an outlet |
| `getOutletSchedules` | async | Retrieve all schedules for an outlet |
| `getUpcomingAudits` | async | Audits due within N days across all outlets |
| `identifyOverdueAudits` | async | Schedules where `next_audit_date` is in the past |
| `identifySchedulingConflicts` | async | Detect overlapping auditor assignments |
| `determineAuditFrequency` | pure | Calculate frequency days from performance grade |
| `adjustFrequency` | async | Update cadence with change reason |
| `optimizeSchedule` | async | Rebalance auditor workload across outlets |
| `updateScheduleAfterAudit` | async | Advance `next_audit_date` post-completion |
| `generateAuditCalendar` | async | Calendar view of scheduled audits by period |
| `generateScheduleComplianceReport` | async | On-time completion rate by outlet and type |

### `audit-analytics`

Performance intelligence, benchmarking, and trend reporting.

| Function | Type | Description |
|----------|------|-------------|
| `getAuditSummary` | async | Aggregate audit metrics for an outlet and period |
| `getOutletPerformance` | async | Monthly / quarterly / annual performance scorecard |
| `getCategoryPerformance` | async | Cross-outlet comparison by audit category |
| `trackAuditTrends` | async | Score trend line over a rolling 12-month window |
| `benchmarkOutlets` | async | Rank outlets within region / brand against KPIs |
| `generatePerformanceReport` | async | Exportable performance report by outlet |
| `identifyTopPerformers` | async | Outlets with consistent `EXCELLENT` / `GOOD` results |
| `identifyAtRiskOutlets` | async | Outlets trending toward `NEEDS_IMPROVEMENT` |
| `calculateNetworkHealth` | async | Network-wide weighted average score |
| `generateExecutiveDashboard` | async | C-suite view: network health, risk hotspots, trends |

---

## Usage Examples

### Execute an Audit

```typescript
import {
  createAudit, startAudit, addCategoryScore,
  calculateOverallScore, determineAuditResult, completeAudit,
} from 'afenda-franchise-outlet-audit';
import { AuditType } from 'afenda-franchise-outlet-audit';

// 1. Schedule
const audit = await createAudit(db, orgId, {
  outletId: 'outlet-uuid',
  auditType: AuditType.BRAND_STANDARDS,
  auditDate: new Date('2026-03-01'),
  auditorId: 'auditor-uuid',
});

// 2. Start on-site
await startAudit(db, audit.id, 'auditor-uuid');

// 3. Score each category
await addCategoryScore(db, audit.id, { category: 'Signage', score: 88, weight: 0.2 });
await addCategoryScore(db, audit.id, { category: 'Uniform', score: 72, weight: 0.15 });
// ...

// 4. Calculate and complete
const overallScore = calculateOverallScore(categoryScores);
const result = determineAuditResult(overallScore); // e.g. 'GOOD'
await completeAudit(db, audit.id, overallScore);
```

### Record a Finding and Raise a CAP

```typescript
import {
  createFinding, categorizeSeverity,
  createAction, assignAction,
} from 'afenda-franchise-outlet-audit';
import { FindingSeverity } from 'afenda-franchise-outlet-audit';

// Classify on impact flags
const severity = categorizeSeverity('Expired fire extinguisher', {
  safety: true, brand: false, legal: true, customer: false,
}); // → 'CRITICAL'

// Record the finding
const finding = await createFinding(db, audit.id, {
  categoryId: 'cat-uuid',
  severity,
  description: 'Fire extinguisher expired 3 months ago',
  evidenceUrls: ['https://cdn.example.com/photo-001.jpg'],
});

// Raise a corrective action
const action = await createAction(db, {
  findingId: finding.id,
  description: 'Replace fire extinguisher and schedule annual service',
  targetDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 h for CRITICAL
});

await assignAction(db, action.id, 'outlet-manager-uuid', action.targetDate);
```

### Continuous Improvement Initiative

```typescript
import { createInitiative, updateProgress, calculateImprovement } from 'afenda-franchise-outlet-audit';
import { CIPriority } from 'afenda-franchise-outlet-audit';

const initiative = await createInitiative(db, {
  outletId: 'outlet-uuid',
  title: 'Reduce food waste by 20%',
  priority: CIPriority.HIGH,
  baselineKpi: 8.5,    // % waste rate
  targetKpi:  6.8,     // target % waste rate
  startDate:  new Date(),
});

// Weekly progress update
await updateProgress(db, initiative.id, 7.9, 'New FIFO training completed');

const improvement = calculateImprovement(8.5, 7.9); // → 7.06 %
```

---

## Type Reference

| Type | Description |
|------|-------------|
| `OutletAudit` | Top-level audit record with score and result |
| `AuditCategory` | Per-category score and weight within an audit |
| `AuditFinding` | Non-conformance with severity and evidence |
| `CorrectiveAction` | Action plan item linked to a finding |
| `ContinuousImprovement` | PDCA initiative with baseline / target KPIs |
| `AuditSchedule` | Recurring schedule with frequency and next due date |
| `AuditSummary` | Aggregated summary over a time period |
| `OutletPerformance` | Scorecard with period, score, trend direction |
| `CategoryPerformance` | Cross-outlet comparison for one category |
| `AuditTrend` | Monthly score data point for trend charts |
| `BenchmarkData` | Outlet's position relative to network average |
| `ActionPlanTracking` | Completion rate and effectiveness metrics |

---

## Dependencies

| Package | Role |
|---------|------|
| `afenda-canon` | Shared types and utility functions |
| `afenda-database` | Database schema access (Drizzle ORM) |
| `drizzle-orm` | Type-safe SQL query builder |
| `zod` | Runtime schema validation |

---

## Architectural Rules

```typescript
// ✅ Allowed
import type { OutletId } from 'afenda-canon';
import { outletAudits } from 'afenda-database';
import { eq } from 'drizzle-orm';

// ❌ Forbidden — no cross-domain imports
import { getOutlet } from 'afenda-franchisee-operations';

// ❌ Forbidden — no upper-layer imports
import { createAuditRecord } from 'afenda-crud';
```

---

## Related Domains

| Domain | Relationship |
|--------|-------------|
| `franchise-compliance` | Consumes audit results to trigger FDD compliance checks |
| `franchise-development` | Uses outlet performance scores in territory reviews |
| `franchisee-operations` | Franchisee portal surfaces audit results and CAP status |
| `quality-mgmt` | Shares finding severity taxonomy and CAPA workflow patterns |

---

**Package:** `afenda-franchise-outlet-audit`  
**Class:** G — Franchise & Retail  
**Layer:** 2 (Domain Services)  
**Status:** Implementation pending — database integration stubs in place  
**Last Updated:** February 18, 2026
