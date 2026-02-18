/**
 * Filing Management Service
 * 
 * Manage SEC filings lifecycle from draft to submission
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import { filingSchema, FilingType, FilingStatus } from '../types/common.js';
import type { Filing, FilingWorkflow, FilingCalendar } from '../types/common.js';

// ── Schemas ────────────────────────────────────────────────────────

export const createFilingSchema = filingSchema.omit({ id: true, createdAt: true, updatedAt: true });

export const updateFilingSchema = filingSchema.partial().omit({ id: true, orgId: true, createdAt: true });

// ── Types ──────────────────────────────────────────────────────────

export type CreateFilingInput = z.infer<typeof createFilingSchema>;
export type UpdateFilingInput = z.infer<typeof updateFilingSchema>;

// ── Functions ──────────────────────────────────────────────────────

/**
 * Create a new SEC filing
 */
export async function createFiling(
  db: NeonHttpDatabase,
  orgId: string,
  input: CreateFilingInput,
): Promise<Filing> {
  const validated = createFilingSchema.parse(input);

  // TODO: Implement database logic
  // 1. Validate filing type and period
  // 2. Create filing record
  // 3. Initialize checklist items
  // 4. Create section templates
  // 5. Return filing

  throw new Error('Not implemented');
}

/**
 * Get filing by ID with complete workflow
 */
export async function getFiling Workflow(
  db: NeonHttpDatabase,
  orgId: string,
  filingId: string,
): Promise<FilingWorkflow> {
  // TODO: Implement database query
  // 1. Get filing
  // 2. Get all sections
  // 3. Get XBRL tags
  // 4. Get checklist
  // 5. Calculate progress
  // 6. Return workflow

  throw new Error('Not implemented');
}

/**
 * Update filing status
 */
export async function updateFilingStatus(
  db: NeonHttpDatabase,
  orgId: string,
  filingId: string,
  status: FilingStatus,
): Promise<Filing> {
  // TODO: Implement database logic
  // 1. Validate status transition
  // 2. Validate filing is complete (if moving to SUBMITTED)
  // 3. Update status
  // 4. Set timestamp fields
  // 5. Return updated filing

  throw new Error('Not implemented');
}

/**
 * Submit filing to EDGAR
 */
export async function submitFilingToEDGAR(
  db: NeonHttpDatabase,
  orgId: string,
  filingId: string,
): Promise<{
  filing: Filing;
  submissionResult: {
    accessionNumber: string;
    submittedDate: Date;
    confirmationUrl: string;
  };
}> {
  // TODO: Implement EDGAR submission logic
  // 1. Validate filing is complete
  // 2. Generate EDGAR XML
  // 3. Submit to SEC via EDGAR API
  // 4. Update filing with accession number
  // 5. Return result

  throw new Error('Not implemented');
}

/**
 * Get filing calendar for fiscal year
 */
export async function getFilingCalendar(
  db: NeonHttpDatabase,
  orgId: string,
  fiscalYear: number,
): Promise<FilingCalendar> {
  // TODO: Implement calendar generation
  // 1. Get company fiscal year end
  // 2. Calculate deadlines for all required filings
  // 3. Get existing filings for the year
  // 4. Determine status of each deadline
  // 5. Return calendar

  throw new Error('Not implemented');
}

/**
 * Get all filings for a period
 */
export async function getFilings(
  db: NeonHttpDatabase,
  orgId: string,
  filters?: {
    filingType?: FilingType;
    fiscalYear?: number;
    status?: FilingStatus;
  },
): Promise<Filing[]> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Calculate filing due dates based on fiscal year end
 */
export function calculateFilingDueDates(
  fiscalYearEndDate: Date,
  filingType: FilingType,
): Date {
  const fyEnd = new Date(fiscalYearEndDate);

  switch (filingType) {
    case FilingType.FORM_10K:
      // Large accelerated filer: 60 days, Accelerated: 75 days, Others: 90 days
      // Default to 60 days
      return addDays(fyEnd, 60);

    case FilingType.FORM_10Q:
      // 40 days for large accelerated and accelerated filers, 45 days for others
      return addDays(fyEnd, 40);

    case FilingType.PROXY_DEF14A:
      // 120 days after fiscal year end
      return addDays(fyEnd, 120);

    case FilingType.FORM_8K:
      // 4 business days after event
      return addBusinessDays(new Date(), 4);

    default:
      // Default to 30 days
      return addDays(fyEnd, 30);
  }
}

/**
 * Add days to date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add business days to date (excluding weekends)
 */
export function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let addedDays = 0;

  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Not Sunday (0) or Saturday (6)
      addedDays++;
    }
  }

  return result;
}

/**
 * Validate status transition is allowed
 */
export function isValidStatusTransition(
  currentStatus: FilingStatus,
  newStatus: FilingStatus,
): boolean {
  const validTransitions: Record<FilingStatus, FilingStatus[]> = {
    [FilingStatus.DRAFT]: [FilingStatus.IN_REVIEW],
    [FilingStatus.IN_REVIEW]: [FilingStatus.DRAFT, FilingStatus.APPROVED],
    [FilingStatus.APPROVED]: [FilingStatus.IN_REVIEW, FilingStatus.SUBMITTED],
    [FilingStatus.SUBMITTED]: [FilingStatus.ACCEPTED, FilingStatus.REJECTED],
    [FilingStatus.ACCEPTED]: [],
    [FilingStatus.REJECTED]: [FilingStatus.DRAFT],
  };

  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
}

