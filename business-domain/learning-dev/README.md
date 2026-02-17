# @afenda-learning-dev

Enterprise learning and development management.

## Purpose

Layer 2 domain package providing training programs, certification tracking,
career path planning, skill assessments, and learning analytics.

## Architecture

- **Layer:** 2 (Domain Services)
- **Dependencies:** afenda-canon (Layer 1), afenda-database (Layer 1)
- **Consumers:** HCM application layer
- **Pattern:** Pure domain functions, no logging, Zod validation

## Services

### training.ts

- `enrollInTraining` - Enroll employee in training course
- `completeTraining` - Mark training as completed

### certifications.ts

- `awardCertification` - Award certification to employee
- `trackCertificationExpiry` - Monitor expiring certifications

### career-paths.ts

- `createCareerPath` - Define career progression path
- `assessPathProgress` - Evaluate career path progress

### skill-assessments.ts

- `conductAssessment` - Conduct skill assessment
- `identifySkillGaps` - Identify skill gaps

### learning-analytics.ts

- `analyzeTrainingEffectiveness` - Analyze training ROI
- `trackLearningProgress` - Track learning completion rates

## Usage

```typescript
import { enrollInTraining } from "afenda-learning-dev";

const result = await enrollInTraining(db, orgId, {
  employeeId: "emp-123",
  courseId: "course-leadership-101",
  enrollmentDate: new Date(),
});
```

## Business Value

- Structured employee development programs
- Compliance certification tracking
- Skill gap analysis and remediation
- Career path visualization
- Training effectiveness measurement
