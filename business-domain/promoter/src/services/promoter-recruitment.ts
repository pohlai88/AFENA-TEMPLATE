/**
 * Promoter Recruitment Service
 * Manages promoter hiring, onboarding, and qualifications
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

// ============================================================================
// Interfaces
// ============================================================================

export interface Promoter {
  promoterId: string;
  promoterCode: string;
  
  // Personal details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Classification
  promoterType: 'BRAND_AMBASSADOR' | 'EVENT_STAFF' | 'DEMONSTRATOR' | 'MERCHANDISER' | 'FIELD_REP';
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY';
  
  // Skills & certifications
  skills: string[];
  certifications: string[];
  languages: string[];
  
  // Availability
  availableDays: number[]; // 0-6 (Sunday-Saturday)
  maxHoursPerWeek: number;
  travelWillingness: 'LOCAL' | 'REGIONAL' | 'NATIONAL';
  
  // Performance
  eventsCompleted: number;
  avgRating: number;
  punctualityScore: number;
  
  // Compensation
  hourlyRate: number;
  reimbursementEligible: boolean;
  
  // Onboarding
  onboardingComplete: boolean;
  onboardingDate?: Date;
  trainingCompleted: string[];
  
  // Geography
  primaryTerritory: string;
  willingToTravel: boolean;
  
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
}

export interface FieldSupervisor {
  supervisorId: string;
  
  name: string;
  email: string;
  phone: string;
  
  // Territory
  territories: string[];
  promotersManaged: string[];
  
  // Responsibilities
  canApproveReports: boolean;
  canScheduleEvents: boolean;
  canHirePromoters: boolean;
  
  status: 'ACTIVE' | 'INACTIVE';
}

// ============================================================================
// Database Operations
// ============================================================================

export async function registerPromoter(
  _db: NeonHttpDatabase,
  _orgId: string,
  _promoter: Omit<Promoter, 'promoterId' | 'promoterCode' | 'eventsCompleted' | 'avgRating' | 'punctualityScore'>
): Promise<Promoter> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function generatePromoterCode(): string {
  const prefix = 'PM';
  const sequence = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `${prefix}${sequence}`;
}
