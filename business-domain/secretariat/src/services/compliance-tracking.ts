/**
 * Compliance Tracking Service
 * Handles regulatory compliance, filing deadlines, and statutory submissions
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

// ============================================================================
// Interfaces
// ============================================================================

export interface StatutoryFiling {
  filingId: string;
  filingType: 'ANNUAL_RETURN' | 'FINANCIAL_STATEMENTS' | 'DIRECTOR_APPOINTMENT' | 
              'SHARE_ALLOTMENT' | 'REGISTERED_OFFICE_CHANGE' | 'NAME_CHANGE' | 'OTHER';
  
  jurisdiction: string;
  authority: string;
  
  // Timing
  dueDate: Date;
  filingDate?: Date;
  
  // Content
  description: string;
  relatedDocuments: string[];
  
  // Submission
  filingReference?: string;
  submittedBy?: string;
  
  // Fee
  filingFee: number;
  feePaid: boolean;
  paymentDate?: Date;
  
  status: 'PENDING' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED' | 'OVERDUE';
}

export interface ComplianceCalendar {
  calendarId: string;
  year: number;
  
  // Deadlines
  deadlines: ComplianceDeadline[];
  
  // Summary
  totalDeadlines: number;
  completedDeadlines: number;
  upcomingDeadlines: number;
  overdueDeadlines: number;
}

export interface ComplianceDeadline {
  deadlineId: string;
  
  // Classification
  category: 'FILING' | 'MEETING' | 'REPORT' | 'RENEWAL' | 'PAYMENT';
  description: string;
  
  // Timing
  dueDate: Date;
  reminderDate: Date;
  
  // Ownership
  responsibleParty: string;
  
  // Status
  completed: boolean;
  completionDate?: Date;
  
  notes?: string;
}

// ============================================================================
// Database Operations
// ============================================================================

export async function submitStatutoryFiling(
  _db: NeonHttpDatabase,
  _orgId: string,
  _filing: Omit<StatutoryFiling, 'filingId'>
): Promise<StatutoryFiling> {
  // TODO: Submit statutory filing
  throw new Error('Database integration pending');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function identifyUpcomingDeadlines(
  deadlines: ComplianceDeadline[],
  daysAhead: number = 30
): ComplianceDeadline[] {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);
  
  return deadlines
    .filter(d => !d.completed)
    .filter(d => d.dueDate >= today && d.dueDate <= futureDate)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

export function identifyOverdueItems(
  deadlines: ComplianceDeadline[]
): ComplianceDeadline[] {
  const today = new Date();
  
  return deadlines
    .filter(d => !d.completed)
    .filter(d => d.dueDate < today)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}
