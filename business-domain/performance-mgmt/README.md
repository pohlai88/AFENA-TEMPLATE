# @afenda-performance-mgmt

Enterprise performance management and review system.

## Purpose

Layer 2 domain package providing performance reviews, goal management,
competency assessments, 360-degree feedback, and performance analytics.

## Architecture

- **Layer:** 2 (Domain Services)
- **Dependencies:** afenda-canon (Layer 1), afenda-database (Layer 1)
- **Consumers:** HCM application layer
- **Pattern:** Pure domain functions, no logging, Zod validation

## Services

### reviews.ts

- `createPerformanceReview` - Create performance review cycle
- `submitReview` - Submit completed review

### goals.ts

- `setGoal` - Set employee goal
- `trackGoalProgress` - Track goal completion

### competencies.ts

- `assessCompetency` - Assess employee competency
- `defineCompetencyModel` - Define competency framework

### feedback-360.ts

- `initiate360Feedback` - Start 360 feedback process
- `aggregate360Results` - Compile feedback results

### performance-analytics.ts

- `analyzePerformanceDistribution` - Analyze rating distribution
- `identifyHighPerformers` - Identify top performers

## Usage

```typescript
import { setGoal } from 'afenda-performance-mgmt';

const result = await setGoal(db, orgId, {
  employeeId: 'emp-123',
  goalName: 'Increase sales by 20%',
  targetDate: new Date('2026-12-31'),
  measurable: true,
});
```

## Business Value

- Structured performance review processes
- Objective goal tracking and alignment
- Competency-based development
- Multi-rater feedback collection
- Performance trend analysis
