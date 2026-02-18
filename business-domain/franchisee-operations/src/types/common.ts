import { z } from 'zod';

// Enums
export enum UnitStatus {
  OPENING = 'OPENING',
  OPERATIONAL = 'OPERATIONAL',
  REMODELING = 'REMODELING',
  TEMPORARILY_CLOSED = 'TEMPORARILY_CLOSED',
  CLOSED = 'CLOSED',
}

export enum AuditStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

// Schemas
export const unitPerformanceSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  unitId: z.string().uuid(),
  periodDate: z.coerce.date(),
  sales: z.number(),
  transactions: z.number(),
  traffic: z.number().optional(),
  conversionRate: z.number().optional(),
  averageTicket: z.number().optional(),
  createdAt: z.coerce.date(),
});

export const complianceAuditSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  unitId: z.string().uuid(),
  auditDate: z.coerce.date(),
  status: z.nativeEnum(AuditStatus),
  brandScore: z.number().min(0).max(100).optional(),
  healthScore: z.number().min(0).max(100).optional(),
  findings: z.array(z.string()).optional(),
  actionItems: z.array(z.string()).optional(),
});

export const supportTicketSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  unitId: z.string().uuid(),
  subject: z.string(),
  description: z.string(),
  priority: z.nativeEnum(TicketPriority),
  status: z.nativeEnum(TicketStatus),
  assignedTo: z.string().uuid().optional(),
  createdAt: z.coerce.date(),
  resolvedAt: z.coerce.date().optional(),
});

export const grandOpeningSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  unitId: z.string().uuid(),
  openingDate: z.coerce.date(),
  rampUpComplete: z.boolean(),
  weeklyTargets: z.array(z.object({
    week: z.number(),
    targetSales: z.number(),
    actualSales: z.number().optional(),
  })),
});

export const remodelingSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  unitId: z.string().uuid(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  budget: z.number(),
  actualCost: z.number().optional(),
  completed: z.boolean(),
});

// Types
export type UnitPerformance = z.infer<typeof unitPerformanceSchema>;
export type ComplianceAudit = z.infer<typeof complianceAuditSchema>;
export type SupportTicket = z.infer<typeof supportTicketSchema>;
export type GrandOpening = z.infer<typeof grandOpeningSchema>;
export type Remodeling = z.infer<typeof remodelingSchema>;

export interface OperationsMetrics {
  totalUnits: number;
  averageSales: number;
  sameStoreSalesGrowth: number;
  averageBrandScore: number;
  openTickets: number;
  unitsInRemodel: number;
}

export interface PerformanceAnalysis {
  topPerformers: string[];
  underPerformers: string[];
  systemAverage: number;
  outlierCount: number;
}
