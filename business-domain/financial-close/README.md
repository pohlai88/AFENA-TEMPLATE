# Financial Close Package

<!-- afenda:badges -->
![A - Financial Management](https://img.shields.io/badge/A-Financial+Management-0052CC?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--financial--close-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-A%20·%20of%2010-lightgrey?style=flat-square)


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
} from 'afenda-financial-close';
```

## Services

1. **Close Calendar**: Period close schedule and task templates
2. **Task Management**: Close task assignment and tracking
3. **Reconciliations**: Account reconciliation workflows
4. **Approvals**: Close sign-off and approval chains
5. **Analytics**: Close performance metrics and dashboards
