/**
 * SEC Reporting Types
 * 
 * Type definitions for SEC filing and regulatory reporting
 */

import { z } from 'zod';

// ── Enums ──────────────────────────────────────────────────────────

export enum FilingType {
  FORM_10K = 'FORM_10K', // Annual report
  FORM_10Q = 'FORM_10Q', // Quarterly report
  FORM_8K = 'FORM_8K', // Current report (material events)
  FORM_S1 = 'FORM_S1', // IPO registration
  FORM_S3 = 'FORM_S3', // Simplified registration
  PROXY_DEF14A = 'PROXY_DEF14A', // Proxy statement
  FORM_3 = 'FORM_3', // Initial insider ownership
  FORM_4 = 'FORM_4', // Changes in beneficial ownership
  FORM_5 = 'FORM_5', // Annual insider trading
  FORM_SC_13G = 'FORM_SC_13G', // Beneficial ownership >5%
  FORM_SC_13D = 'FORM_SC_13D', // Beneficial ownership >5% active
}

export enum FilingStatus {
  DRAFT = 'DRAFT',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  SUBMITTED = 'SUBMITTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum XBRLElementType {
  MONETARY = 'MONETARY',
  SHARES = 'SHARES',
  PURE = 'PURE', // Ratios, percentages
  TEXT = 'TEXT',
  DATE = 'DATE',
}

export enum SECSection {
  BUSINESS = 'BUSINESS',
  RISK_FACTORS = 'RISK_FACTORS',
  FINANCIAL_DATA = 'FINANCIAL_DATA',
  MD_AND_A = 'MD_AND_A',
  FINANCIAL_STATEMENTS = 'FINANCIAL_STATEMENTS',
  CONTROLS_AND_PROCEDURES = 'CONTROLS_AND_PROCEDURES',
  LEGAL_PROCEEDINGS = 'LEGAL_PROCEEDINGS',
  MARKET_FOR_EQUITY = 'MARKET_FOR_EQUITY',
}

// ── Schemas ────────────────────────────────────────────────────────

export const filingSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  filingType: z.nativeEnum(FilingType),
  fiscalPeriod: z.string(), // e.g., "Q1 2024", "FY 2023"
  fiscalYear: z.number().int(),
  status: z.nativeEnum(FilingStatus),
  dueDate: z.coerce.date(),
  submittedDate: z.coerce.date().optional(),
  acceptedDate: z.coerce.date().optional(),
  accessionNumber: z.string().optional(), // EDGAR accession number
  cikNumber: z.string().optional(), // Central Index Key
  documentUrl: z.string().url().optional(),
  xbrlInstanceUrl: z.string().url().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const xbrlTaggingSchema = z.object({
  id: z.string().uuid(),
  filingId: z.string().uuid(),
  elementName: z.string(), // GAAP taxonomy element
  contextRef: z.string(), // Time period context
  unitRef: z.string().optional(), // USD, shares, etc.
  decimals: z.number().int().optional(),
  value: z.union([z.string(), z.number()]),
  elementType: z.nativeEnum(XBRLElementType),
});

export const sectionContentSchema = z.object({
  id: z.string().uuid(),
  filingId: z.string().uuid(),
  section: z.nativeEnum(SECSection),
  content: z.string(),
  version: z.number().int().default(1),
  lastModifiedBy: z.string(),
  lastModifiedAt: z.coerce.date(),
});

export const complianceChecklistSchema = z.object({
  id: z.string().uuid(),
  filingId: z.string().uuid(),
  checklistItem: z.string(),
  isCompleted: z.boolean().default(false),
  completedBy: z.string().optional(),
  completedAt: z.coerce.date().optional(),
  notes: z.string().optional(),
});

// ── Types ──────────────────────────────────────────────────────────

export type Filing = z.infer<typeof filingSchema>;
export type XBRLTagging = z.infer<typeof xbrlTaggingSchema>;
export type SectionContent = z.infer<typeof sectionContentSchema>;
export type ComplianceChecklist = z.infer<typeof complianceChecklistSchema>;

export interface FilingWorkflow {
  filing: Filing;
  sections: SectionContent[];
  xbrlTags: XBRLTagging[];
  checklist: ComplianceChecklist[];
  progress: {
    totalSections: number;
    completedSections: number;
    totalChecklist: number;
    completedChecklist: number;
    percentComplete: number;
  };
}

export interface FilingCalendar {
  fiscalYear: number;
  deadlines: Array<{
    filingType: FilingType;
    fiscalPeriod: string;
    dueDate: Date;
    status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  }>;
}
