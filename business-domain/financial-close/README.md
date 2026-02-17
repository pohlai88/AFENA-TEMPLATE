# Financial Close Package

Automated month-end, quarter-end, and year-end close process management with
task tracking, approvals, and analytics.

## Features

- **Close Calendar**: Define close schedules, tasks, and dependencies
- **Task Management**: Track close tasks with owners, due dates, and completions
- **Reconciliations**: Automated reconciliation workflows with variance analysis
- **Approvals**: Close checklist approvals with sign-off tracking
- **Analytics**: Close cycle time, bottleneck analysis, and trends

## Dependencies

- `afenda-canon` - Core types and utilities
- `afenda-database` - Database access
- `zod` - Runtime validation

## Usage

```typescript
import {
    approveClosePeriod,
    assignCloseTask,
    createCloseCalendar,
    getCloseMetrics,
    submitReconciliation,
} from "afenda-financial-close";
```

## Services

1. **Close Calendar**: Period close schedule and task templates
2. **Task Management**: Close task assignment and tracking
3. **Reconciliations**: Account reconciliation workflows
4. **Approvals**: Close sign-off and approval chains
5. **Analytics**: Close performance metrics and dashboards
