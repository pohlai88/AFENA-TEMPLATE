/**
 * External Audit Management Types
 * 
 * Type definitions for external audit coordination and SOX compliance
 */

import { z } from 'zod';

// ── Enums ──────────────────────────────────────────────────────────

export enum AuditStatus {
  PLANNING = 'PLANNING',
  FIELDWORK = 'FIELDWORK',
  REVIEW = 'REVIEW',
  REPORTING = 'REPORTING',
  COMPLETED = 'COMPLETED',
}

export enum AuditType {
  ANNUAL_FINANCIAL = 'ANNUAL_FINANCIAL', // Year-end audit
  QUARTERLY_REVIEW = 'QUARTERLY_REVIEW', // Q1-Q3 reviews
  SOX_404 = 'SOX_404', // Internal controls audit
  SPECIAL_PURPOSE = 'SPECIAL_PURPOSE', // M&A, carve-out, etc.
}

export enum PBCStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum ConfirmationType {
  CASH = 'CASH',
  ACCOUNTS_RECEIVABLE = 'ACCOUNTS_RECEIVABLE',
  ACCOUNTS_PAYABLE = 'ACCOUNTS_PAYABLE',
  DEBT = 'DEBT',
  LEGAL = 'LEGAL',
}

export enum DeficiencyLevel {
  CONTROL_DEFICIENCY = 'CONTROL_DEFICIENCY',
  SIGNIFICANT_DEFICIENCY = 'SIGNIFICANT_DEFICIENCY',
  MATERIAL_WEAKNESS = 'MATERIAL_WEAKNESS',
}

// ── Schemas ────────────────────────────────────────────────────────

export const auditEngagementSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  auditType: z.nativeEnum(AuditType),
  fiscalYear: z.number().int(),
  fiscalPeriod: z.string().optional(), // For quarterly reviews
  auditorFirm: z.string(),
  engagementPartner: z.string(),
  status: z.nativeEnum(AuditStatus),
  planningDate: z.coerce.date().optional(),
  fieldworkStartDate: z.coerce.date().optional(),
  fieldworkEndDate: z.coerce.date().optional(),
  reportDate: z.coerce.date().optional(),
  opinionType: z.enum(['UNQUALIFIED', 'QUALIFIED', 'ADVERSE', 'DISCLAIMER']).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const pbcRequestSchema = z.object({
  id: z.string().uuid(),
  auditEngagementId: z.string().uuid(),
  requestNumber: z.string(),
  title: z.string(),
  description: z.string(),
  requestedBy: z.string(),
  assignedTo: z.string().optional(),
  dueDate: z.coerce.date(),
  status: z.nativeEnum(PBCStatus),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  documentUrl: z.string().url().optional(),
  submittedDate: z.coerce.date().optional(),
  notes: z.string().optional(),
});

export const confirmationSchema = z.object({
  id: z.string().uuid(),
  auditEngagementId: z.string().uuid(),
  confirmationType: z.nativeEnum(ConfirmationType),
  counterparty: z.string(),
  accountBalance: z.number(),
  sentDate: z.coerce.date().optional(),
  responseDate: z.coerce.date().optional(),
  isMatched: z.boolean().default(false),
  variance: z.number().optional(),
  varianceExplanation: z.string().optional(),
  status: z.enum(['PENDING', 'SENT', 'RECEIVED', 'RESOLVED']),
});

export const auditAdjustmentSchema = z.object({
  id: z.string().uuid(),
  auditEngagementId: z.string().uuid(),
  adjustmentNumber: z.string(),
  description: z.string(),
  accountAffected: z.string(),
  debitAmount: z.number().default(0),
  creditAmount: z.number().default(0),
  isPosted: z.boolean().default(false),
  proposedBy: z.string(), // Auditor name
  approvedBy: z.string().optional(),
  approvedDate: z.coerce.date().optional(),
  justification: z.string(),
});

export const controlDeficiencySchema = z.object({
  id: z.string().uuid(),
  auditEngagementId: z.string().uuid(),
  deficiencyLevel: z.nativeEnum(DeficiencyLevel),
  controlId: z.string().optional(),
  description: z.string(),
  impact: z.string(),
  rootCause: z.string().optional(),
  remediationPlan: z.string().optional(),
  responsibleParty: z.string().optional(),
  targetRemediationDate: z.coerce.date().optional(),
  status: z.enum(['OPEN', 'IN_REMEDIATION', 'REMEDIATED', 'ACCEPTED_RISK']),
  identifiedDate: z.coerce.date(),
});

// ── Types ──────────────────────────────────────────────────────────

export type AuditEngagement = z.infer<typeof auditEngagementSchema>;
export type PBCRequest = z.infer<typeof pbcRequestSchema>;
export type Confirmation = z.infer<typeof confirmationSchema>;
export type AuditAdjustment = z.infer<typeof auditAdjustmentSchema>;
export type ControlDeficiency = z.infer<typeof controlDeficiencySchema>;

export interface AuditDashboard {
  engagement: AuditEngagement;
  pbcSummary: {
    total: number;
    notStarted: number;
    inProgress: number;
    submitted: number;
    accepted: number;
    overdue: number;
  };
  confirmationSummary: {
    total: number;
    pending: number;
    sent: number;
    received: number;
    matched: number;
    exceptions: number;
  };
  adjustmentSummary: {
    total: number;
    proposed: number;
    approved: number;
    posted: number;
    totalImpact: number;
  };
  deficiencySummary: {
    materialWeaknesses: number;
    significantDeficiencies: number;
    controlDeficiencies: number;
    remediatedCount: number;
  };
}
