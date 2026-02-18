import { z } from 'zod';

// Enums
export enum AuditType {
  QUALITY = 'QUALITY',
  HEALTH_SAFETY = 'HEALTH_SAFETY',
  BRAND_STANDARDS = 'BRAND_STANDARDS',
  OPERATIONAL = 'OPERATIONAL',
  FINANCIAL = 'FINANCIAL',
  MYSTERY_SHOPPER = 'MYSTERY_SHOPPER',
}

export enum AuditStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum AuditResult {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  SATISFACTORY = 'SATISFACTORY',
  NEEDS_IMPROVEMENT = 'NEEDS_IMPROVEMENT',
  CRITICAL_FAILURE = 'CRITICAL_FAILURE',
}

export enum FindingSeverity {
  CRITICAL = 'CRITICAL',
  MAJOR = 'MAJOR',
  MINOR = 'MINOR',
  OBSERVATION = 'OBSERVATION',
}

export enum ActionStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  VERIFIED = 'VERIFIED',
  OVERDUE = 'OVERDUE',
}

export enum CIPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

// Schemas
export const outletAuditSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  outletId: z.string().uuid(),
  auditType: z.nativeEnum(AuditType),
  auditDate: z.coerce.date(),
  auditorId: z.string().uuid(),
  status: z.nativeEnum(AuditStatus),
  overallScore: z.number().min(0).max(100).optional(),
  result: z.nativeEnum(AuditResult).optional(),
  completedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date(),
});

export const auditCategorySchema = z.object({
  id: z.string().uuid(),
  auditId: z.string().uuid(),
  categoryName: z.string(),
  weight: z.number().min(0).max(100),
  score: z.number().min(0).max(100).optional(),
  maxScore: z.number(),
  notes: z.string().optional(),
});

export const auditFindingSchema = z.object({
  id: z.string().uuid(),
  auditId: z.string().uuid(),
  categoryId: z.string().uuid().optional(),
  severity: z.nativeEnum(FindingSeverity),
  description: z.string(),
  evidence: z.array(z.string()).optional(), // Photo URLs
  location: z.string().optional(),
  isRecurring: z.boolean(),
  createdAt: z.coerce.date(),
});

export const correctiveActionSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  findingId: z.string().uuid(),
  outletId: z.string().uuid(),
  actionDescription: z.string(),
  assignedTo: z.string().uuid(),
  dueDate: z.coerce.date(),
  status: z.nativeEnum(ActionStatus),
  completedDate: z.coerce.date().optional(),
  verifiedDate: z.coerce.date().optional(),
  verifiedBy: z.string().uuid().optional(),
  notes: z.string().optional(),
  createdAt: z.coerce.date(),
});

export const continuousImprovementSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  outletId: z.string().uuid().optional(), // Optional for system-wide initiatives
  initiativeName: z.string(),
  description: z.string(),
  priority: z.nativeEnum(CIPriority),
  targetMetric: z.string(),
  baselineValue: z.number(),
  targetValue: z.number(),
  currentValue: z.number().optional(),
  startDate: z.coerce.date(),
  targetDate: z.coerce.date(),
  status: z.string(),
  createdAt: z.coerce.date(),
});

export const auditScheduleSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  outletId: z.string().uuid(),
  auditType: z.nativeEnum(AuditType),
  frequency: z.enum(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL']),
  nextScheduledDate: z.coerce.date(),
  lastCompletedDate: z.coerce.date().optional(),
  isActive: z.boolean(),
});

// Types
export type OutletAudit = z.infer<typeof outletAuditSchema>;
export type AuditCategory = z.infer<typeof auditCategorySchema>;
export type AuditFinding = z.infer<typeof auditFindingSchema>;
export type CorrectiveAction = z.infer<typeof correctiveActionSchema>;
export type ContinuousImprovement = z.infer<typeof continuousImprovementSchema>;
export type AuditSchedule = z.infer<typeof auditScheduleSchema>;

// Interfaces
export interface AuditSummary {
  totalAudits: number;
  averageScore: number;
  passRate: number;
  criticalFindings: number;
  openActions: number;
  overdueActions: number;
}

export interface OutletPerformance {
  outletId: string;
  outletName: string;
  latestScore: number;
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  trendPercentage: number;
  rank: number;
  totalAudits: number;
}

export interface CategoryPerformance {
  categoryName: string;
  averageScore: number;
  minScore: number;
  maxScore: number;
  outletsBelow70: number;
}

export interface ActionPlanTracking {
  totalActions: number;
  completed: number;
  inProgress: number;
  overdue: number;
  completionRate: number;
  averageDaysToComplete: number;
}

export interface AuditTrend {
  period: string;
  averageScore: number;
  auditCount: number;
  criticalFindings: number;
}

export interface BenchmarkData {
  metric: string;
  outletValue: number;
  systemAverage: number;
  topQuartile: number;
  variance: number;
}
