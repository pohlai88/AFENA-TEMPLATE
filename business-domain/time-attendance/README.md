# @afenda-time-attendance

Enterprise time tracking and attendance management.

## Purpose

Layer 2 domain package providing timesheet management, PTO tracking, overtime
calculation, shift scheduling, and attendance analytics.

## Architecture

- **Layer:** 2 (Domain Services)
- **Dependencies:** afenda-canon (Layer 1), afenda-database (Layer 1)
- **Consumers:** HCM application layer
- **Pattern:** Pure domain functions, no logging, Zod validation

## Services

### timesheets.ts

- `submitTimesheet` - Submit employee timesheet
- `approveTimesheet` - Approve submitted timesheet

### pto.ts

- `requestPTO` - Request paid time off
- `approvePTO` - Approve PTO request

### overtime.ts

- `calculateOvertime` - Calculate overtime hours and pay
- `trackOvertimeLimits` - Monitor overtime compliance

### shift-management.ts

- `scheduleShift` - Schedule employee shift
- `swapShift` - Process shift swap request

### attendance-analytics.ts

- `analyzeAttendance` - Analyze attendance patterns
- `calculateAbsenteeism` - Calculate absenteeism rate

## Usage

```typescript
import { submitTimesheet } from 'afenda-time-attendance';

const result = await submitTimesheet(db, orgId, {
  employeeId: 'emp-123',
  periodStart: new Date('2026-02-10'),
  periodEnd: new Date('2026-02-16'),
  entries: [{ date: new Date('2026-02-10'), hoursWorked: 8 }],
});
```

## Business Value

- Accurate time tracking for payroll
- Automated overtime calculation
- PTO accrual and balance management
- Shift scheduling optimization
- Attendance compliance monitoring
