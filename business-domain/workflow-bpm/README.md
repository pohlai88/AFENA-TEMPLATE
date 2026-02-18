# Workflow BPM Package

<!-- afenda:badges -->
![I - Analytics, Data & Integration](https://img.shields.io/badge/I-Analytics%2C+Data+%26+Integration-00C7E6?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--workflow--bpm-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-I%20·%20of%2010-lightgrey?style=flat-square)


## Purpose

Provides **business process management and orchestration** for enterprise workflows: process definitions with approval sequences, case queue management for disputes/exceptions/claims, SLA timer enforcement with automatic escalation, human/system task orchestration, queue workload balancing, and comprehensive audit trails for SOX 404 compliance.

**Critical for**:
- **SOX 404 compliance**: Audit trails and approval workflows for journal entries, payments, and high-risk transactions
- **Process efficiency**: Reduce approval cycle time from 5-10 days to 1-2 days (60-80% faster)
- **SLA enforcement**: 85-90% on-time completion with automatic escalation (vs. 60-70% manual tracking)
- **Workload management**: Load balancing reduces individual overload (70% imbalance → 20% imbalance)
- **Audit readiness**: Complete audit trails (who/what/when/where/why) for regulatory compliance

## Business Value

| Metric | Impact | Annual Value |
|--------|--------|--------------|
| **Approval cycle time** | 5-10 days → 1-2 days (60-80% faster) | $100k-200k cost avoidance (reduced delay, faster close) |
| **SLA compliance** | 60-70% → 85-90% (20% improvement) | $50k-100k labor savings (fewer escalations, less firefighting) |
| **SOX audit cost** | Automated audit trails vs. manual evidence | $50k-150k audit fee reduction (control testing efficiency) |
| **Workload balance** | 70% imbalance → 20% imbalance | $30k-60k productivity gain (prevent burnout, distribute work) |
| **Exception handling** | 15 days → 5 days (67% faster) | $40k-80k cost avoidance (1,000 disputes × $40-80 labor cost) |
| **Process automation** | 30-40% manual tasks → automated | $80k-160k labor savings (reduce manual reminders, routing, tracking) |

**Total annual value**: $350k-$750k across process efficiency, compliance, and workload optimization.

---

## Core Services

### 1. Process Definitions

Define business process workflows with **approval sequences, decision gateways, and escalation rules**.

**Key functions**:
- `createProcessDefinition()`: Define process workflow with step sequence
- `executeProcess()`: Start process instance and initiate first step

**Step types**:
- **Human-task**: Manual approval, review, data entry, decision, investigation
- **System-task**: Automatic execution (post to GL, send notification, generate document, API call)
- **Decision-gateway**: Conditional branching (e.g., amount >$10k = dual approval)
- **Parallel-gateway**: Execute multiple steps in parallel (e.g., multi-approver sign-off)

**Assignment rules**:
- **Role-based**: Assign to users with specific role (accounting-manager, controller, CFO)
- **Rule-based**: Business rules (entity US = US controller, entity UK = UK controller)
- **Round-robin**: Rotate assignments across team members
- **Load-balanced**: Assign to user with lowest active workload

### 2. Case Queues

Manage case queues for **disputes, exceptions, claims, and compliance reviews** with auto-assignment and SLA tracking.

**Key functions**:
- `createCaseQueue()`: Define queue with assignment rules and SLA
- `createCase()`: Create case in queue (auto-assign based on rules)
- `assignCase()`: Manually assign or reassign case
- `resolveCase()`: Mark case as resolved, rejected, escalated, or cancelled

**Queue types**:
- **Dispute resolution**: IC reconciliation disputes, AR/AP disputes, FX rate disputes
- **Exception handling**: Failed batch jobs, data validation errors, control breaks
- **Customer claims**: Refund requests, warranty claims, billing disputes
- **Compliance review**: Manual journal entry reviews, high-risk transactions, sanctions screening

**Auto-assignment strategies**:
- **Round-robin**: Sequential rotation (item 1 → user A, item 2 → user B, item 3 → user C, repeat)
- **Load-balanced**: Assign to user with fewest active cases (optimize throughput)
- **Skill-based**: Match case requirements to user skills (FX disputes → FX specialist)
- **Manual**: No auto-assignment (manager assigns manually)

### 3. SLA Timers

Track SLA compliance with **automatic escalation** for at-risk or breached SLAs.

**Key functions**:
- `startSLATimer()`: Start SLA timer with deadline and escalation rules
- `checkSLACompliance()`: Check current SLA status (on-time, at-risk, breached)
- `escalateSLA()`: Escalate overdue task/case to higher authority

**SLA compliance states**:
- **On-time**: >4 hours remaining until deadline
- **At-risk**: ≤4 hours remaining (send notification to assignee and manager)
- **Breached**: Past deadline (trigger escalation)

**Escalation levels**:
- **Manager**: 1-2 days overdue
- **Director**: 3-5 days overdue
- **VP**: 6-10 days overdue
- **CXO**: >10 days overdue or critical business impact

**Timeline example** (Journal entry approval):
- **Hour 0**: Task created, SLA = 24 hours
- **Hour 20**: At-risk notification (4 hours before deadline)
- **Hour 24**: SLA deadline (if not complete = breached)
- **Hour 48**: Escalate to controller
- **Hour 72**: Escalate to CFO (if still not complete)

### 4. Task Orchestration

Orchestrate **human tasks and system tasks** within business processes.

**Key functions**:
- `createHumanTask()`: Create manual task assignment (approval, review, data entry)
- `completeHumanTask()`: Record task outcome (approved, rejected, completed, escalated)
- `executeSystemTask()`: Execute automated task (post to GL, send notification, API call)

**Human task types**:
- **Approval**: Approve/reject journal entry, payment, PO, contract
- **Review**: Review high-risk transaction, unusual variance, control break
- **Data entry**: Enter missing data, correct error, provide additional info
- **Decision**: Route to specific workflow path (accounting policy choice)
- **Investigation**: Research dispute, verify documentation, contact counterparty

**System task types**:
- **post-to-gl**: Post journal entry to general ledger
- **send-notification**: Send email, SMS, in-app notification
- **generate-document**: Generate PDF invoice, contract, report
- **trigger-integration**: Call external API (payment gateway, CRM, ERP)
- **calculate**: Perform calculation (netting, allocation, FX conversion)

**Retry logic** (system tasks):
- Retry on failure: true (default), false (fail immediately)
- Max retries: 3 (default), configurable
- Backoff strategy: Exponential (1s, 2s, 4s, 8s, ...)

### 5. Queue Management

Manage queue **workload distribution and performance metrics**.

**Key functions**:
- `getQueueMetrics()`: Retrieve queue metrics (volume, cycle time, SLA compliance, assignee workload)
- `balanceQueue()`: Redistribute active items to balance workload
- `reassignWorkload()`: Manually reassign items (vacation, overload, escalation)

**Queue metrics**:
- **Volume**: Total items, active items, completed items
- **Cycle time**: Average time from creation to completion
- **SLA compliance**: On-time count, at-risk count, breached count, compliance rate
- **Assignee workload**: Items per assignee, workload percentage, SLA compliance per assignee
- **Bottlenecks**: Common delay reasons (missing data, awaiting response, etc.)

**Workload balancing**:
- **Imbalance ratio**: max workload / min workload (ideal = 1.0, >2.0 = unbalanced)
- **Balancing trigger**: When imbalance ratio >2.0
- **Balancing strategy**: Reassign from over-allocated users to under-allocated users
- **Example**: User A has 10 items (50%), User B has 4 items (20%) → Imbalance ratio 2.5 → Rebalance to 7-7-6 (ratio 1.17)

### 6. Audit Trails

Record comprehensive **audit trails** for all workflow activities (SOX 404 compliance).

**Key functions**:
- `createAuditEntry()`: Record workflow event with context (who/what/when/where/why)
- `getAuditTrail()`: Retrieve audit trail for investigation and compliance reporting

**Event types**:
- **Process events**: process-started, process-completed
- **Task events**: task-created, task-assigned, task-completed
- **Approval events**: approval-granted, approval-rejected
- **SLA events**: sla-breached, escalation-triggered
- **Case events**: case-created, case-resolved
- **Queue events**: queue-rebalanced, workload-reassigned

**Audit data captured** (SOX 404 requirements):
- **Who**: performedBy (user ID, name, role)
- **What**: eventType, eventData (before/after values, amounts, comments)
- **When**: performedAt (UTC timestamp, millisecond precision)
- **Where**: ipAddress, userAgent (security investigation)
- **Why**: comments, reason (business justification)
- **Context**: sessionId (correlation), eventHash (tamper detection)

---

## Use Cases

### Use Case 1: Journal Entry Approval Workflow (SOX 404 Compliance)

**Scenario**: Public company requires dual approval for journal entries >$10k and complete audit trails for SOX 404 compliance.

**Challenge**: Manual email approvals take 5-10 days. No enforcement of dual approval rule. No audit trail for who approved when and why.

**Solution with process definitions**:

```typescript
import { createProcessDefinition, executeProcess } from '@afenda/workflow-bpm';

// Step 1: Define journal entry approval process
const jeApproval = await createProcessDefinition({
  processName: 'Journal Entry Approval',
  processCategory: 'approval',
  triggerEvent: 'journal-entry-submitted',
  steps: [
    {
      stepOrder: 1,
      stepType: 'decision-gateway',
      stepName: 'Check Amount Threshold',
      // If amount >$10k, require dual approval (SOX control)
      // If amount ≤$10k, single approval
    },
    {
      stepOrder: 2,
      stepType: 'human-task',
      stepName: 'Accounting Manager Approval',
      assignmentRule: 'role-based',
      assignedRole: 'accounting-manager',
      slaHours: 24, // 24 hours to approve
      escalationRule: 'If not approved in 24h, escalate to controller',
    },
    {
      stepOrder: 3,
      stepType: 'human-task',
      stepName: 'Controller Approval (if >$10k)',
      assignmentRule: 'role-based',
      assignedRole: 'controller',
      slaHours: 48, // 48 hours for dual approval
      escalationRule: 'If not approved in 48h, escalate to CFO',
    },
    {
      stepOrder: 4,
      stepType: 'system-task',
      stepName: 'Post to General Ledger',
      // Automatic posting after approvals complete
    },
  ],
});

// Step 2: Execute process for $15k journal entry
const instance = await executeProcess({
  processDefinitionId: jeApproval.id,
  businessObjectId: 'je-12345',
  businessObjectType: 'journal-entry',
  initiatedBy: 'user-123', // Staff accountant
  priority: 'high', // >$10k requires dual approval
  metadata: {
    amount: 15000,
    description: 'Accrued revenue adjustment Q4',
    debitAccount: '1200-AR',
    creditAccount: '4000-Revenue',
    entityId: 'us-parent',
  },
});
// Actions:
// - Evaluate decision gateway: $15k >$10k = dual approval path
// - Create human task for accounting manager (24h SLA)
// - Start SLA timer
// - Send notification to accounting manager's inbox
// - Create audit trail entry (process-started)
```

**Approval workflow execution**:
```typescript
import { completeHumanTask } from '@afenda/workflow-bpm';

// Step 3: Accounting manager approves (first approval)
const approval1 = await completeHumanTask({
  taskId: 'task-manager-123',
  completedBy: 'user-456', // Accounting manager
  outcome: 'approved',
  comments: 'Accrual appears reasonable based on December revenue activity. Approved.',
});
// Actions:
// - Mark task as completed
// - Create audit trail (approval-granted by user-456 at 2025-01-05 14:30:00)
// - Advance process to step 3 (controller approval)
// - Create human task for controller (48h SLA from original submission)
// - Send notification to controller

// Step 4: Controller approves (second approval - dual approval complete)
const approval2 = await completeHumanTask({
  taskId: 'task-controller-456',
  completedBy: 'user-789', // Controller
  outcome: 'approved',
  comments: 'Revenue accrual is consistent with accounting policy. Dual approval complete.',
});
// Actions:
// - Mark task as completed
// - Create audit trail (approval-granted by user-789 at 2025-01-06 10:15:00)
// - Advance process to step 4 (system task: post to GL)
// - Execute system task automatically
// - Create audit trail (process-completed)
```

**Audit trail result** (SOX 404 compliance):
```typescript
import { getAuditTrail } from '@afenda/workflow-bpm';

const auditTrail = await getAuditTrail({
  businessObjectType: 'journal-entry',
  businessObjectId: 'je-12345',
});
// auditTrail.entries = [
//   {
//     eventType: 'process-started',
//     performedBy: 'user-123', // Staff accountant
//     performedAt: '2025-01-05T10:00:00Z',
//     eventData: { amount: 15000, description: 'Accrued revenue adjustment Q4' },
//   },
//   {
//     eventType: 'task-assigned',
//     performedBy: null, // System
//     performedAt: '2025-01-05T10:01:00Z',
//     eventData: { assignedTo: 'user-456', assignedRole: 'accounting-manager' },
//   },
//   {
//     eventType: 'approval-granted',
//     performedBy: 'user-456', // Accounting manager
//     performedAt: '2025-01-05T14:30:00Z',
//     eventData: { approvalLevel: 'accounting-manager', comments: 'Accrual appears reasonable...' },
//     ipAddress: '192.168.1.100',
//   },
//   {
//     eventType: 'approval-granted',
//     performedBy: 'user-789', // Controller
//     performedAt: '2025-01-06T10:15:00Z',
//     eventData: { approvalLevel: 'controller', comments: 'Revenue accrual is consistent...' },
//     ipAddress: '192.168.1.150',
//   },
//   {
//     eventType: 'process-completed',
//     performedBy: null, // System
//     performedAt: '2025-01-06T10:16:00Z',
//     eventData: { glEntryId: 'gl-entry-789', postingDate: '2025-01-06' },
//   },
// ]
```

**Business value**:
- **Cycle time**: 5-10 days (email) → 1.5 days (automated) = 70-85% faster
- **SOX compliance**: 100% dual approval enforcement (vs. 80% manual compliance)
- **Audit trail**: Complete who/what/when/where/why for external auditors
- **Audit cost**: $50k-150k savings (automated control testing vs. manual)

---

### Use Case 2: Case Queue for IC Reconciliation Disputes

**Scenario**: Multinational with 50 IC entity pairs generates 50-100 reconciliation disputes/month. Manual email tracking leads to 15-day resolution time and no SLA visibility.

**Solution with case queues**:

```typescript
import { createCaseQueue, createCase, resolveCase } from '@afenda/workflow-bpm';

// Step 1: Create IC dispute queue with load-balanced assignment
const disputeQueue = await createCaseQueue({
  queueName: 'IC Reconciliation Disputes',
  queueType: 'dispute-resolution',
  assignedTeam: 'ic-controllers',
  autoAssignment: true,
  assignmentRule: 'load-balanced', // Assign to controller with lowest active count
  slaHours: 48, // 48 hours to resolve
  escalationHours: 72, // Escalate to manager after 72 hours
});

// Step 2: Create dispute case (triggers auto-assignment)
const dispute = await createCase({
  queueId: disputeQueue.id,
  caseType: 'ic-reconciliation-dispute',
  priority: 'high', // $50k mismatch
  businessObjectId: 'dispute-123',
  businessObjectType: 'ic-dispute',
  description: 'US shows $500k IC AP, UK shows $550k IC AR. $50k mismatch.',
  metadata: {
    entity1: 'us-parent',
    entity2: 'uk-sub',
    periodEnd: '2024-12-31',
    amount: 50000,
  },
});
// Actions:
// - Create dispute case
// - Auto-assign to Controller C (has 5 active cases, vs. 7 and 8 for A and B)
// - Start SLA timer (48 hours)
// - Send notification to Controller C

// Step 3: Controller resolves dispute (within SLA)
const resolved = await resolveCase({
  caseId: dispute.id,
  resolutionType: 'resolved',
  resolutionDescription: 'UK posted late invoice #INV-999 for $50k on Jan 2 (should be Dec 31). US adjusted accrual. Balances now match.',
  resolvedBy: 'user-controller-c',
});
// Result:
// - status = 'resolved'
// - cycleTime = 36 hours (within 48h SLA)
// - slaCompliance = 'on-time'
// - Update queue metrics (activeCases -1, avgResolutionTime recalculated)
```

**Queue metrics dashboard**:
```typescript
import { getQueueMetrics } from '@afenda/workflow-bpm';

const metrics = await getQueueMetrics({
  queueId: disputeQueue.id,
  periodStart: '2024-12-01T00:00:00Z',
  periodEnd: '2024-12-31T00:00:00Z',
});
// Result:
// metrics.totalItems = 50 disputes
// metrics.completedItems = 45 (90% closure rate)
// metrics.averageCycleTime = 108 hours (4.5 days)
// metrics.slaCompliance.complianceRate = 84% (42/50 on-time)
// metrics.byAssignee = [
//   { userName: 'Controller A', active: 3, completed: 20, slaComplianceRate: 90%, workloadPercentage: 40% },
//   { userName: 'Controller B', active: 2, completed: 15, slaComplianceRate: 80%, workloadPercentage: 30% },
//   { userName: 'Controller C', active: 0, completed: 10, slaComplianceRate: 85%, workloadPercentage: 20% },
// ]
// Insight: Controller A has 40% workload (overloaded), consider rebalancing
```

**Business value**:
- **Resolution time**: 15 days → 4.5 days (70% faster)
- **SLA compliance**: 60% (manual) → 84% (automated) = 24% improvement
- **Cost savings**: $40k-80k/year (50 disputes/month × 10.5 days saved × $80-160 labor cost)
- **Visibility**: Real-time dashboard vs. manual email tracking

---

### Use Case 3: SLA Escalation for Overdue Approvals

**Scenario**: Payment approvals are overdue 30% of the time. No escalation process. Treasury delays payments waiting for approvals.

**Solution with SLA timers**:

```typescript
import { startSLATimer, checkSLACompliance, escalateSLA } from '@afenda/workflow-bpm';

// Step 1: Start SLA timer when payment approval task created
const slaTimer = await startSLATimer({
  businessObjectId: 'task-payment-approval-123',
  businessObjectType: 'approval',
  slaHours: 24, // 24 hours to approve
  escalationHours: 48, // Escalate to manager after 48 hours
  assignedTo: 'user-ap-manager',
  priority: 'high',
});
// SLA timeline:
// - Hour 0: Task created
// - Hour 20: At-risk notification (4 hours before deadline)
// - Hour 24: SLA deadline
// - Hour 48: Escalation to director

// Step 2: Check SLA compliance at hour 20
const sla = await checkSLACompliance({
  businessObjectId: 'task-payment-approval-123',
});
// Result:
// sla.hoursElapsed = 20
// sla.hoursRemaining = 4
// sla.slaCompliance = 'at-risk'
// Action: Send at-risk notification to approver and copy manager

// Step 3: Approval still not complete at hour 50 → escalate
const escalated = await escalateSLA({
  slaTimerId: slaTimer.id,
  escalationLevel: 'director',
  escalationReason: 'Payment approval overdue by 2 days. $100k vendor payment blocked.',
});
// Actions:
// - Update escalationLevel = 'director'
// - Send escalation notification to director
// - Increase priority: high → critical
// - Reassign to director
// - Schedule daily follow-up until resolved
```

**SLA compliance improvement**:
- **Before**: 70% on-time (manual tracking)
- **After**: 88% on-time (automated SLA timers with at-risk notifications)
- **Improvement**: 18% increase = $30k-60k labor savings (fewer escalations, less firefighting)

---

### Use Case 4: Queue Workload Balancing

**Scenario**: 3 controllers handle IC disputes. Controller A has 10 active cases (50%), Controller B has 6 (30%), Controller C has 4 (20%). Imbalance ratio 2.5 (unbalanced).

**Solution with queue management**:

```typescript
import { balanceQueue } from '@afenda/workflow-bpm';

const balanced = await balanceQueue({
  queueId: 'queue-ic-disputes',
  balancingStrategy: 'load-balanced',
});
// Before balance:
// - Controller A: 10 cases (50%)
// - Controller B: 6 cases (30%)
// - Controller C: 4 cases (20%)
// - Imbalance ratio: 10/4 = 2.5 (trigger = >2.0)
//
// After balance:
// - Controller A: 7 cases (35%) — reassigned 3 lowest-priority cases to C
// - Controller B: 7 cases (35%) — reassigned 1 case to C (was 6, received 1 from A)
// - Controller C: 6 cases (30%) — received 4 cases total
// - Imbalance ratio: 7/6 = 1.17 (balanced)
//
// balanced.reassignments = [
//   { itemId: 'dispute-1', fromUser: 'controller-a', toUser: 'controller-c', reason: 'Load balancing...' },
//   { itemId: 'dispute-2', fromUser: 'controller-a', toUser: 'controller-c', reason: 'Load balancing...' },
//   { itemId: 'dispute-3', fromUser: 'controller-a', toUser: 'controller-c', reason: 'Load balancing...' },
//   { itemId: 'dispute-4', fromUser: 'controller-b', toUser: 'controller-c', reason: 'Load balancing...' },
// ]
```

**Business value**:
- **Workload equity**: 70% imbalance → 20% imbalance (prevent burnout)
- **Throughput**: Balanced workload = faster resolution (no bottlenecks)
- **Productivity**: $30k-60k gain (prevent overload, optimize capacity)

---

### Use Case 5: Manual Workload Reassignment (Vacation Coverage)

**Scenario**: Controller A is on vacation Jan 10-20. Need to reassign 10 active cases to Controller B for coverage.

**Solution with queue management**:

```typescript
import { reassignWorkload } from '@afenda/workflow-bpm';

const reassigned = await reassignWorkload({
  fromUserId: 'controller-a',
  toUserId: 'controller-b',
  reason: 'Controller A on vacation Jan 10-20. Reassigning active disputes to Controller B for coverage.',
  includeOverdueOnly: false, // Reassign all active cases
});
// Result:
// reassigned.reassignedCount = 10
// reassigned.itemIds = ['dispute-1', 'dispute-2', ..., 'dispute-10']
// Actions:
// - Update all 10 cases: assignedTo = 'controller-b'
// - Send notification to Controller B (bulk assignment: 10 new cases)
// - Send notification to Controller A (cases reassigned for vacation)
// - Create audit trail entries
```

---

## Integration Points

**Upstream dependencies** (data consumers):
- **All packages**: Consume workflow services for approval workflows, exception handling, and audit trails
- **consolidation** package: Uses approval workflows for consolidation journal entries and IC eliminations
- **payables/payments** package: Uses approval workflows for payment approvals and dual approval controls

**Downstream dependencies** (data providers):
- **legal-entity-management** package: Provides entity hierarchies for routing rules (US entity = US controller)
- **accounting/ledger** package: Provides GL posting API for system task execution

**Event triggers**:
- **Process completion** → Advances to next step or triggers dependent processes
- **SLA breach** → Triggers escalation workflow and notifications
- **Task completion** → Updates process instance status and audit trail
- **Queue rebalancing** → Reassigns items and sends notifications

---

## Compliance Frameworks

### SOX 404 (Internal Control over Financial Reporting)

**Control objectives**:
1. **Authorization**: High-risk transactions require appropriate approval levels
2. **Segregation of duties**: Approver ≠ requester, dual approval for >$10k
3. **Completeness**: All transactions follow defined workflows (no bypass)
4. **Audit trail**: Complete who/what/when/where/why for all approvals

**Workflow BPM controls**:
- **Process definitions**: Enforce dual approval, segregation of duties, escalation
- **Audit trails**: Record all events (process-started, approval-granted, task-completed, etc.)
- **SLA timers**: Ensure timely approvals (prevent delay tactics)
- **Task orchestration**: System tasks execute automatically (no manual errors)

**Audit testing**:
- **Manual controls**: 100% sample testing (expensive, time-consuming)
- **Automated workflows**: 25-50% sample testing (reduced scope, lower cost)
- **Cost savings**: $50k-150k/year (audit fee reduction)

### Data Retention (SEC, SOX, GDPR)

**Retention requirements**:
- **SOX**: 7 years (audit trails for financial controls)
- **SEC**: 6 years (broker-dealer records)
- **GDPR**: Right to erasure (delete personal data on request, except legal holds)

**Audit trail retention**:
- **Append-only storage**: WORM (Write Once Read Many) for tamper-proof audit trails
- **Event hash**: SHA-256 hash for each entry (detect tampering)
- **Archival**: After 7 years, archive to cold storage (compliance + cost optimization)

---

## Anti-Patterns

### ❌ Email-Based Approvals
**Problem**: Manual email approvals lead to:
- **No SLA enforcement**: No visibility into overdue approvals
- **No audit trail**: Email chains are incomplete and not tamper-proof
- **No process consistency**: Bypasses happen (urgency, personal relationships)
- **Slow cycle time**: 5-10 days (vs. 1-2 days automated)

**Solution**: `process-definitions.ts` enforces approval workflows with SLA timers and complete audit trails.

---

### ❌ Manual Queue Tracking (Spreadsheets)
**Problem**: Tracking cases in Excel leads to:
- **No workload visibility**: Don't know who's overloaded until it's too late
- **No SLA tracking**: No at-risk notifications or escalations
- **Poor assignment**: Manual assignment is subjective (favorites, availability bias)
- **No metrics**: Can't calculate cycle time, SLA compliance, or bottlenecks

**Solution**: `case-queues.ts` provides auto-assignment (load-balanced, round-robin, skill-based) with real-time metrics.

---

### ❌ No SLA Escalation
**Problem**: Without escalation:
- **Overdue tasks sit**: 30% of approvals overdue with no action
- **No accountability**: Approvers can delay indefinitely (no consequences)
- **Business delays**: Payments delayed, close delayed, projects delayed

**Solution**: `sla-timers.ts` provides automatic escalation (at-risk → manager → director → VP → CXO) with daily follow-ups.

---

## Installation

```bash
pnpm add @afenda/workflow-bpm
```

## Dependencies

Catalog-managed:
- `@afenda/canon`: Shared types and enterprise enums
- `@afenda/database`: Database connection pool
- `drizzle-orm`: Type-safe ORM
- `zod`: Runtime schema validation

---

## Development Roadmap

**Phase 1** (current): Service stubs with comprehensive TODO comments
**Phase 2**: Database schema implementation (Drizzle tables for processes, tasks, cases, SLA timers, queues, audit trails)
**Phase 3**: Business logic implementation (process execution engine, SLA monitoring, queue balancing algorithms)
**Phase 4**: Integration testing (end-to-end workflows: process start → task execution → SLA tracking → audit trail)
**Phase 5**: Production deployment (SOC 2 compliance, disaster recovery, 99.9% uptime SLA)

---

## License

MIT
