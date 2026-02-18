import { z } from 'zod';

// Enums
export enum CandidateStage {
  LEAD = 'LEAD',
  QUALIFIED = 'QUALIFIED',
  APPROVED = 'APPROVED',
  SIGNED = 'SIGNED',
  REJECTED = 'REJECTED',
}

export enum TerritoryStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  DEVELOPED = 'DEVELOPED',
  CLOSED = 'CLOSED',
}

export enum DevelopmentStage {
  SITE_SELECTION = 'SITE_SELECTION',
  LEASE_NEGOTIATION = 'LEASE_NEGOTIATION',
  CONSTRUCTION = 'CONSTRUCTION',
  PRE_OPENING = 'PRE_OPENING',
  OPEN = 'OPEN',
}

export enum SiteStatus {
  PROPOSED = 'PROPOSED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  UNDER_CONSTRUCTION = 'UNDER_CONSTRUCTION',
}

// Schemas
export const territorySchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  name: z.string(),
  status: z.nativeEnum(TerritoryStatus),
  exclusivityRadius: z.number().positive(),
  population: z.number().optional(),
  demographics: z.record(z.unknown()).optional(),
  assignedCandidateId: z.string().uuid().optional(),
  createdAt: z.coerce.date(),
});

export const candidateSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  stage: z.nativeEnum(CandidateStage),
  netWorth: z.number().optional(),
  liquidCapital: z.number().optional(),
  experience: z.string().optional(),
  qualificationScore: z.number().min(0).max(100).optional(),
  territoryId: z.string().uuid().optional(),
  createdAt: z.coerce.date(),
});

export const developmentAgreementSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  candidateId: z.string().uuid(),
  unitsCommitted: z.number().positive(),
  developmentFee: z.number().positive(),
  developmentSchedule: z.array(z.object({
    unitNumber: z.number(),
    targetOpenDate: z.coerce.date(),
  })),
  signedDate: z.coerce.date(),
  expiryDate: z.coerce.date().optional(),
});

export const siteSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  candidateId: z.string().uuid(),
  territoryId: z.string().uuid(),
  address: z.string(),
  status: z.nativeEnum(SiteStatus),
  marketScore: z.number().min(0).max(100).optional(),
  approvalDate: z.coerce.date().optional(),
  createdAt: z.coerce.date(),
});

export const openingChecklistSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  siteId: z.string().uuid(),
  stage: z.nativeEnum(DevelopmentStage),
  milestones: z.array(z.object({
    name: z.string(),
    completed: z.boolean(),
    completedDate: z.coerce.date().optional(),
  })),
  scheduledOpenDate: z.coerce.date(),
  actualOpenDate: z.coerce.date().optional(),
});

// Types
export type Territory = z.infer<typeof territorySchema>;
export type Candidate = z.infer<typeof candidateSchema>;
export type DevelopmentAgreement = z.infer<typeof developmentAgreementSchema>;
export type Site = z.infer<typeof siteSchema>;
export type OpeningChecklist = z.infer<typeof openingChecklistSchema>;

export interface TerritoryAnalysis {
  territoryId: string;
  coverage: number;
  population: number;
  competition: number;
  recommended: boolean;
}

export interface PipelineMetrics {
  totalLeads: number;
  qualified: number;
  approved: number;
  signed: number;
  conversionRate: number;
  averageDaysToSign: number;
}

export interface DevelopmentMetrics {
  unitsInPipeline: number;
  averageDaysToOpen: number;
  onTimeOpenRate: number;
  territoryCoverage: number;
}
